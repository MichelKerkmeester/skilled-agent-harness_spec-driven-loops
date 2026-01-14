---
name: workflows-git
description: "Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion across git-worktrees, git-commit, and git-finish skills"
allowed-tools: [Read, Bash, mcp__code_mode__call_tool_chain]
version: 1.5.0
---

<!-- Keywords: git-workflow, git-worktree, conventional-commits, branch-management, pull-request, commit-hygiene, workspace-isolation, version-control, github, issues, pr-review -->

# Git Workflows - Git Development Orchestrator

Unified workflow guidance across workspace isolation, commit hygiene, and work completion.

---

## 1. 🎯 WHEN TO USE

### When to Use This Orchestrator

Use this orchestrator when:
- Starting new git-based work
- Unsure which git skill to use
- Following complete git workflow (setup → work → complete)
- Looking for git best practices (branch naming, commit conventions)

### When NOT to Use

- Simple `git status` or `git log` queries (use Bash directly)
- Non-git version control systems

### Keyword Triggers

`worktree`, `branch`, `commit`, `merge`, `pr`, `pull request`, `git workflow`, `conventional commits`, `finish work`, `integrate changes`, `github`, `issue`, `review`

---

## 2. 🧭 SMART ROUTING

### Phase Detection
```
GIT WORKFLOW CONTEXT
    │
    ├─► Starting new work / need isolated workspace
    │   └─► PHASE 1: Workspace Setup (git-worktrees)
    │       └─► Load: worktree_workflows.md, worktree_checklist.md
    │
    ├─► Ready to commit changes
    │   └─► PHASE 2: Commit (git-commit)
    │       └─► Load: commit_workflows.md, commit_message_template.md
    │
    ├─► Work complete / ready to integrate
    │   └─► PHASE 3: Finish (git-finish)
    │       └─► Load: finish_workflows.md, pr_template.md
    │
    ├─► Need command reference / conventions
    │   └─► Load: shared_patterns.md
    │
    └─► Quick overview needed
        └─► Load: quick_reference.md
```

### Resource Router
```python
def route_git_resources(task):
    # ──────────────────────────────────────────────────────────────────
    # Phase 1: Workspace Setup (git-worktrees)
    # Purpose: Complete 7-step worktree creation workflow
    # Key Insight: Directory selection priority, safety verification, branch strategies
    # ──────────────────────────────────────────────────────────────────
    if task.needs_isolated_workspace or "worktree" in task.keywords:
        return load("references/worktree_workflows.md")  # 7-step creation workflow

    # ──────────────────────────────────────────────────────────────────
    # Phase 2: Commit Workflow (git-commit)
    # Purpose: Complete 6-step commit workflow
    # Key Insight: File categorization, artifact filtering, Conventional Commits
    # ──────────────────────────────────────────────────────────────────
    if task.has_staged_changes or "commit" in task.keywords:
        load("references/commit_workflows.md")  # 6-step commit workflow
        if task.needs_message_help:
            return load("assets/commit_message_template.md")  # Conventional Commits examples

    # ──────────────────────────────────────────────────────────────────
    # Phase 3: Completion/Integration (git-finish)
    # Purpose: Complete 5-step completion workflow
    # Key Insight: Test verification gate, 4 options (merge/PR/keep/discard)
    # ──────────────────────────────────────────────────────────────────
    if task.ready_to_integrate or "merge" in task.keywords or "pr" in task.keywords:
        load("references/finish_workflows.md")  # 5-step completion workflow
        if task.creating_pr:
            return load("assets/pr_template.md")  # PR description template

    # ──────────────────────────────────────────────────────────────────
    # Quick Reference
    # Purpose: One-page cheat sheet
    # Key Insight: Skill selection flowchart, essential commands
    # ──────────────────────────────────────────────────────────────────
    if task.needs_quick_reference:
        return load("references/quick_reference.md")  # one-page cheat sheet

    # ──────────────────────────────────────────────────────────────────
    # Shared Patterns
    # Purpose: Common git patterns and command reference
    # Key Insight: Branch naming, git commands, Conventional Commits format
    # ──────────────────────────────────────────────────────────────────
    if task.needs_command_reference or task.needs_conventions:
        return load("references/shared_patterns.md")

    # ──────────────────────────────────────────────────────────────────
    # Worktree Checklist
    # Purpose: Step-by-step worktree creation checklist
    # Key Insight: Validation checkpoints for workspace setup
    # ──────────────────────────────────────────────────────────────────
    if task.setting_up_worktree:
        return load("assets/worktree_checklist.md")  # step-by-step validation

# ══════════════════════════════════════════════════════════════════════
# STATIC RESOURCES (always available, not conditionally loaded)
# ══════════════════════════════════════════════════════════════════════
# assets/commit_message_template.md → Format guide with real-world examples
# assets/pr_template.md → Structured PR descriptions with examples
```

