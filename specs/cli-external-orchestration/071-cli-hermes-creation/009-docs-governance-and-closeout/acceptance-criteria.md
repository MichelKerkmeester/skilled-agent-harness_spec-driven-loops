---
title: "Acceptance Criteria: Phase 8: docs-governance-and-closeout"
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
    packet_pointer: "scaffold/009-docs-governance-and-closeout"
    last_updated_at: "2026-09-14T17:24:51Z"
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
# Acceptance Criteria: Phase 8: docs-governance-and-closeout

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/009-docs-governance-and-closeout
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
| AC-001 | REQ-001 | Given every roster surface, When grepped for the six mode names, Then `cli-hermes` stands beside them | `grep -c cli-hermes`: root README 3, hub README 5, `AGENTS.md` 1, each orchestrate copy 1, rewrite command 6, each sibling README 1, both presentations 1; `grep -n cli-pi | grep -v cli-hermes` leaves only Pi's own lines | Met | - |
| AC-002 | REQ-002 | Given the hub and packet READMEs, When validated, Then they describe the shipped state with zero issues | `validate_document.py`: root README, hub README, `cli-hermes/README.md` each `Total issues: 0`; README states the four operator steps, the roster, the `.hermes/` surface and the corrected `--yolo` semantics | Met | - |
| AC-003 | REQ-003 | Given the parent packet, When `validate.sh --recursive --strict` runs, Then every folder reports `RESULT: PASSED` | Recorded in the parent goal log at closeout | Met | - |
| AC-004 | REQ-002 | Given the deep-command contracts, When their sources change, Then they are recompiled and drift-free | `compile-command-contracts.cjs --write` for research, review and ai-council; `[CONTRACT DRIFT] OK commands=3` | Met | - |

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

The grep proof and the recursive gate carry the phase. Pre-existing validator findings on `AGENTS.md` (no overview section) and the orchestrate copies (section numbering) were left as found because they predate this packet.
<!-- /ANCHOR:closure -->
