---
title: "Goal: Phase 12: manual-testing-scenarios"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios"
    last_updated_at: "2026-11-25T20:02:42Z"
    last_updated_by: "create-goal"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-012-manual-testing-scenarios"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 12: manual-testing-scenarios

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove from a plain terminal that an operator can drive every verb and record phases 001 to 011 deliver, by adding 33 scenarios in ten new category folders to the system-skilled-bots manual testing playbook, the nine conversation scenarios first, and recording one execution of the whole corpus, as phase 12 of the parent goal's OpenBot parity build.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase writes documentation only. No runtime module, CLI verb, test or crate changes, and a scenario that finds a phase's behavior wrong files a defect against that phase rather than editing it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:42]. |
| D2 | The nine conversation scenarios come first, and each is one bash block whose turns are numbered rather than the `json conversation` runner style, because the subject is the bots CLI and not an AI runtime session [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:187]. |
| D3 | The corpus gains 33 scenarios, one per requirement cluster rather than one per requirement, so `BOT-026` to `BOT-058` is the whole addition and 58 is the corpus total [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:52]. |
| D4 | Every timing scenario computes its slot at run time from the current clock plus two minutes and names no future day, and the `until` and fatigue scenarios drive a short loop with no wait [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:189]. |
| D5 | `record-playbook-run.cjs` is the one writer of the run folder, so `results.csv` is never hand-edited, and a scenario that cannot run records `SKIP` with its blocker rather than a silent pass [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:190] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:252]. |
| D6 | A real channel account is an optional operator prerequisite. The channel scenarios run on the fake transport, and a scenario that names a real account records `SKIP` with the missing account as its blocker [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:198]. |
| D7 | Every check runs without a tty: the screen's refusal, its lib-level key handling and the `bots answer` write are each proved by a command that needs no terminal [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:202]. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS package=system-skilled-bots tier=FAIL_CLOSED scenarios=58 categories=17 operator=52 routing_gold_excluded=6 violations=0 warnings=0`, and `rg -c '^## [1-5]\. ' .skilled/skills/system-skilled-bots/manual-testing-playbook/*/*.md` prints 58 lines each holding `5`.
- [ ] `find .skilled/skills/system-skilled-bots/manual-testing-playbook/conversations -name '*.md' | wc -l` prints 9, and `rg -c '^### Turn [0-9]' .skilled/skills/system-skilled-bots/manual-testing-playbook/conversations/*.md` prints nine lines each holding `2` or more.
- [ ] `ls .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints one path, `rg -c '^(PASS|FAIL|SKIP),' .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints 33, `rg -c '^#' .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints 0, `rg -c 'manual-testing-playbook--openbot-parity' .skilled/skills/system-skilled-bots/benchmark/reports/README.md` prints 1, and every id `rg -c '^FAIL,'` prints appears in `scratch/failures.md` with a phase and a requirement.
- [ ] `rg -c '^### BOT-0' .skilled/skills/system-skilled-bots/manual-testing-playbook/manual-testing-playbook.md` prints 58, and `awk '/^## 15\./,0' .skilled/skills/system-skilled-bots/manual-testing-playbook/manual-testing-playbook.md | rg -c '^\| BOT-0'` prints 58.
- [ ] `rg -n 'date -v\+2M|date -d' .skilled/skills/system-skilled-bots/manual-testing-playbook/routines/cron-start-fires-at-computed-slot.md` prints the slot computation, and `rg -n 'seq 1 10' .skilled/skills/system-skilled-bots/manual-testing-playbook/routines/fatigue-after-ten-failures.md` prints the loop.
- [ ] `rg -n 'isTTY|/dev/tty' .skilled/skills/system-skilled-bots/manual-testing-playbook/*/*.md` exits 1, and `rg -c 'mktemp -d' .skilled/skills/system-skilled-bots/manual-testing-playbook/{conversations,routines,activity,terminal-screen,working-place,memory,apps,vault,skills,channels}` prints 33 lines each holding `1` or more.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios --strict` prints `RESULT: PASSED`.
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
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios` prints `RESULT: PASSED (5/5 checks)` |
| Packet validates | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios --strict` prints `RESULT: PASSED` with `Errors: 0  Warnings: 1` |
| Corpus baseline | Done | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS package=system-skilled-bots tier=FAIL_CLOSED scenarios=25 categories=7 operator=19 routing_gold_excluded=6 violations=0 warnings=0` |
| Scenario authoring | Pending | `find .skilled/skills/system-skilled-bots/manual-testing-playbook -mindepth 2 -name '*.md' \| wc -l` prints 25, and no `conversations/` folder exists yet |
| Recorded run | Pending | `ls .skilled/skills/system-skilled-bots/benchmark/reports/` exits 1, so no run folder exists |
| Acceptance criteria | Pending | All twelve rows in `acceptance-criteria.md` read `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent goal | `specs/system-skilled-bots/003-openbot-parity-build/goal.md:77` binds this phase through its row `012-manual-testing-scenarios/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| AC-009's row count is scoped to section 15 here | AC-009's Verification cell counts `^\| BOT-0` across the whole root index, which already holds 8 hub-routing rows in section 7, so the file-wide count would read 66 once the 33 new rows land rather than the 58 the row asks for. Criterion 4 scopes the count to section 15, the cross-reference table AC-009's Given/When/Then names, where 25 rows stand today and 58 is reachable. The implementation run should correct AC-009's Verification cell to the scoped command. |
| Seven criteria carry twelve acceptance rows | Criteria 1 to 7 cover SC-001 to SC-004 and AC-001 to AC-009 and AC-011 to AC-012. AC-010's benchmark index row rides inside criterion 3, so the goal stays inside the seven-criterion limit. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries 11 unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as one warning on a Draft packet, not as an error. |
| Parent metadata fingerprint | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build --strict` reports `GENERATED_METADATA_INTEGRITY: graph-metadata.json: SOURCE_FINGERPRINT_MISMATCH` on the parent, because the child goals are among its source docs. The fix is `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-skilled-bots/003-openbot-parity-build --apply`, which writes outside this phase's folder and belongs to the run that closes the parent. |
<!-- /ANCHOR:log -->