---

## 3. 🛠️ HOW IT WORKS

### Git Development Lifecycle Map

Git development flows through 3 phases:

**Phase 1: Workspace Setup** (Isolate your work)
- **git-worktrees** - Create isolated workspace with short-lived temp branches
- Prevents: Branch juggling, stash chaos, context switching
- Output: Clean workspace ready for focused development
- **See**: [worktree_workflows.md](./references/worktree_workflows.md)

**Phase 2: Work & Commit** (Make clean commits)
- **git-commit** - Analyze changes, filter artifacts, write Conventional Commits
- Prevents: Accidental artifact commits, unclear commit history
- Output: Professional commit history following conventions
- **See**: [commit_workflows.md](./references/commit_workflows.md)

**Phase 3: Complete & Integrate** (Finish the work)
- **git-finish** - Merge, create PR, or discard work (with tests gate)
- Prevents: Incomplete work merged, untested code integrated
- Output: Work successfully integrated or cleanly discarded
- **See**: [finish_workflows.md](./references/finish_workflows.md)

### Phase Transitions
- Setup → Work: Worktree created, ready to code
- Work → Complete: Changes committed, tests passing
- Complete → Setup: Work integrated, start next task

---

## 4. 📋 RULES

### ✅ ALWAYS

1. **Use conventional commit format** - All commits must follow `type(scope): description` pattern
2. **Create worktree for parallel work** - Never work on multiple features in the same worktree
3. **Verify branch is up-to-date** - Pull latest changes before creating PR
4. **Use descriptive branch names** - Format: `type/short-description` (e.g., `feat/add-auth`, `fix/login-bug`)
5. **Reference spec folder in commits** - Include spec folder path in commit body when applicable
6. **Clean up after merge** - Delete local and remote feature branches after successful merge
7. **Squash commits for clean history** - Use squash merge for feature branches with many WIP commits

### ❌ NEVER

1. **Force push to main/master** - Protected branches must never receive force pushes
2. **Commit directly to protected branches** - Always use feature branches and PRs
3. **Leave worktrees uncleaned** - Remove worktree directories after merge
4. **Commit secrets or credentials** - Use environment variables or secret management
5. **Create PRs without description** - Always include context, changes, and testing notes
6. **Merge without CI passing** - Wait for all checks to complete
7. **Rebase public/shared branches** - Only rebase local, unpushed commits

### ⚠️ ESCALATE IF

1. **Merge conflicts cannot be auto-resolved** - Complex conflicts require human decision on which changes to keep
2. **GitHub MCP returns authentication errors** - Token may be expired or permissions insufficient
3. **Worktree directory is locked or corrupted** - May require manual cleanup with `git worktree prune`
4. **Force push to protected branch is requested** - This requires explicit approval and understanding of consequences
5. **CI/CD pipeline fails repeatedly** - May indicate infrastructure issues beyond code problems
6. **Branch divergence exceeds 50 commits** - Large divergence suggests need for incremental merging strategy
7. **Submodule conflicts detected** - Submodule updates require careful coordination

---

## 5. 🏆 SUCCESS CRITERIA

### Workspace Setup Complete
- ✅ Worktree created in correct directory (`.worktrees/` or user-specified)
- ✅ Branch naming follows convention (`type/short-description`)
- ✅ Working directory is clean and isolated
- ✅ User confirmed workspace choice (branch/worktree/current)

### Commit Complete
- ✅ All changes reviewed and categorized
- ✅ Artifacts filtered out (build files, coverage, etc.)
- ✅ Commit message follows Conventional Commits format
- ✅ Only public-value files staged

