# Fix Design - mk-goal (reconciled)

> Two independent, code-verified fix designs per finding: **GPT-5.6-Sol (high)** and **Opus 4.8 (high)**, each re-read the real code. **AGREE** = both designed a fix (high confidence). **DISPUTED** = one model judges the finding a non-issue - your call before implementing.

## Summary

17 findings - 17 both-agree, 0 disputed.

## Cross-model notes

- **GPT-5.6-Sol:** Shared fixes should be implemented once: F4+O2 use one verifier-basis compare; F5+O1 use one isolated response-returning verifier path; F1+F8+F11 form one deletion/archive/cache chain; F2+F3+F13 establish the native event contract; F6+O3 must distinguish definite rejection from indeterminate timeout; F9 bounds diagnostics added by F8/F10. Recommended order: native event fixtures, session-ID safety, archive/cache handling, token/evidence handling, verifier isolation, verifier staleness, timeout/rollback behavior, then log/cache bounds and paused timing. All listed plugin defects are confirmed. The claimed Claude hook version is a non-issue in the inspected repository: .claude/settings.json wires SessionStart/UserPromptSubmit/PreCompact/Stop/PostToolUse, but the checked hook implementations contain no mk-goal state, supervisor, continuation, or plugin bridge; goal-prompting-runtime-specific.md:24-38 explicitly assigns Claude Code to native /goal. Therefore these fixes belong to the OpenCode plugin and its tests, while the generic Claude hooks should not be modified for artificial parity.
- **Opus 4.8:** SINGLE SURFACE — cross-runtime parity premise is FALSE for mk-goal: there is NO Claude hook version. Verified: no goal hook or bridge under .claude/ (grep empty), .claude/settings.json hooks (SessionStart/UserPromptSubmit/PreCompact/Stop/PostToolUse) do not wire mk-goal, and constitutional/goal-prompting-runtime-specific.md explicitly states Claude Code uses its OWN native /goal and that 'no plugin_bridges/*.mjs exists for mk-goal'. Every fix therefore touches ONLY .opencode/plugins/mk-goal.js and its tests; there is no parallel Claude surface to keep consistent. SHARED ROOT CAUSE A (native event shapes) — F1, F2, F3, and F13 all stem from the plugin/tests being written against synthetic event shapes rather than the real SDK Event types (types.gen.d.ts): fix together behind shared native fixtures. Critically, F2 and F3 are COMPLEMENTARY and BOTH required — AssistantMessage (message.updated) carries tokens but no text; assistant text arrives only via message.part.updated. Without F2 the supervisor has zero evidence even after F5, and without F3 the budget never advances. SHARED ROOT CAUSE B (verifier) — F5 and O1 are ONE fix (isolated ephemeral session + response-returning session.prompt; never the user session); F4 and O2 are ONE fix (snapshot updatedAtMs revision compare, which makes both the apply-guard and the plumbed stale flag correct); F6 (timeout) and O3 (reservation rollback) share the rollback mechanism. ORDERING: land F1/F2/F3 with F13 fixtures; do F5 before rewriting the supervisor test; ensure F9 rotation covers .goal-events.log since F8/F10 add event_error rows to it. NON-ISSUES: none — all 17 confirmed against real code and the SDK. The existing 'llm verifier uses promptAsync response' test (supervisor 375-418) is actively misleading: it mocks a 204-void endpoint as if it returned JSON. TUI SAFETY: all new diagnostics must go to stderr (debug) or JSONL logs — never stdout. PROCESS NOTE: this was a read-only design pass; no files were modified, and per the task's strict output contract I returned only this JSON (no plan file or ExitPlanMode, as there is no implementation to approve here).

## Per-finding fix designs

### F1 [P1] Native session lifecycle IDs are missed and malformed deletion clears every session lock
`.opencode/plugins/mk-goal.js:619-635` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. extractEventSessionID (mk-goal.js:619-636) reads properties.info.sessionID/sessionId but not properties.info.id. Native EventSessionCreated/EventSessionDeleted carry the session under properties.info (a Session; id at properties.info.id) per SDK types.gen.d.ts:493-510,465-466. So session.created/deleted resolve sessionID=null; handleEvent:2643 then calls flushVolatileLocks(null), which hits the no-arg branch (2559-2562) clearing EVERY session's runtime locks, and archiving is skipped (guarded by if(sessionID) at 2644). extractEventMessageID already reads info.id (652), confirming that is where the id lives.
- Fix approach: Append properties.info?.id to the END of extractEventSessionID's fallback chain. Safe because message.updated (AssistantMessage) always carries properties.info.sessionID and part events carry properties.part.sessionID EARLIER in the chain, so info.id is only reached for session.* lifecycle events whose info is a Session. Separately, harden the session.deleted branch so a null id never triggers the global (no-arg) lock flush.
- Exact change: In extractEventSessionID add `|| properties.info?.id` after the properties.part?.sessionId term. In handleEvent's session.deleted branch (2642-2652) move flushVolatileLocks(sessionID) INSIDE the `if (sessionID)` block so an unresolved id returns without clearing all sessions; when no id resolves, record via the existing event_error JSONL path and return.
- Acceptance: Unit test: session.deleted `{properties:{info:{id:'S'}}}` archives S's state file and flushes only S's locks while a second session's inFlight locks remain; session.created with the same native shape restores S's active goal.
- Side effects / parity: Only .opencode/plugins/mk-goal.js. No Claude parity surface exists (see notes). Verify extractEventMessageID still returns info.id as MESSAGE id for message events (unchanged).
- Test: Add native-shape created/deleted fixtures (shared with F13) plus a malformed/null-id session.deleted test asserting no cross-session lock flush.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: extractEventSessionID checks properties.info.sessionID/sessionId but not the native session object's properties.info.id at .opencode/plugins/mk-goal.js:619-636. session.deleted then passes the unresolved null to flushVolatileLocks at .opencode/plugins/mk-goal.js:2642-2644, whose null branch clears every session's volatile state at .opencode/plugins/mk-goal.js:2551-2563.
- Fix approach: Resolve properties.info.id only for event types whose info object is a session, rather than adding info.id to the generic fallback where it would misread message IDs. Treat a missing deletion ID as a malformed event and fail open without global cleanup.
- Exact change: In extractEventSessionID, retain the existing explicit session-ID candidates, then accept properties.info.id for session.created and session.deleted only. In handleEvent's session.deleted branch, require a resolved sessionID before calling flushVolatileLocks or archiveGoalStateFile; otherwise append a redacted event_error and return. Reserve no-argument flushVolatileLocks exclusively for app disposal.
- Acceptance: Native session.created and session.deleted payloads using properties.info.id restore/archive only their session. A session.deleted event with no ID records an error, preserves every session lock/status, and does not archive any state.
- Side effects / parity: Update lifecycle fixtures and the deletion/cache behavior covered by F8 and F11. This also safely handles deletion of verifier sessions introduced by F5/O1. No Claude hook change applies: .claude/settings.json:13-96 contains no mk-goal hook, and .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:24-38 assigns Claude to its native /goal with no mk-goal bridge.
- Test: In mk-goal-lifecycle.test.cjs, replace session lifecycle fixtures with properties.info.id, assert native create/delete behavior, and add a malformed deletion test that leaves another session's busy/prompt-block state intact.

