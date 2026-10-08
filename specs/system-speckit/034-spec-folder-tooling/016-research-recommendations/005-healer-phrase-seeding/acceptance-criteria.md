---
title: "Acceptance Criteria: Phase 5: healer-phrase-seeding"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "healer phrase seeding acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/005-healer-phrase-seeding"
    last_updated_at: "2026-10-08T04:22:42Z"
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
# Acceptance Criteria: Phase 5: healer-phrase-seeding

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding
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
| AC-001 | REQ-001 | Given heal-spec-docs.cjs, When its source is searched, Then TEMPLATE_DEFAULTS no longer exists | `grep -c TEMPLATE_DEFAULTS heal-spec-docs.cjs` prints 0 | Unmet | - |
| AC-002 | REQ-002 | Given upgrade-legacy --apply runs on a fixture with an empty list and a missing trigger_phrases key, When every written phrase is graded by phrase-judge.mjs, Then none falls in any negative class | upgrade-legacy.vitest.ts new case asserts `judgeTriggerPhrase` returns null for every written phrase, Vitest exit 0 | Unmet | - |
| AC-003 | REQ-003 | Given a document with an empty trigger_phrases list, When heal-spec-docs --apply runs, Then the list equals the `seededPhrases` output for that document | create-root-numbering.vitest.ts pin case passes | Unmet | - |
| AC-004 | REQ-004 | Given a document with no trigger_phrases key, When `inferTriggerPhrases` builds its list, Then it holds no phrase the judge rejects and no `memory`, `indexing`, `context` fallback | upgrade-legacy.vitest.ts missing-key case passes. The policy is recorded in spec.md section 10, decided 2026-10-08 by the operator | Unmet | - |
| AC-005 | REQ-001 | Given the healer refills a list, When the result is read, Then it carries none of the old template phrases | upgrade-legacy.vitest.ts empty-list case passes | Unmet | - |
| AC-006 | General | Given this spec packet, When validate.sh --strict runs, Then all pass | bash validate.sh /path --strict shows RESULT: PASSED | Unmet | - |

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

**Closeable:** No (Planned)

This packet is closeable when all six criteria are Met. The empty-list policy was decided by the operator on 2026-10-08 and is recorded in spec.md section 10, so no decision record is needed. AC-001 through AC-005 require code changes and tests. AC-006 requires validation to pass.
<!-- /ANCHOR:closure -->
