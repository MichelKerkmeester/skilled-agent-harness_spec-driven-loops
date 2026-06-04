# Deep Review Strategy

## Topic
MCP session, index, ingest, embedder, context-server, and schema parity audit for `.opencode/skills/system-spec-kit/mcp_server`.

## Review Dimensions
- [x] D1 Correctness: handler behavior, dispatch invariants, error handling, indexing/session lifecycle.
- [x] D2 Security: path handling, environment precedence, filesystem/database writes, trust boundaries.
- [x] D3 Traceability: spec-code and checklist-evidence checks, schema-to-handler parity, documented contract drift.
- [x] D4 Maintainability: duplication, schema centralization, tests, follow-on change safety.

## Stop Decision
The loop stopped after iteration 5 because all dimensions and traceability protocols were covered, followed by one stabilization pass with no new P0/P1 findings. Active P1 findings remain, so the final verdict is CONDITIONAL and release readiness is release-blocking.

## Completed Dimensions
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| correctness | PASS | 1 | Dispatch and session/embedder handlers degrade cleanly and did not produce accepted P0/P1 issues. |
| security | CONDITIONAL | 2 | F001 accepted: ephemeral retention bypasses governed-ingest enforcement. |
| traceability | CONDITIONAL | 3 | F002 accepted for schema-to-handler governance drift; F003 and F004 accepted for playbook drift. |
| maintainability | CONDITIONAL | 4 | No separate maintainability finding beyond F002; queue persistence shape makes the fix non-local. |
| stabilization | CONDITIONAL | 5 | No new findings; active P1/P2 findings persisted. |

## Running Findings
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active - F001, F002
- **P2 (Minor):** 2 active - F003, F004
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

## What Worked
- Direct read plus `rg` evidence was sufficient for graphless review.
- The direct `memory_save` path provided a useful comparison for expected governance propagation.
- Manual playbook checks separated stale documentation drift from install-guide drift.

## What Failed
- Code Graph was unavailable in this lineage, so structural relationship claims were not graph-backed.
- `cli-codex` self-invocation was prohibited; this process acted as the Codex executor.

## Exhausted Approaches
- Install-guide stale call-shape search: no stale session call shape found in `mcp_server/INSTALL_GUIDE.md`.
- Feature catalog stale `codeGraph.available` search: the drift was found in manual playbook expectations, not accepted as a feature catalog finding.

## Ruled Out Directions
- Nested Codex CLI fan-out from this lineage.
- Implementation fixes, because this lineage is read-only review output.

## Next Focus
- Synthesis complete.
- Remediation should start with F001 and F002 because they affect persisted governance/retention behavior.

## Cross-Reference Status
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | complete | 1-5 | Target spec implementation files were inspected by direct reads. |
| `checklist_evidence` | core | notApplicable | 3 | Target packet has no checklist.md. |
| `skill_agent` | overlay | notApplicable | - | Target type is spec-folder. |
| `agent_cross_runtime` | overlay | notApplicable | - | Target type is spec-folder. |
| `feature_catalog_code` | overlay | complete | 3 | Search completed; no accepted feature-catalog drift finding. |
| `playbook_capability` | overlay | complete | 3 | F003 and F004 accepted. |

## Files Under Review
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | correctness, traceability | 5 | F003 doc drift only | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts` | correctness, traceability | 5 | F004 doc drift only | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts` | correctness | 1 | 0 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts` | correctness, security | 2 | 0 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | correctness, security, traceability, maintainability | 5 | F002 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | correctness, security | 2 | 0 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-alias.ts` | correctness, security | 2 | 0 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | correctness, security, traceability, maintainability | 5 | F002 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts` | correctness | 1 | 0 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts` | correctness | 1 | 0 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts` | correctness | 1 | 0 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | correctness, security, traceability, maintainability | 5 | F002 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | traceability, maintainability | 5 | F003 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | security, traceability, maintainability | 5 | F002, F003 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/README.md` | maintainability | 4 | 0 | complete |

## Review Boundaries
- Max iterations: 7
- Completed iterations: 5
- Convergence threshold: 0.10
- Graph mode: graphless fallback
- Session lineage: sessionId=fanout-codex-3-1780592962034-hmdvp1, parentSessionId=null, generation=1, lineageMode=new
- Release-readiness states: in-progress | converged | release-blocking
- Final release readiness: release-blocking
- Started: 2026-06-04T17:10:57Z
- Updated: 2026-06-04T17:15:17Z
