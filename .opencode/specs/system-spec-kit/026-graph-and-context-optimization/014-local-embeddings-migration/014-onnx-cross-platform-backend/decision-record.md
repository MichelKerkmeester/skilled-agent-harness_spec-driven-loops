---
title: "Decision Record: 014/014 ONNX cross-platform backend — REJECTED"
description: "ADR documenting the rejection of the opt-in ONNX Runtime backend for cocoindex after six-hypothesis perf investigation showed ONNX is a net loss on Apple Silicon for Gemma at parity-preserving settings."
trigger_phrases:
  - "014 onnx rejection"
  - "onnx backend rejected"
  - "cocoindex onnx adr"
importance_tier: "important"
contextType: "decision-record"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# Decision Record: 014/014 ONNX cross-platform backend — REJECTED

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-metadata -->
## ADR-001: Reject the opt-in ONNX Runtime backend for cocoindex on Apple Silicon

| Field | Value |
|---|---|
| Status | REJECTED |
| Date | 2026-05-13 |
| Decider | Operator + main-agent synthesis from 6-hypothesis perf investigation |
| Supersedes | n/a |
| Superseded by | Decision 2 of plan `glittery-juggling-lecun` — packet `015-node-llama-cpp-evaluation` |
<!-- /ANCHOR:adr-metadata -->

---

<!-- ANCHOR:context -->
## 1. CONTEXT

The 014/014 packet shipped an opt-in ONNX Runtime embedding backend for the cocoindex code-search MCP, gated behind `COCOINDEX_CODE_BACKEND=onnx`. The original premise: ONNX Runtime + CoreML EP on Apple Silicon would access the Neural Engine (`MLComputeUnits=CPUAndNeuralEngine`) and deliver faster, quieter embedding inference than the existing PyTorch + MPS path, AND cross-platform GPU access on Windows (DirectML) and Linux (CUDA).

After implementation the initial benchmark showed ONNX was ~5x SLOWER than sbert/PyTorch+MPS for batch=1 query latency. A six-hypothesis investigation was scoped (H1-H6) to determine whether the slowness was fixable or whether the architectural assumption was wrong for this specific Gemma export.
<!-- /ANCHOR:context -->

---

<!-- ANCHOR:investigation -->
## 2. INVESTIGATION FINDINGS

All measurements taken on a 16-inch MacBook M5 Max, Python 3.11, `onnxruntime==1.26.0`, model `onnx-community/embeddinggemma-300m-ONNX` at 768d, sbert baseline via `google/embeddinggemma-300m` + sentence-transformers + PyTorch + MPS.

Reference baseline (sbert + MPS, batch=1, 1000 iter, warmup excluded): **p50 35.6ms / p95 55.7ms**.

| Hypothesis | Verdict | Headline number | Implication |
|---|---|---|---|
| H1 — Is Neural Engine actually being used? | **REFUTED** | CoreML EP claims 23% of ops; 77% fall to CPU. NE-enabled is 4% faster than CoreML-CPU-only. Pure ONNX CPU EP (66ms p50) beats every CoreML config. | The Neural Engine is barely doing anything for Gemma. The CoreML partition overhead exceeds any NE benefit. |
| H2 — Per-call graph compilation overhead | **CONFIRMED** | First call 1557ms; calls 2-10 average ~180ms; 8.52x warmup ratio. | Real warmup spike but doesn't explain steady-state slowness — the 180ms steady-state IS the bottleneck. |
| H3 — Static vs dynamic input shapes | **PARTIALLY CONFIRMED with parity trade-off** | static-pad128 → 40.9ms p50 (fast!) but parity fails: mean cosine 0.869, min 0.487. static-pad512 → 123ms p50 with parity preserved (0.9977/0.9923). dynamic → 214ms p50. | Static shapes unlock fast CoreML paths, but only at truncation lengths that break parity for typical cocoindex chunks. At parity-preserving settings ONNX is still 3.5x slower than sbert. |
| H4 — Tokenizer overhead at batch=1 | **REFUTED** | Fast tokenizer: 0.21ms (0.1% of 178ms total). Slow vs fast tokenizer ratio: 1.00x. | Tokenizer is not the bottleneck. The cost is in ONNX inference itself. |
| H5 — MLProgram vs NeuralNetwork format | **REFUTED** | MLProgram: 174ms p50. NeuralNetwork format fails to initialize (`model_path must not be empty`). | NeuralNetwork format is non-functional for this model export; MLProgram is the only viable format. |
| H6 — Batch size sensitivity | **REFUTED** | At every batch size sbert per-item latency wins: sbert b=8 → 14.9ms/item, b=32 → 16.0ms/item, b=128 → 15.9ms/item. ONNX b=32 and b=128 fail entirely (worker crashes). | sbert dominates across the batch axis. ONNX has no batch sweet spot on this hardware. |

Best parity-preserving ONNX config (static-pad512): **p50 123ms** — still 3.5x slower than the 35.6ms sbert baseline.

