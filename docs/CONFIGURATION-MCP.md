# 🔧 Guide de Configuration MCP - IA Pilote MCP Ability

> Comment connecter votre WordPress à différents clients MCP

Remplacez `https://example.com` par l'URL de votre site.

---

## 💻 Nouvelle installation (PC / Mac)

### Prérequis côté ordinateur

La plupart des clients MCP lancent un **serveur MCP local** via `npx`.

- Installer **Node.js (LTS)** (avec `npm` / `npx`)
- Vérifier dans un terminal :

```bash
node -v
npm -v
npx -v
```

Si `npx` n'est pas trouvé sur Windows : redémarrer le PC (ou fermer/réouvrir le terminal) après installation de Node.

### Prérequis côté WordPress

- Plugin **IA Pilote MCP Ability** activé
- **Permaliens** activés (Réglages → Permaliens → Enregistrer)
- Site accessible en **HTTPS** (recommandé)

---

## 📋 Prérequis

Avant de configurer votre client MCP, vous devez :

### 1. Créer un mot de passe d'application WordPress

1. Aller dans **WordPress Admin** → **Utilisateurs** → **Votre profil**
2. Descendre jusqu'à **Mots de passe d'application**
3. Entrer un nom (ex: "MCP Claude")
4. Cliquer sur **Ajouter un mot de passe d'application**
5. **Copier le mot de passe** (il ne sera plus affiché !)

```
Format: xxxx xxxx xxxx xxxx xxxx xxxx
```

### 2. Informations requises

| Information | Exemple |
|-------------|---------|
| **URL du site** | `https://example.com` |
| **Nom d'utilisateur** | `admin` |
| **Mot de passe d'application** | `xxxx xxxx xxxx xxxx` |

---

## 🤖 Claude Desktop (Anthropic)

### Fichier de configuration

**Windows** : `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS** : `~/Library/Application Support/Claude/claude_desktop_config.json`

### Configuration

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

### Générer le Base64

```powershell
# PowerShell (Windows)
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("admin:xxxx xxxx xxxx xxxx"))
```

```bash
# Bash (Mac/Linux)
echo -n "admin:xxxx xxxx xxxx xxxx" | base64
```

---

## 🧩 Serveur MCP local (bridge Node.js)

La configuration ci-dessus (avec `@anthropic-ai/mcp-remote`) suffit dans la plupart des cas.

Utilisez ce **bridge local** si :

- votre client MCP exige un serveur **stdio** local (commande `node ...`)
- votre client refuse les noms d'outils contenant `/` (le bridge convertit `/` en `__`)

Ce bridge tourne **sur votre ordinateur**, pas sur WordPress. Il appelle ensuite votre WordPress via :

- `GET /wp-json/adjm-mcp/v1/mcp/tools/list`
- `POST /wp-json/adjm-mcp/v1/mcp/tools/call`

### Installation

Dans le dossier `mcp/` (fourni avec le projet) :

```bash
cd mcp
npm ci
npm run build
```

Créez ensuite votre fichier `mcp/.env` :

1. Copier `mcp/.env.example` vers `mcp/.env`
2. Modifier `mcp/.env` :
   - `WP_URL=https://example.com`
   - `WP_USERNAME=...`
   - `WP_APP_PASSWORD="xxxx xxxx xxxx xxxx"` (gardez les guillemets si le mot de passe contient des espaces)

### Test

```bash
cd mcp
npm run test:connection
```

### Exemple Claude Desktop (bridge local)

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

Notes :

- utilisez un **chemin absolu** vers `mcp/build/index.js` (les clients ne fixent pas toujours le répertoire courant)
- les tools exposés par le bridge seront du type `adjm__list-pages` (au lieu de `adjm/list-pages`)

---

## 🚀 Antigravity (Google)

### Fichier de configuration

**Emplacement** : `.gemini/settings.json` dans le workspace

### Configuration

```json
{
  "mcp_servers": {
    "wordpress-mcp": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-wordpress"],
      "env": {
        "WP_URL": "https://example.com",
        "WP_USERNAME": "admin",
        "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```

### Fichier alternatif : `mcp_config.json`

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "npx",
      "args": ["-y", "mcp-wordpress-rest"],
      "env": {
        "WP_URL": "https://example.com",
        "WP_USERNAME": "admin",
        "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```

---

## 💻 Cursor

### Fichier de configuration

**Emplacement** : `~/.cursor/mcp.json`

### Configuration

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-remote"],
      "env": {
        "MCP_ENDPOINT": "https://example.com/wp-json/adjm-mcp/v1/mcp",
        "MCP_HEADERS": "{\"Authorization\": \"Basic VOTRE_BASE64\"}"
      }
    }
  }
}
```

### Alternative avec serveur local

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "node",
      "args": ["chemin/vers/mcp-wordpress-server.js"],
      "env": {
        "WP_URL": "https://example.com",
        "WP_USERNAME": "admin",
        "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```

---

## 🔵 VS Code (avec extension MCP)

### Extension requise

Installer : **MCP Client** depuis le marketplace VS Code

### Fichier de configuration

**Emplacement** : `.vscode/mcp.json` dans votre projet

### Configuration

