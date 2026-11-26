# Iteration 003 - D3 Traceability

## Dispatcher

- Run: 3 of 5. Session `2026-11-19T04:18:26.591Z`, generation 1, lineageMode `new`.
- Dimension: traceability.
- Focus (from strategy Next Focus): check the strip, crash fallback, receipt and Python-parity behaviors against the phase `spec.md` files, and confirm or rule out the reach of R1-P2-002.
- Iteration number: the state log holds 2 iteration records, so this is iteration 3. That matches the dispatch.
- Operator focus: all four shipped features were traced from their phase specs to the code. Strip: phases 002, 006 and 008. Crash fallback: phases 004 and 009. Receipts: phases 003, 010 and 011. Python parity: phase 007. Evidence folders and the 012 verdict table were not read.

## Files Reviewed

- Phase specs (context evidence, read-only): `002-pasted-context-stripping/spec.md:121-162`, `003-follow-up-routing-benchmark/spec.md:47,93-94`, `004-crash-path-fallback/spec.md:112-132`, `006-strip-rule-boundary-edges/spec.md:142-166`, `007-python-scorer-strip-parity/spec.md:151-174`, `008-handler-scored-prompt-consumers/spec.md:118-176`, `009-crash-fallback-edge-cases/spec.md:124,148-176`, `010-route-receipts-research/spec.md:67`, `011-route-receipts-build/spec.md:149-190`.
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:248-273, 360-420, 505-660`
- `.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:77-78, 100-192, 233-314`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:420-484`
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:144-243`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1274-1282`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:289, 539`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:335`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/pasted-reply-strip-cases.json` (24 row ids)
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` (run: pass=117, fail=0, exit 0)
- One hop for R1-P2-002 reach: `.opencode/plugins/system-skill-advisor.js:890-897`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The hook decides whether to fire on the unstripped prompt, so a pasted reply turns a skipped follow-up into a routed one** -- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:580 -- The hook computes `skippedResult = skippedAdvisorResultFor(prompt)` on the raw prompt, and `buildSkillAdvisorBrief` repeats the same raw check (`runtime/lib/skill-advisor-brief.ts:470-473`) before it routes the stripped text (`:478`). `shouldFireAdvisor` checks the explicit-marker pattern before anything else that fires (`runtime/lib/prompt-policy.ts:189-197`), so any skill name inside a pasted reply makes the raw prompt fire. A long paste also clears the length thresholds (`:211-229`). Measured on the shipped dist build: `Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: thanks` gives `explicit_skill_or_governance_marker` on the raw prompt and `short_casual_acknowledgement` on the stripped text. The plain `thanks` gives `short_casual_acknowledgement`. The same split holds for `sounds good` (`below_prompt_policy_threshold` when stripped) and for `You said: the docs are done. Now: ok` (`length_and_token_threshold` raw, `short_casual_acknowledgement` stripped). The specs state the rule for the stripped text: phase 003 says to call `shouldFireAdvisor` "on phase 002's stripped text, never the raw prompt" because a pasted reply that names a skill turns the policy on (`003-follow-up-routing-benchmark/spec.md:94`). Phase 010 names this exact hook call as reading the unstripped prompt (`010-route-receipts-research/spec.md:67`). Phase 011 then applied the rule only to the receipt guard (`011-route-receipts-build/spec.md:164`, code at `user-prompt-submit.ts:372,381`). The fire gate was left on the raw prompt with no stated decision. So the packet's claim that a prompt with a pasted earlier reply routes the same as the prompt without it fails at the fire gate: the plain acknowledgement is skipped, and the pasted one costs an advisor call and shows that call's brief or fallback line. Inference, not measured: when the routed acknowledgement comes back floored on a different skill, `recordRouteReceipt` removes the session's held receipt (`user-prompt-submit.ts:404-408`), so the pasted acknowledgement can also expire a valid route receipt.
   Finding class: spec_code_drift
   Scope proof: the raw-prompt fire check sits in two in-scope files (`user-prompt-submit.ts:580`, `skill-advisor-brief.ts:470-473`). The governing rule and the named hook site are in the packet's own phase specs (`003/spec.md:94`, `010/spec.md:67`). The divergence was reproduced on the shipped `runtime/dist/runtime/lib/prompt-policy.js`.
   Affected surface hints: `runtime/lib/skill-advisor-brief.ts` `skippedAdvisorResultFor` and `buildSkillAdvisorBrief` (run the policy on `stripLeadingPastedReply(prompt)`, or record a decision that the fire gate stays raw); the hook's `skippedResult` at `hooks/claude/user-prompt-submit.ts:580`, which the crash fallback also reads (`:648-650`); a fixture case in `tests/hooks/claude-user-prompt-submit-hook.vitest.ts` for a pasted reply ahead of `thanks`. Ordering note: stripping before the gate adds a third TASK_MARKER scan on the hook path, so R2-P2-001 is relevant to the cost.
   Case: the prompt "Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: thanks" fires the advisor, while the same prompt without the paste, "thanks", is skipped.

