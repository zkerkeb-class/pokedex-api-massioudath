import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js'; // Attention aussi : chemin et extension .js si tu es en ES Modules

/**
 * Classe AuthController
 */

/**
 * Contrôleur d'authentification pour la gestion des utilisateurs.
 *
 * - Permet l'inscription (`register`) d'un nouvel utilisateur.
 * - Permet la connexion (`login`) d'un utilisateur existant.
 * - Permet de récupérer les informations de l'utilisateur connecté (`getMe`).
 *
 * Utilise JWT pour l'authentification et bcrypt pour le hachage des mots de passe.
 *
 * @module controllers/AuthController
 */

class AuthController {
  
  // Register (inscription en base de données MongoDB)

  /**
 * Inscrit un nouvel utilisateur.
 *
 * - Vérifie que l'email et le mot de passe sont fournis.
 * - Vérifie que l'utilisateur n'existe pas déjà.
 * - Crée l'utilisateur et génère un token JWT valide pendant 1 heure.
 *
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express.
 * @returns {Promise<void>}
 */


  static async register(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Créer l'utilisateur
      const newUser = new User({ email, password });
      await newUser.save();

      // Payload du token
      const payload = {
        user: {
          id: newUser._id,
          email: newUser.email
        }
      };

      // Générer le token
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.', error: error.message });
    }
  }

  // Login (connexion)


  /**
 * Connecte un utilisateur existant.
 *
 * - Vérifie les informations d'identification.
 * - Compare le mot de passe avec celui en base de données.
 * - Génère un token JWT valide pendant 1 heure en cas de succès.
 *
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express.
 * @returns {Promise<void>}
 */


  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      const payload = {
        user: {
          id: user._id,
          email: user.email
        }
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de l'authentification", error: error.message });
    }
  }

  // Me (récupération de l'utilisateur connecté)

  /**
 * Renvoie les informations de l'utilisateur actuellement connecté.
 *
 * - Nécessite que l'authentification (middleware) soit déjà validée.
 *
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express.
 * @returns {Promise<void>}
 */

  
  static async getMe(req, res) {
    try {
      res.status(200).json({ user: req.user });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des informations utilisateur", error: error.message });
    }
  }
}

export default AuthController;
