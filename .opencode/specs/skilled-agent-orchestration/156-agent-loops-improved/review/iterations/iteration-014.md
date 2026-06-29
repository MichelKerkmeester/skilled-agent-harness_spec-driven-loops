## Dimension

maintainability - API/contract consistency: `/goal` command <-> `mk_goal` tools <-> state schema <-> injection

## Files Reviewed

- `.opencode/plugins/mk-goal.js:1` - full plugin implementation
- `.opencode/commands/goal.md:1` - full command router
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:1` - state/tool/injection coverage
- `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:1` - real tool-context path coverage
- `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs:1` - usage/budget lifecycle coverage
- `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:1` - continuation gate coverage
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:1` - verifier state mapping coverage
- `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:1` - coupled user-facing contract
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:1` - coupled manual validation contract

## Findings by Severity

### P0

None.

### P1

#### R14-P1-001 - `.opencode/plugins/mk-goal.js:681` - Same-objective set can reactivate exhausted goal state

Claim: Setting the same objective after a terminal or budget-limited state violates the `set`/replace contract and can inject stale active goal state.

Why: `/goal set <objective>` routes normal command usage to `mk_goal({ action: "set", objective: REST })` at `.opencode/commands/goal.md:27` and `.opencode/commands/goal.md:38`. In the plugin, `setGoal()` special-cases an existing identical objective at `.opencode/plugins/mk-goal.js:684` and returns `{ ...current, status: "active", ... }` rather than building a fresh goal. That branch clears continuation suppression at `.opencode/plugins/mk-goal.js:691` and `.opencode/plugins/mk-goal.js:692`, but it preserves stale fields such as `tokensUsed`, `tokenBudget`, `lastAccountedMessageID`, `autoTurnsUsed`, verifier fields, and `completionSource`. The skipped fresh-goal path at `.opencode/plugins/mk-goal.js:696` would reset those fields from `.opencode/plugins/mk-goal.js:628`. A normal sequence of budget exhaustion followed by `/goal set <same objective>` leaves the goal `active` with `tokensUsed` still equal to `tokenBudget`, and the injection path reports that stale usage through `.opencode/plugins/mk-goal.js:1194`.

Counterevidence sought: I looked for docs or tests declaring same-objective `set` to be a resume/idempotence operation across terminal states. The state test pins same-objective identity preservation only for an already active goal at `.opencode/plugins/__tests__/mk-goal-state.test.cjs:37`; it does not cover `complete`, `blocked`, or `budget_limited` reactivation.

Alternative explanation: Preserving the current record may be intentional idempotence for repeated active `set` calls. That does not explain reactivating an exhausted or terminal record while keeping terminal counters and verifier state.

Final severity: P1.

Confidence: high.

Downgrade trigger: Downgrade only if the product contract explicitly says same-objective `set` resumes terminal/budgeted goals with all existing counters intact, and tests/docs pin the resulting active-but-exhausted injection as expected.

Suggested fix direction: Split the contract. Either make `set` always replace/reset the record, or allow the same-objective no-op only when the current goal is already `active` and not exhausted. For terminal or budget-limited records, call the fresh-goal path or reset usage, verifier, completion, continuation, and activity fields consistently.

#### R14-P1-002 - `.opencode/plugins/mk-goal.js:1199` - Injection clamping can remove the directive and closing marker

Claim: Accepted objective/reason lengths can produce a malformed active-goal injection that omits both the directive and `[/active_goal]`.

Why: The default input caps permit a 2000-character objective at `.opencode/plugins/mk-goal.js:25` and a 280-character verifier reason at `.opencode/plugins/mk-goal.js:27`, while the full injection is capped at 2400 characters at `.opencode/plugins/mk-goal.js:26`. `renderGoalInjection()` inserts those field values at `.opencode/plugins/mk-goal.js:1180` and `.opencode/plugins/mk-goal.js:1181`, builds a block with an opening marker, directive, and closing marker at `.opencode/plugins/mk-goal.js:1189` through `.opencode/plugins/mk-goal.js:1197`, then clamps the whole block at `.opencode/plugins/mk-goal.js:1199`. The clamp helper at `.opencode/plugins/mk-goal.js:150` truncates by character count and does not preserve structural suffixes. With max-length accepted fields, the emitted block reaches 2400 characters before the directive and closing marker, contradicting the documented injection contract that the block contains a directive at `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:31`.

Counterevidence sought: I checked the goal tests for a worst-case preview assertion. `.opencode/plugins/__tests__/mk-goal-state.test.cjs:71` only checks that the preview contains the opening marker; it does not assert the directive or closing marker survives clamping.

Alternative explanation: The hard cap may intentionally trump well-formedness. If so, the command/tool contract should not describe an exact bracketed block with a directive, and downstream consumers must not rely on the marker shape.

Final severity: P1.

Confidence: high.

Downgrade trigger: Downgrade if the injection contract is changed to explicitly allow truncated, non-closed blocks and tests prove no consumer depends on the directive or closing marker.

Suggested fix direction: Reserve space for the skeleton before clamping dynamic fields. Clamp `objective` and `reason` to budgets derived from `maxInjectionChars`, then always append the usage line, directive, and closing marker. Add a boundary test with maximum objective and reason lengths, plus a low `maxInjectionChars` option.

### P2

#### R14-P2-001 - `.opencode/commands/goal.md:30` - Unsupported-verb and bare-text routing contracts conflict

Claim: The command router gives incompatible instructions for unknown first tokens.

Why: The router contract says unsupported verbs emit `STATUS=FAIL ERROR="unknown action: <verb>"` at `.opencode/commands/goal.md:30`, but the execution order says every other non-empty `QUERY` becomes `mk_goal({ action: "set", objective: QUERY })` at `.opencode/commands/goal.md:42`. Bare text is also documented as a set shortcut at `.opencode/commands/goal.md:28`, so a command like `/goal resume` or a typo in a verb has two conflicting interpretations: fail as an unsupported verb or silently replace the current objective with the raw query. The coupled feature catalog documents the bare-text route at `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:27` and does not mention the unsupported-verb failure mode.

Counterevidence sought: I looked for a concrete verb namespace or command test that distinguishes unsupported verbs from bare-text objectives. None appears in the goal-specific tests; `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:27` starts at the plugin tool path and does not exercise command argument routing.

Alternative explanation: The unsupported-verb line may be leftover prose and bare-text set may be the actual intended API. That is still a contract bug because the command is an instruction document executed by the model.

Final severity: P2.

Confidence: high.

Downgrade trigger: Downgrade/drop if the unsupported-verb line is removed or command tests define a deterministic parser rule that resolves the ambiguity.

Suggested fix direction: Pick one grammar. If bare text is intentional, remove the unsupported-verb failure clause. If unsupported verbs must fail, require explicit `set <objective>` for mutation and reserve all first tokens for verbs.

## Verdict

FAIL

## Notes

- Reviewed target files read-only; only the two requested review artifacts were written.
- Direct behavior probes confirmed the stale same-objective budget path and the max-length injection truncation path.
