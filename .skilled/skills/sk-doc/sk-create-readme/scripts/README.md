---
title: "Create Readme Scripts: README conformance auditor and gates"
description: "Python scripts that audit every in-scope README for sk-doc template alignment and freshness drift, and gate single READMEs on broken references and unproven file counts."
version: 1.0.4.0
---

# Create Readme Scripts

---

## 1. OVERVIEW

`sk-create-readme/scripts/` holds the fleet-wide conformance checker for the `/create:readme` workflow and two per-README gates that reuse its rules. `audit_readmes.py` walks every README under the repo root and `.skilled/`, runs each through `validate_document.py` for template alignment and separately checks for broken references and missing key-artifact coverage. That coverage check flags untracked `scripts/`, `lib/`, `tests/` and similar sibling directories.

Discovery matches the names `README.md` and `README.markdown` exactly, so a lowercase `readme.md`, such as the `/create:readme` command file, is not audited, and a folder named `fixture`, `fixtures` or ending in `-fixture` is test input and is skipped. A reference resolves from the README's folder, from the repository root and, for a token that does not open with `./` or `../`, from the nearest folder above the README that holds a `package.json`. A reference that still does not resolve but names a path inside the repository that git ignores, such as a log, a state file or a build output, is reported under `resolved_references` with the evidence `gitignored_runtime_path` instead of as broken. Its folder must exist or be ignored too, so a broad rule such as `lib/**/*.js` cannot clear a mistyped path. The paths are checked in one `git check-ignore` call.

The two gates check the READMEs they are given and print one `PASS` or `FAIL` line per file, with the failing line numbers, then a `SUMMARY` line:

- `check_readme_references.py` checks every Markdown link target that is not a URL or an anchor, path-shaped code spans, fenced command tokens that the audit's rules read as paths, code-span-only table cells and file tree entries drawn with box glyphs or ASCII `+--`, `|--` and `` `-- ``. A link, an anchored code span, a command, a row or a tree entry resolves from the README folder, its package root and the repository root, and fails only when none holds the file. A bare name or unanchored path in a code span resolves from the README folder, a skill folder or a file of that name in the repository. Slash commands, home paths, model ids and placeholders are not paths, and a fenced tree whose root names no folder here fails once at the root. References inside an example fence are never checked against the disk; the summary counts them on its `examples=` field. Unresolved paths that git ignores are cleared in two batched `git check-ignore` calls per run, so a typo of an ignored path still fails, and a README kept inside an ignored folder is not cleared. A README-level `<!-- readme-check -->` block lists `allow-ref` exceptions, each with a reason, and an entry that matches nothing fails.
- `check_derived_readme_counts.py` reads a number as a count claim only when a plural term such as `files`, `scripts` or `suites` follows it, and skips it when its own sentence names another path and not the README folder, or when the number follows a label or bound word such as `Level` or `than`. A claim passes when it matches the folder a code span in its sentence names, when it matches a count derived from the README's own folder and the README lists every direct file there, or when a fenced shell line derives it with `find`, `ls` or `wc`. A vague count word such as "several" or "many" before a counted term fails. An `allow-count` entry in the same marker block excuses one claim phrase.

Every git call in this folder runs as `git -c core.fsmonitor=false`, so a stalled fsmonitor daemon cannot hang a run.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `audit_readmes.py` | Discovers in-scope READMEs, runs template-alignment plus freshness checks on each and emits a summary, per-file findings and optional JSON/markdown reports. Its reference helpers are the rules both gates import. |
| `check_readme_references.py` | Gate for broken links, path-shaped code spans, inventory table rows and file tree lines in the READMEs it is given. |
| `check_derived_readme_counts.py` | Gate for numeric and vague file, script, suite and test counts that the README's own folder does not prove. |

---

## 3. ENTRYPOINTS

| Entrypoint | Flags | Exit codes |
|---|---|---|
| `audit_readmes.py` | `--repo-root`, `--validator`, `--inventory-out`, `--json-out`, `--markdown-out`, `--manifest`, `--document-type` | 0 once the report is written; findings are in the report, not the exit code |
| `check_readme_references.py README.md [...]` | `--self-test` runs the built-in behavior checks | 0 every README passes, 1 a README fails or a self-test check fails, 2 no README path given |
| `check_derived_readme_counts.py README.md [...]` | `--self-test` runs the built-in behavior checks | 0 every README passes, 1 a README fails or a self-test check fails, 2 no README path given |

When `SKDOC_SKIP_VALIDATION` is on, both gates print a skip notice and exit 0 before checking anything. `--self-test` still runs.

---

## 4. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py [--repo-root .] [--json-out report.json] [--markdown-out report.md]
python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py path/to/README.md
python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py path/to/README.md
```

Expected result: the audit prints a JSON summary with `readmes_total`, `template_valid`, `template_invalid` and P1/P2 finding counts. Each gate ends with `SUMMARY files=1 pass=1 fail=0` and exits 0 for a clean README.

The full sk-doc suite covers both gates through `test_readme_reference_checker.py`, `test_derived_readme_counts.py` and `test_validation_switch.py`:

```bash
bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh
```

Expected result: `all sk-doc script tests passed` and exit 0.

---

## 5. RELATED

- [`SKILL.md`](../SKILL.md)
- [`README.md`](../README.md)
- [`validate_document.py`](../../shared/scripts/validate_document.py), the per-file template validator this auditor drives.
- [`scripts/tests/`](../../scripts/tests/), the sk-doc suite that tests both gates.

<!-- readme-check
allow-ref lib/**/*.js | an illustrative ignore pattern the sentence warns about, not a path
-->
