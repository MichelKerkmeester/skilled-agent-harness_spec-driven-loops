# Fix Design - mk-code-graph (reconciled)

> Two independent, code-verified fix designs per finding: **GPT-5.6-Sol (high)** and **Opus 4.8 (high)**, each re-read the real code. **AGREE** = both designed a fix (high confidence). **DISPUTED** = one model judges the finding a non-issue - your call before implementing.

## Summary

13 findings - 12 both-agree, 1 disputed.

## Cross-model notes

- **GPT-5.6-Sol:** Recommended implementation order: F1 and F7 first to restore and harden the loader contract; F2, O3, and F8 next for the bridge process/response contract; F6 before O2 and O5 so cache timing is correct before concurrency and invalidation are changed; O1 and O4 as independent host-shape guards; F4 last among source edits, followed by the F3-required system-spec-kit build and freshness verification. F3 is the only current non-issue: the reviewed package dist is fresh and using compiled JavaScript is intentional. O5 does not justify raising TTL after F6; its real defect is overbroad event invalidation. F2 and O2 require race-aware tests because a superficially correct kill or in-flight map can still hang or repopulate invalidated state.
- **Opus 4.8:** Cross-finding: (1) F6 + O5 + O2 all live on the loadTransportPlan/transportCache hot path and should ship together — F6 fixes the already-expired-insert timestamp, O5 stops over-invalidation and raises TTL, O2 adds single-flight; individually each is a partial fix. (2) O3 + F8 share the same edit: giving the parsed-but-unused `--minimal` flag meaning (gate the raw codeGraphStatus payload) simultaneously fixes the 1MB maxBuffer risk and F8's dead flag; specFolder forwarding is genuinely dead (code-index.cjs has no scope arg) so remove it, but keep specFolder for plugin-side cache scoping. (3) F7 (parse-side block validation) + O1 (messages.transform output guard) + O4 (entry typeof guard) are layered defense against malformed transport/output — do all three; F7 is the primary fix, O1/O4 are cheap belt-and-suspenders. (4) F2 is pure parity: the Claude fallback (code-index-cli-fallback.ts) already implements detached spawn + process-group kill + exit-grace-settle; port that exact pattern to the bridge. (5) F4 is the inverse parity gap: OpenCode refreshes code-graph status every transform, Claude only at startup/resume — extend the warm helper to user-prompt-submit + compact-inject. (6) NON-ISSUE nuance on F3: the specific compiled session-prime.js is currently FRESH (dist Jul 10 > src Jun 9 and contains the newest symbol); the staleness is package-level (@spec-kit/mcp-server), so F3 is a build-hygiene/gate fix, not a code defect in this hook — a full rebuild + enforced freshness gate is the correct remedy, and settings.json should keep running dist (not raw .ts).

## Per-finding fix designs