---

### F2 [P1] Assistant evidence events are ignored by the supervisor
`.opencode/plugins/mk-goal.js:2583-2585` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. handleEvent handles message.updated (2583) but has no message.part.updated branch. Native assistant TEXT is delivered only via EventMessagePartUpdated (properties.part: Part/TextPart.text; SDK 354-360,320s). AssistantMessage (message.updated) has NO text/content field, only tokens (SDK 98-127). Consequence: lastEvidence is NEVER populated from native events, so runSupervisorVerifier (1932) always returns 'No verifier evidence is available' and the supervisor can never verify completion. extractAssistantEvidence already supports properties.part (965-982) but is never invoked for part events.
- Fix approach: Add a message.part.updated branch that updates activity + assistant evidence WITHOUT charging usage (parts carry no tokens). Only accept text parts (part.type==='text') as evidence so reasoning/tool parts don't overwrite it; still bump lastActivityAtMs/lastActivityMessageID.
- Exact change: In handleEvent add `if (eventType === 'message.part.updated') { if (sessionID) await refreshGoalActivity(sessionID, event, eventOptions); return; }`. refreshGoalActivity (1680) already reads messageID via extractEventMessageID (properties.part.messageID) and evidence via extractAssistantEvidence (properties.part). Add a part.type==='text' guard (in extractAssistantEvidence or a thin wrapper) so non-text parts return no evidence.
- Acceptance: A streamed message.part.updated text part sets lastEvidence and lastActivityMessageID; a subsequent session.idle runs the verifier against that evidence instead of the empty-evidence default.
- Side effects / parity: mk-goal.js only. Complementary to F3 (tokens come from message.updated, evidence from message.part.updated) — both must land for the supervisor to function. No Claude surface.
- Test: Add streamed text-part fixtures; assert evidence captured, tokensUsed unchanged (no charge), and a following idle verifies.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: extractAssistantEvidence already reads payload/properties part objects at .opencode/plugins/mk-goal.js:965-982, but handleEvent invokes evidence recording only for message.updated at .opencode/plugins/mk-goal.js:2583-2585. Native streamed text arriving as message.part.updated therefore never reaches goal evidence.
- Fix approach: Add a text-part-only activity path that records assistant evidence without charging usage. Associate parts with an assistant message before accepting role-less native part payloads, and prefer cumulative part.text over delta; append delta only when it is the sole text source for the same message.
- Exact change: Add recordMessagePartUpdated beside recordMessageUpdated. It must reject non-text parts, reject explicitly non-assistant roles, and accept role-less parts only when a per-session current-assistant-message map was populated by an assistant message.updated event. Update lastActivityAtMs, lastActivityMessageID, and bounded lastEvidence in one mutation, but never call extractUsageFromEvent. Extend evidence extraction for payload/properties delta as a fallback and append that delta only when the current evidence belongs to the same message. Add the assistant-message map to runtimeState and clear it during session deletion and app disposal.
- Acceptance: A native assistant message.updated followed by cumulative and delta message.part.updated events leaves lastEvidence equal to the latest complete assistant text, updates activity, and leaves tokensUsed unchanged. User/tool and non-text parts are ignored.
- Side effects / parity: Coordinate with F3 and F13 so message.updated owns usage while message.part.updated owns streamed text. F4/O2 must regard part-driven evidence updates as verifier-basis changes. Claude Stop processing uses transcript parsing rather than OpenCode part events, so none of the checked Claude hooks should be modified.
- Test: Add native assistant-header plus streamed text-part fixtures to mk-goal-lifecycle.test.cjs, including cumulative text, delta fallback, non-text, and explicit user-role cases; assert evidence aggregation and zero additional usage charge.

---

### F3 [P1] Native OpenCode token objects account as zero
`.opencode/plugins/mk-goal.js:795-812` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. tokenCountFromUsage (795-812) recognizes totalTokens/tokens/inputTokens etc. but not the native shape. AssistantMessage.tokens = {input, output, reasoning, cache:{read,write}} (SDK 116-125); extractUsageFromEvent passes properties.info.tokens (830). In tokenCountFromUsage the 'tokens' key matches usage.tokens (undefined, since usage IS the tokens object), 'input'/'output' are not in the alias list, and Number(cache-object)=NaN — so it returns 0. Native usage accounts as zero; budget never advances and budget_limited never fires.
- Fix approach: Teach token counting to recognize the native nested shape and explicitly define contributors: total = input + output + reasoning + cache.read + cache.write (all consumed tokens count toward budget). Keep the existing per-message cumulative-delta charging (AssistantMessage.tokens is cumulative per message).
- Exact change: Add nativeTokenCount(usage) that reads own numeric fields input/output/reasoning and nested cache.read/cache.write; in tokenCountFromUsage, when those native fields are present, return their sum (before the generic inputTokens+outputTokens fallback). extractUsageFromEvent's candidate selection (find tokenCountFromUsage>0) then picks properties.info.tokens.
- Acceptance: message.updated with info.tokens {input:40,output:20,reasoning:5,cache:{read:3,write:2}} charges 70 on first emit and 0 on an identical re-emit; crossing tokenBudget flips status to budget_limited.
- Side effects / parity: mk-goal.js only. secondsFromUsage stays 0/unavailable for native (AssistantMessage exposes time.created/completed, not seconds) — acceptable. No Claude surface.
- Test: Native cumulative-update and interleaved-message token tests (shared fixtures with F13).

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: tokenCountFromUsage recognizes scalar totals and camel/snake input/output aliases only at .opencode/plugins/mk-goal.js:795-812. extractUsageFromEvent passes native properties.info.tokens at .opencode/plugins/mk-goal.js:822-835, but its input, output, reasoning, and cache.read/cache.write shape produces zero.
- Fix approach: Add an explicit native-token parser and document a single non-overlapping budget policy instead of treating the object as a generic scalar.
- Exact change: In tokenCountFromUsage, after scalar-total detection, recognize the OpenCode tokens object and sum its normalized input, output, reasoning, cache.read, and cache.write buckets, treating missing/non-positive buckets as zero. Keep legacy totalTokens/inputTokens/outputTokens handling unchanged. Mark the default source for this shape as opencode-native-tokens rather than the generic message.updated label.
- Acceptance: A native token object produces the defined sum, cumulative updates for one message charge only growth, and interleaved message totals remain additive without double charging.
- Side effects / parity: The exact bucket policy must be locked in tests because changing inclusion later changes persisted budget semantics. F13 should replace synthetic usage.totalTokens fixtures with native tokens. Claude's session-stop transcript accounting at .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:370-437 is a separate producer and should not be changed.
- Test: Add lifecycle cases for native input/output/reasoning/cache buckets, zeros and missing buckets, cumulative updates, and interleaved message IDs; assert tokensUsed, usageSource, and budget transition.

---

