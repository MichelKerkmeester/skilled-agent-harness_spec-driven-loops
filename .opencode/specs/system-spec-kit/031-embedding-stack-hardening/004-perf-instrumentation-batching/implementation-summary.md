---
title: "Implementation Summary: Perf instrumentation + batching (measure-first)"
description: "Spec authored only; implementation pending. Will instrument the embed path first (per-request ms + rolling p50/p95 + queue depth), then land real /api/embed batching, a ready-once latch, and cache-into-reindex — every win measure-gated."
trigger_phrases:
  - "perf instrumentation batching implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/004-perf-instrumentation-batching"
    last_updated_at: "2026-05-29T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-1 implementation-summary placeholder (spec authored only)"
    next_safe_action: "Implement phase 004"
    blockers: []
    key_files:
      - ".opencode/bin/hf-model-server.cjs"
      - "mcp_server/lib/embedders/reindex.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003144"
      session_id: "031-004-impl-summary"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-perf-instrumentation-batching |
| **Completed** | Not started — spec authored only, implementation pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Spec authored only; implementation pending. No code has been written for this phase yet.

Planned scope (see `spec.md` and `plan.md`): instrument the embed path first (per-request inference ms + rolling p50/p95 + queue depth, folding into the phase-002 health fields); then land real `/api/embed` batching with an empirical `EMBEDDER_REINDEX_BATCH_SIZE` sweep; add a ready-once latch re-validated lazily on error / after a TTL; and wire cache-into-reindex gated on a measured `getCacheStats()` hit-rate. No perf change lands without measured before/after evidence.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| _Pending_ | _Pending_ | Implementation not started; see `spec.md` §3 Files to Change for the planned set |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. This summary is a placeholder created during spec authoring; it will be filled in once the phase is implemented and verified (and the perf wins are measured).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| _Pending_ | Decisions will be recorded once implementation begins |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Implementation | PENDING — spec authored only |
| Measured before/after p50/p95 + hit-rate | PENDING |
| `validate.sh --strict` on this packet | PENDING |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Implementation pending** — this phase has been spec-authored only; no code, tests, bench, or docs have changed yet.
2. **Measurement may require a live model** — if this environment cannot run a live reindex, the perf wins will ship as runnable bench scripts + gated code with measured-vs-script-only reported honestly.
<!-- /ANCHOR:limitations -->
