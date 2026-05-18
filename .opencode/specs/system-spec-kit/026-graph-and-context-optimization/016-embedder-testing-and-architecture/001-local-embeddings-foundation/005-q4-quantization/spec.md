---
title: "Feature Specification: Phase 5 — Q4 Quantization"
description: "Plumb HF_EMBEDDINGS_DTYPE through HfLocalProvider so the EmbeddingGemma-300m-ONNX model can load any of its packaged ONNX variants (fp32 default, fp16, q4, q4f16, int8). q4 cuts memory footprint ~3× (620MB fp32 → 190MB q4) at a small recall cost; the spec ships the env-driven switch + standalone load proof, and defers the corpus re-embed and recall benchmark to a follow-on session once a ground-truth query set is available."
trigger_phrases:
  - "005 q4 quantization"
  - "HF_EMBEDDINGS_DTYPE env var"
  - "EmbeddingGemma q4 variant"
  - "quantized embedding load"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/005-q4-quantization"
    last_updated_at: "2026-05-12T21:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "HF_EMBEDDINGS_DTYPE plumbing shipped"
    next_safe_action: "Build ground-truth query set then benchmark"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140050c2a9e0000000000000000000000000000000000000000000000000001"
      session_id: "014-005-q4-2026-05-12"
      parent_session_id: null
    completion_pct: 60
    open_questions:
      - "What query set to use for recall benchmark? (no ground-truth code-search relevance labels exist for this codebase)"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5 — Q4 Quantization

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress (code shipped; benchmark deferred pending ground-truth queries) |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 9 |
| **Predecessor** | 004-vec-store-rebuild |
| **Successor** | 006-bge-m3-hybrid-evaluation |
| **Handoff Criteria** | `HF_EMBEDDINGS_DTYPE=q4` loads model_q4.onnx and produces 768-dim vectors; standalone repro recorded; benchmark plan documented for next session |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Phase 5** of `014-local-embeddings-setup-a`. Optional optimization on top of the 004 baseline. EmbeddingGemma-300m-ONNX ships with multiple quantized ONNX variants in the same HF cache directory; q4 quantization is the most aggressive shrink (~3× RAM reduction) and the one likely to have meaningful recall impact, so it's the explicit target. Other dtypes (fp16, q4f16, int8) are supported by the same plumbing for future tuning.

**Scope Boundary**: HF_EMBEDDINGS_DTYPE env var + HfLocalProvider.dtype option + pipeline() dtype arg. NO re-embed of the live memory corpus during this packet — that requires a benchmark decision first (and dtype change means embedding-space change → existing vectors stay valid until corpus reindex).

