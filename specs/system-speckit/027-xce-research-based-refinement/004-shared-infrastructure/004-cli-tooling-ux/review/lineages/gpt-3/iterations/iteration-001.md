# Iteration 1: Correctness - Freshness Shims and Offline Smoke

## Focus
- Dimension: correctness
- Scope: freshness shims, source-hash logic, smoke command, and build metadata paths.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 7
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- None.

### P2, Suggestion
- **F001**: Code-index and skill-advisor hash gates lack build-time fingerprint persistence, `.opencode/bin/code-index.cjs:51`, `.opencode/bin/skill-advisor.cjs:72`, `.opencode/skills/system-code-graph/package.json:7`, `.opencode/skills/system-skill-advisor/mcp_server/package.json:7`, `.opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs:68`. The code-index and skill-advisor shims write source-hash state only at runtime after passing the mtime fallback, while their package builds are plain TypeScript builds. Spec-memory has a build finalizer that writes its source hash. This leaves an advisory first-run-after-build edge case for the all-three freshness-hardening claim.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | partial | hard | `.opencode/skills/system-code-graph/package.json:7` | Advisory partial for all-three freshness parity. |

## Assessment
- Novelty justification: one advisory edge case found by comparing shim write paths against build scripts.
- No P0/P1 correctness issue found.

## Ruled Out
- Full stale-dist failure for spec-memory: ruled out because spec-memory build runs `finalize-dist.mjs` and writes source hash metadata.

## Dead Ends
- Running offline smoke was skipped because the shims can write freshness metadata outside the allowed lineage directory.

## Recommended Next Focus
Security review of warm-only fallbacks and trusted mutation boundaries.

Review verdict: PASS
