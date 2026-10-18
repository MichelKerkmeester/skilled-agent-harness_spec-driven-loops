---
title: "Goal: Phase 9: sk-code-opencode-alignment"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "sk code opencode alignment goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/009-sk-code-opencode-alignment"
    last_updated_at: "2026-10-18T12:45:09Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-sk-code-opencode-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: sk-code-opencode-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Align every code file that phases 002 to 008 changed with the sk-code OPENCODE surface, so that the drift guards and the comment-hygiene check pass and no P0 or P1 review finding stays open.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| Parent | Parent decisions D1 to D7 bind this phase and are not restated here. |
| L1 | A fix lands in the file that holds the defect, never in a wrapper, a test-only copy or a second file. |
| L2 | Each fix batch edits only the files named in the ledger rows it closes. |
| L3 | A finding closes only after the gate or suite it names runs and its output is read. |
| L4 | P2 findings may be deferred, and each deferral records its reason in `findings.md`. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 0 on the final tree
- [ ] `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` exits 0 on every code file that phases 002 to 008 changed
- [ ] `findings.md` in this folder lists no P0 or P1 finding with status Open
- [ ] Every suite that phases 002 to 008 touched reports a pass count at or above its count in `001-unknowns-and-baseline/baseline.json`
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
| Planning documents filled | Done | The six documents in this folder, written from the phase 009 brief and research sections 6, 8, 9 and 11 |
| Review of phase 002 to 008 code | Pending | None yet |
| Fix batches | Pending | None yet |
| Gates | Pending | None yet |

### Deviations and findings

| Item | Note |
|------|------|
| Comment-hygiene check | The brief names it in scope but not in acceptance. Acceptance row AC-002 covers it, so the packet closes on it. |
| Findings ledger | The scaffold has no findings file. This phase creates `findings.md`, because the completion criteria read it. |
<!-- /ANCHOR:log -->
