---
title: "figma-cli"
description: "The silships figma-cli embedded in the mcp-figma skill: drives Figma Desktop from the terminal over a local daemon, with no Figma API key."
trigger_phrases:
  - "figma-ds-cli"
  - "figma cli install"
  - "figma cli naming trap"
---

# figma-cli

> The silships figma-cli embedded in the mcp-figma skill. Published to npm as `figma-ds-cli`, it drives Figma Desktop from the terminal (read, author, modify, and export designs, tokens, and components) over a local daemon, with no Figma API key.

---

## 1. OVERVIEW

`figma-ds-cli` is the silships terminal tool that gives a coding agent or operator direct control of an open Figma Desktop file: reading structure, authoring frames and components, managing tokens and variables, and exporting assets and code, all without a Figma API key. It talks to Figma over a local daemon rather than the REST API, so the live Desktop session is the source of truth.

This package is embedded in the `mcp-figma` skill as the primary transport. The skill's [`SKILL.md`](../../SKILL.md) owns the full command-safety model (read-only, mutating, destructive, arbitrary). This README only covers identifying, installing, and verifying the binary itself.

### Naming Trap (Read First)

The canonical binary is `figma-ds-cli`. The npm package literally named `figma-cli` is an UNRELATED tool (unic/figma-cli, bin `figma`), so never `npm i -g figma-cli`. The full command surface (safe connect, daemon, extract, the ~130-command set) is the silships repo build (1.2.0 or newer). npm currently publishes only the minimal 1.0.0.

| Aspect | Value |
|---|---|
| Canonical binary | `figma-ds-cli` |
| Source | [silships/figma-cli](https://github.com/silships/figma-cli) |
| npm package (minimal 1.0.0 build) | [`figma-ds-cli`](https://www.npmjs.com/package/figma-ds-cli) |
| Unrelated npm package | `figma-cli` (unic/figma-cli, bin `figma`, never install) |

---

## 2. QUICK START

```bash
bash setup.sh                 # auto: npm first, then upgrade from the silships repo when npm is stale
bash setup.sh --source repo   # force the full repo build
```

`setup.sh` delegates to the skill's canonical installer (`../../scripts/install.sh`), which never connects, never patches Figma, and never installs the unrelated `figma-cli` package.

```bash
figma-ds-cli --version        # expect >= 1.2.0
figma-ds-cli --help           # full command surface
```

Expected result: a silships version string of `1.2.0` or newer, and a `--help` listing covering connect, daemon, extract, tokens, render, and export command groups.

---

## 3. REQUIREMENTS

| Requirement | Minimum | Notes |
|---|---|---|
| Node.js | >= 18 | Setup exits below Node 18 |
| Figma Desktop | Open with a file | The CLI drives the live Desktop session, so nothing works without it |
| Operating system | macOS | The supported baseline. Linux and Windows are experimental and unverified |
| Figma API key | None | The local daemon drives the live Desktop session instead of the REST API |

Connect modes (the safe plugin bridge vs. the gated yolo patch), the daemon, and the optional Framelink MCP are covered in [`../../INSTALL_GUIDE.md`](../../INSTALL_GUIDE.md) and [`../../references/figma_cli_reference.md`](../../references/figma_cli_reference.md).

---

## 4. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| `figma-ds-cli: command not found` | The binary is not installed, or only the unrelated `figma-cli` npm package is on PATH | Run `bash setup.sh`, or install `figma-ds-cli` per [`INSTALL_GUIDE.md`](../../INSTALL_GUIDE.md). Never `npm i -g figma-cli` |
| A bare `figma-cli` command behaves strangely | It may resolve to unic/figma-cli rather than the silships build | Confirm the silships tool with `figma-cli --version` or `--help` before trusting it |
| Every command fails or hangs | Figma Desktop is closed, or open with no file | Open Figma Desktop with a file. The CLI has no API-key fallback |

---

## 5. RELATED RESOURCES

### Related Documents

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Runtime contract: command-safety model, routing, and rules |
| [`../../INSTALL_GUIDE.md`](../../INSTALL_GUIDE.md) | Full install and connect-mode setup |
| [`../../references/figma_cli_reference.md`](../../references/figma_cli_reference.md) | Binary identity, connect modes, daemon model, command examples |
| [`../../references/tool_surface.md`](../../references/tool_surface.md) | The read-only, mutating, and destructive command taxonomy |
| [`../figma-mcp/README.md`](../figma-mcp/README.md) | The optional Figma MCP pointer, for pulling design context the other way |
