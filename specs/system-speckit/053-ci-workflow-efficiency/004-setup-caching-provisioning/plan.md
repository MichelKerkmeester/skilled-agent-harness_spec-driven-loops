---
title: "Implementation Plan: Phase 4: setup-caching-provisioning"
description: "Teach the gate-input check to scan composite actions, measure the cache against the 10 GB budget, build one cached setup action that restores, provisions and saves, adopt it at five provisioning sites and in the multi-install workflows, merge the hook and plugin test workflows, cache the pip installs, and trial a partial checkout on the lightest workflow."
trigger_phrases:
  - "setup caching provisioning plan"
  - "phase 4 setup caching provisioning plan"
  - "composite setup action cache plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: setup-caching-provisioning

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML and composite actions; bash (`check-gate-inputs.sh`, `worktree-naming.sh`); Node.js 20 and 22 for the jobs; Python for four pip steps |
| **Framework** | `actions/cache/restore` and `actions/cache/save`, a SHA-pinned `oven-sh/setup-bun`, the repository's own `provision_worktree`, and the twin-filter gate that reads CI inputs as text |
| **Storage** | The GitHub Actions cache. The provisioned set is 2.22 GB uncompressed with 3.6 MB of build output; `scratch/` holds the measurements |
| **Testing** | `bash .github/scripts/check-gate-inputs.sh` and its fixture suite; a YAML parse of every workflow; CI runs read with `gh run view --json jobs`; cache entries read with `gh api .../actions/caches` |

### Overview
The phase has one spine and three accessories. The spine is R12 → R13 → R14: make the gate read `.github/actions/`, measure the cache before building it, then build one composite action that restores a cache, sets up bun, runs `provision_worktree` and saves. The accessories hang off it: R15 merges the two hook and plugin workflows into one job that calls the action once, R16 replaces the repeated `npm ci` blocks in the multi-install workflows with the same action, and R17 adds the pip cache to four `setup-python` steps. R18 is a separate probe on a light checkout and depends on phase 003, not on the action. Every saving is measured against the 002 baseline and re-measured on a warm run, because the review's ~145 and 124 runner-min/day figures are arithmetic on medians, not observations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: the 002 baseline, D5 answered, `gh` with `repo` and `actions`, and for R18 phase 003's R8 landed

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing: `check-gate-inputs.sh` prints `RESULT: PASSED` over the real tree, `check-gate-inputs.test.sh` passes every case including the four new ones, every workflow parses, and every adopted workflow is green on a warm run and on a cold dispatch run
- [ ] Docs updated: `.github/workflows/README.md` rows, `scratch/cache-probe/`, `scratch/npm-dedupe.md`, `scratch/phase-result.md`, spec/plan/tasks
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One reusable composite action over a repository-wide cache, with the repository's own provisioning script kept as the authority and the cache treated as an accelerator only. The gate that reads CI inputs is extended first, so the new shared unit is inside the gate's scan surface from its first commit rather than after it.

### Key Components
- **The gate-input scan** (`check-gate-inputs.sh:350-411`, `:413-443`, `:481-485`): `WORKFLOW_AWK` parses a YAML file as text, records every path filter's entries as one group for the twin rule, resolves every literal `.opencode/` or `.skilled/` path a `run:` names, and fails closed on a shape it cannot read. `scan_workflow` turns those records into `filter-twins`, `workflow-inputs` and `parser-miss` verdicts. It reads `.github/workflows/*.yml` today and nothing else.
- **The provisioner** (`worktree-naming.sh:619-733`): reads `worktree-provision-paths.txt` (`:19-66`), skips a package when `_wn_deps_satisfied` finds its first non-local dependency in a `node_modules` ancestor (`:486-506`), installs with `npm ci` or `bun install --frozen-lockfile`, builds a listed artifact when it is missing or its stamp mismatches (`:690-696`), and exits non-zero if any install or build failed.
- **The build stamp** (`worktree-naming.sh:527-532`, `:540-568`): a fingerprint of a package's git-tracked inputs, kept under the worktree's own git directory. A fresh `.git` from `actions/checkout` makes every stamp `unrecorded` (`:587-590`), so a cache that omits `.git/provision-stamps` rebuilds every artifact on every hit.
- **The composite action** (`.github/actions/setup/action.yml`): `actions/cache/restore` → `oven-sh/setup-bun` → `provision_worktree` → `actions/cache/save`. The save is a separate step with its own condition, so a failed provision cannot write a half-provisioned tree back.
- **The merged job** (`opencode-plugin-tests.yml`): one checkout, one provision, then the hook `node:test` collection (`hooks-node-tests.yml:75-93`), the installer test (`:95-96`) and the plugin suites (`opencode-plugin-tests.yml:76-77`).
- **The cold path**: a `workflow_dispatch` input `cold` on the two workflows that survive the merge plus a weekly `schedule` on the merged workflow, both forcing `cache: false` so the install path that a warm cache hides is still exercised.

