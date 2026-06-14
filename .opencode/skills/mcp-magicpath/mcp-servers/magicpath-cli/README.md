---
title: "magicpath-cli: in-skill CLI vendor"
description: "Vendors the magicpath-ai CLI into the mcp-magicpath skill via a local package.json and setup script."
trigger_phrases:
  - "magicpath-cli vendor"
  - "magicpath-ai package json"
  - "vendor magicpath cli locally"
importance_tier: normal
contextType: general
---

# magicpath-cli: in-skill CLI vendor

---

## 1. OVERVIEW

`magicpath-cli/` vendors the MagicPath CLI (`magicpath-ai`) into the skill, mirroring the `mcp-click-up/mcp-servers/` pattern. MagicPath has no MCP server, so this folder holds the CLI only.

Current state:

- `package.json` pins `magicpath-ai` and exposes `install` and `start` scripts.
- `setup.sh` runs `npm install` here to vendor the CLI into a local `node_modules`.
- `node_modules` is not committed. Run the setup once to populate it, or use the global install or `npx` instead.
- Source: GitHub `https://github.com/MagicPathAI/agent-skills`, npm `https://www.npmjs.com/package/magicpath-ai`.

---

## 2. DIRECTORY TREE

```text
magicpath-cli/
+-- package.json    # Pins magicpath-ai; install and start scripts
+-- setup.sh        # npm install into local node_modules
`-- README.md       # This file
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `package.json` | Declare the `magicpath-ai` dependency and the `start` entrypoint (`node node_modules/magicpath-ai/dist/cli.js`) |
| `setup.sh` | Vendor the CLI locally with `npm install` |

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `bash setup.sh` | CLI | Vendor `magicpath-ai` into local `node_modules` |
| `npm install` | CLI | Same vendor step, run directly |
| `node node_modules/magicpath-ai/dist/cli.js` | CLI | Run the vendored binary after install |

Alternatives that need no local vendor: `bash ../../scripts/install.sh` for a global install, or `npx -y magicpath-ai` to fetch on demand.

---

## 5. VALIDATION

Run from this directory.

```bash
bash setup.sh && node node_modules/magicpath-ai/dist/cli.js --version
```

Expected result: prints the installed version (for example `2.3.2`).

Requirements: Node.js 16+, network access to MagicPath, and a browser for `magicpath-ai login`. Authentication uses a browser session with no API keys, env vars, or config files.

---

## 6. RELATED

- [`../../SKILL.md`](../../SKILL.md)
- [`../../INSTALL_GUIDE.md`](../../INSTALL_GUIDE.md)
- [`../../references/cli_reference.md`](../../references/cli_reference.md)
- [`../../scripts/README.md`](../../scripts/README.md)
