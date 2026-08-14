---
title: "Tasks: Cross-Study Integration Capstone (Study 6)"
description: "Task ledger for the research-only 10-round integration study that welds S1-S5 into one graph-based agent-loop design."
trigger_phrases:
  - "cross study integration tasks"
  - "capstone integration tasks"
  - "study 6 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-graph-engineering/006-cross-study-integration"
    last_updated_at: "2026-08-14T06:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Completed 10-round xhigh integration; SOL-xhigh synthesis, DeepSeek fixes applied"
    next_safe_action: "Plan a mutant-driven shadow vertical-slice packet (freeze corpus + legacy build first)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fanout-cross-integration-sol-xhigh-1786684659997-imywj5"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Studies S1-S5 describe one system: a graph decides eligible work and order, a bounded loop does each unit, typed evidence stacks, and only 036 (currently dark) may authorize a protected mutation."
---
# Tasks: Cross-Study Integration Capstone (Study 6)

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Create the phase-child folder (`006-cross-study-integration/`).
- [x] T002 Run the gpt-5.6-sol integration orientation pass over S1–S5 and persist the seed (`orientation.md`).
- [x] T003 Validate the fan-out config against the runtime schema (xhigh, 10 rounds, max-iterations).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Launch the 10-round fan-out integration loop (cli-codex gpt-5.6-sol xhigh/fast).
- [x] T005 Verify round 1 route-proof contract before trusting the remaining rounds.
- [x] T006 Complete all 10 rounds (`research/lineages/cross-integration-sol-xhigh/iterations/`).
- [x] T007 Synthesize `research/research.md` with gpt-5.6-sol xhigh.
- [x] T008 Verify the synthesis with DeepSeek V4 Pro and apply the fixes (convergence reconciliation, artifact downgrade, citation constraints, R-owner, issuer-security, honesty verbs).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Confirm 10 route-proof iteration records in `deep-research-state.jsonl`.
- [x] T010 Confirm the spine + P1–P8 + six tensions resolved and 036-dark carried end-to-end.
- [x] T011 Create Level 1 companion docs (`plan.md`, `tasks.md`, `implementation-summary.md`).
- [x] T012 Generate phase-child metadata and register the child on the 037 phase parent.
- [x] T013 Run strict spec validation and report result.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Capstone synthesis, verification, plain-language, and state artifacts exist.
- [x] Spine + eight interconnection artifacts resolved and independently verified; 036-dark stated.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Implementation Summary**: See `implementation-summary.md`.
- **Research Synthesis**: See `research/research.md`.

<!-- /ANCHOR:cross-refs -->
