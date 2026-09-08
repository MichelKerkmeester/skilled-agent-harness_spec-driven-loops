---
title: "Acceptance Criteria: 003-port-retry-loop-guard"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/003-port-retry-loop-guard"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All criteria met against observed evidence"
    next_safe_action: "None; phase closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-003-port-retry-loop-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: 003-port-retry-loop-guard

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 003-port-retry-loop-guard
**Level:** 3
**Status:** Complete
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | A repeated whole-batch failure escalates instead of re-issuing | Driven retry storm escalates and stops | Met | - |
| AC-002 | REQ-002 | Any successful call resets the streaks | Success mid-streak resets, asserted through the hooks | Met | - |
| AC-003 | REQ-003 | The guard cannot fire on a first attempt | Dedicated test asserts silence on attempt one | Met | - |
| AC-004 | REQ-004 | One legitimate retry is unaffected | Single-retry case asserts the guard stays silent | Met | - |
| AC-005 | REQ-005 | Guard state does not persist across sessions | State is per-session and never written to disk | Met | - |

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
