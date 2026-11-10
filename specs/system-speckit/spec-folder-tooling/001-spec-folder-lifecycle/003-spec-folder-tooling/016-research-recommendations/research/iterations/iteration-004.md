# Iteration 4: Test pins and remaining simplifications

## Focus

Determine which current tests protect required behavior versus optional CLI branches, then rank the remaining low-risk reductions without reopening settled writer, parser, walker, or refusal-ordering decisions.

## Actions Taken

- Read the initialized config, state log, strategy, findings registry, and dashboard first. The registry already records distinct contracts for the healer writer, the private reversibility-manifest writer, the frontmatter reader and parser, and the active/archive discovery paths. I did not repeat those as new recommendations. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:225-244]
- Searched the focused healer, upgrade, frontmatter, and anchor test files for the selector, JSON output, lane sequence, refusal ordering, and migration parser. The intended iteration and delta paths were absent before writing. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:567-592] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1247-1283]
- Compared those tests with the phase-015 scope and its explicit requirements for all five modes, per-mode refusal and idempotence behavior, integration order, and realistic tests. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114]

## Findings

1. **Keep the behavior tests for the five lane modes and their order.** The individual tests exercise each mode's transformation, refusal, and second-run no-op. The exact-order assertion and the sequence fixture are not interchangeable: the sequence fixture produces only three actions, while the explicit list pins the full five-mode contract. Phase 015 requires all five modes and their order, plus refusal, idempotence, and realistic test coverage. These tests protect requirements rather than mirror implementation branches. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:1284-1324] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114]

2. **The CLI's `--mode` subset selector is the strongest remaining reduction, but remove only the CLI surface, not the runner's `options.modes` seam.** `upgrade-legacy` calls `runLaneModes` without a mode list, while tests use the runner option to isolate individual transformations. The current CLI test exercises only the invalid-name error path, not valid per-mode CLI selection. Removing CLI parsing and dispatch is estimated at roughly 10-15 production lines, plus the invalid-selector assertions. Risk is medium because external scripts were not searched beyond the repository. Phase 015 requires all five modes to be exposed and integrated, but does not explicitly require selecting a subset from the CLI. Treat the word “exposed” as ambiguous and preserve the all-mode CLI and sequence unless a caller proves it needs subset selection. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332-1336] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360-1391] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:879-893] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:459-489] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:567-592] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77]

3. **The CLI's `--json` output is another optional branch, with a narrower but less certain benefit.** The test parses one output line and checks only the packet and refusal shape. The prior bounded caller search recorded no in-repository non-test consumer. Removing the output branch is estimated at 5-8 production lines and the JSON-only assertions. Risk is medium because an external consumer may exist. No phase requirement names a JSON CLI format. Keep the default dry-run and its no-write assertion. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1392-1401] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:567-585] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:176-178] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77]

4. **The eight applied P2 changes were sufficient for the demonstrated duplicate machinery, but not for the optional CLI branches.** Keep the existing atomic writer and healer loader consolidation. The upgrade-baseline writer, focused healer frontmatter reader, migration parser, and separate packet walkers have different contracts, so merging them would add policy switches or risk exclusive-create, private-file, filtering, or parsing behavior. Refusal sorting also remains tied to stable persisted baselines. The upgrade test checks that a second full run preserves the exact refusal array, but the bounded test search found no direct `sortRefusals` ordering assertion. Do not remove the sort without a focused canonical-order test. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-strategy.md:183] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:207-244] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1141-1160] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1267-1283] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:511-547] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:338-341]

## Ranked Simplifications

1. Remove only the `--mode` CLI selector: estimated 10-15 production lines and the invalid-selector assertion. Risk: medium, due unknown external consumers and the ambiguity of “exposed.” Pin the retained contract with each mode's transformation/refusal/idempotence tests, the five-mode list, the sequence test, and the upgrade integration. No explicit phase requirement mandates subset selection. Do not remove `options.modes`, which is used by the mode-isolated tests. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332-1391] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:459-489] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:1284-1324] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77]
2. Remove the `--json` branch: estimated 5-8 production lines and JSON-specific assertions. Risk: medium, because the repository search cannot rule out outside consumers. Pin the retained human-readable dry-run and no-write behavior. No phase requirement forbids removing this format. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1392-1401] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:567-585]
3. Defer trimming the anchor-order diagnostic in `orchestrator.ts`: the earlier review estimated roughly 5-10 lines, but removing its look-ahead tracking may change existing pairing diagnostics. No focused test was inspected in that pass. Risk is high relative to the small saving. First add or locate a test for a closer preceding a later opener, then reassess. Phase 013 does not name that diagnostic, but that alone does not waive pre-existing validation behavior. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:729-775] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:261-263]

