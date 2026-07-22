---
title: "scripts: Chrome DevTools MCP Setup and Diagnostics"
description: "Install and read-only diagnostic scripts for the mcp-chrome-devtools transport, the Chrome DevTools mode of the mcp-tooling hub."
---

# scripts: Chrome DevTools MCP Setup and Diagnostics

---

## 1. OVERVIEW

`scripts/` holds the setup and diagnostic scripts for `mcp-chrome-devtools`, the Chrome DevTools transport mode of the `mcp-tooling` hub. Both scripts install and verify the `bdg` CLI (`browser-debugger-cli`) that the skill uses to drive Chrome DevTools Protocol sessions. Neither script touches `.utcp_config.json` or any secret.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `install.sh` | Installs `browser-debugger-cli@alpha` globally via npm, detects the local Chrome, Chromium, or Edge path, optionally writes `CHROME_PATH` to the shell profile with `--add-profile`, and verifies the `bdg` command with `bdg --version` and `bdg --list`. |
| `doctor.sh` | Read-only diagnostics. Reports the platform, Node and npm versions, whether `bdg` resolves directly or via `npx --no-install`, whether a Chrome, Chromium, or Edge binary is found at common paths, and whether a `chrome_devtools` manual is registered in `.utcp_config.json`. Changes nothing and installs nothing. |

## 3. VALIDATION

Run from the repository root.

```bash
bash .opencode/skills/mcp-tooling/mcp-chrome-devtools/scripts/doctor.sh
bash .opencode/skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh --verbose
```

Expected result: `doctor.sh` prints a checklist with no red `✗` lines. `install.sh` exits 0 after `bdg --version` and `bdg --list` succeed.

## 4. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`../INSTALL-GUIDE.md`](../INSTALL-GUIDE.md)
