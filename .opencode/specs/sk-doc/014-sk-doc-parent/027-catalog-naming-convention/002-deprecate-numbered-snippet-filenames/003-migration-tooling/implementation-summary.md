---
title: "Implementation Summary: deterministic snippet-filename rename engine"
description: "Records denumber-snippet-filenames.mjs — the scoped, dry-run-default rename engine with collision-abort, stage derivation, hub-index reference sweep, and the corrected self-exclusion deny-list — plus its verified dry-run counts."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/003-migration-tooling"
    last_updated_at: "2026-07-12T12:16:22Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "denumber-snippet-filenames.mjs authored; dry-run clean; commit 69638f96a4"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Deterministic Snippet-Filename Rename Engine

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 003-migration-tooling |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
Authored `scripts/denumber-snippet-filenames.mjs`, a deterministic ESM rename engine, dry-run by default. It
does a fixed, scoped walk of the 9 named packet paths (structurally excluding the 20 legitimate system-spec-kit
single-digit files), strips the leading `NNN-` from each basename, hard-aborts on any within-folder collision
before writing, derives a `stage:` value (holdout/negative by token, routing by category), sweeps the 3
hub-routing root-index tables, and reports rename map + per-file diff + stage preview + collision +
excluded-surface summary. `--apply` (Phase 004 only) performs the git mv + frontmatter + index rewrites.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Adapted the proven archived-108 engine, but replaced its generic per-tree scan with a scoped enumeration so it
cannot touch out-of-scope files, and corrected 108's stale `999-sk-doc-parent` self-exclusion to the real
`014-sk-doc-parent` path. A `--stage-scope=all|tokened` flag was added so the apply phase can choose how wide to
stamp `stage:`. Commit `69638f96a4`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
Per `decision-record.md`: ADR-008 (reuse the 108 engine rather than re-author), ADR-004 (`stage:` derivation),
and the R2 deny-list correction to the current packet path. The rename map is computed from the live tree so
tooling and tree cannot drift.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
`validate.sh <this-folder> --strict` Errors 0. `node --check` clean. Dry-run against the live tree (independently
re-run): **111 renames, 0 collisions, 88 `stage:` injections (14 holdout / 5 negative / 69 routing) under
`--stage-scope=all`, 3 hub-routing index tables, 20 single-digit files defended, 0 writes.**
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
Tooling-only phase — the engine performed no tree mutation here; Phase 004 ran it with `--apply`. Counts are
recomputed from the live tree each run, so they track the tree rather than a frozen snapshot.
<!-- /ANCHOR:limitations -->
