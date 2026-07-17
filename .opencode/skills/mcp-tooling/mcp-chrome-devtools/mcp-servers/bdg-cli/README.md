---
title: "bdg-cli"
description: "Install pointer for browser-debugger-cli (bdg), the primary CLI that mcp-chrome-devtools drives for terminal browser debugging. Nothing vendored here."
trigger_phrases:
  - "bdg cli install"
  - "browser-debugger-cli"
  - "install bdg"
version: 1.0.0.0
---

# bdg-cli

> Install and verify `bdg` (browser-debugger-cli), the primary CLI that mcp-chrome-devtools drives. This folder is an install pointer, not vendored source.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Installing and verifying `bdg`, the token-efficient terminal interface to the Chrome DevTools Protocol (300+ methods across 53 domains). |
| **Invoke with** | `npm install -g browser-debugger-cli@alpha`, then `bdg --version` and `bdg <url>`. |
| **Works on** | Node.js 18+ with Chrome/Chromium/Edge. macOS and Linux native; Windows via WSL only. |
| **Produces** | A working `bdg` binary on `PATH` able to start sessions, capture screenshots, read console logs, and export HAR files. |

---

## 2. OVERVIEW

### Why This Package Exists

mcp-chrome-devtools drives browser debugging through `bdg`, a real third-party CLI, rather than reimplementing that surface. This folder is not vendored source. It is the install pointer the parent skill's `INSTALL-GUIDE.md` and `scripts/install.sh` describe: the canonical, step-by-step install with validation checkpoints lives in [`../../INSTALL-GUIDE.md`](../../INSTALL-GUIDE.md).

### What It Does

`bdg` (browser-debugger-cli, MIT, [szymdzum/browser-debugger-cli](https://github.com/szymdzum/browser-debugger-cli)) opens a CDP session against a URL and exposes session commands (`bdg <url>` / `status` / `stop`), helper commands (screenshot, console, dom query/eval, network cookies, HAR export), discovery commands (`--list` / `--describe` / `--search`), and raw CDP execution (`bdg cdp <Method> ['<json>']`). One session is active at a time; there is no session selector.

---

## 3. QUICK START

**Step 1: Install.**

```bash
npm install -g browser-debugger-cli@alpha
```

Alternatively run the skill's embedded installer: `bash ../../scripts/install.sh`.

**Step 2: Verify.**

```bash
command -v bdg || echo "Installation failed"
bdg --version
bdg cdp --list | head -5
```

Expected: a path to the binary, a version string, and CDP domains (`Page, DOM, Network...`).

**Step 3: Smoke test.**

```bash
bdg https://example.com 2>&1
bdg dom screenshot /tmp/verify.png 2>&1
bdg stop 2>&1
ls -la /tmp/verify.png
```

---

## 4. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: bdg` | Not installed or npm bin not on `PATH` | `npm install -g browser-debugger-cli@alpha`; check `npm config get prefix` and add its `bin` to `PATH` |
| `Error: Could not find Chrome` | No resolvable browser binary | Set `CHROME_PATH` (see [`../../references/troubleshooting.md`](../../references/troubleshooting.md)) |
| Fails on native Windows | Windows is WSL-only | `wsl --install`, then install bdg inside WSL |

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Runtime routing between the bdg CLI and the Chrome DevTools MCP |
| [`../../INSTALL-GUIDE.md`](../../INSTALL-GUIDE.md) | Canonical step-by-step install with validation checkpoints |
| [`../../references/cdp_patterns.md`](../../references/cdp_patterns.md) | CDP command patterns and Unix composability |
| [`../chrome-devtools-mcp/README.md`](../chrome-devtools-mcp/README.md) | The MCP fallback this CLI is preferred over |
