---
title: "Acceptance Criteria: Phase 2: state-dir-read-check"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "state dir read check acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/002-state-dir-read-check"
    last_updated_at: "2026-11-12T08:28:54Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-state-dir-read-check"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: state-dir-read-check

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `002-state-dir-read-check`
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
| AC-001 | REQ-001 | Given a state directory that is a symlink or is owned by another account with a planted record, When `readRelaunchFile` runs, Then it returns null and logs the refusal | `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with the symlinked-directory and foreign-owner cases passing Observed 2026-11-12: `readRelaunchFile reads no record from a symlinked state directory` passes in `scratch/green.txt` and covers the symlink, the foreign owner and the missing directory. It failed before the fix in `scratch/red.txt`. Source: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:867` and `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1077`. | Met | - |
| AC-002 | REQ-002 | Given a relaunch record whose `handoff` names a note outside the handoffs directory, When `consume` runs, Then it refuses the path before reading the note | `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with the outside-handoff case passing Observed 2026-11-12: `consume refuses a handoff outside the handoffs directory` passes in `scratch/green.txt` and failed before the fix in `scratch/red.txt`. Source: `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1916` and `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:770`. | Met | - |
| AC-003 | REQ-003 | Given a real state directory owned by the current account, When every existing caller reads a record, Then the signature and record shape stay the same | `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 Observed 2026-11-12: both files exit 0 inside the 369-test run in `scratch/green.txt`, and `rg -n 'function readRelaunchFile' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints `function readRelaunchFile(loopId, env = process.env)`. Source: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1075`. | Met | - |
| AC-004 | REQ-004 | Given a symlinked state directory that holds a planted nudge state file, When the nudge reads its state, Then it reads level 0 and no grant | `node --test --test-name-pattern 'nudge state file behind a symlinked state directory' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 Observed 2026-11-12: `a nudge state file behind a symlinked state directory reads as empty` passes in `scratch/green.txt` and failed before the fix in `scratch/red-2.txt`. Source: `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:780` and `.skilled/hooks/session-relaunch/lib/nudge.cjs:630`. | Met | - |

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

All four criteria are Met with observed evidence from `scratch/green.txt`, `scratch/green-full.txt` and `scratch/green-opencode.txt`. The evidence is pinned to the diff range `5dafa313e8..working tree`, because nothing is committed without the operator.
<!-- /ANCHOR:closure -->
