# Iteration 003 — Duplicate provisioning: what the same work costs five times per commit

## 1. FOCUS

Read the three workflows that call `provision_worktree` and the function itself, then price the
provision and `bun install` steps from the recorded per-step timings in
`scratch/ci-run-data/jobs/<run id>.json`.

Read-only iteration. No workflow, script or action was edited. The only writes were this
narrative, the delta file, and the append gateway.

## 2. ACTIONS TAKEN

1. Read `opencode-dual-version.yml` in full and located both provision steps — one in each
   matrix leg [SOURCE: .github/workflows/opencode-dual-version.yml:98-105] and one in the
   independent `both` job [SOURCE: .github/workflows/opencode-dual-version.yml:181-188].
2. Read `opencode-plugin-tests.yml` and `hooks-node-tests.yml`; each carries one provision step
   [SOURCE: .github/workflows/opencode-plugin-tests.yml:66-73] [SOURCE: .github/workflows/hooks-node-tests.yml:57-64].
   All four steps are byte-identical apart from their comment: `npm install --no-save --prefix
   "$RUNNER_TEMP/bun" bun@1.3.9`, `PATH` export, `source worktree-naming.sh`,
   `provision_worktree "$GITHUB_WORKSPACE"`.
3. Read `provision_worktree` [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:619-726]
   and its path list [SOURCE: .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:1-78].
   The list names **14 package trees** and **5 built outputs**; the bun-vs-npm choice is made per
   entry from the presence of `bun.lock`/`bun.lockb` without a `package-lock.json`
   [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:647-652], and an already-satisfied
   tree is skipped by a dependency walk [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:654-656].
4. Extracted per-step durations from the 25 recorded jobs of the three workflows (5 completed runs
   each, job JSON under `scratch/ci-run-data/jobs/`), computing `completedAt - startedAt` per step.
5. Compared the trigger sets: `hooks-node-tests` fired on **exactly the same 40 `headSha` values**
   as `opencode-plugin-tests` (`comm -3` over the two per-workflow run files produced no output;
   run counts in the window are 61 and 61).
6. Swept all 230 recorded jobs for caching primitives: **zero** `actions/cache` steps, **zero**
   `cache:` inputs on any of the 35 `actions/setup-node` invocations, no `.github/actions/`
   directory, and no reusable workflow (`workflow_call`) anywhere.
7. Counted the tracked tree: `git ls-files | wc -l` → **108,753 files**, then priced the checkout
   step across the sample (230 jobs, median 51 s, mean 47 s, 10,775 s total).

## 3. FINDINGS

### F1 — Five jobs, five checkouts and five provisions per commit (confirmed)

On any change under `.opencode/plugins/**`, `.skilled/agents/**` or `.opencode/agents/**` all
three workflows fire. `hooks-node-tests`'s path set is a subset of `opencode-plugin-tests`'s
except for `.hermes/**` [SOURCE: .github/workflows/hooks-node-tests.yml:14-24]
[SOURCE: .github/workflows/opencode-plugin-tests.yml:14-28], and `opencode-dual-version`'s is a
subset of both except `opencode.json` [SOURCE: .github/workflows/opencode-dual-version.yml:12-37].
The measurement agrees: the two broader workflows fired on an identical set of 40 commits, so
`hooks-node-tests` bought no coverage `opencode-plugin-tests` did not already buy.

That commit therefore starts **5 jobs** — one plugin-tests job, one hook-tests job, and three
dual-version jobs (two matrix legs [SOURCE: .github/workflows/opencode-dual-version.yml:79-86]
plus `both`), each running its own `actions/checkout` and its own `provision_worktree`.

### F2 — The duplicated floor costs 9.3 runner-minutes per commit, 300 s of it provisioning (confirmed, medians from job JSON)

| Workflow | Jobs that provision | Provision per job (median) | Provision per run | Job wall (median) |
|---|---|---|---|---|
| hooks-node-tests | 1 | 63 s | 63 s | 194 s |
| opencode-plugin-tests | 1 | 64 s | 64 s | 138 s |
| opencode-dual-version | 3 (v2 67 s, v1 56 s, both 60 s) | 60 s | **173 s** | 159 / 127 / 137 s |

Sources for the medians: [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39912381951.json:1]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39912382087.json:1]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39909844429.json:1],
aggregated in [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:1].

