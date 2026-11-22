---
title: "Acceptance Criteria: Phase 5: request-pipeline"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "request pipeline acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/005-request-pipeline"
    last_updated_at: "2026-11-22T10:48:31Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-request-pipeline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: request-pipeline

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 005-request-pipeline
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
| AC-001 | REQ-001, REQ-002 | Given one request in the watched folder, When two `bots drain` processes start together, Then exactly one run record joins that request id and the other drain reports a lost claim | `race.vitest.ts` over 50 rounds: one run record per round (T011) | Unmet | - |
| AC-002 | REQ-003 | Given one source event id, When `bots enqueue` runs twice with different prompts and `bots drain` runs, Then the second enqueue prints `duplicate` and one run record exists | `dedupe.vitest.ts` (T012) | Unmet | - |
| AC-003 | REQ-004, REQ-006 | Given a malformed definition, a failing precheck, a disabled bot and a paused bot each with one request, When `bots drain` runs, Then each request is in the quarantine folder with its reason, the paused one with reason `paused` (ADR-004), and `ls -A` of the watched folder prints nothing | `quarantine.vitest.ts` plus `ls -A Q/inbox` (T013) | Unmet | - |
| AC-004 | REQ-005 | Given a request whose run always fails, When `bots drain` runs repeatedly, Then the runner is called exactly the ADR-002 bound times and the request ends in quarantine with reason `retry-bound` | `retry.vitest.ts` call count (T014) | Unmet | - |
| AC-005 | REQ-007, REQ-009, REQ-010, REQ-011 | Given the hook matrix in `plan.md`, When a commit is made in each row, Then every commit exits 0, no row starts an agent, an untrusted clone enqueues nothing and only the trusted, opted-in, non-run row enqueues one request, in a primary checkout as well as a linked worktree | `post-commit-leg.test.sh` (T015) and the three existing hook tests at their baseline (T016) | Unmet | - |
| AC-006 | REQ-008 | Given the phase's code, When it is searched for scheduler calls, Then no code path writes a plist or calls `launchctl bootstrap` | `rg -n 'launchctl\|\.plist'` over `request-*.ts` and the hook prints nothing (T017) | Unmet | - |
| AC-007 | REQ-012, REQ-013 | Given a drained request that ran, When its run record is read, Then it carries the request id, lease nonce, result event id and fired slot, and drain printed one line with outcome `ran` | `race.vitest.ts` reads the run record fields (T011) | Unmet | - |
| AC-008 | REQ-014 | Given one needs-you item, When two requests of kind `resume` with source `answer` and that item id as key are enqueued and `bots drain` runs, Then the second enqueue prints `duplicate`, one run record exists, and a failing `resume` run is retried and quarantined at the ADR-002 bound | `resume.vitest.ts` (T019) | Unmet | - |
| AC-009 | REQ-015 | Given a fixture repository with no remote and no `identity` in `bots/config.json`, When `bots enqueue` runs, Then it exits non-zero and the state root holds no new file, and once `identity` is set the same enqueue writes one request to the watched folder | `identity-refusal.vitest.ts` (T020) | Unmet | - |
| AC-010 | REQ-016 | Given an open needs-you item, When `bots answer` runs twice with the same text and `bots drain` runs, Then one `resume` request keyed by the item id exists, the second answer prints `duplicate`, the item reads `answered` with that request id, the stamp changed, and one new run joins the item. A different answer, an expired item, an unknown id and a planted secret are each refused with a non-zero exit | `answer.vitest.ts` (T021, T022) | Unmet | - |
| AC-011 | REQ-017 | Given a request for a bot whose runner refuses it with `awaiting-decision-hold`, When `bots drain` runs, Then the request is in the quarantine folder with reason `held-needs-you`, it is not replayed after the item is answered, and `ls -A` of the watched folder prints nothing | Drain test with a stub runner (T023) | Unmet | - |

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

Nothing is built yet, so every criterion is unmet.
<!-- /ANCHOR:closure -->
