---
title: "Tasks: mk-goal remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mk-goal remediation"
  - "mk-goal fixes"
  - "mk-goal bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/004-mk-goal"
    last_updated_at: "2026-07-10T09:27:08.451Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Enumerated 17 fix tasks"
    next_safe_action: "Implement P1 tasks first"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mk-goal remediation

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

**Task Format**: `T### [P?] Description (file path)`. Each task carries its source finding id, severity, and the audit's proposed fix.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Capture a green baseline of the mk-goal test suite before any change
- [ ] T002 Confirm each targeted finding reproduces against current code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [ ] T003 [P1] Native session lifecycle IDs are missed and malformed deletion clears every session lock (`.opencode/plugins/mk-goal.js:619-635`)
    - Source: iteration-1 F1, Opus verdict: confirmed
    - Fix: Resolve session lifecycle IDs by event type, using properties.info.id for session events while retaining info.sessionID for message events. On session.deleted with no resolved ID, log and return without globally flushing state.
- [ ] T004 [P1] Assistant evidence events are ignored by the supervisor (`.opencode/plugins/mk-goal.js:2583-2585`)
    - Source: iteration-1 F2, Opus verdict: confirmed
    - Fix: Handle message.part.updated separately, updating activity and assistant evidence from properties.part or delta without charging usage there. Add native part-event fixtures and aggregation tests for streamed text.
- [ ] T005 [P1] Native OpenCode token objects account as zero (`.opencode/plugins/mk-goal.js:795-812`)
    - Source: iteration-1 F3, Opus verdict: confirmed
    - Fix: Parse the native token shape and explicitly define which input, output, reasoning, and cache counts contribute to the budget. Add cumulative-update and interleaved-message tests using native payloads.
- [ ] T006 [P1 (GPT P1 / Opus P2)] Verifier results can be applied after same-goal evidence changes (`.opencode/plugins/mk-goal.js:1961-1978`)
    - Source: iteration-1 F4, Opus verdict: adjusted
    - Fix: Capture and compare a monotonic state revision or the evidence/message identity inside the queued mutation. Return stale=true whenever relevant state changed while verification was running.
- [ ] T007 [P1 (GPT P1 / Opus P2)] LLM verifier treats the fire-and-forget prompt endpoint as request-response (`.opencode/plugins/mk-goal.js:1866-1884`)
    - Source: iteration-1 F5, Opus verdict: confirmed
    - Fix: Use the response-returning session prompt API or a dedicated verifier model call, with structured response validation. Replace the synthetic promptAsync-return test with an SDK-contract fixture.
- [ ] T008 [P1 (GPT P1 / Opus P2)] Verifier and autonomous prompt calls have no timeout (`.opencode/plugins/mk-goal.js:1930-1951`)
    - Source: iteration-1 F6, Opus verdict: adjusted
    - Fix: Apply a configurable bounded timeout with AbortSignal support where available, convert timeout into an observable blocked or suppressed reason, and ignore any late result after timeout.
- [ ] T009 [P1 (GPT P1 / Opus P2)] Stored session IDs can redirect mutations into another session file (`.opencode/plugins/mk-goal.js:1033-1054`)
    - Source: iteration-1 F7, Opus verdict: adjusted
    - Fix: Require the embedded sessionId to equal the requested fallback ID for active state reads, or always bind active records to the path-derived ID. Reject mismatches with INVALID_GOAL_STATE before mutation.
- [ ] T010 [P1 (GPT P1 / Opus P2)] Archive failures are silently reported as successful lifecycle handling (`.opencode/plugins/mk-goal.js:1245-1274`)
    - Source: iteration-1 F8, Opus verdict: adjusted
    - Fix: Treat only ENOENT as benign. Propagate or durably log other errors through event_error, while keeping the event hook fail-open for OpenCode itself.