### F4 [P1 (GPT P1 / Opus P2)] Verifier results can be applied after same-goal evidence changes
`.opencode/plugins/mk-goal.js:1961-1978` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: CONFIRMED (shared with O2). maybeVerifyGoal reads a snapshot (1963), runs the verifier OUTSIDE the queue (1971), then in the queued mutation applies the verdict whenever current.goalId===goal.goalId && status==='active' (1977) — it never compares updatedAtMs/lastEvidence/lastActivityMessageID. New assistant activity arriving during the await (which bumps lastEvidence and updatedAtMs) is ignored, so a stale 'met'/'blocked' verdict computed on old evidence still completes/blocks the goal.
- Fix approach: Capture a monotonic revision (goal.updatedAtMs) at read time and, inside the queued mutation, additionally require current.updatedAtMs === snapshotRevision. On mismatch, do NOT apply — leave resultApplied=false so the envelope reports stale=true. One guard fixes both F4 and O2.
- Exact change: In maybeVerifyGoal add `const snapshotRevision = goal.updatedAtMs;`. Change the mutation guard to `if (!current || current.goalId !== goal.goalId || current.status !== 'active' || current.updatedAtMs !== snapshotRevision) return current;`. resultApplied stays false on mismatch → stale=true via existing envelope (2017).
- Acceptance: Test where evidence/activity mutates between snapshot read and verifier resolution: verdict is not applied, envelope.stale===true, goal remains active, and maybeContinueGoal suppresses with 'stale_verifier_result' (2175).
- Side effects / parity: mk-goal.js only. updatedAtMs is bumped by recordMessageUpdated/refreshGoalActivity, making it a reliable revision; the verifier's own write is the only other writer, so equality holds when nothing intervened. No Claude surface.
- Test: Stale-result test: interleave a message.updated between read and verdict; assert not-applied + stale true.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: maybeVerifyGoal snapshots a goal, awaits verification at .opencode/plugins/mk-goal.js:1961-1972, then applies the result whenever only goalId and active status still match at .opencode/plugins/mk-goal.js:1973-2011. Same-goal evidence/activity changes are not part of that compare condition.
- Fix approach: Compare the complete verifier input basis at apply time. A separate global state revision is unnecessary if the immutable goal identity plus all mutable verifier inputs are compared directly.
- Exact change: Before awaiting runSupervisorVerifier, capture a verifier-basis object containing goalId, status, updatedAtMs, lastActivityMessageID, and lastEvidence. Inside the queued mutation, compare every basis field against current state before writing verifier metadata or status. If any field differs, leave current state byte-for-byte unchanged, keep resultApplied false, and return stale=true.
- Acceptance: If evidence or activity changes while verification is pending, the old verdict cannot overwrite evidence, increment iterations, complete/block the goal, or authorize continuation. An unchanged basis still applies normally.
- Side effects / parity: Implement once for both F4 and O2. F2 part events become basis-changing mutations. No Claude parity update exists because the checked Claude hooks do not implement this supervisor.
- Test: In mk-goal-supervisor.test.cjs, hold an injected verifier on a deferred promise, mutate the same goal's evidence/activity, resolve the old verifier as met, and assert stale=true, active status, preserved new evidence, and unchanged verifier metadata.

---

### F5 [P1 (GPT P1 / Opus P2)] LLM verifier treats the fire-and-forget prompt endpoint as request-response
`.opencode/plugins/mk-goal.js:1866-1884` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: CONFIRMED against SDK (shared isolation concern with O1). promptAsync = POST /session/{id}/prompt_async returns 204 void (SDK 2353,2366-2372) — fire-and-forget, no body. defaultLlmSupervisorVerifier (1866-1884) awaits promptAsync and parses its return as the assistant response; the return is undefined, parseLlmVerifierResponse throws, runSupervisorVerifier catches → verdict 'blocked' on EVERY llm-mode run. The supervisor test (375-418) mocks promptAsync to RETURN structured JSON, masking the bug.
- Fix approach: Use the response-returning client.session.prompt (POST /session/{id}/message → {info:AssistantMessage, parts}; SDK 174,2281-2288) run against a DEDICATED ephemeral session, never the user session. Create a throwaway session (session.create with query {directory}), prompt it with tools disabled, read the text parts, parse the JSON verdict, then delete it. On any failure fall through to normalizeVerifierResult.
- Exact change: Rewrite defaultLlmSupervisorVerifier: require client.session.prompt/create/delete; create ephemeral session; call prompt({ path:{id:ephemeralID}, body:{ parts:[{type:'text', text: buildLlmVerifierPrompt(...)}], tools:{} } }); extract text from response.parts via verifierResponseText; parseLlmVerifierResponse; finally best-effort session.delete(ephemeralID). Never use the user sessionID for the prompt path. Leave the continuation path's promptAsync (2228) unchanged — it legitimately submits into the user session.
- Acceptance: With a fake client whose session.prompt returns {info, parts:[{type:'text', text:'{...json...}'}]}, the verdict parses correctly; the user session receives zero verifier messages; the ephemeral session is deleted.
- Side effects / parity: mk-goal.js + supervisor test. Update the test to the real SDK contract (create→prompt-returns-info/parts→delete). No Claude surface.
- Test: Replace the synthetic promptAsync-return test with an ephemeral-session SDK-contract fixture asserting isolation, deletion, and parse.

**GPT-5.6-Sol** — risk: high · confidence: med
- Root cause: confirmed: defaultLlmSupervisorVerifier awaits client.session.promptAsync and parses its return as a response at .opencode/plugins/mk-goal.js:1866-1884, while the continuation path correctly treats promptAsync as submission-only at .opencode/plugins/mk-goal.js:2227-2232. The success test mocks a response contract that the endpoint does not provide at .opencode/plugins/tests/mk-goal-supervisor.test.cjs:375-418.
- Fix approach: Use the SDK's response-returning session.prompt endpoint in an isolated verifier session and validate the returned assistant payload. Do not attempt to repair promptAsync parsing.
- Exact change: Replace defaultLlmSupervisorVerifier's promptAsync dependency with client.session.create, client.session.prompt, and client.session.delete. Create an ephemeral verifier session, submit buildLlmVerifierPrompt through response-returning prompt, parse the returned assistant parts, and delete the verifier session in finally. Reject missing session IDs, empty responses, malformed JSON, and unsupported verdicts safely. Never use the user's sessionID as the prompt target.
- Acceptance: The default LLM verifier receives and parses an actual response, promptAsync is never called, the user's session receives no verifier message, and the ephemeral session is deleted on success and failure.
- Side effects / parity: This is the same implementation change as O1 and should land once. F1/F8 must safely process lifecycle deletion of ephemeral sessions. Add timeouts through F6. Claude native /goal is not implemented by these repository hooks, so no Claude hook counterpart should be added.
- Test: Replace the synthetic promptAsync-response test with an SDK-contract mock for create/prompt/delete. Assert prompt targets only the created ID, promptAsync would fail if invoked, structured output is parsed, cleanup always runs, and malformed/empty responses block safely.

---

