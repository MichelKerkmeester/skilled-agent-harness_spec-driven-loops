---
title: "Acceptance Criteria: Phase 8: command-and-playbook"
description: "Checks for the /create:goal command package, its runtime mirrors and the eight-scenario goal-authoring playbook."
trigger_phrases:
  - "create-goal acceptance criteria"
  - "goal playbook closure gate"
  - "goal command mirror checks"
  - "goal command package validation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/008-command-and-playbook"
    last_updated_at: "2026-09-26T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed every criterion with evidence during phase 009 reconciliation"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "01a0d9ec-2944-75e5-9ccb-70819484272a"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operation vocabulary: top-level, phase-parent, child, retrofit, phase-add, amend (phase 004)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: command-and-playbook

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/008-command-and-playbook
**Level:** 2
**Status:** Complete
**Date:** 2026-09-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the command-authoring workflow, When `/create:goal` is authored, Then its router targets the auto and confirm YAML assets and keeps user-facing output in the presentation asset. | Task T005-T007; `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/commands/create/goal.md --type command` and inspect both execution targets. Observed 2026-09-26: `:auto` and `:confirm` resolve to their own YAMLs (`.skilled/commands/create/goal.md:50`); both parse; `validate_document.py --type command` reports 0 issues. | Met | - |
| AC-002 | REQ-002 | Given Phase 004's settled operation names, When the `/create:goal` metadata entry is inspected, Then it has `ownerMode: sk-create-goal` and an argument hint containing every operation plus `:auto` and `:confirm`. | Tasks T001, T008 and T014; parse `.skilled/skills/sk-doc/command-metadata.json` with Node and inspect the entry against Phase 004's accepted output. Observed: one entry, owner `sk-create-goal`, hint `<packet path> [top-level\|phase-parent\|child\|retrofit\|phase-add\|amend] [:auto\|:confirm]`, 86 characters (`.skilled/skills/sk-doc/command-metadata.json:456`). | Met | - |
| AC-003 | REQ-003 | Given the four runtime destinations and create-command index, When each mirror is checked and the index is searched, Then all mirrors resolve and exactly one `/create:goal` row appears. | Tasks T009, T010 and T015; run `test -f` for each mirror and `rg -n '/create:goal' .skilled/commands/create/README.txt`. Observed: all four mirrors resolve with `test -f`; one row in `.skilled/commands/create/README.txt:55`. | Met | - |
| AC-004 | REQ-004 | Given the eight required goal-authoring behaviors, When the playbook package is validated, Then the root index maps each behavior to one scenario file and the validator reports `PASS` with eight scenarios. | Tasks T011, T012, T016 and T017; run `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook` and inspect the index-to-file mapping. Observed: `PASS ... scenarios=8 ... violations=0 warnings=0`; eight scenarios indexed once each (`.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/manual-testing-playbook.md:331`). | Met | - |
| AC-005 | REQ-005 | Given a request to “set the goal” as a session objective, When the playbook scenario is run, Then the request is routed away from `sk-create-goal` and no packet goal is authored. | Tasks T012 and T017; run the session-goal routing scenario and capture the selected route and file changes. Observed 2026-09-26: SCG-007 PASS; the reply names the goal hooks, no goal file and no session state appear, and `goal.cjs packet` prints `code=PACKET_GOAL_NOT_FOUND` (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/scratch/scenario-runs/SCG-007.md:269`). | Met | - |
| AC-006 | REQ-006 | Given a child goal change that alters a parent decision or criterion, When the playbook scenario is run, Then the parent is amended before its chat slice is resent. | Tasks T012 and T017; run the child-change scenario and capture the parent diff and resent chat slice. Observed: SCG-008 PASS; the parent decision was edited before the child, `packet_slice_hash` changed, and `chat_slice` carries the amended decision (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/scratch/scenario-runs/SCG-008.md:1041`). | Met | - |
| AC-007 | REQ-003 | Given the new command and mode, When the Hermes generators run and then run again with `--check`, Then `.hermes/prompts/create-goal.md` and `.hermes/skills/sk-create-goal/SKILL.md` exist and both checks pass | T021; `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check` and `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` Observed: both files exist; `sync-prompts-hermes.cjs --check` PASS 34 prompts and `sync-skills-hermes.cjs --check` PASS 71 copies (`.hermes/prompts/create-goal.md:1`). | Met | - |
| AC-008 | REQ-003 | Given the new command file, When the command-catalog check runs, Then the repo-wide index lists `/create:goal`, its create count is 13 and the check prints `STATUS=OK` | T022; `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` Observed: `STATUS=OK command-catalog-mirror`; row at `.skilled/commands/README.txt:149`, count 13 at `.skilled/commands/README.txt:44`. | Met | - |

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

All eight criteria are `Met` with observed evidence. The command package, its generated runtime copies and the eight-scenario playbook exist and pass their checks, and SCG-007 and SCG-008 passed when run here.
<!-- /ANCHOR:closure -->

---
