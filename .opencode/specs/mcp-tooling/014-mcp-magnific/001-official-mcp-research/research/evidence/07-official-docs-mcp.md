Title: Magnific MCP - Magnific API

URL Source: https://docs.magnific.com/modelcontextprotocol

Markdown Content:
Magnific MCP is a remote server built on the [Model Context Protocol](https://modelcontextprotocol.io/). Once you connect it to an AI assistant, your agent can generate images and video, train consistent characters, upscale assets, and browse your generation history straight from the chat. Everything runs on your Magnific account and uses your existing credits.You don’t need to manage an API key. The first time a client connects, you sign in to your Magnific account and that’s it.

## Getting started

## Server endpoint

The Magnific MCP server lives at:

It uses the **streamable HTTP** MCP transport, so any modern MCP client can connect directly. You don’t need to install a bridge or run anything locally.

## Authentication

Magnific MCP uses **OAuth 2.0** with your Magnific account. The first time a client connects, it opens a browser window so you can sign in and approve access. After that, the client keeps the session and won’t ask you again.

### Discovery endpoints

MCP clients discover the OAuth configuration through standard well-known URLs:

| Resource | URL |
| --- | --- |
| Protected resource metadata | `https://mcp.magnific.com/.well-known/oauth-protected-resource` |
| Authorization server metadata | `https://mcp.magnific.com/.well-known/oauth-authorization-server` |

Most clients pick these up automatically when they hit the MCP endpoint without a valid token, so you usually don’t have to touch them.

## Connect your client

Every client asks for the same handful of details. Keep these on hand before you start:

| Field | Value |
| --- | --- |
| **Name** | `Magnific` |
| **URL** | `https://mcp.magnific.com` |
| **Authentication** | OAuth (sign in with your Magnific account when prompted) |

*   Claude Web

*   ChatGPT

*   Claude Code

*   Cursor

1.   Open Claude and click your profile menu, then choose **Customize**.
2.   Go to **Connectors** and click **Add connector**.
3.   Pick **Add custom connector**.
4.   Enter the **Name** (`Magnific`) and **URL** (`https://mcp.magnific.com`).
5.   Finish the **OAuth** sign-in to Magnific when Claude opens it.
6.   **Start chatting.** Ask Claude to generate, upscale, or look through your creations and it will reach for the right Magnific tool on its own.

1.   Open ChatGPT and click the **settings icon** in the top-right corner.
2.   Go to **Advanced settings** and turn **Developer mode** on.
3.   Open **Apps** and click **Create app**.
4.   Enter the **Name** (`Magnific`) and **URL** (`https://mcp.magnific.com`), then choose **OAuth** as the authentication method.
5.   Sign in to Magnific in the OAuth window that opens.
6.   **Start chatting.** ChatGPT will use Magnific whenever you ask for an image, a video, or an upscale.

Developer-mode custom apps are available on Pro, Business, and Enterprise plans.

Add the Magnific MCP server with a single command:

The first call from inside Claude Code opens the OAuth flow in your browser. Once you approve it, the Magnific tools are available in the session.

1.   Open Cursor settings and go to the **MCP** tab.
2.   Click **Add new global MCP server**.
3.   Paste the configuration below:

1.   Reload the server entry. Cursor will open your browser for the Magnific sign-in.

For more details, see [Cursor’s MCP documentation](https://docs.cursor.com/context/model-context-protocol).

Other MCP-compatible clients (Windsurf, VS Code, OpenClaw, Hermes, Codex, and so on) follow the same idea. Add `https://mcp.magnific.com` as a streamable HTTP MCP server, name it `Magnific`, and finish the OAuth sign-in when it pops up.

## Available tools

These are the tools the MCP server exposes. The names are stable across clients, so you can reference them directly in your prompts.

### Account

*   `account_balance`: current credit balance
*   `project_report`: overview of project usage

### Creations

*   `creations_search`: search your creations by query and filters
*   `creations_get`: fetch a single creation by identifier
*   `creations_show`: render creations inline in supported clients
*   `creations_wait`: wait for an in-progress creation to finish
*   `creation_status`: poll the status of an in-progress creation
*   `creations_request_upload` / `creations_upload` / `creations_finalize_upload`: upload an asset
*   `creations_move`: move a creation between folders

### Image generation and editing

*   `images_generate`: generate images from text and optional references
*   `images_generate_svg`: generate SVG output
*   `images_to_svg`: convert raster to SVG
*   `images_upscale`: Magnific upscaler
*   `images_crop`: smart crop
*   `images_resize`: resize
*   `images_remove_background`: alpha cutout
*   `images_models_list` / `images_models_show`: image model catalog

### Video generation

*   `video_generate`: generate video
*   `video_models_list` / `video_models_show`: video model catalog

### Audio

*   `audio_tts`: text-to-speech
*   `audio_voices_list` / `audio_voices_show`: voice catalog

### 3D

*   `models3d_generate`: generate a 3D model

### Custom references

*   `custom_references_create`: train a Soul character or style
*   `custom_references_list`: list trained references

### Folders and Spaces

*   `folders_list` / `folders_get` / `folders_create` / `folders_rename` / `folders_delete`
*   `spaces_list`: list your Spaces
*   `spaces_view`: inspect a single Space

### Discovery

*   `tools_show`: surface the picker UI for available tools

The MCP server is the source of truth. The live `tools/list` response always reflects the latest set of tools available.

## Frequently asked questions
