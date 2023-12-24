// Отримуємо записи з локального сховища або створюємо новий масив
let records = JSON.parse(localStorage.getItem('productionRecords')) || [];


// Функція для додавання нового запису про виробництво молочної продукції
function addProductionRecord() {
    // Отримуємо значення полів з форми
    const productName = document.getElementById('product-name').value;
    const quantity = document.getElementById('quantity').value;
    const productionDate = document.getElementById('production-date').value;

    // Отримуємо список записів
    const recordsList = document.getElementById('records-list');

    // Створюємо новий елемент списку та кнопку "Видалити"
    const listItem = document.createElement('li');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Видалити';
    deleteButton.onclick = () => deleteProductionRecord(records.length);

    // Заповнюємо інформацію про продукт та додаємо кнопку "Видалити"
    listItem.innerHTML = `<strong class="product-name" data-index="${records.length}" onclick="toggleProductDetails(${records.length})">Назва продукта: ${productName}, Кількість: ${quantity}, Дата: ${productionDate}</strong>`;
    listItem.appendChild(deleteButton);

    // Створюємо список деталей та додаємо його до запису
    const detailsList = document.createElement('ul');
    detailsList.classList.add('details-list');
    listItem.appendChild(detailsList);
    recordsList.appendChild(listItem);

    // Створюємо об'єкт інформації про виробництво для додавання до масиву записів
    const productDetails = {
        productName: productName,
        quantity: quantity,
        productionDate: productionDate,
        recordNumber: recordNumber,
        subProductNumbers: [],
    };
    // Додаємо інформацію до масиву записів та зберігаємо у локальному сховищі
    records.push(productDetails);
    saveToLocalStorage();

    // Збільшуємо порядковий номер для наступних записів
    recordNumber++;
}

// Функція для перемикання деталей про продукт при натисканні
function toggleProductDetails(index) {
    // Отримуємо елемент запису за вказаним індексом
    const listItem = document.querySelector(`.product-name[data-index="${index}"]`);
    // Отримуємо список деталей запису
    let detailsList = listItem.querySelector('.details-list');
    // Створюємо список деталей, якщо його немає
    if (!detailsList) {
        detailsList = document.createElement('ul');
        detailsList.classList.add('details-list');
        listItem.appendChild(detailsList);
    }

    // Отримуємо інформацію про виробництво за вказаним індексом
    const details = records[index];
    if (details) {
        // Закриваємо або відкриваємо деталі залежно від поточного стану
        if (details.isOpen) {
            detailsList.innerHTML = ''; // Закриваємо деталі
        } else {
            detailsList.innerHTML = ''; // Очищаємо список деталей
            // Створюємо деталі та додаємо їх до списку
            const currentTime = new Date().getTime();
            const subProductItems = Array.from({ length: details.quantity }, (_, i) => {
                const subProductNumber = currentTime + i;
                details.subProductNumbers.push(subProductNumber);
                return `<li>${i + 1}. ${details.productName} - Код продукту: ${subProductNumber}</li>`;
            });
            detailsList.innerHTML = subProductItems.join('');
        }

        // Змінюємо стан відкриття та відображення кнопки "Видалити"
        details.isOpen = !details.isOpen;
        const deleteButton = listItem.querySelector('button');
        deleteButton.style.display = details.isOpen ? 'none' : 'block';
    }
}

// Функція для видалення запису про виробництво за вказаним індексом
function deleteProductionRecord(index) {
    // Отримуємо елемент запису за вказаним індексом
    const listItem = document.querySelector(`.product-name[data-index="${index}"]`);
    if (listItem) {
        // Видаляємо елемент зі списку
        listItem.remove();

        // Видаляємо кнопку "Видалити" зі списку записів
        const deleteButton = listItem.querySelector('button');
        if (deleteButton) {
            deleteButton.remove();
        }

        // Видаляємо запис з масиву та зберігаємо у локальному сховищі
        records.splice(index, 1);
        saveToLocalStorage();
    }
}

// Функція для збереження записів у локальному сховищі
function saveToLocalStorage() {
    localStorage.setItem('productionRecords', JSON.stringify(records));
}

// Завантажує записи з локального сховища при завантаженні сторінки
window.onload = function () {

    // Завантаження записів
    if (localStorage.getItem('productionRecords')) {
        records = JSON.parse(localStorage.getItem('productionRecords'));

        // Відображення записів при завантаженні сторінки
        records.forEach((record, index) => {
            const recordsList = document.getElementById('records-list');

            // Створюємо новий елемент запису та кнопку "Видалити"
            const listItem = document.createElement('li');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Видалити';
            deleteButton.onclick = () => deleteProductionRecord(index);

            // Заповнюємо інформацію про виробництво та додаємо кнопку "Видалити"
            listItem.innerHTML = `<strong class="product-name" data-index="${index}" onclick="toggleProductDetails(${index})">Назва продукта: ${record.productName}, Кількість: ${record.quantity}, Дата: ${record.productionDate}</strong>`;
            listItem.appendChild(deleteButton);

            // Створюємо список деталей та додаємо його до запису
            const detailsList = document.createElement('ul');
            detailsList.classList.add('details-list');
            listItem.appendChild(detailsList);
            recordsList.appendChild(listItem);

            // Відкриваємо деталі, якщо запис відкритий
            if (record.isOpen) {
                toggleProductDetails(index);
            }
        });
    }
};