### F2 [P1 (GPT P1 / Opus P2)] Bridge timeout can leave its promise unresolved when descendants retain stdio
`.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:403` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: CONFIRMED. mk-code-graph-bridge.mjs runCli spawns the CLI shim without `detached` (line 344), and on timeout only `child.kill('SIGTERM')` then SIGKILLs the same direct child (lines 403-409). The shim runs the real dist CLI as a grandchild (spawnSync), so the grandchild can inherit the stdout/stderr pipe fds. Completion is wired only to `child.on('error')` (419) and `child.on('close')` (420); 'close' fires only after ALL pipe holders close, so a surviving grandchild keeps the promise unsettled. (The plugin's own execFile timeout at mk-code-graph.js:277 masks it there, but the bridge promise itself can hang.)
- Fix approach: Mirror the already-correct Claude fallback in code-index-cli-fallback.ts (runWarmCodeIndexCliTool, lines 209-296): spawn detached, kill the whole process group on timeout, and settle on 'exit' after a short grace in addition to 'close'.
- Exact change: In runCli's spawn options (mk-code-graph-bridge.mjs:344-352) add `detached: true`. Replace the timeout body (403-409) with a `killProcessGroup()` helper that does `process.kill(-child.pid, 'SIGKILL')` inside try/catch (ignore ESRCH). Add a `child.on('exit', code => setTimeout(() => finish(code, null), EXIT_SETTLE_GRACE_MS).unref?.())` listener alongside the existing 'close' listener, reusing a module const grace (~25ms). Keep `finish`'s `settled` guard so whichever event wins settles once.
- Acceptance: Simulate a shim that exits while a child holds stdout open (e.g. spawn a grandchild inheriting fd 1 then have the shim process.exit): the bridge promise resolves within timeout+grace instead of hanging; on normal fast success 'close' still wins and behavior is unchanged.
- Side effects / parity: Bridge-only (OpenCode surface). This brings the bridge to PARITY with the Claude fallback which already implements detached + group-kill + exit-grace; no Claude-side change needed. Confirm `process.kill(-pid)` is guarded — negative-pid kill throws EPERM/ESRCH if the group is gone.
- Test: Add a bridge unit test spawning a fake node script that forks a detached grandchild retaining stdio then exits 0; assert runCli settles (status resolves) under the timeout budget and does not hang. Mirror the existing Claude-fallback timeout test if one exists.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: runCli spawns the CLI shim with piped stdio but without a separate process group at .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:343-352. On timeout it signals only child at :403-408, while settlement depends on error or close at :419-420. A descendant retaining either pipe prevents close after the shim exits.
- Fix approach: Give the CLI subprocess tree a bounded lifecycle independent of pipe closure. Use a detached POSIX process group, kill the group on timeout, listen for both exit and close, and add an unconditional post-timeout settlement watchdog. Keep a direct-child fallback for platforms where negative-PID group signaling is unavailable.
- Exact change: In runCli, spawn detached on non-Windows platforms; add a helper that kills -child.pid and falls back to child.kill; register exit as well as close; after exit, allow a short drain grace and then kill any surviving group before finish; after the main timeout, kill the group and invoke finish after a fixed grace even if neither exit nor close fires. Clear all lifecycle timers in finish. In .opencode/plugins/mk-code-graph.js:268-279, make the outer execFile timeout slightly larger than the bridge's inner timeout plus shutdown grace so it does not kill the bridge before the bridge emits its bounded timeout response.
- Acceptance: A timed-out bridge call settles within the configured timeout plus the documented grace, returns a timeout/fail-open response, and leaves neither the shim nor a descendant holding stdio alive. Normal successful and nonzero-exit calls retain their current responses.
- Side effects / parity: Apply the same unconditional timeout-settlement and platform fallback to the Claude-side runner in .opencode/skills/system-spec-kit/mcp_server/hooks/code-index-cli-fallback.ts:209-295. It already has detached groups and exit handling, but currently still relies on a process event after kill. Keep both runners behaviorally aligned.
- Test: Add a bridge lifecycle test using a mocked child that emits exit while never emitting close and another that emits neither event after kill. Assert bounded settlement, process-group kill, direct-child fallback, one resolution only, and no leaked timers. Add the equivalent hard-deadline case to the Claude fallback tests.

---

### F3 [P1 (GPT P1 / Opus refinement)] Claude runs a stale compiled hook instead of the reviewed source
`.claude/settings.json:56` — **Status: DISPUTED (GPT calls non-issue)**

**Opus 4.8** — risk: low · confidence: med
- Root cause: PARTIALLY CONFIRMED / operational. .claude/settings.json:56 invokes the compiled `dist/hooks/claude/session-prime.js` (verified). However the specific compiled artifact is NOT stale on disk: dist/…/session-prime.js (Jul 10) is newer than the .ts source (Jun 9) and already contains `maybeAppendCodeIndexCliWarmFallback`. The staleness the audit saw is package-level: the dist-freshness guard flags `@spec-kit/mcp-server` stale because SOME other source in the package changed after the last full build, not this hook. So the risk is real (Claude can run stale compiled hooks when other package sources change) but this file is currently fresh.
- Fix approach: This is a build/process fix, not a source edit. Rebuild the spec-kit MCP server so dist matches source, and keep the dist-freshness check as a blocking gate. No behavioral code change to design.
- Exact change: Run the package build (tsc for system-spec-kit mcp_server) to clear the `@spec-kit/mcp-server` stale flag. Keep/enforce the existing dist-freshness guard as a pre-commit or CI blocker triggered whenever any hook source under mcp_server/hooks/** changes, so settings.json's `dist/*.js` entry can never point at a stale build.
- Acceptance: The dist-freshness guard reports `@spec-kit/mcp-server` fresh; a diff of dist vs a clean rebuild is empty; SessionStart runs the rebuilt hook.
- Side effects / parity: Package-wide — the rebuild touches all compiled dist files in mcp_server, not just session-prime. Every hook wired in .claude/settings.json (user-prompt-submit, compact-inject, session-stop) runs from the same dist; verify all recompile cleanly. Do NOT switch settings.json to run the .ts directly (loses the ABI/build boundary and startup speed).
- Test: CI/pre-commit assertion: `dist` hashes equal a fresh `tsc` output; freshness guard exits non-zero on drift. No runtime unit test.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: non-issue in the current tree: .claude/settings.json:50-57 intentionally executes the compiled JavaScript entrypoint because Node does not directly execute the TypeScript hook. The package declares the source-to-dist build at .opencode/skills/system-spec-kit/mcp_server/package.json:2,20, and the authoritative freshness check currently reports @spec-kit/mcp-server status=fresh. The stale state observed by the audit was generated-artifact state at that time, not a defect caused by selecting dist.
- Fix approach: Do not point Claude at the TypeScript source and do not add runtime transpilation. Preserve the compiled entrypoint, rebuild after any hook-source change, and treat package freshness as a release/verification gate.
- Exact change: No product-code change for this finding. After implementing F4 or any other system-spec-kit hook change, run the package build so dist/hooks/claude/session-prime.js and related hook artifacts match source. Keep .claude/settings.json targeting dist.
- Acceptance: node .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs check --package system-spec-kit/mcp_server --json reports status=fresh, and a SessionStart fixture executes the compiled hook successfully.
- Side effects / parity: F4 changes source files in this package, so F3 becomes an ordering gate: implement F4 first, then run cd .opencode/skills/system-spec-kit/mcp_server && npm run build and verify freshness. Do not hand-edit dist.
- Test: Keep or add a static wiring test that every Claude command target exists, belongs to a registered dist package, and is fresh after the build. Add a SessionStart smoke test against the compiled artifact rather than substituting the TypeScript source.

---

### F4 [P1 (GPT P1 / Opus P2)] Claude never refreshes code-graph status after startup or resume
`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:361` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: CONFIRMED. session-prime.ts:361 gates the warm code-index refresh to `source === 'startup' || 'resume'` AND skips when a Structural Context section already exists. `buildWarmCodeGraphStatusSection` (code-index-cli-fallback.ts:379) is imported ONLY by session-prime.ts (verified via grep). user-prompt-submit.ts has zero code-graph/structural references; compact-inject.ts references code_graph only in a regex/merge input, not a status refresh. So after SessionStart, Claude never re-fetches code-graph status, while OpenCode re-queries every system/messages/compacting transform (mk-code-graph.js:448,484,526, TTL-bounded).
- Fix approach: Reuse the existing bounded warm helper on the per-turn and pre-compaction Claude hooks so Claude reaches rough parity with OpenCode's per-transform refresh, and allow a compact-source status section. Keep the same warm-only, retryable, no-cold-spawn discipline (timeoutMs ≤ 600).
- Exact change: (1) In session-prime.ts loosen the guard at 361 so `source === 'compact'` is also eligible to append a code-graph status section (still skipping when a Structural Context section is present). (2) In user-prompt-submit.ts and compact-inject.ts, import `buildWarmCodeGraphStatusSection` and append its section (warm-only, includeRetryableStatus:false for prompt hooks to avoid noise, small timeout) when no structural context is already present. Debounce via a short cache so every keystroke-level prompt doesn't spawn the probe (respect the daemon warm-only exit=75 skip).
- Acceptance: After startup, submit a prompt post-scan: the code-graph status brief refreshes in UserPromptSubmit output; a PreCompact carries a current status note; warm-probe-cold sessions cleanly skip (no cold spawn) as today.
- Side effects / parity: Claude-only change; OpenCode already refreshes. Watch token budget on UserPromptSubmit (append only a compact brief; renderCodeIndexCliStatusBrief caps at 1600). Ensure the added probe stays warm-only so it never blocks the prompt hook.
- Test: Unit-test user-prompt-submit and compact-inject: mock runWarmCodeIndexCliTool returning ok → assert a code-graph section is appended; returning exit=75 → assert no section / graceful skip; assert no cold spawn attempted.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: maybeAppendCodeIndexCliWarmFallback runs only for startup or resume and skips whenever any Structural Context section exists at .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:331-372. handleStartup commonly creates that section from marker state at :247-257, so marker-derived context suppresses a current status read. The Claude UserPromptSubmit shim only forwards the advisor hook at hooks/claude/user-prompt-submit.ts:11-31, and PreCompact builds its codeGraph input solely from transcript file paths at hooks/claude/compact-inject.ts:230-240. OpenCode, by contrast, requests plans from its system, message, and compaction transforms at .opencode/plugins/mk-code-graph.js:448,484,526.
- Fix approach: Map the three OpenCode refresh points to their Claude equivalents using the existing bounded warm-only helper: SessionStart for startup/resume, UserPromptSubmit for message-time refresh, and PreCompact for compaction. Marker-derived Structural Context must not be treated as proof that current status was fetched.
- Exact change: In session-prime.ts:357-372, retain the startup/resume source restriction but remove hasStructuralContextSection from the skip condition, appending a separately titled current status section even when an outline exists. In user-prompt-submit.ts, invoke buildWarmCodeGraphStatusSection with a strict sub-budget and merge successful content into the parsed advisor hookSpecificOutput.additionalContext without replacing other advisor fields; preserve the current fail-open output on status failure. In compact-inject.ts, start one bounded warm status read per invocation and add its rendered brief to the codeGraph input used by both merged text and payload-contract generation; do not issue duplicate reads from those two builders.
- Acceptance: Startup and resume output contain both any recovered structural outline and a separately identified current code-graph status. Subsequent UserPromptSubmit output refreshes the status without corrupting advisor JSON. PreCompact caches a current status brief when the warm daemon is available. Cold-daemon and timeout cases remain bounded and fail open without a cold spawn.
- Side effects / parity: Update .claude/settings.json only if hook registration or timeout allocation must change; otherwise preserve its existing commands. Rebuild @spec-kit/mcp-server dist after source changes. OpenCode already has the corresponding system/message/compaction refresh surfaces, so no OpenCode behavior change is needed for parity.
- Test: Update hook-session-start tests to prove an existing Structural Context section no longer suppresses current status. Add UserPromptSubmit composition tests for successful, unavailable, malformed-advisor, and timeout cases. Add a compact-inject test asserting one warm-only status call and status presence in cached merged context and its payload contract.

---

### F1 [P2 (GPT P2 / Opus refinement)] Named parser export can cause OpenCode to drop the entire plugin
`.opencode/plugins/mk-code-graph.js:176` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. mk-code-graph.js:176 does `export function parseTransportPlan`. OpenCode's legacy loader treats every exported function in a plugin module as a plugin entrypoint. The `return {}` for non-string input (177-180) makes the stray invocation harmless-ish but does NOT restore the required default-export-only module shape, and any loader that awaits/introspects the named export can still perturb plugin registration.
- Fix approach: Make the plugin module export ONLY its default factory. Move parseTransportPlan (and diagnoseTransportPlanFailure, which is module-local anyway) into a separate non-plugin helper module that both the plugin and tests import.
- Exact change: Create a sibling helper (e.g. plugin_bridges/mk-code-graph-transport.mjs or a local `./lib/parse-transport-plan.mjs`) exporting parseTransportPlan + diagnoseTransportPlanFailure. In mk-code-graph.js, import them and DELETE the `export` keyword on parseTransportPlan; also remove the now-unnecessary non-string `return {}` guard (177-180) since the loader will no longer call it — keep a defensive `typeof !== 'string'` returning null if you want, but it is no longer a loader shim.
- Acceptance: The plugin module's only export is the default factory; existing tests importing parseTransportPlan now import it from the helper module and still pass; OpenCode loads the plugin with a single entrypoint.
- Side effects / parity: Update any test file currently importing `parseTransportPlan` from the plugin to import from the new helper. OpenCode-only (no Claude parity). Add a loader-contract test asserting the plugin module exposes exactly one function export (the default).
- Test: Add a module-shape test: `import * as mod from './mk-code-graph.js'` and assert `Object.keys(mod)` === ['default'] and typeof default === 'function'. Keep the transport-parse unit tests pointed at the helper module.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: .opencode/plugins/mk-code-graph.js exports parseTransportPlan at :176 in addition to the default plugin factory at :400. The workaround at :177-180 only changes what happens after OpenCode has already treated the named function as another plugin entrypoint. The current test explicitly enshrines both exports at .opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:142-172.
- Fix approach: Restore the plugin-module loader contract by exposing only the default factory. Keep parsing module-local and test it through observable hook behavior rather than exporting a test seam from an auto-loaded plugin.
- Exact change: Remove export from parseTransportPlan, remove the legacy non-string empty-hook branch and its obsolete JSDoc contract, and leave the function private in mk-code-graph.js. Update opencode-plugin.vitest.ts to default-import the plugin only and assert Object.keys(module) equals only default. Replace direct parser assertions with mocked bridge-response hook tests.
- Acceptance: Dynamic import of .opencode/plugins/mk-code-graph.js exposes exactly one key, default, and OpenCode loads the real plugin factory without invoking a parser as a second plugin.
- Side effects / parity: Only OpenCode plugin loading is affected. No Claude hook change is required. Any test importing parseTransportPlan must be rewritten; do not move the helper into another file unless direct parser testing proves necessary.
- Test: Update opencode-plugin.vitest.ts:13,142-172 and the plugin-folder purity test to enforce default-export-only modules. Exercise valid, malformed, and non-string bridge output through system/messages hooks.

---

### F5 [P2] Malformed plugin configuration is silently treated as absent
`.opencode/plugins/mk-code-graph.js:54` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. loadConfig (mk-code-graph.js:49-57) wraps readFile+JSON.parse in a bare `try/catch` returning `{}`. ENOENT (no config — the normal case), EACCES (permission), and SyntaxError (malformed JSON) are indistinguishable and silently swallowed; a typo'd config file behaves exactly like no config, with no signal.
- Fix approach: Silently ignore ONLY ENOENT (expected absence). For any other error, record it into plugin diagnostic state and surface it via mk_code_graph_status, keeping stderr emission debug-gated (TUI-safe).
- Exact change: In loadConfig, catch the error object; if `err.code === 'ENOENT'` return {} silently. Otherwise set a module-level `lastConfigError = stringifyError(err)` (new state var near lastRuntimeError) and still return {} so startup never crashes. In the mk_code_graph_status tool output array (423-437) add a `config_error=${lastConfigError ?? 'none'}` line. Optionally call emitRuntimeDiagnostic (already MK_CODE_GRAPH_DEBUG-gated) with the config error.
- Acceptance: Malformed ~/.config/opencode/plugin/mk-code-graph.json → mk_code_graph_status shows `config_error=<message>`; a genuinely absent file shows `config_error=none`; plugin still loads in all cases.
- Side effects / parity: OpenCode-only (Claude has no equivalent per-plugin config file). No behavior change to the merged options path — a bad config still degrades to defaults, but is now observable.
- Test: Unit test loadConfig with: (a) missing file → {} and no recorded error; (b) invalid JSON → {} and lastConfigError populated; (c) valid JSON → parsed object. Assert status tool renders the config_error line.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: loadConfig catches ENOENT, permission errors, read failures, and JSON parse failures identically and returns an empty object at .opencode/plugins/mk-code-graph.js:49-56. configPromise at :59 retains no outcome metadata, and the status output at :423-437 has no independent configuration diagnostic.
- Fix approach: Treat only ENOENT as an ordinary absent configuration. Retain a sanitized configuration status and error for all other failures, including syntactically valid JSON whose root is not a plain object. Keep diagnostics out of stdout and default stderr.
- Exact change: Change loadConfig to return or record config plus status loaded, absent, or error. Validate that parsed JSON is a non-array object. In the catch path, inspect error.code: ENOENT becomes absent with no error; all other errors store a sanitized code/message. Add config_status and config_error lines to mk_code_graph_status, separate from last_runtime_error so a successful bridge cannot erase a configuration failure. Emit the same sanitized error through emitRuntimeDiagnostic only when MK_CODE_GRAPH_DEBUG is enabled.
- Acceptance: Missing config remains silent and reports absent; valid config reports loaded; malformed JSON, non-object JSON, EACCES, and other read failures report error through mk_code_graph_status while plugin hooks continue with defaults. No output is written to stdout or default stderr.
- Side effects / parity: OpenCode-only configuration behavior. Claude has no equivalent plugin config. Update .opencode/plugins/README.md to document the diagnostic fields if that status format is documented.
- Test: Add isolated-module tests mocking readFile for ENOENT, SyntaxError, EACCES, array/scalar JSON, and a valid object. Assert normalized options, status output, debug-only stderr, and that config errors remain visible after a successful bridge call.

---

### F6 [P2] Successful slow bridge responses are cached already expired
`.opencode/plugins/mk-code-graph.js:318` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. loadTransportPlan captures `now = Date.now()` at line 290 BEFORE awaiting the bridge, then on success sets `expiresAt: now + cacheTtlMs` (318). DEFAULT_CACHE_TTL_MS=5000 while DEFAULT_BRIDGE_TIMEOUT_MS=15000, so any bridge call taking ≥5s is inserted already-expired and every subsequent hook re-spawns the bridge — the cache never serves for slow calls.
- Fix approach: Compute expiresAt from a fresh timestamp taken AFTER the bridge succeeds. Keep the original start time only if you want latency diagnostics.
- Exact change: In loadTransportPlan, after the bridge returns a valid plan (before transportCache.set at 316), capture `const storedAt = Date.now()` and use `expiresAt: storedAt + cacheTtlMs` and `updatedAt: new Date(storedAt).toISOString()`. Leave the read-side check (`cached.expiresAt > now` at 293) using the entry timestamp captured at call start — that's correct for reads. Optionally retain `startedAt = now` for a latency metric in the entry.
- Acceptance: A mocked bridge that resolves after 6s inserts an entry whose expiresAt is ~5s in the FUTURE from insertion; an immediate second call within TTL hits cache (no second bridge spawn).
- Side effects / parity: Interacts with O5 (invalidation churn) — F6 fixes the timestamp, O5 reduces how often the entry is thrown away. Fix both. OpenCode-only. No Claude parity (Claude uses a fixed 30-min compact TTL, unrelated).
- Test: Unit test loadTransportPlan with a fake bridge delayed past TTL; assert the cached entry's expiresAt > insertion time and a follow-up call is served from cache.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: loadTransportPlan captures now before starting the subprocess at .opencode/plugins/mk-code-graph.js:288-303 and uses that timestamp for expiresAt and updatedAt at :316-320. Any successful call lasting at least cacheTtlMs is inserted already expired.
- Fix approach: Start cache freshness when the successful value becomes available, not when retrieval starts.
- Exact change: Retain a startedAt value only if latency diagnostics are needed. Immediately after a valid plan returns, capture completedAt=Date.now() and use completedAt + cacheTtlMs for expiresAt and completedAt for updatedAt. Do not cache failures.
- Acceptance: A bridge call delayed longer than the configured TTL is still reused by an immediate second hook call and expires only after a full TTL measured from successful completion.
- Side effects / parity: OpenCode cache only; the Claude warm helper does not cache transport plans. Implement before evaluating O5 TTL changes because it removes the claimed need for TTL to exceed subprocess latency.
- Test: Use fake timers and a delayed mocked execFile callback: advance beyond TTL before resolving the first call, invoke a second hook immediately, assert one subprocess; then advance a full post-completion TTL and assert a second subprocess.

---

### F7 [P2 (GPT P2 / Opus refinement)] Transport-plan validation permits message blocks that crash the transform
`.opencode/plugins/mk-code-graph.js:193` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. parseTransportPlan (mk-code-graph.js:193) validates only `transportOnly === true` and `Array.isArray(messagesTransform)`. It never validates the block objects. `messagesTransform:[null]` passes, then the messages.transform loop (497-508) calls `hasSyntheticTextPartMarker(anchor.parts, KEY, block.dedupeKey)` and `block.title`/`block.content` on `null`, throwing a TypeError inside the hook. systemTransform and compaction blocks are similarly untrusted where consumed (462, 540).
- Fix approach: Validate each transport block (and its required string fields) during parse, before the plan is cached/returned. Reject the whole plan with a status-tool diagnostic when a required field is missing or a block is malformed. Optionally validate interfaceVersion.
- Exact change: In parseTransportPlan add a `isValidBlock(b)` guard requiring `b && typeof b === 'object' && typeof b.title === 'string' && typeof b.content === 'string' && typeof b.dedupeKey === 'string'`. Require every element of `plan.messagesTransform` to pass isValidBlock; if `plan.systemTransform`/`plan.compaction` are present they must also pass (else return null). On rejection, return null so diagnoseTransportPlanFailure records a reason (add a matching branch there, e.g. 'messagesTransform contained a malformed block'). Keep the existing transportOnly/array checks.
- Acceptance: `messagesTransform:[null]` and `messagesTransform:[{title:1}]` now yield plan=null and a status-tool diagnostic instead of a thrown hook; a well-formed plan still parses. No transform hook throws on adversarial bridge output.
- Side effects / parity: OpenCode-only. Ensure the bridge's own buildTransportPlan (mk-code-graph-bridge.mjs:197-229) always emits valid blocks (it does), so the stricter parse won't reject legitimate output. Coordinate with O1/O4 which harden the consumers as defense-in-depth.
- Test: Unit test parseTransportPlan with: valid plan → parsed; messagesTransform:[null] → null; block missing dedupeKey → null; malformed systemTransform → null. Add a hook test asserting messages.transform no-ops (does not throw) on a plan that somehow contains a bad block.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: parseTransportPlan checks only plan existence, transportOnly, and messagesTransform being an array at .opencode/plugins/mk-code-graph.js:186-196. It does not check interfaceVersion or array elements. messagesTransform:[null] reaches block.dedupeKey at :497-508 and throws. Optional systemTransform and compaction blocks can similarly produce invalid rendered output.
- Fix approach: Validate the complete plugin-consumed transport contract once before returning or caching a plan. Reject the entire plan with a specific diagnostic rather than partially injecting an untrusted shape.
- Exact change: Add a module-local validator returning either a validated plan or a reason. Require interfaceVersion exactly 1.0, transportOnly true, messagesTransform an array, and every transport block to be a non-array object with non-empty hook, title, payloadKind, dedupeKey, and content strings. Require each block's hook to match its destination; validate optional systemTransform and compaction only when present. Reuse the validator reason in diagnoseTransportPlanFailure so mk_code_graph_status identifies the rejected field. Keep unused producer metadata permissive to avoid unnecessary compatibility breakage.
- Acceptance: Null blocks, primitive blocks, missing or blank required strings, wrong hook destinations, and unsupported interface versions cause a no-op with a precise status diagnostic and never throw from a transform. Valid 1.0 plans still inject unchanged.
- Side effects / parity: The bridge producer at .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:197-228 already emits the required shape and needs no semantic change. No Claude parity change is needed because Claude does not consume opencodeTransport.
- Test: Extend opencode-plugin.vitest.ts with table-driven malformed responses covering null entries, missing title/content/dedupeKey, wrong hook, malformed optional blocks, and wrong interfaceVersion. Assert no throw, no injection, one diagnostic, and no cache reuse of the rejected plan.

---

### O1 [P2 · Opus-new] messages.transform hook lacks the output guard its sibling hooks have
`.opencode/plugins/mk-code-graph.js:470` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. experimental.chat.messages.transform (mk-code-graph.js:470) is declared `async (_input, output) =>` with NO default param and immediately calls `output.messages.at(-1)` (475). Its siblings guard: system.transform (442-446) has `output = { system: [] }` + `if (!output || typeof output !== 'object') return;` + array coercion; compacting (520-524) mirrors it. If OpenCode ever invokes messages.transform with undefined output or without a `.messages` array, the hook throws.
- Fix approach: Add the same defensive guard the siblings have before dereferencing output.messages.
- Exact change: At the top of experimental.chat.messages.transform (after the MESSAGES_TRANSFORM_ENABLED check, before line 475), add `if (!output || typeof output !== 'object' || !Array.isArray(output.messages)) return;`. Do not add a default param that fabricates an empty messages array — a missing anchor should no-op, and a fabricated array has no anchor to transform.
- Acceptance: Calling the hook with `output` undefined or `{}` returns without throwing; normal `{messages:[...]}` behavior unchanged.
- Side effects / parity: OpenCode-only. Consistent with F7 (parse-side) and O4 (entry typeof) as layered hardening. No Claude parity (Claude builds its own arrays).
- Test: Unit test the hook with output=undefined, output={}, output={messages:'x'} → all no-op; output with a valid anchor → injects.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: experimental.chat.messages.transform dereferences output.messages at .opencode/plugins/mk-code-graph.js:470-475 without first validating output, unlike the system and compaction hooks at :442-446 and :520-524. Undefined output, a primitive, or a non-array messages field throws before fail-open logic runs.
- Fix approach: Fail open before accessing the message list. Do not coerce an invalid messages field because there is no valid anchor to mutate.
- Exact change: After the feature flag check, return unless output is a non-null object and Array.isArray(output.messages) is true; only then call at(-1). Leave isMessageAnchorLike as the next shape guard.
- Acceptance: Undefined, null, primitive, empty-object, messages:null, and messages:{} outputs return without throwing or spawning the bridge. A valid message array behaves unchanged.
- Side effects / parity: OpenCode-only host-shape defense. Claude hook output contracts are separate.
- Test: Add a table-driven messages-transform test for every invalid output shape plus an empty array, asserting no exception, no bridge call, and no mutation.

---

### O2 [P2 · Opus-new] No in-flight dedup — concurrent hooks spawn duplicate node bridge subprocesses on cold cache
`.opencode/plugins/mk-code-graph.js:288` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: CONFIRMED. loadTransportPlan (288-328) checks only a COMPLETED cache entry (293); there is no in-flight promise map. On a cold or event-invalidated cache (invalidated on every session.*/message.* event, 371-387), the three hooks — system.transform (448), messages.transform (484), compacting (526) — can each call loadTransportPlan near-simultaneously and each spawns a separate `node` bridge subprocess for the same key.
- Fix approach: Single-flight: keep a pending-promise map keyed by cacheKeyForSession; concurrent callers on a cold key await the same in-flight promise; clear it once settled, then serve from the completed cache.
- Exact change: Add a module-level `const inflight = new Map()`. In loadTransportPlan, after the completed-cache check (293) add: `const existing = inflight.get(key); if (existing) return existing;`. Wrap the bridge-fetch body in a promise stored via `inflight.set(key, p)` and `.finally(() => inflight.delete(key))`, returning that promise. Ensure the finally runs on both success and error paths so a failed fetch doesn't wedge the key.
- Acceptance: Firing all three transforms concurrently on a cold key spawns exactly ONE bridge process (assert via a spawn/execFile spy call count === 1); all three receive the same resolved plan.
- Side effects / parity: OpenCode-only. Must interplay with cache invalidation: if an invalidation event lands mid-flight, the in-flight result should still be delivered to its awaiters but may be immediately re-invalidated for the next call — acceptable. Ensure inflight is cleared in the catch branch (325) too.
- Test: Unit test: mock runTransportBridge with a delayed resolve; call loadTransportPlan three times without awaiting between; assert the bridge mock was invoked once and all three resolve to the same plan; assert inflight is empty afterward.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: loadTransportPlan checks only completed transportCache entries at .opencode/plugins/mk-code-graph.js:288-295 and immediately starts a new bridge request at :297-303. Concurrent system, message, or compaction hooks for the same cold key therefore spawn independent subprocesses.
- Fix approach: Deduplicate pending work per cache key while preserving correct invalidation semantics. An invalidation occurring during a request must prevent the old result from repopulating the cache or being reused by a new generation.
- Exact change: Add a transportInFlight map whose entries contain generation and promise, plus a per-key generation counter. After the completed-cache check, return an in-flight promise only when its generation matches the current key generation. Store the new promise before awaiting it; cache its result only if generation is still current; and remove it in finally only if the map still points to that same entry. Cache invalidation increments the key generation and removes the completed entry, so a pre-invalidation promise cannot overwrite newer state.
- Acceptance: Concurrent cold calls for one key execute one bridge process and receive the same result. Different session keys remain independent. Rejection clears the pending entry and allows retry. Invalidation during an in-flight call permits a new request and prevents the old completion from repopulating the current cache.
- Side effects / parity: Coordinate with O5 because its narrower lifecycle invalidation should use the same generation-aware invalidator. Claude hook processes are separate invocations and do not share this module-level cache.
- Test: Add deferred-promise tests for concurrent system/messages/compaction calls, failure then retry, different sessions, and invalidation during flight. Assert subprocess counts, returned plans, final cache generation, and in-flight cleanup.

