---
title: "Goal: Phase 13: UX and alignment pass"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "ux and alignment pass goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/013-ux-and-alignment-pass"
    last_updated_at: "2026-11-21T07:47:44Z"
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
# Goal: Phase 13: UX and alignment pass

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the overlay engine's open items and make every doctor surface tell the operator what happened, why and what to run next, with both alignment commands and every drift guard clean.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every finding is fixed, P2 included, or recorded with the reason it is not |
| D2 | Machine tokens that tests, presentation contracts and Barter's hooks match on stay byte-identical; a remedy is a new `Next:` line |
| D3 | Workers that edit `overlay-engine.cjs` run one at a time, each change red-first |
| D4 | Commit only: no push, no gh account switch |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The engine suite passes with 362 or more tests and 0 failing on the merged main
- [x] `run-all-drift-guards.sh` exits 0 on the merged main
- [x] The final `@review` prints `Review status: APPROVED` with no P0 or P1
- [x] `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder
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
| Baseline gates on main | Done | `g013/gates-base-main.txt` in the session scratchpad |
| Drift guard archive scope | Done | `84d61dd6edf`, unittest 39 of 39 |
| Review rounds | Done | Nine rounds. The final verdicts are APPROVED with no P0 or P1 |
| Merge into local main | Done | `058e6091759`, every gate on the merged main at or above its baseline |

### Deviations and findings

| Item | Note |
|------|------|
| Alignment critic | `executors.json` names a cli-opencode critic. The operator named no external CLI, so both critics ran native: `review`, model opus, effort high |
| Alignment scope | Two path runs (`.skilled/commands/doctor`, `.skilled/skills/system-skilled-doctor`) with `--base 57c01fb4c11^ --full-diff`, because the default base and first-parent mode scope 007's merged work to almost nothing |
| Alignment lanes | Lanes ran against the main checkout, which matched the branch start, and returned their JSON through their scratch folders |
| Worker dispatch | Every Agent worker ran with `model: "opus"` and `effort: "medium"`, and every alignment lane and critic with `model: "opus"` and `effort: "high"`, all set on the call |
| Phase folder number | `create.sh --phase` allocated 018; the folder was renamed to the 013 the parent map names |
<!-- /ANCHOR:log -->