Across the sample the provision step is 25 jobs of 230, median 62 s, mean 59 s, 1,480 s in total —
and those 25 are exactly the 5 jobs × 5 runs of these three workflows. So provision work is
**confined to these three workflows**, and no other sampled workflow spends a step named
"Provision …" (whether others install the same trees under a different step name is not settled
by a name-based filter — see the open question below).

Add the checkout every duplicate job also pays: median 51 s per job over 230 jobs, against a
108,753-file tracked tree. Per commit where all three fire that is **300 s of provisioning plus
255 s of checkout = 555 s ≈ 9.3 runner-minutes spent before a single assertion runs**. Billed at
the GitHub rounding rule that commit costs 16 min (4 + 3 + 9) [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:1].

Wall-clock is *not* the problem: the three workflows run in parallel, so a PR waits ~194 s
either way. The duplication is paid in runner-minutes, not in latency. That distinction decides
the ranking in §6 — a merge buys minutes, not a faster PR.

### F3 — There is no caching anywhere in the repository (confirmed)

Of 230 sampled jobs: no `actions/cache` step, no `cache:` input on any `setup-node` call, no
`.github/actions/` composite directory (absent), and no `workflow_call` reusable workflow. The 35
`setup-node` invocations [SOURCE: .github/workflows/spec-kit-check.yml:72] and its siblings pass
only `node-version: '22'`. Every one of the 14 trees and 5 build outputs is rebuilt from the
network and `tsc` on every job, in all three workflows, every run.

The saving this leaves on the table is arithmetic on F2's medians: restoring provisioned trees
would take each job below the next billed-minute boundary —

- hooks **194 → ~131 s** (4 → 3 min, −1)
- plugin-tests **138 → ~74 s** (3 → 2 min, −1)
- dual-version legs **159/127/137 → ~92/71/77 s** (3 each → 2 each, −3)

= **−5 billed min per commit while all three fire**. At 62 runs/day for the pair and 7/day for
dual-version that is (62 × 2) + (7 × 3) = **~145 billed min/day, 3.8% of the 3812 min/day total**
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:1].
A cache also removes ~60 s of wall-clock from every job, which is the part a contributor sees.

### F4 — The `bun install` is a per-job network install of an installer (confirmed mechanism, share unmeasured)

Each of the four provision steps begins with
`npm install --no-save --prefix "$RUNNER_TEMP/bun" bun@1.3.9`
[SOURCE: .github/workflows/opencode-dual-version.yml:101] [SOURCE: .github/workflows/opencode-plugin-tests.yml:69]
[SOURCE: .github/workflows/hooks-node-tests.yml:60] — five executions per commit for the three
workflows. It exists so the listed trees that are bun packages install and build with bun
[SOURCE: .github/workflows/opencode-dual-version.yml:102], a decision `provision_worktree` makes
per entry [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:647-652]; the named bun
artifact in the list is the sk-vision bundle
[SOURCE: .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:28]. How many of the 62 s
the `npm install bun` accounts for is **unmeasured** (inferred: it is network-bound and
therefore a per-job constant, which is why the provision step's duration barely varies with how
much work the run actually needs). Settling it costs one instrumented run; a pinned
`oven-sh/setup-bun` step or a cached bun prefix would remove it either way.

### F5 — Merging the hook tests into the plugin tests is available at no coverage cost (confirmed)

Because the trigger sets are identical in practice (F1) and the provision steps are identical
(F2), the two can be one job. Arithmetic on the medians: merged job = 64 s provision + (194 − 63)
= 131 s hook suites + (138 − 64) = 74 s plugin suites ≈ **269 s → 5 billed min**, against
4 + 3 = 7 today: **−2 min/run, ~124 billed min/day**. It also deletes one checkout (49 s) and one
provision (63 s) per commit. The cost is that the two suites stop running concurrently, so a
contributor's wait for that coverage rises from ~194 s to ~269 s unless the cache from F3 lands
first — which is why the two recommendations belong in the same phase, not in separate ones.

### F6 — The `both` job's provision is the one step worth questioning, and it is not dead yet (unknown)

The `both` job provisions before installing two OpenCode versions
[SOURCE: .github/workflows/opencode-dual-version.yml:181-188] and only runs the battery
[SOURCE: .github/workflows/opencode-dual-version.yml:247-253]. The battery imports nothing but
Node builtins [SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:28-35] and
gives every leg a private `mkdtemp` data home
[SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:944-949]. But its contract
is to prove the plugin folder is *discovered, importable and active*
[SOURCE: .skilled/commands/doctor/scripts/opencode-version-battery.cjs:10-14], and the plugins
import the gitignored workspace trees — so the provision is plausibly load-bearing. **UNKNOWN.**
To settle it: drop the step on a scratch branch and see whether the plugin leg reports degraded
(exit 3, which the step treats as failure). Worth 60 s × 7 runs/day ≈ 7 min/day, so it ranks below
F3/F5 but is the cheapest open question in this slice.

