import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  name: {
    french: { type: String, required: true },
    english: { type: String, required: true },
    japanese: String,
    chinese: String
  },
  type: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        const allowedTypes = [
          "Fire", "Water", "Grass", "Electric", "Ice", "Fighting",
          "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock",
          "Ghost", "Dragon", "Dark", "Steel", "Fairy"
        ];
        return Array.isArray(v) && v.length > 0 && v.every(type => allowedTypes.includes(type));
      },
      message: 'Les types doivent être valides et non vides.'
    }
  },
  image: {
    type: String,
    required: true
  },
  stats: {
    hp: { type: Number, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    specialAttack: { type: Number, required: true },
    specialDefense: { type: Number, required: true },
    speed: { type: Number, required: true }
  },
  evolutions: [{
    type: Number,
    ref: 'Pokemon'
  }]
}, {
  timestamps: true // Ajoute les champs createdAt et updatedAt automatiquement
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;
