---
title: "mcp-magicpath scripts: CLI installer and fidelity helper"
description: "Automation for the mcp-magicpath skill. Holds the global magicpath-ai CLI installer and the design-fidelity preview helper."
trigger_phrases:
  - "mcp-magicpath scripts"
  - "magicpath install script"
  - "magicpath-ai installer"
  - "design fidelity helper"
importance_tier: normal
contextType: general
---

# mcp-magicpath scripts: CLI installer and fidelity helper

---

## 1. OVERVIEW

`scripts/` holds the automation for the mcp-magicpath skill. It owns two scripts: `install.sh`, which installs the `magicpath-ai` CLI globally with npm and verifies the version, and `design_fidelity.py`, which fetches a canvas component's backend-rendered preview for the design parity fidelity check.

Current state:

- `install.sh` runs `npm install -g magicpath-ai`, checks Node 16+ and npm, prints the login steps, and is idempotent on re-run.
- `design_fidelity.py` fetches and downloads a component's `previewImageUrl` from `list-components -o json` so the agent can judge a render against the design intent. It is stdlib-only and query-only: it reads the CLI and downloads images, and writes nothing back to MagicPath.
- For an in-skill local vendor instead of a global install, use `../mcp-servers/magicpath-cli/setup.sh`.
- All skill docs also work through `npx -y magicpath-ai` with no install at all.

---

## 2. DIRECTORY TREE

```text
scripts/
+-- install.sh           # Global magicpath-ai CLI installer (npm install -g)
+-- design_fidelity.py   # Fetch a component's previewImageUrl for the fidelity check
`-- README.md            # This file
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `install.sh` | Check Node and npm, install `magicpath-ai` globally, verify the version, print login steps |
| `design_fidelity.py` | Fetch and download a component's `previewImageUrl` via `list-components` for the parity fidelity check, stdlib-only and query-only |

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `bash install.sh` | CLI | Install the CLI globally |
| `bash install.sh --check-only` | CLI | Report install status without installing |
| `bash install.sh --force` | CLI | Reinstall even when already present |
| `python3 design_fidelity.py --project <id>` | CLI | Fetch and download previews for every component in a project |
| `python3 design_fidelity.py --project <id> --component <name>` | CLI | Target one component by id or name substring |
| `python3 design_fidelity.py --project <id> --json` | CLI | Machine-readable output for the fidelity check |

---

## 5. VALIDATION

Run from the repository root.

```bash
bash .opencode/skills/mcp-magicpath/scripts/install.sh --check-only
```

Expected result: prints `magicpath-ai X.Y.Z already installed` when the CLI is present, or reports that it will install.

```bash
python3 .opencode/skills/mcp-magicpath/scripts/design_fidelity.py --help
```

Expected result: prints the usage with `--project`, `--component`, `--download-dir` and `--json`. Exit code 0, no network or auth needed.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`../INSTALL_GUIDE.md`](../INSTALL_GUIDE.md)
- [`../mcp-servers/magicpath-cli/README.md`](../mcp-servers/magicpath-cli/README.md)
- [`../../sk-interface-design/references/claude_design_parity.md`](../../sk-interface-design/references/claude_design_parity.md) - the parity protocol `design_fidelity.py` serves
