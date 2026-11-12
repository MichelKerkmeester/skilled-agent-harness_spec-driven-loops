# Iteration 10: The ranked cut list — seven candidates, and the ones that save nothing

## Focus

Assembly and double-count check. Every candidate found across nine iterations is restated with its file path, its class (delete, merge, narrow, move), the time it saves per commit, push or CI run, the regression it would stop catching, and the confidence behind the number. Negative results are ranked too, because "this saves nothing" is a finding the phase must carry.

## Actions Taken

1. Collected every candidate from iterations 1-9 and re-read each source line the class depends on.
2. Split the `Advisory Checks` 87 s mean using the two measured step lengths and labelled the remainder as inference.
3. Checked the seven candidates against each other for double counting: the advisory steps are nested inside one workflow mean, so their savings cannot be summed with that mean.
4. Checked each candidate against the settled list (caching, trigger hygiene, workflow consolidation, per-file splits) and dropped anything that re-proposed settled work.

## Findings

1. **Relocate 13 gate-critical node:test suites, then delete the report-only step.** Paths `.github/workflows/advisory-checks.yml:36` step `Node test suites (report-only)` and `.skilled/scripts/run-node-tests.mjs`. Class: **move**, then **delete**. Time: about 75-80 s per push and per PR (87 s workflow mean minus the two measured validators at 7.3 s), inferred rather than measured. Regression it stops catching: none — the 13 suites still run, now inside a blocking job. Confidence: high on the step composition, medium on the split. [SOURCE: .github/workflows/advisory-checks.yml:36] [SOURCE: .skilled/scripts/run-node-tests.mjs:32]

2. **Parallelise the advisor default suite and fold the stress config into it.** Paths `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:40` and `vitest.stress.config.ts`. Class: **merge**. Time: about 60-90 s per advisor run if the serial floor of 2.7 minutes halves, plus 30 s added back for the stress suite that currently never runs — so the net is 30-60 s. Regression it stops catching: a shared skill-graph database assumption if the suites cannot run concurrently, which is why this is a hypothesis. Confidence: medium on the mechanism, low on the number. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:40]

3. **Make the doc-model reference check blocking or delete it.** Path `.github/workflows/advisory-checks.yml:50`. Class: **move** (to blocking) preferred over delete. Time: 2.77 s measured, so the time saving is nil; the gain is that a check which cannot pass or fail currently enforces nothing. Regression it stops catching if deleted: doc-model drift, which is currently "caught" only by whoever opens the log. Confidence: high (measured). [SOURCE: .github/workflows/advisory-checks.yml:50]

4. **Delete the advisory trigger-index freshness step and leave the artifact to its rebuild workflow.** Path `.github/workflows/advisory-checks.yml:67` against `.github/workflows/trigger-index-rebuild.yml`. Class: **delete**. Time: 4.53 s measured per run. Regression it stops catching: trigger-index drift before merge, which the rebuild workflow repairs after merge anyway, so the window it covers is the PR itself. Confidence: high on the cost, medium on the coverage trade-off. [SOURCE: .github/workflows/advisory-checks.yml:67]

5. **Archive the 111 spec-tree test files.** Paths under `specs/`. Class: **delete** (from the census, not from the tree if provenance matters). Time: 0 s — no CI path runs them. Regression it stops catching: none. Confidence: high. Ranked last on time, first on honesty about the 1,270-file baseline. [SOURCE: .skilled/scripts/run-node-tests.mjs:20]

6. **Merge the playbook validator's two passes into one.** Path `.github/workflows/playbook-operator-contract.yml:72` and `:79`. Class: **merge**. Time: about 1 s (one Node start). Regression it stops catching: none, if `--strict --format json` preserves the fleet listing the second pass reads. Confidence: medium (the flag combination was not executed). [SOURCE: .github/workflows/playbook-operator-contract.yml:72]

7. **Leave the git hooks alone.** Paths `.skilled/scripts/git-hooks/*`. Class: **no cut**. Time saved by any hook deletion: under 1 s per commit, against a measured 1-2 s total. Regression it stops catching: whichever gate is deleted, plus the uninstalled-hook case for the CI backstops that exist because the hook can be absent. Confidence: high (measured). [SOURCE: .skilled/scripts/git-hooks/pre-commit:98]

## Ruled Out

- Summing candidate 1 with candidates 3 and 4: they are steps inside the same 87 s workflow mean, so adding them double-counts.
- Any cut that re-proposes trigger changes, caching, workflow consolidation or per-file splits: settled in `002-ci-workflow-efficiency` and phases 001-005.
- A cut inside `Spec-Kit Check`: the 339 vitest files it carries have no other door, so narrowing it without relocating them is coverage loss, not a saving.

## Dead Ends

- Finding a single cut worth several minutes. The measured sweep is 4,129 s across 21 workflows with no duplication large enough to remove: the expensive workflows are expensive because of test volume and installs, both of which are real work or settled ground.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the phase exists to find minutes, and the honest total of the ranked cuts is about 2-3 minutes per sweep. The evidence supports that smaller number, and the synthesis must state it rather than inflate the list.
- Missing dependencies: no per-step CI durations, so candidates 1, 2 and 6 carry inferred numbers.
- Partial success: candidates 3, 4, 5 and 7 are measured; the ranking's headline numbers are not.

## Sources Consulted

- Iterations 1-9 of this lineage
- `.github/workflows/advisory-checks.yml`
- `.skilled/scripts/run-node-tests.mjs`
- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts`
- `.github/workflows/playbook-operator-contract.yml`
- `.skilled/scripts/git-hooks/pre-commit`

## SCOPE VIOLATIONS

None.

## Assessment

- New information ratio: 0.55
- Questions addressed: all five strategy key questions are represented in the ranked list; none adds new external evidence this iteration, which is why the ratio is low despite the synthesis value.
- Questions answered: none newly; the list consolidates prior answers.

## Reflection

- What worked and why: ranking by measured sweep share first and candidate identity second. It kept a 10 s guard out of the top of the list even though it is pure duplication.
- What did not work and why: hoping the candidates would sum to something the operator would notice. The arithmetic refused it — the two biggest workflows are big because of work nobody has proposed removing.
- What I would do differently: build the sweep-sum table in iteration 1 so every later iteration prices itself against the same denominator.

## Recommended Next Focus

Synthesis. The ranked list is complete; what remains is to state the total honestly, mark which numbers are measured and which are inferred, and hand the operator the two decisions the evidence actually supports — relocate the 13 suites, and decide whether the advisor parallel hypothesis is worth a measurement run.
