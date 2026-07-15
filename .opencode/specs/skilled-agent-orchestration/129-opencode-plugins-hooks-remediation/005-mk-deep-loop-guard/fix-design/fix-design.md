# Fix Design - mk-deep-loop-guard (reconciled)

> Two independent, code-verified fix designs per finding: **GPT-5.6-Sol (high)** and **Opus 4.8 (high)**, each re-read the real code. **AGREE** = both designed a fix (high confidence). **DISPUTED** = one model judges the finding a non-issue - your call before implementing.

## Summary

13 findings - 11 both-agree, 2 disputed.

## Cross-model notes

- **GPT-5.6-Sol:** F2, F5, F8, O1, and O2 share one root boundary: free-form prompt text is being treated as protocol. Fix them together with one versioned dispatch envelope and one canonical parser. F1 supplies the correct many-modes-per-agent registry model. F3 and F6 must precede reliable reject-loop enforcement because fail-closed semantics are unsafe without locked, status-returning persistence. F4 and O4 should use the same maintenance and locking layer. F7 should then add thin OpenCode and Claude adapters over that shared policy; OpenCode remains default-export-only and log-only, while Claude uses structured hook JSON. O3 is not a demonstrated input-shape defect under the installed SDK and should receive contract tests rather than undocumented field fallbacks. Recommended implementation order: shared parser and registry index; producer envelopes; locked persistence and maintenance; OpenCode adapter; Claude adapter and settings wiring; expanded parity and multi-process tests.
- **Opus 4.8:** Shared root causes: (A) CASE NORMALIZATION — F8, O1, and O3 are one bug class (case-insensitive capture/regex feeding case-sensitive lowercase lookups); fix all by lowercasing at boundaries (identity + declared mode + tool name). (B) SUBSTRING-VS-ENVELOPE — F1, O2, F5 all stem from trusting free-floating substrings instead of parsing the real Deep Route/state envelope and the multiplexed registry; fix them together around one envelope parser + set-based registry map. (C) FAIL-OPEN OBSERVABILITY — F3 is largely a NON-ISSUE: fail-open on missing registry/unwritable state is correct and test-pinned (blast radius of failing closed is unacceptable); the only real defect is silence, fixed by an audit log line. ORDERING: land F1/F2/F3/F5/F8/O1/O2/O3/O4 first with F9 as their red→green guard; then F4 (shared bounded log) since both runtimes write it; then F7 LAST — extract the guard core only after all Check-logic fixes so the Claude hook inherits fixed logic instead of porting bugs. PARITY: F7 introduces the second surface; from then on the executor set (F2), warning-log path+rotation (F4), case normalization (F8/O1/O3), and envelope parsing (F1/O2/F5) must live in ONE shared core consumed by both mk-deep-loop-guard.js and the Claude PreToolUse Task hook. F6 is genuine but low-severity (advisory guard); a mkdir sweep-lock is the cheap correct fix, not a full CAS protocol. F5 and O3 carry residual uncertainty: both should be reconciled against the ACTUAL rendered deep-command marker and a captured real OpenCode payload before tightening — Logic-Sync if evidence contradicts these designs.

## Per-finding fix designs

### F1 [P1] Duplicate agent entries overwrite valid workflow modes
`.opencode/plugins/mk-deep-loop-guard.js:80` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. loadRegistryAgents (mk-deep-loop-guard.js:80-81) does `map.set(mode.agent, mode)` keyed by agent. In mode-registry.json three modes (agent-improvement:117, model-benchmark:143, skill-benchmark:166) all set `agent:'deep-improvement'`, so the Map collapses to only the last entry (skill-benchmark). Check 1 (line 388-391) then treats any Deep Route declaring mode=agent-improvement/model-benchmark against target deep-improvement as a mismatch — a false positive that warns (or rejects under REJECT=1).
- Fix approach: Map each agent to the SET of its permitted workflowModes instead of a single mode object. Mismatch only when a declared mode is absent from that agent's permitted set.
- Exact change: In loadRegistryAgents, build `Map<agent, {workflowModes:Set<string>, sample:mode}>` (or `Map<agent, Set<string>>`) by adding each mode.workflowMode into the agent's set rather than overwriting. In the Check 1 block (line 388-391), replace `declaredMode !== entry.workflowMode` with `!entry.workflowModes.has(declaredMode)`. Update mismatchDetail (line 94-101) to render the allowed-mode set (e.g. `registry modes="agent-improvement|model-benchmark|skill-benchmark"`) instead of a single `registryMode`.
- Acceptance: With a registry where deep-improvement carries ≥2 modes: a Deep Route declaring any one of its real modes produces NO warn/reject; a declared mode not in the set still warns/rejects. Existing single-mode agents (deep-research→research) behave unchanged.
- Side effects / parity: declaredModeFromPrompt output must be lowercased first (see F8/O1) so set membership matches lowercase registry values. F9 fixture must add the multiplexed shape or this fix is untested. No Claude-hook code exists yet (F7); the shared module must adopt the set-based comparison so both runtimes agree.
- Test: Add a fixture registry entry mapping deep-improvement to two workflowModes and assert: target deep-improvement + mode=agent-improvement → no log; + mode=model-benchmark → no log; + mode=nonsense → mismatch log. (Part of F9.)

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: `loadRegistryAgents()` stores a single registry row per agent with `map.set(mode.agent, mode)` at `.opencode/plugins/mk-deep-loop-guard.js:75-85`. The production registry assigns `deep-improvement` to three valid modes at `.opencode/skills/system-deep-loop/mode-registry.json:103-166`, so later rows overwrite earlier ones.
- Fix approach: Index every canonical agent to the complete set of permitted workflow modes, then define mismatch as the declared mode not belonging to that set.
- Exact change: In the shared guard-policy module extracted from the plugin, replace the agent-to-row map with an agent-to-record map containing `workflowModes: Set<string>` and any needed registry metadata. Canonicalize agent and mode keys while loading. Change the mismatch check at the current lines 386-395 to use set membership, and make the diagnostic list the sorted permitted modes instead of one overwritten mode.
- Acceptance: All three production modes `agent-improvement`, `model-benchmark`, and `skill-benchmark` are accepted for `deep-improvement`; an unrelated mode warns or blocks according to the reject setting.
- Side effects / parity: Use the same registry index in the new Claude PreToolUse adapter. Update diagnostics and documentation that currently describe one registry mode per agent.
- Test: Make the fixture reproduce the three production rows sharing `deep-improvement`; table-test all three valid modes in warning and reject configurations, plus one invalid mode that warns and rejects.

