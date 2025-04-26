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
import cors from 'cors';
import connectDB from '../config/db.js';
import pokemonRoutes from './routes/pokemonRoutes.js';
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import verifyToken from './middleware/auth.js'; // Importez le middleware explicitement ici


dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration CORS
const corsOptions = {
   origin: 'http://localhost:5173',
   methods: 'GET,POST,PUT,DELETE',
   allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Connecter à la base de données
connectDB();

// Middleware pour traiter les données JSON
app.use(express.json());

// Routes d'authentification publiques (sans vérification de token)
app.use('/api/auth', authRoutes);

// Route de base
app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API Pokémon 🎉");
});

// Middleware d'authentification appliqué uniquement aux routes protégées qui suivent
// IMPORTANT: Placez ce middleware APRÈS les routes publiques et AVANT les routes protégées
app.use('/api', verifyToken); // Appliquer le middleware uniquement aux routes qui commencent par /api (sauf celles déjà définies)

// Routes protégées nécessitant une authentification
app.use('/api', pokemonRoutes);

// Middleware pour attraper les erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
       message: 'Une erreur est survenue !',
       error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne du serveur'
    });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});