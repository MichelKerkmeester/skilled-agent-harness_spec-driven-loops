# Plugin Audit Review - mk-goal

> **Iteration 2 cross-check (Opus 4.8):** 13 iteration-1 findings adjudicated (9 confirmed, 4 adjusted); 4 new findings. Full detail in [`iteration-002-opus-4.8.md`](./iteration-002-opus-4.8.md).

> **Source:** GPT-5.6-Sol-Fast (`openai/gpt-5.6-sol-fast --variant high`) read-only audit via cli-opencode, 2026-07-10. Findings are hypotheses with file:line evidence, pending remediation-time confirmation.

## Summary

Static audit found ten P1 bugs, two P2 bugs, and one test refinement. The default-only export and default-off autonomy gate are correct, but native OpenCode event-shape mismatches break lifecycle archival, evidence capture, and token accounting. Tests were not executed because they create temporary files, contrary to the read-only brief.

| Field | Value |
|-------|-------|
| Plugin | `.opencode/plugins/mk-goal.js` (/goal session-goal plugin) |
| Claude hook counterpart |  |
| Verdict | REFINE |
| Findings | 0 P0 / 10 P1 / 2 P2 / 1 refinement (13 total) |

**Parity assessment:** No Claude Code counterpart exists by design, and .claude/settings.json contains no goal-related hook registration. Behavioral parity is therefore not applicable, but there is an explicit capability gap: Claude Code cannot access or reproduce the OpenCode-session-keyed goal state.

## Finding Registry

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| F1 | P1 | bug | `.opencode/plugins/mk-goal.js:619-635` | Native session lifecycle IDs are missed and malformed deletion clears every session lock | high |
| F2 | P1 | bug | `.opencode/plugins/mk-goal.js:2583-2585` | Assistant evidence events are ignored by the supervisor | high |
| F3 | P1 | bug | `.opencode/plugins/mk-goal.js:795-812` | Native OpenCode token objects account as zero | high |
| F4 | P1 | bug | `.opencode/plugins/mk-goal.js:1961-1978` | Verifier results can be applied after same-goal evidence changes | high |
| F5 | P1 | bug | `.opencode/plugins/mk-goal.js:1866-1884` | LLM verifier treats the fire-and-forget prompt endpoint as request-response | high |
| F6 | P1 | error | `.opencode/plugins/mk-goal.js:1930-1951` | Verifier and autonomous prompt calls have no timeout | high |
| F7 | P1 | bug | `.opencode/plugins/mk-goal.js:1033-1054` | Stored session IDs can redirect mutations into another session file | high |
| F8 | P1 | error | `.opencode/plugins/mk-goal.js:1245-1274` | Archive failures are silently reported as successful lifecycle handling | high |
| F9 | P1 | bug | `.opencode/plugins/mk-goal.js:716-751` | JSONL retention never bounds continuously active logs | high |
| F10 | P1 | error | `.opencode/plugins/mk-goal.js:2336-2350` | System-transform failures silently remove goal steering | high |
| F11 | P2 | bug | `.opencode/plugins/mk-goal.js:2304-2333` | Goal brief cache grows indefinitely across goal-less sessions | high |
| F12 | P2 | bug | `.opencode/plugins/mk-goal.js:1496-1517` | Refreshing a paused goal incorrectly charges paused wall-clock time | high |
| F13 | refinement | refinement | `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs:91-123` | Lifecycle tests model synthetic payloads instead of native OpenCode events | high |

## Finding Detail

### F1 - Native session lifecycle IDs are missed and malformed deletion clears every session lock
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/plugins/mk-goal.js:619-635`
- **Evidence:** Session ID extraction accepts properties.info.sessionID/sessionId but not the properties.info.id used by native session.created/session.deleted payloads. handleEvent then calls flushVolatileLocks(sessionID) unconditionally at lines 2642-2644; a null ID invokes the all-sessions branch at lines 2559-2562 and skips archival. Lifecycle tests at mk-goal-lifecycle.test.cjs:91-95 and 724-728 use synthetic properties.sessionID payloads, masking this path.
- **Impact:** Real session deletion can leave the goal unarchived while clearing busy, prompt-block, verification, and continuation state for unrelated sessions, permitting duplicate work or continuation.
- **Proposed fix:** Resolve session lifecycle IDs by event type, using properties.info.id for session events while retaining info.sessionID for message events. On session.deleted with no resolved ID, log and return without globally flushing state.

### F2 - Assistant evidence events are ignored by the supervisor
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/plugins/mk-goal.js:2583-2585`
- **Evidence:** handleEvent records evidence only for message.updated. OpenCode text is delivered through message.part.updated, and extractAssistantEvidence already contains properties.part support at lines 965-982, but that function is never called for part events. Tests instead place content directly in properties.info at mk-goal-lifecycle.test.cjs:114-118.
- **Impact:** lastEvidence normally remains empty, so the verifier repeatedly returns not_met and active autonomy can continue until its cap despite completed work.
- **Proposed fix:** Handle message.part.updated separately, updating activity and assistant evidence from properties.part or delta without charging usage there. Add native part-event fixtures and aggregation tests for streamed text.

