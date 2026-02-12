# Changelog - workflows-git

All notable changes to the workflows-git skill are documented in this file.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)

---

## [**1.5.1**] - 2026-02-12

### Added

**Frontmatter Audit**

- Added `argument-hint: "[worktree|commit|finish]"` to SKILL.md frontmatter for improved user discoverability

---

## [**1.5.0**] - 2026-01-14

Full Git workflow orchestrator for complete development lifecycle.

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

Initial release of workflows-git skill for Git operations.

---

### Features

1. **Git Operations**:
   - Branch management (create, switch, delete)
   - Commit workflows with message conventions
   - Merge and rebase strategies
   - Stash management
   - Remote operations (push, pull, fetch)

2. **GitHub Integration** (via GitHub CLI or MCP):
   - Pull request creation and review
   - Issue management
   - Repository operations
   - Actions workflow monitoring

3. **Worktree Management**:
   - Parallel branch development
   - Isolated workspace setup
   - Branch switching without stashing

4. **Conventional Commits**:
   - Type prefixes (feat, fix, docs, style, refactor, test, chore)
   - Scope guidance
   - Breaking change notation

### Documentation (10 files)

- `SKILL.md` — AI agent instructions with workflow routing
- `CHANGELOG.md` — Version history
- `references/commit_workflows.md` — Commit conventions and workflows
- `references/quick_reference.md` — Quick command reference
- `references/finish_workflows.md` — Branch integration and PR workflows
- `references/worktree_workflows.md` — Worktree management patterns
- `references/shared_patterns.md` — GitHub MCP and shared patterns
- `assets/pr_template.md` — Pull request template
- `assets/commit_message_template.md` — Commit message template
- `assets/worktree_checklist.md` — Worktree setup checklist

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
