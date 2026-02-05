# IA Pilote MCP Ability

Solution MCP pour WordPress : expose des "abilities" via REST et via les endpoints MCP (tools/list + tools/call) pour piloter un site depuis un client MCP (Claude Desktop, Cursor, VS Code, etc.).

## Prerequis

- WordPress >= 6.0
- PHP >= 7.4
- Plugin active : `ia-pilote-mcp-ability`

## Installation

1. Deployer le dossier `ia-pilote-mcp-ability/` dans `wp-content/plugins/`
2. Activer le plugin dans WordPress
3. Aller dans `Admin -> IA Pilote MCP`

Pour generer un ZIP propre (dossier racine = `ia-pilote-mcp-ability/`) :

- Windows : `build.ps1 -Version 1.6.0` (ou `build.bat 1.6.0`)

## Configuration MCP (exemple)

Remplacez `https://example.com` par l'URL de votre site et utilisez un mot de passe d'application WordPress (Profil utilisateur -> "Mots de passe d'application").

### Claude Desktop (via mcp-remote)

Fichier :

- Windows : `%APPDATA%\\Claude\\claude_desktop_config.json`
- macOS : `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-remote"],
      "env": {
        "MCP_ENDPOINT": "https://example.com/wp-json/adjm-mcp/v1/mcp",
        "MCP_HEADERS": "{\"Authorization\":\"Basic BASE64_ENCODED_CREDENTIALS\"}"
      }
    }
  }
}
```

Generer le Base64 :

```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("USERNAME:APP_PASSWORD"))
```

## Endpoints

- Health : `https://example.com/wp-json/adjm-mcp/v1/health`
- REST discover : `https://example.com/wp-json/adjm-mcp/v1/discover`
- REST execute : `https://example.com/wp-json/adjm-mcp/v1/execute`
- MCP tools list : `https://example.com/wp-json/adjm-mcp/v1/mcp/tools/list`
- MCP tools call : `https://example.com/wp-json/adjm-mcp/v1/mcp/tools/call`

## Docs

- Guide complet : `docs/CONFIGURATION-MCP.md`
- Fiche rapide : `docs/FICHE-INSTALLATION-CONFIG-MCP.md`

## MCP Bridge (optionnel)

Un bridge Node.js (serveur MCP local en stdio) est disponible dans ce meme depot sur la branche `mcp-bridge` :

- `github:stophe013/ia-pilote-mcp-WordPress#mcp-bridge`

Utile si votre client MCP refuse les noms d'outils avec `/` (le bridge convertit `/` <-> `__`) ou impose un serveur local stdio.

Exemple (Claude Desktop / Cursor) :

```json
{
  "mcpServers": {
    "ia-pilote-bridge": {
      "command": "npx",
      "args": ["-y", "github:stophe013/ia-pilote-mcp-WordPress#mcp-bridge"],
      "env": {
        "WP_URL": "https://example.com",
        "WP_USERNAME": "USERNAME",
        "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```
