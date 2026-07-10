# Fix Design - mk-spec-memory (reconciled)

> Two independent, code-verified fix designs per finding: **GPT-5.6-Sol (high)** and **Opus 4.8 (high)**, each re-read the real code. **AGREE** = both designed a fix (high confidence). **DISPUTED** = one model judges the finding a non-issue - your call before implementing.

## Summary

19 findings - 19 both-agree, 0 disputed.

## Cross-model notes

- **GPT-5.6-Sol:** Implement the compact-path fixes as one ordered refactor: F4 first, then the early valid cache and shared deadline from F5, the single text/envelope assembly from F6, and finally the isolated authored snapshot from O3. Implement F11 before O6 so narrowed invalidation cannot resurrect stale in-flight responses; O7 is independent but belongs in the same plugin regression suite. F8, O4, and F10 should share one bounded Claude-hook launcher/error taxonomy. F2 and O5 should land together so Stop autosave reports only real, fresh writes. F9 should not be solved by pretending OpenCode has Claude transcript or Stop semantics; parity should describe shared guarantees and explicit runtime capabilities. No finding is wholly a non-issue, although O2 is currently partially contained by the child bridge's separate 1 MiB cap.
- **Opus 4.8:** Shared root causes and ordering: (1) compact-inject.ts findings cluster — F6 (single merge returning text+contract) should land WITH F5 (end-to-end deadline) and O3 (cache-before-snapshot ordering); fixing F6 removes the redundant buildMergedPayloadContract merge, shrinking the F5 budget, and O3+F4 (bounded tail) keep the 3s PreCompact budget realistic. Do these together in one pass. (2) Plugin cache findings cluster — F11 (in-flight generation guard) + O6 (invalidate only on boundaries) are complementary: the generation counter makes correctness independent of invalidation frequency, and narrowing invalidation restores the 5s TTL; implement the generation counter first, then narrow invalidation. (3) user-prompt-submit.ts: F8 (timeout/maxBuffer/input cap) and O4 (top-level try/catch + always-emit '{}') are the same rewrite — do once. (4) F10 (rebuild+commit dist) is a prerequisite for F8/O4 taking effect, since settings.json executes the compiled .js, not the .ts sources reviewed here. (5) Reuse existing patterns: bounded tail read (session-stop.ts detectSpecFolderResult) for F4; capOutput/MAX_STDIO_BYTES (spec-memory-cli-fallback.ts) for O2; spawnSync maxBuffer:1MB (session-stop.ts runContextAutosave) for F8. (6) Judged design-not-bug: F9 is largely an intentional cross-runtime divergence — the correct deliverable is a shared lifecycle contract doc plus (only if OpenCode exposes a compaction/idle event) a bounded persist hook, NOT porting Claude's PreCompact/Stop machinery into the OpenCode plugin. (7) Parity map: F13/O1/O2/O6/O7/F11/F12 are OpenCode-plugin-only; F1/F2/F4/F5/F6/F7/O3/O5 are Claude-hook-only; F8/O4/F10 are Claude-hook + build; F9 is the sole genuine cross-runtime contract. F2's honest-reporting fix and F5/O3's deadline discipline are the two highest-value P1 corrections; F7's stat-after-parse flip contradicts an in-code comment that must be updated to avoid re-introducing the bug.

## Per-finding fix designs

### F1 [P1 (GPT P1 / Opus P2)] A placeholder Session Continuity section suppresses real warm recovery
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:289-354` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. session-prime.ts:289-293 — handleResume emits a section titled exactly 'Session Continuity' that is only a pointer ('Last active spec folder: X\nCall memory_context(...)'), not recovered payload. maybeAppendCliWarmFallback (335-342) early-returns when hasContinuitySection() (327-329) finds ANY section with that title, so on source=resume the warm session_resume CLI fetch (buildWarmSessionResumeSection, which would inject real continuity) never runs. handleStartup only emits 'Session Continuity' when a genuine accepted cachedSummary exists (266-271), so startup is correct; only the resume placeholder is mislabeled.
- Fix approach: Reserve the 'Session Continuity' title for genuinely-recovered continuity payload; make the resume pointer use a non-suppressing title so the warm CLI fallback still runs and appends real continuity.
- Exact change: In handleResume (session-prime.ts:289-293) change the lastSpecFolder branch title from 'Session Continuity' to a distinct title (e.g. 'Session Resume', matching the else-branch), keeping the spec-folder line + memory_context hint in content. Do NOT touch handleStartup. Optionally harden by threading an explicit hasRecoveredContinuity boolean into maybeAppendCliWarmFallback instead of title-sniffing, but the rename fully closes the root cause.
- Acceptance: On source=resume with a known lastSpecFolder and a warm daemon, output contains BOTH the resume pointer and a 'Spec Memory CLI Fallback' section with recovered continuity. On source=startup with an accepted cachedSummary, warm fallback is still suppressed (no regression/duplication).
- Side effects / parity: Only session-prime.ts. Parity: this aligns Claude resume with the OpenCode plugin, which always fetches a warm session_resume brief per transform (mk-spec-memory.js:appendContinuityBrief). No other consumer keys on the 'Session Continuity' title except hasContinuitySection.
- Test: Unit: handleResume returns no section titled 'Session Continuity'; integration: maybeAppendCliWarmFallback runs (mock buildWarmSessionResumeSection) for source=resume when only lastSpecFolder is present, and is suppressed for startup when sessionContinuity is set.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `handleResume` labels an instructional placeholder as `Session Continuity` at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:289-293`. `hasContinuitySection` treats that title alone as proof of recovered data at lines 327-329, causing `maybeAppendCliWarmFallback` to return before its warm lookup at lines 340-354.
- Fix approach: Reserve the `Session Continuity` title for accepted continuity payloads and label instructional resume guidance separately. Suppress the warm fallback only for an actual recovered-continuity section.
- Exact change: In `session-prime.ts`, change the section created by `handleResume` when only `lastSpecFolder` is known to `Session Resume`. Keep `Session Continuity` for the accepted `cachedSummaryDecision` branch at lines 266-270. Rename `hasContinuitySection` to make the recovered-payload requirement explicit and document the title invariant.
- Acceptance: A resume with `lastSpecFolder` but no accepted continuity calls `buildWarmSessionResumeSection` and appends its result. A startup containing an accepted continuity payload does not perform the redundant fallback.
- Side effects / parity: Claude SessionStart only. The OpenCode plugin already obtains a live warm brief and does not use these section titles.
- Test: Update `.opencode/skills/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts` with one resume-state fixture containing only `lastSpecFolder` and one accepted-continuity fixture; assert fallback invocation counts and section titles.

---

