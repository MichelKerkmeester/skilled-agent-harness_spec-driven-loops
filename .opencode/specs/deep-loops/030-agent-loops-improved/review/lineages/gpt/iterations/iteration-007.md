# Iteration 007: Security Replay

## Focus

Replay prior OpenCode detached-lineage permission-boundary concerns against current fan-out code.

## Findings

No new finding. Current `fanout-run.cjs` only inserts `--dangerously-skip-permissions` when `resolvedSandbox === 'danger-full-access'`, and the nearby comment states workspace-write/read-only lineages run without that bypass.

## Evidence

- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1268`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1282`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1288`
- `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:50`

Review verdict: PASS