---

### O3 [P2 · Opus-new] Bridge embeds the full raw code-graph status payload, risking the plugin's 1MB execFile maxBuffer
`.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:369` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. On success the bridge returns `data.codeGraphStatus: payload` — the full raw CLI JSON (mk-code-graph-bridge.mjs:369) — plus the derived `opencodeTransport` (372). The bridge caps its OWN read of the grandchild CLI stdout at MAX_STDIO_BYTES=1MB (capOutput), then RE-serializes payload + transport + envelope, so its stdout to the plugin can exceed 1MB. The plugin runs the bridge via execFile with `maxBuffer: 1024*1024` (mk-code-graph.js:278); overflow triggers ERR_CHILD_PROCESS_STDOUT_MAXBUFFER, the child is killed, execFile rejects, and the plugin no-ops. The plugin only ever reads `data.opencodeTransport` (parseTransportPlan:189) — the raw codeGraphStatus is dead weight.
- Fix approach: Have the bridge omit the raw codeGraphStatus payload from the plugin-facing response when the plugin's `--minimal` flag is set (this also gives F8's minimal flag real meaning). Keep opencodeTransport + brief. This is the smaller, correct fix vs. bumping maxBuffer.
- Exact change: In runCli's success branch (363-383), gate `codeGraphStatus: payload` behind `if (!input.minimal)`. When minimal (the plugin's mode), emit `data: { toolName, ...(opencodeTransport ? { opencodeTransport } : {}) }` and rely on `brief` for human/status use. Requires threading `minimal` from parseArgs into runCli input (see F8 — currently parsed but unused). Optionally also raise the plugin maxBuffer to e.g. 4MB as belt-and-suspenders.
- Acceptance: With --minimal, the bridge's stdout for a large graph stays well under 1MB (contains only opencodeTransport+brief+metadata); the plugin parses the plan successfully instead of hitting maxBuffer; non-minimal invocations still return the full codeGraphStatus for debugging.
- Side effects / parity: Confirm no other consumer of the bridge relies on data.codeGraphStatus in --minimal mode (grep shows the plugin only reads opencodeTransport; the standalone CLI/manual runs omit --minimal and keep the full payload). OpenCode-only. Ties directly to F8.
- Test: Unit test runCli with a large mocked payload and input.minimal=true → response.data has no codeGraphStatus and serialized length < 1MB; input.minimal=false → codeGraphStatus present. Integration: plugin loadTransportPlan succeeds against a large graph.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: after parsing the CLI payload, the bridge places the entire raw payload in data.codeGraphStatus at .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:363-373. The plugin consumes only data.opencodeTransport at .opencode/plugins/mk-code-graph.js:186-196 but must buffer the full duplicated response under the 1 MiB execFile limit at :274-279. Failure responses also return raw payload as data at bridge line 389.
- Fix approach: Keep the raw payload internal to the bridge for brief rendering and return only the bounded plugin transport projection. Do not raise maxBuffer to accommodate data the consumer never uses.
- Exact change: Remove codeGraphStatus from successful response data and omit the raw parsed payload from failure response data. Return only toolName and optional opencodeTransport, with the bounded brief and existing metadata/error fields. Preserve raw payload solely as a local variable used by renderCodeGraphBrief.
- Acceptance: Successful bridge JSON contains no codeGraphStatus field, still yields the same brief and transport plan, and remains small even when the CLI status payload contains large graph-quality details. Failure responses remain diagnostic but bounded.
- Side effects / parity: Audit direct consumers of this plugin-specific bridge; the current plugin reads only opencodeTransport, and the bridge test imports runCli only for policy behavior. The general code-index CLI and Claude fallback must continue returning their own full payloads because they have independent consumers.
- Test: Add a bridge projection test with a large mocked status payload. Assert the rendered brief is correct, codeGraphStatus/raw data is absent, serialized response byte length stays bounded, and failure projection also omits raw payload.

