---
title: "Create Readme Scripts: README conformance auditor"
description: "Python script that audits every in-scope README for sk-doc template alignment and freshness drift, then reports findings as JSON and markdown."
version: 1.0.1.0
---

# Create Readme Scripts

---

## 1. OVERVIEW

`sk-create-readme/scripts/` holds the fleet-wide conformance checker for the `/create:readme` workflow. `audit_readmes.py` walks every README under the repo root and `.skilled/`, runs each through `validate_document.py` for template alignment and separately checks for broken references and missing key-artifact coverage. That coverage check flags untracked `scripts/`, `lib/`, `tests/` and similar sibling directories.

Discovery matches the names `README.md` and `README.markdown` exactly, so a lowercase `readme.md`, such as the `/create:readme` command file, is not audited, and a folder named `fixture`, `fixtures` or ending in `-fixture` is test input and is skipped. A reference resolves from the README's folder, from the repository root and, for a token that does not open with `./` or `../`, from the nearest folder above the README that holds a `package.json`. A reference that still does not resolve but names a path inside the repository that git ignores, such as a log, a state file or a build output, is reported under `resolved_references` with the evidence `gitignored_runtime_path` instead of as broken. Its folder must exist or be ignored too, so a broad rule such as `lib/**/*.js` cannot clear a mistyped path. The paths are checked in one `git check-ignore` call.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `audit_readmes.py` | Discovers in-scope READMEs, runs template-alignment plus freshness checks on each and emits a summary, per-file findings and optional JSON/markdown reports. |

---

## 3. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py [--repo-root .] [--json-out report.json] [--markdown-out report.md]
```

Expected result: a JSON summary printed to stdout with `readmes_total`, `template_valid`, `template_invalid` and P1/P2 finding counts.

---

## 4. RELATED

- [`SKILL.md`](../SKILL.md)
- [`README.md`](../README.md)
- [`validate_document.py`](../../shared/scripts/validate_document.py), the per-file template validator this auditor drives.
