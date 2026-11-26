---
title: "bladebro-cli"
description: "Install pointer for the bladebro CLI, the npm launcher plus native Rust binary that mcp-bladebro drives, pinned to v4.8.2 with a release-sidecar digest check. Nothing vendored here."
trigger_phrases:
  - "bladebro cli install"
  - "install bladebro"
  - "bladebro binary"
  - "bladebro npm package"
version: 1.0.1.0
---

# bladebro-cli

> Install and verify the `bladebro` binary that mcp-bladebro drives as its primary surface. This folder is an install pointer, not vendored source.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Installing and verifying the `bladebro` CLI: the five tools `act`, `see`, `state`, `run` and `vision`, the `rb` real-browser lanes and the built-in `bladebro mcp` server. |
| **Invoke with** | `npm install -g --ignore-scripts bladebro@4.8.2` after an operator yes, then `bladebro --version` and `bladebro doctor`. |
| **Works on** | macOS arm64 or x64 with Node.js 14 or later and a Chromium-family browser. These are the only platforms with a recorded v4.8.2 digest. |
| **Produces** | A `bladebro` launcher on npm's global bin path, backed by the native `bladebro-darwin-arm64` or `bladebro-darwin-x64` binary. |

### Why This Package Exists

mcp-bladebro drives the real Bladebro binary rather than reimplementing it. This folder is not vendored source. It is the install pointer that the parent packet's [`INSTALL-GUIDE.md`](../../INSTALL-GUIDE.md) and [`scripts/install.sh`](../../scripts/install.sh) describe, and the full pin, digest and rollback detail lives in [`references/install-and-verify.md`](../../references/install-and-verify.md).

### What It Does

The npm package `bladebro` is a small Node launcher. The real program is a native Rust binary that npm pulls in as an optional dependency, with no postinstall script. A standalone prebuilt binary is also published on the upstream GitHub Releases page, and with its digest it is the higher-assurance route. Installing, updating and removing Bladebro are operator decisions every time.

---

## 2. QUICK START

**Step 1: Preflight.**

```bash
command -v bladebro || echo absent
node --version
```

Expected: `absent` before a first install, and Node 14 or later.

**Step 2: Install, only after an operator yes.** State the rollback first: `npm uninstall -g bladebro`.

```bash
npm install -g --ignore-scripts bladebro@4.8.2
```

Alternatively the operator runs the packet's wrapper, which adds the digest and version checks and removes the install on a mismatch: `bash ../../scripts/install.sh`.

**Step 3: Verify the digest before the binary first runs.** Compare the installed native binary's SHA-256 with the v4.8.2 release `.sha256` sidecar through `shasum -a 256 -c`. The recorded arm64 value is `7324e502b1710f8fb0a073b1f71d3647266d986a50e7351cb4257ec4eb5d8fa8`. Check the two JS launcher files too, `bin.js` and `binary.cjs` in `$(npm root -g)/bladebro`, against the values in `../../references/install-and-verify.md`.

**Step 4: Check the version and health.**

```bash
bladebro --version     # expect bladebro v4.8.2
bladebro doctor        # data root, browser and release state
```

Expected: the version line reads `v4.8.2`, and the doctor finds the data root and a Chrome or Chromium binary and calls Bladebro operational. Re-check every quoted flag with `bladebro help --json` on the installed binary.

---

## 3. TROUBLESHOOTING

| Symptom | Fix |
|---|---|
| `command not found: bladebro` | npm's global bin folder is not on PATH. Add `$(npm prefix -g)/bin` to PATH |
| The digest does not match the sidecar | Stop. Remove the install with `npm uninstall -g bladebro` and report it. Never run an unverified binary |
| `bladebro --version` reports an update | Stay on the pin. An update is a new install under the packet's supply-chain rule and needs an operator yes |

---

## 4. RELATED DOCUMENTS

- [`../../INSTALL-GUIDE.md`](../../INSTALL-GUIDE.md): the operator install walk-through
- [`../../references/install-and-verify.md`](../../references/install-and-verify.md): preflight, pin, digests, probes and rollback
- [`../../scripts/README.md`](../../scripts/README.md): the pinned install wrapper and the read-only doctor
- [`../bladebro-mcp/README.md`](../bladebro-mcp/README.md): the MCP server this binary hosts
- Upstream: `https://github.com/dondai44423/bladebro` (README, `docs/setup.md`, GitHub Releases)
