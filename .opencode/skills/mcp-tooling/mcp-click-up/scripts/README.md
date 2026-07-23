---
title: "scripts: ClickUp MCP Setup and Diagnostics"
description: "Install and read-only diagnostic scripts for the mcp-click-up transport, the ClickUp mode of the mcp-tooling hub."
---

# scripts: ClickUp MCP Setup and Diagnostics

---

## 1. OVERVIEW

`scripts/` holds the setup and diagnostic scripts for `mcp-click-up`, the ClickUp transport mode of the `mcp-tooling` hub. `install.sh` installs the `cupt` CLI and prints the official ClickUp MCP configuration snippet. `doctor.sh` reports the local environment without changing it. Neither script writes to `opencode.json` or `.utcp_config.json`, both only print.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `install.sh` | Checks the Python version, installs `cupt` via `pipx` (falling back to `pip install --user`), prints authentication instructions for a personal API token or OAuth, and prints the official ClickUp MCP manual snippet for `.utcp_config.json`. Supports `--check-only` and `--mcp-only`. |
| `doctor.sh` | Read-only diagnostics. Reports the platform, Node and npm versions, whether `cupt` resolves on `PATH` with its version, whether `pipx` or `pip` is available, and whether a ClickUp manual pointing at `mcp.clickup.com` is registered in `.utcp_config.json`. Changes nothing and installs nothing. |

## 3. VALIDATION

Run from the repository root.

```bash
bash .opencode/skills/mcp-tooling/mcp-click-up/scripts/doctor.sh
bash .opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh --check-only
```

Expected result: `doctor.sh` prints a checklist with no red `✗` lines. `install.sh --check-only` reports the `cupt` install status without installing anything.

## 4. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`../INSTALL-GUIDE.md`](../INSTALL-GUIDE.md)
