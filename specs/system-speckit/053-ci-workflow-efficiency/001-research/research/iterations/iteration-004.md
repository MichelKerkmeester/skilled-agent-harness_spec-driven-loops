# Iteration 004 — Caching: where it is missing, where it would be keyed badly, and what it cannot reach

## 1. FOCUS

Caching, end to end. The reducer's hint asked: *where is caching missing or ineffective for npm,
bun, provisioned trees and OpenCode installs?* Iteration 003 established that the repository has
**no** caching at all and priced a provision-tree cache (its F3/R1). This iteration goes past the
inventory to three questions iteration 003 left open:

1. **Size the target properly** — not "is there a cache" but "what fraction of a job *is*
   install work", measured across every workflow rather than the three provisioning ones.
2. **Distinguish cache-able from cache-defeated** — the provision path runs `npm ci`, which has
   consequences for what a cache may legitimately contain.
3. **Find the key hazards before anyone writes a key** — matrix legs, the `both` job and the
   multi-lockfile tree shape each break a naive key in a different way.

The finding that reorganises the recommendation: **install is 9.2% of sampled job wall; the
checkout is 26.6%.** Caching cannot touch the larger half of the fixed cost, and no ranking that
puts caching first is honest until that is stated.

## 2. ACTIONS TAKEN

1. Re-aggregated the 219 sampled non-skipped jobs from the step arrays in
   `scratch/ci-run-data/jobs/*.json`. Iteration 003's step aggregation returned nothing because
   the saved JSON uses camelCase step timestamps (`startedAt`/`completedAt`, not
   `started_at`/`completed_at`); fixing the key made step-level timing available for the whole
   sample rather than the three workflows. This is the measurement the rest of the section rests on.
2. Grouped every step whose name matches `Install|Provision` and every `checkout` step, per job,
   then per workflow, to get an install-share and a checkout-share of wall time.
3. Swept `.github/` for `cache:`, `cache-dependency-path` and `actions/cache` (rg, whole tree).
4. Counted tracked `package.json` (19) and counted tracked files declaring a `packageManager`
   field (0), because `actions/setup-node` turns npm caching on automatically from that field.
5. Read `actions/setup-node`'s own README via `gh api` to settle two load-bearing claims instead
   of asserting them from memory.
6. Located every `npm install --no-save --prefix "$RUNNER_TEMP/bun" bun@1.3.9` site and every
   `npm install -g --prefix` site to price the OpenCode installs separately from the tree
   provision (5 bun sites, 4 OpenCode install sites).
7. Read the provision install branch in `worktree-naming.sh` (bun vs npm selection, `npm ci`) and
   the tree path list, to decide what a cache may contain without lying to the satisfied-walk.
8. Swept `fetch-depth` across all workflows (10 request full history) to put a number on the
   checkout side of the fixed overhead.

## 3. FINDINGS

### F1 — The fixed per-job overhead is 35.8% of wall time, and checkout is 2.9× install (confirmed)

Across 219 non-skipped sampled jobs (40,521 s of job wall):

| Component | Seconds | Share of job wall | Per job |
|---|---|---|---|
| `actions/checkout` steps | 10,775 | **26.6%** | median 51 s (n=206) |
| Steps named `Install …`/`Provision …` | 3,742 | **9.2%** | see F7 for the spread |
| Both together | 14,517 | **35.8%** | — |

Measured from the step arrays of [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39912381951.json:1]
and its 200-odd siblings, aggregated in [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:1].

