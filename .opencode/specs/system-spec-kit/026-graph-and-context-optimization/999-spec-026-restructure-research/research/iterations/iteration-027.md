I'm in read-only mode. Here is the iteration-027.md content that should be written to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-027.md`:

---

# Iter 027 — Track 7: completed + unreferenced packets

## Question / Evidence / Findings

### Per packet

**014-local-llama-cpp nested children (20 delete candidates from iter 008):**

| Packet | Ref count | Kinds | Verdict |
|--------|-----------|-------|---------|
| 006-bge-m3-hybrid-evaluation | 4 (research files only) | Research iteration references | Pure delete candidate - planning packet, never executed |
| 008-finalize-and-commit | 3 (research files only) | Research iteration references | Pure delete candidate - session-management artifact |
| 016-llama-cpp-retrieval-quality-probe | 3 (research files only) | Research iteration references | Pure delete candidate - measurement-only, informed 017 decision |
| 019-readme-resource-map | 3 (research files only) | Research iteration references | Pure delete candidate - research-only inventory |
| 020-catalog-playbook-alignment-audit | 3 (research files only) | Research iteration references | Pure delete candidate - research-only audit |
| 021-local-llm-legacy-review | 3 (research files only) | Research iteration references | Pure delete candidate - review artifact, part of deep-review remediation loop |
| 023-post-remediation-re-review | 3 (research files only) | Research iteration references | Pure delete candidate - review artifact, historical verification |
| 025-post-remediation-v2-re-review | 3 (research files only) | Research iteration references | Pure delete candidate - review artifact, historical verification |
| 026-llm-model-runtime-inventory | 3 (research files only) | Research iteration references | Pure delete candidate - research-only inventory |
| 026-post-batch-11-re-review | 3 (research files only) | Research iteration references | Pure delete candidate - review artifact, part of deep-review loop |
| 027-post-batch-12-final-re-review | 3 (research files only) | Research iteration references | Pure delete candidate - review artifact, historical verification |
| 030-post-029-final-re-review | 3 (research files only) | Research iteration references | Pure delete candidate - review artifact, historical verification |
| 031-post-batch-15-final-re-review | 3 (research files only) | Research iteration references | Pure delete candidate - review artifact, historical verification |
| 037-llama-cpp-embedding-worker-deep-dive | 3 (research files only) | Research iteration references | Pure delete candidate - research-only investigation |
| 041-llama-cpp-metal-investigation | 3 (research files only) | Research iteration references | Pure delete candidate - research-only, informed 014 ONNX decision |
| 043-cocoindex-coreml-ep-investigation | 3 (research files only) | Research iteration references | Pure delete candidate - research-only, informed 014 ONNX work |
| 045-session-deep-review-2026-05-14 | 1 (research only) | Research iteration reference | Pure delete candidate - placeholder with no description.json |
| 048-deep-review-cocoindex-wiring | 1 (research only) | Research iteration reference | Pure delete candidate - placeholder with no description.json |
| 054-code-folder-readmes | 3 (research files only) | Research iteration references | Pure delete candidate - documentation, consolidated in iter 010 |
| 055-root-readme-realignment | 3 (research files only) | Research iteration references | Pure delete candidate - documentation, consolidated in iter 010 |
| 056-root-readme-deep-research | 3 (research files only) | Research iteration references | Pure delete candidate - research-only, informed 057 rewrite |
| 057-root-readme-deeper-rewrite | 3 (research files only) | Research iteration references | Pure delete candidate - documentation, consolidated in iter 010 |
| 058-skill-md-realignment | 3 (research files only) | Research iteration references | Pure delete candidate - documentation, consolidated in iter 010 |
| 059-cli-devin-deep-loop-alignment | 3 (research files only) | Research iteration references | Pure delete candidate - documentation, consolidated in iter 010 |

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-008.md" lines="217-290" />

**007-code-graph nested children (18 delete candidates from iter 016):**

