---
title: "Acceptance Criteria: Phase 25: goal-binding-record-and-launcher"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal binding record launcher acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/025-goal-binding-record-and-launcher"
    last_updated_at: "2026-10-25T00:30:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Built the goal packet field, the claim print, the wrapper export and the switch"
    next_safe_action: "Phases 26 and 27 read the packet and bind the goal in each runtime"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-25-goal-binding-record-and-launcher"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 25: goal-binding-record-and-launcher

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/025-goal-binding-record-and-launcher
**Level:** 2
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a sender whose goal can be proven, When prepare or keep runs, Then the note holds `goal_packet`, and with no provable goal there is no field | Observed: 12 CLI tests in `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` from line 2055 (6 sender runtimes, each for `prepare` and `keep`) write `goal_packet`. Codex and a Claude session with no log write no field (`:2137`, `:2152`, 4 tests), and each fails against the code before the fix pass. The no-goal case at `:2072`, the unreadable-record and the empty-field cases leave the note unchanged. `relaunch-core.test.cjs:2045` and `:2090` pin the resolver for Codex and for a missing, unreadable or empty Claude log. 814 of 814 pass in the final gate | Met | - |
| AC-002 | REQ-002 | Given a `goal_packet` outside the repository or without `goal.md`, When prepare or keep runs, Then it exits non-zero with the reason | Met in the first build, then superseded: the CLI now owns the field and replaces or removes a bad value instead of refusing it, so AC-006 holds the current criterion | Superseded | ADR-001 |
| AC-003 | REQ-003 | Given a note with the field, When claim and the wrapper run, Then claim prints the packet and the receiver gets `SESSION_RELAUNCH_GOAL_PACKET`, and `SESSION_RELAUNCH_GOAL=0` removes both | Observed: `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2225` (claim prints the packet), `:2239` (claim prints nothing for an older note, a switch that is off or a lost goal.md) and `:2265` (consume) cover the CLI. The wrapper tests at `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2308` and `:2322` show the relaunched stub receives `SESSION_RELAUNCH_GOAL_PACKET` and nothing is exported with `SESSION_RELAUNCH_GOAL=0`, with no packet in the note, or after the packet lost `goal.md`. `:2373` runs two hops, the second note without a packet, and fails when the per-hop `unset` in `skilled-loop` is removed, which the four earlier wrapper tests do not | Met | - |
| AC-004 | REQ-004 | Given a note with no `goal_packet`, When it is claimed, Then behavior is unchanged | Observed: no existing test was edited except the stub's recorded environment and the sandbox scrub lists. `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1314` (claim), `:1668` (consume `deepEqual`) and every wrapper hop test pass in 806 of 806 | Met | - |
| AC-005 | REQ-005 | Given the changed docs, When read, Then they name the field and the switch | Observed: `rg -n "goal_packet\|SESSION_RELAUNCH_GOAL"` hits `.skilled/hooks/session-relaunch/README.md:150`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:113`, `.env.example:587` and `.skilled/commands/speckit/handoff.md:97`. `validate_document.py` reports 0 issues on the README and the command | Met | - |
| AC-006 | REQ-002 | Given a note that already holds a `goal_packet`, When prepare or keep runs, Then the field says what the sender's goal is now: replaced, removed after the goal ended, and never an outside-repository or `goal.md`-less value | Observed: `session-relaunch-cli.test.cjs:2166` (replaces), `:2182` (removes when the sender has no goal), `:2197` (removes once the goal ended) and `:2235` (outside, absolute, dot-dot, symlinked and no-`goal.md` values are removed, exit 0), each for `prepare` and `keep`, and each failing against the code before the fix pass. `relaunch-core.test.cjs:2141` and `:2161` pin the writer, and `:1948` pins `goalPacketProblem`, which `claim` and `consume` still apply. Supersedes AC-002 under ADR-001 | Met | - |

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

Every row is Met with observed evidence, except AC-002, which AC-006 supersedes under ADR-001 in `decision-record.md`. The relaunch gate went from 752 to 806 of 806 in the first build, and from 806 to 814 of 814 in the fix pass, in the loop-set, loop-unset and foreign-loop environments. 37 of the 54 first-build tests failed against the earlier code, and 16 of the fix pass's tests fail against the code before it. The rest pin behavior that must not change, so they pass on the old code by design.
<!-- /ANCHOR:closure -->
