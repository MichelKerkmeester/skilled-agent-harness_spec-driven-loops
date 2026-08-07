---
title: "Tasks: deterministic fixtures and reference oracle"
description: "Task breakdown for the independent fixture corpus and reference oracle."
status: complete
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/002-deterministic-fixtures-oracle"
    last_updated_at: "2026-07-15T06:49:12Z"
    last_updated_by: "codex"
    recent_action: "Completed the independent oracle, deterministic fixture corpus, and frozen expectations"
    next_safe_action: "Refresh generated metadata, then let phase 003 consume expectations without oracle imports"
    blockers: []
    key_files:
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: deterministic fixtures and reference oracle

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is complete.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Author the mutation manifest describing each defect fixture as a transformation. Evidence: `fixtures/mutation-manifest.json` enumerates twelve named defect transformations plus `clean-control`.
- [x] T002 — Implement the independent reference oracle and verify it against the clean control. Evidence: `oracle/reference-oracle.cjs --verify` exits `0`, and `clean-control` reports `0 finding(s)`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 — Materialize the eight public calibration fixtures. Evidence: `fixtures/corpus/public/` contains eight defect trees spanning S1-S5 plus the clean control; each defect has an exact oracle match.
- [x] T004 — Materialize the four held-out fixtures. Evidence: `fixtures/corpus/held-out/` contains orphan-mirror, wrong-subaction, destructive-boundary, and compound fixtures with frozen results.
- [x] T005 — Freeze expected defect codes and locations from the oracle. Evidence: `expectations/` contains one JSON file per fixture plus `index.json`; the consuming `fixture-manifest.json` carries the same oracle-derived outcomes and hashes.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Confirm every fixture matches its independent expected defect set. Evidence: the verifier exits `0` across all 13 trees with `clean=0 public=8 held-out=4`; deterministic rebuild preserves fixture-root hash `0d1e6ab84ad9214a0ad6eabeb5147e99499cfea640326aeeb66503f24e537bf8`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The oracle verifier passes on every fixture, the clean control is empty, and held-out fixtures are reserved from adapter-facing use.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/035-command-surface-benchmark`. Predecessor: 001-create-benchmark-conformance-family. Successor: 003-command-contract-adapter.
<!-- /ANCHOR:cross-refs -->
