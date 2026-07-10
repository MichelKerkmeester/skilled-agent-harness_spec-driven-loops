# Iteration 2 - Opus 4.8 (high) cross-check - mk-spec-memory

> **Executor:** Claude Opus 4.8 (`claude-opus-4-8 --effort high`, plan mode) via cli-claude-code through account2, read-only, 2026-07-10.
> **Purpose:** independently verify iteration-1 (GPT-5.6-Sol-Fast) findings and surface issues the first pass missed.

## Net assessment

Of the 13 prior findings, 11 hold (10 as real defects, mostly at P2 after adversarial severity review; F12 as refinement) and F3 is REFUTED because runTrueCitationEmit is fully internally try/caught and cannot abort persistence; F8 and F10 were downgraded to refinements as they are largely mitigated (outer 3s timeout + default maxBuffer) or environmental (dist staleness). The systemic prior over-rating was labeling degraded-but-recoverable soft failures as P1. I added 7 new issues, most notably an OpenCode-only unhandled-EPIPE risk on child.stdin (O1) and an unbounded bridge-stdout accumulation that the Claude side already caps (O2), plus the un-deadlined authored-snapshot write that strengthens F5 (O3) and the missing top-level try/catch in the UserPromptSubmit shim that is the un-mitigated core of F8 (O4).

**Prior findings adjudicated:** 13 - 10 confirmed, 1 refuted, 2 adjusted. **New findings this pass:** 7.

**Parity (Opus view):** Parity is partial and asymmetric, consistent with the prior assessment. Beyond the lifecycle divergence (F9), the two surfaces diverge on subprocess safety: the Claude spawnSync paths bound output (maxBuffer) and run under an external hard timeout, while the OpenCode runBridge lacks a stdout cap (O2) and lacks a child.stdin error handler (O1), and its aggressive per-event cache invalidation (O6) makes its warm-brief caching behave differently from Claude's transcript-derived caching. Converging should mean adding output/stdin-error bounding to runBridge and a session-generation cache key on the OpenCode side, and (if desired) a bounded compaction/stop persistence counterpart — rather than only sharing the warm recovery consumer.

## 1. Verification of iteration-1 findings

