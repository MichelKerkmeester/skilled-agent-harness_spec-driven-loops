---
title: "Install + Version"
description: "command -v bdg then bdg --version — verify the CLI before first use."
trigger_phrases:
  - "install bdg"
  - "bdg --version"
  - "browser-debugger-cli install"
  - "check bdg installed"
version: 1.0.0.0
---

# Install + Version

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Verify the `bdg` binary before any browser work: `command -v bdg` confirms presence, `bdg --version 2>&1` returns the version string. Install with `npm install -g browser-debugger-cli@alpha` (Node.js 18+ required; Windows via WSL only).

---

## 2. HOW IT WORKS

The SKILL.md ALWAYS rule "Check CLI availability first" makes this the entry gate for the whole skill: CLI present means the CLI path is preferred, absent means either install it or fall back to the MCP path. If `bdg` is installed but not found, fix PATH via `npm config get prefix`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §3 | CLI | Installation and verification contract |
| `INSTALL-GUIDE.md` §3 | Guide | Step-by-step install with validation checkpoints |
| `scripts/install.sh` | Script | Embedded installer |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/cli-bdg-lifecycle/install-version.md` | Manual | BDG-001 scenario contract |

---

## 4. SOURCE METADATA

- Group: CLI bdg Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-bdg-lifecycle/install-version.md`
Related references:
- [session-start.md](../../feature-catalog/cli-bdg-lifecycle/session-start.md) — Session Start
- [missing-browser.md](../../feature-catalog/recovery-and-troubleshooting/missing-browser.md) — Missing Browser
