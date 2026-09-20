---
title: "Acceptance Criteria: CLI transport proof"
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
    packet_pointer: "mcp-tooling/017-mcp-magicpath/001-cli-transport-proof"
    last_updated_at: "2026-08-29T12:29:55Z"
    last_updated_by: "session"
    recent_action: "Recorded the transport-proof criteria as met"
    next_safe_action: "None; this phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: CLI transport proof

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** mcp-tooling/017-mcp-magicpath/001-cli-transport-proof
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
| AC-001 | REQ-001 | Given the thirteen existing manuals, When a `cli` manual is registered, Then no existing manual changes | `.utcp_config.json` closed the phase at sha256 `2fdac285941e9d99`, identical to its pre-phase baseline, with 13 manuals | Met | - |
| AC-002 | REQ-002 | Given a registered `cli` manual, When it is called through Code Mode, Then the CLI's own output returns | A call returned `cli.version "2.3.2"` and `auth.authenticated false` from MagicPath's own JSON | Met | - |
| AC-003 | REQ-003 | Given a deliberately broken command, When it is called, Then the failure is reported rather than silently empty | A missing binary returned `command not found`; an unknown subcommand returned `error: unknown command '...'` | Met | - |
| AC-004 | REQ-004 | Given a tool taking one argument, When a distinctive value is passed, Then that value reaches the command | `echo_arg({token:"SUBST-9f3a-PROOF"})` returned `SUBST-9f3a-PROOF` | Met | - |
| AC-005 | REQ-005 | Given the probe existed only to answer a question, When the phase closes, Then it is promoted or gone | The probe was registered at runtime and written nowhere; the configuration checksum is unchanged | Met | - |

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

The transport was proven by call rather than by reading the plugin's documentation, and the failure path was exercised so the success carries information. What the phase deliberately did not settle is how the transport behaves under authentication or against a discovery command that is slow or wrong; both belong to the phase that registers a real surface.
<!-- /ANCHOR:closure -->
