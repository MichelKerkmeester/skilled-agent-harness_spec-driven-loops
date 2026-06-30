# Deep Review Strategy

## Topic

Review target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps`

Session: `fanout-codex-2-1780596001497-312vj2`

## Review Dimensions

- [x] correctness - completed in iteration 001, verdict CONDITIONAL
- [x] security - completed in iteration 002, verdict PASS
- [x] traceability - completed in iteration 003, verdict PASS
- [x] maintainability - completed in iteration 004, verdict CONDITIONAL
- [x] stabilization replay - completed in iteration 005, verdict PASS

## Completed Dimensions

| Dimension | Iteration | Result |
|---|---:|---|
| correctness | 001 | Found two P1 fan-out contract bugs. |
| security | 002 | No P0/P1 security finding. Workspace-write is documented as a broad worktree sandbox, not artifact-only enforcement. |
| traceability | 003 | Found one P2 stale-graph guidance drift. |
| maintainability | 004 | Found one P1 comment-hygiene policy drift. |
| stabilization-replay | 005 | No new findings; active registry stable. |

## Running Findings

| Severity | Active |
|---|---:|
| P0 | 0 |
| P1 | 3 |
| P2 | 1 |

## Cross-Reference Status

| Protocol | Gate | Status | Evidence |
|---|---|---|---|
| spec_code | hard | partial | Spec lines 61-64 mapped to runtime seams; F001-F003 recorded. |
| checklist_evidence | hard | partial | No checklist.md exists for this Level 1 slice; spec requirements used as the completion basis. |
| feature_catalog_code | advisory | partial | Fan-out catalog matches files but misses the real concurrency behavior of the synchronous worker. |
| playbook_capability | advisory | partial | Fan-out playbook verifies primitive concurrency and isolation, but not delayed subprocess overlap in the driver. |

## Files Under Review

| File | Coverage |
|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/spec.md` | read |
| `.opencode/skills/system-code-graph/SKILL.md` | sampled |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts` | read |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | read |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | read |
| `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts` | read |
| `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts` | read |
| `.opencode/skills/system-code-graph/references/runtime/tool_surface.md` | read |
| `.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md` | read |
| `.opencode/skills/system-skill-advisor/SKILL.md` | read |
| `.opencode/skills/system-skill-advisor/references/runtime/tool_ids_reference.md` | read |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts` | read |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` | read |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` | read |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts` | read |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | sampled |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | read |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | read |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | read |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | sampled |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | read |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | read |

## Known Context

`resource-map.md` was not present in the target spec folder at init. Resource-map coverage gate skipped.

Code Graph MCP was unavailable in the startup context, so structural review used Grep and direct reads.

The `cli-codex` executor setting is recorded as lineage metadata. This runtime is already Codex, so the cli-codex self-invocation guard prevented nested Codex dispatch.

## What Worked

- Direct read of fan-out driver plus pool primitive exposed the synchronous worker mismatch.
- Comparing system-spec-kit recovery hints with code-graph read-path predicates exposed the stale-state guidance drift.
- Grep for forbidden durable-comment markers caught isolated policy drift in reviewed code.

## What Failed

- Code graph structural enrichment was unavailable, so impact radius was bounded by direct file reads and exact searches.

## Exhausted Approaches

- Tool ID drift in skill-advisor: checked descriptor and dispatch layers; no active missing-ID finding recorded.
- P0 search in security-sensitive executor defaults: no P0 evidence found; workspace-write risk is documented and worktree-scoped for this campaign.

## Ruled-Out Directions

- Treating the stale graph hint as correctness P1 was ruled out because the code-graph read path blocks safely; the issue is operator guidance drift.
- Treating fanout-pool itself as broken was ruled out; the primitive admits concurrent promises correctly. The bug is the synchronous real worker.

## Next Focus

Synthesis complete. Remediation should target F001 and F002 first because they affect fan-out runtime behavior and budget correctness.

## Review Boundaries

- Read-only review of target code.
- Artifact writes restricted to this lineage directory.
- Max iterations configured: 7.
- Iterations completed: 5.
- Final verdict: CONDITIONAL.

## Non-Goals

- No implementation fixes.
- No changes to reviewed files.
- No memory save outside this lineage.

## Stop Conditions

- All four dimensions covered.
- Required traceability protocols executed or marked not applicable.
- Stabilization iteration completed with no new P0/P1 findings.
- Final report synthesized.
