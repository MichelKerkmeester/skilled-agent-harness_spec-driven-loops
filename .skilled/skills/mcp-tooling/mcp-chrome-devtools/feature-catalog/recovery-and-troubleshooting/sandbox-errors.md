---
title: "Linux Sandbox Errors"
description: "User namespaces before CHROME_FLAGS fallbacks — ordered fixes for namespace errors."
trigger_phrases:
  - "failed to move to new namespace"
  - "chrome sandbox linux"
  - "no-sandbox flag"
version: 1.0.0.0
---

# Linux Sandbox Errors

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`Failed to move to new namespace` on Linux means the Chrome sandbox is restricted. Fix in order of preference: enable user namespaces (`sudo sysctl -w kernel.unprivileged_userns_clone=1`), then `CHROME_FLAGS="--disable-setuid-sandbox"`, and only as last resort `CHROME_FLAGS="--no-sandbox"`.

---

## 2. HOW IT WORKS

The sandbox provides process isolation, so avoid disabling it unless necessary: default sandbox is best, setuid-only-disabled is medium, no-sandbox is poor. Containerized runs prefer `docker run --cap-add=SYS_ADMIN`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `INSTALL-GUIDE.md` §4, §9 | Guide | Sandbox security table and ordered fixes |
| `references/troubleshooting.md` | Reference | Platform-aware diagnostics |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/manual-testing-playbook.md` §2 | Manual | Platform preconditions for all scenarios |

---

## 4. SOURCE METADATA

- Group: Recovery and Troubleshooting
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `recovery-and-troubleshooting/sandbox-errors.md`
Related references:
- [missing-browser.md](../../feature-catalog/recovery-and-troubleshooting/missing-browser.md) — Missing Browser
- [ci-integration.md](../../feature-catalog/automation-and-performance/ci-integration.md) — CI Integration