### Integration Complete
- ✅ Tests pass before merge/PR
- ✅ PR description includes context, changes, and testing notes
- ✅ Branch up-to-date with base branch
- ✅ Worktree cleaned up after merge (if used)
- ✅ Local and remote feature branches deleted

### Quality Gates

| Gate | Criteria | Blocking |
|------|----------|----------|
| **Pre-commit** | Artifacts excluded, message formatted | Yes |
| **Pre-merge** | Tests pass, branch up-to-date | Yes |
| **Pre-PR** | Description complete, CI passing | Yes |
| **Post-merge** | Worktree removed, branches cleaned | No |

---

## 6. 🔌 INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Gate 3**: File modifications require spec folder question per AGENTS.md Gate 3 (HARD BLOCK)
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Memory Integration

Use Spec Kit Memory MCP for context recovery and preservation:

```javascript
// Find prior git work in a spec folder
memory_search({ query: "git workflow", specFolder: "007-feature-name" })

// Search for related decisions across all specs
memory_search({ query: "branch strategy decisions", includeContent: true })

// After major commits or workflow completion
// Save context with: /memory:save or "save context to [spec-folder]"
```

**Best Practices**:
- Use `memory_search()` at session start to recover prior git context
- Save context after significant commits or before ending a session
- Reference spec folder in commit messages for traceability

---

## 7. 🐙 GITHUB MCP INTEGRATION (REMOTE)

**GitHub MCP Server** provides programmatic access to GitHub's remote operations via Code Mode (`call_tool_chain`).

### Prerequisites

- **PAT configured** in `.utcp_config.json` with appropriate scopes (repo, issues, pull_requests)

### When to Use GitHub MCP vs Local Git vs gh CLI

| Operation                        | Tool                   | Rationale                               |
| :------------------------------- | :--------------------- | :-------------------------------------- |
| commit, diff, status, log, merge | Local `git` (Bash)     | Faster, no network required             |
| worktree management              | Local `git` (Bash)     | Local filesystem operation              |
| Create/list PRs                  | `gh` CLI OR GitHub MCP | Both work; gh CLI simpler for basic ops |
| PR reviews, comments             | GitHub MCP             | Richer API for review workflows         |
| Issue management                 | GitHub MCP             | Full CRUD on issues                     |
| CI/CD status, logs               | GitHub MCP             | Access workflow runs and job logs       |
| Search repos/code remotely       | GitHub MCP             | Cross-repo searches                     |

### Available Tools (Code Mode Access)

**Access Pattern:** `github.github.{tool_name}({...})`

| Category          | Tools                                                                                                                                                                                                                                                                                                                                                           | Description                                                                       |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **Pull Requests** | `github_create_pull_request`<br>`github_list_pull_requests`<br>`github_get_pull_request`<br>`github_merge_pull_request`<br>`github_create_pull_request_review`<br>`github_get_pull_request_files`<br>`github_get_pull_request_status`<br>`github_update_pull_request_branch`<br>`github_get_pull_request_comments`<br>`github_get_pull_request_reviews` | Create, list, merge PRs; add reviews; get files, status, and reviews |
| **Issues**        | `github_create_issue`<br>`github_get_issue`<br>`github_list_issues`<br>`github_search_issues`<br>`github_add_issue_comment`<br>`github_update_issue`                                                                                                                                                                                                            | Full issue lifecycle management                                                   |
| **Repository**    | `github_get_file_contents`<br>`github_create_branch`<br>`github_search_repositories`<br>`github_list_commits`                                                                                                                                                                                                                                                   | Read files, manage branches, search                                               |

> **Note**: CI/CD workflow status and branch listing require the `gh` CLI:
> - `gh run list` - List workflow runs
> - `gh run view <id>` - View specific run
> - `gh api repos/{owner}/{repo}/branches` - List branches

### Usage Examples

