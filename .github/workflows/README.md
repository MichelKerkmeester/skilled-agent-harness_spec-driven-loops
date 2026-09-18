---
title: "GitHub Workflows: Repository CI Gates"
description: "GitHub Actions workflows that validate repository conventions, routing assets, documentation and runtime boundaries."
trigger_phrases:
  - "GitHub Actions workflows"
  - "repository CI gates"
  - "pull request checks"
---

# GitHub Workflows: Repository CI Gates

---

## 1. OVERVIEW

`.github/workflows/` contains the repository's GitHub Actions definitions. The workflows cover documentation integrity, naming, routing drift, mirror synchronization, runtime boundaries and scheduled freshness checks.

Section 2 lists what each workflow checks and which events it answers to. Section 3 names the workflows that run a guard script of their own.

---

## 2. CONTENTS

| Workflow | Responsibility |
|---|---|
| `advisory-checks.yml` | Runs advisory test suites and doc-model references. Reports without gating. |
| `agent-mirror-sync.yml` | Keeps the `.skilled` and `.claude` agent mirrors aligned. |
| `changed-packet-validation.yml` | Validates the spec packets a commit or pull request changed. |
| `chart-corpus.yml` | Checks the chart corpus contract and runs its mutation suite. |
| `command-tree-parity.yml` | Keeps the OpenCode and Claude command trees identical, and the Hermes skill and prompt copies equal to their sources. |
| `comment-hygiene.yml` | Rejects forbidden ephemeral-artifact pointers in code comments. |
| `deep-loop-runtime.yml` | Runs the deep-loop runtime suites, including the command-contract drift check. |
| `diagram-corpus.yml` | Checks the diagram corpus contract, its mutation suite and both applicator gates. |
| `dispatch-enforcement-guard.yml` | Checks that every declared dispatch rule is reachable and discriminates. |
| `gate-inputs.yml` | Checks that every hook and workflow input resolves and that every path filter names both `.opencode/` and `.skilled/`. |
| `markdown-link-integrity.yml` | Checks repository Markdown link integrity. |
| `naming-standard-guard.yml` | Enforces the repository filesystem naming standard. |
| `playbook-operator-contract.yml` | Checks the manual-testing-playbook operator-scenario contract. |
| `prompt-card-sync.yml` | Checks prompt and knowledge-card synchronization. |
| `repo-rules-corpus.yml` | Keeps the repo-rules corpus loadable. |
| `routing-registry-drift.yml` | Detects drift between routing registries and skill surfaces. |
| `rule-canary-sync.yml` | Checks rule canaries against their source rules. |
| `runtime-no-spec-import.yml` | Prevents runtime code from importing the mutable spec tree. |
| `sk-doc-rename-harness.yml` | Runs the ten-minute rename tooling fixture harness when sk-doc's scripts change. |
| `sk-doc-script-tests.yml` | Runs the other sk-doc script tests, among them the durable-directory manifest and README verdict baseline, which walk the whole repository. |
| `skill-doc-frontmatter.yml` | Validates skill reference and asset frontmatter. |
| `spec-kit-check.yml` | Typechecks and tests the spec-kit packages and checks that runtime mirrors agree with their sources. |
| `strict-pass-freshness-report.yml` | Weekly whole-corpus validation report. Does not gate. |

### Push versus pull-request coverage

The repository's documented flow pushes release lines directly, so a gate that runs only on pull requests never sees those commits. The table says which trigger each workflow answers to and why.

| Workflow | Push | Pull request | Why |
|---|---|---|---|
| `advisory-checks.yml`, `command-tree-parity.yml`, `dispatch-enforcement-guard.yml`, `playbook-operator-contract.yml`, `rule-canary-sync.yml`, `sk-doc-script-tests.yml` | yes | yes | Guards over the whole tree |
| `naming-standard-guard.yml` | release lines only | yes | Runs on `skilled/v*` pushes and every pull request |
| `gate-inputs.yml` | yes, no path filter | yes, no path filter | Guards a move of the source tree, the one change a path filter could miss |
| `chart-corpus.yml`, `deep-loop-runtime.yml`, `diagram-corpus.yml`, `markdown-link-integrity.yml`, `repo-rules-corpus.yml`, `routing-registry-drift.yml`, `runtime-no-spec-import.yml`, `sk-doc-rename-harness.yml`, `skill-doc-frontmatter.yml`, `spec-kit-check.yml` | yes, path-filtered | yes, path-filtered | Run only when their inputs change |
| `changed-packet-validation.yml` | yes | yes | Validates the packets a commit changed; on push it diffs against the previous tip |
| `agent-mirror-sync.yml`, `comment-hygiene.yml`, `prompt-card-sync.yml` | no | yes | Review-time checks. The pre-commit hook runs the same checkers on every commit |
| `strict-pass-freshness-report.yml` | schedule | no | A weekly report, not a gate |

---

## 3. GUARD ENTRYPOINTS

The naming guard runs the naming checker and its focused tests. The runtime-import guard runs the real-tree check plus clean and failing fixtures.

The gate-input workflow runs `.github/scripts/tests/check-gate-inputs.test.sh` against its fixtures, then `.github/scripts/check-gate-inputs.sh` over the real tree, then every `*.test.sh` hook suite and the hook checker's own test under the source root the hooks select. The worktree harness `install-git-hooks-worktree-harness.sh` runs locally only. The broken-move drill, `.github/scripts/tests/broken-move-drill.sh`, runs locally rather than in CI because it clones the whole repository. A workflow whose guard script is missing fails that step instead of skipping it.

---

## 4. RELATED

- [`GitHub Actions documentation`](https://docs.github.com/en/actions)