### F6 [P1 (GPT P1 / Opus P2)] Verifier and autonomous prompt calls have no timeout
`.opencode/plugins/mk-goal.js:1930-1951` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: CONFIRMED (adjusted). runSupervisorVerifier (1930-1951) awaits options.supervisorVerifier with no deadline; maybeContinueGoal awaits promptAsync (2228) with no deadline. The inFlightVerifications lock is held across maybeVerifyGoal (2621-2631) and inFlightContinuations across the promptAsync await (2166-2245); a hung call pins the lock and blocks all future idle handling for that session.
- Fix approach: Add a configurable bounded timeout (e.g. MK_GOAL_VERIFIER_TIMEOUT_MS, default 30s) via Promise.race against a timer, and pass an AbortSignal to session.prompt/promptAsync where the SDK Options accept `signal`. On timeout: verifier returns blocked with observable reason 'verifier_timeout' and ignores any late result; continuation returns suppressed 'prompt_async_timeout' and rolls back the reserved turn (shared with O3). Clear timers and release locks in finally.
- Exact change: Add withTimeout(promise, ms, onTimeout) helper (Promise.race + clearTimeout, swallowing late rejections). Wrap the awaited verifier call in runSupervisorVerifier and the promptAsync await in maybeContinueGoal. Thread AbortController.signal into buildPromptAsyncOptions/session.prompt if supported. Add the normalized timeout in normalizeOptions.
- Acceptance: An injected never-resolving verifier makes maybeVerifyGoal return blocked/'verifier_timeout' within the deadline and release inFlightVerifications; a hung promptAsync makes maybeContinueGoal return suppressed within the deadline, release the lock, and roll back the turn.
- Side effects / parity: mk-goal.js only. Ties to O3 (rollback on timeout). Late results MUST NOT write state after timeout. AbortSignal support depends on SDK Options; the Promise.race fallback is always safe. No Claude surface.
- Test: Fake never-resolving verifier and never-resolving promptAsync; assert bounded return + lock cleared + no late write.

**GPT-5.6-Sol** — risk: high · confidence: high
- Root cause: confirmed: runSupervisorVerifier awaits the verifier without a deadline at .opencode/plugins/mk-goal.js:1930-1951, and maybeContinueGoal awaits promptAsync without one at .opencode/plugins/mk-goal.js:2227-2243. Their in-flight locks are released only after settlement at .opencode/plugins/mk-goal.js:2162-2167 and 2244-2245.
- Fix approach: Apply separate bounded deadlines to verification and prompt submission, propagate AbortSignal where the SDK/injected verifier supports it, and distinguish a timeout from a definite submission rejection.
- Exact change: Add normalized verifierTimeoutMs and continuationTimeoutMs options with bounded positive defaults and environment overrides. Add a shared deadline helper that owns timer cleanup, supplies an AbortSignal, and ignores late settlement. Pass signal to injected/default verifiers and SDK calls. On verifier timeout, record verifier_timeout metadata while keeping the goal active and return an envelope flag that suppresses continuation for that idle cycle. On continuation timeout, record prompt_async_timeout, release the lock, and retain the reserved turn because delivery is indeterminate; only a definite rejection follows O3 rollback.
- Acceptance: Never-settling verifier and prompt promises return within their configured deadlines, all locks release, late resolutions mutate nothing, verifier timeout does not permanently block the goal, and no second prompt is sent after an indeterminate submission timeout.
- Side effects / parity: Update verifier-result envelope expectations in mk-goal-supervisor.test.cjs and continuation decision assertions. O3 must distinguish rejection rollback from timeout retention. The Claude settings already impose process-level hook timeouts at .claude/settings.json:26-96; those separate hooks do not call mk-goal and need no parity change.
- Test: Use deferred promises and very short injected timeout options to assert elapsed bounds, lock release via a second event, active state after verifier timeout, suppressed continuation reason, retained turn on submission timeout, and ignored late completion.

---

### F7 [P1 (GPT P1 / Opus P2)] Stored session IDs can redirect mutations into another session file
`.opencode/plugins/mk-goal.js:1033-1054` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: CONFIRMED (adjusted). normalizeStoredGoal (1038) trusts rawGoal.sessionId over the fallback with no equality check. readGoal (1127-1132) passes the path-derived requested sessionID as fallback; a state file whose JSON sessionId names a different session yields a record bound to that other id, and a later mutateGoal→writeGoalAtomic writes to goalPathForSession(other id) (1169-1171), corrupting a different session's file.
- Fix approach: Fail-closed for active state: bind reads to the path-derived id. Thread an expectedSessionID into normalizeStoredGoal on the active read path; when rawGoal.sessionId is present and !== expectedSessionID, throw INVALID_GOAL_STATE BEFORE any mutation. Keep archive listing lenient (filename-derived, read-only display).
- Exact change: Add expectedSessionID to the options/param; in normalizeStoredGoal, after computing sessionID, if options.expectedSessionID && rawGoal.sessionId && normalizeSessionID(rawGoal.sessionId)!==options.expectedSessionID → throw GoalError('INVALID_GOAL_STATE','Goal state session id does not match its file path'). readGoal and readGoalForBrief pass expectedSessionID=normalizeSessionID(sessionID). writeGoalAtomic keeps using goal.sessionId (self-consistent). listArchivedGoalRecords passes NO expectedSessionID.
- Acceptance: A file at session A's path containing sessionId:'B' makes readGoal throw INVALID_GOAL_STATE (surfaced via failureLines), and no write lands on B's file.
- Side effects / parity: mk-goal.js only. Rejects anomalous files rather than silently coercing (intended fail-closed). No Claude surface.
- Test: State-store test writing a mismatched-sessionId file; assert INVALID_GOAL_STATE on read and B's file untouched.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: normalizeStoredGoal prefers rawGoal.sessionId over fallbackSessionID at .opencode/plugins/mk-goal.js:1033-1054. readGoal supplies the path-derived session only as fallback at .opencode/plugins/mk-goal.js:1127-1133, and writeGoalAtomic selects its destination from the embedded normalized session at .opencode/plugins/mk-goal.js:1167-1172.
- Fix approach: Treat the requested/path-derived session as authoritative and reject any present embedded session ID that differs.
- Exact change: At the start of normalizeStoredGoal, require and normalize fallbackSessionID, normalize rawGoal.sessionId when present, throw INVALID_GOAL_STATE on mismatch, and always set the returned sessionId to the fallback. Preserve compatibility for records with no embedded sessionId by binding them to the path. Ensure archive listing supplies the filename-derived ID as the same authority.
- Acceptance: Reading session A's file when it embeds session B fails with INVALID_GOAL_STATE, and no subsequent action can create, overwrite, clear, or archive session B's file.
- Side effects / parity: Archived records also gain filename/embedded-ID integrity checking. Existing correctly keyed files and files lacking the redundant field continue to load. No Claude hook uses this store.
- Test: Write a valid-looking goal for session B into session A's hex-keyed path, assert read/show/set reject it, and verify both A and B destination paths remain unchanged.

---