```typescript
// List open PRs
call_tool_chain({
  code: `await github.github.list_pull_requests({
    owner: 'owner',
    repo: 'repo',
    state: 'open'
  })`
})

// Create PR with full details
call_tool_chain({
  code: `await github.github.create_pull_request({
    owner: 'owner',
    repo: 'repo',
    title: 'feat(auth): add OAuth2 login',
    head: 'feature/oauth',
    base: 'main',
    body: '## Summary\\n- Implements OAuth2 flow\\n- Adds token management'
  })`
})

// Get issue details
call_tool_chain({
  code: `await github.github.get_issue({
    owner: 'owner',
    repo: 'repo',
    issue_number: 123
  })`
})

// Get files changed in PR
call_tool_chain({
  code: `await github.github.get_pull_request_files({
    owner: 'owner',
    repo: 'repo',
    pull_number: 42
  })`
})

// Get PR status checks
call_tool_chain({
  code: `await github.github.get_pull_request_status({
    owner: 'owner',
    repo: 'repo',
    pull_number: 42
  })`
})
```

**Best Practice**: Prefer local `git` commands for local operations (faster, offline-capable). Use GitHub MCP for remote state queries and collaboration features.

### Error Handling

#### Failed PR Creation

```typescript
// Handle PR creation failures
call_tool_chain({
  code: `
    try {
      const result = await github.github.create_pull_request({
        owner: 'owner',
        repo: 'repo',
        title: 'feat: new feature',
        head: 'feature-branch',
        base: 'main',
        body: 'Description'
      });
      return result;
    } catch (error) {
      // Common errors:
      // - 422: Branch doesn't exist or no commits between branches
      // - 403: Insufficient permissions
      // - 404: Repository not found
      return { error: error.message };
    }
  `
})
```

#### Merge Conflicts

```typescript
// Check for merge conflicts before merging
call_tool_chain({
  code: `
    const pr = await github.github.get_pull_request({
      owner: 'owner',
      repo: 'repo',
      pull_number: 42
    });

    if (pr.mergeable === false) {
      console.log('Merge conflict detected. Resolve before merging.');
      // Option 1: Update branch from base
      await github.github.update_pull_request_branch({
        owner: 'owner',
        repo: 'repo',
        pull_number: 42
      });
      // Option 2: Resolve conflicts locally
      // git fetch origin main && git merge origin/main
    }
    return pr;
  `
})
```

---

## 8. 📦 REFERENCES

### Core Workflows
| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [worktree_workflows.md](references/worktree_workflows.md) | 7-step workspace creation | Directory selection, branch strategies |
| [commit_workflows.md](references/commit_workflows.md) | 6-step commit workflow | Artifact filtering, Conventional Commits |
| [finish_workflows.md](references/finish_workflows.md) | 5-step completion flow | PR creation, cleanup, merge |
| [shared_patterns.md](references/shared_patterns.md) | Reusable git patterns | Error recovery, conflict resolution |
| [quick_reference.md](references/quick_reference.md) | Command cheat sheet | Common operations |

### Assets
| Asset | Purpose | Usage |
|-------|---------|-------|
| [worktree_checklist.md](assets/worktree_checklist.md) | Worktree creation checklist | Pre-flight verification |
| [commit_message_template.md](assets/commit_message_template.md) | Commit format guide | Conventional Commits |
| [pr_template.md](assets/pr_template.md) | PR description template | Consistent PR format |

---

## 9. 🚨 WORKSPACE CHOICE ENFORCEMENT

**MANDATORY**: The AI must NEVER autonomously decide between creating a branch or worktree.

### Enforcement (Manual)

The AI must follow this workflow manually and ask the user before proceeding with any git workspace operations.

When git workspace triggers are detected (new feature, create branch, worktree, etc.), the **AI MUST ask** the user to explicitly choose:

| Option                        | Description                              | Best For                        |
| ----------------------------- | ---------------------------------------- | ------------------------------- |
| **A) Create a new branch**    | Standard branch on current repo          | Quick fixes, small changes      |
| **B) Create a git worktree**  | Isolated workspace in separate directory | Parallel work, complex features |
| **C) Work on current branch** | No new branch created                    | Trivial changes, exploration    |

### AI Behavior Requirements

1. **ASK** user for workspace choice before proceeding with git work
2. **WAIT** for explicit user selection (A/B/C)
3. **NEVER** assume which workspace strategy the user wants
4. **RESPECT** the user's choice throughout the workflow
5. If user has already answered this session, reuse their preference

### Override Phrases

