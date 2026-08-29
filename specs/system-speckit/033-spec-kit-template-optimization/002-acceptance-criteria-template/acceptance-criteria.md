---
title: "Acceptance Criteria: Acceptance Criteria Template as Packet Closure Gate"
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
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/002-acceptance-criteria-template"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Close AC-003, AC-004 and AC-007"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-033-002-acceptance-criteria-template"
      parent_session_id: null
    completion_pct: 62
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Acceptance Criteria Template as Packet Closure Gate

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-spec-kit-template-optimization/002-acceptance-criteria-template
**Level:** 3
**Status:** In Progress
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the gated template, When it is rendered at Level 1, Then nothing is emitted; at Levels 2, 3 and 3+ the document is emitted | `inline-gate-renderer.sh --level N templates/addons/acceptance-criteria.md.tmpl`: L1 = 0 lines, L2/L3/L3+ = 86 lines | Met | - |
| AC-002 | REQ-002 | Given the Level contract, When a Level 2/3/3+ packet is resolved, Then acceptance-criteria.md is part of that level's document set | `spec-kit-docs.json` levels 2/3/3+ list it in optionalAddonDocs with sectionGates; presence is enforced by AC_CLOSURE | Met | - |
| AC-003 | REQ-003 | Given a post-cutoff packet with an unmet criterion and a completion claim, When validate.sh --strict runs, Then it fails | `scripts/tests/check-ac-closure.sh` 29/29: missing-document and completion-claim-with-unmet both fail (`scripts/rules/check-ac-closure.sh:253`, `:353`) | Met | - |
| AC-004 | REQ-004 | Given a row marked Waived citing an ADR absent from decision-record.md, When the rule runs, Then it fails rather than passing | `scripts/tests/check-ac-closure.sh`: missing, fenced, absent and multi-ADR waivers all fail; heading, bold-list and table declarations pass (`scripts/rules/check-ac-closure.sh:288`, `:301`, `:171`) | Met | - |
| AC-005 | REQ-005 | Given a packet carrying acceptance-criteria.md, When AC_COVERAGE counts criteria, Then it counts canonical AC rows and not the spec.md table | `scripts/rules/check-ac-coverage.sh:118` `_ac_count_canonical_rows` takes precedence in `_ac_count_total` | Met | - |
| AC-006 | REQ-006 | Given a packet created before the cutoff, When the closure gate runs, Then it reports advisory and never blocks | `scripts/rules/check-ac-closure.sh:48` `_acc_cutoff_date` and `:61` `_acc_created_date`; an unreadable date degrades to pre-cutoff and every branch respects it (`:231`, `:236`) | Met | - |
| AC-007 | REQ-007 | Given the reference surfaces, When the Level contract is published, Then every surface names the new document | Swept in three layers: runtime doc-sets (`spec-doc-paths.ts:9`, `spec-doc-structure.ts:189`, `resume-ladder.ts:127`, `spec-doc-health.ts:53`, `template-structure.js:94`), 6 speckit command assets, and 14 documents. Structure validation proven live by a broken-anchor negative control | Met | - |
| AC-008 | REQ-008 | Given spec.md rendered at Levels 2/3/3+, When the requirements table is read, Then it carries no acceptance-criteria column, while Level 1 still does | Rendered both: L1 keeps the 3-column table, L2/L3/L3+ render 2 columns and point at acceptance-criteria.md (`templates/core/spec.md.tmpl:134`) | Met | - |

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

All eight criteria are met with cited evidence. Nothing was waived, so no closure ADR was needed. The gate that this packet built reports the packet itself closeable.
<!-- /ANCHOR:closure -->
