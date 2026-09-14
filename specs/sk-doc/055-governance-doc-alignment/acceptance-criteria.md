---
title: "Acceptance Criteria: Governance documentation alignment: 006-resume queue plus router and root-doc research"
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
    packet_pointer: "sk-doc/055-governance-doc-alignment"
    last_updated_at: "2026-09-13T13:14:56Z"
    last_updated_by: "pi-055-authoring-session"
    recent_action: "Mapped the six requirements to acceptance criteria, all six Unmet at Draft"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pi-055-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Governance documentation alignment: 006-resume queue plus router and root-doc research

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/055-governance-doc-alignment
**Level:** 2
**Status:** Draft
**Date:** 2026-09-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given 006's stale parent metadata, when the repair loop and the recursive strict validation run, then ten RESULT: PASSED lines appear with Errors: 0 | `validate.sh` on 006, `--recursive --strict`, the ten PASSED lines, Errors: 0, exit 0, output read | Met | - |
| AC-002 | REQ-002 | Given the pre-swarm commit, when the read-only review dispatch returns and the reconciliation lands, then all twelve rewritten files carry verdicts and every report claim is confirmed or refuted | the dispatch receipt in the dispatch log, the twelve-row reconciliation in `implementation-summary.md` | Superseded | ADR-001 in decision-record.md, execution evidence replaced the prose review |
| AC-003 | REQ-003 | Given the router brief, when the lineage completes, then exactly 3 iterations cover both-direction reachability, index accuracy, action-phrased triggers, dead or overlapping rows and scope-statement drift, each finding citing its read-at commit | `research/router-alignment/`: 3 iteration files, 3 deltas, the synthesis, the reducer's count of 3 | Met | - |
| AC-004 | REQ-004 | Given the root-doc brief, when the lineage completes, then exactly 5 iterations keep the not-reality and redundant-detail classes apart, every finding naming its discrimination case | `research/root-doc-staleness/`: 5 iteration files, 5 deltas, the synthesis, the case citations, case-one findings quoting the delegate's line | Met | - |
| AC-005 | REQ-005 | Given the decision record's ratification state, when the corrections land, then the 006 phase-map row and both 007 ratification references match the record | the diffs at the three named spots, the consulted ADR or the appended ratification | Met | - |
| AC-006 | REQ-006 | Given both syntheses, when the sequencing answer is recorded and the acted findings land, then each action cites its finding and each redundancy action cites its case | the acted diffs, the recorded answer in this packet's continuity, the per-action citations | Met | - |
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

**Closeable:** No. Six criteria open at Draft: this statement is written when the packet closes, not before.
<!-- /ANCHOR:closure -->
