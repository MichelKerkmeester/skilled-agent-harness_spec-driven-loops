---
name: mcp-magnific
description: "Magnific MCP transport: official remote Magnific platform via Code Mode (generation, editing, creations history, Spaces, LoRAs, models); sk-design owns the creative judgment."
compatibility: "Requires a paid Magnific account with MCP access, the npx mcp-remote bridge, Node.js >=18, and a browser OAuth round-trip on first use."
allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 0.1.0.0
user-invocable: true
---

<!-- Keywords: mcp-magnific, magnific, magnific-mcp, image-generation, video-generation, upscale, creations, spaces, lora, custom-references, mcp-remote, code-mode, sk-design, creative-transport -->

# Magnific (mcp-magnific)

**Official remote Magnific MCP transport** — connects Code Mode to the full Magnific platform
(`https://mcp.magnific.com`): generation (image, video, audio, vector/3D), editing (upscale,
relight, resize, layers), creations history, Spaces workflows, custom references (LoRA-style
training), and model catalogs.

> **SCOPE OF THIS FILE (scaffold stage).** This packet is scaffolded under the Phase 2
> architecture contract of packet `mcp-tooling/014-mcp-magnific`. It freezes classification,
> permissions, judgment pairing, and spend gates. The full executable contract (activation
> triggers, intent router, per-tool guidance, discovery protocol) is authored in the packet's
> authoring phase; until then, treat this file as the architecture contract, not the operational
> guide.

---

## 1. ARCHITECTURE CONTRACT (frozen)

| Field | Value |
|-------|-------|
| `packetKind` | `transport` |
| `backendKind` | `code-mode-remote-mcp` |
| `mutatesWorkspace` | `false` — every write lands in the remote Magnific account, never this repo |
| `toolSurface.allowed` | `Read`, `Bash`, `Grep`, `Glob`, `mcp__code_mode__call_tool_chain` |
| `toolSurface.forbidden` | `Write`, `Edit`, `Task` |
| Runtime bridge | `npx -y mcp-remote https://mcp.magnific.com` (stdio) via a Code Mode manual template |
| Authentication | OAuth 2.0 browser flow (Keycloak `auth.magnific.com/realms/mcp`); token lives in `~/.mcp-auth/`, never in Git |
| Judgment owner | `sk-design` — this transport never decides taste |
| Advisor routing | `routingClass: metadata` under the single `mcp-tooling` hub identity (registered in the hub registration phase) |

## 2. OPERATION CLASSES AND GATES (frozen)

| Class | Examples | Gate |
|-------|----------|------|
| Read-only / no-cost | `account_balance`, `creations_search`, `creations_get`, `spaces_list`, `folders_list`, `images_models_list`, `audio_voices_list` | Discover freely after auth; no spend confirmation needed |
| Credit-consuming generation | `images_generate`, `video_generate`, `audio_tts`, `models3d_generate` | Explicit operator confirmation with stated expected output and spend boundary before every call |
| Credit-consuming transformation | `images_upscale`, `images_crop`, `images_resize`, `images_remove_background`, `images_to_svg` | Explicit operator confirmation with spend boundary |
| Credit-consuming training | `custom_references_create` | Explicit operator confirmation with spend boundary |
| Account/workspace writes | `creations_move`, `folders_create`, `folders_rename`, upload trio | Confirmation; no direct credit claim documented |
| Destructive | `folders_delete` | Explicit confirmation; deletion is irreversible in the remote account |

Rollback for the whole mode: remove the packet and its later registry entry; no other mode is
touched.

## 3. DISCOVERY STATUS (truthful baseline)

- Transport and auth: **VERIFIED** from live wire probes and official docs (2026-08-02).
- Tool names: **DOCUMENTED OFFICIALLY** (~34 stable names); live schemas **PENDING** an
  operator-authenticated session (registered manual + OAuth round-trip happen in the runtime
  integration phase).
- The live `tools/list` response is the source of truth and must be re-checked per session before
  relying on any tool name.

## 4. RULES

### ✅ ALWAYS
- Route through the `mcp-tooling` hub; never treat this packet as a standalone advisor identity.
- Load `sk-design` before any design-affecting request executes the transport.
- Confirm credit-consuming, training, and destructive calls immediately before the call, with
  expected output and spend boundary.
- Keep credentials and OAuth session state out of Git.

### ⛔ NEVER
- Never invent tool names or schemas — fail closed on drift from live discovery.
- Never execute a generation/transformation call without operator consent.
- Never write to this workspace through Magnific operations.