Power users can state preference explicitly:
- `"use branch"` / `"create branch"` → Branch selected
- `"use worktree"` / `"in a worktree"` → Worktree selected
- `"current branch"` / `"on this branch"` → Current branch selected

### Session Persistence

Once user chooses, reuse their preference for the session unless:
- User explicitly requests a different strategy
- User starts a new conversation

---

## 10. 🗺️ SKILL SELECTION DECISION TREE

**What are you doing?**

### Workspace Setup (Phase 1)
- **Starting new feature/fix?** → **git-worktrees**
  - Need isolated workspace for parallel work
  - Want clean separation from other branches
  - Avoid branch juggling and stash chaos
  - **See**: [worktree_workflows.md](./references/worktree_workflows.md) for complete 7-step workflow
- **Quick fix on current branch?** → Skip to Phase 2 (commit directly)

### Work & Commit (Phase 2)
- **Ready to commit changes?** → **git-commit**
  - Analyze what changed (filter artifacts)
  - Determine single vs. multiple commits
  - Write Conventional Commits messages
  - Stage only public-value files
  - **See**: [commit_workflows.md](./references/commit_workflows.md) for complete 6-step workflow
  - **Templates**: [commit_message_template.md](./assets/commit_message_template.md)
- **No changes yet?** → Continue coding, return when ready

### Complete & Integrate (Phase 3)
- **Tests pass, ready to integrate?** → **git-finish**
  - Choose: Merge locally, Create PR, Keep as-is, or Discard
  - Cleanup worktree (if used)
  - Verify final integration
  - **See**: [finish_workflows.md](./references/finish_workflows.md) for complete 5-step workflow
  - **Templates**: [pr_template.md](./assets/pr_template.md)
- **Tests failing?** → Return to Phase 2 (fix and commit)

### Common Workflows

**Full Workflow** (new feature):
```
git-worktrees (create workspace) → Code → git-commit (commit changes) → git-finish (integrate)
```

**Quick Fix** (current branch):
```
Code → git-commit (commit fix) → git-finish (integrate)
```

**Parallel Work** (multiple features):
```
git-worktrees (feature A) → Code → git-commit
git-worktrees (feature B) → Code → git-commit
git-finish (feature A) → git-finish (feature B)
```

---

## 11. 💡 INTEGRATION EXAMPLES

### Example 1: New Authentication Feature

**Flow**:
1. **Setup**: git-worktrees → `.worktrees/auth-feature` with `temp/auth`
2. **Work**: Code OAuth2 flow → Run tests
3. **Commit**: git-commit → Stage auth files → `feat(auth): add OAuth2 login flow`
4. **Complete**: git-finish → Merge to main → Tests pass → Cleanup worktree
5. **Result**: ✅ Feature integrated, clean history, workspace removed

### Example 2: Quick Hotfix

**Flow**:
1. **Work**: Fix null reference bug on current branch
2. **Commit**: git-commit → Filter coverage reports → `fix(api): handle null user response`
3. **Complete**: git-finish → Create PR → Link to issue #123
4. **Result**: ✅ PR created with descriptive commit, ready for review

### Example 3: Parallel Features

**Flow**:
1. **Setup A**: git-worktrees → `.worktrees/feature-a`
2. **Setup B**: git-worktrees → `.worktrees/feature-b`
3. **Work**: Switch between terminals, code both features
4. **Commit A**: cd feature-a → git-commit → `feat(search): add filters`
5. **Commit B**: cd feature-b → git-commit → `feat(export): add CSV export`
6. **Complete A**: git-finish → Merge A
7. **Complete B**: git-finish → Merge B
8. **Result**: ✅ Two features developed in parallel, integrated sequentially

---

## 12. 🔗 RELATED RESOURCES

**For one-page cheat sheet**: See [quick_reference.md](./references/quick_reference.md)

**Git Workflow Principles**:
```
ISOLATION: Use worktrees for parallel work
CLARITY: Write conventional commits with clear descriptions
QUALITY: Run tests before integration (git-finish gate)
CLEANUP: Remove worktrees after completion
```

**Remember**: This skill orchestrates three specialized workflows - Worktree Management, Commit Hygiene, and Work Completion. All integrate seamlessly for a professional git development lifecycle.