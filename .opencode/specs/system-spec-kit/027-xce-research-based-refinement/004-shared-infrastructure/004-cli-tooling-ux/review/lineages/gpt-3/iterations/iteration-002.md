# Iteration 2: Security - Prompt-Time Daemon Policy

## Focus
- Dimension: security
- Scope: prompt-time fallback helpers, bridge allowlist, trusted mutation gating, and warm-only daemon behavior.

## Scorecard
- Dimensions covered: security
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Findings

### P0, Blocker
- None.

### P1, Required
- None.

### P2, Suggestion
- No new P2 security findings. F001 remains an advisory correctness finding.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| security_prompt_time | pass | advisory | `.opencode/skills/system-spec-kit/mcp_server/hooks/spec-memory-cli-fallback.ts:147`; `.opencode/skills/system-spec-kit/mcp_server/hooks/code-index-cli-fallback.ts:150`; `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:509` | Warm daemon probes precede CLI fallback dispatch. |
| trusted_mutation | pass | advisory | `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts:659` | Advisor mutation commands require trusted caller state. |

## Assessment
- No evidence of prompt-time cold spawn or direct mutation exposure was found.
- The spec-memory bridge only allows read-oriented tool names, so no P0/P1 security issue was recorded.

## Ruled Out
- Mutation through spec-memory prompt bridge: rejected because `PROMPT_SAFE_TOOLS` contains `session_resume` and `memory_health` only.

## Dead Ends
- None.

## Recommended Next Focus
Traceability pass across parent/child specs, implementation summaries, and CLI reference docs.

Review verdict: PASS
