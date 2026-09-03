# Spec — mcp-obsidian feature-catalog divider conformance

## Status

- **Level:** 1
- **State:** complete
- **Type:** Documentation conformance (skill catalog docs only; no runtime code)

## Purpose

Add the missing Style-A section dividers to the 11 plugin feature-catalog leaves so they match the sibling `cli/` and `mcp/` leaves and the repo-wide catalog convention. They were the only catalog files in the skill without them.

## Scope

- **`feature-catalog/plugins/*.md` (11 files)** — insert a `---` divider before every numbered H2 after `## 1.` (matching the `cli/`/`mcp/` sibling layout: between each numbered section, none after the intro, none between `###` H3s).
- Version bump + changelog.
- **Out of scope:** the `cli/` (14) and `mcp/` (6) leaves and the `feature-catalog.md` index (already conformant); any catalog *content*.

## Root cause

`validate_document.py` classifies these as the `feature_catalog` doc type, whose contract does not require section dividers (`requiredSections: []`, no divider rule) — so they validated with 0 issues despite the gap, and the earlier reference/asset conformance pass (026) did not cover `feature-catalog/`.

## Acceptance criteria

- AC1: every `plugins/*.md` leaf has 3 body dividers (matching the `cli/`/`mcp/` siblings) and still passes `validate_document.py` (0 issues).
- AC2: the change is exclusively `---` + blank-line insertions — 0 content/table/code lines altered.
- AC3: the inserter is idempotent (a re-run adds 0) and code-fence aware.

## Outcome

All met. Shipped to v4. 33 dividers across 11 files, additive-only, all validate clean. Details in `implementation-summary.md`.
