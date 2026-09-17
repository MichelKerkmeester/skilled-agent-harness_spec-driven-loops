---
title: "Create Feature Catalog Scripts: cross-file catalog package validator"
description: "Strict package-level validator that checks root-to-leaf bijection, source-file existence and validation-type taxonomy across a feature catalog."
---

# Create Feature Catalog Scripts

---

## 1. OVERVIEW

`sk-create-feature-catalog/scripts/` holds the package-level validator and its paired fixtures. `validate_document.py` checks a single markdown file at a time. `validate_catalog_package.py` proves the invariants that require reading an entire `feature-catalog/` tree at once.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `validate_catalog_package.py` | Presence-based discovery, staged package verdicts, root-to-leaf bijection, source-file existence, prose-path existence, parity, packet-history, shipped-label, volatile-snapshot, workflow-mode, and validation-type checks. |
| `fixtures/` | Paired positive/negative markdown inputs for each added rule. |
| `tests/test_validator_fixtures.py` | Exercises each paired fixture, discovery coverage, case-folded roots, exit modes, staging, and JSON determinism. |

---

## 3. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py [--skills-root PATH] [--repo-root PATH] [--package ID] [--strict] [--report-only] [--json]
```

Discovery is presence-based: every canonical `feature-catalog/` directory under `.opencode/skills/` becomes a package, keyed by its path relative to that root. The measured starting corpus is 26 packages and 804 leaves. Root filenames and link targets are compared case-insensitively so `FEATURE-CATALOG.md` does not create a false orphan.

The default is fail-closed for promoted packages. The explicit WARN tier currently contains `system-spec-kit`, `mcp-tooling/mcp-refero`, `mcp-tooling/mcp-click-up`, and `system-deep-loop/deep-research`, which carry the known 104-orphan backlog. Repair work removes a package from that list when its backlog is cleared. `--report-only` always returns zero; `--strict` is retained as an alias for the default.

The enforced package rules are root/leaf bijection, SOURCE FILES path existence, validation taxonomy, workflow-mode parity, phantom root rows, prose paths, root-H3/title parity, normalized description parity, packet-history rejection, dark-vs-shipped labeling, and volatile measurement-snapshot rejection. Structural rosters are derived from links and source tables; measured snapshots do not belong in catalog prose.

---

## 4. RELATED

- [`SKILL.md`](../SKILL.md)
- [`README.md`](../README.md)
- [`validate_document.py`](../../shared/scripts/validate_document.py), the single-file validator this script builds on.
