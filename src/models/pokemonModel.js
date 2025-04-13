import mongoose from 'mongoose';

// Définition du schéma pour un Pokémon
const pokemonSchema = new mongoose.Schema({
  name: {
    english: { type: String, required: true },  // Le nom en anglais est obligatoire
    french: { type: String, required: true },   // Le nom en français est obligatoire
  },
  type: {
    type: [String], // Tableau de types
    validate: {
      validator: function (v) {
        return v && v.length > 0;  // Assure qu'il y a au moins un type
      },
      message: "Un Pokémon doit avoir au moins un type."
    }
  },
  base: {
    HP: { type: Number, required: true },
    Attack: { type: Number, required: true },
    Defense: { type: Number, required: true },
    "Sp. Attack": { type: Number, required: true },
    "Sp. Defense": { type: Number, required: true },
    Speed: { type: Number, required: true },
  },
  image: { type: String, required: true },
});

// Création du modèle à partir du schéma
const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;
