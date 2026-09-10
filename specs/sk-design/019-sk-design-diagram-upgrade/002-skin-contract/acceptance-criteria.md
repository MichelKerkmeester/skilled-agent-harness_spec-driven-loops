---
title: "Acceptance Criteria: Phase 2: skin-contract"
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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/002-skin-contract"
    last_updated_at: "2026-09-10T22:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/findings-ledger.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract/goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-002-skin-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: skin-contract

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/019-sk-design-diagram-upgrade/002-skin-contract
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
| AC-001 | REQ-001 | Given glm's 29 findings and sonnet's verification registry both exist on disk, When this phase authors its fact base, Then `findings-ledger.md` lists every finding with a verdict and a node+task attribution | `test -f findings-ledger.md` plus a row-count check: `grep -c "^\| F" findings-ledger.md` >= 29 | Unmet | - |
| AC-002 | REQ-002 | Given `SKILL.md:403` and `:337` state contradictory 4px exemptions, When this phase adjudicates, Then `goal.md`'s decision table names `:337` as controlling and lists exactly two exemption clauses | `grep -n "337\|403" goal.md` names both line numbers with a stated resolution | Unmet | - |
| AC-003 | REQ-003 | Given the marker trio is defined in only 10/34 files, When this phase signs the vocabulary, Then `goal.md` states "define only what you draw, per file" and "unique per file" | `grep -n "define only what you draw" goal.md` | Unmet | - |
| AC-004 | REQ-004 | Given `example-high-level.html`'s 36 raw `<rect>` elements are not all nodes, When this phase signs the markup convention, Then `goal.md` names `data-diagram-node` as the budget-counted attribute | `grep -n "data-diagram-node" goal.md` | Unmet | - |
| AC-005 | REQ-005 | Given `#3d4460` appears only in `type-high-level.md`, When this phase signs token-source scope, Then `goal.md` states it as a type-scoped role, not a foundations-level token | `grep -n "3d4460" goal.md` states "type-scoped" | Unmet | - |
| AC-006 | REQ-006 | Given 38/38 files depend on `fonts.googleapis.com` and no exception precedent exists in `check-corpus.cjs`, When this phase signs the self-contained bar, Then `goal.md` names exactly one whitelisted host and states no precedent was ported | `grep -n "fonts.googleapis.com" goal.md` | Unmet | - |
| AC-007 | REQ-007 | Given the derivation doctrine is scattered across `style-guide.md`, When this phase specifies its shape, Then `goal.md`/`plan.md` name three lists, four kinds (including `untokenized`), and a reference-path-plus-sha256 pin | `grep -n "untokenized" plan.md` and `grep -n "sha256" plan.md` | Unmet | - |
| AC-008 | REQ-008 | Given the accent measures 2.863:1 against a 3.0 gate, When this phase signs the emphasis mapping, Then `plan.md`'s ADR-001 records it as a departure, not a re-derivation | `grep -n "ADR-001" plan.md` states "departure" | Unmet | - |
| AC-009 | REQ-009 | Given the standard's pin discipline (reference path + sha256), When this phase inherits it, Then `goal.md`/`tasks.md` name a reference path and a real sha256 value | `grep -n "sha256" tasks.md` | Unmet | - |
| AC-010 | REQ-010 | Given five loci disagree on version (1.0.0.0/1.0.0.5/1.0.0.7), When this phase collapses them, Then `spec.md` names all five loci and the single surviving one | `grep -c "1.0.0.0\|1.0.0.5\|1.0.0.7" spec.md` returns >= 5 | Unmet | - |
| AC-011 | REQ-011 | Given `diagram.md:67` names YAML files that do not exist, When this phase fixes it, Then `tasks.md`'s T011 names the exact line and the correct replacement names | `grep -n "diagram.md:67" tasks.md` | Unmet | - |
| AC-012 | REQ-012 | Given the accessible-SVG contract is stated three times in `SKILL.md`, When this phase designates one locus, Then `tasks.md`'s T012 names the surviving location and the two cross-references | `grep -n "T012" tasks.md` names ":406" | Unmet | - |
| AC-013 | REQ-013 | Given fallback chains already ship in every template and inline SVG, When this phase documents them, Then `tasks.md`'s T013 names the exact template lines already shipping them | `grep -n "template.html:15-17" tasks.md` | Unmet | - |

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

This packet is authored — every decision, record shape, and mechanical fix is specified in
writing — but none of it has been ratified by the operator, executed against the skill files, or
verified by `validate.sh --strict`, so it cannot close yet.
<!-- /ANCHOR:closure -->
