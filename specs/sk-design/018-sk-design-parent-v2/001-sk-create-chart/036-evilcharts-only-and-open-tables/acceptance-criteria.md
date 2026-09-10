---
title: "Acceptance Criteria: one style reference, no examples, open tables, a gallery that sizes its frames"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/036-evilcharts-only-and-open-tables"
    last_updated_at: "2026-09-10T07:41:56Z"
    last_updated_by: "claude-conductor"
    recent_action: "Recorded six criteria against the final state"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-036-evilcharts-only-and-open-tables"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: one style reference, no examples, open tables, a gallery that sizes its frames

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 036-evilcharts-only-and-open-tables
**Level:** 2
**Status:** Complete
**Date:** 2026-09-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the packet on disk, When `assets/style-reference/` is listed, Then it holds evilcharts alone and `--default` reads it | `ls assets/style-reference` → `evilcharts`; `apply-design-md.cjs` DEFAULT_DESIGN_PATH; the `--default` run reproduces the stock radius ladder value for value | Met | - |
| AC-002 | REQ-002 | Given the checker and tests, When they run, Then nothing reads `assets/examples/` and the design-md family still fires on a malformed provenance line | `grep examples/` over scripts and references is empty; suite case "design-md refuses a themed delivery whose provenance is malformed" builds its fixture with the applicator and passes | Met | - |
| AC-003 | REQ-003 | Given any template, When its disclosure lacks `open`, Then the corpus check fails it | 29 of 29 templates carry `open`; suite case "table-disclosure refuses a table that starts folded" | Met | - |
| AC-004 | REQ-004 | Given the gallery rendered at 1280px, When the first tiles are read, Then each frame shows its whole form including the open table | Headless render of `assets/gallery.html` read by eye: bar-columns and bar-line-composed whole in both schemes, tables visible, no clipping | Met | - |
| AC-005 | REQ-004 | Given a template that stops posting its height or posts it once, When the corpus check runs, Then `frame-height` fails it; and a gallery with no listener fails `gallery` | Suite cases "never posts its height" and "posts its height only once"; gallery assertion added in `checkGallery` | Met | - |
| AC-006 | REQ-001 | Given the six rewritten documents, When a model that did not write them reads them against the disk, Then it reports no stale cursor or examples claim presented as current | GLM-5.3-Flash (cli-pi, llmgateway, read-only tools) reviewed the two rewritten passages against `palettes.json`: one MEDIUM finding, confirmed, fixed in `color-system.md`; the four other files' edits were single-sentence deletions verified by grep | Met | - |

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

The round carried on AC-001 and AC-004: the docs now say what the applicator already did, and the
gallery shows whole forms. Left out on purpose: the gallery's dead `contentDocument` pin, and the
changelog history that names the old reference and the deliveries as they were.
<!-- /ANCHOR:closure -->
