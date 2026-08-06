---
title: mcp-magnific
description: Official Magnific generation and editing for the agent through the remote MCP bridged by Code Mode, with sk-design owning every creative judgment and this packet owning the transport.
trigger_phrases:
  - "magnific"
  - "magnific mcp"
  - "magnific creative generation"
  - "image upscale"
version: 0.1.1.0
---

# mcp-magnific

> Official Magnific generation and editing, reachable from the agent through the remote MCP bridged by Code Mode, with `sk-design` owning creative judgment and this packet owning the transport.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Magnific generation (image, video, audio and 3D), editing (upscale, relight, resize and layers), creations-history browsing, Spaces workflows, custom-reference (LoRA-style) training and model and voice catalog reads, all through the official remote MCP |
| **Invoke with** | "magnific", "magnific mcp", "magnific creative generation" or hub routing on Magnific keywords |
| **Works on** | The official remote server at `https://mcp.magnific.com` over streamable HTTP with OAuth 2.0, bridged by `npx mcp-remote` through a Code Mode manual template |
| **Needs** | A paid Magnific account, operator browser OAuth on first use and per-session live discovery |

---

## 2. OVERVIEW

### Why This Skill Exists

Magnific is a paid creative-generation platform with no local files and no command line of its own. Its only real surface is the official remote MCP server at `https://mcp.magnific.com`, which needs OAuth with a browser sign-in and live tool discovery before anything runs. An agent that guesses at that wiring wastes sessions and risks burning paid credits on the wrong call. This skill holds the verified contract instead: the bridge command, the auth flow, the operation classes and the confirmation gates, so the agent reaches Magnific only through the official path and `sk-design` decides what is worth generating.

### What It Does

The skill is a transport packet under the `mcp-tooling` hub. It bridges the official Magnific remote MCP into Code Mode with `npx -y mcp-remote https://mcp.magnific.com`, then serves generation, editing, creations-history browsing, Spaces workflows, custom-reference (LoRA-style) training and model and voice catalog reads from that single official surface. Creative direction never lives in the packet: `sk-design` owns judgment and this packet owns the wires. Every credit-consuming or destructive call sits behind an explicit operator confirmation with a stated expected output and spend boundary.

### The Operation Classes

| Class | What the skill can operate | Gate |
|---|---|---|
| **Read-only and no-cost** | balance checks, creations search and get, spaces and folders listing, model and voice catalogs | no confirmation needed |
| **Credit-consuming** | generation across image, video, audio and 3D, transformations such as upscale, crop, resize, background and SVG, plus `custom_references_create` training | explicit operator confirmation with a stated expected output and spend boundary |
| **Destructive** | `folders_delete` | explicit operator confirmation with a stated expected output and spend boundary |

---

## 3. STATUS

One row is shipped today. The rest stays planned until its owning phase lands.

| Item | Status |
|---|---|
| Transport and auth contract | Verified with live wire probes and official docs on 2026-08-02 |
| Tool inventory | About 34 tool names documented officially, live schemas pending operator OAuth |
| Code Mode manual | Not yet registered, the runtime integration phase owns the wiring |
| Hub registration | Not yet applied, the hub registration phase owns it |
| Full executable contract | Not yet authored, the skill authoring phase owns it |

The fixed part of the contract is the bridge itself: `npx -y mcp-remote https://mcp.magnific.com` with a browser OAuth flow on first use and credentials that never enter Git.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Use this mode when a request targets the Magnific platform: generation across image, video, audio or 3D, editing such as upscale, relight, resize or layers, creations-history browsing, Spaces workflows, custom-reference (LoRA-style) training or model and voice catalog reads. Every creative decision is reviewed by `sk-design` before anything runs, because the packet is the transport and the design skill is the taste. Skip the mode when the target surface is Figma or Obsidian, which the `mcp-figma` and `mcp-obsidian` siblings own. Skip it too when the work is plain application coding, which belongs to `sk-code`.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design` | Owns creative judgment, the packet stays the transport and never decides taste |
| `mcp-code-mode` | Owns the Code Mode MCP transport that the `npx mcp-remote` bridge attaches to |
| `mcp-figma` | Sibling transport mode, owns the Figma surface |
| `mcp-obsidian` | Sibling transport mode, owns the Obsidian surface |

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Frozen architecture contract for the scaffold, the full operational contract lands in the skill authoring phase |
| [`changelog/`](./changelog/) | Packet release notes, one entry per version |
| [`references/README.md`](./references/README.md) | Planned index, the tool surface, MCP wiring and troubleshooting references land in the authoring phase |
| [`examples/README.md`](./examples/README.md) | Planned index, worked call patterns land in the authoring phase |
| [`mcp-tooling hub README`](../README.md) | The hub that owns this transport packet |
| [`Skills Library`](../../README.md) | The skill catalog and routing front door |
