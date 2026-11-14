---
title: "Goal: Phase 9: document-corrections"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "document corrections goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections"
    last_updated_at: "2026-11-14T10:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Corrected the five documents and recorded the commit, the validation and the open 033 criterion"
    next_safe_action: "None. The commit is be1aebb9f3 and nothing else is pending"
    blockers: []
    key_files:
      - "specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md"
      - "specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md"
      - ".skilled/skills/sk-git/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-document-corrections"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does phase 033 close in full? No. Its live Pi criterion stays open because no relaunch.log hop line was saved."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: document-corrections

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Five session relaunch documents state what the code and the recorded evidence show: the 002 parent goal binds phases 038 and 039, phase 033 reads Complete with its one open live criterion named, the sk-git rebase rule and the 038 child 011 limitation rows are correct, and the two playbooks name the cases that exist.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The five document fixes share this child, because parent D1 lets document fixes share one child. No code and no test changes, so this child has no failing-first test and says so plainly. |
| D2 | The 002 parent goal gains two compact binding rows, `038` and `039`, paid for by shorter D1 and D7 wording. No decision or criterion changes in meaning. |
| D3 | Phase 033 is set Complete only after its recursive strict validation passed ten times. Criterion 4 stays open because no `relaunch.log` hop line was saved. |
| D4 | The sk-git sentence changes and its fixture copy stays as it is, because a test may compare the fixture bytes. |
| D5 | The 038 child 011 limitation rows and its stale continuity fields change. CHK-004 in its tasks stays unticked, because the live facts were recorded after the source edit. |
| D6 | The two playbooks name only cases that exist once in their test files. The commit gate raises their versions to 1.0.23.0 and 1.0.22.0. |
| D7 | Documents and derived metadata only. No code, no test, no adapter and no live hop. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `goal.cjs packet` on the 002 parent goal prints `packet_durable_chars=3993` and `packet_budget=ok`, and `check-goal.cjs` reports 22 missing rows, all under the exception for 012 to 032 and 037.
- [x] Phase 033 says Complete in its status and nine phase rows, and its goal ticks criteria 1, 2, 3 and 5 while criterion 4 stays open.
- [x] `.skilled/skills/sk-git/SKILL.md:322` says a rebase keeps an id only when the replayed message still carries one.
- [x] The 038 child 011 summary states that the two live facts came after the build and that a live `default` mode is carried.
- [x] Every case the two playbooks name exists once in its test file, and the versions read 1.0.23.0 and 1.0.22.0.
- [x] `git show --stat be1aebb9f3` lists fifteen files, none of them product code or a test, and `git show be1aebb9f3 | rg -c '^new file'` prints 3.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections --strict` prints `RESULT: PASSED`.
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
| Research findings | Done | 2026-11-13, `research/research.md` sections 6 and 9. Ranks 11, 12, 13, 17 and 23 name the parent binding, the 033 status, the sk-git sentence, the 038 child 011 rows and the playbook cases |
| Operator approval | Done | 2026-11-14, through the question tool: "Approve as shown (Recommended)" for the two parent binding rows, and "Document fixes" in the work choice |
| Parent goal | Done | Two compact rows for 038 and 039, with shorter D1 and D7. `scratch/goal-002-parent.txt:2` prints `packet_durable_chars=3993` and `:3` prints `packet_budget=ok`. The exception now covers phase 037, and `check-goal.cjs` still reports 22 missing rows under it |
| Phase 033 | Done | Status and nine rows set to Complete after `validate.sh <033> --recursive --strict` printed `RESULT: PASSED` ten times with exit 0, saved in `scratch/validate-033.txt`. Criteria 1, 2 and 3 were ticked, and criterion 5 was ticked on 2026-11-14 from 1026 of 1026 and 62 of 62 in `scratch/criterion-5-033.txt`. Criterion 4 stays open because no `relaunch.log` was saved |
| sk-git | Done | Line 322 now says a rebase keeps an id only when the replayed message still carries one. The fixture copy under `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/` is unchanged |
| 038 child 011 | Done | Limitation rows 1 and 3 rewritten from `scratch/live-checks.md` and the test `a live default permission mode replaces the launch mode`. Three stale continuity fields updated. CHK-004 stays unticked |
| Playbooks | Done | The Claude playbook uses `cp` in HS-8 and names `deferredAt`. The Pi and OpenCode playbook names `agent_settled`, the Pi mode case, the two OpenCode sub-agent cases and the title case. Every case exists once in its test file. The versions are 1.0.23.0 and 1.0.22.0 |
| Commit | Done | `be1aebb9f3` on 2026-11-14, `Commit-Id` 0013977, fifteen files, 136 insertions and 47 deletions, with 3 new scratch files |
| Validation | Done | Strict validation of every folder the fixes touched passed before the commit. The 033 recursive run is saved in `scratch/validate-033.txt` |

### Deviations and findings

| Item | Note |
|------|------|
| No failing-first test | No code and no test changed, so this child has no red run. Parent D1 lets the five document fixes share one child, and this packet states the exception plainly |
| Phase 033 criterion 4 stays open | The live Pi hop has an armed record and three hop-history lines, but no `relaunch.log` was saved. The status can say Complete for the phase while its goal names the one open criterion |
| `check-goal.cjs` still fails 1 of 5 | The 22 missing binding rows are the recorded exception for phases 012 to 032 and 037. The parent goal binds every phase that holds a `goal.md` |
| Fixture copy untouched | The old sk-git sentence remains under `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/`, because a test may compare its bytes |
| Version bump | The commit gate raised the playbook versions to 1.0.23.0 and 1.0.22.0. No hand edit set them |
<!-- /ANCHOR:log -->
