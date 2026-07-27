# Deep Research Dashboard - GLM Lineage

## Iteration Table
| run | focus | newInfoRatio | findings count | status |
|-----|-------|-------------|----------------|--------|
| 1 | Physical topology and raw occurrence baseline | 1.0 | 7 | complete |
| 2 | Runtime registrations, launchers, plugins, install surfaces | 0.92 | 8 | complete |
| 3 | External executable dependencies and shared contracts | 0.88 | 10 | complete |
| 4 | Hooks, lifecycle automation, CI, session reapers, /doctor | 0.85 | 10 | complete |
| 5 | Doctrine, doc references, agent tree, ordering graph | 0.80 | 7 | complete |

## Question Status
5/5 answered (100%)
- [x] q1: Live runtime registrations — 3 confirmed
- [x] q2: Imports, shell-outs, executable dependencies — full chain mapped
- [x] q3: Hooks, plugins, CI jobs, session reapers — all confirmed
- [x] q4: Doctrine claims, doc references, agent tool grants — 32 agents + 11 commands + root docs
- [x] q5: Ordering constraints and rollback risk — 11-phase graph + 19 recommendations

## Trend
Last 3 newInfoRatio: 0.88 → 0.85 → 0.80 (descending — inventory saturating)

## Dead Ends
- .github/hooks/scripts/session-start.sh — no code-graph refs
- Explicit plugin registration in opencode.json — none exists (auto-discovered)

## Next Focus
Synthesis complete. No further iterations.

## Active Risks
- Shared launcher infra (launcher-ipc-bridge.cjs, launcher-session-proxy.cjs) — HIGH risk if deleted wholesale
- shared/code-graph-contracts.ts — may have surviving spec-kit importers
- Skill directory deletion — irreversible; must be last step
