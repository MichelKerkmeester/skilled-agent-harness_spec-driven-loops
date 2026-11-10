# Iteration 6 — Parallelism and concurrency

## Focus

Per-workflow concurrency groups and `cancel-in-progress`, matrix use and `fail-fast`, and job
dependencies (`needs:`) across all 33 workflows in `.github/workflows/`. Identify workflows that
queue redundant runs on rapid pushes to main and jobs that are serial without need. Also resolve
the carried-forward question on `.skilled/skills/system-spec-kit/runtime/vitest.config.ts`.

## Actions Taken

1. Parsed all 33 workflow files with a YAML reader: triggers, top-level `concurrency`, and per job
   `needs`, `strategy`/`matrix`/`fail-fast`, `timeout-minutes`, job-level `if` and job-level
   `concurrency`.
2. Measured concurrency from the already-collected 1000-run dataset
   (`scratch/ci-run-data/runs-last-1000.json`, 2026-10-22T07:07Z → 2026-10-23T06:35Z): global peak
   concurrent runs, same-workflow peak concurrency, and push runs that started while an earlier
   push run of the same workflow on the same branch was still in flight.
3. Read the one workflow that declares a concurrency group end to end, including its rationale
   comments. [SOURCE: .github/workflows/trigger-index-rebuild.yml:14]
4. Read both matrix workflows and their setup steps.
5. Grepped every vitest config for `fileParallelism`, `maxWorkers`, `pool`, `sequence`,
   `testTimeout` to answer the carried-forward config question.

## Findings

### F1 — 32 of 33 workflows have no concurrency group at all [confirmed]

`rg -n "concurrency|cancel-in-progress" .github/` returns only `trigger-index-rebuild.yml` lines
21, 23 and 289. That workflow's group is
`trigger-index-rebuild-${{ github.ref }}` with `cancel-in-progress: false`.
[SOURCE: .github/workflows/trigger-index-rebuild.yml:21] [SOURCE: .github/workflows/trigger-index-rebuild.yml:23]
Every other workflow — including the three heaviest, spec-kit-check, sk-doc-script-tests and
hooks-node-tests — has no `concurrency` key, so a second push to the same branch starts a second
full run of every one of them alongside the first. Absence is confirmed per file: the structural
dump of all 33 files shows `topconc=-` for the other 32, and the files carry no `concurrency:`
line.

### F2 — A fifth of all runs are push runs that ran to completion after being superseded [confirmed]

Over the 1000-run window, 206 runs were `push` events that started while an earlier `push` run of
the same workflow for the same branch was still in flight on an older commit. 204 of those 206
concluded `success` (1 `failure`, 1 `skipped`), i.e. they were not cancelled — they consumed
runners to completion for a commit that a newer commit had already replaced. Only 1 of the 206 was
queued for more than 5 s, so they overlapped in parallel rather than waiting. Summing the exposure
up to the moment the newer run started gives **534 wall-clock minutes over 23.5 h** (~9 h/day) as
the upper bound that `cancel-in-progress: true` would remove. Per workflow, the exposure
concentrates exactly where the cost is:

| Workflow | Superseded push runs | Wall-min exposure |
|---|---|---|
| Spec-Kit Check | 29 | 178.8 |
| sk-doc Script Tests | 38 | 79.5 |
| Trigger Index Rebuild | 29 | 61.6 |
| Hook Node Tests | 28 | 58.8 |
| OpenCode Plugin Tests | 16 | 30.8 |
| Changed Packet Validation | 12 | 23.4 |
| Gate Inputs | 9 | 16.9 |
| Rule Canary Sync | 9 | 16.1 |

Sources: `[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/runs-last-1000.json:1]`
and the billed-cost baseline in
`[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:9]`.
The 534 min figure is a wall-clock upper bound computed per run as
`min(next_start, run_end) - run_start`; it understates billed saving for multi-job workflows
(spec-kit-check bills three jobs) and overstates nothing, since every counted run started.

### F3 — Redundant self-overlap is widespread, not an edge case [confirmed]

