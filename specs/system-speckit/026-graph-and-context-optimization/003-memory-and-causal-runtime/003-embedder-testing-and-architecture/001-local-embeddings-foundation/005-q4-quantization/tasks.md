---
title: "Tasks: Phase 5 — Q4 Quantization"
description: "Task list for plumbing HF_EMBEDDINGS_DTYPE through HfLocalProvider, rebuilding dist, and proving the q4 variant loads."
trigger_phrases:
  - "005 tasks q4 quantization"
  - "HF_EMBEDDINGS_DTYPE plumb tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/005-q4-quantization"
    last_updated_at: "2026-05-12T21:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks marked through Phase 2 code change; verification next"
    next_safe_action: "Run strict validate"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140050c2a9e0000000000000000000000000000000000000000000000000003"
      session_id: "014-005-q4-2026-05-12"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5 — Q4 Quantization

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm `~/.cache/huggingface/hub/models--onnx-community--embeddinggemma-300m-ONNX/snapshots/.../onnx/model_q4.onnx` + `.onnx_data` present
- [x] T002 Read `hf-local.ts` to locate HfLocalOptions interface and hardcoded `dtype: 'fp32'` in pipeline() call
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `HfLocalDtype` type union + `ALLOWED_HF_DTYPES` const array (`shared/embeddings/providers/hf-local.ts`)
- [x] T004 Add `resolveDtype()` helper with env-var read + validation + fp32 fallback + warn log
- [x] T005 Add `dtype?: HfLocalDtype` to HfLocalOptions interface
- [x] T006 Add `dtype: HfLocalDtype` field to HfLocalProvider class; set via `resolveDtype(options.dtype)` in constructor
- [x] T007 Replace hardcoded `dtype: 'fp32'` in pipeline() call with `dtype: this.dtype`
- [x] T008 Update model-load log message to include `dtype=${this.dtype}` for observability
- [x] T009 `npx tsc --noEmit --composite false -p tsconfig.json` clean
- [x] T010 `npx tsc --build` regenerates `dist/embeddings/providers/hf-local.{js,d.ts}`
- [x] T011 Grep dist for `resolveDtype`, `ALLOWED_HF_DTYPES`, `this.dtype` references — confirm propagation
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Standalone fp32 default test: `HF_EMBEDDINGS_DTYPE` unset → warmup OK, embed produces 768-dim vec
- [x] T013 Standalone q4 test: `HF_EMBEDDINGS_DTYPE=q4` → warmup OK (~3.2s cold), embed produces 768-dim vec with similar value range
- [x] T014 Capture latency baseline: fp32 cold ~1.1s, q4 cold ~3.2s on this machine (Apple Silicon, ONNX Runtime CPU fallback)
- [ ] T015 [B] Recall benchmark (deferred — needs ground-truth queries)
- [ ] T016 Strict validate exits 0
- [ ] T017 Update parent `graph-metadata.json` (`derived.last_active_child_id = "...005-q4-quantization"` when active)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1-2 tasks marked `[x]`
- [x] Phase 3 verification (except deferred benchmark) marked `[x]`
- [ ] Strict validate exits 0
- [ ] No `[B]` blocked tasks remaining outside the deferred benchmark
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../004-vec-store-rebuild/implementation-summary.md`
- **Successor**: `../006-bge-m3-hybrid-evaluation/` (when 009 unblocks it)
<!-- /ANCHOR:cross-refs -->
