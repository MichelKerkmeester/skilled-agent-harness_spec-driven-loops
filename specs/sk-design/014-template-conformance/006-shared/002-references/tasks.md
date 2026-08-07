---
title: "Tasks: sk-design shared references conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design shared references conformance"
  - "tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/006-shared/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 tasks for template-conformance leaf"
    next_safe_action: "Execute T001 to begin the audit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: sk-design shared references conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Enumerate all files under .opencode/skills/sk-design/shared/references/
- [ ] T002 Read .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Fix: smart-routing.md: has `## 1. OVERVIEW` but NO intro sentence and NO `---` rule between the H1 (line 14) and §1 (line 16) — template requires H1 -> 1-2 short sentences with no headers -> `---` -> `## 1. OVERVIEW`
- [ ] T004 Fix: structural-fingerprint-cards/card-*.md (all 7 files: card-reciprocal-frame, card-deliberate-seams, card-image-counterweight, card-action-punctuation, card-heading-rail, card-layered-body, card-staged-reveal): numbered but sentence-case H2s, §1 named topically (e.g. 'Regions and composition') rather than 'OVERVIEW', no `---` separators — this is ONE consistent edit repeated seven times, not seven separate judgments, and each file is ~51 lines (under the template's 200-line reference bar)
- [ ] T005 Audit remaining files under .opencode/skills/sk-design/shared/references/ not already named above
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Re-read all touched files end-to-end
- [ ] T007 Run validate.sh --strict for this leaf
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
