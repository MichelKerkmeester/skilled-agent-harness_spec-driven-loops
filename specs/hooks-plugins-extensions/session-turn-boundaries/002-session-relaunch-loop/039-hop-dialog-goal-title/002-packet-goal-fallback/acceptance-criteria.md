---
title: "Acceptance Criteria: Phase 2: packet-goal-fallback"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "packet goal fallback acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback"
    last_updated_at: "2026-11-13T19:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met from the test runs, the commit and the code"
    next_safe_action: "None. Merged into main and pushed on 2026-11-13"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs", ".skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-packet-goal-fallback"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: packet-goal-fallback

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 002-packet-goal-fallback
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Claude log read whole with no goal entry, When `resolveGoalPacket` runs, Then it returns the nearest packet in the lineage with a settable unfinished goal | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exited 0 with `pass 159` and `fail 0` on the rerun of 2026-11-13, and `scratch/red.txt` shows the fallback test failing first with `pass 11` and `fail 1`. Cited: `scratch/red.txt:8`, `scratch/red.txt:26`, `scratch/green.txt:147`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2754` | Met | - |
| AC-002 | REQ-002 | Given a met, failed or cleared goal entry or an active goal no packet carries, When `resolveGoalPacket` runs, Then it returns no packet | The test `resolveGoalPacket leaves an ended or unreadable Claude goal uncarried` passes in the AC-001 run. Cited: `scratch/green.txt:148`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2799` | Met | - |
| AC-003 | REQ-003 | Given a log longer than the 16 MB tail cap with no goal entry, When `resolveGoalPacket` runs, Then it returns no packet | The assertion `a log read only in part` passes in the AC-001 run. The orchestrator reported that removing `if (!whole) return none;` makes it fail. This author did not rerun the mutation. Cited: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2825`, `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:654`. Note of 2026-11-14: the rule was true when written and is no longer the rule. The phase that owns the reader now scans the earlier bytes when the capped tail holds no goal entry, reports the read as whole, and reaches the fallback, so no saved run can prove this row. See `decision-record.md` ADR-001. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:635` | Superseded | ADR-001 |
| AC-004 | REQ-004 | Given a finished goal, a goal with no criteria, an open box only in the log, an over-budget slice or a leaf phase goal, When the fallback runs, Then that packet is skipped | The fallback test asserts each case and passes in the AC-001 run. `packetGoalIsSettable` requires `budgetState === 'ok'` and an open criterion in the durable slice. Cited: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2793`, `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:608` | Met | - |
| AC-005 | REQ-005 | Given commit `c461b79a71`, When it is inspected, Then no file is created and no relaunch record code changes | `git show --summary --format= c461b79a71 \| rg 'create mode'` printed nothing, and `git show c461b79a71 -- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs \| rg '^[+-]' \| rg -i 'record\|relaunchFile'` printed nothing, both on 2026-11-13. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:603` | Met | - |
| AC-006 | REQ-006 | Given a Claude sender with no goal and an open packet goal, When `prepare` runs and runs again after every criterion is ticked, Then the note gains `goal_packet` and then loses it | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'prepare gives a Claude sender with no goal' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exited 0 with `pass 1` on 2026-11-13. No run before the source edit is saved. Cited: `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2740` | Met | - |
| AC-007 | REQ-007 | Given the final worktree state, When the four suites run, Then each exits 0 | The orchestrator ran `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` with exit 0 and 1536 of 1536, the goal hook suites with exit 0 and 200 of 200 and `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` with 62 of 62. No output of these runs is saved in this packet. Cited: `scratch/green.txt:162`. Note of 2026-11-14: `023-epic-review-doc-fixes/scratch/final-suite.txt` holds a rerun of the same suite on the final tree, with tests 1555, pass 1555, fail 0 and exit 0 | Met | - |
| AC-008 | REQ-008 | Given the session-relaunch README, When it is searched, Then it states the fallback and the cases that leave the field out | `rg -n 'A leaf phase goal has no slice budget and gives way to its parent\|never had a goal set also leaves it out' .skilled/hooks/session-relaunch/README.md` printed two lines on 2026-11-13. Cited: `.skilled/hooks/session-relaunch/README.md:180`, `.skilled/hooks/session-relaunch/README.md:307` | Met | - |

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

Every row is `Met` or `Superseded`. AC-003 is `Superseded` by ADR-001, which records what was true when the row was written and names the phase that now holds the replacement rule. No row asks for a live hop, and that gap is a Known Limitation in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
