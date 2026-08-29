---
title: "Acceptance Criteria: MagicPath manual and authentication"
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
    packet_pointer: "mcp-tooling/017-mcp-magicpath/002-manual-and-auth"
    last_updated_at: "2026-08-29T12:29:55Z"
    last_updated_by: "session"
    recent_action: "Recorded the registration criteria and the credential gap"
    next_safe_action: "Authenticate, then close AC-001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: MagicPath manual and authentication

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** mcp-tooling/017-mcp-magicpath/002-manual-and-auth
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
| AC-001 | REQ-001 | Given a credential, When a read-only tool is called, Then the account's own records return | Blocked: this machine reports `auth.authenticated false`, so no credentialed call has run | Unmet | - |
| AC-002 | REQ-002 | Given the dotenv loader, When the manual is registered, Then the token resolves by reference and no value is tracked | Superseded by evidence: declaring the variable made registration require a non-empty value, and a non-empty value overrides a stored login session. The manual declares none, a fresh server registers it with 14 tools, and no credential appears in any tracked file | Met | - |
| AC-003 | REQ-003 | Given no credential, When a read-only tool is called, Then the failure names what is missing | Returns a structured `NOT_AUTHENTICATED` object carrying an actionable suggestion | Met | - |
| AC-004 | REQ-004 | Given the registration, When a reader inspects it, Then which tools write is visible without external prose | Every emitted tool carries the `read-only` tag, and the emitter header names the withheld commands | Met | - |
| AC-005 | REQ-005 | Given a declared tool, When checked against the installed CLI, Then the command exists | All 14 matched `magicpath-ai --help` on 2.6.1 | Met | - |
| AC-006 | REQ-006 | Given a tool that supports it, When the command is built, Then structured output is requested | Every emitted command ends with the CLI's JSON output flag | Met | - |
| AC-007 | REQ-007 | Given the version gap, When the phase closes, Then the decision is recorded | Upgraded 2.3.2 to 2.6.1; the bridge returned 2.6.1 with no re-registration | Met | - |

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

Six of seven criteria are met. AC-001 stays unmet because no MagicPath credential exists on this machine, so every tool is proven to resolve and to refuse, and none is proven to return real data. That is a genuine gap rather than a formality, and the phase should not close over it.
<!-- /ANCHOR:closure -->
