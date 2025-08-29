<?php
session_start();

require_once 'settings/init.php';
require_once 'libs/db.php';
require_once 'libs/controller.php';
require_once 'libs/model.php';
require_once 'libs/view.php';
require_once 'libs/app.php';
require_once 'libs/logger.php';


$app = new App();
