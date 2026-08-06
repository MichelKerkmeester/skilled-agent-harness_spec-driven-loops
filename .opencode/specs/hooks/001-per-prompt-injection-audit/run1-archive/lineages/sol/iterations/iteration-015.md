# Iteration 15: Final Quantitative Recommendation Set

## Focus
Produce the forced-depth final ranking from the accumulated exact character/byte fixtures and explicitly labeled `ceil(chars/4)` token estimates. The comparison separates lifecycle, ordinary steady-state, first Gate trigger, advisor semantic change, and Pi's mandatory per-input dispatch case across Claude Code, Codex, Cursor, Devin, OpenCode, and Pi. Provider caching is evaluated separately from model-context reduction.

## Measurement Contract
The fixed baseline uses: startup without continuity `361 chars / 367 bytes / ~91 estimated tokens`; recurring directives `759 / 763 / ~190`; live single advisor `802 / 806 / ~201`; Gate question `521 / 521 / ~131`; and Pi dispatch `552 / 554 / ~138`. The proposal uses the exact compact lifecycle policy `292 / 292 / ~73`, changed live route text `43 / 43 / ~11`, unchanged route `0`, unchanged Gate relay `0`, and Pi dispatch `552 / 554 / ~138` every nonblank input. Tokens are estimates, not tokenizer observations. Variable continuity, goals, compiled routes, recovery payloads, Codex's installed warning, and maintenance stdout remain outside fixed totals. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-010.md:8-13] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-012.md:7-37]

## Findings
1. **The highest-confidence recurring reduction is lifecycle consolidation plus unchanged-delivery suppression.** For Claude, intended Codex, and Devin, fixed no-Gate/no-route session totals fall from `91 + 190T` to `91 + 73`; OpenCode falls from `190T` to one epoch-local `73`; Pi falls from `91 + 329T` to `91 + 73 + 138T`. This preserves per-turn classification while removing invariant retransmission. Cursor CLI remains `91` observed because its prompt hook did not deliver in three probes; its configured/editor-unverified hypothetical follows the shared `91 + 190T -> 164` model but is not claimed as live savings. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-012.md:29-37] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-014.md:11-21]

| Runtime / evidence status | Baseline 1 turn | Proposed 1 turn | Baseline 10 turns | Proposed 10 turns | Baseline 50 turns | Proposed 50 turns | Safe fixed saving at 50 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Claude Code, configured | ~281 | ~164 | ~1,991 | ~164 | ~9,591 | ~164 | ~9,427 (98.3%) |
| Codex, intended contract | ~281 | ~164 | ~1,991 | ~164 | ~9,591 | ~164 | ~9,427 (98.3%) |
| Cursor CLI, observed | ~91 | ~91 | ~91 | ~91 | ~91 | ~91 | 0 claimed |
| Cursor editor, configured/unverified | ~281 | ~164 | ~1,991 | ~164 | ~9,591 | ~164 | ~9,427 hypothetical only |
| Devin, configured/previously observed | ~281 | ~164 | ~1,991 | ~164 | ~9,591 | ~164 | ~9,427 (98.3%) |
| OpenCode, configured transform | ~190 | ~73 | ~1,900 | ~73 | ~9,500 | ~73 | ~9,427 (99.2%) |
| Pi, configured transform | ~420 | ~302 | ~3,381 | ~1,544 | ~16,541 | ~7,064 | ~9,477 (57.3%) |

2. **Event cases stay explicit rather than being hidden in the ordinary-turn total.** SessionStart contributes baseline `~91` on Claude/Codex/Cursor/Devin/Pi and `0` on OpenCode; the compact policy adds `~73` once per epoch on adapters where lifecycle/epoch delivery is proven. A first Gate-positive turn adds `~131` under both designs, but each unchanged later positive saves `~131` only under edge-triggered delivery. A changed live advisor route adds the exact `43 chars / ~11` under the proposal; baseline already pays the `~190` suffix each turn and the representative live aggregate is `~201` shared or `~339` Pi. Pi's dispatch remains `~138` on every nonblank input, so it is never counted as a reduction. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-012.md:11-37] [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:49-106]

