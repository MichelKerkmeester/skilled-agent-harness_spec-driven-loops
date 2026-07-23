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
    last_updated_at: "2026-07-23T12:23:33Z"
    last_updated_by: "orchestrator"
    recent_action: "Planned Phase 7 hardening (REQ-007..011)"
    next_safe_action: "Implement REQ-007..011 in ranked order, restart daemon, measure timings"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/031-memory-reindex-embed-performance/handover.md"
      - ".opencode/specs/system-speckit/031-memory-reindex-embed-performance/checklist.md"
      - ".opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/research.md"
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-ingest.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - ".opencode/bin/lib/model-server-supervision.cjs"
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
| **Status** | In progress — data-integrity blocker (scan write-back) fixed + tested; daemon/startup/MCP hardening (REQ-007..011) planned, not yet implemented; per-stage timing measurement (the packet's original objective) not yet started |
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

**Scope addition (daemon/startup/MCP hardening, planned in this pass):** a 7-iteration `/deep:research` loop
(`research/research.md`) hardened five follow-on issues surfaced while fixing REQ-006: a residual gap in the
same write-back bug class (async ingest), an MCP startup reliability race, a latent socket-path overflow bug,
an operability issue with long foreground scans, and a daemon owner-lease race. All five have a confirmed
root cause and a concrete fix design; see REQ-007 through REQ-011. Items 6-8 from the research's ranked list
(observability, launcher/discovery separation, the "canonical context envelope" migration direction) are
explicitly deferred as follow-on/longer-term, not part of this implementation pass.
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
- **REQ-007** — Collapse the duplicate warm-owner MCP startup probes and bound Darwin process inspection. `maybeBridgeLeaseHolder()`'s successful readiness result must be passed into the session proxy so `createSessionProxy().start()` skips its own redundant `waitForDaemonReady()` for the same socket (reattach paths keep probing normally); concurrent per-socket probes must coalesce; `classifyOwnerLease()`'s synchronous `ps` call must run under a timeout. [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:463-485`, `.opencode/bin/lib/launcher-session-proxy.cjs:374-397,842-865`, `.opencode/bin/mk-spec-memory-launcher.cjs:460-497,318-327`]
- **REQ-008** — Make async ingest non-persisting. `memory_ingest_start`'s async worker callback (`memory-ingest.ts:128-132`, calling into `context-server.ts` `processFile`) must pass an explicit non-persisting/scan-equivalent origin into `indexSingleFile`/`indexMemoryFile` — mirroring the REQ-006 fix — so queued and crash-replayed ingest jobs cannot write quality-loop auto-fixes back to source documents. A regression test asserting source-immutability for this path is required, mirroring the existing `handler-memory-index.vitest.ts` write-back regression pattern.
- **REQ-009** — Default manual/maintenance `memory_index_scan` calls to the existing `background: true` job path (`memory-index.ts:2088-2147`, `memory-index-scan-jobs.ts:41-142`) instead of a foreground call with no progress reporting. Must not touch or replace the process-lifetime sidecar writer lock (`db-instance-lock.ts`) — this is an operability fix, not a locking change.
- **REQ-010** — Fence owner-lease stale removal and heartbeat replacement in `mk-spec-memory-launcher.cjs` against the confirmed TOCTOU race (`:432-445,499-521,523-532,535-547`): re-read the lease under the existing election/respawn lock before stale removal, retain the lock through classify → remove → create, and require a `leaseId`/generation token for refresh, release, and cleanup so a stale writer cannot overwrite a successor that won ownership in between.
- **REQ-011** — Ship one canonical short model-socket default. Export `DEFAULT_MODEL_SERVER_SOCKET_DIR`/`DEFAULT_MODEL_SERVER_SOCKET_PATH` constants in `model-server-supervision.cjs` (the same shared `/tmp/mk-hf-embed/hf-embed.sock` target both `opencode.json` and `.claude/mcp.json` already pin) and use them in the empty-environment fallback (`:469-479`) instead of `options.dbDir`, closing the reachable overflow path through the skill-advisor plugin bridge's `createChildEnv()`. Do not repurpose `SPECKIT_IPC_SOCKET_DIR` for this — it is a distinct socket authority (advisor daemon IPC dir).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Dominant reindex stage identified by measurement (not assumption).
- Throughput improvement demonstrated on a representative sample.
- No recall regression (parity); change is flag-gated + reversible.
- Daemon runs the fresh build; health `vectorSearchAvailable: true`, status healthy.
- REQ-007..011: each hardening item has a regression test proving the fixed behavior and no observed regression in the existing launcher/MCP/scan test suites; async ingest source-immutability is verified the same way REQ-006 verified scan/direct.
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
| REQ-007 probe-collapse regresses reattach-path correctness | Reattach paths (not warm-owner discovery) must keep their own `waitForDaemonReady()` probe; test both branches, not just the warm-owner shortcut |
| REQ-010 lease fencing introduces a new deadlock/starvation mode | The adversarial re-verification in `research/research.md` §7.1 confirmed the SQLite sidecar lock is the real integrity boundary regardless of this fix — treat REQ-010 as availability hardening, keep the existing lock semantics untouched, and add tests for the exact interleaving research documented rather than a broader rewrite |
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

**Answered by the 7-iteration `/deep:research` loop (`research/research.md`, canonical output):**
- Is the persistQualityLoopContent write-back bug class fully closed across every caller? → **No** — async
  ingest was a residual gap; now REQ-008.
- Is the OpenCode MCP "server unavailable" transient race fixable? → **Yes** — root-caused to duplicate
  serial startup probes + an unbounded `ps` call; now REQ-007.
- Is the sun_path-overflow fallback in model-server-supervision.cjs a live risk? → **Yes, reachable via the
  skill-advisor plugin bridge under an opt-in flag**; now REQ-011.
- What is holding the context-index.sqlite single-writer lock during the 30-minute memory_index_scan hang? →
  **Not a lock deadlock** — the sidecar lock is process-lifetime, not per-scan; the hang is a foreground scan
  with no progress reporting. Existing `background: true` job path is the fix; now REQ-009. A related
  owner-lease TOCTOU race was also found and fenced as REQ-010 (severity adversarially recalibrated from
  high-impact to moderate-availability-risk — see research §7.1).

**Still open (deferred, tracked in `research/research.md` §12, not blocking REQ-007..011):**
- OpenCode's exact `mcp_timeout` default/retry semantics (requires a live runtime experiment, not static
  reading).
- The specific exceptional branch that caused the original 30-minute hang (no phase/stack telemetry existed
  for that incident; REQ-009's background-job path prevents recurrence regardless).
- Real-world frequency of the REQ-010 lease race under actual concurrent-session storms (requires the
  observability item — research §17 item 6 — which is out of scope for this pass).
<!-- /ANCHOR:questions -->
