---
title: "Feature Specification: memory_index_scan UX hardening (deep-research design packet) [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/spec]"
description: "Design-research packet: make the spec-kit memory indexing subsystem (memory_index_scan + embedding pipeline) future-proof, foot-gun-proof, always-completing, degradation-tolerant, and self-healing. The canonical output is research/research.md; this spec.md is the packet control surface."
trigger_phrases:
  - "memory index scan ux hardening"
  - "memory_index_scan async scan job design"
  - "memory index self-healing orphan reconciliation"
  - "012 memory index scan research packet"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening"
    last_updated_at: "2026-05-31T14:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed 5-iteration deep-research design loop (cli-codex + cli-opencode gpt-5.5); synthesized research/research.md (17 sections) + resource-map.md; reconciled against real iteration-5 evidence."
    next_safe_action: "Run /speckit:plan against this packet for the minimal first slice (caller-contract coalescing + memory_health.index + bounded orphan sweep)."
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
`memory_index_scan` couples scope discovery, lexical indexing, and synchronous vector embedding inside one MCP request under a global lease. That coupling produces three observed failure classes: a raw `E429` foot-gun when a second scan lands inside the hardcoded 30s lease window, a `-32001` request-deadline timeout on large/forced scans, and orphan index rows after spec-folder moves (path-based identity + scope-bounded stale cleanup).

### Purpose
A DESIGN research packet (no production code changed) that produces evidence-backed, file:line-cited recommendations for a memory indexing subsystem that is always safe to call, always completes regardless of corpus size, degrades gracefully when the embedder is slow/absent, and self-heals moves/orphans. The canonical synthesis lives in `research/research.md`.

> **Packet note:** This is a deep-research design packet. `research/research.md` (17 sections) is the authoritative deliverable; `spec.md` is the control surface and continuity anchor.
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
| `spec.md`, `description.json`, `graph-metadata.json` | Create | this | Packet control + metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking. Implementation-planning questions (new scan-job tables vs reuse, exact `memory_health.index` field names, orphan-sweep cadence) are recorded in `research/research.md` §9 for the follow-on plan.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Canonical research synthesis**: `research/research.md` (17 sections, file:line-cited)
- **Resource map**: `research/resource-map.md`
- **Per-iteration evidence**: `research/iterations/iteration-001.md` … `iteration-005.md`
- **Parent track**: `../spec.md` (003-memory-and-causal-runtime)
