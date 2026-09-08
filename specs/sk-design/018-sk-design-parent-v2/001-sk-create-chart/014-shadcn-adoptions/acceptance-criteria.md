---
title: "Acceptance Criteria: shadcn adoptions"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/014-shadcn-adoptions"
    last_updated_at: "2026-09-07T21:48:13Z"
    last_updated_by: "verification-leaf"
    recent_action: "Corrected four stale evidence line cites and recorded the render gate as passed"
    next_safe_action: "Conductor review and commit the scoped packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-phase-014-shadcn-adoptions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: shadcn adoptions

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/014-shadcn-adoptions
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a multi-series template, When its series keys are declared beside the data, Then each key resolves to exactly one palette token and the checker fails a key without a token or a paint that uses another | `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1541` contains the missing-token error; the final command reports `series-mapping: 128 assertion(s), 0 failure(s)` and `scratch/mutations.md` records the mutation | Met | - |
| AC-002 | REQ-002 | Given a tooltip-bearing template, When it is read, Then a `READOUT` block beside `CHART_DATA` declares label formatter, value formatter and datum-field key, and the checker fails a tooltip form without it or when the key is decorative | `.opencode/skills/sk-design/sk-design-chart/assets/templates/box-plot.html:286` reads `READOUT.label(datum[READOUT.key])`; `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1300` rejects the object-key/readback idiom; the final grep reports 18 template and four delivery blocks and `scratch/mutations.md:49` records the exact mutation line | Met | - |
| AC-003 | REQ-003 | Given a time-path template, When it is read, Then `CURVE` is one of linear, step or monotone with a rationale line, and the checker fails `natural` | `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1715` contains the invalid-value error; the final grep reports three template and one delivery blocks and `curve-contract: 16 assertion(s), 0 failure(s)` | Met | - |
| AC-004 | REQ-004 | Given the final corpus, When the checker runs, Then it prints RESULT: PASSED with zero errors and each new assertion is proven by a failing mutation (assertions were authored first; the recorded negative controls were captured before the final gate, after the first consumer edits, as goal.md discloses) | `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:2289` invokes the curve contract; final command output ends `Summary: errors: 0` and `RESULT: PASSED`, with all three mutation lines in `scratch/mutations.md` | Met | - |
| AC-005 | REQ-005 | Given the three references, When they are read, Then the contracts and the kept decisions are stated with phase 13 cited | `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md:179`, `catalog.md:139`, and `color-system.md:44` contain the contracts, omissions and measurements with phase 13 `SOURCE` markers | Met | - |
| AC-006 | REQ-006 | Given the checker diff, When it is reviewed, Then no assertion or gate was loosened and no template gained an external reference | `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:1227` and `:1677` show additive contract paths; final `no-external: 210 assertion(s), 0 failure(s)` | Met | - |

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

All six criteria are met by the static checker, isolated negative controls, reference updates and
delivery updates. Radar, pie, area variants, natural interpolation, external resources and the
four policy-gated accessibility and metadata decisions remain consciously outside this packet.
<!-- /ANCHOR:closure -->
