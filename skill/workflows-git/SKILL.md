---
name: workflows-git
description: "Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion across git-worktrees, git-commit, and git-finish skills"
allowed-tools: [Read, Bash, mcp-code-mode]
version: 1.5.0
---

<!-- Keywords: git-workflow, git-worktree, conventional-commits, branch-management, pull-request, commit-hygiene, workspace-isolation, version-control, github, issues, pr-review -->

# Git Workflows - Git Development Orchestrator

> Unified workflow guidance across workspace isolation, commit hygiene, and work completion.

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

## 1.1 🐙 GITHUB MCP INTEGRATION (REMOTE)

**GitHub MCP Server** provides programmatic access to GitHub's remote operations via Code Mode (`call_tool_chain`).

### Prerequisites

- **PAT configured** in `.utcp_config.json` with appropriate scopes (repo, issues, pull_requests)

### When to Use GitHub MCP vs Local Git vs gh CLI

| Operation | Tool | Rationale |
| :--- | :--- | :--- |
| commit, diff, status, log, merge | Local `git` (Bash) | Faster, no network required |
| worktree management | Local `git` (Bash) | Local filesystem operation |
| Create/list PRs | `gh` CLI OR GitHub MCP | Both work; gh CLI simpler for basic ops |
| PR reviews, comments | GitHub MCP | Richer API for review workflows |
| Issue management | GitHub MCP | Full CRUD on issues |
| CI/CD status, logs | GitHub MCP | Access workflow runs and job logs |
| Search repos/code remotely | GitHub MCP | Cross-repo searches |

### Available Tools (Code Mode Access)

**Access Pattern:** `github.github_{tool_name}({...})`

| Category | Tools | Description |
| :--- | :--- | :--- |
| **Pull Requests** | `github_create_pull_request`<br>`github_list_pull_requests`<br>`github_get_pull_request`<br>`github_merge_pull_request`<br>`github_create_pull_request_review`<br>`github_add_pull_request_review_comment`<br>`github_get_pull_request_files`<br>`github_get_pull_request_status`<br>`github_update_pull_request_branch`<br>`github_get_pull_request_comments`<br>`github_get_pull_request_reviews` | Create, list, merge PRs; add reviews and comments; get files, status, and reviews |
| **Issues** | `github_create_issue`<br>`github_get_issue`<br>`github_list_issues`<br>`github_search_issues`<br>`github_add_issue_comment`<br>`github_update_issue` | Full issue lifecycle management |
| **Repository** | `github_get_file_contents`<br>`github_create_branch`<br>`github_list_branches`<br>`github_search_repositories`<br>`github_list_commits` | Read files, manage branches, search |
| **CI/CD** | `github_list_workflow_runs`<br>`github_get_workflow_run`<br>`github_get_job_logs` | Monitor CI status, debug failures |

### Usage Examples

```javascript
// List open PRs
call_tool_chain(`github.github_list_pull_requests({
  owner: 'owner',
  repo: 'repo',
  state: 'open'
})`)

// Create PR with full details
call_tool_chain(`github.github_create_pull_request({
  owner: 'owner',
  repo: 'repo',
  title: 'feat(auth): add OAuth2 login',
  head: 'feature/oauth',
  base: 'main',
  body: '## Summary\\n- Implements OAuth2 flow\\n- Adds token management'
})`)

// Get issue details
call_tool_chain(`github.github_get_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123
})`)

// Check CI workflow status
call_tool_chain(`github.github_list_workflow_runs({
  owner: 'owner',
  repo: 'repo',
  branch: 'main'
})`)

// Add PR review comment
call_tool_chain(`github.github_add_pull_request_review_comment({
  owner: 'owner',
  repo: 'repo',
  pull_number: 42,
  body: 'Consider extracting this to a helper function',
  commit_id: 'abc123',
  path: 'src/auth.js',
  line: 25
})`)

// Get files changed in PR
call_tool_chain(`github.github_get_pull_request_files({
  owner: 'owner',
  repo: 'repo',
  pull_number: 42
})`)

// Get PR status checks
call_tool_chain(`github.github_get_pull_request_status({
  owner: 'owner',
  repo: 'repo',
  pull_number: 42
})`)
```

**Best Practice**: Prefer local `git` commands for local operations (faster, offline-capable). Use GitHub MCP for remote state queries and collaboration features.

### Error Handling

#### Failed PR Creation

```javascript
// Handle PR creation failures
try {
  const result = await call_tool_chain(`github.github_create_pull_request({
    owner: 'owner',
    repo: 'repo',
    title: 'feat: new feature',
    head: 'feature-branch',
    base: 'main',
    body: 'Description'
  })`);
} catch (error) {
  // Common errors:
  // - 422: Branch doesn't exist or no commits between branches
  // - 403: Insufficient permissions
  // - 404: Repository not found
  console.error('PR creation failed:', error.message);
}
```

#### Merge Conflicts

```javascript
// Check for merge conflicts before merging
const pr = await call_tool_chain(`github.github_get_pull_request({
  owner: 'owner',
  repo: 'repo',
  pull_number: 42
})`);

if (pr.mergeable === false) {
  console.log('Merge conflict detected. Resolve before merging.');
  // Option 1: Update branch from base
  await call_tool_chain(`github.github_update_pull_request_branch({
    owner: 'owner',
    repo: 'repo',
    pull_number: 42
  })`);
  // Option 2: Resolve conflicts locally
  // git fetch origin main && git merge origin/main
}
```

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

## 3. 🚨 WORKSPACE CHOICE ENFORCEMENT

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

## 4. 🛠️ HOW TO USE

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

## 5. 🗺️ SKILL SELECTION DECISION TREE

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

## 6. 💡 INTEGRATION EXAMPLES

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

## 7. ⚡ QUICK REFERENCE

**For one-page cheat sheet**: See [quick_reference.md](./references/quick_reference.md)

**Git Workflow Principles**:
```
ISOLATION: Use worktrees for parallel work
CLARITY: Write conventional commits with clear descriptions
QUALITY: Run tests before integration (git-finish gate)
CLEANUP: Remove worktrees after completion
```

**Remember**: This skill orchestrates three specialized workflows - Worktree Management, Commit Hygiene, and Work Completion. All integrate seamlessly for a professional git development lifecycle.