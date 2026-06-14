# Iteration 2: Security

## Focus
Reviewed the prompt-time spec-memory bridge allowlist added for defense in depth.

## Scorecard
- Dimensions covered: security
- Files reviewed: 1
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- None.

### P2, Suggestion
- **F002**: spec-memory bridge allowlist validates requests and tools independently instead of allowed route pairs, `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:18-19`, `:221-227`, `:347-356`. The bridge defines allowed requests and allowed tools as separate sets, so a direct caller can combine `request=status` with `toolName=session_resume` or `request=brief` with `toolName=memory_health`. Both tools are prompt-safe reads, so this is not a blocker, but it is looser than the documented exact plugin routes.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | partial | hard | `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:347-356` | Allowlist exists but is not pair-exact. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: security
- Novelty justification: Found one prompt-safe policy tightening opportunity.

## Ruled Out
- P1 classification: the accepted tools remain `session_resume` and `memory_health`, not mutation tools.

## Dead Ends
- No additional arbitrary toolName bypass was found; out-of-set tools are rejected before warm probing.

## Recommended Next Focus
Run traceability against child phase specs and playbooks.

Review verdict: PASS
