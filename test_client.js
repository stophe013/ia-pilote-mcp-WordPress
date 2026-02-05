import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bridgePath = path.join(__dirname, "build/index.js");

async function main() {
    console.log("🚀 Démarrage du test COMPLET (Client -> Bridge -> WordPress)...");

    const transport = new StdioClientTransport({
        command: "node",
        args: [bridgePath],
    });

    const client = new Client(
        {
            name: "test-client",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    console.log("🔌 Connexion au pont local...");
    try {
        await client.connect(transport);
        console.log("✅ Connexion établie avec le Bridge.");
    } catch (e) {
        console.error("❌ Impossible de lancer le Bridge:", e);
        process.exit(1);
    }

    console.log("\n📋 Récupération des outils (listTools)...");
    const result = await client.listTools();
    console.log(`🛠️  ${result.tools.length} outils trouvés.`);

    // Validation de la correction de noms (Sanitization)
    const siteInfoTool = result.tools.find(t => t.name.includes("get-site-info"));

    if (siteInfoTool) {
        console.log(`\n🔍 VERIFICATION TECHNIQUE sur '${siteInfoTool.name}':`);

        // 1. Vérification du nom (Double Underscore)
        if (siteInfoTool.name.includes("__")) {
            console.log("   ✅ Nom conforme MCP (slashes remplacés par __).");
        } else {
            console.error(`   ❌ ERREUR: Le nom '${siteInfoTool.name}' n'est pas conforme (contient encore des slashs ?).`);
        }

        // 2. Vérification du Schema (Correction Array -> Object)
        const props = siteInfoTool.inputSchema.properties;
        if (props && !Array.isArray(props) && typeof props === 'object') {
            console.log("   ✅ Schema JSON valide (properties est un objet).");
            if (props._fixed) console.log("      (Correction auto '_fixed' détectée)");
        } else {
            console.error("   ❌ ERREUR: Schema 'properties' est invalide (Array vide au lieu d'objet).");
            console.log("      Valeur reçue:", JSON.stringify(props));
        }

        // 3. Test d'exécution réel
        console.log(`\n▶️  TEST D'APPEL APPLICATIF : ${siteInfoTool.name}...`);
        try {
            const execResult = await client.callTool({
                name: siteInfoTool.name,
                arguments: {}
            });

            console.log("✅ Réponse reçue !");

            if (execResult.content && execResult.content[0] && execResult.content[0].text) {
                const rawData = execResult.content[0].text;
                try {
                    const data = JSON.parse(rawData);
                    console.log("\n📊 DONNÉES DU SITE DISTANT (Hostinger) :");
                    console.log(`   ----------------------------------------`);
                    console.log(`   🏠 Nom du site : ${data.name}`);
                    console.log(`   🔗 URL         : ${data.url}`);
                    console.log(`   🐘 Version PHP : ${data.php_version}`);
                    console.log(`   📝 Version WP  : ${data.wordpress_version}`);
                    console.log(`   ----------------------------------------`);
                } catch (e) {
                    console.log("   (Réponse non-JSON):", rawData);
                }
            }
        } catch (e) {
            console.error("❌ Erreur d'exécution de l'outil:", e);
        }

    } else {
        console.error("❌ Outil 'get-site-info' introuvable dans la liste.");
    }

    await client.close();
    process.exit(0);
}

main().catch(console.error);
