# Deep Review Iteration 009

## Dimension

- Focus: correctness - manual_testing_playbook EX-037..EX-042 scenario executability vs real tool behavior and cited source anchors.
- Mode: review.
- Scope class: complex.
- Graph coverage: graphless fallback. `code_graph_status` reported stale readiness because git HEAD changed, 325 stale files exceeded the selective threshold, and 2013 tracked files no longer exist on disk.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18` - severity doctrine loaded before final calls.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-config.json:104` - review scope manifest.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:240` - prior coverage checked for duplicate avoidance.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:769` - EX-037 root index entry.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:782` - EX-038 root index entry.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:795` - EX-039 root index entry.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:808` - EX-040 root index entry.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:821` - EX-041 root index entry.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:834` - EX-042 root index entry.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:40` - EX-037 create commands and v2 expected fields.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/post-insert-enrichment-lifecycle-v30.md:68` - EX-038 repair-on-replay command.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/index-scan-phased-async-refinements.md:63` - EX-039 move-reconciliation command.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:45` - EX-040 proxy error-contract command.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/sk-git-worktree-convention.md:40` - EX-041 numbering command.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-needs-rebuild-self-heal.md:40` - EX-042 boot repair command.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2181` - checkpoint v2 create implementation.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2489` - checkpoint v2 restore implementation.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:192` - enrichment repair status guard.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:664` - scan move reconciliation call site.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:500` - move reconciliation candidate construction.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:529` - move reconciliation sibling-rename matching constraint.
- `.opencode/bin/lib/launcher-session-proxy.cjs:18` - retryable recycle error contract.
- `.opencode/bin/lib/launcher-session-proxy.cjs:607` - protocol mismatch fail-closed branch.
- `.opencode/skills/sk-git/SKILL.md:291` - numbered worktree convention.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:422` - boot-time checkpoint sentinel repair.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:214` - scan-time checkpoint sentinel repair.

## Findings by Severity

### P0

- None.

### P1

#### R9-P1-001 [P1] EX-039 overstates when move reconciliation will fire

- Claim: EX-039 is executable as a packet-identity move validation: moving a tracked spec doc to a new path under the same packet identity should produce `moveReconciled > 0` and update the row in place without re-embedding.
- Evidence: The playbook tells the operator to "Move a tracked spec doc to a new path under the same packet identity" and expects the scan to match vanished paths to new paths by `packet_id` plus doc type. The real implementation builds packet identity only from the new location's `graph-metadata.json`, then reconciles an old path only when it has the same basename and the same grandparent directory as the new path. It does not read or compare the old path's packet id; it is a sibling spec-folder rename heuristic, not a general "same packet identity" move. [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/index-scan-phased-async-refinements.md:63`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/index-scan-phased-async-refinements.md:74`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:500`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:529`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:538`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:546`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:563`]
- Counterevidence sought: Checked whether source or tests prove a broader old-vs-new packet-id match. The move-reconcile test covers the same sibling-folder case: old `/workspace/specs/old-name/spec.md` to new `/workspace/specs/new-name/spec.md`; it does not cover cross-parent moves, different basenames, or verifying the old packet id. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-move-reconcile.vitest.ts:77`]
- Alternative explanation: The playbook may intend "same packet identity" to mean a sibling spec-folder rename with the same document basename, but that precondition is not stated in the command or expected result, so a manual tester can follow the scenario with another same-packet move and get a false failure.
- Final severity: P1.
- Confidence: 0.88.
- Downgrade trigger: Downgrade only if a separate source proves broad old/new packet-id reconciliation, or if the playbook is constrained to the actual sibling-folder-rename preconditions and sandbox/revert workflow.
- Finding class: matrix/evidence.
- Scope proof: Exact searches and direct reads covered the EX-039 playbook entry, its master-index entry, the scan call site, the move-reconcile implementation, and the move-reconcile unit test. No prior registry finding covered this EX-039 scenario-specific overstatement.
- Recommendation: Revise EX-039 to state the actual executable preconditions: rename a spec folder within the same parent, keep the same document basename/doc type, ensure the new folder has `graph-metadata.json.packet_id`, run in a disposable workspace or worktree, and expect `moveReconciled` only for that sibling-rename case. Alternatively expand `reconcileMoves` if broader packet-identity moves are required.

### P2

- None.

## Traceability Checks

- `playbook_capability`: FAIL for EX-039. The documented move scenario is broader than the implementation's same-grandparent/same-basename reconcile path.
- `spec_code`: FAIL for EX-039. The code/source anchor proves an implementation constraint not represented in the scenario command.
- `checklist_evidence`: N/A for this slice; no checklist rows were adjudicated in iteration 009.
- `feature_catalog_code`: PARTIAL. EX-037, EX-038, EX-040, EX-041, and EX-042 sampled anchors matched source behavior; EX-039 needs a narrower capability statement.
- `code_graph`: BLOCKED. Structural graph traversal was not used because the code graph was stale; direct reads and exact searches provided graphless fallback coverage.

## SCOPE VIOLATIONS

- None. Reviewed target files were read-only; no fixes were applied.

## Verdict

- CONDITIONAL. One new P1 correctness finding was recorded for EX-039 scenario executability.

## Next Dimension

- Continue reducer-driven stabilization or synthesis planning after merging the parallel delta. Prior open P1s still keep the overall review loop conditional.
Review verdict: CONDITIONAL
