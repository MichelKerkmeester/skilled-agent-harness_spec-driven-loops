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
    last_updated_at: "2026-11-21T17:30:00Z"
    last_updated_by: "planning"
    recent_action: "Authored the planning documents and the acceptance criteria for this packet"
    next_safe_action: "Run the implementation's setup observations T002 and T003 before any guide edit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-026-doctor-lane-removal-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a current copy's apply reach phase 7 (REQ-002)?"
      - "Does a linked project's apply refuse with the same message as record-base (REQ-003)?"
    answered_questions: []
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
**Status:** Draft
**Date:** 2026-11-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. In the Verification cells, `DOCTOR`, `SWEEP`, `ADVISOR` and `FOLDER` are the paths defined in the Task Notation of `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `INSTALL-SKILLED.md` section 5, When its update row is read, Then it names the copied-install command `/doctor:update apply` and the linked-install residue commands `machine` then `apply` from the Skilled checkout | `rg -n 'sweep-lane-residue.mjs machine' INSTALL-SKILLED.md` and `rg -n 'doctor/update apply' INSTALL-SKILLED.md` each print one line in that row | Unmet | - |
| AC-002 | REQ-002 | Given a fixture repo with a fixture HOME at a release already applied, When `release-update.cjs apply` runs a second time, Then it exits 0 with an empty `writes` array, and the note records whether phase 7 is reached | The T002 run output, quoted in the Observed cell. If phase 7 is not reached, the guide's current-copy path is named in its place | Unmet | - |
| AC-003 | REQ-003 | Given a project whose `.skilled` is a symlink to an outside checkout, When `release-update.cjs apply --dry-run` runs from it, Then it exits non-zero with the message the guide quotes | The T003 run output, quoted in the Observed cell, and the guide cites that message | Unmet | - |
| AC-004 | REQ-004 | Given the four cited cleanup prompts, When each runs through `doctor-helper-match.cjs -- "<prompt>"`, Then each prints a `/doctor:update` candidate, and the prompt that names `ollama` is recorded as matching through its other words only | `node DOCTOR/scripts/doctor-helper-match.cjs -- "<prompt>"` for each prompt, output quoted in the Observed cell | Unmet | - |
| AC-005 | REQ-005 | Given the new cleanup phrases in `_routes.yaml`, When each is checked against `IDENTIFIER_TERMS` and `PROSE_TERMS` and the repo mode runs, Then no phrase holds a term, each has three or more words, and repo mode exits 0 with 47 of 47 and `live` 0 | A `node -e` term check prints no hit, and `node SWEEP repo --json` output is quoted in the Observed cell | Unmet | - |
| AC-006 | REQ-006 | Given the route edit, When the bridges are regenerated and checked, Then `derive-command-bridges.cjs --check` exits 0 with `"changed": []`, and the four advisor Vitest files exit 0 | The `--check` output and the Vitest pass counts, quoted in the Observed cell | Unmet | - |
| AC-007 | REQ-007 | Given the doctor release, When its version and changelog are read, Then `SKILL.md` reads `version: 1.3.0.0`, `changelog/v1.3.0.0.md` names the six items in plan.md section 3, and `generate-leaf-manifest.cjs --check` exits 0 | `rg -n '^version: 1.3.0.0' .skilled/skills/system-skilled-doctor/SKILL.md`, `ls` of the changelog, and the leaf `--check` output | Unmet | - |
| AC-008 | REQ-008 | Given `doctor-setup-run.md`, When its counts are read, Then it states six legs and 26 rows, names the delivery leg, and agrees with `doctor-setup.yaml` and `doctor-setup-presentation.txt` section 2 | `rg -n 'five|25'` on the playbook prints no leg or row count, and `rg -c 'delivery'` prints at least 1 | Unmet | - |
| AC-009 | REQ-009 | Given the three cleanup sites, When they are read, Then each names the same per-install commands, and "Every reader takes both steps" no longer stands for step 1 | `rg -n 'Every reader takes both steps'` prints nothing in the advisor changelog, and `rg -n 'pointed to'` shows the linked-install wording in the presentation | Unmet | - |
| AC-010 | REQ-010 | Given the doctor README `/doctor:update` row, When it is read, Then it names the post-upgrade cleanup | `rg -n 'cleanup' .skilled/skills/system-skilled-doctor/README.md` prints line 42 | Unmet | - |
| AC-011 | REQ-011 | Given one helper-match case per cleanup phrase, When the test runs before the route edit, Then the new cases fail, and after the route edit they pass | `node --test DOCTOR/scripts/tests/doctor-helper-match.test.cjs` output before T009 and after it | Unmet | - |
| AC-012 | REQ-012 | Given the 016 phase map, When row 26 is read, Then it names `026-doctor-lane-removal-alignment` beside rows 24 and 25, and 016 validates strictly with auto-repair off | `rg -n '^\| 26 \|' ../spec.md` prints one line, and the 016 strict run prints `RESULT: PASSED` | Unmet | - |
| AC-013 | REQ-011 | Given the doctor suite after every edit, When it runs, Then it exits 0 with zero failures, and its pass count is the 1427 baseline plus the new cases | `node --test DOCTOR/scripts/tests/*.test.cjs`, with its `ℹ fail` and `ℹ pass` lines quoted in the Observed cell | Unmet | - |
| AC-014 | REQ-012 | Given this packet's documents after repair-derived, When strict validation runs, Then it prints `RESULT: PASSED` | `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <026> --strict` prints `RESULT: PASSED`, with its exit status quoted | Unmet | - |

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

**Closeable:** No

Every row is `Unmet`, because the implementation run has not started. The setup observations in T002 and T003 come first, since their results set the wording of AC-001.
<!-- /ANCHOR:closure -->