## Traceability Checks

- `spec_code` (core): **pass**, with one P2 drift (R3-P2-001). Every P0 REQ row checked matches the code:
  - 008 REQ-003: `advisor-recommend.ts:539` is the only `input.prompt` read (`rg -c` prints 1). The spec cites `:536`; the line has moved but the claim holds.
  - 007 REQ-005: `scoreAdvisorPrompt` strips first (`fusion.ts:1276`). The spec cites `:1277`.
  - 007 REQ-001: the Python test prints PASS for the fixture and exits 0 (`pass=117, fail=0`).
  - 006 REQ-003: `two-markers-in-user-task` is the one fixture row carrying `ideal`, matching the accepted limitation (R1-P2-004).
  - 011 REQ-003: a receipt expires on transcript shrink, a null clock and a changed generation or epoch (`route-receipt.ts:173-183`). There is no age limit.
  - 011 REQ-007: the guard calls `shouldFireAdvisor(stripLeadingPastedReply(prompt))` itself (`user-prompt-submit.ts:372,381`).
  - 011 REQ-008: the receipt store has a 4 KiB cap (`route-receipt.ts:77,233,244`), version and session checks on parse (`:116-117`), a 5-minute temp sweep (`:78,305`) and mtime eviction at 64 (`:298-314`, `directive-lifecycle-contract.ts:8`).
  - 011 REQ-011: `confidenceFloored` is in the strict schema (`advisor-tool-schemas.ts:335`) and set by the handler (`advisor-recommend.ts:289`).
  - 009 SC-001 and REQ-001/002/003/007: the crash catch renders the skipped or timeout fallback with the setup wording, sends it through `applyDirectiveLifecycle` and returns `{}` for a payload with no prompt string (`user-prompt-submit.ts:643-654`).
  - 004 REQ-001: the catch keeps `errorCode: 'UNKNOWN'` (`:635`).
- `checklist_evidence` (core): not run again. It was recorded `notApplicable` in iteration 1, and the evidence folders stay out of bounds.

## Integration Evidence

- R1-P2-002 reach: no production caller sends `lifecycle_event` or `lifecycle_source` to the shared handler on a UserPromptSubmit turn. A repo-wide search outside `specs/`, `dist` and `node_modules` finds the field read only at `user-prompt-submit.ts:249` and set only in tests (`claude-user-prompt-submit-hook.vitest.ts:259,721,970,1257`). The OpenCode plugin reads it in its own `lifecycleEventFrom` (`.opencode/plugins/system-skill-advisor.js:890-897`), which has no route-receipt guard. The finding stays a latent P2 that no current caller reaches.

## Edge Cases

- Stale line citations in the packet docs, recorded as context only and not as findings, since packet docs are outside the code target. `009/spec.md:124` cites `user-prompt-submit.ts:535-538` for the `deferDirectiveReceipt: true` entry, which is now at `:713-716`. `009/spec.md:175` cites `:261-273` for `emitDiagnostic`'s try. `008/spec.md:175` cites `:372-378` for the CLI brief call, which now holds the receipt guard. All of them moved when phase 011 added the guard.
- `007/spec.md:173` (SC-001) says 23 fixture rows; the fixture now holds 24. The extra row came from the later fix `5e5f0b3cfa2`, so the count was true when 007 closed.
- Inference, unverified: a guard suppress followed by a `renderBrief` throw reaches the crash path with `skippedResult` null and shows the timeout fallback, not the weak-follow-up skip. This needs a throw after `guardWeakFollowUp` returns. It was not measured.

## Confirmed-Clean Surfaces

- The receipt guard's stripped-text policy read (011 REQ-007) and the receipt store's validity and eviction rules (011 REQ-003, REQ-008).
- The handler's single raw-prompt read (008 REQ-003) and the scorer's strip-first entry (007 REQ-005).
- The crash catch's fallback selection and dedup (009 SC-001, REQ-003).

## Ruled Out

- R1-P2-002 reach through a production caller: none exists today (see Integration Evidence).
- Stale spec line citations as code findings: the claims behind them still hold at the moved lines.

## Next Focus

- Dimension: maintainability.
- Focus area: duplicated policy reads on one turn (`skippedAdvisorResultFor` and `shouldFireAdvisor` run up to three times in `skill-advisor-brief.ts:470-478` and the guard); the TS/Python strip twins and how far their regexes drift; the length of `handleClaudeUserPromptSubmit` and its crash-path coupling to the `prompt`, `skippedResult` and `deliveryState` locals; test fixture ownership across the vitest and Python suites.
- Reason: traceability is covered and `spec_code` now passes; maintainability is the last unreviewed dimension.
- Rotation status: correctness, security and traceability covered; maintainability remains.
- Blocked/productive carry-forward: reproducing spec claims on the shipped dist build was productive. Do not retry crash-path double dedup, receipt cross-session leak or R1-P2-002 producer search.
- Required evidence: file:line for each maintainability finding, with a concrete change cost or divergence case.

Review verdict: PASS