| Packet | Ref count | Kinds | Verdict |
|--------|-----------|-------|---------|
| 022-orphan-code-graph-db-cleanup | 3 (research files only) | Research iteration references | Pure delete candidate - cleanup completed, artifacts stale |
| 023-tsconfig-references-restructure | 3 (research files only) | Research iteration references | Pure delete candidate - tsconfig restructure completed, now live skill config |
| 024-mcp-tool-rename-mk-code-index | 3 (research files only) | Research iteration references | Pure delete candidate - rename completed, now live skill |
| 025-skill-docs-sk-doc-alignment | 3 (research files only) | Research iteration references | Pure delete candidate - doc alignment completed, now live skill docs |
| 026-system-spec-kit-codegraph-residue-audit | 3 (research files only) | Research iteration references | Pure delete candidate - residue audit completed, now historical |
| 027-readmes-update | 3 (research files only) | Research iteration references | Pure delete candidate - README update completed, now live skill README |
| 028-architecture-md | 3 (research files only) | Research iteration references | Pure delete candidate - architecture doc completed, now live skill |
| 029-public-readme-update | 3 (research files only) | Research iteration references | Pure delete candidate - public README completed, now live public README |
| 030-manual-testing-verification | 3 (research files only) | Research iteration references | Pure delete candidate - testing verification completed, now live playbook |
| 031-deep-review-campaign-010-016 | 3 (research files only) | Research iteration references | Pure delete candidate - review completed, findings addressed in 032 |
| 032-deep-review-remediation | 3 (research files only) | Research iteration references | Pure delete candidate - remediation completed, findings resolved |
| 033-deferred-fix-followup | 3 (research files only) | Research iteration references | Pure delete candidate - deferred followup completed, findings resolved |
| 034-mcp-namespace-operational-sweep | 3 (research files only) | Research iteration references | Pure delete candidate - operational sweep completed, missed renames fixed |
| 035-code-folder-readmes | 3 (research files only) | Research iteration references | Pure delete candidate - folder READMEs completed, now live skill |
| 036-cli-devin-code-graph-hook | 3 (research files only) | Research iteration references | Pure delete candidate - CLI Devin hook completed, now live integration |
| 037-system-code-graph-comprehensive-deep-review | 3 (research files only) | Research iteration references | Pure delete candidate - comprehensive review completed, findings addressed in 038 |
| 038-system-code-graph-deep-review-remediation | 3 (research files only) | Research iteration references | Pure delete candidate - remediation completed, findings resolved |
| 039-system-code-graph-deferred-followon | 3 (research files only) | Research iteration references | Pure delete candidate - deferred followon completed, findings resolved |

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="206-330" />

**013-doctor-update-orchestrator nested children (2 superseded from iter 012):**

| Packet | Ref count | Kinds | Verdict |
|--------|-----------|-------|---------|
| 001-doctor-commands | 4 (research files only) | Research iteration references + self-reference | Merge candidate (not pure delete) - superseded by 004+005, ~95% complete |
| 002-sandbox-testing-playbook | 4 (research files only) | Research iteration references + self-reference | Merge candidate (not pure delete) - superseded by 004+005, ~95% complete |

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-012.md" lines="59-76" />

### Delete-candidate list

