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
    row.classList.add("table-light");
    row.innerHTML = `
            <td scope="row" class="id-cell"></td>
            <td>${article.code}</td>
            <td>${article.article_name}</td>
            <td>${article.description}</td>
            <td>$${article.price}</td>
            <td>${article.brand_name}</td>
            <td>
                <div class="input-group" style="width: 120px;">
                    <button class="btn btn-outline-secondary btn-decrement" type="button">-</button>
                    <input type="number" class="form-control text-center quantity" value="1" min="0" step="1" aria-label="Cantidad">
                    <button class="btn btn-outline-secondary btn-increment" type="button">+</button>
                </div>
            </td>
        `;

    tableBody.appendChild(row);
    dataTable.row.add(row).draw(false);
    updateIndexes();
  };

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

  form.addEventListener("submit", (event) => {
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

    if (articles_data.length == 0) {
      event.preventDefault();
      alert("Por favor, agregue al menos un artículo al kit.");
      return;
    }

    input_articles.value = JSON.stringify(articles_data);
  });
});
