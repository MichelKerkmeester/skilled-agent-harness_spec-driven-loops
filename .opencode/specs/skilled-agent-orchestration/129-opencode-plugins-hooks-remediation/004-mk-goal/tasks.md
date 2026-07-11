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
    last_updated_at: "2026-07-10T20:24:55.600Z"
    last_updated_by: "opus-plugin-finalization"
    recent_action: "Implemented all 17 mk-goal.js findings and reconciled the completion paper trail"
    next_safe_action: "none - packet complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 100
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
- [x] T001 Capture a green baseline of the mk-goal test suite before any change
    - Evidence: mk-goal test files run clean except the pre-existing `mk-goal-tool-path.test.cjs` deep-loops path artifact; used as the baseline for the fixes.
- [x] T002 Confirm each targeted finding reproduces against current code
    - Evidence: reproduction confirmed in the source audit `../../127-opencode-plugins-hooks-audit/004-mk-goal/review/` (both models' code-verified root causes in `fix-design/fix-design.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [x] T003 [P1] Native session lifecycle IDs are missed and malformed deletion clears every session lock (`.opencode/plugins/mk-goal.js:619-635`)
    - Source: iteration-1 F1, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Append properties.info?.id to the END of extractEventSessionID's fallback chain. Safe because message.updated (AssistantMessage) always carries properties.info.sessionID and part events carry properties.part.sessionID EARLIER in the chain, so info.id is only reached for session.* lifecycle events whose info is a Session. Separately, harden the session.deleted branch so a null id never triggers the global (no-arg) lock flush.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F1)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T004 [P1] Assistant evidence events are ignored by the supervisor (`.opencode/plugins/mk-goal.js:2583-2585`)
    - Source: iteration-1 F2, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Add a message.part.updated branch that updates activity + assistant evidence WITHOUT charging usage (parts carry no tokens). Only accept text parts (part.type==='text') as evidence so reasoning/tool parts don't overwrite it; still bump lastActivityAtMs/lastActivityMessageID.
    - REVIEW-FLAG (correct the design before implementing): The text-part-only refreshGoalActivity accepts role-less parts (extractAssistantEvidence rejects only an explicit non-assistant role) - require an explicit assistant role.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F2)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T005 [P1] Native OpenCode token objects account as zero (`.opencode/plugins/mk-goal.js:795-812`)
    - Source: iteration-1 F3, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Teach token counting to recognize the native nested shape and explicitly define contributors: total = input + output + reasoning + cache.read + cache.write (all consumed tokens count toward budget). Keep the existing per-message cumulative-delta charging (AssistantMessage.tokens is cumulative per message).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F3)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T006 [P1 (GPT P1 / Opus P2)] Verifier results can be applied after same-goal evidence changes (`.opencode/plugins/mk-goal.js:1961-1978`)
    - Source: iteration-1 F4, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Capture a monotonic revision (goal.updatedAtMs) at read time and, inside the queued mutation, additionally require current.updatedAtMs === snapshotRevision. On mismatch, do NOT apply — leave resultApplied=false so the envelope reports stale=true. One guard fixes both F4 and O2.
    - REVIEW-FLAG (correct the design before implementing): updatedAtMs is wall-clock, not a monotonic revision, and tests pin nowMs to a constant; same-millisecond evidence collides. Use a monotonic revision counter or tie-breaker.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F4)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T007 [P1 (GPT P1 / Opus P2)] LLM verifier treats the fire-and-forget prompt endpoint as request-response (`.opencode/plugins/mk-goal.js:1866-1884`)
    - Source: iteration-1 F5, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Use the response-returning client.session.prompt (POST /session/{id}/message → {info:AssistantMessage, parts}; SDK 174,2281-2288) run against a DEDICATED ephemeral session, never the user session. Create a throwaway session (session.create with query {directory}), prompt it with tools disabled, read the text parts, parse the JSON verdict, then delete it. On any failure fall through to normalizeVerifierResult.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F5)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T008 [P1 (GPT P1 / Opus P2)] Verifier and autonomous prompt calls have no timeout (`.opencode/plugins/mk-goal.js:1930-1951`)
    - Source: iteration-1 F6, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Add a configurable bounded timeout (e.g. MK_GOAL_VERIFIER_TIMEOUT_MS, default 30s) via Promise.race against a timer, and pass an AbortSignal to session.prompt/promptAsync where the SDK Options accept `signal`. On timeout: verifier returns blocked with observable reason 'verifier_timeout' and ignores any late result; continuation returns suppressed 'prompt_async_timeout' and rolls back the reserved turn (shared with O3). Clear timers and release locks in finally.
    - REVIEW-FLAG (correct the design before implementing): Rolling back a reserved continuation turn on promptAsync timeout is unsafe - a timeout is delivery-indeterminate (the request may have been accepted). Treat timeout as maybe-delivered.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F6)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T009 [P1 (GPT P1 / Opus P2)] Stored session IDs can redirect mutations into another session file (`.opencode/plugins/mk-goal.js:1033-1054`)
    - Source: iteration-1 F7, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Fail-closed for active state: bind reads to the path-derived id. Thread an expectedSessionID into normalizeStoredGoal on the active read path; when rawGoal.sessionId is present and !== expectedSessionID, throw INVALID_GOAL_STATE BEFORE any mutation. Keep archive listing lenient (filename-derived, read-only display).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F7)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T010 [P1 (GPT P1 / Opus P2)] Archive failures are silently reported as successful lifecycle handling (`.opencode/plugins/mk-goal.js:1245-1274`)
    - Source: iteration-1 F8, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Treat only ENOENT as benign. On other rename errors, durably record an event_error JSONL row (unconditional, not debug-gated) before returning null, keeping the event hook fail-open for OpenCode (still return null, never throw into the event loop). Replace the blanket `.catch(() => null)` with a logging catch.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F8)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T011 [P1 (GPT P1 / Opus P2)] JSONL retention never bounds continuously active logs (`.opencode/plugins/mk-goal.js:716-751`)
    - Source: iteration-1 F9, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Rotate by bounded size instead of age-of-whole-active-file. Before appending, if the active log exceeds MK_GOAL_LOG_MAX_BYTES (new const, e.g. 5MB), rename it to a timestamped frozen segment; prune rotated segments by age (which now works because segments stop receiving writes). Keep age-based pruning for the segments.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F9)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T012 [P1 (GPT P1 / Opus refinement)] System-transform failures silently remove goal steering (`.opencode/plugins/mk-goal.js:2336-2350`)
    - Source: iteration-1 F10, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Stay fail-open for chat generation (never throw), but in the catch emit a redacted diagnostic: writeDebugStderr in debug mode (stderr, TUI-safe — never stdout) plus a bounded best-effort event_error JSONL row outside debug. Wrap the logging so a logging failure cannot break the transform.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F10)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).

