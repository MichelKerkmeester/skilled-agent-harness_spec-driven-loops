---
title: "GitHub MCP integration"
description: "Full CRUD access to GitHub's remote PR, issue, and repository operations via Code Mode, layered on top of local git and the gh CLI rather than replacing them."
trigger_phrases:
  - "github mcp integration"
  - "remote github operations"
  - "create pull request programmatically"
  - "github issue management tools"
version: 1.0.0.0
---

# GitHub MCP integration (github.github_*)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

GitHub MCP provides full CRUD access to GitHub's remote operations — pull requests, issues, and repository reads — from within sk-git's finish workflow, reached through Code Mode's `call_tool_chain`. It requires a Personal Access Token configured in `.utcp_config.json` with the appropriate scopes.

Its role is deliberately narrow: local operations (commit, diff, status, log, merge, worktree management) stay on local `git` because they're faster and need no network round-trip; GitHub MCP is for remote state and collaboration features where its API is richer than `gh` alone.

---

## 2. HOW IT WORKS

### Tool Selection

PR creation and listing work equally well through `gh` CLI or GitHub MCP; `gh` is simpler for basic operations. PR reviews and comments, issue management, and CI/CD status/logs favor GitHub MCP for its fuller API surface. Cross-repository code and repository search likewise route to GitHub MCP.

### Branch Creation Boundary

GitHub MCP exposes `github_create_branch`, but sk-git explicitly routes branch creation back to local `git worktree add -b ...` instead — the same no-direct-branch-creation discipline that applies everywhere else in the skill, so a remote-API shortcut can never bypass the owner-first naming grammar or the ask-first worktree rule.

### Typical Usage

Calls follow the pattern `github.github_{tool_name}({...})` inside `call_tool_chain`, covering the full pull-request lifecycle (create, list, get, merge, review, get files/status/comments/reviews), the full issue lifecycle (create, get, list, search, comment, update), and repository reads (file contents, branch search, commit listing). CI/CD workflow status and branch listing route to the `gh` CLI instead, since GitHub MCP's tool set does not cover them.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-git/references/github-mcp-integration.md` | Shared | Tool selection guide, full tool inventory, usage/error-handling examples |
| `.opencode/skills/sk-git/references/finish-workflows.md` | Shared | PR creation as Option 2 of the finish workflow |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-git/manual-testing-playbook/integration-and-pr/finish-create-pr-with-template.md` | Manual playbook | Exercises the push-and-PR flow this integration is invoked from (`gh` CLI path; no dedicated GitHub-MCP-tool scenario yet) |

---

## 4. SOURCE METADATA

- Group: Remote Platform Integration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `remote_platform_integration/github_mcp_integration.md`

Related references:
- [gitkraken_mcp_integration.md](gitkraken-mcp-integration.md) — GitKraken MCP integration
