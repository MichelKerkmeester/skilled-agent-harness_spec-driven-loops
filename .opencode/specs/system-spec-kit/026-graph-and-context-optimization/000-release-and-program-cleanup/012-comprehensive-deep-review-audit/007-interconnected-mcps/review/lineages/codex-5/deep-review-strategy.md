# Deep Review Strategy

## Topic
Review: Interconnected MCPs Review Slice

## Review Charter
- Target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps`
- Mode: spec-folder
- Executor: `cli-codex` model `gpt-5.5`
- Artifact directory: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/lineages/codex-5`
- Resource map: not present at init; skipping resource-map coverage gate.

## Review Dimensions
- [x] correctness: fan-out result accounting, concurrency behavior, iteration-budget propagation
- [x] security: executor sandbox/write-boundary and CLI dispatch argument contracts
- [x] traceability: spec/code alignment, code-graph/advisor tool contracts, graceful degradation
- [x] maintainability: documentation drift, test coverage, code comment hygiene

## Completed Dimensions
| Dimension | Iterations | Summary |
|---|---:|---|
| correctness | 1, 5, 7 | Found release-blocking failed-lineage accounting plus required fan-out fixes. |
| security | 2, 6, 7 | Found Codex service-tier drift and prompt-only write-boundary enforcement. |
| traceability | 3, 6, 7 | Verified advisor tool registration; found stale code-graph guidance drift and stale spec scope. |
| maintainability | 4, 5, 7 | Found stale script-count docs and code-graph placeholder comments. |

## Running Findings
| Severity | Active | Finding IDs |
|---|---:|---|
| P0 | 1 | F001 |
| P1 | 3 | F002, F003, F004 |
| P2 | 5 | F005, F006, F007, F008, F009 |

## Cross-Reference Status
| Protocol | Gate | Status | Evidence |
|---|---|---|---|
| spec_code | hard | partial | The fan-out mismatch is confirmed; scope text still names a missing code-graph scripts directory. |
| checklist_evidence | hard | partial | Level 1 slice has no checklist.md; success criteria live in spec.md. |
| feature_catalog_code | advisory | pass | Code-graph and skill-advisor tool IDs are registered in package-local tool descriptors. |
| playbook_capability | advisory | partial | Code-graph degraded guidance still points stale callers at a blocked read path. |

## Files Under Review
| File | Coverage | Notes |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | high | F001, F002, F004 |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | high | Pool primitive works for promise workers; caller worker blocks it. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | high | F003, F005 |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | medium | CLI dispatch branch reviewed for Codex service-tier and sandbox defaults. |
| `.opencode/skills/system-code-graph/**` | medium | Tool IDs match; readiness guidance drift found through system-spec-kit bootstrap. |
| `.opencode/skills/system-skill-advisor/**` | medium | Tool IDs and internal propagate-enhances registration verified. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | medium | F006 |
| target `spec.md` | medium | F007 |

## What Worked
- Direct line-number reads were enough because Code Graph was unavailable in session startup context.
- Replaying fan-out from both the pool and runner surfaces exposed a caller/callee contract mismatch.
- Advisor registration required checking `tools/index.ts`, not only handler barrels.

## What Failed
- Code Graph MCP was unavailable, so structural queries were replaced with direct reads and `rg`.
- No resource-map.md or checklist.md existed for this Level 1 slice.

## Exhausted Approaches
- Rechecking `system-code-graph/mcp_server/scripts`: no such directory exists in this checkout.
- Treating `skill_graph_propagate_enhances` as missing: rejected after finding the descriptor and dispatch branch.

## Ruled Out Directions
- Advisor tool drift as a P1: the advertised tool is registered and trusted-caller gated.
- Code-graph runtime tool ID drift as a P1: the eight tool schema entries match the tool descriptor surface.

## Recommended Next Focus
Plan remediation for F001 first, then F002/F003. F001 invalidates fan-out result trust; fixing lower-severity drift before that would not make the lineage runner trustworthy.

## Review Boundaries
- Max iterations: 7
- Stop reason: maxIterationsReached after p0ResolutionGate blocked legal stop.
- Final verdict: FAIL
- Release readiness: release-blocking
