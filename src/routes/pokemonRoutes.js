/*import express from 'express';
import { getPokemons, savePokemons } from '../utils/saveJson.js'; // ✅ Import des fonctions 



const router = express.Router();
const allowedTypes = [
  "fire", "water", "grass", "electric", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon",
  "dark", "steel", "fairy"
];

// ✅ Route POST - Créer un Pokémon
router.post('/pokemons', (req, res) => {
  let { name, type, image } = req.body;
  let pokemons = getPokemons(); // ✅ Charger les données depuis le fichier

  if (!name || !type || !image) {
    return res.status(400).json({ message: "Veuillez fournir un nom, un type et une URL pour l'image." });
  }

  // Vérifie que tous les types sont valides
  if (!type.every(t => allowedTypes.includes(t.toLowerCase()))) {
    return res.status(400).json({ message: `Type invalide. Types valides : ${allowedTypes.join(", ")}` });
  }

  const newPokemon = {
    id: pokemons.length + 1,
    name,
    type,
    image
  };

  pokemons.push(newPokemon);
  savePokemons(pokemons); // ✅ Sauvegarder les données dans le fichier

  res.status(201).json(newPokemon);
});

// ✅ Route PUT - Mettre à jour un Pokémon
router.put("/pokemons/:id", (req, res) => {
  let pokemons = getPokemons(); // ✅ Charger les données
  const { id } = req.params;
  const { name, type, image } = req.body;
  const pokemonIndex = pokemons.findIndex(p => p.id === parseInt(id));

  if (pokemonIndex === -1) {
    return res.status(404).json({ message: "Pokémon non trouvé" });
  }

  // Assure-toi que `type` est un tableau de types valides
  let typeArray = type;

  // Si `type` est une chaîne (par exemple "Fire, Flying"), la convertir en tableau
  if (typeof type === "string") {
    typeArray = type.split(",").map(t => t.trim());
  }

  // Vérifie les types valides
  if (typeArray && !typeArray.every(t => allowedTypes.includes(t.toLowerCase()))) {
    return res.status(400).json({ message: `Type(s) invalide(s). Types valides : ${allowedTypes.join(", ")}` });
  }

  // Met à jour les données si elles sont présentes
  if (name) pokemons[pokemonIndex].name = name;
  if (typeArray) pokemons[pokemonIndex].type = typeArray;  // Utilise typeArray
  if (image) pokemons[pokemonIndex].image = image;

  savePokemons(pokemons); // ✅ Sauvegarder les modifications

  res.json({ message: "Pokémon mis à jour avec succès", pokemon: pokemons[pokemonIndex] });
});

// ✅ Route DELETE - Supprimer un Pokémon
router.delete("/pokemons/:id", (req, res) => {
  let pokemons = getPokemons(); // ✅ Charger les données
  const { id } = req.params;
  const pokemonIndex = pokemons.findIndex(p => p.id === parseInt(id));

  if (pokemonIndex === -1) {
    return res.status(404).json({ message: "Pokémon non trouvé" });
  }

  pokemons.splice(pokemonIndex, 1); // splice permet de supprimer un élément
  savePokemons(pokemons); // ✅ Sauvegarder les modifications

  res.json({ message: "Pokémon supprimé avec succès" });
});

// ✅ Route GET - Récupérer tous les Pokémon avec recherche et pagination
router.get('/pokemons', (req, res) => {
  let pokemons = getPokemons(); // ✅ Charger les données
  const { page = 1, limit = 10, name, type } = req.query;

  if (name) {
    pokemons = pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (type) {
    pokemons = pokemons.filter(pokemon =>
      pokemon.type.toLowerCase() === type.toLowerCase()
    );
  }

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;
  const paginatedPokemons = pokemons.slice(startIndex, endIndex);

  res.json({
    total: pokemons.length,
    page: pageNumber,
    limit: limitNumber,
    data: paginatedPokemons
  });
});

// ✅ Route GET - Récupérer un Pokémon spécifique par ID
router.get('/pokemons/:id', (req, res) => {
  let pokemons = getPokemons(); // ✅ Charger les données
  const { id } = req.params;
  const pokemon = pokemons.find(p => p.id === parseInt(id));

  if (!pokemon) {
    return res.status(404).json({ message: "Pokémon non trouvé" });
  }

  res.json(pokemon);
});

export default router;
*/
/*

import express from 'express';
import mongoose from 'mongoose';
import Pokemon from '../models/pokemonModel.js';  // Modèle Pokémon

const router = express.Router();

// Route pour récupérer tous les Pokémons avec pagination
router.get('/pokemons', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const pokemons = await Pokemon.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalPokemons = await Pokemon.countDocuments();
    const totalPages = Math.ceil(totalPokemons / limit);

    res.json({ pokemons, totalPages, currentPage: page });
  } catch (error) {
    console.error("Erreur lors de la récupération des Pokémon", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route POST pour créer un Pokémon
router.post('/pokemons', async (req, res) => {
  try {
    const { name, types, imageUrl } = req.body;

    if (!name || !types || !imageUrl) {
      return res.status(400).json({ message: "Veuillez fournir un nom, un type et une URL pour l'image." });
    }

    const newPokemon = new Pokemon({
      name,
      type: types,
      image: imageUrl,
    });

    await newPokemon.save();
    res.status(201).json(newPokemon);
  } catch (error) {
    console.error("Erreur lors de la création du Pokémon", error);
    res.status(500).json({ message: "Erreur lors de la création du Pokémon" });
  }
});

// Route PUT pour mettre à jour un Pokémon existant par son ID
const mongoose = require('mongoose');

router.put("/pokemons/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, image } = req.body;

  // Vérifie si l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    // Recherche et mise à jour du Pokémon
    const pokemon = await Pokemon.findById(id);

    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    // Mise à jour des champs
    pokemon.name.french = name;  // Exemple pour la mise à jour du nom
    pokemon.type = type.split(',').map(t => t.trim());
    pokemon.image = image;

    await pokemon.save();  // Sauvegarde les changements dans MongoDB

    res.status(200).json({ message: "Pokémon mis à jour avec succès", pokemon });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du Pokémon", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});




// Route DELETE pour supprimer un Pokémon
router.delete("/pokemons/:id", async (req, res) => {
  const { id } = req.params;

  // Cast de l'ID en ObjectId
  let objectId;
  try {
    objectId = mongoose.Types.ObjectId(id);
  } catch (error) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const pokemon = await Pokemon.findByIdAndDelete(objectId);
    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }
    res.status(200).json({ message: "Pokémon supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du Pokémon", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route GET pour récupérer un Pokémon par ID
router.get('/pokemons/:id', async (req, res) => {
  const { id } = req.params;

  // Cast de l'ID en ObjectId
  let objectId;
  try {
    objectId = mongoose.Types.ObjectId(id);
  } catch (error) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const pokemon = await Pokemon.findById(objectId); // Recherche du Pokémon
    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    res.json(pokemon);
  } catch (error) {
    console.error("Erreur lors de la récupération du Pokémon", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
*/

import express from 'express';
import PokemonController from '../controllers/pokemonController.js';

const router = express.Router();

router.get('/pokemons', PokemonController.getAllPokemons); // Récupérer tous les pokémons
router.get('/pokemons/:id', PokemonController.getPokemonById); // Récupérer un pokémon par ID
router.post('/pokemons', PokemonController.createPokemon); // Créer un nouveau pokémon
router.put('/pokemons/:id', PokemonController.updatePokemon); // Mettre à jour un pokémon
router.delete('/pokemons/:id', PokemonController.deletePokemon); // Supprimer un pokémon

export default router;
