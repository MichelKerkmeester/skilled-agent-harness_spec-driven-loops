---
title: "Shared Scripts: cross-command sk-doc validators and naming guards"
description: "Python and Node utilities shared across every /create:* command: the document template validator, naming guards, frontmatter versioning and the semantic rename/reference toolchain."
version: 1.0.4.0
---

# Shared Scripts

> Reach for this index before you edit a validator or trust a citation count. Each row names the file that owns the job.

---

## 1. OVERVIEW

### Purpose

Give every `/create:*` command and CI gate in `sk-doc` one shared set of validators and helpers, so each rule is enforced from a single copy.

### When to Use

- Before changing a validator or a naming guard that other packets call.
- When a CI check fails and you need the script that owns the rule.
- When a rename, citation or version report needs the tool that produces it.

### What Lives Here

- **Folder role.** `shared/scripts/` holds the validators and helpers every `/create:*` command and CI gate in `sk-doc` builds on, rather than each command reimplementing its own copy.
- **Template floor.** `validate_document.py` is the floor template validator invoked by every other package's README and document checks.
- **Repo-wide guards.** The naming guards, the frontmatter versioning engine and the semantic rename toolchain are grouped here because they apply repo-wide, not to one command's output.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `validate_document.py` | Validates a markdown document against its type template (readme, skill, reference, asset, agent, command, install_guide, security_policy, spec, changelog), with `--fix` and `--json` modes. Its human report ends with any `cite-drift advisory:` lines from `cite-drift-scan.mjs --advise`, which never change the exit code; `JEV_FEATURE_CITE_DRIFT=0` (older name: `SKDOC_CITE_DRIFT_CHECK=0`) skips them. |
| `render_exempt.py` | The one reader of the render ledger's `exempt` map and `pinned` list, used by `validate_document.py` and `package_skill.py`. It keeps an entry only when its doc exists and its consumer file names the doc. `--check` lists every bad entry and exits 1 when there is one. `--scan-pinned` lists code that reads a Markdown file by a literal path and always exits 0. |
| `doc-rewrite-guard.py` | Compares changed Markdown with `--base <ref>` before a form-only rewrite is committed. It exits 1 on a `HARD` finding: changed frontmatter beyond `version`, an edited fenced block, a dropped citation, a cited anchor or section that was removed or retitled, or any edit to an exempt or pinned doc. `ADVISORY` lost lines and intro changes never change the exit code. |
| `extract_structure.py` | Extracts frontmatter, headings, code blocks and metrics from a markdown document as JSON for AI-assisted analysis. |
| `quick_validate.py` | Validates a `SKILL.md`'s frontmatter: required fields, name format, description budget and no placeholders. |
| `frontmatter-version.mjs` | Computes, applies or verifies the 4-part `version` frontmatter field across in-scope skill docs. |
| `cite-drift-scan.mjs` | Counts the `<path>.<ext>:<line>` citations in the prose of every tracked doc in a corpus at HEAD, prints per-group, per-family and total counts by class plus the dead citations, and makes zero model calls by default. `--corpus skills` (the default) scans `.skilled/skills/**/*.md` grouped by skill, `--corpus specs` scans `specs/**/*.md` grouped by track and skips any path with a `z_archive` folder, and `--corpus all` scans both. The classes are `in_range` and `past_end` for a path that resolves as written, `moved_in_range` and `moved_past_end` for one that resolves only through `cite-drift-redirects.json`, `basename_only` for a unique basename match no rename backs, then `ambiguous`, `unresolved` and `refused`. `dead` stays `past_end` plus a tracked target missing from the worktree, so a moved citation never counts as dead. `--moved` adds one `cite moved:` line per moved citation naming its new path, which `/doctor:speckit` reads for its drift summary; without it the output is unchanged. `--draw --seed <n>` works on the skills corpus only and writes 40 rows (20 live, 20 constructed) to `cite-drift-labels.jsonl`, the default labels file beside the script, and `--labels <file>` names another. `--jev` needs `--out <dir>` and measures the backend against two fixed comparators; `--advise <doc>...` checks only those documents' citations, stays silent without a stored Jev credential and always exits 0. Both run from `classifier-cite-drift-scan.mjs` and the host re-exports them. |
| `cite-drift-labels.jsonl` | Default labels file for `cite-drift-scan.mjs --draw`: 40 rows, 20 live and 20 constructed, written beside the script. `--labels <file>` names another. |
| `classifier-cite-drift-scan.mjs` | The classifier half of the scan: the pinned Jev gate, the measured arm, the scoring and verdict helpers that feed its column, the backend process helpers, and the advisory check `validate_document.py` runs. The host imports these and never gets imported back. |
| `cite-drift-gate.mjs` | Pull-request gate over the skills corpus: resolves every prose `path:line` citation at the head and in a base worktree, and fails only on an unresolved or past-end citation the base does not have. `--base <ref>` selects the base; exit 0 = no new broken citation, 1 = at least one new broken citation, 2 = bad invocation or git failure. |
| `cite-drift-redirects.json` | Directory-prefix redirect rules (`from` to `to`) that `cite-drift-scan.mjs` tries once a citation's direct candidates are untracked, most specific prefix first, hop by hop for a path renamed in stages. Each rule carries the rename `records` that back it and their `agreement`, and survives only with at least 50 records and 95% agreement. `source` names the commit and the `git log -M --diff-filter=R --name-status --format= HEAD` listing it was derived from with `deriveRedirects` in the scanner, which rebuilds it from a fresh listing. |
| `check-frontmatter-versions.sh` | Thin CI/pre-commit wrapper that execs `frontmatter-version.mjs gate`. |
| `naming_root_resolver.py` | Canonical-only resolver for the `feature-catalog` and `manual-testing-playbook` root directory names. Fails closed on a legacy underscore alias. |
| `check_no_new_snake_case.py` | Rejects non-exempt snake_case filesystem names, in changed-only or whole-tree mode. |
| `check_authored_name_kebab.py` | Validates one authored artifact basename or slug as kebab-case, delegating filesystem exemptions to `check_no_new_snake_case.py`. |
| `check_no_hyphenated_catalog_content.py` | Enforces kebab-case for catalog/playbook category folders and feature markdown files below the root. |
| `check_no_numbered_categories.py` | Rejects numbered category folders (`06--foo`) under `feature-catalog/` and `manual-testing-playbook/`. |
| `check_no_numbered_snippet_files.py` | Rejects numbered scenario files (`001-foo.md`) under the same catalog and playbook roots. |
| `resolve_skill_markdown_links.py` | Resolves exact-case relative Markdown links across skill docs, excluding anchor-only and external URLs, and fails closed on unreadable inputs. |
| `skill_contract.py` / `skill-contract.cjs` | Python and Node loaders for the shared `create-skill` contract JSON, with cached, degrade-on-error accessors. |
| `validation_switch.py` / `validation-switch.cjs` | Python and Node halves of `SKDOC_SKIP_VALIDATION`, the off switch every sk-doc validator checks at its command-line entry. The environment answers first and `.skilled/hooks/hook-flags.env` second. |
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
| `git_env.py` | Strips git repository and config redirectors (`GIT_DIR`, `GIT_WORK_TREE`, `GIT_CONFIG*` and the rest) from a subprocess environment, so the rename tools that isolate a fixture repo write there rather than to the real worktree. |

---

## 3. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <document.md> --type readme
python3 .skilled/skills/sk-doc/shared/scripts/quick_validate.py <skill-dir>/SKILL.md
python3 .skilled/skills/sk-doc/shared/scripts/check_no_new_snake_case.py --all
bash .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh
```

Expected result: `validate_document.py` exits 0 on a valid document, 1 on blocking errors and 2 on a missing file or parse error. The naming guards exit 0 when clean and 1 with offenders printed otherwise.

---

## 4. RELATED

- [`README.md`](../README.md) - The shared-folder overview that routes to references, assets and these scripts.
- [`sk-create-readme/scripts/audit_readmes.py`](../../sk-create-readme/scripts/audit_readmes.py), the fleet-wide README auditor this validator underlies.
- [`sk-create-feature-catalog/scripts/validate_catalog_package.py`](../../sk-create-feature-catalog/scripts/validate_catalog_package.py), a package-level validator built on `validate_document.py`.
