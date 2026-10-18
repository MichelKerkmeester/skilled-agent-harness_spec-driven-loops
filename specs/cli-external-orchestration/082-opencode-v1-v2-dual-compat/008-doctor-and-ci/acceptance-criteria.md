---
title: "Acceptance Criteria: Phase 8: doctor-and-ci"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor and ci acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/008-doctor-and-ci"
    last_updated_at: "2026-10-18T12:45:08Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-doctor-and-ci"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: doctor-and-ci

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 082-opencode-v1-v2-dual-compat/008-doctor-and-ci
**Level:** 2
**Status:** Draft
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002, REQ-003, REQ-004, REQ-005 | Given OpenCode 1.19.3 installed and the 2.0.32 service running, When the battery runs with family v1 and then with family v2, Then each run exits 0, and its JSON summary has no FAIL, DEGRADED or SKIP leg. | `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v1 --json` and `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v2 --json`, each with exit 0. The outputs and exit statuses from T015 and T016 are recorded in the log. | Unmet | - |
| AC-002 | REQ-006 | Given one repo plugin broken on purpose in a throwaway copy, When the battery runs against that copy, Then it exits 1 and names the broken plugin. | `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v1 --root scratch/broken-root --json`, with exit 1 and the plugin named in the output. The T017 record is saved in the log. | Unmet | - |
| AC-003 | REQ-007 | Given the CI workflow, When actionlint runs on it, Then the run exits 0 with no output. | `/opt/homebrew/bin/actionlint .github/workflows/opencode-dual-version.yml`, exit 0 with no output. The T018 record is saved in the log. | Unmet | - |

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

Not closeable yet. No criterion has run, and the phase has not started. Write this
paragraph when the packet is closed, not before.
<!-- /ANCHOR:closure -->
