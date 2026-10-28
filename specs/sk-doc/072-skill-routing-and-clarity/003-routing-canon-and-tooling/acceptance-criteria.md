---
title: "Acceptance Criteria: Phase 3: Routing canon and tooling"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "routing canon and tooling acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/003-routing-canon-and-tooling"
    last_updated_at: "2026-10-28T15:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Fixed the review findings and re-verified every criterion"
    next_safe_action: "Start phase 004: single vocabulary source"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: Routing canon and tooling

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/072-skill-routing-and-clarity/003-routing-canon-and-tooling`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase is implemented, When its gates run, Then: One proof packet uses the new shape and `verify-router-sync.cjs`, `package_skill.py --strict` and `parent-skill-check.cjs` pass on it. | `scratch/after.md` §3 AC-001: sk-code-ci, verify-router-sync 5/5, package_skill --strict PASS, parent-skill-check OK | Met | - |
| AC-002 | REQ-002 | Given the phase is implemented, When its gates run, Then: Every tooling change ships with a test that fails without it. | `scratch/after.md` §3 AC-002 and §4.3: each new test fails on HEAD code and passes on the new code, including the review-fix tests | Met | - |
| AC-003 | REQ-003 | Given the phase is implemented, When its gates run, Then: The templates describe the new shape in plain words with one example. | `skill-md-template.md` Section 2 guidance with one worked example; scaffolds | Met | - |
| AC-004 | REQ-004 | Given a new skill and a new parent skill are created through `/create:skill` and `/create:skill-parent`, When creation finishes, Then: both are in the new shape with no hand edit, `package_skill.py --strict` passes for the skill, and `parent-skill-check.cjs` passes for the parent. | `scratch/after.md` §4.5: `/create:skill` scaffolds through `init_skill.py`, and its blocking gate is now `validate_skill_package.py --strict`, which a fresh filled scaffold passes (exit 0); `/create:skill-parent` authors from `parent-skill-hub-template.md` (its SMART ROUTING is 6 lines and 164 words after the directive move, the appendix is last, no RS finding) and is gated by blocking check 12b; the `init_skill.py --kind parent` scaffold passes parent-skill-check OK | Met | - |
| AC-005 | REQ-005 | Given existing old-shape skills, When the fleet check runs, Then: it lists them as known debt and exits 0. | `scratch/after.md` §4.1 and §4.5: 7 hubs exit 0; ledger regenerated in the new form, same 54 keys | Met | - |
| AC-006 | REQ-005 | Given an old-shape skill fixture, When the `/create:skill` default check `package_skill.py --strict` runs, Then: it fails. | `scratch/after.md` §3 AC-006 and §4.4: new exit 1 RS-001/RS-002, HEAD exit 0; the strict create gate exits 1 on the same fixture | Met | - |
| AC-007 | REQ-005 | Given an old-shape parent fixture, When the `/create:skill-parent` default check `parent-skill-check.cjs` runs, Then: it fails. | `scratch/after.md` §3 AC-007: new exit 1 RS-001/RS-002 and RS-004, HEAD exit 0 | Met | - |

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

Every criterion is Met with observed evidence in `scratch/after.md`.
<!-- /ANCHOR:closure -->
