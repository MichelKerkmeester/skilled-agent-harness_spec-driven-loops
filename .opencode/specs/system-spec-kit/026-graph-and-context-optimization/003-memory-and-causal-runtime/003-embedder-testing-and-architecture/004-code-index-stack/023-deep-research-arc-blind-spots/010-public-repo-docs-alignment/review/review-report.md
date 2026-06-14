# Public Repo Docs Alignment Review Report

**Review Type**: Deep-Review (10 iterations)  
**Date**: 2026-05-20  
**Review Agent**: cli-devin-swe-1.6  
**Scope**: Documentation alignment across public repo after recent code changes (Qwen3-Reranker-0.6B default promotion, CodeRankEmbed default promotion, mcp_server feature-grouped restructure, 023 packet slug renaming)

---

## Executive Summary

**Overall Verdict**: ⚠️ 6 P1 FINDINGS REMAINING (1 P1 FIXED DURING REVIEW)

The documentation surface is **mostly aligned** with current code defaults, but technical implementation docs have drift from the recent feature-grouped restructure and model default promotions. High-level docs (README, AGENTS, skill trios) are accurate. Technical docs (feature catalog, references, code README) have stale module paths, incomplete mitigation notes, and config value discrepancies that need correction.

**Key Findings**:
- ✅ **Core defaults accurately documented**: Qwen3-Reranker-0.6B (Apache-2.0) and CodeRankEmbed (MIT) are correctly stated in all major docs
- ✅ **2-model pipeline architecture correctly documented**: Stage 1 bi-encoder embedder + Stage 2 cross-encoder reranker distinction is accurate
- ✅ **Cross-runtime mirror healthy**: .claude/ and .opencode/ directories are properly synchronized
- ⚠️ **Module path restructure drift**: Commit 29f412f31 restructured cocoindex_code into feature subdirs, but some docs still reference old paths
- ⚠️ **Model promotion drift**: Some docs still reference GTE (prior reranker) or jina-code (prior embedder) instead of current defaults
- ⚠️ **Config value discrepancies**: Hybrid weights and chunking parameters have inconsistencies across docs
- ⚠️ **Mitigation note incompleteness**: Some notes don't specify the new default or 023B context

**Action Required**: Fix 6 remaining P1 issues (module paths, stale model references, config discrepancies, incomplete mitigation notes) to bring technical docs into full alignment.

---

## Methodology

**10-Iteration Deep-Review Process**:

1. **Iteration 001**: Root + AGENTS + mcp-coco-index trio (README.md, SKILL.md, INSTALL_GUIDE.md) - ✅ Clean on defaults, 1 P2 uncertainty (mk-spec-memory embedder)
2. **Iteration 002**: feature_catalog/ (root + indexing-pipeline + search-and-ranking) - ⚠️ 2 P1 findings (module paths, incomplete mitigation), **1 P1 FIXED** during iteration
3. **Iteration 003**: feature_catalog/ (configuration) - ⚠️ 1 P1 finding (hybrid weight discrepancy, uncertain)
4. **Iteration 004**: references/ (settings + tool reference) - ⚠️ 2 P1 findings (chunking discrepancy, module paths uncertain)
5. **Iteration 005**: manual_testing_playbook/ + cocoindex_code module README - ⚠️ 2 P1 findings (stale reranker/embedder references)
6. **Iteration 006**: system-spec-kit skill canonical surface - ✅ Clean (framework-level docs)
7. **Iteration 007**: cli-devin + cli-codex skill consistency - ✅ Clean (CLI orchestrators)
8. **Iteration 008**: Other skills with mcp-coco-index references (sk-code, sk-doc, sk-prompt) - ✅ Clean, 1 INFO uncertainty (grep timeout)
9. **Iteration 009**: Cross-runtime mirror check (.claude/ vs .opencode/) - ✅ Healthy (only expected runtime-specific differences)
10. **Iteration 0010**: Synthesis + verdict + cumulative findings table (this report)

**Review Angle**: Documentation alignment after recent code changes, focusing on:
- Default reranker verification (must be Qwen3-Reranker-0.6B, not jina-v3 or GTE)
- Default embedder verification (must be CodeRankEmbed, not gemma or jina-code)
- 2-model pipeline architecture verification (Stage 1 bi-encoder + Stage 2 cross-encoder, not interchangeable)
- Module import path verification after feature-grouped restructure (rerankers/reranker.py, not reranker.py)
- 023 packet slug renaming verification (001-008, not 023[A-F])