---

### F2 [P1 (GPT P1 / Opus P2)] Loop counting does not establish that orchestrate originated the dispatch
`.opencode/plugins/mk-deep-loop-guard.js:399` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: Confirmed on two points. (1) loopRepeatDetail (line 203-210) and Check 2 count purely on targetAgent+sessionID+marker (line 400-402) with no verification that orchestrate originated the dispatch, yet the message asserts "orchestrate has dispatched". OpenCode's tool.execute.before payload does not expose the calling agent, so the origin claim is unverifiable. (2) prompt-improver is in LOOP_EXECUTOR_AGENTS (line 60) but is NOT a deep-loop executor — it has no registry entry and no iteration loop, so repeated legitimate prompt-improver dispatches are false-positive loop-flagged.
- Fix approach: Do not fabricate an origin check the runtime can't support. Instead: (a) remove prompt-improver from the executor set; (b) reword the detail message so it states the observed fact (N non-command-driven hand-offs to a command-owned executor in this session) rather than asserting an unverified orchestrate origin.
- Exact change: In LOOP_EXECUTOR_AGENTS (line 60) drop 'prompt-improver', leaving the three registry-backed command-owned executors {deep-research, deep-review, deep-improvement}. In loopRepeatDetail (line 204-209) replace `orchestrate has dispatched "X"` with a neutral phrasing e.g. `"<agent>" received <count> non-command-driven hand-offs this session` and keep the guidance sentence about command ownership. Only IF OpenCode later exposes a durable caller field should an origin gate be added — flag as future work, do not stub it now.
- Acceptance: Repeated prompt-improver Task dispatches no longer produce loop-like warnings. The warning text no longer claims orchestrate as origin. deep-research/deep-review/deep-improvement repeat counting is unchanged.
- Side effects / parity: The Claude-hook counterpart (F7) must use the same executor set and message text. Test fixture uses deep-improvement in the fail-open block (test line 208) — still valid since deep-improvement stays in the set.
- Test: Add: 5 repeated non-command-driven prompt-improver dispatches in one session assert NO loop-like log. Assert the loop-repeat message does NOT contain the literal 'orchestrate'.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: repeat counting is selected only by target, session, and a loose marker at `.opencode/plugins/mk-deep-loop-guard.js:399-409`, while `loopRepeatDetail()` claims orchestrate was the caller at lines 203-209. The installed SDK exposes only `tool`, `sessionID`, and `callID`, not caller-agent identity, at `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-241`. The orchestrate prompt contract defines structured Task and Deep Route fields at `.opencode/agents/orchestrate.md:176-206` but currently has no machine-readable origin field. `prompt-improver` is hardcoded at plugin line 60 despite having no entry in the deep-loop registry.
- Fix approach: Classify origin through an exact producer-owned dispatch envelope rather than inferring it from target or prose. Count only envelopes declaring `origin=orchestrate` and a bounded handoff. Treat an unmarked loop-executor dispatch as unclassifiable: warn without attributing it to orchestrate in default mode and deny it when loop rejection is enabled. Remove `prompt-improver` from this deep-loop policy unless its separate owning command later adopts an explicit registered contract.
- Exact change: Add a versioned single-line dispatch envelope carrying `origin`, `mode`, `targetAgent`, and `execution`. Have the orchestrate producer emit `origin=orchestrate` and `execution=bounded_handoff`; have command-owned iteration producers emit `origin=command`. Replace the current unconditional target-based count with an origin switch. Remove `prompt-improver` from `LOOP_EXECUTOR_AGENTS`; do not silently fold the non-deep `/prompt-improve` workflow into `mode-registry.json`.
- Acceptance: Two unrelated direct calls to the same executor are never reported as orchestrate calls. Two origin-marked orchestrate handoffs in one session warn at the existing threshold, and the third denies when enabled. Unmarked loop-executor calls warn as unclassified or deny in reject mode. Prompt-improver calls are outside this guard.
- Side effects / parity: Update `.opencode/agents/orchestrate.md` and its Claude runtime mirror to emit the envelope. The OpenCode and Claude guard adapters must consume the same parser and policy. Any command producer that dispatches deep-loop agents must emit `origin=command`.
- Test: Add cases for marked orchestrate handoffs, marked command iterations, unmarked direct calls, forged natural-language origin prose, and repeated prompt-improver calls. Assert diagnostics never name orchestrate without the exact orchestrate envelope.

---

