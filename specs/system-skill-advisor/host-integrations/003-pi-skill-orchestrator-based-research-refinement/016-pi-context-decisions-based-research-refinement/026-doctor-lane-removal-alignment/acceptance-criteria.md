---
title: "Acceptance Criteria: Align the doctor surface with the removed advisor lane"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor lane removal alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/026-doctor-lane-removal-alignment"
    last_updated_at: "2026-11-21T18:30:00Z"
    last_updated_by: "implementation"
    recent_action: "Marked all fourteen criteria Met with the output each observed"
    next_safe_action: "Commit the implementation on the worktree branch, without a merge to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-026-doctor-lane-removal-alignment"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "A current copy's second apply exits 0 and writes only the recorded base. Reaching phase 7 is derived from the workflow text"
      - "A linked project's apply --dry-run refuses with the same message as record-base"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Align the doctor surface with the removed advisor lane

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 026-doctor-lane-removal-alignment
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. In the Verification cells, `DOCTOR`, `SWEEP`, `ADVISOR` and `FOLDER` are the paths defined in the Task Notation of `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `INSTALL-SKILLED.md` section 5, When its update row is read, Then it names the copied-install command `/doctor:update apply` and the linked-install residue commands `machine` then `apply` from the Skilled checkout | `rg -n 'sweep-lane-residue.mjs machine' INSTALL-SKILLED.md` and `rg -n 'doctor:update apply' INSTALL-SKILLED.md` each print one line in that row. Planning wrote the second pattern as `doctor/update apply`, which cannot match the command, so it is corrected here. Observed: both print line 308, the "To adopt a new Skilled release" row | Met | - |
| AC-002 | REQ-002 | Given a fixture repo with a fixture HOME at a release already applied, When `release-update.cjs apply` runs a second time, Then it exits 0, applies no unit and writes only the recorded base, and the note records whether phase 7 is reached. Planning wrote "an empty `writes` array", and this clause names what was observed | The T002 run output. If phase 7 is not reached, the guide's current-copy path is named in its place. Observed: exit 0, `"writes":[{"path":".skilled/skills/.state/doctor-update/base.json",...}]`, `"appliedUnits":[]`, `"rebuildDatabases":true`, and `"written":[".skilled/skills/.state/doctor-update/base.json"]` on the real second apply. Phase 7 is derived, not observed: the engine exits 0, no workflow phase stops on a plan with nothing to update, and `phase_7_lane_cleanup` runs on every path that reached the rebuild prompt. The test 'an apply at the release already applied writes only the recorded base and exits 0' pins the engine half | Met | - |
| AC-003 | REQ-003 | Given a project whose `.skilled` is a symlink to an outside checkout, When `release-update.cjs apply --dry-run` runs from it, Then it exits non-zero with the message the guide quotes | The T003 run output, and the guide cites that message. Observed: exit 1, `path parent is not a real directory: <project>/.skilled`, quoted in the `INSTALL-SKILLED.md` row, the presentation's section "9. Lane Cleanup" and the release note. The test 'apply in a project whose .skilled links to an outside checkout stops at the link' pins it | Met | - |
| AC-004 | REQ-004 | Given the four cited cleanup prompts, When each runs through `doctor-helper-match.cjs -- "<prompt>"`, Then each prints a `/doctor:update` candidate, and the prompt that names `ollama` is recorded as matching through its other words only | `node DOCTOR/scripts/doctor-helper-match.cjs -- "<prompt>"` for each prompt. Observed: each prints `1) /doctor:update` and `STATUS=OK MATCHES=1` with exit 0. "remove Ollama leftovers" matches "remove leftovers from the retired advisor lane" through `remov, leftover`, and spec.md section 6 records the limit | Met | - |
| AC-005 | REQ-005 | Given the new cleanup phrases in `_routes.yaml`, When each is checked against `IDENTIFIER_TERMS` and `PROSE_TERMS` and the repo mode runs, Then no phrase holds a term, each has three or more words, and repo mode exits 0 with 47 of 47 and `live` 0 | A `node -e` term check prints no hit, and `node SWEEP repo --json` output is quoted here. Observed: the term check prints `hits=0` for the eight added lines, the shortest phrase has three words, and repo mode exits 0 with `"allowlistRows":47,"allowlistRowsMatched":47,"live":0` | Met | - |
| AC-006 | REQ-006 | Given the route edit, When the bridges are regenerated and checked, Then `derive-command-bridges.cjs --check` exits 0 with `"changed": []`, and the four advisor Vitest files exit 0 | The `--check` output and the Vitest pass counts. Observed: `--check` exits 0 with `"changed": []`, the four Vitest files print `Tests  60 passed (60)`, and `doctor-phrase-reach.cjs` exits 0 with `STATUS=OK phrases=262 bridges=35` | Met | - |
| AC-007 | REQ-007 | Given the doctor release, When its version and changelog are read, Then `SKILL.md` reads `version: 1.3.0.0`, `changelog/v1.3.0.0.md` names the six items in plan.md section 3, and `generate-leaf-manifest.cjs --check` exits 0 | `rg -n '^version: 1.3.0.0' .skilled/skills/system-skilled-doctor/SKILL.md`, `ls` of the changelog, and the leaf `--check` output. Observed: `5:version: 1.3.0.0`, the file is listed, `leaf-manifest.json OK` with exit 0, and the entry covers the setup legs, the install steps, the update cleanup, the orphan check, the four dropped health reports and the cleanup routing | Met | - |
| AC-008 | REQ-008 | Given `doctor-setup-run.md`, When its counts are read, Then it states six legs and 26 rows, names the delivery leg, and agrees with `doctor-setup.yaml` and `doctor-setup-presentation.txt` section 2 | `rg -n 'five\|25'` on the playbook prints no leg or row count, and `rg -c 'delivery'` prints at least 1. Observed: the first exits 1 with no line, the second prints `5`, and a script count of the two sources prints six legs and 26 rows | Met | - |
| AC-009 | REQ-009 | Given the three cleanup sites, When they are read, Then each names the same per-install commands, and "Every reader takes both steps" no longer stands for step 1 | `rg -n 'Every reader takes both steps'` prints nothing in the advisor changelog, and `rg -n 'pointed to'` shows the linked-install wording in the presentation. Observed: the first `rg` exits 1, the second prints line 459 with the linked-project pointer, and all three sites name `/doctor:update apply` for a copy and `sweep-lane-residue.mjs machine` then `apply` for a link | Met | - |
| AC-010 | REQ-010 | Given the doctor README `/doctor:update` row, When it is read, Then it names the post-upgrade cleanup | `rg -n 'cleanup' .skilled/skills/system-skilled-doctor/README.md` prints line 42. Observed: it prints line 42 only | Met | - |
| AC-011 | REQ-011 | Given one helper-match case per cleanup phrase, When the test runs before the route edit, Then the new cases fail, and after the route edit they pass | `node --test DOCTOR/scripts/tests/doctor-helper-match.test.cjs` output before T009 and after it. Observed: before, `ℹ pass 23` and `ℹ fail 4` with exit 1, each failure a new case. After, `ℹ pass 27` and `ℹ fail 0` with exit 0. The cases cover the four audit prompts, and the helper's self-recall test covers each of the eight phrases | Met | - |
| AC-012 | REQ-012 | Given the 016 phase map, When row 26 is read, Then it names `026-doctor-lane-removal-alignment` beside rows 24 and 25, and 016 validates strictly with auto-repair off | `rg -n '^\| 26 \|' ../spec.md` prints one line, and the 016 strict run prints `RESULT: PASSED`. Observed: the `rg` prints line 162 with the status In Progress, and the 016 strict run prints `RESULT: PASSED` 27 times and `RESULT: FAILED` none, with exit 0 | Met | - |
| AC-013 | REQ-011 | Given the doctor suite after every edit, When it runs, Then it exits 0 with zero failures, and its pass count is the 1427 baseline plus the new cases | `node --test DOCTOR/scripts/tests/*.test.cjs`, with its `ℹ fail` and `ℹ pass` lines quoted. Observed after the review fix: exit 0, `ℹ tests 1437`, `ℹ pass 1437`, `ℹ fail 0`, which is 1427 plus four positive and four negative helper-match cases and two release-update cases | Met | - |
| AC-014 | REQ-012 | Given this packet's documents after repair-derived, When strict validation runs, Then it prints `RESULT: PASSED` | `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <026> --strict` prints `RESULT: PASSED`, with its exit status quoted. Observed: `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, exit 0 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All fourteen rows are `Met`, and each names the output it observed. AC-001 and AC-002 carry corrections from the implementation run: a search pattern that could not match, and an expected empty write list where the engine writes the recorded base. The packet's handoff criterion also needs a commit, which is still pending, because the implementation run was barred from committing.
<!-- /ANCHOR:closure -->
