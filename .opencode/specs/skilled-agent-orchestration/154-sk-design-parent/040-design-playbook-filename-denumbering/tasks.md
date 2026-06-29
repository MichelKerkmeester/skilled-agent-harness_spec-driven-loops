---
title: "Tasks: Phase 40: design-playbook-filename-denumbering"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "design playbook denumbering tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/040-design-playbook-filename-denumbering"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/040-design-playbook-filename-denumbering"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 40: design-playbook-filename-denumbering

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 [P] GLM 5.2 high (cli-opencode): rename + ref-rewrite design-interface, design-motion, design-foundations playbooks
- [x] T002 [P] GPT 5.5 high/fast (cli-codex): rename + ref-rewrite design-md-generator (+ feature_catalog cross-refs), design-audit playbooks
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `git add` the sk-design playbook + design-md-generator feature_catalog paths (explicit paths, not `git add -A`)
- [x] T004 Filename sweep: `find sk-design -path '*manual_testing_playbook*' -name '[0-9][0-9]*.md'` = 0; category folders still numbered
- [x] T005 Link integrity: no reference to a `NNN-*.md` per-feature filename remains live inside sk-design
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Commit by explicit path with required trailers; push
- [x] T007 Write implementation-summary.md; reconcile parent phase map + continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 0 numbered playbook filenames; no dangling references; folders preserved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