### F8 [P1 (GPT P1 / Opus P2)] Archive failures are silently reported as successful lifecycle handling
`.opencode/plugins/mk-goal.js:1245-1274` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED (adjusted). archiveGoalStateFile (1245-1274) returns null for ALL rename errors including non-ENOENT (1264-1267) and wraps the whole enqueued op in `.catch(() => null)` (1273). The session.deleted handler (2642-2650) only distinguishes a truthy return, so a genuine rename failure (EACCES/EXDEV/EBUSY) is indistinguishable from success or benign absence.
- Fix approach: Treat only ENOENT as benign. On other rename errors, durably record an event_error JSONL row (unconditional, not debug-gated) before returning null, keeping the event hook fail-open for OpenCode (still return null, never throw into the event loop). Replace the blanket `.catch(() => null)` with a logging catch.
- Exact change: In the rename catch keep `if (error?.code === 'ENOENT') return null;`, else append to GOAL_EVENTS_LOG a {type:'event_error', eventType:'session.deleted', sid, error:redactEvidence(...)} row then return null. Replace `.catch(() => null)` with a catch that best-effort logs the same event_error then returns null.
- Acceptance: Stub rename to throw EACCES → an event_error row is written, archiveGoalStateFile returns null, and the event hook does not throw.
- Side effects / parity: mk-goal.js only. appendGoalJsonl is itself fail-open; interacts with F9 (ensure log rotation covers .goal-events.log). No Claude surface.
- Test: Lifecycle test stubbing rename to throw non-ENOENT; assert event_error logged and hook fail-open.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: archiveGoalStateFile converts every rename error to null at .opencode/plugins/mk-goal.js:1262-1267 and then converts any queued-operation rejection to null at .opencode/plugins/mk-goal.js:1273. handleEvent also catches archive rejection and returns silently at .opencode/plugins/mk-goal.js:2642-2649.
- Fix approach: Make only ENOENT benign, propagate all other archive failures to the existing fail-open event boundary, and record them durably.
- Exact change: In archiveGoalStateFile, return null only for ENOENT; wrap other rename failures in ARCHIVE_GOAL_FAILED and remove the terminal catch(() => null). Remove the inner session.deleted try/catch so the plugin event wrapper at .opencode/plugins/mk-goal.js:2660-2666 logs event_error and still returns without breaking OpenCode. Invalidate the brief cache before returning for ENOENT as required by F11.
- Acceptance: Missing active state remains a no-op. Permission/path/rename failures preserve the source file and produce one redacted event_error identifying session.deleted without rejecting the public plugin event callback.
- Side effects / parity: F1 must resolve the correct deletion ID first, and F11 handles unconditional cache invalidation. The bounded event log from F9 prevents repeated failures from growing storage indefinitely. No Claude hook archives mk-goal files.
- Test: Keep the existing ENOENT test and add a deterministic non-ENOENT archive failure, such as an invalid .archive path; assert the source survives, the plugin event resolves, and event_error records ARCHIVE_GOAL_FAILED.

---

### F9 [P1 (GPT P1 / Opus P2)] JSONL retention never bounds continuously active logs
`.opencode/plugins/mk-goal.js:716-751` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: CONFIRMED. pruneJsonlLog (743-753) unlinks the whole log only when now-mtime > retention, but appendGoalJsonl calls pruneJsonlLog then appendFile (719,726), which refreshes mtime. A log receiving at least one entry per retention window therefore never ages out → unbounded growth on continuously active sessions.
- Fix approach: Rotate by bounded size instead of age-of-whole-active-file. Before appending, if the active log exceeds MK_GOAL_LOG_MAX_BYTES (new const, e.g. 5MB), rename it to a timestamped frozen segment; prune rotated segments by age (which now works because segments stop receiving writes). Keep age-based pruning for the segments.
- Exact change: Add the max-bytes const/env; in appendGoalJsonl (or a rotateJsonlLog helper) stat the active log and, when size>cap, rename to `${filename}.${nowMs}`; add pruneJsonlSegments(stateDir, filename) that readdirs `${filename}.*` and unlinks segments older than retention. Replace pruneJsonlLog's whole-file unlink with segment pruning. Optionally sum segment sizes in inspectGoalHealth.
- Acceptance: Repeated appends spanning multiple retention windows on an always-active log keep the active file under cap (rotated) and prune old segments; total on-disk bytes stay bounded.
- Side effects / parity: mk-goal.js only. tests/helpers/continuation-log.cjs reads the active log — ensure rotation preserves current-window reads (rotated history is separate). No Claude surface.
- Test: Continuation test appending repeatedly past cap+retention while active; assert active-file size bounded and old segments removed.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: appendGoalJsonl calls pruneJsonlLog immediately before append at .opencode/plugins/mk-goal.js:716-730. pruneJsonlLog deletes only when current-file mtime exceeds retention at .opencode/plugins/mk-goal.js:743-751, so every append refreshes mtime and a continuously active file grows without a size bound.
- Fix approach: Keep dormant-file age retention, but add a hard byte bound for active logs using serialized, atomic compaction of the existing filename. This avoids introducing segmented filenames that current readers and health output do not know about.
- Exact change: Add a normalized MK_GOAL_JSONL_MAX_BYTES limit and a per-stateDir/filename append queue. Before appending, retain the current age-based deletion check; if the active file exceeds the byte limit, read complete JSONL records, retain the newest records fitting a target below the limit, write them to a same-directory temporary file, fsync/rename atomically, then append the new bounded entry. Keep malformed trailing fragments out of the rewritten file and preserve the newest valid records.
- Acceptance: A log receiving entries more frequently than the retention period remains below maxBytes plus one bounded entry, newest entries remain parseable, dormant files still expire by age, and concurrent appends do not lose or interleave records.
- Side effects / parity: The fixed .continuation.log and .goal-events.log filenames remain compatible with existing readers and inspectGoalHealth. F10 and F8 diagnostics inherit the same bound. Claude hook logs are separate and unchanged.
- Test: Configure a tiny max-byte value, append repeatedly while keeping mtime fresh across simulated retention boundaries, and assert bounded size, valid JSONL, preservation of the newest record, dormant deletion, and concurrent append count.

---

### F10 [P1 (GPT P1 / Opus refinement)] System-transform failures silently remove goal steering
`.opencode/plugins/mk-goal.js:2336-2350` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. appendGoalBrief (2336-2351) wraps stat/read/JSON/normalize/render in `try { ... } catch { return; }`, swallowing all errors with no logging even when MK_GOAL_DEBUG is set. Goal steering silently disappears from the chat transform with zero signal.
- Fix approach: Stay fail-open for chat generation (never throw), but in the catch emit a redacted diagnostic: writeDebugStderr in debug mode (stderr, TUI-safe — never stdout) plus a bounded best-effort event_error JSONL row outside debug. Wrap the logging so a logging failure cannot break the transform.
- Exact change: Replace `catch { return; }` with `catch (error) { writeDebugStderr('appendGoalBrief', error); try { await appendGoalJsonl(GOAL_EVENTS_LOG_FILENAME, {type:'event_error', eventType:'system.transform', error: redactEvidence(error?.message || 'unknown error', DEFAULT_MAX_REASON_CHARS)}, rawOptions); } catch {} return; }`.
- Acceptance: Force readGoalForBrief to throw (e.g. malformed state file) → brief omitted from output.system, and a stderr line (debug) plus an event_error row are produced.
- Side effects / parity: mk-goal.js only. Must never write stdout (OpenCode TUI paints over it). Interacts with F9 rotation for .goal-events.log. No Claude surface.
- Test: Transform test with a corrupt state file; assert event_error logged and output.system unchanged.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: appendGoalBrief wraps all validation, stat, read, parse, normalization, rendering, and output failures in an empty catch at .opencode/plugins/mk-goal.js:2336-2350, removing steering without any diagnostic.
- Fix approach: Remain fail-open for chat generation but make failures observable through the plugin's bounded JSONL log, with stderr only when explicit debug mode permits it.
- Exact change: Change appendGoalBrief's catch to capture error, call writeDebugStderr('appendGoalBrief', error), and append a redacted goal-events entry with type system_transform_error, resolved session ID when available, and bounded error text. Do not write stdout and do not rethrow.
- Acceptance: A corrupt or unreadable goal state leaves output.system usable and unmodified, records a bounded diagnostic outside debug mode, emits redacted stderr only under MK_GOAL_DEBUG, and never writes stdout.
- Side effects / parity: Use F9's bounded logging path to prevent diagnostic amplification. The Claude SessionStart hook intentionally writes injection output to stdout at session-prime.ts:314-325 because Claude's hook protocol differs; it does not share this OpenCode TUI restriction or mk-goal transform.
- Test: Corrupt a goal JSON file, invoke the transform with debug off and on, assert no thrown error or injected goal, verify system_transform_error in .goal-events.log, and capture stderr to verify debug gating and redaction.

