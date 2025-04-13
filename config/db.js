import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/pokemons', {  // Assurez-vous que c'est bien la base de données 'pokemons'
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected: ' + conn.connection.host); // Vous devriez voir ce message dans la console
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Si la connexion échoue, arrêtez l'application
    }
};

export default connectDB;
