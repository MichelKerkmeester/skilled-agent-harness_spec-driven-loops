---
title: "Handover: Memory Reindex + Embed Ingest Performance"
description: "Briefing for a fresh session to measure, spec, and implement performance improvements to the mk-spec-memory reindex/embed pipeline. Embedding runs on Ollama (nomic-embed-text, GPU/Metal) and is NOT the bottleneck; the slow tail is the per-memory ingest pipeline + request serialization. Measure the real hot stage first, then optimize behind a gate. No Rust."
trigger_phrases:
  - "memory reindex embed performance handover"
  - "ollama embed batch parallelize ingest pipeline"
  - "mk-spec-memory reindex slow optimization"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-memory-reindex-embed-performance"
    last_updated_at: "2026-07-22T14:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Wrote handover from the daemon-fix + reindex session"
    next_safe_action: "Measure per-stage timings, then spec"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/embedders/adapters/ollama.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/embedders/execution-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-speckit-031-memory-perf-handover-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

# Handover: Memory Reindex + Embed Ingest Performance

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

A fresh session should **measure, spec, and implement** performance improvements to the mk-spec-memory
reindex/embed pipeline. A full delete + clean reindex of the memory DB (~10,090 memories) this session ran
at only single-digit memories/sec. The embedding compute is **already fast and GPU-accelerated** (Ollama /
Metal) — so the bottleneck is elsewhere. **Do NOT implement blindly: the dominant stage is inferred, not
measured. Instrument first, then optimize behind a feature flag.** Status: not started (briefing only).
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

**Why this exists.** This session fixed a wedged mk-spec-memory daemon (running a 3-day-stale `dist/` +
hung process) by rebuilding the dist and restarting it, then — per operator request — deleted the memory
index and ran a clean full reindex. The reindex was slow; the operator asked how to make it faster and
whether it needs a Rust rewrite. Answer: no Rust; the real levers are batching/parallelism/pipeline. This
handover packages that for implementation.

**Confirmed facts (evidence gathered this session):**
- Embedding backend is **Ollama** (`OllamaAdapter`), serving **`nomic-embed-text:v1.5`**, **already on
  GPU/Metal** (`ollama ps` → `size_vram: 370 MB`, processor GPU; model warm in VRAM). The execution router
  supports `ollama | api | openai | voyage | transformers`; `transformers`/ONNX is only a fallback, not the
  live path. **So embedding compute is native + GPU — not the bottleneck, and not improvable by "adding a
  GPU" (already there).**
- FTS/keyword index rebuilds fast and completed (10,090/10,090). The slow tail is **vector embedding +
  the per-memory ingest pipeline**.
- The reindex processes each memory through: parse markdown → contamination scrub → **generate summary** →
  chunk → embed → FTS index → DB write, **apparently largely serial** (log shows per-memory
  `Generated summary for memory #N`, one at a time).

**NOT verified — the next session MUST confirm before writing code (this is the whole point of measuring):**
1. Does the **Ollama adapter batch** (POST multiple inputs per embed call) or loop **one request per
   memory**? → read `mcp-server/lib/embedders/adapters/ollama.ts`.
2. Is per-memory **"summary generation" a cheap heuristic or an LLM call?** If it is an LLM generation per
   memory, that is very likely the **dominant** cost (bigger than embedding OR pipeline parallelism), and
   the fix is different (cache / defer / skip summaries on full reindex). → grep the ingest path for the
   summary step.
3. Is the reindex loop **serial or already concurrent** over memories? → read
   `mcp-server/lib/embedders/reindex.ts`.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

**Step 0 — MEASURE FIRST (do this before any optimization):** instrument per-stage wall-clock over a
representative sample (~200 memories): parse / scrub / summary / chunk / embed-request / DB-write. Find the
actual dominant stage. Only then spec the fix. Do not assume it is embedding — the evidence points away from
embedding.

