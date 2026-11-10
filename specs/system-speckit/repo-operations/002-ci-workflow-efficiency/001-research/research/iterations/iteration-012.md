# Iteration 012 — Duplicate provisioning, part 2: the fix, sized and risked

## Focus

Angle (2), second half. Iteration 003 measured the duplication — five jobs, five checkouts, five
`provision_worktree` runs, 9.3 runner-minutes per commit before an assertion — and named three
candidate fixes without designing any. This iteration designs them: an `actions/cache` of the
provisioned tree, a reusable workflow, or one provisioning job feeding the other three through
artifacts. It sizes the saving per run and per day and names the risks.

Read-only. No workflow, action, script or config was modified. All writes are inside the run
directory.

## Actions Taken

1. Read the three workflows in full with line numbers, to fix the exact provision/checkout/self-trigger
   shape each consumer has and whether their steps are interchangeable.
2. Read `provision_worktree` and its four helpers in the `worktree-naming.sh` source
   (`_wn_deps_satisfied`, `_wn_build_stamp`, `_wn_input_fingerprint`, `_wn_output_stale`,
   `_wn_record_build`) to decide whether a restored tree would be *accepted* by the function and
   whether a restored build could be *trusted*.
3. Inventoried the lockfiles the cache key must cover (`git ls-files`), then measured the
   provisioned set on this worktree (`du -sk` over the 14 list entries).
4. Re-derived the per-step durations from the 25 recorded jobs of the three workflows (the same
   `scratch/ci-run-data/jobs/*.json` sample iteration 003 used) to check its medians and to price
   the post-fix job shapes.
5. Swept `.github/` for an existing shared-CI-code convention and for any prior `actions/cache`,
   `workflow_call` or local `uses:` — all three returned nothing. Read `.github/workflows/README.md`
   §2/§3 and `.github/scripts/check-gate-inputs.sh` to fix where a new shared unit belongs and which
   text-reading gate could guard it.

## Findings

### F1 — The satisfied-walk is name-presence only, which is why a cache works *and* why its key must be complete (confirmed)

`provision_worktree` skips a package when `_wn_deps_satisfied` succeeds
[SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:654]. That helper reads the package
manifest, picks the **first** dependency name that is not a `@spec-kit/*` local link, and walks
`node_modules` ancestors until it finds `$cur/node_modules/$dep`
[SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:486-506], the decisive test being
`[ -d "$cur/node_modules/$dep" ] && return 0`
[SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:500]. It compares no version, no
lockfile hash and no timestamp anywhere in the function.

Two consequences, and they point in opposite directions:

- **The cache is possible at all** only because of this. A `node_modules` restored from a cache
  contains the probed directory, so the walk returns 0, the install is skipped and the step exits
  in seconds instead of a minute.
- **A stale restore is accepted silently.** If the key omits a lockfile, the restored tree keeps
  wrong dependency versions and *every suite still runs and passes*. The failure mode is not a red
  build, it is a green build that proves less than it claims.

So the usual cache risk ("a stale cache breaks the build") is inverted here: the walk makes
staleness invisible. That single fact drives every rule in F4.

### F2 — The build stamps live in `.git`, so they are outside the cache unless added deliberately — and once added they are self-validating (confirmed)

A listed artifact is built only when it is missing or stale
[SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:690-696]. Staleness is decided against a
stamp file kept under the worktree's own git directory
[SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:527-532], whose content is a fingerprint
of the package's git-tracked inputs [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:540-568].
A missing stamp reports `unrecorded` and forces a rebuild
[SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:587-590]; a stamp whose fingerprint no
longer matches reports `changed` [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:591-594].

`actions/checkout` creates a fresh `.git` every run, so a cache that restores only
`node_modules` + `dist` returns a tree whose five artifacts are all `unrecorded` → all five are
rebuilt on every job. Adding `.git/provision-stamps` to the cache path fixes that, and it is safe
for a reason worth stating: **the stamp is content-validated against the current tree, not against
time**. A stamp restored from a different commit simply mismatches and triggers the rebuild it
would have triggered anyway. The stamp is the one cache entry that cannot go stale silently.

Which artifact builds dominate a 62 s provision step is unmeasured (inferred: `tsc` project
references over the spec-kit, CLI, advisor and design-generator trees plus one `bun run build`).
Measuring it costs one instrumented run with the stamp path omitted.