| Case | Claude / Codex / Devin | Cursor | OpenCode | Pi |
|---|---:|---:|---:|---:|
| SessionStart fixed baseline | ~91 | ~91 observed startup | 0 | ~91 |
| Proposed compact-policy epoch cost | +~73 once | +~73 only after editor delivery is proven; otherwise no change | +~73 on first transform in epoch | +~73 hidden lifecycle message |
| Ordinary unchanged turn, baseline -> proposed | ~190 -> 0 | 0 observed; ~190 -> 0 hypothetical editor | ~190 -> 0 | ~329 -> ~138 |
| First Gate-positive incremental cost | +~131 -> +~131 | +~131 only if delivered | +~131 -> +~131 | +~131 -> +~131 |
| Each repeated unchanged Gate-positive | +~131 -> 0 | same conditional status | +~131 -> 0 | +~131 -> 0 |
| Changed live advisor incremental content | baseline full aggregate ~201; proposal route only +~11 | unverified | baseline full aggregate ~201; proposal +~11 | baseline full aggregate ~339; proposal guard ~138 + route ~11 |
| Pi dispatch | n/a | n/a | n/a | ~138 every nonblank input in both designs |

3. **Rank by safe recurring savings first, then implementation risk.** The first two changes jointly remove the recurring `759-char/~190-token` suffix on ordinary shared-runtime turns; they are kept separate because trimming the text and changing cadence have different rollback signals. Gate edge triggering can save `~131` per repeated positive but is workload-dependent. Continuity/goal change delivery has potentially large savings but no fixed claim because payloads are variable. Stable-prefix caching is useful only after semantic omission and produces no context-window saving. [INFERENCE: arithmetic over the exact fixtures and cadence evidence in iterations 10, 12, and 14]

| Rank | Change class | Recurring context saving | Risk | Required preservation / rollback trigger |
|---:|---|---|---|---|
| 1 | **Conditionalize** directives-only fallback to silence on no-match/below-threshold/error | ~190 per ordinary shared-runtime turn; same component inside Pi | Low-medium | Keep classification diagnostics; rollback if any adapter loses policy after epoch reset |
| 2 | **Consolidate + cache delivery state**: 759-char recurring capsule -> 292-char epoch capsule | Moves ~190/turn to ~73/epoch | Medium | Roll back cadence suppression, not compact text, on first/same/reset parity failure or missing lifecycle acknowledgement |
| 3 | **Conditionalize** advisor delivery to passing semantic route changes | Avoids full repeated ~201 shared/~339 Pi aggregate; changed route costs ~11 plus Pi guard | Medium | Roll back if passing/ambiguous/freshness changes are missed or unknown sessions share state |
| 4 | **Conditionalize** Gate question on state/task/scope edges | ~131 for every unchanged repeated positive | Medium-high | Immediate rollback if mutation denial, invalid-answer re-ask, binding, or task-change tests regress; suppression must never mark satisfied |
| 5 | **Consolidate/cache delivery** of continuity and active goal on lifecycle/mutation | Variable, potentially larger than fixed blocks; no numeric claim | Medium-high | Roll back on stale goal/continuity after mutation, resume, compact, clear, or fork |
| 6 | **Cache-friendly ordering**: stable policy before volatile route/state | 0 context tokens; possible provider latency/cost benefit | Low after host trace | Disable cache claims if prefix order or provider usage fields are absent |
| 7 | **Drop** legacy duplicate producers only after all consumers migrate | No additional steady saving beyond ranks 1-5 | High during rollout | Keep versioned legacy renderers until dual-render byte/envelope parity and installed-copy checks pass |