### F3 [P1 (GPT P1 / Opus refinement)] Reject modes silently fail open when guard dependencies fail
`.opencode/plugins/mk-deep-loop-guard.js:75` — **Status: DISPUTED (Opus calls non-issue)**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Partially non-issue. The prior 'fail closed when reject enabled' fix would REGRESS two explicitly pinned tests: registry-unreadable + REJECT=1 must-not-throw (test:104-108) and state-dir-is-a-file + REJECT_LOOP=1 must-not-throw (test:201-211). Failing closed on a missing registry or unwritable state dir would block EVERY task dispatch whenever those infra files are absent — an unacceptable blast radius, and it is impossible to reject-on-unknown when the guard cannot read what it needs. The only defensible defect is the word 'silently': a degraded reject-mode run leaves no audit trail.
- Fix approach: Keep fail-open (it is correct and test-pinned). Make it observable, not silent: when a reject env var is active AND a guard dependency failed (registry unreadable, or state write failed), emit one warning-log line recording that reject enforcement was skipped due to the degraded dependency.
- Exact change: (a) Have writeLoopStateAtomic (line 156-171) return a boolean success/failure. (b) In readLoopState/loadRegistryAgents callers, when the applicable reject env is '1' and the dependency returned null/false, call appendWarningLog with a distinct 'reject-mode degraded: <reason>' detail (still never throw). Do NOT convert any fail-open path to throw. recordLoopDispatch (line 183-201) propagates the write-success flag so Check 2 can log the degraded state.
- Acceptance: Registry-unreadable + REJECT=1 still does not throw (test:104-108 green) but now appends a 'reject-mode degraded' log line. State-dir-is-a-file + REJECT_LOOP=1 still does not throw (test:201-211 green) but logs the degraded write. Non-reject runs log nothing extra.
- Side effects / parity: Claude hook (F7) shares the same policy: it must also log-not-throw on dependency failure. No behavior change to happy path. Note in the plugin's 'Hard limits' doc block (line 346-355) that reject enforcement is best-effort and degrades to audit-log when deps fail.
- Test: Assert registry-removed + REJECT=1 leaves a log line matching /reject-mode degraded/ and does not throw; assert normal reject path still throws when deps are healthy.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: registry failures collapse to `null` at `.opencode/plugins/mk-deep-loop-guard.js:75-86` and skip enforcement at lines 385-397. State reads collapse every error to an empty state at lines 146-153, writes return no status and swallow errors at lines 156-170, and `recordLoopDispatch()` returns the in-memory count regardless of persistence at lines 183-200. Tests explicitly require fail-open behavior with rejection enabled at `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs:104-108` and `201-210`.
- Fix approach: Preserve fail-open behavior in default warning mode, but make dependency availability part of the hard-enforcement contract when the corresponding reject variable is enabled.
- Exact change: Return structured results from registry load, state read, lock acquisition, and atomic write. Distinguish an expected missing state file from parse, permission, and I/O failures. For a dispatch carrying the canonical deep-route envelope, deny with a prefixed guard-dependency error when mode rejection is enabled and the registry cannot be loaded. For an origin-marked orchestrate dispatch, deny when loop rejection is enabled and its locked read-modify-write cannot complete. Keep unrelated and command-origin dispatches unaffected. Ensure the outer catch rethrows policy denials and dependency denials but still swallows unexpected failures in warning mode.
- Acceptance: An unreadable or malformed registry blocks only applicable deep-route dispatches under `MK_DEEP_LOOP_GUARD_REJECT=1`. An unwritable, corrupt, or lock-unavailable state store blocks applicable orchestrate handoffs under `MK_DEEP_LOOP_GUARD_REJECT_LOOP=1`. Both failures remain non-blocking in default mode.
- Side effects / parity: The shared policy must expose one dependency-error result consumed identically by OpenCode and Claude adapters. Documentation and fixtures that promise unconditional fail-open behavior must be narrowed to warning mode.
- Test: Replace the current reject-mode fail-open assertions with paired warning-mode allow and reject-mode deny cases for missing registry, malformed registry, corrupt state, unwritable state directory, failed rename, and unavailable lock. Keep a non-deep Task control proving dependency failure does not block unrelated work.

---

### F4 [P1 (GPT P1 / Opus P2)] Warning log can grow without bound and is not rotated by the startup sweep
`.opencode/plugins/mk-deep-loop-guard.js:218` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: Confirmed. pruneStaleWarningLog (line 242-251) only unlinks when mtime is older than the ARCHIVE retention window and is only invoked from inside appendWarningLog (line 220) right before an append — so an actively-appended log is always 'fresh' and never rotates (comment at 238-241 admits this). session.created (line 370) calls only sweepStaleLoopGuardStates, which never touches the log. The log therefore grows unbounded under active use.
- Fix approach: Add size-based rotation independent of mtime, and run log maintenance from the session.created sweep. Rotate a single generation when the file exceeds a byte cap.
- Exact change: Add constant e.g. `WARN_LOG_MAX_BYTES` (e.g. 262144) + env override. In appendWarningLog (before appendFileSync) statSync the log; if size ≥ cap, renameSync it to `${WARN_LOG_FILENAME}.1` (overwriting the prior single generation) so at most 2× cap is retained, then append fresh. Add a maintenance call from sweepStaleLoopGuardStates (or the session.created branch at line 370) that invokes pruneStaleWarningLog AND the size check, so dormancy-prune and size-rotate both run on the throttled sweep, not only on append.
- Acceptance: Appending past the byte cap produces a rotated `.1` file and a fresh primary log; total retained bytes ≤ 2× cap. session.created triggers log maintenance even with zero appends that session. Dormant-log deletion still works.
- Side effects / parity: readGuardLog in tests reads only the primary file; a rotation-boundary test must account for the `.1` generation. Claude hook (F7) writing to the same log must use the identical rotation helper to keep the shared log bounded. Mirror the size cap onto the archive prune path if desired.
- Test: Add: append > cap bytes of warnings, assert `.1` exists and primary is small; call event({session.created}) with a large stale log and assert it is rotated/pruned without any append.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: `appendWarningLog()` performs maintenance only before another append at `.opencode/plugins/mk-deep-loop-guard.js:218-226`; `pruneStaleWarningLog()` deletes only after archive-retention inactivity at lines 238-251. The session-created handler at lines 367-370 sweeps state but never maintains the warning log, so continuous warnings keep the log active and unbounded.
- Fix approach: Bound the active warning log by bytes independently of mtime and run the same maintenance from startup and append paths under a cross-process log lock.
- Exact change: Replace `pruneStaleWarningLog()` with `maintainWarningLog()`. Add `MK_DEEP_LOOP_GUARD_WARNING_LOG_MAX_BYTES` with a 1 MiB default and cap each serialized warning line to a small fixed maximum. Before append, acquire the warning-log lock; if the next line would exceed the cap, atomically rotate the active file to one fixed backup in `.archive`, replacing the prior backup, then append. Invoke maintenance from `session.created` as well. If the lock cannot be acquired in warning mode, skip that log write rather than growing the file unsafely.
- Acceptance: Continuous warning generation keeps the active log below the configured cap plus one capped line and retains at most one capped backup. An oversized log is rotated on session creation even when no new warning occurs. Dormancy pruning still works.
- Side effects / parity: Run equivalent startup maintenance from the Claude SessionStart hook. Update the plugin README and deep-loop feature/manual documentation to describe size-bounded rotation rather than inactivity-only deletion.
- Test: Set a small byte cap, append enough warnings to cross it repeatedly, and assert bounded active and backup sizes. Create an oversized log, invoke `session.created`, and assert rotation without another warning. Verify no stdout or stderr writes.

