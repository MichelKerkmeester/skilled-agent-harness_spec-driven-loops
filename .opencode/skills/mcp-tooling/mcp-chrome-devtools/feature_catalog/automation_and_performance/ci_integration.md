---
title: "CI Integration"
description: "Exit-code driven chaining of the example scripts with set -e and trap cleanup for pipelines."
trigger_phrases:
  - "browser tests in ci"
  - "ci visual regression pipeline"
  - "bdg pipeline integration"
version: 1.0.0.0
---

# CI Integration

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

All three example scripts return semantic exit codes, so a CI job chains them under `set -e`: baseline capture, animation assertions, then the viewport matrix — failing the pipeline on the first assertion miss.

---

## 2. HOW IT WORKS

The scripts use configurable thresholds for automated validation and timestamped output for historical comparison. Every script installs a trap so `bdg stop` runs on exit, and CI environments add security flags (`--disable-gpu --disable-dev-shm-usage --remote-debugging-address=127.0.0.1`) via `CHROME_FLAGS`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `examples/README.md` §4 | Guide | ci-visual-tests chaining pattern |
| `INSTALL_GUIDE.md` §4 | Guide | CI/CD security flags |
| `references/session_management.md` §9 | Reference | Trap-based cleanup the scripts rely on |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `examples/README.md` §3 | Manual | Per-script exit-code contracts |

---

## 4. SOURCE METADATA

- Group: Automation and Performance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `automation_and_performance/ci_integration.md`
Related references:
- [performance_baseline.md](../automation_and_performance/performance_baseline.md) — Performance Baseline
- [sandbox_errors.md](../recovery_and_troubleshooting/sandbox_errors.md) — Linux Sandbox Errors