The consequence is a ranking constraint, not a detail: a perfectly warm install cache can remove at
most the 9.2% column. The 26.6% checkout column is not cache-able by any npm mechanism — it is paid
to materialise a 108,753-file tree ([SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-003.md:1]
records the file count). Only **fewer jobs** (iteration 003's merge recommendation) or **checkout
shaping** (F9) moves it. Iteration 003's R1 remains correct on its own terms; F1 says it is the
second-largest lever, not the first.

### F2 — There is still no caching, and one automatic path to it is switched off repo-wide (confirmed)

`rg` over `.github/` for `cache:`, `cache-dependency-path` and `actions/cache` returns **nothing** —
iteration 003's finding holds at tree level, not just in the 230-job sample. The 35 `setup-node`
steps pass `node-version` alone, e.g. [SOURCE: .github/workflows/spec-kit-check.yml:72]
[SOURCE: .github/workflows/gate-inputs.yml:22] [SOURCE: .github/workflows/agent-mirror-sync.yml:15]
[SOURCE: .github/workflows/deep-loop-runtime.yml:45] [SOURCE: .github/workflows/routing-registry-drift.yml:129].

New this iteration: `actions/setup-node` enables npm caching *automatically* when `package.json`
declares a `packageManager` field — "Caching for npm dependencies is automatically enabled when
your `package.json` contains either `devEngines.packageManager` field or top-level
`packageManager` field set to `npm`, and no explicit cache input is provided"
[SOURCE: actions/setup-node README, `gh api repos/actions/setup-node/contents/README.md`. Line 199. Label: documented].
None of the **19** tracked `package.json` declares one (rg count: 0). So the repository is paying
the uncached path twice over: no explicit `cache:`, and no field that would supply it implicitly.

### F3 — The provision path defeats a `node_modules` cache, so the only honest cache is the download cache plus the build outputs (confirmed mechanism, documented behaviour)

The provision script picks its installer per tree: `bun install --frozen-lockfile` where a bun
lockfile exists, otherwise `npm ci --no-audit --no-fund`, falling back to `npm install` only when
there is no lockfile [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:643-666].
`npm ci` deletes `node_modules` before installing, and `actions/setup-node` "does not cache
`node_modules`" [SOURCE: actions/setup-node README, `gh api repos/actions/setup-node/contents/README.md`. Line 168. Label: documented].

Therefore a cache entry that contained `node_modules` would be either wiped (`npm ci`) or, if
restored *after* install, pointless. The two legitimate targets are:

- **`~/.npm` (npm download cache)** and **`~/.bun/install/cache`** — these survive `npm ci`
  because they cache tarballs, not trees. `cache-dependency-path` is the documented input for
  multi-file lockfile sets: "Use `cache-dependency-path` for cases when multiple dependency files
  are used, or they are located in different subdirectories"
  [SOURCE: actions/setup-node README, `gh api repos/actions/setup-node/contents/README.md`. Line 166. Label: documented].
- **The 5 build outputs** the path list names (`dist/plugin.js`, `dist/api/index.js`,
  `dist/continuity/generate-context.js`, `dist/runtime/lib/policy-plan.js`, `dist/cli.js`)
  [SOURCE: .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:19-66] — these are written
  by `tsc --build`/bun and are what the satisfied-walk checks for, so restoring them is restoring
  exactly the evidence the walk looks at.

### F4 — The bun bootstrap runs in four workflows, not three (confirmed; corrects iteration 003's F2 scope)

`npm install --no-save --prefix "$RUNNER_TEMP/bun" bun@1.3.9` appears at **five sites across four
workflows**:

- [SOURCE: .github/workflows/opencode-dual-version.yml:101] (battery legs)
- [SOURCE: .github/workflows/opencode-dual-version.yml:184] (`both` job)
- [SOURCE: .github/workflows/opencode-plugin-tests.yml:69]
- [SOURCE: .github/workflows/hooks-node-tests.yml:60]
- [SOURCE: .github/workflows/spec-kit-check.yml:100] ← the fourth workflow

Iteration 003 wrote that provision work is "confined to these three workflows". The bun
installer is confirmed present in `spec-kit-check` as well, so the "no other workflow provisions"
claim was too strong: at minimum, the same network bootstrap is paid there too — and
`spec-kit-check` is the single most expensive workflow in the dataset (1,279 est. billed
min/day) [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:1].
Whether `spec-kit-check` also calls `provision_worktree` after that line is **UNKNOWN**; its three
job medians (1,215 s, 62 s, 163 s) and install steps (46 s/41 s/11 s) are too coarse to tell, and
settling it is a one-line `sed -n '95,130p'` read in the next iteration, not a re-run.

### F5 — Caching the OpenCode installs is not worth a key (confirmed, closing the reducer's hypothesis)

The OpenCode installs are cheap: 5-8 s per leg, against a 60 s provision in the same job.

| Site | Step | Cost |
|---|---|---|
| [SOURCE: .github/workflows/opencode-dual-version.yml:134] | `Install OpenCode ${{ matrix.family }}` | 5-8 s/leg |
| [SOURCE: .github/workflows/opencode-dual-version.yml:138] | `npm install -g --prefix "$prefix" "${{ matrix.package }}"` | (above) |
| [SOURCE: .github/workflows/opencode-dual-version.yml:190] | `Install both versions into their own prefixes` | 11-14 s |
| [SOURCE: .github/workflows/opencode-dual-version.yml:193-194] | two `npm install -g --prefix` | (above) |

Step medians from [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39909844429.json:1].
Across 7 runs/day × 3 jobs × ~6 s, an OpenCode-specific cache saves ~2 min/day and adds a second
key space to maintain. **Ruled out as a standalone optimisation**; the npm download cache from
F3 covers these installs incidentally because they are ordinary registry installs.

### F6 — Three key hazards that a naive cache will hit, each differently (confirmed mechanism, inferred consequence)

The recommendation in iteration 003 said "hash every lockfile under those trees and the path-list
file". That is necessary but not sufficient:

1. **Multi-lockfile breadth.** 19 tracked `package.json`; at least 6 `package-lock.json` inside the
   two skills roots alone, plus bun lockfiles that F3's branch keys off. A key built from
   `package-lock.json` only would silently miss the bun-installed tree.
2. **Matrix cross-pollution.** The two battery legs install *different packages* into
   *per-family prefixes* — `opencode-ai@1.19.3` for v1, `@opencode/cli@2.0.32` for v2
   [SOURCE: .github/workflows/opencode-dual-version.yml:134-138]. A cache that covered
   `$RUNNER_TEMP/opencode-*` with a key that omitted `matrix.family` would make the two legs
   restore each other's entries (last writer wins), and the battery would then probe the wrong
   binary — the failure mode is a *passing* battery on the wrong version, which is worse than a
   miss.
3. **The `both` job installs both packages** into the same shared key space
   [SOURCE: .github/workflows/opencode-dual-version.yml:193-194]. Sharing a key with the legs
   restores a prefix the leg did not ask for.

The safe shape: one key namespace for `~/.npm`/`~/.bun` (content-addressed by every lockfile *and*
`worktree-provision-paths.txt`), a second key namespaced by `matrix.family` for the OpenCode
prefixes, and **restore-only** semantics for the prefix caches so a bad entry costs a reinstall
rather than a wrong-version pass.

### F7 — Where a cache actually pays, per workflow (confirmed)

Install-shaped steps per job, from the same 219-job aggregation:

| Workflow | Install s/job | Checkout s/job | Job wall s | Install share |
|---|---|---|---|---|
| opencode-dual-version | 73 | 44 | 142 | **51%** |
| opencode-plugin-tests | 61 | 51 | 134 | **46%** |
| hooks-node-tests | 59 | 44 | 180 | **33%** |
| routing-registry-drift | 59 | 53 | 149 | **40%** |
| spec-kit-check | 34 | 48 | 464 | 7% |
| changed-packet-validation | 15 | 65 | 87 | 17% |
| deep-loop-runtime | 15 | 75 | 660 | 2% |
| gate-inputs | 14 | 50 | 100 | 14% |
| everything else sampled | 0-19 | 35-76 | 46-242 | ≤16% |

Two readings matter. First, in the four workflows above 33% the cache is the dominant lever and
each job is one billed minute away from the next boundary — this corroborates iteration 003's
145 min/day estimate from an independent direction. Second, for the two heaviest workflows by
billed minutes (`spec-kit-check` at 1,279 min/day and `deep-loop-runtime` at 61 min/day) install is
2-7% of job wall; their cost is suite runtime, and caching is nearly irrelevant there. Applied to
the 3,812 billed min/day total, the whole install column is a ~340 min/day **ceiling**, of which a
warm download cache realistically captures 40-60% (inferred: a warm npm cache removes the network
fetch, not the extract and link work) — **135-200 min/day**, bracketing iteration 003's estimate.

The largest single target *outside* the three provisioning workflows is
`Install advisor scorer + build the shared projection dependency` in `routing-registry-drift`,
median 88 s with 81-114 s outliers [SOURCE: .github/workflows/routing-registry-drift.yml:142]. That
step is install **plus a build**, so the win is caching the compiled projection, not the download —
a distinct artifact key from F3's, and worth separating when the phase is planned.

### F8 — Cache size is an unmeasured risk (inferred, UNVERIFIED)

GitHub bounds a repository's cache storage (documented externally as 10 GB/repo with eviction of
entries unused for ~7 days). I did not read that documentation this iteration, so this is
**inferred**: 14 dependency trees plus 5 build outputs, including a Playwright dependency set
[SOURCE: .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:57-65], may exceed the budget,
in which case entries evict each other and the cache oscillates between hit and miss. What would
confirm it: `du -sh` the provisioned trees on a runner in one instrumented job. Until then the key
should carry a version prefix so a size-triggered rewrite can invalidate cleanly, and the phase
should measure before it commits to caching all 19 targets at once.

