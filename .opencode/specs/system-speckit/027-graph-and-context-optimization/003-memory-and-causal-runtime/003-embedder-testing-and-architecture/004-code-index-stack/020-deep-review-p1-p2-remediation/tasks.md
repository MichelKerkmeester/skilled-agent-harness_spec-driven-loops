---
title: "Tasks: 020 Deep Review P1/P2 Remediation"
description: "Task checklist for all nine P1 remediations and all 31 P2 remediations from 019, with targeted verification and packet documentation."
trigger_phrases:
  - "020 P1 remediation tasks"
  - "020 P2 remediation tasks"
  - "mcp-coco-index P1 task list"
  - "mcp-coco-index P2 task list"
  - "deep review remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation"
    last_updated_at: "2026-05-19T18:38:00Z"
    last_updated_by: "codex"
    recent_action: "All P1 and P2 implementation tasks completed; full pytest, ruff, and strict validation passed."
    next_safe_action: "Main agent may review the diff and commit."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0202020202020202020202020202020202020202020202020202020202020202"
      session_id: "020-p1-remediation-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 020 Deep Review P1/P2 Remediation

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read 019 devin review report.
- [x] T002 Read 019 codex pass report.
- [x] T003 [P] Inspect relevant 019 iteration notes for each P1.
- [x] T004 [P] Confirm cited source lines before each fix.
- [x] T005 Record five-point fallback preflights for each P1 after sequential-thinking MCP cancellation.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 P1-A update fresh daemon settings default and add regression test.
- [x] T007 P1-B reconcile documented RRF env names with production and add ADR-code env test.
- [x] T008 P1-C protect Jina max-doc-chars env parsing and add malformed-env test.
- [x] T009 P1-D surface index failures through failed `IndexResponse` and add failure-path test.
- [x] T010 P1-E preserve external embedder override in phase2 smoke harness and update reproduction docs.
- [x] T011 P1-F filter failed rerank matrix runs and add analyzer regression test.
- [x] T012 P1-G audit and update README, SKILL, and INSTALL guide default claims.
- [x] T013 P1-H scale hybrid additive boosts and add top-1 preservation test.
- [x] T014 P1-I add query expansion RCA evidence and ADR-019 addendum.
- [x] T015 Add packet-local ADR-022 documenting hybrid boost scaling.
- [x] T028 P2 Batch 1 harden JSON env parsing, path-prefix validation, and RRF sweep harness inputs.
- [x] T029 P2 Batch 2 narrow tree-sitter chunker fallback handling and expose fallback counts.
- [x] T030 P2 Batch 3 deduplicate config authorities and enforce default embedder consistency.
- [x] T031 P2 Batch 4 cache reranker path-class factors and cover real Jina/BGE adapter dispatch.
- [x] T032 P2 Batch 5 cap total query expansion variants and prioritize synonym phrase variants.
- [x] T033 P2 Batch 6 escape embedded quotes in FTS5 query normalization.
- [x] T034 P2 Batch 7 hold daemon lifetime lock and serialize benchmark daemon restarts.
- [x] T035 P2 Batch 8 document RRF sweep evidence breadth and n=1 benchmark caveats.
- [x] T036 P2 Batch 9 add ADR/dependency/dimension-migration traceability.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run targeted pytest for settings.
- [x] T017 Run targeted pytest for config.
- [x] T018 Run targeted pytest for Jina reranker.
- [x] T019 Run targeted pytest for daemon.
- [x] T020 Run shell syntax check for phase2 smoke harness.
- [x] T021 Run targeted pytest for rerank matrix analyzer.
- [x] T022 Run static doc audit for stale defaults.
- [x] T023 Run targeted pytest for hybrid dedup/ranking.
- [x] T024 Run targeted pytest for query expansion.
- [x] T025 Run full pytest suite from `mcp_server`.
- [x] T026 Run ruff for `cocoindex_code tests/`.
- [x] T027 Run strict Spec Kit validation for 020 packet.
- [x] T037 Run P2 targeted pytest and shell syntax checks.
- [x] T038 Run P2 static documentation traceability audits.
- [x] T039 Re-run full pytest suite from `mcp_server` after P2 changes.
- [x] T040 Re-run ruff for `cocoindex_code tests/` after P2 changes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Full pytest and ruff verification passed.
- [x] Strict Spec Kit validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Verification**: See `checklist.md`.
- **Evidence**: See `implementation-summary.md` and `evidence/query-expansion-root-cause-analysis.md`.
- **Decision**: See `decision-record.md` ADR-022 and ADR-023.
<!-- /ANCHOR:cross-refs -->
