---
title: "Acceptance Criteria: Phase 2: translation-and-voice"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/002-translation-and-voice"
    last_updated_at: "2026-09-02T07:56:50Z"
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
# Acceptance Criteria: Phase 2: translation-and-voice

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/018-sk-design-parent-v2/001-sk-create-chart/002-translation-and-voice
**Level:** 3
**Status:** In Progress
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the seven authored source documents, When a Unicode scan for Han plus CJK punctuation runs over `scratch/translated/`, Then it reports zero characters | Perl scan over `U+4E00-9FFF`, `U+3400-4DBF`, `U+3000-303F`, `U+FF00-FFEF`, `U+FE30-FE4F` across all 7 files. Result: 0 in every file, total 0 | Met | - |
| AC-002 | REQ-002 | Given the translated set, When `hvr_scan.py` runs over all seven files, Then it exits 0 with no hard blocker | `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` over the 7 files. Exit 0, hard blockers 0 in each file | Met | - |
| AC-003 | REQ-003 | Given a place where a literal rendering and a natural one pulled apart, When the log is read, Then that place has a row naming the choice and the reason | `research/translation-log.md` section 4, 37 divergence rows across 5 sub-tables | Met | - |
| AC-004 | REQ-004 | Given `README.en.md`, When it is used only as a cross-check after the Chinese, Then every disagreement with the Chinese is recorded and the Chinese wins | `research/translation-log.md` section 6, 9 disagreement rows, each naming the resolution | Met | - |
| AC-005 | REQ-005 | Given user-visible strings inside the chart templates, When the phase closes, Then the decision is recorded once with its reason | `research/translation-log.md` section 8. Decision: they are authored text, phase 4 translates them, with the evidence that output-facing strings are already English | Met | - |
| AC-006 | SC-003 | Given each source document, When its translation is compared section for section, Then no section was dropped | Structural profile comparing heading level sequence, table rows, bullets, numbered items and code fences. Identical in all 7 files | Met | - |
| AC-007 | REQ-001 | Given the brief's file list was a subset, When the whole tree is swept, Then every remaining Chinese file is inventoried and assigned an owner | `research/translation-log.md` section 3, 45,778 Han across 60 files in 10 classes, plus the coverage reconciliation in 3.1 | Met | - |

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

AC-001 through AC-003 carried the packet: English with no Chinese residue, a clean voice
scan and a divergence log that makes every judgment call reviewable instead of invisible.
AC-006 is what separates a translation from a rewrite, and AC-007 exists because the
brief's file list turned out to be a subset of the Chinese in the tree.

Left out deliberately: the 17,463 Han characters of non-prose Chinese across 39 template,
script and JS files. Those are inventoried in the log rather than translated, because
editing them requires the render proof that is phase 4's handoff criterion. Also left
alone: the 12,538 Han in the `.zh.html` report templates and the Chinese worked example,
which are the Chinese half of a bilingual feature rather than untranslated text.

One item sits outside these criteria and does not block them. The source is PolyForm
Noncommercial 1.0.0 and this repository is MIT, which is escalated to the operator. All
output stayed inside this packet's `scratch/translated/` and nothing was copied into
`.opencode/skills/`.
<!-- /ANCHOR:closure -->
