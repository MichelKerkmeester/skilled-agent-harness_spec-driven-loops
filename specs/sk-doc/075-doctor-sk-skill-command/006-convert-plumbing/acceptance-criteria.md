---
title: "Acceptance Criteria: Phase 6: convert-plumbing"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "convert plumbing acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/006-convert-plumbing"
    last_updated_at: "2026-10-30T05:21:17Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-convert-plumbing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: convert-plumbing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/006-convert-plumbing
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
| AC-001 | REQ-001 | Given the convert route and its YAML, When `bash .skilled/commands/doctor/scripts/route-validate.sh` runs, Then it exits 0 | route-validate output and exit code | Unmet | - |
| AC-002 | REQ-002 | Given a scratch skill, When `/doctor:sk-skill convert` runs and the operator answers "no", Then the run ends `STATUS=CANCELLED` and no file under the skill folder changed | Manual transcript in `scratch/` plus a `git status` of the scratch folder | Unmet | - |
| AC-003 | REQ-002 | Given the same scratch skill, When the operator answers "yes", Then the run ends `STATUS=OK` and prints the undo list | Manual transcript in `scratch/` | Unmet | - |
| AC-004 | REQ-003 | Given a `local-`-prefixed skill and a dual-declaration fixture, When convert runs, Then each prints `REFUSE:` with its reason and `STATUS=FAIL` | Manual transcript and `doctor-sk-skill-contract.test.cjs` | Unmet | - |
| AC-005 | REQ-004 | Given the activated bridge, When `derive-command-bridges.cjs` then `doctor-phrase-reach.cjs` run, Then the convert phrases reach `/doctor:sk-skill` | `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` output | Unmet | - |
| AC-006 | REQ-005 | Given the extended contract test, When `bash .skilled/commands/doctor/scripts/tests/run-all.sh` runs, Then every suite prints PASS | run-all output | Unmet | - |
| AC-007 | REQ-006 | Given a plain skill with a 140-character description and no `allowed-tools`, When convert plans, Then the plan lists the trim as its own yes and proposes `[Read, Grep, Glob]` for confirmation | Manual transcript in `scratch/` | Unmet | - |
| AC-008 | REQ-007 | Given the edited contract and router, When a JSON Schema validator checks `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` against `command-contract.schema.json` and `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/sk-skill.md --type command` runs, Then both exit 0 and the task log names the `/create:command` run that produced the surfaces | Validator outputs and the T016 log entry. No repository script runs this schema check today (`rg -l 'command-contract.schema.json' .skilled --glob '*.{cjs,mjs,js,py,ts,sh}'` finds none), so the run is recorded in `scratch/` | Unmet | - |

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

No criterion is met yet, because the phase is planned and not started.
<!-- /ANCHOR:closure -->