---

### F8 [refinement] Bridge accepts minimal and spec-folder flags but never uses them
`.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:239` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: med
- Root cause: CONFIRMED. parseArgs stores `minimal` (240,252) and `specFolder` (241,257-261); the plugin always passes `--minimal` and optionally `--spec-folder` (mk-code-graph.js:269-272). runCli (300-421) never reads `input.minimal` and never forwards `specFolder` into cliArgs. Verified code-index.cjs has no spec-folder/scope handling — code-graph-status is graph-global, so forwarding specFolder would be a no-op even if wired.
- Fix approach: Give `minimal` a real use (gate the raw codeGraphStatus payload per O3) and REMOVE the dead specFolder forwarding rather than inventing an unsupported scope arg. Keep the plugin's own specFolder usage (cache keying/invalidation) which is legitimate and separate.
- Exact change: (1) minimal: thread `input.minimal` into runCli and use it in the O3 gate. (2) specFolder: drop `--spec-folder` from the plugin's bridge invocation (mk-code-graph.js:270-272) and remove the `--spec-folder` branch + `options.specFolder` from parseArgs (mk-code-graph-bridge.mjs:241,257-261). Do NOT remove specFolder from the plugin's normalizeOptions/cacheKeyForSession — that scopes the cache and is still used. If a future graph gains spec-folder scoping, reintroduce forwarding with an integration assertion proving the query scope narrows.
- Acceptance: Bridge no longer accepts a flag it ignores; `--minimal` demonstrably changes output (O3 test); plugin cache keying by specFolder still works; no functional regression in code-graph-status output.
- Side effects / parity: Plugin still passes specFolder for cache scoping — verify removing `--spec-folder` from the CLI call doesn't drop that. OpenCode-only. Coordinated with O3 (minimal) — implement together.
- Test: Unit: parseArgs no longer recognizes --spec-folder (or explicitly rejects/ignores it); runCli honors input.minimal. Assert plugin still builds distinct cache keys per specFolder.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: parseArgs records minimal and specFolder at .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:239-260, but runCli at :300-341 never reads either value or maps specFolder into input.args. The plugin always sends --minimal and conditionally --spec-folder at .opencode/plugins/mk-code-graph.js:268-272, so its documented scope option has no behavioral effect.
- Fix approach: Remove the false interface rather than pretending code_graph_status supports spec-folder scoping. The bridge already always produces a bounded plugin transport, especially after O3, so minimal is redundant.
- Exact change: Remove minimal and specFolder from bridge defaults and argument parsing. Stop passing --minimal and --spec-folder from the plugin. Remove specFolder from PluginOptions, environment/config normalization, bridge-call parameters, cache keys, invalidation parameters, and status output. Remove the advertised specFolder/MK_CODE_GRAPH_SPEC_FOLDER option from .opencode/plugins/README.md:114-124 and update the bridge invocation documented at plugin_bridges/README.md:98.
- Acceptance: The plugin invokes the bridge with only supported timeout/tool arguments; status no longer claims an auto or explicit spec scope; no accepted configuration value is silently presented as effective; all transport behavior remains workspace-scoped.
- Side effects / parity: This intentionally removes a documented but never functioning plugin option. Claude code-graph status is also workspace-scoped, so removal improves runtime parity. If genuine spec-scoped graph status is later required, it must first be added to the authoritative code-index tool schema and handler rather than implemented only in this bridge.
- Test: Update opencode-plugin.vitest.ts:89-98 to assert obsolete flags are absent. Add bridge argument-parser coverage that obsolete flags are rejected or no longer documented, and a repository search assertion that MK_CODE_GRAPH_SPEC_FOLDER has no remaining plugin/bridge references.

