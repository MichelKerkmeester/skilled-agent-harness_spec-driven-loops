---
title: "Acceptance Criteria: Phase 1: hermes-contract-pin"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/002-hermes-contract-pin"
    last_updated_at: "2026-09-14T17:24:45Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
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
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: hermes-contract-pin

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/002-hermes-contract-pin
**Level:** 3
**Status:** Complete
**Date:** 2026-09-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a configured provider, When the sanctioned smoke runs, Then exit 0 with the response on stdout and `session_id:` on stderr | Observed 2026-09-14: exit 0, `OK`, `session_id: 20260914_204159_78069f` | Met | - |
| AC-002 | REQ-002 | Given a failing run and a budget-cut run, When they end, Then the exit codes and stderr are recorded | Off-roster id exit 1 with the gateway 400 on stdout; budget expiry exit 0 with a partial answer and no marker | Met | - |
| AC-003 | REQ-003 | Given a write task and a flagged action, When run with and without `--yolo`, Then the ordinary write happens both ways and the flagged action is blocked only without the flag | Observed 2026-09-14: write without flag → `DONE`, file present; `rm -rf` without flag → `BLOCKED ... single-query mode (-q) runs without a user present`; with flag → ran. Criterion reworded on evidence | Met | - |
| AC-004 | REQ-004 | Given a prompt with shell metacharacters, When passed through `--query-file`, Then it arrives verbatim | Verbatim echo observed | Met | - |
| AC-005 | REQ-005 | Given the repo is trusted, When the skills tree is scanned, Then the verdict is recorded | Whole-tree link: every hub quarantined after a ten-minute scan; per-skill link loads via `-s` | Met | - |
| AC-006 | REQ-006 | Given the Hermes source, When project-level `.hermes/` readers are grepped, Then the list is recorded | Skills, plugins, write guard; no project config | Met | - |

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

All six criteria are met live. One research claim fell: `--yolo` gates only flagged actions, and the packet now says so everywhere.
<!-- /ANCHOR:closure -->
