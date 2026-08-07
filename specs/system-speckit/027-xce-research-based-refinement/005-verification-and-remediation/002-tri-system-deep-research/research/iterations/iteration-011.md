# Iteration 011 — Angle 11

**Angle:** Causal-edge hygiene after row deletion: 314 orphaned rows were cleaned — do causal edges referencing deleted ids linger; tombstone propagation.

**Summary:** Most primary deletion paths now tombstone causal edges before deleting rows, but cleanup-index-scope-violations still bypasses that lifecycle. Edges referencing deleted ids can therefore linger until health auto-repair, contradicting the claimed all-delete-path tombstone coverage.

**Findings kept:** 2

## [P1][BUG] cleanup-index-scope-violations deletes memory rows without causal-edge cleanup

- Evidence: .opencode/skills/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:321-375 deletes reference rows and memory_index rows; same function has no causal_edges delete/tombstone path. .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:911-919 defines orphaned edges as causal_edges whose source/target is missing from memory_index, and :927-953 only removes them later via cleanupOrphanedEdges().
- Detail: The cleanup script can delete memory_index ids while leaving active causal_edges rows that point at those deleted ids. Tombstone propagation is delayed until a separate confirmed health auto-repair run, so causal edges referencing deleted ids can linger after the row-deletion operation.
- Fix sketch: Route cleanup-index-scope-violations memory-row deletion through delete_memory_from_database() or sweepCausalEdges() before deleting memory_index rows, and add a regression test with a causal_edges row.

## [P1][DOC-DRIFT] Tombstone docs claim CLI cleanup is covered, but one cleanup CLI bypasses it

- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/003-memory-index-causal-lifecycle/changelog-003-002-causal-tombstone-sweep.md:23 claims every active production delete path, including CLI cleanup, routes through the tombstone helper; .opencode/skills/system-spec-kit/feature_catalog/analysis/causal-tombstone-sweep-and-metadata-edge-promoter.md:25 repeats the same claim. .opencode/skills/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:373-375 directly deletes memory_index rows.
- Detail: The documentation overstates shipped coverage for causal-edge tombstone propagation. The cleanup-index-scope-violations operational CLI is documented elsewhere as the operator maintenance path for pre-existing pollution, but its apply path does not call the tombstone sweep.
- Fix sketch: After fixing the script path, update the tombstone docs to name the covered cleanup CLIs precisely and add the cleanup-index-scope regression evidence.
