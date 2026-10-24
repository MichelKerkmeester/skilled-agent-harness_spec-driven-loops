---
title: Job Shape Rules
description: Timeout sizing, least-privilege permissions, the concurrency template, the composite setup action and the switch condition shape for a GitHub Actions job.
trigger_phrases:
  - "workflow timeout"
  - "workflow permissions"
  - "workflow concurrency"
  - "composite setup action"
  - "ci switch condition"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Job Shape Rules

What every job carries beyond its steps: a timeout, a permissions scope, a concurrency group, a shared provisioning step and a switch condition.

---

## 1. OVERVIEW

Five parts of a job sit here: its timeout, its permissions, its concurrency group, the composite setup action that provisions it and the switch condition that can turn it off. Each part states the rule, the file and line that show it and what enforces it.


---

## 2. TIMEOUTS

A job with no `timeout-minutes` runs until GitHub stops it at 360 minutes, so a hang costs six hours of runner time. Size the timeout from measured runs and never guess it.

**Formula.** `max(<floor>, ceil(3 x job p50 minutes), ceil(2 x job p100 minutes))` with a floor of 10 minutes. Pull at least 40 recent runs of job-level timings (`gh run view --json jobs`), compute p50 and p100 per job and state the observed p100 next to the chosen value in the commit or the workflow comment. A successful job in the sample should never exceed half of its new timeout.

**Today.** `6 of 33` workflows carry a timeout, on seven lines. The other **27 workflows** carry none.

| Workflow | Line | Value |
|---|---|---|
| `deep-loop-runtime.yml` | `:40` | 45 |
| `opencode-plugin-tests.yml` | `:67` | 20 |
| `hooks-node-tests.yml` | `:52` | 20 |
| `sk-doc-rename-harness.yml` | `:35` | 30 |
| `opencode-dual-version.yml` | `:87` and `:180` | 30 |
| `skill-advisor-stress.yml` | `:47` | 20 |

Enforcement: honour-system. Re-run `grep -n 'timeout-minutes' .github/workflows/*.yml` to refresh the table.

---

## 3. PERMISSIONS

Least privilege is the default. A workflow declares `permissions: contents: read` at the top, and a job widens it only for what that job needs.

- **Read-only workflow.** `permissions: contents: read` written as a block, as in `.github/workflows/message-contract.yml:13`.
- **No scope at the workflow level.** `permissions: {}` at the top and a scope on each job, as in `.github/workflows/trigger-index-rebuild.yml:12`. The rebuild job then asks for `contents: read` at `:38` and the push job asks for `actions: read` and `contents: write` at `:190`.
- **A write scope belongs only to a job that runs no repository code.** The rebuild job installs, builds and runs the repository's generator, so it holds no write scope and no secret. The push job runs `gh` and `git` only and is the one place the push token is visible. Splitting the two keeps repository code away from the token.

Today 21 of 33 workflows declare `permissions:`. The twelve that do not are `chart-corpus.yml`, `agent-mirror-sync.yml`, `advisory-checks.yml`, `comment-hygiene.yml`, `playbook-operator-contract.yml`, `diagram-corpus.yml`, `prompt-card-sync.yml`, `rule-canary-sync.yml`, `markdown-link-integrity.yml`, `runtime-no-spec-import.yml`, `skill-doc-frontmatter.yml` and `repo-rules-corpus.yml`.

Enforcement: honour-system.

---

## 4. CONCURRENCY

A workflow that answers to pushes and pull requests carries one group, so a newer push does not leave an older run burning minutes.

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

The recommended default cancels a superseded run on a pull request and never cancels a run on a branch push. The alternative is `cancel-in-progress: true` on main as well, which saves more runner minutes and leaves some commits on the branch with no completed run.

A workflow whose runs must queue instead of cancel sets `cancel-in-progress: false` and says why. `.github/workflows/trigger-index-rebuild.yml:21-23` does, because a newer pending run replaces an older pending one and the run for the newest push is never dropped.

Today 31 of 33 workflows carry a `concurrency:` block. Thirty use the pull-request-only value above and the rebuild workflow uses `false`. `dependabot-auto-merge.yml` and `strict-pass-freshness-report.yml` carry none.

Enforcement: honour-system.

---

## 5. THE COMPOSITE SETUP ACTION

status: landed

Every workflow that needs the repository's dependency trees calls one composite action instead of repeating the install and build steps.

```yaml
- name: Provision the dependency trees
  uses: ./.github/actions/setup
```

The action is `.github/actions/setup/action.yml`. The rules it follows:

- **The key covers every lockfile plus the Node major.** The cache key is built from the runner OS, the Node major read from the runner, the bun version and a hash of every lockfile and package manifest the trees install from. A change to any of them is a different key.
- **No `restore-keys`.** A partial match would restore a tree built from another lockfile and pass a stale install. A miss means a cold provision.
- **The provisioning walk runs on a hit.** The repository's own `provision_worktree` still runs after a restore and checks that each tree and each build output exists, so a hit shortens the install and is never a version check.
- **The cache is saved only on a miss**, and an input named `cache` set to `false` forces a cold provision so the install path stays exercised.
- **Bun comes from a SHA-pinned setup action**, never from an `npm install` of bun in the workflow.
- **The scan reads it.** `.github/scripts/check-gate-inputs.sh:499-503` (the `if [[ -d "$ROOT/.github/actions" ]]` block) scans `.github/actions/**` with the workflow parser, so a path in an action is held to the twin rule.

The callers at the time of writing are `hooks-node-tests.yml`, `opencode-dual-version.yml` and `opencode-plugin-tests.yml`. A new provisioning workflow calls the action and does not copy its steps.

---

## 6. THE SWITCH IF SHAPE

A job can be switched off from repository variables with one condition between `name:` and `runs-on:`. With no variable set, everything runs.

```yaml
jobs:
  example:
    name: Example job
    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'
    runs-on: ubuntu-latest
```

- The condition is **job-level**, because `on:` filters see no contexts.
- Where a job already has a condition, the switch is ANDed onto it and never replaces it.
- `off` is the only disable token. `0`, `false` or a typo leaves the job on. That is fail-safe and must be documented wherever the variables are described.
- `SKILLED_CI` is the master switch. The five group switches are `SKILLED_CI_TESTS`, `SKILLED_CI_REPORTS`, `SKILLED_CI_REVIEW`, `SKILLED_CI_FRESHNESS` and `SKILLED_CI_MESSAGES`.
- `message-contract.yml` is never switched off while its ruleset context is required, and the other protected workflows follow `references/protected-set.md`.
- `dependabot-auto-merge.yml` gets no switch.

The shape is the rule. No workflow carries the condition yet, so a reader who finds none is reading the current tree and not a gap in this file.

Enforcement: honour-system.
