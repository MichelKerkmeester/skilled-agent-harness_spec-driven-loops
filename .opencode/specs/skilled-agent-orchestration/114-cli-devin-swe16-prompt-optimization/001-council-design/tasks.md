---
title: "Tasks: Council Design"
description: "Numbered tasks for 3-seat deep-ai-council deliberation"
trigger_phrases:
  - "114/001 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-cli-devin-swe16-prompt-optimization/001-council-design"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded tasks.md"
    next_safe_action: "Start T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114012"
      session_id: "114-001-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Council Design

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] T001 Confirm cli-codex authenticated (`codex --version` returns 0)
- [ ] T002 Confirm cli-claude-code authenticated (`claude --version` returns 0)
- [ ] T003 Confirm cli-gemini authenticated (`gemini --version` returns 0)
- [ ] T004 Verify deep-ai-council skill discoverable (`skill_advisor.py "deep-ai-council"` returns confidence ≥ 0.8)
- [ ] T005 Create `001-council-design/ai-council/` directory
- [ ] T006 Initialize `ai-council/ai-council-state.jsonl` with `{type:"council_start", ts:"<iso>", packet:"114/001"}` row
- [ ] T007 Extract proposed rubric + knob set + fixture catalog from parent 114 spec.md (this is the pre-seeded starting frame for seat prompts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Author Seat A prompt (Pragmatist): emphasize simplicity, "what can we skip" framing
- [ ] T011 Dispatch Seat A via cli-codex; capture stdout → `ai-council/seat-proposals/pragmatist.md`
- [ ] T012 Append state row `{type:"seat_dispatch", seat:"A", executor:"cli-codex", status:"complete", duration_ms:<n>}`
- [ ] T013 Author Seat B prompt (Skeptic): emphasize failure modes, "what catches real bugs"
- [ ] T014 Dispatch Seat B via cli-claude-code; capture → `ai-council/seat-proposals/skeptic.md`
- [ ] T015 Append state row for Seat B
- [ ] T016 Author Seat C prompt (Optimizer): emphasize rubric separability, "what maximally distinguishes good from bad"
- [ ] T017 Dispatch Seat C via cli-gemini; capture → `ai-council/seat-proposals/optimizer.md`
- [ ] T018 Append state row for Seat C
- [ ] T019 Cross-seat critique: each seat reviews the other two proposals, write `ai-council/critique.md` with ≥ 1 substantive disagreement
- [ ] T020 Convergence vote: tally 2-of-3 per decision; unresolved → `escalated_decisions[]` list
- [ ] T021 Author `ai-council/council-report.md` with final ratified rubric, fixtures, knobs, budget, loop-shape recommendation
- [ ] T022 Append final state row `{type:"council_complete", convergence_summary:..., escalations:...}`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Verify REQ-001: `ls ai-council/seat-proposals/` shows 3 files
- [ ] T031 Verify REQ-002: each proposal has § Q1, § Q2, § Q3 sections
- [ ] T032 Verify REQ-003: critique.md cites ≥ 1 cross-seat contradiction
- [ ] T033 Verify REQ-004: council-report.md § Convergence has vote tally per decision OR escalations listed
- [ ] T034 Verify REQ-005: `git status --short` shows no files modified outside `001-council-design/ai-council/`
- [ ] T035 Verify REQ-006: rubric has 5 dimensions with weights summing to 1.00
- [ ] T036 Verify REQ-007: fixture catalog has ≥ 5 entries each with `grounded_in` citation
- [ ] T037 Verify REQ-008: budget envelope has maxDispatches, maxIterations, rate-limit policy
- [ ] T038 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 001-council-design --strict` — exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 verification tasks (T030..T034) pass
- [ ] All P1 verification tasks (T035..T037) pass
- [ ] strict-validate (T038) exit 0
- [ ] Operator sign-off on `council-report.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
