---
title: "scripts: Obsidian MCP Setup and Diagnostics"
description: "Install and read-only diagnostic scripts for the mcp-obsidian transport, the Obsidian mode of the mcp-tooling hub."
---

# scripts: Obsidian MCP Setup and Diagnostics

---

## 1. OVERVIEW

`scripts/` holds the setup, diagnostic, and test scripts for `mcp-obsidian`, the Obsidian transport mode of the `mcp-tooling` hub. `install.sh` installs the headless `notesmd-cli`, prints the steps to enable the official `obsidian` CLI, and prints the Obsidian MCP configuration snippet plus its env keys. `doctor.sh` reports the local environment without changing it. `run-scenarios.sh` exercises the 11 plugin playbook scenarios headlessly, each in its own disposable throwaway-vault workspace. None of the three scripts writes to `opencode.json`, `.utcp_config.json`, or `.env`; `install.sh` and `doctor.sh` only print, and `run-scenarios.sh` writes only inside a temporary workspace it creates.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `install.sh` | Checks prerequisites (Homebrew, Node for the MCP server), installs `notesmd-cli` via Homebrew (falling back to printed Scoop/AUR/source instructions), prints the in-app steps to enable the official `obsidian` CLI, and prints the `obsidian` MCP manual snippet plus the `obsidian_OBSIDIAN_*` env keys for `.utcp_config.json` / `.env`. Supports `--check-only` and `--mcp-only`. |
| `doctor.sh` | Read-only diagnostics. Reports the platform, Node/npm/npx versions, whether `notesmd-cli` and the official `obsidian` CLI resolve on `PATH`, whether an `obsidian` manual pointing at `obsidian-mcp-server` is registered in `.utcp_config.json`, whether the Local REST API is reachable at `OBSIDIAN_BASE_URL`, and whether `OBSIDIAN_API_KEY` is set (never printing its value). Changes nothing and installs nothing. |
| `run-scenarios.sh` | Headless regression harness for the 11 plugin playbook scenarios (`OBS-011`..`OBS-021`). Dispatches one sandboxed `cli-codex` runner per scenario into its own disposable throwaway-vault workspace (`workspace-write`, `TMPDIR` redirected), copies the `examples/` helpers and `assets/` fixtures in, runs each scenario's file-layer command sequence, and prints a per-scenario `RESULT: PASS/FAIL/SKIP` summary. `OBS-013` stages from the shipped offline release fixture, so the set needs no network. Requires the `codex` CLI. Takes an optional workdir argument; exits non-zero if any scenario FAILs. |

## 3. VALIDATION

Run from the repository root.

```bash
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh --check-only
```

Expected result: `doctor.sh` prints a checklist with no red `✗` lines (warnings for absent optional pieces are expected). `install.sh --check-only` reports the `notesmd-cli` install status without installing anything.

For the deeper file-layer regression pass over the plugin playbook, run the scenario harness (requires the `codex` CLI; each scenario runs in a disposable throwaway vault, so no real vault is touched):

```bash
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/run-scenarios.sh
```

Expected result: a `RESULT: PASS/FAIL/SKIP` line per scenario and a non-zero exit only if some scenario FAILs. App-render/reload steps report `SKIP` when no Obsidian app is available.

## 4. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`../INSTALL-GUIDE.md`](../INSTALL-GUIDE.md)
