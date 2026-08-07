---
title: "Tasks: Save-Reconsolidation Merge Precision"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "save reconsolidation merge precision tasks"
  - "SPECKIT_RECONSOLIDATION_ENABLED harness tasks"
  - "reconsolidation precision harness backup"
  - "reconsolidation gate write verification"
  - "near duplicate merge precision corpus"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-dark-flag-graduation/004-save-reconsolidation"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored and ran both harnesses, matrix complete"
    next_safe_action: "Author the results docs and the CUT verdict"
    blockers: []
    key_files:
      - "scripts/recon-precision-benchmark.mjs"
      - "scripts/recon-gate-and-writes.mjs"
      - "results/precision-metrics.json"
      - "results/gate-metrics.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Save-Reconsolidation Merge Precision

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the dist exports `determineAction`, `mergeContent`, `reconsolidate`, the band constants and `hasReconsolidationCheckpoint` (`.opencode/skills/system-spec-kit/mcp_server/dist`)
- [x] T002 Confirm the live corpus stores embeddings in the plain `vec_768` table for extension-free cosine reads (`.opencode/skills/system-spec-kit/mcp_server/database/vectors`)
- [x] T003 Confirm the live schema for the merge and deprecate writers so the in-memory seed is column-complete (`.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the read-only backup, labeled-fixture miner, production-band router and `mergeContent` recall check (`scripts/recon-precision-benchmark.mjs`)
- [x] T005 Write the live-schema seed and the twelve checkpoint, byte-identity and write checks (`scripts/recon-gate-and-writes.mjs`)
- [x] T006 Run the precision harness against the corpus backup and write the precision, recall and separation rollup (`results/precision-metrics.json`)
- [x] T007 Run the gate harness against the in-memory database and write the gate and write-check rollup (`results/gate-metrics.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm the live database file is untouched and no reindex was triggered (`.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`)
- [x] T009 Confirm both harnesses exit 0 and the gate harness reports all twelve checks passing (`results/gate-metrics.json`)
- [x] T010 Author the per-band and aggregate data tables grounded strictly in the metrics rollups (`benchmark-results.md`)
- [x] T011 Author the graduation verdict and the recommendation (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
