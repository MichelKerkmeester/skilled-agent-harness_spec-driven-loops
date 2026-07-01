# Deep Review Iteration 011

## Dimension

Adversarial re-verification pass across correctness, security, traceability, and maintainability. Focus: re-read current live `.opencode/plugins/mk-goal.js` for four high-stakes active P1s and run one forward-looking bug-class search without entering excluded phase `032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/**`.

## Files Reviewed

- `.opencode/plugins/mk-goal.js:95` - disabled-mode option normalization.
- `.opencode/plugins/mk-goal.js:177` - inline sanitizer entry point.
- `.opencode/plugins/mk-goal.js:189` - prompt sanitizer entry point.
- `.opencode/plugins/mk-goal.js:837` - objective sanitation before set/replace.
- `.opencode/plugins/mk-goal.js:1070` - verifier execution entry point.
- `.opencode/plugins/mk-goal.js:1080` - stale verifier compare-safe discard.
- `.opencode/plugins/mk-goal.js:1114` - verifier return after state mutation attempt.
- `.opencode/plugins/mk-goal.js:1236` - continuation execution entry point.
- `.opencode/plugins/mk-goal.js:1250` - disabled-mode continuation suppression.
- `.opencode/plugins/mk-goal.js:1350` - active-goal injection renderer.
- `.opencode/plugins/mk-goal.js:1376` - prompt budget calculation for injection body.
- `.opencode/plugins/mk-goal.js:1378` - returned block is not re-clamped after wrapper lines.
- `.opencode/plugins/mk-goal.js:1402` - status output reuses injection renderer.
- `.opencode/plugins/mk-goal.js:1454` - tool action execution entry point.
- `.opencode/plugins/mk-goal.js:1588` - session idle verifier call.
- `.opencode/plugins/mk-goal.js:1592` - unconditional continuation attempt after verifier returns.
- `.opencode/plugins/mk-goal.js:1620` - disabled-mode system transform guard.
- `.opencode/plugins/mk-goal.js:1625` - goal tools remain registered.
- `.opencode/plugins/mk-goal.js:1635` - `mk_goal` tool delegates to mutation-capable action executor.
- `.opencode/plugins/tests/mk-goal-state.test.cjs:120` - current long-injection regression assertion only checks structural clipping.
- `.opencode/plugins/tests/mk-goal-state.test.cjs:150` - current adversarial sanitizer regression assertion covers narrow blacklist cases.
- `.opencode/plugins/tests/mk-goal-tool-path.test.cjs:27` - tool-path set mutation coverage.
- `.opencode/plugins/tests/mk-goal-tool-path.test.cjs:41` - tool-path clear mutation coverage.

## Findings by Severity

### P0

No new P0 findings.

### P1

No new P1 findings. Four existing active P1s were adversarially re-verified and remain active with no severity change.

### P2

No new P2 findings.

## ADVERSARIAL RE-VERIFICATION

### DR-001-P1-001 - Injection max-length option does not cap the rendered active-goal block

- Hunter: Confirmed current behavior. `renderGoalInjection` computes `promptBudget` from `options.maxInjectionChars - buildBlock('').length`, sanitizes only the prompt body to that budget, then returns `buildBlock(...)` without a final clamp of the full block. Evidence: `.opencode/plugins/mk-goal.js:1350`, `.opencode/plugins/mk-goal.js:1376`, `.opencode/plugins/mk-goal.js:1378`.
- Skeptic: Current tests exercise a small `maxInjectionChars=220` case and assert structural lines and prompt ellipsis, but they do not assert `clippedBlock.length <= 220`. Evidence: `.opencode/plugins/tests/mk-goal-state.test.cjs:120`, `.opencode/plugins/tests/mk-goal-state.test.cjs:132`.
- Referee: Confirmed as P1. The issue is still a boundary/contract mismatch, not a false positive. Downgrade trigger would be a final whole-block clamp or tests asserting and passing the whole-rendered-block maximum.

### DR-003-P1-001 - Replacement goals can be continued after a stale verifier result was intentionally discarded

- Hunter: Confirmed current behavior. `maybeVerifyGoal` reads a goal, runs the verifier, then discards the mutation if the current goal id changed, but still returns the stale verifier result to the caller. Evidence: `.opencode/plugins/mk-goal.js:1070`, `.opencode/plugins/mk-goal.js:1080`, `.opencode/plugins/mk-goal.js:1114`.
- Hunter: The idle event handler awaits `maybeVerifyGoal(...)` and then always calls `maybeContinueGoal(...)` for the same session when the verifier path completes, so a replacement active goal can be considered for continuation after the stale verifier result was discarded. Evidence: `.opencode/plugins/mk-goal.js:1588`, `.opencode/plugins/mk-goal.js:1592`.
- Skeptic: Normal continuation guards are broad and tested, but they check the current active goal state; they do not distinguish a same-session replacement goal from the goal that the verifier just evaluated. Evidence: `.opencode/plugins/mk-goal.js:1236`, `.opencode/plugins/mk-goal.js:1259`, `.opencode/plugins/tests/mk-goal-continuation.test.cjs:116`.
- Referee: Confirmed as P1. The compare-safe state mutation prevents stale completion, but it does not prevent immediate continuation of a replacement goal after stale verification was discarded. Downgrade trigger would be a caller-visible stale-result signal or post-verification goal-id check before continuation.

