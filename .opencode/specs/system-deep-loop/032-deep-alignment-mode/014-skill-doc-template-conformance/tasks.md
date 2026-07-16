---
title: "Tasks: deep-alignment skill-doc template conformance"
description: "Task Format: T### [P?] Description. Maps the six-group conformance across setup, agent execution, and verification."
trigger_phrases:
  - "deep-alignment doc conformance tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/014-skill-doc-template-conformance"
    last_updated_at: "2026-07-13T13:00:00Z"
    last_updated_by: "claude"
    recent_action: "All conformance + verification tasks complete"
    next_safe_action: "Operator review, then commit before merge"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "059-014-skill-doc-template-conformance"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
# Tasks: deep-alignment skill-doc template conformance

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

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Isolate a worktree off origin/v4 with clean, current deep-alignment docs (`wt/0035-deep-alignment-doc-conformance`)
- [x] T002 Locate authoritative template per group + passing sibling exemplar (`deep-review`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 [P] SKILL.md → `skill_md_template.md` + `skill_smart_router.md` (add SMART ROUTING §2, renumber)
- [x] T011 [P] README.md → `skill_readme_template.md`
- [x] T012 [P] references core (4 docs) → `skill_reference_template.md`
- [x] T013 [P] references/adapters (9 docs) → `skill_reference_template.md` (+ HVR reconciliation pass)
- [x] T014 [P] feature_catalog → `create-feature-catalog` templates
- [x] T015 [P] behavior_benchmark → `create-benchmark` templates
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 `package_skill.py --check` on deep-alignment → PASS
- [x] T021 `validate_document.py` clean on every touched doc (38/38)
- [x] T022 Content-preservation diff review per group: `git diff` backtick set-diff shows 0 code identifiers dropped
- [x] T023 `validate.sh --strict` on this packet exit 0
- [x] T024 `implementation-summary.md` written with per-group evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All six groups conform to their templates (`package_skill.py --check` PASS)
- [x] No technical content dropped (`validate_document.py` 38/38 PASS)
- [x] `validate.sh --strict` exit 0 and checklist fully evidenced
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
