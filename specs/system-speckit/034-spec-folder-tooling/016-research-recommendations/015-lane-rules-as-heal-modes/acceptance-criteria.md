---
title: "Acceptance Criteria: Phase 15: lane-rules-as-heal-modes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "lane rules as heal modes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/015-lane-rules-as-heal-modes"
    last_updated_at: "2026-10-08T04:22:50Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 15: lane-rules-as-heal-modes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes
**Level:** 2
**Status:** Planned
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a packet with anchors but no wrapping section markers, When anchor-wrap mode runs, Then anchors are wrapped in their enclosing section markers | Test: `heal-spec-docs.vitest.ts::anchor-wrap-positive` asserts wrapper added | Unmet | - |
| AC-002 | REQ-001 | Given a document with no anchors, When anchor-wrap mode runs, Then the mode refuses and records refusal in baseline | Test: `heal-spec-docs.vitest.ts::anchor-wrap-refuses-no-anchors` asserts refusal | Unmet | - |
| AC-003 | REQ-001 | Given a document with a unique broken link and one new target, When link-repoint mode runs, Then the link is updated to the new target | Test: `heal-spec-docs.vitest.ts::link-repoint-positive` asserts link updated | Unmet | - |
| AC-004 | REQ-001 | Given a document with multiple broken links matching the same new target, When link-repoint mode runs, Then the mode refuses due to ambiguity | Test: `heal-spec-docs.vitest.ts::link-repoint-refuses-multiple-matches` asserts refusal | Unmet | - |
| AC-005 | REQ-001 | Given a continuity field that is empty, When continuity-placeholders mode runs, Then recent_action and next_safe_action are filled with appropriate defaults | Test: `heal-spec-docs.vitest.ts::continuity-placeholders-positive` asserts fields filled | Unmet | - |
| AC-006 | REQ-001 | Given a continuity field that is already partially authored, When continuity-placeholders mode runs, Then the mode refuses and preserves the authored choice | Test: `heal-spec-docs.vitest.ts::continuity-placeholders-refuses-authored` asserts preservation | Unmet | - |
| AC-007 | REQ-001 | Given a packet whose spec.md has `<!-- SPECKIT_LEVEL: N -->` but frontmatter level is missing, When level-from-spec mode runs, Then the level is copied to frontmatter | Test: `heal-spec-docs.vitest.ts::level-from-spec-positive` asserts level set | Unmet | - |
| AC-008 | REQ-001 | Given a packet whose spec.md has no SPECKIT_LEVEL header, When level-from-spec mode runs, Then the mode refuses | Test: `heal-spec-docs.vitest.ts::level-from-spec-refuses-missing-header` asserts refusal | Unmet | - |
| AC-009 | REQ-001 | Given a document whose anchors exactly match a template signature, When header-add mode runs, Then the template header is added | Test: `heal-spec-docs.vitest.ts::header-add-positive` asserts header added | Unmet | - |
| AC-010 | REQ-001 | Given a document whose anchors do not match any template, When header-add mode runs, Then the mode refuses | Test: `heal-spec-docs.vitest.ts::header-add-refuses-no-match` asserts refusal | Unmet | - |
| AC-011 | REQ-002 | Given a packet fixed by anchor-wrap, When upgrade-legacy runs again, Then the second run reports zero changes for anchor-wrap | Test: `heal-spec-docs.vitest.ts::anchor-wrap-idempotence` asserts unchanged on rerun | Unmet | - |
| AC-012 | REQ-002 | Given a packet fixed by link-repoint, When upgrade-legacy runs again, Then the second run reports zero changes for link-repoint | Test: `heal-spec-docs.vitest.ts::link-repoint-idempotence` asserts unchanged on rerun | Unmet | - |
| AC-013 | REQ-002 | Given a packet fixed by all five modes, When upgrade-legacy runs again, Then per-folder validation reports no new findings (all modes are idempotent) | Command: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict` on second run returns same baseline count | Unmet | - |
| AC-014 | REQ-003 | Given a packet requiring reconstruction (lane rule 3), When the healer runs, Then the mode is only reported, never automated | Verification: `grep -n "reconstruction"` in heal-spec-docs.cjs shows no automated mode for rule 3 | Unmet | - |
| AC-015 | REQ-003 | Given a packet with status mismatch (lane rule 7), When the healer runs, Then the mode is only reported, never automated | Verification: `grep -n "status"` in heal-spec-docs.cjs shows no automated mode for rule 7 | Unmet | - |
| AC-016 | REQ-004 | Given a packet with multiple findings fixed by the five modes, When per-folder validation runs after apply, Then validation catches any transformation that violates the packet's own structure | Command: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict` after apply returns RESULT: PASSED | Unmet | - |
| AC-017 | REQ-005 | Given the `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` file, When the phase closes, Then each of the five modes is documented with its derivability rule and refusal condition | Artifact: README.md lines documenting anchor-wrap, link-repoint, continuity-placeholders, level-from-spec, header-add | Unmet | - |
| AC-018 | REQ-006 | Given the existing test suite in upgrade-legacy.vitest.ts, When this phase's modes are added, Then all prior tests still pass | Command: `npm test -- upgrade-legacy.vitest.ts` returns exit 0 | Unmet | - |
| AC-019 | REQ-007 | Given a corpus run with the new modes, When a second run is performed on the same packets, Then no findings are contradicted (no mode reports a fix that another mode undoes) | Command: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <corpus> --corpus-mode` on second run shows zero contradictions | Unmet | - |

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

This packet is not yet closeable. It is in Planned status. When implemented and all acceptance criteria above are met, return to this statement and describe which criteria proved the packet and what was consciously left for future phases (if any).
<!-- /ANCHOR:closure -->
