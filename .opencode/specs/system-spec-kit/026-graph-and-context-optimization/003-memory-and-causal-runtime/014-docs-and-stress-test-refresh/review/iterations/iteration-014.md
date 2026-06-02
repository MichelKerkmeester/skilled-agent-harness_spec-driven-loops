# Deep Review Iteration 014

## Dimension

Adversarial verification: re-verify each active P1 finding against source with a hunter+skeptic pass. Parallel-mode constraint honored: no shared state log, registry, or strategy writes; existing findings are classified here without duplicate registry finding emission.

## Files Reviewed

| File | Evidence |
|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-config.json` | Scope and lineage: lines 16, 30-37, 104-180 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json` | Active P1 set: lines 11-212 |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts` | Local replay model and assertions: lines 76-96, 128-140, 162-171 |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Production replay/classification source: lines 28-42, 113-127, 595-604, 607-638 |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Front-proxy lifecycle wording: lines 254-255 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md` | ServerInfo/tool-count traceability: lines 72-84 |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Runtime serverInfo: lines 1012-1015 |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Package version: line 3 |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Tool-count claim: lines 48-60 |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Canonical tool array: lines 670-716 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec.md` | Parent active-child claim: line 119 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/graph-metadata.json` | Derived status and active-child pointer: lines 41, 65, 97-98 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/001-self-maintaining-index/implementation-summary.md` | Child completion state: lines 14-16, 39, 60-63 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/002-checkpoint-v2-file-snapshot/implementation-summary.md` | Child completion/deployed state: lines 16-17, 46, 68-76, 114-116 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy/implementation-summary.md` | Child completion/deployed state: lines 16-17, 46, 55-68, 121-127 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/005-checkpoint-needs-rebuild-sentinel/implementation-summary.md` | Child completion/deployed state: lines 16-17, 38, 61-63, 83 |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md` | Checkpoint stress summary claim: line 21 |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts` | Actual checkpoint stress invariant: lines 180-196 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` | Checkpoint limit and restore source: lines 1006-1015, 2489-2555, 2972-3033 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/checkpoints-v2-create.vitest.ts` | Create-time pruning assertion: lines 182-190 |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/040-index-scan-phased-async-refinements.md` | EX-039 move-reconcile prompt and expected result: lines 63-74 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Reconcile call gate: lines 664-667 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts` | Reconcile matching constraints: lines 500-515, 538-546, 551-579 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-move-reconcile.vitest.ts` | Supported happy path: lines 87-100 |
| `code_graph_status` | Structural graph unavailable for trusted traversal: stale, full scan required |

## Findings by Severity

### P0

None.

### P1

No new P1 findings emitted. Six existing P1 findings remain confirmed and should stay active; they are not duplicated in the registry because this is a parallel-mode delta-only pass.

| Existing finding | Adjudication | Claim | Evidence refs | Counterevidence sought | Alternative explanation | Final severity | Confidence | Downgrade trigger |
|---|---|---|---|---|---|---|---|---|
| `R1-P1-001` | Confirmed | The daemon recycle stress still tests a local replay loop instead of the production `replaySnapshot()` closure. | Stress local model at `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:76`; production replay closure at `.opencode/bin/lib/launcher-session-proxy.cjs:595`; test invokes local model at `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:130`. | Checked whether `__testing` exported production replay; reviewed exported testing surface and production closure. | The copied loop intentionally mirrors production and still validates `classifyFrame`, but it cannot catch drift in the production closure itself. | P1 | High | Downgrade only if the test drives an exported production replay helper or a real proxy recycle path instead of a copy. |
| `R10-P1-001` | Confirmed | README still labels the proxy replay boundary as read-only while source replays `memory_save`. | README wording at `.opencode/skills/system-spec-kit/mcp_server/README.md:254`; replayable set includes `memory_save` at `.opencode/bin/lib/launcher-session-proxy.cjs:28`; classifier permits it at `.opencode/bin/lib/launcher-session-proxy.cjs:125`. | Checked adjacent README error-code row and source replay classifier. | The README may use “read-only” as shorthand for safe-to-replay, but source implements a broader read plus idempotent-write boundary. | P1 | High | Downgrade if docs say “read and idempotent-write tools” or explicitly call out `memory_save` dedup semantics in the boundary row. |
| `R13-P1-001` | Confirmed | 013 continuity surfaces still disagree on resume target and shipped/deployed state. | Parent spec says active child is `002` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec.md:119`; graph metadata points to `003` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/graph-metadata.json:97`; graph metadata status is complete at line 41 while derived entities still include `In Progress` at line 65; multiple child summaries record shipped/deployed completion, including `002` at lines 16-17 and `003` at lines 16-17. | Checked parent metadata plus 001/002/003/005 implementation summaries for current state. | The stale active-child sentence may be leftover resume guidance, but it directly contradicts the machine resume pointer. | P1 | High | Downgrade after parent spec, graph metadata, and child summaries agree on complete state and the active/resume child. |
| `R3-P1-001` | Confirmed | README-cluster implementation summary still cites pre-fix serverInfo `1.7.2` after source is `1.8.0`. | Summary cites `version: '1.7.2'` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md:72`; source has `version: '1.8.0'` at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`; package version is `1.8.0` at `.opencode/skills/system-spec-kit/mcp_server/package.json:3`. | Checked both runtime serverInfo and package metadata. | The summary describes what was verified before the later fix, but its “deployed source anchor” wording now reads as current-state traceability. | P1 | High | Downgrade after the summary explicitly distinguishes historical pre-fix evidence from current `1.8.0` state. |
| `R3-P1-002` | Confirmed | Feature catalog tool-count traceability contradicts the canonical `TOOL_DEFINITIONS` array. | Catalog says `TOOL_DEFINITIONS.length` is 55 at `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48`; canonical array starts at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:670` and lists 36 tool definitions through line 716; catalog also references a 54-tool server count at `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:60`. | Checked the actual aggregated tool array rather than relying on surrounding docs. | The catalog may be mixing cross-MCP/native surfaces, but it explicitly names `TOOL_DEFINITIONS.length` as the source, so the claim is wrong as written. | P1 | High | Downgrade after the catalog uses the actual server count or clearly names a different counted surface. |
| `R9-P1-001` | Confirmed | EX-039 overstates move reconciliation by saying packet_id plus doc type is enough, while source requires narrower sibling-rename and uniqueness conditions. | Playbook expectation at `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/040-index-scan-phased-async-refinements.md:63`; handler only attempts reconciliation when both delete and index candidate sets exist at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:664`; implementation requires new graph metadata, same basename, same grandparent, and exactly one old row at `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:500`, `:538`, `:551`; happy-path test models a sibling folder rename at `.opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-move-reconcile.vitest.ts:87`. | Checked handler gate, implementation constraints, and the dedicated unit test. | The operator prompt may intend a sibling folder rename, but it says “moved file to a new path” and “packet_id + doc type,” which is broader than source. | P1 | High | Downgrade if the playbook narrows the scenario to supported sibling folder renames with unchanged basename and unique old row. |

### P2

One existing P1 should be downgraded to P2 rather than remain a required fix.

| Existing finding | Adjudication | Claim | Evidence refs | Counterevidence sought | Alternative explanation | Final severity | Confidence | Re-escalation trigger |
|---|---|---|---|---|---|---|---|---|
| `R5-P1-001` | Downgrade to P2 | The durability README overstates checkpoint catalog boundedness after v2 restore cycles. | README says the catalog stays bounded at `MAX_CHECKPOINTS` at `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:21`; stress test now states catalog rows may outnumber on-disk dirs after restore at `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:180`; actual assertion bounds live directories, not catalog rows, at lines 193-196; create-time pruning exists at `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1006` and is unit-tested at `.opencode/skills/system-spec-kit/mcp_server/tests/checkpoints-v2-create.vitest.ts:182`. | Checked whether runtime restore path enforces catalog pruning and whether stress expectations still assert catalog length. | The README uses “catalog” imprecisely where the current stress source distinguishes catalog rows from live snapshot directories. | P2 | Medium-high | Re-escalate if docs/checklists use the false catalog-bound claim as a release gate or if restore starts leaking unbounded on-disk snapshot directories. |

## Traceability Checks

| Protocol | Result | Evidence |
|---|---|---|
| `spec_code` | Partial pass with confirmed drift | Runtime/version and tool-schema source checked against docs; active P1s remain for serverInfo, tool count, replay boundary, and move reconciliation. |
| `checklist_evidence` | Not fully re-run in this slice | Assigned dimension was existing P1 adversarial verification, not full checklist closure. |
| `skill_agent` | Not applicable | No skill/agent behavior was in the active P1 set beyond docs traceability. |
| `agent_cross_runtime` | Not applicable | No cross-runtime agent behavior was in the active P1 set. |
| `feature_catalog_code` | Confirmed drift | `feature_catalog.md:48` conflicts with `tool-schemas.ts:670-716`. |
| `playbook_capability` | Confirmed drift | EX-039 expected behavior is broader than `incremental-index.ts:500-579`. |

## SCOPE VIOLATIONS

None. No reviewed target files, shared state files, registry files, or strategy files were modified.

## Verdict

CONDITIONAL. The iteration adds no new findings, but six active P1s survived adversarial re-verification; one prior P1 should be downgraded to P2.

## Next Dimension

Continue with merger/reducer synthesis of the classification delta, then remediation planning for the confirmed P1 set.

Review verdict: CONDITIONAL
