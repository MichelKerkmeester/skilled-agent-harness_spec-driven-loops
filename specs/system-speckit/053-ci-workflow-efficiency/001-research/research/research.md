---
title: "Research: CI workflow efficiency, speed and operator control"
description: "Twenty-iteration deep research over the 33 GitHub Actions workflows: measured cost, duplicate work, caching, triggers, concurrency, flakiness, overengineering, security, an on/off control, /doctor:ci and an sk-code-ci standards surface, ending in seven proposed implementation phases."
trigger_phrases:
  - "ci workflow efficiency research"
  - "github actions cost research"
  - "doctor ci command design"
  - "sk-code-ci surface design"
importance_tier: "important"
contextType: "research"
---

# Research: CI workflow efficiency, speed and operator control

## 1. Run Provenance

| Field | Value |
|---|---|
| Workflow | `/deep:research:auto`, single executor, driven step by step from `.skilled/commands/deep/assets/deep-research-auto.yaml` |
| Executor | `cli-pi`, model `deepseek-v4.1-flash-1017` (llmgateway), `--thinking max`, recorded in `deep-research-config.json` before iteration 1 |
| Iterations | 20 of 20, stop reason `maxIterationsReached`, stop policy `max-iterations`, convergence mode `off`, threshold 0 |
| Route proof | Every iteration's delta record carries `target_agent: deep-research`, `agent_definition_loaded: true`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`; every completion receipt in `dispatch-receipts/` shows `pi -p --offline --model llmgateway/deepseek-v4.1-flash-1017 --thinking max`; `verify-iteration.cjs` passed all 20 on the first dispatch |
| Questions | 12 of 12 key questions answered (strategy section 3) |
| Write containment | No out-of-scope write reported on any iteration |
| Dataset | `../scratch/ci-run-data/`: 1,000 runs over 23.5 h (2026-10-22T07:07Z to 2026-10-23T06:35Z), the 40 latest runs per workflow, and job JSON for the 5 latest completed runs of each of the 33 workflows (165 runs) |

