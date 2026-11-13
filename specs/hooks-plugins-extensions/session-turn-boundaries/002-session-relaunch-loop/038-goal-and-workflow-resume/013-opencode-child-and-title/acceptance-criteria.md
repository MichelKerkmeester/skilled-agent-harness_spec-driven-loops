---
title: "Acceptance Criteria: Phase 13: opencode-child-and-title"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "opencode child and title acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/013-opencode-child-and-title"
    last_updated_at: "2026-11-13T08:49:36Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-opencode-child-and-title"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 13: opencode-child-and-title

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 013-opencode-child-and-title
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given OpenCode 2.2.7 in a throwaway copy with an event trace plugin, When a parent's task sub-agent running `sleep 90` is moved to the background, Then `scratch/trace-child-idle.md` holds one `Verdict: yes` or `Verdict: no` line on whether the parent's `session.idle` arrived while the child was busy, and one `Child parentID:` line | `rg -n '^Verdict: (yes\|no)' scratch/trace-child-idle.md` prints 1 line and `rg -n '^Child parentID: (yes\|no)' scratch/trace-child-idle.md` prints 1 line | Unmet | - |
| AC-002 | REQ-002 | Given the same server, When a `PATCH /session/<id>` with a title is sent and the session is read back, Then `scratch/live-title.md` holds one `Title verdict:` line and one `Client update:` line copied from the trace plugin | `rg -n '^Title verdict: (yes\|no)' scratch/live-title.md` prints 1 line and `rg -n '^Client update: (function\|undefined)' scratch/live-title.md` prints 1 line | Unmet | - |
| AC-003 | REQ-003 | Given a pending record for a parent and a child created with that `parentID` whose status is busy, When the parent's `session.idle` arrives, Then the record stays `pending` and no killer spawns. Test `a parent session.idle does not arm while its sub-agent is busy` | `node --test --test-name-pattern 'does not arm while its sub-agent is busy' .opencode/plugins/tests/session-relaunch.test.cjs` exits 1 before the edit and 0 after it | Unmet | - |
| AC-004 | REQ-004 | Given the deferral of AC-003, When the last busy child goes idle, Then the record is `armed` and one killer spawns, and with two children one busy the record stays `pending`. Tests `a deferred parent arm runs when its last busy sub-agent goes idle` and `a parent with two sub-agents stays unarmed until both are idle` | `node --test --test-name-pattern 'deferred parent arm runs\|two sub-agents stays unarmed' .opencode/plugins/tests/session-relaunch.test.cjs` exits 1 before the edit and 0 after it | Unmet | - |
| AC-005 | REQ-005 | Given `SKILLED_LOOP_NAME` set and a stubbed `ctx.client.session.update`, When a claim seed message arrives, Then one call is made with `{ path: { id: sessionID }, body: { title: SKILLED_LOOP_NAME } }`. Test `the claim seed sets the session title to SKILLED_LOOP_NAME` | `node --test --test-name-pattern 'sets the session title' .opencode/plugins/tests/session-relaunch.test.cjs` exits 1 before the edit and 0 after it | Unmet | - |
| AC-006 | REQ-006 | Given an unset or empty name, a client with no `update` or a rejecting `update`, When a claim seed arrives, Then no call or a caught failure, and the seed text still reaches the system prompt, while every existing sub-agent and `session.idle` guard still passes | `node --test --test-name-pattern 'no title call without\|rejected title call\|sub-agent\|session.idle' .opencode/plugins/tests/session-relaunch.test.cjs` exits 0 with `fail 0` | Unmet | - |
| AC-007 | REQ-007 | Given the final tree, When every plugin suite runs, Then all pass | `node --test .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` | Unmet | - |
| AC-008 | REQ-008 | Given a native session with an `update` method, When the bridged client's `session.update` is called with a path id and a body title, Then the native method receives that session id and title, and a claim seed on OpenCode 2.2.7 renames the live session | `node --test --test-name-pattern 'client session update passes the title' .opencode/plugins/tests/v2-bridge.test.cjs` exits 0 and `rg -n '^Bridge title verdict: yes' scratch/live-title-bridge.md` prints 1 line | Unmet | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

Nothing is built yet. AC-001 and AC-002 decide which of the later rows are built and which are Superseded by a decision record that cites the live evidence.
<!-- /ANCHOR:closure -->
