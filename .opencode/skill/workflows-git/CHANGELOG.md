# Changelog - workflows-git

All notable changes to the workflows-git skill.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)

---

## [**1.5.1**] - 2026-02-12

Added **frontmatter argument hint** for improved user discoverability.

---

### New

1. **Frontmatter argument hint** — Added `argument-hint: "[worktree|commit|finish]"` to SKILL.md frontmatter

---

## [**1.5.0**] - 2026-01-14

Full Git workflow orchestrator for **complete development lifecycle**.

---

### New

1. **Workspace Setup** — Git worktrees guidance for parallel development
2. **Commit Workflows** — Conventional commit conventions with staging patterns
3. **Work Completion** — Branch integration and merge workflows
4. **Pull Request Creation** — PR templates and review request patterns
5. **GitHub Issue Integration** — Issue linking and status updates
6. **Gate 3 Integration** — Memory system integration examples

---

### Fixed

1. **GitHub MCP Naming** — Fixed 7 naming patterns (underscore → dot notation for Code Mode)

---

## [**1.0.0.0**] - 2025-12-20

Initial release of workflows-git skill for **Git operations**.

---

### New

1. **Git Operations** — Branch management (create, switch, delete), commit workflows with message conventions, merge and rebase strategies, stash management, remote operations (push, pull, fetch)

2. **GitHub Integration** — Pull request creation and review, issue management, repository operations, Actions workflow monitoring (via GitHub CLI or MCP)

3. **Worktree Management** — Parallel branch development, isolated workspace setup, branch switching without stashing

4. **Conventional Commits** — Type prefixes (feat, fix, docs, style, refactor, test, chore), scope guidance, breaking change notation

5. **Documentation (10 files)** — `SKILL.md` (AI agent instructions with workflow routing), `CHANGELOG.md` (version history), `references/commit_workflows.md` (commit conventions), `references/quick_reference.md` (quick command reference), `references/finish_workflows.md` (branch integration and PR workflows), `references/worktree_workflows.md` (worktree management patterns), `references/shared_patterns.md` (GitHub MCP and shared patterns), `assets/pr_template.md` (pull request template), `assets/commit_message_template.md` (commit message template), `assets/worktree_checklist.md` (worktree setup checklist)

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
