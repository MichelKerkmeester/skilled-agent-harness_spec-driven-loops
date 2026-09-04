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
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Added the sweep criterion and re-verified the three original rows"
    next_safe_action: "Build the exemption mechanism named in the triage"
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
**Date:** 2026-09-04
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
| AC-004 | REQ-002 | Given a detected template carrying a hard blocker, When the sweep closes, Then the blocker is removed or recorded with the reason it must stay | Re-scan 2026-09-04 via `hvr_scan.py:1` over all 54 detected templates, recorded in `research/template-triage.md:380`: 509 blockers across 41 files fall to 22 across 8. Under `.opencode/` the 14 that remain are five files of exemptions, each with a class and a reason in `research/template-triage.md` section 12. The other 8 sit in three spec-folder templates that `scope-and-exemptions.md` section 3 puts out of scope. Every emitted rewrite carries a one-line improvement judgment, and nine consumer suites plus a per-file `validate_document.py` count are identical to their pre-sweep baseline | Met | |

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

All four criteria were verified from the current tree: the fixture exemption holds, a blocker
seeded inside a template fence is caught, the retired sentence survives in one place only, this
criterion, and the template backlog is swept.

The backlog the first three measurements exposed is now closed. The operator authorized the
rewrite on 2026-09-04, and 509 blockers across 41 detected templates fell to 22 across 8. What
is left is not punctuation habit: two files name a real component whose name the standard bans,
one quotes the ban list to teach it, one quotes a historical description verbatim, one names two
headings hardcoded in a builder, one is an HTML entity, and three are spec documents whose bytes
are a record. The scanner still has no way to express any of that, which is the one thing this
phase leaves open.
<!-- /ANCHOR:closure -->
