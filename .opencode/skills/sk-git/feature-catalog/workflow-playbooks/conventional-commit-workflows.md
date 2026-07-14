---
title: "Conventional commit workflows"
description: "Deterministic commit-message contract, artifact filtering, and scoped-staging discipline that keep AI-authored commits atomic and free of unrelated in-flight work."
trigger_phrases:
  - "conventional commit workflows"
  - "scoped staging discipline"
  - "atomic commit strategy"
  - "filter development artifacts"
version: 1.0.0.0
---

# Conventional commit workflows

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

sk-git gives an AI a deterministic procedure for turning a set of changes into one or more well-formed commits: analyze and categorize changed files, filter out internal artifacts, decide single-versus-multiple commits, write a Conventional-Commits-shaped message, and verify readiness before committing.

The workflow's distinguishing feature is scoped-staging discipline: on a dirty shared working tree, an AI stages only its own explicit pathspecs and asserts the staged set against a deny-pattern, so a broad `git add -A` or `git add .` can never sweep another session's uncommitted or already-staged work into its commit.

---

## 2. HOW IT WORKS

### Message Contract

Every authored subject follows `type(scope)[!]: imperative summary`. Type is chosen by a fixed first-match priority order (`release` → `docs` → `fix` → `feat` → `perf` → `refactor` → `test` → `ci` → `build` → `style` → `revert`/`merge` → `chore`). Scope is a stable, lowercase subsystem name selected by an equally fixed priority order and is never a numeric packet or phase identifier. The subject targets 80 characters and never exceeds 100; a body is required whenever four or more paths are staged, the change fixes a regression/race/security issue, or the reason isn't obvious from the subject alone. A `commit-msg` git hook enforces this structure (bypass: `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1`); Git-generated subjects (`Merge `, `Revert "`, `fixup!`, `squash!`, `amend!`) are preserved unchanged rather than reformatted.

### Artifact Filtering

Internal development artifacts (coverage reports, personal notes, temporary analysis files) and non-conventionally placed files (misplaced tests, wrong-location configs) are excluded from staging outright — but never added to `.gitignore`, since exclusion from a specific commit is not the same claim as "this should never be tracked."

### Scoped-Staging Discipline

Before staging, the AI snapshots both the unstaged and already-staged state (`git status --short`, `git diff --cached --name-only`) because unrelated work can already be sitting in the index before it starts. It then stages only its own explicit pathspecs — never a directory unless every file under it is its own — and asserts the staged set against a deny-pattern of known-unrelated paths before committing. If unrelated work was already committed by mistake, `git reset --mixed HEAD~1` un-commits while preserving working-tree contents, so the AI can re-stage precisely and recommit.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-git/references/commit-workflows.md` | Shared | Seven-step commit workflow, decision matrix, scoped-staging procedure |
| `.opencode/skills/sk-git/assets/commit-message-template.md` | Shared | Repository-specific worked message examples and AI author procedure |
| `.opencode/scripts/git-hooks/commit-msg` | Script | Structural enforcement of the subject/body contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/conventional-commit-from-diff.md` | Manual playbook | Validates message construction from a real staged diff |
| `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/mixed-concerns-split-or-warn.md` | Manual playbook | Validates split-vs-single-commit decisioning |
| `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/scope-inference-skill-folder.md` | Manual playbook | Validates scope-selection priority order |

---

## 4. SOURCE METADATA

- Group: Workflow Playbooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `workflow_playbooks/conventional_commit_workflows.md`

Related references:
- [numbered_worktree_workflows.md](numbered-worktree-workflows.md) — Numbered worktree workflows
- [finish_and_integration_workflows.md](finish-and-integration-workflows.md) — Finish and integration workflows