### F3 — The provisioned set is 2.22 GB uncompressed, and only 3.6 MB of it is build output (confirmed by measurement)

Measured on this worktree with `du -sk` over the entries in
[SOURCE: .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:19-66]:

| Tree | `node_modules` |
|---|---|
| `.skilled/skills/system-spec-kit` | 634 MB |
| `.skilled` | 483 MB |
| `.skilled/skills/system-skill-advisor/runtime` | 432 MB |
| `.pi/extensions/pi-fast-mode-w-subagent-support` | 222 MB |
| `.pi/extensions/pi-cache-optimizer` | 188 MB |
| `.skilled/skills/sk-vision/vision-runtime` | 97 MB |
| `.skilled/skills/sk-design/sk-design-md-generator/backend` | 87 MB |
| `.skilled/skills/system-deep-loop/runtime` | 65 MB |
| `.opencode` | 61 MB |
| `.skilled/skills/sk-doc`, `.skilled/skills/system-deep-loop` | 4 KB each |
| the four spec-kit `shared`/`runtime`/`runtime/cli` lines and the two Pi-extension parents | share a parent tree |
| **total** | **2,323,104 KB ≈ 2.22 GB** |

The five build outputs together are ~3.6 MB of `dist` (616 KB + 36 KB + 236 KB + 1.6 MB + 1.1 MB).
So the cache is essentially all install, and the transfer cost is the whole story — not the
artifacts. It also sets the budget question in F6.

The lockfile inventory the key must cover is 13 files, two of them bun:

```
.opencode/package-lock.json                                        .skilled/bun.lock
.pi/extensions/pi-cache-optimizer/package-lock.json                .skilled/package-lock.json
.pi/extensions/pi-fast-mode-w-subagent-support/package-lock.json   .skilled/skills/mcp-code-mode/mcp-server/package-lock.json
.skilled/skills/sk-doc/package-lock.json                           .skilled/skills/sk-vision/vision-runtime/bun.lock
.skilled/skills/system-deep-loop/package-lock.json                 .skilled/skills/system-deep-loop/runtime/package-lock.json
.skilled/skills/system-skill-advisor/runtime/package-lock.json     .skilled/skills/system-spec-kit/package-lock.json
.skilled/skills/system-spec-kit/package-lock.json  (+ .skilled/skills/sk-design/.../backend/package-lock.json)
```

`.skilled` carries both `bun.lock` and `package-lock.json`, so it is an npm tree by the per-entry
rule [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:647-652] — the bun branch applies
only to `vision-runtime`. Note that one inventory entry, the Code Mode server's lockfile, belongs to
an **excluded** tree [SOURCE: .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:72-75];
hashing it invalidates the cache for a change that provisions nothing. That over-invalidation is
the deliberate price of F4's key rule.

### F4 — Recommended fix: one composite action holding restore → provision → save, keyed by a repo-wide lockfile glob, with no `restore-keys` (recommendation grounded on F1–F3)

Nothing in `.github/` today is reusable: no `actions/cache`, no `workflow_call`, no local `uses:`
(confirmed sweep of the directory, empty result), and `.github/` holds only `dependabot.yml`,
`workflows/` and `scripts/`. The repository's existing convention for shared CI code is a script
plus a README entry — `.github/scripts/check-gate-inputs.sh` with its two tests, documented in
[SOURCE: .github/workflows/README.md:83]. But a script cannot carry the cache steps, so the
duplication would only move from five step blocks to five cache blocks. A composite action is the
unit that removes the whole thing:

