I cannot write files in read-only mode. Here is the iteration-030.md content for you to save manually:

---

# Iter 030 — Track 7: consolidated delete-candidate list

## Question / Evidence / Findings

### Delete-candidates

| Packet | Reasons | Confidence | Size |
|--------|---------|------------|------|
| 014/006-bge-m3-hybrid-evaluation | completed-unreferenced + superseded (never executed) | HIGH | 1180 LOC |
| 014/008-finalize-and-commit | completed-unreferenced + superseded (session-management artifact) | HIGH | 696 LOC |
| 014/016-llama-cpp-retrieval-quality-probe | completed-unreferenced + superseded (measurement-only) | HIGH | 2881 LOC |
| 014/019-readme-resource-map | completed-unreferenced + superseded (research-only) | HIGH | 1515 LOC |
| 014/020-catalog-playbook-alignment-audit | completed-unreferenced + superseded (research-only) | HIGH | 1695 LOC |
| 014/021-local-llm-legacy-review | completed-unreferenced + superseded (by 022 remediation) | HIGH | 1160 LOC |
| 014/023-post-remediation-re-review | completed-unreferenced + superseded (by 022 remediation) | HIGH | 1276 LOC |
| 014/025-post-remediation-v2-re-review | completed-unreferenced + superseded (by 022 remediation) | HIGH | 1304 LOC |
| 014/026-llm-model-runtime-inventory | completed-unreferenced + superseded (research-only) | HIGH | 748 LOC |
| 014/026-post-batch-11-re-review | completed-unreferenced + superseded (by 022 remediation) | HIGH | 1245 LOC |
| 014/027-post-batch-12-final-re-review | completed-unreferenced + superseded (by 022 remediation) | HIGH | 1207 LOC |
| 014/030-post-029-final-re-review | completed-unreferenced + superseded (by 022 remediation) | HIGH | 1160 LOC |
| 014/031-post-batch-15-final-re-review | completed-unreferenced + superseded (by 022 remediation) | HIGH | 1132 LOC |
| 014/037-llama-cpp-embedding-worker-deep-dive | completed-unreferenced + superseded (research-only) | HIGH | 1322 LOC |
| 014/041-llama-cpp-metal-investigation | completed-unreferenced + superseded (research-only) | HIGH | 1266 LOC |
| 014/043-cocoindex-coreml-ep-investigation | completed-unreferenced + superseded (research-only) | HIGH | 984 LOC |
| 014/045-session-deep-review-2026-05-14 | completed-unreferenced + superseded (placeholder, no description.json) | HIGH | 639 LOC |
| 014/048-deep-review-cocoindex-wiring | completed-unreferenced + superseded (placeholder, no description.json) | HIGH | 851 LOC |
| 014/054-code-folder-readmes | completed-unreferenced + superseded (consolidated in iter 010, proposed phase parent 050) | HIGH | 1674 LOC |
| 014/055-root-readme-realignment | completed-unreferenced + superseded (consolidated in iter 010, proposed phase parent 050) | HIGH | 1220 LOC |
| 014/056-root-readme-deep-research | completed-unreferenced + superseded (by 057 rewrite, proposed phase parent 059) | HIGH | 3096 LOC |
| 014/057-root-readme-deeper-rewrite | completed-unreferenced + superseded (consolidated in iter 010, proposed phase parent 059) | HIGH | 929 LOC |
| 014/058-skill-md-realignment | completed-unreferenced + superseded (consolidated in iter 010, proposed phase parents 050+059) | HIGH | 4238 LOC |
| 014/059-cli-devin-deep-loop-alignment | completed-unreferenced + superseded (consolidated in iter 010, proposed phase parent) | HIGH | 1200 LOC |
| 007/022-orphan-code-graph-db-cleanup | completed-unreferenced + superseded (by 014 extraction) | HIGH | 764 LOC |
| 007/023-tsconfig-references-restructure | completed-unreferenced + superseded (by 014 extraction) | HIGH | 682 LOC |
| 007/024-mcp-tool-rename-mk-code-index | completed-unreferenced + superseded (by 014 extraction) | HIGH | 711 LOC |
| 007/025-skill-docs-sk-doc-alignment | completed-unreferenced + superseded (by 014 extraction) | HIGH | 655 LOC |
| 007/026-system-spec-kit-codegraph-residue-audit | completed-unreferenced + superseded (by 014 extraction) | HIGH | 1021 LOC |
| 007/027-readmes-update | completed-unreferenced + superseded (by 014 extraction) | HIGH | 679 LOC |
| 007/028-architecture-md | completed-unreferenced + superseded (by 014 extraction) | HIGH | 658 LOC |
| 007/029-public-readme-update | completed-unreferenced + superseded (by 014 extraction) | HIGH | 601 LOC |
| 007/030-manual-testing-verification | completed-unreferenced + superseded (by 014 extraction) | HIGH | 532 LOC |
| 007/031-deep-review-campaign-010-016 | completed-unreferenced + superseded (by 032 remediation) | HIGH | 941 LOC |
| 007/032-deep-review-remediation | completed-unreferenced + superseded (by 033 deferred followup) | HIGH | 572 LOC |
| 007/033-deferred-fix-followup | completed-unreferenced + superseded (by 034 operational sweep) | HIGH | 559 LOC |
| 007/034-mcp-namespace-operational-sweep | completed-unreferenced | MEDIUM | 531 LOC |
| 007/035-code-folder-readmes | completed-unreferenced + superseded (low historic value) | MEDIUM | 853 LOC |
| 007/036-cli-devin-code-graph-hook | completed-unreferenced + superseded (low historic value) | MEDIUM | 3400 LOC |
| 007/037-system-code-graph-comprehensive-deep-review | completed-unreferenced + superseded (by 038 remediation) | HIGH | 2956 LOC |
| 007/038-system-code-graph-deep-review-remediation | completed-unreferenced + superseded (by 039 deferred followon) | HIGH | 408 LOC |
| 007/039-system-code-graph-deferred-followon | completed-unreferenced | MEDIUM | 1237 LOC |
| 007/016-scaffold-skill | superseded (by 014 extraction) | MEDIUM | 735 LOC |
| 007/017-physical-move-and-database | superseded (by 014 extraction) | MEDIUM | 716 LOC |
| 007/018-rewire-consumers-and-tool-registration | superseded (by 014 extraction) | MEDIUM | 719 LOC |
| 007/019-doc-and-runtime-migration | superseded (by 014 extraction) | MEDIUM | 729 LOC |
| 007/020-validation-and-cleanup | superseded (by 014 extraction) | MEDIUM | 715 LOC |
| 014/022-local-llm-legacy-remediation | superseded (remediation completion, made review artifacts obsolete) | MEDIUM | 1154 LOC |
| 014/002-code-graph-self-contained-package | superseded (by 014 extraction to standalone skill) | MEDIUM | - |
| 014/052-mk-spec-memory-rename | superseded (by 053 remediation) | MEDIUM | 1800 LOC |
| 014/053-mk-spec-memory-rename-remediation | superseded (rename completion made remediation obsolete) | LOW | 587 LOC |
| 014/050-all-skills-alignment-sweep | superseded (proposed phase parent, documentation consolidation) | LOW | 1392 LOC |
| 013/001-doctor-commands | superseded (by 004+005 router consolidation) | LOW | 3874 LOC |
| 013/002-sandbox-testing-playbook | superseded (by 004+005 router consolidation) | LOW | 3537 LOC |

