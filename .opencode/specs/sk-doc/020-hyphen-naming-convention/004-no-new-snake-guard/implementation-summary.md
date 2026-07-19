---
title: "Implementation Summary: no-new-snake guard (020 phase 004)"
description: "Phase 004 outcome: an exemption-aware guard that fails only on newly-introduced snake_case names, plus the leaked name it already caught."
trigger_phrases:
  - "no new snake guard summary"
  - "hyphen naming phase 004 summary"
  - "changed-since snake guard"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/004-no-new-snake-guard"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/004-no-new-snake-guard"
    last_updated_at: "2026-07-18T07:18:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the guard and fixed the snake_case name it caught"
    next_safe_action: "Begin phase 005 rename tooling"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-no-new-snake-guard |
| **Completed** | 2026-07-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The migration now has a ratchet. A guard fails the moment anyone introduces a new
snake_case filesystem name in an in-scope location, so the tree cannot drift back
toward underscores while the rename phases are still pending. It proved its worth
immediately by catching a name the earlier phases had leaked.

### The guard

`check_no_new_snake_case.py` flags an in-scope directory, file, or script filename
that uses snake_case, and honors every exemption class: `.py` files, Python
import-package directories, vendored and third-party trees, generated and lockfile
output (including the generated `.codex/` mirror), tool-mandated names, test-runner
magic, and frozen surfaces. It imports the shared resolver rather than duplicating
its root names.

It has two modes. `--changed-since <ref>` checks only the paths changed since a
reference and fails only on newly-introduced snake_case, so it stays debt-tolerant
during the migration. `--all` enumerates the whole tree deterministically and
becomes the active gate after the migration completes.

### The name it caught

Running `--changed-since $BASE` against the current tree failed on one genuine leak:
`test_root_name_consumer_matrix.cjs`, a snake_case `.cjs` file introduced during
phase 002. A `.cjs` file is not Python and no runner mandates the underscore name, so
exempting it would have weakened the policy. It was renamed to
`test-root-name-consumer-matrix.cjs` and its one reference updated; the guard then
passed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `check_no_new_snake_case.py` | Created | The exemption-aware guard with `--changed-since` and `--all` modes |
| `test_no_new_snake_case_guard.py` | Created | Positive + negative fixtures for both modes |
| `test-root-name-consumer-matrix.cjs` | Renamed | Was snake_case `.cjs`; kebab-cased to clear the guard's first catch |
| `test_root_name_consumer_matrix.py` | Modified | Updated its one reference to the renamed `.cjs` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The guard was built against the convention's exemption set and verified with its own
fixtures. The required `--changed-since $BASE` run against the current worktree is the
proof: it started red on the leaked `.cjs` name and turned green once that name was
kebab-cased, which confirms both that the guard detects real leaks and that the
migration so far introduced no other new snake_case filenames.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `--all` off as the active gate for now | The tree is still largely un-migrated; `--all` legitimately reports that debt, so only `--changed-since` gates during execution |
| Fix the leaked `.cjs` rather than exempt it | A `.cjs` file is not Python and no runner mandates the underscore name; exempting it would weaken the frozen policy |
| Import the shared resolver, do not duplicate | One source of truth for the catalog/playbook root names keeps the guard and the consumers aligned |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Guard fixtures (`test_no_new_snake_case_guard.py`) | PASS, 4/4 |
| `--changed-since $BASE` on the current tree | PASS after the `.cjs` rename |
| Matrix tests still run after the rename | PASS (Python + `.cjs` both green) |
| validate.sh `--strict` on this node | PASS, Errors 0 Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`--all` reports the un-migrated tree as violations today.** By design: it becomes the active whole-tree gate only after the rename phases land.
2. **Pre-existing snake_case debt is not flagged by `--changed-since`.** For example `test_frontmatter_version.mjs` existed before BASE; it is migration debt for the rename phases, not a new leak.
<!-- /ANCHOR:limitations -->

---

<!--
Post-implementation documentation, created after phase 004 completed.
HVR rules: .opencode/skills/sk-doc/shared/references/hvr_rules.md
-->
