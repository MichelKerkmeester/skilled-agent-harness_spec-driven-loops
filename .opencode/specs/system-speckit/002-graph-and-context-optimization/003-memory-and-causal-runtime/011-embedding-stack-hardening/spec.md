---
title: "Feature Specification: Embedding-stack hardening"
description: "Phase parent for hardening the embedding stack: a correct zero-install selector probe, a shared cross-launcher socket, fail-safe server supervision, operator observability, and measured performance wins before the advisor flag flips on."
trigger_phrases:
  - "embedding stack hardening"
  - "031-embedding-stack-hardening phase parent"
  - "hf-local selector shared socket supervision observability perf"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening"
    last_updated_at: "2026-05-29T18:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All 5 phases (001-005) shipped + committed; flag-flip + live perf numbers gated"
    next_safe_action: "20-iteration spec-kit deep review of the shipped embedding-stack program"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000031"
      session_id: "031-embedding-stack-hardening-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Execution order: strict 001 → 005 (supervision + perf + live test all depend on the shared socket and the instrumentation that precedes them)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Embedding-stack hardening

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete — all 5 phases shipped + committed (2026-05-29); flag-flip + live perf/dtype numbers gated on a working onnxruntime tree |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit |
| **Predecessor** | 029-embedding-consolidation-hf-local-server |
| **Successor** | None |
| **Handoff Criteria** | Each child validates independently; the local embedding stack delivers its zero-install promise, shares one resident server across launchers, fails safe under crash/wedge/disk-full, surfaces its state to operators, and lands its perf wins on measured evidence before the advisor flag flips on |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The local embedding stack does not yet deliver its zero-install promise end to end. The hf-local selector probe gates selection on a Python import that the pure-Node server never satisfies, so fresh Node-only machines reject hf-local and fall through to an error or cloud egress. The two launchers resolve different sockets under shipped config, so the single-owner cross-launcher machinery never fires. Beyond those two gaps, the server can wedge while loading without being reaped, a hung native run keeps reporting healthy, crash loops can spawn-storm, disk-full breaks launcher writes, operators have no read-only view of embedder state, model switches are unsafe, cold-start timeouts are mismatched, the embed path is uninstrumented, reindex issues one POST per row, and the cross-launcher residency has never been validated live.

### Purpose
Harden the post-029 embedding stack across five phases: fix the selector and pin a shared socket with client resilience, make the server fail safe under crashes/wedges/disk-full, surface state to operators with a safe model-switch path and aligned cold-start timeouts, instrument the embed path and land measured perf wins, then live-validate the two-launcher residency and flip the advisor flag on.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, requirements, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and the child-phase manifest for the embedding-stack hardening work.
- Per-phase implementation details (in the child folders).

