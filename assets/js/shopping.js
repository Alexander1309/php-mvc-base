document.addEventListener("DOMContentLoaded", () => {
  const shoppingForm = document.querySelector("#shoppingForm");
  const tbody = document.querySelector("#tableBody");
  const searchInput = document.getElementById("search");
  const suggestionsList = document.getElementById("suggestions");
  let articles = [];
  let dataTable;

  if (typeof DataTable !== "undefined") {
    let table = document.querySelector("#table");

    if (!table.classList.contains("dataTable")) {
      let config = {
        language: {
          emptyTable: "No hay artículos en el kit",
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

  const updateIndexes = () => {
    const rows = document.querySelectorAll("#tableBody tr");
    rows.forEach((row, index) => {
      const indexCell = row.querySelector(".id-cell");
      if (indexCell) {
        indexCell.textContent = index + 1;
      }

      // Alternar colores como en addTable
      row.classList.remove("table-light", "table-primary");
      row.classList.add(index % 2 === 0 ? "table-light" : "table-primary");
    });
  };

  const insertArticleRow = (article) => {
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

    // Estilo por posición
    const rowCount = tableBody.querySelectorAll("tr").length;
    row.classList.add(rowCount % 2 === 0 ? "table-light" : "table-primary");

    row.innerHTML = `
    <td scope="row" class="id-cell"></td>
    <td>${article.code}</td>
    <td>${article.article_name}</td>
    <td>${article.description}</td>
    <td>${article.brand_name}</td>
    <td>
      <div class="input-group" style="width: 120px;">
        <button class="btn btn-outline-secondary btn-decrement" type="button">-</button>
        <input type="number" class="form-control text-center quantity" value="1" min="0" step="1" aria-label="Cantidad">
        <button class="btn btn-outline-secondary btn-increment" type="button">+</button>
      </div>
    </td>
    <td>$${article.price}</td>
  `;

    tableBody.appendChild(row);
    dataTable.row.add(row).draw(false);
    updateIndexes();
  };

  tableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-decrement")) {
      let input = event.target.nextElementSibling;
      let value = parseInt(input.value) - 1;
      let row = event.target.closest("tr");

      if (value > 0) {
        input.value = value;
        return;
      }

      if (!dataTable) {
        row.remove();
        updateIndexes();
        return;
      }

      dataTable.row(row).remove().draw(false);
      updateIndexes();
    }

    if (event.target.classList.contains("btn-increment")) {
      let input = event.target.previousElementSibling;
      let value = parseInt(input.value) + 1;
      input.value = value;
    }
  });

  shoppingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputs = shoppingForm.querySelectorAll("input.form-control");
    const data = {};

    inputs.forEach((input) => {
      const input_name = input.getAttribute("name");
      const input_value = input.value.trim();
      if (input_value == "") {
        alert("No puede ver campos vacios");
        throw new Error("No puede ver campos vacios");
      }

      data[input_name] = input_value;
      input.value = "";
    });

    articles.push(data);
    addTable(articles);
  });

  searchInput.addEventListener("input", async () => {
    let query = searchInput.value.trim();
    if (query.length < 2) {
      suggestionsList.style.display = "none";
      return;
    }

    try {
      let response = await fetch(`/kits/searchArticles/${query}`);
      let articles = await response.json();

      suggestionsList.innerHTML = "";
      if (articles.length < 0) suggestionsList.style.display = "none";

      articles.forEach((article) => {
        let li = document.createElement("li");
        li.classList.add("list-group-item", "list-group-item-action");
        li.textContent = article.article_name + " (" + article.brand_name + ")";
        li.dataset.article = JSON.stringify(article);
        li.addEventListener("click", function () {
          insertArticleRow(article);
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
});
