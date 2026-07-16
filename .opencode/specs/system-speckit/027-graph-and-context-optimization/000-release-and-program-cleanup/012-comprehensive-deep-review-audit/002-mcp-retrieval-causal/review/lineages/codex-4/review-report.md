# Deep Review Report - MCP Retrieval and Causal Review Slice

## 1. Executive Summary
Verdict: CONDITIONAL.

The review converged after five iterations across correctness, security, traceability, maintainability, and stabilization. No P0 findings were found. Three P1 findings remain active and require remediation before PASS is legal. One P2 advisory remains active.

| Severity | Active |
|---|---:|
| P0 | 0 |
| P1 | 3 |
| P2 | 1 |

`hasAdvisories`: true.

## 2. Planning Trigger
Route to remediation planning because active P1 findings remain. The highest priority is scoped access control for retrieval continuations and causal graph mutation tools.

## 3. Active Finding Registry

### F001 - P1 - Ambiguous causal references resolve to newest partial path/title match
`resolveMemoryReferencesBatch` falls back to partial path/title `LIKE` queries, orders by newest ID, and `processCausalLinks` inserts edges from the selected candidate. Ambiguous common titles or suffix paths can corrupt causal edges.

Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:290`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:307`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:320`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:330`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:367`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:412`

### F002 - P1 - Scoped progressive cursors drop scope on chained continuation
`memory_search` passes a scope key into cursor creation and first-page resolution, but `resolveCursor` omits `payload.scopeKey` when creating the next cursor. Later pages no longer enforce the original scope.

Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:704`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1258`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:329`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:367`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:402`

### F003 - P1 - Causal graph link/unlink endpoints mutate raw IDs without governed scope checks
The causal mutation schemas expose only raw IDs and relation data. The handler inserts and deletes edges directly, and the storage layer deletes by edge ID alone, with no tenant/user/agent ownership check.

Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:691`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:757`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:996`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:406`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:433`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743`

### F004 - P2 - Handler comments retain perishable bug/finding labels instead of durable rationale
Reviewed handlers contain transient bug/fix labels in comments. The code should keep durable rationale and drop temporary tracking labels.

Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:73`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:643`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:738`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:850`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1454`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1630`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1692`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:43`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:113`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:307`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:329`

## 4. Remediation Workstreams
| Workstream | Findings | Action |
|---|---|---|
| Scoped retrieval pagination | F002 | Preserve `scopeKey` across chained continuation cursors and add a page-two mismatched-scope regression test. |
| Governed causal mutations | F003 | Add scope fields to causal link/unlink schemas and verify source/target/edge ownership before mutation. |
| Causal reference integrity | F001 | Replace newest partial-match fallback with unique exact-or-disambiguated resolution. |
| Comment hygiene cleanup | F004 | Remove transient labels from comments while preserving durable rationale. |

## 5. Spec Seed
Add acceptance criteria for:
- Chained continuation cursors remain tenant/user/agent scoped across every page.
- Causal graph mutations fail closed unless source, target, or edge ownership matches the caller's governed scope.
- Causal link reference resolution rejects ambiguous fuzzy candidates.
- Reviewed handlers contain no transient bug/fix/finding labels in comments.

## 6. Plan Seed
1. Patch `progressive-disclosure.ts` to carry `payload.scopeKey` into `nextPayload`.
2. Add chained cursor tests for matching and mismatched scope on page two.
3. Extend causal graph tool schemas and args with governed scope fields.
4. Validate source and target memory rows before `insertEdge`; validate edge ownership before `deleteEdge`.
5. Replace fuzzy causal reference fallback with unique-match resolution and ambiguity reporting.
6. Remove transient labels from reviewed handler comments.

## 7. Traceability Status
| Protocol | Status |
|---|---|
| spec_code | partial |
| checklist_evidence | pass-skipped |
| feature_catalog_code | partial |
| playbook_capability | partial |

All five target files named by the review spec were reviewed. Supporting files were read only where needed to prove behavior.

## 8. Deferred Items
- No tests were executed during this read-only lineage.
- Code Graph was unavailable, so structural graph checks used `rg` and direct reads.
- Resource map coverage was skipped because the target spec folder has no `resource-map.md`.

## 9. Audit Appendix
Iterations:
- 001 correctness: F001.
- 002 security: F002, F003.
- 003 traceability: no new findings.
- 004 maintainability: F004.
- 005 stabilization: no new P0/P1 findings.

Convergence replay:
- Last two new-finding ratios: `0.0625 -> 0.0000`.
- All four dimensions covered.
- One stabilization pass completed after coverage.
- Claim adjudication packets present for all P1 findings.
- Final stop reason: `converged`.

Final verdict: CONDITIONAL.
