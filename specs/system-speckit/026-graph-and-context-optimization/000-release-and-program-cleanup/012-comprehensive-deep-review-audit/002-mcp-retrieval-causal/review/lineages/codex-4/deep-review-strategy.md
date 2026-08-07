# Deep Review Strategy

## Topic
MCP retrieval and causal graph read-path deep review for the `002-mcp-retrieval-causal` slice.

## Review Dimensions
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

## Completed Dimensions
| Dimension | Iteration | Verdict |
|---|---:|---|
| correctness | 1 | P1 finding in causal reference resolution |
| security | 2 | Two P1 findings in scoped pagination and causal mutation authorization |
| traceability | 3 | Core protocols covered; checklist absent and skipped |
| maintainability | 4 | P2 comment-hygiene drift |
| stabilization | 5 | No new P0/P1 findings |

## Running Findings
| Severity | Active | New In Last Pass |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 1 | 0 |

## What Worked
- Line-numbered review of public handlers plus immediate supporting libs exposed the chained cursor and causal mutation boundary issues.
- Checking tests alongside implementation distinguished shipped behavior from accidental branches for fuzzy causal reference resolution.
- Scope and schema review was more productive than broad file reading for the security pass.

## What Failed
- Code graph context was unavailable in this session, so structural graph checks used `rg` plus direct reads.
- No packet checklist existed, so checklist-evidence coverage could only be marked skipped rather than positively evidenced.

## Exhausted Approaches
- SQL injection search in reviewed SQL branches: placeholders are used for caller-controlled values in the inspected query paths.
- Session IDOR search in `memory_search`, `memory_context`, and `memory_match_triggers`: session IDs route through trusted-session validation where those handlers accept scoped session IDs.

## Ruled-Out Directions
- Treating the causal fuzzy resolver as safe by tests: tests explicitly assert partial title resolution, so ambiguity remains a shipped behavior.
- Treating the first progressive cursor as unscoped: `createCursor` stores the initial `scopeKey`; the defect is the next cursor produced by `resolveCursor`.

## Next Focus
Synthesis complete. Remediation should start with F002 and F003 because they are security P1s, then F001, then F004.

## Known Context
- Memory startup context was unavailable beyond session summary.
- Code Graph was unavailable, so graph-aware checks used graphless fallback evidence.
- `resource-map.md` was not present in the target spec folder. Resource map coverage gate skipped.

## Cross-Reference Status
| Protocol | Gate | Status | Notes |
|---|---|---|---|
| spec_code | hard | partial | Target files exist and map to the review scope; active findings show safety/correctness drift. |
| checklist_evidence | hard | pass-skipped | No checklist file or checked items were present in this Level 1 review packet. |
| feature_catalog_code | advisory | partial | Feature catalog comments exist, but perishable labels remain in handler comments. |
| playbook_capability | advisory | partial | Retrieval tools expose scoped fields; causal mutation tools do not. |

## Files Under Review
| File | Coverage | Notes |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | covered | Cursor resolution, cache scope, formatting, telemetry, comment hygiene |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | covered | Mode routing, session lifecycle, token budget, graph nudge, comment hygiene |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts` | covered | Trigger scope filtering, cognitive content reads, comment hygiene |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | covered | Read traversal, link/unlink mutations, stats, error handling |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | covered | Causal reference resolution and edge insertion |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts` | supporting | Chained cursor scope propagation |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | supporting | Causal mutation schema scope inputs |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | supporting | Raw edge insert/delete behavior |

## Review Boundaries
- Max iterations: 7.
- Convergence threshold: 0.10.
- Minimum stabilization passes: 1.
- Reviewed implementation files were read-only.
- Output writes were limited to this lineage artifact directory.

## Non-Goals
- No reviewed implementation files were modified.
- Mutation/save path and session/index slice details were not audited beyond direct support for the listed handlers.
- No CI or unit tests were executed because this was a read-only review lineage.

## Stop Conditions
- All four review dimensions covered.
- No new P0/P1 findings in the stabilization pass.
- Claim adjudication packets present for every P1.
- Final synthesis report written with active finding registry.
