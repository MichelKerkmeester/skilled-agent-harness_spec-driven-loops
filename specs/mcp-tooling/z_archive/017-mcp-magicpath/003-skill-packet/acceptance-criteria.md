---
title: "Acceptance Criteria: The mcp-magicpath mode packet"
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
    packet_pointer: "mcp-tooling/017-mcp-magicpath/003-skill-packet"
    last_updated_at: "2026-08-29T12:29:55Z"
    last_updated_by: "session"
    recent_action: "Recorded the packet criteria as met"
    next_safe_action: "Close once the credentialed surface is proven"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: The mcp-magicpath mode packet

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** mcp-tooling/017-mcp-magicpath/003-skill-packet
**Level:** 2
**Status:** In Progress
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the hub-member shape, When the packet is written, Then it carries no hub-root metadata file | None of the four hub-root metadata files exists in the packet | Met | - |
| AC-002 | REQ-002 | Given the registration, When the packet documents a tool, Then that tool exists in the emitted manual | Every documented callable matched the live 14-name namespace; the set difference is empty | Met | - |
| AC-003 | REQ-003 | Given the entry contract, When a reader consults it, Then it states when NOT to route here | The entry contract carries the negative-routing statement alongside the positive one | Met | - |
| AC-004 | REQ-004 | Given an operator without a credential, When they read the packet, Then they learn how to authenticate and what failure looks like | The credential reference records both the login flow and the refusal envelope | Met | - |
| AC-005 | REQ-005 | Given the mutation boundary, When the packet describes the surface, Then reading and writing are distinguished | The mutation-boundary reference names the withheld commands and the reason | Met | - |
| AC-006 | REQ-006 | Given the packaging gate, When it runs, Then the packet reports clean | The fleet metadata audit reported 14 checked, 14 passed, 0 failed | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Every criterion is met, but closure waits on the phase it depends on: the packet documents a surface whose credentialed behaviour is still unproven, so what it says a tool returns is inherited from the vendor rather than observed.
<!-- /ANCHOR:closure -->
