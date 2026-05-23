---
title: "Tasks: Phase 1 H-1 Final-line exact-string contract"
description: "Atomic task ledger for the H-1 implementation."
trigger_phrases:
  - "108 phase 1 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/108-auto-review-quick-wins-verdict-markers-logging/001-h1-final-line-contract"
    last_updated_at: "2026-05-16T07:00:00Z"
    last_updated_by: "claude-opus-4-7-108-scaffold"
    recent_action: "phase_1_tasks_authored"
    next_safe_action: "await_council"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-108-001-tasks"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 H-1

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Await council verdict in `../ai-council/council-report.md`
- [ ] T002 Verify `sk-code-review` SKILL.md target lines (302-329) present
- [ ] T003 Verify `deep-review` YAML files at `.opencode/commands/speckit/assets/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Edit `sk-code-review/SKILL.md` Phase 4 output (add exact-string status line + example)
- [ ] T005 Edit `deep-review/SKILL.md` §Output (document verdict-line contract)
- [ ] T006 Edit `deep_start-review-loop_auto.yaml` synthesis step (add verdict derivation + final line)
- [ ] T007 Edit `deep_start-review-loop_confirm.yaml` (mirror auto)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Smoke-test sk-code-review with 3 sample diffs (clean/minor/blocking)
- [ ] T009 Smoke-test deep-review verdict with 3 synthetic findings JSONL sets
- [ ] T010 Run CI-gate parser one-liner: `tail -1 <output> | grep -E '^(\*\*Review status\*\*\|Review verdict):'`
- [ ] T011 Strict validate this packet + phase parent
- [ ] T012 Commit + push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 4 files edited
- [ ] 6 smoke tests pass (3 sk-code-review states + 3 deep-review states)
- [ ] CI-gate parser validates all 3 verdict states
- [ ] Strict validate exit 0 on this packet + phase parent
- [ ] Commit pushed to main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — phase 1 requirements
- `plan.md` — implementation sequence
- `../spec.md` — phase parent
- `../ai-council/council-report.md` — gate
- Source teaching: `106/research/review-report.md` §5.4 H-1
<!-- /ANCHOR:cross-refs -->
