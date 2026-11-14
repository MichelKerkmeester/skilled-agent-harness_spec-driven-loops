---
title: "Acceptance Criteria: Phase 6: record-without-handoff"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "record without handoff acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/006-record-without-handoff"
    last_updated_at: "2026-11-14T06:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met from the saved test runs, the fix commit and the suite reruns"
    next_safe_action: "None. Not merged or pushed, which the operator decides"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-record-without-handoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: record-without-handoff

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-record-without-handoff
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
| AC-001 | REQ-001 | Given a record file that parses but holds no `handoff`, When `readRelaunchFile` reads it, Then it returns null and logs exactly one `corrupt-relaunch-file loop=<id>` line | `scratch/red.txt` shows the read test failing before the edit with the record returned where null was expected, and `scratch/green.txt` shows it passing after. Cited: `scratch/red.txt:3`, `scratch/red.txt:71`, `scratch/green.txt:3`. The branch is `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1268` in the fix commit | Met | - |
| AC-002 | REQ-002 | Given a pending record with no `handoff`, When a question dialog is asked or Stop runs, Then the guard stays silent and Stop leaves the record unchanged and starts no killer | `scratch/red.txt` shows the guard test failing with a denial naming `undefined`, and the Stop test failing with the record moved to `armed`. `scratch/green.txt` shows both passing after. Cited: `scratch/red.txt:6`, `scratch/red.txt:34`, `scratch/red.txt:81`, `scratch/green.txt:6`, `scratch/green.txt:2` | Met | - |
| AC-003 | REQ-003 | Given a record whose `handoff` is an empty string, When it is read, Then it comes back unchanged, and `shouldRelaunch` still declines a record with no handoff or no cwd | Both tests pass before and after the edit, because they guard behavior that already held. Cited: `scratch/red.txt:4`, `scratch/red.txt:5`, `scratch/green.txt:4`, `scratch/green.txt:5`. The decline is `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1334` in the fix commit | Met | - |
| AC-004 | REQ-004 | Given the fix commit, When it is inspected, Then it adds no module and no relaunch record key | `git show --stat f4cf59b93f` lists seven files and `git show f4cf59b93f \| grep -c '^new file'` prints 0. Observed 2026-11-14. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1268` | Met | - |
| AC-005 | REQ-005 | Given the final state, When the relaunch, OpenCode plugin and Pi suites run, Then each passes | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exited 0 with tests 1548, pass 1548 and fail 0 on 2026-11-14 on the merged tree `be56fabc7b`. The 3 failures in an earlier run came from several agents running the suite at the same time. On 2026-11-14 the same suite with nothing else running passed 1548 of 1548, exit 0, on the merged tree `be56fabc7b`, and 1550 of 1550, exit 0, after children 012 and 013. The fix commit message records 1543 of 1543, from 1539 before. The Pi run printed `Tests  62 passed (62)` with exit 0. The suite and Pi outputs were not saved in the packet. Cited: `scratch/green.txt:7`, `scratch/green.txt:10` for the five-test pattern | Met | - |
| AC-006 | REQ-006 | Given the session-relaunch README, When it is searched, Then it states the missing-field case and the empty-string case | `rg -n 'holds no .handoff. string' .skilled/hooks/session-relaunch/README.md` prints one line on 2026-11-14. Cited: `.skilled/hooks/session-relaunch/README.md:241` | Met | - |

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
