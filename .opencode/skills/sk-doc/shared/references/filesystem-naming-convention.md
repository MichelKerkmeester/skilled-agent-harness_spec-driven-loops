---
title: Filesystem Naming Convention - Kebab-Case Canon
description: The single canonical rule that kebab-case is the sole in-scope filesystem-naming form, with the full exemption boundary and the identifier-versus-filename line.
trigger_phrases:
  - "filesystem naming convention"
  - "kebab-case naming rule"
  - "hyphen naming canon"
  - "snake_case exemption boundary"
importance_tier: important
contextType: general
version: 1.0.0.0
---

# Filesystem Naming Convention - Kebab-Case Canon

## 1. OVERVIEW

Kebab-case (hyphens) is the sole canonical form for in-scope filesystem names across the repository. This document is the single source of truth for the rule, its exemptions, and the boundary between a filesystem name and a code identifier.

---

## 2. THE RULE

**In-scope filesystem names use kebab-case.** This covers directory names, file names, and script filenames.

- `my-document.md`, not `my_document.md`
- `rename-engine.ts`, not `rename_engine.ts`
- `feature-catalog/mcp-tool-surface/read-path-freshness.md`, not the underscore form

Kebab-case is chosen because it is the form already mandated by hard convention for OpenCode skill, agent, and command directories and for spec phase-folders (`^[0-9]{3}-[a-z0-9-]+$`). Making it the canon everywhere removes the split-brain where those trees were hyphenated while catalog and playbook content was underscored.

---

## 3. EXEMPTIONS (never renamed)

Each class below keeps its existing name. A rename here would break an interpreter, a tool, or the historical record.

| Class | Example | Why exempt |
|-------|---------|------------|
| Python source files | `validate_document.py` | Python style is snake_case; renaming churns imports for no gain |
| Python import-package directories | `my_package/` | A `_`→`-` on a package dir breaks `import` and `from` statements (see §4) |
| Vendored / third-party trees | `node_modules/`, vendored SDK folders | Owned upstream, not by this repo |
| Generated / lockfile output | `package-lock.json`, `dist/`, `*.tsbuildinfo` | Rewritten by tools; not authored names |
| Tool-mandated filenames | `SKILL.md`, `README.md`, `.utcp_config.json`, `action.yml`, `conftest.py` | The name is a contract a tool matches on exactly |
| Test-runner magic | `__snapshots__/`, `__mocks__/`, `test_*.py`, `*_test.py` | Discovery frameworks match these patterns literally |
| Frozen surfaces | `z_archive/`, changelogs, completed spec-folder history | Append-only; they record prior names as history (see §5) |

---

## 4. WHY PYTHON PACKAGE DIRECTORIES ARE EXEMPT

A Python import-package directory name is not a free-form filesystem label. It is an identifier that appears verbatim in `import` and `from ... import` statements and in `sys.path` resolution. Renaming `my_package/` to `my-package/` makes `import my_package` unresolvable, because `my-package` is not a legal Python identifier (a hyphen reads as subtraction). These directories therefore stay snake_case even though they are filesystem names.

---

## 5. FROZEN-HISTORY EXCEPTION

Frozen surfaces are append-only and record prior names as part of their history:

- `z_archive/` trees
- Changelogs
- Completed spec-folder history

They are never rewritten to the new convention. Supersession is additive: a later document marks the older decision superseded and points forward, but the old names remain as the record of how the convention got here. The repository-wide "zero snake_case" gate is **scope-aware** and excludes these surfaces, so their historical names never register as violations.

---

## 6. OUT OF SCOPE: IDENTIFIERS AND KEYS KEEP IDIOMATIC CASE

The convention governs **filesystem names only**. It does not touch identifiers inside files. These keep their idiomatic case:

- **Code identifiers** (variables, functions, classes, types)
- **JSON / YAML / TOML keys** (`{ "feature_catalog": ... }` keeps the key)
- **Frontmatter FIELD names** (`trigger_phrases:`, `importance_tier:`)
- **Database columns**

The line inside frontmatter is precise:

- A frontmatter **field name** never changes: `packet_pointer:` stays `packet_pointer:`.
- A frontmatter **value that is a path or slug** does change when the file it names is renamed: `packet_pointer: "sk-doc/my_thing"` becomes `packet_pointer: "sk-doc/my-thing"` only because the referenced path moved.

A filesystem rename must never alter a code identifier, a structured-data key, or a frontmatter field name as a side effect.

---

## 7. RELATIONSHIP TO THE CLASSIFIER AND `core-standards.md`

`core-standards.md` §2 currently documents the legacy snake_case filename rule, which the `validate_document.py` classifier still applies. That rule and the classifier are reconciled to this kebab-case canon during the consumer-migration and generator phases of the naming program, under bounded dual-name tolerance so every intermediate state stays green. Until then, this document states the target; `core-standards.md` §2 carries a forward pointer here. This document is the single canonical source that later phases reference instead of restating ad-hoc rules.

---

## 8. PROVENANCE

This canon reverses the catalog/playbook underscore restyle recorded in `sk-doc/014-sk-doc-parent/027-catalog-naming-convention` (child `003`) and is governed by the `sk-doc/020-hyphen-naming-convention` program. The program decisions (bounded dual-name tolerance, dependency-closure batching, fresh-install worktree, exemption boundary) are recorded in that program's decision record.
