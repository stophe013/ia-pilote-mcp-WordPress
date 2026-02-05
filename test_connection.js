import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger le .env du dossier courant
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const WP_URL = process.env.WP_URL;
const USER = process.env.WP_USERNAME;
const PASS = process.env.WP_APP_PASSWORD;

console.log("--- 🕵️ TEST DE CONNEXION IA PILOTE ---");

if (!WP_URL || !USER || !PASS) {
    console.error("❌ ERREUR : Le fichier .env ne semble pas complet.");
    console.log("Assurez-vous d'avoir défini WP_URL, WP_USERNAME et WP_APP_PASSWORD.");
    process.exit(1);
}

if (PASS.includes('xxxx')) {
    console.error("⚠️  ATTENTION : Vous n'avez pas encore remplacé le mot de passe 'xxxx' dans le fichier .env !");
    process.exit(1);
}

const auth = Buffer.from(`${USER}:${PASS}`).toString('base64');
console.log(`📡 Connexion à : ${WP_URL}`);
console.log(`👤 Utilisateur : ${USER}`);

async function testConnection() {
    try {
        const url = `${WP_URL}/wp-json/adjm-mcp/v1/mcp/tools/list`;
        const start = Date.now();

        const res = await axios.get(url, {
            headers: { Authorization: `Basic ${auth}` },
            timeout: 10000
        });

        const duration = Date.now() - start;

        if (res.status === 200) {
            const tools = res.data.tools || [];
            console.log(`\n✅ SUCCÈS ! Connexion établie en ${duration}ms.`);
            console.log(`🛠️  ${tools.length} Abilities détectées.`);

            if (tools.length > 0) {
                console.log(`   Exemple : ${tools[0].name} - ${tools[0].description}`);
            }

            console.log("\n🚀 Tout est prêt ! Vous pouvez ajouter ce serveur à Cursor/Claude.");
        } else {
            console.error(`\n❌ ERREUR API : Code ${res.status}`);
            console.log(res.data);
        }
    } catch (error) {
        console.error(`\n❌ ÉCHEC DE LA CONNEXION`);
        console.error(`Message : ${error.message}`);

        if (error.response) {
            console.error(`Status : ${error.response.status}`);
            if (error.response.status === 404) {
                console.error("👉 CAUSE PROBABLE : Les permaliens ne sont pas activés sur WordPress (Erreur rest_no_route).");
                console.error("   Solution : Allez dans Réglages > Permaliens > Enregistrer.");
            } else if (error.response.status === 401 || error.response.status === 403) {
                console.error("👉 CAUSE PROBABLE : Erreur d'authentification (Mot de passe ou User incorrect).");
            }
        } else if (error.code === 'ENOTFOUND') {
            console.error("👉 CAUSE PROBABLE : L'URL du site est incorrecte ou le domaine est inaccessible.");
        }
    }
}

testConnection();
