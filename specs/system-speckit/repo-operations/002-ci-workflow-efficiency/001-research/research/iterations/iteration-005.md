# Iteration 005 — spec-kit-check.yml deep dive (the 1279 billed min/day workflow)

## Focus

The reducer named `spec-kit-check.yml` as the single largest cost in the dataset (1279 est. billed
min/day, 25 billed min per run, 50 runs in a 23.5 h window). Break the 1215 s `check` job down by
step from real `gh run view --json jobs` data, then find what can be split, parallelised, sharded,
cached or path-filtered — and answer the reducer's parallelism/matrix/concurrency hint on the way.

Method: `jobs/*.json` from the measured dataset, four runs of `spec-kit-check.yml` plus four
comparison workflows. All step times below are read from
`specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/<run-id>.json`
(`startedAt`/`completedAt` deltas). **concluded: confirmed** unless labelled otherwise.

## Actions Taken

1. Read `.github/workflows/spec-kit-check.yml` in full (219 lines, 3 jobs, 1 `paths` list duplicated
   verbatim across `push` and `pull_request`).
2. Extracted per-step timings for runs `39910111430` (1184 s), `39909844384` (1215 s),
   `39901840569` (1440 s), `39899611470` (1222 s) — the `check` job's 11 timed steps.
3. Extracted per-step timings for four comparison runs (`39912382147`, `39912381887`,
   `39912381977`, `39912381951`) to separate spec-kit-check's shape from the repo-wide shape.
4. Read the vitest configuration the `check` job invokes,
   `.skilled/skills/system-spec-kit/vitest.config.ts`, to find why the CLI project takes 13 minutes.
5. Aggregate scan over all 165 sampled `jobs/*.json`: checkout-step seconds vs total job-seconds.
6. Repo-wide greps: `concurrency`, `timeout-minutes`, `cache:`, `fetch-depth` across all 33 workflows.

## Findings

### F1 (P0) — `fileParallelism: false` is why the CLI suite takes 13 minutes

The `check` job's step profile (run `39909844384`, wall 1215 s):

| Step | Seconds | Share |
|---|---|---|
| `Run actions/checkout` | 51 | 4.2 % |
| `Install and build the spec-kit packages` | 47 | 3.9 % |
| `Build the sk-vision plugin bundle` | 4 | 0.3 % |
| `CLI check gate and typecheck` | 12 | 1.0 % |
| `Shared package tests` | 3 | 0.2 % |
| `Install ripgrep` | 8 | 0.7 % |
| **`CLI vitest project`** | **791** | **65.1 %** |
| `Legacy module lanes and the bash validation suites` | 164 | 13.5 % |
| `Runtime vitest project` | 132 | 10.9 % |
| setup/teardown/post steps | 3 | 0.2 % |

The CLI vitest step is stable across runs — 776 s / 791 s / 950 s / 795 s — so it is not flaky noise,
it is a floor. The cause is one line of config: the `cli` project sets `fileParallelism: false`
[SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:67], and the `root` project sets it too
[SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:50]. The CLI project includes
`tests/**/*.vitest.ts` under its own root [SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:59],
and that tree holds **183** `*.test.ts`/`*.vitest.ts` files (count from
`find .opencode/skills/system-spec-kit/runtime/cli -name '*.test.ts' -o -name '*.vitest.ts' | wc -l`,
node_modules excluded). 183 files run strictly one after another, so the job's cost is the sum of
every file's startup plus runtime, not the longest file.

Neither `fileParallelism: false` site carries a comment saying WHY. The config's only prose explains
snapshot paths [SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:20-24], the project split
[SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:10-17] and the alias
[SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:27-30] — nothing explains serialisation.
Line 15 asserts both projects "carry the same timeout/parallelism settings as
`runtime/vitest.config.ts`", so the same setting very likely governs the `Runtime vitest project`
(132 s here) and `deep-loop-runtime.yml`'s 688 s job — **inferred**, confirmable by reading
`.skilled/skills/system-spec-kit/runtime/vitest.config.ts` directly.

Honest counterweight (**inferred**): serial execution may be load-bearing. Spec-kit tests write spec
folders, SQLite indices and shared fixtures; 183 files in parallel could collide. What would settle
it: run the project locally with `--fileParallelism` enabled and watch for cross-file fixture
collisions. That is an experiment phase 002 must run before it flips the flag — the saving is
large but the failure mode is intermittent, which is the worst kind to discover in CI.