### Data Flow
A job checks out → `setup-node` fixes the Node major → the composite action computes a key from `runner.os`, the Node major and a hash of every lockfile plus the provision list and the provisioner → `actions/cache/restore` tries the exact key → `setup-bun` puts the pinned bun on `PATH` → `provision_worktree` runs regardless of the hit, skipping satisfied trees and rebuilding stale artifacts → `actions/cache/save` runs only on a miss and only after the provision exited 0 → the job's own suites run. A cache hit therefore shortens the install but never replaces the walk that decides whether the tree is usable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-gate-inputs.sh:481-485` | Scans `.github/workflows/*.yml` and `*.yaml` only | update: a guarded `find` over `.github/actions` feeding the same `scan_workflow` | `bash .github/scripts/check-gate-inputs.sh` prints `files=45` before the action exists and `files=46` after, with `RESULT: PASSED` both times |
| `check-gate-inputs.sh:384` | Treats `name:` as a label so step titles are prose, not inputs | update: `(name\|description):` | a fixture action whose `description:` names a path passes; the same path in a `run:` fails |
| `check-gate-inputs.sh:18-25` | Rule comment names workflows and filters | update: name composite actions in the `workflow-inputs` and `filter-twins` lines | `grep -c 'composite action' .github/scripts/check-gate-inputs.sh` is at least 2 |
| `.github/actions/` | Absent today | create: `setup/action.yml` | `find .github/actions -name 'action.y*ml' \| wc -l` returns 1 |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | The provisioner, unchanged | not a consumer | `git diff --stat` on the file is empty |
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | The provision list, unchanged | not a consumer | `git diff --stat` on the file is empty |
| `hooks-node-tests.yml:3-10,57-70,75-96` | Own workflow, own checkout, own provision | update: its steps move to `opencode-plugin-tests.yml`; the file is deleted | `test ! -f .github/workflows/hooks-node-tests.yml` |
| `opencode-plugin-tests.yml:3-10,14-45,50-77` | Own workflow, own provision, 20-minute timeout | update: adopt the action, union the trigger, take the hook steps, add the cold input and the weekly schedule | `grep -c 'uses: ./.github/actions/setup' .github/workflows/opencode-plugin-tests.yml` returns 1; the run log carries every suite |
| `opencode-dual-version.yml:98-105,181-188` | Two provision steps: one in `battery`, run once per matrix leg, and one in `both` | update: two action calls covering three job instances, both bun bootstraps gone | `grep -c 'uses: ./.github/actions/setup'` returns 2; `grep -c 'bun@1.3.9'` returns 0 |
| `spec-kit-check.yml:83,86,89,100,166,209,210,212,213` | Nine npm install commands across three jobs, plus a hand-built sk-vision bundle | update: one action call per job; the sk-vision step is redundant because the provision list already builds `dist/plugin.js` | `grep -c 'npm --prefix'` returns 0; `test -f .skilled/skills/sk-vision/vision-runtime/dist/plugin.js` after the action |
| `routing-registry-drift.yml:132-142,246-253` | Installs spec-kit and sk-doc in the lean job, spec-kit and the advisor runtime in the golden-prompt job | update: one action call per job | `grep -c 'npm --prefix'` returns 0; the warm install step in the lean job is shorter than 88 s |
| Eight more multi-install workflows | Two to four installs each | update: one action call per install block, kept only where the warm step drops | `scratch/npm-dedupe.md` has one row per file with before, after and keep/revert |
| `naming-standard-guard.yml:23-25`, `sk-doc-rename-harness.yml:36-38`, `sk-doc-script-tests.yml:25-27`, `spec-kit-check.yml:194-196` | Pinned `setup-python` with no cache | update: `cache: pip` and a `cache-dependency-path` naming the workflow file | `grep -c 'cache: pip'` returns 1 in each; `grep -c 'cache-dependency-path'` returns 1 in each |
| `rule-canary-sync.yml:13-15` | Full-history checkout at depth 0 today; phase 003 sets the depth | update: trial `filter: blob:none`, then a sparse checkout | the checkout step seconds are recorded for each variant, and the canary passes |
| `.github/workflows/README.md:37,42,69` | Two rows for two workflows; one path-filtered row naming both | update: one merged row, and the deleted file dropped from `:69` | `grep -c 'hooks-node-tests' .github/workflows/README.md` returns 0 |

