# Iteration 004 - D4 Maintainability

## Dispatcher

- Run: 4 of 5. Session `2026-11-19T04:18:26.591Z`, generation 1, lineageMode `new`.
- Dimension: maintainability.
- Focus (from strategy Next Focus): duplicated prompt-policy reads on one turn, the TS/Python strip twins, the length and crash-path coupling of `handleClaudeUserPromptSubmit`, and test fixture ownership across the vitest and Python suites.
- Iteration number: the state log holds 3 iteration records, so this is iteration 4. That matches the dispatch.
- Operator focus: the change range `git diff 538d2f789ec 57d3f5d9159^2` was read for `skill-advisor-brief.ts`, `skill-advisor-cli-fallback.ts`, `hooks/dsh/prompt-advisor.mjs` and `skill_advisor.py`. All four shipped features were checked for duplicated logic and for whether their tests would catch a regression. Evidence folders and the 012 verdict table were not read.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:91-93, 144-272`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1005-1018, 4785-4846, 5320-5335`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:415-490`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:355-432, 505-660`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:215-240` (range diff)
- `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs` (range diff)
- `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts:15-28`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2530-2600`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/pasted-reply-strip-cases.json` (24 rows)
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:1060-1130` and the crash-path test names at `:495-1060`
- Measured on the shipped dist: `runtime/dist/runtime/lib/prompt-policy.js` (`shouldFireAdvisor` on the receipt-test prompts).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The fire decision is computed at five call sites on two different inputs, so changing which text the gate reads means editing several sites in step** -- .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:473 -- `buildSkillAdvisorBrief` calls `skippedAdvisorResultFor(prompt)` (`:470`), which runs `shouldFireAdvisor(prompt)` on the raw prompt (`:422`). It then runs the same raw call a second time (`:473`) only to read `metalinguisticMentions` for the diagnostics (`:480-484`). It runs it a third time on the stripped text (`:478`) only to borrow `canonicalPrompt` as a normalizer. The Claude hook keeps its own raw-prompt gate (`hooks/claude/user-prompt-submit.ts:580`). The receipt guard runs a fifth call on the stripped text (`:372,381`), and its comment (`:379-380`) records that the hook's own gate reads the raw prompt. So the two producers decide on the raw prompt while routing and the guard read the stripped prompt, and nothing ties the sites together. The cost shows in R3-P2-001: moving the fire gate to stripped text means changing `skill-advisor-brief.ts:422` (shared by the hook at `:580`), `:473` and the guard comment together. Changing only `:422` would leave the brief's `metalinguisticMention` and `skillNameSuppressions` diagnostics (`:482-483`) computed from text that was never routed. The duplicated raw call at `:473` repeats `:422` exactly and could take its value from that one call.
   Finding class: duplicated_logic
   Scope proof: all five call sites are in two in-scope files (`skill-advisor-brief.ts:422,470,473,478`; `user-prompt-submit.ts:372,381,580`). The diagnostics fields are diagnostic only: `skillNameSuppressions` has no reader outside `skill-advisor-brief.ts:89,428,483` (repo search excluding dist and tests).
   Affected surface hints: `runtime/lib/skill-advisor-brief.ts` `skippedAdvisorResultFor` and `buildSkillAdvisorBrief` (compute one policy result per input and pass it down); `hooks/claude/user-prompt-submit.ts:580` and the guard comment at `:379-380`; a normalizer export from `runtime/lib/prompt-policy.ts` so `:478` stops running the full policy just for `canonicalPrompt`.
   Case: on the prompt "Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: fix that too", `buildSkillAdvisorBrief` evaluates the policy twice on the raw text (`explicit_skill_or_governance_marker`) and once on the stripped text (`work_intent_with_meaningful_tokens`), and its diagnostics come from the raw call while its route comes from the stripped one.

2. **The crash catch keeps a null-input branch that the line above it already returns from** -- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:651 -- The crash catch returns `{}` when `!input || typeof input.prompt !== 'string'` (`:643`). Eight lines later it still writes `const delivery = input ? applyDirectiveLifecycle(emitted, input, dependencies) : { effectiveEmitted: emitted }` (`:651-653`). The `: { effectiveEmitted: emitted }` branch cannot run: TypeScript has already narrowed `input` to non-null, and nothing between `:643` and `:651` reassigns it. A reader of the 155-line handler (`:505-659`), whose catch already depends on three `let` locals the try assigns in order (`prompt`, `skippedResult`, `deliveryState` at `:520-523`), is told by this branch that a null-input crash can reach the fallback render. That is false, and a future edit that trusts it could move the `:643` guard and silently ship the undeduplicated fallback.
   Finding class: dead_code_misleading
   Scope proof: both lines are in the in-scope hook file. `input` is a parameter (`:506`) and nothing between `:643` and `:651` assigns it.
   Affected surface hints: `hooks/claude/user-prompt-submit.ts:651-653` (call `applyDirectiveLifecycle` directly); no test change is needed, since the crash tests at `claude-user-prompt-submit-hook.vitest.ts:853-1060` already pin the reachable path.
   Case: no payload reaches line 651 with `input` null, because a null input or a payload with no prompt string returns `{}` at line 643, so the ternary's else branch never runs.

