---
title: "Goal: Phase 12: catalog-and-playbook-alignment"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "catalog and playbook alignment goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/012-catalog-and-playbook-alignment"
    last_updated_at: "2026-11-14T11:10:40Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the phase from the two reviews of 2026-11-14"
    next_safe_action: "Start T001 once phase 011 is committed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-catalog-and-playbook-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: catalog-and-playbook-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the system-spec-kit feature catalog and manual testing playbook describe relocation, restore, archive search and the sub-track proposal as they behave after phase 011.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each sentence is written from the scripts after phase 011, re-read in the code, not copied from a review. |
| D2 | Pages both reviews found current are not edited. |
| D3 | Each changed page passes the sk-doc validator for its kind. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n 'RESULT: FAILED' .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md` prints a line
- [ ] `rg -n 'flat packets' .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md` prints a line
- [ ] `rg -n 'archivedPaths' .skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md .skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/rg-archive-search.md` prints a line for each file
- [ ] The proposal playbook scenario runs the printed map through `relocate.mjs --map` in a `mktemp` copy of the tooling, and that step run by hand exits 1 with no refusal
- [ ] The sk-doc catalog and playbook validators exit 0 on every changed page
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
| Implementation | Pending | Waits for phase 011 |

### Deviations and findings

| Item | Note |
|------|------|
| Plan verified 2026-11-14 | A fresh Fable 5.2 at high effort returned READY WITH FIXES, in `../review/fable-plan-verification.md`. Applied for this phase: the proposal criterion and T008 no longer pass before the work, REQ-008 names the tooling copy the step needs, and REQ-010 names T013 |
| Findings confirmed by the orchestrator | The three P1 rows were checked against the page and the code by the orchestrator on 2026-11-14: `relocate.mjs:1661`, `archive.sh:437-441`, `archive.sh:363`, `rg-wrapper.mjs:382`, `suggest-subtracks.mjs:296` |
<!-- /ANCHOR:log -->