### Out of Scope
- Detailed per-phase implementation plans at the parent level.
- Generated packet metadata (`description.json`, `graph-metadata.json`), which is produced separately.
- Multi-model residency and any provider-cascade reordering beyond the documented safe model-switch path.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `shared/embeddings/auto-select.ts`, docs, `.mcp.json`, `opencode.json` | Modify | 001 | Swap the selector probe to `/api/health`, delete the Python probe, pin a shared `HF_EMBED_SERVER_URL`, and fix stale Python docs |
| `shared/embeddings/providers/hf-local.ts` | Modify | 001 | Retry on `ECONNRESET`/`EPIPE` and make the readiness-timeout message actionable |
| `.opencode/bin/hf-model-server.cjs`, `.opencode/bin/lib/launcher-ipc-bridge.cjs`, `.opencode/bin/lib/model-server-supervision.cjs`, launchers | Modify | 002 | Wedged-but-loading detection, inference-liveness health fields with a bounded dispose-drain, crash-loop give-up cooldown, and ENOSPC-resilient pid/lease/lock writes |
| `mcp_server/handlers/embedder_status.ts`, doctor `_routes.yaml`, `.opencode/bin/hf-model-server.cjs`, `hf-local.ts`, docs | Modify/Add | 003 | Read-only `/doctor embeddings` route + embedder_status surface, safe model-switch (allowlist + 404 loadedModel + dim-drift warn), and cold-start timeout alignment + first-embed download docs |
| `shared/embeddings/providers/hf-local.ts`, `.opencode/bin/hf-model-server.cjs`, `mcp_server/lib/embedders/{execution-router,reindex}.ts`, `mcp_server/lib/cache/embedding-cache.ts` | Modify | 004 | Instrument the embed path first, then real `/api/embed` batching, a ready-once latch, and cache-into-reindex — all measure-gated |
| live test + bench scripts, `.opencode/bin/lib/model-server-supervision.cjs`, launchers, env/docs | Add/Modify | 005 | Live two-launcher integration test that gates the advisor flag flip to default ON, q8-vs-fp16 bench, idle-eviction (default off), socket-dir ownership + sun_path guard, and staged deprecated-env removal |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, requirements, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-selector-and-shared-socket/ | Swap the selector probe to `/api/health`, delete stale Python probe/docs, pin a shared `HF_EMBED_SERVER_URL` in `.mcp.json` + `opencode.json`, add `ECONNRESET`/`EPIPE` retry, and make the readiness-timeout message actionable | Complete (`910e87c429`) |
| 2 | 002-server-liveness-supervision/ | Wedged-but-loading detection, inference-liveness health fields with a bounded dispose-drain, and a crash-loop give-up cooldown plus ENOSPC-resilient pid/lease/lock writes | Complete (`73ae557901`) |
| 3 | 003-observability-model-switch/ | Read-only `/doctor embeddings` + embedder_status surface, a safe model-switch path (allowlist + 404 loadedModel + dim-drift warn), and cold-start timeout alignment with first-embed download docs | Complete (`6781109b97`) |
| 4 | 004-perf-instrumentation-batching/ | Instrument the embed path first, then real `/api/embed` batching, a ready-once latch, and cache-into-reindex — every win measure-gated | Complete (`47a01c7170`) — instrument + batching + latch shipped; cache-into-reindex + live perf numbers deferred (measure-gated) |
| 5 | 005-live-validation-bench-hardening/ | Live two-launcher integration test that gates the advisor flag flip to default ON, q8-vs-fp16 bench, idle-eviction (default off), perimeter hardening, and staged deprecated-env removal | Complete (`40806392cb`) — perimeter + idle + live-test + cleanup shipped; flag-flip + dtype gated on a working onnxruntime tree |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-selector-and-shared-socket | 002-server-liveness-supervision | Selector picks hf-local when `/api/health` is reachable and Python is absent; both launchers resolve the same pinned socket; transient resets retry and the readiness-timeout message is actionable | tsc + embeddings/auto-select vitest green |
| 002-server-liveness-supervision | 003-observability-model-switch | A stuck cold-load is reaped, health reflects inference liveness with a bounded dispose-drain, and crash loops give up under a cooldown with ENOSPC-resilient writes | bridge age-window + cooldown + fault-injected ENOSPC vitest green |
| 003-observability-model-switch | 004-perf-instrumentation-batching | `/doctor embeddings` reports embedder state read-only, model switch is allowlisted with 404 loadedModel surfaced and dim-drift warned, and cold-start timeouts are aligned | status payload + 404-surfacing + dim-drift vitest + doctor route smoke |
| 004-perf-instrumentation-batching | 005-live-validation-bench-hardening | The embed path is instrumented first, batching/latch/cache wins land on measured p50/p95 + hit-rate evidence | before/after p50/p95 + cache hit-rate + batch sweep captured |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` stay default-off until field data justifies an opt-in idle eviction policy?
- Should `DEFAULT_DTYPE` become device-aware only if the q8-vs-fp16/MPS bench shows fp16 wins, or stay fixed regardless?
- Does this environment support a live daemon + model download for the phase 004-005 measured runs, or must they ship as runnable scripts + gated code?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md, implementation-summary.md.
- **Parent Spec**: See `../spec.md`.
- **Predecessor**: See `../029-embedding-consolidation-hf-local-server/spec.md`.
- **Graph Metadata**: Generated separately as `graph-metadata.json`.
