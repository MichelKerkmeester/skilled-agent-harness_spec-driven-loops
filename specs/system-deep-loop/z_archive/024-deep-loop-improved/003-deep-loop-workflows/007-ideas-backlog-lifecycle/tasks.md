---
title: "Tasks: Ideas-Backlog Threshold and Rejection Lifecycle"
description: "Completed task ledger for idea observation, promotion, and rejection lifecycle work."
trigger_phrases:
  - "ideas backlog lifecycle"
  - "idea_observed idea_promoted"
  - "minIdeaObservations threshold"
  - "idea promotion deep research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/003-deep-loop-workflows/007-ideas-backlog-lifecycle"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md"
      - ".opencode/skills/deep-loop-workflows/deep-research/references/state/state_jsonl.md"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/agents/deep-research.md"
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Ideas-Backlog Threshold and Rejection Lifecycle

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the completed spec and capture the idea lifecycle contract (`spec.md`).
- [x] T002 Confirm integration with leaf 006 rejected-pattern cache (`spec.md`).
- [x] T003 [P] Identify protocol, JSONL, YAML, agent, and reducer surfaces.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `idea_observed`, `idea_promoted`, and `idea_rejected` event docs (`state_jsonl.md`).
- [x] T005 Document idea lifecycle and threshold behavior (`loop_protocol.md`).
- [x] T006 Add `minIdeaObservations` config field with default 2 (`deep_research_config.json`).
- [x] T007 Accumulate observations per idea ID in reducer state (`reduce-state.cjs`).
- [x] T008 Promote ideas from the reducer when threshold is met (`reduce-state.cjs`).
- [x] T009 Update leaf agent instructions to emit `idea_observed` only (`deep-research.md`).
- [x] T010 Add idea lifecycle workflow step (`deep_research_auto.yaml`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify two observations promote an idea in reducer output.
- [x] T012 Verify leaf agents do not emit `idea_promoted` directly.
- [x] T013 Verify `idea_rejected` suppresses promoted and next-focus candidates.
- [x] T014 Update plan and task docs to reflect the completed lifecycle work (`plan.md`, `tasks.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the completed specification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