### F2 [P1 (GPT P1 / Opus P2)] The autosave fallback reports deferred without performing or queuing a save
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:104-127` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: Confirmed. session-stop.ts:114-123 — runContextAutosaveCliFallback calls runWarmSpecMemoryCliTool with toolName 'session_resume', a READ-ONLY tool (spec-memory-cli-fallback.ts:464-490 → session_resume minimal). On result.status==='ok' it returns 'deferred' and logs 'deferred ... reached the daemon', but no canonical doc write, memory_save, queue entry, or retry record is created. 'deferred' falsely implies durable follow-up.
- Fix approach: Make the reported outcome truthful: a read-only reachability probe is not a save. Either return the real primaryOutcome (skipped/failed), or persist a durable retry record so 'deferred' becomes true.
- Exact change: Preferred minimal: in runContextAutosaveCliFallback, on result.status==='ok' log that the daemon is reachable but NO autosave occurred and return primaryOutcome (not 'deferred'). Fuller (recommended given P1): before returning, persist a retry marker via updateState(sessionId, { pendingAutosave: { specFolder, summary: state.sessionSummary?.text, attempts, lastError, queuedAt } }) and return 'deferred' ONLY if that write persists (else primaryOutcome); then add a consumer that drains pendingAutosave at the next Stop/SessionStart. Do not keep calling session_resume as the 'save'.
- Acceptance: When the primary generate-context.js path is missing/failed, autosaveOutcome is never 'deferred' unless a pendingAutosave record was actually written; a read-only probe alone yields 'skipped'/'failed' with a log stating no save happened. If the retry marker is added, a subsequent stop hook completes or drops it.
- Side effects / parity: session-stop.ts; if durable path chosen, hook-state.ts (add pendingAutosave to HookState) + a drain consumer. Parity: OpenCode plugin performs no autosave at all (see F9), so no cross-runtime parity write is required here.
- Test: Unit: with generate-context.js absent and a warm daemon, assert outcome ∈ {skipped, failed, deferred-with-persisted-marker}, never bare 'deferred'; assert no memory_save side effect from the session_resume call.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:104-127` calls the read-only `session_resume` tool and converts a successful read into `deferred`, although no write or durable retry is created. The bridge allowlist also permits only prompt-safe reads at `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:18-20,360-369`.
- Fix approach: Do not manufacture a deferred-success state. Because no durable write queue currently exists, the smallest truthful fix is to remove the read-only fallback and preserve the primary `skipped` or `failed` outcome.
- Exact change: Delete `runContextAutosaveCliFallback`, remove its `runWarmSpecMemoryCliTool` import, and return `skipped` when the autosave script is unavailable or `failed` when its execution fails. Remove `deferred` from `SessionStopAutosaveOutcome` and from the stop-hook `OperationResult` status union if no other stop operation legitimately uses it. Log a bounded message stating that no autosave occurred.
- Acceptance: Missing-script and failed-script paths never return `deferred`, never invoke `session_resume`, and clearly distinguish `skipped` from `failed`. `ran` is returned only after the write-capable script exits successfully.
- Side effects / parity: No OpenCode parity change is required because its plugin has no corresponding autosave claim. If a durable retry queue is introduced later, only a successfully enqueued record may return `deferred`.
- Test: Update `tests/hook-session-stop.vitest.ts` to mock a reachable daemon while the autosave script is missing or failing; assert no CLI read is launched and outcomes remain `skipped` or `failed`.

---

### F4 [P1 (GPT P1 / Opus P2)] PreCompact tailing reads the entire transcript synchronously
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:41-48` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. compact-inject.ts:42-49 — tailFile does readFileSync(filePath,'utf-8') then splits and slices the last N lines; the full transcript is loaded into memory even though only 50 lines are used (main:397). Unbounded read on a large transcript wastes time/memory inside a 3s PreCompact budget.
- Fix approach: Bounded backward tail read: read only a byte window from EOF and expand backward until N lines (or file start) are obtained.
- Exact change: Rewrite tailFile to open/fstat the file and readSync a capped tail window (e.g. start at 64KB, doubling up to a hard cap ~1MB) from the end, decode, split on '\n', and return the last N lines; keep the try/catch returning [] on error. Reuse the exact open/fstat/read-from-offset pattern already in session-stop.ts:620-631 (detectSpecFolderResult) for consistency.
- Acceptance: tailFile on a 100MB transcript returns the correct last 50 lines while reading ≤~1MB (assert via a spy on read bytes or timing); byte-boundary safety — a multibyte char split at the window edge does not corrupt the retained lines (drop the first partial line when startPosition>0).
- Side effects / parity: compact-inject.ts only; tailFile is exported (used in tests). Parity: the Claude Stop hook already tail-reads bounded bytes; this brings PreCompact in line. No OpenCode equivalent (plugin has no PreCompact transcript read).
- Test: Unit: large temp file → assert returned lines equal the true tail and bytes read are bounded; small file (< window) still returns all lines; empty/missing file returns [].

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `tailFile` calls `readFileSync` for the complete transcript before slicing lines at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:41-48`, so memory and synchronous I/O scale with total transcript size.
- Fix approach: Read backward through one descriptor in fixed-size chunks until enough newline delimiters are found or a hard byte ceiling is reached. Degrade deterministically when a single line exceeds the ceiling.
- Exact change: Replace the `readFileSync` implementation with `openSync`/`fstatSync`/positioned `readSync`/`closeSync`. Add constants for chunk size and maximum tail bytes. Drop the first partial line when reading starts after byte zero, preserve line ordering, handle UTF-8 decoding at the assembled-buffer boundary, and return at most the requested line count.
- Acceptance: Tailing a multi-megabyte transcript reads no more than the configured byte ceiling and returns the same final lines as the old implementation when those lines fit. Missing files and oversized final lines remain fail-open and bounded.
- Side effects / parity: Claude PreCompact only. The bounded-tail helper can also replace similar transcript-tail reads later, but unrelated parsers should not be changed in this fix.
- Test: Extend `tests/hook-precompact.vitest.ts` with a large transcript, multibyte text crossing a chunk boundary, no-final-newline input, and a final line larger than the cap; instrument reads or expose read metrics to prove the byte ceiling.

---

### F5 [P1 (GPT P1 / Opus P2)] The PreCompact workload is not bounded by HOOK_TIMEOUT_MS
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:383-445` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: Confirmed. compact-inject.ts:386 wraps only parseHookStdin in withTimeout(HOOK_TIMEOUT_MS=1800). The heavy work — refreshAuthoredContinuitySnapshot (401-415), buildMergedContext incl. autoSurfaceAtCompaction + renderCliCompactionFallback (420), buildMergedPayloadContract second merge (422), updateState (424) — runs with no shared deadline, while settings.json:44 gives PreCompact only 3s. A slow merge/surface/CLI can blow the budget with nothing cached.
- Fix approach: Impose one end-to-end deadline (shared budget) over the post-stdin workload and guarantee a bounded legacy cache is persisted before the external 3s cutoff.
- Exact change: In main(), after computing remaining budget (HOOK_TIMEOUT_MS minus elapsed since start), wrap the merged-context build in withTimeout(buildMergedContext(...), remaining, null); on null (deadline hit) skip straight to the legacy buildCompactContext path and persist that. Combine with F6 (single merge returns text+contract, removing the second full merge at 422) and F4/O3 to keep the budget realistic. Track a monotonic start (performance.now) and pass staged remaining budgets to the snapshot (O3) and merged build.
- Acceptance: Injected fault making buildMergedContext exceed the deadline still results in a persisted pendingCompactPrime (legacy payload) before ~HOOK_TIMEOUT_MS; total main() wall time stays under the 3s hook timeout in a stress test.
- Side effects / parity: compact-inject.ts; interacts with F6 (removes duplicate merge) and O3 (snapshot ordering/deadline). Parity: Claude-only; OpenCode plugin already bounds its bridge via bridgeTimeoutMs.
- Test: Unit with a stubbed slow buildMergedContext: assert legacy cache persisted and function returns within budget; fast path unchanged (merged cache persisted).

**GPT-5.6-Sol** — risk: high · confidence: high
- Root cause: Confirmed. Only `parseHookStdin` is wrapped by `withTimeout` at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:383-390`; transcript work, snapshot refresh, auto-surfacing, CLI fallback, merging, and persistence continue outside a shared deadline at lines 395-485. `HOOK_TIMEOUT_MS` is 1800 ms at `hooks/claude/shared.ts:7-8`, while Claude terminates PreCompact after three seconds at `.claude/settings.json:38-46`.
- Fix approach: Use one deadline for the complete hook, persist a bounded baseline cache before optional work, and pass remaining time to every asynchronous or subprocess stage. Do not rely on `Promise.race` around non-cancellable synchronous mutation.
- Exact change: Start the deadline before stdin parsing. Make `parseHookStdin` support a byte limit and cancellation/stream teardown. After bounded transcript tailing, immediately assemble and atomically persist a legacy compact payload with a valid envelope. Then attempt enriched merge, auto-surface, CLI fallback, and snapshot work only while a reserved persistence margin remains; each awaited operation receives `deadline - now`. Replace the baseline cache only after the enriched result is complete and validated. Exit before `HOOK_TIMEOUT_MS`, leaving the baseline cache intact on timeout.
- Acceptance: With auto-surface, CLI, or snapshot stages deliberately hung, the process exits within the internal deadline plus a small scheduling margin and a valid `pendingCompactPrime` remains available. No late completion overwrites state after the deadline.
- Side effects / parity: Coordinate with F6 and O3 in `compact-inject.ts`, `shared.ts`, and the snapshot execution boundary. Claude SessionStart remains the consumer of the same cache schema. OpenCode has no PreCompact hook.
- Test: Add fake-timer and subprocess integration cases to `tests/hook-precompact.vitest.ts` for hanging auto-surface, slow snapshot work, slow CLI fallback, and near-deadline state persistence; assert wall-clock bounds and valid fallback cache semantics.

