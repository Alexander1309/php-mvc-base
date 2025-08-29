<?php

class ExampleModel extends Model
{
    function __construct()
    {
        parent::__construct();
    }

    function getAllKits()
    {
        try {
            $this->logger->logInfo("Fetching all kits", $_SERVER['REQUEST_URI'], "Get All Kits");

            $query = "SELECT k.id, k.code, k.name, k.description, k.price, SUM(kd.quantity) AS count_articles
                     FROM kits k
                     JOIN kit_details kd ON k.id = kd.kit_id
                     WHERE kd.status = 1
                     GROUP BY k.id";

            $result = $this->pdo->fetchAll($query);

            $this->logger->logInfo("Successfully fetched all kits", $_SERVER['REQUEST_URI'], "Get All Kits");
            return $result;
        } catch (Exception $e) {
            $this->logger->logError($e->getMessage(), $e->getFile(), $e->getLine());
            return null;
        }
    }

    function getKitById($id = null)
    {
        try {
            if ($id == null) throw new Exception("Id is required");
            $this->logger->logInfo("Fetching kit by id", $_SERVER['REQUEST_URI'], "Get Kit By Id");

            $query = "SELECT k.id, k.code, k.name, k.description, k.price, COUNT(DISTINCT kd.article_id) AS count_articles
                     FROM kits k
                     JOIN kit_details kd ON k.id = kd.kit_id
                     WHERE k.id = ? AND k.status = 1 AND kd.status = 1
                     GROUP BY k.id";

            $kit = $this->pdo->fetchOne($query, [$id]);

            if (!$kit) {
                throw new Exception("Kit not found with id: " . $id);
            }

            $detailsQuery = "SELECT kd.id, kd.article_id, kd.quantity, a.code, a.name AS article_name, 
                                   a.description AS article_description, a.price AS article_price, 
                                   b.name AS article_brand
                            FROM kit_details kd 
                            JOIN articles a ON kd.article_id = a.id
                            JOIN brands b ON a.brand_id = b.id
                            WHERE kd.kit_id = ? AND kd.status = 1";

            $kit['details'] = $this->pdo->fetchAll($detailsQuery, [$id]);

            $this->logger->logInfo("Successfully fetched kit by id", $_SERVER['REQUEST_URI'], "Get Kit By Id");
            return $kit;
        } catch (Exception $e) {
            $this->logger->logError($e->getMessage(), $e->getFile(), $e->getLine());
            return null;
        }
    }

    function saveKit($data)
    {
        try {
            if (empty($data['code']) || empty($data['name']) || empty($data['price']) || empty($data['details'])) {
                throw new Exception("Name, price, and details are required");
            }

            $this->logger->logInfo("Saving kit", $_SERVER['REQUEST_URI'], "Save Kit");

            $this->pdo->beginTransaction();

            try {
                $query = "INSERT INTO kits (code, name, description, price) VALUES (?, ?, ?, ?)";
                $this->pdo->execute($query, [
                    $data['code'],
                    $data['name'],
                    $data['description'] ?? null,
                    $data['price']
                ]);

                $kitId = $this->pdo->getLastInsertId();

                $detailsQuery = "INSERT INTO kit_details (kit_id, article_id, quantity) VALUES (?, ?, ?)";
                foreach ($data['details'] as $detail) {
                    if (!empty($detail['article_id']) && !empty($detail['quantity'])) {
                        $this->pdo->execute($detailsQuery, [
                            $kitId,
                            $detail['article_id'],
                            $detail['quantity']
                        ]);
                    }
                }

                $this->pdo->commit();

                $this->logger->logInfo("Successfully saved kit", $_SERVER['REQUEST_URI'], "Save Kit");
                return true;
            } catch (Exception $e) {
                $this->pdo->rollback();
                throw $e;
            }
        } catch (Exception $e) {
            $this->logger->logError($e->getMessage(), $e->getFile(), $e->getLine());
            return false;
        }
    }

    function updateKit($data)
    {
        try {
            if (empty($data['id']) || empty($data['code']) || empty($data['name']) || empty($data['price']) || empty($data['details'])) {
                throw new Exception("Id, name, price, and details are required");
            }

            $this->logger->logInfo("Updating kit", $_SERVER['REQUEST_URI'], "Update Kit");

            $this->pdo->beginTransaction();

            try {
                $query = "UPDATE kits SET code = ?, name = ?, description = ?, price = ? WHERE id = ? AND status = 1";
                $this->pdo->execute($query, [
                    $data['code'],
                    $data['name'],
                    $data['description'] ?? null,
                    $data['price'],
                    $data['id']
                ]);

                $updateQuery = "UPDATE kit_details SET status = 0 WHERE kit_id = ? AND status = 1";
                $this->pdo->execute($updateQuery, [$data['id']]);

                $insertQuery = "INSERT INTO kit_details (kit_id, article_id, quantity) VALUES (?, ?, ?)";
                foreach ($data['details'] as $detail) {
                    if (!empty($detail['article_id']) && !empty($detail['quantity'])) {
                        $this->pdo->execute($insertQuery, [
                            $data['id'],
                            $detail['article_id'],
                            $detail['quantity']
                        ]);
                    }
                }

                $this->pdo->commit();

                $this->logger->logInfo("Successfully updated kit", $_SERVER['REQUEST_URI'], "Update Kit");
                return true;
            } catch (Exception $e) {
                $this->pdo->rollback();
                throw $e;
            }
        } catch (Exception $e) {
            $this->logger->logError($e->getMessage(), $e->getFile(), $e->getLine());
            return false;
        }
    }

    function deleteKit($id = null)
    {
        try {
            if ($id == null) throw new Exception("Id is required");
            $this->logger->logInfo("Deleting kit", $_SERVER['REQUEST_URI'], "Delete Kit");

            $this->pdo->beginTransaction();

            try {
                $query = "UPDATE kits SET deleted_at = NOW(), status = 0 WHERE id = ?";
                $this->pdo->execute($query, [$id]);

                $detailsQuery = "UPDATE kit_details SET status = 0 WHERE kit_id = ?";
                $this->pdo->execute($detailsQuery, [$id]);

                $this->pdo->commit();

                $this->logger->logInfo("Successfully deleted kit", $_SERVER['REQUEST_URI'], "Delete Kit");
                return true;
            } catch (Exception $e) {
                // Revertir transacción en caso de error
                $this->pdo->rollback();
                throw $e;
            }
        } catch (Exception $e) {
            $this->logger->logError($e->getMessage(), $e->getFile(), $e->getLine());
            return false;
        }
    }

    function generateOptions($selectedId = null)
    {
        $kits = $this->getAllKits();
        $html = "";

        if (!empty($kits)) {
            foreach ($kits as $kit) {
                $id = $kit['id'];
                $label = htmlspecialchars($kit['name'], ENT_QUOTES, 'UTF-8');
                $isSelected = ($id == $selectedId) ? "selected" : "";
                $html .= "<option value='$id' $isSelected>$label</option>\n";
            }
        }

        return $html;
    }
}
