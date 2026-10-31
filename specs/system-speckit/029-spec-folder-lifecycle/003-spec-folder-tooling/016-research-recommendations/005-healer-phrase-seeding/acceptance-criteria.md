---
title: "Acceptance Criteria: Phase 5: healer-phrase-seeding"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "healer phrase seeding acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Met all six criteria with observed evidence"
    next_safe_action: "Commit with wave 1"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: healer-phrase-seeding

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding
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
| AC-001 | REQ-001 | Given heal-spec-docs.cjs, When its source is searched, Then TEMPLATE_DEFAULTS no longer exists | `grep -c TEMPLATE_DEFAULTS heal-spec-docs.cjs` prints 0. Observed: it printed 0, and `rg TEMPLATE_DEFAULTS .skilled` finds no hit in any file; the replacement map sits at `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:48` | Met | - |
| AC-002 | REQ-002 | Given upgrade-legacy --apply runs on a fixture with an empty list and a missing trigger_phrases key, When every written phrase is graded by phrase-judge.mjs, Then none falls in any negative class | upgrade-legacy.vitest.ts new case asserts `judgeTriggerPhrase` returns null for every written phrase, Vitest exit 0. Observed: case `writes no phrase the judge rejects when it repairs a legacy packet` passes, file 18 passed; rerun of both phase files printed `Tests 32 passed`, rc 0; the grade loop is at `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:340` | Met | - |
| AC-003 | REQ-003 | Given a document with an empty trigger_phrases list, When heal-spec-docs --apply runs, Then the list equals the `seededPhrases` output for that document | create-root-numbering.vitest.ts pin case passes. Observed: `heal-spec-docs refills empty trigger phrases` passes, file 14 passed; it runs the real healer and expects each list to equal `seededPhrases(file, kind)` at `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts:375` | Met | - |
| AC-004 | REQ-004 | Given a document with no trigger_phrases key, When `inferTriggerPhrases` builds its list, Then it holds no phrase the judge rejects and no `memory`, `indexing`, `context` fallback | upgrade-legacy.vitest.ts missing-key case passes. The policy is recorded in spec.md section 10, decided 2026-10-08 by the operator. Observed: the same upgrade-legacy case grades the `spec.md` that has no key and the `tasks.md` that has no frontmatter, and passes; `rg "'memory', 'indexing', 'context'" frontmatter-migration.ts` finds nothing, and the function filters through the judge at `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1019` and returns `undefined` at line 1023 when the judge rejects every candidate | Met | - |
| AC-005 | REQ-001 | Given the healer refills a list, When the result is read, Then it carries none of the old template phrases | upgrade-legacy.vitest.ts empty-list case passes. Observed: the case starts `plan.md` and `implementation-summary.md` at `trigger_phrases: []`, pins both refills as non-empty at `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:337` and grades each phrase `null`; all twelve old template phrases grade `template-default` when run through the judge, so none can be present | Met | - |
| AC-006 | General | Given this spec packet, When validate.sh --strict runs, Then all pass | bash validate.sh /path --strict shows RESULT: PASSED. Observed: `validate.sh --strict` on this folder prints `RESULT: PASSED`, recorded at `implementation-summary.md:127` | Met | - |

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

**Closeable:** Yes (Complete)

All six criteria are Met, each with evidence observed in the final state. The empty-list policy was decided by the operator on 2026-10-08 and is recorded in spec.md section 10, so no decision record is needed and no row carries a waiver. AC-001 through AC-005 are closed by the code and the two test files: the cli suite after all wave 1 fixes exits 0 with 1,648 tests passed (baseline 1,639, a count shared with the other wave 1 phases), and the two phase files pass 32 of 32. AC-006 is closed by `validate.sh --strict` on this folder.
<!-- /ANCHOR:closure -->
