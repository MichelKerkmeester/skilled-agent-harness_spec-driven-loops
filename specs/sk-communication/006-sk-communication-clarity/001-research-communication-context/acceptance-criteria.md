---
title: "Acceptance Criteria: Phase 1: research-communication-context"
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
    packet_pointer: "sk-communication/006-sk-communication-clarity/001-research-communication-context"
    last_updated_at: "2026-09-12T13:00:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Dispatch the research lineages, then meet the open criteria"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: research-communication-context

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/006-sk-communication-clarity/001-research-communication-context
**Level:** 2
**Status:** Draft
**Date:** 2026-09-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a dispatched lineage, When the run settles, Then its state log records the full requested iteration count with no convergence stop | Read `research/**/deep-research-state.jsonl` and count iteration events | Unmet | - |
| AC-002 | REQ-002 | Given a finding in any lineage's research.md, When a citation is opened, Then it resolves to the line or URL it names | Open one sampled citation per lineage and read the target | Unmet | - |
| AC-003 | REQ-003 | Given a source's recommendation, When it is recorded, Then it carries one of already-covered, new, or contradicting | Every recommendation row in `research/research.md` has a classification cell | Unmet | - |
| AC-004 | REQ-004 | Given two executor families, When both runs settle, Then both wrote findings and their disagreements are listed rather than tallied | Both lineage directories hold a non-empty research.md, and a disagreement section exists | Unmet | - |
| AC-005 | REQ-005 | Given an adopted-candidate recommendation, When it is recorded, Then it names a candidate owning surface | Every recommendation row has an owning-surface cell | Unmet | - |
| AC-006 | REQ-006 | Given the ADHD source, When its lineage settles, Then its mechanism half is covered: session hook, runtime mirrors, eval harness and release gate | `research/research.md` cites each of the four mechanism artifacts by path | Unmet | - |
| AC-007 | - | Given the run has settled, When the scoped diff is inspected, Then no file outside this phase folder changed | `git status --porcelain` scoped to the repository root | Unmet | - |

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

This phase has not run. The statement is written when the phase closes, naming which criteria
carried it and what was consciously left out.
<!-- /ANCHOR:closure -->
