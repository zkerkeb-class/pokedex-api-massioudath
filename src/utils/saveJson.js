import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin correct vers `pokemons.json`
const pokemonsFilePath = path.join(__dirname, '../data/pokemons.json'); 

export const getPokemons = () => {
    if (!fs.existsSync(pokemonsFilePath)) {
        fs.writeFileSync(pokemonsFilePath, JSON.stringify([]), 'utf8'); // Créer un fichier vide si absent
    }
    return JSON.parse(fs.readFileSync(pokemonsFilePath, 'utf8'));
};

export const savePokemons = (pokemons) => {
    fs.writeFileSync(pokemonsFilePath, JSON.stringify(pokemons, null, 2), 'utf8');
};
