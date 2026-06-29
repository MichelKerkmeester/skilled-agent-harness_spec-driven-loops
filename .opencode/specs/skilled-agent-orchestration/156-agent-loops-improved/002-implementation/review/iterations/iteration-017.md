## Dimension

traceability - test adequacy for the goal plugin default-export contract, fail-closed behavior, injection hardening, and continuation gates

## Files Reviewed

- `.opencode/plugins/mk-goal.js:1` - full plugin implementation
- `.opencode/commands/goal.md:1` - full command router
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:1` - state/tool/injection coverage
- `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:1` - real tool-context path coverage
- `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs:1` - lifecycle and prompt-block coverage
- `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:1` - continuation gate coverage
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:1` - verifier and redaction coverage
- `.opencode/plugins/README.md:1` - plugin default-export contract
- `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:1` - coupled feature contract
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:1` - coupled validation playbook

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R17-P2-001 - `.opencode/plugins/__tests__/mk-goal-state.test.cjs:16` - Default-export-only regression guard is not automated

Why: `mk-goal.js` uses a default plugin factory at `.opencode/plugins/mk-goal.js:1328` and hangs the test surface off that default at `.opencode/plugins/mk-goal.js:1490`. The current tests import `default.__test` at `.opencode/plugins/__tests__/mk-goal-state.test.cjs:16` through `.opencode/plugins/__tests__/mk-goal-state.test.cjs:18` and `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:19` through `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:20`, which proves a default export exists but would still pass if a named export were added. That is a real traceability gap because the coupled contract says every plugin file must export a default factory at `.opencode/plugins/README.md:26`, and the feature catalog records a prior live failure where multiple named exports broke OpenCode plugin loading at `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:41`.

Suggested fix direction: Add a small module-shape test that imports `.opencode/plugins/mk-goal.js` and asserts `Object.keys(pluginModule)` is exactly `["default"]`, then separately asserts `typeof pluginModule.default === "function"` and `pluginModule.default.__test` exists.

#### R17-P2-002 - `.opencode/commands/goal.md:26` - Command router behavior is only manually covered

Why: The command file defines the user-facing routing grammar at `.opencode/commands/goal.md:26` through `.opencode/commands/goal.md:42`, including empty/show routing, `set`, bare-text set, clear/complete/pause, and router-level failure text. The automated suite starts below that layer: state tests call `plugin.tool.mk_goal.execute` directly at `.opencode/plugins/__tests__/mk-goal-state.test.cjs:62`, and the tool-path test calls `executeGoalAction` directly at `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:27`. The only `/goal` command exercise is the manual playbook sequence at `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:50` through `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:58`. That leaves command markdown drift, allowed-tool drift, and route/failure text drift outside automated regression coverage.

Suggested fix direction: Add a command-router contract test or fixture harness that parses representative `$ARGUMENTS` cases and asserts the selected tool call/envelope for empty, `show`, `set`, bare text, `clear`, `complete`, `pause`, missing `set` objective, and unsupported/ambiguous verbs.

#### R17-P2-003 - `.opencode/plugins/__tests__/mk-goal-state.test.cjs:22` - Tool-level fail-closed missing-session paths are not pinned

Why: The plugin deliberately refuses shared state access without a session id at `.opencode/plugins/mk-goal.js:121` through `.opencode/plugins/mk-goal.js:125`, and the tool layer catches errors into `STATUS=FAIL` envelopes at `.opencode/plugins/mk-goal.js:1269` through `.opencode/plugins/mk-goal.js:1300`. The suite covers the lower helper fail-closed path with `helpers.setGoal(null, ...)` at `.opencode/plugins/__tests__/mk-goal-state.test.cjs:22` through `.opencode/plugins/__tests__/mk-goal-state.test.cjs:26`, then covers successful tool calls with a real `sessionID` at `.opencode/plugins/__tests__/mk-goal-state.test.cjs:62` and `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:27`. It does not assert that `mk_goal` and `mk_goal_status` fail closed when tool context lacks `sessionID`, so a future wrapper change could accidentally fail open, throw raw errors, or write/read shared state under an invalid key.

Suggested fix direction: Add tool-level negative tests for `mk_goal.execute({ action: "set", objective: "x" }, {})`, `mk_goal_status.execute({}, {})`, and equivalent null/blank session shapes. Assert `STATUS=FAIL`, `code=MISSING_SESSION_ID`, and no files created in the temporary state directory.

#### R17-P2-004 - `.opencode/plugins/__tests__/mk-goal-state.test.cjs:71` - Injection tests cover presence, not adversarial sanitization

Why: The implementation has explicit prompt-injection hardening in `sanitizeInlineText()` at `.opencode/plugins/mk-goal.js:156` through `.opencode/plugins/mk-goal.js:165`, and `renderGoalInjection()` injects sanitized objective/verifier text into the active-goal block at `.opencode/plugins/mk-goal.js:1177` through `.opencode/plugins/mk-goal.js:1199`. The automated injection check extracts `injection_preview` and only asserts the opening marker at `.opencode/plugins/__tests__/mk-goal-state.test.cjs:71` through `.opencode/plugins/__tests__/mk-goal-state.test.cjs:77`; supervisor tests assert secret redaction at `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:83` through `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:92`, but not role-label redaction, active-goal marker redaction, fenced-block neutralization, or "ignore previous instructions" redaction. The manual playbook names prompt-injection leakage as a failure mode at `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:81`, so this is a documented contract without adversarial automated coverage.

Suggested fix direction: Add injection-focused tests that set objectives and verifier evidence containing `[active_goal]`, `system:`, triple backticks, and "ignore previous instructions"; assert the rendered preview contains the redacted/neutralized forms and does not contain the raw adversarial strings.

#### R17-P2-005 - `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:51` - Continuation gate tests cover the main ladder but not several fail-closed gates

Why: `maybeContinueGoal()` has a long fail-closed gate ladder: plugin disabled/default autonomy at `.opencode/plugins/mk-goal.js:1078` through `.opencode/plugins/mk-goal.js:1085`, active-goal/suppression checks at `.opencode/plugins/mk-goal.js:1087` through `.opencode/plugins/mk-goal.js:1093`, in-flight and prompt-block checks at `.opencode/plugins/mk-goal.js:1095` through `.opencode/plugins/mk-goal.js:1103`, busy/retry and cooldown checks at `.opencode/plugins/mk-goal.js:1105` through `.opencode/plugins/mk-goal.js:1116`, cap/budget checks at `.opencode/plugins/mk-goal.js:1118` through `.opencode/plugins/mk-goal.js:1128`, missing `promptAsync` at `.opencode/plugins/mk-goal.js:1132` through `.opencode/plugins/mk-goal.js:1136`, and prompt failure cleanup at `.opencode/plugins/mk-goal.js:1151` through `.opencode/plugins/mk-goal.js:1163`. The continuation test covers default-off, passive, smoke, active success, and auto-turn cap at `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:51`, `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:72`, `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:87`, `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:102`, and `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:136`. It does not pin missing session id, in-flight suppression, permission/question suppression, busy/retry suppression, cooldown suppression, budget exhaustion, missing `promptAsync`, or rejected `promptAsync` lock cleanup.

Suggested fix direction: Extend `mk-goal-continuation.test.cjs` with table-driven negative cases for each gate reason and a rejected-`promptAsync` case that verifies `inFlightContinuations` is cleared and `autoTurnsUsed` does not keep increasing on immediate retry.

## Verdict

PASS

## Notes

- The reviewed plugin and command files were not modified.
- The five existing plugin tests pass in isolation: `mk-goal-state`, `mk-goal-tool-path`, `mk-goal-continuation`, `mk-goal-supervisor`, and `mk-goal-lifecycle`.
- The verdict is PASS because no P0/P1 defect was found in this traceability pass; the P2 findings are coverage gaps that should be closed before relying on the suite as a contract guard.
