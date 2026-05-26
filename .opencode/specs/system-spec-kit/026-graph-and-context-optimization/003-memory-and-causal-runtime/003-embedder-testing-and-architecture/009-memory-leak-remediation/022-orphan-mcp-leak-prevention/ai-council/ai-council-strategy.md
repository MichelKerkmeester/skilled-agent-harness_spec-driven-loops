# AI Council Strategy: Orphan MCP Leak Prevention Review

## Purpose

Comprehensive post-implementation review of the orphan MCP leak prevention packet (022) implemented by Codex. The council evaluates scope coherence, implementation fidelity, safety holes, operator usability, and rollout readiness.

## Task Framing

Review the full packet implementation: sweeper script, Claude Stop hook cleanup, MCP idle self-exit, LaunchAgent template, operator runbook, and spec documentation. Confirm that the implementation matches the spec, identify any P0/P1 findings, and recommend next validation steps before real LaunchAgent activation or sweeper use.

## Selected Lenses

| Seat | Lens | Vantage Target | Mandate |
|------|------|----------------|---------|
| Seat 001 | Analytical | Inline OpenCode (deepseek-v4-pro) | Check scope coherence, implementation architecture, and whether packet documents what actually shipped. |
| Seat 002 | Critical | Inline OpenCode (deepseek-v4-pro) | Hunt for safety holes, false preserve assumptions, mutation risks, stale rollout claims, and missing tests. |
| Seat 003 | Pragmatic | Inline OpenCode (deepseek-v4-pro) | Judge operator usability, rollout readiness, and the next best validation path. |

## Evidence Inputs

16 context files loaded (see council state log for full inventory). Key evidence includes:
- Full spec/plan/tasks/checklist/decision-record/implementation-summary (6 docs)
- Sweeper script (491 lines), Claude cleanup script (91 lines), LaunchAgent plist (21 lines)
- Claude settings.local.json (80 lines)
- Three launcher-idle-timeout.ts implementations (139 lines each)
- Scripts README, ENV reference

## Convergence Rule

Default: two-of-three-agree. If 2 of 3 seats endorse the same plan and the cross-critique round produces no new high-severity findings, declare convergence.

## Known Constraints

- Planning/review only. No implementation file modification.
- No LaunchAgent installation or launchctl commands.
- No destructive process cleanup.
- Writes only under ai-council/** subtree.
- External CLI vantages are simulated (all seats ran inline in OpenCode).
