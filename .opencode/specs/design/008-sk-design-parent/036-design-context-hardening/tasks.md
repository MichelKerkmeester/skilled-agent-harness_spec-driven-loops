---
title: "Tasks: harden the context-loading contract"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "context contract hardening tasks"
  - "contrast checker tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/036-design-context-hardening"
    last_updated_at: "2026-06-27T16:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all hardening tasks complete"
    next_safe_action: "Optional executable orchestrator gate; commit the arc"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-036-design-context-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: harden the context-loading contract

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Read the review's cited fix-target files (CO-037, contract, prompt_templates, playbook index)
- [x] T002 Verify F-003 target paths resolve; survey F-006 count locations
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 F-005: remove `--dangerously-skip-permissions` + MiniMax `--variant` from CO-037
- [x] T004 F-003: convert bare filenames to relative paths in context_loading_contract.md
- [x] T005 F-006: reorder Template 16 before RELATED RESOURCES; reconcile 13→16 template counts
- [x] T006 Build `design-foundations/scripts/contrast_check.py` (deterministic WCAG checker)
- [x] T007 Wire the checker into the foundations SKILL row, the contract's CONTRAST PAIRS field, and the worksheet
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Smoke `contrast_check.py` on benchmark values (#787878 fail / #043367 pass; exit 1 on fail)
- [x] T009 sk-doc validate every edited file; confirm Template 16 sequential + zero "13 templates"; routers intact
- [x] T010 Author wrapper docs; generate metadata; run `validate.sh --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Fixes applied + checker wired; all edited files sk-doc VALID; strict validation clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: `../035-design-context-benchmark/review/review-report.md`
<!-- /ANCHOR:cross-refs -->
