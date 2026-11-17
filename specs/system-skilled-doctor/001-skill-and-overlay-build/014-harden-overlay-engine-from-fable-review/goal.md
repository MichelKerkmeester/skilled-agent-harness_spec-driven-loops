---
title: "Goal: Phase 14: harden-overlay-engine-from-fable-review"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "harden overlay engine from fable review goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/014-harden-overlay-engine-from-fable-review"
    last_updated_at: "2026-11-16T22:20:27Z"
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
# Goal: Phase 14: harden-overlay-engine-from-fable-review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every json-entry difference the records cannot see is reported, and no failed run, missing checkout, malformed file or interrupted write leaves the overlay engine silent or stuck.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Build the nine Fable items the operator chose on 2026-11-16, in four groups: 1; 2 and 3; 4, 5 and 9; 7, 8 and 10. Item 6 and the two held-back items stay out. |
| D2 | The pinned-copy cross-check only reports a difference. It does not become the write path in this phase. |
| D3 | Item 2 lands before item 3, because item 3's fix reads the state item 2 writes early. |
| D4 | Each engine change starts with a test that fails on `969335a6380`. |
| D5 | A dropped key whose record says the overlay did not add it is refused once, with a message naming the fix, never deleted. The operator chose this on 2026-11-17. |
| D6 | The state file moves to schema version 2, and the loader upgrades a version 1 file. The operator chose this on 2026-11-17. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `node --test .skilled/commands/doctor/scripts/tests` prints fail 0 with at least 1230 tests.
- [x] A rerun of apply after a failed regenerate step reruns that step, and a later drop of the item it added removes the item, in a passing test.
- [x] A status run with no readable upstream checkout prints a `NOTE` line naming the skipped stale-root check, in a passing test.
- [x] `validate.sh --strict` on this folder prints `RESULT: PASSED`.
- [ ] The commit is on origin/main, and the vendoring project is told which commit to re-pin to.
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
| Phase scaffolded | Done | Spec, plan and tasks filled from `../013-fix-review-findings-in-json-entry-set-restore/scratch/fable-harden-ux-answer.md` |
| Baseline | Done | Unchanged engine: tests 1220, pass 1220, fail 0 |
| Red run | Done | The 11 new or changed sync tests failed on the unchanged engine: tests 65, pass 54, fail 11 |
| Engine items 1 to 10 | Done | Suite after the first build: tests 1230, fail 0 |
| Skipped-check note for a checkout without the pinned commit | Done | The new test fails with the commit check removed and passes with it |
| Barter read-only status | Done | RESULT unchanged (PASSED), Barter's state files and git status unchanged; two false cross-check lines and two duplicate notes found |
| Regenerate outputs skipped by the cross-check, untracked lines name their target | Done | Four tests failed first at their own assertions, then passed |
| Final suite | Done | tests 1234, pass 1234, fail 0, exit 0; quality gate 0 findings |

### Deviations and findings

| Item | Note |
|------|------|
| Fable's line citations | Written before phase 13's round three and merge; re-anchored to function names at `969335a6380` in `spec.md` |
| D4 for the manifest-write test | The manifest writers already went through `writeFileAtomic` when the test was written, so it never failed first. It passed on its first run |
| Two operator answers after the Barter check | Skip declared regenerate outputs in the cross-check and reword the line; name each untracked operation's target. Recorded in `spec.md` open questions, not as frozen decisions |
| Barter's undeclared output | `system-skilled-doctor/graph-metadata.json` still prints a cross-check line until Barter lists it in a regenerate step's `outputs`; the handover says so |
<!-- /ANCHOR:log -->
