---
title: "Acceptance Criteria: Phase 11: goal-fallback-bound"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal fallback bound acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/011-goal-fallback-bound"
    last_updated_at: "2026-11-14T07:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met from the saved test runs, the commit and the greps"
    next_safe_action: "None. Not merged or pushed, per the parent decision that nothing lands without the operator"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-goal-fallback-bound"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 11: goal-fallback-bound

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 011-goal-fallback-bound
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
| AC-001 | REQ-001 | Given a Claude log with no goal entry and the only open packet goal two levels above the note's folder, When `resolveGoalPacket` runs, Then it returns no packet, and it returns the goal when that packet is the parent of the note's folder | `scratch/red.txt` shows the new test failing before the edit with `the only open goal is two levels up` and `specs/hooks/023-session-relaunch-loop` where an empty string was expected, and `scratch/green.txt` shows it passing after. Cited: `scratch/red.txt:3`, `scratch/red.txt:17`, `scratch/green.txt:3`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2828` | Met | - |
| AC-002 | REQ-001 | Given the existing fallback test, When the two tests the name pattern selects run after the edit, Then both pass | `scratch/green.txt` prints `✔` for both tests with `ℹ tests 2`, `ℹ pass 2` and `ℹ fail 0`. Cited: `scratch/green.txt:2`, `scratch/green.txt:3`, `scratch/green.txt:6`, `scratch/green.txt:7` | Met | - |
| AC-003 | REQ-002 | Given the edited resolver, When the active-goal branch is read, Then it still takes the whole lineage and the packets the goal names | `rg -n 'lineage, \.\.\.named' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints `const candidates = [...lineage, ...named].slice(0, GOAL_LOG_MAX_CANDIDATES);` on 2026-11-14, and the diff of `eba587cae7` changes only the hunk at line 672. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:692` | Met | - |
| AC-004 | REQ-003 | Given the final state, When the relaunch and OpenCode plugin suites run, Then they pass with one more test than before | The commit message of `eba587cae7` records 1548 of 1548 from 1547 before, and the parent goal log records the same count after the last child. The run is the orchestrator's and has no saved output. On 2026-11-14 the same suite with nothing else running passed 1548 of 1548, exit 0, on the merged tree `be56fabc7b`, and 1550 of 1550, exit 0, after children 012 and 013. The earlier 3 failures came from several agents running the suite at the same time, and none of them touched `relaunch-core.test.cjs`. Cited: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/011-goal-fallback-bound/tasks.md:67`. Note of 2026-11-14: `023-epic-review-doc-fixes/scratch/final-suite.txt` holds the whole suite on the final tree, with tests 1555, pass 1555, fail 0 and exit 0. The 1550 of 1550 above stays as the count at the earlier tree | Met | - |
| AC-005 | REQ-004 | Given the session-relaunch README, When it is searched, Then the Claude row states the bound | `rg -n 'no packet further up' .skilled/hooks/session-relaunch/README.md` prints one line on 2026-11-14, and the row reads "the spec folder first and then its parent and no packet further up". Cited: `.skilled/hooks/session-relaunch/README.md:182` | Met | - |
| AC-006 | REQ-005 | Given the fix commit, When it is inspected, Then it adds no file, no module and no record key | `git show --stat eba587cae7` lists three files with 30 insertions and 2 deletions, and `git show eba587cae7 \| rg -c '^new file'` prints nothing with exit 1. The changed source parses: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exited 0 on 2026-11-14. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:678` | Met | - |

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
