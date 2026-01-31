# Changelog - workflows-git

All notable changes to the workflows-git skill are documented in this file.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)

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

### Documentation

- `SKILL.md` — AI agent instructions with workflow routing
- `README.md` — User documentation with command reference
- `references/commit_conventions.md` — Conventional commit guide
- `references/branch_strategies.md` — Branching patterns
- `assets/pr_template.md` — Pull request template

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
