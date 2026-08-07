# sk-doc Audit Target List

Packet: `037/004-sk-doc-template-alignment`

## Discovery

Requested broad discovery command:

```bash
git --no-pager diff --name-only $(git --no-pager log --grep '026/031\|026/032\|026/033\|026/034\|026/035\|026/036' --format='%H' | tail -1)~1 HEAD -- '*.md' '*.txt' | sort -u
```

The broad command returned 131 paths in this worktree because `HEAD` includes unrelated later docs. To honor the packet constraint, the active audit scope uses files changed by commits whose subjects match `026/031` through `026/036`.

## Active Scope

Files audited: 63

```text
.opencode/commands/memory/manage.md
.opencode/skills/system-spec-kit/ARCHITECTURE.md
.opencode/skills/system-spec-kit/SKILL.md
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md
.opencode/skills/system-spec-kit/mcp_server/README.md
.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md
.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/README.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F1-spec-folder.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F10-deep-loop.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F11-hooks.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F12-validators.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F13-stress-cycle.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F14-search-w3-w13.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F2-skill-advisor.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F3-memory-search.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F4-memory-context.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F5-code-graph-query.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F6-code-graph-scan.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F7-causal-graph.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F8-cocoindex.md
.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F9-continuity.md
.opencode/skills/system-spec-kit/references/config/hook_system.md
.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-documentation-truth-validation/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-documentation-truth-validation/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-documentation-truth-validation/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-documentation-truth-validation/research/prompts/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-documentation-truth-validation/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-documentation-truth-validation/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-code-graph-watcher-claim-retraction/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-code-graph-watcher-claim-retraction/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-code-graph-watcher-claim-retraction/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-code-graph-watcher-claim-retraction/research/prompts/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-code-graph-watcher-claim-retraction/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-code-graph-watcher-claim-retraction/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-memory-retention-policy-sweep/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-memory-retention-policy-sweep/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-memory-retention-policy-sweep/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-memory-retention-policy-sweep/research/prompts/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-memory-retention-policy-sweep/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-memory-retention-policy-sweep/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-half-auto-upgrade-doc-alignment/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-half-auto-upgrade-doc-alignment/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-half-auto-upgrade-doc-alignment/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-half-auto-upgrade-doc-alignment/research/prompts/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-half-auto-upgrade-doc-alignment/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-half-auto-upgrade-doc-alignment/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/findings.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/research/iterations/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/research/prompts/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-cli-matrix-adapter-runners/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-cli-matrix-adapter-runners/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-cli-matrix-adapter-runners/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-cli-matrix-adapter-runners/research/prompts/iteration-001.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-cli-matrix-adapter-runners/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-cli-matrix-adapter-runners/tasks.md
AGENTS.md
```