Required inventories:
- Same-class producers: `grep -rn 'bun@1.3.9' .github/workflows` finds five sites (`hooks-node-tests.yml:60`, `opencode-plugin-tests.yml:69`, `opencode-dual-version.yml:101,184`, `spec-kit-check.yml:100`), not the three the review names. `grep -rln 'actions/cache' .github/workflows` finds none. `find . -name package-lock.json -o -name bun.lock` outside `node_modules` finds 13 lockfiles, two of them bun. `grep -rn 'node-version:' .github/workflows` finds 13 at `'20'` and 22 at `'22'`.
- Consumers of changed symbols: `grep -rn 'provision_worktree' .github/workflows` finds four call sites in three files; `grep -rn 'uses: ./.github/actions' .github` finds none today. `grep -c 'npm (--prefix [^ ]+ )?ci'` per workflow gives the eleven multi-install files before phase 003's R6 and ten after it: `spec-kit-check.yml` 8, `routing-registry-drift.yml` 4, `skill-advisor-stress.yml`, `sk-doc-script-tests.yml`, `sk-doc-rename-harness.yml`, `deep-loop-runtime.yml` 3 each, `skill-doc-frontmatter.yml`, `playbook-operator-contract.yml`, `gate-inputs.yml`, `dispatch-enforcement-guard.yml`, `command-tree-parity.yml` 2 each.
- Matrix axes: event (push, pull_request, workflow_dispatch, schedule) × cache state (hit, miss) × workflow class (provisioning, multi-install, pip, light checkout). Required rows: warm hit on push, cold miss on push, dispatch with `cold: true`, scheduled cold run, the first run after a lockfile change, and a fork pull request, whose cache is read-only and may miss.
- Algorithm invariant: one cache key per (`runner.os`, Node major, lockfile set, provision definition), and a restored tree is accepted only if the provisioner's own walk agrees with it. Adversarial cases: a lockfile edited without its manifest, a provision-list entry added, a Node major bumped in one workflow only, a hit whose tree is missing one package, a hit whose stamp mismatches the tree, and a provision that fails before the save step.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Implementation Notes

