---
title: "Acceptance Criteria: Phase 19: dsh-single-executor-hardening"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dsh single executor hardening acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening"
    last_updated_at: "2026-11-14T14:50:00Z"
    last_updated_by: "orchestrator-worker"
    recent_action: "Met every criterion with observed evidence"
    next_safe_action: "None. The phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-019-dsh-single-executor-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 19: dsh-single-executor-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `019-dsh-single-executor-hardening`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a harness dispatch, When `dispatchEnv` holds `PATH`, Then the runner throws before a receipt file exists, and with only its four keys the child sees all four | E13 receipts test in T015. Observed: the `PATH` case throws `dispatchEnv key PATH is not allowed for cli-deepseek-harness` with no intent or completion receipt, and the existing receipts test shows the child reading all four keys | Met | - |
| AC-002 | REQ-001 | Given another CLI kind, When `dispatchEnv` holds any key, Then the runner throws | E13 receipts test in T015. Observed: `cli-codex` with `PATH` throws `dispatchEnv key PATH is not allowed for cli-codex` and the state log stays empty | Met | - |
| AC-003 | REQ-002 | Given a `:confirm` workflow, When the executor kind has no branch there, Then `unsupported_executor_guard` halts with exit 2 and names `:auto` | E13 contract test in T015. Observed: both `:confirm` files hold the guard with `skip_when` on the three branched kinds, `exit_code: 2`, `halt: true` and a message naming `:auto` | Met | - |
| AC-004 | REQ-003 | Given the YAML edits, When the contracts are regenerated, Then `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3` and the named suites print `16 passed (16)` | T009 and T015 output. Observed: `[CONTRACT DRIFT] OK commands=3`, a fresh compile of all three contracts is byte-identical to the committed files, and the named suites print `17 passed (17)`. The extra test is the `0 bytes` edge case | Met | - |
| AC-005 | REQ-004 | Given a temp folder with a 25-hour default home, a 1-hour default home, a 25-hour named home and a link, When the sweep runs, Then only the first is removed | E13 fan-out test in T016. Observed: the sweep returns only `dsh-home-AbC123`, and the young home, the named home, the link and its 25-hour target all remain | Met | - |
| AC-006 | REQ-005 | Given a child that prints 4096 bytes, When `echoStdout` is false, Then stdout is empty, stderr names `4096 bytes` and `completionCheck` reads the whole stream | E13 receipts test in T015. Observed: stdout empty, stderr holds `child stdout 4096 bytes, not echoed` and `completionCheck` read 4096 characters. An empty stream logs `0 bytes` | Met | - |
| AC-007 | REQ-006 | Given one id at lines 27 and 24 with one file and title, When the reducer runs, Then the registry holds one row, and a reused id with another title holds two | E13 reducer test in T016. Observed: `folds a moved line into the first row and keeps a reused id with another title` passes after the edit and fails on the start code | Met | - |
| AC-008 | REQ-007 | Given four seeded dimensions and the four leaf ids from the live run, When they are upserted, Then the graph holds four DIMENSION nodes and the convergence script prints `"dimensionCoverage":1` | E13 upsert test in T016. Observed: four DIMENSION nodes and `dimensionCoverage` 1 from the read-only convergence run. The test fails on the start code | Met | - |
| AC-009 | REQ-008 | Given the changelog and version edits, When the operator commits, Then the four files read `1.6.26.0` and the route guard prints `system-deep-loop            fresh` | T012 and T018 output. Observed: `rg -l '1\.6\.26\.0'` lists the four files and the changelog, `1.6.25.0` counts nothing in them, and after the manifest refresh the guard prints `system-deep-loop            fresh` with exit 0 | Met | - |
| AC-010 | REQ-009 | Given the operator's C6 answer, When the phase closes, Then the chosen option's test passes or `goal.md` records the deferral and its reason | T014 evidence. Observed: `goal.md` section 4 records that the operator deferred C6 and why the state log still lacks executor identity | Met | - |
| AC-011 | REQ-003 | Given all edits, When the full suite and typecheck run, Then only the known `fanout-pool.vitest.ts` timing test fails and typecheck exits 0 | T017 output. Observed: `2899 passed` plus 4 socket-path failures caused by the long private TMPDIR. Those four files pass `13 passed (13)` with the default TMPDIR, so the suite is 2903 passed and 8 skipped of 2911, up from 2894 of 2902. The `fanout-pool.vitest.ts` timing test passed. Typecheck exits 0 | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes.
<!-- /ANCHOR:closure -->