---

### F6 [P1 (GPT P1 / Opus P2)] The cached payload contract does not describe the payload being cached
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:304-331` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: Confirmed. compact-inject.ts:230-332 — buildMergedContext prepends surfaced constitutional/triggered memories (318-331) to merged.text but discards merged.payloadContract. main (422) then calls buildMergedPayloadContract (334-381) which re-runs a transcript-only merge and returns a payloadContract whose sections never include the surfaced memories. The cached string payload and its payloadContract therefore describe different content.
- Fix approach: Produce text and payloadContract from a single merge and add every surfaced section to that same envelope before caching.
- Exact change: Change buildMergedContext to return { text, payloadContract } from the same `merged` object. After building constitutionalSection/triggeredSection, push them onto merged.payloadContract.sections as SharedPayloadSection entries (key 'auto-constitutional'/'auto-triggered', source 'memory', title/content matching the prepended text). In main, consume the returned payloadContract and delete the separate buildMergedPayloadContract call (422) and its function. Keep the provenance override spread (428-437).
- Acceptance: For a transcript that yields surfaced memories, the cached pendingCompactPrime.payloadContract.sections contain entries whose combined content matches the surfaced text prepended to payload; truncation is applied consistently to both.
- Side effects / parity: compact-inject.ts; removes the redundant second merge (also helps F5). SharedPayloadSection.source='memory' is valid (shared-payload.ts:166-177). Downstream: validatePendingCompactPrimeSemantics / session-prime handleCompact read payloadContract.provenance only, so adding sections is backward-compatible. Parity: Claude-only.
- Test: Unit: build with surfaced memories present → assert payloadContract.sections includes the surfaced sections and payload string starts with the same content; build with none → contract equals prior transcript-only sections.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. `buildMergedContext` prepends auto-surfaced memory text at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:304-331`, but `buildMergedPayloadContract` independently rebuilds only transcript-derived inputs at lines 334-380. Main caches text from the first operation and the envelope from the second at lines 420-439.
- Fix approach: Assemble emitted text and its envelope from one selected section set and one budget pass. Every emitted section, including auto-surfaced and CLI-fallback content, must be represented in the envelope.
- Exact change: Replace `buildMergedContext` and `buildMergedPayloadContract` with one `buildMergedCompactResult` returning `{ text, payloadContract }`. Resolve memory sections before assembly, feed constitutional and triggered content through the merger's corresponding inputs, and model CLI fallback as an explicit memory/operational section. Apply truncation inside the shared assembly so contract section contents describe the bytes retained in `text`. Cache both returned values without a second merge.
- Acceptance: For transcript-only, auto-surfaced, and CLI-fallback cases, the ordered envelope sections reconstruct the persisted payload after the documented renderer is applied. No surfaced heading appears in the payload without a corresponding contract section.
- Side effects / parity: If `@spec-kit/shared/compact-merger` cannot represent the fallback section, extend that shared package minimally and update all merger consumers. Claude SessionStart semantic validation continues to consume the same `SharedPayloadEnvelope` type.
- Test: Extend `tests/hook-precompact.vitest.ts` with auto-surface and CLI-fallback fixtures; compare persisted payload headings/content against `pendingCompactPrime.payloadContract.sections`, including truncation cases.

---

### F7 [P1 (GPT P1 / Opus P2)] Producer metadata can identify an older transcript generation than the parsed bytes
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:375-406` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: Confirmed. session-stop.ts:380-406 — preParseStat = statSync(transcriptPath) is captured BEFORE parseTranscript (390), which reads to current EOF and returns newOffset reflecting bytes possibly appended after the stat. buildProducerMetadata (288-311) fingerprints preParseStat.size/mtime, so the producer metadata can describe an older generation than the offset/tokens actually parsed. The in-code comment asserting stat-before-parse is the source of the defect.
- Fix approach: Fingerprint the transcript state as of parse completion: re-stat after parseTranscript and reconcile.
- Exact change: After parseTranscript returns, statSync(transcriptPath) again (postParseStat). Build producerMetadata from postParseStat (the freshest coherent snapshot of the file the hook just consumed). If postParseStat identity/size/mtime differs from preParseStat, log an info note (transcript advanced during parse) but still use postParseStat so fingerprint/size/mtime and newOffset describe the same end-state. Keep the pre-parse stat only as a fallback if the re-stat throws. Update the misleading comment.
- Acceptance: Simulate an append between stat and parse (larger file after parse): producerMetadata.transcript.{size,mtime,fingerprint} match the post-parse stat, not the pre-parse one; SessionStart transcript-identity validation no longer spuriously mismatches on a self-consistent stop write.
- Side effects / parity: session-stop.ts; producerMetadata feeds HookState and session-prime's transcript_identity_mismatch check — post-parse stat is the correct reference for that staleness check. Parity: Claude-only.
- Test: Unit: mock parseTranscript to append to the file during the call; assert buildProducerMetadata inputs equal the post-parse stat; unchanged-file case yields identical behavior to today.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. Session Stop captures a path stat at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:375-406`, but `parseTranscript` opens the path independently and creates a stream without an `end` boundary at `hooks/claude/claude-transcript.ts:159-174`. It can consume appended bytes while returning the earlier internal `fileSize` at line 206, so usage, cursor, and producer metadata can describe different generations.
- Fix approach: Parse a bounded range from the same open descriptor used to capture producer metadata.
- Exact change: In `session-stop.ts`, open the transcript once, call `fstatSync`, and pass that descriptor plus captured size to a bounded transcript-parser API. In `claude-transcript.ts`, add an options form accepting `fd` and `endOffset`, create the stream with `start`, inclusive `end: endOffset - 1`, and `autoClose: false`, and return the captured end offset. Build metadata from the same descriptor stat, then close it in `finally`. Preserve the existing path-based parser wrapper for other consumers.
- Acceptance: Bytes appended after the descriptor snapshot are excluded from usage and offset during the current Stop invocation and consumed exactly once on the next invocation. Metadata size, modified time, fingerprint, and cursor all refer to the captured generation.
- Side effects / parity: Update `claude-transcript.ts` and its direct tests. Other path-based parser consumers retain current behavior unless they explicitly request snapshot parsing.
- Test: Update `tests/hook-session-stop.vitest.ts` race coverage to append a usage-bearing JSONL row after `fstat` but before stream completion; assert the first run excludes it and stops at the captured size, while the second run includes it.

---

