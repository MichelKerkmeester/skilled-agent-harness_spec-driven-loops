---
title: "Acceptance Criteria: Phase 11: post-fix-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "post fix remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/011-post-fix-remediation"
    last_updated_at: "2026-10-19T21:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked all six criteria Met with evidence"
    next_safe_action: "Merge worktree 156 to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: post-fix-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/011-post-fix-remediation
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
| AC-001 | REQ-001 | Given an armed record whose killer died, When the next arm event re-arms it after the age limit passed, Then `shouldRelaunch` relaunches | Evidence: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:368`; `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:496`. On the pre-phase core the test fails with `{ relaunch: false, reason: 'stale' }` | Met | - |
| AC-002 | REQ-001 | Given an armed record that would be stale by the end of the grace period, When the killer reaches its signal, Then it unarms with reason `stale`, logs `killer-stale` and sends no signal | Evidence: `.skilled/hooks/session-relaunch/lib/killer.cjs:587`; `.skilled/hooks/session-relaunch/tests/killer.test.cjs:1902`. Red on the pre-phase killer: the signal file exists | Met | - |
| AC-003 | REQ-003 | Given the five arm paths, When each decides whether to arm, Then each calls `armableRecord` and the conformance table's arm cases pass on every adapter | Evidence: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:403`; `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:396`; the Pi conformance block mirrors it. Node 566/566, Pi 39/39 | Met | - |
| AC-004 | REQ-004 | Given the other findings and frontier items, When the suites run, Then each change has a passing test | Evidence: `relaunch-core.cjs:23`, `:29`, `:34`, `:114`, `:668`, `:689`, `:716`, `:891`; `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:237`, `:281`; `.skilled/bin/skilled-loop:60`; `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1708`, `:1808`; `tests/relaunch-core.test.cjs:1366`; `tests/killer.test.cjs:1992` | Met | - |
| AC-005 | REQ-002 | Given the final tests, When the pre-phase sources are swapped in, Then the changed behaviour fails | Evidence: fifteen pre-phase sources swapped in: node 566 tests with 82 failing, Pi 39 with 2 failing. Every source was restored and `cmp` matched its saved copy | Met | - |
| AC-006 | REQ-004 | Given the docs, When they are read against the code, Then they describe the new behaviour and pass their validators | Evidence: `.skilled/hooks/session-relaunch/README.md` frontmatter, glob test command, arm rule, killer events; `.skilled/hooks/session-relaunch/tests/README.md` invariant; `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` wrapper table and `CLAUDE_PID` row; `.skilled/commands/speckit/handoff.md:21`. `validate_document.py` rc 0 on each | Met | - |

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

All six criteria are Met. The stale re-arm and the killer's stale signal are fixed, the arm decision has one owner and a conformance row, and the docs match.
<!-- /ANCHOR:closure -->
