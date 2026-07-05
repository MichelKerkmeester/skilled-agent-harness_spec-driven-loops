---
title: "Tasks: Parent Scaffold and Governance Docs"
description: "Task list for 008-parent doc authoring and ADR decision-records."
trigger_phrases:
  - "parent scaffold governance docs tasks"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/009-research-backlog-remediation/007-parent-scaffold-and-governance-docs"
    last_updated_at: "2026-07-01T08:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Parent Scaffold and Governance Docs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read all 7 of 008's children's implementation-summary.md files
- [x] T002 Read `002-convergence-profile-unification-adr/decision-record.md` as the format reference; read `003-cross-mode-anti-convergence-adr` and `005-anchor-ownership-conflict-adr`'s own spec.md/implementation-summary.md for their real decisions
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Wrote real `008-loop-systems-remediation/tasks.md` aggregating the 7 children — zero template markers, independently re-confirmed
- [x] T004 Wrote real `008-loop-systems-remediation/implementation-summary.md` — per-child delivery table + verification table citing each child's own re-run evidence (test counts, RED/GREEN status), independently spot-checked against 2 children's own summaries
- [x] T005 Wrote `003-cross-mode-anti-convergence-adr/decision-record.md` — real content (antiConvergence contract, fail-closed stopPolicy, optimizer invariant group), mirrors the `002` reference structure
- [x] T006 Wrote `005-anchor-ownership-conflict-adr/decision-record.md` — real content (key-questions generated projection, resolveQuestionConflicts(), question_conflict event), mirrors the `002` reference structure
- [x] T007 Confirmed both ADR folders are Level 1 (matching sibling `002`, which also has no checklist.md) — `checklist.md` not required, none created
- [x] T008 Fixed `008-loop-systems-remediation/spec.md`'s Level annotation: `<!-- SPECKIT_LEVEL: 1 -->` → `2`, table row `1 (phase parent)` → `2`. Also fixed 2 leftover "six children"/"six independently-shipped" mentions elsewhere in spec.md prose (flagged but correctly left untouched by the dispatch since its write-scope was limited to the two specific Level spots) — closed by this orchestrating session
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Grepped the two rewritten 008-parent files for leftover template markers (`template-author`, `scaffold/008`, `[template:`) — independently re-confirmed: 0 hits
- [x] T010 Ran `validate.sh` on `008-loop-systems-remediation` (auto-recurses into all 7 children, all pass) and both ADR folders. Initial run showed `GENERATED_METADATA_INTEGRITY`/drift failures on all 3 (expected — `description.json`/`graph-metadata.json` were correctly outside the dispatch's allowed write paths); this orchestrating session regenerated metadata for all 3 folders and re-confirmed **all PASSED, 0 errors**
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 10 tasks complete; 008-parent docs real and evidence-backed (zero template markers); both ADRs have real, evidence-grounded decision-records; validate.sh --strict/recursive clean on all 3 touched folders.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md` · Plan: `./plan.md` · Implementation summary: `./implementation-summary.md`
- Source findings: `../../research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-015, F-008/G-007, F-018)
<!-- /ANCHOR:cross-refs -->
