---
title: "Tasks: Prompt-time rule injection research"
description: "Task ledger for the prompt-keyed research round: enumerate, test against the bar, and record every refusal."
trigger_phrases:
  - "prompt-time rule injection tasks"
  - "injection refusal ledger tasks"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection/001-deep-research"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All tasks complete: eighteen refusals recorded, promotion target named"
    next_safe_action: "Hand the promotion target to the operator decision"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-12-smart-rule-injection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Prompt-time rule injection research

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T101 Enumerate candidate rules from the corpus and the hook surface. — `18` candidates gathered for judging.
- [x] T102 Read the gate corpus and the resident-layer document. — the two texts the bar tests a candidate against.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T103 Apply the bar to each candidate. — a candidate that restates an always-loaded disposition is refused.
- [x] T104 Record each refusal with its deciding test. — `18` refusals, each naming the test that produced it.
- [x] T105 Identify any read-side obligation the resident layer lacks. — one clause named: the delegation self-lens.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T106 Confirm every claim cites a source that resolves. — iteration records read back; no claim left uncited.
- [x] T107 Name the promotion target and its owner. — the resident-layer location and the operator, stated in the decision record.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. — `7` of `7` tasks complete.
- [x] No blocked tasks remain. — `0` blocked tasks.
- [x] Manual verification passed. — the bar, the refusal set, and the promotion target were read back from the iteration records.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Decision record**: See `../decisions.md`.

<!-- /ANCHOR:cross-refs -->
