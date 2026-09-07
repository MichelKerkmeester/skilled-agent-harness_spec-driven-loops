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
    last_updated_at: "2026-09-07T15:05:41Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-recorded-findings-closure-002"
      parent_session_id: null
    completion_pct: 0
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
**Status:** Draft
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|----------------------|---------------|--------|--------|
| AC-001 | REQ-001 | Given `validator-registry.json`'s five `CANONICAL_SAVE_*` rows, When their `script_path` values are read, Then all five are distinct and none equals another row's path | `python3 -c "import json; rows=[r for r in json.load(open('cli/lib/validator-registry.json')) if r['rule_id'].startswith('CANONICAL_SAVE_')]; print(len(set(r['script_path'] for r in rows)))"` prints 5 | Unmet | - |
| AC-002 | REQ-002 | Given `orchestrator.ts`, When searched for the old basename special case, Then no reference to `check-canonical-save.sh` remains | `rg -n "check-canonical-save.sh" lib/validation/orchestrator.ts` returns no matches | Unmet | - |
| AC-003 | REQ-003 | Given `validate.sh --help`, When run before and after the split, Then the rule count and rule ids are identical | `bash validate.sh --help \| grep -c "^"` matches the pre-split baseline (39 rows) and `diff` of the two rule-id lists is empty | Unmet | - |
| AC-004 | REQ-004 | Given `validate-runs-every-registry-rule.vitest.ts`, When run after the split, Then it exits 0 with every registry row reported | `npx vitest run validate-runs-every-registry-rule` from `cli/` | Unmet | - |
| AC-005 | REQ-005 | Given `canonical-save-validation.vitest.ts`, When run against the five new scripts, Then every existing assertion passes with unchanged outcomes | `npx vitest run canonical-save-validation` from `cli/` | Unmet | - |
| AC-006 | REQ-006 | Given the `ts:spec-doc-structure` family, When spec.md's Out of Scope reasoning is reviewed, Then it names the five dedicated dispatch functions as the existing attribution proof, not a deferred TODO | Manual read of `spec.md`'s Out of Scope section against `lib/validation/spec-doc-structure.ts:1249-1264` | Unmet | - |

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

This packet is at the planning stage: spec, plan and tasks are authored and every
criterion above is traced to a real requirement, but none has been executed yet.
Closure is written once AC-001 through AC-006 all read `Met`.
<!-- /ANCHOR:closure -->
