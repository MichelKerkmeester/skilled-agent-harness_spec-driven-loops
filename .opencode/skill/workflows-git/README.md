---
title: "workflows-git"
description: "Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion across git-worktrees, git-commit, and git-finish skills"
trigger_phrases:
  - "git workflow orchestrator"
  - "conventional commits worktree"
  - "git workspace commit finish"
importance_tier: "normal"
---

# workflows-git

> Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion across git-worktrees, git-commit, and git-finish skills.

---

#### TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [🚀 QUICK START](#2--quick-start)
3. [📁 STRUCTURE](#3--structure)
4. [⚡ FEATURES](#4--features)
5. [⚙️ CONFIGURATION](#5--configuration)
6. [💡 EXAMPLES](#6--examples)
7. [🛠️ TROUBLESHOOTING](#7--troubleshooting)
8. [📚 RELATED](#8--related)

---

## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

`workflows-git` is a unified orchestrator that manages the complete git development lifecycle through three distinct phases: workspace isolation (worktrees), commit hygiene (conventional commits), and work completion (merge/PR/cleanup). It provides smart routing to load only the resources relevant to the current phase.

Use this skill when starting new git-based work, following a complete git workflow (setup, work, complete), or when unsure which git sub-skill to invoke. It is not needed for simple one-off commands like `git status` or `git log` -- use Bash directly for those.

The skill enforces workspace choice (branch vs. worktree vs. current branch) by requiring explicit user confirmation before proceeding, preventing the AI from autonomously deciding a workspace strategy.

<!-- /ANCHOR:overview -->

---

## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

**Invoke the skill** via Gate 2 routing or directly:

```
skill_advisor.py "commit my changes" --threshold 0.8
```

**Keyword triggers:** `worktree`, `branch`, `commit`, `merge`, `pr`, `pull request`, `git workflow`, `conventional commits`, `finish work`, `github`, `issue`, `review`

**Argument hint:** `[worktree|commit|finish]`

**Typical flow:**
1. Phase 1 -- Create isolated workspace with `git-worktrees`
2. Phase 2 -- Commit changes with `git-commit` (Conventional Commits format)
3. Phase 3 -- Integrate work with `git-finish` (merge, PR, or discard)

<!-- /ANCHOR:quick-start -->

---

## 3. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
.opencode/skill/workflows-git/
├── SKILL.md                              # Entry point with routing logic
├── README.md                             # This file
├── references/
│   ├── worktree_workflows.md             # 7-step workspace creation
│   ├── commit_workflows.md               # 6-step commit workflow
│   ├── finish_workflows.md               # 5-step completion flow
│   ├── shared_patterns.md                # Reusable git patterns & commands
│   └── quick_reference.md                # One-page cheat sheet
└── assets/
    ├── worktree_checklist.md             # Worktree creation checklist
    ├── commit_message_template.md        # Conventional Commits format guide
    └── pr_template.md                    # PR description template
```

<!-- /ANCHOR:structure -->

---

## 4. ⚡ FEATURES
<!-- ANCHOR:features -->

- **3-phase lifecycle** -- Workspace Setup, Work & Commit, Complete & Integrate
- **Smart routing** -- Loads only the resources needed for the current phase
- **Workspace choice enforcement** -- Always asks user before choosing branch, worktree, or current branch
- **Conventional Commits** -- Enforces `type(scope): description` format on all commits
- **Artifact filtering** -- Excludes build files, coverage reports, and other non-public artifacts from commits
- **Quality gates** -- Pre-commit, pre-merge, pre-PR, and post-merge checkpoints
- **GitHub MCP integration** -- Programmatic access to PRs, issues, and CI/CD via Code Mode
- **Parallel work support** -- Multiple worktrees for simultaneous feature development
- **Session persistence** -- Remembers workspace preference for the duration of a session

<!-- /ANCHOR:features -->

---

## 5. ⚙️ CONFIGURATION
<!-- ANCHOR:configuration -->

**Allowed tools:** `Read`, `Bash`, `mcp__code_mode__call_tool_chain`

**GitHub MCP prerequisites:**
- PAT configured in `.utcp_config.json` with `repo`, `issues`, and `pull_requests` scopes

**Tool selection guidance:**

| Operation                  | Tool              |
|----------------------------|-------------------|
| commit, diff, status, log  | Local `git` (Bash)|
| Worktree management        | Local `git` (Bash)|
| Create/list PRs            | `gh` CLI or GitHub MCP |
| PR reviews, issue CRUD     | GitHub MCP        |

<!-- /ANCHOR:configuration -->

---

## 6. 💡 EXAMPLES
<!-- ANCHOR:examples -->

**New feature (full workflow):**
```
git-worktrees (create workspace) -> Code -> git-commit -> git-finish (merge/PR)
```

**Quick hotfix (current branch):**
```
Code -> git-commit -> git-finish (create PR, link issue)
```

**Parallel features:**
```
git-worktrees (feature A) -> Code A -> git-commit A
git-worktrees (feature B) -> Code B -> git-commit B
git-finish A -> git-finish B
```

**Commit message format:**
```
feat(auth): add OAuth2 login flow
fix(api): handle null user response
docs(readme): update installation steps
```

<!-- /ANCHOR:examples -->

---

## 7. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

| Issue | Resolution |
|-------|-----------|
| Merge conflicts can't auto-resolve | Escalate -- requires human decision on which changes to keep |
| GitHub MCP auth errors | Check PAT expiry and scopes in `.utcp_config.json` |
| Worktree directory locked/corrupted | Run `git worktree prune` for manual cleanup |
| Force push to protected branch requested | Requires explicit user approval; skill will warn |
| CI/CD pipeline fails repeatedly | May indicate infrastructure issues beyond code |
| Branch divergence exceeds 50 commits | Consider incremental merging strategy |

<!-- /ANCHOR:troubleshooting -->

---

## 8. 📚 RELATED
<!-- ANCHOR:related -->

- **AGENTS.md** -- Behavioral framework and gate definitions (Gate 2, Gate 3)
- **system-spec-kit** -- Spec folder creation and documentation workflows
- **workflows-code--web-dev** -- Code implementation lifecycle (pairs with git workflow for full dev cycle)
- **workflows-code--full-stack** -- Multi-stack implementation (stack-specific verification before git-finish)

<!-- /ANCHOR:related -->
