Deep-research iter 6/10 cross-validation pass for packet 027.

ITER 6 FOCUS: IRQ6 — Cross-phase integration contract.

READ FIRST:
- 027/001-code-graph-hld-lld/spec.md (especially REQ-007 file_role classification + Phase 1 lib design)
- 027/002-code-graph-trace/spec.md (especially REQ-004 architectural_role uses Phase 001's classifyFileRole + dependency mention in metadata)
- 027/003-code-graph-impact-analysis/spec.md (note optional dep on Phase 001 for layer-based criticality)
- 027/research/027-xce-research-based-refinement-pt-02/iterations/iteration-001.md, 002.md, 003.md (note iter-1 truncation/dangling-edge findings, iter-2 CONTAINS BLOCKING)
- mcp_server/code_graph/lib/code-graph-context.ts (existing ContextResult interface — Phase 001 plans to extend with hld_lld field)
- mcp_server/code_graph/handlers/context.ts (current schema)

QUESTION: Phase 002 imports Phase 001's `classifyFileRole()` for the trace's `architectural_role` rung. Phase 003 has an OPTIONAL dep on Phase 001 for layer-based criticality. What's the JSON contract between them, and where could a schema drift surface during incremental implementation?
- Phase 001 spec REQ-007 says "5 baseline file_role classifications: module / api-handler / library / test / config." Is this an OPEN string or CLOSED enum? Phase 002 spec doesn't pin this — it just calls `classifyFileRole()` and uses the result. If 001 ships with open string, but 002 tests against closed enum, contract drift.
- Phase 001's `classifyFileRole(filePath, db)` signature: does it take a db handle (consistent with Phase 002's expectation) or just a path? Spec implies the former.
- ContextResult.hld_lld field added by Phase 001 (REQ-004 omni integration). Is the schema for this field documented? Phase 002 doesn't reference it directly, but Phase 003's optional Phase 001 dep might.
- Independent shipping order: Phase 003 has "no hard dep on 001" per its description.json. But spec says "Optional Phase 001 (HLD/LLD) for layer-based criticality weighting in LLM enrichment mode." So if 003 ships first (without 001), what's the fallback for `layer` info?
- Stub/mock for early development: while 001 isn't yet shipped, can 002 use a stub `classifyFileRole(path) -> "unclassified"` to develop in parallel? Spec doesn't address.
- Test isolation: Phase 002's vitest needs Phase 001's `classifyFileRole` available. If 001 is in-flight (uncommitted), how do 002's tests run?
- Naming consistency: Phase 001 says "file_role" (snake_case in JSON). Phase 002 says "architectural_role" (snake_case but different name). Phase 003 says "layer". These are slightly different concepts but related — should naming be unified? At minimum, document the relationship.

DELIVERABLES (all 3 required):
1. WRITE `pt-02/iterations/iteration-006.md` (Focus, Actions with file:line, Findings with verdicts, Q-Answered, Q-Remaining, Next Focus = IRQ7)
2. APPEND `>>` ONE LINE to `pt-02/deep-research-state.jsonl`:
{"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"complete","focus":"IRQ6"}
3. WRITE `pt-02/deltas/iter-006.jsonl` (1 iter record + ≥3 finding records)

CONSTRAINTS: LEAF, ≤12 tools, READ-ONLY 027/* + mcp_server/, WRITE pt-02/ ONLY.

NEXT: IRQ7 — TESTED_BY edge ground-truth (is structural-indexer.ts actually emitting TESTED_BY edges?).
