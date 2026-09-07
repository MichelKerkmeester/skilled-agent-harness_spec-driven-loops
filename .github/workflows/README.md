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

The live guard workflows that matter for the current README coverage are `naming-standard-guard.yml`, `runtime-no-spec-import.yml` and `spec-root-resolution-matrix.yml`. A historical isolation workflow is absent and is not part of the inventory.

```text example
isolation-check.yml
```

---

## 2. CONTENTS

| Workflow | Responsibility |
|---|---|
| `agent-mirror-sync.yml` | Keeps the `.opencode` and `.claude` agent mirrors aligned. |
| `changed-packet-validation.yml` | Validates the spec packets a pull request changed. |
| `comment-hygiene.yml` | Rejects forbidden ephemeral-artifact pointers in code comments. |
| `markdown-link-integrity.yml` | Checks repository Markdown link integrity. |
| `naming-standard-guard.yml` | Enforces the repository filesystem naming standard. |
| `prompt-card-sync.yml` | Checks prompt and knowledge-card synchronization. |
| `routing-registry-drift.yml` | Detects drift between routing registries and skill surfaces. |
| `rule-canary-sync.yml` | Checks rule canaries against their source rules. |
| `runtime-no-spec-import.yml` | Prevents runtime code from importing the mutable spec tree. |
| `strict-pass-freshness-report.yml` | Weekly whole-corpus validation report; does not gate. |
| `skill-doc-frontmatter.yml` | Validates skill reference and asset frontmatter. |

### Push versus pull-request coverage

The repository's documented flow pushes release lines directly, so a gate that runs only on pull requests never sees those commits. The table says which trigger each workflow answers to and why.

| Workflow | Push | Pull request | Why |
|---|---|---|---|
| `advisory-checks.yml`, `command-tree-parity.yml`, `naming-standard-guard.yml`, `playbook-operator-contract.yml` | yes | yes | Cheap guards over the whole tree |
| `routing-registry-drift.yml`, `runtime-no-spec-import.yml` | yes, path-filtered | yes, path-filtered | Expensive; run only when their inputs change |
| `spec-kit-check.yml` | yes, path-filtered | yes, path-filtered | Six suites; path-filtered to the skill so unrelated pushes stay cheap |
| `changed-packet-validation.yml` | yes | yes | Validates the packets a commit changed; on push it diffs against the previous tip |
| `agent-mirror-sync.yml`, `comment-hygiene.yml`, `markdown-link-integrity.yml`, `prompt-card-sync.yml`, `rule-canary-sync.yml`, `skill-doc-frontmatter.yml` | no | yes | Review-time checks on a diff; the pre-commit hooks cover the same ground on direct pushes |
| `strict-pass-freshness-report.yml` | schedule | no | A weekly report, not a gate |
| `spec-root-resolution-matrix.yml` | Exercises spec-root resolution across its configured matrix. |

---

## 3. GUARD ENTRYPOINTS

The naming guard runs the naming checker and its focused tests. The runtime-import guard runs the real-tree check plus clean and failing fixtures. The spec-root matrix installs its script dependencies, verifies collection and runs the configured resolution rows.

---

## 4. RELATED

- [`GitHub Actions documentation`](https://docs.github.com/en/actions)