---

### O4 [refinement · Opus-new] Dedup scan assumes string entries in output.system / output.context
`.opencode/plugins/mk-code-graph.js:463` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: CONFIRMED. `output.system.some((entry) => entry.includes(rendered))` (mk-code-graph.js:463) and `output.context.some((entry) => entry.includes(rendered))` (541) call String.prototype.includes on each entry with no typeof guard. Both arrays are only coerced to BE arrays (446, 524), not validated to contain strings; a non-string entry (object/number) injected by another plugin makes `.includes` a wrong method or throws.
- Fix approach: Guard each entry with a typeof check before calling includes, in both the system and context dedup scans.
- Exact change: At line 463 change the predicate to `(entry) => typeof entry === 'string' && entry.includes(rendered)`. Apply the identical change at line 541 for output.context. No other logic change.
- Acceptance: With `output.system = [{}, 'existing text']` the dedup scan does not throw and correctly detects/omits duplicates among the string entries; injection still proceeds when no matching string exists.
- Side effects / parity: OpenCode-only; the Claude session-prime builds sections from constructed strings so it isn't exposed. Pairs with O1/F7 as layered hardening.
- Test: Unit test both transforms with a mixed-type array (object + string) → no throw, correct dedup; all-string array → unchanged behavior.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: system and compaction deduplication call entry.includes directly at .opencode/plugins/mk-code-graph.js:462-464 and :540-542. The hooks normalize only the outer value to an array, not each element, so null, objects, or structured host entries throw.
- Fix approach: Restrict substring deduplication to string entries and ignore other host-owned entry shapes.
- Exact change: Change both some predicates to require typeof entry === 'string' before entry.includes(rendered). Do not stringify or replace non-string entries.
- Acceptance: Mixed arrays containing null, objects, numbers, and strings do not throw; matching string entries still suppress duplicates; non-string entries remain untouched and a new string digest is appended when needed.
- Side effects / parity: OpenCode-only output-shape defense. No Claude equivalent uses these arrays.
- Test: Extend system and compaction output-guard tests with mixed-type arrays, covering both a matching string and no matching string.

