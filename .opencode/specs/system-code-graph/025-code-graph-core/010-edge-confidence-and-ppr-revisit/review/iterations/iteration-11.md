# Dimension

Traceability + correctness review of `ENV_REFERENCE.md` for `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`, plus stale seeded-PPR flag documentation drift after source recovery.

# Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:18` - flag convention table distinguishes strict opt-in `=== 'true'` rows from graduated rows.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:326` - edge-confidence differentiation row.
- `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:5` - edge-confidence env var constant.
- `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts:10` - edge-confidence parse check.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:138` - seeded-PPR env var constant exists in current source.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:139` - seeded-PPR accepted truthy values.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:452` - seeded-PPR parse helper.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:188` - deleted-flag inventory still says the tree no longer carries these switches.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:197` - seeded-PPR still listed as DELETE with uniform-edge rationale.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:50` - deleted-flag section still describes resolved and removed flags.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:58` - seeded-PPR still listed in deleted flags.
- `.opencode/specs/system-code-graph/025-code-graph-core/005-seeded-ppr-ranking/spec.md:50` - older correction claims the flag/symbol do not exist in current source.
- `.opencode/specs/system-code-graph/025-code-graph-core/005-seeded-ppr-ranking/spec.md:52` - newer correction explicitly says that older source-absence claim is stale after recovery.

# Findings by Severity

## P0

None.

## P1

None.

## P2

### P2-007 [P2] Stale deleted-flag inventories still describe recovered seeded-PPR as removed

- Claim: Repo-level flag inventory docs still classify `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` as a deleted/removed flag and say the tree no longer carries it, even though current source again defines and reads the flag after this session's recovery.
- Evidence: `code-graph-context.ts` defines `SEEDED_PPR_ENABLED_ENV = 'SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING'` and parses it through `seededPprRankingEnabled`; `benchmark-status.md` says the resolved-delete tree no longer carries these switches and lists seeded-PPR as `DELETE`; `feature-flags.md` lists seeded-PPR under the deleted flags section.
- Counterevidence sought: I checked `ENV_REFERENCE.md` for a stale seeded-PPR row and found none; I also checked the original seeded-PPR packet correction and found a newer note acknowledging the recovery and explicitly marking the old source-absence claim stale.
- Alternative explanation: These documents may be intended as historical records of the earlier deletion. That does not fully explain the current-tense inventory language (`the tree no longer carries these switches`, `deleted flag`) in root-level status docs that readers use as present-state summaries.
- Severity: P2. Runtime behavior is not affected, and `ENV_REFERENCE.md` is correct for the assigned edge-confidence row. The issue is traceability/documentation drift that can mislead future flag audits.
- Downgrade trigger: Downgrade to note-only if the orchestrator confirms `benchmark-status.md` and `feature-flags.md` are intentionally frozen historical artifacts rather than current flag inventory surfaces.

# Traceability Checks

- Edge-confidence default: PASS. `ENV_REFERENCE.md:326` documents default `false`, matching `edge-confidence-flags.ts:10` where unset env returns false.
- Edge-confidence parser: PASS with nuance. The code only enables on the exact lowercase string `true`; `ENV_REFERENCE.md:326` says opt-in boolean and `ENV_REFERENCE.md:18-24` defines `=== 'true'` rows as opt-in off. The row does not falsely claim `1`, `yes`, `on`, or uppercase variants are accepted.
- Edge-confidence behavior: PASS. The doc says same-file and cross-file CALLS metadata receive resolution-specific `confidence` and `evidenceClass` when enabled, and legacy `0.8` / `INFERRED` / `heuristic` when unset. That matches the reviewed implementation contract and prior packet evidence.
- Seeded-PPR `ENV_REFERENCE.md` drift: PASS. I found no stale `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` row in `ENV_REFERENCE.md`.
- Seeded-PPR repo-wide drift: ADVISORY. Root-level inventory docs still describe seeded-PPR as deleted/removed even though the current source contains the recovered default-off flag path.

# Verdict

No new P0/P1 findings. One P2 documentation-drift finding was recorded.

# Next Dimension

Continue with the assigned iteration-12 security pass on env parsing and new code paths, without duplicating this P2 doc-drift finding.

Review verdict: PASS
