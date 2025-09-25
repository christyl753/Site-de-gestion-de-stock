CREATE TABLE connexion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(100) NOT NULL,
    Prenom VARCHAR(100),
    mail VARCHAR(255) UNIQUE NOT NULL,
    naissance DATE,
    Password VARCHAR(255) NOT NULL
);

-- Supprimer la table si elle existe
DROP TABLE IF EXISTS inventaire;

-- Recréer la table avec la bonne structure
CREATE TABLE inventaire (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Produits VARCHAR(100) NOT NULL,
    categories VARCHAR(100),
    Stock INT,
    prix DECIMAL(10,2),
    fournisseurs VARCHAR(100),
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fournisseurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    contact VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(100),
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