---

### O5 [refinement · Opus-new] Cache invalidation frequency asymmetry compounds the F6 slow-cache bug
`.opencode/plugins/mk-code-graph.js:371` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: CONFIRMED. shouldInvalidateEvent (371-374) clears the transport cache on EVERY `session.*` and `message.*` event; the transport plan is just a code-graph readiness digest that changes only on scans, not per message. Combined with TTL=5s (40) and bridge calls up to 15s (41), the cache is invalidated far more often than it can be warmed, so the bridge re-runs almost every transform. This compounds F6 (already-expired inserts).
- Fix approach: Decouple TTL from invalidation semantics: invalidate only on session lifecycle boundaries and genuine graph-mutation signals — NOT on ordinary message.* traffic — and raise TTL above typical bridge latency so warm entries actually serve. Combine with F6's timestamp fix and O2's single-flight.
- Exact change: Narrow shouldInvalidateEvent to session lifecycle events only (e.g. `session.deleted`/`session.idle`/`session.updated`) and drop the blanket `message.*` prefix match; if a code-graph mutation event exists (scan/apply), invalidate on that instead. Raise DEFAULT_CACHE_TTL_MS from 5000 to a value comfortably above bridge latency (e.g. 30000–60000), documenting that the digest tolerates modest staleness. Keep MK_CODE_GRAPH_CACHE_TTL_MS override.
- Acceptance: During a burst of message.* events the bridge is invoked at most once per TTL window (spy call count bounded), not per message; a code-graph scan still forces a refresh; status output reflects freshness within TTL.
- Side effects / parity: Slightly staler digest (bounded by TTL) — acceptable for a hint payload. OpenCode-only; Claude's refresh cadence is governed separately (see F4). Verify no consumer depends on per-message invalidation. Implement WITH F6 and O2 (shared cache hot path).
- Test: Unit test: fire 10 message.* events → cache not cleared; fire a session.deleted → cleared. With TTL=60s and a 6s bridge, a second call within 60s serves from cache.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: shouldInvalidateEvent accepts every session.* and message.* event at .opencode/plugins/mk-code-graph.js:371-374, and invalidation at :376-387 removes the cache on routine message/session updates. This defeats the 5-second cache at :40. The claim that TTL must exceed the 15-second bridge timeout at :41 is not independently valid once F6 starts TTL at completion, but routine-event invalidation remains a real cause of repeated subprocesses.
- Fix approach: Use TTL for ordinary freshness and reserve event invalidation for actual session lifecycle boundaries. Do not arbitrarily increase TTL until latency/freshness requirements are measured.
- Exact change: Restrict invalidating events to exact lifecycle events such as session.created and session.deleted; remove all message.* and session.updated invalidation. Require an extractable session ID before invalidating rather than clearing every workspace entry on an unscoped event. Route lifecycle invalidation through O2's generation-aware invalidator. Keep the default TTL at 5 seconds after applying F6; changing that value should be a separately measured freshness decision.
- Acceptance: message.updated and session.updated do not cause a second bridge call inside the TTL. A scoped session lifecycle event invalidates only that session. An unscoped event does not flush the workspace cache. Entries still refresh after their post-completion TTL.
- Side effects / parity: Update the existing opencode-plugin.vitest.ts:230-254 test, which currently expects session.updated to invalidate. Claude does not use this cache; F4 supplies its corresponding prompt and compaction refresh behavior.
- Test: Replace the session.updated expectation with table-driven routine-event non-invalidation tests, add scoped session.created/deleted invalidation, unscoped-event no-op, TTL expiry, and invalidation-during-flight coverage shared with O2.

---

