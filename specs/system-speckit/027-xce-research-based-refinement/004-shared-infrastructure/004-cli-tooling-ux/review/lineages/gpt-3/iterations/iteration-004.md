# Iteration 4: Maintainability - CLI UX Consistency

## Focus
- Dimension: maintainability
- Scope: command alias/help/list-tools implementation, completion generation, and bridge allowlist tests.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- None.

### P2, Suggestion
- **F002**: Spec-memory bridge allowlist permits cross-paired request/tool combinations, `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:18`, `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:347`, `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-bridge-allowlist.vitest.ts:21`. The policy checks request membership and tool membership independently, so `status` plus `session_resume` and `brief` plus `memory_health` are allowed even though tests only cover the intended pairs. Both tools are read-only, so this is a defense-in-depth advisory rather than a release blocker.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| maintainability_policy | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:347` | Exact-pair mapping would be clearer and easier to test. |

## Assessment
- Compact/names-only output and completion generation are implemented consistently across all three CLIs.
- The bridge policy would be clearer as exact request-to-tool pairs.

## Ruled Out
- Completion drift: ruled out by manifest-sourced completion word generation in all three CLIs.

## Dead Ends
- None.

## Recommended Next Focus
Stabilization pass over compact output, per-command help, unknown-command suggestions, and docs.

Review verdict: PASS
