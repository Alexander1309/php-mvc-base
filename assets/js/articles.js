document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add-price').addEventListener('click', function () {
        const priceGroups = document.querySelectorAll('.price-group');
        const priceCount = priceGroups.length;

        if (priceCount < 5) {
            const container = document.getElementById('prices-container');

            const group = document.createElement('div');
            group.classList.add('price-group', 'd-flex', 'flex-column', 'align-items-start');

            const label = document.createElement('label');
            label.setAttribute('for', 'price' + (priceCount + 1));
            label.classList.add('fw-semibold');
            label.textContent = (priceCount === 0 ? 'Precio :' : 'Precio ' + (priceCount + 1) + ':');

            const inputGroup = document.createElement('div');
            inputGroup.classList.add('input-group');

            const span = document.createElement('span');
            span.classList.add('input-group-text');
            span.textContent = '$';

            const input = document.createElement('input');
            input.type = 'number';
            input.classList.add('form-control');
            input.id = (priceCount === 0 ? 'price' : 'price' + (priceCount + 1));
            input.name = (priceCount === 0 ? 'price' : 'price' + (priceCount + 1)); 
            input.placeholder = (priceCount === 0 ? 'Precio' : 'Precio ' + (priceCount + 1)); 
            input.required = true;

            input.addEventListener('input', function () {
                if (input.value === '') {
                    input.setCustomValidity('Este campo no puede estar vacío.');
                } else {
                    input.setCustomValidity('');
                }
            });

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.classList.add('btn', 'btn-outline-danger');
            removeBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
            removeBtn.style.marginLeft = '5px';
            removeBtn.addEventListener('click', function () {
                group.remove();
                updatePriceLabels();
                updateHiddenPrices();
            });

            inputGroup.appendChild(span);
            inputGroup.appendChild(input);
            inputGroup.appendChild(removeBtn);

            group.appendChild(label);
            group.appendChild(inputGroup);

            container.appendChild(group);

            updatePriceLabels();
            updateHiddenPrices();
        }
    });

    function updatePriceLabels() {
        const priceGroups = document.querySelectorAll('.price-group');
        priceGroups.forEach((group, index) => {
            const label = group.querySelector('label');
            const input = group.querySelector('input');

            const priceIndex = (index === 0 ? '' : index + 1);
            label.innerText = (priceIndex === '' ? 'Precio :' : 'Precio ' + priceIndex + ':');
            label.setAttribute('for', 'price' + priceIndex);
            input.setAttribute('name', 'price' + priceIndex);
            input.setAttribute('id', 'price' + priceIndex);
            input.setAttribute('placeholder', (priceIndex === '' ? 'Precio' : 'Precio ' + priceIndex));
        });
    }

    function updateHiddenPrices() {
        const priceInputs = document.querySelectorAll('#prices-container input[type="number"]');
        const hiddenContainer = document.getElementById('hidden-prices');
        hiddenContainer.innerHTML = '';

        priceInputs.forEach(input => {
            if (input.value.trim() !== '') {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = input.name;
                hiddenInput.value = input.value;
                hiddenContainer.appendChild(hiddenInput);
            }
        });
    }


    document.querySelector('#prices-container').addEventListener('blur', function () {
        const priceInputs = document.querySelectorAll('#prices-container input[type="number"]');
        priceInputs.forEach(input => {
            if (input.value === '') {
                input.setCustomValidity('Este campo no puede estar vacío.');
            } else {
                input.setCustomValidity('');
            }
        });
    }, true);


    document.querySelector('form').addEventListener('submit', function (event) {
        const form = event.target;

        if (!form.checkValidity()) {
            event.preventDefault();
            alert('Por favor, complete todos los campos obligatorios.');
        } else {
            updateHiddenPrices();
        }
    });

    document.querySelectorAll('.copy-prices').forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();
            const articleId = this.getAttribute('data-id');
            const prices = [];

            const priceElements = document.querySelectorAll(`#details-${articleId} .fw-bold`);
            priceElements.forEach(el => {
                prices.push(el.textContent.trim());
            });

            const textToCopy = `Precios:\n- Precio 1: ${prices[0]}\n- Precio 2: ${prices[1]}\n- Precio 3: ${prices[2]}\n- Precio 4: ${prices[3]}\n- Precio 5: ${prices[4]}`;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalInnerHTML = this.innerHTML;
                this.innerHTML = '<i class="bi bi-check"></i>';
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-outline-success');

                setTimeout(() => {
                    this.innerHTML = originalInnerHTML;
                    this.classList.remove('btn-outline-success');
                    this.classList.add('btn-outline-primary');
                }, 2000);
            });
        });
    });

    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(row => {
        row.addEventListener('click', function () {
            const targetId = this.getAttribute('data-bs-target');
            const target = document.querySelector(targetId);
            const iconSpan = this.querySelector('.text-primary');

            if (target.classList.contains('show')) {
                iconSpan.innerHTML = '➕ Expandir';
            } else {
                iconSpan.innerHTML = '➖ Colapsar';
            }
        });
    });
});