- **D5 defaults to approving the merge, and the renamed check is named.** The merged job is `plugin-and-hook-tests`, titled `OpenCode plugin and hook node:test suites`, in `opencode-plugin-tests.yml`. `research.md:94` confirms the only active ruleset requires `message-contract.yml`'s context, so no required check is renamed; the README and any personal bookmarks are the consumers that change. The alternative is to keep both workflows separate, which forgoes 124 runner-min/day standalone and ~53 after R1 (`final-review.md:362-372`).
- **R12 lands before the action exists.** The gate is a protected workflow by function (`research.md:187`): it is the sole enforcer of an invariant with no local gate. Adding the scan first means the action's first commit is already read by the gate, and the four fixture cases prove the scan before any real action can hide in it.
- **The `description:` branch is part of R12, not an extra.** A composite action's `description:` and its input descriptions are prose, exactly like a step's `name:`. Without the label branch, an action whose prose names `.skilled/gone` fails `workflow-inputs` on a path that no job runs. Extending the existing `name:` branch at `:384` to `(name|description):` keeps the parser's fail-closed rule for `run:` lines while treating documentation as documentation.
- **The cache key globs; it never enumerates.** `hashFiles('**/package-lock.json', '**/bun.lock', '**/bun.lockb', '.skilled/skills/sk-git/scripts/worktree-provision-paths.txt', '.skilled/skills/sk-git/scripts/worktree-naming.sh')` covers today's 13 lockfiles and every one added later, and it also invalidates when the provision list or the provisioner changes. `_wn_deps_satisfied` compares a name, not a version (`worktree-naming.sh:486-506`), so a key that misses a lockfile produces a green run with wrong versions and no red build. The glob is the structural answer to that.
- **No `restore-keys`, and the save is conditional.** A fallback key restores a tree from a different lockfile set, which the walk accepts silently. The save runs only when `inputs.cache == 'true'` and `steps.restore.outputs.cache-hit != 'true'` and the provision step succeeded, so a half-provisioned tree cannot be written back.
- **`provision_worktree` runs on a hit.** It is the verification walk: it prints `skipped already present` when the restore landed and reinstalls what it rejects. The cache never becomes the authority.
- **`.git/provision-stamps` is in the cache path.** A fresh `.git` makes every stamp `unrecorded`, which forces every artifact to rebuild; the stamp is content-validated against the tree, so a restored stamp that does not match triggers exactly the rebuild it would have triggered anyway. It is the one cache entry that cannot go stale silently.
- **The Node major is an input, not a constant.** `setup-node` uses 20 on 13 lines and 22 on 22 (`final-review.md:187`), so the action takes `node-major` and puts it in the key. A job that changes its Node version therefore misses rather than restoring an ABI-mismatched tree.
- **`~/.npm` is the first thing dropped if R13 says the entry is over budget.** It only shortens a cold run; the trees and stamps are what a warm run needs.
- **The union trigger adds one entry, not two.** The review says `hooks-node-tests` adds `.hermes/**` and `.env.example` (`final-review.md:367`), but `.env.example` is already in `opencode-plugin-tests.yml`'s lists (`:22`, `:39`); only `.hermes/**` (`hooks-node-tests.yml:22,35`) is new. The merged lists are the plugin lists plus `.hermes/**`, and the merge keeps `.github/workflows/opencode-plugin-tests.yml` as the only self-reference.
- **Five bun sites, not three.** The review names `hooks-node-tests.yml:60` and `opencode-dual-version.yml:101,184`; `opencode-plugin-tests.yml:69` carries the same line, and R14's adoption covers it. The fifth, `spec-kit-check.yml:100`, is deleted with its whole sk-vision step under R16, because the provision list already builds `vision-runtime dist/plugin.js` (`worktree-provision-paths.txt:28`).
- **`oven-sh/setup-bun`, `actions/cache/restore` and `actions/cache/save` are resolved to full commit SHAs at build time**, in the same `@<sha> # vX.Y.Z` form as every other `uses:` in the tree. The task names the resolution command (`gh api repos/actions/cache/commits/v4 --jq .sha` and `gh api repos/oven-sh/setup-bun/commits/v2 --jq .sha`) rather than inventing a SHA here.
- **R16 changes what a lean job installs on a cold run.** `routing-registry-drift.yml` deliberately avoids the advisor runtime's native and ML dependencies (`:148-153`), and the action provisions the whole list. The cache key is shared across workflows, so a hit is the common case; a lockfile change costs one heavy cold run in whichever workflow runs first. `scratch/npm-dedupe.md` records the warm step per file, and a block whose warm step does not drop is reverted.
- **R17's mechanism is the pinned `setup-python` each file already has.** No requirements file exists in the repository, so `cache: pip` without `cache-dependency-path` would fail to find a dependency file; the path names the workflow file itself, whose pins are what change. The alternative, a `python` input on the composite action, would drag the full provision into four light workflows and is rejected.
- **R18 mind the symlink tree.** `.opencode/skills`, `.opencode/commands`, `.opencode/agents` and `.opencode/bin` are symlinks into `.skilled` (`ls -l .opencode`), so a sparse checkout cone must contain the `.skilled` targets, not the `.opencode` names. `check-rule-copies.js` reads `AGENTS.md` and seven files under `.skilled/skills/sk-code/` (`:40-101`, `:98-101`), so the cone is `/AGENTS.md` plus `/.skilled/skills/sk-code/` with `sparse-checkout-cone-mode: false`. A cone that omits `AGENTS.md` fails the canary on a missing file, not on a drifted rule.
- **No ephemeral ids in code.** No R-id, D-id or phase number goes into a workflow comment, a step name, an action input, a cache key or a README row. Those ids belong to these spec documents; a code comment carries the durable WHY. Each commit task runs the staged-diff search before its commit, and T071 re-scans the seven committed diffs.
- **One commit per concern.** The gate scan, the action, the five adoptions, the merge, the install substitutions, the pip cache and the checkout trial are separate commits, so a probe that fails names the commit that caused it.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | The action scan parses an action and fails on an unresolved or unreadable path | `bash .github/scripts/tests/check-gate-inputs.test.sh` (expected `check-gate-inputs: 54 passed, 0 failed`) |
| Static | Every workflow and the action are valid YAML | `python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml') + glob.glob('.github/actions/*/action.yml')]"` |
| Static | The gate reads the real tree with the action in it | `bash .github/scripts/check-gate-inputs.sh` (expected `files=46 inputs_resolved>=236 twin_pairs>=311 failures=0`, `RESULT: PASSED`) |
| Integration | A warm run is faster than the cold provision | `gh api repos/{owner}/{repo}/actions/jobs/<job-id> --jq '[.steps[] \| {name, seconds: ((.completed_at\|fromdateiso8601) - (.started_at\|fromdateiso8601))}]'` on a warm run and on a `cold: true` dispatch |
| Integration | The cache entry is what R13 measured | `gh api repos/{owner}/{repo}/actions/caches --jq '.actions_caches[] \| select(.key \| startswith("provision-")) \| {key, size_in_bytes}'` |
| Integration | The merged job runs both suites | `gh run view <run-id> --log \| grep -oE '\.skilled/hooks/[a-z0-9/-]+\.test\.(ts\|mjs)\|\.opencode/plugins/tests/[a-z0-9-]+\.test\.cjs' \| sort -u` |
| Integration | The union trigger fires on the new entry | a pull request changing only `.hermes/**`, read with `gh run list --workflow opencode-plugin-tests.yml --commit <sha>` |
| Manual | The phase delta | `scratch/phase-result.md` against `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-rebuild-fanout-removal` baseline | Internal | Pending | Every saving is measured against the 001 dataset instead, and the "after R1" figures stay arithmetic |
| `003-trigger-and-job-hygiene` R8 | Internal | Pending | R18 has no shallow checkout to build on; the phase closes without R18 and records it as blocked |
| Operator decision D5 | Internal | Yellow until answered | R15 cannot run; the merged shape is planned end to end |
| `gh` with `repo` and `actions` scopes | External | Green | No cache sizes, no job timings, no dispatch runs |
| `005-slow-and-failing-tests` | Internal | No dependency | It owns `.skilled/skills/system-spec-kit/vitest.config.ts`, which this phase does not touch |
| `006-sk-code-ci-surface` | Internal | Blocked on this phase | It records the composite-action rule from this phase's real shape |
| `007-workflow-hygiene-on-off-control` | Internal | Blocked on this phase | Its timeouts need the merged job's final shape, and its switch `if:` needs the adopted job list |
| `008-consolidation-decision` | Internal | Blocked through 007 | It re-measures the always-run workflows after this phase's installs are cheaper |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A cache hit is accepted with a tree the walk should have rejected, a cold-path run fails, a merged job loses a suite, a workflow's warm install step is slower than its baseline, or the checkout trial breaks the canary.
- **Procedure**: Revert the single commit for that concern. Deleting `.github/actions/setup/` and reverting the five adoption commits restores the inline provision blocks; the merge is restored by reverting the two workflow files together, because the deletion and the absorption are one commit; an install substitution is reverted per file; the pip cache is reverted by removing two lines from one `setup-python` step; the checkout trial is reverted by deleting the `with:` block it added.
- **Cache cleanup**: none required. An orphaned entry expires unused, and a reverted key is never read again.
<!-- /ANCHOR:rollback -->

