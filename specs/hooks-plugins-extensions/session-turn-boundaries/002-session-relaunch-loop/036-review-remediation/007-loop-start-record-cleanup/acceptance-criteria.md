---
title: "Acceptance Criteria: Phase 7: loop-start-record-cleanup"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "loop start record cleanup acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/007-loop-start-record-cleanup"
    last_updated_at: "2026-11-12T08:28:59Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-loop-start-record-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: loop-start-record-cleanup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 007-loop-start-record-cleanup
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
| AC-001 | REQ-001 | Given a state directory that already holds `relaunch-<pid>.json` for the wrapper's own process id, When the wrapper starts its first launch, Then that record is gone before the runtime runs | `node --test --test-name-pattern 'own leftover relaunch record' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0` Observed 2026-11-12: `wrapper removes its own leftover relaunch record before the first launch` reported pass 1 and fail 0, as `# pass 1` and `# fail 0` with the tap reporter, and failed before the fix in `scratch/red.txt`. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1323` and `.skilled/bin/skilled-loop:1062`. | Met | - |
| AC-002 | REQ-002 | Given a state directory holding the wrapper's own record and `relaunch-999999.json`, When the wrapper starts, Then only the record named by the wrapper's process id is removed | `node --test --test-name-pattern 'record for another loop is kept' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0` Observed 2026-11-12: `a leftover relaunch record for another loop is kept` reported pass 1 and fail 0, as `# pass 1` and `# fail 0` with the tap reporter. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1344` and `.skilled/bin/skilled-loop:1059`. | Met | - |
| AC-003 | REQ-003 | Given the whole wrapper suite, When it runs after the change, Then every existing case still passes | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and prints `# fail 0` Observed 2026-11-12: the file ran 184 tests with 184 pass and 0 fail, exit 0, in `scratch/green.txt`. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1367` and `.skilled/bin/skilled-loop:1055`. | Met | - |

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

All three criteria are Met with observed evidence from `scratch/green.txt`, `scratch/green-full.txt` and `scratch/green-opencode.txt`. The evidence is pinned to the diff range `5dafa313e8..working tree`, because nothing is committed without the operator.
<!-- /ANCHOR:closure -->