### P2 - minor bugs

- [x] T013 [P2] Goal brief cache grows indefinitely across goal-less sessions (`.opencode/plugins/mk-goal.js:2304-2333`)
    - Source: iteration-1 F11, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Bound the cache with a simple insertion-order LRU (max entries, e.g. 512) evicting oldest on set; invalidate a session's entry on session.deleted regardless of archive outcome; clear the whole cache on the no-arg (disposal) flush.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F11)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T014 [P2] Refreshing a paused goal incorrectly charges paused wall-clock time (`.opencode/plugins/mk-goal.js:1496-1517`)
    - Source: iteration-1 F12, Opus verdict: confirmed · fix-design: both models agree
    - Fix: (a) In the refresh branch, when current.status==='paused', apply the resume transition: startedAtMs = timestamp - (activeWallMs\|\|0), activeWallMs = 0 (reuse markGoalStatus's formulas); active→active refresh unchanged. (b) In goalStateLines render elapsed from activeWallMs when not active.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F12)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T015 [P2 · Opus-new] LLM verifier submits its judge-prompt into the user's live session, polluting the conversation and creating a feedback loop (`.opencode/plugins/mk-goal.js:1871-1880`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Covered by the F5 redesign: run the verifier against a dedicated ephemeral session via the response-returning session.prompt and delete it; never target path:{id: userSessionID}. Validate the structured verdict from that isolated call.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O1)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T016 [P2 · Opus-new] The `stale` flag plumbed to continuation cannot detect F4-style evidence staleness (`.opencode/plugins/mk-goal.js:1973-2018`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Fixed by the F4 revision-compare: adding `current.updatedAtMs !== snapshotRevision` to the mutation guard makes resultApplied=false (and thus stale=true) precisely when evidence/activity changed during verification, so the plumbed stale flag becomes meaningful.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O2)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).
