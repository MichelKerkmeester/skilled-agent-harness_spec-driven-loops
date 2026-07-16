---
title: "Tasks: 004 — Tests, Goldens + Shadow Eval"
description: "T### task list for the tests/goldens/shadow-eval sub-phase: goldens fixture, cold-start/latency/threshold/backfill tests, ENV flag docs, shadow→union promotion evidence."
trigger_phrases:
  - "027 phase 004 goldens shadow eval tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/004-tests-goldens-shadow-eval"
    last_updated_at: "2026-06-10T10:50:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Marked completed with verification evidence"
    next_safe_action: "Run live embedding eval before union promotion"
    blockers: ["Union promotion blocked pending live eval evidence"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 004 — Tests, Goldens + Shadow Eval

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)` • `REQ-NNN` = parent spec requirement
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create trigger goldens fixture (~40 phrases × {exact, paraphrase, distractor}; CJK + Latin) (REQ-012, REQ-014) (`mcp_server/tests/fixtures/trigger-goldens.json`) — Evidence: `tests/trigger-goldens.vitest.ts` passed with 40 synthetic cases.
- [x] T002 [P] Document the 5 `SPECKIT_SEMANTIC_TRIGGERS*` flags with defaults (REQ-009) (`mcp_server/ENV_REFERENCE.md`) — Evidence: mode row added; count line bumped 170→171; defaults remain OFF/shadow.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Cold-start test: uncached phrase skipped silently; actual `no_query_embedding` signal recorded (REQ-011) (`mcp_server/tests/trigger-cold-start.vitest.ts`) — Evidence: new suite passed.
- [x] T004 Latency-budget test: 30-50ms PASS / 100ms WARN preserved with shadow stage active (REQ-013) (`mcp_server/tests/trigger-latency-budget.vitest.ts`) — Evidence: deterministic work-unit budget passed.
- [x] T005 Threshold-tuning test consuming shadow telemetry (threshold-band buckets) (REQ-010) (`mcp_server/tests/trigger-threshold-tuning.vitest.ts`) — Evidence: buckets populated for above, near, and below threshold.
- [x] T006 Resumable-backfill test: interrupted backfill restarts without duplicate ready rows (REQ-011) (`mcp_server/tests/trigger-backfill-resume.vitest.ts`) — Evidence: limited pass resumed to 3 unique ready rows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run synthetic goldens metrics; record live 768d retune as blocked (REQ-012, REQ-014) — Evidence: exact precision 1.0; paraphrase recall 1.0; distractor FP 0.
- [x] T008 Capture shadow→union promotion checklist evidence (FP, recall, latency, cost, rollback) (REQ-010) — Evidence: implementation summary marks promotion blocked pending live-profile data.
- [x] T009 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/004-tests-goldens-shadow-eval --strict` — Evidence: strict validation exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Goldens metrics pass; flags documented; promotion gate evidence recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md` (semantic trigger fallback phase parent)
<!-- /ANCHOR:cross-refs -->
