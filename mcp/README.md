# MCP Bridge (Local Stdio Server)

This folder contains an optional Node.js MCP bridge.

Why: some MCP clients expect tool names without `/`. The WordPress plugin exposes tools like `adjm/list-pages`. This bridge converts `/` to `__` for MCP compatibility, and converts back when calling WordPress.

## Prerequisites

- Node.js (LTS)
- A WordPress site with the "IA Pilote MCP Ability" plugin activated
- A WordPress Application Password (Users -> Profile -> Application Passwords)

## Setup

From the repo root:

```bash
cd mcp
npm install
npm run build
```

Create your local config file:

1. Copy `mcp/.env.example` to `mcp/.env`
2. Edit `mcp/.env`:
   - `WP_URL` (example: `https://example.com`)
   - `WP_USERNAME`
   - `WP_APP_PASSWORD` (keep quotes if it contains spaces)

## Use With Claude Desktop / Cursor

Configure your MCP client to run this bridge:

```json
{
  "mcpServers": {
    "ia-pilote-bridge": {
      "command": "node",
      "args": ["C:/path/to/this/repo/mcp/build/index.js"]
    }
  }
}
```

Note: use an absolute path for `build/index.js` (clients usually do not set a predictable working directory).

## Quick Test

```bash
cd mcp
node test_connection.js
```

If you see `rest_no_route` / 404, re-save permalinks in WordPress (Settings -> Permalinks -> Save).

