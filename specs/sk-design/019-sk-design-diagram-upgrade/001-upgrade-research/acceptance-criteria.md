---
title: "Acceptance Criteria: Phase 1: upgrade-research"
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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/001-upgrade-research"
    last_updated_at: "2026-09-10T17:17:41Z"
    last_updated_by: "claude-conductor"
    recent_action: "Recorded three criteria against the run"
    next_safe_action: "None; phase 2 starts from the synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-001-upgrade-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: upgrade-research

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 001-upgrade-research
**Level:** 3
**Status:** Complete
**Date:** 2026-09-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the brief, When the lineage runs, Then five iteration files exist each citing file:line and no convergence stop fires before the cap | `research/lineages/glm/iterations/iteration-001..005.md`; state records for 1–4 at newInfoRatio 1.0/0.8/0.8/0.9; stop policy max-iterations | Met | - |
| AC-002 | REQ-002 | Given the five iterations, When the conductor synthesizes, Then every finding is sorted and six phases are named with a gate each | `research/research.md`: 21 enforceable, 6 judged, 2 governance; the phase table; the parent's map matches | Met | - |
| AC-004 | REQ-001 | Given the first lineage's findings, When a second model verifies each against the disk, Then every finding carries a CONFIRMED / CORRECTED / UNVERIFIABLE verdict with evidence | `lineages/sonnet/research.md`: 15/15/1 + one fabrication; corrections folded into `research/research.md` | Met | - |
| AC-003 | REQ-003 | Given the runner's verdict, When the phase closes, Then the missing iteration-5 state record and synthesis event are recorded, not hidden | `research/orchestration-summary.json` failed=1; the run notes in `research/research.md` | Met | - |

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

The research is complete on content and short on protocol, and both are written down. The brief carried one wrong fact, which the reader corrected; that is recorded too.
<!-- /ANCHOR:closure -->
