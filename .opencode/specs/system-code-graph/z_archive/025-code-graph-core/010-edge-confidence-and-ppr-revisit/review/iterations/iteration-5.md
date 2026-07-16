# Dimension

Correctness, deeper on test coverage for the four focused vitest files and `code-graph-context.ts` seeded-PPR functions.

# Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28` severity doctrine loaded before final severity call.
- `.opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-state.jsonl:1` current session state and prior findings reviewed.
- `.opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-findings-registry.json:9` active findings registry reviewed.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:20` missing dist module resolver reviewed.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:32` unconditional top-level dynamic import reviewed.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:515` bounded PPR implementation reviewed.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:701` seeded-PPR impact ranking reviewed.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:921` trace breadcrumb recorder reviewed.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1112` seeded-PPR impact branch reviewed.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts:179` cross-file confidence differentiation tests reviewed.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:1502` same-file confidence differentiation tests reviewed.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts:125` flag-off flat-path test reviewed.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts:145` flag-on/off non-byte-identical test reviewed.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts:154` seeded-PPR ordering test reviewed.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts:198` missing trace assertion reviewed.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts:301` iteration-cap test reviewed.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts:376` existing single-hop includeTrace coverage checked as counterevidence.
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts:615` existing same-depth edgeChain coverage checked as counterevidence.

# Findings by Severity

## P0

None.

## P1

None new. Existing active P1 findings are strengthened, not contradicted:

- `P1-001` remains active: `code-graph-context.ts` still resolves and imports the Memory MCP compiled weighted-walk module at top level before the seeded-PPR flag can gate behavior, and a direct glob for `.opencode/skills/system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js` returned no files.
- `P1-002` remains active: existing includeTrace tests cover the single-hop neighborhood path, but the seeded-PPR impact tests do not run with `includeTrace: true` and one ranking test explicitly expects `why_included` to be undefined.

## P2

### P2-006 [P2] Focused PPR regression tests miss the two active P1 failure modes

- File: `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts:198`
- Evidence: The seeded-PPR ranking test asserts caller ordering and then asserts `result.graphContext[0].why_included` is `undefined`, so it never exercises the P1-002 case where `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` and `includeTrace` are both enabled.
- Evidence: The flag-on-path helper builds impact context without `includeTrace` at `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts:108`, so its multi-hop graph also cannot detect the lost provenance chain.
- Evidence: Both PPR test files import `code-graph-context.ts` directly at `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts:28` and `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts:25`; they do not isolate the module-load path or simulate the missing compiled `bfs-traversal.js` artifact that triggers P1-001.
- Evidence: The PPR unit coverage has an iteration-cap test at `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts:301`, but no focused assertion for `deadlineExpired: true`, duplicate candidate collapse through `candidatesByEdge`, or malformed edge metadata on the seeded-PPR branch.
- Finding class: test-isolation
- Scope proof: Targeted search for `includeTrace|why_included|edgeChain|dist/lib/graph|bfs-traversal|deadline|duplicate|malformed|SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` across `mcp_server/tests/*.vitest.ts` found includeTrace coverage in `code-graph-context-handler.vitest.ts`, but that coverage is single-hop neighborhood/standard impact, not the flagged seeded-PPR impact branch.
- Affected surface hints: `seeded-PPR tests`, `includeTrace provenance`, `missing dist artifact regression`, `deadline and duplicate PPR edge cases`
- Recommendation: Add tests that import or exercise `code-graph-context.ts` with the compiled weighted-walk artifact absent, and add a flagged impact test with `includeTrace: true` over a multi-hop graph that asserts the full provenance path or intentionally documents the reduced trace contract.

# Traceability Checks

- `spec_code`: CONDITIONAL. Focused tests cover confidence differentiation and seeded-PPR ranking, but not the active module-load and multi-hop provenance failure modes.
- `checklist_evidence`: CONDITIONAL. This iteration did not re-adjudicate the checklist/tasks conflict from P1-003; the test evidence remains incomplete for P1-001/P1-002 regression protection.
- `feature_catalog_code`: CONDITIONAL inherited from P2-005; not re-reviewed in this iteration.
- `playbook_capability`: CONDITIONAL inherited from P2-005; not re-reviewed in this iteration.

# Verdict

PASS for this iteration because no new P0/P1 was found. The overall review remains conditional due to prior active P1 findings.

# Next Dimension

Iteration 6 should continue under `stopPolicy=max-iterations` and broaden from test existence into runtime integration: verify handler/tool import surfaces, packaged build assumptions, and whether any caller can request `includeTrace` plus flagged seeded-PPR impact in real MCP paths.
Review verdict: PASS
