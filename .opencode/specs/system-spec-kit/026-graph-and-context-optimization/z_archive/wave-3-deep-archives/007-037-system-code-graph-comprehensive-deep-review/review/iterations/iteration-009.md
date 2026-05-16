# Iteration 009 — system-code-graph: code_graph_status + readiness-contract.ts semantics (live/stale/absent/unavailable TrustState)

## Summary

Found 3 findings at P1 severity (1 semantic inconsistency, 1 type inconsistency, 1 scope path error) and 1 finding at P2 severity (documentation gap). The primary issue is semantic inconsistency between `GoldVerificationTrust` and the canonical `SharedPayloadTrustState` mapping, where the 3-state gold verification type cannot represent 'unavailable' state that the main trustState uses for 'error' freshness.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts` (lines read: 389)
- `.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts` (lines read: 249)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 001 | status.ts:167-169 | `getGoldVerificationTrust` returns 'stale' for all non-fresh freshness values, but the main trustState mapping returns 'absent' for 'empty' freshness and 'unavailable' for 'error' freshness | Creates semantic inconsistency between trustState and goldVerificationTrust fields in status response. When freshness='empty', trustState='absent' but goldVerificationTrust='stale'; when freshness='error', trustState='unavailable' but goldVerificationTrust='stale' | Either align gold verification logic with the canonical mapping, or document why gold verification uses different semantics |
| 002 | status.ts:29 | `GoldVerificationTrust` type is defined as 3-state ('live' | 'stale' | 'absent') but cannot represent 'unavailable' state that the canonical `SharedPayloadTrustState` uses for 'error' freshness | Type system inconsistency: the gold verification type is too narrow to represent all states that the main trustState can emit, making it impossible to correctly map 'error' freshness cases | Add 'unavailable' to GoldVerificationTrust union to align with SharedPayloadTrustState subset used by code-graph |
| 003 | readiness-contract.ts (scope path) | Iteration scope specified `.opencode/skills/system-code-graph/lib/readiness-contract.ts` but actual file is at `.opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts` | Scope path error causes confusion - the expected surface path was incorrect, though the correct file was found via glob search | Update iteration scope specifications to use correct mcp_server/lib/ path prefix |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| 004 | status.ts:29 | `GoldVerificationTrust` type has no documentation explaining its semantics or how it differs from the canonical `SharedPayloadTrustState` | Makes it unclear to maintainers why this separate 3-state type exists and what its intended semantics are versus the main trustState field | Add JSDoc comment explaining GoldVerificationTrust purpose, semantics, and relationship to SharedPayloadTrustState |

## Convergence Signal

newInfoRatio 0.75 vs prior iterations (this iteration focused on a specific semantic contract area not covered in prior iterations)
