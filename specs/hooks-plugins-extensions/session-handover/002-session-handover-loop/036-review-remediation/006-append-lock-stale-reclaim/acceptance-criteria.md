---
title: "Acceptance Criteria: Phase 6: append-lock-stale-reclaim"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "append lock stale reclaim acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/006-append-lock-stale-reclaim"
    last_updated_at: "2026-11-12T08:28:58Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-append-lock-stale-reclaim"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: append-lock-stale-reclaim

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-append-lock-stale-reclaim
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a waiter that finds one stale append lock, When it reclaims the lock, Then it holds the reclaim directory, reads the lock's age again and removes the lock only when it is still stale | `rg -c 'const reclaimPath' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 1 Observed 2026-11-12: the count command printed 1, and the reclaim reads the age again at the cited line. Source: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1442` and `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1456`. | Met | - |
| AC-002 | REQ-002 | Given two waiters, and then eight waiters, that meet one stale append lock, When all attempt the reclaim, Then they never hold the lock at the same time | `node --test --test-name-pattern 'waiters never hold the append lock together' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with two passing cases Observed 2026-11-12: the pattern ran 2 cases with 2 pass and 0 fail. The eight-waiter case failed before the fix in `scratch/red-2.txt`. Source: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2204` and `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2299`. | Met | - |
| AC-003 | REQ-003 | Given the wait bound, When the lock is not acquired within `APPEND_LOCK_WAIT_MS`, Then the bound is still 2000 ms and the fallback still runs `fn` | `rg -n 'APPEND_LOCK_WAIT_MS = 2000' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints one line Observed 2026-11-12: the command printed one line, and the fallback after the loop is unchanged. Source: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:26` and `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1430`. | Met | - |
| AC-004 | REQ-004 | Given the lock path, When the module is searched for its removal, Then the only two `rmdirSync(lockPath)` calls are the reclaim under the reclaim directory and the release inside the held block | `rg -c 'rmdirSync\(lockPath\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 2 Observed 2026-11-12: the count command printed 2, the reclaim removal and the release. Source: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1457` and `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1483`. | Met | - |
| AC-005 | REQ-005 | Given a state directory that is a symlink, When `withStateLock` runs for a record path inside it, Then no `.lock` directory appears behind the symlink and the callback still runs, and `withAppendLock` in a linked directory still takes its lock | `node --test --test-name-pattern 'unsafe state directory gets no lock directory' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 Observed 2026-11-12: `an unsafe state directory gets no lock directory` and `arm takes no lock in an unsafe state directory` pass in `scratch/green.txt` and failed before their fixes in `scratch/red.txt` and `scratch/red-3.txt`. Source: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2370` and `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1504`. | Met | - |

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

All five criteria are Met with observed evidence from `scratch/green.txt`, `scratch/green-full.txt` and `scratch/green-opencode.txt`. The evidence is pinned to the diff range `5dafa313e8..working tree`, because nothing is committed without the operator.
<!-- /ANCHOR:closure -->
