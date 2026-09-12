---
title: "Tasks: Event-triggered injection research"
description: "Task ledger for the event-keyed research round: refuse the operator ideas structurally, measure the strongest candidate, defer the survivor."
trigger_phrases:
  - "event-triggered injection tasks"
  - "event frequency measurement tasks"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection/002-event-triggered-injection"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All tasks complete: two refusals and one deferred candidate recorded"
    next_safe_action: "Measure the branch-name guard before encoding it"
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

# Tasks: Event-triggered injection research

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T201 Take the event-keyed question and both operator ideas as candidates. — completion-presentation and question-tool triggering.
- [x] T202 Locate the rules each candidate event can reach. — the reach test's input for both ideas.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T203 Apply the reach test. — the completion event reaches no rules; its one model-visible channel lost its reader.
- [x] T204 Apply the author test. — a question has no author outside the model, so no surface can compose the ask.
- [x] T205 Read the strongest new candidate's state log. — about `8` firings a minute at peak while gates sit unresolved for tens of minutes.
- [x] T206 Record the survivor and its required measurement. — the branch-name allocation guard, deferred pending measurement.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T207 Confirm each refusal states a structural reason. — both operator ideas carry their deciding test.
- [x] T208 Confirm the rate came from the log. — the firing count and the observed gate lifetime are recorded.
- [x] T209 Leave the sentinel's shipped behavior unchanged. — closed as decided, revisited only if its log gains a consumer.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. — `9` of `9` tasks complete.
- [x] No blocked tasks remain. — `0` blocked tasks.
- [x] Manual verification passed. — refusals, measurement, and the deferred candidate were read back from the iteration records.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Decision record**: See `../decisions.md`.

<!-- /ANCHOR:cross-refs -->
