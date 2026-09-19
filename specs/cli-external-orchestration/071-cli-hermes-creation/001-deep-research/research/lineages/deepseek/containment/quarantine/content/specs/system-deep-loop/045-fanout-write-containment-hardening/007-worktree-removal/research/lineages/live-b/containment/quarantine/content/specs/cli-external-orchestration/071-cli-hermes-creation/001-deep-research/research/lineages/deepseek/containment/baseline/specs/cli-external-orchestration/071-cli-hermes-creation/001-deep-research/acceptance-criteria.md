---
title: "Acceptance Criteria: Hermes runtime deep research"
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
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/001-deep-research"
    last_updated_at: "2026-09-14T18:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the acceptance criteria for this phase"
    next_safe_action: "Meet the open criteria once the fan-out completes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-001-deep-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Hermes runtime deep research

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/001-deep-research
**Level:** 3
**Status:** In Progress
**Date:** 2026-09-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the fan-out ran, When the lineage directories are listed, Then `deepseek` holds 10 iteration files and `swe2` holds 5, and each state log's terminal synthesis records `maxIterationsReached` | `find research/lineages/*/iterations -name 'iteration-*.md' \| wc -l` per lineage; `jq` over each `deep-research-state.jsonl` | Unmet | - |
| AC-002 | REQ-002 | Given `research/research.md` exists, When a sample of its citations is opened, Then each resolves to the cited file and line, command output, or dated URL | `sed -n` on cited lines; recorded in implementation-summary.md | Unmet | - |
| AC-003 | REQ-003 | Given the synthesis, When its comparison section is read, Then one row exists per capability and one column per runtime including Hermes | Section present in `research/research.md` | Unmet | - |
| AC-004 | REQ-004 | Given the synthesis, When its recommendation section is read, Then a phase plan for 002+ is ranked, each item marked required or optional with the failure it prevents | Section present in `research/research.md` | Unmet | - |
| AC-005 | REQ-005 | Given the run finished, When `git status --short` is run, Then only paths under this packet appear as changed by the run | `git status --short` output recorded | Unmet | - |
| AC-006 | REQ-006 | Given the ten angles, When the synthesis is read, Then each angle has a finding or an explicit UNKNOWN | Angle coverage table in `research/research.md` | Unmet | - |
| AC-007 | REQ-007 | Given two lineage syntheses, When they disagree, Then the disagreement is named with what would settle it | Cross-model section in `research/research.md` | Unmet | - |
| AC-008 | REQ-008 | Given the synthesis, When the operator reads the chat, Then the findings and recommended plan are in the message, and the confirmation is logged in `../goal.md` | Chat message; parent goal log row | Unmet | - |

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

Written when the fan-out completes and the findings have been presented.
<!-- /ANCHOR:closure -->
