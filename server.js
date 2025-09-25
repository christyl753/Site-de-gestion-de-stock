const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const inventRoutes = require("./invent");
const SECRET_KEY = "votre_cle_secrete";
const cookieParser = require("cookie-parser"); // Ajouter cookie-parser
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "projet",
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser()); // Utiliser cookie-parser
app.use("/api", inventRoutes);

// Ajoutez ces middlewares avant les routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ajoutez ce middleware pour le logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Body:", req.body);
  next();
});

// Liste des routes publiques
const publicPaths = [
  "/",
  "/accueil.html",
  "/connexion.html",
  "/inscription.html",
  "/submit",
  "/login",
];

// Middleware de protection pour toutes les routes non publiques
app.use((req, res, next) => {
  if (publicPaths.includes(req.path)) {
    return next();
  }
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) {
    return res.redirect("/connexion.html");
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.redirect("/connexion.html");
    req.user = user;
    next();
  });
});

connection.connect((err) => {
  if (err) {
    console.error("erreur de connexion: " + err.stack);
    return;
  }
  console.log("La bd c'est OK mon pote ");
});

app.listen(3000, function () {
  console.log("le tout puissant t'ecoute ");
});

app.use(express.static(path.join(__dirname)));

app.get("/", function (req, res) {
  return res.status(200).sendFile(__dirname + "/html/accueil.html");
});

app.get("/connexion.html", function (req, res) {
  return res.status(200).sendFile(__dirname + "/html/connexion.html");
});

app.get("/inscription.html", function (req, res) {
  return res.status(200).sendFile(__dirname + "/html/inscription.html");
});

app.post("/submit", async (req, res) => {
  console.log("Données reçues:", req.body);
  const {
    name: Nom,
    surname: Prenom,
    email: mail,
    birth: naissance,
    password: Password,
  } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const [existingUser] = await connection
      .promise()
      .query("SELECT * FROM connexion WHERE mail = ?", [mail]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Utilisateur déjà existant." });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    await connection
      .promise()
      .query(
        "INSERT INTO connexion (Nom, Prenom, mail, naissance, Password) VALUES (?, ?, ?, ?, ?)",
        [Nom, Prenom, mail, naissance, hashedPassword]
      );

    res
      .status(201)
      .json({ message: "Inscription réussie", redirect: "/connexion.html" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/login", async (req, res) => {
  console.log("Tentative de connexion:", req.body);
  const { name: Nom, password: Password } = req.body;

  try {
    const [users] = await connection
      .promise()
      .query("SELECT * FROM connexion WHERE Nom = ?", [Nom]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const validPassword = await bcrypt.compare(Password, users[0].Password);
    if (!validPassword) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const token = jwt.sign(
      { userId: users[0].id, nom: users[0].Nom },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/html/my-html-project/index.html");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Middleware pour vérifier le jeton JWT
function authenticateToken(req, res, next) {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Exemple de route protégée
app.get("/dashboard", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Bienvenue sur le tableau de bord!" });
});

// Ajouter cette nouvelle route avant app.post("/dashboard"...)
app.get("/api/products", async (req, res) => {
  try {
    const [products] = await connection
      .promise()
      .query("SELECT * FROM inventaire");
    res.json(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des produits" });
  }
});

// Route pour supprimer un produit
app.delete("/api/products/:id", async (req, res) => {
  try {
    const [result] = await connection
      .promise()
      .query("DELETE FROM inventaire WHERE id = ?", [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: "Produit supprimé avec succès" });
    } else {
      res.status(404).json({ error: "Produit non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

// Route pour modifier un produit
app.put("/api/products/:id", async (req, res) => {
  const { name, category, quantity, price, provider } = req.body;
  const productId = parseInt(req.params.id, 10);

  if (productId === 0) {
    return res
      .status(400)
      .json({ error: "L'ID du produit ne peut pas être 0" });
  }

  try {
    const [result] = await connection
      .promise()
      .query(
        "UPDATE inventaire SET Produits = ?, categories = ?, Stock = ?, prix = ?, fournisseurs = ? WHERE id = ?",
        [name, category, quantity, price, provider, productId]
      );
    if (result.affectedRows > 0) {
      res.json({ message: "Produit modifié avec succès" });
    } else {
      res.status(404).json({ error: "Produit non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la modification:", error);
    res.status(500).json({ error: "Erreur lors de la modification" });
  }
});

// Modifier la route pour récupérer les fournisseurs uniques depuis la table inventaire
app.get("/api/fournisseurs", async (req, res) => {
  try {
    const [fournisseurs] = await connection
      .promise()
      .query(
        "SELECT DISTINCT fournisseurs as nom, '' as contact, '' as telephone, '' as email FROM inventaire WHERE fournisseurs IS NOT NULL"
      );
    res.json(fournisseurs);
  } catch (error) {
    console.error("Erreur:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des fournisseurs" });
  }
});

// Route pour obtenir les produits par fournisseur
app.get("/api/fournisseurs/:nom/produits", async (req, res) => {
  try {
    const [produits] = await connection
      .promise()
      .query("SELECT * FROM inventaire WHERE fournisseurs = ?", [
        req.params.nom,
      ]);
    res.json(produits);
  } catch (error) {
    console.error("Erreur:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des produits" });
  }
});

// Route pour les statistiques du tableau de bord
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const [products] = await connection
      .promise()
      .query(
        "SELECT COUNT(*) as total, SUM(Stock) as totalStock FROM inventaire"
      );
    const [lowStock] = await connection
      .promise()
      .query("SELECT COUNT(*) as count FROM inventaire WHERE Stock < 10");
    const [stockByMonth] = await connection
      .promise()
      .query(
        "SELECT DATE_FORMAT(date_ajout, '%Y-%m') as month, SUM(Stock) as total FROM inventaire GROUP BY month ORDER BY month LIMIT 6"
      );

    res.json({
      totalProducts: products[0].total,
      totalStock: products[0].totalStock,
      lowStockCount: lowStock[0].count,
      stockEvolution: stockByMonth,
    });
  } catch (error) {
    console.error("Erreur:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des statistiques" });
  }
});

app.post("/dashboard", async (req, res) => {
  console.log("Ajout produit:", req.body);
  const { name, category, quantity, price, provider } = req.body;

  try {
    const [result] = await connection
      .promise()
      .query(
        "INSERT INTO inventaire (Produits, categories, Stock, prix, fournisseurs) VALUES (?, ?, ?, ?, ?)",
        [name, category, quantity, price, provider]
      );

    console.log("Résultat de l'insertion:", result);
    res.status(201).json({
      message: "Produit ajouté avec succès",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Erreur SQL détaillée:", error);
    res.status(500).json({
      error: `Erreur lors de l'ajout du produit: ${error.sqlMessage}`,
    });
  }
});
