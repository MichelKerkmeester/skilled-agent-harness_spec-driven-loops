---
title: "Tasks: 016/004/014 Mirror Dedup with Canonical Preference"
description: "Completed task list for CocoIndex mirror-aware dedup, canonical mirror config, tests, bench evidence, ADR-017, and packet validation."
trigger_phrases: ["016/004/014 tasks", "mirror dedup tasks", "canonical mirror tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference"
    last_updated_at: "2026-05-19T13:10:00Z"
    last_updated_by: "codex"
    recent_action: "Completed config, helper, query, tests, bench, and docs"
    next_safe_action: "Commit handoff without git commit"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004014"
      session_id: "016-004-014-tasks"
      parent_session_id: "016-004-014"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 016/004/014 Mirror Dedup with Canonical Preference

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` - completed
- `[ ]` - pending
- `[B]` - blocked
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T001 - Read `spec.md`, `query.py`, `indexer.py`, `config.py`, trigger evidence, corrected baseline, bench harness, existing tests, README, ADR target, and 013 summary.
- [x] T002 - Invoke sequential-thinking MCP five times before edits. Evidence: all five calls returned `user cancelled MCP tool call`; work proceeded with explicit planning and verification.
- [x] T003 - Add `COCOINDEX_CANONICAL_MIRROR` and `COCOINDEX_MIRROR_PREFIXES` config parsing with defaults and `[]` opt-out support.
- [x] T004 - Add `cocoindex_code/path_utils.py` with `extract_path_stem`, `is_mirror_path`, and `select_canonical_mirror_copy`.
- [x] T005 - Add helper and config unit tests.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] T006 - Add Pass A mirror collapse to `_dedup_and_rank_hybrid_rows()`.
- [x] T007 - Preserve Pass B existing source-realpath/content-hash plus line-range dedup.
- [x] T008 - Add integration tests for four-mirror collapse, canonical absent fallback, mixed mirror/non-mirror preservation, empty set, single candidate, and opt-out behavior.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T009 - Run targeted pytest. Evidence: `39 passed`.
- [x] T010 - Run full MCP server pytest suite. Evidence: `104 passed`.
- [x] T011 - Run corrected Phase 2 smoke bench with `OUTPUT_TAG=-014-dedup`. Evidence: retained rerun shows `14/18` in all lanes.
- [x] T012 - Write `evidence/phase2-comparison-013-vs-014-delta.md`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## 5. PHASE 4: ADR, DOCS, VALIDATION

- [x] T013 - Append ADR-017 with defect, fix, env contract, and rollback path.
- [x] T014 - Update `cocoindex_code/README.md` with mirror dedup behavior and `path_utils.py`.
- [x] T015 - Write L2 `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json`.
- [x] T016 - Run strict validation after docs are written. Evidence: `validate.sh --strict` returned `RESULT: PASSED`.
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:completion -->
## 6. COMPLETION CRITERIA

- [x] R1-R2 config env vars implemented.
- [x] R3 path-stem helper implemented.
- [x] R4 two-pass hybrid dedup implemented.
- [x] R5 helper/integration/config tests added and passing.
- [x] R6 corrected 18-probe bench saved under packet evidence.
- [x] R7 no hit-rate or probe regression; retained p95 latency under 10% gate.
- [x] R8 ADR-017 appended.
- [x] R9 strict validation passed.
- [x] R10 existing MCP server tests pass.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 7. CROSS-REFERENCES

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Summary: `implementation-summary.md`
- Evidence: `evidence/phase2-comparison-014-dedup.md`
- Delta: `evidence/phase2-comparison-013-vs-014-delta.md`
<!-- /ANCHOR:cross-refs -->
