---
name: sk-git
description: "Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion across git-worktrees, git-commit, and git-finish skills"
allowed-tools: [Read, Bash, mcp__code_mode__call_tool_chain]
argument-hint: "[worktree|commit|finish]"
version: 1.0.8.0
---

# Git Workflows - Skill Graph

Orchestrates the full git development lifecycle — from workspace setup through clean commits to PR creation and branch cleanup — using structured, phase-driven workflows.

> **Navigation note:** This is a supplemental deep-dive index. `SKILL.md` remains the primary entrypoint for activation rules, routing logic, and core behavior. Use this index for focused content on specific topics.

## Map of Content (MOC)

### Foundation
- [[nodes/when-to-use|When to Use]] — Activation triggers, use cases, and when NOT to use the sk-git skill.
- [[nodes/rules|Rules]] — ALWAYS/NEVER/ESCALATE rules governing git workflow behavior.
- [[nodes/success-criteria|Success Criteria]] — Completion gates and quality checks for workspace setup, commits, and integration.

### Workflow
- [[nodes/how-it-works|How It Works]] — Core git development lifecycle: workspace setup, commit, and integration phases.
- [[nodes/workspace-setup|Workspace Setup]] — Git worktree setup, workspace choice enforcement, and branch management.
- [[nodes/commit-workflow|Commit Workflow]] — Commit creation process: staging, artifact filtering, and Conventional Commits formatting.
- [[nodes/work-completion|Work Completion]] — PR creation, branch cleanup, merge strategies, and finish workflow.

### Routing & Integration
- [[nodes/smart-routing|Smart Routing]] — Intent routing logic with weighted scoring, resource loading levels, and disambiguation.
- [[nodes/github-integration|GitHub Integration]] — GitHub MCP integration for remote operations: PRs, issues, CI/CD, and repository management.
