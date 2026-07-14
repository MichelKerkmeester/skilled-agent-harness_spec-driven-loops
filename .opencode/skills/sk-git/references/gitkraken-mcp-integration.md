---
title: GitKraken MCP Integration - Cross-Platform Git, Issue, and PR Reference
description: Programmatic access to GitKraken's cross-platform (GitHub/GitLab/Azure DevOps/Bitbucket/Jira) git, GitLens AI, issue, and PR tools via Code Mode.
trigger_phrases:
  - "gitkraken mcp tools"
  - "gitlens launchpad"
  - "gitlens commit composer"
  - "cross-platform pull request"
  - "gitkraken start review"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# GitKraken MCP Integration - Cross-Platform Git, Issue, and PR Reference

Programmatic access to GitKraken's tools via Code Mode (`call_tool_chain`). Registered as the `gitkraken` manual in `.utcp_config.json` (stdio, `npx -y @gitkraken/gk mcp`).

---

## 1. OVERVIEW

The GitKraken MCP server (`@gitkraken/gk`) exposes 31 tools spanning local git operations, GitLens AI workflows, and cross-platform issue/PR management across GitHub, GitLab, Azure DevOps, Bitbucket, and Jira. Unlike [github-mcp-integration.md](./github-mcp-integration.md), which is GitHub-only, GitKraken MCP is the tool to reach for when a repository lives on a non-GitHub provider, or when the task benefits from GitLens' AI-assisted workflows (commit composition, PR review, launchpad triage).

**Prerequisites**: The `gk` CLI must be authenticated (`gk auth login` / `gk whoami`) with the relevant provider(s) connected (`gk provider`). No `.utcp_config.json` env vars are required — auth is handled entirely by the CLI's own local auth state.

**Public preview**: GitKraken CLI is explicitly labeled a public preview product; tool names and parameters may evolve. Re-verify with `gk mcp --list-tools` before relying on an unlisted tool.

---

## 2. SAFETY: LOCAL GIT MUTATIONS STAY ON BASH

**MANDATORY**: GitKraken MCP exposes tools (`git_add_or_commit`, `git_push`, `git_pull`, `git_fetch`, `git_checkout`, `git_branch`, `git_worktree`, `git_stash`) that duplicate local git mutations sk-git already gates behind mandatory rules: ask-first worktree creation, no direct branch creation, deterministic conventional-commit format (`SKILL.md` §4 RULES). **Never use these GitKraken MCP tools as a substitute for sk-git's existing Bash-based workflow.** This mirrors the identical precedent already established for GitHub MCP (`references/github-mcp-integration.md` §3: "Do not create branches via GitHub MCP; use local git worktree add -b").

**Forbidden outright**: `app_tool_box` and `app_update_user_preferences` are internal helpers for GitKraken's own MCP-hosting apps. Their tool descriptions self-declare "App-only — agents must not call this tool." Never call them.

**Ask-first adjacent**: `gitlens_start_review` creates a dedicated git worktree internally as part of its flow — treat invoking it as equivalent to creating a worktree. `gitlens_start_work` creates and links a branch to the issue (its own tool description does not claim a worktree, only a branch) — treat it as equivalent to sk-git's no-direct-branch-creation rule. Only use either tool when the user has expressed intent for an AI-driven review or AI-driven work-start flow, not as a default reflex for "review this PR" or "start on this issue."

---

## 3. TOOL SELECTION GUIDE

| Operation                                  | Tool                                    | Rationale                                                       |
| :------------------------------------------ | :--------------------------------------- | :----------------------------------------------------------------|
| commit, push, pull, fetch, checkout, branch, worktree, stash | Local `git` (Bash)         | Faster, offline, and preserves sk-git's ask-first/no-direct-branch/conventional-commit rules |
| status, log, diff, blame (local)            | Local `git` (Bash) OR GitKraken MCP read tools | Both work; GitKraken MCP adds no value for local-only reads |
| AI-organized commit composition             | GitKraken MCP `gitlens_commit_composer` | No local equivalent; opt-in when the user wants AI-grouped commits instead of sk-git's own deterministic message logic |
| PR review triage ("what needs my attention") | GitKraken MCP `gitlens_launchpad`       | Cross-provider prioritized view (ready to merge, has conflicts, awaiting review) |
| AI-driven PR review                         | GitKraken MCP `gitlens_start_review`    | Creates its own worktree; use only on explicit user intent |
| AI-driven work start from an issue          | GitKraken MCP `gitlens_start_work`      | Creates and links a branch to the issue; use only on explicit user intent |
| Create/list/merge PR on GitHub               | `gh` CLI OR GitHub MCP OR GitKraken MCP | All three work for GitHub; prefer `gh`/GitHub MCP (repo precedent) unless the task also spans a non-GitHub provider |
| Create/list/review PR on GitLab, Azure DevOps, Bitbucket | GitKraken MCP `pull_request_*`  | GitHub MCP and `gh` CLI cannot reach these providers |
| Issue management on Jira, Linear, GitLab, Azure DevOps | GitKraken MCP `issues_*`         | GitHub MCP and `gh` CLI are GitHub-only |
| Cross-repo file read on a non-GitHub provider | GitKraken MCP `repository_get_file_content` | GitHub MCP's `github_get_file_contents` is GitHub-only |
| List GitKraken workspaces                    | GitKraken MCP `gitkraken_workspace_list` | No local or GitHub MCP equivalent |

---

## 4. AVAILABLE TOOLS

