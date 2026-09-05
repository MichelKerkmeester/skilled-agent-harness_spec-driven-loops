---
title: "Acceptance Criteria: Give every chart form a hover and pointer state"
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
    packet_pointer: "sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states"
    last_updated_at: "2026-09-05T11:55:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the closure gate from the requirements"
    next_safe_action: "Fill the per-form contract from the research findings"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-research-20260905-131433-chart-hover"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Give every chart form a hover and pointer state

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 21 templates in `assets/templates/`, When the contract reference is read, Then every one of them appears with a named pointer contract, and a contract of `inert` carries the reason the static figure already suffices | Count the rows against `ls assets/templates/*.html`; a form present on disk and absent from the contract fails | Open | - |
| AC-002 | REQ-002 | Given any form whose contract promises a revealed value, When the figure is driven by keyboard alone, Then the same value is reachable without a pointer | Keyboard walk of one form per contract class, plus the accessible name exposed for the revealed value | Open | - |
| AC-003 | REQ-003 | Given any form, When it is opened with scripting unavailable, Then it renders the same readable static figure it renders today | Load each rendered example with scripting disabled and diff the visible figure against the current output | Open | - |
| AC-004 | REQ-003 | Given any form, When it first paints, Then the figure is readable before any pointer logic has run | First-paint check on the heaviest form; pointer logic must not gate the initial render | Open | - |
| AC-005 | REQ-004 | Given a new form added to the corpus, When it is built from the shared surface, Then it inherits its pointer contract without reimplementing the behaviour | Add a throwaway form, wire only its contract declaration, confirm the behaviour appears | Open | - |
| AC-006 | REQ-005 | Given a form whose rendered output contradicts its declared contract, When `check-corpus.cjs --render` runs, Then it fails and names the form | Mutate one form to break its contract and watch the checker fail, then restore. A checker that passes the mutation does not satisfy this row | Open | - |
| AC-007 | REQ-005 | Given the corpus in its final state, When `check-corpus.cjs --render` runs, Then it prints `RESULT: PASSED` | Run it from the final state and read the output, not the exit code | Open | - |
| AC-008 | REQ-006 | Given the seven partial forms, When the contract reference is read, Then each either gained the missing tooltip or records why a legend or dim is its correct terminal state | Row-by-row review of `parallel-axes`, `stacked-bars`, `stacked-area`, `grouped-bars`, `bar-line-composed`, `daily-line`, `waterfall` | Open | - |
| AC-009 | REQ-007 | Given a touch device, When a mark is tapped, Then the packet records the decided behaviour, even where the decision is that a single static file cannot normalise it | A stated decision in the contract reference. Silence does not satisfy this row, since silence is what the predecessor left | Open | - |
| AC-010 | REQ-008 | Given every changed file, When it is inspected, Then it references no external runtime, framework, CDN or build step | Grep the rendered corpus for external `src`, `href` and `import` targets; the count must stay at its current value | Open | - |
| AC-011 | NFR-P02 | Given the shared surface is in place, When per-file size is measured against the current corpus, Then the delta is reported as a number rather than asserted negligible | Byte-size table, before and after, per form | Open | - |

<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Not yet.

Every row is `Open`. The per-form rows, AC-001 and AC-008, cannot be filled until the research run in `research/` returns its per-form findings, and AC-006 is the row most likely to be quietly skipped, because it requires watching the checker fail on a deliberate mutation rather than merely watching it pass.

Two rows exist specifically to stop this packet repeating its predecessor's gaps: AC-009, because touch was left silent last time, and AC-005, because the behaviour was hand-applied per form last time and nothing stopped the next form shipping inert.
<!-- /ANCHOR:closure -->
