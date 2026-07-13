---
title: "Tasks: Audit and Fix Map"
description: "Completed audit, routing baseline, and exact 14-fix mapping tasks."
trigger_phrases:
  - "router audit tasks"
  - "fourteen fix tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-subskill-router-alignment/001-audit-and-fix-map"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed audit and mapped all fixes"
    next_safe_action: "Reference downstream phase evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-audit-and-fix-map"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Audit and Fix Map

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Read all ten packet `SKILL.md` files, hub `SKILL.md`, `mode-registry.json`, and `hub-router.json`. [EVIDENCE: source audit]
- [x] T002 Confirm branch `wt/goalAB-skdoc` and workstream-A commit `3048a662e9`. [EVIDENCE: git branch/log commands]
- [x] T003 Capture the six-query advisor and hub-internal routing baseline. [EVIDENCE: `plan.md` Before-State Routing]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 P0-01 remove README audit trigger ownership (`create-readme/SKILL.md`). [EVIDENCE: source diff]
- [x] T005 P0-02 scope flowchart validation to authoring/editing (`create-flowchart/SKILL.md`). [EVIDENCE: source diff]
- [x] T006 P0-03 make existing-document audit/validate ownership explicit (`create-quality-control/SKILL.md`). [EVIDENCE: source diff]
- [x] T007 P1-01 remove bare benchmark while preserving all benchmark-family vocabulary (`create-benchmark/SKILL.md`, router JSON). [EVIDENCE: drift and preservation checks]
- [x] T008 P1-02 remove `:auto`/`:confirm` suffix-only triggers (`create-command/SKILL.md`, router JSON). [EVIDENCE: trigger-line diff]
- [x] T009 P1-03 remove `add documentation` (`create-readme/SKILL.md`, router JSON). [EVIDENCE: final replay]
- [x] T010 P1-04 remove hub-schema trigger words (`create-skill/SKILL.md`, router JSON). [EVIDENCE: trigger-line diff]
- [x] T011 P1-05 remove per-mode hub-identity scoring (`hub-router.json`). [EVIDENCE: router diff]
- [x] T012 P1-06 correct sibling handoff lists across all ten packet files. [EVIDENCE: ten-file handoff scan]
- [x] T013 P2-01 standardize `Activation Triggers` placement across all ten packet files. [EVIDENCE: ten-file structure scan]
- [x] T014 P2-02 standardize the single trigger-line placement across all ten packet files. [EVIDENCE: ten-file structure scan]
- [x] T015 P2-03 standardize `When NOT to Use` headings across all ten packet files. [EVIDENCE: ten-file structure scan]
- [x] T016 P2-04 standardize handoff-list lead-in text across all ten packet files. [EVIDENCE: ten-file structure scan]
- [x] T017 P2-05 use exact backticked sibling packet ids in every handoff list. [EVIDENCE: handoff review]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Verify packet `Keyword triggers:` -> registry alias/vocabulary drift is zero. [EVIDENCE: Node extractor `drift: 0`]
- [x] T019 Re-run the six routing queries and record the delta. [EVIDENCE: phase-004 Routing Delta]
- [B] T020 Exact recursive strict validation exits 3 on stale compiled dist; all ten package checks pass.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All phase-001 audit tasks marked complete
- [x] No blocked audit tasks remain
- [x] Fix map existed before router-source edits
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