---

### F5 [P1 (GPT P1 / Opus P2)] Loose iteration markers allow repeat-guard bypass
`.opencode/plugins/mk-deep-loop-guard.js:66` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: Confirmed. ITERATION_MARKER_REGEX (line 66) is `/(?:^|\n)\s*Iteration:\s*\d+\s*of\s*\d+|STATE SUMMARY/i`. The `STATE SUMMARY` alternative has NO line anchor and matches the substring anywhere; the `Iteration: N of M` alternative validates neither bounds (N≤M, M≥1) nor that a real state-summary envelope, target mode, or route is present. Any prompt containing the phrase 'state summary' or a line 'Iteration: 1 of 10' bypasses loop-repeat counting (Check 2, line 401).
- Fix approach: Prefer a dedicated, hard-to-forge machine marker over natural-language substring detection; at minimum line-anchor both alternatives and validate iteration bounds. Because command-driven status depends on what the deep command actually renders, verify the real emitted marker before tightening.
- Exact change: Read the deep-loop prompt templates under .opencode/skills/system-deep-loop/runtime/ (or deep-improvement/scripts) to find the literal marker the commands render for iteration N. Replace ITERATION_MARKER_REGEX with (1) a line-anchored, bounded iteration match `/(?:^|\n)\s*Iteration:\s*(\d+)\s*of\s*(\d+)\b/` plus a numeric guard `1 ≤ N ≤ M` applied where it's tested, and (2) drop the free-floating `STATE SUMMARY` alternative OR anchor it to line-start and require it to co-occur with the iteration line. Ideally introduce one canonical token (e.g. `[deep-loop:iter N/M mode=<x>]`) emitted by the command and matched here.
- Acceptance: A prompt with 'STATE SUMMARY' buried mid-text no longer counts as command-driven; a legitimately rendered iteration prompt still does; 'Iteration: 5 of 3' (invalid bounds) does not exempt. Existing command-driven test (test:174-180) still passes against the real marker.
- Side effects / parity: MUST stay in lockstep with the command's actual rendered marker — tightening blindly could make legit iterations count and trip the guard. Coordinate the canonical token across the deep commands and the Claude hook (F7). This is the same 'parse a real envelope' concern as O2.
- Test: Add near-miss cases: 'STATE SUMMARY' as prose → counts toward threshold; 'Iteration: 2 of 5' line → exempt; invalid bounds → not exempt. Keep the 5-iteration exemption test green against the real marker.

**GPT-5.6-Sol** — risk: high · confidence: high
- Root cause: confirmed: `ITERATION_MARKER_REGEX` accepts any line resembling `Iteration: N of M` or any `STATE SUMMARY` substring at `.opencode/plugins/mk-deep-loop-guard.js:62-66`, and line 401 uses it as the entire command-origin exemption. Real generated review summaries contain ordinary prose at `.opencode/commands/deep/assets/deep_review_auto.yaml:734-747` and `771-788`, but the guard validates neither that envelope nor mode, target, origin, or numeric bounds.
- Fix approach: Remove natural-language marker detection and exempt only a versioned machine envelope emitted by the owning command and internally consistent with the resolved registry route.
- Exact change: Delete `ITERATION_MARKER_REGEX`. Add a strict parser for exactly one versioned dispatch-envelope line. For command iterations require `origin=command`, canonical mode and target, `execution=iteration`, integer `iteration` and `maxIterations`, and `1 <= iteration <= maxIterations`. Cross-check mode membership against the target's registry set. Duplicate, malformed, conflicting, or mode-mismatched envelopes are untrusted and therefore warn or deny according to the relevant reject setting. Add the envelope to every deep command prompt producer immediately adjacent to its generated state summary; keep the human-readable summary for agents but give it no guard authority.
- Acceptance: Free text containing `STATE SUMMARY`, `Iteration: 2 of 10`, reversed bounds, zero or negative values, wrong target, wrong mode, or duplicate envelopes never receives command-origin exemption. A valid generated command envelope does.
- Side effects / parity: Update research, review, improvement, and any council route producers that use the shared mode-mismatch contract, plus their Claude command mirrors. This envelope also supplies the origin evidence required by F2 and the anchored mode source required by O2.
- Test: Add table-driven valid envelopes for each registered mode and near-misses for natural prose, malformed JSON or fields, duplicate envelopes, wrong mode/target, missing origin, non-integer values, zero, negative, iteration greater than max, and extra conflicting route lines.

---

### F7 [P1 (GPT P1 / Opus P2)] Claude Code has no Task-dispatch guard counterpart
`.claude/settings.json:14` — **Status: both models agree**

**Opus 4.8** — risk: high · confidence: med
- Root cause: Confirmed. .claude/settings.json has exactly one PreToolUse hook, matched to Bash (line 14-25); there is no Task matcher, so Claude Code performs zero mode-mismatch or loop-repeat guarding while OpenCode does. The Stop hook (line 72-84) only runs session-stop.js + session-cleanup.sh. orchestrate.md's dispatch contract (Deep Route format, lines 176-206) applies to both runtimes, so the guard gap is a real cross-runtime parity hole.
- Fix approach: Extract the guard's parsing + policy core into a runtime-agnostic shared module, then add a thin Claude PreToolUse Task hook that adapts only Claude's stdin/stdout transport. Keep registry resolution, thresholds, exemptions, warning log, and reject behavior identical.
- Exact change: (1) Create a shared CJS/ESM module (e.g. .opencode/plugins/lib/deep-loop-guard-core) exporting loadRegistryAgents, resolveTargetIdentity, declaredModeFromPrompt, ITERATION_MARKER logic, loop-state helpers, thresholds, and an `evaluateDispatch({subagentType, prompt, sessionID, projectDir, env})` returning {decision:'allow'|'warn'|'reject', detail}. Refactor mk-deep-loop-guard.js to consume it (no behavior change). (2) Add a Claude hook script (e.g. .opencode/skills/.../hooks/claude/task-dispatch-guard.mjs) that reads the PreToolUse JSON from stdin (tool_name==='Task', tool_input.subagent_type, tool_input.prompt, session_id, cwd), calls evaluateDispatch, and on 'reject' emits Claude's block form (exit 2 with stderr, or JSON hookSpecificOutput.permissionDecision='deny'), on 'warn' appends to the shared warning log and allows. (3) Register it in .claude/settings.json PreToolUse with `"matcher":"Task"`.
- Acceptance: A Claude Task dispatch with a Deep Route mode mismatch logs a warning (default) or is denied under REJECT=1; a 3rd non-command-driven hand-off to a command-owned executor is denied under REJECT_LOOP=1; command-driven iterations pass. Behavior matches the OpenCode plugin case-for-case against the same fixtures.
- Side effects / parity: Land this LAST — after F1/F2/F3/F5/F8/O1/O2/O3 so the extracted core already contains the fixes and both runtimes inherit them (avoid porting known bugs). Both surfaces must share ONE warning-log path + rotation (F4) and the same executor set (F2). Claude's tool name is 'Task' (capital) vs OpenCode 'task' — the core must normalize case (O3).
- Test: Add a Claude-hook test that pipes representative PreToolUse JSON payloads (mismatch, matching, 1st/2nd/3rd hand-off, command-driven) into the hook and asserts allow/warn/deny + shared-log writes, mirroring the OpenCode test table.

