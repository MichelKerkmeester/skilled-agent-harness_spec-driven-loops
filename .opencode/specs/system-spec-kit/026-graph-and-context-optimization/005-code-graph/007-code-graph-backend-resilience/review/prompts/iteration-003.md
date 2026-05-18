GATE 3 PRE-ANSWERED: A (existing spec folder)
Spec folder for this run: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/005-code-graph-backend-resilience/
Skill routing: sk-deep-review is preselected; do not re-evaluate.
You may write to: review/iterations/, review/deltas/, review/deep-review-state.jsonl. Do NOT modify any other file. Do NOT ask the user any questions.
This is a READ-ONLY review of the implementation. NEVER edit code outside the review/ directory.

==========

You are running iteration 3 of 10 in a deep-review loop on the 005-code-graph-backend-resilience packet.

# Iteration 3 — Correctness — Resolver Upgrades

## Focus

Audit T09-T10 resolver capture + cross-file resolution:

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:113-126` (RawCapture extension)
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:485-502` (regex fallback)
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:857-920, 1328-1381, 1403-1507` (cross-file resolver + tsconfig load)
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:340-465` (import/export captures)
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:73-80` (IndexerConfig path-alias fields)

Compare against 007 iter-009 patch design.

## Look For

- tsconfig `extends` chain: does single-level extends get resolved? What about circular extends?
- Path alias normalization: are leading slashes / trailing wildcards / multiple targets handled?
- Type-only imports correctly tagged with importKind:"type"?
- Re-export barrels (`export * from`) chain resolution depth — bounded? infinite?
- File extension resolution: does it try `.ts`, `.tsx`, `.js`, `.jsx`, `.d.ts`, `/index.ts`?
- Performance: tsconfig parsed once per scan? cached across files?
- What happens when the resolved path is OUTSIDE the workspace root?
- regex-fallback parity: does it record the same fields as the tree-sitter path?

## Outputs as iteration 1.
