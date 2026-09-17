---
title: "Missing Browser"
description: "CHROME_PATH env var — clear failure and fix when Chrome/Chromium cannot be found."
trigger_phrases:
  - "could not find chrome"
  - "chrome path not found"
  - "CHROME_PATH"
version: 1.0.0.0
---

# Missing Browser

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

When no Chrome/Chromium/Edge is resolvable, `bdg <url>` fails with a clear `Error: Could not find Chrome` naming the missing binary. Fix by setting `CHROME_PATH` (macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`; Linux: `/usr/bin/google-chrome`) and persisting it in the shell profile.

---

## 2. HOW IT WORKS

Escalation rule: if Chrome/Chromium cannot be found after the env fix, stop and report (SKILL.md ESCALATE IF 1). The playbook verifies the negative branch by pointing `CHROME_PATH` at a non-existent binary and asserting a non-zero exit with a named-binary error.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `references/troubleshooting.md` | Reference | Error/cause/fix for Chrome not found |
| `INSTALL-GUIDE.md` §2, §9 | Guide | Platform paths and PATH persistence |
| `SKILL.md` §6 | CLI | `CHROME_PATH` runtime note |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/recovery-and-failure/missing-browser.md` | Manual | BDG-019 scenario contract |

---

## 4. SOURCE METADATA

- Group: Recovery and Troubleshooting
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `recovery-and-troubleshooting/missing-browser.md`
Related references:
- [install-version.md](../../feature-catalog/cli-bdg-lifecycle/install-version.md) — Install + Version
- [sandbox-errors.md](../../feature-catalog/recovery-and-troubleshooting/sandbox-errors.md) — Linux Sandbox Errors