### Totals

- **HIGH: 38** | **MEDIUM: 13** | **LOW: 4** | **Combined size reduction: ~54,748 LOC** (HIGH+MEDIUM only)

**Note:** Iteration 029 (orphans) was not available during consolidation - this represents a gap in the analysis. The size estimate excludes 014/002-code-graph-self-contained-package (directory not found) and includes only HIGH and MEDIUM confidence candidates in the reduction calculation.

### Confidence criteria

- **HIGH**: Multiple signals (completed-unreferenced + superseded, or strong single signal with clear replacement)
- **MEDIUM**: One strong signal (completed-unreferenced OR superseded with clear rationale)
- **LOW**: Marginal supersession (proposed consolidation, historic value unclear, or merge candidates)

## Gaps / JSONL delta row

**Gaps:**
- Iteration 029 (orphans) was not available for consolidation - need to complete orphan analysis before final delete execution
- 014/002-code-graph-self-contained-package directory not found during size estimation
- 014/026 has duplicate numbering (026-llm-model-runtime-inventory vs 026-post-batch-11-re-review) - needs resolution
- Placeholder directories (045, 048) confirmed as incomplete (no description.json)
- Need to verify whether 002's sandbox harness needs sed-updates before considering merge candidate deletion
- Size estimates based on LOC counts of .md and .json files only; excludes binary data and other file types

**JSONL delta row:**
```json
{"iter_id": "030", "timestamp_utc": "2026-05-15T23:13:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 7, "status": "complete", "delete_candidates_total": 55, "high_confidence": 38, "medium_confidence": 13, "low_confidence": 4, "estimated_reduction_loc_high_medium": 54748, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-027.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-028.md"], "gaps": ["iteration-029-orphans-not-available", "014-002-code-graph-self-contained-package-not-found", "duplicate-026-numbering-needs-resolution"]}
```
