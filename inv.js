document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-product-form');
    
    if (!form) {
        console.error('Formulaire non trouvé');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Vérification des éléments du formulaire
        const elements = {
            name: document.getElementById('product-name'),
            category: document.getElementById('product-category'),
            price: document.getElementById('product-price'),
            quantity: document.getElementById('product-quantity'),
            provider: document.getElementById('product-provider')
        };

        // Vérification de l'existence des champs
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Champ ${key} non trouvé`);
                return;
            }
        }

        const formData = {
            name: elements.name.value,
            category: elements.category.value,
            price: elements.price.value,
            quantity: elements.quantity.value,
            provider: elements.provider.value
        };
            // URL de notre API
        try {
            const response = await fetch('http://localhost:3000/api/dashboard', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log('Réponse du serveur:', data);

            if (response.ok) {
                alert('Produit ajouté avec succès');
                e.target.reset();
            } else {
                throw new Error(data.error || error.message);
            }
        } catch (error) {
            console.error('Erreur détaillée:', error);
            alert('Erreur lors de l\'ajout du produit');
        }
    });
});