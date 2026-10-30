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
**Status:** Planned
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the new route, When `bash .skilled/commands/doctor/scripts/route-validate.sh` runs, Then it exits 0 | Command output and exit status | Unmet | - |
| AC-002 | REQ-002 | Given the contract test, When `bash .skilled/commands/doctor/scripts/tests/run-all.sh` runs, Then every suite reports PASS | Command output | Unmet | - |
| AC-003 | REQ-003 | Given generated mirrors, When `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check` and `command-catalog-mirror-check.cjs` run, Then all four exit 0 | Four command outputs | Unmet | - |
| AC-004 | REQ-004 | Given the surfaces were authored through `/create:command` and sk-create-command, When `doctor-sk-skill-contract.test.cjs` runs, Then the router, presentation and YAML follow `command-router-template.md`, `command-presentation-template.md` and `command-template.md`, and the `families.doctor` entry validates against `command-contract.schema.json` and passes the doctor contract test | Test output plus schema check output | Unmet | - |
| AC-005 | REQ-005 | Given `_routes.yaml`, When the `/doctor:sk-skill` `check` route is read, Then it carries `default_target: true` and `mutating: read-only` | `rg -n -A12 'command: /doctor:sk-skill' .skilled/commands/doctor/_routes.yaml` | Unmet | - |
| AC-006 | REQ-006 | Given the setup list, When `rg -n 'doctor:sk-skill check' .skilled/commands/doctor/assets/doctor-setup-presentation.txt` runs, Then it prints one line | Command output | Unmet | - |

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

The phase is planned and no criterion has been verified yet.
<!-- /ANCHOR:closure -->
