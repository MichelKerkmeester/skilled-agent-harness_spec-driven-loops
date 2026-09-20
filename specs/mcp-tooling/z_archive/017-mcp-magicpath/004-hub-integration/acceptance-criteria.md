---
title: "Acceptance Criteria: Hub integration for mcp-magicpath"
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
    packet_pointer: "mcp-tooling/017-mcp-magicpath/004-hub-integration"
    last_updated_at: "2026-08-29T12:29:55Z"
    last_updated_by: "session"
    recent_action: "Drafted the hub-integration criteria"
    next_safe_action: "Execute 004-hub-integration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Hub integration for mcp-magicpath

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** mcp-tooling/017-mcp-magicpath/004-hub-integration
**Level:** 2
**Status:** Complete
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a MagicPath request, When it reaches the hub, Then it resolves to the mode | Replaying `hub-router.json` over three MagicPath phrasings resolved each to `mcp-magicpath` at weight 8 | Met | - |
| AC-002 | REQ-002 | Given the registered surface, When the mode declares a mutation posture, Then the declaration is true of it | All 14 registered tools are read-only, so the declared `mutatesWorkspace:false` is literally true of the surface | Met | - |
| AC-003 | REQ-003 | Given the leaf manifest, When it changes, Then it was regenerated rather than authored | `ci-skill-root-metadata.cjs --fix` regenerated it and reported `fixed=1`; it was never hand-edited | Met | - |
| AC-004 | REQ-004 | Given the fleet audit, When it runs with the member present, Then it passes | `checked=14 passed=14 failed=0 fixed=0` with the member present, matching the pre-change baseline | Met | - |
| AC-005 | REQ-005 | Given the backend field, When the mode declares one, Then it distinguishes a CLI reached through Code Mode | `backendKind: "code-mode-cli"`, distinct from `code-mode-remote-mcp` and `figma-desktop-transport` | Met | - |
| AC-006 | REQ-006 | Given the registry, When the entry is added, Then no existing entry is edited | Structural registry diff: added `['mcp-magicpath']`, removed `[]`, edited `[]` | Met | - |
| AC-007 | REQ-007 | Given the hub prose, When a reader looks for members, Then MagicPath appears beside its siblings | `README.md` member row plus both `ROUTER.md` enumerations; zero `three design transports` strings remain | Met | - |

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

**Closeable:** Yes

Every criterion is met. The axis question that opened the phase was answered by the registration rather than by argument: only read-only commands are registered, so the transport axis needed no widening. What the phase did not prove is an advisor-level round trip; routing was established by replaying the router's own tables, which is what the hub reads.
<!-- /ANCHOR:closure -->