Also note `ubuntu-latest` is documented by GitHub as 4 vCPU; I did not fetch that page this
iteration, so treat "4× ceiling" as **inferred**.

### F2 (P1) — spec-kit-check has no `timeout-minutes`, and 27 of 33 workflows have none either

The `check` job has no `timeout-minutes` [SOURCE: .github/workflows/spec-kit-check.yml:65-67] and no
other job in the file does (the only `timeout-minutes` token in the file is absent entirely). GitHub's
default job timeout then applies. A vitest hang — plausible precisely because the suite is serial and
spawns ripgrep and bash — would hold a runner far longer than the 20 minutes a healthy run takes.

Repo-wide, `timeout-minutes` appears in 6 of 33 workflow files:
`deep-loop-runtime.yml` (1), `hooks-node-tests.yml` (1), `opencode-dual-version.yml` (2),
`opencode-plugin-tests.yml` (1), `sk-doc-rename-harness.yml` (1), `skill-advisor-stress.yml` (1).
The six are exactly the workflows that already had a timeout incident. `spec-kit-check.yml`,
`sk-doc-script-tests.yml` (167 s job) and `strict-pass-freshness-report.yml` (2568 s job) have none —
the last being the repo's longest job.

### F3 (P1) — zero workflows use `setup-node`'s npm cache; every job pays a cold `npm ci`

`grep -n "cache:" .github/workflows/*.yml` returns nothing across all 33 files. `actions/setup-node`
installs the Node toolchain but leaves npm's cache cold every job. The cost is visible and repeated:
in the `check` job `Install and build the spec-kit packages` is 46–52 s
[SOURCE: .github/workflows/spec-kit-check.yml:80-93] and runs three separate `npm ci` invocations
against `.opencode/skills/system-spec-kit`, `.skilled` and
`.opencode/skills/system-skill-advisor/runtime` (lines 83, 86, 89).

The `doctor-scripts` job makes it worse: it re-installs five package trees and a pip package
(`Install test dependencies`, 37–42 s) [SOURCE: .github/workflows/spec-kit-check.yml:205-215], and
the `mirrors` job installs the workspace a third time (`Install the workspace and build its shared
package`, 8–14 s) [SOURCE: .github/workflows/spec-kit-check.yml:163-167]. Three jobs, three cold
installs of overlapping dependency sets, in one workflow, per run.

