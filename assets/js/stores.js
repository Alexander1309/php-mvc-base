document.addEventListener("DOMContentLoaded", function () {
  const postalCodeInput = document.getElementById("postal_code");
  const cologneSelect = document.getElementById("cologne");
  const cityInput = document.getElementById("city");

  // Depuración: Confirmar que los elementos se encuentran
  if (!postalCodeInput || !cologneSelect || !cityInput) {
    console.error("No se encontraron los elementos: postal_code, cologne o city");
    return;
  }

  postalCodeInput.addEventListener("input", async function () {
    const postalCode = postalCodeInput.value.trim();
    console.log("Código postal ingresado:", postalCode);

    if (postalCode.length === 5) {
      try {
        console.log("Haciendo solicitud a /stores/getPostal_Code/", postalCode);
        const response = await fetch(`/stores/getPostal_Code/${postalCode}`);

        if (!response.ok) {
          throw new Error("Postal code not found");
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);

        if (data.length > 0) {
          cityInput.value = data[0].city || "";
          console.log("Ciudad llenada:", cityInput.value);

          cologneSelect.innerHTML = "";
          if (data.length === 1) {
            cologneSelect.innerHTML = `<option value="${data[0].colony}" selected>${data[0].colony}</option>`;
          } else {
            data.forEach((entry) => {
              let option = document.createElement("option");
              option.value = entry.colony;
              option.textContent = entry.colony;
              cologneSelect.appendChild(option);
            });
          }

          cologneSelect.classList.remove("hidden");
          console.log("Colonia llenada:", cologneSelect.innerHTML);
        } else {
          throw new Error("No data found for this postal code.");
        }
      } catch (error) {
        console.error("Error fetching postal code data:", error);
        clearFields();
      }
    } else {
      clearFields();
    }
  });

  function clearFields() {
    // Solo limpiamos los valores, pero no deshabilitamos los campos
    cityInput.value = "";
    cologneSelect.innerHTML = "";
    cologneSelect.classList.add("hidden");
  }
});