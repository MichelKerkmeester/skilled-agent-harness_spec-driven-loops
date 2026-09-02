---
title: "Acceptance Criteria: Fidelity and library research for sk-create-chart"
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
    packet_pointer: "sk-doc/051-sk-create-chart/007-fidelity-and-library-research"
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "phase-7-fidelity"
    recent_action: "Closed the criteria against observed evidence"
    next_safe_action: "Decide the five contract-level recommendations recorded in ADR-004"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-7-fidelity-and-library-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Five contract-level recommendations await an operator decision"
    answered_questions:
      - "Three template-level changes were applied and gated"
      - "No library was adopted, and the reason is recorded"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Fidelity and library research for sk-create-chart

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/051-sk-create-chart/007-fidelity-and-library-research
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three reference overviews started at section zero, When the numbering is shifted, Then no overview in the mode starts at zero | `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:21` now reads `## 1. OVERVIEW`, and `grep -rn '## 0\. OVERVIEW' .opencode/skills/sk-doc/sk-create-chart/` exits 1 with no output | Met | - |
| AC-002 | REQ-001 | Given citations named a section number the shift moved, When the shift is applied, Then each citation names the section it meant | `.opencode/skills/sk-doc/sk-create-chart/manual-testing-playbook/delivery-and-routing/opens-with-no-build-step.md:100` now cites section 5, and the full list is at `implementation-summary.md:76` | Met | - |
| AC-003 | REQ-002 | Given convergence is disabled, When the research loop runs, Then ten iteration records and one synthesis exist | `research/lineages/deepseek-flash-max/research.md:111` carries the ranked recommendations, and `iterations/` and `deltas/` each hold ten files | Met | - |
| AC-004 | REQ-002 | Given a finding is acted on, When it is applied, Then its corpus citation resolves to the line it names | `candlestick.html:137`, `stacked-bars.html:159`, `daily-line.html:136` and `bar-rows.html:31` opened and confirmed | Met | - |
| AC-005 | REQ-003 | Given templates were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | `node scripts/check-corpus.cjs --render` printed the marker written at `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs:664`, fifteen checks, zero failures | Met | - |
| AC-006 | REQ-004 | Given the research recommends something that would change the template contract, When the phase closes, Then that recommendation is a decision rather than an applied edit | `decision-record.md:182` opens ADR-004, which records five contract-level recommendations, none applied | Met | ADR-004 |
| AC-007 | REQ-005 | Given this phase authored prose, When it is scanned, Then it reports zero hard blockers | `implementation-summary.md:161` records the run of `hvr_scan.py` over every document in this folder, zero hard blockers on each | Met | - |
| AC-008 | REQ-003 | Given seven of the ten template-level recommendations were not applied, When the phase closes, Then each is recorded with its evidence | `implementation-summary.md:97` opens the table carrying the seven with their finding references | Met | ADR-002 |

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

The renumbering and the ten-iteration research loop carried this packet, and three of the ten
template-level recommendations were applied and gated. Seven template-level recommendations and
five contract-level ones were consciously left out and recorded with their evidence, because the
corpus check proves a template still works and cannot prove a picture improved.
<!-- /ANCHOR:closure -->
