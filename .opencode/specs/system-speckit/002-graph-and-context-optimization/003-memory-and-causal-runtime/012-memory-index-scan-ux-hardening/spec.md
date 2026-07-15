---
title: "Feature Specification: memory_index_scan UX hardening (deep-research design packet) [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/spec]"
description: "Design-research packet: make the spec-kit memory indexing subsystem (memory_index_scan + embedding pipeline) future-proof, foot-gun-proof, always-completing, degradation-tolerant, and self-healing. Canonical output is research/research.md; spec.md is the packet control surface."
trigger_phrases:
  - "memory index scan ux hardening"
  - "memory_index_scan async scan job design"
  - "memory index self-healing orphan reconciliation"
  - "012 memory index scan research packet"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening"
    last_updated_at: "2026-05-31T14:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized research.md + resource-map.md"
    next_safe_action: "Run /speckit:plan for the minimal first slice"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/resource-map.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: memory_index_scan UX Hardening (Deep-Research Design Packet)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete (design research) |
| **Created** | 2026-05-31 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`memory_index_scan` couples scope discovery, lexical indexing, and synchronous vector embedding inside one MCP request under a global lease. That coupling produces three observed failure classes: a raw `E429` foot-gun when a second scan lands inside the hardcoded 30s lease window, a `-32001` request-deadline timeout on large/forced scans, and orphan index rows after spec-folder moves (path-based identity + scope-gated stale cleanup).

### Purpose
A DESIGN research packet (no production code changed) producing evidence-backed, file:line-cited recommendations for a memory indexing subsystem that is always safe to call, always completes regardless of corpus size, degrades gracefully when the embedder is slow/absent, and self-heals moves/orphans. The canonical synthesis lives in `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Five design angles: caller contract, timeout hardening, concurrency/multi-writer, embedder resilience/degraded-mode, self-healing/observability.
- Evidence-backed recommendations + tradeoffs + a minimal first implementation slice.

### Out of Scope
- Implementation (a follow-on `/speckit:plan` consumes this research).
- Switching the active embedder or redesigning the vector-shard storage architecture.

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `research/research.md` | Create | research | Canonical 17-section synthesis |
| `research/resource-map.md` | Create | research | Evidence-derived resource map |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json` | Create | this | Packet control + metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- R1: A scan must never surface a raw `E429`; the 30s cooldown becomes an internal thrash-guard.
- R2: A scan/re-embed must always complete regardless of corpus size (no `-32001` request-deadline class).
- R6: Deliver `research/research.md` (17 sections, file:line-cited) + a minimal first slice; change no production code.

### P1 - Required (complete OR user-approved deferral)
- R3: Concurrent callers coordinate without index corruption, duplicate embedding work, or a raw error.
- R4: Embedder slowness/absence degrades to "indexed + searchable, vectors pending", never a wholesale scan failure.
- R5: Moves/renames and orphaned rows self-heal without manual scans, behind an index-freshness/health surface.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC1: 5/5 research iterations complete with per-iteration file:line evidence.
- SC2: `research/research.md` present with 17 sections, a recommended design, and a minimal first slice.
- SC3: `research/resource-map.md` emitted; `config.status = complete`.
- SC4: No production code/config/schema modified by this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Dependency: recommendations build on existing building blocks (`embedder_status` job model, `pending`/`retry` embeddingStatus, atomic claim-by-update); implementation is additive, moderate risk.
- Risk: move-reconciliation false positives — mitigated by requiring a unique packet_id/content-hash match before in-place path updates.
- Risk: auto-reindex trigger thrash — mitigated by feeding triggers through the coalescing scanKey.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Implementation-planning questions (new scan-job tables vs reuse, exact `memory_health.index` field names, orphan-sweep cadence) are recorded in `research/research.md` §9 for the follow-on plan.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Canonical research synthesis**: `research/research.md` (17 sections, file:line-cited)
- **Resource map**: `research/resource-map.md`
- **Per-iteration evidence**: `research/iterations/iteration-001.md` … `iteration-005.md`
- **Parent track**: `../spec.md` (003-memory-and-causal-runtime)
