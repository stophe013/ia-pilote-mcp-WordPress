# 📋 Fiche — Installation & Configuration MCP (IA Pilote MCP Ability)

Remplacez `https://example.com` par l'URL de votre site.

## 1) Checklist (5 minutes)

### Côté WordPress

1. Installer et activer **IA Pilote MCP Ability**
2. Aller dans **Réglages → Permaliens → Enregistrer**
3. Créer un utilisateur **dédié** (ex: `mcp-bot`) avec le rôle minimal (souvent **Éditeur**)
4. Générer un **mot de passe d’application** :
   - **Utilisateurs → Profil → Mots de passe d’application → Ajouter**
   - Copier le mot de passe (il ne sera plus affiché)

### Côté PC / Mac

1. Installer **Node.js (LTS)** (pour `npx`)
2. Vérifier :

```bash
node -v
npx -v
```

## 2) Endpoints à connaître

- Health: `https://example.com/wp-json/adjm-mcp/v1/health`
- REST Abilities: `https://example.com/wp-json/adjm-mcp/v1/discover`
- REST Execute: `https://example.com/wp-json/adjm-mcp/v1/execute`
- MCP Tools list: `https://example.com/wp-json/adjm-mcp/v1/mcp/tools/list`
- MCP Tools call: `https://example.com/wp-json/adjm-mcp/v1/mcp/tools/call`

## 3) Serveur MCP local (bridge Node.js) - optionnel

Utile si votre client MCP exige un serveur local en stdio ou n'accepte pas les noms d'outils avec `/`.

```bash
cd mcp
npm ci
npm run build
copy .env.example .env   # Windows (ou `cp .env.example .env` sur Mac/Linux)
```

Editez `mcp/.env` puis testez :

```bash
cd mcp
npm run test:connection
```

Config client (chemin absolu) :

```json
{
  "mcpServers": {
    "ia-pilote-bridge": {
      "command": "node",
      "args": ["C:/chemin/absolu/vers/le/repo/mcp/build/index.js"]
    }
  }
}
```

## 4) Claude Desktop (recommandé : mcp-remote)

### Fichier

- Windows : `%APPDATA%\Claude\claude_desktop_config.json`
- macOS : `~/Library/Application Support/Claude/claude_desktop_config.json`

### Configuration (copier/coller)

> Remplacer `USERNAME`, `APP_PASSWORD` (mot de passe d’application).

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-remote"],
      "env": {
        "MCP_ENDPOINT": "https://example.com/wp-json/adjm-mcp/v1/mcp",
        "MCP_HEADERS": "{\"Authorization\":\"Basic BASE64(USERNAME:APP_PASSWORD)\"}"
      }
    }
  }
}
```

### Générer le Base64

```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("USERNAME:APP_PASSWORD"))
```

```bash
echo -n "USERNAME:APP_PASSWORD" | base64
```

## 4) Test rapide

### cURL

```bash
curl https://example.com/wp-json/adjm-mcp/v1/health
curl -H "Authorization: Basic BASE64" https://example.com/wp-json/adjm-mcp/v1/mcp/tools/list
```

### PowerShell

```powershell
$cred = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("USERNAME:APP_PASSWORD"))
$headers = @{ Authorization = "Basic $cred" }
Invoke-RestMethod -Uri "https://example.com/wp-json/adjm-mcp/v1/health"
Invoke-RestMethod -Uri "https://example.com/wp-json/adjm-mcp/v1/mcp/tools/list" -Headers $headers
```

## 5) Dépannage express

- `401 Unauthorized` : mauvais user / mauvais mot de passe d’application (attention aux espaces)
- `403 Forbidden` : rôle WordPress insuffisant
- `404 Not Found` : plugin inactif, mauvaise URL, ou permaliens non enregistrés