---

### F11 [P2] Goal brief cache grows indefinitely across goal-less sessions
`.opencode/plugins/mk-goal.js:2304-2333` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. goalBriefCache (158) is a module-global Map with no size/TTL bound. readGoalForBrief caches both present {cacheKey,goal} and missing {missing:true} entries (2304-2334); a process serving many goal-less sessions caches {missing:true} per path forever. archiveGoalStateFile's ENOENT branch returns before invalidateGoalBriefCache (1265 vs 1270). flushVolatileLocks() disposal clears runtime locks but not the cache (2559-2562).
- Fix approach: Bound the cache with a simple insertion-order LRU (max entries, e.g. 512) evicting oldest on set; invalidate a session's entry on session.deleted regardless of archive outcome; clear the whole cache on the no-arg (disposal) flush.
- Exact change: Add a max-entries const and a setBriefCache helper that delete+set (move to MRU) and evicts the oldest key when size>cap. In handleEvent's session.deleted branch call invalidateGoalBriefCache(sessionID, eventOptions) unconditionally when sessionID is present (independent of archive result). In flushVolatileLocks() no-arg branch add goalBriefCache.clear().
- Acceptance: >cap distinct missing-path lookups keep cache size ≤ cap; session.deleted invalidates its entry even when no active file existed; a .disposed event clears the cache.
- Side effects / parity: mk-goal.js only. No Claude surface.
- Test: State/lifecycle test asserting cache bounded under many missing lookups, invalidated on delete, and cleared on .disposed.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: the module-global goalBriefCache is unbounded at .opencode/plugins/mk-goal.js:156-159. readGoalForBrief stores present and missing paths without age/size eviction at .opencode/plugins/mk-goal.js:2304-2333. Deletion invalidates only after successful archive at .opencode/plugins/mk-goal.js:1268-1271, while app disposal clears runtime locks only at .opencode/plugins/mk-goal.js:2654-2656.
- Fix approach: Use a small TTL-aware LRU and invalidate lifecycle scope deterministically.
- Exact change: Store cachedAtMs with each brief entry, refresh LRU order on hit, expire entries after a bounded TTL, and evict the oldest entry when a fixed maximum is exceeded. Invalidate the target session before every session.deleted archive attempt, including ENOENT/failure. On app disposal, remove cache entries belonging to this plugin instance's stateDir rather than indiscriminately clearing unrelated state directories.
- Acceptance: Thousands of goal-less sessions cannot grow the cache above its cap, expired misses are re-evaluated, deletion invalidates missing and present entries, and disposal removes the instance's cached paths.
- Side effects / parity: Coordinate deletion ordering with F1/F8. Present-goal cache hits still validate file mtime/size, so persistence visibility is preserved. No Claude hook consumes goalBriefCache.
- Test: Expose cache size only through the frozen test surface or a metric, perform more misses than the cap, assert bounded size and LRU eviction, advance the injected clock past TTL, and verify deletion/disposal invalidation for missing and present paths.

---

