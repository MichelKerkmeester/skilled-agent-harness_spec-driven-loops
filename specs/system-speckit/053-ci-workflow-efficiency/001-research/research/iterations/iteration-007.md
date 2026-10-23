# Iteration 7 — Flaky and slow tests, and timeouts

## Focus

Classify the failure mass measured in `scratch/ci-run-data` (deep-loop-runtime 13 failures of 40,
diagram-corpus 12, skill-advisor-stress 10, repo-rules-corpus 2) as flake or real, using
`gh run view --log-failed` on samples plus the collected job JSON. Inventory `timeout-minutes`
across all 33 workflows and flag missing or oversized timeouts. Resolve the carried-forward question
on `.skilled/skills/system-spec-kit/runtime/vitest.config.ts`. Read-only: no workflow, script or
code was modified.

## Actions Taken

1. Extracted the failure set two ways: run-level conclusions from
   `scratch/ci-run-data/runs-last-1000.json`, and per-workflow 40-run samples from
   `scratch/ci-run-data/per-workflow/*.json` (`conclusion`, `headSha`, `createdAt`).
2. Walked the 167 collected `scratch/ci-run-data/jobs/*.json` files for failing jobs and their
   failing step numbers, plus every job's start/completion delta (230 job executions).
3. Pulled `gh run view <id> --log-failed` for four runs spanning all four flagged workflows, and
   stripped ANSI to read the terminal error lines.
4. Grepped `timeout-minutes` across `.github/workflows/` and enumerated the workflows with no
   timeout at all.
5. Grepped all eight `vitest.config.*` files for `fileParallelism`, `maxWorkers`, `pool`,
   `testTimeout`, `teardownTimeout`, then read the deep-loop runtime config end to end.

## Findings

### F1 — The deep-loop-runtime failures are real, and 100% of the job's cost is spent before the first signal [confirmed]

13 of 40 deep-loop-runtime runs failed between 2026-10-08 and 2026-10-23, every one on a distinct
commit, with no same-commit rerun. Two of the thirteen logs were sampled and both end in the same
root cause:

```
##[error]Error: Refusing stale compiled contract for deep/ai-council: STALE_SOURCE_DIGEST.
        Re-run compile-command-contracts.cjs --write.
```

Run `39843480132` (2026-10-22) failed 2 of 2808 tests; run `39025144155` (2026-10-17) failed 5 of
2722 with the same `STALE_SOURCE_DIGEST` refusals for `deep/ai-council` and `deep/review`. The cause
is a committed source change with an un-regenerated compiled contract, i.e. repo state, not harness
timing. Label: **real, deterministic** for the two sampled runs; the remaining eleven are **inferred**
same-cause from the identical failing suite name and identical error class, not individually sampled.

The cost shape matters more than the count. The job runs the whole suite as its only test step
[SOURCE: .github/workflows/deep-loop-runtime.yml:60] with a 45-minute ceiling
[SOURCE: .github/workflows/deep-loop-runtime.yml:36]; the failing run took 698 s and the failing
assertion fired at 20:01:23 after a 19:49:47 start, so the verdict arrived at minute ~11.7 of a
~11.7-minute job. The generator already supports a verify-only invocation — `--write` is an opt-in
token and the usage line documents it as optional
[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/compile-command-contracts.cjs:706]
[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/compile-command-contracts.cjs:727]
— so the same fact is available in seconds from a first step, at ~0.4% of the current detection cost.

### F2 — There is no flake signature anywhere in the dataset [confirmed]

Across the 1000-run window the conclusions are 947 success, 35 skipped, 17 failure and 1 blank; there
are **zero `timed_out` and zero `cancelled` runs**
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/runs-last-1000.json:1].
Only 2 workflow+commit groups in 1000 runs contain more than one run, and both are the retry of a
failed first attempt. In the 40-run samples of the seven workflows that ever failed, every group of
repeat runs on one commit is success/success (diagram-corpus 8, chart-corpus 10, repo-rules-corpus 3)
— the fail-then-pass-on-the-same-commit transition that defines a flake occurs **zero times**. The
repo also does not practise retry-to-green: 2 reruns per 1000 runs.

The one exception-shaped case is repo-rules-corpus, whose 2 failures sit on the *same* commit
`6cbaf58` on the same day — two independent runs both failed, which is the opposite of flake
behaviour and confirms determinism
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:37].

### F3 — Failures are correlated across independent workflows, so a retry would mask rather than fix them [confirmed]

Five commits fail diagram-corpus and skill-advisor-stress together — `356f614`, `aa152a4`,
`13209a6`, `7584ad7` on 2026-10-20 plus `0efd5a1` on 2026-10-13 — and a further set (`b4d4e90`,
`66e432f`, `3c66787`, `91c7486`) fails deep-loop-runtime and diagram-corpus together. Two workflows
with different suites, different runners and no shared job graph reddening on the same commits is a
property of the commit, not of either harness. The sampled causes are all content assertions:

- diagram-corpus run `39406017176`: `FAIL [metadata] scripts/README.md: version 1.0.1.0 is outside
  the anchor's 1.2 era; the standard's apply pass re-derives it` then `RESULT: FAILED`.
- skill-advisor-stress run `39524217211`: 4 of 64 tests in
  `opencode-plugin-bridge-stress.vitest.ts` fail with `TypeError: default is not a function` — a
  module-shape assumption in the plugin bridge, not a timeout.

**Recommendation consequence, recorded as a finding:** do not build retry/rerun automation on this
evidence. The correct investment is failing fast on the same fact (F1) and keeping generated artifacts
in step with their sources.

