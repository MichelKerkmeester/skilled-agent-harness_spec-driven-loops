---
title: "Acceptance Criteria: Phase 5: version-aware-guards"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "version aware guards acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/005-version-aware-guards"
    last_updated_at: "2026-10-18T12:45:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-version-aware-guards"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: version-aware-guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 082-opencode-v1-v2-dual-compat/005-version-aware-guards
**Level:** 2
**Status:** Draft
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002, REQ-003, REQ-004 | Given an `opencode2 run` command, When the dispatch classifier and rule engine inspect it, Then the segment classifies as cli-opencode, and the rules that apply to v2 or to both versions are evaluated. | `cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs` exits 0 with the new `opencode2` cases passing. The same cases fail on the pre-change code, and the red output is saved under `scratch/`. | Unmet | - |
| AC-002 | REQ-005 | Given a correct v2 slash-command run, `opencode2 run --standalone -m <provider>/<model>#<variant> "/speckit:search query"`, When every guard evaluates it, Then no rule returns a blocking verdict. | `node --test --test-reporter=tap .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` exits 0, and the v2 slash case asserts that no violation has `block` severity. | Unmet | - |
| AC-003 | REQ-006 | Given the existing guard suites, When each runs with the runner its file names, Then every suite exits 0, and its pass count is at or above the baseline recorded at T002. | The CHK-002 commands in tasks.md, with each pass count compared to the T002 record. | Unmet | - |

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

Not closeable yet. No criterion has run, and the phase has not started. Write this
paragraph when the packet is closed, not before.
<!-- /ANCHOR:closure -->
