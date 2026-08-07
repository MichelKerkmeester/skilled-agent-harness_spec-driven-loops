---
title: "scripts: Obsidian MCP Setup and Diagnostics"
description: "Install and read-only diagnostic scripts for the mcp-obsidian transport, the Obsidian mode of the mcp-tooling hub."
---

# scripts: Obsidian MCP Setup and Diagnostics

---

## 1. OVERVIEW

`scripts/` holds the setup and diagnostic scripts for `mcp-obsidian`, the Obsidian transport mode of the `mcp-tooling` hub. `install.sh` installs the headless `notesmd-cli`, prints the steps to enable the official `obsidian` CLI, and prints the Obsidian MCP configuration snippet plus its env keys. `doctor.sh` reports the local environment without changing it. Neither script writes to `opencode.json`, `.utcp_config.json`, or `.env` — both only print.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `install.sh` | Checks prerequisites (Homebrew, Node for the MCP server), installs `notesmd-cli` via Homebrew (falling back to printed Scoop/AUR/source instructions), prints the in-app steps to enable the official `obsidian` CLI, and prints the `obsidian` MCP manual snippet plus the `obsidian_OBSIDIAN_*` env keys for `.utcp_config.json` / `.env`. Supports `--check-only` and `--mcp-only`. |
| `doctor.sh` | Read-only diagnostics. Reports the platform, Node/npm/npx versions, whether `notesmd-cli` and the official `obsidian` CLI resolve on `PATH`, whether an `obsidian` manual pointing at `obsidian-mcp-server` is registered in `.utcp_config.json`, whether the Local REST API is reachable at `OBSIDIAN_BASE_URL`, and whether `OBSIDIAN_API_KEY` is set (never printing its value). Changes nothing and installs nothing. |

## 3. VALIDATION

Run from the repository root.

```bash
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh --check-only
```

Expected result: `doctor.sh` prints a checklist with no red `✗` lines (warnings for absent optional pieces are expected). `install.sh --check-only` reports the `notesmd-cli` install status without installing anything.

## 4. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`../INSTALL-GUIDE.md`](../INSTALL-GUIDE.md)