## Traceability Checks

- `spec_code` (core): **pass** for the comments checked this iteration. The brief comment at `skill-advisor-brief.ts:474-477` (strip before the cut and before folding) matches `:478` and `prompt-policy.ts:91-93`. The Python comment at `skill_advisor.py:4789-4791` (JavaScript whitespace set) matches `_JS_SPACE_CHARS` (`:4792-4795`). The fixture `$comment` (both suites read it) matches `advisor-prompt-policy.vitest.ts:22-28` and `test_skill_advisor.py:2533-2538`.
- `checklist_evidence` (core): not run again. It stays `notApplicable` because the evidence folders are out of bounds.

## Integration Evidence

- Shared fixture ownership: `runtime/tests/fixtures/pasted-reply-strip-cases.json` is read by `runtime/tests/legacy/advisor-prompt-policy.vitest.ts:25` and `runtime/tests/python/test_skill_advisor.py:2538`, and by no other file (repo search excluding dist).

## Edge Cases

- One routed hook turn strips the same prompt at four layers: `skill-advisor-cli-fallback.ts:233`, `skill-advisor-cli.ts:1490`, `advisor-recommend.ts:539` and `fusion.ts:1277`. The guard adds a fifth on a floored turn (`user-prompt-submit.ts:372`). The fixed-point loop (`prompt-policy.ts:265-272`) keeps this correct. The doc comment at `:261-262` names only the handler and the scorer as callers. The cost side belongs to R2-P2-001 and was not re-measured, so this is recorded here and not as a new finding.
- `ADVISOR_PROMPT_MAX_CHARS` is duplicated as a literal in `skill_advisor.py:52` and `advisor-tool-schemas.ts:283`. It was not touched in the change range, so it is pre-existing and outside this review.

## Confirmed-Clean Surfaces

- TS/Python strip twins: the regexes are hand-copied (`prompt-policy.ts:245-246`, `skill_advisor.py:4801-4807`), but the shared 24-row fixture drives both suites. It includes rows for NBSP, U+001C, BOM, NEL, the long-s case fold and a trailing separator. A drift in either twin's whitespace set, folding or last-marker rule fails a row in the other suite.
- Receipt guard test strength: `claude-user-prompt-submit-hook.vitest.ts:1116` would catch the guard reading the raw prompt. Measured on the dist: the pasted prompt reads `explicit_skill_or_governance_marker` raw and `work_intent_with_meaningful_tokens` stripped. The bare `fix that too` fires (`work_intent_with_meaningful_tokens`), so the test at `:1110` reaches the guard and not the policy skip.
- Crash-path coupling: the ordering the catch depends on (`deliveryState` before the build, `skippedResult` before the CLI call) is pinned by tests at `:872`, `:962` and `:1250`.
- DSH adapter: `rotateSessionClock` and `advanceBoundary` (range diff) share one session-id rule and log only. No logic is duplicated from the Claude hook.

## Ruled Out

- TS/Python strip parity drift going unnoticed: the shared fixture is read by both suites and covers the whitespace and folding seams.
- Receipt tests passing for the wrong reason: the follow-up prompts fire, so the guard is exercised (measured on the dist).

## Next Focus

- Dimension: cross-reference / stabilization pass (all four dimensions covered).
- Focus area: re-check the eight active P2s (R1-P2-001..004, R2-P2-001, R3-P2-001, R4-P2-001/002) against the current code for duplicates and severity, and confirm no P1 is hidden in the R1-P2-001 plus R2-P2-001 ordering constraint.
- Reason: maintainability was the last uncovered dimension; iteration 5 is the final one under the max-iterations stop policy.
- Rotation status: correctness, security, traceability and maintainability are covered.
- Blocked/productive carry-forward: measuring on the shipped dist was productive again. Do not retry the strip-twin drift check or the receipt-test strength check.
- Required evidence: file:line rereads for any severity change.

Review verdict: PASS