### F7 — The three workflows' timeouts are ceilings, not budgets, and none has a concurrency group (confirmed, minor)

Timeouts are 20/20/30 min against medians of 194/138/159 s
[SOURCE: .github/workflows/hooks-node-tests.yml:46] [SOURCE: .github/workflows/opencode-plugin-tests.yml:54]
[SOURCE: .github/workflows/opencode-dual-version.yml:74] — 6–8× actual. That is a harmless
ceiling, not a defect. `matrix.fail-fast: false` is deliberate and correct here
[SOURCE: .github/workflows/opencode-dual-version.yml:75-78] because the two legs report
independently. None of the three declares `concurrency`, which iteration 002 recorded repo-wide
(F5 there); this iteration confirms it for this slice, so a superseded push runs all five jobs to
completion and bills for them.

### Ruled out

- **One provisioning job feeding the others through artifacts.** Upload happens only after a job
  ends, so the four consumers would wait for a full provision *plus* upload *plus* download of 14
  trees; `actions/cache` gives each job the same bytes without the ordering constraint and
  without a producer job to keep alive. Rejected on dependency shape, not on size.
- **Caching `node_modules` by hashing `package.json`.** The provision path list selects 14 of the
  repository's package trees and 5 build outputs
  [SOURCE: .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:19-66]; a key built from
  `package.json` alone would restore a tree whose lockfile had moved underneath it. Any cache key
  must hash every lockfile under those trees *and* the path list file itself, so that a change in
  what gets provisioned also invalidates the cache.

## 4. QUESTIONS ANSWERED

- Which work is duplicated across workflows, and what does the repeated provision_worktree and
  bun install cost per run?

## 5. QUESTIONS REMAINING

- Where is caching missing or ineffective for npm, bun, provisioned trees and OpenCode installs?
  (F3 answers "missing everywhere" for actions; the *size* of each tree and the right key design
  are open.)
- Do the other 30 workflows install the same 14 trees under a differently named step? A
  name-based filter cannot see them; a command-based sweep of all 33 workflows (`npm ci`,
  `npm install`, `bun install`) would settle it.
- Are parallelism, matrix design, fail-fast and concurrency cancel-in-progress groups set well?
- Which tests or jobs are flaky or slow, and are job timeouts set and sized right?
- Which workflows or jobs are overengineered, such as duplicates of pre-commit hooks or advisory
  jobs that never gate?
- What security and pinning hygiene gaps exist in the workflows?
- What on/off control design lets a clone or base repo disable workflows or groups without
  editing YAML?
- What should a /doctor:ci command do, how is it made safe, and who owns it?
- What should an sk-code-ci mode contain, and what does registering a new sk-code mode require?
- How do the ranked recommendations group into ordered implementation phases 002 and later?

## 6. NEXT FOCUS

Caching, priced on commands rather than step names. Sweep all 33 workflows for every install and
build invocation, size the trees the three provisioning workflows install, and design the cache
key from the lockfiles plus `worktree-provision-paths.txt`. That is the prerequisite for the
merge decision: with a restore in place the merged job drops to ~4 billed min, which makes F5 and
F3 additive rather than a trade.

Slice-level ranking, to feed the phase plan:

| # | Change | Saving | Risk | Effort |
|---|---|---|---|---|
| R1 | Composite provision action with an `actions/cache` restore of the 14 trees + 5 builds; replace `npm install bun` with a pinned setup | ~145 min/day (3.8%), −60 s wall/job | medium — stale restore is caught by the existing satisfied-walk, but key coverage must be complete | 1 new `.github/actions/` action + 5 step replacements |
| R2 | Merge `hooks-node-tests` into `opencode-plugin-tests` | ~124 min/day (3.3%), 1 checkout + 1 provision | low-medium — one file, but the required-check name changes, which is an operator branch-protection edit | 1 file |
| R1+R2 | Both | ~207 min/day (5.4%) | — | — |
| R3 | Confirm or remove the `both` job's provision (F6) | ~7 min/day | low | one experiment + one step |

## SCOPE VIOLATIONS

None. No workflow, script, action or researched file was modified; all three writes are inside
the run directory.
