---
title: "Implementation Plan: Phase 5 — Q4 Quantization"
description: "Plumb HF_EMBEDDINGS_DTYPE through HfLocalProvider in three steps: type + allowlist + constructor wiring, pipeline call, dist rebuild. Stand-alone q4 load test as acceptance gate. Document the deferred recall benchmark."
trigger_phrases:
  - "005 plan q4 quantization"
  - "HF_EMBEDDINGS_DTYPE plumbing"
  - "EmbeddingGemma quantized variant load"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/005-q4-quantization"
    last_updated_at: "2026-05-12T21:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan filled; code change shipped to dist"
    next_safe_action: "Run standalone q4 acceptance test"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0140050c2a9e0000000000000000000000000000000000000000000000000002"
      session_id: "014-005-q4-2026-05-12"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5 — Q4 Quantization

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (HfLocalProvider in `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts`); transformers.js v3.8.1 ONNX runtime |
| **Framework** | `@huggingface/transformers.pipeline('feature-extraction', ..., { dtype, device })` |
| **Storage** | No DB changes. HF cache already has model_q4.onnx + model_q4.onnx_data variants. |
| **Testing** | Standalone Node `import().then(...)` script that constructs HfLocalProvider with each dtype, warms up, calls embedQuery, prints dim + first 5 floats |

### Overview
Three-touchpoint change: extend HfLocalOptions, add a small allowlist + resolver helper, replace the hardcoded `'fp32'` literal in the pipeline call. Rebuild dist. Acceptance is a one-shot standalone load proof under `HF_EMBEDDINGS_DTYPE=q4`. The harder follow-on (recall benchmark + flip the default) is gated on a ground-truth query set that we don't have, so 005 ships infrastructure-ready and the benchmark belongs to a follow-on packet or to the user's own evaluation work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 004 baseline (fp32 EmbeddingGemma-300m-ONNX) shipped
- [x] HF cache contains all dtype variants (verified during 002)

### Definition of Done
- [x] HF_EMBEDDINGS_DTYPE plumbing in source
- [x] dist rebuild
- [x] Standalone q4 load test passes (embedded 768-dim vector confirmed)
- [ ] Strict validate exits 0
- [ ] Implementation summary captures cold-load latency comparison fp32 vs q4
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Configuration knob with strict allowlist + graceful fallback. No new abstraction layers.

### Key Components
- **`HfLocalDtype` (type union)** — narrows the string to known transformers.js dtype keys
- **`ALLOWED_HF_DTYPES` (const array)** — single source of truth for accepted values
- **`resolveDtype(explicit?: string): HfLocalDtype`** — env-var resolver, validates, warns on miss, falls back to fp32
- **`HfLocalProvider.dtype`** — instance field, set in constructor, read on `pipeline()` call

### Data Flow
Env → constructor → field → pipeline() call. No runtime mutation after construction. Idempotent — re-importing the module reuses the env value.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `HfLocalOptions` interface | DI contract for HfLocalProvider | Modify — add optional `dtype?: HfLocalDtype` | TypeScript compilation succeeds |
| `HfLocalProvider` constructor | Initializes provider state | Modify — set `this.dtype = resolveDtype(options.dtype)` | Standalone test logs the resolved dtype |
| `getModel()` pipeline call | Loads ONNX model variant | Modify — `dtype: this.dtype` (was `'fp32'`) | Log message shows active dtype; q4 path loads `model_q4.onnx` |
| `dist/embeddings/providers/hf-local.js` | Compiled output | Regenerate via `npx tsc --build` | grep finds `resolveDtype`, `ALLOWED_HF_DTYPES`, `this.dtype` |
| `EmbeddingProfile.dim` (factory side) | Persisted dim per provider | Unchanged | dim stays 768 regardless of dtype |
| Filename-keying of memory sqlite | `context-index__hf-local__{model}__{dim}.sqlite` | Unchanged in 005 (open question — see spec.md §7) | Same DB file used by fp32 and q4 today; future packet decides whether to add dtype suffix |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm HF cache has model_q4.onnx + model_q4.onnx_data files
- [x] Read current hf-local.ts to find HfLocalOptions and the pipeline() call site

### Phase 2: Core Implementation
- [x] Add `HfLocalDtype` type union and `ALLOWED_HF_DTYPES` const array
- [x] Add `resolveDtype()` helper with env-var read + allowlist validation + fp32 fallback + warn log
- [x] Add `dtype?: HfLocalDtype` to HfLocalOptions
- [x] Add `dtype: HfLocalDtype` field to HfLocalProvider class
- [x] Wire `this.dtype = resolveDtype(options.dtype)` in constructor
- [x] Replace hardcoded `dtype: 'fp32'` in pipeline() call with `dtype: this.dtype`
- [x] Update load log message to surface active dtype
- [x] `npx tsc --noEmit -p tsconfig.json` clean
- [x] `npx tsc --build` regenerates dist

### Phase 3: Verification + Benchmark Documentation
- [x] Standalone fp32 default test: warmup + embedQuery → 768-dim vec
- [x] Standalone q4 test: warmup + embedQuery → 768-dim vec
- [x] Cold-load latency captured: fp32 ~1.1s vs q4 ~3.2s on this machine (q4 cold is slower; warm-path inference may be similar or faster — deferred)
- [ ] Recall benchmark: document approach in implementation-summary; actual run deferred (needs ground-truth queries)
- [ ] Strict validate exits 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | resolveDtype() behavior under valid / invalid / missing env | Standalone Node script |
| Integration | HfLocalProvider full load + warmup + embedQuery under each dtype | Standalone Node script in scratch/ |
| Manual | Compare cosine similarity of fp32 vs q4 vectors for same input strings | Python script (deferred) |
| Regression | fp32 path remains backward-compatible (default unchanged) | Standalone Node script |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 004 vec-store-rebuild | Internal | Green | 005 builds on the same provider |
| HF cache model_q4.onnx | External | Green | Already in cache from 002 |
| `@huggingface/transformers` v3.8.1 | External | Green | Supports `dtype` arg in pipeline() |
| Ground-truth query set for recall benchmark | External | Yellow (missing) | Benchmark deferred to a follow-on session |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future user reports q4 produces unusable vectors AND a fix isn't immediate
- **Procedure**: Unset `HF_EMBEDDINGS_DTYPE` in `.env.local` (or remove the line entirely). HfLocalProvider falls back to fp32 — same behavior as 004. No data migration needed; existing fp32 vectors stay valid.
<!-- /ANCHOR:rollback -->