### F8 [P1 (GPT P1 / Opus refinement)] UserPromptSubmit launches its child without timeout or output bounds
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-18` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. user-prompt-submit.ts:13-18 — spawnSync(process.execPath,[TARGET,...]) is called with no timeout, no maxBuffer, and input:readFileSync(0) (unbounded stdin). The outer settings.json UserPromptSubmit timeout is 3s but the shim cannot itself terminate or classify a hung/oversized child; a stuck advisor child can hold the prompt path.
- Fix approach: Bound the child (timeout below outer 3s, capped output, capped input) and classify failures into a safe emit.
- Exact change: Read stdin into a Buffer and cap it (e.g. slice to ~1MB) before passing as input. Pass spawnSync options timeout: 2500, maxBuffer: 1024*1024, killSignal:'SIGKILL'. After the call, treat result.error (incl. ETIMEDOUT), non-zero status, and oversized output as failure → emit '{}' (existing fallback at 22-30 already handles status!==0/parse fail; extend it to also cover result.error/timeout). Emit a one-line sanitized diagnostic to stderr distinguishing timeout/overflow/spawn/parse. Pairs with O4's try/catch.
- Acceptance: A TARGET that sleeps >2.5s causes the shim to emit '{}\n' and exit 0 within the outer 3s; a TARGET emitting >1MB does not OOM and yields '{}'; normal JSON passes through unchanged.
- Side effects / parity: user-prompt-submit.ts; the advisor implementation lives in system-skill-advisor (parity is with the advisor dist, not spec-memory). Ensure timeout < outer hook timeout (3s). Also rebuild dist (F10) since settings.json runs the .js.
- Test: Unit/integration: fake TARGET scripts for slow, oversized, crashing, and valid outputs; assert stdout is always exactly one JSON line and exit 0.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-18` invokes `spawnSync` without `timeout` or `maxBuffer` and passes an unbounded `readFileSync(0)` buffer. The outer three-second limit in `.claude/settings.json:26-35` cannot classify or cleanly report the child failure inside the shim.
- Fix approach: Bound stdin, child duration, and captured output below the outer Claude deadline, and convert every failure class into the hook's safe JSON fallback.
- Exact change: Move execution into `main`; read stdin with a fixed byte cap, use `spawnSync` with a timeout below three seconds and `maxBuffer` of at most 1 MiB, and stop forwarding arbitrary child stderr. Map input overflow, timeout, output overflow, spawn error, nonzero exit, and invalid JSON to short sanitized stderr codes while always selecting `{}` for stdout.
- Acceptance: A hanging child is terminated before Claude's outer timeout. Oversized stdin/stdout, malformed output, and spawn failures each emit exactly one valid `{}` JSON object on stdout and a bounded diagnostic on stderr.
- Side effects / parity: Coordinate with O4 and F10. The delegated system-skill-advisor hook must obey the same or tighter timeout and output ceilings.
- Test: Extend `tests/user-prompt-submit-shim.vitest.ts` with hanging, oversized-output, oversized-input, malformed-JSON, and spawn-error child fixtures; assert duration, output validity, and diagnostic redaction.

---

### F9 [P1 (GPT P1 / Opus P2)] OpenCode and Claude inject continuity at materially different lifecycle points
`.opencode/plugins/mk-spec-memory.js:404-436` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: med
- Root cause: Confirmed as a divergence, partially intentional. OpenCode plugin (mk-spec-memory.js:404-436) injects continuity only via experimental.chat.system.transform (per-prompt warm brief) and otherwise invalidates caches on lifecycle events; it has no PreCompact-cache or Stop-autosave counterpart. Claude wires four separate hooks (SessionStart prime, PreCompact cache, Stop autosave, UserPromptSubmit→advisor). The continuity injection point genuinely differs by runtime, but no shared contract documents which surface owns persistence, so drift is undetected.
- Fix approach: Write a shared lifecycle contract that names, per runtime, where continuity is (a) recovered and (b) persisted, and converge on the intersection both runtimes can support rather than bolting Claude-style PreCompact/Stop machinery onto OpenCode's plugin API.
- Exact change: Add a short contract doc under mcp_server/plugin_bridges/ (or references/) stating: both runtimes recover continuity at session-start and per-prompt/transform via the same warm session_resume CLI/bridge; Claude additionally persists at PreCompact/Stop because its hook surface exposes those events, whereas OpenCode relies on the always-warm daemon + per-transform brief. If OpenCode exposes a compaction/idle event (verify against the event catalog — the plugin already branches on session.*/message.*), add a single bounded warm-persist call there; otherwise document the divergence as accepted. No heavy new machinery on OpenCode.
- Acceptance: A reviewer can point to one doc that states each runtime's recover/persist points; if a compaction event exists in OpenCode, a bounded persist is wired; CI/lint references the contract so future edits to one surface flag the other.
- Side effects / parity: Documentation-primary; optional small OpenCode event-handler addition (mk-spec-memory.js event switch). Verify OpenCode event names before adding code.
- Test: N/A (doc) plus, if an OpenCode persist event is added, a unit test that the handler runs a bounded (timeout-guarded) brief refresh and never blocks the event loop.

**GPT-5.6-Sol** — risk: med · confidence: med
- Root cause: Confirmed as an undefined parity contract rather than proof that identical hook points are required. OpenCode refreshes a warm brief from `experimental.chat.system.transform` at `.opencode/plugins/mk-spec-memory.js:404-436` and only invalidates state from events. Claude instead wires UserPromptSubmit, PreCompact, SessionStart, and Stop processes at `.claude/settings.json:26-80`, with transcript-derived cache and autosave behavior unavailable in the inspected OpenCode plugin.
- Fix approach: Define behavior-level parity, not hook-for-hook imitation: both runtimes must recover continuity before the first/resumed model turn and avoid stale or duplicate injection; persistence is required only where the runtime supplies a trustworthy transcript and durable lifecycle event. Unsupported capabilities must be explicit rather than silently implied.
- Exact change: Add a shared lifecycle capability contract beside the plugin bridges and a parity test matrix. Declare Claude as `startup recovery + PreCompact cache + Stop persistence` and OpenCode as `per-transform warm recovery`, with compaction/autosave explicitly unsupported until OpenCode exposes equivalent trusted inputs. Surface these capabilities in `mk_spec_memory_status`. Do not add a fake OpenCode autosave from message events or add per-prompt memory work to the advisor shim.
- Acceptance: Contract tests prove both runtimes recover before their first/resumed model call and dedupe repeated injection. Status output clearly reports which persistence guarantees exist, and no runtime claims an autosave or compact cache it cannot perform.
- Side effects / parity: Claude hooks, the OpenCode plugin, bridge documentation, and runtime parity tests must use the same capability vocabulary. This intentionally preserves different mechanisms where runtime APIs differ.
- Test: Add `tests/runtime-continuity-lifecycle-parity.vitest.ts` covering the shared guarantee matrix and extend the OpenCode plugin status test with explicit recovery, compaction, and autosave capability fields.

---

