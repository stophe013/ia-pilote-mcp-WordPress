import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configuration du chemin .env robuste pour ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Configuration
const WP_URL = process.env.WP_URL || "";
const WP_USERNAME = process.env.WP_USERNAME || "";
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || "";

// Validation de la config
if (!WP_URL) {
    console.error("ERREUR CRITIQUE: WP_URL n'est pas défini dans le fichier .env");
    process.exit(1);
}

if (!WP_USERNAME || !WP_APP_PASSWORD) {
    console.error("ERREUR CRITIQUE: Identifiants manquants dans le fichier .env");
    process.exit(1);
}

// Authentification
const authHeader = {
    Authorization: "Basic " + Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString("base64"),
    "Content-Type": "application/json",
};

// Initialisation du serveur MCP
const server = new Server(
    {
        name: "ia-pilote-bridge",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Récupérer les outils depuis WordPress
server.setRequestHandler(ListToolsRequestSchema, async () => {
    try {
        const apiUrl = `${WP_URL}/wp-json/adjm-mcp/v1/mcp/tools/list`;
        console.error(`Fetching tools from: ${apiUrl}`);

        const response = await axios.get(apiUrl, {
            headers: authHeader,
            validateStatus: () => true
        });

        if (response.status !== 200) {
            console.error(`Erreur WordPress (${response.status}):`, response.data);
            return { tools: [] };
        }

        const remoteTools = response.data.tools || [];
        console.error(`Outils trouvés: ${remoteTools.length}`);

        // FIX: Remplacement des '/' par des '__' pour respecter le protocole MCP
        // La regex MCP impose: ^[a-zA-Z0-9_-]{1,64}$ (donc pas de slash !)
        const tools: Tool[] = remoteTools.map((t: any) => {
            // Correction Schema vide (PHP array [] vers JSON {})
            if (t.inputSchema && Array.isArray(t.inputSchema.properties) && t.inputSchema.properties.length === 0) {
                t.inputSchema.properties = { _fixed: { type: 'string', description: 'Auto-fix for empty properties' } };
            }

            return {
                name: t.name.replace(/\//g, "__"),
                description: t.description,
                inputSchema: t.inputSchema,
            };
        });

        return {
            tools: tools,
        };
    } catch (error: any) {
        const msg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        console.error(`Erreur lors de la récupération des outils: ${msg}`);
        return { tools: [] };
    }
});

// Exécuter un outil sur WordPress
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    let toolName = request.params.name;
    const toolArgs = request.params.arguments;

    console.error(`Execution outil reçue (Bridge): ${toolName}`);

    // FIX: Reconversion inverse : '__' devient '/' pour l'envoi vers WordPress
    // Exemple : adjm__list-pages -> adjm/list-pages
    if (toolName.includes("__")) {
        toolName = toolName.replace(/__/g, "/");
        console.error(`> Converti pour WP en : ${toolName}`);
    }

    try {
        const apiUrl = `${WP_URL}/wp-json/adjm-mcp/v1/mcp/tools/call`;

        const response = await axios.post(
            apiUrl,
            {
                name: toolName,
                arguments: toolArgs,
            },
            {
                headers: authHeader,
                validateStatus: () => true
            }
        );

        if (response.status !== 200) {
            console.error(`Erreur Execution (${response.status}):`, response.data);
            return {
                content: [
                    {
                        type: "text",
                        text: `Erreur WordPress (${response.status}): ${JSON.stringify(response.data)}`
                    }
                ],
                isError: true
            };
        }

        // Le plugin retourne déjà le format MCP { content: [...], isError: boolean }
        return response.data;

    } catch (error: any) {
        const msg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        console.error(`Erreur Bridge: ${msg}`);

        return {
            content: [
                {
                    type: "text",
                    text: `Erreur Bridge: ${msg}`,
                },
            ],
            isError: true,
        };
    }
});

// Démarrer le serveur
async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("IA Pilote Bridge MCP Server running on Stdio (with Slash fix)...");
}

run();