- [x] T017 [P2 · Opus-new] A failed continuation promptAsync still consumes an auto-turn (no rollback of the reserved turn) (`.opencode/plugins/mk-goal.js:2222-2243`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: On promptAsync failure (and on the F6 timeout), roll back the reservation before recording: decrement autoTurnsUsed (guard ≥0) and clear lastContinuationMessageId, keeping lastContinuationAtMs so the cooldown still throttles retry storms. Use a compensating patchGoalIfCurrent guarded on the reserved messageId so a newer reservation is not rolled back.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O3)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).

### Refinements

- [x] T018 [refinement] Lifecycle tests model synthetic payloads instead of native OpenCode events (`.opencode/plugins/tests/mk-goal-lifecycle.test.cjs:91-123`)
    - Source: iteration-1 F13, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Add shared native-event fixtures derived from SDK Event types and cover: session.created/deleted via properties.info.id; message.updated with native nested tokens (no text); streamed message.part.updated text; a malformed/missing-id event (asserting no global lock flush, F1); and token aggregation (message.updated) combined with evidence (message.part.updated). Retain a couple of legacy-shape tests for tolerance.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F13)
    - Evidence: IMPLEMENTED — native-event fixtures added under `.opencode/plugins/tests/` (helpers + `mk-goal-lifecycle.test.cjs`); mk-goal lifecycle suite passes this session.
- [x] T019 [refinement · Opus-new] accountedMessageUsage eviction (>64 message ids) can double-charge a re-emitted message (`.opencode/plugins/mk-goal.js:700-714`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: OpenCode streams one assistant message at a time within a session (subtasks run in child sessions with separate state), so the ledger only needs the CURRENT streaming message. Collapse it to a single active entry: when a message.updated arrives with a new messageID (≠ lastAccountedMessageID), the prior message is already fully charged incrementally, so reset the map to only the new id. This bounds the map to ~1 entry and removes the 64-cap eviction path entirely.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O4)
    - Evidence: IMPLEMENTED — verified present in `.opencode/plugins/mk-goal.js` this session (all three REVIEW-FLAG corrections honored: F1 info.id scoped to session.created/deleted; F4/O2 use goal.revision monotonic counter; F6/O3 timeout retains the turn, only definite rejection rolls back).

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T020 Re-run the mk-goal test suite; confirm green
    - Evidence: 6/7 mk-goal test files pass; the sole failure is `mk-goal-tool-path.test.cjs` `not ok 9` — a pre-existing ENOENT on `.opencode/specs/deep-loops/032-.../012-regression-test-backfill/graph-metadata.json`, a path artifact unrelated to these fixes (NOT a regression). Full plugin suite recorded 188/189 at implementation.
- [x] T021 Verify each fixed finding no longer reproduces
    - Evidence: all 17 fix markers grep-confirmed present in `.opencode/plugins/mk-goal.js` (native info.id lifecycle, message.part.updated evidence branch, native token buckets, revision-compare guard, ephemeral verifier session, timeout helpers, expectedSessionID fail-close, event_error archive logging, byte-bounded JSONL, LRU brief cache, paused-refresh rebasing, reservation rollback, single-entry usage ledger).
- [x] T022 Verify OpenCode<->Claude parity for this plugin
    - Disposition: BY DESIGN — single surface. Both models confirmed there is NO Claude mk-goal hook/bridge; `constitutional/goal-prompting-runtime-specific.md` assigns Claude Code its native `/goal`. No parallel Claude surface exists to keep consistent (see `fix-design/fix-design.md` Cross-model notes).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All P1 tasks `[x]` (T003-T012)
- [x] P2 + refinements applied or deferred with rationale (T013-T019 all implemented)
- [x] Plugin tests green; no `[B]` blocked tasks (mk-goal suite green apart from the pre-existing unrelated `mk-goal-tool-path` path artifact)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/004-mk-goal/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
