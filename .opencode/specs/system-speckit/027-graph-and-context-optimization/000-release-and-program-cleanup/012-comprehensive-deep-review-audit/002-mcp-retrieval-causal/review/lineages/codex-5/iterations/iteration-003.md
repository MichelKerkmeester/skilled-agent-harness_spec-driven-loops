# Iteration 3: Security - Causal Graph Scope Enforcement

## Focus

Dimension: security.

Files reviewed:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`

## Scorecard

- Dimensions covered: security
- Files reviewed: 2
- New findings: P0=1 P1=0 P2=0
- Refined findings: P0=0 P1=1 P2=0
- New findings ratio: 0.50

## Findings

### P0, Blocker

- **F003**: Causal graph tools expose ID-only reads and destructive writes without tenant, user, agent, or spec scope checks. The handler arg shapes contain only `memoryId`, edge endpoints, or `edgeId`; there are no scope fields to validate [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:76`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:84`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:113`]. `memory_drift_why` reads the source memory by bare ID [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:560`] and then reads every related memory by ID [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:580`]. `memory_causal_stats` lists top unlinked records from all `memory_index` rows with no scope predicate [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:211`] and returns those titles in hints when coverage is low [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:883`]. `memory_causal_unlink` deletes by bare `edgeId` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:996`], and storage executes `DELETE FROM causal_edges WHERE id = ?` without owner checks [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:747`]. In a governed memory store, these APIs bypass the same scope model that retrieval tools enforce.

### P1, Required

- **F001** persists from iteration 1. The same absence of scope checks in causal graph handlers increases the impact of wrong-target edge creation, but the root cause remains endpoint/scope validation before edge insertion.

## Claim Adjudication Packets

```json
{
  "findingId": "F003",
  "claim": "Causal graph read and mutation tools operate on bare IDs without accepting or enforcing caller scope, allowing cross-scope graph inspection and deletion.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:76",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:84",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:113",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:560",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:580",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:211",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:883",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:996",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:747"
  ],
  "counterevidenceSought": "Read every causal graph public handler, storage delete path, and top-unlinked stats helper; searched for tenantId, userId, agentId, specFolder, or session scope checks in causal-graph.ts.",
  "alternativeExplanation": "The causal tools may have originally been single-tenant internal tools, but the same MCP server now exposes governed scope fields for memory_search, memory_context, and memory_match_triggers, so ID-only causal tools are inconsistent with the active trust model.",
  "finalSeverity": "P0",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if causal graph tools are proven unreachable from governed MCP clients or a dispatcher-level scope guard filters every causal request before handler execution.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P0", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md:36` | Causal graph safety fails the security dimension. |
| checklist_evidence | pending | hard | - | No checklist file reviewed in this iteration. |

## Assessment

- New findings ratio: 0.50
- Dimensions addressed: security
- Novelty justification: second security pass found a separate IDOR-style causal graph access path.

## Ruled Out

- Runtime schema validation as a sufficient guard: schemas validate types and ranges, but they do not add ownership predicates or scope fields for these tools.

## Dead Ends

- Treating stats as harmless metadata: the stats helper includes record titles and spec folders in hints, so it can disclose memory inventory.

## Recommended Next Focus

Traceability pass over public schema, runtime schema, and slice spec claims.

Review verdict: FAIL
