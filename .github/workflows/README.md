---
title: "GitHub workflows: repository CI gates"
description: "The GitHub Actions workflows that gate pull requests into main and run scheduled repository sweeps."
trigger_phrases:
  - "github actions workflows"
  - "repository ci gates"
  - "pull request checks"
---

# GitHub workflows: repository CI gates

---

## 1. OVERVIEW

`.github/workflows/` holds the repository's GitHub Actions. Most run on pull requests targeting `main` and enforce a specific invariant before merge. Two are scoped further: several add `paths` filters so they only run when the files they guard change, and one runs on a schedule rather than a pull request.

Current state:

- Every pull-request workflow targets the `main` branch.
- Path-filtered workflows only fire when their guarded files change, which keeps unrelated pull requests fast.
- `strict-pass-freshness-sweep.yml` runs on a weekly cron and on manual dispatch, not on pull requests.

---

## 2. DIRECTORY TREE

```text
workflows/
+-- agent-mirror-sync.yml            # Agent mirror directories stay in sync
+-- comment-hygiene.yml              # Comment hygiene gate
+-- isolation-check.yml              # Spec-kit isolation check
+-- markdown-link-integrity.yml      # Markdown links resolve
+-- prompt-card-sync.yml             # Prompt and knowledge cards stay in sync
+-- routing-registry-drift.yml       # Routing registry drift guard
+-- rule-canary-sync.yml             # Rule canary sync
+-- skill-doc-frontmatter.yml        # Skill doc frontmatter validation
`-- strict-pass-freshness-sweep.yml  # Scheduled strict-pass freshness sweep
```

---

## 3. KEY FILES

| Workflow | Trigger | Guards |
|---|---|---|
| `agent-mirror-sync.yml` | PR to `main` | The mirrored agent directories stay aligned |
| `comment-hygiene.yml` | PR to `main` | Code comments carry no ephemeral artifact identifiers |
| `isolation-check.yml` | PR to `main`, spec-kit `mcp_server/**` and `shared/**` | Isolation invariants in the spec-kit server |
| `markdown-link-integrity.yml` | PR to `main`, skills, commands and agent trees | Relative markdown links resolve |
| `prompt-card-sync.yml` | PR to `main` | Prompt and knowledge cards match their sources |
| `routing-registry-drift.yml` | Push and PR to `main`, `mode-registry.json`, `hub-router.json`, advisor and parent-skill files | The routing registries do not drift from the skills |
| `rule-canary-sync.yml` | PR to `main` | Rule canaries match their source rules |
| `skill-doc-frontmatter.yml` | PR to `main`, skills `references/**` and `assets/**` | Skill reference and asset frontmatter is well formed |
| `strict-pass-freshness-sweep.yml` | Weekly cron and manual dispatch | Strict-pass results stay fresh across packets |

---

## 4. RELATED

- [`../hooks/scripts/README.md`](../hooks/scripts/README.md)
- [`../../.opencode/skills/sk-doc/create-skill/scripts/package_skill.py`](../../.opencode/skills/sk-doc/create-skill/scripts/package_skill.py)
