# Handover: Remaining 026 Measurement Experiments

> Supplementary handover. The committed code fixes are done and live; what remains is **runs** (experiments), not fixes. Full backlog with commands: `research/measurement-backlog.md`. Synthesis: `research/research.md`.

## What this session shipped ("fix all" net)

- **4 verified code fixes shipped + live**: causal link/unlink graph-cache invalidation, MiniMax `--variant` forwarding, launcher-ipc-bridge fixture `lib/` copy, code-graph `depthTruncated` signal. Both runtime dists (mk-spec-memory, code-graph) activated.
- **2 research findings corrected during verification**: the causal cache is graph-structure (not entity-density); only one launcher suite had the fixture gap (not two).
- **1 bonus drift fix**: aligned the stale `MEMORY_CAUSAL_OUTPUT_RELATIONS` vocab to canonical `RELATION_TYPES`.
- **Packet metadata + conformance cleaned up**: description.json + graph-metadata.json generated; docs template-conformed.
- **Experiment backlog made actionable**: ranked, with commands + diagnosed blockers (`research/measurement-backlog.md`).

## What remains: the measurement experiments (runs, not fixes)

### Done
- **Item 4: fan-out lineage diversity** (angles 31, 35) — **RUN 2026-06-06** (`research/experiments/fanout-diversity/analysis.md`). Verdict: models diverge (cross-model J 0.42 << 0.6) but no more than one model diverges from itself (same-model J 0.405); trio union only 1.05× the best same-model pair (bar was 1.25×). Heterogeneous fan-out earns its seat as blind-spot insurance + adjudication, not coverage. Bonus verified defect: watcher rename path bypasses `reconcileMoves` and destroys embeddings (`lib/ops/file-watcher.ts:575-582`) — fix candidate.

### Unblocked now — start here
- **Item 5: skill-advisor calibration** (angles 27-29) and **Item 2: cloud-vs-local retrieval A/B** (angle 11) have no model-availability blocker (item 2 needs cloud API keys + a re-index pass).

### Blocked on a dependency repair
- **Items 1 + 3: q8/fp16 dtype bench (angle 12) and hf-local RSS calibration (angle 13)** need `onnxruntime-common` repaired first. Diagnosed 2026-06-06: `require.resolve('onnxruntime-common')` → MODULE_NOT_FOUND though `@huggingface/transformers` resolves, so the hf-model-server enters `state='error'` and the bench self-skips. hf-local embedding is non-functional on this host; the system runs on the ollama leg of the local-first cascade.
- **Do not** repair this casually against the shared daemon mid-session — do it on a host where the embedding stack can be re-verified afterwards, then run `cd mcp_server && SPECKIT_LIVE_MODEL_TEST=1 node scripts/bench-dtype-q8-fp16.cjs`.

## Suggested next step

Item 4 is done (2026-06-06). Next: item 5 (skill-advisor calibration — shadow-delta data exists, needs the report harness wired) or item 2 (cloud A/B) if cloud keys are available. Defer items 1/3 until `onnxruntime-common` is repaired on a verifiable host. Also consider a small fix packet for the verified watcher-rename embedding-loss defect surfaced by the item-4 experiment.
