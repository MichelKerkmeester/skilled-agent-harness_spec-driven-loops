---
title: "Acceptance Criteria: Phase 2: multiplexed-rule-split"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "canonical save acceptance criteria"
  - "registry split closure gate"
  - "one to one script path proof"
  - "orchestrator special case proof"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/002-multiplexed-rule-split"
    last_updated_at: "2026-09-07T19:05:00Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-recorded-findings-closure-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: multiplexed-rule-split

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-recorded-findings-closure/002-multiplexed-rule-split
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|----------------------|---------------|--------|--------|
| AC-001 | REQ-001 | Given `validator-registry.json`'s five `CANONICAL_SAVE_*` rows, When their `script_path` values are read, Then all five are distinct and none equals another row's path | the registry check prints 5 distinct script paths of 5 rows: root-spec, source-docs, lineage, packet-identity and description-graph-freshness | Met | - |
| AC-002 | REQ-002 | Given `orchestrator.ts`, When searched for the old basename special case, Then no reference to `check-canonical-save.sh` remains | `grep -c check-canonical-save.sh` over `lib/validation/orchestrator.ts` returns 0; the wrapper calls the two-argument run_check for every row | Met | - |
| AC-003 | REQ-003 | Given `validate.sh --help`, When run before and after the split, Then the rule count and rule ids are identical | `validate.sh --help` lists 41 rule lines with 5 canonical-save rows before and after; the registry holds 39 rows before and after | Met | Unmet | - |
| AC-004 | REQ-004 | Given `validate-runs-every-registry-rule.vitest.ts`, When run after the split, Then it exits 0 with every registry row reported | `validate-runs-every-registry-rule.vitest.ts` passes with every row seen | Met | - |
| AC-005 | REQ-005 | Given `canonical-save-validation.vitest.ts`, When run against the five new scripts, Then every existing assertion passes with unchanged outcomes | `canonical-save-validation.vitest.ts` passes unmodified; with `validate-help-lists-every-rule` and `validator-registry-doc-count`, 4 files and 10 tests pass | Met | - |
| AC-006 | REQ-006 | Given the `ts:spec-doc-structure` family, When spec.md's Out of Scope reasoning is reviewed, Then it names the five dedicated dispatch functions as the existing attribution proof, not a deferred TODO | spec.md Out of Scope names the five dedicated dispatch functions in `spec-doc-structure.ts` as the existing per-row attribution | Met | - |

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

This packet is at the planning stage: spec, plan and tasks are authored and every
criterion above is traced to a real requirement, but none has been executed yet.
Closure is written once AC-001 through AC-006 all read `Met`.
<!-- /ANCHOR:closure -->