### F12 [P2] Refreshing a paused goal incorrectly charges paused wall-clock time
`.opencode/plugins/mk-goal.js:1496-1517` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. (a) setGoal same-objective refresh (1500-1517) converts paused→active by spreading ...current (keeping stale startedAtMs and non-zero activeWallMs) and only setting status:'active' — it never rebases startedAtMs = timestamp - activeWallMs nor resets activeWallMs, unlike markGoalStatus resume (1563-1575). Wall-clock then includes the paused interval. (b) goalStateLines wallElapsedMs = now - goal.startedAtMs (2374) regardless of status, so a paused goal's displayed elapsed keeps growing during the pause.
- Fix approach: (a) In the refresh branch, when current.status==='paused', apply the resume transition: startedAtMs = timestamp - (activeWallMs||0), activeWallMs = 0 (reuse markGoalStatus's formulas); active→active refresh unchanged. (b) In goalStateLines render elapsed from activeWallMs when not active.
- Exact change: In setGoal's refresh return object, replace the inherited startedAtMs/activeWallMs with values computed from current.status (paused → rebased startedAtMs and activeWallMs:0; active → unchanged). In goalStateLines set `wallElapsedMs = goal.status === 'active' ? nowMs(options) - goal.startedAtMs : (goal.activeWallMs || 0)` and derive remainingWallMs from it.
- Acceptance: Pause at accumulated activeWallMs, advance the clock, refresh the same objective → elapsed equals activeWallMs (paused span excluded); status show of a paused goal reports frozen elapsed.
- Side effects / parity: mk-goal.js only. renderGoalInjection (active-only) and continuationCapReason (active-only, uses startedAtMs) stay correct after the rebase. No Claude surface.
- Test: State test: pause → advance clock → refresh; assert wall accounting excludes the paused span. Render test for paused elapsed.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: same-objective setGoal refresh changes paused directly to active without adjusting timing at .opencode/plugins/mk-goal.js:1496-1517. markGoalStatus contains the needed paused-to-active calculation at .opencode/plugins/mk-goal.js:1563-1575. goalStateLines always renders now-startedAtMs at .opencode/plugins/mk-goal.js:2370-2375, so paused status itself continues accruing elapsed time.
- Fix approach: Share the existing wall-clock transition calculation between explicit resume and same-objective refresh, and render paused elapsed time from the frozen accumulator.
- Exact change: Extract the timing portion of markGoalStatus into a pure transition helper. Use it when setGoal refreshes a paused goal so startedAtMs becomes timestamp minus accumulated activeWallMs and activeWallMs resets for active representation. In goalStateLines, calculate wallElapsedMs from activeWallMs when status is paused and from now-startedAtMs when active.
- Acceptance: Time spent paused neither reduces remaining_wall_ms nor causes an immediate wall-clock cap after refresh. Explicit resume and same-objective refresh produce identical timing fields.
- Side effects / parity: Status output changes only for paused goals and corrected resumed goals. ContinuationCapReason already evaluates active goals from startedAtMs and will consume the corrected value. Claude native /goal timing is outside this plugin and cannot be patched here.
- Test: Create at t=1000, pause at t=2000, inspect at t=10000, refresh the same objective, and inspect at t=11000; assert elapsed active wall time is 1000 while paused and 2000 after one resumed second. Compare fields with resumeGoal.

---

### O1 [P2 · Opus-new] LLM verifier submits its judge-prompt into the user's live session, polluting the conversation and creating a feedback loop
`.opencode/plugins/mk-goal.js:1871-1880` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: CONFIRMED (same fix as F5). defaultLlmSupervisorVerifier (1871-1880) calls promptAsync with path:{id: sessionID} — the user's OWN live session — injecting a 'Judge whether the active goal is complete...' text part. Combined with F5 (fire-and-forget, no usable response), the injected judge prompt becomes a real turn in the user's session, polluting the conversation and feeding back as evidence/continuation input.
- Fix approach: Covered by the F5 redesign: run the verifier against a dedicated ephemeral session via the response-returning session.prompt and delete it; never target path:{id: userSessionID}. Validate the structured verdict from that isolated call.
- Exact change: Same as F5 — the ephemeral-session prompt path replaces path:{id: sessionID}. No separate change beyond F5.
- Acceptance: After the fix the user session receives no verifier messages (assert message list unchanged); the verdict originates from the isolated ephemeral session.
- Side effects / parity: mk-goal.js + supervisor test (shared with F5). No Claude surface.
- Test: Shared with F5: assert the user session is never prompted and the ephemeral session is created+deleted.

**GPT-5.6-Sol** — risk: high · confidence: med
- Root cause: confirmed: defaultLlmSupervisorVerifier targets path.id=sessionID at .opencode/plugins/mk-goal.js:1871-1880, which is the active user session supplied from the goal record at .opencode/plugins/mk-goal.js:1936-1940. Its judge prompt is therefore submitted into the user's conversation.
- Fix approach: Isolate verifier inference from the user session and clean up its temporary state. This is the same root fix as F5, not a second call path.
- Exact change: Implement F5's ephemeral session.create -> response-returning session.prompt -> session.delete flow. The user sessionID may remain verifier metadata but must never be used as a prompt target. Cleanup belongs in finally, and verifier-created lifecycle events must remain harmless when no goal exists for that temporary ID.
- Acceptance: The user's session receives no judge prompt or verifier answer, subsequent user-session evidence cannot ingest verifier text, and the temporary verifier session is removed after every outcome.
- Side effects / parity: One shared patch resolves F5 and O1. F1/F8/F11 must correctly handle temporary-session deletion. There is no Claude hook version to update: the runtime rule at goal-prompting-runtime-specific.md:24-38 explicitly uses Claude's native /goal and records that no mk-goal plugin bridge exists.
- Test: In the replacement LLM verifier test, capture every session API request and assert neither prompt nor delete targets the user session; also emit simulated temporary-session lifecycle events and verify the user's goal/evidence is unchanged.

---

### O2 [P2 · Opus-new] The `stale` flag plumbed to continuation cannot detect F4-style evidence staleness
`.opencode/plugins/mk-goal.js:1973-2018` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED (same fix as F4). maybeVerifyGoal sets stale = !resultApplied (2017), and resultApplied becomes true whenever goalId+status still match (1977) — it does not consider whether evidence/updatedAtMs changed during the await. So the `stale` flag plumbed to maybeContinueGoal (2175) cannot detect F4-style evidence staleness.
- Fix approach: Fixed by the F4 revision-compare: adding `current.updatedAtMs !== snapshotRevision` to the mutation guard makes resultApplied=false (and thus stale=true) precisely when evidence/activity changed during verification, so the plumbed stale flag becomes meaningful.
- Exact change: None beyond F4 — the same snapshotRevision guard drives both resultApplied and the envelope's stale field.
- Acceptance: When activity mutates mid-verify, envelope.stale===true and maybeContinueGoal suppresses with 'stale_verifier_result'.
- Side effects / parity: mk-goal.js only. No Claude surface.
- Test: Shared with F4: assert stale true propagates to continuation suppression.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: stale is assigned solely as the inverse of resultApplied at .opencode/plugins/mk-goal.js:2013-2018, while resultApplied becomes true after only goalId/status comparison at .opencode/plugins/mk-goal.js:1973-1978. maybeContinueGoal trusts that flag at .opencode/plugins/mk-goal.js:2174-2178, so changed same-goal evidence is invisible.
- Fix approach: Derive resultApplied and stale from the verifier-basis compare defined for F4, then make continuation consume that authoritative result.
- Exact change: Apply the F4 basis comparison before setting resultApplied. Leave resultApplied false for any evidence/activity/update mismatch, return stale=true with currentGoalId, and preserve maybeContinueGoal's stale_verifier_result suppression before all continuation gates. Do not add a second independent stale calculation.
- Acceptance: A verifier result based on old evidence always returns stale=true and produces stale_verifier_result suppression, even when goalId and status remain unchanged.
- Side effects / parity: This is fully resolved by the F4 implementation and test barrier. F2 streamed evidence must update one of the compared basis fields. No Claude hook shares the verifier envelope.
- Test: Extend the F4 deferred-verifier test through maybeContinueGoal and assert no prompt call, no reserved auto-turn, and continuation log reason stale_verifier_result.

---

### O3 [P2 · Opus-new] A failed continuation promptAsync still consumes an auto-turn (no rollback of the reserved turn)
`.opencode/plugins/mk-goal.js:2222-2243` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. reserveContinuationTurn (2080-2103) increments autoTurnsUsed and stamps lastContinuationAtMs/lastContinuationMessageId BEFORE the network submit (2092-2094). maybeContinueGoal calls promptAsync after reserving (2228); on throw the catch records 'prompt_async_failed' suppress=true (2234-2242) but never decrements autoTurnsUsed or clears the reservation, so a failed submit permanently burns an auto-turn.
- Fix approach: On promptAsync failure (and on the F6 timeout), roll back the reservation before recording: decrement autoTurnsUsed (guard ≥0) and clear lastContinuationMessageId, keeping lastContinuationAtMs so the cooldown still throttles retry storms. Use a compensating patchGoalIfCurrent guarded on the reserved messageId so a newer reservation is not rolled back.
- Exact change: Add rollbackContinuationReservation(sessionID, goalID, messageID, options) using patchGoalIfCurrent: when current.lastContinuationMessageId===messageID → { autoTurnsUsed: Math.max(0, current.autoTurnsUsed - 1), lastContinuationMessageId: null }. Call it in the promptAsync catch (and the F6 timeout branch) alongside recordContinuationReason.
- Acceptance: When promptAsync throws, autoTurnsUsed returns to its pre-reserve value and lastContinuationMessageId is cleared while reason 'prompt_async_failed' is recorded; remaining_auto_turns is unchanged versus before the attempt.
- Side effects / parity: mk-goal.js only. The messageId guard prevents clobbering a newer reservation. The existing suppress=true on a transient error may be over-aggressive but is left as-is (out of scope). No Claude surface.
- Test: Continuation test with a throwing promptAsync asserting no net auto-turn consumed and messageId cleared.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: reserveContinuationTurn increments autoTurnsUsed and replaces continuation identity before submission at .opencode/plugins/mk-goal.js:2080-2103. The promptAsync rejection path at .opencode/plugins/mk-goal.js:2222-2243 records failure but never restores the reservation.
- Fix approach: Reserve before submission for concurrency safety, but make that reservation transactionally reversible on definite rejection. Do not roll it back on timeout because delivery is then unknown.
- Exact change: Have reserveContinuationTurn return the prior autoTurnsUsed, lastContinuationAtMs, lastContinuationMessageId, and error fields. Add one queued rollback-and-record mutation that applies only when goalId and current lastContinuationMessageId still equal the failed reservation; restore prior reservation fields and decrement to the exact prior count while retaining prompt_async_failed diagnostics/suppression. Invoke it only for an actual promptAsync rejection. F6's timeout path retains the reservation.
- Acceptance: A definite rejected submission consumes no auto-turn and restores prior continuation identity/timestamp; a successful submission consumes exactly one; a stale rollback cannot undo a newer reservation; timeout retains one reserved turn.
- Side effects / parity: Must be implemented with F6 so rejection and timeout semantics cannot be conflated. Continuation status output and JSONL decisions should report the post-rollback count. Claude hooks do not use promptAsync continuation.
- Test: Seed prior continuation fields, force promptAsync rejection, assert exact restoration plus failure diagnostics, retry successfully and assert one turn consumed, then simulate a newer message identity before rollback and assert it is untouched.

---

### F13 [refinement] Lifecycle tests model synthetic payloads instead of native OpenCode events
`.opencode/plugins/tests/mk-goal-lifecycle.test.cjs:91-123` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. Lifecycle tests (91-123) use properties.sessionID for lifecycle events and info.content + info.usage.totalTokens for assistant updates — synthetic shapes that don't match native OpenCode: session.created/deleted carry properties.info.id (Session), message.updated carries properties.info.tokens (nested, no text), and assistant text arrives via message.part.updated (properties.part). These fixtures pass today only because the plugin also accepts synthetic shapes, masking F1/F2/F3.
- Fix approach: Add shared native-event fixtures derived from SDK Event types and cover: session.created/deleted via properties.info.id; message.updated with native nested tokens (no text); streamed message.part.updated text; a malformed/missing-id event (asserting no global lock flush, F1); and token aggregation (message.updated) combined with evidence (message.part.updated). Retain a couple of legacy-shape tests for tolerance.
- Exact change: Add tests/helpers/native-events.cjs fixture factory; update mk-goal-lifecycle.test.cjs and add supervisor part-evidence cases to assert F1/F2/F3 against native shapes; add the malformed-deletion isolation test.
- Acceptance: The new native tests FAIL on current code (demonstrating F1/F2/F3) and PASS after their respective fixes.
- Side effects / parity: Tests only; the shared fixture is reused by lifecycle and supervisor tests. No Claude surface.
- Test: This finding is the test refinement itself.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: lifecycle tests model session.created with properties.sessionID at .opencode/plugins/tests/mk-goal-lifecycle.test.cjs:91-96 and assistant text/usage as properties.info.content plus usage.totalTokens at .opencode/plugins/tests/mk-goal-lifecycle.test.cjs:102-123. These fixtures bypass native properties.info.id session lifecycle payloads, properties.info.tokens, and message.part.updated text.
- Fix approach: Introduce local fixture builders that mirror the current native event contracts, then retain only explicitly named legacy-shape tests where backward compatibility is intentional.
- Exact change: At the top of mk-goal-lifecycle.test.cjs, add builders for native session lifecycle events using properties.info.id, assistant message.updated headers using info.sessionID/info.id/info.role/info.tokens, and message.part.updated text using properties.part plus optional delta. Convert lifecycle, usage, evidence, archive, and sweep tests to those builders. Add malformed missing-ID and native streaming aggregation cases rather than merely changing existing literals.
- Acceptance: The suite fails if info.id lifecycle extraction, native token parsing, part evidence handling, malformed deletion isolation, or interleaved cumulative accounting regresses.
- Side effects / parity: The fixtures provide acceptance coverage for F1-F3 and O4. Keep permission/question/session.idle fixtures in their actual sessionID shape rather than forcing info.id everywhere. Claude hook tests remain separate because Claude receives hook stdin/transcripts, not OpenCode events.
- Test: Run the converted lifecycle suite with native create/delete, message header, text part, token object, malformed deletion, cumulative/interleaved usage, and provider-error fixtures; preserve one explicit legacy fixture if legacy aliases remain supported.

---

### O4 [refinement · Opus-new] accountedMessageUsage eviction (>64 message ids) can double-charge a re-emitted message
`.opencode/plugins/mk-goal.js:700-714` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: med
- Root cause: CONFIRMED. accountedMessageUsage is capped to 64 via slice(-64) (normalizeAccountedMessageUsage:705, rememberAccountedMessage:713). Charging uses previousMessageTokens = accountedMessageUsage[messageID] || 0 (1646/1738). If one active goal sees >64 distinct assistant messages, early ids evict; a later message.updated re-emit for an evicted id computes previous=0 and re-charges its full cumulative tokens → double-charge.
- Fix approach: OpenCode streams one assistant message at a time within a session (subtasks run in child sessions with separate state), so the ledger only needs the CURRENT streaming message. Collapse it to a single active entry: when a message.updated arrives with a new messageID (≠ lastAccountedMessageID), the prior message is already fully charged incrementally, so reset the map to only the new id. This bounds the map to ~1 entry and removes the 64-cap eviction path entirely.
- Exact change: In the charge paths (recordMessageUpdated 1737-1759 and accountUsage 1645-1669), when messageID && messageID !== current.lastAccountedMessageID, reset accountedMessageUsage to {} before remembering the new id (previous=0 is then correct for a genuinely new message); when messageID === lastAccountedMessageID, charge the delta as today. rememberAccountedMessage then stores a single-entry map.
- Acceptance: A synthetic run of >64 message ids followed by a re-emit of an evicted id does NOT re-charge; normal cumulative streaming of one message still charges deltas exactly once.
- Side effects / parity: mk-goal.js only. Persisted accountedMessageUsage stays (now ≤1 entry), back-compatible with normalizeAccountedMessageUsage. Assumes single-assistant-message-at-a-time per session (true for OpenCode); document the assumption. No Claude surface.
- Test: State test appending >64 message ids then re-emitting an evicted id; assert tokensUsed unchanged on re-emit.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: MAX_ACCOUNTED_MESSAGES is fixed at 64 at .opencode/plugins/mk-goal.js:42. Both normalization and insertion discard older message totals at .opencode/plugins/mk-goal.js:700-714, while accounting treats a missing ID as previously charged zero at .opencode/plugins/mk-goal.js:1641-1669 and 1737-1759. Re-emitting an evicted cumulative message can therefore charge its full total again.
- Fix approach: Retain the complete per-message cumulative ledger for the lifetime of an active goal. No bounded exact algorithm can safely deduplicate arbitrary old message re-emissions without another authoritative session-global cumulative counter.
- Exact change: Remove MAX_ACCOUNTED_MESSAGES and both slice operations from normalizeAccountedMessageUsage and rememberAccountedMessage. Continue sanitizing IDs and positive integer totals, replace an existing key with its latest cumulative value, and reset the ledger only when a new goal is built. Keep both accountUsage and recordMessageUpdated on the same helper.
- Acceptance: After more than 64 distinct messages, re-emitting any earlier message at the same cumulative total charges zero; increasing that old message charges only its delta.
- Side effects / parity: Persisted active goal files grow O(number of messages) until replacement/archive, trading a small bounded-lifetime state increase for exact accounting. Existing ledgers already truncated before upgrade cannot reconstruct lost IDs, but no new eviction occurs. Claude transcript accounting is separate.
- Test: Send at least 65 distinct native message totals, capture tokensUsed, re-emit the first unchanged and assert no increase, then increase its total and assert only the increment is charged; repeat through both accounting entry points.

---

