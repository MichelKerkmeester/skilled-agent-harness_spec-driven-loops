---
title: "Task Breakdown: Skill Metadata JSON Templates"
description: "Executed tasks for the four template assets, the canonical template map, and the cross-skill links."
trigger_phrases:
  - "skill metadata templates tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/023-skill-metadata-templates"
    last_updated_at: "2026-07-28T14:02:48Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded executed tasks"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-skill-metadata-templates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Task Breakdown: Skill Metadata JSON Templates

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete; execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Inventory create-skill/assets template coverage against the eight contract file types
- [x] T-02 Check system-skill-advisor for template assets to relocate (none exist)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-03 parent-skill-command-metadata-template.json (core schema, worked entry, gate rules in the note)
- [x] T-04 parent-skill-leaf-aliases-template.json (authored-hub-only warning; S is generated)
- [x] T-05 skill-graph-metadata-template.json + skill-leaf-manifest-config-template.json mirroring init_skill.py's emitted shapes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-06 Per-class template map added to the canonical contract doc; version 1.1.1.0
- [x] T-07 Parent-hub doctrine related-resources rows; advisor SKILL.md pointer + stale alias-sync sentence fixed
- [x] T-08 sk-doc leaf manifest regenerated (fixed=1) + compiled manifest re-minted; gates 11/11, suite pass, templates parse
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Template map covers all eight types; four new scaffolds parse; all gates green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · Summary `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