**GPT-5.6-Sol** — risk: high · confidence: high
- Root cause: confirmed: `.claude/settings.json:14-25` registers only a Bash PreToolUse hook. Its remaining lifecycle hooks at lines 26-96 do not inspect Task dispatches, so Claude has no equivalent mode-mismatch, origin, or repeat guard.
- Fix approach: Extract runtime-neutral parsing, registry indexing, persistence, locking, thresholds, and policy evaluation into one shared CommonJS module; retain thin transport adapters for OpenCode and Claude.
- Exact change: Place the shared guard policy outside `.opencode/plugins/`, for example under `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`, so the OpenCode plugin can remain default-export-only. Refactor `mk-deep-loop-guard.js` into an OpenCode adapter that translates policy denials to throws and warnings to the bounded log. Add a Claude stdin hook adapter that maps `tool_name`, `tool_input`, and `session_id` to the shared request, emits structured `additionalContext` for warnings, and emits a PreToolUse `permissionDecision=deny` for policy or reject-mode dependency failures. Register it under `PreToolUse` matcher `Task`. Register a SessionStart maintenance invocation for sweep, temp cleanup, and log rotation.
- Acceptance: Equivalent OpenCode and Claude payloads produce the same allow, warn, deny, thresholds, exemptions, and detail text. Claude's third origin-marked orchestrate handoff is denied under loop rejection, and a mismatched mode is denied under mode rejection.
- Side effects / parity: Update `.claude/settings.json`, the Claude orchestrate producer mirror, hook inventory documentation, and any alignment verifier that enumerates Claude hooks. OpenCode must still export only the default plugin factory and must never write to stdout or stderr; Claude may write only its required hook-protocol JSON.
- Test: Add shared policy unit tests plus adapter contract tests. Feed representative Claude PreToolUse stdin payloads to the hook process and assert valid JSON warning/deny responses, exit behavior, session isolation, fail-open warning mode, fail-closed reject mode, and no accidental plain-text output.

---

### F6 [P2] Sweep synchronization assumes a single process
`.opencode/plugins/mk-deep-loop-guard.js:294` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: Confirmed as a real but low-impact race. The block comment (line 288-299) argues single-process synchronous execution prevents interleaving, but the state dir is shared by all OpenCode processes. sweepStaleLoopGuardStates does statSync (line 325) then renameSync (line 327) with no cross-process guard: two processes can sweep concurrently, and a session that becomes active between another process's stat and rename can have its live state archived, resetting its loop count. Blast radius is low — the guard is advisory and losing a count only relaxes a soft threshold.
- Fix approach: Prevent concurrent sweeps with an atomic cross-process lock (mkdir is atomic on POSIX), and shrink the live-session archival window by re-stat'ing immediately before rename. Accept the residual micro-race given the advisory nature.
- Exact change: In sweepStaleLoopGuardStates (line 304), before the readdir loop, attempt `mkdirSync(join(stateDir,'.sweep.lock'))`; on EEXIST return (another process is sweeping) unless the lock dir is itself stale (mtime > interval) in which case reclaim it; always rmdir the lock in a finally. Inside the per-entry loop, re-statSync sourcePath right before renameSync and skip if it is no longer past activeRetention (line 326 already stats; move that stat to be the last read before rename, or add a second confirmation stat). Update the block comment to state the multi-process reality and the lock strategy — do NOT keep the 'single process is sufficient' rationale.
- Acceptance: Two plugin instances invoking the sweep concurrently do not both archive; a state file whose mtime is refreshed between candidacy and rename is not archived. Single-process behavior and existing retention tests (test:213-268) unchanged.
- Side effects / parity: Correct the misleading concurrency comment (comment-hygiene: keep durable WHY). mk-goal.js uses an async mutation queue for the same class of problem — align terminology. Claude Stop hook does not sweep loop-guard state, so no parity change needed there.
- Test: Simulate two sequential sweeps racing the lock (create .sweep.lock, assert the second is a no-op); assert a file re-touched after readdir but before rename survives.

**GPT-5.6-Sol** — risk: high · confidence: high
- Root cause: confirmed: the synchronization argument at `.opencode/plugins/mk-deep-loop-guard.js:294-299` proves only single-process event-loop serialization. All plugin processes share the directory selected at lines 361-364. The sweep stats and later renames a file at lines 320-329 without preventing another process from replacing that file between those operations.
- Fix approach: Serialize each state read-modify-write and stale-file archival across processes with atomic filesystem locks, and serialize sweep scheduling with a project-scoped lock and persisted sweep timestamp.
- Exact change: Create a `.locks` directory beneath the state directory. Acquire per-session locks using atomic `mkdirSync` or exclusive-create semantics before reading state, writing its temp file, replacing the final file, or archiving it. In the sweep, acquire the project sweep lock, consult a persisted sweep timestamp, then acquire each candidate's session lock and re-stat the file after lock acquisition before renaming it. Add bounded stale-lock reclamation through atomic rename-to-unique-tombstone, never blind unlink. Give warning-log maintenance its own lock. In reject mode, lock timeout is a dependency denial; in warning mode it is fail-open with no unsafe count update.
- Acceptance: Concurrent processes cannot lose increments, archive a freshly replaced state file, rotate the log simultaneously, or run duplicate sweeps. A crashed lock holder is recoverable after the stale-lock threshold without deleting a newly acquired lock.
- Side effects / parity: Both OpenCode and Claude adapters must use the same lock implementation because they share persistence. Archive naming should be collision-safe when a session is archived more than once.
- Test: Spawn multiple Node child processes against one temporary project and synchronize their dispatches at a barrier. Assert the final count equals all successful increments, no fresh state is archived, only one sweep timestamp advances, and stale-lock recovery does not steal a live lock.

