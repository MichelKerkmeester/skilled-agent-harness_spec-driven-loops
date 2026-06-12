# Iteration 027 — Angle 27

**Angle:** code_graph_apply default routing safety: bare apply routes to staleness-based rescan — observed long-running call; confirm guards, document expected duration, consider explicit-operation requirement at the CLI layer.

**Summary:** Bare apply is intentionally accepted today and routes to rescan, with hard-stale confirm protection but soft-stale mutation still possible. The bigger guard gaps are explicit destructive operations and repair-nodes refusal semantics, plus missing CLI duration guidance.

**Findings kept:** 5

## [P1][BUG] Destructive apply operations can run without confirm on non-hard-stale graphs

- Evidence: .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:400-429, .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:268-285, .opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:171-177, .opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:261-279
- Detail: The confirm gate is tied only to classification.state === 'hard-stale'. If a caller explicitly requests recover-sqlite-corruption or rollback-bad-apply while the graph classifies fresh or soft-stale, the code bypasses the fresh noop path and reaches procedures that move/restore the DB triplet and run a scan.
- Fix sketch: Require confirm:true for recover-sqlite-corruption and rollback-bad-apply regardless of staleness classification, before snapshot or dispatch.

## [P1][BUG] repair-nodes missing crash-root-cause acknowledgement reports committed

- Evidence: .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:313-320, .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:446-451, .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:508-518, .opencode/skills/system-code-graph/manual_testing_playbook/08--doctor-code-graph/code-graph-apply-sub-operations.md:41-48
- Detail: The docs expect repair-nodes without crashRootCauseAddressed to refuse with a required action. The implementation instead creates the known-good snapshot, returns a skippedReason from dispatch, runs postflight, records metadata, and returns status:'committed', which can mislead automation into thinking repair ran.
- Fix sketch: Promote the crashRootCauseAddressed check to a pre-dispatch abort/noop path with a refusal status and requiredAction before snapshotting.

## [P2][REFINEMENT] Bare CLI apply accepts empty args and can mutate through soft-stale rescan

- Evidence: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:147-169, .opencode/specs/system-spec-kit/027-xce-research-based-refinement/027-finding-remediation/playbook-report.md:52-64, .opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:590-600, .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:230-235, .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:261-266
- Detail: The no-required-fields behavior is documented as intentional, and the CLI only enforces the shared schema. That means node .opencode/bin/code-index.cjs code_graph_apply with no JSON is valid and defaults to rescan; hard-stale is guarded by confirm, but soft-stale performs an incremental index mutation without an explicit operation.
- Fix sketch: At the CLI layer only, require an explicit operation for code_graph_apply unless an opt-in flag such as --allow-default-apply is passed.

## [P2][DOC-DRIFT] Apply-mode duration expectations are not documented

- Evidence: .opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:25-26, .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:372-383, .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:453-480, .opencode/skills/system-code-graph/mcp_server/lib/gold-query-verifier.ts:327-347, .opencode/skills/system-code-graph/references/runtime/tool_surface.md:48-56
- Detail: The CLI has a 30000ms default request timeout, while apply runs a preflight battery, operation dispatch, and postflight battery; the battery loop itself has no per-query timeout in this layer. The public tool-surface table documents token budget and preconditions but not wall-clock expectations or the fact that a default rescan path may spend time in two batteries plus indexing.
- Fix sketch: Document expected apply-mode duration, the 30s CLI default, when to raise --timeout-ms, and that dryRun still runs both batteries.

## [P2][DOC-DRIFT] Doctor route exposes rollback-bad-run but apply schema uses rollback-bad-apply

- Evidence: .opencode/commands/doctor/_routes.yaml:76-83, .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:154-157
- Detail: The doctor code-graph route advertises --operation=rollback-bad-run, but the actual code_graph_apply enum accepts rollback-bad-apply. Any future explicit-operation CLI or doctor flow using the route value would fail schema validation or require a translation layer.
- Fix sketch: Rename the doctor route flag value to rollback-bad-apply or add an explicit documented alias before validation.
