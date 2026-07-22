---
title: "Create Feature Catalog Scripts: cross-file catalog package validator"
description: "Strict package-level validator that checks root-to-leaf bijection, source-file existence and validation-type taxonomy across a feature catalog."
---

# Create Feature Catalog Scripts

---

## 1. OVERVIEW

`create-feature-catalog/scripts/` holds the one script for the `/create:feature-catalog` workflow that needs cross-file state. `validate_document.py` checks a single markdown file at a time. `validate_catalog_package.py` proves the package-level invariants that require reading an entire `feature-catalog/` tree at once.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `validate_catalog_package.py` | Checks root-to-leaf link bijection, on-disk existence of every SOURCE FILES table row and that every Validation And Tests Type value is a member of the canonical taxonomy. |

## 3. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/create-feature-catalog/scripts/validate_catalog_package.py [--skills-root PATH] [--repo-root PATH] [--strict] [--json]
```

Expected result: findings printed to stdout. Exit 0 by default even with findings. Pass `--strict` to exit nonzero when any violation is found.

## 4. RELATED

- [`SKILL.md`](../SKILL.md)
- [`README.md`](../README.md)
- [`validate_document.py`](../../shared/scripts/validate_document.py), the single-file validator this script builds on.