15 of the 22 workflow names present in the window reached a same-workflow peak concurrency above 1,
with a peak of 4 concurrent runs for Spec-Kit Check, sk-doc Script Tests, Hook Node Tests, Message
Contract, Playbook Operator Contract and Command Tree Parity, and 5 for Dependabot's own generated
workflow. Across all workflows the peak was 45 concurrent runs with a median of 10 in flight.
So the constraint is not runner capacity today — runs start with a median queue delay of 0 s — it is
redundant work: the same commit range is verified three and four times in parallel.

### F4 — The wall clock sits inside one serial job, not in the job graph [confirmed]

`spec-kit-check.yml` declares three jobs, none with `needs:`, so they already run in parallel.
[SOURCE: .github/workflows/spec-kit-check.yml:64] The `check` job (no `timeout-minutes`) chains
install+build of four trees, a bun install and sk-vision build, CLI check and typecheck, shared
tests, an `apt-get install ripgrep`, the CLI vitest project, the legacy/bash lanes and the runtime
vitest project. [SOURCE: .github/workflows/spec-kit-check.yml:65] [SOURCE: .github/workflows/spec-kit-check.yml:100]
Its median job time is 1215 s against 62 s for `mirrors` and 163 s for `doctor-scripts`.
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:45]
The workflow's wall-clock floor is therefore one serial 20-minute step chain, and shaving the
parallel siblings changes nothing. The same shape holds for `deep-loop-runtime.yml` (one job, 688 s
median, `timeout-minutes: 45`) and `hooks-node-tests.yml` (one job, 194 s median,
`timeout-minutes: 20`). [SOURCE: .github/workflows/deep-loop-runtime.yml:36] [SOURCE: .github/workflows/hooks-node-tests.yml:46]

### F5 — No unnecessary `needs:` chains exist [confirmed, negative finding]

The only two `needs:` in the whole workflow set are real data dependencies:
`push` needs `rebuild` to receive `rebuild_sha` and `committed`, and the pi-extension matrix legs
need `discover` for the dynamic matrix. [SOURCE: .github/workflows/trigger-index-rebuild.yml:185]
[SOURCE: .github/workflows/pi-extension-tests.yml:50] Every multi-job workflow
(command-tree-parity, dispatch-enforcement-guard, routing-registry-drift, sk-doc-script-tests,
skill-doc-frontmatter, spec-kit-check, opencode-dual-version) runs its jobs in parallel already.
There is no serial `needs:` chain to break; the parallelism deficit is across runs (F1/F2) and
inside single jobs (F4).

### F6 — Matrix use is minimal, fail-fast is never true, and the one matrix duplicates provisioning [confirmed]

Two of 33 workflows use `strategy.matrix`: `opencode-dual-version.yml` with a static
`matrix.include` of two OpenCode families and `fail-fast: false`, and `pi-extension-tests.yml` with
a `fromJSON` matrix discovered at run time and `fail-fast: false`.
[SOURCE: .github/workflows/opencode-dual-version.yml:78] [SOURCE: .github/workflows/opencode-dual-version.yml:79]
[SOURCE: .github/workflows/pi-extension-tests.yml:53] [SOURCE: .github/workflows/pi-extension-tests.yml:54]
No workflow sets `fail-fast: true`. The dual-version `fail-fast: false` is deliberate and commented
("a failure in one must not cancel the other"), but the price is that the matrix legs each run the
full provisioning — `provision_worktree` at [SOURCE: .github/workflows/opencode-dual-version.yml:105]
— and the `both` job provisions a third time at
[SOURCE: .github/workflows/opencode-dual-version.yml:188]. Three provisionings per run is the
setup-duplication finding from iteration 2 seen from the matrix angle: matrix legs parallelise the
test work but multiply the setup work.

### F7 — Test-file parallelism is off by design repo-wide, so the lever is sharding, not workers [confirmed]

