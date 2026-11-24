---
title: "scripts: Chrome DevTools MCP Setup and Diagnostics"
description: "Install and read-only diagnostic scripts for the mcp-chrome-devtools transport, the Chrome DevTools mode of the mcp-browser-use hub."
version: 1.0.3.0
---

# scripts: Chrome DevTools MCP Setup and Diagnostics

---

## 1. OVERVIEW

`scripts/` holds the setup and diagnostic scripts for `mcp-chrome-devtools`, the Chrome DevTools transport mode of the `mcp-browser-use` hub. `install.sh` installs and verifies the `bdg` CLI (`browser-debugger-cli`) that the skill uses to drive Chrome DevTools Protocol sessions. `doctor.sh` never installs anything: it only reports whether `bdg` is already resolvable, directly or via `npx --no-install`. Neither script touches `.utcp_config.json` or any secret.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `install.sh` | Installs `browser-debugger-cli@0.6.10` globally via npm. The version is pinned on purpose, because the docs describe 0.6.10. It also looks for a Chrome or Chromium binary at common macOS, Linux and WSL paths. It checks no Edge path. It requires Node.js 20 or higher, which bdg 0.6.10 needs. With `--add-profile` and a browser found away from the default location, it writes `CHROME_PATH` to the shell profile. It then confirms `bdg` resolves, runs `bdg --version` and counts the CDP domains with `bdg cdp --list`. |
| `doctor.sh` | Read-only diagnostics. Reports the platform, Node and npm versions, whether `bdg` resolves directly or via `npx --no-install`, a warning when the installed `bdg` is not the pinned 0.6.10, whether a Chrome, Chromium, or Edge binary is found at common paths, and whether a `chrome_devtools` manual is registered in `.utcp_config.json`. Changes nothing and installs nothing. |

---

## 3. VALIDATION

Run from the repository root.

```bash
bash .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/doctor.sh
bash .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh --verbose
```

Expected result: `doctor.sh` prints a checklist with no red `✗` lines. `install.sh` exits 0 once `bdg` resolves on `PATH` and logs `CDP domains available: 53` for bdg 0.6.10. The same count comes from `bdg cdp --list | jq '.count'`.

---

## 4. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`../INSTALL-GUIDE.md`](../INSTALL-GUIDE.md)
