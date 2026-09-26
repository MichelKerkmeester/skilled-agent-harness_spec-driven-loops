---
title: "Acceptance Criteria: Phase 6: goal-conformance-check"
description: "Six unmet criteria govern fixture behavior, budget reuse, corpus reporting and the phase handoff."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/006-goal-conformance-check"
    last_updated_at: "2026-09-26T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed every criterion with evidence during phase 009 reconciliation"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: null
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: goal-conformance-check

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/006-goal-conformance-check
**Level:** 2
**Status:** Complete
**Date:** 2026-09-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. AC-ID remains stable; each row maps to a task in tasks.md.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a phase child has no row in the binding table while its identifier remains elsewhere, When the row-removal fixture runs, Then the check reports missing-binding-row. | node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs (T004, T006). Observed 2026-09-26: exit 0, 8 of 8 pass; `binding-row-removed-but-identifier-mentioned` fails only `missing-binding-row` while `001-contract` stays in a criterion (`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:38`) | Met | - |
| AC-002 | REQ-002 | Given the objective, a decision cell or a criterion contains its template placeholder, When the matching placeholder fixture runs, Then the check reports template-placeholder. | node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs (T004, T006). Observed: the objective, decision and criterion placeholder fixtures each fail only `placeholder` with code `template-placeholder` (`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:39`) | Met | - |
| AC-003 | REQ-003 | Given a goal has fewer than three or more than seven criteria, When the count fixture runs, Then the check reports criteria-count. | node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs (T004, T006). Observed: `criteria-count-out-of-range` fails only `criteria-count` (`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:42`) | Met | - |
| AC-004 | REQ-004 | Given a phase-parent goal exceeds the manifest budget, When the budget fixture runs, Then the check reports parent-budget using goal-slice.cjs. | node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs (T003, T004, T006). Observed: `over-budget-parent` fails only `parent-budget`, measured through the imported `goal-slice.cjs` (`.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:18`, `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:43`) | Met | - |
| AC-005 | REQ-001-004 | Given a valid packet goal, When the positive fixture runs through the selected check, Then it passes all four checks. | node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs (T004, T006). Observed: the positive fixture passes all four checks (`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:66`) | Met | - |
| AC-006 | REQ-005-006 | Given the selected checker-owner route and active goal corpus, When its read-only scan runs, Then it prints scan and per-check counts and records no file repairs. | Both routes (T001, T005, T007, T009). Local: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` printed `goals_scanned=300`, `phase_parents_scanned=30` and four counts; `git status` showed no corpus goal changed (`specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/scratch/corpus-report.txt:1`). Amendment: the request is recorded and the validator is unchanged (`specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/implementation-summary.md:97`) | Met | - |
| AC-007 | REQ-007 | Given the mode after this phase, When `SKILL.md` and `references/README.md` are read, Then `SKILL.md` names the checker run in its workflow and the index lists it | T010; `grep -n check-goal` on both files. Observed: `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:110` runs the checker before handoff and `.skilled/skills/sk-doc/sk-create-goal/references/README.md:34` lists it | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
**Closeable:** Yes

All seven criteria are `Met` with observed evidence. The checker passes its positive fixture, fails each negative fixture for its named reason, and phase 009 reran it against the real target packet.
<!-- /ANCHOR:closure -->
