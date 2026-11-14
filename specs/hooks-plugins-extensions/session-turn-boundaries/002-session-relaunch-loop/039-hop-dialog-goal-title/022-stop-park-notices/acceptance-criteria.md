---
title: "Acceptance Criteria: Phase 22: stop-park-notices"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "stop park notices acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/022-stop-park-notices"
    last_updated_at: "2026-11-14T16:20:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the two parked-Stop notices and their six criteria"
    next_safe_action: "The builder records each run and marks every row Met"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs", ".skilled/hooks/session-relaunch/claude/README.md", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-022-stop-park-notices"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the arm-throw notice reach the operator from a spawned hook? The direct import proves the write seam, and the target-pid test proves the spawned stdout path."
    answered_questions:
      - "Does every parking branch need a notice? Yes, the review found the two silent ones and the other two already print."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 22: stop-park-notices

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 022-stop-park-notices
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a pending record and a Stop whose target pid cannot be resolved, When the hook runs, Then stdout holds one JSON line whose `systemMessage` names the missing session process, the withdrawal on the next prompt and the later Stop, and has no `decision` key | Planned: `scratch/red.txt` prints `✖ stop-arm marks the pending record deferred when no process below the loop can be found` before the edit, and `scratch/green.txt` prints `✔` after. The branch sits at `claude/stop-arm.mjs:196` to `:200`. Cited: `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:198`, `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1351` | Pending | - |
| AC-002 | REQ-002 | Given the same record and a Stop whose `arm` call throws, When the hook runs, Then the injected `write` receives one line that names the failed arm, the withdrawal and the later Stop, with no `decision` key | Planned: `scratch/red.txt` prints `✖ stop-arm marks the pending record deferred when arming throws` before the edit, and `scratch/green.txt` prints `✔` after. The branch sits at `claude/stop-arm.mjs:215` to `:219`. Cited: `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:217`, `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1380` | Pending | - |
| AC-003 | REQ-003 | Given either Stop, When the record and the log are read, Then the record holds `deferredAt` with its other fields unchanged, and the log holds exactly one `stop-arm-error` line with that branch's stage | Planned: both changed tests keep the record and log assertions, and `scratch/green.txt` prints `ℹ fail 0`. The stamp helper is at `claude/stop-arm.mjs:53` to `:59`. Cited: `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:53`, `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1369` | Pending | - |
| AC-004 | REQ-004 | Given either Stop and a notice write that throws, When the hook runs, Then the failure is logged as `stop-arm-error` with `stage: 'notice'`, the record stays stamped and the hook exits 0 | Planned: an injected `write` that throws through `armPendingRecord` leaves `armed` null, logs one `stop-arm-error stage=notice` line and keeps `deferredAt`, saved to `scratch/write-throw.txt`. Cited: `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:150` | Pending | - |
| AC-005 | REQ-005 | Given the edited adapter, When the Claude adapter and conformance suites and the whole relaunch and OpenCode plugin suites run, Then they pass with the baseline count | Planned: `scratch/claude-conformance.txt` and `scratch/final-suite.txt` each print `ℹ fail 0`, and `final-suite.txt` matches the count in `scratch/baseline.txt`. The two existing notices pass at `tests/claude-adapters.test.cjs:940` and `:683`. Cited: `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:940`, `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:683` | Pending | - |
| AC-006 | REQ-006 | Given the fix commit, When it is inspected, Then both READMEs name the notices, and the commit adds no file, record key or log event | Planned: `rg -c 'no target pid'` and `rg -c 'arm that throws'` print 1 or more for each README, the T016 filters print what T016 states, and `git show --stat FIX` lists four code or document files plus this child's records. Cited: `.skilled/hooks/session-relaunch/claude/README.md:27`, `.skilled/hooks/session-relaunch/README.md:134` | Pending | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Pending` | Planned and not yet built. The builder replaces it with `Met` or `Unmet` when the fix commit lands. |
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

Every row is `Pending`, because this phase is planned and not built. The builder runs T001 to T017, saves each run under `scratch/`, marks every row `Met` with the observed line and cites the fix commit.
<!-- /ANCHOR:closure -->

---
