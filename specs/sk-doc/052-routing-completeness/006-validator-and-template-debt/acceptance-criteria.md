---
title: "Acceptance Criteria: Phase 6: validator-and-template-debt"
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
    packet_pointer: "sk-doc/052-routing-completeness/006-validator-and-template-debt"
    last_updated_at: "2026-09-02T18:47:58Z"
    last_updated_by: "claude-code"
    recent_action: "Re-ran the criteria verifications and recorded each result"
    next_safe_action: "None; the criteria are settled"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-006-validator-and-template-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: validator-and-template-debt

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/052-routing-completeness/006-validator-and-template-debt
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given a scanner fixture whose bytes are pinned by tests, When the document validator runs, Then it is exempt | Re-run 2026-09-02: `validate_document.py:1` exits 0 on `voice-clean.md:1` and `voice-dirty.md:1`, each reporting `Fixture tree: holds the shapes it exercises`. The exemption landed in `d229b0a24d` | Met | |
| AC-002 | REQ-002 | Given a template whose payload is a fenced block, When it is scanned, Then a seeded blocker is caught | Re-run 2026-09-02 on a probe template: `hvr_scan.py:1` reports `template payload detected`, then 1 hard blocker and exit 1 with the character seeded inside the fence, and 0 blockers with exit 0 once it is removed | Met | |
| AC-003 | REQ-003 | Given forty-eight planning documents carrying superseded boilerplate, When the phase closes, Then none carries it | `grep -rl 'it owns the Setup, Implementation, and Verification' specs/` returns nothing beyond this file. Re-run 2026-09-02: one match, `acceptance-criteria.md:1`, which is this criterion quoting the sentence it retired. The real count was fifty-six documents, not forty-eight, and all were rewritten in `d229b0a24d` | Met | |

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

All three criteria were re-verified from the current tree: the fixture exemption holds, a
blocker seeded inside a template fence is caught, and the retired sentence survives in one
place only, this criterion. What was consciously left out is the backlog those measurements
exposed. Forty-five of fifty-three templates carry a blocker in their payload, and rewriting a
payload changes what a template emits, so that is a decision per template rather than a sweep.
<!-- /ANCHOR:closure -->
