# Iteration 003 — Traceability

## Files reviewed
- `.opencode/specs/.../004-code-index-stack/` — spec folder structure for 013-018
- `.opencode/specs/.../004-code-index-stack/013-bench-harness-and-fixture-audit/` — spec artifacts
- `.opencode/specs/.../004-code-index-stack/016-query-expansion-identifier-bridging/` — spec artifacts
- `.opencode/specs/.../004-code-index-stack/017-hybrid-fusion-empirical-recalibration/` — spec artifacts
- `decision-record.md`:833-1029 — ADR-019 through ADR-021
- Git commits: 8364bdd5b, 38d4e2d62, 1638f6835 — commit message hygiene

## Findings

### P2 — ADRs for CocoIndex pipeline arc filed under embedder bake-off packet
**File**: `.opencode/specs/.../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`:833-1029
**Evidence**: ADR-019 (query expansion), ADR-020 (RRF recalibration), and ADR-021 (reranker verdict) are filed in the embedder bake-off decision record (`002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`), not in the CocoIndex pipeline packet (`016/004/013-018`). This creates a traceability mismatch — the ADRs document decisions for the CocoIndex retrieval pipeline arc, but they live in a different spec folder tree.
**Why it matters**: Future operators looking for CocoIndex ADRs will not find them in the CocoIndex spec folder. They'll need to know to look in the embedder bake-off folder instead. This breaks the principle that ADRs should be co-located with the code/spec they affect. It also makes it harder to understand the decision context for the 013-018 arc without cross-referencing multiple spec trees.
**Suggested fix**: Move ADR-019, ADR-020, and ADR-021 to a dedicated decision record in the `016/004/004-code-index-stack/` folder, or create a new decision record file there. Add cross-references in both locations if duplication is necessary. Alternatively, create a unified decision record for the entire 016 graph-and-context-optimization effort that contains all related ADRs.
**Dimension(s)**: traceability, documentation

### P2 — ADR-016 and ADR-017 not found in decision record
**File**: `.opencode/specs/.../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`:1-1077
**Evidence**: The decision record contains ADR-001 through ADR-021, but ADR-016 and ADR-017 are missing. Based on the naming pattern, these would correspond to packets 016 (query expansion) and 017 (RRF recalibration), but the actual decisions are documented in ADR-019 and ADR-020 instead. The numbering suggests a gap or renumbering occurred.
**Why it matters**: The ADR numbering is inconsistent, which makes it harder to trace decisions to packets. ADR-019 documents the query expansion decision (packet 016), and ADR-020 documents the RRF recalibration (packet 017), but the numbers don't match the packet IDs. This creates confusion about which ADR corresponds to which packet.
**Suggested fix**: Either renumber the ADRs to match packet IDs (e.g., move ADR-019 → ADR-016, ADR-020 → ADR-017) or add explicit cross-references explaining the numbering mismatch. Document why the numbering is inconsistent if there's a historical reason.
**Dimension(s)**: traceability, documentation

### P2 — Nomic promotion commit lacks ADR reference
**File**: Git commit 8364bdd5b
**Evidence**: The nomic promotion commit (8364bdd5b) is a follow-on to the 6-packet 016/004/013-018 arc, but it does not reference an ADR number. The commit message explains the empirical rationale (nomic ties bge-code-v1 on hit rate with ~10% lower median latency) and updates the default embedder, but there's no corresponding ADR documenting this decision.
**Why it matters**: The nomic promotion is a significant production change (swapping the default embedder), but it lacks the ADR documentation that the other 6 packets have. This breaks traceability — future operators won't find an ADR explaining why nomic was chosen over bge-code-v1. The decision is only documented in the commit message and benchmark report.
**Suggested fix**: Create ADR-022 (or appropriate number) to document the nomic promotion decision. Include the empirical evidence (hit rate tie, latency win), the rollback path, and the rationale for the follow-on nature of the decision. Add the ADR reference to the commit message.
**Dimension(s)**: traceability, documentation

### P2 — Spec folder 018 implementation-summary.md doesn't reference Lane A bug follow-up
**File**: `.opencode/specs/.../004-code-index-stack/018-rerank-matrix-rebench/implementation-summary.md`
**Evidence**: The commit message for 018 (38d4e2d62) mentions: "Lane A (no-rerank ablation) DEFERRED to follow-on packet: harness exhibited 32-sec/probe timeout under COCOINDEX_RERANK_ENABLED=false (hits=0). Bug is in the rerank-disabled dispatch path, not blocking the arc's primary question of 'which reranker wins'." However, this deferred follow-up is not tracked in the spec folder's implementation-summary.md or tasks.md as a known issue or follow-up packet.
**Why it matters**: The Lane A bug is a known issue that was explicitly deferred, but it's not tracked in the spec artifacts. Future operators reviewing the 018 packet won't know about this deferred bug unless they read the commit message carefully. This breaks traceability of known issues and follow-up work.
**Suggested fix**: Add a "Known Issues" or "Deferred Work" section to the 018 implementation-summary.md documenting the Lane A bug and its status. Create a follow-up task or packet reference if the bug is to be addressed later. Ensure the spec artifacts capture all deferred work, not just the commit messages.
**Dimension(s)**: traceability, documentation

### P2 — Cross-packet dependencies not explicitly documented in spec folders
**File**: Multiple spec folders (013-018)
**Evidence**: The commit messages explicitly reference the arc structure (e.g., "FINAL packet of the 6-packet CocoIndex future-proofing arc"), but the individual spec folders don't explicitly document their dependencies on previous packets. For example, 016's spec.md doesn't explicitly state "Depends on: 013 (corrected fixture), 014 (mirror dedup), 015 (tree-sitter chunking)".
**Why it matters**: While the commit messages provide good arc-level context, the spec folders themselves don't document the dependency graph. An operator looking at only the 016 spec folder won't immediately understand that it depends on the previous 3 packets. This makes it harder to understand the correct order of operations or the impact of reverting individual packets.
**Suggested fix**: Add explicit dependency documentation to each spec folder's spec.md or description.json. Include a "Dependencies" section listing previous packets that must be completed first. Consider adding a graph-metadata.json entry that explicitly encodes the dependency graph.
**Dimension(s)**: traceability, documentation

## Dimension coverage delta
- correctness: covered
- security: covered
- traceability: covered
- maintainability: partial
- code-quality: not-yet
- architecture: not-yet
- tests: partial
- documentation: partial
- performance: partial
- embedder-agnosticism: not-yet
- reranker-agnosticism: not-yet
- reproducibility: not-yet

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 0
New P2 in this iter: 5
