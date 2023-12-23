let records = JSON.parse(localStorage.getItem('productionRecords')) || [];
let recordNumber = 1;

function addProductionRecord() {
    const productName = document.getElementById('product-name').value;
    const quantity = document.getElementById('quantity').value;
    const productionDate = document.getElementById('production-date').value;

    const recordsList = document.getElementById('records-list');

    const listItem = document.createElement('li');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Видалити';
    deleteButton.onclick = () => deleteProductionRecord(records.length);

    listItem.innerHTML = `<strong class="product-name" data-index="${records.length}" onclick="toggleProductDetails(${records.length})">Назва продукта: ${productName}, Кількість: ${quantity}, Дата: ${productionDate}</strong>`;
    listItem.appendChild(deleteButton);

    const detailsList = document.createElement('ul');
    detailsList.classList.add('details-list');
    listItem.appendChild(detailsList);
    recordsList.appendChild(listItem);

    const productDetails = {
        productName: productName,
        quantity: quantity,
        productionDate: productionDate,
        recordNumber: recordNumber,
        subProductNumbers: [],
    };
    records.push(productDetails);
    saveToLocalStorage();

    recordNumber++;
}

function toggleProductDetails(index) {
    const listItem = document.querySelector(`.product-name[data-index="${index}"]`);
    let detailsList = listItem.querySelector('.details-list');
    if (!detailsList) {
        detailsList = document.createElement('ul');
        detailsList.classList.add('details-list');
        listItem.appendChild(detailsList);
    }

    const details = records[index];
    if (details) {
        if (details.isOpen) {
            detailsList.innerHTML = '';
        } else {
            detailsList.innerHTML = '';
            const currentTime = new Date().getTime();
            const subProductItems = Array.from({ length: details.quantity }, (_, i) => {
                const subProductNumber = currentTime + i;
                details.subProductNumbers.push(subProductNumber);
                return `<li>${i + 1}. ${details.productName} - SubProduct: ${subProductNumber}</li>`;
            });
            detailsList.innerHTML = subProductItems.join('');
        }

        details.isOpen = !details.isOpen;
        const deleteButton = listItem.querySelector('button');
        deleteButton.style.display = details.isOpen ? 'none' : 'block';
    }
}

function deleteProductionRecord(index) {
    const listItem = document.querySelector(`.product-name[data-index="${index}"]`);
    if (listItem) {
        listItem.remove();

        // Видалення кнопки "Видалити" зі списку записів
        const deleteButton = listItem.querySelector('button');
        if (deleteButton) {
            deleteButton.remove();
        }

        records.splice(index, 1);
        saveToLocalStorage();
    }
}



function saveToLocalStorage() {
    localStorage.setItem('productionRecords', JSON.stringify(records));
}

// Завантаження записів з локального сховища при завантаженні сторінки
window.onload = function () {
    // ...
    // Завантаження інших елементів і коду, якщо потрібно
    // ...

    // Завантаження записів
    if (localStorage.getItem('productionRecords')) {
        records = JSON.parse(localStorage.getItem('productionRecords'));

        // Відображення записів при завантаженні сторінки
        records.forEach((record, index) => {
            const recordsList = document.getElementById('records-list');

            const listItem = document.createElement('li');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Видалити';
            deleteButton.onclick = () => deleteProductionRecord(index);

            listItem.innerHTML = `<strong class="product-name" data-index="${index}" onclick="toggleProductDetails(${index})">Назва продукта: ${record.productName}, Кількість: ${record.quantity}, Дата: ${record.productionDate}</strong>`;
            listItem.appendChild(deleteButton);

            const detailsList = document.createElement('ul');
            detailsList.classList.add('details-list');
            listItem.appendChild(detailsList);
            recordsList.appendChild(listItem);

            if (record.isOpen) {
                toggleProductDetails(index);
            }
        });
    }
};
