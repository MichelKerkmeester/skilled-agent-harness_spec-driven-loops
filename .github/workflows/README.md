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

## 2. CONTENTS

| Workflow | Responsibility |
|---|---|
| `agent-mirror-sync.yml` | Keeps the `.opencode` and `.claude` agent mirrors aligned. |
| `comment-hygiene.yml` | Rejects forbidden ephemeral-artifact pointers in code comments. |
| `markdown-link-integrity.yml` | Checks repository Markdown link integrity. |
| `naming-standard-guard.yml` | Enforces the repository filesystem naming standard. |
| `prompt-card-sync.yml` | Checks prompt and knowledge-card synchronization. |
| `routing-registry-drift.yml` | Detects drift between routing registries and skill surfaces. |
| `rule-canary-sync.yml` | Checks rule canaries against their source rules. |
| `runtime-no-spec-import.yml` | Prevents runtime code from importing the mutable spec tree. |
| `skill-doc-frontmatter.yml` | Validates skill reference and asset frontmatter. |
| `spec-root-resolution-matrix.yml` | Exercises spec-root resolution across its configured matrix. |
| `strict-pass-freshness-sweep.yml` | Runs the scheduled strict-pass freshness sweep. |

## 3. GUARD ENTRYPOINTS

The naming guard runs the naming checker and its focused tests. The runtime-import guard runs the real-tree check plus clean and failing fixtures. The spec-root matrix installs its script dependencies, verifies collection and runs the configured resolution rows.

## 4. RELATED

- [`GitHub Actions documentation`](https://docs.github.com/en/actions)
