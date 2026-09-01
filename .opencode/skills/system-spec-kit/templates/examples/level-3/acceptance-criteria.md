---
title: "Acceptance Criteria: User Authentication"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
---
# Acceptance Criteria: User Authentication

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** examples/level-3
**Level:** 3
**Status:** Complete
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a visitor on the registration form, When they submit a valid email and password, Then a user row exists and a success message is shown | `tests/auth/register.test.ts:24` | Met | - |
| AC-002 | REQ-002 | Given a registered user, When they submit valid credentials, Then a token is issued and they land on the dashboard | `tests/auth/login.test.ts:31` | Met | - |
| AC-003 | REQ-003 | Given a registration request, When the password is persisted, Then only a bcrypt hash of 10 rounds is stored | `tests/auth/hash.test.ts:12` | Met | - |
| AC-004 | REQ-004 | Given malformed input, When the form is submitted, Then the email format and the 8-character minimum are enforced | `tests/auth/validation.test.ts:18` | Met | - |
| AC-005 | REQ-005 | Given a request without a valid token, When a protected route is called, Then the API returns 401 | `tests/auth/guard.test.ts:9` | Met | - |
| AC-006 | REQ-006 | Given a completed build, When the security review runs, Then the security team records sign-off | Security review record | Met | - |
| AC-007 | REQ-007 | Given an invalid login, When the error renders, Then it is generic and does not enumerate credentials | `tests/auth/login.test.ts:57` | Met | - |

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

Every criterion is met with a cited test. Nothing was waived, so the decision record carries no closure ADR.
<!-- /ANCHOR:closure -->
