---
title: "Acceptance Criteria: Phase 10: post-fix-research"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "post fix research acceptance criteria"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/010-post-fix-research"
    last_updated_at: "2026-10-19T20:10:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked all four criteria Met with evidence"
    next_safe_action: "Operator decides which verified findings to fix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 10: post-fix-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/010-post-fix-research
**Level:** 2
**Status:** Complete
**Date:** 2026-10-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the cli-pi lineage, When the runner finishes, Then it is `fulfilled` with five iteration files and no gateway refusal | Evidence: `research/orchestration-summary.json` (succeeded 1, `projection_refusal` 0); `research/lineages/deepseek-pi/iterations/iteration-001.md` to `iteration-005.md`; no `gateway-refusals.jsonl` in the lineage | Met | - |
| AC-002 | REQ-002 | Given the lineage's twenty findings, When the report is read, Then each carries a verdict and a verified severity | Evidence: `research/research.md` section 1, three tables covering all twenty IDs; P1-1 re-read by the orchestrator at `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:361` and `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:493` | Met | - |
| AC-003 | REQ-003 | Given the parent, When its map, binding table and goal are read, Then each names this phase | Evidence: `../spec.md` phase map row 10 and handoff row; `../goal.md` binding row and criterion 1 at ten folders, `packet_budget=ok` | Met | - |
| AC-004 | REQ-001, REQ-003 | Given the final state, When recursive strict validation runs on the parent, Then it passes | Evidence: `implementation-summary.md` Verification table, eleven `RESULT: PASSED` | Met | - |

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

All four criteria are Met. The research ran clean through the gateway, and every finding has a verified verdict.
<!-- /ANCHOR:closure -->
