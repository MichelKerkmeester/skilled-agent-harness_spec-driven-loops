---
title: "Feature Specification: deep-* skills release cleanup (000-release-cleanup phase parent)"
description: "Phase parent grouping the per-skill release-cleanup work for the five deep-* skills. Each child bucket is itself a phase parent holding that skill's release-cleanup packet plus its follow-on remediation phases."
trigger_phrases:
  - "deep skills release cleanup"
  - "000-release-cleanup"
  - "deep-* release cleanup arc"
  - "per-skill release cleanup buckets"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup"
    last_updated_at: "2026-05-25T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-parent-control-files-authored"
    next_safe_action: "resume-via-active-child-bucket"
    blockers: []
    key_files:
      - "001-deep-loop-runtime/spec.md"
      - "002-deep-research/spec.md"
      - "003-deep-review/spec.md"
      - "004-deep-ai-council/spec.md"
      - "005-deep-agent-improvement/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "116-000-release-cleanup-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Structure: phase parent with 5 per-skill buckets (one per deep-* skill)"
      - "Each bucket is itself a phase parent: its skill release-cleanup packet plus follow-on remediation children"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: deep-* skills release cleanup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-23 |
| **Last Updated** | 2026-05-25 |
| **Branch** | `main` |
| **Parent Spec** | `116-deep-skill-evolution/spec.md` |
| **Parent Packet** | skilled-agent-orchestration/116-deep-skill-evolution |
| **Handoff Criteria** | Each bucket passes `validate.sh --strict --recursive` independently; metadata + memory index reflect the nested layout |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The five deep-* skills (`deep-loop-runtime`, `deep-research`, `deep-review`, `deep-ai-council`, `deep-agent-improvement`) each required release-cleanup work — documentation alignment, reference splits, gate-model reconciliation, finding remediation, and citation hygiene. That work spans one release-cleanup packet per skill plus several follow-on remediation phases surfaced by the per-skill deep-research and deep-review loops.

### Purpose

Group the per-skill release-cleanup work under one phase parent so the release-cleanup arc reads as five skill buckets rather than a flat list of mixed-topic packets. Each bucket is itself a phase parent owning that skill's release-cleanup packet and its follow-on remediation children.

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. Per-skill orientation lives in each bucket's own `spec.md`; detailed planning, tasks, checklists, decisions, and implementation summaries live in the leaf phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Five per-skill buckets (`001`..`005`), each a phase parent
- Each bucket's release-cleanup packet plus its follow-on remediation children
- The lean trio (`spec.md`, `description.json`, `graph-metadata.json`) at this parent and at each bucket

### Out of Scope

- Modifying any deep-* skill source code from this parent level
- Re-narrating per-skill cleanup decisions here (they live in the bucket/leaf docs)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each row is a per-skill bucket phase parent. Drill into the bucket's own `spec.md` for its leaf phases.

| Bucket | Folder | Skill | Children | Status |
|--------|--------|-------|----------|--------|
| 001 | `001-deep-loop-runtime/` | deep-loop-runtime release cleanup + cross-cutting evergreen + reference/asset alignment | 3 | In Progress |
| 002 | `002-deep-research/` | deep-research release cleanup + reference split | 1 | In Progress |
| 003 | `003-deep-review/` | deep-review release cleanup + gate-model reconciliation + phase-5 backlog | 2 | In Progress |
| 004 | `004-deep-ai-council/` | deep-ai-council release cleanup + deep-mode docs/tests | 1 | In Progress |
| 005 | `005-deep-agent-improvement/` | deep-agent-improvement release cleanup + finding remediation | 2 | In Progress |

### Phase Transition Rules

- Each bucket is independently executable; buckets carry no implicit ordering dependency
- Run `validate.sh --recursive` on this parent or on any bucket to validate that subtree
- Resume on this parent follows `graph-metadata.json.derived.last_active_child_id`; if absent, pick a bucket from the table above
<!-- /ANCHOR:phase-map -->

---

## RELATED DOCUMENTS

- **Parent**: `116-deep-skill-evolution/spec.md`
- **Bucket children**: 5 per-skill phase parents enumerated above
- **Graph Metadata**: see `graph-metadata.json` for `children_ids` and `derived.last_active_child_id`
