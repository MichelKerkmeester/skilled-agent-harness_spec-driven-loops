# Iteration 2: Residual duplication after the applied P2 simplifications

## Focus

Follow the strategy's next focus: trace remaining writer, loader, parser, walker, refusal-ordering, and export machinery across `heal-spec-docs.cjs`, `upgrade-legacy.mjs`, and `frontmatter-migration.ts`; decide whether the eight applied P2 simplifications went far enough for this narrow CLI-surface slice. This is not a whole-build verdict. I read the run state before researching and treated all investigated files as read-only.

## Actions Taken

- Read config, state log, strategy, registry, dashboard, and iteration 1. The config identifies lineage session `2026-10-09T08:44:52Z`; the state log contains one prior iteration and an iteration-2 start marker. Strategy marks only the prior mode/flag question resolved and selects this duplication follow-up. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-config.json:28-42]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-state.jsonl:1-5]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-strategy.md:13-29]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-strategy.md:122-139]`
- Compared the current atomic writer, legacy-upgrade writers, loader call sites, frontmatter handling, packet walkers, refusal ordering, and module exports. The inspected source lines and line-level searches are cited below. I did not run builds or tests and did not modify any researched code, test, or spec.
- Checked the existing test references for mode order and selector use; they show direct selective-runner usage and an explicit mode-order test, but the bounded search did not find a direct test of `sortRefusals`. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:459-481]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:1284-1294]`

## Findings

1. **The targeted writer and healer-loader consolidation is real, but other writers have different contracts; do not unify them just to reduce repeated filesystem calls.** Anchor and lane repairs share `writeFileAtomic`, which replaces an existing file through a unique exclusive temporary file, restores its mode, syncs, and renames. `upgrade-legacy` routes both active and archived anchor repairs through that shared function, and `healerFor(context)` is now one small loader. Separately, `writeManifestFile` handles exclusive creation versus replacement of a private mode-0600 reversibility manifest, while `recordFindings` writes a different per-packet baseline format and checks for unchanged findings/refusals. These are visibly similar temp/write/rename sequences but not interchangeable contracts; collapsing them would require a broader shared API or could weaken mode, exclusivity, durability, or idempotence semantics. The repeated `healerFor(context)` calls in the archived loop are not evidence of expensive duplicate loading by themselves because `require` uses Node's module cache. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:597-626]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:802-804]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:923-938]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:329-360]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1153-1178]` `[SOURCE: .skilled/repo-rules/prevent-overengineering.md:114-129]`

2. **The apparent parser and walker duplication has different responsibilities, so no shared parser/walker abstraction is earned by the evidence.** `frontmatter-migration.ts` owns structured frontmatter detection/section parsing and is used by `fillMissingFrontmatter`; the healer's `frontmatterOf` only extracts the raw block for its own narrow healing checks. Replacing that specialized, minimal reader with the migration parser would couple the healer to migration semantics without evidence of a shared caller requirement. Similarly, the standalone healer walker finds packet directories under one root with its own skip rules, while `upgrade-legacy` delegates folder enumeration and then deduplicates nested roots, classifies archives, filters artifact trees, and sorts results. These walkers overlap in traversal purpose but not in their selection policy. A generic walker would need options for those policies, creating precisely the configuration surface the restraint rule says to earn with real callers. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:338-345]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:501-547]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:734-777]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:736-752]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:595-627]` `[SOURCE: .skilled/repo-rules/prevent-overengineering.md:114-129]`

3. **Refusal ordering and the remaining healer exports are integration contracts, not proven dead machinery; the eight P2 simplifications were not enough to close the narrow CLI review, but this iteration found no additional justified cross-file consolidation.** `runLaneModes` emits refusals in the fixed mode/document traversal, while `sortRefusals` produces canonical mode/document/reason ordering before the upgrade baseline comparison; the latter appears to support stable persisted output. A direct sorter test did not appear in the bounded test search, so that behavior is a test-coverage candidate if ordering is later simplified, not evidence that the sort is unnecessary. The healer still exports `writeFileAtomic` for the upgrade caller and the functions consumed by it; the frontmatter module's remaining exports are three public constants, not the two private helpers previously removed. The prior iteration independently found the lane selector and `--json` branch remain optional CLI interfaces with no observed in-repository non-test caller; therefore the eight applied changes did not go far enough for that narrow CLI-surface slice. Conversely, this conclusion does not justify deleting the distinct writers, parsers, walkers, refusal behavior, or required integration exports above. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332-1357]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1138-1148]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:1284-1294]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1467-1479]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:923-938]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1563-1567]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-001.md:15-21]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/implementation-summary.md:172-177]`

