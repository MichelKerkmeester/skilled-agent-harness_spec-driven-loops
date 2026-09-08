---
title: "Acceptance Criteria: Trigger phrase quality enforcement"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "phrase quality criteria"
  - "regeneration identical criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/013-trigger-phrase-quality-enforcement"
    last_updated_at: "2026-09-07T06:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Trigger phrase quality enforcement

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 030-spec-kit-simplification-research/013-trigger-phrase-quality-enforcement
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
| AC-001 | REQ-001 | Given the judge, When `retrieval`, `2026-05-14`, `session`, `memory`, `the` and `spec folder question` are judged, Then the classes are single-token, numeric-only, editor-fallback, generic-workflow-word, stop-word-only and admitted | `implementation-summary.md:74` records the check: the phrase-judge cases in `grep-convention.vitest.ts` passed | Met | - |
| AC-002 | REQ-002 | Given the corpus, When the generator runs twice, Then the diagnostics carry `phraseQuality` with phrase and document counts per class and the index hash is identical | `implementation-summary.md:61` records the check: printed bucket: single-token 314 phrases / 825 documents, numeric-only 42 / 121, generic 4 / 171, editor-fallback 2 / 4, stop-word-only 3 / 12, prose-sentence 27 / 18, ok 35,087; two runs, one hash | Met | - |
| AC-003 | REQ-003 | Given the doctor asset, When its pollution and pair activities are read, Then they name the committed diagnostics bucket and all four artifacts | `implementation-summary.md:65` records the check: the asset parses and the three edited lines carry the names | Met | - |
| AC-004 | REQ-004 | Given the presentation asset, README and conventions, When they are searched for the retired labels, field names, script count, recipe count and missing rows, Then nothing contradicts the code | `implementation-summary.md:113` records the check: the search returned only the rewritten lines; sk-doc validator exit 0 on both documents; the parity suite passed | Met | - |

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

Every criterion is met by observed output. Consciously left out: the corpus cleanup of 826 documents, the repo-rules index question and the variants sidecar, each with a recorded decision in the lane's confirmed-findings document.
<!-- /ANCHOR:closure -->
