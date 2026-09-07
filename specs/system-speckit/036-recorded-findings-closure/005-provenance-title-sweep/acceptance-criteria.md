---
title: "Acceptance Criteria: Phase 5: provenance-title-sweep"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "provenance sweep acceptance criteria"
  - "placeholder rule closure gate"
  - "fixture parity criterion"
  - "sweep ac traceability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/005-provenance-title-sweep"
    last_updated_at: "2026-09-07T15:05:46Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: provenance-title-sweep

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-recorded-findings-closure/005-provenance-title-sweep
**Level:** 2
**Status:** Draft
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 929 in-scope packets, When the sweep script runs, Then no in-scope title carries `[template:level` | `grep -rIl '\[template:level' specs` returns only paths under `sk-doc/052-routing-completeness`, `system-deep-loop/036-deep-loop-innovation` and `sk-design/` | Unmet | - |
| AC-002 | REQ-002 | Given `rules/check-placeholders.sh`, When it scans a document whose title carries `[template:level`, Then it reports a `fail` with the third class named | `bash .opencode/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh` run in isolation against a fixture still carrying the token | Unmet | - |
| AC-003 | REQ-003 | Given a packet whose title changed, When the sweep finishes, Then its `description.json` and `graph-metadata.json` reflect the new title | `node .../generate-description.js` and `.../backfill-graph-metadata.js` re-run per touched packet with a zero-diff second run | Unmet | - |
| AC-004 | REQ-004 | Given `002-valid-level1`, `003-valid-level2` and `004-valid-level3`, When `validate.sh --strict` runs against each, Then all three pass, and `072-scaffold-never-touched-violation` still fails with `SCAFFOLD_NEVER_TOUCHED` | `.opencode/skills/system-spec-kit/runtime/cli/tests/test-validation-extended.sh` | Unmet | - |
| AC-005 | REQ-005 | Given the runtime and CLI vitest projects, the goldens and the registry-coverage test, When they run after the rule change, Then none reports a new failure | `npm run check` and the full vitest run under `.opencode/skills/system-spec-kit/runtime/` | Unmet | - |

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

Planning only. No criterion is met yet. The sweep, the rule change and the fixture parity work have not started.
<!-- /ANCHOR:closure -->
