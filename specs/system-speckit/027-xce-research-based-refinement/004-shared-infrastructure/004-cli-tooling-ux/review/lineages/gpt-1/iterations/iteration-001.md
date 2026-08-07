# Iteration 1: Correctness

## Focus
Correctness review of the daemon CLI shims, freshness hash path, offline smoke wrapper, and list-tools/compact/completion source paths.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings

No correctness findings. The source reads support the child claims that the three shims gate on source hashes, `spec-memory` build finalization writes the source hash, and compact/names-only list-tools output is generated from the in-process tool registries. [SOURCE: .opencode/bin/spec-memory.cjs:31-75] [SOURCE: .opencode/bin/code-index.cjs:31-79] [SOURCE: .opencode/bin/skill-advisor.cjs:52-96] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs:68-90] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:536-575] [SOURCE: .opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:615-655] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts:755-793]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `.opencode/bin/spec-memory.cjs:31-75`, `.opencode/bin/cli-offline-smoke.cjs:51-90` | Correctness claims for hash freshness and offline smoke have direct source support. |

## Assessment
- New findings ratio: 0.0
- Dimensions addressed: correctness
- Novelty justification: No new defect pattern found in the reviewed CLI execution paths.

## Ruled Out
- Tool-count coverage bug: child spec explicitly scoped coverage out, and local registry-backed list rendering retains count fields. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/spec.md:93-96]

## Dead Ends
- Code graph structural analysis: graph readiness is stale, so the review used direct source reads.

## Recommended Next Focus
Security review of prompt-time fallback guards, retryability envelopes, and stderr sanitization.
Review verdict: PASS