4. **Guardrail preservation is a release gate, not an assumption.** Required tests are six-adapter envelope parity; first/same/changed semantic-hash transitions; reset on start/resume/clear/compact/fork, policy version, scope/binding, and goal mutation; unknown-session isolation; advisor pass/ambiguous/no-match/error; Gate first/repeat/invalid/valid/task-change plus real mutation denial; real comment-hygiene rejection; unsupported completion blocked by observed final-state checks; Pi advisor failure retaining its dispatch guard; OpenCode first/subsequent transform behavior; and host traces for prefix ordering. Zero regression is required for hygiene catches, unsupported-completion rejection, and Gate mutation denial. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-010.md:10-13] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-011.md:19-35] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-014.md:23-31]

5. **Rollback is block-local.** Disable suppression and revert to the legacy renderer for the affected block when acknowledgement is absent, session identity is unknown, a lifecycle reset fails, semantic changes are missed, or enforcement behavior regresses. Do not roll back independent successful blocks. Gate remains open and independently enforced when a duplicate question is suppressed; Pi keeps the dispatch literal on advisor failure; Cursor contributes no live savings until an editor capture proves delivery. [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-014.md:15-31]

6. **Provider cache savings are explicitly outside the context-window totals.** Stable-prefix ordering may reduce billed uncached work and latency, but cached reads remain input tokens and OpenAI retains TPM accounting. No adapter receives a cache-hit percentage, dollar, latency, or context saving until a live host trace exposes exact prefix order and provider cache usage fields. The quantitative table above measures semantic omission/consolidation only. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching] [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching] [SOURCE: .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-013.md:7-19]

## Ruled Out
- Counting Cursor's configured editor hook as observed savings; only the zero-delivery CLI probes are observed.
- Treating one first Gate trigger as removable; only unchanged re-delivery is suppressed.
- Removing Pi's dispatch guard without equivalent native enforcement.
- Folding variable continuity, goal, compiled-route, recovery, warning, or maintenance output into exact fixed totals.
- Reporting provider cache reuse as context-window reduction.

## Dead Ends
- Exact model-token totals remain blocked on an available tokenizer vocabulary and provider-specific serialization.
- Live provider-cache percentages remain blocked on host traces and cache usage telemetry.
- No further detached-lineage iteration is recommended: this is the configured maximum iteration, not a convergence stop.

## Edge Cases
- Ambiguous input: “1-turn total” can include a cold start or mean prompt-only. The main matrix includes the deterministic cold/first-epoch cost; the event table exposes prompt-only increments.
- Contradictory evidence: Cursor source registration implies reachability, while three CLI probes found no delivery. Both are retained as configured-hypothetical versus observed-live rows.
- Missing dependencies: cached tokenizer vocabulary; current live captures for all six hosts; variable payload fixtures; provider cache telemetry.
- Partial success: fixed source-owned totals and rankings are complete; variable and live-provider effects remain bounded, not fabricated.

## Sources Consulted
- `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-010.md:8-13`
- `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-011.md:19-35`
- `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-012.md:7-37`
- `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-013.md:7-19`
- `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-014.md:11-31`
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:49-106`
- `https://developers.openai.com/api/docs/guides/prompt-caching`
- `https://platform.claude.com/docs/en/build-with-claude/prompt-caching`
- `command: python3 cadence arithmetic over labeled estimator fixtures`

## Assessment
- New information ratio: 0.85
- Questions addressed: final measured before/after totals; six-runtime event separation; ranked safe reductions; guardrail tests; rollback; cache/context distinction.
- Questions answered: the final fixed quantitative recommendation set and its release conditions. Exact tokenizer, variable payload, live Cursor editor, and provider-cache effect sizes remain explicitly unresolved.

## Reflection
- What worked and why: preserving cadence categories before arithmetic prevented Gate, advisor-change, lifecycle, and Pi-only costs from being averaged into misleading per-turn totals.
- What did not work and why: accumulated static evidence cannot establish current host delivery or provider cache hits, so those values remain unclaimed.
- What I would do differently: collect a two-turn plus reset trace from every host before implementation, using the exact fixture manifest unchanged.

## Recommended Next Focus
End this max-iteration lineage. Implementation should begin only after the behavioral gate suite and live baseline captures are recorded; the first rollout unit is directives-only silence plus the compact epoch capsule behind a block-local rollback flag.
