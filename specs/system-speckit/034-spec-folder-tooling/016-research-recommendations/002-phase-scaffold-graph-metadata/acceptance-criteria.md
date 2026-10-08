---
title: "Acceptance Criteria: Phase 2: phase-scaffold-graph-metadata"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "phase scaffold graph metadata acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/002-phase-scaffold-graph-metadata"
    last_updated_at: "2026-10-08T12:30:00Z"
    last_updated_by: "planning-agent"
    recent_action: "Applied DeepSeek review findings"
    next_safe_action: "Build according to spec.md, plan.md, and tasks.md"
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
# Acceptance Criteria: Phase 2: phase-scaffold-graph-metadata

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 034-spec-folder-tooling/016-research-recommendations/002-phase-scaffold-graph-metadata
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
| AC-001 | REQ-001 | Given create.sh --phase creates a parent and children with templated files, When backfill is called for the parent, Then the parent graph-metadata.json passes GENERATED_METADATA_INTEGRITY and GENERATED_METADATA_DRIFT checks | Run `validate.sh <parent-folder> --strict` and inspect the output for GENERATED_METADATA_* rules | Unmet | - |
| AC-002 | REQ-002 | Given create.sh --phase creates child packets, When backfill is called for each child, Then each child's graph-metadata.json passes GENERATED_METADATA_INTEGRITY and GENERATED_METADATA_DRIFT checks | Run `validate.sh <child-folder> --strict` on each child and inspect output | Unmet | - |
| AC-003 | REQ-003 | Given a parent packet with new children, When graph-metadata derivation completes, Then the parent's graph-metadata.json children_ids field contains specs-root-relative paths for all created children | Parse parent graph-metadata.json and verify children_ids are specs-root-relative paths matching discovered children | Unmet | - |
| AC-004 | REQ-004 | Given scaffold-passes-its-own-gate.vitest.ts test suite, When --phase test case is added, Then it creates a parent with two children and validates all three with strict gates | Run the test: `vitest run scaffold-passes-its-own-gate.vitest.ts` and inspect output for --phase case | Unmet | - |
| AC-005 | REQ-005 | Given the spec-kit test suite, When all tests are run, Then no new test failures are introduced | Run the full suite: `npm test` in the spec-kit directory | Unmet | - |

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

**Closeable:** Unmet (packet is planned, not built)

Write the closure statement once all criteria are met and the packet is ready to close.
<!-- /ANCHOR:closure -->