`fileParallelism: false` is set in every substantive vitest config:
`.skilled/skills/system-spec-kit/runtime/vitest.config.ts` (with an in-file WHY about shared
process state and temp project roots), the root and `cli` projects in
`.skilled/skills/system-spec-kit/vitest.config.ts`, the deep-loop runtime config (graph writer lock
and temp project roots), and the skill-advisor runtime plus stress configs.
[SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:36]
[SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:38]
[SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:50]
[SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:67]
[SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:20]
[SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:39]
The carried-forward open question is therefore answered: the config does not set worker parallelism,
it disables file parallelism, and the fixture-collision risk it guards against is why. Turning
`fileParallelism: true` on is not an available lever without rewriting tests that mutate shared
state. The lever that matches this shape is a matrix that splits suites into separate runners
(by project or test glob), each paying its own install — or better, splitting after a build job
that the shards consume.

### F8 — The one existing concurrency group is the correct exception [inferred]

`trigger-index-rebuild.yml` must not cancel an in-flight run: the `push` job transfers a commit as
an artifact, and the file documents that the group keeps at most one run in progress plus one
pending, with a newer pending run replacing an older one, and a rejected push exiting 0 because the
newer run rebuilds on the newer tip.
[SOURCE: .github/workflows/trigger-index-rebuild.yml:16]
[SOURCE: .github/workflows/trigger-index-rebuild.yml:289] Its 29 superseded runs and 61.6 min
exposure are a consequence of push cadence, not of a missing group. Adding
`cancel-in-progress: true` here would drop rebuilds; it must stay false. This is inferred from the
workflow's own documented contract, not measured against alternative behaviour.

### F9 — Cancelling push runs on main trades verification for speed [inferred]

`cancel-in-progress: true` on `push` means the superseded commit gets no conclusion for that
workflow. The measured overlap is almost entirely multi-commit bursts on one branch (F2), so the
redundant runs are genuinely superseded work; but where a required status check is bound to a push
run on a protected branch, a cancelled run can leave that commit unverified, which is a
branch-protection question rather than a workflow question. The safe default is a per-workflow,
per-ref group that always cancels `pull_request` runs and cancels `push` runs only on unprotected
refs, until the branch-protection matrix from angle 9 says otherwise.

### F10 — Missing timeouts multiply the cost of every concurrency gap [confirmed]

Only six jobs declare `timeout-minutes`: deep-loop-runtime 45, opencode-dual-version 30/30,
skill-advisor-stress 20, hooks-node-tests 20, sk-doc-rename-harness 30, opencode-plugin-tests 20.
Every other job inherits GitHub's 360-minute default. Without a concurrency group, a hung job on
main therefore occupies a runner for up to six hours with nothing to cancel it.
[SOURCE: .github/workflows/opencode-plugin-tests.yml:54] [SOURCE: .github/workflows/sk-doc-rename-harness.yml:31]
[SOURCE: .github/workflows/skill-advisor-stress.yml:43] [SOURCE: .github/workflows/spec-kit-check.yml:65]

## Questions Answered

- Are parallelism, matrix design, fail-fast and concurrency cancel-in-progress groups set well?
  No: 32/33 workflows have no group, 206 push runs completed after being superseded, only two
  workflows use a matrix and neither uses `fail-fast: true`, and the serialism that matters is
  inside the largest single job rather than in the job graph.
- Carried forward: does `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` set file
  parallelism? It sets `fileParallelism: false` at line 38 with the reason in lines 36-37.

## Questions Remaining

Unchanged from the strategy: overengineering/duplicate-hook and non-gating advisory jobs; security
and pinning hygiene; the on/off control design; the `/doctor:ci` command; the `sk-code-ci` mode;
and the phase grouping of recommendations.

## Next Focus

Iteration 7: overengineering. For every workflow, record whether it duplicates a pre-commit hook or
another workflow, and whether an advisory job can never gate (start with `advisory-checks.yml`,
`strict-pass-freshness-report.yml`, `dependabot-auto-merge.yml` and every job carrying a job-level
`if:`). Carry forward two questions: (1) which checks are bound as required status checks, since
that decides whether `cancel-in-progress: true` is safe on `main`; (2) does any workflow job run the
same test file as another workflow, making the redundant run in F2 fully redundant rather than
partially.

## SCOPE VIOLATIONS

None. No workflow, script or config was modified; all writes are under the research packet.
