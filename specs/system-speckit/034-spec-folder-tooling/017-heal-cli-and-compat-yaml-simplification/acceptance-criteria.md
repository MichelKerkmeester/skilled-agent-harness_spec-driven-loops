---
title: "Acceptance Criteria: Phase 17: heal-cli-and-compat-yaml-simplification"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "heal cli and compat yaml simplification acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/017-heal-cli-and-compat-yaml-simplification"
    last_updated_at: "2026-10-09T14:34:00Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion Met with its evidence"
    next_safe_action: "None, the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 17: heal-cli-and-compat-yaml-simplification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification
**Level:** 2
**Status:** Complete
**Date:** 2026-10-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a packet whose lane modes refuse in two or more modes across two or more documents, When `upgrade-legacy --apply` writes its baseline, Then `refusals` lists them by mode order, then document, then reason, exactly as the test's literal array | Observed: the case at `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1293` passes (`scratch/mutation-results.txt:1`) and fails under each of the five sort mutations (`scratch/mutation-results.txt:3`, `scratch/mutation-results.txt:4`, `scratch/mutation-results.txt:5`, `scratch/mutation-results.txt:6` and `scratch/mutation-results.txt:7`). Commit c98cfc2682 | Met | - |
| AC-002 | REQ-002 | Given the lane-mode CLI, When its source is searched, Then it parses no `--mode`, and `runLaneModes(packet, { modes: ['anchor-wrap'] })` still runs only that mode | Observed: a search of `heal-spec-docs.cjs` for `--mode` finds nothing (`scratch/recheck.txt:11`) where the base commit had it (`scratch/recheck.txt:15`), and the two changed vitest files pass (`scratch/vitest-two-summary.txt:2`). Commit d4221e892f | Met | - |
| AC-003 | REQ-003 | Given a scratch copy of the corpus, When the lane modes run twice from plain output, Then pass 2 prints no `applied` line, its `refused` lines equal pass 1's, and the copies' SHA-256 is unchanged | Observed: the copy held 42403 `.md` files (`scratch/corpus-summary.txt:1`). Pass 1 applied 264 and refused 132 (`scratch/corpus-summary.txt:3`). Pass 2 applied 0 and refused 132 (`scratch/corpus-summary.txt:4`), the two refused sets are equal (`scratch/corpus-summary.txt:6`) and the copy hashes are unchanged (`scratch/corpus-summary.txt:7`) | Met | - |
| AC-004 | REQ-003 | Given AC-003 is Met, When the lane-mode CLI source is searched, Then it has no `--json` branch, and a dry run still writes nothing | Observed: the same search finds no `--json` in `heal-spec-docs.cjs` (`scratch/recheck.txt:11`) where the base commit had it (`scratch/recheck.txt:14`). The case at `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:567` passes (`scratch/vitest-two-summary.txt:2`) and asserts the packet is unchanged after a dry run. Commit d4221e892f | Met | - |
| AC-005 | REQ-004 | Given the compat action, When `phase_4_move` is read, Then it has no `step_failure` key, and `on_step_failure` carries step-failed, STATUS=FAILED, step id, argv, exit code, run no further step, Never retry a step automatically and Compatibility rollback block | Observed: `.skilled/commands/doctor/assets/doctor-update-compat-action.yaml:125` holds the one key, and the test at `.skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs:824` asserts `step_failure` is undefined and reads every phrase from `on_step_failure`. The doctor test passes 21 of 21 (`scratch/doctor-summary.txt:3`). Commit 26179f4be7 | Met | - |
| AC-006 | REQ-005 | Given the finished change, When the repo outside `specs/` is searched for the removed flags and field, Then every remaining hit belongs to another tool | Observed: no tracked file outside `specs/` names `--lane-modes` with a removed flag (`scratch/recheck.txt:31`), where the base commit has three such lines (`scratch/recheck.txt:33`). The only `step_failure` mention left is the doctor test's assertion that the key is undefined (`scratch/recheck.txt:37`) | Met | - |
| AC-007 | REQ-006 | Given T001's counts, When the CLI suite reruns, Then it shows no failure beyond them | Observed: before the change the CLI suite passed 1775 tests with 19 skipped (`scratch/baseline-summary.txt:3`). After it the suite passed 1776 with 19 skipped (`scratch/cli-summary.txt:2`). Neither run has a failure | Met | - |

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

All seven criteria are Met, each with output that was read, and the three code commits (c98cfc2682, d4221e892f and 26179f4be7) carry the change. The one finding left open is outside this packet: the CLI suite creates transient folders in the real `specs/` root while it runs, and `implementation-summary.md` records it under known limitations.
<!-- /ANCHOR:closure -->
