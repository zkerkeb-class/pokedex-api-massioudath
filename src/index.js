/*import express from "express";
import cors from "cors";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pokemonRoutes from './routes/pokemonRoutes.js';

dotenv.config();

// Déterminer le chemin du fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pokemonsFilePath = path.join(__dirname, './data/pokemons.json');

// ✅ Fonction pour toujours charger les Pokémons à jour
const getPokemons = () => {
    return JSON.parse(fs.readFileSync(pokemonsFilePath, 'utf8'));
};

const app = express();
const PORT = 3000;

// Middleware pour CORS et JSON parsing
app.use(cors());
app.use(express.json());

// Middleware pour servir des fichiers statiques
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// ✅ Route GET - Liste des Pokémons avec MAJ dynamique
app.get("/api/pokemons", (req, res) => {
    res.status(200).send({
        types: [
            "fire", "water", "grass", "electric", "ice", "fighting",
            "poison", "ground", "flying", "psychic", "bug", "rock",
            "ghost", "dragon", "dark", "steel", "fairy"
        ],
        pokemons: getPokemons()  // Toujours récupérer la dernière version
    });
});

app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API Pokémon !");
});

// Routes des Pokémons
app.use('/api', pokemonRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
*/


import express from 'express';
import cors from 'cors';  // Import du middleware CORS
import connectDB from '../config/db.js';  // Mise à jour du chemin pour la connexion à MongoDB
import pokemonRoutes from './routes/pokemonRoutes.js';  // Routes pour les Pokémon
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utiliser CORS pour autoriser les requêtes provenant d'autres origines
const corsOptions = {
   origin: 'http://localhost:5173',  // Autoriser le frontend React
   methods: 'GET,POST,PUT,DELETE',  // Méthodes autorisées
   allowedHeaders: 'Content-Type,Authorization'  // En-têtes autorisés
};

app.use(cors(corsOptions));  // Applique CORS sur toutes les routes
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Connecter à la base de données
connectDB();

// Middleware pour traiter les données JSON dans les requêtes
app.use(express.json());

// Utilisation des routes Pokémon
app.use('/api', pokemonRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