### F10 [P1 (GPT P1 / Opus refinement)] Claude executes generated dist hooks without enforcing source freshness
`.claude/settings.json:32` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: Confirmed. .claude/settings.json:32,44,56,78 execute mcp_server/dist/hooks/claude/*.js, not the audited TypeScript sources; the startup digest reports the dist stale and there is no freshness guard. Behavior in production can diverge from the reviewed source.
- Fix approach: Immediate: rebuild and commit the dist so it matches source. Structural: add a lightweight, fail-open source/dist freshness diagnostic — never a hard block that could break sessions.
- Exact change: 1) Rebuild @spec-kit/mcp-server dist and commit it. 2) Add a tiny shared guard (invoked once at hook entry or via a committed source-hash manifest) that compares a build-time source hash against the running dist and, on mismatch, writes a bounded WARN to stderr only (stdout is reserved) and continues executing dist (fail-open). Do NOT gate hook execution on freshness. Optionally add a CI check that fails the build when dist is stale relative to src.
- Acceptance: After rebuild, the startup digest reports dist fresh; with an artificially stale dist, hooks still run and emit a single stderr WARN, never blocking Claude; CI flags stale dist on PRs.
- Side effects / parity: Build artifacts under mcp_server/dist; settings.json unchanged (or minimal). Parity: OpenCode loads .opencode/plugins/mk-spec-memory.js directly (source), so only the Claude dist path needs this; no OpenCode change.
- Test: CI: assert `tsc`/build produces no diff in dist (stale-dist detector); unit: guard emits stderr-only WARN and returns without throwing when hashes differ.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. All Spec Kit Claude commands execute generated `mcp_server/dist` files directly at `.claude/settings.json:32,44,56,78`. No command performs a source/dist freshness check. A freshness library already exists and the daemon CLI bridge recognizes stale-dist exit 69 at `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:191-205`, but that protection is bypassed by direct hook execution.
- Fix approach: Route every Claude hook through one stable, source-controlled launcher that validates the requested dist entry before execution and emits hook-specific safe fallback output when stale.
- Exact change: Add an allowlisted CJS launcher outside `mcp_server/dist` that uses `scripts/lib/dist-freshness.cjs` to check the mcp-server package and requested entry. Update the four `.claude/settings.json` commands to invoke it with `user-prompt-submit`, `compact-inject`, `session-prime`, or `session-stop`. On stale/missing dist, emit `{}` only for UserPromptSubmit, no injected content for the other hooks, and a bounded stderr diagnostic with the rebuild command. For UserPromptSubmit, also verify the delegated system-skill-advisor dist before spawning it. Rebuild mcp-server and advisor dist through their normal build/finalize steps.
- Acceptance: Fresh dist executes the intended hook. Touching a source file without rebuilding prevents stale hook execution, produces protocol-valid fallback output, and identifies the correct rebuild command. Rebuilding restores execution.
- Side effects / parity: Update `.claude/settings.json`, the new launcher, mcp-server dist generation, and system-skill-advisor freshness handling. OpenCode already has plugin/CLI freshness guards and should share the same exit taxonomy.
- Test: Add a launcher test using fresh, stale, and missing fixture manifests for all four hook modes, plus an alignment assertion that every Spec Kit command in `.claude/settings.json` routes through the launcher.

---

### F11 [P2] Session invalidation does not invalidate an in-flight continuity lookup
`.opencode/plugins/mk-spec-memory.js:350-369` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. mk-spec-memory.js:333-371 — getContinuity stores an in-flight promise in state.inFlight and, on resolve (361-366), caches the response. invalidateSession (392-402) clears only continuityCache, not state.inFlight; a lookup begun before a message/session event resolves afterward and repopulates continuityCache with pre-event continuity.
- Fix approach: Tag each lookup with a per-session generation captured at start; on invalidation bump the generation and drop the matching in-flight entry; after await, only cache if the generation is unchanged.
- Exact change: Add state.sessionGenerations: Map<string,number> (key = normalizeSessionID). In getContinuity, capture gen = generations.get(sid)??0 before runBridge; after the promise resolves, only insertWithEviction when generations.get(sid)===gen (else return response without caching). In invalidateSession, increment the generation for the session (or all on global clear) and also delete the corresponding state.inFlight entries so a fresh lookup starts. Reset the map in resetRuntimeState.
- Acceptance: Race test: start getContinuity (bridge pending), fire invalidateSession, then resolve the bridge → continuityCache does NOT contain the stale response; a subsequent getContinuity performs a fresh bridge call.
- Side effects / parity: mk-spec-memory.js only. Combine with O6 (invalidate less often) — the generation guard makes correctness independent of invalidation frequency. Parity: Claude hooks have no equivalent in-memory cache, so no parity change.
- Test: Unit with a controllable bridge promise: assert post-invalidation resolution is not cached and inFlight is cleared; normal (no invalidation) path still caches.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. `getContinuity` reuses and later caches `state.inFlight` at `.opencode/plugins/mk-spec-memory.js:350-369`, while `invalidateSession` clears only completed cache entries at lines 392-401. An older promise can therefore repopulate the cache after invalidation; its unconditional `inFlight.delete(key)` can also delete a newer replacement lookup.
- Fix approach: Use a per-session generation and promise-identity checks. Invalidation makes prior results ineligible for caching without requiring subprocess cancellation.
- Exact change: Add a generation map or epoch to plugin state. Capture the session generation when creating a lookup, store `{ generation, promise }` in `inFlight`, and cache the result only if the generation is unchanged. Invalidation increments the relevant generation and removes matching cache and in-flight entries. In `finally`, delete an in-flight entry only when it still references the completing promise. Reset generations on global disposal.
- Acceptance: After invalidation during a slow lookup, the old result is returned only to its original caller, never cached, and never removes or overwrites the subsequent lookup. The next transform receives post-invalidation continuity.
- Side effects / parity: Implement before narrowing event invalidation in O6. No Claude change is required because its hook processes do not share this in-memory cache.
- Test: Add a deferred-child race test in `.opencode/plugins/tests/mk-spec-memory.test.cjs`: invalidate lookup A, start lookup B, resolve A then B, and assert only B is cached and subsequent transforms use B.

---

### F12 [P2 (GPT P2 / Opus refinement)] Configuration parse and read failures are completely silent
`.opencode/plugins/mk-spec-memory.js:42-49` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. mk-spec-memory.js:42-49 — loadConfig catches all readFile/JSON.parse errors and returns {} with no distinction between 'file absent' (ENOENT, normal) and 'read/parse error' (misconfiguration). mk_spec_memory_status (439-473) cannot surface a config problem.
- Fix approach: Return config data plus a sanitized status/error code; store it on state and expose it via the status tool without writing to the TUI (stdout).
- Exact change: Change loadConfig to return { data, status, error }: status 'loaded' on success, 'absent' when err.code==='ENOENT', 'parse_error' on JSON.parse failure, 'read_error' otherwise; error = a short sanitized code (no path/content). In the factory, destructure fileConfig.data for merged and store config status on state (state.configStatus/state.configError). Add `config_status=` and `config_error=` lines to the mk_spec_memory_status output (472). The status tool returns a string result (not stdout/TUI), so no TUI leak.
- Acceptance: With a malformed JSON config file, mk_spec_memory_status reports config_status=parse_error; with no file, config_status=absent; with valid file, config_status=loaded. No path/content leaks in the code.
- Side effects / parity: mk-spec-memory.js only; loadConfig return shape changes (module-local, single consumer). Parity: Claude hooks don't read this config file, no parity.
- Test: Unit: loadConfig against absent/malformed/valid fixtures returns correct status; status tool string includes the config_status line.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `loadConfig` collapses missing files, permission failures, read failures, and malformed JSON into `{}` at `.opencode/plugins/mk-spec-memory.js:42-49`; `mk_spec_memory_status` consequently cannot distinguish default configuration from broken configuration at lines 439-472.
- Fix approach: Return sanitized configuration diagnostics as data and expose them only through the status tool, preserving the no-TUI-output rule.
- Exact change: Make `loadConfig` return `{ config, status }`, with states such as `loaded`, `missing`, `parse_error`, and `read_error`. Treat `ENOENT` as normal `missing`; never expose paths or raw exception text. Merge only `config` into options and add `config_status` plus `config_error_code` to `mk_spec_memory_status`. Do not log during plugin initialization.
- Acceptance: Missing configuration reports `missing` without an error; malformed JSON reports `parse_error`; unreadable input reports `read_error`; valid configuration reports `loaded`. Plugin behavior remains fail-open and no stdout/stderr is written.
- Side effects / parity: OpenCode only. Claude settings do not consume this config file.
- Test: Add isolated dynamic-import tests in `.opencode/plugins/tests/mk-spec-memory.test.cjs` with temporary HOME directories for missing, malformed, unreadable, and valid config files; inspect only the status tool output.

---

### F13 [P2] Marker deduplication rejects otherwise valid text parts with extra fields
`.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs:114-121` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. spec-kit-opencode-message-schema.mjs:114-121 — hasSyntheticTextPartMarker validates each existing part with textPartSchema, which is .strict() (20-33). Any extra property added by OpenCode or another plugin makes safeParse fail, so the marker is never inspected and dedupe returns false → a duplicate synthetic part is injected.
- Fix approach: Use a minimal passthrough schema (or direct field checks) for marker INSPECTION while keeping the strict schema for CREATION of new parts.
- Exact change: In hasSyntheticTextPartMarker, replace the strict textPartSchema.safeParse with either (a) a lenient inspection schema `z.object({ type: z.literal('text'), metadata: metadataSchema.optional() }).passthrough()`, or (b) direct guarded access: return true only when part is an object, part.type==='text', and part.metadata?.[markerKey]===dedupeKey. Leave createSyntheticTextPart (91-104) on the strict schema.
- Acceptance: A part carrying the marker plus an extra unknown field is correctly detected (dedupe returns true, no duplicate injected); a non-text or marker-less part returns false; created synthetic parts still validate strictly.
- Side effects / parity: spec-kit-opencode-message-schema.mjs only; used by the OpenCode message-transform path. Claude has no equivalent, no parity.
- Test: Unit: parts with extra fields + marker → true; parts with extra fields but wrong/absent marker → false; strict creation path unchanged.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `hasSyntheticTextPartMarker` validates existing parts through the strict creation schema at `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs:114-121`, while that schema rejects unknown properties at lines 20-33. Valid marked text parts extended by OpenCode therefore evade deduplication.
- Fix approach: Use strict validation for newly created parts but inspect existing markers through a minimal structural predicate.
- Exact change: Leave `createSyntheticTextPart` on `textPartSchema`. In `hasSyntheticTextPartMarker`, directly require a non-null object, `type === 'text'`, `synthetic === true`, a non-array metadata object, and `metadata[markerKey] === dedupeKey`; ignore unrelated fields. Alternatively define a dedicated `.passthrough()` marker-inspection schema with exactly those requirements.
- Acceptance: A marked synthetic text part with extra OpenCode fields deduplicates successfully. Wrong part types, non-synthetic parts, missing metadata, and different marker values do not.
- Side effects / parity: The inspected consumer is `.opencode/plugins/mk-code-graph.js:31-33,498`, not the current `mk-spec-memory` plugin. No Claude equivalent uses OpenCode message parts.
- Test: Add a focused message-schema test covering extra top-level and metadata fields, malformed objects, non-synthetic text, and exact marker matches; include one integration assertion through the mk-code-graph messages transform.

---

### O1 [P2 · Opus-new] runBridge never attaches a child.stdin 'error' handler — early-exiting bridge yields unhandled EPIPE
`.opencode/plugins/mk-spec-memory.js:329` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. mk-spec-memory.js:273-330 — runBridge attaches handlers to child, child.stdout, child.stderr but never to child.stdin; line 329 calls child.stdin?.end(bridgePayload(...)). If the bridge child exits/crashes before draining stdin (bad input fast-fail, or after the SIGTERM/SIGKILL timeout path), writing to the closed pipe emits an 'error' (EPIPE) on the stdin stream with no listener → unhandled error can crash the OpenCode host process, violating the fail-open contract used for the other streams.
- Fix approach: Swallow stdin write errors exactly as the other streams are swallowed.
- Exact change: Before the .end() call, attach child.stdin?.on('error', () => {}) (mirroring child.stderr?.on('data', () => {})), or wrap child.stdin?.end(...) in a try/catch that ignores EPIPE/ERR_STREAM_DESTROYED. Add the listener regardless of whether end() throws synchronously.
- Acceptance: A bridge child that exits immediately (rejecting stdin) does not produce an unhandled 'error' event; runBridge still resolves fail_open via the existing close/error handlers.
- Side effects / parity: mk-spec-memory.js only. Parity: Claude uses spawnSync (synchronous, no async stdin pipe), so no parity change.
- Test: Unit: stub a child whose stdin emits 'error' after end(); assert no unhandled rejection/throw and runBridge resolves with fail_open.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `runBridge` installs handlers on the child and output streams but calls `child.stdin?.end(...)` without an stdin error handler at `.opencode/plugins/mk-spec-memory.js:273-329`. An early child exit can emit an unhandled `EPIPE` on the writable stream.
- Fix approach: Handle stdin failure through the same single-settlement fail-open path as spawn, timeout, and close failures.
- Exact change: Refactor `runBridge` to use one idempotent finish helper. Attach `child.stdin.on('error', ...)` before calling `end`; on error, terminate the child if necessary and finish with sanitized `STDIN_ERROR` or `EPIPE`. Wrap `end` for synchronous throws. Ensure timers are cleared exactly once.
- Acceptance: A bridge child that exits before consuming stdin produces no uncaught exception or unhandled error event and resolves the lookup as `fail_open` with a stable error code.
- Side effects / parity: OpenCode only. Keep the plugin silent; expose the code through `mk_spec_memory_status` rather than process output.
- Test: Add a plugin subprocess fixture that exits immediately without reading stdin and run it under an `uncaughtException`/`unhandledRejection` trap; assert clean fail-open settlement.

---

### O2 [P2 · Opus-new] runBridge accumulates bridge stdout with no size cap (parity gap vs Claude spawnSync maxBuffer)
`.opencode/plugins/mk-spec-memory.js:296-298` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. mk-spec-memory.js:296-298 — child.stdout?.on('data', chunk => { stdout += String(chunk); }) accumulates without bound until close/timeout. A runaway bridge can grow stdout unboundedly; the Claude spawnSync equivalents cap via maxBuffer:1024*1024 (session-stop.ts:166), and the CLI fallback caps via MAX_STDIO_BYTES (spec-memory-cli-fallback.ts:19,193-198). The OpenCode bridge has no cap.
- Fix approach: Cap accumulated stdout at a byte ceiling; on overflow, kill the child and resolve fail_open with an OVERFLOW code, matching Claude's maxBuffer semantics.
- Exact change: Add a MAX_BRIDGE_STDOUT_BYTES constant (1024*1024). In the 'data' handler, append via a capOutput-style guard; when the cap is exceeded, set an overflow flag, child.kill('SIGKILL'), and settle fail_open with state.lastErrorCode='OVERFLOW'. Reuse the capOutput pattern from spec-memory-cli-fallback.ts:193-198.
- Acceptance: A bridge emitting >1MB is terminated and runBridge resolves fail_open/OVERFLOW without unbounded memory growth; normal small responses parse unchanged.
- Side effects / parity: mk-spec-memory.js; mk_spec_memory_status will surface last_error_code=OVERFLOW. Parity: matches Claude maxBuffer / MAX_STDIO_BYTES ceilings.
- Test: Unit: stub child.stdout emitting >cap bytes; assert child killed, fail_open + OVERFLOW returned; small output path unaffected.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed at the plugin trust boundary. `.opencode/plugins/mk-spec-memory.js:282,295-298` concatenates stdout without a byte ceiling. The default bridge currently caps its own child output at `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:13,121-124,348-353`, but the parent plugin still trusts the bridge process or configured node binary indefinitely.
- Fix approach: Enforce the same independent 1 MiB ceiling at the parent process boundary and fail closed for that lookup when exceeded.
- Exact change: Add `MAX_BRIDGE_STDOUT_BYTES`, track accumulated bytes using `Buffer.byteLength` or raw buffers, and stop appending at the cap. On the first overflow, mark the request overflowed, terminate the child, and settle through the common finish helper with `STDOUT_OVERFLOW`; never attempt to parse truncated JSON.
- Acceptance: A child emitting more than the limit cannot grow plugin memory beyond the configured ceiling and yields a stable fail-open overflow status. Output exactly at or below the limit still parses normally.
- Side effects / parity: Keep the limit aligned with the Claude `spawnSync.maxBuffer` and bridge `MAX_STDIO_BYTES` values. No TUI output is permitted.
- Test: Add boundary tests in `.opencode/plugins/tests/mk-spec-memory.test.cjs` for limit-minus-one, exact-limit, and limit-plus-one byte outputs, including multibyte chunks.

---

### O3 [P2 · Opus-new] PreCompact performs unbounded synchronous authored-snapshot disk writes before any cache is persisted
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:401-415` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: Confirmed. compact-inject.ts:401-415 — refreshAuthoredContinuitySnapshot performs authored-doc writes / memory-record creation / index mutations (per its own logging) with no time bound, and runs BEFORE buildMergedContext and before the pendingCompactPrime cache write. It is try/caught but not deadline-guarded; if it hangs it consumes the 3s PreCompact budget and the critical cache never persists. (It is flag-gated via authoredSnapshotEnabled, so only fires when enabled.)
- Fix approach: Persist the compact cache first (critical path), then run the snapshot best-effort under a remaining-budget deadline; the cache does not depend on the snapshot.
- Exact change: Reorder main(): build+persist the pendingCompactPrime cache first, then run refreshAuthoredContinuitySnapshot wrapped in withTimeout(..., remainingBudget, null) inside its existing try/catch. Since buildMergedContext derives from the transcript (not from the snapshot), reordering does not change cache content. Coordinate with F5's overall deadline so the snapshot only gets leftover budget.
- Acceptance: With the snapshot stubbed to hang, the pendingCompactPrime cache is still persisted before the hook timeout; with a fast snapshot, both the cache and the snapshot complete and behavior matches today (minus ordering).
- Side effects / parity: compact-inject.ts; snapshot output (docsUpdated/index mutations) still occurs when budget allows. Verify no consumer requires the snapshot to run before caching (it doesn't — cache reads transcript only). Parity: Claude-only.
- Test: Unit: slow-snapshot stub → assert cache persisted first and function returns within budget; fast-snapshot → both run.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed when authored snapshots are enabled. PreCompact invokes `refreshAuthoredContinuitySnapshot` before any compact cache write at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:401-415`. The helper performs synchronous reads and direct writes at `lib/continuity/authored-continuity-snapshot.ts:195-218`, so it cannot honor the hook deadline and can prevent cache persistence.
- Fix approach: Make compact-cache persistence the critical path and isolate optional authored mutations behind a bounded process with atomic writes.
- Exact change: Persist the baseline and, when available, enriched compact cache before snapshot refresh. Run enabled snapshot work in a dedicated child/worker with only the remaining deadline and terminate it on timeout. Change authored markdown writes to temporary-file-plus-rename so termination cannot leave partial files. Skip the optional snapshot when the remaining budget is below a fixed safety threshold.
- Acceptance: A slow or killed snapshot worker cannot prevent a valid compact cache or leave partially written markdown. Disabled snapshots create no worker, and successful enabled snapshots retain existing authored output.
- Side effects / parity: Coordinate with F5. Update `authored-continuity-snapshot.ts`, its worker entrypoint, PreCompact wiring, and authored-snapshot tests. OpenCode has no equivalent authored snapshot lifecycle.
- Test: Add tests for a blocked snapshot worker, timeout termination, cache-before-snapshot ordering, atomic-write failure, and successful opt-in snapshot output.

---

### O4 [refinement · Opus-new] UserPromptSubmit shim has no top-level try/catch; a stdin-read throw drops the safe '{}' default
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-31` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. user-prompt-submit.ts:8-31 — readFileSync(0) and spawnSync execute at module top level with no try/catch. A stdin read error (EAGAIN on a non-blocking pipe, or a closed fd) throws before the output='{}' fallback (22) and before the final process.stdout.write (31), so the hook emits nothing and exits non-zero — the safe default is dropped.
- Fix approach: Wrap the read+spawn+emit in try/catch and always emit exactly one '{}\n' on any failure.
- Exact change: Enclose the readFileSync(0) + spawnSync + output-selection logic in try/catch; in catch, set output='{}' and continue. Ensure process.stdout.write(`${output}\n`) and process.exit(0) run in a finally (or after the catch) so a safe JSON line is always emitted. Combine with F8 (timeout/maxBuffer/input cap) in the same rewrite.
- Acceptance: Simulated readFileSync(0) throw → shim still writes '{}\n' and exits 0; normal path unchanged.
- Side effects / parity: user-prompt-submit.ts; must rebuild dist (F10) since settings.json runs the .js. Parity: with the system-skill-advisor advisor hook shim (same shape), not spec-memory.
- Test: Unit: monkeypatch readFileSync to throw → assert stdout is '{}\n' and exit 0; spawn error path likewise.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `readFileSync(0)` and `spawnSync` execute at module top level at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-18`, outside any catch. A synchronous stdin or spawn exception occurs before the `{}` fallback initialized at lines 20-31 can be emitted.
- Fix approach: Establish the safe output before performing I/O and put the entire shim body behind one top-level error boundary.
- Exact change: Refactor to `main(): string`, initialize output to `{}`, wrap bounded stdin read, spawn, stderr classification, and JSON validation in `try/catch/finally`, and perform one final `process.stdout.write` outside that work. The CLI entrypoint catches any escaped error and still writes `{}\n`; set a zero exit code.
- Acceptance: Injected stdin-read and synchronous spawn exceptions both produce exactly `{}\n`, no stack trace or partial JSON on stdout, and exit zero.
- Side effects / parity: Implement together with F8 so there is one error path rather than nested fallbacks. Claude only.
- Test: Extend `tests/user-prompt-submit-shim.vitest.ts` to force `readSync` and `spawnSync` throws and assert exact stdout, bounded stderr, and exit code zero.

---

### O5 [refinement · Opus-new] Stop hook re-runs autosave against pre-existing state when no patch was produced
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:564-571` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. session-stop.ts:547-573 — when Object.keys(patch).length===0 (no new transcript messages, no last_assistant_message, no retarget), autosaveState falls back to stateBeforeStop (548) and, since stateWriteFailed is false and autosaveState is non-null, runContextAutosave runs (571). If stateBeforeStop still carries lastSpecFolder+sessionSummary from a prior turn, the same stale summary is re-saved on an empty stop.
- Fix approach: Gate autosave on a fresh save produced THIS run (a newly extracted summary), not merely on the presence of any prior state.
- Exact change: Compute a freshness flag, e.g. const hasFreshSummary = Boolean(patch.sessionSummary). In the autosaveMode==='enabled' block, only call runContextAutosave when hasFreshSummary (still requiring autosaveState with a specFolder); otherwise set autosaveOutcome='skipped'. (Optionally also allow patch.lastSpecFolder retarget as a trigger, but re-saving a stale summary on a bare retarget is dubious — prefer summary-only gating.) Leave the stateWriteFailed→'failed' branch intact.
- Acceptance: An empty stop (no new messages, no last_assistant_message) with pre-existing lastSpecFolder+summary yields autosaveOutcome='skipped' and no generate-context.js spawn; a stop that extracts a fresh summary still autosaves.
- Side effects / parity: session-stop.ts; interacts with F2 (fallback) — the fallback is only reached from runContextAutosave, which now runs only on fresh saves. Parity: OpenCode has no autosave.
- Test: Unit: prior state with summary, empty patch → assert runContextAutosave NOT called; patch.sessionSummary set → assert it IS called.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. When `patch` is empty, `autosaveState` remains `stateBeforeStop` at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:547-562`, and the enabled branch invokes autosave solely because that old state exists at lines 564-572. Old `lastSpecFolder` and `sessionSummary` can therefore be saved again without a fresh turn.
- Fix approach: Require fresh summary material from this Stop invocation, not merely any state mutation or prior summary.
- Exact change: Compute `hasFreshAutosaveSummary` after transcript and summary processing. Set it only when `patch.sessionSummary` exists and either transcript parsing found new messages or the extracted summary text differs from the prior summary. Gate `runContextAutosave` on that flag in addition to a successful state write and complete autosave state. Retarget-only and metrics-only patches must not autosave an old summary.
- Acceptance: A Stop event with no new transcript rows and no new assistant summary returns `skipped` and does not spawn the autosave script. A retarget-only event also skips. A genuinely new or changed summary still autosaves once.
- Side effects / parity: Claude Stop only. This should be implemented alongside F2 so outcomes remain truthful. OpenCode has no Stop autosave.
- Test: Add `tests/hook-session-stop.vitest.ts` cases for empty patch with prior state, metrics-only patch, retarget-only patch, unchanged repeated summary, and fresh summary; assert spawn counts and outcomes.

---

### O6 [refinement · Opus-new] OpenCode invalidates continuity cache on every message/session event, largely defeating the 5s TTL cache
`.opencode/plugins/mk-spec-memory.js:427-430` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: Confirmed. mk-spec-memory.js:427-430 — the event handler invalidates the continuity cache on any eventType starting 'message.' or 'session.', which fires on essentially every message update, so DEFAULT_CACHE_TTL_MS=5000 rarely survives between prompts; nearly every transform triggers a fresh bridge call, negating the cache.
- Fix approach: Invalidate only on genuine session-boundary/state-changing events and rely on the 5s TTL (plus the F11 generation guard) for intra-session freshness.
- Exact change: Remove the broad `message.*`/`session.*` catch-all (427-430). Keep session.deleted (423-426) and disposal (431-433) as invalidators. If a specific state-changing event exists (e.g. session.compacted or a memory-save signal), invalidate on that only. Continuity is sourced from on-disk spec docs/saved memory, which message updates do not change, so TTL-bounded staleness (≤5s) is acceptable. Pair with F11's generation counter so any needed invalidation is race-safe.
- Acceptance: Two prompts within 5s in the same session produce one bridge call (second is a cache hit); after a genuine boundary event (session.deleted/disposed) the cache is cleared; cache_hit_rate in mk_spec_memory_status rises materially in a multi-prompt session.
- Side effects / parity: mk-spec-memory.js; must confirm no correctness reliance on per-message invalidation (TTL covers it). Combine with F11. Parity: Claude hooks re-read state per invocation, no equivalent cache.
- Test: Unit: emit message.updated between two getContinuity calls → assert the second is a cache hit (bridgeInvocations unchanged); emit session.deleted → assert cache cleared.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. `.opencode/plugins/mk-spec-memory.js:427-430` invalidates on every `message.*` and nearly every `session.*` event, so a message update between transforms clears entries that otherwise remain valid for the five-second TTL configured at lines 28 and 80-83.
- Fix approach: Invalidate only on real continuity boundaries or before known continuity mutations, while relying on the short TTL for ordinary message churn.
- Exact change: Remove blanket `message.*` and `session.*` invalidation. Retain session deletion and global disposal handling, explicitly handle any documented reset/compaction boundary events, and add `tool.execute.before` invalidation for write-capable Spec Memory tools such as save, update, delete, retention, and index mutations. Apply F11 generations to every retained invalidation path.
- Acceptance: Multiple transforms separated by ordinary message-update events within the TTL invoke the bridge once. TTL expiry, session deletion, and a continuity-mutating tool cause a fresh lookup.
- Side effects / parity: OpenCode only. The mutation-tool allowlist must track the actual mk-spec-memory mutation surface and should fail toward invalidation for newly introduced write tools. Claude hooks use process-local lifecycles instead.
- Test: Add plugin tests that emit `message.updated`, `session.updated`, `session.deleted`, and representative memory mutation tool events between transforms; assert bridge invocation and generation counts.

---

### O7 [refinement · Opus-new] appendContinuityBrief dedupe compares a clamped brief with includes(), so a prior full brief can be re-injected
`.opencode/plugins/mk-spec-memory.js:411-413` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: med
- Root cause: Confirmed. mk-spec-memory.js:411-413 — brief = clampBrief(result.brief, maxBriefChars) may truncate with '...'; the dedupe check output.system.some(entry => entry.includes(brief)) compares the clamped string via substring. If an earlier entry holds a differently-clamped or un-clamped brief (e.g. bridge returned slightly different text, or a prior push used a different clamp), includes() fails and the brief is re-injected as a duplicate.
- Fix approach: Dedupe on a stable marker/hash of the un-clamped brief rather than substring-matching the clamped text.
- Exact change: Compute a stable key from the un-clamped result.brief (e.g. createHash('sha256').update(result.brief).digest('hex').slice(0,16)). Append a compact marker token to the injected entry AFTER clamping (e.g. `\n<!-- mk-spec-memory:continuity:${hash} -->`) so clamping cannot strip it, and dedupe via output.system.some(e => typeof e==='string' && e.includes(`mk-spec-memory:continuity:${hash}`)). Alternative: track injected hashes on state keyed by session and skip when present (reset on invalidate). Prefer the marker for cross-array robustness.
- Acceptance: Injecting the same continuity twice (including when the brief text varies slightly but hashes match, or when a prior entry was clamped differently) results in a single entry; distinct briefs still inject separately.
- Side effects / parity: mk-spec-memory.js; the marker adds a short comment line to the system prompt (harmless). Parity: Claude injects continuity via distinct titled sections, not this per-transform array, so no parity change.
- Test: Unit: call appendContinuityBrief twice with the same brief but different clamp widths / minor text jitter → assert output.system length is 1; different briefs → length 2.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `appendContinuityBrief` clamps before deduplication and compares the resulting text with `includes` at `.opencode/plugins/mk-spec-memory.js:404-413`. A full prior brief does not contain a truncated variant ending in `...`, and different clamp settings produce unstable identities.
- Fix approach: Give every injected brief a stable marker derived from the complete, unclamped payload and deduplicate by that marker.
- Exact change: Hash the full normalized `result.brief`, render a short `[mk-spec-memory:<digest>]` marker, reserve marker space within `maxBriefChars`, and clamp only the human-readable content. Search existing system strings for the exact marker rather than the clamped text. Enforce a minimum configured size sufficient for the marker or emit a marker-only bounded entry.
- Acceptance: A previously injected marked brief is not re-added when clamp length changes or when an existing entry contains the full text. A genuinely changed full brief receives a different marker and is injected.
- Side effects / parity: OpenCode system context gains a short stable provenance marker. Claude recovered payloads already carry explicit source/provenance wrappers and do not need this marker.
- Test: Add tests with full, shorter-clamped, longer-clamped, identical, and one-character-changed briefs; assert exact marker-based deduplication and total character limits.

---

