# Iteration 1: Heal-mode selectors and branches

## Focus

The first strategy question asks whether the anchor-repair and lane-mode interfaces contain options or branches beyond phases 011, 012 and 015. I compared the phase requirements with the current healer, upgrade integration and tests. I did not edit or run the researched code or tests.

## Actions Taken

- Read the run config, state log, strategy and registry before selecting the focus. The state log had no prior `iteration` record, the lineage mode is `new`, and the strategy had no blocked or saturated approach. The computed iteration is 1. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-config.json:28-42]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-state.jsonl:1-5]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-strategy.md:64-76]`
- Compared the phase 011, 012 and 015 scopes and requirements with the current mode registry, CLI branches, upgrade steps and focused tests. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode/spec.md:48-52]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs/spec.md:47-50]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77]`
- Searched non-test code under `.skilled/` for the literal lane CLI and JSON invocation. The matches were the healer's usage declaration and its `--lane-modes` dispatch branch; no separate non-test caller surfaced in that bounded search. This is evidence about those literal references, not proof that no external caller exists. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:20-23]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1405-1414]`

## Findings

1. **Rank 1 simplification candidate: remove the per-mode selector from the lane runner and CLI, unless an actual non-test caller is identified.** `LANE_MODES` already defines the five modes in a fixed order. `runLaneModes` adds a second selective execution path through `options.modes`, and the CLI adds repeated `--mode` parsing, unknown-name handling and filtering. `upgrade-legacy` calls the runner without a mode list, so its production integration always runs the complete sequence. The phase requires the five modes and their ordered integration, but does not explicitly require selecting a subset. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:153-164]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332-1358]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360-1391]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:874-893]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:73-77]`. Estimate: about 20 production lines for selector parsing/filtering, with test adaptations. Risk: medium, because an untracked external script could depend on the undocumented subset interface. Pin the five individual mode behaviors through their exported functions, keep the mode-order and sequence tests, and keep `upgrade-legacy`'s all-modes integration test. The phrase “exposed through `heal-spec-docs.cjs`” is ambiguous about individual selection; the spec does not say “individually selectable,” so this recommendation treats the required exposure as the five modes being available through the healer and the full runner.

2. **Rank 2 simplification candidate: remove the lane CLI's `--json` output branch.** The flag is parsed separately and changes the output shape, but the scoped search found no non-test invocation and phase 015 does not require a machine-readable CLI format. Its focused test is the only observed consumer of that format. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360-1363]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1392-1401]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:567-592]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:73-77]`. Estimate: roughly 5-8 production lines plus the JSON-only assertions. Risk: medium for untracked consumers. Keep the CLI dry-run/no-write assertion and the all-five sequence test. No phase requirement forbids removing this output format.

3. **Do not simplify away the distinct anchor and archive branches.** Phase 011 requires duplicate-anchor repair, questions-anchor un-nesting, dry-run/apply behavior, integration into `upgrade-legacy`, and marker-only un-nesting of archived packets while other anchor repairs stay off archives. Phase 015 requires all five listed lane modes, their refusal/idempotence behavior and integration. The current active path runs anchor repair, healer, lane modes and derivation in order; the archived path runs only questions-anchor un-nesting and derivation. Those are requirement-backed branches, not speculative flexibility. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:72-80]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:104-116]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:73-82]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:825-849]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:874-903]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:923-961]`. Phase 012's additional grouped-detail behavior is explicitly required, and `upgrade-legacy` implements it as a report function rather than a separate mode flag. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:47-50]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:516-548]`

4. **The eight applied P2 simplifications did not go far enough for this narrow CLI-surface slice, but this is not a whole-build verdict.** The prior closeout lists changes to section organization, duplicate caches and writers, an unreachable fallback, a constant and exports. The optional selector and JSON branches remain in the current healer. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/implementation-summary.md:172-177]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332-1403]`. The recommendation changes if a real caller of either optional interface is found.

## Ruled Out

- Removing the anchor-repair mode or its dry-run/apply route: phase 011 explicitly requires the repair mode, correct dry run and upgrade integration. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:48-52]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:72-80]`
- Removing any of the five lane modes, their refusal/idempotence gates or the all-mode sequence: phase 015 requires each. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:73-77]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:103-113]`
- Merging archived packets into the active repair path: phase 011 explicitly restricts archive edits to questions-anchor un-nesting. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:78-80]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:114-116]`
- Removing grouped-detail reporting: phase 012 requires grouped failures with detail counts. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:47-50]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:104-113]`

## Edge Cases

- Ambiguous input: phase 015 says the modes are “exposed through” the healer, but does not say whether each must be separately selectable. I chose the narrower reading that makes the fixed five-mode runner and exported individual functions sufficient; a documented or real separate caller would change the recommendation.
- Contradictory evidence: none found between the phase requirements and the inspected code. The concern is an unstated external consumer, not a source conflict.
- Missing dependencies: none for this focus.
- Partial success: none. This is a source-backed recommendation, not an implementation or test run.

## Sources Consulted

- `.skilled/repo-rules/prevent-overengineering.md:114-137`
- `specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:48-116`
- `specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/implementation-summary.md:172-177`
- `specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:47-113`
- `specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:73-113`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332-1403`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:825-961`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:567-592`

## Assessment

- New information ratio: 1.0 (three new findings; none partially new or redundant against this lineage's zero prior iteration records).
- Questions addressed: the first strategy question, answered for healer modes, flags and active/archive branches.
- Questions answered: Which modes, flags, options and branches in heal-spec-docs.cjs and upgrade-legacy.mjs (anchor repair from 011, folded one-off repairs from 012, lane rules as heal modes from 015) go beyond what those phase specs require?
- Questions remaining: four, listed below.

## Reflection

- What worked and why: comparing the exact phase scope with the live CLI branches separated optional interface convenience from required repair behavior.
- What did not work and why: no second-model review was run because the dispatch forbids sub-agents and CLI dispatch. The judgment is grounded in phase requirements, current call paths, tests and a bounded non-test reference search; an external consumer could alter the trade-off.
- What I would do differently: verify any candidate consumer at its call site before removing either interface, then pin its absence or retained contract with focused tests.

## Questions Answered

- Which modes, flags, options and branches in heal-spec-docs.cjs and upgrade-legacy.mjs (anchor repair from 011, folded one-off repairs from 012, lane rules as heal modes from 015) go beyond what those phase specs require?

## Questions Remaining

- Where does duplicated machinery remain across heal-spec-docs.cjs, upgrade-legacy.mjs and frontmatter-migration.ts (writers, loaders, parsers, walkers, refusal ordering, exports), and did the eight applied P2 simplifications go far enough?
- Which parts of orchestrator.ts anchor validation (013) and the doctor update compatibility code and assets (009: planLayoutMove and its helpers, doctor-update-compat-action.yaml, the doctor scripts) carry fallbacks, states, configuration or abstraction no requirement asks for?
- Which tests for these files mirror the implementation, re-assert the framework or add a case per branch above the coverage floor, and which tests pin each candidate simplification?
- What is the ranked list of concrete simplifications, each with its expected line or complexity reduction, its risk, the tests that pin it, and whether a requirement forbids it?

## Recommended Next Focus

Trace writer/loader/parser/walker/refusal-ordering call sites across `heal-spec-docs.cjs`, `upgrade-legacy.mjs` and `frontmatter-migration.ts`, then compare the residual duplication with the eight already-applied P2 changes.
