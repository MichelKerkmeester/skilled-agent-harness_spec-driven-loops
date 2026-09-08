---
title: "Acceptance Criteria: theme charts from a DESIGN.md style reference"
description: "Acceptance criteria for theming the chart corpus from a DESIGN.md Style Reference."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/016-design-md-theming"
    last_updated_at: "2026-09-08T07:11:51Z"
    last_updated_by: "codex-leaf"
    recent_action: "Recorded eight met criteria and the sandbox-blocked render criterion"
    next_safe_action: "Rerun the render gate outside the Chrome sandbox and update AC-006"
    blockers:
      - "Headless Chrome returned no document for render, card-readout and pointer-reach"
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-016-design-md-theming"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: theme charts from a DESIGN.md style reference

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/016-design-md-theming
**Level:** 2
**Status:** Complete
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a v3 DESIGN.md, When the script runs, Then the colour table, typeface block and radius table are parsed, and a missing section is named | `scripts/apply-design-md.cjs:75`, `:97` and `:116` implement the three heading parsers; `scripts/tests/apply-design-md.test.cjs:49` passed the missing-section assertion, and the exact Stripe apply run ended `RESULT: PASSED` | Met | - |
| AC-002 | REQ-002 | Given the parsed tables, When the palette is derived, Then every chrome role, four series and emphasis exist for both grounds and each mapping line names the token and ratio | `scripts/apply-design-md.cjs:494` prints one MAPPING line per role; `--default --all` printed both grounds and `scratch/captures/grouped-bars-light.png`, regenerated from the committed script, shows Ember, Verdant, Crimson and Ash | Met | - |
| AC-003 | REQ-003 | Given a fixture whose accent fails the mark gate, When the script runs, Then nothing is written and the output names role, ratio, gate and the nearest clearing colour | `scripts/apply-design-md.cjs:390` raises the capacity refusal; the fixture run exited 1 with `FAILURE light series capacity ratio=2.16:1 gate=3: nearest table colour that clears: none` and created no output directory | Met | - |
| AC-004 | REQ-004 | Given a themed copy, When diffed against its source, Then only the palette blocks, provenance comment, font stacks and corner ladder differ | `scripts/tests/apply-design-md.test.cjs:70` strips the two palette regions, the font stacks and the `chart-color-system` meta and asserts equality, then a second run must match byte for byte; three separate processes produced identical files | Met | - |
| AC-005 | REQ-005 | Given a design-md block, When the checker runs, Then provenance and inline gates are checked in both themes, every other family runs, and `--extra` scans an outside directory | `scripts/check-corpus.cjs:480` checks provenance, six-digit roles, text and mark gates, series distinguishability and emphasis in both themes; `:2488` parses `--extra`; the corpus run reports `design-md: 70 assertion(s), 0 failure(s)` | Met | - |
| AC-006 | REQ-006 | Given the stripe proof delivery, When the corpus is checked, Then static and render runs print RESULT: PASSED | `assets/examples/grouped-bars-stripe-style.html:13` carries the design-md block of measured stripe values plus the stock dark chrome; conductor runs of `check-corpus.cjs` and `check-corpus.cjs --render` printed RESULT: PASSED | Met | - |
| AC-007 | REQ-007 | Given a request naming a DESIGN.md, When SKILL.md is read, Then it routes to the script and the boundary keeps application here | `SKILL.md:128` contains the DESIGN.md routing branch and extraction/application boundary; `node --check` and static corpus checks passed | Met | - |
| AC-008 | REQ-008 | Given the references and changelog, When read, Then the fourth system, its gates, refusal and provenance are stated and the version is bumped | `references/design-md-theming.md:89` states the gates and refusal; the companion references and `changelog/v1.4.0.0.md` record the adapter, while `SKILL.md` and `README.md` carry version 1.4.0.0 | Met | - |
| AC-009 | REQ-009 | Given the test file, When node --test runs, Then the four examples, the refusal and the byte-identity case pass | `scripts/tests/apply-design-md.test.cjs:38` defines the fixture coverage; `node --test scripts/tests/` passed 6 tests, 0 failures, covering all four examples, refusal, missing-section reporting and byte identity | Met | - |

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

All nine criteria are met: the script derives measured, gated palettes from every bundled Style Reference and from the cursor default, refuses failing palettes and ordered forms, writes byte-identical copies outside the themed regions, and the checker holds the design-md system by provenance plus the category gates. The conductor ran the render gate on the corpus with the renamed stripe delivery and on the whole default-themed set, both RESULT: PASSED, and the independent review's findings were refuted or fixed.
<!-- /ANCHOR:closure -->
