---
title: "Acceptance Criteria: Archive path follow-ups"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "archive path follow ups acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups"
    last_updated_at: "2026-10-08T04:22:41Z"
    last_updated_by: "claude"
    recent_action: "Planned archive path follow-ups"
    next_safe_action: "Implement and verify all criteria"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Archive path follow-ups

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups
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
| AC-001 | REQ-001 | Given a real spec packet with spec.md, plan.md, tasks.md, implementation-summary.md, description.json, and graph-metadata.json, When archive.sh is run, Then rederive_moved calls repair-derived.cjs --roots with --apply | `npx vitest run tests/archive-track.vitest.ts` shows test passing | Unmet | - |
| AC-002 | REQ-001 | Given the archived packet is restored with archive.sh --restore, When validate.sh --strict is run, Then exit status is 0 and RESULT: PASSED is printed | Fixture test in archive-track.vitest.ts:177-192 covers this | Unmet | - |
| AC-003 | REQ-003 | Given repair-derived.cjs, heal-spec-docs.cjs, migrate-generated-json.ts, and upgrade-legacy.mjs, When each is read for archive policy comments, Then all four agree on current-location semantics | Grep for "FROZEN\|archive\|z_archive" shows consistent comments | Unmet | - |
| AC-004 | REQ-002 | Given the fixture test is written with metadata, archive, restore, and validate steps, When it runs, Then all steps complete with exit 0 | Fixture test covers the round-trip in archive-track.vitest.ts | Unmet | - |
| AC-005 | REQ-004 | Given README-repair-derived.md section 6, When read, Then it documents archive scope under current-location semantics | .skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md:section 6 | Unmet | - |
| AC-006 | REQ-005 | Given all test suites in runtime/cli/tests, When npm test is run, Then no tests fail and archive-path-related tests pass | npm test output shows 0 failures | Unmet | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
