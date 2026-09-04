---
title: "Acceptance Criteria: Phase 1: baseline-and-instrumentation"
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
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/001-baseline-and-instrumentation"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the acceptance criteria for this phase"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-001-baseline-and-instrumentation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: baseline-and-instrumentation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skill-advisor/023-semantic-lane-enablement/001-baseline-and-instrumentation
**Level:** 2
**Status:** Draft
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the active vector table, When coverage is counted, Then every node without a row is named | `sqlite3 "file:.../skill-graph.sqlite?mode=ro" "select id from skill_nodes where id not in (select skill_id from vec_768);"` prints the same names `research/baseline.md` lists | Unmet | - |
| AC-002 | REQ-002 | Given the capture script, When it is run at this phase's commit, Then all six baseline metrics are recorded with their fixture hashes | `node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` prints JSON whose metrics match the table in `research/baseline.md` | Unmet | - |
| AC-003 | REQ-003 | Given the three corpora, When each is hashed, Then the digest is recorded beside its row count | `shasum -a 256` on each corpus file matches the digest written in `research/baseline.md` | Unmet | - |
| AC-004 | REQ-004 | Given a running daemon, When `advisor_status` is called, Then it reports lane liveness, resolved weight, vector count and any `disabledReason` | The reported vector count equals `select count(*) from vec_768;` at the same moment | Unmet | - |
| AC-005 | REQ-005 | Given twenty corpus prompts, When each is measured, Then latency per call is recorded with its exit status read from a file rather than a pipe | `research/baseline.md` carries twenty timed rows and no row is missing an exit status | Unmet | - |
| AC-006 | REQ-006 | Given the accuracy gate, When its capture regime is read, Then the document states whether any run scores real embeddings | `research/baseline.md` names the run, or records that none exists and says what phase 004 must therefore do instead | Unmet | - |
| AC-007 | REQ-004 | Given the instrumentation, When a recommendation is compared across the change, Then the response is identical apart from the status fields | Two responses to one corpus prompt, captured before and after, differ in no scoring field | Unmet | - |

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

Nothing has run yet. This phase closes when the seven rows above carry evidence that was
observed rather than expected, and the packet's later phases inherit those numbers as their
starting point.
<!-- /ANCHOR:closure -->
