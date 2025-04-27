import fs from 'fs';
import pokemonsList from './pokemonsList.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


/**
 * Génère un fichier `pokemons.json` à partir d'une liste statique de Pokémon.
 *
 * - Convertit un tableau de Pokémon en format JSON.
 * - Écrit le fichier JSON sur le disque.
 * - Utilise un chemin absolu sécurisé grâce à `import.meta.url`.
 *
 * Peut être utilisé comme :
 * - Script exécuté directement.
 * - Module importé dans un autre fichier.
 *
 * @module utils/generatePokemonsJson
 */


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/**
 * Convertit la liste des Pokémon en JSON et l'écrit dans un fichier `pokemons.json`.
 *
 * @function
 * @returns {void}
 */


const generatePokemonsJson = () => {
    try {
        // Convertir la liste en JSON avec une indentation de 2 espaces
        const pokemonsJson = JSON.stringify(pokemonsList, null, 2);
        
        // Utiliser un chemin absolu pour écrire le fichier
        const filePath = new URL('./pokemons.json', import.meta.url);
        
        // Écrire le fichier JSON
        fs.writeFileSync(filePath, pokemonsJson);
        
        console.log('Le fichier pokemons.json a été généré avec succès !');
    } catch (error) {
        console.error('Erreur lors de la génération du fichier JSON :', error);
    }
};

// Exécuter la fonction si le fichier est appelé directement
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    generatePokemonsJson();
}

export default generatePokemonsJson; 