```yaml
# .github/actions/provision-deps/action.yml
name: Provision dependency trees
description: >-
  Restore the provisioned dependency trees and build outputs from the Actions cache.
  A cache hit only shortens the work: provisioning still runs and remains the authority,
  because a restored tree the walk rejects is reinstalled rather than trusted.
inputs:
  use-cache:
    description: Set to false to force a cold provision, so the install path still gets exercised.
    default: 'true'
runs:
  using: composite
  steps:
    - id: restore
      if: inputs.use-cache == 'true'
      uses: actions/cache/restore@<sha-pinned>
      with:
        path: |
          .skilled/node_modules
          .opencode/node_modules
          .skilled/skills/sk-vision/vision-runtime/node_modules
          .skilled/skills/system-spec-kit/node_modules
          .skilled/skills/system-skill-advisor/runtime/node_modules
          .skilled/skills/system-deep-loop/runtime/node_modules
          .skilled/skills/sk-doc/node_modules
          .pi/extensions/pi-cache-optimizer/node_modules
          .pi/extensions/pi-fast-mode-w-subagent-support/node_modules
          .skilled/skills/sk-design/sk-design-md-generator/backend/node_modules
          .skilled/skills/sk-vision/vision-runtime/dist
          .skilled/skills/system-spec-kit/runtime/dist
          .skilled/skills/system-spec-kit/runtime/cli/dist
          .skilled/skills/system-skill-advisor/runtime/dist
          .skilled/skills/sk-design/sk-design-md-generator/backend/dist
          .git/provision-stamps
        key: provision-${{ runner.os }}-node22-${{ hashFiles('**/package-lock.json', '**/bun.lock', '**/bun.lockb', '.skilled/skills/sk-git/scripts/worktree-provision-paths.txt', '.skilled/skills/sk-git/scripts/worktree-naming.sh') }}
    - if: steps.restore.outputs.cache-hit != 'true'
      shell: bash
      run: npm install --no-save --prefix "$RUNNER_TEMP/bun" bun@1.3.9
    - shell: bash
      run: |
        set -euo pipefail
        export PATH="$RUNNER_TEMP/bun/node_modules/.bin:$PATH"
        source .skilled/skills/sk-git/scripts/worktree-naming.sh
        provision_worktree "$GITHUB_WORKSPACE"
    - if: steps.restore.outputs.cache-hit != 'true'
      uses: actions/cache/save@<sha-pinned>
      with:
        key: ${{ steps.restore.outputs.cache-primary-key }}
        path: <same list>
```

Six rules that are part of the design, each traceable to a finding:

1. **Glob the key, never enumerate it.** `hashFiles` over `**/package-lock.json`, `**/bun.lock`,
   `**/bun.lockb` covers all 13 today and every one added later, which closes F1's silent-staleness
   path structurally instead of by discipline. It also covers the path list and the provisioning
   script, so a change in *what* gets provisioned invalidates too.
2. **No `restore-keys`.** A fallback key restores a tree from a different lockfile set, which F1's
   walk accepts without a word. A cold run costs 62 s; a wrong-version green run costs the point of
   the gate.
3. **Provision runs on a hit too.** It is the verification walk: it prints `skipped already present`
   when the restore landed and reinstalls when it did not. The cache never becomes the authority.
4. **`restore` and `save` are separate steps, not the combined `actions/cache` post-step.** The save
   then has an explicit condition (hit != true) and simply does not run when provisioning failed, so
   a half-provisioned tree cannot be saved. Whether the combined action's post-step saves after a
   failed job is not verified here; this shape does not depend on the answer.
5. **Cache the stamps** (F2), in the same entry as the artifacts, so a hit skips the builds and a
   mismatched stamp rebuilds.
6. **`use-cache` input defaulting to true** — see F8's blind spot.

Leaner alternative if the action is judged too much surface: put the same four steps inline in each
workflow as a YAML anchor-free block. That keeps five copies of the key, and five places a future
edit must land, which is exactly the duplication being removed.

### F5 — Sized: −5 billed minutes per commit where all three fire, ≈ −145 billed min/day (−3.8%), and −40 s of wall clock per job (recommendation; arithmetic on measured medians)

On a hit, a job pays the cache restore plus the verification walk instead of a 62 s install. Taking
a conservative 20–30 s for restore-plus-walk against the measured provision medians
(hooks 63 s, plugin 64 s, dual-version 60 s per matrix job, over 25 recorded jobs in
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:1]):

| Workflow | Jobs | Job median today | After hit path | Billed before | After | Δ |
|---|---|---|---|---|---|---|
| `hooks-node-tests.yml` | 1 | 194 s | ~154 s | 4 | 3 | −1 |
| `opencode-plugin-tests.yml` | 1 | 138 s | ~98 s | 3 | 2 | −1 |
| `opencode-dual-version.yml` | 3 | 144 s (159/127/137) | ~104 s | 9 | 6 | −3 |
| **per commit, all three firing** | 5 | 555 s of checkout+provision | | **16** | **11** | **−5** |

