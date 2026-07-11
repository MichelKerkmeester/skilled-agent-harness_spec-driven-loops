---
title: "Plan: deterministic, dry-runnable de-numbering migration tooling"
description: "Author one deterministic migration script (dry-run default) that computes a rename map from the live tree and rewrites all five reference classes, honoring the ADR-004 deny-list; emit a rename map + per-file diff + collision report."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix/003-migration-tooling"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan authored"
    next_safe_action: "Implement the migration script + dry-run report"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: Deterministic, Dry-Runnable De-Numbering Migration Tooling

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
Build one deterministic migration script whose default is a DRY RUN that mutates nothing. It computes the
rename map from the live filesystem, then covers all five reference classes: `git mv` folder renames,
frontmatter `category:` rewrites, index-table path rewrites, nav/cross-ref link rewrites, and the two SKILL.md
router-prefix blocks. It honors the ADR-004 deny-list and emits a rename map, per-file diff, and collision
report. No tree mutation here — Phase 004 runs it with mutation enabled.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
Dry-run mutates nothing (verified: `git status` clean after a dry-run); rename map computed from the live tree
(not hardcoded); collision check reports 0; deny-list excludes `z_archive/` / `CHANGELOG*` / history / this
packet's evidence; report counts land near research.md (~390 / ~115 / ~1,052 / ~5,298 / 2 / 0);
`validate.sh --strict` Errors 0 on this phase folder; comment-hygiene respected in the script (durable WHY only,
no spec/packet ids in comments).
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
One script, planned at `003-migration-tooling/scripts/denumber-migrate.mjs` (packet-local so the one-time
migration is scoped and reviewable; reversible to the sk-doc scripts area if review prefers). Pipeline stages,
each a pure function over the tree:
1. **Discover** — walk `feature_catalog/` and `manual_testing_playbook/` under every skill; match `^\d{2}--<slug>`
   folders; build `{ oldPath → newPath }` (strip the `NN--`). This is the rename map — the single source of
   truth every later stage rewrites against.
2. **Collision-check** — group stripped names by parent; abort if any parent has two entries collapsing onto one
   slug (expected 0).
3. **Deny-list filter** — a predicate that excludes any candidate file/path under `z_archive/`, named
   `CHANGELOG*` / `changelog*`, spec-folder history / `implementation-summary.md`, or this packet's `research.md`
   / `decision-record.md`.
4. **Plan edits** — for each reference class (a–e) compute the exact byte edits from the rename map; nothing is
   written in dry-run.
5. **Report / apply** — dry-run prints; `--apply` (used only by Phase 004) executes `git mv` + writes.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Discover + build the rename map from the live tree; assert it against research.md's 390 (123 + 267 / 34).
2. Implement the collision check and the ADR-004 deny-list predicate; unit-cover both.
3. Implement the five reference-class rewriters (a git mv, b frontmatter, c index rows, d nav links, e router
   blocks), each driven by the rename map.
4. Implement the dry-run report (rename map + per-file diff + collision + excluded-surface summary) and the
   `--apply` gate; assert idempotency (a second dry-run after a hypothetical partial is a no-op).
5. Run the dry-run; reconcile the reported counts against research.md; validate --strict.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Run the dry-run against the current tree and diff its counts against research.md (~390 / ~115 / ~1,052 /
~5,298 / 2 / 0 collisions). Assert `git status` is clean afterward (R1: zero mutation). Grep the per-file diff
for any excluded surface (`z_archive/`, `CHANGELOG`, history, this packet's evidence) → must be empty (R2).
Feed a synthetic colliding pair through the collision check → must abort (R3). Re-run the dry-run twice → byte-
identical output (R5 idempotency). `validate.sh --strict` on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Depends on Phase 001 (canonical de-numbered slug — the target shape) and Phase 002 (tolerant classifier — so
every intermediate commit still validates). Feeds Phase 004, which runs this script with `--apply`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
The script itself mutates nothing in dry-run, so authoring it is inherently reversible (`git checkout` the
script file). When Phase 004 later runs `--apply`, reversal is `git reset --hard` / `git revert` of that
commit — the migration is a git rename + text rewrite with no out-of-band state.
<!-- /ANCHOR:rollback -->
