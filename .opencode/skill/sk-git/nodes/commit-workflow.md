---
description: "Commit creation process: staging, artifact filtering, Conventional Commits formatting, and merge-conflict recovery with validation context"
---
# Commit Workflow

Guidance on creating clean, well-formatted commits following Conventional Commits conventions.

## Commit Process

The 6-step commit workflow is detailed in [commit_workflows.md](../references/commit_workflows.md).

Key steps:
1. Analyze what changed
2. Filter out artifacts (build files, coverage reports, etc.)
3. Categorize changes
4. Determine single vs. multiple commits
5. Write Conventional Commits message
6. Stage only public-value files

## Conventional Commits Format

All commits must follow the `type(scope): description` pattern.

Common types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `refactor` - Code restructuring without behavior change
- `test` - Adding or updating tests
- `chore` - Build, CI, or tooling changes

For full format details, see [commit_message_template.md](../assets/commit_message_template.md).

## Artifact Filtering

Before staging, exclude:
- Build output directories
- Coverage reports
- IDE configuration files
- OS-generated files (`.DS_Store`, `Thumbs.db`)
- Dependencies (`node_modules/`, `vendor/`)

## Commit Quality Checks

- All changes reviewed and categorized
- Artifacts filtered out
- Commit message follows Conventional Commits format
- Only public-value files staged
- Spec folder referenced in commit body when applicable

## Cross References

- [[rules]] - Commit formatting rules (ALWAYS section)
- [[success-criteria]] - Pre-commit quality gate
- [[how-it-works]] - Phase 2 in the lifecycle
- [Validation Workflow](../../system-spec-kit/nodes/validation-workflow.md) - Spec quality and completion verification gates
- [OpenCode Quick Reference](../../sk-code--opencode/nodes/quick-reference.md) - Code/config standards linked to commit quality
