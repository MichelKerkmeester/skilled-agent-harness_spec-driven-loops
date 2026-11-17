# Review Iteration 004

## Dimension

Maintainability: the shared literals and the test surface around the two files that carry the pass-five changes, and the cost of a safe follow-on change there.

## Dispatcher

Pass-five fan-out lineage `accuracy-runner-5` (area `accuracy-runner`). Sources read this iteration: `review/review-brief-5.txt`, `review/review-focus-5.txt`, `review/review-scope-5.txt`, and the lineage strategy.

## Files Reviewed

- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:50-70]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:300-327]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:515-535]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:625-640]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:271-292]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:407-468]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The arena marker's name is a literal in two modules, and no test asserts they agree** -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:61 and .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:523 -- the builder writes `.git/skilled-behaviour-arena` from its own `MARK`, and the runner resolves `MARK` from its own copy of the same literal before refusing an unprepared checkout. Nothing imports one from the other and no test compares them, so the pair that makes an arena usable is held together by a copied string.
   Finding class: maintainability (duplicated contract literal)
   Scope proof: both copies are in the scoped files, and the guards test that reads the marker writes it by hand rather than through the builder's constant.
   Affected surface hints: `MARK` in both files, `buildArena`'s marker write, `liveArmRefusal`'s marker read, and the `arena builder` test cases.
   Case: a follow-on change that renames the marker in the builder only. Every arena it builds is then refused by the runner as `arena_unprepared`, and the whole behaviour suite still passes because the test writes the marker with its own literal (`command-behaviour-guards.vitest.ts:286`).

2. **The guards suite never exercises the builder's copy path, so the dotenv skip, the clonefile flag and the ignored-tree walk are untested** -- .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:407-468 -- both `arena builder` cases commit only `AGENTS.md` and an optional `CLAUDE.md`, so `copyPlan` returns an empty list and `runCp` is never called. The dotenv skip, the `dist` stamp and the `node_modules` copy -- the parts iteration 2 and 3 found gaps in -- have no test at all, and the Linux vitest lane that runs this file therefore never touches `cp -Rc`.
   Finding class: maintainability (coverage gap on the changed surface)
   Scope proof: the test file is the scoped guards test and the untested code is the scoped builder; the claim is that a change to `holdsDotenv` or `runCp` cannot fail this suite.
   Affected surface hints: `copyPlan`, `holdsDotenv`, `copyPath`, `runCp`, `stampBuildTree`, and the `arena builder` describe block.
   Case: a follow-on change that deletes the `DOTENV_PATTERN` check from `copyPath`. The suite still passes, because no test builds an arena from a source that holds an ignored build tree with a `.env` file in it.

## Traceability Checks

- `spec_code`: the two marker sites and the two builder test cases are the last scoped lines not yet matched to a claim; both are recorded above. Pass.
- `checklist_evidence`: the pass-five brief's "docs against code" and "holdout hygiene" asks were answered in iterations 2-3; this iteration's asks are the test surface and the shared literals. Pass.
- `feature_catalog_code`: unchanged from iteration 3; the feature-catalog pages are `docs-metadata`'s area. Partial by scope.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts` `arena builder`: both cases call the builder CLI and assert only the pointer file and `git status` cleanliness, which is why the copy path is unexercised.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts`: the scorer facts are covered directly, including `normalize`, `startState`, `loopInit`, `commandLines` and `vibeRecords`, so the iteration-1 findings are coverage questions rather than untested code.

## Edge Cases

- A test that builds a source with an ignored tree would need to avoid a real `node_modules` copy, so the cheapest coverage is a small `dist` with one `.env` file and one nested folder.
- The marker rename case is only reachable by a follow-on edit, not by any runtime input, which is why it is P2 rather than a behaviour finding.

## Confirmed-Clean Surfaces

- The scorer's exported facts are all exercised by `command-transcript-score.vitest.ts`, and the file's own entry guard keeps an imported module from parsing the host's argv.
- `entry guard` covers the symlinked-entry case for both the runner and the scorer, so the CLI entry check is tested through the shape Node actually produces.
- `childEnv`, `armFor`, `freshRowsFrom`, `assertFreshRowsUnique`, `assertFreshRun`, `liveArmRefusal` and `restorePointer` all have direct tests, so only the arena's copy path is uncovered.

## Ruled Out

- `workflow.unscored` as a dead field: it carries the run-level unscored count and prints it in the workflow block, so it is a duplicate name rather than a dead count (recorded in iteration 1).
- A broad test-only export surface in the scorer: every exported fact is asserted by the scoped test file, so the surface is used rather than speculative.
- The `--set chat` split filter: recorded in iteration 2.

## Next Focus

- Dimension: none -- all four dimensions are covered and this is the fourth of four permitted iterations
- Focus area: synthesis
- Reason: `maxIterations` is reached; no dimension remains and the remaining findings are P2 advisories
- Rotation status: swept
- Required evidence: none outstanding

Review verdict: PASS