## Ruled Out

- Do not merge the specialized healer frontmatter reader with the full migration parser without a demonstrated shared contract; their visible responsibilities differ.
- Do not replace both packet discovery paths with a configurable generic walker based only on traversal similarity; active/archive/artifact and skip policies differ.
- Do not remove deterministic refusal sorting without checking the persisted-baseline equality contract and adding a focused ordering assertion.
- Do not merge the reversibility-manifest writer with the healer writer without preserving the manifest's exclusive-create and private-file semantics.

## Edge Cases

- Ambiguous input: “Duplicated machinery” could mean repeated filesystem primitives or equivalent behavior. I treated behavior and call contracts as decisive; repeated syntax alone is not proof of overengineering.
- Contradictory evidence: none found. The sources support distinct runtime responsibilities while the prior closeout reports removal of specific duplicates.
- Missing dependencies: none for this focus. The bounded search did not identify a direct `sortRefusals` test; this limits confidence about whether sorting is explicitly pinned.
- Partial success: no tests/builds were run because this is read-only research; conclusions are based on source and test inspection, not execution.

## Sources Consulted

- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-config.json`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-state.jsonl`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-strategy.md`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-dashboard.md`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-001.md`
- `.skilled/repo-rules/prevent-overengineering.md`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts`

## Assessment

- New information ratio: 0.83 (two fully new distinctions and one partial extension of the prior writer/loader consolidation finding).
- Questions addressed: residual duplicated machinery and whether the eight applied P2 simplifications went far enough for this narrow slice.
- Questions answered: **Where does duplicated machinery remain across heal-spec-docs.cjs, upgrade-legacy.mjs and frontmatter-migration.ts (writers, loaders, parsers, walkers, refusal ordering, exports), and did the eight applied P2 simplifications go far enough?**
- Questions remaining: three, covering orchestrator/doctor compatibility surface, test value/pinning, and the ranked simplification list.

## Reflection

- What worked and why: tracing actual callers and data contracts distinguished repeated syntax from interchangeable behavior, avoiding a speculative “one helper” recommendation.
- What did not work and why: a bounded textual search did not locate a direct refusal-sort test; source inspection alone cannot establish that stable output is intentionally pinned elsewhere.
- What I would do differently: inspect the phase-009/013 requirements and the doctor/orchestrator tests next, then verify whether any external consumer depends on the optional lane CLI selector or JSON format before ranking removals.

## Questions Answered

- Where does duplicated machinery remain across heal-spec-docs.cjs, upgrade-legacy.mjs and frontmatter-migration.ts (writers, loaders, parsers, walkers, refusal ordering, exports), and did the eight applied P2 simplifications go far enough?

## Questions Remaining

- Which parts of orchestrator.ts anchor validation (013) and the doctor update compatibility code and assets (009: planLayoutMove and its helpers, doctor-update-compat-action.yaml, the doctor scripts) carry fallbacks, states, configuration or abstraction no requirement asks for?
- Which tests for these files mirror the implementation, re-assert the framework or add a case per branch above the coverage floor, and which tests pin each candidate simplification?
- What is the ranked list of concrete simplifications, each with its expected line or complexity reduction, its risk, the tests that pin it, and whether a requirement forbids it?

## Recommended Next Focus

Compare the phase 013 anchor-validation contract and phase 009 doctor-update compatibility requirements against `orchestrator.ts`, `planLayoutMove`, the compatibility workflow asset, and doctor tests; identify only the branches not required by those contracts.
