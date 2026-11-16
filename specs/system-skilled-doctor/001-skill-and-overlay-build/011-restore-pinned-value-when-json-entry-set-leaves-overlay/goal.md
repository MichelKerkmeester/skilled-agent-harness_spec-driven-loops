---
title: "Goal: Phase 11: restore-pinned-value-when-json-entry-set-leaves-overlay"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "restore pinned value when json entry set leaves overlay goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/011-restore-pinned-value-when-json-entry-set-leaves-overlay"
    last_updated_at: "2026-11-16T09:33:06Z"
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
# Goal: Phase 11: restore-pinned-value-when-json-entry-set-leaves-overlay

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A `set` operation that leaves a `json-entry` overlay source takes its value out of the live file, so a vendoring project never pins a value only to undo one.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Plan first. The operator chose analyze and plan on 2026-11-16. No engine file changes until the operator has read `plan.md`. |
| D2 | The vendoring project's tree at `barter/ai-speckit` is read-only. Work it must do is written to `handover-to-barter.md` in this packet. |
| D3 | Each engine change starts with a test that fails first, and is paired with a test that the nearest person-edit case still refuses. |
| D4 | The restore works from a record in `sync-state.json`, not from a comparison of the whole live file with the pin. |
| D5 | This phase restores `set` only. `setKeyOnItem` is named as a known limit and not built. The operator chose this on 2026-11-16. |
| D6 | When the pinned copy cannot be read, the engine refuses the overlay and writes nothing. The operator chose this on 2026-11-16. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` with the new tests in the count.
- [ ] A test applies a `set`, applies again without it and reads the pin's value from the live file.
- [ ] `rg -n 'sets' .skilled/skills/system-skilled-doctor/references/overlays.md` prints at least one line.
- [ ] `handover-to-barter.md` exists in this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Item 7 checked against the engine | Done | `scratch/repro-removed-set.cjs` printed `after apply with the set removed: sk-doc (text unchanged: true)`, exit 0 |
| Spec, plan and tasks | Done | This folder |
| Packet validation | Done | `validate.sh --strict --quiet` printed `RESULT: PASSED (errors=0 warnings=0)` on 2026-11-16 |
| Operator review of the plan | Pending | None yet |
| Build | Pending | None yet |

### Deviations and findings

| Item | Note |
|------|------|
| The handover asked whether the sync state already records enough to restore a value | It does not. `sync-state.json` holds `files`, `links` and `items`, and `items` is written only from `onListed`, which the array operations call. |
| A key the `set` branch inserts is left behind too | Reproduced in the same script. It is in scope as REQ-002. |
| `setKeyOnItem` has the same shape | Read in the code, not reproduced and not reported. It is open question 1 in `spec.md`. |
<!-- /ANCHOR:log -->
