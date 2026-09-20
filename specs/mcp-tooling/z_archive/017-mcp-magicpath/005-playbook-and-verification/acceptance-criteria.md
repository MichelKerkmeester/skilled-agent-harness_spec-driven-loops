---
title: "Acceptance Criteria: Playbook and end-to-end verification"
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
    packet_pointer: "mcp-tooling/017-mcp-magicpath/005-playbook-and-verification"
    last_updated_at: "2026-08-29T12:29:55Z"
    last_updated_by: "session"
    recent_action: "Drafted the verification criteria"
    next_safe_action: "Execute 005-playbook-and-verification"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Playbook and end-to-end verification

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** mcp-tooling/017-mcp-magicpath/005-playbook-and-verification
**Level:** 2
**Status:** Planned
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a naturally phrased request, When it runs end to end, Then the account's own data returns | Not yet attempted | Unmet | - |
| AC-002 | REQ-002 | Given an authored scenario, When the phase closes, Then it carries a recorded result | Not yet attempted | Unmet | - |
| AC-003 | REQ-003 | Given no credential, When the refusal scenario runs, Then the expected message is recorded | Not yet attempted | Unmet | - |
| AC-004 | REQ-004 | Given the sibling playbook shape, When this one is written, Then it matches that coverage breadth | Not yet attempted | Unmet | - |
| AC-005 | REQ-005 | Given routing, When a scenario uses unanticipated phrasing, Then the mode still resolves | Not yet attempted | Unmet | - |
| AC-006 | REQ-006 | Given a future failure, When someone reads the playbook, Then the verified CLI version is recorded | Not yet attempted | Unmet | - |

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

Written when the phase closes, not before.
<!-- /ANCHOR:closure -->
