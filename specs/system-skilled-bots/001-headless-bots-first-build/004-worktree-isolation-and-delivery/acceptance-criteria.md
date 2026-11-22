---
title: "Acceptance Criteria: Phase 4: worktree-isolation-and-delivery"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "worktree isolation and delivery acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/004-worktree-isolation-and-delivery"
    last_updated_at: "2026-11-22T11:30:00Z"
    last_updated_by: "spec-writer"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-worktree-isolation-and-delivery"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: worktree-isolation-and-delivery

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `system-skilled-bots/001-headless-bots-first-build/004-worktree-isolation-and-delivery`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a bot that declares `isolation: worktree`, When `bots run <id>` runs it, Then the tree sits outside `git rev-parse --show-toplevel`, its provisioned links exist before dispatch and the run record names its path and branch | `isolation.vitest.ts` placement case plus the T017 run record | Unmet | - |
| AC-002 | REQ-002 | Given a clean, unchanged hub worktree, When it is removed, Then every link is unlinked first and the main checkout's dependency folders hold the same entry count as before | `isolation.vitest.ts` removal case with the fake `node_modules` count before and after | Unmet | - |
| AC-003 | REQ-003 | Given a dirty or unmerged tree, When the run ends, Then the tree is not removed, `git worktree list` still shows it and the record and notice report it as kept with its reason | `isolation.vitest.ts` kept-state matrix rows and the T018 kill test | Unmet | - |
| AC-004 | REQ-004 | Given two concurrent worktree runs, When both start, Then they receive different `NNN` numbers and neither lease key contains a worktree path | `isolation.vitest.ts` concurrency case and lease-key assertion | Unmet | - |
| AC-005 | REQ-005 | Given a send whose result is uncertain, When delivery records it, Then the state is `unknown`, no second send is attempted and the run outcome field is unchanged | `delivery.vitest.ts` forced-uncertain case with a send counter of 1 | Unmet | - |
| AC-006 | REQ-006 | Given a definition with no `isolation` field and no repository default, When the runner starts, Then it applies phase 1's missing-posture rule and never picks a workspace itself | Runner test asserting no `worktree-naming.sh` call for that definition | Unmet | - |
| AC-007 | REQ-007 | Given an empty target list, a failed run with an override and a desktop target, When delivery resolves them, Then it writes `not-attempted`, picks the override and records the notice as `attempted` only | `delivery.vitest.ts` resolution and channel cases | Unmet | - |
| AC-008 | REQ-008 | Given any delivery record, When its body is read, Then it names channel, target, state and evidence and holds no command line or environment value | `delivery.vitest.ts` body grep (T019) | Unmet | - |
| AC-009 | REQ-009 | Given the negative worktree fixture, whose shared-path list does not resolve, When the checker runs on it, Then it exits non-zero and prints the worktree invariant id | Checker run on the fixture (T013) | Unmet | - |
| AC-010 | REQ-010 | Given this phase's code, When it is searched, Then no path calls `launchctl bootstrap` or writes a plist | `rg -n 'launchctl bootstrap\|\.plist' .skilled/skills/system-skilled-bots/runtime/lib` prints nothing (T020) | Unmet | - |
| AC-011 | REQ-011 | Given a run that ends `awaiting-decision` and opens one needs-you item, When delivery runs for it twice, Then one notice is sent per target, each record names the item id, and the second pass sends nothing | `delivery.vitest.ts` needs-you case with a send counter of 1 per target (T021) | Unmet | - |

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

Nothing in this phase is built, so every criterion above is Unmet.
<!-- /ANCHOR:closure -->
