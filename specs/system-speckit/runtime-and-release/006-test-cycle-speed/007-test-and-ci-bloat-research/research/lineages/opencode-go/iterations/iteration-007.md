# Iteration 7: Measured per-step CI times and the first ranked cut list

## Focus

Turn iterations 1 to 6 into priced cuts. The packet requires a file path, a time saving and the regression each cut would stop catching, and `spec.md` acknowledged that its own workflow means include queue time. This iteration reads real per-step durations from completed workflow runs so each saving is measured rather than inferred, then ranks the candidates.

## Actions Taken

1. Listed recent successful runs for the eight workflows whose cuts iterations 2 to 6 proposed, using `gh run list` (read-only).
2. Pulled each run's per-job and per-step durations with `gh run view --json jobs`.
3. Read the `spec-kit-check` run's three jobs step by step, including the doctor job.
4. Compared each step's duration against the check that step runs, using the checker costs measured in iteration 1.

## Findings

1. `spec-kit-check` on a recent successful run spent 867s in the main job, 200s in the doctor job and 83s in the mirrors job. Inside the main job the CLI Vitest project took 490s, the legacy module lanes and bash validation suites 161s, install and build 73s, checkout 27s and the runtime Vitest project 79s. [SOURCE: .github/workflows/spec-kit-check.yml:99]
2. `comment-hygiene.yml` costs 92s per run, and 87s of that is the full-history checkout; the hygiene checker itself runs in about one second, having measured 0.09s locally. [SOURCE: .github/workflows/comment-hygiene.yml:22]
3. `naming-standard-guard.yml` costs 88s, of which 72s is a full-history checkout and the rest is a Python install plus a filename scan. [SOURCE: .github/workflows/naming-standard-guard.yml:24]
4. `agent-mirror-sync.yml` costs 85s: 69s checkout, 10s building the shared package, and roughly one second of actual mirror checking at the locally measured 0.13s. [SOURCE: .github/workflows/agent-mirror-sync.yml:46]
5. `message-contract.yml` costs 78s, 72s of it checkout. Its real work is small, so narrowing the duplicate commit check inside the job saves no measurable time; only deleting the job does. [SOURCE: .github/workflows/message-contract.yml:22]
6. `routing-registry-drift.yml` costs 256s across two jobs (136s and 120s). Provisioning is 73s, checkout 113s, and the actual ratchet suites 37s. The job that inspects the pushed commit is the one piece no local gate can replace. [SOURCE: .github/workflows/routing-registry-drift.yml:273]
7. The two biggest single test steps are the advisor default suite at 309s and the deep-loop runtime suite at 306s, against 27s for the advisor stress suite and 490s for the CLI Vitest project. Suite work, not setup, is what those three workflows actually buy. [SOURCE: .github/workflows/skill-advisor-stress.yml:94][SOURCE: .github/workflows/deep-loop-runtime.yml:75]

## Ranked Cuts

Ranked by measured minutes saved per push or pull request. Every saving is measured from a completed run; none is inferred from the workflow mean.

| Rank | Path | Label | Saving per PR | Regression it would stop catching |
|---|---|---|---|---|
| 1 | `.github/workflows/comment-hygiene.yml` | delete | 92s | A comment-hygiene violation committed with `--no-verify`, because the commit hook only sees staged changes and can be bypassed |
| 2 | `.github/workflows/naming-standard-guard.yml` | delete | 88s | A new snake_case path introduced without running the commit hook; the push hook already dropped this gate as non-discriminating against the remote-permission gate |
| 3 | `.github/workflows/agent-mirror-sync.yml` | delete | 85s | Agent mirror drift on files changed outside the hook, at the cost of 0.13s of checking |
| 4 | `.github/workflows/message-contract.yml` | narrow | 0s measured; maintainability only | The pushed-commit message check duplicates the push hook; the PR-description and validator-suite steps are unique and must stay |
| 5 | `.github/workflows/routing-registry-drift.yml` | narrow | up to 120s | Droppable: the duplicate-map job that re-derives what the local route guard already blocks. Must keep the pushed-commit parity job, which no local gate can replace |
| 6 | `.github/workflows/spec-kit-check.yml` legacy lane | narrow, measure first | up to 161s | The three legacy harnesses' assertions, where they are not already made by the CLI Vitest project; overlap is unmeasured, so this cut ships only after a lane-by-lane comparison |
| 7 | `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs` and its `package.json` script | delete | 0s | Nothing: no workflow or script invokes it, and its 12 shards run serially |
| 8 | `.skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs` embedded Python timeout | narrow | 0s | Nothing today; the bound can move to `timeout(1)` or Vitest's own timeouts without losing the 10-minute ceiling |
| 9 | 86 `scratch/` files under `specs/` matching test suffixes | move | 0s | Nothing: no runner collects them, and they are build logs rather than tests |

