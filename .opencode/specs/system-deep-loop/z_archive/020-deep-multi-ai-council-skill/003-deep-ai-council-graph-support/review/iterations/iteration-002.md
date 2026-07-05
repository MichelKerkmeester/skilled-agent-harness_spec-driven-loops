# Deep Review Iteration 002

## Dispatcher

- Mode: review
- Iteration: 2 of 7
- Focus: security
- Budget profile: scan
- Scope: `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support`
- Session: `2026-05-10T18:45:03.440Z`, generation 1, lineage `new`

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:64`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:700`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts:50`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts:41`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts:24`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts:58`
- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:225`
- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts:67`
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts:75`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/spec.md:196`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/checklist.md:109`

## Findings - New

### P0 Findings

- None.

### P1 Findings

1. **Arbitrary metadata is returned as prompt-safe output without redaction or size bounds** -- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts:67` -- The council schemas accept arbitrary node/edge `metadata` records [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:707`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:717`], the store persists those records verbatim [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:259`, `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:341`], and every prompt-safe node/edge serializer returns the full metadata object [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts:67`, `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts:78`]. Query handlers cap item counts but pass those serialized objects directly to MCP responses [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts:57`, `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts:63`], leaving NFR-S02's prompt-safe/no unrelated artifact exposure contract unenforced for metadata payloads [SOURCE: `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/spec.md:196`].
   - Finding class: cross-consumer
   - Scope proof: The same `toPromptSafeNode`/`toPromptSafeEdge` serializers feed unresolved disagreement, evidence-chain, decision-support, convergence-blocker, and hot-node query paths, so a single unsanitized metadata field can surface across all council query modes.
   - Affected surface hints: [`councilGraphNodeSchema.metadata`, `councilGraphEdgeSchema.metadata`, `toPromptSafeNode`, `toPromptSafeEdge`, `council_graph_query responses`, `council graph tests`]
   - Recommendation: Replace free-form response metadata with an allowlisted, size-bounded summary (for example confidence/severity/planConfidence only), or redact metadata by default and add explicit tests proving large/untrusted metadata is not returned in prompt-safe query output.

```json
{
  "type": "claim_adjudication",
  "claim": "Council graph query responses can expose arbitrary caller-supplied metadata despite the prompt-safe output contract.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:707",
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:717",
    ".opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:259",
    ".opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts:67",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts:63",
    ".opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/spec.md:196"
  ],
  "counterevidenceSought": "Checked schema validators, storage conversion, query serializers, query handlers, and council graph tests; found item-count/depth bounds and enum/path checks, but no metadata key allowlist, redaction, byte-size cap, or hostile-metadata regression test.",
  "alternativeExplanation": "Metadata is intended to carry confidence/severity signals for convergence, but the implementation accepts and returns any JSON object rather than just those safe fields.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade to P2 only if a separate MCP-level redaction/response-size layer is proven to sanitize these handler payloads before model exposure."
}
```

### P2 Findings

- None.

## Traceability Checks

- `spec_code`: fail. NFR-S02 requires prompt-safe outputs without unrelated packet artifact exposure, but metadata is accepted and returned without content redaction or size bounds.
- `checklist_evidence`: fail. CHK-031 claims input validation covers the security surface, but tests exercise ordinary confidence/severity metadata rather than hostile or oversized metadata.
- `feature_catalog_code`: partial. Tool dispatch uses schema validation before the council graph handlers, but the schema intentionally permits arbitrary metadata objects.

## Integration Evidence

- MCP dispatcher surface `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` validates council graph tool args before dispatch [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:140`].
- The security finding remains after that integration check because the registered schema itself permits arbitrary metadata [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:707`].

## Edge Cases

- The prior registry file reported zero open findings while the JSONL and strategy reported two active P1s; this iteration treated JSONL/strategy as authoritative continuity and recorded the mismatch as a reducer-state ambiguity.
- The required BINDING lines were emitted after an initial strategy-path typo was corrected; no target files were modified before artifact writes.

## Confirmed-Clean Surfaces

- Namespace filtering includes both `spec_folder` and `session_id` in handler-created namespaces and SQL where clauses for handler query paths [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts:41`, `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:225`].
- Query `limit` and evidence-chain `maxDepth` are clamped at handler level [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts:42`, `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts:57`].
- Empty graph convergence returns `STOP_BLOCKED` rather than false-safe success [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts:60`].

## Ruled Out

- SQL injection through graph identifiers was ruled out for reviewed paths because database operations use prepared statements with bound parameters [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:261`, `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:366`].
- Cross-session reads through public handlers were ruled out for this iteration because handlers require `sessionId` and pass it into the namespace used by query helpers [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts:20`, `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts:24`].

## Next Focus

- dimension: traceability
- focus area: reconcile spec/checklist claims with implementation and test evidence, including carried P1s for empty-upsert behavior, convergence CONTINUE coverage, and prompt-safe metadata handling
- reason: correctness and security dimensions now both have active P1 evidence tied to spec/checklist claims
- rotation status: move from D2 Security to D3 Traceability
- blocked/productive carry-forward: productive carry-forward on schema/handler/test cross-checks; do not retry ruled-out SQL-injection or cross-session-read concerns unless new evidence appears
- required evidence: `spec.md`, `checklist.md`, `implementation-summary.md`, tests, tool schemas, and skill graph guidance references
