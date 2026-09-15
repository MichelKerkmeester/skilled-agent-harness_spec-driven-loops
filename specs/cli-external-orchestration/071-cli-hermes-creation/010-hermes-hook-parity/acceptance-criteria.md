---
title: "Acceptance Criteria: Phase 1: hermes-hook-parity"
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
    packet_pointer: "scaffold/010-hermes-hook-parity"
    last_updated_at: "2026-09-15T05:17:37Z"
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
# Acceptance Criteria: Phase 1: hermes-hook-parity

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/010-hermes-hook-parity
**Level:** 3
**Status:** Complete
**Date:** 2026-09-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a write in a Hermes session, When the file carries a comment-hygiene violation, Then the post-edit warning is on the tool result | HERMES-024, session `20260915_074652_824086`; re-confirmed in the full run, session `20260915_144442_0ea2d4` | Met | - |
| AC-002 | REQ-001 | Given a `delegate_task` the guard rejects, When called, Then it is blocked before any child runs | HERMES-025, session `20260915_082815_aca5a1` | Met | - |
| AC-003 | REQ-001 | Given an MCP call, When the family is routable, Then the advisory is appended; the Code Mode server stays silent | HERMES-026 (in-process positive; live negative control `TOOLS=10`, `NO_ADVISORY`, session `20260915_083406_ca99f7`) | Met | - |
| AC-004 | REQ-001 | Given a session start, When a guard warns, Then the advisories section carries it | HERMES-027, session `20260915_080054_2ae5e2` | Met | - |
| AC-005 | REQ-002 | Given a write-intent first turn, When the message reaches the model, Then it carries the advisor brief and the gate question | HERMES-028, session `20260915_082955_5bc29b` | Met | - |
| AC-006 | REQ-001 | Given an image analysis, When the tool returns, Then the vision evidence is appended | HERMES-029, re-verified after the core moved off the fail-closed hook onto a 25-second budget, session `20260915_151426_ba137d` | Met | - |
| AC-007 | REQ-001 | Given `HERMES_SPEC_FOLDER`, When the session starts, Then the shared goal core binds it under the session id | HERMES-030, session `20260915_080753_e6cc2e` | Met | - |
| AC-008 | REQ-003 | Given the docs, When validated, Then the sync manifest, hook contract, catalog leaf and playbook pass | validators in the summary | Met | - |

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

Seven live scenarios carry the phase; the four runtime-specific hook packages were left out by nature and named in the directive.
<!-- /ANCHOR:closure -->
