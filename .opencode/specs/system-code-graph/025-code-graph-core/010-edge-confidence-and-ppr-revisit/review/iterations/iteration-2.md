# Deep Review Iteration 2

## Dimension

Correctness, finer grain on recovered seeded-PPR impact ranking; traceability, initial checklist evidence replay.

## Files Reviewed

| File | Focus |
|------|-------|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:701` | `collectSeededPprImpactRanking` deadline, duplicate-candidate, trace behavior |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:777` | PPR invocation, deadline propagation, readEdges reuse |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1129` | PPR `why_included` trace emission |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts:19` | Shared weighted-walk result shape |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts:154` | Multi-hop PPR coverage |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts:125` | Flag gate path coverage |
| `.opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/checklist.md:58` | Typecheck/test evidence claims |
| `.opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/checklist.md:121` | Checklist completion totals |
| `.opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/tasks.md:73` | Remaining unchecked tasks |
| `.opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/plan.md:119` | Strict validation task state |

Verification commands replayed:

| Command | Result |
|---------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit --strict` | PASS: 0 errors, 0 warnings |
| `npm run typecheck` in `.opencode/skills/system-code-graph` | PASS |
| `npm exec vitest run -- mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts` in `.opencode/skills/system-code-graph` | PASS: 2 files, 9 tests |

## Findings by Severity

### P0

None.

### P1

#### P1-002 [P1] Seeded-PPR trace output loses the multi-hop provenance chain

- Claim: When `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` and `includeTrace` are both enabled, multi-hop impact candidates are returned with `depth` from PPR, but `why_included.edgeChain` records only the candidate's final incoming edge, not the full path back to the anchor. A trace consumer can see a depth-2 or depth-3 inclusion without the chain that explains that depth.
- Evidence: `code-graph-context.ts:799` reads only `ppr.reached.get(sourceId)` for `minHop`; `code-graph-context.ts:1129` records one edge from the candidate source to `candidate.targetLabel`; `bfs-traversal.ts:19` shows `WeightedWalkResult` contains only `nodeId`, `minHop`, and `maxWalkScore`, no predecessor/path data; `code-graph-seeded-ppr-ranking.vitest.ts:154` covers multi-hop ranking but `code-graph-seeded-ppr-ranking.vitest.ts:201` asserts `why_included` is undefined for that case, so the traced multi-hop path is untested.
- Counterevidence sought: I checked whether the shared weighted-walk result carries predecessor data that `recordWhyIncluded` could use, and it does not. I also checked the recovered PPR tests for includeTrace coverage; they exercise multi-hop ranking but not traced breadcrumbs.
- Alternative explanation: `edgeChain` could be intended as a set of contributing edges rather than an ordered path. That does not fit the depth field for PPR candidates, because a single recorded edge to an intermediate target cannot explain why the source file was included at depth greater than 1.
- Final severity: P1.
- Confidence: 0.84.
- Downgrade trigger: Downgrade to P2 if the trace contract is explicitly documented as single-edge-only for seeded-PPR, or if downstream consumers ignore `why_included` for PPR impact mode.
- Finding class: algorithmic.

#### P1-003 [P1] Checklist completion evidence conflicts with the packet's own task state

- Claim: `checklist.md` declares all verification buckets complete, including `P1 Items | 10 | 10/10`, but the same packet still leaves live sync, packet doc update, strict validation, and overall completion criteria unchecked in `tasks.md`; the completion evidence is therefore not reconciled across packet docs.
- Evidence: `checklist.md:121` through `checklist.md:125` reports all P0/P1/P2 items verified; `checklist.md:112` through `checklist.md:113` marks the sync/removal file-organization checks complete; `tasks.md:73` leaves live-tree sync unchecked, `tasks.md:75` leaves packet doc updates unchecked, `tasks.md:76` leaves strict validation unchecked, and `tasks.md:84` through `tasks.md:86` leave the overall completion criteria unchecked. `plan.md:119` also still lists `validate.sh --strict` as incomplete.
- Counterevidence sought: I replayed the strict spec validator and it now passes, and the targeted code-graph typecheck/PPR vitest commands also pass. That confirms the command surface is runnable, but it does not reconcile the conflicting checklist/task state.
- Alternative explanation: `tasks.md` and `plan.md` may be stale while the checklist is current. If so, the release packet still has a traceability defect because the stale source-of-truth docs contradict the checklist completion claim.
- Final severity: P1.
- Confidence: 0.88.
- Downgrade trigger: Downgrade after the packet updates `tasks.md`/`plan.md` or the checklist to a single consistent completion state with command evidence.
- Finding class: matrix/evidence.

### P2

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | CONDITIONAL | The PPR ranking path is correctly gated to impact mode (`code-graph-context.ts:1112`) and the targeted PPR tests pass, but traced multi-hop PPR output loses path provenance. |
| `checklist_evidence` | CONDITIONAL | Strict spec validation, typecheck, and targeted PPR tests are runnable and pass; checklist completion totals conflict with still-unchecked tasks and plan items. |
| `skill_agent` | pending | Not covered in this iteration. |
| `agent_cross_runtime` | pending | Not covered in this iteration. |
| `feature_catalog_code` | pending | Not covered in this iteration. |
| `playbook_capability` | pending | Not covered in this iteration. |

## Verdict

CONDITIONAL. Two new P1 findings remain open. P1-001 from iteration 1 also remains active and is not re-emitted here.

## Next Dimension

Continue under `stop-policy=max-iterations`: broaden to security/reliability around recovered eval scripts and filesystem operations, then return to traceability overlays once core correctness has at least one more pass.
Review verdict: CONDITIONAL
