---
title: "Research: Test and CI bloat — what to delete, merge, narrow or move"
description: "Ranked, evidence-backed cuts to test, workflow and hook run time for the opencode-go lineage of phase 007."
trigger_phrases:
  - "test and ci bloat research"
  - "which tests and workflows to cut"
  - "shorten commit and push run time"
importance_tier: normal
contextType: research
---

# Research: Test and CI bloat

## 1. Short Answer

The operator's minutes are in CI, not in the git hooks. A commit costs about one second and a push about three, because the hook path is twelve short-lived node checkers plus one 2.3-second track sweep. The CI path spends 3,762 seconds across the fourteen workflows measured here, and 1,376 seconds of that is five test steps doing real work.

Four workflows re-run a guard that already blocks locally, and together they cost 385 seconds per pull request: `comment-hygiene` 92s, `naming-standard-guard` 88s, `agent-mirror-sync` 85s, and up to 120s of `routing-registry-drift`. A fifth cut, the spec-kit legacy lane at up to 161s, needs one measurement before it can be priced. Deleting the four is the only action in this report that removes minutes rather than seconds.

Two findings change the premise rather than the plan. First, `specs/` holds 4 real test files, not the "about 110" the packet records: 86 of the 94 tracked test-suffixed files are build logs under `scratch/`, 2 are fixtures, 4 are archived, and none are collected by any runner. Second, the largest workflows are dominated by plumbing — checkout and dependency install are 75-98% of the cheap workflows' cost and 25-30% of the expensive ones — so no test-level cut can fix them; that ceiling belongs to the caching and trigger work already settled in `002-ci-workflow-efficiency`.

## 2. What Was Checked

- `.skilled/scripts/git-hooks/pre-commit` (1,056 lines, 13 blocking gates) and `pre-push` (609 lines), with the individual checkers timed read-only.
- All 32 `.github/workflows/*.yml` files: triggers, path filters, job and step counts, and which local gate each one re-runs.
- Per-step durations from nine completed workflow runs through `gh run view --json jobs`, including the 1,150-second `spec-kit-check` run.
- 1,173 tracked test files by framework suffix outside `specs/`, plus the 94 test-suffixed files under `specs/`, with a per-directory classification of the latter.
- The three runtime packages' `package.json` scripts, `vitest.config.ts` files and custom runners.
- `main`'s branch protection, to see whether any candidate workflow is a required check.

## 3. The Five Largest Measured Costs

| Rank | Cost | Duration | Where |
|---|---|---|---|
| 1 | CLI Vitest project | 490s | `spec-kit-check.yml` |
| 2 | Advisor default suite | 309s | `skill-advisor-stress.yml` |
| 3 | Deep-loop runtime suite | 306s | `deep-loop-runtime.yml` |
| 4 | Legacy module lanes and bash validation | 161s | `spec-kit-check.yml` |
| 5 | Doctor script suite | 110s | `spec-kit-check.yml` |

Together these are 1,376s of the 3,762s measured. The first three are the work the repository wants to buy; the fourth is the only one with an unmeasured overlap against a Vitest project that may already assert the same behavior.

## 4. Recommendations

Ranked by measured wall-clock saving per push or pull request. Every row names the file, the saving, the regression the cut stops catching, and the label the packet requires.

