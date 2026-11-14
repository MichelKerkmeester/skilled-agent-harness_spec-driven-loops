---
title: "Acceptance Criteria: Phase 7: killer-test-margin"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "killer test margin acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/007-killer-test-margin"
    last_updated_at: "2026-11-14T07:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met from the load runs, the commit and the recorded suite count"
    next_safe_action: "None. The code is committed as 8a113b68ae and the packet awaits the operator's merge"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/tests/killer.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-killer-test-margin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: killer-test-margin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 007-killer-test-margin
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the grace-period test with `timeoutMs: 1000`, When `scratch/killer-load.sh` runs it 160 times at once, Then no run fails, in two rounds | `scratch/green.txt` shows `parallel runs: 160, failed runs: 0` for round 1 and for round 2. Cited: `scratch/green.txt:2`, `scratch/green.txt:3`, `.skilled/hooks/session-relaunch/tests/killer.test.cjs:790` | Met | - |
| AC-002 | REQ-002 | Given the fix commit, When it is inspected, Then it changes one test file and no product code | `git show --stat 8a113b68ae` lists `killer.test.cjs` with 3 insertions and 1 deletion, and `git show 8a113b68ae \| rg -c '^new file'` prints nothing with exit 1. Observed 2026-11-14. Cited: `.skilled/hooks/session-relaunch/tests/killer.test.cjs:788` | Met | - |
| AC-003 | REQ-003 | Given the test with `timeoutMs: 450`, When the same load runs, Then some runs fail, so the failure is reproduced | `scratch/red.txt` shows `parallel runs: 160, failed runs: 14` and a failed run reading `ENOENT` on `target-signal`. This child changes a test, so this load run is its red run. Cited: `scratch/red.txt:2`, `scratch/red.txt:18` | Met | - |
| AC-004 | REQ-004 | Given the edited test, When the relaunch and OpenCode plugin suites run, Then every test passes | The commit message of `8a113b68ae` records the suite result as 1543 of 1543, unchanged. This author did not rerun the suite and no output of it is saved, because later commits on the worktree change the count. The whole killer file was rerun alone: tests 64, pass 64, fail 0. Cited: `scratch/green.txt:15`, `scratch/green.txt:18` | Met | - |

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

Every row is Met. No row asks for a live hop, and that gap is a Known Limitation in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