---



---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
002 baseline ──► Setup (D5, baseline rows, pre-change inventory)
                      │
                      ├──► R12 gate scan ──► R13 cache probe ──► R14 action ──┬──► R15 merge ──┐
                      │                                                     ├──► R16 installs ┤
                      │                                                     └──► R17 pip ─────┤
                      │                                                                        ├──► Verify ──► Delta
003 R8 ───────────────┴──► R18 checkout trial ────────────────────────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `002-rebuild-fanout-removal`, D5 | R12, R13, R14, R15, R16, R17, R18 |
| R12 gate scan | Setup | R14, because the action must be inside the gate's scan surface |
| R13 cache probe | Setup | R14, which does not start without its go/no-go |
| R14 action | R12, R13, the 002 baseline | R15, R16, R17 |
| R15 merge | R14, D5 | Verify |
| R16 installs | R14 | Verify |
| R17 pip | R14 | Verify |
| R18 checkout trial | Setup, `003-trigger-and-job-hygiene` R8 | Verify |
| Verify | R12 to R18 | Delta |
| Delta | Verify, at least 24 h of post-merge traffic | `006-sk-code-ci-surface`, `007-workflow-hygiene-on-off-control`, `008-consolidation-decision` |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~45 minutes: one decision, the baseline rows, the pre-change inventory |
| R12 gate scan | Med | ~1.5 hours: one loop, one parser branch, four fixture cases, two gate runs |
| R13 cache probe | Med | ~1 hour plus two CI runs: a throwaway branch, the size and timing reads, the go/no-go |
| R14 action | High | ~2.5 hours: the action, two path blocks, five adoption sites, the cold input, two measured runs |
| R15 merge | Med | ~1 hour: one deletion, one absorption, the README rows, one trigger probe |
| R16 installs | Med | ~2 hours: ten files, one warm measurement each, the keep/revert record |
| R17 pip | Low | ~20 minutes: four two-line edits and one measurement |
| R18 checkout trial | Med | ~1 hour plus CI runs: two variants, the seconds, the keep/revert |
| Verify | Med | ~2 hours: the gate, the parse, the cold and warm runs across the adopted workflows |
| Delta | Low | ~30 minutes after a 24 h wait |
| **Total** | | **~11-12 hours across two or three calendar days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - not applicable, no data changes
- [ ] Feature flag configured - the action's `cache` input is the switch: `false` reproduces today's cold behaviour exactly
- [ ] Monitoring alerts set - the cold-path run and `scratch/phase-result.md` are the monitoring

