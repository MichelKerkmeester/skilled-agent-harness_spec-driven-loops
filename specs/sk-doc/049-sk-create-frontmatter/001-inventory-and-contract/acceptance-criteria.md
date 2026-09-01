---
title: "Acceptance Criteria: Phase 1: inventory-and-contract"
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
    packet_pointer: "sk-doc/049-sk-create-frontmatter/001-inventory-and-contract"
    last_updated_at: "2026-09-01T10:43:26Z"
    last_updated_by: "implementation"
    recent_action: "Authored acceptance criteria; confirmed all six AC rows Met"
    next_safe_action: "Proceed to phase 002 (mode scaffold)"
    blockers: []
    key_files:
      - "inventory/consumer-inventory.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: inventory-and-contract

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/049-sk-create-frontmatter/001-inventory-and-contract
**Level:** 3
**Status:** Complete
**Date:** 2026-09-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given every syntactic reference to the two frontmatter documents across `.opencode/`, When the reproducible probe and five-form classifier are applied, Then each is listed with its file, line and exact written form | `inventory/consumer-inventory.md` §2 (83 lines / 40 files) and §5a-5d (per-file, per-line breakdown by written form) | Met | - |
| AC-002 | REQ-002 | Given the two scripts named as possible run-time parsers, When each is traced line by line, Then neither opens either frontmatter document — both only cite its path | `inventory/consumer-inventory.md` §4: `quick_validate.py:172` opens only the `SKILL.md` under validation; `package_skill.py:334`'s sole reference sits inside a validation-failure string | Met | - |
| AC-003 | REQ-003 | Given the 54 live consumer references, When each is checked against the new mode's boundary, Then every one carries an `owned-by-frontmatter` or `shared` label with a one-line reason | `inventory/consumer-inventory.md` §7b (literal hard-coded path at `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:38`) and §7c (22 files owned, 12 shared, every one of the 83 matched lines in exactly one row) | Met | - |
| AC-004 | SC-001 | Given the probe and classifier run once, When rerun within the same investigation, Then the 83/40 count and five-form split reproduce exactly | `inventory/consumer-inventory.md` §1-§3, the reproducible probe rerun inside the phase-001 session before phase 002 began scaffolding the mode skeleton | Met | - |
| AC-005 | SC-002 | Given the 83 matched lines, When each is assigned to one of four buckets, Then the buckets sum to 83 with none left unclassified | `inventory/consumer-inventory.md` §2 (54+4+13+12=83) and §7c ("Every match is in exactly one row. No consumer is unclassified.") | Met | - |
| AC-006 | SC-003 | Given the requirement to name every run-time parser, When the sweep closes, Then the two candidates are named by path and the absence of any parser is stated plainly | `inventory/consumer-inventory.md` §4 ("There are none... An exhaustive sweep for dynamic construction found no other candidate"), naming `quick_validate.py` and `package_skill.py` explicitly | Met | - |

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

All six criteria are Met. The probe reproducibly found 83 references across 40 files, all 83 fall into
exactly one of four classification buckets, no script parses either document at run time, and the
ownership boundary is recorded with its literal justification (`post-edit-router.cjs:38`). Consciously
left out: the outbound-link scan the investigation added beyond REQ-001's scope (`inventory/consumer-inventory.md`
§5e, links pointing away from the two documents) is real and useful to phase 003, but it is not itself a
requirement of this phase, so it is not represented as its own AC row. Note also that a probe rerun today
no longer reproduces 83/40, because phase 002 has since scaffolded
`sk-create-frontmatter/{SKILL.md,README.md,references/README.md,changelog/v1.0.0.0.md}` in the live
tree — a downstream effect of later work already in progress, not a defect in this phase's snapshot.
<!-- /ANCHOR:closure -->
