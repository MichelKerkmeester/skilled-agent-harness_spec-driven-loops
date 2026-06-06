# Measurement Backlog — 028 Deep-Research Experiments

The 028 research found that 026 shipped mechanisms but deferred the measurements that prove them optimal. These are the deferred *runs* (not code fixes — the code fixes landed in 029). Ranked by value/cost. Each names the angle, the concrete command/approach, the current status/blocker, and the decision it unblocks.

## 1. q8 vs fp16 embedding dtype (angle 12) — HIGHEST VALUE, BLOCKED
- **Run:** `cd mcp_server && SPECKIT_LIVE_MODEL_TEST=1 node scripts/bench-dtype-q8-fp16.cjs`
- **Status:** BLOCKED. Diagnosed 2026-06-06: `require.resolve('onnxruntime-common')` → MODULE_NOT_FOUND, though `@huggingface/transformers` resolves. The hf-model-server enters `state='error'`, so the bench self-skips with exit 0. hf-local embedding is non-functional on this host; the system runs on the ollama leg of the local-first cascade.
- **Unblock:** resolve the `onnxruntime-common` transitive dep (likely a targeted install/version-align under `@huggingface/transformers`), on a host where the embedding stack can be re-verified afterwards — do NOT do this casually against the shared daemon. Then the bench produces p50/p95 + cosine-recall and decides `DEFAULT_DTYPE`.
- **Decision unblocked:** keep `q8` or make `DEFAULT_DTYPE` device-aware (flip only if fp16/MPS wins p50 by >~20% with recall >= ~0.98).

## 2. Local-vs-cloud retrieval quality A/B (angle 11) — HIGH VALUE
- **Run:** `embedder_set` to Voyage-4 and OpenAI text-embedding-3-small, re-index the 7738-row corpus, run the cat-24/409 fixture + a 50-query holdout, with and without rescue; report top-3 recall + p95.
- **Status:** NOT RUN. Needs cloud API keys + a re-index pass. The 026 bake-off compared local models only; cloud was never in the judged fixture, so local-first cost is UNKNOWN.
- **Decision unblocked:** whether local-first is quality-neutral or carries a measurable recall cost worth a cloud opt-in for some workloads. Pair with a code-domain fixture (angle 14).

## 3. hf-local RSS calibration + sufficiency preflight (angle 13) — MEDIUM
- **Run:** measure peak RSS of the hf-model-server process tree under 100 sequential production-length embeds on Apple Silicon.
- **Status:** NOT RUN (and gated by item 1 — the model must load first).
- **Decision unblocked:** a calibrated default for `SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB` + a free-RAM preflight warning before spawn.

## 4. Fan-out lineage diversity (angles 31, 35) — MEDIUM, SELF-CONTAINED
- **Run:** send the SAME angle set through all three models (MiMo / DeepSeek / MiniMax-M3) and measure finding overlap vs unique findings. (The 028 run partitioned angles for coverage, so it cannot answer this.)
- **Status:** NOT RUN. Fully feasible now (all three providers live + smoke-tested). Lowest external dependency of the backlog.
- **Decision unblocked:** whether heterogeneous fan-out finds materially more than N runs of one model (justifies multi-model deep loops).

## 5. Skill-advisor calibration (angles 27-29) — MEDIUM
- **Run:** ship the semantic-vs-lexical diff report and a 0.8-threshold calibration curve from the existing shadow-delta data.
- **Status:** NOT RUN. Data exists; needs the report harness wired.
- **Decision unblocked:** whether the semantic lane earns its weight and whether 0.8 is the empirical optimum.

## 6. CI fan-out speedup benchmark (angle 21) — LOW/MEDIUM
- **Run:** measure real fan-out wall-clock at K={1,2,3} against an echo baseline (the async-concurrency remediation shipped, but only a stub was tested).
- **Decision unblocked:** confirm the K-times speedup and guard against pool/pump regressions.

## 7. Convergence threshold auto-tuning (angle 34) — LOW
- **Run:** collect iteration-count vs threshold curves across stored deep-loop runs.
- **Decision unblocked:** whether 0.10 (review) / 0.05 (research) are well-calibrated.

---

Provider readiness (verified 2026-06-06): DeepSeek-v4-pro, MiniMax-M3, and Xiaomi MiMo-V2.5-Pro are all configured and smoke-tested via cli-opencode, so items 2/4/5 have no model-availability blocker. Item 1 is the gating dependency repair for the embedding-measurement cluster (1/3).