**Access Pattern:** `gitkraken.gitkraken_{tool_name}({...})`

**Verified 2026-07-10 via `gk mcp --list-tools` against the locally installed, authenticated CLI (31 tools total).** The upstream README under-documents this list — treat this table, not the README, as the reference; re-run `gk mcp --list-tools` if it looks stale.

| Category | Tools | Description |
| :------- | :---- | :----------- |
| **Forbidden (app-internal)** | `app_tool_box`, `app_update_user_preferences` | Self-declared "App-only" — never call from an agent |
| **Local git — reads** | `git_status`, `git_log_or_diff`, `git_blame`, `git_branch` (list action) | Prefer local `git`/Bash instead (§3) |
| **Local git — mutations** | `git_add_or_commit`, `git_push`, `git_pull`, `git_fetch`, `git_checkout`, `git_branch` (create action), `git_worktree` (add action), `git_stash` | Prefer local `git`/Bash instead — see §2 safety rule |
| **GitLens AI workflows** | `git_commit_composer`, `gitlens_commit_composer`, `git_graph`, `git_resolve`, `gitlens_launchpad`, `gitlens_start_review`, `gitlens_start_work` | High-value, no local equivalent; `gitlens_start_review` creates a worktree, `gitlens_start_work` creates a branch (§2) |
| **GitKraken workspaces** | `gitkraken_workspace_list` | Lists all GitKraken workspaces |
| **Issues** | `issues_add_comment`, `issues_assigned_to_me`, `issues_create`, `issues_get_detail` | Cross-provider: GitHub, GitLab, Azure DevOps, Bitbucket, Jira, Linear |
| **Pull requests** | `pull_request_assigned_to_me`, `pull_request_create`, `pull_request_create_review`, `pull_request_get_comments`, `pull_request_get_detail` | Cross-provider; `provider` param defaults to `GITHUB` but accepts GitLab/Azure DevOps/Bitbucket |
| **Repository** | `repository_get_file_content` | Cross-provider remote file read by ref (branch/tag/SHA) |

Most issue/PR/repository tools require `provider` (defaults to `GITHUB`) plus provider-specific identifiers: `repository_name` + `repository_organization` for GitHub/GitLab, `azure_organization` + `azure_project` for Azure DevOps, or a Jira project key / Linear team identifier depending on provider. Check `gk mcp --list-tools` for the exact required parameters per provider before calling.

---

## 5. USAGE EXAMPLES

```typescript
// Check what needs attention across all connected providers (cross-platform PR triage)
call_tool_chain({
  code: `await gitkraken.gitkraken_gitlens_launchpad({
    directory: '/path/to/repo'
  })`
})

// AI-organized commit composition (opt-in alternative to sk-git's deterministic commit logic)
call_tool_chain({
  code: `await gitkraken.gitkraken_gitlens_commit_composer({
    directory: '/path/to/repo',
    instructions: 'group by codebase area, conventional commit prefixes'
  })`
})

// Create a PR on a non-GitHub provider (GitLab example)
call_tool_chain({
  code: `await gitkraken.gitkraken_pull_request_create({
    provider: 'GITLAB',
    repository_name: 'repo',
    repository_organization: 'group',
    source_branch: 'feature/oauth',
    target_branch: 'main',
    title: 'feat(auth): add OAuth2 login',
    body: '## Summary\\n- Implements OAuth2 flow'
  })`
})

// Get PR details across providers
call_tool_chain({
  code: `await gitkraken.gitkraken_pull_request_get_detail({
    provider: 'GITHUB',
    repository_name: 'repo',
    repository_organization: 'owner',
    pull_request_id: '42',
    pull_request_files: true
  })`
})

// Create an issue on Jira
call_tool_chain({
  code: `await gitkraken.gitkraken_issues_create({
    provider: 'JIRA',
    repository_name: 'PROJ',
    title: 'Fix login timeout',
    body: 'Users report session expiry after 5 minutes'
  })`
})
```

---

## 6. ERROR HANDLING

### Provider/auth errors

```typescript
call_tool_chain({
  code: `
    try {
      const result = await gitkraken.gitkraken_pull_request_create({
        provider: 'GITHUB',
        repository_name: 'repo',
        repository_organization: 'owner',
        source_branch: 'feature-branch',
        target_branch: 'main',
        title: 'feat: new feature'
      });
      return result;
    } catch (error) {
      // Common errors:
      // - Provider not connected: run 'gk provider' locally to add the missing provider token
      // - 422/branch errors: branch doesn't exist or no commits between branches
      // - 403: insufficient permissions on the connected provider account
      return { error: error.message };
    }
  `
})
```

### Worktree-creating tools

`gitlens_start_review` and `gitlens_start_work` create a worktree as a side effect. If the call fails partway, check `git worktree list` locally and clean up with `git worktree remove` before retrying — do not leave orphaned worktrees per sk-git's §4 RULES cleanup requirement.

---

## 7. RELATED RESOURCES

**Internal References**:
- [github-mcp-integration.md](./github-mcp-integration.md) - GitHub-only MCP reference; prefer it for GitHub-only tasks
- [quick-reference.md](./quick-reference.md) - Command cheat sheet
- [shared-patterns.md](./shared-patterns.md) - Reusable git patterns

**External References**:
- [GitKraken CLI Docs](https://help.gitkraken.com/cli/gk-cli-mcp)
- [GitKraken MCP Server (GitHub)](https://github.com/gitkraken/mcp)
