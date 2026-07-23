---
title: "Create Readme Scripts: README conformance auditor"
description: "Python script that audits every in-scope README for sk-doc template alignment and freshness drift, then reports findings as JSON and markdown."
---

# Create Readme Scripts

---

## 1. OVERVIEW

`create-readme/scripts/` holds the fleet-wide conformance checker for the `/create:readme` workflow. `audit_readmes.py` walks every README under the repo root and `.opencode/`, runs each through `validate_document.py` for template alignment and separately checks for broken references and missing key-artifact coverage. That coverage check flags untracked `scripts/`, `lib/`, `tests/` and similar sibling directories.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `audit_readmes.py` | Discovers in-scope READMEs, runs template-alignment plus freshness checks on each and emits a summary, per-file findings and optional JSON/markdown reports. |

## 3. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py [--repo-root .] [--json-out report.json] [--markdown-out report.md]
```

Expected result: a JSON summary printed to stdout with `readmes_total`, `template_valid`, `template_invalid` and P1/P2 finding counts.

## 4. RELATED

- [`SKILL.md`](../SKILL.md)
- [`README.md`](../README.md)
- [`validate_document.py`](../../shared/scripts/validate_document.py), the per-file template validator this auditor drives.
