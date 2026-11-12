# Iteration 10: Consolidation, verification status and the closing ranked list

## Focus

Final iteration: recompute the ranked list against all nine prior iterations, separate claims that a command confirmed from claims that remain inferred, and close the packet's stated success criteria — five largest run-time costs on the commit, push and CI paths, each with a duration, and every recommendation carrying the regression it stops catching. This iteration also re-runs the verifications the operator would otherwise have to trust.

## Actions Taken

1. Re-ran the four verification commands that carry the top recommendations: checker-file identity, sharded-runner callers, legacy-harness line count, and the test census.
2. Read the strategy file's machine-owned sections to check whether any earlier recommendation was already marked exhausted.
3. Recomputed the ranked list from the measured step durations in iterations 7 and 9.
4. Classified every claim by evidence type: measured, command-confirmed, or inferred.

## Findings

1. The five largest measured run-time costs are: the spec-kit CLI Vitest project at 490s, the advisor default suite at 309s, the deep-loop runtime suite at 306s, the spec-kit legacy lane at 161s, and the doctor script suite at 110s. Together they are 1,376s (about 23 minutes) of the 3,762s measured across the fourteen workflows inspected. [INFERENCE: based on the per-step durations recorded in iterations 7 and 9]
2. The four guard deletions total 385s per pull request: `comment-hygiene` 92s, `naming-standard-guard` 88s, `agent-mirror-sync` 85s, and the duplicate-map job of `routing-registry-drift` up to 120s. Adding the legacy lane's 161s upper bound takes the ceiling to 546s, about nine minutes per pull request. [INFERENCE: based on the measured job durations in iterations 7 and 9]
3. Command-confirmed: `comment-hygiene.yml` and `agent-mirror-sync.yml` each reference an existing checker file that the commit hook also invokes, so the duplicate is real and not a naming coincidence. [SOURCE: .github/workflows/comment-hygiene.yml:34][SOURCE: .github/workflows/agent-mirror-sync.yml:57]
4. Command-confirmed: no workflow invokes `test:sharded`, and the sharded runner has zero callers under `.github/workflows/`. The dead-runner finding survives verification. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:20]
5. Command-confirmed: the three legacy harnesses total 3,561 lines, and the census recomputes as 1,173 tracked test files outside `specs/` plus 94 under `specs/`. [SOURCE: .skilled/skills/system-spec-kit/runtime/package.json:24]
6. Still inferred, not confirmed: the legacy lane's overlap with the CLI Vitest project, and whether the advisor default suite can run files in parallel without failing on shared state. Both need a run that this research-only lineage must not start, and both are named as measurement gates rather than savings. [INFERENCE: based on the absence of any lane-by-lane comparison or parallel trial in this lineage]
7. The packet's census needs one correction before any later phase builds on it: `spec.md`'s "about 110 test files under specs/" is 4 real test files plus 90 scratch, fixture and archived entries, so the tracked test surface is 1,177 rather than 1,270 and the delete-eligible specs surface is 4 files, not 110. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:111]

## Final Ranked List

| Rank | Path | Label | Saving per PR | Regression it would stop catching | Evidence |
|---|---|---|---|---|---|
| 1 | `.github/workflows/comment-hygiene.yml` | delete | 92s | A comment-hygiene violation committed with `--no-verify` or from a clone without hooks | measured |
| 2 | `.github/workflows/naming-standard-guard.yml` (move its two pytest files) | delete | 88s | A snake_case path introduced off-hook; the push hook already dropped this gate as non-discriminating | measured |
| 3 | `.github/workflows/agent-mirror-sync.yml` | delete | 85s | Agent mirror drift on changed files committed off-hook | measured |
| 4 | `.github/workflows/routing-registry-drift.yml` duplicate-map job | narrow | up to 120s | Nothing unique: the local route guard blocks the same drift on the working tree | measured |
| 5 | `.github/workflows/spec-kit-check.yml` legacy lane | narrow, gate on measurement | up to 161s | The three legacy harnesses' assertions where the CLI Vitest project does not already make them | inferred |
| 6 | `.github/workflows/opencode-dual-version.yml` duplicated config-shape step | narrow | 19s | Nothing: the step is identical in the v1 and v2 jobs | measured |
| 7 | `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs` + its script | delete | 0s | Nothing: zero callers, and its shards run serially | confirmed |
| 8 | `.skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs` embedded Python timeout | narrow | 0s | Nothing today; the ceiling can move to `timeout(1)` or Vitest's own timeout | confirmed |
| 9 | 86 `scratch/` files under `specs/` with test suffixes | move out of the test surface | 0s | Nothing: no runner collects them | confirmed |

## Confirmed Versus Inferred

- Confirmed by command: the four duplicate-guard checker identities, the absence of any sharded-runner caller, the 3,561-line legacy harness total, the 1,173 + 94 census, `main`'s lack of branch protection, and every duration quoted from `gh run view`.
- Inferred: the legacy lane's 161s saving, the advisor parallel-execution ceiling, and the aggregate per-push total, which sums measured steps from different workflows without claiming they run on the same commit.
- Rejected by measurement: deleting `tests/` copies by basename, the shared helper layer as overengineering, the deep-loop serial list as the cost driver, and the "three parallel frameworks" framing of the doctor suite.

## Ruled Out

- Any recommendation that repeats settled work: path filters, dependency caching, composite setup, and workflow merging are all named as settled rather than re-proposed.
- Pricing the specs scratch logs or the dead sharded runner as time savings: both are 0s, and presenting them as minutes would inflate the ranking.

## Edge Cases

- Ambiguous input: "time it saves" was fixed in iteration 7 as wall-clock job duration from `gh run view`; this iteration keeps that definition so the ranks stay comparable.
- Contradictory evidence: the packet's workflow means and the measured runs disagree by up to 25% per workflow. Measured runs are used and the disagreement is stated rather than smoothed.
- Missing dependencies: none. Every command needed to verify a top claim ran and returned its status.
- Partial success: none. All ten iterations recorded a durable iteration record.

## SCOPE VIOLATIONS

None. Every write in this iteration is inside the lineage directory.

## Sources Consulted

- `.github/workflows/comment-hygiene.yml:34`
- `.github/workflows/agent-mirror-sync.yml:57`
- `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:20`
- `.skilled/skills/system-spec-kit/runtime/package.json:24`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:111`
- Verification run: 2 checker references in `comment-hygiene.yml`, 3 in `agent-mirror-sync.yml`, 0 workflow callers of `test:sharded`, 3,561 legacy lines, 1,173 + 94 census.

## Assessment

- New information ratio: 0.6
- Questions addressed: all five key questions, consolidated.
- Questions answered: none newly; this iteration consolidates and verifies rather than discovering.

## Reflection

- What worked and why: re-running the four verification commands turned the top recommendations from "measured earlier" into "confirmed now", which is what an operator needs before deleting a merge gate.
- What did not work and why: the two remaining uncertainties cannot be closed without running suites, so they stay named as measurement gates instead of becoming confident claims.
- What I would do differently: run the verification commands at the moment each recommendation is first formed, not at the end, so an unverifiable recommendation never enters a ranked list.

## Recommended Next Focus

None. The ranked list is complete for this lineage, the two inferred items are named as measurement gates, and the remaining work is the operator's decision about which deletions to approve.
