document.addEventListener('DOMContentLoaded', () => {
    const inventoryTable = document.getElementById('inventory-table');
    const addProductForm = document.getElementById('add-product-form');

    // Charger les produits existants
    fetch('/api/GESTION')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                addProductToTable(product);
            });
        });

    // Ajouter un produit
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('product-name').value;
        const quantity = document.getElementById('product-quantity').value;

        fetch('/api/GESTION', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, quantity }),
        })
        .then(response => response.json())
        .then(product => {
            addProductToTable(product);
            addProductForm.reset();
        });
});
// Ajouter un produit au tableau
function addProductToTable(product) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td><button class="btn btn-danger btn-sm delete-btn" data-id="${product.id}">Supprimer</button></td>
    `;
    inventoryTable.appendChild(row);

    // Supprimer un produit
    row.querySelector('.delete-btn').addEventListener('click', () => {
        fetch(/api/GESTION/${product.id}, { method: 'DELETE' })
            .then(() => row.remove());
    });
    }
});