# Deep Review Iteration 003

## Dimension

Correctness -- pass C: completion-supervisor + active-continuation.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl:3`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md:31`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json:9`
- `.opencode/plugins/mk-goal.js:1072`
- `.opencode/plugins/mk-goal.js:1077`
- `.opencode/plugins/mk-goal.js:1079`
- `.opencode/plugins/mk-goal.js:1080`
- `.opencode/plugins/mk-goal.js:1114`
- `.opencode/plugins/mk-goal.js:1259`
- `.opencode/plugins/mk-goal.js:1318`
- `.opencode/plugins/mk-goal.js:1588`
- `.opencode/plugins/mk-goal.js:1592`
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:38`
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:78`
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:125`
- `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:116`
- `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:127`
- `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:153`
- `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:333`
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:120`
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:154`
- `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs:89`
- `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs:116`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/005-completion-supervisor/spec.md:96`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/005-completion-supervisor/plan.md:82`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/005-completion-supervisor/tasks.md:63`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/005-completion-supervisor/implementation-summary.md:55`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/spec.md:99`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/plan.md:85`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/tasks.md:67`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/implementation-summary.md:58`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/README.md:20`

## Findings by Severity

### P0

None.

### P1

#### DR-003-P1-001 [P1] Replacement goals can be continued after a stale verifier result was intentionally discarded

- File: `.opencode/plugins/mk-goal.js:1588`
- Claim: The idle handler can dispatch active continuation for a replacement goal that did not receive a fresh verifier pass on that idle event.
- Evidence: `maybeVerifyGoal` reads an active goal, awaits the supervisor, then only applies the result if the current goal still has the original goal id and is active (`.opencode/plugins/mk-goal.js:1072`, `.opencode/plugins/mk-goal.js:1077`, `.opencode/plugins/mk-goal.js:1079`, `.opencode/plugins/mk-goal.js:1080`). That compare-safe guard correctly prevents stale completion, but the function still returns the stale verifier result (`.opencode/plugins/mk-goal.js:1114`). The idle handler does not check whether the verifier result was applied to the same goal before calling continuation (`.opencode/plugins/mk-goal.js:1588`, `.opencode/plugins/mk-goal.js:1592`). `maybeContinueGoal` then rereads whatever goal is current and can reach `promptAsync` in active mode (`.opencode/plugins/mk-goal.js:1259`, `.opencode/plugins/mk-goal.js:1318`). Phase 006 says idle continuation is layered after verifier behavior and that idle runs verifier first, then continuation if the goal remains active (`.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/plan.md:85`, `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/implementation-summary.md:58`).
- Counterevidence sought: I checked supervisor and continuation tests for a race or replacement-goal assertion; the suite covers verdict mapping, active dispatch, caps, budget stops, and prompt suppression, but not goal replacement during an awaited verifier (`.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:38`, `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:116`, `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:333`).
- Alternative explanation: If the OpenCode plugin runtime serializes tool mutations so they cannot interleave while `supervisorVerifier` is awaited, this becomes theoretical. The code itself does not encode that invariant, and the injected verifier is async.
- Finding class: algorithmic / state-transition race.
- Scope proof: Exact reads of the only verifier-to-continuation path show one idle continuation call site after `maybeVerifyGoal`; exact Grep of the scoped tests did not surface same-class race coverage.
- Affected surface hints: `session.idle`, `maybeVerifyGoal`, `maybeContinueGoal`, active `promptAsync` continuation.
- Recommendation: Have `maybeVerifyGoal` return the verified goal id plus an `applied`/`stillActive` marker, or reread and compare the current goal id before `maybeContinueGoal`; skip continuation when verification was stale or not applied to the same active goal.
- Final severity: P1.
- Confidence: 0.82.
- Downgrade trigger: Proven runtime serialization that prevents concurrent goal replacement during an awaited supervisor verifier, or a same-goal recheck before continuation.

### P2

None.

## Traceability Checks

- `spec_code`: Partial. Phase 005 strict verifier mapping, redacted evidence, absent/ambiguous handling, and manual/supervisor completion source align with the reviewed implementation and supervisor tests. Phase 006 default-off, smoke, active dispatch, cap, budget, prompt-block, and status-field claims align with the reviewed implementation and continuation tests.
- `checklist_evidence`: Not applicable. The scoped phase folders are Level 1 packets and do not have `checklist.md` files.
- Adversarial scenario spot-check: Partial. `review/README.md:20` claims terminal-goal same-objective revival and active-goal injection clamp scenarios were added. The active-goal injection clamp is present in `mk-goal-state.test.cjs` via structural clamp and sanitization assertions (`.opencode/plugins/__tests__/mk-goal-state.test.cjs:120`, `.opencode/plugins/__tests__/mk-goal-state.test.cjs:154`). The terminal same-objective revival is present in `mk-goal-lifecycle.test.cjs`: the goal reaches `budget_limited`, then `setGoal` with the same objective returns a new active `reset-goal` with counters reset (`.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs:89`, `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs:116`).
- Code graph: Stale. `code_graph_status` reports `freshness=stale`, so this pass used graphless fallback with direct reads and exact Grep.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL: one new P1 correctness finding was recorded.

## Next Dimension

Security: prompt-injection sanitization, secret redaction in evidence/logs, and continuation/debug logging surfaces.

Review verdict: CONDITIONAL
