# 🌉 WordPress IA Pilot MCP Bridge

[English](#english) | [Français](#fran%C3%A7ais)

<a name="english"></a>
## 🇬🇧 English

This MCP server connects Agravity (Cursor) or Claude Desktop to your WordPress site equipped with the "IA Pilot" plugin.

### 🛠️ Installation

1.  **Prerequisites**: Node.js installed.
2.  **Installation**:
    ```bash
    # Inside the project folder
    npm install
    npm run build
    ```

### ⚙️ Configuration

1.  Rename `.env.example` to `.env`.
2.  Fill in your information:
    *   `WP_URL`: Your site URL (e.g., `https://your-site.com`)
    *   `WP_USERNAME`: Your WordPress administrator username.
    *   `WP_APP_PASSWORD`: Your Application Password.
    *   *Note: You can also pass these variables directly in the JSON configuration (see below).*

### 🚀 Usage in Cursor / Claude Desktop

Add this configuration to your `mcp_config.json` file (or Cursor settings):

```json
{
  "mcpServers": {
    "ia-pilote-bridge": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/MCP-WordPress-IA-Pilote/build/index.js"
      ],
      "env": {
        "WP_URL": "https://your-site.com",
        "WP_USERNAME": "your_username",
        "WP_APP_PASSWORD": "YOUR_APP_PASSWORD"
      }
    }
  }
}
```

> **Note**: The server includes a safety truncation feature to prevent AI crashes if a response exceeds 25,000 characters.

### 🔍 Troubleshooting

*   If the "404 No Route" error persists, ensure **Permalinks** are enabled in WordPress (Settings > Permalinks > Post name).
*   If authentication fails, check that the application password is correct and has no extra spaces.

---

<a name="français"></a>
## 🇫🇷 Français

Ce serveur MCP permet de connecter Agravity (Cursor) ou Claude Desktop à votre site WordPress équipé du plugin "IA Pilote".

### 🛠️ Installation

1.  **Prérequis** : Node.js vérifié.
2.  **Installation** :
    ```bash
    # Dans le dossier du projet
    npm install
    npm run build
    ```

### ⚙️ Configuration

1.  Renommez le fichier `.env.example` en `.env`.
2.  Remplissez vos informations :
    *   `WP_URL` : L'URL de votre site (ex: `https://votre-site.fr`)
    *   `WP_USERNAME` : Votre identifiant administrateur WordPress.
    *   `WP_APP_PASSWORD` : Votre mot de passe d'application.
    *   *Note : Vous pouvez aussi passer ces variables directement dans la configuration JSON (voir ci-dessous).*

### 🚀 Utilisation dans Cursor / Claude Desktop

Ajoutez cette configuration à votre fichier `mcp_config.json` (ou paramètres Cursor) :

```json
{
  "mcpServers": {
    "ia-pilote-bridge": {
      "command": "node",
      "args": [
        "/CHEMIN/ABSOLU/VERS/MCP-WordPress-IA-Pilote/build/index.js"
      ],
      "env": {
        "WP_URL": "https://votre-site.fr",
        "WP_USERNAME": "votre_identifiant",
        "WP_APP_PASSWORD": "VOTRE_MOT_DE_PASSE_APPLICATION"
      }
    }
  }
}
```

> **Note**: Le serveur inclut une sécurité (troncation automatique) pour empêcher l'IA de planter si une réponse dépasse 25 000 caractères.

### 🔍 Dépannage

*   Si l'erreur "404 No Route" persiste, assurez-vous que les **Permaliens** sont activés sur WordPress (Réglages > Permaliens > Titre de la publication).
*   Si l'authentification échoue, vérifiez que le mot de passe d'application est correct et sans espaces superflus.