`cache: npm` on each `setup-node` is a two-line change with no behavioural risk (worst case: cache
miss, i.e. today's behaviour). Note the three `npm ci` calls in one step share one cache key only if
the cache path covers all three `node_modules` — the default npm cache caches `~/.npm`, the download
cache, which `npm ci` does reuse, so a single `cache: npm` with `cache-dependency-path` listing the
three lockfiles covers it. **inferred** on the exact `cache-dependency-path` shape; the mechanism
(`~/.npm` reuse across prefixes) is documented npm behaviour.

### F4 (P1) — checkout is ~50 s per job and 25.6 % of every runner-second this repo buys

`actions/checkout` costs 48–52 s per job in every sampled workflow, and 73 s in one case
(`39912381977`, `No new broken citations`). Aggregate over the 165 sampled run files — 230 jobs,
40,509 job-seconds — **207** jobs ran a checkout step for **10,362 s combined**: 25.6 % of all
sampled job-seconds, mean 50.1 s per job.

The effect on small workflows is total domination: `command-tree-parity.yml`'s
`Hermes skill and prompt copies match their sources` job is 74 s wall of which 50 s is checkout,
10 s is `setup-node` and **1 s** is the actual comparison. `No new broken citations` is 79 s wall:
73 s checkout, 1 s check. Those jobs cost a billed runner-minute almost entirely to clone a repo whose
mirror trees (`.opencode` ↔ `.skilled` ↔ `.pi` ↔ `.claude` ↔ `.codex` ↔ `.cursor` ↔ `.devin`) are
duplicated on disk.

`fetch-depth` is already `0` or `1` where it is set at all (16 sites across 12 workflows), and
`spec-kit-check.yml` sets neither, so it uses the default depth-1 clone and still pays 50 s. The
levers are therefore not depth but transferred size: `sparse-checkout` for jobs that read one subtree,
or a `git clone --filter=blob:none`-style partial clone (not expressible through `actions/checkout`
without an explicit `with:`), or simply accepting it and cutting the NUMBER of jobs, since the cost
is per job, not per workflow. Cutting job count is the cheapest lever and it is free: the three
spec-kit-check jobs pay 3 × 50 s = 150 s of pure clone for one logical check.
**inferred**: the 50 s is network/disk bound on repository size, not on depth — confirmable by timing
`git clone --depth 1` of this repo on an idle machine or by one `ACTIONS_STEP_DEBUG` run.

### F5 (P2) — 32 of 33 workflows have no `concurrency` group; the one that does opts out of cancelling

`grep -l "^concurrency" .github/workflows/*.yml | wc -l` = **1** of 33. The single instance is
`trigger-index-rebuild.yml`, and it deliberately does not cancel:
`cancel-in-progress: false` [SOURCE: .github/workflows/trigger-index-rebuild.yml:23], with a comment
[SOURCE: .github/workflows/trigger-index-rebuild.yml:17-20] explaining that a cancelled rebuild would
leave the index stale. That reasoning is correct for a mutating rebuilder and wrong for every
read-only checker.

Consequence on this repo's actual traffic pattern: 40 pushes to `main` in ~23.5 h, median inter-push
gap under 40 min, and a 20-minute `check` job. Any push arriving while a run is in flight queues a
second full 20-minute suite; the dataset's `spec-kit-check.yml` row shows 50 runs in the window while
`trigger-index-rebuild.yml` shows 73 — the two are triggered by the same pushes. There is no
`concurrency: {group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true}` anywhere,
so superseded runs are paid for in full.

### F6 (P2) — the two "cheap" jobs in spec-kit-check are 98 % overhead, and one duplicate install

- `mirrors` job: 62–70 s wall. Checkout 49–51 s, `Setup Node` 0–1 s, install 8–14 s, and
  `Mirror parity checks` **0–1 s** — nine `node … --check` invocations
  [SOURCE: .github/workflows/spec-kit-check.yml:169-180] that do nothing when in sync. The job exists
  to run nine fast scripts and spends 63 s of its 64 s on setup.
- `doctor-scripts` job: 149–165 s. Checkout 49–51 s, `Install test dependencies` 37–42 s,
  `Run every doctor script suite` 55–67 s
  [SOURCE: .github/workflows/spec-kit-check.yml:218-219].
- `sk-vision` bun build: `npm install --no-save --prefix "$RUNNER_TEMP/bun" bun@1.3.9` then
  `bun install --frozen-lockfile` [SOURCE: .github/workflows/spec-kit-check.yml:97-105] — a fresh
  bun download plus a full install, to produce one file that the plugins-purity test imports.

All three are install-shaped, none caches, and all three pay their own 50 s clone.

### F7 (P2) — the `paths` list makes mirror-only commits pay the full 20-minute suite

The trigger includes the generated mirror trees `.codex/`, `.claude/`, `.cursor/`, `.devin/`, `.pi/`
[SOURCE: .github/workflows/spec-kit-check.yml:27-31] and the same five again for `pull_request`
[SOURCE: .github/workflows/spec-kit-check.yml:55-59]. The comment at
[SOURCE: .github/workflows/spec-kit-check.yml:10-13] states the intent: a mirror drifting on a
command or agent commit must not ship unseen. The intent is right; the instrument is 20× oversized.
A commit that touches only `.pi/**` output re-runs the 791 s CLI suite, the 164 s legacy lanes and
the 132 s runtime suite — none of which read `.pi/`, `.claude/`, `.codex/`, `.cursor/` or `.devin/`.
The `mirrors` job, which does compare them, is 62 s.

Combined with F5 and F1 this is the whole 1279 billed min/day story: ~50 runs × 25 billed min, where
~65 % of each run is one serial vitest project and a large share of the runs are mirror-only or
superseded.

### F8 (P2) — splitting the job would cut wall-clock but RAISE billed minutes; fix F1 first

Worked from the measured steps for run `39909844384` (billed min = `ceil(job seconds/60)` per job):

| Plan | Jobs | Billed min/run | Wall (max job) |
|---|---|---|---|
| Today | 1 check + mirrors + doctor | 21 + 2 + 3 = **26** | **1215 s (20.3 min)** |
| Split `check` into 4 jobs, no cache, no parallelism fix | cli 891 s, legacy 264 s, runtime 232 s, gates 145 s | 15+5+4+3 +2+3 = **32** | 891 s (14.9 min) |
| Fix `fileParallelism` only, single job (CLI 791 s → ~250 s, **inferred**) | 1 check | ~12 + 2 + 3 = **17** | ~690 s (11.5 min) |
| Fix parallelism **and** add npm cache (install 47 s → ~25 s) | 1 check + mirrors | ~11 + 2 + 3 = **16** | ~665 s (11.1 min) |

The GitHub rounding rule punishes splitting: four jobs each round up their own partial minute and each
re-pays a 50 s clone plus an install. Splitting buys wall-clock and costs billed minutes. Because
parallelism is already correct at JOB level — the three jobs have no `needs:` between them and already
run concurrently, so wall = the longest job — the only *cheap* improvement is to shorten the longest
job. Sharding the CLI project (`vitest --shard=1/4 …`) is the fallback if `fileParallelism` proves
unsafe, but it costs the same per-job overhead as splitting: ~4 × (50 clone + 47 install + ~200 test)
= ~20 billed min against today's 21 for the whole check — roughly a wash on cost for a 3× wall win.

## Questions Answered

- **Are parallelism, matrix design, fail-fast and concurrency cancel-in-progress groups set well?**
  Job-level parallelism: yes — spec-kit-check's three jobs are `needs`-free and genuinely concurrent
  [SOURCE: .github/workflows/spec-kit-check.yml:64-146], and the same shape recurs across the repo.
  Test-level parallelism: no — both vitest projects run with `fileParallelism: false`
  [SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:50,67] across 183 CLI test files, and that
  one setting is 65 % of the repo's single most expensive job. Matrix design: none needed here (no
  version axis) except that `opencode-dual-version.yml` already carries the repo's only real matrix.
  fail-fast: not applicable without a matrix in this file; every matrix in the repo is 2–3 cells, so
  the default `fail-fast: true` is correct. **Concurrency: no** — 1 of 33 workflows has a
  `concurrency` block and it sets `cancel-in-progress: false`
  [SOURCE: .github/workflows/trigger-index-rebuild.yml:23]. Verdict: the cheap half (job graph) is
  right, the expensive half (test serialisation, cancel-in-progress) is missing everywhere.