### F9 — Ten workflows request full history, and the checkout is the leverage caching cannot buy (inferred)

`fetch-depth: 0` appears in ten workflows —
[SOURCE: .github/workflows/deep-loop-runtime.yml:42] [SOURCE: .github/workflows/repo-rules-corpus.yml:33]
[SOURCE: .github/workflows/comment-hygiene.yml:13] [SOURCE: .github/workflows/skill-doc-frontmatter.yml:58]
[SOURCE: .github/workflows/sk-doc-script-tests.yml:82] [SOURCE: .github/workflows/agent-mirror-sync.yml:13]
[SOURCE: .github/workflows/changed-packet-validation.yml:19] [SOURCE: .github/workflows/message-contract.yml:23]
[SOURCE: .github/workflows/rule-canary-sync.yml:15] [SOURCE: .github/workflows/naming-standard-guard.yml:17-20] —
against `fetch-depth: 1` in the ones that only need the tip
[SOURCE: .github/workflows/trigger-index-rebuild.yml:48] [SOURCE: .github/workflows/markdown-link-integrity.yml:38]
[SOURCE: .github/workflows/runtime-no-spec-import.yml:29] [SOURCE: .github/workflows/routing-registry-drift.yml:128].

The depth-0 workflows' per-job checkout medians (70-76 s for naming-standard-guard, message-contract
and rule-canary-sync) sit above the depth-1 ones (18-38 s), and both sit above the 51 s overall
median shape described in F1. This is a **correlation on 5-run samples, not a controlled
measurement** — several of those jobs need base-ref diffs and cannot simply drop history. A
blob-filtered partial clone (`filter: blob:none` with the depth they need) is the shape that keeps
the diff and drops the blobs, but it must be audited against each consumer's `git diff` use first.
Label: inferred.

