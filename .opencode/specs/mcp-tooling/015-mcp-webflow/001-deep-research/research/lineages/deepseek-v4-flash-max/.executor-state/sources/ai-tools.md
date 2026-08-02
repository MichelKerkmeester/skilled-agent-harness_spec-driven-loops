> For clean Markdown of any page, append .md to the page URL.
> For a complete documentation index, see https://developers.webflow.com/llms.txt.
> For AI client integration (Claude Code, Cursor, etc.), connect to the MCP server at https://developers.webflow.com/_mcp/server.

# MCP server and AI tools

> Webflow's MCP server and AI tools for building with Webflow APIs

<img src="https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/307e7d3ea1afcd433f7d946be876f1e4f1bd55a6ad1b8d320b66d69b2bd611ab/products/data/pages/Resources/assets/mcp_hero.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T182907Z&X-Amz-Expires=604800&X-Amz-Signature=5e6ba9482420a0e2e8c0b84d67b81beab572f7db166449a06f9841d1b4315fba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="MCP Hero Image" />

The Model Context Protocol (MCP) server connects your AI tools directly to your Webflow projects. Prompt an AI agent to update designs, manage site data, and work with the CMS from your preferred AI environment.

For developers using AI-powered tools like [Cursor](https://www.cursor.com/) or [Claude Desktop](https://claude.ai/download), the MCP server enhances an agent’s understanding of your Webflow projects. It's built on Webflow’s APIs, exposing them as tools your AI agent can use to create elements, styles, and variables on the canvas, as well as manage collections, custom code, assets, and other site data.

See the full list of available tools in the [MCP server documentation](https://www.npmjs.com/package/webflow-mcp-server).

## Installation

Get started by installing Webflow's remote MCP server, which uses OAuth to authenticate with your Webflow sites, and a companion app that syncs your live canvas with your AI agent.

#### Companion app

The MCP server companion app can only be installed when you authorize the MCP server to your sites/workspace. It is not a public app on the Webflow app marketplace.

For local installation, please refer to the instruction in the [NPM package documentation](https://www.npmjs.com/package/webflow-mcp-server).

### Requirements

Node.js version **22.3.0** or higher.

#### Node.js Version Management

Currently, the MCP server only supports Node.js version **22.3.0** or higher. See the [Node.js compatibility](#nodejs-compatibility) section for more information on troubleshooting Node.js issues.

<br />

#### Claude Desktop

Webflow provides a connector that you can use in Claude Desktop.
It provides direct access to the MCP server.

#### Open the list of connectors

In the Claude chat window, click the `+` symbol and then click `Add connectors`.

<img src="https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/5978b53a9f117dedbd4c12981676274630a99bd5e30e333b1281a61094b1a825/products/assets/images/claude-add-connector.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T182907Z&X-Amz-Expires=604800&X-Amz-Signature=e23866e5865b95602457aa715917d7e15d8f1f0cf920d0fc60dac85bb27610f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Add connector option in the drop-down list" />

#### Find the Webflow connector

Search for the Webflow connector by name.
You may need to select **All** instead of **Featured** to see it.

#### Select the Webflow connector

Click the Webflow connector and then click `Connect` to install it.

#### Grant access

Grant Claude access to your Webflow account and log in to your Webflow account if you are prompted to do so.

#### Select sites or Workspaces

Select the Webflow sites and Workspaces to give Claude access to and then click `Authorize App`.

<img src="https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/6ccc744c3720df5b29b183b9cb55a4c9e56ea15429c0c1ad09755d6524fe36ef/products/assets/images/claude-connector-select-sites.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T182907Z&X-Amz-Expires=604800&X-Amz-Signature=91901a9034e7b3edbb43a64fc1c25e356c23b5cadfe31daa1405c54fa6392366&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Add connector option in the drop-down list" />

#### Write your first prompt

Start interacting with the MCP server in your AI agent's chat window. Try prompts like:

```
List all my collections and show me their field structures
```

```
Audit my site for broken links, missing alt text, and incomplete meta descriptions
```

```
Create a responsive hero section with a headline, description, and CTA button
```

#### Cursor

Webflow provides a plugin that you can use in Cursor.
It provides direct access to the MCP server.

#### Find the Webflow plugin

In the [Cursor Marketplace](https://cursor.com/marketplace), find the [Webflow plugin](https://cursor.com/marketplace/webflow) and install it in.

#### Add the plugin to Cursor

Click **Add to Cursor**.

#### Grant access

The first time you use the Cursor plugin, grant Cursor access to your Webflow account and log in to your Webflow account if you are prompted to do so.

#### Select sites or Workspaces

Select the Webflow sites and Workspaces to give Cursor access to and then click `Authorize App`.

#### Write your first prompt

Start interacting with the MCP server in your AI agent's chat window. Try prompts like:

```
List all my collections and show me their field structures
```

```
Audit my site for broken links, missing alt text, and incomplete meta descriptions
```

```
Create a responsive hero section with a headline, description, and CTA button
```

#### Start with a fresh project for better MCP performance

MCP servers perform more efficiently with smaller codebases. In Cursor, create a new project when using the MCP server to reduce tool call overhead and improve response times.

#### Windsurf

#### Add the MCP server to the configuration

1. Navigate to `Windsurf → Settings → Windsurf Settings`
2. Scroll down to the `Cascade` section → `MCP Servers` → `Manage MCPs`
3. Click the "View raw config" button
4. Paste the following configuration (or add the `webflow` part to your existing configuration):

   ```json mcp_config.json
   {
     "mcpServers": {
       "webflow": {
         "serverUrl": "https://mcp.webflow.com/sse"
       }
     }
   }
   ```

   ```
   ```
5. Save and close the file

#### Authorize the MCP server

1. Click the "Refresh" button in the settings page
2. Windsurf will automatically open a new browser window showing an OAuth login page.
3. Authorize the Webflow sites you want the MCP server to access. This will also automatically install the [companion app](#designer-companion-app) to any sites you authorize.

#### Limit authorized sites

Limit the number of sites for security and performance.

#### Open the Webflow Designer

Open your site in the Webflow Designer.

Or, type this prompt in your AI chat window:

```
Give me a link to open <MY_SITE_NAME> in the Webflow Designer
```

#### Open the MCP Webflow App

1. In the designer, open the Apps panel by pressing the `E` key.
2. Launch the "Webflow MCP Bridge App". This app was automatically installed during the OAuth authorization process.
3. Wait for the companion app to connect to the MCP Server

#### Write your first prompt

Start interacting with the MCP server in your AI agent's chat window. Try prompts like:

```
Analyze my last 5 blog posts and suggest 3 new topic ideas with SEO keywords
```

```
Find older blog posts that mention similar topics and add internal links to my latest post
```

```
Create a hero section card on my home page with a CTA button and responsive design
```

**Resetting your OAuth token**

If you need to reset your authorization, you can run the following command before restarting your MCP client.

#### Claude Desktop

Please run following command and then restart your Claude Desktop.

```bash
rm -rf ~/.mcp-auth
```

#### Cursor

Go to the MCP Settings panel and click the "Logout" button.

#### Windsurf

Go to the MCP Configuration page and click the "Refresh" button.

### Node.js compatibility

Currently, the MCP server only supports Node.js version **22.3.0** or higher. If you encounter issues with Node.js you can try the below approaches to troubleshoot:

#### Use version \*\*22.3.0\*\* as your default Node.js version

To use version **22.3.0** as your default Node.js version, follow these steps:

#### Install NVM

If you don't have `nvm` installed, you can install it with the following command (or download from [`nvm` releases](https://github.com/nvm-sh/nvm/releases)).

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

#### Restart your terminal

Restart your terminal or run:

```bash
source ~/.bashrc
```

#### Install Node.js 22.3.0

Run the following command to install Node.js 22.3.0:

```bash
nvm install 22.3.0
```

#### Set \*\*22.3.0\*\* as the default Node.js version

Run the following command in your terminal to set **22.3.0** as the default Node.js version:

```bash
nvm use 22.3.0
nvm alias default 22.3.0
```

#### Clear your \`npx\` cache

Run the following command to clear your `npx` cache:

```bash
rm -rf ~/.npm/_npx
```

#### Verify installation

Run the following command to verify your Node.js installation:

```bash
 node --version
 npm --version
```

#### Restart your AI Client

Restart your AI client and verify the MCP server is working.

#### Use Node Version Switcher

To use [Node Version Switcher](https://github.com/jasongin/nvs) (`nvs`) with the MCP server, follow these steps:

#### Install \`nvs\`

Install Node Version Switcher using one of these methods:

#### macOS/Linux

```bash
git clone https://github.com/jasongin/nvs ~/.nvs && ~/.nvs/nvs.sh install
```

#### Windows

```bash
choco install nvs
```

#### Install Node.js 22.3.0

Install the required Node.js version with `nvs` by running the following command in your terminal:

```bash
nvs add 22.3.0
```

#### Use version \*\*22.3.0\*\*

Use the version **22.3.0** with `nvs` by running the following command in your terminal:

```bash
nvs use 22.3.0
```

#### Install mcp-remote

Install the MCP remote package using `nvm` with Node.js 22.3.0:

```bash
nvm use 22.3.0
npm install -g mcp-remote
```

#### Get required paths

Get the paths needed for your MCP configuration:

**Node.js path:**

```bash
nvs which 22.3.0
```

**mcp-remote path:**

```bash
which mcp-remote
```

#### Configure MCP server

Add this configuration to your AI client's MCP settings, replacing the paths with your actual paths:

```json
{
  "mcpServers": {
    "webflow": {
      "command": "/path/to/your/nvs/node/22.3.0/bin/node",
      "args": [
        "/path/to/your/mcp-remote",
        "https://mcp.webflow-sai.com/sse"
      ]
    }
  }
}
```

#### Verify installation

Restart your AI client and verify the MCP server is working.

Many thanks to [@jessehouwing](https://jessehouwing.net/vscode-running-mcp-using-node-version/) for the inspiration and guidance on using `nvs` with the MCP server.

***

## How the MCP server works

The Webflow MCP server implements [Anthropic's Model Context Protocol specification](https://docs.anthropic.com/en/docs/model-context-protocol-mcp) to standardize communication between AI agents and Webflow's APIs.

### Architecture

The server acts as a translation layer that exposes Webflow's APIs as MCP tools. Built as an [open-source package](https://github.com/webflow/mcp-server), it wraps Webflow's REST and Designer APIs into a format that any MCP-compatible AI agent can understand and execute.

### Remote deployment

The server runs remotely to enable OAuth authentication, allowing you to:

* Authorize multiple Webflow sites without storing API keys locally
* Maintain secure, token-based access to your projects

This architecture eliminates the need to manage API credentials in your local environment while providing secure access to your Webflow projects.

#### Remote authorization is currently experimental

Remote authorization relies on the [`mcp-remote` npm package](https://www.npmjs.com/package/mcp-remote), which is currently considered experimental.

### Available tools

The MCP server exposes Data and Designer APIs as MCP tools. See the complete list of available tools and their parameters in the [MCP server repository](https://github.com/webflow/mcp-server/tree/main/src/tools).

#### Designer API tools

[**Designer API**](/designer/reference/introduction) tools enable real-time canvas manipulation:

* **Visual design**: Create and modify elements, styles, and components
* **Layout control**: Manage responsive breakpoints and positioning
* **Design system**: Work with variables, classes, and component instances
* **Live preview**: See changes instantly in the Designer interface

#### Designer companion app

Designer API calls are executed through a companion app that automatically installs to your authorized sites after OAuth authorization. **The companion app must remain open in the Webflow Designer** for Designer API tools to function. However, you can minimize it once connected.

<img src="https://fdr-prod-docs-files-public.s3.us-east-1.amazonaws.com/https%3A//webflow.docs.buildwithfern.com/02ae17428a9bc1c3d5ed26bc14b44a66d935ef85970e30b85f6c2b0d64c15ddb/products/data/pages/Resources/assets/bridge-app.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6KXJSKKNFOCF7G4B%2F20260802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260802T182907Z&X-Amz-Expires=604800&X-Amz-Signature=954c7e481f4c6909201456c349be8c01b5a50e08747fdea0a4040ff7767252af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="MCP Bridge App" />

#### Data API tools

[**Data API**](/data/reference/rest-introduction) tools access your site's content and structure for bulk operations and content synchronization:

* **CMS operations**: Create, read, update, and delete collection items
* **Asset management**: Upload, organize, and manage media files
* **Site metadata**: Access site settings, domains, and configuration

## LLMS.txt documentation

With Webflow's LLMS.txt file, you can access Webflow's documentation in your AI client without needing to load the webpage in your browser. This optimized structure helps LLMs respond with accurate code snippets and multi-step sequences.

* **LLMS.txt** <br />
  Use [`https://developers.webflow.com/llms.txt`](https://developers.webflow.com/llms.txt) to access the LLM-readable documentation.
* **Markdown docs**<br />
  Additionally, you can access markdown versions of any page on the docs site to provide a more structured and context-rich experience for LLMs. To access the markdown version of a page, add `.md` to the end of the URL. For example, this current doc is available as a markdown file at [`https://developers.webflow.com/data/docs/ai-tools.md`](https://developers.webflow.com/data/docs/ai-tools.md).

**Using LLMS.txt docs with Cursor**

In the chat, click the `@` button

Find the "Docs" option

Click "Add new doc"

Paste in the following link: <code>[https://developers.webflow.com/llms.txt](https://developers.webflow.com/llms.txt)</code>

Once configured, reference Webflow's documentation by typing `@Docs` in your chat window and selecting "Webflow" from the list.

***

## FAQs and troubleshooting

### Installation and authentication

#### Why is my MCP server not appearing in my AI client?

After installing the MCP server, you may need to restart your AI client to see the new server. Additionally, check to see that your client (for example, Cursor, Claude Desktop) is updated to the latest version.

#### How can I authenticate a different Webflow site?

To authenticate a different Webflow site, you'll need to remove the existing authentication token by running the following command in your terminal:

```bash
rm -rf ~/.mcp-auth
```

After executing the command, a new authentication screen should appear, allowing you to select the site you want to authenticate with.

#### I'm getting an error when loading the remote MCP server

You may receive an `500` error when loading the remote MCP server.

1. Try refreshing your OAuth token with the following command and then restart your AI client:
   ```bash
   rm -rf ~/.mcp-auth
   ```

2. Check your current Node.js version to ensure you're using version **22.3.0** or higher:

   ```bash
   node --version
   ```

   If you can't use **versions 22.3.0** or higher as your default Node.js version, follow the [Node.js compatibility](#nodejs-compatibility) section to troubleshoot compatibility issues.

#### Troubleshooting Node.js and NPM issues

**Ensure Node.js and NPM are properly installed**

1. Verify Node.js and NPM installation by running:
   ```bash
   node -v
   npm -v
   ```
2. If you encounter issues with `npx`, try clearing your NPM cache:
   ```bash
   npm cache clean --force
   ```
3. If `npm -v` only works with `sudo`, you may need to fix NPM global package permissions. See the [official NPM docs](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) for more information.

If the issue persists, see the [Node.js compatibility](#nodejs-compatibility) section above for version requirements.

If you make changes to your shell configuration, you may need to restart your shell for changes to take effect.

#### The sites I want to authorized are greyed out on the authorization page

Currently, only site owners and admins can authorize the MCP server and app. If you aren't a site owner or admin, you can't authorize the MCP server and app.

### Tools and prompts

#### The MCP Server can't connect to the Webflow Designer

To use the MCP server with the Webflow Designer, open the "MCP Bridge App" from the Apps panel. Once open, the app will automatically connect to the MCP server.

**You must keep the companion app open in the Webflow Designer for the MCP server to connect.**

#### What tools are available?

The open-source MCP server package includes tools for AI agents. View the complete list in the [GitHub repository](https://github.com/webflow/mcp-server/tree/main/src/tools).

Some of these tools and capabilities include but are not limited to:

* **Designer tools**:
  * Create and manage Webflow elements, sections, and whole pages on the canvas
  * Create and manage styles, variables, and breakpoints
  * Create and manage Webflow component structure and instancing on pages
  * Manage Webflow assets, metadata (including alt text), and folders
  * Build visually using your own design system in place
* **Data tools**:
  * CMS
    * Create and read collection data
    * Create and update collection fields
    * Create, update, and delete collection items (including locale-specific content)
      * Note: You can create and delete items directly in the live site, or you can create queued/drafted items to publish later
  * Localization
    * Read and update static page/component content in secondary locales
    * Read and update default component properties in secondary locales
    * Read and update CMS item content in secondary locales
  * Custom Code
    * List registered scripts for a site and which of those scritps are applied to the site
    * Register and apply custom code inline for a site
    * Delete all scripts from a site
  * Pages
    * Retrieve a list of pages on the site
    * Read and update page metadata (including SEO and Open Graph settings)
* **Developer docs tools**:
  * Ask any question about Webflow's developer documentation

#### Can I use all available API endpoints and Methods with the MCP server?

Currently, the MCP server supports a limited set of tools for the Data and Designer APIs.

#### Does Webflow need to be open to use the MCP server?

If you're only using the Data API tools, you can use the MCP server to update content even if Webflow isn't open in the browser.

If you're using the Designer API tools, you need to keep the [companion app](#designer-companion-app) open in the Webflow Designer for the MCP server to work.

#### Can I localize content with the MCP server?

Currently, the MCP server supports localizing static content, and updating existing localized CMS items. **However, the MCP server doesn't support creating new localized CMS items.**