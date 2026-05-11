# Deep Review Iteration 001

## Dispatcher

- Mode: review
- Focus dimension: correctness
- Focus area: storage invariants, query/convergence behavior, handler return semantics, schema/data-model mismatch, and tests that prove behavior
- Budget profile: scan (target 9 tool calls; hard max 13)
- Status: complete

## Files Reviewed

- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/prompts/iteration-1.md`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-config.json`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-state.jsonl`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-findings-registry.json`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-strategy.md`
- `.opencode/skills/sk-code-review/references/review_core.md`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/spec.md`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/plan.md`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/tasks.md`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/checklist.md`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/implementation-summary.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Empty upsert violates the documented no-op contract** -- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts:52` -- The spec requires an empty upsert to return a bounded no-op result (`spec.md:208`-`spec.md:210`), but the handler returns `status:"error"` when both `nodes` and `edges` are empty. The strict input schema also allows both arrays to be omitted (`tool-input-schemas.ts:720`-`tool-input-schemas.ts:725`), so valid schema-level input is rejected at runtime instead of producing the documented no-op response. [SOURCE: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/spec.md:208] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts:52] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:720]
   - Finding class: cross-consumer
   - Scope proof: The same `councilGraphUpsertSchema` optional `nodes`/`edges` contract feeds the MCP `council_graph_upsert` handler, and the only upsert handler rejects the empty payload before `batchUpsert` can return a no-op count.
   - Affected surface hints: [`council_graph_upsert` schema, upsert handler, upsert tests, spec edge-case contract]
   - Recommendation: Either make `nodes`/`edges` require at least one item at schema/docs level, or change the handler to return `status:"ok"` with zero inserted nodes/edges and no rejected edges for empty input; add a regression test for the chosen contract.

```json
{
  "type": "claim-adjudication",
  "claim": "The council graph upsert runtime contradicts the documented empty-input no-op behavior.",
  "evidenceRefs": [
    ".opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/spec.md:208",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts:52",
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:720"
  ],
  "counterevidenceSought": "Reviewed council graph tests for an empty-upsert assertion and schema lines for a min-item guard; neither counterevidence was present.",
  "alternativeExplanation": "The intended contract may have changed to reject empty payloads, but spec.md and the permissive schema were not updated to match that stricter runtime behavior.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade to P2 only if maintainers explicitly decide empty upserts should be validation errors and update spec/schema/tests consistently."
}
```

2. **Verification claims convergence CONTINUE coverage that the council graph tests do not exercise** -- `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts:142` -- The checklist marks convergence tests complete for stop allowed, continue, and blocked critical disagreement cases (`checklist.md:78`), but the council graph test file covers a blocked critical disagreement/STOP_BLOCKED path (`council-graph.vitest.ts:64`-`council-graph.vitest.ts:140`), a STOP_ALLOWED path (`council-graph.vitest.ts:142`-`council-graph.vitest.ts:180`), and an empty STOP_BLOCKED path (`council-graph.vitest.ts:182`-`council-graph.vitest.ts:197`) with no assertion for the `CONTINUE` branch implemented in `convergence.ts:77`-`convergence.ts:81`. [SOURCE: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/checklist.md:78] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts:142] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts:77]
   - Finding class: matrix/evidence
   - Scope proof: The single council graph test file has three `it(...)` cases covering STOP_BLOCKED/STOP_ALLOWED/empty STOP_BLOCKED, while the documented `CONTINUE` acceptance remains unproven in the reviewed scope.
   - Affected surface hints: [convergence test matrix, checklist evidence, `council_graph_convergence` handler]
   - Recommendation: Add a convergence fixture that fails one non-blocking threshold without critical blockers and asserts `decision === "CONTINUE"`, then update checklist evidence to cite that test.

```json
{
  "type": "claim-adjudication",
  "claim": "The completed checklist overstates convergence branch coverage because no test asserts the CONTINUE decision path.",
  "evidenceRefs": [
    ".opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/checklist.md:78",
    ".opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts:64",
    ".opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts:142",
    ".opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts:182",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts:77"
  ],
  "counterevidenceSought": "Reviewed the full council-graph.vitest.ts file for an assertion expecting CONTINUE; only STOP_BLOCKED and STOP_ALLOWED assertions were present.",
  "alternativeExplanation": "A CONTINUE case might be covered indirectly in another test file, but the checklist evidence names council-graph.vitest.ts for this claim and no such assertion was found in that file during this iteration.",
  "finalSeverity": "P1",
  "confidence": 0.87,
  "downgradeTrigger": "Downgrade to P2 if another in-scope test is shown to assert CONTINUE or if the checklist is changed to remove the CONTINUE coverage claim."
}
```

### P2 Findings

None.

## Traceability Checks

- `spec_code`: partial/fail for correctness due to empty-upsert behavior mismatch with `spec.md` edge-case contract.
- `checklist_evidence`: fail for correctness because CHK-022 claims CONTINUE convergence coverage without matching test evidence in `council-graph.vitest.ts`.
- `feature_catalog_code`: partial; schema/tool surfaces expose council graph fields consistently enough for this correctness pass, but empty-upsert semantics remain inconsistent.

## Integration Evidence

- Reviewed exact council graph MCP handler surfaces: `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts`, `query.ts`, `status.ts`, and `convergence.ts`.
- Reviewed exact strict schema surface: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` council graph schema block.
- Reviewed exact test surface: `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`.

## Edge Cases

- The packet did not contain pre-existing `review/iterations/` or `review/deltas/` directories; both were created under the resolved packet root before writing iteration-owned artifacts.
- Resource map coverage is not applicable because the prompt pack states `resource-map.md` is not present.

## Confirmed-Clean Surfaces

- Self-loop edge rejection is implemented before persistence and covered by test evidence (`upsert.ts:97`-`upsert.ts:99`; `council-graph.vitest.ts:91`-`council-graph.vitest.ts:98`).
- Empty derived graph convergence blocks stop rather than returning false-safe success (`convergence.ts:60`-`convergence.ts:70`; `council-graph.vitest.ts:182`-`council-graph.vitest.ts:196`).

## Ruled Out

- No P0 destructive data-loss issue found in this correctness slice because graph rows are documented and implemented as derived projection data, with packet artifacts remaining source-of-truth.
- No evidence found in reviewed files that the implementation reuses `deep_loop_graph_*` research/review semantics for council data.

## Next Focus

- dimension: security
- focus area: strict input validation, prompt-safe output boundaries, namespace/path isolation, and artifact exposure behavior
- reason: correctness found two P1 issues; next dimension should verify no trust-boundary or prompt-safety regressions exist before traceability/maintainability synthesis.
- rotation status: advance from D1 Correctness to D2 Security
- blocked/productive carry-forward: productive carry-forward on schema/handler/test mismatch patterns
- required evidence: council graph schemas, handlers, tool registration, prompt-safe output fields, and relevant tests
