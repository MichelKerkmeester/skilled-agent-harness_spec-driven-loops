---
title: "Acceptance Criteria: CLI runtime utilization research"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "cli runtime utilization lane closure"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/002-cli-runtime-utilization"
    last_updated_at: "2026-09-06T16:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet the open criteria as the lane runs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: CLI runtime utilization research

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 002-cli-runtime-utilization
**Level:** 2
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the lane launched with stop policy max-iterations, When it exits, Then ten iteration files and ten state events exist | count of files under `research/lineages/glm-5-3-flash-cli-runtime/iterations` and of iteration events in the JSONL ledger | Met | - |
| AC-002 | REQ-002 | Given research.md, When a finding is read, Then it cites path:line on the claim side and the evidence side | reproduction notes in research/confirmed-findings.md | Met | - |
| AC-003 | REQ-003 | Given the iteration files, When their focus lines are listed, Then every charted angle appears at least once | focus lines in the iteration files | Met | - |
| AC-004 | REQ-004 | Given the confirmed table, When each row is opened, Then the cited lines show the finding | session log in implementation-summary.md | Met | - |

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

Ten iteration files, ten state events and a 54-finding synthesis exist under the lineage; every removal, merge and fix row was censused in the main checkout, with two dropped on evidence and three corrected, and the ledger was handed to `../007-cli-package-residue-removal`, which closed every row.
<!-- /ANCHOR:closure -->
