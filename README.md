# IA Pilote MCP Bridge

Local MCP stdio server that bridges an MCP client (Claude Desktop, Cursor, VS Code, etc.) to a WordPress site running the "IA Pilote MCP Ability" plugin.

Why this exists:

- Some MCP clients expect a local stdio server (a `node ...` command).
- Some clients reject tool names containing `/`. WordPress exposes tools like `adjm/list-pages`. This bridge converts `/` <-> `__`.

## Prerequisites

- Node.js (LTS)
- A WordPress site with the plugin activated
- A WordPress Application Password (Users -> Profile -> Application Passwords)

## Install (from source)

```bash
npm ci
npm run build
```

Create `.env` from `.env.example` and set:

- `WP_URL` (example: `https://example.com`)
- `WP_USERNAME`
- `WP_APP_PASSWORD` (quotes recommended if it contains spaces)

## Run

```bash
node build/index.js
```

## Use In Claude Desktop / Cursor

Example config (recommended: pass credentials via `env` instead of a local `.env`):

```json
{
  "mcpServers": {
    "ia-pilote-bridge": {
      "command": "npx",
      "args": ["-y", "github:stophe013/ia-pilote-mcp-bridge"],
      "env": {
        "WP_URL": "https://example.com",
        "WP_USERNAME": "USERNAME",
        "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```

## Quick Test

```bash
npm run test:connection
```

