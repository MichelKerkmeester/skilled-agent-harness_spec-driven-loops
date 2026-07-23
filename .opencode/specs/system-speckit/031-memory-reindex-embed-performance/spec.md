---
title: "Spec: Memory Reindex + Embed Ingest Performance"
description: "Measure, then optimize the mk-spec-memory reindex/embed pipeline. Embedding runs on Ollama (nomic-embed-text, GPU/Metal) and is not the bottleneck; the slow tail is per-memory ingest + request serialization. Measurement-plane-first, gated + reversible, no Rust. Scaffolded with a handover for a fresh implementing session."
trigger_phrases:
  - "memory reindex embed performance spec"
  - "mk-spec-memory ingest pipeline optimization"
  - "ollama embed batch ingest parallelize speckit"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-memory-reindex-embed-performance"
    last_updated_at: "2026-07-22T18:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed startup-scan/watcher write-back gap found by review"
    next_safe_action: "Restart daemon, verify health, then measure per-stage timings"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/031-memory-reindex-embed-performance/handover.md"
      - ".opencode/specs/system-speckit/031-memory-reindex-embed-performance/checklist.md"
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/tests/handler-memory-index.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-speckit-031-memory-perf-handover-session"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions:
      - "Does the Ollama adapter batch requests? Yes — one /api/embed call with all texts as one input array (shared/embeddings/adapters/ollama.ts)."
      - "Is summary generation an LLM call? No — TF-IDF sentence extraction (lib/search/tfidf-summarizer.ts)."
      - "Is the reindex loop serial? Partially concurrent already — batches of 5 via Promise.all (utils/batch-processor.ts)."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: Memory Reindex + Embed Ingest Performance

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-memory-reindex-embed-performance |
| **Level** | 2 |
| **Status** | In progress — data-integrity blocker (scan write-back) fixed + tested; per-stage timing measurement (the packet's original objective) not yet started |
| **Verification** | Measured throughput gain + zero recall regression, behind a flag, daemon rebuilt/restarted |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

A full delete + clean reindex of the memory DB (~10,090 memories) ran at only single-digit memories/sec.
The embedding compute is already fast and GPU-accelerated (Ollama `nomic-embed-text:v1.5` on Metal), so the
bottleneck is the per-memory ingest pipeline and request serialization, not the embedder or the language.
This packet exists to **measure the real hot stage and then optimize it behind a gate** — packaged now as a
handover for a fresh session to spec and implement.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** instrumenting per-stage reindex timings; then, only where measurement confirms, (a) batching +
parallelizing Ollama embed calls, (b) parallelizing the per-memory ingest pipeline (worker threads +
batch-write), (c) cheapening summary generation if it proves to be an LLM-per-memory cost. All behind a
feature flag, reversible, parity-proven.

**Out of scope:** a Rust rewrite (compute is already native + GPU; see `030-rust-backend-rewrite-research`);
changing the embedding model or storage schema; the styles design DB (`sk-design/015`, a separate DB).

**Scope addition (data-integrity blocker, fixed in this pass):** a full scan/reindex was found to write back
quality-loop auto-fixes (including destructive content trimming) to tracked source docs — a direct violation
of ADR-001 ("generated memory is search-only"). Closing this off was a prerequisite for the packet's own
measurement work (Step 0 needs a scan that doesn't mutate the very files it's timing) and is now in scope
here rather than a separate packet, per operator direction. See REQ-006.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — Instrument per-stage timings (parse/scrub/summary/chunk/embed/write) over a ~200-memory sample; identify the dominant stage with evidence before any optimization.
- **REQ-002** — Optimize only the measured-dominant stage(s); no speculative changes.
- **REQ-003** — All changes behind a feature flag and reversible; DB writes stay serialized (single-writer lock) via batch-write.
- **REQ-004** — Measured reindex throughput improvement (memories/sec before→after) with zero recall regression on a fixed query set.
- **REQ-005** — Implemented in `mcp-server/lib/**`, rebuilt (`npm run build`), daemon restarted + health-verified; no Rust.
- **REQ-006** — Scan/reindex-origin indexing must never write back to source docs (ADR-001: generated memory is search-only). `indexMemoryFile` must gate `persistQualityLoopContent` on indexing origin, not hardcode it true; regression-tested so a future change can't silently reintroduce the write-back for scan. This covers every call site that runs unattended, automatic indexing — the explicit `runMemoryIndexScan({force:true})` path, the daemon's `startupScan()`, and the live file-watcher's reindex callback — not only the first one found.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Dominant reindex stage identified by measurement (not assumption).
- Throughput improvement demonstrated on a representative sample.
- No recall regression (parity); change is flag-gated + reversible.
- Daemon runs the fresh build; health `vectorSearchAvailable: true`, status healthy.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Optimizing a non-bottleneck (embedding is already GPU/fast) | Measure per-stage first; the evidence points at the pipeline, not the embedder |
| Shared critical infra — a bad change breaks all memory recall | Feature flag, parity gate, reversible; mirror the 013/015 measurement→shadow→gated pattern |
| Stale dist → wedged daemon (this session's failure mode) | Always `npm run build` + restart the daemon + verify health after changes |
| Parallelism corrupting the single-writer DB | Keep DB writes serialized; parallelize only compute + batch the writes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

**Answered (verified by reading the code, not assumed):**
- Does the Ollama adapter already batch, or embed one request per memory? → **Batches.** One `/api/embed`
  call with all texts as one input array (`shared/embeddings/adapters/ollama.ts`).
- Is per-memory summary generation a heuristic or an LLM call? → **Heuristic.** TF-IDF sentence extraction
  (`lib/search/tfidf-summarizer.ts`), not an LLM call.
- Is the reindex loop serial or already concurrent? → **Partially concurrent already.** The full scan
  processes batches of 5 files via `Promise.all` (`utils/batch-processor.ts`); batches themselves run
  sequentially.

**Still open:**
- With batching/summary-cost largely ruled out, where does full-scan reindex time actually go? Step 0
  (instrument per-stage timings) is still required — the candidate causes narrow to per-file pipeline
  overhead (parse/scrub/chunk/DB-write) and batch-to-batch sequencing, not embedding or summary generation.
- The mis-numbered duplicate packet-folder side effect (observed alongside the content-truncation bug) was
  investigated exhaustively and its causing mechanism was **not located** in the reindex/scan code path. The
  content write-back is fixed (REQ-006); the folder-duplication mechanism remains unconfirmed — treat as an
  open risk to monitor, not as resolved.
<!-- /ANCHOR:questions -->
