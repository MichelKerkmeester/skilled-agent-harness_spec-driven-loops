---
title: "System Spec Kit Test Suite"
description: "Current test inventory for shell scripts, TypeScript modules, and integration workflows."
trigger_phrases:
  - "spec kit tests"
  - "test validation"
  - "upgrade-level tests"
importance_tier: "normal"
---


# System Spec Kit Test Suite

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📋 CURRENT INVENTORY](#2--current-inventory)
- [3. 📌 RECOMMENDED RUN ORDER](#3--recommended-run-order)
- [4. 📌 FOCUS AREAS](#4--focus-areas)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. 📖 OVERVIEW

The `tests/` directory validates script behavior, TypeScript module contracts, and end-to-end flows.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. 📋 CURRENT INVENTORY


JavaScript tests:
- `test-bug-fixes.js`
- `test-bug-regressions.js`
- `test-cleanup-orphaned-vectors.js`
- `test-embeddings-behavioral.js`
- `test-embeddings-factory.js`
- `test-export-contracts.js`
- `test-extractors-loaders.js`
- `test-five-checks.js`
- `test-folder-detector-functional.js`
- `test-integration.js`
- `test-naming-migration.js`
- `test-retry-manager-behavioral.js`
- `test-scripts-modules.js`
- `test-subfolder-resolution.js`
- `test-template-comprehensive.js`
- `test-template-system.js`
- `test-utils.js`
- `test-validation-system.js`

Shell tests:
- `test-upgrade-level.sh`
- `test-validation.sh`
- `test-validation-extended.sh`

Python tests:
- `test_dual_threshold.py`

Fixtures and cache:
- `test-fixtures/`
- `.pytest_cache/`


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:recommended-run-order -->
## 3. 📌 RECOMMENDED RUN ORDER


```bash
cd .opencode/skill/system-spec-kit/scripts
npm run build

cd tests
node test-scripts-modules.js
node test-extractors-loaders.js
node test-integration.js
bash test-upgrade-level.sh
bash test-validation.sh
python3 test_dual_threshold.py
```


<!-- /ANCHOR:recommended-run-order -->
<!-- ANCHOR:focus-areas -->
## 4. 📌 FOCUS AREAS


- Upgrade path coverage for `spec/upgrade-level.sh` and placeholder handling.
- Subfolder resolution coverage for memory save and folder matching behavior.
- Validation regression coverage for shell rule orchestration.
<!-- /ANCHOR:focus-areas -->
