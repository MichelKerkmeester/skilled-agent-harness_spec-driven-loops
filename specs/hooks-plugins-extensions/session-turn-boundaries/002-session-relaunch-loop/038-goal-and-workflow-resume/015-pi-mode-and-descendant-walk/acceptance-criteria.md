---
title: "Acceptance Criteria: Phase 15: pi-mode-and-descendant-walk"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "pi mode and descendant walk acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk"
    last_updated_at: "2026-11-13T09:30:00Z"
    last_updated_by: "planner"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Wait for the operator greenlight, then run T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-pi-mode-and-descendant-walk"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 15: pi-mode-and-descendant-walk

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 015-pi-mode-and-descendant-walk
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the pinned plan-build source, the Pi session store and one Pi launch with `--plan`, When the confirmation runs before any code edit, Then `scratch/confirm-pi-mode.txt` holds the three outputs and one verdict line | `rg -n '^rank 13: (build\|decline)$' scratch/confirm-pi-mode.txt` prints 1 line, and `git -C .pi/git/github.com/janvitos/pi-plan-build rev-parse HEAD` prints `51a97327ed4749c48150241ae5b29eb7b3354ffe` | Unmet | - |
| AC-002 | REQ-002 | Given a session branch whose last `pi-plan-build-state` entry has `selectedMode: plan`, When `agent_settled` arms a pending record, Then the armed record carries `mode: 'plan'`, and a branch with no entry or a throwing `getBranch` arms with no `mode` | `npx vitest run --config .skilled/hooks/vitest.config.ts -t 'plan-build mode' .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0 with no failed test | Unmet | - |
| AC-003 | REQ-003 | Given arm settings with `mode: 'plan'` and then `mode: 'auto'`, When `arm` runs, Then the first record keeps `mode: 'plan'` and the second has no `mode` | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'arm keeps a plan or build mode' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0` | Unmet | - |
| AC-004 | REQ-004 | Given an armed Pi record with `mode: 'plan'`, When `consume` runs, Then its JSON output holds `"mode":"plan"` | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'consume prints the recorded Pi mode' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0` | Unmet | - |
| AC-005 | REQ-005 | Given a Pi first launch with `--build` and a consumed `mode: plan`, When the wrapper builds the hop launch line, Then it holds one `--plan` and no `--build`, and a consumed `mode: auto` adds no mode flag | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'replaces the launch mode flag with the consumed mode' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0` | Unmet | - |
| AC-006 | REQ-007 | Given the README section "Model And Effort Across A Hop", When the reader looks for the Pi mode, Then one added sentence says the sender's Plan or Build mode is replayed on a Pi hop | `rg -n 'Plan or Build mode' .skilled/hooks/session-relaunch/README.md` prints 1 line | Unmet | - |
| AC-007 | REQ-006 | Given the live run in `../scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/`, When the phase decides rank 14, Then `decision-record.md` holds ADR-002 that declines the descendant walk, quotes the parent pid 1 line, names the cases a walk still catches and the false refusals of an any-program walk, and points at phase 009, while the running work check stays unchanged | `rg -n '^### ADR-002\|25973     1\|mcp-code-mode-launcher\|009-nudge-note-lines' decision-record.md` prints at least 4 lines, and `git diff -U0 -- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` shows no hunk inside lines 270-312 | Unmet | - |
| AC-008 | REQ-008 | Given the guard tests named in `spec.md` REQ-008, When the suites run after the change, Then each guard still passes with its assertions unchanged | `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0, and `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0` | Unmet | - |

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

When AC-001 records `rank 13: decline`, rows AC-002 to AC-006 become `Waived` with `ADR-001`. When the operator asks for the descendant walk, AC-007 becomes `Superseded` with the ADR that records that choice.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Nothing is built before the operator's greenlight, and AC-001 decides whether the rank 13 rows are built or waived.
<!-- /ANCHOR:closure -->