```json
{
  "servers": {
    "wordpress": {
      "type": "http",
      "url": "https://example.com/wp-json/adjm-mcp/v1/mcp",
      "auth": {
        "type": "basic",
        "username": "admin",
        "password": "xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```

### Settings VS Code

Ajouter dans `settings.json` :

```json
{
  "mcp.servers": {
    "wordpress": {
      "command": "npx",
      "args": ["-y", "mcp-wordpress-rest"],
      "env": {
        "WP_URL": "https://example.com",
        "WP_USERNAME": "admin", 
        "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```

---

## 🔷 Windsurf (Codeium)

### Fichier de configuration

**Emplacement** : `~/.windsurf/mcp_config.json`

### Configuration

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-remote"],
      "env": {
        "MCP_ENDPOINT": "https://example.com/wp-json/adjm-mcp/v1/mcp",
        "MCP_HEADERS": "{\"Authorization\":\"Basic VOTRE_BASE64\"}"
      }
    }
  }
}
```

---

## 🌐 n8n (Workflow Automation)

### Nœud HTTP Request

1. Ajouter un nœud **HTTP Request**
2. Configurer :

| Paramètre | Valeur |
|-----------|--------|
| **Method** | POST |
| **URL** | `https://example.com/wp-json/adjm-mcp/v1/execute` |
| **Authentication** | Basic Auth |
| **User** | `admin` |
| **Password** | `xxxx xxxx xxxx xxxx` |
| **Body Content Type** | JSON |

### Body exemple

```json
{
  "ability": "adjm/list-pages",
  "params": {
    "per_page": 10
  }
}
```

---

## 🧪 Test de connexion

### Endpoints utiles

| Usage | Endpoint |
|------|----------|
| Health check | `/wp-json/adjm-mcp/v1/health` |
| Abilities (format REST) | `/wp-json/adjm-mcp/v1/discover` |
| Exécution (format REST) | `/wp-json/adjm-mcp/v1/execute` |
| MCP tools list | `/wp-json/adjm-mcp/v1/mcp/tools/list` |
| MCP tools call | `/wp-json/adjm-mcp/v1/mcp/tools/call` |

### Via cURL

```bash
# Tester le health check
curl https://example.com/wp-json/adjm-mcp/v1/health

# Tester MCP (tools/list)
curl -H "Authorization: Basic BASE64_CREDENTIALS" \
     https://example.com/wp-json/adjm-mcp/v1/mcp/tools/list

# Tester la découverte des abilities
curl -u "admin:xxxx xxxx xxxx xxxx" \
     https://example.com/wp-json/adjm-mcp/v1/discover

# Exécuter une ability
curl -X POST \
     -u "admin:xxxx xxxx xxxx xxxx" \
     -H "Content-Type: application/json" \
     -d '{"ability":"adjm/get-site-info","params":{}}' \
     https://example.com/wp-json/adjm-mcp/v1/execute
```

### Via PowerShell

```powershell
# Tester la connexion
$cred = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("admin:xxxx xxxx xxxx xxxx"))
$headers = @{ Authorization = "Basic $cred" }

# Health check
Invoke-RestMethod -Uri "https://example.com/wp-json/adjm-mcp/v1/health"

# Discover
Invoke-RestMethod -Uri "https://example.com/wp-json/adjm-mcp/v1/discover" -Headers $headers

# MCP tools/list
Invoke-RestMethod -Uri "https://example.com/wp-json/adjm-mcp/v1/mcp/tools/list" -Headers $headers

# Execute
$body = @{ ability = "adjm/list-pages"; params = @{ per_page = 5 } } | ConvertTo-Json
Invoke-RestMethod -Uri "https://example.com/wp-json/adjm-mcp/v1/execute" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

---

## 🔒 Sécurité

### Bonnes pratiques

- ✅ Toujours utiliser **HTTPS**
- ✅ Créer un utilisateur **dédié** pour MCP
- ✅ Donner uniquement les **permissions nécessaires**
- ✅ **Révoquer** les mots de passe d'application inutilisés
- ✅ Activer les **logs** pour tracer les actions

### Permissions recommandées

| Rôle WordPress | Abilities accessibles |
|----------------|----------------------|
| **Éditeur** | Pages, Posts, Médias |
| **Administrateur** | Tout |

---

## ❓ Dépannage

### Erreur 401 Unauthorized

- Vérifier le nom d'utilisateur
- Vérifier le mot de passe d'application
- S'assurer que les espaces sont inclus dans le mot de passe

### Erreur 403 Forbidden

- L'utilisateur n'a pas les permissions requises
- Vérifier le rôle WordPress de l'utilisateur

### Erreur 404 Not Found

- Le plugin n'est pas activé
- L'URL du site est incorrecte
- Vérifier les permaliens WordPress (Réglages → Permaliens → Enregistrer)

### Abilities non listées

- Vérifier que le groupe est activé dans **IA Pilote MCP** → **Abilities**
- Certaines abilities nécessitent des plugins tiers (WooCommerce, Yoast, etc.)

---

## 📞 Support

**CenterHome**  
🌐 [centerhome.net](https://centerhome.net)  
📧 support@centerhome.net

---

*Documentation v1.0.0 - IA Pilote MCP Ability*



