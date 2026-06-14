---
title: "mcp-magicpath scripts: CLI installer"
description: "Automation for the mcp-magicpath skill. Holds the global magicpath-ai CLI installer."
trigger_phrases:
  - "mcp-magicpath scripts"
  - "magicpath install script"
  - "magicpath-ai installer"
importance_tier: normal
contextType: general
---

# mcp-magicpath scripts: CLI installer

---

## 1. OVERVIEW

`scripts/` holds the automation for the mcp-magicpath skill. It owns one script, `install.sh`, which installs the `magicpath-ai` CLI globally with npm and verifies the version.

Current state:

- `install.sh` runs `npm install -g magicpath-ai`, checks Node 16+ and npm, prints the login steps, and is idempotent on re-run.
- For an in-skill local vendor instead of a global install, use `../mcp-servers/magicpath-cli/setup.sh`.
- All skill docs also work through `npx -y magicpath-ai` with no install at all.

---

## 2. DIRECTORY TREE

```text
scripts/
+-- install.sh    # Global magicpath-ai CLI installer (npm install -g)
`-- README.md     # This file
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `install.sh` | Check Node and npm, install `magicpath-ai` globally, verify the version, print login steps |

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `bash install.sh` | CLI | Install the CLI globally |
| `bash install.sh --check-only` | CLI | Report install status without installing |
| `bash install.sh --force` | CLI | Reinstall even when already present |

---

## 5. VALIDATION

Run from the repository root.

```bash
bash .opencode/skills/mcp-magicpath/scripts/install.sh --check-only
```

Expected result: prints `magicpath-ai X.Y.Z already installed` when the CLI is present, or reports that it will install.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`../INSTALL_GUIDE.md`](../INSTALL_GUIDE.md)
- [`../mcp-servers/magicpath-cli/README.md`](../mcp-servers/magicpath-cli/README.md)