Full raw data: `scratch/perf-investigation/findings/H1..H6` markdown files and corresponding `scripts/raw-timings-*.csv` per hypothesis.
<!-- /ANCHOR:investigation -->

---

<!-- ANCHOR:decision -->
## 3. DECISION

The opt-in `COCOINDEX_CODE_BACKEND=onnx` code path is **REMOVED** from production. The 014/014 packet remains on disk as a rejected-experiment record. CocoIndex's default backend remains `sbert` (sentence-transformers + PyTorch + MPS on Apple Silicon, PyTorch + CUDA or CPU elsewhere).

### Files removed
- `cocoindex_code/embeddings_onnx.py`
- `cocoindex_code/backend_state.py`
- `tests/test_onnx_parity.py`, `test_provider_selection.py`, `test_backend_state.py`
- `scratch/bench-onnx-vs-sbert.py`, `scratch/bench-results.json`
- `.cocoindex_code/backend.json` (runtime state file)

### Files reverted
- `cocoindex_code/shared.py` — removed `COCOINDEX_CODE_BACKEND` env gate, `OnnxEmbedder` type union member, and the backend dispatch branch in `_build_embedder()`.
- `cocoindex_code/daemon.py` — removed `_backend_state_root()`, `_update_backend_state()`, the `force_reindex_recommended` ProjectRegistry attribute + constructor parameter, and the `BackendState` / `OnnxEmbedder` imports.
- `cocoindex_code/protocol.py` — removed `force_reindex_recommended: bool = False` field from `DaemonStatusResponse`.
- `pyproject.toml` — removed `onnxruntime>=1.17` runtime dep and ONNX wheel comments.
- `SKILL.md` — removed the "Backend selection" subsection.
- `.env.example` — removed the `COCOINDEX_CODE_BACKEND` install matrix block.

### Files preserved (the rejected-experiment record)
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`
- `scratch/perf-investigation/` (full H1-H6 evidence)
- This `decision-record.md`
<!-- /ANCHOR:decision -->

---

<!-- ANCHOR:consequences -->
## 4. CONSEQUENCES

### Positive
- CocoIndex production code returns to the pre-014/014 simpler state with one embedding path instead of two.
- The performance regression that ONNX introduced for opt-in users is gone (no foot-gun).
- The full H1-H6 evidence remains in the packet, so a future operator can re-evaluate ONNX on a different model architecture without redoing the investigation.

### Negative
- Windows AMD/Intel GPU users do not get the DirectML acceleration the ONNX backend would have offered. This is a real loss for a small user group; mitigated only if PyTorch's DirectML support improves upstream.
- The 014/014 packet's engineering investment (267 LOC `embeddings_onnx.py` + 72 LOC `backend_state.py` + tests + bench + docs) does not ship to production. The work was not wasted — it produced decision-quality data — but it doesn't run.

### Cross-cutting
- The Neural Engine question is now permanently closed for the EmbeddingGemma-300m model in this repo at the ONNX Runtime layer. Any future NE attempt would have to either (a) change the embedding model to one whose op set is more CoreML-friendly (breaks vector parity with the Memory MCP, which also runs Gemma), or (b) invest in custom `coremltools` conversion + op-by-op patching (weeks of work, unclear ceiling).
<!-- /ANCHOR:consequences -->

---

<!-- ANCHOR:alternatives -->
## 5. ALTERNATIVES CONSIDERED AND REJECTED

| Alternative | Why rejected |
|---|---|
| **Keep ONNX backend as opt-in** | No win on Apple Silicon (measured 5x slower at parity). Real win only for Windows AMD/Intel GPU users — a small group. Maintenance surface (two backends, env gate, parity tests, EP detection, dependency management) is not justified by that audience size. |
| **Static-pad128 trade-off** (fast ONNX, broken parity) | Mean cosine 0.869 with min 0.487 is well below the existing parity bar (mean ≥ 0.995, min ≥ 0.99) and would corrupt search quality for chunks longer than 128 tokens. |
| **Native Core ML conversion via `coremltools`** | The H1 finding (23% op coverage) is a property of the Gemma graph vs CoreML kernels, not a property of ONNX Runtime's CoreML EP. Native Core ML would hit the same op-coverage ceiling. Weeks of work for a likely-marginal win. |
| **Change models to NE-friendly architecture** (e.g., NLEmbedding, smaller BERT variant) | Breaks vector parity with the Memory MCP, which uses Gemma. Vector incompatibility means re-indexing all stored memories. Not justified by the perf delta. |
<!-- /ANCHOR:alternatives -->

---

<!-- ANCHOR:related -->
## 6. RELATED

- Plan: `~/.claude/plans/glittery-juggling-lecun.md` (Decision 1 + Decision 2)
- Successor packet (proposed): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/015-node-llama-cpp-evaluation/`
- Predecessor packet: `../013-v4-cleanup/`
- Parent: `../spec.md`
<!-- /ANCHOR:related -->