### Rollback Procedure
1. Set the action's `cache` input to `false` at the failing site, which restores the cold path in one line without reverting code.
2. Revert the commit for the failing concern; the seven concerns are independent.
3. Re-run the probe that failed and confirm the pre-phase behaviour: the provision step is 56-67 s again and the gate still passes.
4. Update `scratch/phase-result.md` with the reverted figure, so a later phase measures against what is actually deployed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The cache entries are disposable; `scratch/` documents are records, not state, and a revert shows as a divergence from them.
<!-- /ANCHOR:enhanced-rollback -->

---


<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
D5 ──────────────► T001 ─┐
002 baseline ────► T002, T003 ─┤
                               ├──► R12 T004-T011 ──► R13 T012-T013 ──► R14 T014-T029 ──┬──► R15 T030-T041 ──┐
                               │                                                        ├──► R16 T042-T062 ──┤
                               │                                                        └──► R17 T063-T066 ──┤
003 R8 ────────────────────────┴──► R18 T067-T070 ──────────────────────────────────────┤
                                                                                         └──► T071-T074
```

The two probes bracket the action on purpose. R13 measures the entry before the action exists, so a no-go stops R14 rather than being discovered after five workflows depend on it. R18 sits on its own branch of the graph: it needs the 002 baseline for its before number and phase 003's R8 for the checkout it trials, and it needs nothing from the action.

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| D5 answer (T001) | Operator | `scratch/decisions.md` with one `D5=` line | T030 to T041 |
| Baseline rows (T002, T003) | `002-rebuild-fanout-removal`, its `scratch/baseline-24h/summary.md` | `scratch/phase-baseline.md` with the 002 total, 15 workflow rows and 5 pre-change inventories | T029, T041, T062, T070, T072 |
| Gate scan (T004 to T011) | T003's gate baseline | A gate that reads `.github/actions/**`, a `description:` label branch, four fixture cases, `RESULT: PASSED` | T014, T071 |
| Cache probe (T012, T013) | T003, a throwaway branch, `gh` with `actions` | `scratch/cache-probe/summary.md` with a measured size and a go/no-go | T014 |
| Composite action (T014) | T004 to T013 | `.github/actions/setup/action.yml` that parses, keys on every lockfile and has no `restore-keys` | T015 to T029, T042 to T066 |
| Adoption and cold path (T015 to T029) | T014, the 002 baseline | Five action calls in three workflows, `cold` inputs, a green cold dispatch and a measured warm run | T030, T042, T063 |
| Hook-and-plugin merge (T030 to T041) | T001, T014 | One workflow, one job, the union trigger, a weekly cold schedule, the README rows and a run log carrying every suite | T071, T072 |
| Multi-install substitution (T042 to T062) | T014, T003's install counts | One action call per replaced block and a keep-or-revert row per file in `scratch/npm-dedupe.md` | T071, T072 |
| Pip cache (T063 to T066) | T014 | Four `cache: pip` steps with a dependency path | T071 |
| Checkout trial (T067 to T070) | T002, phase 003's R8 | `scratch/checkout-probe.md` with three rows and a verdict | T071 |
| Gates, delta and closure (T071 to T074) | Every task above | `RESULT: PASSED`, a 14-row delta, every acceptance row `Met` | `006-sk-code-ci-surface`, `007-workflow-hygiene-on-off-control`, `008-consolidation-decision` |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001, the D5 answer** - operator latency, no upper bound - CRITICAL
2. **T002 and T003, the baseline rows and the pre-change inventory** - ~45 minutes, and they cannot start until 002 has recorded its 24 h snapshot - CRITICAL
3. **T004 to T011, the gate scan and its four fixtures** - ~1.5 hours across one script and one test - CRITICAL
4. **T012 and T013, the cache probe** - ~1 hour plus two CI runs on a throwaway branch - CRITICAL
5. **T014, the composite action** - ~1.5 hours for one file and two resolved SHAs - CRITICAL
6. **T015 to T029, the five adoptions and the cold path** - ~2 hours of edits plus one cold dispatch and one warm run - CRITICAL
7. **T030 to T041, the merge, the README and the merged-job probe** - ~1.5 hours plus one pull-request run - CRITICAL
8. **T042 to T062, the ten multi-install files** - ~2 hours of edits plus a warm measurement per file - CRITICAL
9. **T063 to T066, the pip cache** - ~20 minutes and one run - CRITICAL
10. **T067 to T070, the checkout trial** - ~1 hour plus two canary runs - CRITICAL
11. **T071 to T074, the gates, the delta and closure** - ~2.5 hours inside a wall-clock window set by 24 h of post-merge traffic - CRITICAL

**Total Critical Path**: ~12-14 hours of hands-on work inside a wall-clock window of two to five days, set by the 002 baseline, the probe runs, the cold and warm measurements, and the 24 h delta.

**Parallel Opportunities**:
- T042 to T062 touch 10 disjoint workflow files, so they can run in any order; only the per-file ordering matters (the install block first, then the filters above it, so each quoted line number stays valid).
- T063 to T066 touch four files that T037, T038 and T030 already edited, so they run after those tasks but can run among themselves in any order.
- T067 to T070 touch one file no other task edits, so the checkout trial can run beside the install substitutions once phase 003's R8 has landed.
- T012 and T013 need a branch of their own, so the probe can run while the gate fixtures are being written.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Decisions and before-state recorded | `scratch/decisions.md` carries one `D5=` line; `scratch/phase-baseline.md` carries the 002 total, the 15 workflow rows and the five pre-change inventories | After T001 to T003 |
| M2 | The gate reads composite actions | `bash .github/scripts/tests/check-gate-inputs.test.sh` prints `check-gate-inputs: 54 passed, 0 failed`; `bash .github/scripts/check-gate-inputs.sh` prints `files=45` and `RESULT: PASSED` before the action exists | After T004 to T011 |
| M3 | The cache is measured and the action exists | `scratch/cache-probe/summary.md` states a size and a `go` or `no-go`; `.github/actions/setup/action.yml` parses, has no `restore-keys`, and the gate prints `files=46` and `RESULT: PASSED` | After T012 to T014 |
| M4 | Five sites restore a warm cache and the cold path still runs | `grep -c 'uses: ./.github/actions/setup'` returns 1, 1 and 2 across the three workflows; `grep -c 'bun@1.3.9'` returns 0 in each; a `cold: true` dispatch and a warm run are recorded in `scratch/phase-result.md` | After T015 to T029 |
| M5 | One job runs both suites and the README matches | `test ! -f .github/workflows/hooks-node-tests.yml`; the merged job's log carries every hook and plugin suite plus the installer test; `grep -c 'hooks-node-tests' .github/workflows/README.md` returns 0 | After T030 to T041 |
| M6 | The multi-install files, the pip cache and the checkout trial are recorded | `scratch/npm-dedupe.md` has one keep-or-revert row per file; four files carry `cache: pip`; `scratch/checkout-probe.md` has three rows and a verdict | After T042 to T070 |
| M7 | The phase closes with a measured delta | `bash .github/scripts/check-gate-inputs.sh` prints `files=46` and `RESULT: PASSED`; `scratch/phase-result.md` carries 14 rows and a delta; every acceptance row is `Met`; `validate.sh --strict` prints `RESULT: PASSED` | After T071 to T074 |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Merge the hook tests into the plugin workflow, and rename one check

**Status**: Proposed

**Context**: `hooks-node-tests.yml` and `opencode-plugin-tests.yml` each check out and provision the same tree set, so one commit that touches both pays for two provisions of 56-67 s each. The review measures the merge at 124 runner-min/day standalone, about 53 after R1 and about 27 after R1 and R14. The cost is one renamed check and two README rows.

**Decision**: With D5 approved, `hooks-node-tests.yml` is deleted and its three steps, its rationale and its `.hermes/**` trigger entry move into `opencode-plugin-tests.yml`, whose job becomes `plugin-and-hook-tests` titled `OpenCode plugin and hook node:test suites`. The merged job provisions once and runs the hook `node:test` collection, the installer test and the plugin suites. With D5 rejected, both files stay and the phase keeps the R14 adoption in each.

**Consequences**:
- One provision replaces two, and one check name replaces two.
- The merged job carries a 40-minute timeout until phase 007 re-sizes it on job samples.
- The check rename reaches the README and any personal bookmark; no required context moves, because the only active ruleset requires `message-contract.yml`'s context (`research.md:94`).

**Alternatives Rejected**:
- Keep both workflows and share only the cache: leaves the second checkout and the second provision in place, and forgoes the 124 runner-min/day.
- Merge into `hooks-node-tests.yml` instead: that file's path set is narrower, so every plugin-only change would stop running the plugin suites.

The formal records, including D5's default and alternative and every design choice this plan freezes, are `decision-record.md` ADR-001 to ADR-011.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation

T001 to T014. D5's answer, the baseline rows, the pre-change inventory, the gate scan with its four fixtures, the cache probe and the action itself. Nothing here may be reordered: T001 gates every R15 task, T002 and T003 produce the numbers every later measurement compares against, T004 to T011 must land before an action file exists, and T013's go/no-go gates T014.

### Tier 2: Parallel Execution

T015 to T070. The five adoption sites, the merge, the ten multi-install files, the pip cache and the checkout trial. T042 to T062 touch disjoint files and may run in any order. Two ordering rules hold inside a file: the install block is replaced before the filters above it are extended, so each quoted line number stays valid, and `hooks-node-tests.yml` is edited before T038 deletes it.

### Tier 3: Integration

T071 to T074. The whole-tree gates, the ephemeral-id search, the 24 h delta and the acceptance rows. Every task here reads the result of Tier 2 and none may start before Tier 2 is complete.

### Pre-Task Checklist

Before every task, confirm all five:
- [ ] The file named in the task exists at that path, and the quoted anchor text is on it.
- [ ] The line number in the task matches the anchor's current line. A mismatch means an earlier task moved it: re-read the file and locate the anchor text before editing.
- [ ] The task's `Check` command has not already been run against a partially edited file.
- [ ] No earlier task's `Rollback` is pending.
- [ ] The task's acceptance-criterion id is recorded so its evidence lands in `acceptance-criteria.md`.

### Execution Rules

| Rule | Statement |
|------|-----------|
| TASK-SEQ | Run the tasks in numeric order. T042 to T062 may be reordered among themselves; every other task keeps its position. |
| TASK-SCOPE | Change only the file named in the task, and only the lines the anchor names. A nearby improvement is a separate task and is not in this phase. |
| TASK-ANCHOR | Quote the anchor before editing. If the exact text is absent, stop rather than guessing at a similar line. |
| TASK-COUNT | Run the task's `Check` and compare against `Expected`. A count that differs is a failed task, not a rounding difference. |
| TASK-IDS | Write no R-id, D-id or phase number into a workflow comment, a step name, an action input, a cache key or a README row. |
| TASK-CACHE | Change no cache path, key component or step condition outside the task that owns it; a silent edit there defeats the measurement the task records. |
| TASK-EVIDENCE | Paste each `Check` output into the matching acceptance row. An unrecorded check is an unmet criterion. |

### Status Reporting Format

Report each task in four lines:

```text
T### <status: done | blocked | rolled-back>
Check: <the command's last line, or the count it printed>
Evidence: <file:line, run id, or scratch path>
Next: <the next task number, or the escalation reason>
```

### Blocked Task Protocol

A task is blocked when its anchor is absent after a re-read, its check fails twice, or its operator answer is missing. On a block:
1. Do not edit the file. Record the task number, the command and its output in `scratch/phase-result.md`.
2. Run the task's `Rollback` line if the task had already changed the file.
3. Stop the phase. A blocked task is reported, never worked around: the phase's gates assume every earlier edit landed exactly as written.
4. Resume only when the missing answer or the missing file exists, then re-run the blocked task from its `Pre-Task Checklist` entry.
<!-- /ANCHOR:ai-execution -->

---