### Ruled out this iteration

- **Caching OpenCode installs as their own target** (F5): 5-8 s/leg, ~2 min/day, one more key space.
- **Caching `node_modules`** (F3): `npm ci` deletes it and setup-node refuses to cache it; the
  only honest payload is the tarball cache plus build outputs.
- **Relying on `packageManager` to switch caching on implicitly** (F2): zero of 19 packages declare
  it; adding the field to 19 `package.json` files to get a cache is a wider diff than 35 explicit
  `cache:` inputs, and it changes resolution semantics for local developers too.
- **Treating the install column as the biggest fixed cost** (F1): it is 9.2% against checkout's
  26.6%. Any phase plan that ranks caching above job-merge/checkout-shaping is mispriced.

## 4. QUESTIONS ANSWERED

- **Where is caching missing or ineffective for npm, bun, provisioned trees and OpenCode installs?**
  Missing everywhere (`rg` finds no `cache:`/`cache-dependency-path`/`actions/cache` in `.github/`)
  and the implicit path is off (0/19 `package.json` declare `packageManager`). Ineffective where it
  would be naive: a `node_modules` payload is defeated by `npm ci`; a single-lockfile key misses the
  bun trees; a matrix-blind key lets v1/v2 legs cross-restore and can produce a *passing* battery on
  the wrong version. Genuinely worth caching: `~/.npm` + `~/.bun/install/cache` content-addressed by
  all lockfiles and `worktree-provision-paths.txt`, plus the 5 build outputs and
  `routing-registry-drift`'s compiled projection. Not worth caching: OpenCode installs (F5). Ceiling
  ~340 min/day repo-wide, realistic capture 135-200 min/day (F7).

