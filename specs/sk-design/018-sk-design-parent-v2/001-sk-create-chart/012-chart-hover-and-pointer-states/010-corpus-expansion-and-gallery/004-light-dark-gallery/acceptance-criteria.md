---
title: "Acceptance Criteria: Generate one gallery page rendering every form in both colour schemes"
description: "Six criteria: generated not authored, both schemes per form, the rule watched failing in both directions, nothing external, and the page held to its own obligation rather than the chart rules."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/010-corpus-expansion-and-gallery/004-light-dark-gallery"
    last_updated_at: "2026-09-06T06:26:46Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Generate one gallery page rendering every form in both colour schemes

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 010-corpus-expansion-and-gallery/004-light-dark-gallery
**Level:** 2
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the templates directory, When the gallery is built, Then its contents come from that directory rather than a hand-written list | Observed: `build-gallery.cjs` reads `assets/templates/` and reports "26 forms, 52 frames"; `--check` compares the written page byte for byte against a fresh build | Met | - |
| AC-002 | REQ-002 | Given each form, When the gallery is opened, Then it appears twice with each frame pinned to a scheme | Observed: 52 frames, two per form, each carrying `data-scheme` and writing that scheme into the framed document on load | Met | - |
| AC-003 | REQ-003 | Given a form dropped from the page, When the corpus runs, Then it fails naming that form | Observed: removing `funnel` gave `FAIL [gallery] ... funnel appears in 0 gallery frame(s) and needs two`, then `RESULT: FAILED`. Restored, sha256 `852ff466ce16eb10` | Met | - |
| AC-004 | REQ-003 | Given a form added without rebuilding, When the corpus runs, Then it fails naming the count and the form | Observed: a 27th template gave both `the gallery says it carries 26 forms and the corpus has 27` and the missing-form line, then `RESULT: FAILED`. Probe removed, gate back to `RESULT: PASSED` | Met | - |
| AC-005 | REQ-004 | Given the page, When inspected, Then it carries no framework, CDN reference or build step for the charts | Observed: one inline stylesheet and one inline script, no external reference of any kind | Met | - |
| AC-006 | REQ-005 | Given the gallery, When the corpus runs, Then it is not judged by the chart rules | Observed: before the exemption the page produced 24 failures demanding a data block and colour system. It is now excluded by path and held to the `gallery` rule instead, 27 assertions, 0 failures | Met | - |

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

**Closeable:** Yes. Six of six `Met`.

The rule matters more than the page. A gallery is easy to write and easy to let rot, and a rotten
one is worse than none because it still looks authoritative. Generating it from the directory and
failing the corpus when the two disagree is what makes the page trustworthy a year from now.

Building it surfaced a category error worth recording: the page lives under `assets/`, so the
corpus checker initially ran the chart rules over it and produced twenty-four failures demanding a
data block, a colour system and a palette block from a contact sheet. The fix was not to give the
gallery those things but to say plainly that it is not a chart, and to hold it to the one obligation
it does have.
<!-- /ANCHOR:closure -->