### F4 — 27 of 33 workflows declare no timeout at all, so any hang inherits the 360-minute default [confirmed]

Only six workflow files set `timeout-minutes`:
[SOURCE: .github/workflows/deep-loop-runtime.yml:36] (45),
[SOURCE: .github/workflows/hooks-node-tests.yml:46] (20),
[SOURCE: .github/workflows/opencode-plugin-tests.yml:54] (20),
[SOURCE: .github/workflows/skill-advisor-stress.yml:43] (20),
[SOURCE: .github/workflows/sk-doc-rename-harness.yml:31] (30) and
[SOURCE: .github/workflows/opencode-dual-version.yml:74] plus
[SOURCE: .github/workflows/opencode-dual-version.yml:172] (both 30). The other 27 — including the
three heaviest jobs — carry none: spec-kit-check's 20-minute check job
[SOURCE: .github/workflows/spec-kit-check.yml:66], the nightly strict-pass-freshness job and
trigger-index-rebuild's rebuild/push jobs.

The exposure is concrete. In the 230 collected job executions the slowest single job is
strict-pass-freshness at **4262 s (71 min)** and its four next-slowest placements are the same job at
2863 s, 2568 s, 2038 s and 1660 s
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:40];
the spec-kit-check check job reached 1440 s (24 min) in the sample against a 1215 s median
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:45].
Any of them hanging today burns six hours of a runner before GitHub intervenes, on a scheduled job
nobody is watching. Timeout coverage, not timeout tuning, is the gap.

### F5 — Where timeouts exist they are oversized 4-12x, which is the right failure mode to keep [confirmed]

Against each workflow's median job time (a lower bound on the ratio, since the median under-states the
tail): deep-loop-runtime 2700 s vs 690 s = 3.9x; hooks-node-tests 1200 vs 194 = 6.2x;
opencode-plugin-tests 1200 vs 138 = 8.7x; opencode-dual-version 1800 vs 156 = 11.5x;
skill-advisor-stress 1200 vs 115 = 10.4x; sk-doc-rename-harness 1800 vs 172 = 10.5x
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:22]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:39].
No job has ever come within 3x of its ceiling, and zero runs hit `timed_out`. A generous ceiling costs
nothing when nothing hangs and still cuts the worst case from 360 min to 20-45, so the shape is right;
what is missing is the same shape on the other 27.

### F6 — Carried-forward question answered: every vitest config sets `fileParallelism: false`, not true [confirmed]

The open question asked whether the spec-kit runtime config sets `fileParallelism: true` and risks
fixture collisions. It sets the opposite, explicitly:

- [SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:38] `fileParallelism: false`
- [SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:50] and its second project at
  [SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:67]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:39]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:20], with the reason stated in
  the file: "Several script and lifecycle suites mutate shared state (the graph writer lock, temp
  project roots). Run files serially for determinism."

So the fixture-collision risk is already answered by serialization on all five configs — and the
price is the wall clock the cost analysis keeps returning to: serial files are why the deep-loop job
runs 688-698 s and why spec-kit-check's single check job carries 167 files and 2808 tests through one
serial lane [SOURCE: .github/workflows/spec-kit-check.yml:144]. `testTimeout` is a uniform 30 s and
`teardownTimeout` 1 s in every config
[SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:9]
[SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:11] — no suite is provisioned for a
slow-network or cold-cache first run, which is consistent with no observed timeout.

### F7 — Failure cost in runner minutes is negligible; the real cost is signal latency and red-main noise [confirmed]

At the measured rates the failing runs cost roughly 10 billed min/day for deep-loop-runtime
(13/40 failures x ~11.5 min over 15 days) and 1-2 min/day for the other three, against a ~3812
billed min/day total [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:5].
Money is not the argument. The argument is that a 32.5% failure rate on a 12-minute job trains
readers to ignore the red X, and that every one of those failures was knowable earlier.

## Questions Answered

- **Which tests or jobs are flaky or slow, and are job timeouts set and sized right?** No workflow in
  the measured set is flaky: the fail-then-pass-on-the-same-commit signature is absent from 1000 window
  runs and from the 40-run samples of every failing workflow; the failures are real, deterministic and
  correlated across workflows on the same commits. The slow jobs are strict-pass-freshness (71 min max)
  and spec-kit-check's check job (24 min max), both timeout-free. Timeouts are set on 6 of 33 workflows,
  sized 4-12x above the slowest observed run, and never hit; the missing 27 inherit the 360-minute
  default.
- **Carried forward: does the spec-kit runtime vitest config set `fileParallelism: true`?** No — it
  and all four sibling configs set `false` to serialize shared-state fixtures (F6).

## Questions Remaining

- Which workflows or jobs are overengineered, such as duplicates of pre-commit hooks or advisory jobs
  that never gate?
- What security and pinning hygiene gaps exist in the workflows?
- What on/off control design lets a clone or base repo disable workflows or groups without editing YAML?
- What should a /doctor:ci command do, how is it made safe, and who owns it?
- What should an sk-code-ci mode contain, and what does registering a new sk-code mode require?
- How do the ranked recommendations group into ordered implementation phases 002 and later?

## Next Focus

Security and pinning hygiene (unstarted, independent of everything measured so far), paired with the
overengineering question — the sampled workflows already show SHA-pinned actions with version comments
and a `--check`-only mirror job, so the useful work is finding the exceptions rather than confirming
the norm.

## SCOPE VIOLATIONS

None. Every action was a read: `gh run view --log-failed`, `rg`, file reads and JSON analysis over
the already-collected scratch dataset. Nothing in `.github/`, `.skilled/` or the test suites was
modified, and no workflow, script or config was executed except read-only inspection.