- **Which tests or jobs are flaky or slow, and are job timeouts set and sized right?**
  Slow: `CLI vitest project` 776–950 s [F1], `Legacy module lanes …` 155–196 s,
  `Runtime vitest project` 125–153 s; repo-wide slowest are `strict-pass-freshness-report.yml`
  (2568 s job) and `deep-loop-runtime.yml` (688 s). Timeouts: **not sized right** — 6 of 33 workflow
  files set any `timeout-minutes`, and `spec-kit-check.yml`, the repo's most expensive workflow, sets
  none on any job [F2]. Flakiness is not the CLI project's problem (its four sampled durations are
  within 22 % of each other); the flaky workflows in the dataset are elsewhere
  (`deep-loop-runtime.yml` 13/40 failures, `diagram-corpus.yml` 12/40, `skill-advisor-stress.yml`
  10/40) and are for a later iteration.

## Questions Remaining

- Which workflows or jobs are overengineered, such as duplicates of pre-commit hooks or advisory jobs that never gate?
- What security and pinning hygiene gaps exist in the workflows?
- What on/off control design lets a clone or base repo disable workflows or groups without editing YAML?
- What should a /doctor:ci command do, how is it made safe, and who owns it?
- What should an sk-code-ci mode contain, and what does registering a new sk-code mode require?
- How do the ranked recommendations group into ordered implementation phases 002 and later?
- New, carried forward: does `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` also set
  `fileParallelism: false` (which would put `deep-loop-runtime.yml`'s 688 s job in the same class)?
- New, carried forward: are spec-kit tests fixture-collision-safe under `fileParallelism: true`?

## SCOPE VIOLATIONS

None. Every path read was researched read-only; the only writes were this narrative, the delta file
and the gateway event.

## Next Focus

The remaining P0/P1 candidates are unexamined: overengineering (advisory jobs that never gate,
duplicated pre-commit logic), security/pinning hygiene, and the two design questions (on/off control,
`/doctor:ci`, `sk-code-ci`). Cheapest next yield is likely the overengineering angle for the
sub-100 s workflows — F4 and F6 show their wall clock is ~75 % overhead, so the question becomes
whether some of the 33 workflows should exist at all as separate workflow runs rather than as jobs in
one thin workflow.
