---
title: "Acceptance Criteria: Phase 1: dispatch-preflight-parity-research"
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
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/011-dispatch-preflight-parity-research"
    last_updated_at: "2026-09-15T15:46:31Z"
    last_updated_by: "scaffold"
    recent_action: "Every criterion met with its evidence recorded"
    next_safe_action: "None; the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-011-dispatch-preflight-parity-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: dispatch-preflight-parity-research

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/011-dispatch-preflight-parity-research
**Level:** 2
**Status:** Complete
**Date:** 2026-09-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the dispatch preflight surface, When ten iterations run with no early convergence, Then each closes its chartered angle | Ten iteration files, 94KB total, one per chartered angle; stop policy was max-iterations so convergence before the cap was telemetry only | Met | - |
| AC-002 | REQ-002 | Given the iterations, When synthesised, Then research.md carries every deliverable the charter names | research.md, 276 lines: severity table for all 23 rules, defect table, Cursor and OpenCode parity table, ranked recommendations, four-phase decomposition | Met | - |
| AC-003 | REQ-003 | Given a recommendation, When recorded, Then it cites the file and line it rests on | Every ranked row carries a file:line citation; inferred claims are marked inline and collected in a closing table of six items | Met | - |
| AC-004 | REQ-004 | Given the findings, When acted on, Then the implementation phases close them | Phases 013 to 016 implemented the ranked list; the two severity-5 findings this lane surfaced, the inert codex shape and the missing Hermes plugin opt-in, were both verified independently before being fixed | Met | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
