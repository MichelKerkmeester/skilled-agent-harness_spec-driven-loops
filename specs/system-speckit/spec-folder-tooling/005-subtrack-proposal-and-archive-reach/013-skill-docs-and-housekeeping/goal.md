---
title: "Goal: Phase 13: skill-docs-and-housekeeping"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "skill docs and housekeeping goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/013-skill-docs-and-housekeeping"
    last_updated_at: "2026-11-14T11:10:40Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the phase from the two reviews of 2026-11-14"
    next_safe_action: "Start T001 once phases 011 and 012 are committed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-skill-docs-and-housekeeping"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 13: skill-docs-and-housekeeping

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the system-spec-kit skill documents and changelog match the shipped behavior, and leave this packet's records accurate and fully reviewed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `v2.13.0.0` is released and is not edited. Phases 006 to 013 ship as `v2.13.1.0`. |
| D2 | Complete phases 006 to 010 change only in Verify clauses and Known Limitations. Their task state and status stay. |
| D3 | B8 stays an accepted miss under Q014 unless the routing review finds a new defect. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In a `mktemp` copy with `specs/demo/001-a` live and `specs/demo/z_archive/008-b` archived, the next-number command in `SKILL.md` prints 9, the number `create.sh` gives
- [ ] `rg -n 'archivedPaths' .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` and `rg -n 'flat packets' .skilled/skills/system-spec-kit/runtime/cli/spec/README.md` each print a line
- [ ] `.skilled/skills/system-spec-kit/changelog/v2.13.1.0.md` exists and `SKILL.md` line 5 reads `version: 2.13.1.0`
- [ ] `scratch/routing-review.md` holds a verdict on the phase 009 routing change
- [ ] `validate.sh specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach --strict --recursive` prints `RESULT: PASSED` 14 times
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents authored | Done | `spec.md`, `plan.md` and `tasks.md` in this folder, 2026-11-14 |
| Implementation | Pending | Waits for phases 011 and 012 |

### Deviations and findings

| Item | Note |
|------|------|
| Plan verified 2026-11-14 | A fresh Fable 5.2 at high effort returned READY WITH FIXES, in `../review/fable-plan-verification.md`. Applied for this phase: three checks that passed before the work now target the changed line, REQ-007 compares against the highest Q id, the REQ-001 fixture uses `008-b`, the open question is answered, the manifest names `skill-graph.json` too, and task ids match `tasks.md` |
| Fixed during planning | Line 13 of `../decision-record.md` was corrected to name Q010 to Q018 while Q016 to Q018 were recorded, so T012 only confirms it |
| Findings confirmed by the orchestrator | `SKILL.md:295`, `retrieval-conventions.md:84`, `folder-structure.md:141` and `runtime/cli/spec/README.md:114` were checked against the code by the orchestrator on 2026-11-14 |
<!-- /ANCHOR:log -->
