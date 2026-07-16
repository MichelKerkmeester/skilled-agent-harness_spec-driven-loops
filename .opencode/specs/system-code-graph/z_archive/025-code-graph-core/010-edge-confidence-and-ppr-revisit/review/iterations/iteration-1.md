# Deep Review Iteration 1

## Dimension

Inventory pass, then correctness review of confidence-differentiation gating and recovered seeded-PPR wiring.

## Files Reviewed

| File | Coverage |
| --- | --- |
| `spec.md` | Scope, requirements, no-behavior-change contract, edge cases |
| `plan.md` | affected surfaces, required inventories, regression expectations |
| `tasks.md` | implementation and verification claims |
| `checklist.md` | checklist evidence claims for flag-off behavior and PPR recovery |
| `decision-record.md` | ADR constraints for no second walker and default-off confidence changes |
| `implementation-summary.md` | delivered behavior, limitations, verification claims |
| `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts` | flag parser and default-off behavior |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | same-file CALLS metadata gating |
| `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts` | cross-file CALLS metadata gating |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | seeded-PPR import, flag gate, transition weighting, impact integration |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts` | cross-file resolved and ambiguous confidence tests |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts` | same-file single/multi-candidate confidence tests |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts` | flag-off vs flag-on path tests |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts` | PPR ranking and confidence-gradient tests |
| `.opencode/skills/system-code-graph/mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs` | eval driver flag setup and scratch DB behavior |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | documented edge-confidence flag |

## Findings by Severity

### P0

None.

### P1

#### P1-001 [P1] Seeded-PPR recovery adds an unconditional missing compiled-module dependency

- File: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:20`
- Claim: `code-graph-context.ts` now resolves and imports the Memory MCP compiled weighted-walk module at top level before `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` is checked, but the referenced compiled `dist/lib/graph/bfs-traversal.js` artifact is absent from this checkout.
- Evidence: `code-graph-context.ts` imports the Memory MCP `dist` type path, resolves only `dist/lib/graph/bfs-traversal.js` candidates, throws `Memory weighted-walk traversal module not found` when neither candidate exists, and executes the dynamic import at module load time [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:16`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:20`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:27`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:32`]. File inventory found the source module at `.opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts`, but no `.opencode/skills/system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js` file.
- Spec impact: The packet requires zero behavior change for existing consumers when both new paths are default-off [SOURCE: `spec.md:82`, `spec.md:83`, `spec.md:112`]. A top-level load failure happens before the PPR flag gate at `shouldUseSeededPprRanking()` can keep impact mode on the legacy path [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:452`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:457`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1112`].
- Counterevidence sought: Checked whether the compiled Memory MCP file exists under `.opencode/skills/**/bfs-traversal.*`; only TypeScript source files and other subsystem traversal files were present, not the required compiled `dist` path. Also checked the flag-off path; the `shouldUseSeededPprRanking()` branch is inside `expandAnchor`, after top-level module initialization.
- Alternative explanation: A local build step may create `system-spec-kit/mcp_server/dist` in some developer environments. That would explain why local verification passed, but it does not satisfy the checked-out default-off contract unless the compiled artifact is guaranteed before any import of `code-graph-context.ts`.
- Final severity: P1.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to P2 or close if the runtime guarantees the Memory MCP `dist/lib/graph/bfs-traversal.js` artifact is generated before code-graph context loads, or if the import is moved behind the seeded-PPR flag with a covered flag-off test in an environment where `dist` is absent.
- Finding class: cross-consumer.
- Scope proof: The import is top-level in the main `code_graph_context` implementation, so it affects all imports of the module, not only the flagged impact ranking branch [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:32`].
- Affected surface hints: `code_graph_context` module load, seeded-PPR recovery path, default-off regression contract, CI/test environments without built Memory MCP dist.
- Recommendation: Lazily resolve/import the shared weighted-walk module inside the seeded-PPR branch, or depend on a source-level shared module that is available in the checked-out tree; add a flag-off import/load test with the Memory MCP `dist` artifact absent.

### P2

None.

## Traceability Checks

| Protocol | Status | Evidence |
| --- | --- | --- |
| `spec_code` | CONDITIONAL | `structural-indexer.ts` and `cross-file-edge-resolver.ts` correctly gate metadata writes behind `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`, but `code-graph-context.ts` violates the default-off safety contract through a top-level missing compiled-module dependency. |
| `checklist_evidence` | CONDITIONAL | Checklist claims flag-off suite proof and PPR recovery verification, but the scoped file inventory contradicts the availability assumption for the recovered shared walker dependency. |
| `skill_agent` | PENDING | Not covered in iteration 1. |
| `agent_cross_runtime` | PENDING | Not covered in iteration 1. |
| `feature_catalog_code` | PENDING | Not covered in iteration 1. |
| `playbook_capability` | PENDING | Not covered in iteration 1. |

## Verdict

CONDITIONAL. One P1 correctness/default-off integration finding was recorded. No P0 findings found in this pass.

## Next Dimension

Continue correctness at finer grain before broadening: verify whether `code-graph-context.ts` has any additional seeded-PPR deadline, budget, duplicate-candidate, or trace-output regressions once the shared walker dependency is made load-safe; then begin traceability on checklist evidence versus actual runnable verification commands. Do not stop early; `stopPolicy=max-iterations` requires the loop to continue.
Review verdict: CONDITIONAL
