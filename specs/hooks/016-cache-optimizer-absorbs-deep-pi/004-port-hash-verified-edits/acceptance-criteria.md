---
title: "Acceptance Criteria: 004-port-hash-verified-edits"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/004-port-hash-verified-edits"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All criteria met against observed evidence"
    next_safe_action: "None; phase closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-004-port-hash-verified-edits"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: 004-port-hash-verified-edits

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 004-port-hash-verified-edits
**Level:** 3
**Status:** Complete
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | An edit whose endpoint hashes drifted is refused | Test moves content between read and write and asserts refusal | Met | - |
| AC-002 | REQ-002 | An edit against an unchanged target applies normally | Accepting case asserted | Met | - |
| AC-003 | REQ-003 | Refusal never falls back to a fuzzy match | No fallback path exists; refusal is the only outcome on mismatch | Met | - |
| AC-004 | REQ-004 | The refusal names what drifted | Refusal text identifies the drifted endpoint | Met | - |
| AC-005 | REQ-005 | The capability is relocatable | Self-contained section with its own counters and write lock, taking nothing from cache state | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR. |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes. Every row is `Met` against an observation rather than an inference.

Each verification cell names a command that was run and read, not a diff that was eyeballed. Where
a check could not be run in this environment it is recorded in the phase's implementation summary
under known limitations rather than being marked met.
<!-- /ANCHOR:closure -->
