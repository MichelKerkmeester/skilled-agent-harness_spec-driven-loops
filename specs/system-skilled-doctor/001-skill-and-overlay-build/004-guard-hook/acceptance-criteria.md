---
title: "Acceptance Criteria: Phase 4: guard-hook"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "guard hook acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-guard-hook"
    last_updated_at: "2026-11-06T07:23:12Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-guard-hook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: guard-hook

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-doctor/001-skill-and-overlay-build/004-guard-hook
**Level:** 3
**Status:** Complete
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-015 | Given a tree with no overlay manifest, When a write is pending, Then the hook allows it without starting a process | `no manifest allows at once and starts no process` failed before the core existed and passes | Met | - |
| AC-002 | REQ-013 | Given an owned path, When a write is pending, Then the hook refuses it, names the overlay file and leaves the tree byte-identical | `an owned path is refused with the overlay file to edit` and `a refused write to an owned path leaves the tree byte-identical` pass, and the second fails against a core that applies | Met | - |
| AC-003 | REQ-013 | Given the hook folder, When it is searched for an apply, Then nothing is found | `rg -n "post-edit\|--apply\|apply --capture" .skilled/hooks/overlay-guard` printed nothing | Met | - |
| AC-004 | REQ-013 | Given the five runtimes, When their registrations are generated, Then each registers the hook and the checks pass | `sync-hook-registrations.cjs --check` printed `PASS: 4 registration files match the 33-hook registry; 20 Pi extensions resolve` | Met | - |
| AC-005 | REQ-013 | Given Cursor's registered command, When the path is owned, Then the refusal reaches Cursor | `cursor: the registered command delivers the deny intact` failed with `0 !== 2` before ADR-001 and passes | Met | - |

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

Every criterion is `Met` with the test or command output named in its row. The red runs are in the session's red-then-green log.
<!-- /ANCHOR:closure -->
