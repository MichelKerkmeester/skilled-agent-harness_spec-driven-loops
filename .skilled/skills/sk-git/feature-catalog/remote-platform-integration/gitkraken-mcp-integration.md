---
title: "GitKraken MCP integration"
description: "Cross-platform (GitHub/GitLab/Azure DevOps/Bitbucket/Jira) access to GitLens AI workflows and issue/PR management via Code Mode, reserved for operations with no local git equivalent."
trigger_phrases:
  - "gitkraken mcp integration"
  - "gitlens launchpad"
  - "gitlens commit composer"
  - "cross-platform pull request"
version: 1.0.0.0
---

# GitKraken MCP integration (gitkraken.gitkraken_*)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

GitKraken MCP exposes GitLens AI workflows and cross-platform issue/PR/repository management across GitHub, GitLab, Azure DevOps, Bitbucket, and Jira through Code Mode's `call_tool_chain`. It is the tool to reach for when a repository lives on a non-GitHub provider, or when a task benefits from GitLens' AI-assisted workflows — commit composition, PR review triage, launchpad prioritization.

Unlike the GitHub MCP integration, which is GitHub-only, GitKraken MCP's value is specifically its provider breadth and its AI-workflow tools; its local git mutation tools duplicate capability sk-git already gates and must not be used as a substitute.

---

## 2. HOW IT WORKS

### Local-Mutation Tools Stay on Bash

GitKraken MCP exposes `git_add_or_commit`, `git_push`, `git_pull`, `git_fetch`, `git_checkout`, `git_branch`, `git_worktree`, and `git_stash` — all local git mutations that duplicate rules sk-git already enforces: ask-first worktree creation, no direct branch creation, and the deterministic conventional-commit message contract. These GitKraken tools must never substitute for sk-git's existing Bash-based workflow; the same precedent already applies identically to GitHub MCP. Two tools, `app_tool_box` and `app_update_user_preferences`, are self-declared "app-only" internal helpers for GitKraken's own hosting apps and must never be called by an agent at all.

### Ask-First-Adjacent Tools

`gitlens_start_review` creates a dedicated git worktree internally as part of its own flow, so invoking it is treated as equivalent to creating a worktree — the same ask-first discipline applies. `gitlens_start_work` creates and links a branch to an issue, so it is treated as equivalent to the no-direct-branch-creation rule. Both are reserved for cases where the user has expressed explicit intent for an AI-driven review or work-start flow, not as a default reflex for "review this PR" or "start on this issue."

### Where GitKraken MCP Adds Real Value

Cross-provider PR review triage (`gitlens_launchpad`), AI-organized commit composition (`gitlens_commit_composer`), and any PR/issue/repository operation on a non-GitHub provider (GitLab, Azure DevOps, Bitbucket, Jira, Linear) have no local or GitHub MCP equivalent, and are the intended use of this integration. For GitHub-only PR/issue work, `gh` CLI or GitHub MCP remain the preferred path unless the same task also spans a non-GitHub provider.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-git/references/gitkraken-mcp-integration.md` | Shared | Tool selection guide, safety rules, full tool inventory, usage/error-handling examples |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| — | — | No automated test or manual playbook scenario covers this integration yet |

---

## 4. SOURCE METADATA

- Group: Remote Platform Integration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `remote-platform-integration/gitkraken-mcp-integration.md`

Related references:
- [github-mcp-integration.md](github-mcp-integration.md) — GitHub MCP integration