Evidence labels used below: **confirmed** (read in a file at the cited line, or reproduced from the dataset or a live `gh` call), **documented** (stated by a repo doc or GitHub's docs, not exercised), **inferred** (reasoned from confirmed facts, with what would settle it).

## 2. Executive Summary

The measured CI load is about **3,812 runner-minutes a day** as GitHub rounds them (`ceil(job seconds / 60)` per job) [SOURCE: ../scratch/ci-run-data/summary.md:5]. The repository is public (confirmed: `gh repo view --json visibility` returns `PUBLIC`), so standard hosted runners cost nothing in money. The real costs are runner concurrency, signal latency on main, and noise. Every saving below is stated in runner-minutes because that is the unit GitHub accounts in, not because it is a bill.

Four facts drive almost everything:

1. **The trigger-index rebuild commit doubles the push load.** Of 73 distinct push SHAs on main in the window, 36 are `chore(system-spec-kit): rebuild the trigger index` commits. Each of them re-runs at least 13 downstream workflows (14 to 17 workflow runs per rebuild SHA, counting the rebuild itself). This is confirmed from `runs-last-1000.json` grouped by `headSha`. That fan-out is about **2,073 runner-min/day, 54% of the total** [SOURCE: iterations/iteration-019.md:23]. No downstream job reads the committed index content [SOURCE: iterations/iteration-019.md:40].
2. **Nothing is cached anywhere.** Zero workflows use `actions/cache` or a `setup-node` `cache:` key (confirmed by grep over `.github/workflows/*.yml`). Checkout plus install is about 36% of all job wall time [SOURCE: iterations/iteration-004.md:1].
3. **One serial test project is the wall-clock tail.** `spec-kit-check`'s CLI vitest project runs 183 test files one after another because `fileParallelism: false` is set without a stated reason [SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:67]. It runs 776 to 950 s, 65% of the slowest job in the repo [SOURCE: iterations/iteration-005.md:30].
4. **Almost nothing cancels superseded work.** 32 of 33 workflows have no `concurrency:` group (confirmed). 206 push runs in the window kept running after a newer commit superseded them, about 534 wall-minutes of exposure [SOURCE: iterations/iteration-006.md:39].

The highest-value change is also the cheapest: ignore the four generated files on the 13 downstream workflows. It is about 2,073 runner-min/day, needs no job, check-name or ruleset change, and edits only `on:` blocks.

## 3. Measured Cost per Workflow

From [SOURCE: ../scratch/ci-run-data/summary.md:9], ranked by estimated runner-minutes per day:

| Workflow | Runs in 23.5 h | Median wall | Runner-min per run | Runner-min/day | Share |
|---|---|---|---|---|---|
| spec-kit-check | 50 | 1,178 s | 25 | 1,279 | 33.6% |
| sk-doc-script-tests | 73 | 199 s | 6 | 448 | 11.8% |
| command-tree-parity | 73 | 76 s | 4 | 299 | 7.8% |
| dispatch-enforcement-guard | 73 | 79 s | 4 | 299 | 7.8% |
| hooks-node-tests | 61 | 201 s | 4 | 250 | 6.6% |
| opencode-plugin-tests | 61 | 142 s | 3 | 187 | 4.9% |
| changed-packet-validation, gate-inputs, message-contract, playbook-operator-contract, rule-canary-sync | 73 each | 80-104 s | 2 | 149 each | 19.5% together |
| all other workflows | 0-49 | | | under 75 each | under 8% |

Spot checks against the raw JSON: run `39910111430` reproduces the spec-kit-check median at 1,188 s. Run `39912381915` (trigger-index-rebuild on its own commit) is fully `skipped` with no steps, so the rebuild's 0-minute row is real for its self-triggered runs, not a free workflow overall [SOURCE: iterations/iteration-001.md:1].

Two caveats hold for the whole table. Medians come from five job samples per workflow, so per-workflow figures carry sampling error. Twelve workflows had no run in the window (PR-only or scheduled), so 3,812 is the push-to-main baseline and PR days add to it.

## 4. Duplicate Work

- **The rebuild fan-out** (section 2, fact 1) is the dominant duplicate: the same 13 checks run twice per human push, once on the human commit and once on the bot commit, and the second run differs only in four generated files [SOURCE: .github/workflows/trigger-index-rebuild.yml:79].
- **Provisioning is bought five times per commit** when `.opencode/plugins/**` or `.skilled/agents/**` changes. `opencode-plugin-tests`, `hooks-node-tests` and the three `opencode-dual-version` jobs (two matrix legs plus `both`) each run their own checkout and `provision_worktree` [SOURCE: iterations/iteration-003.md:41]. Provisioning costs 56-67 s per job, 300 s per commit, and with the 255 s of checkouts the total is 9.3 runner-minutes before any assertion runs [SOURCE: iterations/iteration-003.md:55]. The provisioning step appears in exactly these 25 of 230 sampled jobs, so it is confined to these three workflows. The bun bootstrap (`npm install bun`) runs in four workflows, not three [SOURCE: iterations/iteration-004.md:1].
- **hooks-node-tests buys no coverage that opencode-plugin-tests lacks.** Its path set is a subset except `.hermes/**`, and both fired on the identical 40 commits [SOURCE: iterations/iteration-003.md:41].
- **The spec-kit install-and-build is bought seven times** across workflows, and 11 workflows install in two or more of their own jobs (spec-kit-check 9 installs, routing-registry-drift 4) [SOURCE: iterations/iteration-018.md:27].
- **dispatch-enforcement-guard runs the whole hooks vitest tree** with no project or path filter [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:66], although its named dispatch coverage is two narrow `node --test` steps [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:22]. Inferred until the include globs of `.skilled/hooks/vitest.config.ts` are read.

**Evaluating the provisioning fixes** (coordinator question):

| Option | Verdict | Why |
|---|---|---|
| `actions/cache` of the provisioned tree, keyed on a repo-wide lockfile glob, no `restore-keys`, in one composite action (restore, provision, save) | **Recommended** | The satisfied-walk only checks that names are present, so a cache works, and that is also why the key must cover every lockfile [SOURCE: iterations/iteration-012.md:1]. The set is 2.22 GB uncompressed with 3.6 MB of build output, so the build stamps under `.git` must be added deliberately. Saves about 5 runner-min per commit where all three fire, about 145/day, and about 40 s of wall per job [SOURCE: iterations/iteration-012.md:1] |
| One provisioning job uploading an artifact that the three workflows consume | Rejected | Artifacts do not cross workflows without `workflow_run` chaining or merging the workflows. Upload and download of a multi-GB tree costs more than it saves [SOURCE: iterations/iteration-012.md:1] |
| A reusable `workflow_call` workflow | Rejected as a dedupe | It dedupes YAML, not minutes. A composite action is the only shared form that can also carry a cache [SOURCE: iterations/iteration-018.md:1] |
| Merge hooks-node-tests into opencode-plugin-tests | Recommended after the cache | 124 runner-min/day standalone, 62 marginal once the cache exists. The two figures are not additive [SOURCE: iterations/iteration-019.md:97] |

The cache brings one risk the repository does not guard yet: a warm cache stops exercising the cold install path. Keep provisioning running on a cache hit as the verification walk [SOURCE: iterations/iteration-012.md:1].

## 5. Caching

- **Zero caching in the repo** (confirmed by grep). The `setup-node` npm cache would be the automatic path, and no workflow enables it [SOURCE: iterations/iteration-005.md:1].
- The provision path writes `node_modules` trees that a plain `node_modules` cache would get wrong. The honest cache is the npm download cache plus the build outputs, keyed on every lockfile [SOURCE: iterations/iteration-004.md:1].
- **Caching the OpenCode installs is not worth a key**: they are small and fast next to checkout [SOURCE: iterations/iteration-004.md:1].
- **Checkout is the larger fixed cost**, at about 50 s per job and 25.6% of every runner-second. Ten workflows request full history (`fetch-depth: 0`). Shallow checkout where history is not read is the lever caching cannot buy (inferred; it needs a per-workflow check that nothing reads history) [SOURCE: iterations/iteration-004.md:1].
- Cache size and restore throughput are unmeasured (inferred), and phase 003 must measure them before claiming the 145/day.

## 6. Triggers and Path Filters

- **The rebuild burst.** The fix is to ignore the four staged paths [SOURCE: .github/workflows/trigger-index-rebuild.yml:79] on the 13 downstream workflows.
  - Nine workflows have no push `paths:` and take a `paths-ignore:` block: sk-doc-script-tests, command-tree-parity, dispatch-enforcement-guard, changed-packet-validation, gate-inputs, message-contract, playbook-operator-contract, rule-canary-sync and advisory-checks.
  - Four already list `paths:` and need `!` negations inside that list, because GitHub refuses both keys on one event: spec-kit-check, hooks-node-tests, opencode-plugin-tests and markdown-link-integrity [SOURCE: iterations/iteration-020.md:9].
  - Nine plus four is 13. Iteration 019 said 12, and iteration 020 corrected it.
- **Required checks are not an obstacle** (confirmed this synthesis with `gh api repos/{owner}/{repo}/rulesets`). The only active ruleset is `message-contract-required`, requiring the single context "Commit messages, branch names and PR description follow the templates" on the default branch. `main-protection` is `disabled`, and classic branch protection is absent (HTTP 404). Path filtering leaves a required check Pending (documented by GitHub). So ignoring generated paths on `message-contract.yml` needs care: the rebuild commit must still satisfy that one context, or message-contract keeps running on it. Every other workflow can be filtered freely.
- **playbook-operator-contract's "deliberately NOT path-filtered" comment** [SOURCE: .github/workflows/playbook-operator-contract.yml:3] does not conflict with ignoring four generated files, but it must be amended in the same diff [SOURCE: iterations/iteration-019.md:106].
- **message-contract triggers on every branch** [SOURCE: iterations/iteration-002.md:1].
- **Review-time checks** comment-hygiene, agent-mirror-sync and prompt-card-sync are unfiltered `pull_request` triggers [SOURCE: .github/workflows/comment-hygiene.yml:3].

## 7. Parallelism, Matrix and Concurrency

- **32 of 33 workflows have no `concurrency:` group** (confirmed by grep). The one that has a group opts out of cancelling, correctly, because it pushes [SOURCE: iterations/iteration-006.md:1].
- **Superseded push runs**: 206 runs over the window, 534 wall-minutes of exposure. Spec-kit-check alone accounts for 29 runs and 179 minutes [SOURCE: iterations/iteration-006.md:39].
  - On pull requests, `cancel-in-progress: true` is safe.
  - On main it trades a verified result on every commit for speed, so only the newest SHA gets a verdict. That is a policy choice, not a free win (inferred) [SOURCE: iterations/iteration-006.md:1].
- **No needless `needs:` chains.** Wall-clock sits inside one serial job, not in the job graph [SOURCE: iterations/iteration-006.md:1].
- **Splitting spec-kit-check raises runner-minutes** (26 to 32 per run) because every job re-pays checkout, install and rounding.
  - Fixing `fileParallelism` in the single job is the cheap lever: about 26 to 17 per run and 1,215 s to about 690 s of wall (inferred, since the post-change suite time is estimated) [SOURCE: iterations/iteration-005.md:185].
  - Sharding (`vitest --shard`) is the fallback if file-level parallelism collides on fixtures. That collision risk is real: the tests write spec folders and SQLite files, and it is unverified until a local run with `--fileParallelism` [SOURCE: iterations/iteration-005.md:66].
- **Matrix use is minimal and `fail-fast` is never set true.** The one matrix, opencode-dual-version, duplicates provisioning per leg [SOURCE: iterations/iteration-006.md:1].

## 8. Flaky and Slow Tests, Timeouts

- **No flake signature exists in the dataset.** deep-loop-runtime (13 of 40 runs failed), diagram-corpus (12) and skill-advisor-stress (10) fail for real reasons, and their failures correlate across independent workflows, so a retry would mask them rather than fix them [SOURCE: iterations/iteration-007.md:1].
- **Failure cost in runner-minutes is negligible.** The cost is red-main noise and signal latency: deep-loop-runtime spends all of its 690 s before its first signal [SOURCE: iterations/iteration-007.md:1].
- **27 of 33 workflows set no `timeout-minutes`** (confirmed by grep: 6 set one), so a hang inherits GitHub's 360-minute default. Where timeouts exist they are 4 to 12 times the median, which is the right failure mode to keep [SOURCE: iterations/iteration-007.md:1].
- **Every vitest config in the runtime trees sets `fileParallelism: false`** (confirmed: seven sites across system-spec-kit, system-deep-loop and system-skill-advisor).

## 9. Overengineering

| Item | What is wrong | Evidence |
|---|---|---|
| advisory-checks.yml | Every step is `continue-on-error: true` and every command is also `\|\| true` or `\|\| echo`, so the job is green by construction and its only signal is unparsed log text. Its index-freshness step races the rebuild workflow that repairs the same file | [SOURCE: .github/workflows/advisory-checks.yml:27], [SOURCE: .github/workflows/advisory-checks.yml:66]. The advisory status itself is deliberate and documented [SOURCE: iterations/iteration-011.md:1], so the fix is one suppression layer and a path filter, not removal |
| comment-hygiene.yml, agent-mirror-sync.yml | Re-run the pre-commit checkers on every PR with no path filter. The backstop is justified for forks and `--no-verify`, and the README documents it | [SOURCE: .skilled/hooks/git/pre-commit:60], [SOURCE: .github/workflows/README.md:71] |
| dispatch-enforcement-guard.yml | Pays for the whole hooks vitest tree on every push | section 4 |
| hooks-node-tests.yml | Path set is a subset of opencode-plugin-tests' set, with the same 40 commits fired | section 4 |
| strict-pass-freshness-report.yml | Weekly, 2,577 s median wall, never gates, and adds a second suppression layer | [SOURCE: iterations/iteration-008.md:1] |
| Three workflows pip-install the same pinned test deps with no cache | Small, real repetition | [SOURCE: iterations/iteration-008.md:1] |

Ruled out: **merging many small workflows into one file with parallel jobs** saves nothing, because billing is per job [SOURCE: iterations/iteration-018.md:1]. **A single changed-files gate** is worse than native path filters [SOURCE: iterations/iteration-018.md:1].

## 10. Security and Pinning Hygiene

- **Action pinning is complete.** Every third-party `uses:` is a 40-hex SHA (confirmed by grep: no unpinned `uses:` line). The only written statement of the rule is a dependabot comment [SOURCE: iterations/iteration-015.md:1].
- **12 of 33 workflows declare no `permissions:`** (confirmed: 21 declare one). None of the twelve writes, so this is defence in depth and a two-line fix each [SOURCE: iterations/iteration-009.md:1].
- **dependabot-auto-merge grants `contents: write` and `pull-requests: write` workflow-wide**, so the third-party `dependabot/fetch-metadata` step holds write scope [SOURCE: .github/workflows/dependabot-auto-merge.yml:10]. Split it into a read-only metadata job and a write-scoped merge job. The merge gate itself is sound [SOURCE: iterations/iteration-009.md:1].
- **`pull_request_target` is absent repo-wide** (confirmed), and no fork-secret or shell-injection path was found [SOURCE: iterations/iteration-009.md:1].
- **trigger-index-rebuild is the model**: workflow-level `permissions: {}`, a read-only rebuild job, and the personal token only in a separate push job that runs no repository code [SOURCE: .github/workflows/trigger-index-rebuild.yml:12], [SOURCE: .github/workflows/trigger-index-rebuild.yml:28].

## 11. CI On/Off Control for Clones and Base Repos

**The recommended design is repository variables read in a job-level `if:`**, with everything on by default [SOURCE: iterations/iteration-011.md:1]. Today the repository has no on/off surface at all [SOURCE: iterations/iteration-010.md:1].

| Option | Verdict | Reason |
|---|---|---|
| `vars.*` in a job-level `if:` | **Chosen** | Unset variables read as empty, so clones and forks run everything by default. No file in the tree changes. The gate must be job-level, because `on:` filters see no contexts |
| Committed config (`.skilled/ci.json`) read by a gate job | Rejected | Adds a gate job and a `needs:` edge to every workflow, and is the only rival that creates attack surface: it puts the decision in a file any PR can edit |
| Env file read by a gate job | Rejected | `hook-flags.env` is gitignored [SOURCE: .gitignore:355] and absent from a checkout. `.env.example` is a template of comments. Reuse their semantics and naming, not the files [SOURCE: iterations/iteration-011.md:1] |
| `workflow_dispatch` inputs | Rejected | Per run only; cannot persist an off state. The repo has never used inputs |

**Shape.** One line between `name:` and `runs-on:`, written as a bare expression to match the tree [SOURCE: .github/workflows/trigger-index-rebuild.yml:33]. Where a job already has a condition, the switch is ANDed onto it, never replaces it:

```yaml
jobs:
  gate-inputs:
    name: Every gate input resolves under both source roots
    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'
    runs-on: ubuntu-latest
```

**Names.** A master switch `SKILLED_CI` and group switches keyed to the README's existing tiers [SOURCE: .github/workflows/README.md:60]: `SKILLED_CI_TESTS`, `SKILLED_CI_REPORTS`, `SKILLED_CI_REVIEW`, `SKILLED_CI_FRESHNESS` and `SKILLED_CI_MESSAGES`. `off` is the only disable token, so `0`, `false` or a typo leaves the job on. That is fail-safe and must be documented. dependabot-auto-merge gets no switch.

**Branch protection.**
- A job skipped by `if:` reports Success and does not block a required check. That is documented in GitHub's docs, fetched this synthesis: "A job that is skipped will report its status as 'Success'. It will not prevent a pull request from merging, even if it is a required check."
- A workflow that never triggers, because of path filtering, leaves its required check Pending (documented).
- So switching off at the job level never deadlocks a ruleset. Here only one context is required at all (section 6).
- This settles the "required-check question" that iterations 019 and 020 left open as the gate on phase 006.

**Savings.** A skipped job allocates no runner, but the run row still exists. The switch saves runner-minutes, not run volume [SOURCE: iterations/iteration-010.md:1]. Its value is operator control for clones, not a speed-up for this repo.

## 12. `/doctor:ci`

**Surface.** A new router `/doctor:ci` (`.skilled/commands/doctor/ci.md`), registered in `_routes.yaml`, with two routes [SOURCE: iterations/iteration-020.md:57]. `K1` in `route-validate.sh` fails a read-only route whose YAML writes, so listing and toggling cannot share one route [SOURCE: iterations/iteration-013.md:1], [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:189].

| Route | Kind | Does |
|---|---|---|
| `report` (default) | read-only | Lists each workflow with its on/off state (resolved `vars.*` against the job `if:`), trigger, path filters, purpose (the README row) and measured cost. Flags missing timeouts, permissions and concurrency, and any drift from sk-code-ci rules |
| `scaffold` | mutates, confirmed | Writes a new workflow from sk-code-ci templates, with SHA-pinned actions, `.skilled/` and `.opencode/` path parity per `gate-inputs.yml`, a timeout, `permissions: contents: read`, a concurrency group, the switch `if:` and the README row. Also covers customize (path filters, schedule, Node version) as a scoped edit |
| toggle | inside `scaffold`, or a third route | Sets or clears a variable with `gh variable set` / `gh variable delete` after printing the exact command and getting confirmation, then reads the state back. This follows the print-then-verify pattern of `/doctor:env` [SOURCE: iterations/iteration-013.md:1] |

Listing variables works with the session's token (confirmed: `gh variable list` exits 0 with scopes `repo, workflow`). Iteration 017 said writing variables needs an admin token. That is **inferred and probably wrong for the repo owner**: GitHub's variables API needs collaborator access and `repo` scope (documented by GitHub, not exercised here, because writing a variable changes repository settings). Phase 007 should test it on a throwaway variable before deciding whether toggle is a write or a printed instruction.

**Safety rules.**
- Dry-run is the default for every mutating action: print the diff or command, then write only on confirmation.
- Never edit a protected workflow without a second, named confirmation that restates the workflow's role. A workflow is protected by function, not by list [SOURCE: iterations/iteration-014.md:1]:
  - (a) it is the sole enforcer of an invariant with no local gate (gate-inputs);
  - (b) it holds a token-eligibility split (trigger-index-rebuild);
  - (c) it is a guard whose failure invalidates other workflows' inputs (dispatch-enforcement-guard, naming-standard-guard).
- The protected set lives in sk-code-ci data, so review and scaffolding read one list.
- Never disable message-contract while its ruleset context is required.

**Advisor routing.**
- Doctor routing is one bridge per route, with `id` equal to the route's `inventoryId` [SOURCE: iterations/iteration-014.md:1].
- "workflow" is already spec-kit's vocabulary, so the bridges need leading `ci`, `github actions` and `ci workflow` signals.
- They are then verified with the bridge deriver, `route-validate.sh` and `doctor-phrase-reach.cjs` [SOURCE: iterations/iteration-020.md:276].

**Ownership: split along the artifact boundary.** The split is forced by `mutatesWorkspace`, not chosen by taste [SOURCE: iterations/iteration-014.md:1].
- The doctor command owns the operational routes (report, toggle, scaffold and customize), because they mutate, and mutation is what the doctor family already does in `/doctor:env`.
- sk-code-ci owns the standards, the check rule data, the protected set and the templates, and it cannot write.
- sk-git should own neither:
  - Its doctor surface is `hooks`, `setup` and `standards`, scoped to `.sk-git/` conventions [SOURCE: .skilled/commands/doctor/_routes.yaml:242].
  - Its CI footprint is the inputs it supplies to two workflows (`validate-message.mjs` and the provisioning script), not ownership.
  - Making a git skill the authority on GitHub Actions would misplace the standard.
  - sk-git stays a consumer: its provisioning script is what phase 003's composite action wraps.

## 13. `sk-code-ci`

**What it is.** A read-only **surface** packet in the sk-code hub, next to sk-code-webflow, sk-code-skilled and sk-code-obsidian. It is not a workflow mode.
- The hub defines surfaces as `backendKind: evidence-base`, `routingClass: metadata` and `mutatesWorkspace: false`, bundled with an acting mode [SOURCE: .skilled/skills/sk-code/mode-registry.json:14].
- Workflow-YAML standards are stack knowledge consumed by two acting modes: authoring under sk-code-skilled and review under sk-code-review. That is the surface shape [SOURCE: iterations/iteration-014.md:1].
- A surface's tool set forbids Write and Edit, so sk-code-ci holds templates and cannot scaffold. `/doctor:ci scaffold` reads them [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:682].

**Contents: the rules, with how each is enforced today** [SOURCE: iterations/iteration-015.md:1].

| Rule | Followed today | Enforced by |
|---|---|---|
| `.skilled/` and `.opencode/` path parity | yes | gate-inputs.yml, the only machine-enforced workflow rule |
| SHA-pinned actions | 33 of 33 | nothing; a dependabot comment |
| README row per workflow | 33 of 33 | nothing (honour system) |
| `set -euo pipefail` in multi-line `run:` | 29 of 33 | shell doctrine owned elsewhere in sk-code |
| `timeout-minutes` | 6 of 33 | nothing |
| least-privilege `permissions:` | 21 of 33 | nothing |
| `concurrency:` group | 1 of 33 | nothing |
| fork and secret safety (no `pull_request_target`, no `github.event` in `run:`) | yes | nothing |
| caching via the composite setup action; matrix and `fail-fast` guidance | not yet | nothing |

The packet also carries the rebuild-path ignore rule for new push workflows, the switch `if:` shape (section 11), the protected set (section 12) and the scaffold templates under `assets/`.

**What registering a mode requires** [SOURCE: iterations/iteration-014.md:1], [SOURCE: iterations/iteration-016.md:1]:
- `mode-registry.json`: the mode entry, plus its name in `extensions.surface-axis.surfaces`.
- `hub-router.json`: a `routerPolicy.tieBreak` slot, a `routerSignals` entry and two `vocabularyClasses`. The tieBreak placement is checked three ways.
- `leaf-manifest.json`: generated, not authored.
- `ROUTER.md`: the INTENT_SIGNALS and RESOURCE_MAP projections, which are drift-guarded against the manifest.
- `graph-metadata.json`, `description.json`, and the hub `SKILL.md` mode table.
- The packet folder: SKILL.md, README, changelog, references, assets, playbook scenario and benchmark.
- A compiled-route test case, plus a canary fixture and its authored twin under `specs/` [SOURCE: .skilled/skills/sk-code/README.md:126].

`/create:skill-parent update --surfaces` is the named repair command for surface placement. Of the 11 integration surfaces, 5 are ungated, so a green per-hub gate is not evidence of reachability [SOURCE: iterations/iteration-016.md:1].

**How review reaches it.** The surface axis is selected by stack markers, and `.github/` is not one of them, so today a workflow-YAML diff reviews as UNKNOWN [SOURCE: iterations/iteration-017.md:1].
- Adding a fifth surface value to the shared stack-detection contract is what lets sk-code-review apply sk-code-ci to workflow diffs [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:37], [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:234].
- It is the one step that can regress detection for the three existing surfaces, so it goes last, behind its own tests.

## 14. Ranked Recommendations (Top 10)

| # | Change | Saving | Risk | Effort | Phase | Evidence |
|---|---|---|---|---|---|---|
| 1 | Ignore the four generated paths on the 13 downstream workflows (9 `paths-ignore:`, 4 `!` negations); handle message-contract's required context first; ship a test that asserts the ignore | ~2,073 runner-min/day (54%) | Low-medium | Low | 002 | confirmed (sum of 13 measured rows, 36 rebuild SHAs) |
| 2 | Composite setup action with `actions/cache` (npm download cache, build outputs, provisioned trees keyed on all lockfiles, no `restore-keys`); pinned bun setup replacing `npm install bun` | ~145 runner-min/day, ~40 s wall per job | Medium | Medium | 003 | confirmed arithmetic; restore speed and size inferred |
| 3 | Make spec-kit-check's CLI vitest project parallel (`fileParallelism`, or `--shard` if fixtures collide) | ~9 runner-min per run (~450/day), ~525 s off the slowest job | Medium | Medium | 008 | step timings confirmed (run 39909844384); post-change time inferred |
| 4 | `concurrency:` with `cancel-in-progress: true` on PR-triggered workflows; decide policy for main | Up to 534 wall-min/day of superseded work, part of it on PRs | Low on PRs, policy on main | Low | 002 | confirmed exposure |
| 5 | Merge hooks-node-tests into opencode-plugin-tests (after #2) | 62 runner-min/day (124 standalone) | Medium: check name changes, but it is not required | Low | 003 | confirmed |
| 6 | Add `timeout-minutes` to the 27 workflows without one, sized at about 3x the median | Caps a hang at minutes instead of 360 | Low | Low | 004 rule, applied in 005 | confirmed |
| 7 | Least privilege: `permissions: contents: read` on the 12 undeclared workflows; split dependabot-auto-merge into read and write jobs | Security, no minutes | Low | Low | 005 | confirmed |
| 8 | Narrow dispatch-enforcement-guard's vitest run to the dispatch suites; path-filter comment-hygiene, agent-mirror-sync, prompt-card-sync and advisory-checks; drop advisory-checks' double suppression | Tens of runner-min/day (unmeasured); a real signal from advisory-checks | Low | Low | 002 | confirmed shape; saving inferred |
| 9 | CI on/off control: `vars.SKILLED_CI*` job-level switches, default on | 0 for this repo; control for clones | Low | Medium | 005 | documented (GitHub skip semantics fetched) |
| 10 | sk-code-ci surface, then `/doctor:ci` (report, scaffold and toggle) | 0 direct; keeps 1-9 true for new workflows | Low / Medium | Medium | 004, 007 | confirmed registry contract |

Considered and kept out of the top ten:
- Merging the nine always-run workflows into one job. That is 1,241-1,606 runner-min/day as an upper bound, shrinking by about 145 after #2. Nine contexts become one, the merged job is serial at 8-10 minutes, and every step needs `if: always()` guards that destroy the per-check signal [SOURCE: iterations/iteration-019.md:68].
- Most of that saving is checkout and rounding, which #1 already removes on rebuild commits. Re-measure after 002 and 003 before deciding.
- The 986 runner-min/day "ceiling rounding waste" is not a separate lever. It is inside the consolidation number [SOURCE: iterations/iteration-019.md:86].

## 15. Proposed Implementation Phases

Ordering rules [SOURCE: iterations/iteration-020.md:313]:
- A phase moves earlier only if it does not depend on a later phase's number.
- A phase that introduces a new YAML pattern waits for the standard that governs it.
- A phase that rewrites a job waits for the phase that decides the job's switch.

| Phase | Name | Scope | Workflows touched | Expected saving | Risk | Effort | Depends on |
|---|---|---|---|---|---|---|---|
| 002 | Trigger surgery | Recs 1, 4 (PRs), 8: generated-path ignores, PR cancel-in-progress, narrow path filters, advisory-checks cleanup, playbook comment amendment, ignore-assertion test | 13 downstream + comment-hygiene, agent-mirror-sync, prompt-card-sync, advisory-checks, dispatch-enforcement-guard | ~2,073 runner-min/day + PR wall-clock | Low-medium | Low | none |
| 003 | Caching and provision dedupe | Recs 2, 5: composite setup action with cache, pinned bun, npm dedupe in the 11 multi-install workflows, then the hooks-into-plugin merge | opencode-dual-version, opencode-plugin-tests, hooks-node-tests + 11 multi-install workflows | ~227-247 runner-min/day, ~40 s per job | Medium | Medium | none; before 006 and 008 |
| 004 | sk-code-ci standards surface | Rec 10a: read-only surface packet with the rules table, protected set, switch shape and templates; hub registration (registry, router, manifest, ROUTER.md, metadata, fixtures) | none | 0 | Low | Medium | none; before 005, 006, 007 |
| 005 | CI on/off control and hygiene | Recs 9, 6, 7: `vars.SKILLED_CI*` switches on 32 workflows, a committed example of the variable names, timeouts, permissions, dependabot split, README section | 32 of 33 (not dependabot-auto-merge's switch) | 0 direct | Low | Medium | 002, 003, 004 |
| 006 | Job consolidation (decision gate) | Re-measure, then decide whether to merge the always-run workflows inside one switch group | up to 9 always-run workflows | ≤1,241-1,606 upper bound, far less after 002 and 003 | High | Medium | 003, 005 |
| 007 | `/doctor:ci` and review wiring | Rec 10b: `ci.md` router with `report` and `scaffold`, toggle per the variable-write test, advisor bridges, `/doctor:setup` row; then the CI surface value in stack-detection and sk-code-review, behind tests | none (scaffold writes new files on request) | 0 | Medium | Medium | 004 (005 for toggle) |
| 008 | Slow tests and flakiness | Rec 3 plus deep-loop-runtime's 13 of 40 failures and diagram-corpus' and skill-advisor-stress' real failures | spec-kit-check, deep-loop-runtime, diagram-corpus, skill-advisor-stress | ~450 runner-min/day + ~525 s wall on the tail | Medium | Medium | 003 (stable baseline) |

sk-code-ci (004) is ordered before /doctor:ci (007), because the doctor's scaffold reads its templates. The two can be worked alongside each other once 004's rule data is stable.

## 16. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Merge small workflows into one file with parallel jobs | Billing is per job; same minutes, worse isolation | [SOURCE: iterations/iteration-018.md:1] | 018, 019 |
| One provisioning job feeding the others through an artifact | Artifacts do not cross workflows without `workflow_run`; multi-GB transfer | [SOURCE: iterations/iteration-012.md:1] | 012 |
| Reusable `workflow_call` as the dedupe | Dedupes YAML, not minutes, and cannot carry a cache | [SOURCE: iterations/iteration-018.md:1] | 018 |
| A single changed-files gate job | Worse than native path filters; adds a job and a `needs:` edge | [SOURCE: iterations/iteration-018.md:1] | 018 |
| Splitting spec-kit-check into four jobs | Raises runner-minutes from 26 to 32 per run | [SOURCE: iterations/iteration-005.md:185] | 005 |
| Retrying the failing suites | No flake signature; a retry masks real, correlated failures | [SOURCE: iterations/iteration-007.md:1] | 007 |
| Caching OpenCode installs | Too small to justify a key | [SOURCE: iterations/iteration-004.md:1] | 004 |
| A committed `.skilled/ci.json`, an env file, or `workflow_dispatch` inputs as the on/off control | Attack surface, absent from checkouts, or not persistent | [SOURCE: iterations/iteration-011.md:1] | 010, 011 |
| Housing `/doctor:ci` in sk-git | sk-git's doctor scope is `.sk-git/` conventions; it would misplace the Actions standard | [SOURCE: .skilled/commands/doctor/_routes.yaml:242] | 014 |
| sk-code-ci as an acting workflow mode that scaffolds | Surfaces are read-only by contract; scaffolding belongs to the doctor | [SOURCE: iterations/iteration-016.md:1] | 014, 016 |
| Counting the 986 runner-min/day rounding waste as its own saving | It is inside the consolidation number | [SOURCE: iterations/iteration-019.md:86] | 019 |

## 17. Divergence Map

Convergence mode was `off` and the stop policy was max-iterations, so no pivot ran: zero completed pivots, zero failed pivots, no audited overrides. Breadth came from assigning one angle per iteration across the 20, with extra iterations on the coordinator's added angles: on/off control (010, 011), duplicate provisioning (003, 012), `/doctor:ci` (013, 014, 017) and sk-code-ci (014 to 017). Saturated directions: the cost baseline (001, 019) and the rebuild fan-out (002, 018, 019, 020). Remaining frontier: the open questions below.

## 18. Open Questions

- Are the spec-kit CLI tests safe under `fileParallelism: true`? This gates phase 008's choice between parallelism and sharding, and is settled by a local run with the flag on.
- Can the owner's token write repository variables? Phase 007 decides whether toggle writes or prints. Test it on a throwaway variable.
- How should message-contract's single required context be satisfied on rebuild commits once generated paths are ignored? Options are keeping message-contract unfiltered, or verifying the rebuild commit's message passes. Phase 002 decides.
- Cache size, restore throughput and staleness window (phase 003 measures these).
- What are the include globs of `.skilled/hooks/vitest.config.ts`? This confirms recommendation 8's dispatch-guard narrowing.
- Which jobs duplicate pre-commit hooks beyond comment-hygiene and agent-mirror-sync? There is no pre-push hook to compare against [SOURCE: iterations/iteration-008.md:1].

## 19. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 20
- Questions answered: 12 / 12
- Remaining questions: 0 key questions; 6 carried open questions above
- newInfoRatio range: 0.54 to 0.78 (convergence mode off, so ratios were telemetry only)
- Convergence threshold: 0 (mode off)
- Divergence summary: no divergent pivots recorded

## 20. Verification Addendum (orchestrator, post-synthesis)

Re-checked independently of the iterations before this synthesis:
- **Rebuild fan-out**: 36 rebuild SHAs of 73 push SHAs, with 14-17 workflow runs each. The iterations said 35, a one-commit window-edge difference that does not change the saving's order.
- **Grep counts**: zero caching, 1 concurrency group, 6 timeouts, 21 permissions blocks, zero unpinned `uses:`, zero `pull_request_target`.
- **`fileParallelism: false`** at seven vitest config sites.
- **Rulesets**: only `message-contract-required` is active, requiring one context, and `main-protection` is disabled.
- **GitHub's skipped-job wording**, fetched from `github/docs`.
- **Repository visibility**: public.

Corrections made here against the iterations:
- The required-check question that iterations 019 and 020 left blocking is resolved: a skipped job reports Success, and only one context is required.
- The variable-write premise in iteration 017 is downgraded to inferred.
- Iteration 007 cites `.skilled/skills/system-deep-loop/deep-research/scripts/compile-command-contracts.cjs:706` and `:727`. The file lives at `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`, so those two citations point at the wrong folder. Iteration files are write-once, so the correction is recorded here.
- The CLI vitest lever is ranked by the parallelism fix from iteration 005 (about 9 runner-min per run) rather than iteration 019's 15-second boundary trim, which only counted one rounding step.