Per day, using the run counts already in the dataset (hooks and plugin each ~62 runs/day,
dual-version 7 runs/day at 3 jobs): 62×4 → 62×3 (−62), 62×3 → 62×2 (−62), 7×9 → 7×6 (−21) = **≈ −145
billed min/day, 3.8% of the 3,812 min/day total** [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:1].
Wall clock falls by ~40 s on every one of the five jobs, which is the part a contributor feels.

This is steady state. Every lockfile change costs one cold run per consumer branch — dependabot
weeks will show it.

### F6 — Rejected: the artifact feed, on three independent grounds; and rejected: `workflow_call` as a dedupe (confirmed mechanisms, one inferred)

**One provisioning job uploading an artifact.** The three workflows are separate files with
separate triggers, so an artifact produced in one is invisible to the others: cross-workflow
artifact transfer needs `workflow_run` (or `repository_dispatch`), which starts only after the
producer's whole run completes. That adds a serial hop — full provision, then upload, then download
— to consumers that today start in parallel, and it hands 2.2 GB (F3) to each of four consumers
instead of one shared cache entry that Actions restores into every job concurrently. Inside a single
workflow `needs:` works, so the artifact route is available only *after* the workflows merge, and
merging them all widens `opencode-dual-version`'s path set from its narrow list
[SOURCE: .github/workflows/opencode-dual-version.yml:13-36] to the superset
[SOURCE: .github/workflows/opencode-plugin-tests.yml:14-28] — more runs, the opposite of a saving.
Whether a `workflow_run` check can satisfy a required status check for the triggering PR is
**unverified**; it does not need to be, because the route loses on the two grounds above.

**Reusable workflow (`workflow_call`).** A called workflow runs *as the caller's job*, on its own
runner, after its own checkout. It deduplicates definitions, never work: the three call sites would
still be three provisions. To dedupe work it must absorb whole jobs, and the three jobs differ
materially — a 2-entry `include` matrix with `fail-fast: false`
[SOURCE: .github/workflows/opencode-dual-version.yml:77-86], a second unrelated `both` job
[SOURCE: .github/workflows/opencode-dual-version.yml:169-173], a git identity step
[SOURCE: .github/workflows/hooks-node-tests.yml:67-70], a `bun test` + `bunx tsc` step pinned to one
matrix leg [SOURCE: .github/workflows/opencode-dual-version.yml:123-130], and two artifact uploads.
Parameterizing that into one body produces a steps-array input or a family switch — overengineering
by this repository's own standard. The honest single reuse case is iteration 003's merge (F5 there):
once hooks and plugin tests are one job, there is nothing left to reuse.

### F7 — The fix creates a self-trigger drift class the repository does not guard yet (confirmed gap, recommendation)

Each workflow's path list names only **its own** file
[SOURCE: .github/workflows/hooks-node-tests.yml:24] [SOURCE: .github/workflows/opencode-plugin-tests.yml:28]
[SOURCE: .github/workflows/opencode-dual-version.yml:37] [SOURCE: .github/workflows/opencode-dual-version.yml:65].
After the action lands, an edit to `.github/actions/provision-deps/action.yml` changes what all five
jobs do and re-runs **none** of them: the change is untested until the next unrelated commit. Two
cheap guards close it:

- add `.github/actions/**` to all three path lists (push and pull request), the same way each
  already lists itself;
- extend the existent text-reading gate. `check-gate-inputs.sh` already loops every workflow file
  [SOURCE: .github/scripts/check-gate-inputs.sh:481], so a new case — *any workflow that names a
  local `.github/actions/...` path must name that path in both filters* — is a few lines in a check
  that already parses this exact text. It belongs to the `sk-code-ci` rule set from angle (11).

Note the interaction with the existing parity rule: `gate-inputs` requires that a path filter naming
one source root names both [SOURCE: .github/workflows/README.md:36]. `.github/actions/**` is neither
root, so it neither joins a pair nor breaks one.

### F8 — The risk that matters is not staleness but silence: a warm cache stops exercising the install path (recommendation)

Every consideration above is about minutes. The one about trust: the miss path is the only path that
proves `provision_worktree` still works against today's lockfiles. With a warm cache the repository
can merge a change that breaks a cold install — a removed tarball, a `--frozen-lockfile` mismatch —
and see nothing but green, because no job installs any more. The mitigation is one input and one
schedule: `use-cache: 'false'` on a weekly `schedule:` run (or a `workflow_dispatch` input), which
costs the cold 62 s once a week and keeps the claim "the tests pass" meaning what it says.

Second-order risks, smaller:

- **Cache budget.** A 2.22 GB set compresses to roughly 0.7–1 GB per entry, against a per-repository
  cache budget of 10 GB and entries evicted after 7 days unused. That is ~10 keys — one per branch
  family, not one per lockfile — so dependabot churn evicts. **These two figures are documented
  GitHub behaviour but were not re-verified in this environment** (the two prior doc fetches 404'd,
  iteration 011 F6); the design does not depend on their exact values, only on the budget being
  finite and shared, which is enough to require the over-invalidation in rule 1.
- **Two more pinned actions** (`cache/restore`, `cache/save`) join the supply-chain surface that
  angle (8) already flags; both must be SHA-pinned like every other `uses:` in the tree.
- **Five jobs now depend on one file.** An error in the action fails all five at once — loud, not
  silent, and the same blast radius the workflows already have through `worktree-naming.sh`.
- **PR cache scope.** Caches are scoped to the ref that wrote them, so a fork or PR cannot seed the
  base branch's cache; main's entry is the one every PR restores. Labelled **inferred** — same
  documentation gap as the budget figures. It does not affect correctness: worst case is a cold run.

### Sequencing correction — the cache must ship *before* the merge, and the merge is not free any more

Iteration 003 concluded the cache and the merge "belong in the same phase, not in separate ones",
because the merge alone pushes the contributor's wait from 194 s to ~269 s. With the cache priced,
the order matters more, not less:

| State | PR wait for this coverage | Billed min per commit |
|---|---|---|
| today | 194 s (three workflows in parallel) | 16 |
| cache only | ~154 s | 11 |
| merge only | ~269 s | 14 |
| cache + merge | 230 s (one job: 25 s restore + 131 s hooks + 74 s plugin) | 10 |

So the cache is a win on both axes, the merge is a minutes-for-latency trade, and doing the merge
first makes things worse on both axes than doing the cache first. **Ship the cache first; treat the
merge as a separate, optional trade worth −1 billed min/run (≈ −62/day) against +76 s of wait.**

## Questions Answered

None of the strategy's open key questions. This iteration designs the fix for an already-answered
cost question (key question 2, ticked at iteration 003), so `answeredQuestions` is empty by design
rather than by omission.

## Questions Remaining

- What should a `/doctor:ci` command do, how is it made safe, and who owns it? Fully constrained by
  iteration 011: it can read `vars` state and report it, but writing repository variables needs an
  admin token, so its toggle mode is a printed instruction plus a verification read, not a mutation.
- What should an `sk-code-ci` mode contain, and what does registering a new `sk-code` mode require?
  Its rule set now has seven concrete entries from this iteration alone: glob-hash the cache key, no
  `restore-keys`, keep the provision call on the hit path, split `restore`/`save`, cache the stamps
  with the artifacts, add `.github/actions/**` to any consumer's path list, and give a cold-run
  escape hatch.
- How do the ranked recommendations group into ordered implementation phases 002 and later?
- **Blocking phase 002, unchanged:** does a job skipped by `if:` satisfy a required status check?
  Two doc fetches, both 404 (iteration 011 F6). Still mitigated, not resolved.
- Carried forward: which jobs duplicate pre-commit hooks?
- Carried forward: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and does
  `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` set it?
- Carried forward: what are the include globs of `.skilled/hooks/vitest.config.ts`?
- New: three components of the saving are inferred, not measured — cache restore throughput, the
  `npm install bun` share of the 62 s, and the cost of the verification walk plus stamp fingerprinting.
  One instrumented run settles all three.

## Next Focus

The phase plan (key question 12). The top of the ranking is now order-constrained by evidence rather
than by taste: cache first (both axes), merge later (minutes only, latency-negative), then the
cheap slices — the `both` job's provision, concurrency groups, and the on/off switch groups that
iteration 011 already sequenced behind the skipped-job question. Reading iteration 002's and 007's
ranked tables alongside this one is the cheapest way to write phases 002+ without re-deriving them.

The skipped-job question should not be attacked by a third fetch: the documentation endpoint has
returned 404 twice. It is an empirical question (open a PR that trips a gated job and look at the
merge box), so it belongs in a phase-002 experiment note, not in a research iteration.

## SCOPE VIOLATIONS

None. No workflow, action, script, config or researched file was modified; the three writes are this
narrative, this iteration's delta file, and the append-gateway record, all inside the run directory.
