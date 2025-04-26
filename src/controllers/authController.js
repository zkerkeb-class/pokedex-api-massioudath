import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js'; // Attention aussi : chemin et extension .js si tu es en ES Modules

/**
 * Classe AuthController
 */
class AuthController {
  
  // Register (inscription en base de données MongoDB)
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
  static async getMe(req, res) {
    try {
      res.status(200).json({ user: req.user });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des informations utilisateur", error: error.message });
    }
  }
}

export default AuthController;
