---
title: "Acceptance Criteria: Phase 3: applicator-and-sentinels"
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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels"
    last_updated_at: "2026-09-10T22:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for phase 3"
    next_safe_action: "Meet, waive or supersede the open criteria once T001-T010 execute"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-003-applicator-and-sentinels"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: applicator-and-sentinels

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels
**Level:** 3
**Status:** Draft
**Date:** 2026-09-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four templates before this phase's implementation, When the sentinel contract from T004 is applied, Then each template's `:root` rule contains exactly one `DIAGRAM_PALETTE:BEGIN skin=<ground> … DIAGRAM_PALETTE:END` pair wrapping only its `--color-*` declarations | `grep -c "DIAGRAM_PALETTE:BEGIN" .opencode/skills/sk-design/sk-design-diagram/assets/templates/*.html` reports `1` for each of the four files | Unmet | - |
| AC-002 | REQ-002 | Given the token source (T002) and the ported gate module (T003) exist, When `apply-diagram-tokens.cjs --default --out <dir>` runs, Then it writes four themed copies to `<dir>` and touches nothing under `assets/templates/` | `git status` after the run shows no change under `assets/templates/`; the script's write path carries the same in-place refusal the chart applicator carries, adapted to the diagram's own template directory | Unmet | - |
| AC-003 | REQ-003 | Given `--default --out <dir>` has run, When its output is diffed against `assets/templates/`, Then the diff is empty | `diff -rq <dir> .opencode/skills/sk-design/sk-design-diagram/assets/templates` — exit 0, no output; this is the phase's own handoff gate to 004 | Unmet | - |
| AC-004 | REQ-004 | Given `color-gates.cjs` exists in the diagram skill's own `scripts/`, When its exports are inspected, Then they are exactly `channel`, `luminance`, `contrast`, `round2`, matching the chart module's function bodies unchanged | `node -e "console.log(Object.keys(require('./scripts/color-gates.cjs')))"` run from `.opencode/skills/sk-design/sk-design-diagram/` reports `[ 'channel', 'luminance', 'contrast', 'round2' ]` | Unmet | - |
| AC-005 | REQ-005 | Given the token source file, When its structure is read, Then it holds three grounds (light, dark, terminal) and marks `#ffffff` and `#3d4460` with roles distinct from a global chrome value | `.opencode/skills/sk-design/sk-design-diagram/assets/color/diagram-palette.json`, read directly against 002's signed derivation record shape | Unmet | - |
| AC-006 | REQ-006 | Given a run painting the accent at its signed 2.863:1, When the gate check runs, Then that row does not fail while every other sub-gate ratio still can | A `--default` run against a template using the accent completes with `RESULT: PASSED`; the applicator's source shows a `departs`-row exception distinct from the general refusal path (T006) | Unmet | - |
| AC-007 | REQ-007 | Given the four templates after T004, When grepped for the chart's paired dark marker, Then none carries it | `grep -c "DIAGRAM_PALETTE_DARK" .opencode/skills/sk-design/sk-design-diagram/assets/templates/*.html` reports `0` for each of the four files | Unmet | - |
| AC-008 | REQ-008 | Given the sentinel-annotated templates, When their font custom properties are read, Then they are byte-identical to their pre-phase values | T010's human review; `grep -c "font-family:" .opencode/skills/sk-design/sk-design-diagram/assets/templates/*.html` unchanged from the pre-phase baseline plan.md's Pre-Task Checklist records | Unmet | - |

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

This packet is authored, not executed: T001-T010 have not run, so every AC row above is
observationally `Unmet` by construction. It closes only after the operator ratifies plan.md's
three ADRs (T001), GLM builds the token source, the ported gate module, the sentinel blocks and
the applicator (T002-T006), and the byte-diff phase gate (T007) plus the grep and human-review
checks (T008-T010) all pass.
<!-- /ANCHOR:closure -->
