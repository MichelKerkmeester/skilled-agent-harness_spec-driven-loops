---
title: "Shared Scripts: cross-command sk-doc validators and naming guards"
description: "Python and Node utilities shared across every /create:* command: the document template validator, naming guards, frontmatter versioning and the semantic rename/reference toolchain."
---

# Shared Scripts

---

## 1. OVERVIEW

`shared/scripts/` holds the validators and helpers every `/create:*` command and CI gate in `sk-doc` builds on, rather than each command reimplementing its own copy. `validate_document.py` is the floor template validator invoked by every other package's README and document checks. The naming guards, the frontmatter versioning engine and the semantic rename toolchain are grouped here because they apply repo-wide, not to one command's output.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `validate_document.py` | Validates a markdown document against its type template (readme, skill, reference, asset, agent, command, install_guide, spec, changelog), with `--fix` and `--json` modes. |
| `extract_structure.py` | Extracts frontmatter, headings, code blocks and metrics from a markdown document as JSON for AI-assisted analysis. |
| `quick_validate.py` | Validates a `SKILL.md`'s frontmatter: required fields, name format, description budget and no placeholders. |
| `frontmatter-version.mjs` | Computes, applies or verifies the 4-part `version` frontmatter field across in-scope skill docs. |
| `check-frontmatter-versions.sh` | Thin CI/pre-commit wrapper that execs `frontmatter-version.mjs gate`. |
| `naming_root_resolver.py` | Canonical-only resolver for the `feature-catalog` and `manual-testing-playbook` root directory names. Fails closed on a legacy underscore alias. |
| `check_no_new_snake_case.py` | Rejects non-exempt snake_case filesystem names, in changed-only or whole-tree mode. |
| `check_authored_name_kebab.py` | Validates one authored artifact basename or slug as kebab-case, delegating filesystem exemptions to `check_no_new_snake_case.py`. |
| `check_no_hyphenated_catalog_content.py` | Enforces kebab-case for catalog/playbook category folders and feature markdown files below the root. |
| `check_no_numbered_categories.py` | Rejects numbered category folders (`06--foo`) under `feature-catalog/` and `manual-testing-playbook/`. |
| `check_no_numbered_snippet_files.py` | Rejects numbered scenario files (`001-foo.md`) under the same catalog and playbook roots. |
| `skill_contract.py` / `skill-contract.cjs` | Python and Node loaders for the shared `create-skill` contract JSON, with cached, degrade-on-error accessors. |
| `reference_checker.py` | CLI that builds a read-only disposition ledger from an explicit semantic rename map. Never writes into the scanned repository. |
| `reference_checker_core.py` | Read-only Git manifest scanning, semantic-map reconciliation and ledger assembly used by `reference_checker.py`. |
| `reference_checker_extractors.py` | Read-only typed reference extraction across code, docs, config and shell file types. |
| `reference_checker_models.py` | Typed records and semantic-map validation shared by the reference checker modules. |
| `reference_rewrite_executor.py` | CLI that plans ledger-bounded reference rewrites. Mutates only an opted-in disposable fixture repository. |
| `reference_rewrite_core.py` | Plans, applies and rolls back ledger-bounded static reference rewrites for a single accepted disposition batch. |
| `semantic_rename_engine.py` | CLI that plans semantic Git renames from an explicit source/target map. Mutates only an opted-in disposable fixture. |
| `rename_engine_core.py` | Plans, applies and rolls back semantic filesystem renames. Requires a reviewed plan and two independent disposable-fixture opt-ins to mutate. |
| `rename_tooling_fixture_harness.py` | CLI that runs the semantic-rename fixture corpus against disposable Git repositories only. |
| `rename_tooling_fixture_core.py` | Core harness that runs rename and reference-checker scenarios from declarative fixture data, never touching the real worktree. |

## 3. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <document.md> --type readme
python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py <skill-dir>/SKILL.md
python3 .opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py --all
bash .opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh
```

Expected result: `validate_document.py` exits 0 on a valid document, 1 on blocking errors and 2 on a missing file or parse error. The naming guards exit 0 when clean and 1 with offenders printed otherwise.

## 4. RELATED

- [`README.md`](../README.md)
- [`create-readme/scripts/audit_readmes.py`](../../create-readme/scripts/audit_readmes.py), the fleet-wide README auditor this validator underlies.
- [`create-feature-catalog/scripts/validate_catalog_package.py`](../../create-feature-catalog/scripts/validate_catalog_package.py), a package-level validator built on `validate_document.py`.