### F3 - Native OpenCode token objects account as zero
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/plugins/mk-goal.js:795-812`
- **Evidence:** extractUsageFromEvent passes properties.info.tokens at line 830, but tokenCountFromUsage recognizes totalTokens, inputTokens, outputTokens, and aliases only. It does not recognize OpenCode's tokens.input, tokens.output, tokens.reasoning, or nested tokens.cache fields. Tests use the non-native usage.totalTokens shape at mk-goal-lifecycle.test.cjs:117-120.
- **Impact:** tokensUsed remains zero in normal OpenCode events, so configured token budgets and budget_limited suppression do not work.
- **Proposed fix:** Parse the native token shape and explicitly define which input, output, reasoning, and cache counts contribute to the budget. Add cumulative-update and interleaved-message tests using native payloads.

### F4 - Verifier results can be applied after same-goal evidence changes
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/plugins/mk-goal.js:1961-1978`
- **Evidence:** maybeVerifyGoal reads a snapshot, awaits the verifier outside the mutation queue, and later accepts the result whenever goalId and status still match. It does not compare updatedAtMs, lastActivityMessageID, lastEvidence, or a revision. The stale-result test covers goal replacement only, not a newer message on the same goal.
- **Impact:** A verifier can mark a goal complete from old positive evidence after a newer assistant message reports a failure or blocker.
- **Proposed fix:** Capture and compare a monotonic state revision or the evidence/message identity inside the queued mutation. Return stale=true whenever relevant state changed while verification was running.

### F5 - LLM verifier treats the fire-and-forget prompt endpoint as request-response
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/plugins/mk-goal.js:1866-1884`
- **Evidence:** defaultLlmSupervisorVerifier awaits client.session.promptAsync and immediately parses its return value as an assistant response. The continuation path at lines 2227-2232 correctly treats the same method as message submission only. The supervisor test at mk-goal-supervisor.test.cjs:381-393 supplies a synthetic promptAsync response that the real asynchronous endpoint does not provide.
- **Impact:** MK_GOAL_VERIFIER=llm cannot obtain a verdict reliably and will normally convert missing or unparsable output into a blocked goal.
- **Proposed fix:** Use the response-returning session prompt API or a dedicated verifier model call, with structured response validation. Replace the synthetic promptAsync-return test with an SDK-contract fixture.

### F6 - Verifier and autonomous prompt calls have no timeout
- **Severity / Category / Confidence:** P1 / error / high
- **Location:** `.opencode/plugins/mk-goal.js:1930-1951`
- **Evidence:** runSupervisorVerifier awaits an injected or LLM verifier without a deadline, and maybeContinueGoal similarly awaits promptAsync at lines 2227-2231. Runtime locks are released only after those promises settle.
- **Impact:** A hung client or verifier can indefinitely stall session.idle handling and retain in-flight verification or continuation state.
- **Proposed fix:** Apply a configurable bounded timeout with AbortSignal support where available, convert timeout into an observable blocked or suppressed reason, and ignore any late result after timeout.

### F7 - Stored session IDs can redirect mutations into another session file
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/plugins/mk-goal.js:1033-1054`
- **Evidence:** normalizeStoredGoal prefers rawGoal.sessionId over the fallback session derived from the requested hex-keyed path and never checks equality. A read of session A can therefore return a record claiming session B; subsequent status mutations call writeGoalAtomic, which chooses the destination from that embedded B identifier.
- **Impact:** Semantic corruption or tampering in one state file violates session isolation, writes another session's file, and leaves the original inconsistent instead of failing closed.
- **Proposed fix:** Require the embedded sessionId to equal the requested fallback ID for active state reads, or always bind active records to the path-derived ID. Reject mismatches with INVALID_GOAL_STATE before mutation.