| Rank | Path | Label | Saving | Regression it stops catching |
|---|---|---|---|---|
| 1 | `.github/workflows/comment-hygiene.yml` | delete | 92s | A comment-hygiene violation committed with `--no-verify` or from a clone without the machine-wide hooks |
| 2 | `.github/workflows/naming-standard-guard.yml` (move its two pytest files first) | delete | 88s | A snake_case path introduced off-hook; the push hook already dropped this gate as non-discriminating against the remote-permission gate |
| 3 | `.github/workflows/agent-mirror-sync.yml` | delete | 85s | Agent mirror drift on changed files committed off-hook |
| 4 | `.github/workflows/routing-registry-drift.yml` duplicate-map job | narrow | up to 120s | Nothing unique: the local route guard blocks the same drift on the working tree. The pushed-commit parity job must stay |
| 5 | `.github/workflows/spec-kit-check.yml` legacy lane | narrow, gated on measurement | up to 161s | The three legacy harnesses' assertions where the CLI Vitest project does not already make them |
| 6 | `.github/workflows/opencode-dual-version.yml` duplicated config-shape step | narrow | 19s | Nothing: the step is identical in the v1 and v2 jobs |
| 7 | `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs` and its `package.json` script | delete | 0s | Nothing: zero callers, and its 12 shards run serially |
| 8 | `.skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs` embedded Python timeout | narrow | 0s | Nothing today; the ceiling can move to `timeout(1)` or Vitest's own timeout |
| 9 | 86 `scratch/` files under `specs/` with test suffixes | move out of the test surface | 0s | Nothing: no runner collects them |

The four deletions total 385s per pull request, or about nine minutes once the legacy-lane ceiling is included.

## 5. Why the Hook Path Is Not the Problem

`pre-commit` runs 13 gates in 1,056 lines, and every checker measured came in at or under 0.13s: comment hygiene 0.09s, template phrase lint 0.09s, agent mirror sync 0.13s, compiled route guard 0.09s, doc-version check 0.09s, contract drift 0.09s. The hook's cost is the twelve node process startups those checkers require, about one second in total. `pre-push` runs no test suite at all — its own comment records that the report-only suites moved to CI — and its costliest check is the track-root sweep at 2.27s.

The premise that the operator "waits minutes on every commit" is therefore unsupported for hooks. It is true for CI.

## 6. What the Duplicates Actually Duplicate

| CI workflow | Local gate | Same checker file | What CI adds |
|---|---|---|---|
| `comment-hygiene.yml` | commit hook, comment hygiene | yes | Base-to-head scope across a whole PR |
| `agent-mirror-sync.yml` | commit hook, agent mirror sync | yes | The shared-package build the checker loads |
| `naming-standard-guard.yml` | push hook deleted its naming gate | n/a | A Python scan plus the guard's own two pytest files |
| `routing-registry-drift.yml` | commit re-mint and push route guard | partly | A view of the pushed commit rather than the working tree |
| `message-contract.yml` | push hook, message contract | yes, for the commit range | PR-description validation and a `node --test` of the validator |

`main` has no branch protection, so no workflow is a required check and deleting one breaks no merge gate. The regression every deletion keeps on the table is the no-hook path: `--no-verify`, a clone without the machine-wide hooks, or a tool that runs no hooks.

## 7. Test-Surface Findings That Change the Census

- **`specs/` is not a test corpus.** 94 tracked test-suffixed files, of which 86 are build logs under `scratch/`, 2 are fixture seeds, 4 are archived harnesses, and 4 are real tests. No `vitest.config.*` roots an include at `specs/`, and no workflow runs a `specs/` test path.
- **Basename collisions are not duplicates.** `progressive-validation` exists in both `tests/` and `cli/tests/` with 64 and 68 test names and zero overlap. A delete based on the filename would remove distinct coverage.
- **The shared helper layer is not bloat.** Three configs load one 71-line setup file that forces an absolute `TMPDIR` and refuses to run when the database env vars point at the checked-in database.
- **The serial lists are not the cost driver.** The deep-loop `SERIAL_FILES` patterns select 12 of 173 files, and the advisor's serial setting is the largest *config-level* multiplier, not a test-level one.
- **Spawn density is the per-test cost.** 464 child-process sites across 121 spec-kit test files, 128 in the deep-loop tree, 85 in the advisor, 176 in the doctor scripts.

## 8. What Cannot Be Fixed by Cutting Checks