---

### F8 [P2] Case-insensitive mode extraction is followed by case-sensitive comparison
`.opencode/plugins/mk-deep-loop-guard.js:89` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. declaredModeFromPrompt (line 90) matches with the /i flag but returns match[1] in ORIGINAL casing. Check 1 compares it against entry.workflowMode (lowercase in registry) with `!==` (line 391). A prompt declaring `mode=Research` against target deep-research (registry 'research') is a false-positive mismatch.
- Fix approach: Normalize the captured mode to lowercase at the boundary so comparison is canonical on both sides.
- Exact change: In declaredModeFromPrompt (line 91) return `match[1].toLowerCase()` instead of `match[1]`. (After F1 this feeds set membership `entry.workflowModes.has(declaredMode)`, which is lowercase-keyed.)
- Acceptance: `mode=Research`/`mode=RESEARCH` against deep-research produce no mismatch; a genuinely wrong mode still mismatches. Existing lowercase tests unchanged.
- Side effects / parity: Same normalization must exist in the F7 shared core. Pairs with O1 (target identity casing) — apply both together so a `mode=X` vs agent `@Y` pair is fully case-insensitive end to end.
- Test: Add: target deep-research + `mode=RESEARCH` → no mismatch log; + `mode=Council` → mismatch log.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: `declaredModeFromPrompt()` matches case-insensitively but returns original casing at `.opencode/plugins/mk-deep-loop-guard.js:89-92`; the comparison at lines 390-392 is case-sensitive.
- Fix approach: Canonicalize every parsed identifier once at the shared parser boundary.
- Exact change: Have the new envelope parser pass mode values through a single ASCII identifier canonicalizer that trims and lowercases before registry lookup or comparison. Registry modes must be canonicalized by the same helper. Do not scatter lowercase calls across individual checks.
- Acceptance: A declared `REVIEW`, `Review`, or `review` resolves to the same registry mode, while genuinely different modes still warn or deny.
- Side effects / parity: The shared parser automatically keeps Claude behavior identical. Diagnostic output should use canonical values or clearly distinguish raw input from canonical values.
- Test: Table-test mixed-case declarations for every mode, including the four multiplexed deep-improvement modes, and assert no false mismatch.

---

### O1 [P2 · Opus-new] Uppercase target-agent name silently bypasses BOTH guards
`.opencode/plugins/mk-deep-loop-guard.js:122` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. resolveTargetIdentity's three regexes use /i but return match[1] with original casing (lines 124-131). Consumers are case-sensitive: registry.get(targetAgent) is a lowercase-keyed Map (line 388) and LOOP_EXECUTOR_AGENTS.has(targetAgent) is a lowercase Set (line 400). A prompt with `target_agent=@Deep-Research` or `Agent: @DEEP-REVIEW` resolves to a mixed-case identity that misses BOTH the registry lookup and the loop-executor set, silently bypassing both guards.
- Fix approach: Lowercase the resolved identity at the boundary in resolveTargetIdentity so all downstream case-sensitive lookups match.
- Exact change: In resolveTargetIdentity, return `.toLowerCase()` on each resolved value: `return deepRouteMatch[1].toLowerCase()` (line 125), `return agentLineMatch[1].toLowerCase()` (line 128), and for the subagent_type fallback return `subagentType.toLowerCase()` when used (line 130) — registry/executor keys are all lowercase so this is safe.
- Acceptance: `Agent: @DEEP-REVIEW` (3rd hand-off) triggers the loop-repeat guard; `target_agent=@Ai-Council` resolves to the registry entry. Existing lowercase tests unchanged.
- Side effects / parity: Apply together with F8. The F7 shared core must lowercase identity identically. Confirm no consumer relies on preserved casing (none do — mismatchDetail is display-only).
- Test: Add: `Agent: @DEEP-REVIEW` × 3 in one session under REJECT_LOOP=1 → rejects; `target_agent=@AI-COUNCIL` never loop-counts (non-executor).

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: both target regexes use `/i` but return original casing at `.opencode/plugins/mk-deep-loop-guard.js:122-128`; the fallback at lines 130-131 is also unnormalized. Registry lookup and executor membership are case-sensitive at lines 388 and 400, so uppercase targets bypass both checks.
- Fix approach: Canonicalize target identity regardless of whether it came from the envelope, Agent line, or subagent-type fallback.
- Exact change: Route every resolved target through the same ASCII identifier canonicalizer used for modes. Compare the canonical fallback against `general`, return only canonical target IDs, and canonicalize registry and executor-set keys when constructed. Preserve the raw target only for optional diagnostics.
- Acceptance: `@DEEP-REVIEW`, `@Deep-Review`, and direct `subagent_type=DEEP-REVIEW` all invoke the same mode and repeat policies as lowercase input.
- Side effects / parity: Implemented in the shared policy parser, so both runtime adapters inherit the fix. F8 and O1 should land together to avoid asymmetric canonicalization.
- Test: Exercise uppercase and mixed-case targets through the machine envelope, legacy Agent-line resolution if retained, and direct subagent fallback; assert mode mismatch detection and repeat counting both fire.

---

