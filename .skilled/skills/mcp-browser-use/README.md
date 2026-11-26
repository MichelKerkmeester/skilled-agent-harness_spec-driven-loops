---
title: "mcp-browser-use"
description: "Parent hub for three browser modes: Chrome DevTools, Aside and Bladebro, routed by workflowMode through mode-registry.json."
trigger_phrases:
  - "mcp-browser-use"
  - "browser use hub"
  - "chrome devtools aside bladebro"
version: 1.1.5.0
---

# mcp-browser-use

> One advisor identity, three browser modes and one routing table that sends each browser request to the tool that owns it.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What it delivers |
|---|---|
| **Use it for** | Browser work in the MCP family: inspection and debugging, deterministic signed-in proof and stealth or agentic browsing |
| **Invoke with** | A request that names a browser mode, or the hub identity `mcp-browser-use` |
| **Routes to** | Three workflow packets through `mode-registry.json` and `hub-router.json` |
| **Produces** | The selected mode's result, or a disambiguation question when the request names no mode |

### What It Does

The hub is the single public skill identity for three browser modes. `hub-router.json` scores the request and picks one mode. `mode-registry.json` maps that mode to its packet folder. The hub itself holds no per-mode logic, so each packet keeps its own contract.

Generic browser-automation phrasing names no tool, so the hub asks which mode the reader means instead of guessing.

---

## 2. MODES AND PACKETS

Each mode is one packet folder with its own `SKILL.md`, `ROUTER.md` and changelog. The Chrome DevTools and Aside packets moved here with their full content, and the Bladebro packet is authored for this hub.

| Packet | Kind | Use it for | Pointer |
|---|---|---|---|
| `mcp-chrome-devtools/` | workflow | Chrome DevTools inspection, debugging, Lighthouse audits, performance traces and attaching to the user's own Chrome | [`README.md`](./mcp-chrome-devtools/README.md) |
| `mcp-aside-devtools/` | workflow | Deterministic signed-in REPL runs and captured REPL evidence | [`README.md`](./mcp-aside-devtools/README.md) |
| `mcp-bladebro/` | workflow | Stealth browsing, agentic branching and attachment to a caller-owned or already-open browser that names no Chrome | [`README.md`](./mcp-bladebro/README.md) |

The tie-break order is Chrome DevTools, then Aside, then Bladebro. It settles overlap between debugging and stealth work. It also settles overlap between signed-in proof and agentic signed-in work.

---

## 3. NAVIGATION

| File | What it holds | Why it matters |
|---|---|---|
| [`mode-registry.json`](./mode-registry.json) | The single source of truth for every mode | Resolve which packet owns a request |
| [`hub-router.json`](./hub-router.json) | Stage-one signals, vocabulary and tie-break order | See how a request scores against each mode |
| [`ROUTER.md`](./ROUTER.md) | Stage-two intent and resource maps | See which leaves a selected mode loads |
| [`leaf-manifest.json`](./leaf-manifest.json) | The generated inventory of routed leaves | Find the reference and asset files a mode loads |
| [`leaf-scopes.json`](./leaf-scopes.json) | Extra folders and files a mode may route to beyond its defaults. Only Chrome DevTools has an entry | See why the Lighthouse catalog leaf is routable for Chrome DevTools |

The manifest regenerates when packets change, so read it as a snapshot.

---

## 4. CHANGELOG

Releases live in `changelog/` with one file per release, named `v[version].md`. Each entry opens with the release title and the reason, then lists what changed and how to upgrade.

| Release | Entry |
|---|---|
| 1.1.5.0 | [`changelog/v1.1.5.0.md`](./changelog/v1.1.5.0.md) |
| 1.1.4.0 | [`changelog/v1.1.4.0.md`](./changelog/v1.1.4.0.md) |
| 1.1.3.0 | [`changelog/v1.1.3.0.md`](./changelog/v1.1.3.0.md) |
| 1.1.2.0 | [`changelog/v1.1.2.0.md`](./changelog/v1.1.2.0.md) |
| 1.1.1.0 | [`changelog/v1.1.1.0.md`](./changelog/v1.1.1.0.md) |
| 1.1.0.0 | [`changelog/v1.1.0.0.md`](./changelog/v1.1.0.0.md) |
| 1.0.0.0 | [`changelog/v1.0.0.0.md`](./changelog/v1.0.0.0.md) |

---

## 5. VERIFICATION

Run the parent-skill check on the hub and read the subject line before the verdict:

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-browser-use
```

The run passes when it ends with `OK: parent-skill-check`. Run the sk-doc validator on the hub skill file:

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/mcp-browser-use/SKILL.md
```
