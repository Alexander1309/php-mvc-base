setTimeout(() => {
  let alertElement = document.querySelector("#autoDismissAlert");
  if (alertElement) {
    let bsAlert = new bootstrap.Alert(alertElement);
    bsAlert.close();
  }
}, 5000);

// Verifica si el contenedor de la tabla tiene la clase 'btns'
if ($("#table").hasClass("btns-exports")) {
  const configTable = new DataTable("#table", {
    paging: true,
    pagingType: "simple_numbers",
    pageLength: 10,
    scrollCollapse: true,
    scrollY: $("table").data("scroll") || "400px",
    searching: true,
    language: {
      url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
    },
    dom: '<"top-section" <"left"l> <"right"f>>rt<"bottom-section" <"pagination"p> <"buttons"B>>',
    buttons: [
      {
        extend: "copyHtml5",
        text: "📋 Copiar",
        className: "btn btn-outline-secondary btn-sm",
      },
      {
        extend: "csvHtml5",
        text: "📂 CSV",
        className: "btn btn-outline-success btn-sm",
      },
      {
        extend: "excelHtml5",
        text: "📊 Excel",
        className: "btn btn-outline-primary btn-sm",
      },
      {
        extend: "pdfHtml5",
        text: "📄 PDF",
        className: "btn btn-outline-danger btn-sm",
      },
    ],
  });
} else {
  // Si no tiene la clase 'btns', se inicializa la tabla sin los botones
  const configTable = new DataTable("#table", {
    paging: true,
    pagingType: "simple_numbers",
    pageLength: 10,
    scrollCollapse: true,
    scrollY: $("table").data("scroll") || "400px",
    searching: true,
    language: {
      url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
    },
    dom: '<"top-section" <"left"l> <"right"f>>rt<"bottom-section" <"pagination"p>>',
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const topBar = document.querySelector(".top-bar");

  const dtButtons = document.querySelector(".dt-buttons");
  if (dtButtons) {
    const btnContainer = document.createElement("div");
    btnContainer.className = "dt-buttons-container";
    btnContainer.appendChild(dtButtons);
    topBar.prepend(btnContainer);
  }

  const searchBox = document.querySelector(".dataTables_filter");
  if (searchBox) {
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-box-container";
    searchContainer.appendChild(searchBox);
    topBar.appendChild(searchContainer);
  }

  const selects = $(".select-search");
  selects.select2({
    placeholder: "Buscar...",
    allowClear: true,
  });
});

window.addEventListener("load", function () {
  document.getElementById("loader-overlay").style.display = "none";
});
