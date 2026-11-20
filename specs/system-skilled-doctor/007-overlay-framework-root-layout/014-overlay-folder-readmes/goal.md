---
title: "Goal: Phase 14: engine support for overlay folder READMEs"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "overlay folder readmes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/014-overlay-folder-readmes"
    last_updated_at: "2026-11-20T22:06:34Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 14: engine support for overlay folder READMEs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every overlay folder can carry a README whose role the engine defines, `status --audit` reports missing and invalid READMEs without changing any result, and a layout-link path listed twice is refused before anything is written.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The README contract in `scratch/overlay-readme-contract.md` is the engine's specification; a change to it is marked `AMENDED` in that file first. |
| D2 | The docs leg is advisory: it never changes `RESULT:`, the `--json` `result` or the exit code, so no manifest field is added. |
| D3 | Each README is checked by sk-doc's own `validate_document.py`, never by a re-implementation. |
| D4 | Code is built on `worktrees/499-overlay-readmes-and-alignment` and merged into local Skilled main; nothing is pushed. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 with more than 294 tests on Skilled main.
- [ ] Every new behavior test fails against the engine at `bf6806ad4b3`.
- [ ] `status --audit` on Barter's tree prints the same `RESULT:` line and exit code as the engine at `bf6806ad4b3`.
- [ ] `validate.sh --recursive --strict` on the parent packet prints `RESULT: PASSED`.
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
| README contract | Done | `scratch/overlay-readme-contract.md`, copied to the shared scratchpad |
| Engine change | In Progress | Worker running on the worktree branch |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