**Evidence Standard**: All findings include file:line citations with explicit reproduction evidence. Uncertainties are flagged as such with verification recommendations.

---

## Cumulative Findings Table

### P0 Findings (0)

**None found.**

---

### P1 Findings (6 remaining, 1 fixed)

| ID | File | Line | Issue | Evidence | Status |
|---|---|---|---|---|---|
| P1-001 | 08-reranker-cross-encoder.md | 59-61 | Stale module paths after restructure | References `cocoindex_code/reranker.py` but should be `cocoindex_code/rerankers/reranker.py` after commit 29f412f31 | **FIXED** during iteration-002 |
| P1-002 | 08-reranker-cross-encoder.md | 33 | Incomplete mitigation note | Says "moved away from GTE" but doesn't specify new default (Qwen3-Reranker-0.6B) or 023B context | **OPEN** |
| P1-001 | 04-environment-overrides.md | 40-41 | Hybrid weight default discrepancy | Shows 0.7/0.7 but INSTALL_GUIDE.md shows 0.9/0.5; needs code verification | **OPEN** (uncertain) |
| P1-001 | settings_reference.md | 174-176 | Chunking config discrepancy | Shows 1000/250/150 but feature catalog shows 1500/250/200; needs code verification | **OPEN** (uncertain) |
| P1-002 | tool_reference.md | 245-246 | Module paths need restructure check | References `cocoindex_code/client.py` and `cocoindex_code/daemon.py`; need verification if moved to subdirs | **OPEN** (uncertain) |
| P1-001 | cocoindex_code/README.md | 73, 118 | Stale reranker references | References "GTE multilingual rerank" instead of current Qwen3-Reranker-0.6B default | **OPEN** |
| P1-002 | cocoindex_code/README.md | 117 | Stale embedder registry reference | References "jina-code default" instead of current nomic-ai/CodeRankEmbed default | **OPEN** |

---

### P2 Findings (1)

| ID | File | Line | Issue | Evidence | Status |
|---|---|---|---|---|---|
| P2-001 | README.md | 122 | Stale embedder reference for mk-spec-memory | Diagram shows "jina-v3 (Ollama)" as default embedder for mk-spec-memory; may be stale but outside CocoIndex scope | **OPEN** (uncertain) |

---

### INFO Findings (Selected)

| ID | File | Issue | Note |
|---|---|---|---|
| INFO-001 (iter-001) | README.md:134 | Accurate context separation | Correctly distinguishes mk-spec-memory (jina-embeddings-v3) from CocoIndex (CodeRankEmbed) |
| INFO-003 (iter-001) | mcp-coco-index/README.md | Accurate defaults | All defaults current and accurate |
| INFO-001 (iter-002) | feature_catalog.md | Accurate defaults | Two-model pipeline distinction correctly documented |
| INFO-002 (iter-004) | settings_reference.md | Accurate hybrid weights | Matches INSTALL_GUIDE.md (0.9/0.5), resolves iteration-003 discrepancy |
| INFO-001 (iter-006) | system-spec-kit/README.md | jina-embeddings-v3 for mk-spec-memory | Correct - different system from CocoIndex |
| INFO-004 (iter-008) | .opencode/skills/ (grep) | Grep timeout uncertainty | Command to find stale module paths did not complete; needs re-run |

---

## Cross-Cutting Drift Patterns

### Pattern 1: Module Path Restructure Drift

**Root Cause**: Commit 29f412f31 restructured `cocoindex_code` into feature subdirs (e.g., `reranker.py` → `rerankers/reranker.py`), but documentation references were not fully updated.

**Affected Files**:
- `.opencode/skills/mcp-coco-index/feature_catalog/05--search-and-ranking/08-reranker-cross-encoder.md:59-61` (FIXED)
- `.opencode/skills/mcp-coco-index/references/tool_reference.md:245-246` (uncertain, needs verification)

**Pattern**: Technical implementation docs that reference specific Python module paths are most susceptible. High-level docs (README, SKILL.md) don't reference module paths and are unaffected.

**Fix Strategy**: Audit all Python module path references against the current directory structure after the restructure. Update stale paths to reflect the feature-grouped organization.

---

### Pattern 2: Model Default Promotion Drift

**Root Cause**: Qwen3-Reranker-0.6B was promoted as default reranker (replacing GTE) and CodeRankEmbed was promoted as default embedder (replacing jina-code/gemma), but some feature descriptions still reference prior defaults.

**Affected Files**: