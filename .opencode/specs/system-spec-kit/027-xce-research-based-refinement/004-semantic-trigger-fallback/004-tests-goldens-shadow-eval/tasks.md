---
title: "Tasks: 004 — Tests, Goldens + Shadow Eval"
description: "T### task list for the tests/goldens/shadow-eval sub-phase: goldens fixture, cold-start/latency/threshold/backfill tests, ENV flag docs, shadow→union promotion evidence."
trigger_phrases:
  - "027 phase 004 goldens shadow eval tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/004-tests-goldens-shadow-eval"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Extracted Sub-Phase 4 tasks from 007 leaf tasks"
    next_safe_action: "Claim T001 (goldens fixture)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Create trigger goldens fixture (~40 phrases × {exact, paraphrase, distractor}; CJK + Latin) (REQ-012, REQ-014) (`mcp_server/__tests__/fixtures/trigger-goldens.json`)
- [ ] T002 [P] Document the 5 `SPECKIT_SEMANTIC_TRIGGERS*` flags with defaults (REQ-009) (`mcp_server/ENV_REFERENCE.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Cold-start test: uncached phrase skipped silently; `semantic_trigger_skipped_uncached` logged (REQ-011) (`mcp_server/__tests__/triggers/cold-start.vitest.ts`)
- [ ] T004 Latency-budget test: 30-50ms PASS / 100ms WARN preserved with shadow stage active (REQ-013) (`mcp_server/__tests__/triggers/latency-budget.vitest.ts`)
- [ ] T005 Threshold-tuning test consuming shadow telemetry (threshold-band buckets) (REQ-010) (`mcp_server/__tests__/triggers/threshold-tuning.vitest.ts`)
- [ ] T006 Resumable-backfill test: interrupted backfill restarts without duplicate ready rows (REQ-011) (`mcp_server/__tests__/triggers/backfill-resume.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run goldens metrics; re-tune threshold/margin for 768d Nomic (REQ-012, REQ-014)
- [ ] T008 Capture shadow→union promotion checklist evidence (FP, recall, latency, cost, rollback) (REQ-010)
- [ ] T009 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/004-tests-goldens-shadow-eval --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Goldens metrics pass; flags documented; promotion gate evidence recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md` (semantic trigger fallback phase parent)
<!-- /ANCHOR:cross-refs -->
