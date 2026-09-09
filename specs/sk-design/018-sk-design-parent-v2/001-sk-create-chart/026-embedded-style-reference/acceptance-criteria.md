---
title: "Acceptance Criteria: embed the stock Style Reference in the chart skill and keep the generator override"
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
    packet_pointer: "scaffold/026-embedded-style-reference"
    last_updated_at: "2026-09-09T15:42:19Z"
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
# Acceptance Criteria: embed the stock Style Reference in the chart skill and keep the generator override

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** [PACKET-ID]
**Level:** [2/3/3+]
**Status:** [Draft/In Progress/Complete]
**Date:** 2026-09-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the embedded capture, When `--default --all` runs, Then the 25 themed forms are byte-identical to the pre-move run apart from the provenance line | Baseline captured before the move, diff after it reported identical apart from the recorded path; provenance sha256 `c94a9bf3f244…` matches the pin in `origin.md` | Met | - |
| AC-002 | REQ-002 | Given a reference the packet does not own, When its path is passed, Then the script themes from it and stamps that path | `apply-design-md.cjs ../sk-design-md-generator/references/examples/stripe/DESIGN.md --all` wrote 25 forms, `RESULT: PASSED`, provenance naming the stripe path | Met | - |
| AC-003 | REQ-002 | Given the new directory under `assets/`, When the corpus check, the gallery builder and the renderer run, Then none of them sees it | All three filter to `.html` (`check-corpus.cjs` `htmlFilesUnder`); corpus `RESULT: PASSED`, identity 78 unchanged | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
