---
title: "scripts: Notion MCP Setup and Diagnostics"
description: "Setup-snippet and read-only diagnostic scripts for the mcp-notion mode, the Notion MCP mode of the mcp-tooling hub."
trigger_phrases:
  - "notion scripts"
  - "notion install script"
  - "notion doctor script"
  - "notion mcp setup"
importance_tier: "supporting"
contextType: "reference"
version: 0.1.0.0
---

# scripts: Notion MCP Setup and Diagnostics

> Setup and read-only diagnostic scripts for `mcp-notion`, the Notion mode of the `mcp-tooling` hub.

---

## 1. OVERVIEW

`scripts/` holds the setup and diagnostic scripts for `mcp-notion`, the Notion MCP mode of the `mcp-tooling` hub. Notion is **MCP-only** — there is no CLI to install — so `install.sh` checks the Node/npx runtime and prints the Code Mode manual snippet plus the `notion_NOTION_TOKEN` env key. `doctor.sh` reports the local environment without changing it. Neither script writes to `opencode.json` or `.utcp_config.json`; both only print.

---

## 2. QUICK START

Run from the repository root.

```bash
bash .opencode/skills/mcp-tooling/mcp-notion/scripts/doctor.sh
bash .opencode/skills/mcp-tooling/mcp-notion/scripts/install.sh --check-only
```

Expected result: `doctor.sh` prints a checklist with no red `✗` lines when Node/npx are present. `install.sh --check-only` verifies the Node/npx runtime without printing the config snippet or installing anything.

---

## 3. STRUCTURE

| Path | Purpose |
|------|---------|
| `install.sh` | Checks that Node 18+ and `npx` are present, prints the `notion_NOTION_TOKEN` authentication instructions, and prints the official Notion MCP manual snippet for `.utcp_config.json`. Writes no config files. Supports `--check-only` and `--mcp-only`. |
| `doctor.sh` | Read-only diagnostics. Reports the platform, Node and npx versions, whether the `notion` manual referencing `@notionhq/notion-mcp-server` is registered in `.utcp_config.json`, and whether the `notion_NOTION_TOKEN` env key is set (presence only — never the value). Changes nothing and installs nothing. |

---

## 4. RELATED RESOURCES

- [`../feature-catalog/FEATURE-CATALOG.md`](../feature-catalog/FEATURE-CATALOG.md) — the full 24-tool + 5-gap capability inventory
- [`../manual-testing-playbook/manual-testing-playbook.md`](../manual-testing-playbook/manual-testing-playbook.md) — scratch-safe test scenarios
- [`../examples/README.md`](../examples/README.md) — Code Mode workflow index
