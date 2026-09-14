---
title: "Acceptance Criteria: Phase 3: cli-hermes-skill-packet"
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
    packet_pointer: "scaffold/004-cli-hermes-skill-packet"
    last_updated_at: "2026-09-14T17:24:47Z"
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
# Acceptance Criteria: Phase 3: cli-hermes-skill-packet

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/004-cli-hermes-skill-packet
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
| AC-001 | REQ-001 | Given the hub with seven modes, When `parent-skill-check.cjs` and `validate_skill_package.py` run on it, Then both pass | Observed 2026-09-14: parent-skill-check OK 0 warnings; package validator PASS for hub and packet | Met | - |
| AC-002 | REQ-002 | Given a Hermes request, When it goes through both routing stages, Then stage one selects the hub and stage two selects `cli-hermes` | advisor 0.95 on the hub; compiled front door routes "delegate to hermes" to `cli-hermes`; vocabulary reach PASSED | Met | - |
| AC-003 | REQ-003 | Given the leaf manifest, When each listed leaf is checked, Then it exists and every hard rule has an implemented check | 10c passes; `dispatch-rule-checks` CI guard passes 11 of 11 | Met | - |
| AC-004 | REQ-004 | Given the six existing modes, When their prompts go through the front door, Then each still resolves to itself | Front door replay for opencode, claude code, codex, cursor, devin, pi | Met | - |

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

All four criteria are met by the hub checkers and the routing replays. Consciously left out: live dispatch proof, which is phase 002's, and the playbook scenarios, which are phase 008's.
<!-- /ANCHOR:closure -->
