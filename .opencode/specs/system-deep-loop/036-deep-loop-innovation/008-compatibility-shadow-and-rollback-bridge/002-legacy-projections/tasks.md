---
title: "Tasks: Legacy Projections"
description: "Tasks for census-driven folds from the dark ledger into byte-identical legacy JSONL and JSON artifacts."
trigger_phrases:
  - "legacy projections tasks"
  - "dark ledger projection tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/002-legacy-projections"
    last_updated_at: "2026-07-21T02:54:06Z"
    last_updated_by: "codex"
    recent_action: "Completed the legacy projection implementation and focused verification"
    next_safe_action: "Commit the path-scoped candidate when authorized"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/legacy-projections.test.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Legacy Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the phase-003 census and BASE fixtures; close every JSONL/JSON writer-reader row before implementation [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T002 Define the versioned projection-registry, watermark, shadow-root, fixture, and typed-failure schemas [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T003 Record serializer and refresh semantics for each manifest row, including `atomic-state.ts` JSONL/snapshot differences [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement pure full-rebuild folds from verified phase-006 ledger heads for every projection-manifest row [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T005 Reuse or extract exact legacy serializers for JSONL rows, snapshots, dashboards, registries, and resume inputs [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T006 Implement incremental folds with expected-head checks and byte equivalence to full rebuild [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T007 Implement immediate fsynced JSONL projection with exact ordering, separator, newline, fingerprint, and no-op behavior [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T008 Implement staged fsynced atomic snapshot projection with coalescing only where the census authorizes it [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T009 Persist monotonic projection watermarks only after output durability; recover safely across restart and torn shadow output [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T010 Reject live targets, path traversal, symlink escape, corrupt ledger input, unknown versions, and reducer mismatch before publication [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T011 Emit successor-ready parity bundles bound to BASE, exact ledger head, projection version, expected bytes, and projected bytes [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify: Census coverage is closed — every legacy surface and unchanged reader has exactly one projection disposition [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T013 Verify: Full rebuild is deterministic — repeated clean folds at the same verified head produce identical artifact digests [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T014 Verify: Incremental projection equals full replay — every selected head produces byte-identical JSONL/JSON output [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T015 Verify: JSONL timing and bytes match — immediate append, row order, diff suppression, separators, and terminal newline agree with BASE [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T016 Verify: Snapshot timing and bytes match — insertion order, indentation, integrity, newline, atomic replacement, and final flush agree with BASE [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T017 Verify: Restart and crash handling is idempotent — no duplicate row, stale rewrite, premature watermark, or live-path mutation occurs [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T018 Verify: Invalid ledger input fails closed — gap, fork, hash/type/version/auth mismatch, and corrupt tail publish nothing [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T019 Verify: Existing readers remain unchanged — dashboards, resume flows, registries, and other census-linked tools match BASE results [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] T020 Verify: The parity handoff is reproducible — successor fixtures reconstruct every digest pair from the pinned ledger head [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] All requirements in spec.md met with evidence [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
- [x] Phase gate green (focused tests, typecheck, metadata refresh, and strict validation are recorded in `implementation-summary.md`) [EVIDENCE: focused Vitest 15/15 passed with exit code 0; implementation-summary.md]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Schema census**: See `../../003-baseline-taxonomy-and-state-census/spec.md`
- **Dark ledger**: See `../../006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`
- **Program manifest**: See `../../manifest/phase-tree.json`
- **Legacy atomic writes**: See `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts`

### Evidence bundle

**E1.** Focused Vitest passes 15/15 with exit 0; TypeScript passes with exit 0; the intentional parity-guard
mutation fails at the intended assertion before the restored suite returns green.

**E2.** The phase-003 validator passes `--static` and `--execute` with 22 fixture streams, zero projection
mismatches, shipped reader execution, and zero tracked-scope mutations.

**E3.** `implementation-summary.md` records module contracts, adversarial proofs, census and fixture digests,
additive-dark scope, baseline caveat, and the final strict-validation receipt.
<!-- /ANCHOR:cross-refs -->