### F8 - Archive failures are silently reported as successful lifecycle handling
- **Severity / Category / Confidence:** P1 / error / high
- **Location:** `.opencode/plugins/mk-goal.js:1245-1274`
- **Evidence:** archiveGoalStateFile returns null for every rename error, including non-ENOENT errors, and applies a final catch(() => null) to the entire queued operation. The session.deleted handler consequently receives no failure to record.
- **Impact:** Permission, disk, and filesystem failures leave active state unarchived without diagnostics, making history and retention behavior silently unreliable.
- **Proposed fix:** Treat only ENOENT as benign. Propagate or durably log other errors through event_error, while keeping the event hook fail-open for OpenCode itself.

### F9 - JSONL retention never bounds continuously active logs
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/plugins/mk-goal.js:716-751`
- **Evidence:** pruneJsonlLog deletes an entire log only when its mtime exceeds retention, immediately before appendFile refreshes that mtime. A log receiving at least one entry per retention period therefore never qualifies for deletion. The continuation test at mk-goal-continuation.test.cjs:139-145 covers only an already-stale inactive file.
- **Impact:** .continuation.log and .goal-events.log can grow without bound in long-running active or debug deployments.
- **Proposed fix:** Rotate by bounded size or dated segments and prune segments by age. Add a test that repeatedly appends across retention boundaries while the log remains active.

### F10 - System-transform failures silently remove goal steering
- **Severity / Category / Confidence:** P1 / error / high
- **Location:** `.opencode/plugins/mk-goal.js:2336-2350`
- **Evidence:** appendGoalBrief catches every stat, read, JSON, normalization, and output error and returns without logging, even when MK_GOAL_DEBUG is enabled.
- **Impact:** Corrupt or unreadable state silently disables the active goal injection while tools and persisted state may still imply that goal steering is active.
- **Proposed fix:** Remain fail-open for chat generation but emit a redacted stderr diagnostic in debug mode and a bounded event_error record outside debug mode.

### F11 - Goal brief cache grows indefinitely across goal-less sessions
- **Severity / Category / Confidence:** P2 / bug / high
- **Location:** `.opencode/plugins/mk-goal.js:2304-2333`
- **Evidence:** The module-global goalBriefCache stores both present and missing paths with no size or age limit. Missing files are cached permanently; archiveGoalStateFile returns on ENOENT before invalidating that entry, and app disposal clears runtime locks but not the cache.
- **Impact:** A long-lived OpenCode process accumulates one map entry for every transformed session without a goal, producing unbounded heap growth.
- **Proposed fix:** Use a bounded LRU or TTL cache and invalidate entries on every session.deleted path, including missing files, plus app disposal.

### F12 - Refreshing a paused goal incorrectly charges paused wall-clock time
- **Severity / Category / Confidence:** P2 / bug / high
- **Location:** `.opencode/plugins/mk-goal.js:1496-1517`
- **Evidence:** For the same objective, setGoal converts both active and paused goals directly to active without recalculating startedAtMs from activeWallMs. markGoalStatus contains the required resume calculation at lines 1563-1575. In addition, status rendering at lines 2374-2375 uses now-startedAtMs even while paused.
- **Impact:** Re-setting a paused objective can immediately exhaust the autonomous wall-clock cap, while paused status reports a shrinking remaining budget that resumeGoal would not actually charge.
- **Proposed fix:** Route paused refresh through the same wall-clock transition logic as resumeGoal, and render paused elapsed time from activeWallMs.

### F13 - Lifecycle tests model synthetic payloads instead of native OpenCode events
- **Severity / Category / Confidence:** refinement / refinement / high
- **Location:** `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs:91-123`
- **Evidence:** Tests use properties.sessionID for lifecycle events and properties.info.content plus info.usage.totalTokens for assistant updates. These fixtures bypass native properties.info.id session payloads, properties.info.tokens usage, and message.part.updated text delivery.
- **Impact:** The suite passes while the principal production lifecycle paths for archival, evidence, and accounting remain broken.
- **Proposed fix:** Create shared fixtures derived from current OpenCode event types and cover session.created/deleted, message.updated native tokens, streamed message.part.updated text, malformed missing-ID events, and same-goal verifier races.

## Files Reviewed

- `.opencode/plugins/mk-goal.js`
- `.opencode/plugins/tests/mk-goal-state.test.cjs`
- `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs`
- `.opencode/plugins/tests/mk-goal-supervisor.test.cjs`
- `.claude/settings.json`
- `.opencode/plugins/tests/helpers/continuation-log.cjs`
- `.opencode/plugins/tests/mk-goal-export-contract.test.cjs`
- `.opencode/plugins/tests/mk-goal-capabilities.test.cjs`
- `.opencode/plugins/tests/mk-goal-continuation.test.cjs`
- `.opencode/plugins/tests/mk-goal-tool-path.test.cjs`
