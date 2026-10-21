---
title: "Acceptance Criteria: Phase 1: hf-model-server-idle-default"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hf model server idle default acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-hf-model-server-idle-default"
    last_updated_at: "2026-10-21T09:51:15Z"
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
# Acceptance Criteria: Phase 1: hf-model-server-idle-default

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** [PACKET-ID]
**Level:** [2/3/3+]
**Status:** [Draft/In Progress/Complete]
**Date:** 2026-10-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the variable unset, When `getModelServerIdleConfig()` runs, Then it returns `enabled: true` with the chosen default in milliseconds | vitest case in `launcher-model-server-idle-eviction.vitest.ts` | Unmet | - |
| AC-002 | REQ-002 | Given the variable set to `0`, When the config is read, Then eviction is disabled | vitest case | Unmet | - |
| AC-003 | REQ-003 | Given an evicted model server, When the next embedding request arrives, Then its cold-start time is measured three times and recorded | implementation-summary.md measurement table | Unmet | - |
| AC-004 | REQ-004 | Given the env docs, When read, Then they state the new default and the `0` opt-out | `ENV-REFERENCE.md` row, `.env.example` line, `validate_document.py` exit 0 | Unmet | - |
| AC-005 | REQ-001 | Given a live launcher with no traffic, When the default timeout passes, Then its model server process is gone and the next advisor query brings it back | `ps` before and after, advisor query output | Unmet | - |

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

Not started. Every criterion is Unmet until the phase is built and verified.
<!-- /ANCHOR:closure -->
