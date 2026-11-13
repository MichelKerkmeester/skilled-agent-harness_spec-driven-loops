---
title: "Acceptance Criteria: Phase 10: fanout-orphan-liveness"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fanout orphan liveness acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness"
    last_updated_at: "2026-11-13T10:03:41Z"
    last_updated_by: "implementer"
    recent_action: "Recorded observed evidence for all nine criteria"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-fanout-orphan-liveness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should a re-run refused by a reused pid have an override? Answer: no; the refusal names the label and the pid."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 10: fanout-orphan-liveness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 010-fanout-orphan-liveness
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Every `npx vitest` command runs from `.skilled/skills/system-deep-loop/runtime`. `PH` is the phase folder `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness`.

Changed files: `fanout-pool.cjs`, `fanout-run.cjs`, `tests/unit/fanout-pool.vitest.ts` and `tests/stress/cli-adapter/fanout.vitest.ts`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the unchanged source and a `timeout` shim lineage whose runner was killed with SIGKILL, When the same fan-out command runs again, Then two shim pids for one label both answer signal 0 and the ledger holds one `orphan_requeued` row | `node PH/scratch/repro-double-writer.cjs > PH/scratch/repro.txt`, then `rg -c 'alive=true' PH/scratch/repro.txt` prints 2 and `rg -c 'orphan_requeued' PH/scratch/repro.txt` prints 1. Observed 2026-11-13: prints 2 and 1. | Met | - |
| AC-002 | REQ-002 | Given a lineage that has spawned, When the ledger is read, Then it holds one `spawned` row with that label, its attempt and the shim pid | Test `refuses a re-run while a lineage from the earlier run is alive` asserts the row: `npx vitest run --no-coverage tests/stress/cli-adapter/fanout.vitest.ts -t 'refuses a re-run'` exits 0. Observed 2026-11-13: `Test Files 1 passed`, `Tests 1 passed`. | Met | - |
| AC-003 | REQ-003 | Given an injected `kill` that throws `ESRCH`, throws `EPERM` or returns, When `isLineageAlive` is called, Then it returns `false`, `true` and `true`, and `false` for a pid of `0` or `'x'` | `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts -t 'isLineageAlive reads ESRCH'` exits 0. Observed 2026-11-13: `Tests 1 passed`. | Met | - |
| AC-004 | REQ-004 | Given ledger rows with one open label whose `spawned` pid is alive, one retried label whose latest `spawned` pid is alive, and one closed label, When `detectLiveLineages` runs, Then it returns the two open live labels with their latest pids | `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts -t 'detectLiveLineages returns'` exits 0. Observed 2026-11-13: `Tests 1 passed`. | Met | - |
| AC-005 | REQ-005 | Given a real detached child with `started` and `spawned` rows, When `markOrphanedLineages` runs, Then it returns `[]` and the ledger gains no `orphan_requeued` row | `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts -t 'leaves a live lineage unmarked'` exits 0. Observed 2026-11-13: `Tests 1 passed`. | Met | - |
| AC-006 | REQ-006 | Given a live shim lineage from a killed runner, When the same fan-out command runs again, Then it exits 3 with a JSON error naming the label and pid, the shim captures stay at 1, and no `orphan_requeued` row is written | `npx vitest run --no-coverage tests/stress/cli-adapter/fanout.vitest.ts -t 'refuses a re-run'` exits 0. Observed 2026-11-13: `Tests 1 passed`. | Met | - |
| AC-007 | REQ-007 | Given a lineage whose spawned child has exited, or a ledger with no `spawned` row, When `markOrphanedLineages` runs, Then the label is requeued as today, and the three existing orphan tests keep their assertions | `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts -t 'spawned pid has exited\|no spawned record\|orphan_requeued\|without terminal ledger events'` exits 0. Observed 2026-11-13 with the pipes unescaped, as vitest reads the pattern: `Tests 5 passed`. | Met | - |
| AC-008 | REQ-008 | Given the finished change, When the named suites run, Then all pass | `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/observability-events.vitest.ts tests/stress/cli-adapter/fanout.vitest.ts` exits 0, and `tests/unit/fanout-pool.vitest.ts` reports `42 passed`. Observed 2026-11-13: `Test Files 4 passed`, `Tests 248 passed \| 1 skipped (249)`, `fanout-pool` alone `42 passed`. | Met | - |
| AC-009 | REQ-006 | Given the finished change, When the reproduction runs again, Then one shim pid is alive, the second runner exits 3 and no `orphan_requeued` row is written | `node PH/scratch/repro-double-writer.cjs > PH/scratch/repro-after.txt`, then `rg -c 'alive=true' PH/scratch/repro-after.txt` prints 1, `rg -n 'second runner exit=3' PH/scratch/repro-after.txt` prints 1 line and `rg -c 'orphan_requeued' PH/scratch/repro-after.txt` prints 0. Observed 2026-11-13: prints 1, one line and 0. | Met | - |

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

Every criterion is `Met` with observed evidence dated 2026-11-13. The two scratch
reproductions show the double writer before the change and the exit-3 refusal after it,
and the named suites pass.
<!-- /ANCHOR:closure -->