These line reductions are source-level estimates, not measured diffs. The repository rule says every option should have a current caller and an extra test should catch a real failure. The current evidence supports evaluating the two CLI branches, not adding broad test matrices or another shared abstraction. [SOURCE: .skilled/repo-rules/prevent-overengineering.md:114-129] [SOURCE: AGENTS.md:196-206]

## Ruled Out

- Do not merge the manifest writer with the healer writer, the focused healer frontmatter reader with the full migration parser, or the active and archive walkers. The existing evidence shows distinct write, parse, and selection contracts. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:225-244]
- Do not remove the lane-mode behaviors, their refusal and idempotence gates, or the ordered all-mode run. Phase 015 requires them. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114]
- Do not remove refusal sorting based on the present evidence. A direct order assertion is missing, but baseline stability is exercised by repeated-run equality. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1141-1160] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1267-1283]

## Dead Ends

No new approach was tried and failed. The earlier blocked consolidation directions remain blocked; this iteration adds test-contract evidence rather than reopening them. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-strategy.md:70-95]

## Edge Cases

- Ambiguous input: phase 015 says all five modes are “exposed” through the healer but does not say they must be individually selectable on the CLI. The narrow reading is to preserve all five modes and the ordered all-mode CLI while treating subset selection as optional pending caller evidence.
- Contradictory evidence: none found.
- Missing dependencies: none.
- Partial success: none. This was a static research pass. No tests were run and no code, test, or spec files were changed.

## Sources Consulted

- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-config.json`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-state.jsonl`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-strategy.md`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-dashboard.md`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts`
- `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md`
- `.skilled/repo-rules/prevent-overengineering.md`
- `AGENTS.md`

## Assessment

- New information ratio: 0.625
- Novelty calculation: one of four findings adds new test-contract evidence; three refine earlier simplification assessments with direct caller and test evidence.
- Questions addressed:
  - Which tests for these files mirror the implementation, re-assert the framework or add a case per branch above the coverage floor, and which tests pin each candidate simplification?
  - What is the ranked list of concrete simplifications, each with its expected line or complexity reduction, its risk, the tests that pin it, and whether a requirement forbids it?
- Questions answered: both questions above.
- Questions remaining: no strategy key question remains after this iteration. External `--mode` and `--json` consumers are not ruled out by an in-repository search. The meaning of “exposed” in phase 015 and the doctor workflow's separate failure fields remain narrow follow-up checks.

## Reflection

- What worked and why: reading the focused tests alongside the phase requirement separated test-only mode isolation from the optional CLI selector and distinguished list pinning from actual ordered execution.
- What did not work and why: a current `sortRefusals` test was not found in the bounded search. Existing repeated-run equality proves stable output for identical inputs, not canonical ordering across different input orders.
- What I would do differently: in the final pass, search for external consumers of the optional CLI formats and trace the doctor workflow fields to their runtime consumer before converting either cleanup candidate into an implementation recommendation.

## Recommended Next Focus

Use the final iteration to verify whether external callers rely on the healer's subset or JSON CLI modes, inspect the doctor workflow's failure-field consumer, and consolidate the ranked candidate list across the remaining in-scope tests without reopening settled writer, parser, or walker contracts.

## Questions Answered

- Which tests for these files mirror the implementation, re-assert the framework or add a case per branch above the coverage floor, and which tests pin each candidate simplification?
- What is the ranked list of concrete simplifications, each with its expected line or complexity reduction, its risk, the tests that pin it, and whether a requirement forbids it?

## Questions Remaining

No strategy question remains. Caller evidence for the two optional CLI branches and the doctor workflow's failure-field consumer remains unverified.
