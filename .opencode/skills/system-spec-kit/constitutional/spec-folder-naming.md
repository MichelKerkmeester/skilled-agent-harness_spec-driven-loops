---
title: "Spec-Folder Naming & Rename Convention"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-05-31"
last_confirmed_source: "git-log-last-touch"
triggerPhrases:
  - spec folder name
  - spec folder naming
  - NNN-name
  - rename spec folder
  - move spec folder
  - new spec folder
  - packet number
  - child folder number
---

# Spec-Folder Naming & Rename Convention

## Rule

Spec folders use `NNN-short-descriptive-name`. Canonical source: `.opencode/skills/system-spec-kit/references/structure/folder-structure.md` §2.

## Name format

- Number prefix: **3 digits, zero-padded** (`007`, not `7`).
- Single hyphen separator; name lowercase, hyphen-separated, short + descriptive (2-4 words).
- Describe the work/outcome literally, NOT the method or tooling.
- Good: `001-initial-setup`, `042-refactor-api-endpoints`. Bad: `1-setup` (no zero-pad), `001_setup` (underscore), `001-Setup` (uppercase).
- Child/sub-folders use the same `NNN-topic-name` form, numbered sequentially per parent. Next child = highest existing child number + 1 (gaps are NOT auto-backfilled).
- Slug rule: lowercase; every non-`[a-z0-9]` → `-`; collapse repeats; trim leading/trailing `-`.

## Renaming or moving (per `references/workflows/rename-pattern.md`)

1. `git mv` the folder (preserves `git log --follow`). NEVER delete + recreate.
2. Update LIVE cross-references (parent `graph-metadata.json`, `description.json`, command files, sibling links) by literal substitution. PRESERVE historical narrative verbatim.
3. REGENERATE compiled indexes, never hand-edit (e.g. advisor `skill-graph.json` via `skill_graph_compiler.py --export-json`).
4. Reconcile parent metadata via `generate-context.js` (refreshes `children_ids` + `derived.last_active_child_id`).
5. Stay on `main`. Final gate: `validate.sh --strict <spec-folder>` exit 0.