## Ruled Out

- Recommending `fetch-depth` changes on the four cheap workflows: their full-history checkout is 70-95% of their cost, but setup provisioning is settled in `002-ci-workflow-efficiency/004-setup-caching-provisioning`, and the deletion above removes the checkout with the workflow.
- Pricing the legacy-lane cut at its full 161s: the overlap with the CLI Vitest project is unmeasured, so the table carries it as an upper bound with a measurement gate rather than a saving.
- Pricing the `message-contract` narrowing in seconds: the job's cost is its checkout, so the honest number is zero and the benefit is maintenance, not time.

## Dead Ends

- No further cut surfaced inside the 490s CLI Vitest project. Per-file timing is settled in phases 001 to 005, and iteration 3 confirmed that no single file dominates. That 490s is the work the repository actually wants to buy.

## Edge Cases

- Ambiguous input: "time it saves" could mean runner minutes, wall-clock, or billed minutes. Selected interpretation: wall-clock job duration from `gh run view`, which is what the operator feels; runner-minute billing may differ on multi-job runs.
- Contradictory evidence: `spec.md` reports `comment-hygiene` at zero runs in its window while a recent successful run costs 92s, so the packet's mean list is a sample, not a census. Both are recorded; the measured run is used for pricing.
- Missing dependencies: none. `gh` was authenticated and read-only.
- Partial success: the doctor job's 200s was measured but no cut candidate targets it, so it informs the total without changing the ranking.

## SCOPE VIOLATIONS

None. Every write in this iteration is inside the lineage directory.

## Sources Consulted

- `gh run view 43174399120 --json jobs` (spec-kit-check, 1150s across 3 jobs)
- `gh run view 42796769476` (comment-hygiene, 92s)
- `gh run view 43176911930` (naming-standard-guard, 88s)
- `gh run view 43176912101` (message-contract, 78s)
- `gh run view 40780892829` (agent-mirror-sync, 85s)
- `gh run view 43174399109` (routing-registry-drift, 256s)
- `gh run view 43168892360` (skill-advisor-stress, 456s)
- `gh run view 43174399019` (deep-loop-runtime, 395s)
- `.github/workflows/spec-kit-check.yml:99`, `.github/workflows/comment-hygiene.yml:22`, `.github/workflows/naming-standard-guard.yml:24`, `.github/workflows/agent-mirror-sync.yml:46`, `.github/workflows/message-contract.yml:22`, `.github/workflows/routing-registry-drift.yml:273`, `.github/workflows/skill-advisor-stress.yml:94`, `.github/workflows/deep-loop-runtime.yml:75`

## Assessment

- New information ratio: 1.0
- Questions addressed: all five key questions, at pricing depth.
- Questions answered: none newly; this iteration prices answers already given rather than closing a new question.

## Reflection

- What worked and why: replacing the packet's queue-inclusive workflow means with per-step `gh run view` durations turned nine candidate cuts into measured savings, and it exposed that four of them are 75-95% checkout time.
- What did not work and why: the legacy-lane saving could not be closed, because proving overlap needs a lane-by-lane comparison that would cost more than the iteration budget.
- What I would do differently: pull per-step timings in the first iteration of any CI-cost research; a workflow mean hides the checkout share, which is the decisive fact.

## Recommended Next Focus

Verify the top three deletions before the synthesis publishes them: confirm that each workflow's checker is the same file the hook runs, confirm the hook's bypass surface, and confirm that no branch-protection or required-check rule makes the workflow the only enforcement point.
