---
title: "Deep Research Arc Blind Spots - Phase Parent"
description: "Phase parent for the 8-packet follow-on arc that closes deep-research findings across mcp-coco-index retrieval hardening, observability, calibration, metadata, registry, doctor UX, and upstream drift."
trigger_phrases:
  - "deep research arc blind spots"
  - "023 follow-on arc"
  - "mcp-coco-index blind spots"
  - "retrieval hardening arc"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots"
    last_updated_at: "2026-05-20T09:11:27Z"
    last_updated_by: "codex"
    recent_action: "Initialized phase-parent control files for the 023 follow-on arc"
    next_safe_action: "Validate the parent and child phase folders after child folders are placed under this parent"
    blockers: []
    key_files:
      - "001-request-budget-hardening/spec.md"
      - "002-retrieval-observability/spec.md"
      - "003-upstream-rebase-spike/spec.md"
      - "004-metadata-fingerprint/spec.md"
      - "005-doctor-model-swap-ux/spec.md"
      - "006-prompt-license-registry/spec.md"
      - "007-fixture-calibration/spec.md"
      - "008-vec0-migration-fix-deferred/spec.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v2.2 -->
# Deep Research Arc Blind Spots

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This is a lean phase-parent control file. Only {spec.md, description.json,
  graph-metadata.json} live here. Heavy docs (plan, tasks, checklist,
  implementation-summary, decision-record) live in each phase child where they
  stay accurate to that phase's actual work. Phase children own their own
  continuity ladders; resume on this parent first follows
  `graph-metadata.json.derived.last_active_child_id`, else lists children with
  statuses (per /spec_kit:resume step 3b).
-->

---

<!-- ANCHOR:root-purpose -->
## 1. ROOT PURPOSE

The deep-research pass found a cluster of retrieval, metadata, operator UX, and upstream-drift gaps in the mcp-coco-index stack. The follow-on arc splits those gaps into focused packets so request-budget safety, observability, upstream alignment, compatibility metadata, doctor checks, registry accessors, calibration evidence, and deferred vec0 storage work can each be tracked independently.

This parent is the control file for that arc. Detailed plans, checklists, decision records, implementation summaries, evidence, and continuity live in the child phase folders.
<!-- /ANCHOR:root-purpose -->

---

<!-- ANCHOR:phase-map -->
## 2. SUB-PHASE CONTROL FILE

| # | Child folder | Status | Round shipped | Findings closed |
|---|--------------|--------|---------------|-----------------|
| 001 | `001-request-budget-hardening/` | Complete | R1 | 4 |
| 002 | `002-retrieval-observability/` | Complete | R1 | 8 |
| 003 | `003-upstream-rebase-spike/` | Review | R2 | 7 |
| 004 | `004-metadata-fingerprint/` | Complete | R3 | 15 |
| 005 | `005-doctor-model-swap-ux/` | Complete | R3 | 9 |
| 006 | `006-prompt-license-registry/` | Complete | R4 | 4 |
| 007 | `007-fixture-calibration/` | Complete | R6 | 13 |
| 008 | `008-vec0-migration-fix-deferred/` | Deferred | follow-up | 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:what-needs-done -->
## 3. WHAT NEEDS DONE

Keep the 023 follow-on arc discoverable as one parent packet while preserving each child packet's independent validation and evidence trail. Resume work on a specific child when the next action is packet-local; use this parent only for arc-level navigation and rollup.
<!-- /ANCHOR:what-needs-done -->
