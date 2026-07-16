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
| `INSTALL_GUIDE.md` §4, §9 | Guide | Sandbox security table and ordered fixes |
| `references/troubleshooting.md` | Reference | Platform-aware diagnostics |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/manual_testing_playbook.md` §2 | Manual | Platform preconditions for all scenarios |

---

## 4. SOURCE METADATA

- Group: Recovery and Troubleshooting
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `recovery_and_troubleshooting/sandbox_errors.md`
Related references:
- [missing_browser.md](../recovery_and_troubleshooting/missing_browser.md) — Missing Browser
- [ci_integration.md](../automation_and_performance/ci_integration.md) — CI Integration
