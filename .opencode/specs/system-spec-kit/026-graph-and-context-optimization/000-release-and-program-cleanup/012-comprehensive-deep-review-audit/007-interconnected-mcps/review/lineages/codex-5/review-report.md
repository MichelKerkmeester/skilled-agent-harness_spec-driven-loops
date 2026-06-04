# Deep Review Report: Interconnected MCPs

## 1. Executive Summary
Verdict: FAIL. Active findings: P0=1, P1=3, P2=5. `hasAdvisories=true`.

The release blocker is F001: `fanout-run.cjs` records child CLI exit codes but returns them as fulfilled worker outputs, so `runCappedPool()` counts failed lineages as successes and the runner can exit `0` even when every CLI subprocess failed. The loop reached all four review dimensions and three stabilization passes, but legal stop was blocked by the active P0; synthesis ran at the max-iteration ceiling.

## 2. Planning Trigger
Route to remediation planning. Fix F001 first because it invalidates fan-out result trust. Then fix F002 and F003 so fan-out actually runs at the configured parallelism and honors lineage depth.

## 3. Active Finding Registry
| ID | Severity | Dimension | Evidence | Summary |
|---|---|---|---|---|
| F001 | P0 | correctness | `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362`, `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:85`, `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:207`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:376` | Non-zero child CLI statuses are returned as normal worker output, counted as fulfilled, and omitted from the runner exit-code decision. |
| F002 | P1 | correctness | `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:307`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344`, `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174` | `spawnSync()` blocks the event loop inside the async pool worker, serializing CLI lineages despite `concurrency`. |
| F003 | P1 | correctness | `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:291`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:122` | `iterations` is documented as a per-lineage max-iteration override, but only sizes subprocess timeout and is absent from the lineage prompt/config. |
| F004 | P1 | security | `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:13`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:174`, `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:756` | Codex dispatch emits `default` or `null` service-tier values that are outside the validated schema values. |
| F005 | P2 | security | `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:83`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:320`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344` | The prompt tells lineages to write only inside the lineage directory, but the default sandbox grants workspace-write. |
| F006 | P2 | traceability | `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:953`, `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:865` | Bootstrap guidance says stale `code_graph_query` still works, but the handler blocks any non-fresh graph. |
| F007 | P2 | traceability | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/spec.md:26` | The slice scopes `system-code-graph/mcp_server/scripts`, but that directory does not exist; entry points live under handlers/tools plus top-level scripts. |
| F008 | P2 | maintainability | `.opencode/skills/deep-loop-runtime/SKILL.md:155`, `.opencode/skills/deep-loop-runtime/SKILL.md:249` | The skill still says scripts has four files while the same section lists fan-out scripts too. |
| F009 | P2 | maintainability | `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:14` | Code comments retain phase-number placeholder labels, violating durable-comment hygiene for code. |

## 4. Remediation Workstreams
1. Fan-out correctness: F001, F002, F003.
2. Executor contract hardening: F004, F005.
3. Cross-MCP documentation and degraded-state guidance: F006, F007, F008.
4. Code hygiene cleanup: F009.

## 5. Spec Seed
Add acceptance criteria covering failed-lineage accounting, real subprocess overlap under `concurrency > 1`, and per-lineage `iterations` propagation into the loop prompt/config. Add a doc-sync criterion for code-graph stale-state guidance.

## 6. Plan Seed
1. Change fanout-run worker settlement so non-zero child status rejects or marks the pool result failed, and add all-failed/some-failed tests.
2. Replace synchronous fan-out subprocess execution with async `spawn` or wrap the worker so each child process can run concurrently.
3. Pass `iterations` into the lineage prompt/config as the max loop bound and test it.
4. Emit Codex `service_tier` only when non-null and valid, or extend the schema if `default` is a real supported value.
5. Update stale code-graph guidance and stale doc counts.

## 7. Traceability Status
| Protocol | Status | Notes |
|---|---|---|
| spec_code | partial | Primary fan-out concerns confirmed; target scope has stale path text. |
| checklist_evidence | partial | No checklist.md exists for this Level 1 slice. |
| feature_catalog_code | pass | Code-graph and skill-advisor tool registrations matched the package surfaces. |
| playbook_capability | partial | Graceful degradation works in handlers, but bootstrap guidance has stale-query drift. |

## 8. Deferred Items
P2 advisories F005-F009 can wait behind F001-F004, but they should not be dropped: they affect review write-scope safety, operator routing, and follow-on maintainability.

## 9. Audit Appendix
Iterations completed: 7. Dimensions covered: correctness, security, traceability, maintainability. Last three `newFindingsRatio` values: 0.000, 0.000, 0.000. Legal stop was blocked twice by `p0ResolutionGate`; final synthesis used `maxIterationsReached`.

Graph-aware review degraded to direct reads and `rg` because Code Graph was unavailable in session startup context. Advisor drift for `skill_graph_propagate_enhances` was ruled out after verifying registration in `tools/skill-graph-tools.ts` and handler wiring in `handlers/skill-graph/propagate-enhances.ts`.