| Prior ID | GPT sev | Opus verdict | Opus sev | Adjudication note |
|----------|---------|--------------|----------|-------------------|
| F1 | P1 | **confirmed** | P2 | Real inversion: handleResume pushes a 'Session Continuity' section (session-prime.ts:289-293) whose body is instructional-only ('Call memory_context...'); maybeAppendCliWarmFallback early-returns on hasContinuitySection() (session-prime.ts:340,327-329), so the warm CLI pre-injection is suppressed WHENEVER a lastSpecFolder is known. Without a spec folder the section is titled 'Session Resume' (line 296) and the warm fallback DOES run — so knowing more yields less proactive recovery. Downgraded from P1: the placeholder still instructs the model to call memory_context, so recovery is degraded, not broken. |
| F2 | P1 | **confirmed** | P2 | runContextAutosaveCliFallback (session-stop.ts:104-127) invokes the read-only session_resume tool ({minimal:true}) and returns 'deferred' on ok with no generate-context.js write, memory_save, or retry-queue entry. 'deferred' overstates what happened (a reachability probe, not a save). Confirmed as an honesty/telemetry defect; downgraded from P1 because it only fires when the primary generate-context.js path is missing or already failed. |
| F3 | P1 | **refuted** | P2 | REFUTED. runTrueCitationEmit wraps its entire body in try/catch and returns the `empty` result on ANY error (true-citation-mining.ts:46-79), and short-circuits when the flag is off (line 43). It cannot throw, so the un-try/catch'd await at session-stop.ts:471-484 cannot abort the later atomic state write / autosave at 551-573. The 'shadow-only, fail-safe' comment is accurate. |
| F4 | P1 | **confirmed** | P2 | tailFile does readFileSync(filePath,'utf-8') then slices last 50 lines (compact-inject.ts:44-46) — whole-file load for 50 lines. Confirmed. Downgraded from P1: a bounded fd tail-read already exists in-repo (session-stop.ts:620-631 reads last 50KB via openSync/readSync), so the unboundedness is an inconsistency with existing precedent rather than a hard failure, and it is try/caught with an outer 3s hook timeout. |
| F5 | P1 | **confirmed** | P2 | Only parseHookStdin is wrapped in withTimeout(HOOK_TIMEOUT_MS) (compact-inject.ts:386). refreshAuthoredContinuitySnapshot (401-415), buildMergedContext→autoSurfaceAtCompaction (304, unbounded), buildMergedPayloadContract (422) and the state write (424-440) run with no shared deadline; the cache write is LAST, so any slow leg means Claude's 3s PreCompact timeout (settings.json:45) kills the process with nothing cached. Confirmed; P2 because inner CLI fallbacks self-bound to 600ms and merge is normally sub-ms. |
| F6 | P1 | **confirmed** | P2 | buildMergedContext prepends auto-surfaced constitutional/triggered memories to the returned string (compact-inject.ts:318-331), but main() then calls buildMergedPayloadContract SEPARATELY (line 422), which re-runs a transcript-only merge (334-381) with no auto-surfaced sections. Cached payload ≠ payloadContract provenance/sections, and the merge+extract work runs twice. Confirmed. |
| F7 | P1 | **confirmed** | P2 | Verified via claude-transcript.ts: parseTranscript does its OWN statSync (line 160) and returns newOffset=that fileSize, reading createReadStream(start=startOffset) to current EOF. session-stop.ts captures preParseStat at T0 (382) but stores metrics.lastTranscriptOffset=newOffset at T1 (430) while buildProducerMetadata fingerprints preParseStat (406,293-296). Under append between T0 and T1, sizeBytes(T0) < lastTranscriptOffset(T1): metadata and cursor describe different generations. The 'same generation' code comment (375-379) is wrong. Downgraded from P1: narrow window (transcript is quiescent at Stop) and a mismatch only makes session-prime's identity check more conservative (safe rejection). |
| F8 | P1 | **adjusted** | refinement | spawnSync has no explicit timeout and no explicit maxBuffer (user-prompt-submit.ts:13-18). Confirmed but heavily mitigated: outer hook timeout is 3s (settings.json:33) so a hung child is killed; spawnSync's DEFAULT maxBuffer is 1MB, so overflow sets result.error and the code falls through to output='{}' (23-30). Residual real gap: readFileSync(0)/spawnSync are NOT wrapped in try/catch, so a stdin-read throw crashes the shim before the safe '{}' default is emitted — see O4. Downgraded to refinement. |
| F9 | P1 | **confirmed** | P2 | Structurally accurate: OpenCode plugin exposes only event (cache-invalidate) + experimental.chat.system.transform (warm brief) + status tool (mk-spec-memory.js:416-476); it has no PreCompact transcript cache and no Stop autosave/producer-metadata, all of which the Claude hooks implement. Parity is genuinely partial. Downgraded from P1: this is partly an API-surface divergence (OpenCode does not expose Claude's PreCompact/Stop lifecycle identically), so it is a convergence gap to decide, not a defect. |
| F10 | P1 | **adjusted** | refinement | Confirmed structurally: settings.json:32,44,56,78 execute mcp_server/dist/hooks/claude/*.js with no source/dist freshness fingerprint gate before launch. The specific 'dist is currently stale' claim is environmental and not verifiable from source in this pass. Reclassified to refinement (build-hygiene/deploy concern, not a code bug in the audited files). |
| F11 | P2 | **confirmed** | P2 | invalidateSession (mk-spec-memory.js:392-402) clears only continuityCache; it never touches state.inFlight, and only resetRuntimeState clears inFlight. A bridge lookup begun before a message/session event completes after invalidation and repopulates continuityCache at 361-366. Confirmed; bounded by the 5s TTL (expiresAt uses the pre-invalidation `now`), so staleness is short-lived. |
| F12 | P2 | **confirmed** | refinement | loadConfig catch-all returns {} for both ENOENT (the NORMAL case) and JSON.parse failures (mk-spec-memory.js:44-49); no config-status/error code is retained or surfaced by mk_spec_memory_status. Confirmed as an observability gap; refinement severity because a missing file is expected and defaults apply. |
| F13 | P2 | **confirmed** | P2 | hasSyntheticTextPartMarker safeParses each part with textPartSchema, which is .strict() (spec-kit-opencode-message-schema.mjs:33,116-118). If OpenCode later annotates our injected synthetic part with any extra field (cost/tokens/time.end/provider metadata), strict parse fails, the function returns false, and the same synthetic brief is injected again. Confirmed; med confidence since it depends on the SDK mutating parts post-insertion. Fix: minimal passthrough schema for marker inspection while keeping strict validation for created parts. |

## 2. New findings (missed by iteration 1)

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| O1 | P2 | bug | `.opencode/plugins/mk-spec-memory.js:329` | runBridge never attaches a child.stdin 'error' handler — early-exiting bridge yields unhandled EPIPE | med |
| O2 | P2 | error | `.opencode/plugins/mk-spec-memory.js:296-298` | runBridge accumulates bridge stdout with no size cap (parity gap vs Claude spawnSync maxBuffer) | med |
| O3 | P2 | bug | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:401-415` | PreCompact performs unbounded synchronous authored-snapshot disk writes before any cache is persisted | med |
| O4 | refinement | error | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-31` | UserPromptSubmit shim has no top-level try/catch; a stdin-read throw drops the safe '{}' default | high |
| O5 | refinement | bug | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:564-571` | Stop hook re-runs autosave against pre-existing state when no patch was produced | med |
| O6 | refinement | parity | `.opencode/plugins/mk-spec-memory.js:427-430` | OpenCode invalidates continuity cache on every message/session event, largely defeating the 5s TTL cache | med |
| O7 | refinement | bug | `.opencode/plugins/mk-spec-memory.js:411-413` | appendContinuityBrief dedupe compares a clamped brief with includes(), so a prior full brief can be re-injected | low |

### Detail

#### O1 - runBridge never attaches a child.stdin 'error' handler — early-exiting bridge yields unhandled EPIPE
- **Severity / Category / Confidence:** P2 / bug / med
- **Location:** `.opencode/plugins/mk-spec-memory.js:329`
- **Evidence:** runBridge attaches handlers to child, child.stdout, child.stderr but not child.stdin, then calls `child.stdin?.end(bridgePayload(...))`. If the bridge child exits/crashes before draining stdin (e.g., fast-fails on bad input, or after the SIGTERM path), the pipe write emits an asynchronous 'error' (EPIPE) on the Writable with no listener.
- **Impact:** An unhandled stream 'error' surfaces as an uncaughtException in the OpenCode plugin host, potentially destabilizing/crashing the host rather than failing open. The Claude side uses spawnSync and is immune.
- **Proposed fix:** Attach `child.stdin.on('error', () => {})` (or wrap the .end in try/catch and swallow EPIPE) before writing, consistent with the fail-open contract used for the other streams.

#### O2 - runBridge accumulates bridge stdout with no size cap (parity gap vs Claude spawnSync maxBuffer)
- **Severity / Category / Confidence:** P2 / error / med
- **Location:** `.opencode/plugins/mk-spec-memory.js:296-298`
- **Evidence:** `child.stdout?.on('data', (chunk) => { stdout += String(chunk); })` grows unbounded until close/timeout. The Claude equivalent (session-stop.ts:157-167) sets maxBuffer:1024*1024 on spawnSync; the OpenCode bridge has no equivalent.
- **Impact:** A malfunctioning or runaway bridge that streams large output can grow the buffer without bound and OOM/GC-stall the long-lived OpenCode host process. Cross-runtime inconsistency in output bounding.
- **Proposed fix:** Cap accumulated stdout (e.g., stop appending / kill child past a byte ceiling) and return fail_open with an OVERFLOW error code, matching the Claude maxBuffer behavior.

#### O3 - PreCompact performs unbounded synchronous authored-snapshot disk writes before any cache is persisted
- **Severity / Category / Confidence:** P2 / bug / med
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:401-415`
- **Evidence:** refreshAuthoredContinuitySnapshot runs (docsUpdated/createdMemoryRecords/indexMutations per its own logging) with no time bound, before buildMergedContext and before the pendingCompactPrime cache write. It is try/caught but not deadline-guarded.
- **Impact:** Reinforces F5: a slow snapshot refresh (real disk + index mutation work) can consume Claude's 3s PreCompact budget so the process is killed before ANY compact brief is cached, defeating post-compaction recovery. Also does WRITE work in a hook documented as cache-only ('stdout is NOT injected on PreCompact — we only cache here').
- **Proposed fix:** Run the snapshot refresh under a remaining-budget deadline (or after the cache write), and ensure a bounded legacy cache is persisted before the external hook deadline.

#### O4 - UserPromptSubmit shim has no top-level try/catch; a stdin-read throw drops the safe '{}' default
- **Severity / Category / Confidence:** refinement / error / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-31`
- **Evidence:** `readFileSync(0)` (and the spawnSync call) run at module top level with no try/catch. A stdin read error (EAGAIN on a non-blocking pipe / closed fd) throws before line 22's `output='{}'` fallback and before the final process.stdout.write, so nothing is emitted and node exits non-zero.
- **Impact:** Advisor context is silently lost and Claude receives an empty/errored hook response instead of the intended fail-open '{}'. The residual, un-mitigated part of F8.
- **Proposed fix:** Wrap the read+spawn in try/catch and always emit `process.stdout.write('{}\n')` on any failure; optionally add a timeout below the 3s outer deadline.

#### O5 - Stop hook re-runs autosave against pre-existing state when no patch was produced
- **Severity / Category / Confidence:** refinement / bug / med
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:564-571`
- **Evidence:** When Object.keys(patch).length===0 (no new transcript messages, no last_assistant_message, no retarget), autosaveState falls back to stateBeforeStop and runContextAutosave runs if that stale state still carries lastSpecFolder+sessionSummary from a prior turn.
- **Impact:** generate-context.js can be re-spawned on every Stop event with a stale prior summary, producing redundant/duplicate autosaves and log noise for turns that changed nothing this session.
- **Proposed fix:** Gate autosave on 'summary was (re)extracted this run' (e.g., only when patch.sessionSummary or a fresh transcript delta exists), not merely on the presence of any prior state.

#### O6 - OpenCode invalidates continuity cache on every message/session event, largely defeating the 5s TTL cache
- **Severity / Category / Confidence:** refinement / parity / med
- **Location:** `.opencode/plugins/mk-spec-memory.js:427-430`
- **Evidence:** `if (eventType.startsWith('message.') || eventType.startsWith('session.')) invalidateSession(...)` clears continuityCache on essentially every message update, so the DEFAULT_CACHE_TTL_MS=5000 cache rarely survives between prompts.
- **Impact:** experimental.chat.system.transform then misses cache per prompt and spawns a fresh node bridge subprocess (up to bridgeTimeoutMs=3000 each), so per-prompt subprocess/latency cost is paid despite the caching machinery; the cache_hit_rate telemetry will read near-zero across turns.
- **Proposed fix:** Invalidate on session boundary / genuine state-changing events only (or key the cache by a session generation counter) so intra-session prompts can reuse a warm brief within the TTL.

#### O7 - appendContinuityBrief dedupe compares a clamped brief with includes(), so a prior full brief can be re-injected
- **Severity / Category / Confidence:** refinement / bug / low
- **Location:** `.opencode/plugins/mk-spec-memory.js:411-413`
- **Evidence:** clampBrief may truncate the brief with '...'; the dedupe check `output.system.some(entry => entry.includes(brief))` then tests the clamped string against existing entries. If an earlier, un-clamped (or differently-clamped) brief is present, includes() fails to match and the clamped variant is appended.
- **Impact:** Possible duplicate/near-duplicate continuity briefs in output.system under changing maxBriefChars or when an upstream entry already carries the full brief.
- **Proposed fix:** Dedupe on a stable marker/hash of the un-clamped brief (or on a metadata key) rather than substring-includes of the clamped text.

