const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

router.use(express.json());
router.use(cors());

// Route pour envoyer les données du tableau de bord à la base de données
router.post("/dashboard", (req, res) => {
  const { name, category, quantity, price } = req.body;

  // Insérer les données du tableau de bord dans la base de données
  connection.query(
    "INSERT INTO inventaire (Produits, categories, Stock, prix) VALUES (?, ?, ?, ?)",
    [name, category, quantity, price],
    (err) => {
      if (err) {
        return res.status(500).json({
          error:
            "Erreur lors de l'enregistrement des données du tableau de bord.",
        });
      }
      res.status(201).json({
        message: "Données du tableau de bord enregistrées avec succès.",
      });
    }
  );
});

/*router.post('/dashboard', (req, res) => {
  const { name, category, price, quantity, provider } = req.body;
  
  const query = `INSERT INTO inventaire (name, category, price, quantity, provider) 
                 VALUES (?, ?, ?, ?, ?)`;
                 
  connection.query(query, [name, category, price, quantity, provider], 
      (error, results) => {
          if (error) {
              res.status(500).json({ error: 'Erreur de base de données' });
              return;
          }
          res.json({ message: 'Produit ajouté avec succès' });
  });
});*/



module.exports = router;
