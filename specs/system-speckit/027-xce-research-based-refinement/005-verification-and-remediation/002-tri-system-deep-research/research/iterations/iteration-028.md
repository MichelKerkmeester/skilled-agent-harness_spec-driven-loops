# Iteration 028 — Angle 28

**Angle:** Apply sub-operations truth: rescan/prune-excludes/repair-nodes/recover-sqlite-corruption/rollback-bad-apply vs playbook and docs coverage.

**Summary:** The apply sub-operation docs and playbook overstate safety and observability for several paths. The most material gaps are missing operation-specific destructive confirmations, rollback target selection being invalidated by pre-dispatch snapshotting, and prune/repair paths whose production behavior does not match the manual scenario.

**Findings kept:** 6

## [P1][BUG] recover-sqlite-corruption can mutate without confirm outside hard-stale state

- Evidence: .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:415-428 only gates confirm when classification.state === "hard-stale"; .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:268-276 dispatches recover-sqlite-corruption without an operation-specific confirm check; .opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:171-176 closes/copies/moves the DB triplet and starts a full scan; .opencode/skills/system-code-graph/manual_testing_playbook/doctor-code-graph/code-graph-apply-sub-operations.md:50-56 expects refusal without confirm:true.
- Detail: The playbook treats recover-sqlite-corruption as confirm-gated, but the code only requires confirm for hard-stale classification. On a fresh or soft-stale graph, an explicit recover-sqlite-corruption call can proceed to DB quarantine/rebuild without confirm.
- Fix sketch: Add operation-specific confirm gates for destructive operations before snapshot/dispatch, independent of staleness classification.

## [P1][BUG] rollback-bad-apply snapshots the current DB before trying to restore a prior baseline

- Evidence: .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:446-455 creates a known-good snapshot before every non-dry-run dispatch; .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:277-284 dispatches rollback-bad-apply; .opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:135-148 selects the lexicographically latest known-good directory; .opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:261-268 moves current DB and restores that latest snapshot.
- Detail: For an explicit rollback-bad-apply operation, the orchestrator first records the current state as known-good, then rollback selects the newest known-good snapshot. That makes manual rollback restore the just-created snapshot rather than the previous good baseline promised by the playbook.
- Fix sketch: Do not create a new known-good snapshot for rollback-bad-apply, and select a rollback target from metadata or a pre-existing snapshot older than the current apply run.

## [P1][DOC-DRIFT] rollback-bad-apply dry-run cannot report the rollback target

- Evidence: .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:431-443 returns generic dry-run data and skips operation dispatch; .opencode/skills/system-code-graph/manual_testing_playbook/doctor-code-graph/code-graph-apply-sub-operations.md:58-67 says rollback-bad-apply dry-run reports the prior baseline.
- Detail: The dry-run path runs batteries and classification only, then returns before rollbackBadApply can resolve or report a knownGoodDir. The playbook's expected operator signal is therefore not produced by current code.
- Fix sketch: Add a rollback preview path that resolves the intended known-good target without moving files, or update the playbook to state that dry-run is only generic.

## [P1][BROKEN-FEATURE] prune-excludes cannot classify real MCP requests because the confidence artifact path is never wired

- Evidence: .opencode/skills/system-code-graph/mcp_server/handlers/apply.ts:20-25 calls applyCodeGraph(args) with no ApplyOrchestratorOptions; .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:287-291 returns every supplied pattern as tier:"unknown" when excludeRuleConfidencePath is absent; .opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:127-145 only exercises classification by injecting excludeRuleConfidencePath in test options.
- Detail: The production handler never supplies the artifact path required to load exclude-rule confidence, so prune-excludes cannot perform the tiered classification exercised by tests. Real tool calls will report unknown tiers and skip the intended prune behavior.
- Fix sketch: Define a canonical confidence artifact location and pass it from the handler/orchestrator defaults, with a test that uses the public handler path.

## [P1][DOC-DRIFT] prune-excludes playbook says classification-only, but code mutates when classification is available

- Evidence: .opencode/skills/system-code-graph/manual_testing_playbook/doctor-code-graph/code-graph-apply-sub-operations.md:31-39 describes prune-excludes as "no mutation" and lists candidates only; .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:301-309 builds excludeGlobs and runs scan({ incremental:false, excludeGlobs }) for classified high/medium/low entries.
- Detail: The playbook presents prune-excludes as a safe classification preflight, but the implementation applies a full scan with excludeGlobs once patterns are classified and gates pass. Operators following the playbook could accidentally run a mutating prune path.
- Fix sketch: Require dryRun:true in the classification-only playbook step, or split prune-excludes into explicit preview and apply modes.

## [P1][BUG] repair-nodes missing crashRootCauseAddressed returns committed no-op instead of refusal

- Evidence: .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:313-321 returns repairNodes.skippedReason when crashRootCauseAddressed is not true; .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:508-518 then records status:"committed" after postflight passes; .opencode/skills/system-code-graph/manual_testing_playbook/doctor-code-graph/code-graph-apply-sub-operations.md:41-48 expects requiredAction:"set_crash_root_cause_addressed" or equivalent refusal.
- Detail: The operation does not fail closed when the required safety flag is missing. It can surface as a successful committed apply even though the repair operation was skipped.
- Fix sketch: Return an aborted/blocked result with requiredAction when crashRootCauseAddressed is missing, before snapshot and postflight commit handling.
