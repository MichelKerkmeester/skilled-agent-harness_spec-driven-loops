---
title: "Acceptance Criteria: Phase 2: deep-loop-executor-support"
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
    packet_pointer: "scaffold/003-deep-loop-executor-support"
    last_updated_at: "2026-09-14T17:24:46Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: deep-loop-executor-support

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/003-deep-loop-executor-support
**Level:** 3
**Status:** Complete
**Date:** 2026-09-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the seventh kind, When typecheck and the unit suites run, Then they pass | typecheck exit 0; 318 passed, 1 skipped, exit 0 (2026-09-14) | Met | - |
| AC-002 | REQ-002 | Given an off-roster model or a missing `hermes` binary, When the builder runs, Then it throws before any spawn | Hermes adapter tests: missing-binary, off-roster, `auto`, provider-prefixed all throw | Met | - |
| AC-003 | REQ-003 | Given a write lineage, When the builder runs, Then the argv matches the confirmed dispatch shape | Adapter test asserts the exact argv for both roster ids | Met | - |
| AC-004 | REQ-004 | Given a configured provider, When one `cli-hermes` research iteration runs on a scratch folder, Then its iteration file, delta and state record land | Live 2026-09-14: `fanout-run.cjs` lineage `hermes-proof` (`deepseek-v4.1-flash`, `--reasoning max`, 1 iteration) fulfilled, exit 0, 1042 s; `research.md` (91 lines, correct answer: eight ids, `stdin-redirect-required` exercised by construction), `deltas/iter-001.jsonl` (9 findings), `deep-research-state.jsonl` (`synthesis_complete`), `iterations/iteration-001.md`; containment clean; metadata refreshed by the runner | Met | - |

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

All four criteria are met; the live lineage confirmed the built argv end to end and surfaced the pace finding recorded in the goal log.
<!-- /ANCHOR:closure -->
