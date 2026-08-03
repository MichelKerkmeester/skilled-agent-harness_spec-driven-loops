---
title: mcp-magnific
description: Official remote Magnific MCP transport for the mcp-tooling hub: generation, editing, creations history, Spaces, custom references, and model catalogs through Code Mode, with sk-design as the mandatory creative-judgment partner.
trigger_phrases:
  - "magnific"
  - "magnific mcp"
  - "magnific creative generation"
  - "image upscale"
version: 0.1.0.0
---

# mcp-magnific

> Official Magnific platform through Code Mode, as a **transport** — the packet never decides
> creative judgment: `sk-design` does.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Magnific generation (image, video, audio, 3D), editing (upscale, relight, resize, layers), creations-history browsing, Spaces workflows, custom-reference (LoRA-style) training, and model/voice catalogs — all through the official remote MCP |
| **Invoke with** | "magnific", "magnific mcp", "magnific creative generation", or hub routing on Magnific keywords (registration lands in the hub registration phase) |
| **Works on** | The official remote server at `https://mcp.magnific.com` (streamable HTTP, OAuth 2.0), bridged by `npx mcp-remote` through a Code Mode manual template (wiring lands in the runtime integration phase) |
| **Needs** | A paid Magnific account, operator browser OAuth on first use, and per-session live discovery |

## 2. STATUS

| Item | Status |
|------|--------|
| Transport + auth contract | Verified (live wire probes + official docs, 2026-08-02) |
| Tool inventory | ~34 names documented officially; live schemas pending operator OAuth |
| Code Mode manual | Not yet registered (runtime integration phase) |
| Hub registration | Not yet applied (hub registration phase) |
| Full executable contract | Not yet authored (skill authoring phase) |

## 3. OPERATION CLASSES

- **Read-only / no-cost**: balance, creations search/get, spaces/folders listing, model/voice catalogs.
- **Credit-consuming**: generation (image/video/audio/3D), transformation (upscale/crop/resize/background/SVG), training (`custom_references_create`).
- **Destructive**: `folders_delete`.
- Every credit-consuming or destructive call requires explicit operator confirmation with a stated expected output and spend boundary.

## 4. FILES

| Path | Purpose |
|------|---------|
| `SKILL.md` | Frozen architecture contract (scaffold); full operational contract lands in the authoring phase |
| `changelog/` | Packet release notes |
| `references/` | Planned: tool surface, MCP wiring, troubleshooting (authoring phase) |
| `examples/` | Planned: worked call patterns (authoring phase) |
