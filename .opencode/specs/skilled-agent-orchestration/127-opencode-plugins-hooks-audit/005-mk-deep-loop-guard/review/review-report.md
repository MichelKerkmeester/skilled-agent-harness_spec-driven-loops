# Plugin Audit Review - mk-deep-loop-guard

> **Iteration 2 cross-check (Opus 4.8):** 9 iteration-1 findings adjudicated (7 confirmed, 2 adjusted); 4 new findings. Full detail in [`iteration-002-opus-4.8.md`](./iteration-002-opus-4.8.md).

> **Source:** GPT-5.6-Sol-Fast (`openai/gpt-5.6-sol-fast --variant high`) read-only audit via cli-opencode, 2026-07-10. Findings are hypotheses with file:line evidence, pending remediation-time confirmation.

## Summary

The default-export shape is correct, but both guard checks have correctness gaps. The highest-impact bug is that duplicate deep-improvement agent entries overwrite each other, while reject modes can silently become allow modes when registry or state persistence fails.

| Field | Value |
|-------|-------|
| Plugin | `.opencode/plugins/mk-deep-loop-guard.js` (Deep-loop Task-dispatch guard) |
| Claude hook counterpart |  |
| Verdict | REFINE |
| Findings | 0 P0 / 6 P1 / 2 P2 / 1 refinement (9 total) |

**Parity assessment:** No Claude Code counterpart exists for the OpenCode-only tool.execute.before Task guard. The configured Claude lifecycle and cleanup hooks do not inspect Task dispatches. A counterpart is warranted because Claude's orchestrate contract uses the same Deep Route and general-subagent conventions; the implementation should share guard policy rather than duplicate it.

## Finding Registry

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| F1 | P1 | bug | `.opencode/plugins/mk-deep-loop-guard.js:80` | Duplicate agent entries overwrite valid workflow modes | high |
| F2 | P1 | bug | `.opencode/plugins/mk-deep-loop-guard.js:399` | Loop counting does not establish that orchestrate originated the dispatch | med |
| F3 | P1 | error | `.opencode/plugins/mk-deep-loop-guard.js:75` | Reject modes silently fail open when guard dependencies fail | high |
| F4 | P1 | bug | `.opencode/plugins/mk-deep-loop-guard.js:218` | Warning log can grow without bound and is not rotated by the startup sweep | high |
| F5 | P1 | bug | `.opencode/plugins/mk-deep-loop-guard.js:66` | Loose iteration markers allow repeat-guard bypass | high |
| F6 | P2 | bug | `.opencode/plugins/mk-deep-loop-guard.js:294` | Sweep synchronization assumes a single process | med |
| F7 | P1 | parity | `.claude/settings.json:14` | Claude Code has no Task-dispatch guard counterpart | high |
| F8 | P2 | bug | `.opencode/plugins/mk-deep-loop-guard.js:89` | Case-insensitive mode extraction is followed by case-sensitive comparison | high |
| F9 | refinement | refinement | `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs:24` | Fixture registry omits the production registry's multiplexed-agent shape | high |

## Finding Detail

### F1 - Duplicate agent entries overwrite valid workflow modes
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/plugins/mk-deep-loop-guard.js:80`
- **Evidence:** loadRegistryAgents() stores one mode per agent with map.set(mode.agent, mode). mode-registry.json:117,143,166 maps three workflow modes to deep-improvement, so each entry overwrites the previous one and only skill-benchmark remains.
- **Impact:** Valid deep-improvement dispatches declaring agent-improvement, model-benchmark, or skill-benchmark are falsely reported or rejected as mode mismatches.
- **Proposed fix:** Map each agent to a Set or array of permitted workflowMode values and reject only when the declared mode is absent from that set.

### F2 - Loop counting does not establish that orchestrate originated the dispatch
- **Severity / Category / Confidence:** P1 / bug / med
- **Location:** `.opencode/plugins/mk-deep-loop-guard.js:399`
- **Evidence:** Every Task targeting a LOOP_EXECUTOR_AGENTS member is counted solely from targetAgent, sessionID, and a prompt marker. There is no origin check, although loopRepeatDetail() asserts that orchestrate performed the dispatch. prompt-improver is also counted despite having no entry in the deep-loop registry.
- **Impact:** Repeated legitimate direct or command-owned dispatches in one session can warn and, on the third call with MK_DEEP_LOOP_GUARD_REJECT_LOOP=1, be blocked as if orchestrate were implementing an illegal loop.
- **Proposed fix:** Require a durable dispatch-origin field before applying orchestrate repeat counting. At minimum, remove prompt-improver from this deep-loop set unless its owning command emits an independently verifiable exemption marker.

### F3 - Reject modes silently fail open when guard dependencies fail
- **Severity / Category / Confidence:** P1 / error / high
- **Location:** `.opencode/plugins/mk-deep-loop-guard.js:75`
- **Evidence:** Registry read or parse errors return null and skip Check 1 even when MK_DEEP_LOOP_GUARD_REJECT=1. State write errors are swallowed at lines 156-170, leaving Check 2 unable to reach its persisted threshold. The test at lines 104-108 explicitly pins registry failure to allow behavior under reject mode.
- **Impact:** Operators can enable rejection believing enforcement is fail-closed, while a stale path, malformed registry, permissions problem, or filesystem failure silently disables the corresponding protection.
- **Proposed fix:** Keep default warning mode fail-open, but fail closed when the applicable reject variable is enabled. Make state persistence return success/failure so reject-loop mode can throw a clearly identified guard-unavailable error.

### F4 - Warning log can grow without bound and is not rotated by the startup sweep
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/plugins/mk-deep-loop-guard.js:218`
- **Evidence:** pruneStaleWarningLog() is called only immediately before another append and deletes only after prolonged inactivity. Lines 238-241 acknowledge that ordinary active use never rotates the log. The session.created path at lines 367-370 calls only sweepStaleLoopGuardStates(), which never calls pruneStaleWarningLog(), despite README.md:50 claiming session-created rotation.
- **Impact:** A workspace producing regular warnings can accumulate guard-warnings.log indefinitely; a dormant log also remains indefinitely if no later warning triggers the append-time prune.
- **Proposed fix:** Invoke warning-log maintenance from the session.created sweep and add size-based rotation or bounded line retention independent of mtime.

