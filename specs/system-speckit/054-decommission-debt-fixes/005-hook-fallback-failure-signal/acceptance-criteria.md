---
title: "Acceptance Criteria: Phase 5: hook-fallback-failure-signal"
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
    packet_pointer: "system-speckit/054-decommission-debt-fixes/005-hook-fallback-failure-signal"
    last_updated_at: "2026-09-05T06:13:07Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-005-hook-fallback-failure-signal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: hook-fallback-failure-signal

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-decommission-debt-fixes/005-hook-fallback-failure-signal
**Level:** 2
**Status:** Planned
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a synthetic adapter failure on Codex or Devin, When the fallback fires, Then the JSON payload carries a machine-detectable drift field and stderr carries a structured line, and the host still receives a well-formed successful response | Synthetic-failure run output, both channels inspected | Unmet | - |
| AC-002 | REQ-002 | Given a synthetic `session-cleanup.sh` failure on Codex, When the Stop hook runs, Then the diagnostic fallback fires and the Stop hook itself still reports success | Synthetic-failure run output | Unmet | - |
| AC-003 | REQ-003 | Given the drift marker from AC-001, When the doctor route runs, Then its output reports the degraded adapter | Doctor route output after a synthetic failure | Unmet | - |
| AC-004 | REQ-004 | Given the Copilot wrapper decision, When it is implemented, Then either real compiled adapters exist and are wired in, or the wrappers and registration are fully removed with no dangling reference | `rg -n "copilot" .github/hooks .opencode/commands/doctor` post-implementation | Unmet | - |
| AC-005 | REQ-005 | Given every currently-registered hook path across the covered runtimes, When the parity test runs, Then it fails on a deliberately broken path and passes on the current state | Test run output, both branches | Unmet | - |

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

**Closeable:** No

All five criteria are Unmet; the drift marker, cleanup fix, Copilot decision, and parity test have not been implemented yet.
<!-- /ANCHOR:closure -->