### O2 [P2 · Opus-new] declaredModeFromPrompt matches the FIRST 'mode=' token anywhere, not the target-intended mode
`.opencode/plugins/mk-deep-loop-guard.js:90` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: Confirmed. declaredModeFromPrompt uses `/mode=([a-z0-9-]+)/i.exec(promptText)` (line 90) which returns the FIRST `mode=` token anywhere in the prompt. orchestrate's Deep Route line (orchestrate.md:185) is `Deep Route: mode=<workflowMode>; target_agent=@<agent>; ...` — the intended mode. But any earlier or unrelated `mode=` token elsewhere in the prompt body (task prose, quoted text) is captured instead, yielding a wrong-mode false mismatch or masking a real one.
- Fix approach: Anchor mode extraction to the Deep Route header envelope rather than a free-floating substring, so it reads the mode paired with the resolved target.
- Exact change: Rewrite declaredModeFromPrompt to first locate the `Deep Route:` line and extract `mode=` from within that segment (e.g. match `/Deep Route:[^\n]*?\bmode=([a-z0-9-]+)/i`); only fall back to a bare `mode=` search when no Deep Route line exists (preserves current lenient tests). Lowercase the result (F8). Optionally require the Deep Route's target_agent to equal the resolved identity before trusting its mode.
- Acceptance: A prompt with a stray `mode=verbose` before the Deep Route header still extracts the Deep Route's mode; a Deep Route mismatch is still detected; prompts with no Deep Route line but a bare `mode=` still work (test:93 style).
- Side effects / parity: Interacts with F1 (set membership) and F5 (envelope parsing) — all three converge on 'parse the real Deep Route envelope, not substrings'. Keep the F7 core identical. Verify against the exact orchestrate.md:185 header field order.
- Test: Add: `Deep Route: mode=research; target_agent=@deep-research\n...quotes mode=council...` → extracts research (no mismatch); stray leading `mode=council` before Deep Route → still research.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: confirmed: `/mode=([a-z0-9-]+)/i.exec(...)` at `.opencode/plugins/mk-deep-loop-guard.js:89-91` returns the first token anywhere in the prompt. A dedicated Deep Route field already exists in the producer contract at `.opencode/agents/orchestrate.md:184-206`, so scanning arbitrary prompt prose is unnecessary and ambiguous.
- Fix approach: Use only the canonical machine dispatch envelope as the authoritative declared mode and reject ambiguity rather than selecting the first textual token.
- Exact change: Remove `declaredModeFromPrompt()` and parse mode together with target and origin from exactly one versioned envelope line. Ignore incidental `mode=` text outside that envelope. If more than one envelope exists or route-bearing fields conflict, return a malformed-route warning or denial instead of choosing one.
- Acceptance: An incidental earlier or later `mode=verbose` token does not affect routing. The envelope's mode is authoritative, and conflicting or duplicate envelopes cannot bypass validation.
- Side effects / parity: All OpenCode and Claude producers must emit the same envelope before the free-form task body. This change should be deployed with F5's producer updates, not as an isolated parser removal.
- Test: Place unrelated `mode=` tokens before and after a valid envelope, verify they are ignored, then add conflicting and duplicate envelopes and verify warning or denial.

---

### O3 [P2 · Opus-new] Runtime input-shape assumptions unverified; a field/value drift silently disables the whole guard
`.opencode/plugins/mk-deep-loop-guard.js:377` — **Status: DISPUTED (GPT calls non-issue)**

**Opus 4.8** — risk: low · confidence: med
- Root cause: Confirmed as an untested assumption, not a proven live bug. tool.execute.before gates on `input.tool !== 'task'` (line 377, case-sensitive) and Check 2 requires `input.sessionID` (line 400), while the event hook defensively reads `input?.event?.type || input?.type` (line 369) — the code itself signals uncertainty about OpenCode's payload shapes. If OpenCode ever emits tool name 'Task' or nests the session id, the whole guard silently disables (fail-open).
- Fix approach: Normalize the tool-name check case-insensitively and probe multiple plausible session-id field paths; add a fixture mirroring a captured real payload to lock the shape.
- Exact change: Line 377: compare `String(input.tool).toLowerCase() !== 'task'`. Line 400/402: resolve `const sessionID = input.sessionID ?? input.session?.id ?? input.sessionId;` and gate Check 2 on that. Do NOT broaden beyond documented shapes without evidence. Capture one real OpenCode tool.execute.before payload and add it as a test fixture asserting the guard fires on it.
- Acceptance: Guard still fires for `tool:'task'`; also fires if a real payload uses 'Task' or a nested session id; non-task tools still no-op. Existing tests unchanged.
- Side effects / parity: The F7 Claude core normalizes tool name 'Task' the same way (Claude uses capitalized 'Task'). If a real captured payload contradicts these paths, that evidence overrides this design (Logic-Sync).
- Test: Add fixtures: `{tool:'Task', session:{id:'s'}}` and `{tool:'task', sessionID:'s'}` both exercise Check 2; capture-real-payload fixture asserts resolution.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: non-issue for the installed OpenCode runtime: the authoritative SDK type explicitly defines `tool`, `sessionID`, and `callID` for `tool.execute.before` at `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-241`, exactly matching the plugin's `input.tool` and `input.sessionID` accesses at `.opencode/plugins/mk-deep-loop-guard.js:377` and `400`. Probing undocumented alternatives such as `input.session.id` would conceal an SDK contract break rather than fix a demonstrated defect.
- Fix approach: Pin and verify the documented host contract instead of adding speculative field fallbacks. A harmless lowercase normalization of the tool identifier may be done at the adapter boundary, but alternate session paths should not be accepted without a real host contract.
- Exact change: No production field-path change is required. Add one OpenCode adapter normalizer that validates the documented shape and lowercases a string tool identifier before comparing it with `task`. In loop reject mode, a Task-shaped request missing the required `sessionID` should return a dependency denial; warning mode may fail open. Keep the shared policy independent of host field names.
- Acceptance: A payload matching the installed SDK reaches both checks, and a real installed-host smoke test confirms the observed payload. An explicitly malformed Task payload does not silently disable hard loop rejection.
- Side effects / parity: Claude uses a separate adapter because its documented keys differ; those keys must not leak into the OpenCode adapter. Add an SDK-version or live-smoke gate when upgrading `@opencode-ai/plugin`.
- Test: Add a fixture matching the exact SDK shape `{tool:'task', sessionID, callID}` and a live host smoke test. Add malformed-shape tests proving warning mode allows and reject-loop mode denies when a recognizable Task lacks its session identifier.

