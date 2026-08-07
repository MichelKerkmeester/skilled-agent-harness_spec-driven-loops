# Deep Review v4 Iteration 048 - cross-packet doc currency

## Focus

Check `SETUP_A_RECIPE`, parent phase map, handover, and adjacent child docs after 012.

## Findings

| ID | Severity | Location | Evidence | Recommendation |
|----|----------|----------|----------|----------------|
| P1-V4-DOC-001 | P1 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/handover.md:3` | The handover frontmatter still says "Eleven packets shipped; 012 v3 remediation is in progress" and `recent_action`/`next_safe_action` repeat that 012 still needs validation and commit. Later body text partially says 012 completed, so resume readers get contradictory state. | Refresh handover to 12 packets shipped, commit `42aa114e3`, and no remaining 012 commit/validation action. |
| P2-V4-DOC-002 | P2 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/SETUP_A_RECIPE.md:83` | The recipe's q8 filename examples use the wrong sanitized basename, same as 012. The verification command at line 93 will not match the actual q8 file emitted by `EmbeddingProfile`. | Use `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite` or avoid hard-coded slug details. |
| P2-V4-DOC-003 | P2 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/007-voyage-cleanup-and-egress-monitoring/scratch/tcpdump-verify.sh:5` | The tcpdump script now uses `pktap`, but its header still says Setup A is "hf-local memory + Qwen3 cocoindex" after 012 says EmbeddingGemma on both surfaces. | Update the comment while leaving the functional `TCPDUMP_IFACE` behavior intact. |

## Notes

The parent phase map now includes 001-012, which resolves `P1-V3-PARENT-001`. The parent metadata still says "In Progress (012 v3 remediation)" at `spec.md:49`, but the phase map itself is current.