**Dependencies**: 004 complete (live HF cache has `model_q4.onnx` and `model_q4.onnx_data` from 002's snapshot_download).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
HfLocalProvider hardcodes `dtype: 'fp32'` in the `@huggingface/transformers` `pipeline()` call. This forces the largest model variant (~620MB RAM for EmbeddingGemma-300m). The HF cache from 002 contains all dtype variants of the model — `model.onnx` (fp32, default), `model_fp16.onnx`, `model_q4.onnx`, `model_q4f16.onnx`, `model_quantized.onnx` — but the code path never reaches them. RAM and cold-load time are both higher than they need to be.

### Purpose
Expose dtype as a runtime knob via `HF_EMBEDDINGS_DTYPE` env var (and `HfLocalOptions.dtype`). Validate against the transformers.js allowed set; fall back to fp32 on unknown values. Once shipped, q4 becomes a one-line config change in `.env.local` for any user who wants the smaller footprint.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `HfLocalOptions.dtype` field
- Add `ALLOWED_HF_DTYPES` allowlist + `resolveDtype()` helper that reads `process.env.HF_EMBEDDINGS_DTYPE` and validates
- Wire `this.dtype = resolveDtype(options.dtype)` in HfLocalProvider constructor
- Replace hardcoded `dtype: 'fp32'` in the pipeline() call with `dtype: this.dtype`
- Update the model-load log message to surface the active dtype
- Standalone smoke test: load q4 variant, produce a 768-dim vector
- Rebuild `shared/dist/` and verify the dist exports propagate the new field
- Document the deferred benchmark approach (no live corpus re-embed yet)

### Out of Scope
- Re-embedding the 2112 live memory rows under q4 (would require a benchmark decision; q4 ≠ fp32 in embedding space)
- Ground-truth query-set construction for recall comparison (no labeled relevance data exists; deferred to a separate evaluation packet)
- bge-m3 hybrid evaluation (006)
- Cocoindex-side dtype (the cocoindex daemon uses sentence-transformers fp16 by default; out of 005 scope)
- Any TypeScript refactoring beyond the dtype knob

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | Modify | Add `HfLocalDtype` type, `ALLOWED_HF_DTYPES`, `resolveDtype()`, `dtype` field on HfLocalOptions + HfLocalProvider; replace hardcoded `'fp32'` with `this.dtype`; update log message |
| `.opencode/skills/system-spec-kit/shared/dist/embeddings/providers/hf-local.{js,d.ts}` | Regenerate | `npx tsc --build` from `shared/` |
| `.env.example` | (optional) Document | Add commented-out `HF_EMBEDDINGS_DTYPE=q4` line in the Setup A block (deferred — wait for benchmark validation before recommending q4) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Default behavior unchanged | With `HF_EMBEDDINGS_DTYPE` unset, provider loads fp32 model (preserves 004 baseline) |
| REQ-002 | q4 path works | With `HF_EMBEDDINGS_DTYPE=q4`, provider loads `model_q4.onnx` and warmup succeeds |
| REQ-003 | q4 produces correct-dim vectors | embedQuery returns 768-dim Float32Array, values in roughly the same range as fp32 |
| REQ-004 | Unknown dtype falls back safely | `HF_EMBEDDINGS_DTYPE=garbage` logs a warning and loads fp32; doesn't crash |
| REQ-005 | Allowlist is conservative | Only `fp32, fp16, q4, q4f16, q8, int8, uint8, bnb4` accepted; anything else falls through to fp32 |
| REQ-006 | dist is rebuilt | `shared/dist/embeddings/providers/hf-local.js` contains the new helpers (`resolveDtype`, `ALLOWED_HF_DTYPES`) and `this.dtype` references |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Document the benchmark approach | `plan.md` §4 Phase 3 enumerates the recall comparison protocol; spec.md notes the corpus-reembed dependency |
| REQ-008 | q4 cold-load latency captured | Record q4 warmup ms vs fp32 warmup ms in implementation-summary for future reference |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: User can opt into q4 by adding one line to `.env.local`: `HF_EMBEDDINGS_DTYPE=q4`
- **SC-002**: Spec-kit-memory MCP works with q4 (cold load + query) at acceptable latency
- **SC-003**: Codebase has the knob in place for a future bge-m3 / Q4 / FP16 comparison without further dispatch
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | q4 embeddings have lower recall than fp32 on real queries | Med | Don't switch the live `EMBEDDINGS_PROVIDER=auto` default; only flip when user explicitly sets `HF_EMBEDDINGS_DTYPE=q4` in `.env.local`. Benchmark gate documented in plan |
| Risk | Existing 2112 memory vectors (fp32) become incompatible if user flips to q4 | High (if uninformed) | Document in implementation-summary: a dtype change requires a full `memory_index_scan` re-embed; embedding cache hits for the old dtype are stale. Filename-keying does NOT include dtype in the path → potential silent mismatch |
| Risk | Cocoindex's sentence-transformers path doesn't use HF_EMBEDDINGS_DTYPE | Low | Out of scope — cocoindex has its own quantization plumbing (model.encode dtype param) that's separately configurable |
| Dependency | model_q4.onnx + model_q4.onnx_data already in `~/.cache/huggingface/hub/models--onnx-community--embeddinggemma-300m-ONNX/snapshots/.../onnx/` | Green | Confirmed present from 002's snapshot_download |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What query set to use for recall benchmark? (no ground-truth code-search relevance labels exist for this codebase)
- Should filename-keying include dtype suffix so fp32 and q4 vec stores can coexist?
<!-- /ANCHOR:questions -->
