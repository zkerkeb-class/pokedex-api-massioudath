import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


/**
 * Modèle Mongoose représentant un Utilisateur.
 *
 * - Stocke l'email et le mot de passe de l'utilisateur.
 * - Hash automatiquement le mot de passe avant sauvegarde en base.
 * - Fournit une méthode pour comparer un mot de passe en clair avec le mot de passe stocké.
 *
 * @module models/User
 */

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Middleware Mongoose exécuté avant la sauvegarde d'un utilisateur.
 * Si le mot de passe est modifié, il est automatiquement hashé avec bcrypt.
 */

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


/**
 * Méthode d'instance pour comparer un mot de passe fourni avec le mot de passe hashé stocké.
 *
 * @param {string} candidatePassword - Le mot de passe en clair à comparer.
 * @returns {Promise<boolean>} - Résultat de la comparaison.
 */


userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User; // 👈 important !!
