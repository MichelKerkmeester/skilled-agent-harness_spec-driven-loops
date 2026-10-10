# Iteration 5: Rank the remaining simplifications

## Focus

Broaden and rank the concrete simplifications left after the previous passes. Recheck the strongest healer CLI candidates against repository callers and tests, revisit the doctor action's repeated failure instructions, and verify any previously described optional validation behavior against its phase requirement before finalizing the ranking.

## Actions Taken

- Read the config, state log and strategy before choosing the focus. Then read the dashboard, findings registry and iteration 4 to carry forward settled findings instead of repeating them. The state contains four iteration records and an iteration-5 start event. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-config.json:28-43] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-state.jsonl:4-9] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-strategy.md:74-104] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-004.md:23-29]
- Searched production files across the repository for lane-runner and doctor failure-field references, then checked the corresponding CLI, tests and phase requirements. The search found the documented selector, the CLI implementation and the all-mode upgrade caller, but no other production caller of the lane subset CLI. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332-1391] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:879-893] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:113-113]
- Compared the phase-013 close-before-open edge case with the current validator and its focused test. This check corrects an earlier registry assessment that treated the diagnostic as outside the phase requirement. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:172-178] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:758-765] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:185-198] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:267-283]

## Findings

1. **Rank 1: Remove the healer CLI's `--mode` subset selector, but retain `runLaneModes(options.modes)` for focused tests.** The selector parser, unknown-name branch and CLI forwarding account for about 18 implementation lines before updating the usage comment and README. The production upgrade caller invokes the runner without a subset, while tests use the programmatic option to isolate individual behaviors. The repository-wide production search found no separate CLI caller, but this does not rule out external scripts. Risk is medium. No phase explicitly requires subset selection: phase 015 requires all five modes to be exposed and integrated. Keep the five-mode behavior tests, exact mode-order check, sequence/idempotence tests and upgrade integration; remove only the CLI selector and its invalid-name assertion. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332-1336] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360-1391] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:879-893] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:459-489] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:1284-1324] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [INFERENCE: the bounded production search found no additional repository caller; an external caller remains possible.]

2. **Rank 2: Remove the lane CLI's `--json` output branch.** The production branch is about five lines, plus its usage text and JSON-only assertions. The focused test checks one output line, packet identity and refusal-array shape; the same test already pins the default dry-run and no-write behavior. Risk is medium because a repository search cannot rule out external consumers. No phase requires JSON output. Keep the human-readable dry run and no-write assertion. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360-1363] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1387-1401] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:567-592] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77]

3. **Rank 3, low yield: Consider merging the doctor action's two failure properties into one complete instruction.** `step_failure` and `on_step_failure` both say to append `step-failed` and stop with `STATUS=FAILED`; the former adds the exit code, while the latter adds no-retry and rollback-block reporting. A single property could preserve the union of those duties and remove a small amount of duplicated YAML and test scaffolding. Phase 009 requires step logging and rollback guidance, not two separate properties. Risk is medium because no in-repository production consumer explains whether the two property names have distinct workflow semantics, and the current test asserts them independently. Before implementing, confirm the action-field contract; if combined, test every retained detail against the one property. [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:123-127] [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs:820-834] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:117-120] [INFERENCE: repository-wide production references to these property names occur only in the YAML asset; whether an external workflow interpreter distinguishes them is unknown.]

4. **Do not rank removal of the validator's close-before-open tracking as a simplification.** Phase 013 explicitly says that a closer appearing before its own opener is reported. The `opensAhead` and `openedSoFar` tracking implements that case, and the anchor-contract test moves a closer above its opener and asserts the diagnostic. An earlier registry finding described this behavior as an unnamed extra diagnostic. That assessment is contradicted by the phase edge case and test, so this behavior is required rather than optional. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:172-178] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:732-763] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:185-198] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:267-283]

5. **The eight applied P2 changes went far enough for the proven shared machinery, but not for the optional healer CLI surface.** Keep the writer and healer-loader consolidation and do not merge the manifest writer, focused frontmatter reader, migration parser or active/archive walkers: their file modes, exclusivity, parsing and selection policies differ. The two remaining CLI branches above are not required by the reviewed phases and are the strongest further cuts. This is a narrow-surface judgment, not a verdict that the broader build is overengineered. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-strategy.md:207-214] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-004.md:17-29] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:230-263] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:114-137]

## Questions Answered

- What is the ranked list of concrete simplifications, each with its expected line or complexity reduction, its risk, the tests that pin it, and whether a requirement forbids it?

## Questions Remaining

No tracked strategy question remains. External consumers of the healer CLI and any external distinction between the two doctor failure properties remain unknown. Search those consumers or the action-field contract before changing either surface.

## Ruled Out

- Removing the five lane modes, their derivability/refusal behavior, idempotence gates or ordered upgrade integration. Phase 015 requires these behaviors and tests. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114]
- Removing the doctor layout-state cases, preview and collision checks, separate approvals, logs, interrupted-run recovery or rollback reporting. Phase 009 requires these safety and recovery behaviors. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:110-120] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:170-182]
- Removing the close-before-open diagnostic. Phase 013 explicitly requires it, and a focused test pins it. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:172-178] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:185-198]
- Merging distinct file writers, parsers or walkers, or removing refusal sorting based on the evidence from the previous iteration. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:230-263] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-004.md:31-35]

## Edge Cases

- Ambiguous input: phase 015 says the five modes are exposed through the healer but does not explicitly require per-mode CLI selection. Rank the selector as optional, with medium external-caller risk, and preserve the five modes plus their test seam.
- Contradictory evidence: the findings registry's earlier characterization of close-before-open as an unnamed extra is contradicted by phase 013's explicit edge case and the focused test. Treat the phase requirement and test as controlling for this ranking.
- Missing dependencies: none.
- Partial success: none. This is a static research pass; no code, tests or spec documents were modified and no tests were run.

## Sources Consulted

- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-config.json`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-state.jsonl`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-strategy.md`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-dashboard.md`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-004.md`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts`
- `.skilled/commands/doctor/assets/doctor-update-compat-action.yaml`
- `.skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md`
- `.skilled/repo-rules/prevent-overengineering.md`

## Assessment

- New information ratio: 0.70.
- Novelty calculation: one of five findings is new, correcting the anchor-order assessment; four partially refine the existing rank. The 0.10 synthesis bonus reflects resolving that mismatch and separating optional surface reductions from requirement-backed behavior.
- Questions answered: the ranked-simplification question.
- Questions remaining: no tracked strategy questions. The external CLI consumers and any external action-field semantics remain unknown.

## Reflection

- What worked and why: comparing the current phase edge case and test directly against the earlier registry note exposed that the anchor-order diagnostic was requirement-backed, not optional.
- What did not work and why: the in-repository search cannot prove that external tools do not use either healer CLI option or rely on the doctor action's field names.
- What I would do differently: before implementing the optional removals, check external entrypoints and the action-field contract, then keep only tests that pin the retained public behaviors.

## Next Focus

No next iteration is scheduled because this was iteration 5 of 5. If the recommendations proceed to implementation, first confirm external CLI usage and the doctor action schema, then preserve the requirement-backed lane and anchor-validation behavior.