- [ ] T011 [P1 (GPT P1 / Opus P2)] JSONL retention never bounds continuously active logs (`.opencode/plugins/mk-goal.js:716-751`)
    - Source: iteration-1 F9, Opus verdict: confirmed
    - Fix: Rotate by bounded size or dated segments and prune segments by age. Add a test that repeatedly appends across retention boundaries while the log remains active.
- [ ] T012 [P1 (GPT P1 / Opus refinement)] System-transform failures silently remove goal steering (`.opencode/plugins/mk-goal.js:2336-2350`)
    - Source: iteration-1 F10, Opus verdict: confirmed
    - Fix: Remain fail-open for chat generation but emit a redacted stderr diagnostic in debug mode and a bounded event_error record outside debug mode.

### P2 - minor bugs

- [ ] T013 [P2] Goal brief cache grows indefinitely across goal-less sessions (`.opencode/plugins/mk-goal.js:2304-2333`)
    - Source: iteration-1 F11, Opus verdict: confirmed
    - Fix: Use a bounded LRU or TTL cache and invalidate entries on every session.deleted path, including missing files, plus app disposal.
- [ ] T014 [P2] Refreshing a paused goal incorrectly charges paused wall-clock time (`.opencode/plugins/mk-goal.js:1496-1517`)
    - Source: iteration-1 F12, Opus verdict: confirmed
    - Fix: Route paused refresh through the same wall-clock transition logic as resumeGoal, and render paused elapsed time from activeWallMs.
- [ ] T015 [P2 · Opus-new] LLM verifier submits its judge-prompt into the user's live session, polluting the conversation and creating a feedback loop (`.opencode/plugins/mk-goal.js:1871-1880`)
    - Source: Opus iteration-2 (new)
    - Fix: Run the verifier against a dedicated ephemeral session or a direct model/completions call, never path:{id: userSessionID}; validate a structured response from that isolated call.
- [ ] T016 [P2 · Opus-new] The `stale` flag plumbed to continuation cannot detect F4-style evidence staleness (`.opencode/plugins/mk-goal.js:1973-2018`)
    - Source: Opus iteration-2 (new)
    - Fix: Capture a monotonic revision (updatedAtMs or lastActivityMessageID) at read time and, inside the queued mutation, treat the result as stale (skip apply, set stale=true) when it changed; never overwrite current.lastEvidence with older snapshot evidence.
- [ ] T017 [P2 · Opus-new] A failed continuation promptAsync still consumes an auto-turn (no rollback of the reserved turn) (`.opencode/plugins/mk-goal.js:2222-2243`)
    - Source: Opus iteration-2 (new)
    - Fix: On promptAsync failure, roll the reservation back (decrement autoTurnsUsed, clear lastContinuationMessageId) before recording the suppressed reason, or reserve the turn only after a successful submit.

### Refinements

- [ ] T018 [refinement] Lifecycle tests model synthetic payloads instead of native OpenCode events (`.opencode/plugins/tests/mk-goal-lifecycle.test.cjs:91-123`)
    - Source: iteration-1 F13, Opus verdict: confirmed
    - Fix: Create shared fixtures derived from current OpenCode event types and cover session.created/deleted, message.updated native tokens, streamed message.part.updated text, malformed missing-ID events, and same-goal verifier races.
- [ ] T019 [refinement · Opus-new] accountedMessageUsage eviction (>64 message ids) can double-charge a re-emitted message (`.opencode/plugins/mk-goal.js:700-714`)
    - Source: Opus iteration-2 (new)
    - Fix: Track the last-accounted cumulative per message with an LRU that is safe against re-charge, or charge deltas from a session-global cumulative counter rather than a bounded per-message map.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T020 Re-run the mk-goal test suite; confirm green
- [ ] T021 Verify each fixed finding no longer reproduces
- [ ] T022 Verify OpenCode<->Claude parity for this plugin
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All P1 tasks `[x]`
- [ ] P2 + refinements applied or deferred with rationale
- [ ] Plugin tests green; no `[B]` blocked tasks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/004-mk-goal/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
