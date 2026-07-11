---
title: "Tasks: Phase 11 — Split code-quality Checklist + Flagged-File Exemptions"
description: "Task checklist with evidence for the code-quality checklist split and the code-review exemptions."
contextType: "implementation"
importance_tier: "normal"
trigger_phrases:
  - "018 phase 011 tasks code-quality checklist split"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/011-code-quality-and-flagged"
    last_updated_at: "2026-07-11T15:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "code-quality checklist split (3 parts) + rewired; code-review exemptions documented"
    next_safe_action: "Commit phase 011, then phase 012 rollup"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11 — Split code-quality Checklist + Flagged-File Exemptions

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row carries evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Compute boundaries for code_quality_checklist.md — 3 parts (216/221/105)
- [x] T002 Dry-run splitter (fixed, blank-line preserving) — coverage contiguous; ≤231/part
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Apply split: 3 parts created, source deleted
- [x] T004 Rewire code-quality/SKILL.md RESOURCE_MAP (→3 parts) + 10 prose/link mentions (→first part)
- [x] T005 Fix 3 code-webflow enforcement.md cross-links to the split checklist
- [x] T006 Repair part internal links (xlink_rewrite); verify code-review's own checklist untouched
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T007 Gate: 3 hub guards 21/21; dangling grep clean; all part links resolve; full-suite 11 == baseline (0 regressions)
- [x] T008 Record the two code-review exemptions (SKILL.md 545, playbook 699) in the spec
- [ ] T009 Commit phase 011
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
Checklist split; routes rewired; dangling-clean; exemptions documented; `validate.sh --strict` = 0 errors; committed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`, `plan.md`, `implementation-summary.md`
- code-quality router: `../../../../skills/sk-code/code-quality/SKILL.md`
<!-- /ANCHOR:cross-refs -->
