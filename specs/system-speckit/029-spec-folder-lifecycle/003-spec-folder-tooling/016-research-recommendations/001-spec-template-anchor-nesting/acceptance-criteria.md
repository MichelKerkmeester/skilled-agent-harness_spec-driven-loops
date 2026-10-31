---
title: "Acceptance Criteria: Phase 1: spec-template-anchor-nesting"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "spec template anchor nesting acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-spec-template-anchor-nesting"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked all five criteria Met against observed evidence"
    next_safe_action: "Commit with wave 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: spec-template-anchor-nesting

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting
**Level:** 2
**Status:** Complete
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a new L2, L3 and L3+ scaffold from the fixed template, When each is rendered, Then the questions anchor wraps only the questions and no other sections. | `scaffold-golden-snapshots.vitest.ts`: 12 passed (re-run 2026-10-08 in CI mode, 12 passed). The new `expectAnchorsWellOrdered` assertion (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:49`) fails when any anchor opens inside another, and it runs on the spec.md of L1, L2, L3 and L3+ (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:92`). Against the old template it failed 2 tests ("2-spec.md: anchor nfr nested inside questions", "3+-spec.md: approval-workflow nested inside questions"). | Met | - |
| AC-002 | REQ-002 | Given the fixed template renders for L2, L3 and L3+, When snapshots are captured, Then they show the questions anchor in the correct position for each level. | The snap diff for `2-spec.md`, `3-spec.md` and `3+-spec.md` is only the questions opener moving from before the NFR block to directly above OPEN QUESTIONS, plus the L3+ closer moving from after RELATED DOCUMENTS to after Question 1: the questions pair is now at `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap:1265`, `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap:2011` and `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap:2964`. `1-spec.md` is unchanged because its opener already sat directly above `## 7. OPEN QUESTIONS` (`.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap:721`). The file holds 25 entries: the 24 at the baseline plus a `review-spec.md` entry added in review round 1 (the row's original count of 24 is the baseline). | Met | - |
| AC-003 | REQ-003 | Given new L2, L3 and L3+ scaffolds from the fixed template, When `validate.sh --strict` runs on each, Then ANCHORS_VALID reports pass for all three. | `create.sh --level 1`, `2`, `3` and `3+` renders under a throwaway path (template openers at `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:302`, `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:307`, `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:390` and `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:394`): `validate.sh --strict` printed RESULT: PASSED with Errors 0 for each. ANCHORS_VALID is an ERROR-severity rule (`.skilled/skills/system-spec-kit/references/validation/validation-rules.md:58`), so a pairing fault would have failed the run; the only warnings were the SPEC_DOC_SUFFICIENCY placeholder warning and, at L3, AI_PROTOCOLS. A node stack check also found no nesting and no unclosed anchor in each. The throwaway folders were removed. | Met | - |
| AC-004 | REQ-004 | Given the snapshot test rendering all levels, When it asserts no anchor nesting, order and pairing, Then all assertions pass. | `scaffold-golden-snapshots.vitest.ts` carries one helper, `expectAnchorsWellOrdered` (vitest `expect`, not an `assert noNesting` call). It fails on nesting, on a closer with no matching opener and on an unclosed anchor. It is defined at `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:49` and runs on the spec.md of L1, L2, L3 and L3+ (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:92`), the phase-parent spec (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:107`) and the review and research spec templates (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:271`). Test output: 12 passed. | Met | - |
| AC-005 | REQ-005 | Given the spec-kit test suite, When it runs, Then no new test failures appear. | Wave 1 final gate, `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` (script at `.skilled/skills/system-spec-kit/runtime/cli/package.json:19`: the cli vitest project plus the legacy and validation suites): rc 0, 162 files passed and 3 skipped, 1648 tests passed and 19 skipped, 0 failed. Baseline at `c85ec7f880`: 161 files, 1639 passed. The count is higher, and the total covers every wave 1 phase, not this one alone. `npm run check`: rc 0. | Met | - |

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

**Closeable:** Yes. Five of five `Met`.

The template now opens the questions anchor directly above each level's OPEN QUESTIONS heading and the L3+ closer sits right after its question, snapshots are regenerated, `validate.sh --strict` passes on a fresh render at all four levels, and the new anchor assertions pass inside a suite with 1648 tests passing and none failing. No row is waived or superseded.
<!-- /ANCHOR:closure -->
