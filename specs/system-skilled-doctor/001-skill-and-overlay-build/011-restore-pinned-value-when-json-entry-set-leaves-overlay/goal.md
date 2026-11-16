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

- [x] `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` with the new tests in the count.
- [x] A test applies a `set`, applies again without it and reads the pin's value from the live file.
- [x] `rg -n 'sets' .skilled/skills/system-skilled-doctor/references/overlays.md` prints at least one line.
- [x] `handover-to-barter.md` exists in this folder.
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
| Operator review of the plan | Done | The operator chose to build this phase first, through DeepSeek v4.1 flash on the Vibe CLI, on 2026-11-16 |
| Build | Done | Seven Vibe runs, each `scratch/vibe-runs/<number>/export.json` records `exit_code` 0 and `outcome` `finished`. Each edited file was compared byte for byte with the text the brief gave |
| Final gate | Done | `node --test .skilled/commands/doctor/scripts/tests` printed `tests 1183`, `pass 1183`, `fail 0`, exit 0. `sk-code-setup-check.cjs` ended `STATUS=OK legs=9` |
| Packet validation after the build | Done | validate.sh --strict printed RESULT: PASSED (errors=0 warnings=2) on 2026-11-16, and the parent tree printed 13 of 13 PASSED |
| Review of the commit on main | Done | A fresh Fable 5.2 session reviewed `cb31e584730` and listed nine findings. Findings 1 to 5 were reproduced on the function with a script |
| Review fix | Done | Five more Vibe runs, 08 to 12, each `export.json` records `exit_code` 0 and `outcome` `finished`. `node --test` on `overlay-engine-sync.test.cjs` printed `tests 35`, `pass 35`, `fail 0` |
| Whole re-pin over a dropped set | Done | Vibe run 13, exit_code 0, outcome finished. overlay-engine-repin.test.cjs printed tests 28, pass 28, fail 0. The test fails on the engine from before this phase |
| Second review and fix | Done | Opus 5.5 reviewed c92aa25378e and listed nine findings. Three were rerun and fixed in Vibe runs 14 to 16: a string array index, an index past the end of the array and duplicate records. The doctor test folder printed tests 1201, pass 1201, fail 0 |
| Recheck fixes | Done | Vibe runs 17 to 22, each exit_code 0, outcome finished, bytes matched. The check after the write now reads the records the run keeps. The doctor test folder printed tests 1204, pass 1204, fail 0 |

### Deviations and findings

| Item | Note |
|------|------|
| The handover asked whether the sync state already records enough to restore a value | It does not. `sync-state.json` holds `files`, `links` and `items`, and `items` is written only from `onListed`, which the array operations call. |
| A key the `set` branch inserts is left behind too | Reproduced in the same script. It is in scope as REQ-002. |
| `setKeyOnItem` has the same shape | Read in the code, not reproduced and not reported. It is open question 1 in `spec.md`. |
| An older test had to change its setup | `a json-entry set adds a key the document does not hold yet` replaced one `set` with another on a fixture with no pinned copy. Under D6 that is a dropped `set` with nothing to restore from, so the refusal named the restore and not the missing parent. The test now keeps the first `set` listed. No assert line changed. |
| The restore across a changed pin is tested on the function, not through a re-pin | The test calls `applyJsonOperations` with a reader that returns the new pin's text. No test runs a whole `repin` over a dropped `set`. |
| Every `set` is recorded, changed or not | A `set` whose value the live file already holds is recorded too. That is what lets the first `apply` under the new engine record a value an older engine wrote. |
| Two of the eight new tests pass without the restore step | The changed-value test needs the record only. The older-state test guards that a tree with no `set` keeps its state bytes, and passes on every engine. |
| The restore wrote another item's value through an array index | Review findings 1 and 2. The record's index was read against the live file and the pin, while the overlay's own inserted item had moved the live index. The operator chose to refuse such a path unless the arrays line up. |
| A key was refused when its record did not say the engine added it | Review finding 4. A record made after an older engine added the key says `added: false`. The operator chose to delete the key while the live value equals the recorded one. |
| Two sets on one path made two records | Review finding 3, first variant. The second record's value never matched the first, so dropping both was refused. One record per path now. |
| Findings left as limits | Finding 3 for a parent and child path and for `insertObjectKeys`, and findings 5 to 9. The operator chose to document them. They are in `handover-to-barter.md` and `implementation-summary.md`. |
<!-- /ANCHOR:log -->
