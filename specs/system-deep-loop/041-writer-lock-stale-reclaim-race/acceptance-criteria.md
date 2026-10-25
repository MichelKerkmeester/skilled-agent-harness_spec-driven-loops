---
title: "Acceptance Criteria: Fix the stale-lock reclaim race in the shared deep-loop writer lock"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "writer lock stale reclaim race acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/041-writer-lock-stale-reclaim-race"
    last_updated_at: "2026-10-25T07:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the Unmet acceptance criteria for the planned fix"
    next_safe_action: "Run tasks T001 to T005: save the baselines and reproduce before any lock change"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-writer-lock-stale-reclaim-race"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Fix the stale-lock reclaim race in the shared deep-loop writer lock

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/041-writer-lock-stale-reclaim-race
**Level:** 2
**Status:** Planned
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

In the Verification cells, `RT` is `.skilled/skills/system-deep-loop/runtime` and the vitest commands run from inside `RT`. `<base>` and `<fix-sha>` are the commits the fix is measured between.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the unchanged lock code, When the R1 reproduction runs (the lock file vanishes after the failed open and a peer creates a fresh lock), Then it fails because the writer acquires while the peer's fresh lock is deleted | `npx vitest run --no-coverage tests/unit/cli-guards-writer-lock.vitest.ts` on the unchanged `cli-guards.cjs` reports the R1 test failed, saved in `scratch/repro-before.txt` | Unmet | - |
| AC-002 | REQ-001 | Given the unchanged lock code, When the R5 reproduction runs (a stale body is judged and a peer swaps in a fresh lock before the removal), Then it fails the same way | The same command reports the R5 test failed, saved in `scratch/repro-before.txt` | Unmet | - |
| AC-003 | REQ-001 | Given the reproductions and the plain and widened 200-round loops have run on the unchanged code, When the cause status in `plan.md` is read, Then it is CONFIRMED, DEFECT-ONLY or REFUTED rather than INFERRED, and a REFUTED verdict left the lock unchanged | `rg -n "Cause status" specs/system-deep-loop/041-writer-lock-stale-reclaim-race/plan.md` shows a label other than INFERRED, and `scratch/stress-before.txt` and `scratch/stress-before-widened.txt` each end with `rounds=200 failures=N` | Unmet | - |
| AC-004 | REQ-002 | Given the fixed lock, When R1 and R5 run, Then both tests pass: the peer's lock survives with its own nonce on disk and the reclaiming writer does not acquire while the peer holds it | The same vitest command reports both tests passed, saved in `scratch/repro-after.txt` | Unmet | - |
| AC-005 | REQ-002 | Given the fixed lock, When the CI case runs 200 times plain and 200 times widened, Then no round loses a record | `tail -n 1 scratch/stress-after.txt scratch/stress-after-widened.txt` reads `rounds=200 failures=0` for both | Unmet | - |
| AC-006 | REQ-002 | Given the finished change, When the diff of `cli-guards.cjs` is read, Then it adds no retry, sleep or loosened check, and the reclaim removes only the file it judged stale | `git diff -U0 <base> <fix-sha> -- RT/scripts/lib/cli-guards.cjs` read in full: its added lines contain no call to `sleepSync`, `setTimeout` or `Atomics.wait`, and the reclaim removes only a file it judged stale | Unmet | - |
| AC-007 | REQ-003 | Given the 6 lock tests and the 12 jsonl-repair tests, When they run after the fix, Then all pass and `jsonl-repair.vitest.ts` is unedited | `npx vitest run --no-coverage tests/unit/cli-guards-writer-lock.vitest.ts tests/unit/jsonl-repair.vitest.ts` reports 0 failed and at least 18 passed, and `git diff --stat <base> <fix-sha> -- RT/tests/unit/jsonl-repair.vitest.ts` prints nothing | Unmet | - |
| AC-008 | REQ-003 | Given the full runtime suite, When it runs after the fix, Then it has 0 failed tests and no fewer passed tests than the baseline | `npm --prefix .skilled/skills/system-deep-loop/runtime test` totals compared with `scratch/base-suite.txt` | Unmet | - |
| AC-009 | REQ-004 | Given the finished change, When the changed files are listed, Then only `cli-guards.cjs`, the lock test file and files in this packet appear, and the constants block and the `module.exports` block of `cli-guards.cjs` are unchanged | `git diff --name-only <base> <fix-sha>` lists those files only, and the full diff of `cli-guards.cjs` shows no hunk in the constants near the top or the export block at the end | Unmet | - |

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

Nothing is built yet, so all nine criteria are Unmet. This statement is rewritten when the packet closes, naming the criteria that carried it and anything consciously left out.
<!-- /ANCHOR:closure -->