| Packet | Status | Ref count | Verdict |
|--------|--------|-----------|---------|
| 014/006-bge-m3-hybrid-evaluation | Complete | 4 (research only) | Pure delete candidate |
| 014/008-finalize-and-commit | Complete | 3 (research only) | Pure delete candidate |
| 014/016-llama-cpp-retrieval-quality-probe | Complete | 3 (research only) | Pure delete candidate |
| 014/019-readme-resource-map | Complete | 3 (research only) | Pure delete candidate |
| 014/020-catalog-playbook-alignment-audit | Complete | 3 (research only) | Pure delete candidate |
| 014/021-local-llm-legacy-review | Complete | 3 (research only) | Pure delete candidate |
| 014/023-post-remediation-re-review | Complete | 3 (research only) | Pure delete candidate |
| 014/025-post-remediation-v2-re-review | Complete | 3 (research only) | Pure delete candidate |
| 014/026-llm-model-runtime-inventory | Complete | 3 (research only) | Pure delete candidate |
| 014/026-post-batch-11-re-review | Complete | 3 (research only) | Pure delete candidate |
| 014/027-post-batch-12-final-re-review | Complete | 3 (research only) | Pure delete candidate |
| 014/030-post-029-final-re-review | Complete | 3 (research only) | Pure delete candidate |
| 014/031-post-batch-15-final-re-review | Complete | 3 (research only) | Pure delete candidate |
| 014/037-llama-cpp-embedding-worker-deep-dive | Complete | 3 (research only) | Pure delete candidate |
| 014/041-llama-cpp-metal-investigation | Complete | 3 (research only) | Pure delete candidate |
| 014/043-cocoindex-coreml-ep-investigation | Complete | 3 (research only) | Pure delete candidate |
| 014/045-session-deep-review-2026-05-14 | Complete | 1 (research only) | Pure delete candidate (placeholder) |
| 014/048-deep-review-cocoindex-wiring | Complete | 1 (research only) | Pure delete candidate (placeholder) |
| 014/054-code-folder-readmes | Complete | 3 (research only) | Pure delete candidate |
| 014/055-root-readme-realignment | Complete | 3 (research only) | Pure delete candidate |
| 014/056-root-readme-deep-research | Complete | 3 (research only) | Pure delete candidate |
| 014/057-root-readme-deeper-rewrite | Complete | 3 (research only) | Pure delete candidate |
| 014/058-skill-md-realignment | Complete | 3 (research only) | Pure delete candidate |
| 014/059-cli-devin-deep-loop-alignment | Complete | 3 (research only) | Pure delete candidate |
| 007/022-orphan-code-graph-db-cleanup | Complete | 3 (research only) | Pure delete candidate |
| 007/023-tsconfig-references-restructure | Complete | 3 (research only) | Pure delete candidate |
| 007/024-mcp-tool-rename-mk-code-index | Complete | 3 (research only) | Pure delete candidate |
| 007/025-skill-docs-sk-doc-alignment | Complete | 3 (research only) | Pure delete candidate |
| 007/026-system-spec-kit-codegraph-residue-audit | Complete | 3 (research only) | Pure delete candidate |
| 007/027-readmes-update | Complete | 3 (research only) | Pure delete candidate |
| 007/028-architecture-md | Complete | 3 (research only) | Pure delete candidate |
| 007/029-public-readme-update | Complete | 3 (research only) | Pure delete candidate |
| 007/030-manual-testing-verification | Complete | 3 (research only) | Pure delete candidate |
| 007/031-deep-review-campaign-010-016 | Complete | 3 (research only) | Pure delete candidate |
| 007/032-deep-review-remediation | Complete | 3 (research only) | Pure delete candidate |
| 007/033-deferred-fix-followup | Complete | 3 (research only) | Pure delete candidate |
| 007/034-mcp-namespace-operational-sweep | Complete | 3 (research only) | Pure delete candidate |
| 007/035-code-folder-readmes | Complete | 3 (research only) | Pure delete candidate |
| 007/036-cli-devin-code-graph-hook | Complete | 3 (research only) | Pure delete candidate |
| 007/037-system-code-graph-comprehensive-deep-review | Complete | 3 (research only) | Pure delete candidate |
| 007/038-system-code-graph-deep-review-remediation | Complete | 3 (research only) | Pure delete candidate |
| 007/039-system-code-graph-deferred-followon | Complete | 3 (research only) | Pure delete candidate |

**Total pure delete candidates:** 42 packets (23 from 014, 18 from 007, 2 placeholders in 014)

**Note:** 013/001 and 013/002 are merge candidates (not pure delete candidates) because they are superseded but have implementation value that should be preserved in a merged historical packet.

## Gaps / JSONL delta row

**Gaps:**
- Reference counting was performed via grep with exclusions for research iteration files (iteration-*.md) and the 999-spec-026-restructure-research folder itself
- All identified delete candidates have references ONLY in the research iteration files, not in active code, docs, or other packets
- The 2 placeholders (045, 048) have only 1 reference each (in iteration-008 catalog)
- Merge candidates (013/001, 013/002) are excluded from the pure delete list per iter 013 recommendation to merge as historical packet

**JSONL delta row:**

```json
{"iter_id": "027", "timestamp_utc": "2026-05-15T23:10:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 7, "status": "complete", "pure_delete_candidates": 42, "merge_candidates_excluded": 2, "reference_method": "grep with research exclusions", "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-008.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-012.md"]}
```