## 5. QUESTIONS REMAINING

Unchanged from iteration 003 except the caching question above:

1. Are parallelism, matrix design, fail-fast and concurrency `cancel-in-progress` groups set well?
2. Which tests or jobs are flaky or slow, and are job timeouts set and sized right?
3. Which workflows or jobs are overengineered — duplicates of pre-commit hooks, or advisory jobs
   that never gate?
4. What security and pinning hygiene gaps exist in the workflows?
5. What on/off control design lets a clone or base repo disable workflows or groups without
   editing YAML?
6. What should a `/doctor:ci` command do, how is it made safe, and who owns it?
7. What should an `sk-code-ci` mode contain, and what does registering a new `sk-code` mode require?
8. How do the ranked recommendations group into ordered implementation phases 002 and later?

Carried, now narrower: does `spec-kit-check` call `provision_worktree` after its bun bootstrap
(F4)? One file read settles it.

## 6. NEXT FOCUS

**Concurrency, matrix design, fail-fast and timeouts**, chosen because F1 makes the job count the
top lever and concurrency decides whether superseded pushes pay for jobs at all. Concretely: sweep
all 33 workflows for `concurrency:` blocks and their `cancel-in-progress` values; for the five
highest-run-rate workflows (73 runs/day each) compute how many runs a superseding push leaves
running to completion; check `fail-fast` and `max-parallel` on every matrix (only
`opencode-dual-version` is known); compare each `timeout-minutes` against its p95 job duration from
the jobs JSON to find both ceilings that are too generous and any job with no timeout. Carry F1's
framing: report changes in **jobs started per push**, not only in seconds per job.

## 7. METHOD NOTES AND CAVEATS

- The step aggregation is over 219 non-skipped jobs from the runs that had job JSON saved; it is a
  5-run-per-workflow sample for active workflows and a single run for sparse ones. Shares (9.2%,
  26.6%) are therefore sample shares, and F7's per-workflow rows inherit that variance — the
  direction of every ordering is stable across the five runs, the exact percentages are not
  precision claims.
- `Install advisor scorer + build the shared projection dependency` is 5 samples (81, 88, 91, 114
  and one below 81); its 88 s median is softer than the 60 s provision median (15 samples).
- Two claims in this iteration are *documented externally* rather than read from this repo:
  setup-node's node_modules exclusion (its README, fetched by `gh api`) and `npm ci`'s
  delete-then-install behaviour. Everything else is a repo file, a line, or a run id.
- Correction carried forward: iteration 003's "provision work is confined to these three
  workflows" is narrowed by F4 — the same bun bootstrap is confirmed at
  `spec-kit-check.yml:100`. The *provision call* itself remains unverified there and is left
  labelled UNKNOWN rather than quietly upgraded.

## SCOPE VIOLATIONS

None. All writes were confined to `research/iterations/iteration-004.md` and
`research/deltas/iter-004.jsonl`; the state log was updated only through `append-mode-event.cjs`.
No workflow, script or source file was modified; `gh api` was used read-only.
