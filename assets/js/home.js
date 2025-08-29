document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#kitForm");
  const tableBody = document.querySelector("#tableBody");
  const input_articles = document.querySelector("#articles");
  const searchInput = document.getElementById("search");
  const suggestionsList = document.getElementById("suggestions");

  let dataTable;
  let articles_data = [];

  if (typeof DataTable !== "undefined") {
    let table = document.querySelector("#table");

    if (!table.classList.contains("dataTable")) {
      let config = {
        language: {
          emptyTable: "No hay artículos",
        },
        paging: false,
        searching: false,
        info: false,
        scrollY: "300px",
        scrollCollapse: true,
        responsive: true,
      };

      dataTable = new DataTable(table, config);
    } else {
      dataTable = new DataTable(table);
    }
  }

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const firstSuggestion = suggestionsList.querySelector("li:first-child");
      if (firstSuggestion) {
        const article = JSON.parse(firstSuggestion.dataset.article);
        insertArticleRow(article, 1);
        suggestionsList.style.display = "none";
      } else if (tableBody.querySelectorAll("tr[data-id]").length === 0) {
        alert("Por favor, agregue al menos un artículo al kit.");
      }
    }
  });

  const updateIndexes = () => {
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach((row, index) => {
      const indexCell = row.querySelector(".id-cell");
      if (indexCell) {
        indexCell.textContent = index + 1;
      }
    });
  };

  const updateTotals = () => {
    let subtotal = 0;
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(row => {
      const priceSelect = row.querySelector(".price-select");
      const quantityInput = row.querySelector(".quantity");
      if (priceSelect && quantityInput) {
        const price = parseFloat(priceSelect.value) || 0;
        const quantity = parseInt(quantityInput.value) || 0;
        subtotal += price * quantity;
      }
    });

    const ivaRate = 0.16;
    const ivaAmount = subtotal * ivaRate;
    const total = subtotal + ivaAmount;

    document.getElementById("subtotal").textContent = "$" + subtotal.toFixed(2);
    document.getElementById("iva").value = ivaAmount.toFixed(2);
    document.getElementById("total").textContent = "$" + total.toFixed(2);
  };

  const insertArticleRow = (article, index) => {
    if (!dataTable) {
      alert("Por el momento no se puede crear un kit");
      return;
    }

    if (tableBody.querySelector(`tr[data-id="${article.id}"]`)) {
      alert("Este artículo ya está en la tabla.");
      return;
    }

    const row = document.createElement("tr");
    row.setAttribute("data-id", article.id);
    row.setAttribute("data-type", article.type);
    row.classList.add(index % 2 > 0 ? "table-light" : "table-primary");

    row.innerHTML = `
      <td scope="row" class="id-cell"></td>
      <td>${article.code}</td>
      <td>${article.name}</td>
      <td>${article.description}</td>
      <td>
        <select class="form-control price-select"></select>
      </td>
      <td>${article.brand_name || "Cel One"}</td>
      <td>
        <div class="input-group" style="width: 120px;">
          <button class="btn btn-outline-secondary btn-decrement" type="button">-</button>
          <input type="number" class="form-control text-center quantity" value="1" min="0" step="1" max="${article.stock || 1}" aria-label="Cantidad">
          <button class="btn btn-outline-secondary btn-increment" type="button">+</button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
    dataTable.row.add(row).draw(false);

    const priceSelect = row.querySelector('.price-select');

    let priceOptions = [];
    if (article.type === 'article') {
      priceOptions = [
        article.price,
        article.price2,
        article.price3,
        article.price4,
        article.price5
      ].filter(price => price !== null && price !== undefined && price !== "");
    } else if (article.type === 'kit') {
      priceOptions = [article.price];
    }

    priceOptions.forEach((price, i) => {
      const option = document.createElement('option');
      option.value = price;
      option.textContent = `${i + 1} - $${parseFloat(price).toFixed(2)}`;
      if (i === 0) option.selected = true;
      priceSelect.appendChild(option);
    });
    
    priceSelect.addEventListener("change", updateTotals);
    row.querySelector(".quantity").addEventListener("input", updateTotals);

    updateIndexes();
    updateTotals();
    searchInput.value = "";
    searchInput.focus();
  };

  searchInput.addEventListener("input", async () => {
    let query = searchInput.value.trim();
    if (query.length < 2) {
      suggestionsList.style.display = "none";
      return;
    }

    try {
      let response = await fetch(`/home/searchArticlesAndKits/${query}`);
      let articles = await response.json();

      suggestionsList.innerHTML = "";
      if (articles.length === 0) {
        suggestionsList.style.display = "none";
        return;
      }

      articles.forEach((article, index) => {
        let li = document.createElement("li");
        li.classList.add("list-group-item", "list-group-item-action");
        li.textContent = `${article.name} (${article.brand_name || article.description})`;
        li.dataset.article = JSON.stringify(article);
        li.addEventListener("click", function () {
          insertArticleRow(article, index + 1);
          suggestionsList.style.display = "none";
          searchInput.value = "";
        });
        suggestionsList.appendChild(li);
      });

      suggestionsList.style.display = "block";
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  });

  tableBody.addEventListener("click", (event) => {
    const row = event.target.closest("tr");
    if (!row) return;

    if (event.target.classList.contains("btn-decrement")) {
      let input = row.querySelector(".quantity");
      let value = parseInt(input.value) - 1;

      if (value > 0) {
        input.value = value;
        updateTotals();
        return;
      }

      dataTable.row(row).remove().draw(false);
      updateIndexes();
      updateTotals();
    }

    if (event.target.classList.contains("btn-increment")) {
      let input = row.querySelector(".quantity");
      let value = parseInt(input.value) + 1;
      if (value <= parseInt(input.getAttribute("max"))) {
        input.value = value;
        updateTotals();
      }
    }
  });

  form.addEventListener("submit", (event) => {
    articles_data = [];
    const articles = Array.from(tableBody.querySelectorAll("tr")).filter(
      (article) => article.hasAttribute("data-id")
    );
    if (articles.length === 0) {
      event.preventDefault();
      alert("Por favor, agregue al menos un artículo al kit.");
      return;
    }

    articles.forEach((article) => {
      const id_article = article.getAttribute("data-id");
      const quantity = article.querySelector(".quantity").value;

      if (id_article && quantity > 0)
        articles_data.push([id_article, quantity]);
    });

    if (articles_data.length === 0) {
      event.preventDefault();
      alert("Por favor, agregue al menos un artículo al kit.");
      return;
    }

    input_articles.value = JSON.stringify(articles_data);
  });
});
