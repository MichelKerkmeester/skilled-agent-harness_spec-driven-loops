---
title: "Feature Specification: Phase 6 — bge-m3 Hybrid Evaluation"
description: "Evaluate bge-m3 (dense + sparse + colbert via RRF) against EmbeddingGemma-300m baseline for code search on this codebase. Decision matrix: ship sqlite-vec schema extension only if hybrid wins by >5pp MRR@10. Blocked on 009-cocoindex-ipc-fix until cocoindex search returns valid results."
trigger_phrases:
  - "006 bge-m3 hybrid eval"
  - "bge-m3 vs EmbeddingGemma baseline"
  - "RRF hybrid ranking eval"
  - "MRR@10 code search"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/006-bge-m3-hybrid-evaluation"
    last_updated_at: "2026-05-12T22:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Planning packet filled; execution gated on 009"
    next_safe_action: "Wait for 009 cocoindex IPC fix"
    blockers:
      - "Cocoindex search broken under msgspec truncation — 009 must ship first"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140060c2a9e0000000000000000000000000000000000000000000000000001"
      session_id: "014-006-bge-m3-2026-05-12"
      parent_session_id: null
    completion_pct: 25
    open_questions:
      - "Build a hand-labeled 50-query relevance set, or use synthetic queries derived from doc anchors? Hand-labels are more honest but cost ~2-4h"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6 — bge-m3 Hybrid Evaluation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned (execution gated on 009) |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 9 |
| **Predecessor** | 004-vec-store-rebuild + 009-cocoindex-ipc-fix |
| **Successor** | 007-voyage-cleanup-and-egress-monitoring (independent in practice) |
| **Handoff Criteria** | MRR@10 comparison EmbeddingGemma vs bge-m3-dense vs bge-m3-hybrid recorded; decision documented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Phase 6** of `014-local-embeddings-setup-a`. Optional retrieval-quality study. The EmbeddingGemma-300m baseline (set in 004) is already known to be a strong code-search model. bge-m3 brings the option of hybrid retrieval (dense + sparse BM25-like + colbert-style multi-vector) which can improve recall on lexical-heavy code queries. The question is whether the wins justify the schema complexity (sqlite-vec's current single-vector column would need to become multi-column or per-token).

**Scope Boundary**: evaluation only. NO schema changes shipped in this packet — the decision matrix records "ship vs don't ship". An actual hybrid retrieval rollout is a follow-on packet if 006 says "ship".

**Dependencies**: 009-cocoindex-ipc-fix must restore working cocoindex search first. Without that, the EmbeddingGemma baseline can only be queried via the direct sqlite-vec workaround, which is workable but lossy (no top-K ranking metadata, no de-dup logic, no `pathClass` boosts).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
We chose EmbeddingGemma-300m for cocoindex in 002 on theoretical grounds (strong code-retrieval scores in published benchmarks). We've never measured retrieval quality against this codebase. bge-m3 advertises hybrid retrieval — combining dense vectors, sparse lexical scores, and multi-vector colbert reranking — and on text-heavy benchmarks it often wins by 3-7pp MRR@10. We don't know if it helps on code, and we don't know if the sqlite-vec schema change is worth it.

### Purpose
Build a small ground-truth query set (40-60 queries with hand-labeled relevant files), index the same codebase with the EmbeddingGemma-300m baseline and bge-m3 variants, measure MRR@10 and NDCG@10. Decide ship/don't-ship based on whether hybrid bge-m3 beats EmbeddingGemma-dense by ≥5 percentage points MRR@10.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build 40-60 query / relevant-files pairs in `006/scratch/eval-set.jsonl`
- Index codebase with EmbeddingGemma-300m (baseline; already exists in target_sqlite.db post-004+009)
- Index codebase with bge-m3 dense variant
- Index codebase with bge-m3 hybrid (sparse + dense + colbert via RRF)
- Run MRR@10 + NDCG@10 for each
- Decision artifact in `006/decision-record.md` (Level 2 addendum if needed) or in implementation-summary

### Out of Scope
- Actually shipping the schema change (separate follow-on if decision is "ship")
- Reranker comparison (orthogonal axis)
- Evaluating beyond code search (no text-corpus eval)
- Hand-labeling the query set if it costs >4h (use synthetic queries instead)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `006/scratch/eval-set.jsonl` | Create | 40-60 query/relevant-files pairs |
| `006/scratch/run-eval.py` | Create | Index + query + score harness |
| `006/scratch/results-<model>.json` | Create | Per-model MRR@10 + NDCG@10 outputs |
| `006/decision-record.md` | Maybe create | If ship/don't-ship decision needs ADR-style write-up |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Cocoindex search returns valid results | gated on 009 ship |
| REQ-002 | Eval query set exists | `006/scratch/eval-set.jsonl` has ≥40 queries with `relevant_files` lists |
| REQ-003 | EmbeddingGemma baseline MRR@10 measured | `results-embeddinggemma.json` written |
| REQ-004 | bge-m3 dense MRR@10 measured | `results-bge-m3-dense.json` written |
| REQ-005 | bge-m3 hybrid MRR@10 measured | `results-bge-m3-hybrid.json` written |
| REQ-006 | Decision documented | implementation-summary or decision-record.md records ship/don't-ship + delta |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | NDCG@10 alongside MRR@10 | All three results files include both metrics |
| REQ-008 | Latency comparison | Index time + query p95 captured for each variant |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Decision matrix with measurable evidence (ship if hybrid beats baseline by ≥5pp MRR@10; don't ship otherwise)
- **SC-002**: Eval harness is reproducible: another contributor can re-run on a different codebase
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hand-labeling 50 queries is tedious | Med | If >4h, fall back to synthetic queries from doc-anchor titles + manually filtered relevant files |
| Risk | bge-m3 hybrid is hard to wire into sqlite-vec (multi-vector needs schema redesign) | High | Evaluate as standalone before claiming "ship-ready"; the eval can run with separate DBs per variant |
| Risk | Eval results are noisy on 50 queries | Med | Report 95% CI; require ≥5pp delta to ship |
| Dependency | 009 cocoindex IPC fix | Hard | Cannot run REQ-003 without it |
| Dependency | bge-m3 model in HF cache | Yellow (probably not cached yet) | snapshot_download via venv Python |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Build a hand-labeled 50-query relevance set, or use synthetic queries derived from doc anchors? Hand-labels are more honest but cost ~2-4h.
<!-- /ANCHOR:questions -->
