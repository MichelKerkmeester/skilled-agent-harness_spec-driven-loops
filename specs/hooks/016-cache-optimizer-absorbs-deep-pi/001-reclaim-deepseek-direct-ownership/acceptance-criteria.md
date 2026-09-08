---
title: "Acceptance Criteria: 001-reclaim-deepseek-direct-ownership"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/001-reclaim-deepseek-direct-ownership"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All criteria met against observed evidence"
    next_safe_action: "None; phase closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-001-reclaim-deepseek-direct-ownership"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: 001-reclaim-deepseek-direct-ownership

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 001-reclaim-deepseek-direct-ownership
**Level:** 3
**Status:** Complete
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | The six hooks execute for both DeepSeek-direct ids | `isDeepPiOwned` has no definition, call site or export; extension suite 40/40 | Met | - |
| AC-002 | REQ-002 | Exactly one extension acts on those two models at every point | Predicate and enabled-package entry removed in one change; live Pi session shows the sibling no longer loads | Met | - |
| AC-003 | REQ-003 | Behavior for every other provider and model is unchanged | Suite passes with no edits to unrelated cases | Met | - |
| AC-004 | REQ-004 | Nothing remains whose only purpose is policing the split | Shared fixture, composition helper and both composition tests deleted; import grep clean beforehand | Met | - |

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
