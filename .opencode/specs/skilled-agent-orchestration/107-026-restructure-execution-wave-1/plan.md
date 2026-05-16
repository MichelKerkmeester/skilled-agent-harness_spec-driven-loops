---
title: "Plan: 107 026 restructure execution Wave 1"
description: "5-wave execution plan per council-approved reduced variant."
trigger_phrases:
  - "107 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/107-026-restructure-execution-wave-1"
    last_updated_at: "2026-05-16T06:51:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan"
    next_safe_action: "Wave 1 renames"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2"
      session_id: "107-plan"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 107 026 restructure execution Wave 1

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Five waves on `main` with per-operation immediate commit and per-wave HEAD baseline. Council-approved reduced variant from 999/resource-map.md §3-§4.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check |
|------|-------|
| Per-rename | strict-validate exits 0 on renamed packet |
| Per-merge | strict-validate exits 0 on both affected packets |
| Per-delete | grep returns 0 hits outside z_archive + 999 |
| Per-archive | source moved to z_archive/; read access intact |
| Wave 4 atomic | 3 parent docs commit together; 026 strict-validate exits 0 |
| Wave 5 final | cocoindex refresh + memory_index_scan |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Per resource-map §3-§4. This packet documents execution; does not modify the proposed structure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Wave 1 — Renames (mechanical)
- W1.1: 014-local-llama-cpp → 014-local-embeddings-migration
- W1.2: 015-global-security-sweep-and-supply-chain-audit → 015-tanstack-security-audit
- W1.3: 006-graph-impact-and-affordance-uplift → 006-external-project-adoption
- W1.4: 002-resource-map-template → 002-resource-map-deep-loop-fix

### Wave 2 — Merges (deepseek-v4-pro via cli-opencode)
Per resource-map §3.3 PROCEED table: M2, M3, M4, M5, M6, M7, M11.

### Wave 3 — Deletes + Archives
- 8 CONTAINED deletes (014/025, 014/026-post-batch-11, 014/027, 014/030, 014/031, 014/043, 014/045, 014/048)
- 28 DEEP archives → z_archive/wave-1/

### Wave 4 — Parent-doc rewrites (atomic)
026/spec.md + 026/resource-map.md + 026/graph-metadata.json refresh per iter 039.

### Wave 5 — Index refreshes
ccc index refresh + memory_index_scan + strict-validate sweep.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Per-rename: grep for old path returns 0 hits outside its own metadata + research artifacts
- Per-merge: strict-validate exits 0 on both source + target packets
- Per-delete: grep for packet name returns 0 hits outside z_archive + 999
- Wave 4: strict-validate on 026 phase parent exits 0
- Wave 5: cocoindex search returns current paths; memory_search returns target packets within top-N
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 999 resource-map.md (revised 2026-05-16 post-council)
- 999 council-review.md
- 999 implementation-dispatch.md
- HEAD baseline `052558f1b`
- cli-opencode + deepseek-v4-pro (primary executor for Wave 2 merges + Wave 4 parent-doc rewrites)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Per-wave HEAD baseline captured via `git rev-parse HEAD > .wave-N-baseline`. On failure: `git reset --hard $(cat .wave-N-baseline)`. Full packet rollback to `052558f1b` is the floor.
<!-- /ANCHOR:rollback -->