---

### F9 [refinement] Fixture registry omits the production registry's multiplexed-agent shape
`.opencode/plugins/tests/mk-deep-loop-guard.test.cjs:24` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. writeFixtureRegistry (test:24-36) gives each fixture mode a unique agent (ai-council→ai-council, research→deep-research), so it structurally cannot reproduce production's four-modes-share-deep-improvement shape — meaning F1 was undetectable by the suite. Tests also omit active-log growth/rotation, session.created log maintenance, marker near-misses, tmp-file cleanup, and multi-process sweep.
- Fix approach: Extend the fixture to include a multiplexed agent and add table-driven assertions covering every fix landed here.
- Exact change: In writeFixtureRegistry add ≥2 modes sharing one agent, e.g. `{workflowMode:'agent-improvement', agent:'deep-improvement'}` and `{workflowMode:'model-benchmark', agent:'deep-improvement'}`. Add test blocks: (F1) each valid deep-improvement mode → no mismatch, invalid → mismatch; (F8/O1) mixed-case mode & agent → resolves; (O2) stray mode= before Deep Route → header wins; (F5) marker near-misses; (F4) log size rotation + session.created maintenance; (O4) orphan .tmp cleanup; (F6) concurrent-sweep lock no-op.
- Acceptance: New suite fails against the current (unfixed) plugin for each finding and passes once the corresponding fix lands; existing assertions remain green.
- Side effects / parity: Fixture change touches identity-resolution assertions that reference 'deep-research' — keep those modes present. If F7 lands, mirror the table for the Claude hook harness.
- Test: This finding IS the test work; land it alongside F1/F4/F5/O4 so each fix has a red→green guard.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: `writeFixtureRegistry()` assigns unique agents to only two modes at `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs:24-35`, unlike the multiplexed production registry. Existing iteration tests at lines 171-180 accept only loose natural-language markers, retention tests at lines 213-271 cover state files but not warning-log bounds or temp files, and no test uses multiple processes or a Claude adapter.
- Fix approach: Make fixtures represent production topology and add focused tests at each policy, persistence, concurrency, and runtime-adapter boundary.
- Exact change: Expand the fixture with all production deep-loop modes and four rows sharing `deep-improvement`. Convert mode and marker cases to tables. Add bounded-log and startup-maintenance cases, stale-temp cleanup cases, fail-closed dependency cases, mixed-case and incidental-mode cases, and adapter parity cases. Put true multi-process locking coverage in a separate spawned-process integration test rather than pretending a same-process mock proves cross-process safety.
- Acceptance: The suite fails against every original defect: overwritten modes, false origin attribution, loose marker bypass, dependency fail-open in reject mode, unbounded active logs, uppercase bypass, arbitrary mode extraction, stale temp retention, and cross-process lost updates.
- Side effects / parity: Add a Claude hook contract test and a small child-process test helper if needed. Keep fixtures hermetic and avoid importing the live registry as the sole fixture, because tests must still expose malformed and failure states deliberately.
- Test: Run the expanded OpenCode unit suite, spawned-process concurrency suite, and Claude stdin-hook suite; include a parity table asserting both adapters return the same policy decision for identical normalized dispatches.

---

### O4 [refinement · Opus-new] Orphaned atomic-write temp files are never pruned by the sweep
`.opencode/plugins/mk-deep-loop-guard.js:163` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: Confirmed. writeLoopStateAtomic creates `${finalPath}.${process.pid}.${Date.now()}.tmp` (line 163). On a crash between writeFileSync (165) and renameSync (166), the catch/unlink (168) never runs, orphaning a `.tmp` file. sweepStaleLoopGuardStates only archives entries where `entry.name.endsWith('.json')` (line 322) — the tmp name ends in `.tmp`, so orphans are never archived nor deleted and accumulate.
- Fix approach: Have the sweep also unlink stale `*.tmp` files older than the active-retention window, in the same pass that archives stale state.
- Exact change: In sweepStaleLoopGuardStates's entry loop (line 321-331), add a branch: for `entry.isFile() && entry.name.endsWith('.tmp')`, statSync and if `now - mtimeMs > activeRetentionMs` unlinkSync it (best-effort, swallow per-entry errors like the existing catch). Keep the `.json` archival branch as-is. Only prune tmp files older than the retention window so a concurrently-writing process's in-flight tmp is never deleted.
- Acceptance: A stale `.tmp` file older than active retention is removed by the next session.created sweep; a fresh tmp (recent mtime) is left untouched; `.json` archival and archive prune unchanged.
- Side effects / parity: Coordinate with F6's sweep lock so tmp cleanup runs under the same guard. The retention test (test:213-268) must add a stale-tmp case. No Claude-side sweep exists, so no parity change.
- Test: Add: write a `<key>.json.<pid>.<ts>.tmp` file with old mtime, run event({session.created}), assert it is deleted; a recent tmp survives.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: confirmed: atomic writes create `${finalPath}.${pid}.${timestamp}.tmp` at `.opencode/plugins/mk-deep-loop-guard.js:156-166`; cleanup at lines 167-170 runs only when the current process catches an error. The sweep at lines 320-323 considers only filenames ending in `.json`, so crash-orphaned temp files are never removed.
- Fix approach: Teach the locked sweep to identify and remove only stale temp files matching the guard's exact naming scheme.
- Exact change: Add a strict filename parser for `<hex-session-key>.json.<pid>.<timestamp>.tmp`. During the project sweep, derive the session key, acquire that session's lock, re-stat the candidate, and unlink it only when older than the active-retention window. Ignore fresh temp files and all nonmatching `.tmp` files. Keep immediate catch cleanup unchanged.
- Acceptance: A stale guard-owned temp file is removed on startup sweep; a fresh temp file, a live writer's temp file, and an unrelated temp file remain untouched.
- Side effects / parity: Use the same sweep from OpenCode session creation and Claude SessionStart. The per-session lock dependency ties this fix to F6.
- Test: Create stale and fresh matching temp files plus similarly named nonmatching files, run maintenance, and assert only the stale exact match is deleted. Add a child process holding the session lock to prove an apparently stale live temp is not removed.

---