`playbook-operator-contract` costs 93s for under 8s of checking. `changed-packet-validation` costs 129s for under 8s of validation. `command-tree-parity` costs 211s for about 23s of comparison. `opencode-dual-version` costs 440s for 81s of battery work. In each case the remainder is checkout and dependency install, which is the settled setup surface. No second-tier workflow holds a deletable duplicate.

## 9. Eliminated Alternatives

| Alternative | Why it was eliminated |
|---|---|
| Delete `tests/` copies that share a basename with `cli/tests/` | Two files, 64 and 68 test names, zero overlap |
| Delete or merge the shared Vitest setup | It prevents tests writing the checked-in database and fails closed |
| Delete the deep-loop serial list | It serializes 12 of 173 files for documented determinism |
| Treat the doctor folder as three co-equal frameworks | 54 of its 59 files are one `node:test` harness |
| Re-propose path filters, caching, composite setup or workflow merging | Settled in `002-ci-workflow-efficiency` phases 003, 004 and 008 (`D8 = no`) |
| Price `specs/` scratch logs or the dead sharded runner as minutes | Both are 0s |
| Delete `naming-standard-guard.yml` wholesale | It would take the guard's two pytest files with it |

## 10. Divergence Map

- Saturated directions: none. Ten iterations covered hooks, CI duplicates, three runtime test trees, `specs/`, shared infrastructure, per-step pricing, verification, and the second workflow tier.
- Pivots taken: from "which workflows are bloat" (iteration 2) to "which checks cost anything at all" (iterations 7 and 9), and from "which tests are redundant" to "which test files are even tests" (iteration 5).
- Failed pivots: treating the `specs/` file count as a test surface; treating basename collisions as duplication.
- Audited overrides: none.
- Remaining frontier: the legacy lane's overlap with the CLI Vitest project, and whether the advisor default suite can run files in parallel without shared-state failures.

## 11. Open Questions

- Does the 161-second legacy lane duplicate assertions the CLI Vitest project already makes? Answered by running both lanes with a reporter that records test names, then diffing them.
- Can the advisor default suite raise `fileParallelism` without failing on the daemon, socket and lease state its stress config documents? Answered by a single parallel trial with the shared-state suites excluded.
- Should the operator widen the parent scope, which excludes deleting tests, now that the only delete-eligible test file is in `specs/` scratch rather than in a runtime suite?

## 12. References

- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md` — the packet inventory and CI means used as the starting point.
- `specs/system-speckit/repo-operations/002-ci-workflow-efficiency` — settled caching, trigger hygiene and `D8 = no` merge decision.
- `.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/pre-push` — the local gate inventory.
- `.github/workflows/*.yml` — 32 workflows, 3,867 lines.
- `gh run view` for runs `43174399120`, `42796769476`, `43176911930`, `43176912101`, `40780892829`, `43174399109`, `43168892360`, `43174399019`, `43177390580`, `43177390849`, `43172983998`, `43177390691`, `43177390587`, `43177390642` — the per-step durations this report prices.
- This lineage's `iterations/iteration-001.md` to `iteration-010.md` — the per-iteration evidence, ruled-out directions and reflections.

## Appendix: Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 5 / 5
- Remaining questions: 0
- Iteration trajectory: 0.90, 0.90, 1.00, 1.00, 1.00, 0.90, 0.70, 0.85, 1.00, 0.60
- Convergence threshold: 0.05 (telemetry only; the run was capped by `stopPolicy: max-iterations`)
- Confirmed by command: checker-file identity for the two duplicate guards, zero sharded-runner callers, the 3,561-line legacy total, the 1,173 + 94 census, `main`'s lack of branch protection, and every quoted duration.
- Inferred and named as measurement gates: the legacy lane's 161s ceiling and the advisor parallel-execution ceiling.
- Method note: iteration 1's iteration record declared `findingsCount: 5` while seven findings were enumerated; the ledger record is immutable, so the count stands as recorded and the discrepancy is documented in iteration 2.
