---
title: "Acceptance Criteria: Phase 2: check-plumbing"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "check plumbing acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/002-check-plumbing"
    last_updated_at: "2026-10-30T07:00:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: check-plumbing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/002-check-plumbing
**Level:** 2
**Status:** Met
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the new route, When `bash .skilled/commands/doctor/scripts/route-validate.sh` runs, Then it exits 0 | Command output and exit status. Observed: exit 0 with `OK: route-validate — 19 routes validated, 3 warnings`, and the counted route is the `check` route at `.skilled/commands/doctor/_routes.yaml:405` (18 routes before) | Met | - |
| AC-002 | REQ-002 | Given the contract test, When `bash .skilled/commands/doctor/scripts/tests/run-all.sh` runs, Then every suite reports PASS | Command output. Observed after the bridge regeneration and `npm --prefix .skilled/skills/system-skill-advisor/runtime run build`: exit 0 with `7 suite(s) passed, 0 failed`; the node suite reports `tests 600 / pass 600 / fail 0`, discovered by the glob at `.skilled/commands/doctor/scripts/tests/run-all.sh:81`, and the new suite's 14 tests begin at `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs:50` | Met | - |
| AC-003 | REQ-003 | Given generated mirrors, When `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check` and `command-catalog-mirror-check.cjs` run, Then all four exit 0 | Four command outputs. Observed: parity exits 0; codex and pi each print `PASS: 39 prompts are in sync`; the catalog check exits 0 with `STATUS=OK` and 39/39 listed, where the new row is `.skilled/commands/README.txt:145`. The Hermes prompt check also exits 0 | Met | - |
| AC-004 | REQ-004 | Given the surfaces were authored through `/create:command` and sk-create-command, When `doctor-sk-skill-contract.test.cjs` runs, Then the router, presentation and YAML follow `command-router-template.md`, `command-presentation-template.md` and `command-template.md`, and the `families.doctor` entry validates against `command-contract.schema.json` and passes the doctor contract test | Test output plus schema check output. Observed: the test exits 0 with 14 of 14, its template assertions starting at `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs:76` and its schema assertions at `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs:165`; `/usr/bin/python3` jsonschema 4.25.1 `Draft7Validator` reports 0 errors for `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` against `command-contract.schema.json`, and 2 errors once `families.doctor.topology` is removed | Met | - |
| AC-005 | REQ-005 | Given `_routes.yaml`, When the `/doctor:sk-skill` `check` route is read, Then it is the command's only route, carries `mutating: read-only` and no `default_target` | `rg -n -A12 'command: /doctor:sk-skill' .skilled/commands/doctor/_routes.yaml`. Observed: target `check` at `.skilled/commands/doctor/_routes.yaml:406`, `mutating: read-only` at `.skilled/commands/doctor/_routes.yaml:410`, no `default_target`; the contract test asserts it is undefined | Met | Amended 2026-10-30: the bridge deriver refuses `default_target` on a single-target command; phase 006 adds it |
| AC-006 | REQ-006 | Given the setup list, When `rg -n 'doctor:sk-skill check' .skilled/commands/doctor/assets/doctor-setup-presentation.txt` runs, Then it prints one line | Command output. Observed: exactly one matching line, at `.skilled/commands/doctor/assets/doctor-setup-presentation.txt:28`, naming the `check` target | Met | - |

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

Every criterion is `Met`, each with the command output that decided it. The advisor
bridge projection for the new route is regenerated in a later phase, so nothing in this
phase's evidence depends on it.
<!-- /ANCHOR:closure -->
