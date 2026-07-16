---
title: "mcp-figma - Example Walkthroughs"
description: "Safe, worked walkthroughs for the mcp-figma skill: safe connect + daemon health, read-only inspect/export, and the optional Code Mode MCP context pull."
trigger_phrases:
  - "figma examples"
  - "figma-ds-cli example scripts"
  - "figma safe connect example"
  - "figma export walkthrough"
---

# mcp-figma - Example Walkthroughs

> Safe, worked walkthroughs for driving Figma Desktop through the silships `figma-ds-cli`, mirroring the skill's manual-testing-playbook scenarios. The default set is deliberately SAFE: detection, safe connect, daemon health, read-only inspect/export, and the opt-in MCP context pull. No destructive Figma write appears anywhere in this directory.

---

- 3.1 [safe-connect-daemon-health.sh](#31-safe-connect-daemon-healthsh)
- 3.2 [inspect-export-readonly.sh](#32-inspect-export-readonlysh)
- 3.3 [optional-mcp-context.md](#33-optional-mcp-contextmd)

---

## 1. OVERVIEW

This directory contains worked examples of the three everyday mcp-figma flows. Each mirrors one or more playbook scenarios and keeps the skill's gating model intact: read-only verbs run freely, exports demand an explicit output path with no silent overwrite, and every mutating or destructive verb stays gated exactly as `SKILL.md` defines.

### Key Safety Properties

**Binary discipline**
- Canonical binary is `figma-ds-cli`. The npm package named `figma-cli` is an UNRELATED tool, so the scripts never suggest `npm i -g figma-cli`.
- Full surface needs `figma-ds-cli >= 1.2.0` from the silships repo (npm publishes only the minimal 1.0.0 build).

**Gating fidelity**
- Safe connect only (`connect --safe`, plugin bridge, no patch). The yolo `app.asar` patch is gated behind explicit consent plus the `figma-ds-cli unpatch` rollback and never runs here.
- Destructive verbs (`node delete`, `var delete-all`, `undo`, `unwrap`, ...) require confirmation, an explicit target, and a one-line rollback. They are absent from these examples by design.
- The daemon token (`~/.figma-ds-cli/.daemon-token`) is never printed.

**Command provenance**
- Commands are illustrative per the playbook execution policy: verify exact flags with `figma-ds-cli --help` and per-subcommand `--help` on the live machine before grading a run.

---

## 2. PREREQUISITES

```bash
# Install the silships CLI (never 'npm i -g figma-cli')
bash .opencode/skills/mcp-tooling/mcp-figma/scripts/install.sh

# Verify
figma-ds-cli --version   # expect >= 1.2.0
```

**Required environment:**
- Figma Desktop OPEN with a file (the CLI drives the live session, no Figma API key).
- Node.js >= 18. macOS is the supported baseline.
- For the safe connect: the FigCli plugin manifest imported once, and Plugins -> Development -> FigCli open in Figma.
- For the optional MCP walkthrough only: Code Mode configured and `figma_FIGMA_API_KEY` in `.env`.

---

## 3. AVAILABLE WALKTHROUGHS

### 3.1 safe-connect-daemon-health.sh

**Purpose:** Verify the canonical binary, connect the SAFE way (plugin bridge, no patch), and confirm daemon health. Mirrors DETECT-001, CONNECT-001, and DAEMON-001.

**Usage:**
```bash
bash examples/safe-connect-daemon-health.sh
```

**What it does:**
1. Detects `figma-ds-cli` (verifies any bare `figma-cli` against the silships tool)
2. Prints the version (full surface needs >= 1.2.0)
3. Runs `figma-ds-cli connect --safe` (no `app.asar` patch, no CDP 9222 change)
4. Runs read-only `daemon status`, and `daemon diagnose` only when unhealthy
5. Never prints or deletes the daemon token

**Exit codes:** `0` connected and healthy, `1` binary missing or daemon unhealthy.

---

### 3.2 inspect-export-readonly.sh

**Purpose:** Read document structure and export the current selection/page as SVG to an explicit, non-existing path. Mirrors INSPECT-001 and EXPORT-001.

**Usage:**
```bash
# Timestamped default output under /tmp
bash examples/inspect-export-readonly.sh

# Explicit output path (must not already exist)
bash examples/inspect-export-readonly.sh /tmp/hero.svg
```

**What it does:**
1. Preflight: binary present, `daemon status` healthy
2. Read-only inspect (`node tree`, falling back to `find`)
3. Refuses to run if the output path already exists (no silent overwrite)
4. Exports via `export screenshot -f svg -o <path>` and confirms the file landed

**Exit codes:** `0` inspect + export succeeded, `1` preflight failed or output path existed.

---

### 3.3 optional-mcp-context.md

**Purpose:** Discovery-first walkthrough for the OPT-IN Framelink `figma` MCP via Code Mode: `list_tools()` / `tool_info()` before any call, the prefixed `figma_FIGMA_API_KEY` requirement, and a read-only `figma.figma_get_figma_data` pull. Mirrors MCP-001.

**Read it:** [`optional-mcp-context.md`](optional-mcp-context.md)

This one is a document rather than a shell script because the flow runs inside Code Mode's `call_tool_chain()`, not in bash.

---

## 4. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `figma-ds-cli not found` | CLI not installed | `bash .opencode/skills/mcp-tooling/mcp-figma/scripts/install.sh` |
| Safe connect fails | Figma Desktop closed, or FigCli plugin not running | Open Figma with a file, keep Plugins -> Development -> FigCli open |
| `daemon status` unreachable | Daemon idle-stopped (~60 min) or never started | `figma-ds-cli daemon diagnose`, then `daemon restart` |
| "Unauthorized" from daemon | Token mismatch | Diagnose then restart; NEVER auto-delete the token |
| Export refused | Output path already exists | Pick a fresh explicit path (no silent overwrite, by design) |

Full failure catalog: [`../references/troubleshooting.md`](../references/troubleshooting.md).

---

## 5. SEE ALSO

### Skill Documentation

- [`../SKILL.md`](../SKILL.md) - Routing, gating taxonomy, ALWAYS/NEVER rules
- [`../references/figma_cli_reference.md`](../references/figma_cli_reference.md) - CLI/daemon/connect model and command examples
- [`../references/tool_surface.md`](../references/tool_surface.md) - Read-only / mutating / destructive taxonomy
- [`../feature_catalog/feature_catalog.md`](../feature_catalog/feature_catalog.md) - Full capability inventory with class tags
- [`../manual_testing_playbook/manual_testing_playbook.md`](../manual_testing_playbook/manual_testing_playbook.md) - The scenario contracts these examples mirror

### Contributing

To add a new example: keep it inside the default-safe boundary (no destructive verb, no yolo patch, no `init-agent`), follow the existing pattern (`set -euo pipefail`, preflight, explicit output paths), verify flags against the live `--help`, and update this README with purpose, usage, and exit codes.

---

**Directory Version**: 1.0.0
**Last Updated**: 2026-07-16
**Maintained By**: AI Documentation
