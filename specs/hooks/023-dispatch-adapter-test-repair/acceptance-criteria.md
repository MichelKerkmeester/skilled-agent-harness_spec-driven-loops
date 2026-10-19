---
title: "Acceptance Criteria: Document the owning runner for the dispatch adapter vitest suites"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dispatch adapter test repair acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-dispatch-adapter-test-repair"
    last_updated_at: "2026-10-19T12:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Met all four criteria with observed evidence"
    next_safe_action: "Packet closed. Pushing the branch waits for the operator"
    blockers: []
    key_files:
      - ".skilled/hooks/dispatch/README.md"
      - ".skilled/hooks/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hooks-023-dispatch-adapter-test-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Document the owning runner for the dispatch adapter vitest suites

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-dispatch-adapter-test-repair
**Level:** 2
**Status:** Complete
**Date:** 2026-10-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the two suites recorded as failing, When each runs under the runner that recorded it and then under `.skilled/hooks/vitest.config.ts`, Then the first run fails with the named error and the second passes | `scratch/after/wrong-runner-codex.txt` (`Cannot read properties of undefined (reading 'config')`, exit 1), `wrong-runner-pi.txt` (`Cannot find module '../../.skilled/hooks/shared/hook-flags.mjs'`, exit 1), `pi-preflight.txt` (38 passed), `codex-shell.txt` (5 passed) Evidence: scratch/suites-after.txt:8 | Met | - |
| AC-002 | REQ-002 | Given the final tree, When the adapter command in `.skilled/hooks/dispatch/README.md` section 8 runs as written from the worktree root, Then vitest 5.0.3 reports 3 files and 58 tests passed | Observed run: `RUN v5.0.3`, `Test Files 3 passed (3)`, `Tests 58 passed (58)`, exit 0 Evidence: .skilled/hooks/dispatch/README.md:151 | Met | - |
| AC-003 | REQ-003 | Given the README diff, When a read-only reviewer checks every added sentence and command, Then the verdict is PASS | `scratch/review/luna-4.txt`: PASS, no findings, after rounds 1 to 3 raised one P1 and three P2s, all fixed Evidence: scratch/review/luna-4.txt:1 | Met | - |
| AC-004 | REQ-004 | Given the baseline, When every adapter, guard and shared hook suite reruns from the final tree, Then none drops below its baseline count | `scratch/suites-before.txt` to `suites-after.txt`: Pi preflight 38 to 38, codex 5 to 5, directive-dedup 15 to 15, hooks vitest tree 177 to 177, dispatch-audit 114 to 114, guard node 39 to 39, shared hooks 44 to 44 Evidence: scratch/suites-after.txt:1 | Met | - |

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

All four criteria are Met with observed runs. Neither suite needed a code or test change, because both pass under their owning config. The packet does not correct the dual-compat packet's record of the two suites as failing, because that record lives in another worktree's packet.
<!-- /ANCHOR:closure -->
