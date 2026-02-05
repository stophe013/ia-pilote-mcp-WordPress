import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bridgePath = path.join(__dirname, "..", "build", "index.js");

async function main() {
    console.log("Fetching WordPress site information via MCP bridge...\n");

    const transport = new StdioClientTransport({
        command: "node",
        args: [bridgePath],
    });

    const client = new Client(
        { name: "site-analyzer", version: "1.0.0" },
        { capabilities: {} }
    );

    await client.connect(transport);

    const results = {};

    try {
        const siteInfo = await client.callTool({ name: "adjm__get-site-info", arguments: {} });
        results.siteInfo = JSON.parse(siteInfo.content[0].text);

        const pages = await client.callTool({ name: "adjm__list-pages", arguments: { per_page: 100 } });
        results.pages = JSON.parse(pages.content[0].text);

        const outputPath = path.join(__dirname, "..", "current_site_data.json");
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
        console.log(`Saved: ${outputPath}`);
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await client.close();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

