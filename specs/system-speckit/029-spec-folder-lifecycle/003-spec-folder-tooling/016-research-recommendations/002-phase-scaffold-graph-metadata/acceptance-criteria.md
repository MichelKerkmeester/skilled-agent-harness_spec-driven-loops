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
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "Commit with wave 1"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given create.sh --phase creates a parent and children with templated files, When backfill is called for the parent, Then the parent graph-metadata.json passes GENERATED_METADATA_INTEGRITY and GENERATED_METADATA_DRIFT checks | Run `validate.sh <parent-folder> --strict` and inspect the output for GENERATED_METADATA_* rules. Observed: a throwaway `create.sh --phase` run with two children: the parent's `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` pass and `validate.sh --strict` prints `RESULT: PASSED`. The vitest phase case asserts `Errors: 0` and exit status 0 on the parent; with HEAD create.sh it fails. Cited: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1937` (the call) and `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts:95` (the assertion). | Met | - |
| AC-002 | REQ-002 | Given create.sh --phase creates child packets, When backfill is called for each child, Then each child's graph-metadata.json passes GENERATED_METADATA_INTEGRITY and GENERATED_METADATA_DRIFT checks | Run `validate.sh <child-folder> --strict` on each child and inspect output. Observed: in the same run `001-first` and `002-second` each pass both rules and print `RESULT: PASSED` under `--strict`. The vitest phase case loops over the two children read from disk. Cited: `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts:46` (children read from disk) and `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts:89` (the loop). | Met | - |
| AC-003 | REQ-003 | Given a parent packet with new children, When graph-metadata derivation completes, Then the parent's graph-metadata.json children_ids field contains specs-root-relative paths for all created children | Parse parent graph-metadata.json and verify children_ids are specs-root-relative paths matching discovered children. Observed: the throwaway parent's `children_ids` was `["001-evidence-phase-probe/001-first","001-evidence-phase-probe/002-second"]`, matching the two on-disk children. Cited: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1937` (the call that derives the parent after its children exist on disk). | Met | - |
| AC-004 | REQ-004 | Given scaffold-passes-its-own-gate.vitest.ts test suite, When --phase test case is added, Then it creates a parent with two children and validates all three with strict gates | Run the test: `vitest run scaffold-passes-its-own-gate.vitest.ts` and inspect output for --phase case. Observed: the file shows 6 passed, including `a phase parent and its children, untouched, report no errors`, which creates a parent with two children and validates all three; rerun for this closeout, 6 passed. With HEAD create.sh the case fails. Cited: `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts:82` (the case). | Met | - |
| AC-005 | REQ-005 | Given the spec-kit test suite, When all tests are run, Then no new test failures are introduced | Run the full suite: `npm test` in the spec-kit directory. Observed: wave 1 final gate: `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` rc 0, vitest 162 files passed and 3 skipped, 1648 tests passed and 19 skipped, 0 failed (baseline at c85ec7f8803: 161 files, 1639 passed); `run check` rc 0. The run covers the whole wave, not this phase alone. Cited: `.skilled/skills/system-spec-kit/runtime/cli/package.json:19` (the suite command). | Met | - |

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

All five criteria are Met with observed evidence: the phase scaffold and both children pass `validate.sh --strict`, `children_ids` lists both children, the vitest phase case passes, and the wave 1 suite run shows 0 failed. Nothing was waived, so the decision record carries no closure ADR.
<!-- /ANCHOR:closure -->