**Candidate optimizations (spec only what the measurement confirms):**
1. **Batch + parallelize embed calls** — Ollama supports multi-input embedding + `OLLAMA_NUM_PARALLEL`;
   the router already exposes `resolveEmbedClientMaxBatch` / `MAX_BATCH_SIZE = 100`. If the adapter is
   serial single-request, batch to the max + issue concurrent requests. Win only if embed round-trips are a
   confirmed cost.
2. **Parallelize the ingest pipeline** — run per-memory parse/scrub/summary/chunk across worker threads;
   keep DB writes serialized (single-writer lock) via a batch-write. Win only if the pipeline (esp. summary)
   is a confirmed serial CPU cost.
3. **(Contingent) Cheapen summary generation** — if summaries are LLM-generated per memory, cache / defer /
   skip them on full reindex; likely the single biggest win.

**Discipline (NON-NEGOTIABLE — shared critical infra):**
- The mk-spec-memory daemon is the memory system EVERYTHING depends on. HIGH blast radius. Changes MUST be
  **behind a feature flag, reversible, parity-proven (no recall regression), measured before/after.**
- **Mirror the project's own established pattern** — `sk-design/013-styles-database-rust-opportunities` +
  `015-styles-database-evolution` did measurement-plane-first → shadow → default-flip-with-kill-switch for
  the analogous styles DB. Reuse that shape.
- **No Rust rewrite.** The compute (Ollama → llama.cpp → Metal) is already native + GPU; the sibling
  `system-speckit/030-rust-backend-rewrite-research` packet is researching exactly the "native primitives vs
  targeted native module vs rewrite" question — read its verdict and align. The levers here are
  batching/parallelism/pipeline, not language.
- Single-writer DB lock: embedding + pipeline may parallelize; DB writes stay serialized → batch-write.
- **Build discipline:** implement in `mcp-server/lib/**` (TS), then `npm run build` and **restart the
  daemon** (it runs from `dist/`). A stale `dist/` + hung daemon is exactly what broke this session — always
  rebuild + restart + verify after changes; watch the SessionStart `STALE DIST WARNING`.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [ ] Per-stage timings captured on a ~200-memory sample; the dominant stage is identified with evidence.
- [ ] Only the measured-dominant stage is optimized (no speculative changes).
- [ ] Change is behind a feature flag and reversible.
- [ ] Measured reindex throughput improvement (memories/sec before→after) on a representative sample.
- [ ] Zero recall regression — parity vs pre-change on a fixed query set.
- [ ] `npm run build` run + daemon restarted from fresh dist + health verified (`vectorSearchAvailable`,
  status healthy).
- [ ] Cross-referenced `030-rust-backend-rewrite-research`; confirmed no Rust needed for this work.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

**Key files (entry points):**
- `mcp-server/lib/embedders/adapters/ollama.ts` — the Ollama embed adapter (batching?).
- `mcp-server/lib/embedders/execution-router.ts` — provider routing + `resolveEmbedClientMaxBatch`,
  `MAX_BATCH_SIZE = 100`.
- `mcp-server/lib/embedders/reindex.ts` — the reindex loop (serial vs concurrent).
- The summary path — grep `mcp-server/lib` for `summar` / the `Generated summary for memory #N` producer.
- `scripts/dist/memory/reindex-embeddings.js` — the full-reindex driver (`[5/5] Force reindexing`).
- Tests to extend: `mcp-server/tests/embedders/{execution-router,reindex-durability-cancel}.vitest.ts`.

**Current state (as left):** daemon healthy (restarted from a freshly-rebuilt dist); FTS 100%
(10,090/10,090); vectors backfilling (~429/10,090, draining via the persistent daemon). Pre-reindex DB
backup at `mcp-server/database/backups/context-index.sqlite.pre-reindex-20260722T141849` (385 MB rollback).

**Related:** `system-speckit/030-rust-backend-rewrite-research` (Rust verdict);
`sk-design/013-styles-database-rust-opportunities` + `015-styles-database-evolution` (measurement-first +
gated pattern to mirror).
<!-- /ANCHOR:session-notes -->