### F5 - Loose iteration markers allow repeat-guard bypass
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/plugins/mk-deep-loop-guard.js:66`
- **Evidence:** ITERATION_MARKER_REGEX accepts STATE SUMMARY anywhere in the prompt and accepts any line shaped like Iteration: N of M. It does not validate the generated state-summary block, target mode, route source, or iteration bounds. The canonical review block is substantially more specific at loop_protocol.md:235-243.
- **Impact:** A repeated non-command dispatch containing quoted documentation, user content, or an incidental STATE SUMMARY phrase is treated as command-driven and never counted, bypassing MK_DEEP_LOOP_GUARD_REJECT_LOOP.
- **Proposed fix:** Parse the exact generated state-summary envelope and require its mode to agree with the resolved target. Prefer a dedicated machine marker over natural-language substring detection.

### F6 - Sweep synchronization assumes a single process
- **Severity / Category / Confidence:** P2 / bug / med
- **Location:** `.opencode/plugins/mk-deep-loop-guard.js:294`
- **Evidence:** The concurrency rationale says synchronous Node operations prevent interleaving, but the state directory is shared by all OpenCode processes. The sweep performs statSync(sourcePath) at line 325 and renameSync(sourcePath, archive) at line 327 without cross-process locking or revalidation.
- **Impact:** Another OpenCode process can refresh a previously stale session file between stat and rename, after which the sweep moves the newly written file into the archive and resets that session's active counter state.
- **Proposed fix:** Use a project-scoped sweep lock and per-session mutation lock, or rework archival around an atomic claim/CAS protocol that cannot move a file changed after eligibility was measured.

### F7 - Claude Code has no Task-dispatch guard counterpart
- **Severity / Category / Confidence:** P1 / parity / high
- **Location:** `.claude/settings.json:14`
- **Evidence:** The only PreToolUse hook is matched to Bash at lines 14-25; no Task matcher invokes equivalent mode-mismatch or repeat-dispatch checks. The Stop hook's session-cleanup.sh only reclaims MCP helper processes. Meanwhile, .opencode/agents/orchestrate.md:176-206 defines the same Deep Route fields and general-subagent dispatch convention used by this plugin.
- **Impact:** Claude Code can issue malformed or repeated deep-loop Task dispatches that OpenCode would warn about or reject, so runtime behavior diverges on the same orchestration contract.
- **Proposed fix:** Add a Claude PreToolUse Task hook backed by shared parsing and policy logic. Adapt only the hook input/output transport; keep registry resolution, thresholds, exemptions, and reject behavior shared.

### F8 - Case-insensitive mode extraction is followed by case-sensitive comparison
- **Severity / Category / Confidence:** P2 / bug / high
- **Location:** `.opencode/plugins/mk-deep-loop-guard.js:89`
- **Evidence:** declaredModeFromPrompt() uses a case-insensitive regex but returns the original casing. Line 391 compares that value directly with the lowercase registry workflowMode using !==.
- **Impact:** A semantically valid declaration such as mode=Review is falsely classified as a mismatch and can be blocked in reject mode.
- **Proposed fix:** Normalize the captured mode to lowercase before comparison, or compare canonicalized values on both sides.

### F9 - Fixture registry omits the production registry's multiplexed-agent shape
- **Severity / Category / Confidence:** refinement / refinement / high
- **Location:** `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs:24`
- **Evidence:** writeFixtureRegistry() gives each fixture mode a unique agent, so it cannot expose the production registry.s three workflow modes sharing deep-improvement. Tests also omit active-log growth, session-created warning-log rotation, marker near-misses, and multi-process sweep contention.
- **Impact:** The most important production-shape bug passes the regression suite, while retention and marker tests validate only idealized cases.
- **Proposed fix:** Add duplicate-agent fixture entries and table-driven assertions for every valid deep-improvement mode, near-miss iteration text, bounded warning-log rotation, and cross-process or lock-simulation sweep behavior.

## Files Reviewed

- `.opencode/plugins/mk-deep-loop-guard.js`
- `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs`
- `.claude/settings.json`
- `.opencode/scripts/session-cleanup.sh`
- `.opencode/skills/system-deep-loop/mode-registry.json`
- `.opencode/plugins/README.md`
- `.opencode/agents/orchestrate.md`
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md`