### DR-005-P1-001 - Active-goal sanitization is a narrow blacklist before promoting user objective text into system context

- Hunter: Confirmed current behavior. The inline/prompt sanitizers redact active-goal markers, triple backticks, ASCII role prefixes, and two instruction-reset phrase families, while preserving other user-authored objective text. Evidence: `.opencode/plugins/mk-goal.js:177`, `.opencode/plugins/mk-goal.js:189`, `.opencode/plugins/mk-goal.js:202`.
- Hunter: The sanitized objective is stored, used to build `goalPrompt`, and later rendered into the active-goal system block. Evidence: `.opencode/plugins/mk-goal.js:837`, `.opencode/plugins/mk-goal.js:1354`, `.opencode/plugins/mk-goal.js:1355`, `.opencode/plugins/mk-goal.js:1388`, `.opencode/plugins/mk-goal.js:1392`.
- Skeptic: Existing tests do cover the exact blacklist cases they know about, including active-goal marker breakout, raw `system:`/`developer:` labels, the two reset phrases, and triple backticks. Evidence: `.opencode/plugins/tests/mk-goal-state.test.cjs:150`, `.opencode/plugins/tests/mk-goal-state.test.cjs:154`, `.opencode/plugins/tests/mk-goal-state.test.cjs:164`.
- Referee: Confirmed as P1. The finding is not that the listed blacklist cases are broken; it is that a blacklist remains the trust boundary before user text is promoted into system context. Downgrade trigger would be a positive allowlist/quoting scheme that prevents arbitrary objective text from becoming operative system-context instructions.

### DR-010-P1-001 - `MK_GOAL_PLUGIN_DISABLED` does not stop mutations

- Hunter: Confirmed current behavior in plugin code. `MK_GOAL_PLUGIN_DISABLED` feeds `options.enabled`, and that flag suppresses autonomous continuation and passive system transform. Evidence: `.opencode/plugins/mk-goal.js:95`, `.opencode/plugins/mk-goal.js:1250`, `.opencode/plugins/mk-goal.js:1620`.
- Hunter: The plugin still registers `mk_goal` and `mk_goal_status`, and `mk_goal` still calls `executeGoalAction`, which can set, clear, complete, or pause state without checking `options.enabled`. Evidence: `.opencode/plugins/mk-goal.js:1454`, `.opencode/plugins/mk-goal.js:1459`, `.opencode/plugins/mk-goal.js:1466`, `.opencode/plugins/mk-goal.js:1470`, `.opencode/plugins/mk-goal.js:1474`, `.opencode/plugins/mk-goal.js:1625`, `.opencode/plugins/mk-goal.js:1635`.
- Skeptic: This is not necessarily a runtime bug if the intended contract is "disable passive injection/autonomy only"; however, the prior finding is specifically about documentation overstating the disable boundary, not about proving tool mutations must be disabled. Exact test search found tool mutation coverage but no disabled-env boundary coverage for tool behavior.
- Referee: Confirmed as P1 documentation/config-contract drift. Downgrade trigger would be docs that explicitly say the flag leaves manual tools active, or implementation that gates the mutation-capable tools when disabled.

## Forward-Looking Search Pass

Searched current `mk-goal.js` and scoped tests for another bug class around disabled-mode/tool boundaries, stale verifier/continuation coupling, sanitizer/prompt-injection boundaries, length caps, silent catches, and file mutation helpers. No genuinely new bug class was found outside DR-001 through DR-010. The most relevant surfaces either map to existing findings or were already ruled out by earlier passes.

## Traceability Checks

- `spec_code`: Partial. This iteration re-read live code for four active findings rather than re-running full phase-doc traceability.
- `checklist_evidence`: Not applicable; prior state records scoped phase folders as Level 1 without checklist files.
- `feature_catalog_code`: Not re-run; this pass stayed on the live plugin and scoped tests.
- `playbook_capability`: Not re-run; no command/playbook mutation or phase 009 content was touched.
- Code graph: unavailable for strict structural reliance because `code_graph_status` reported stale readiness; graphless fallback used direct reads and exact Grep.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. No new findings were added, but four sampled active P1 findings remain valid in current live code.

## Next Dimension

Iteration 12 should continue toward the 15-iteration cap with another adversarial stabilization pass over unresolved P1 clusters or a targeted remediation-prioritization sweep, while keeping `032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/**` out of scope.

Review verdict: CONDITIONAL
