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
    last_updated_at: "2026-11-23T08:30:00Z"
    last_updated_by: "phase-builder"
    recent_action: "Applied the review fixes and reconciled the closure statement with the Met rows"
    next_safe_action: "Orchestrator commits the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-request-pipeline"
      parent_session_id: null
    completion_pct: 95
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
| AC-001 | REQ-001, REQ-002 | Given one request in the watched folder, When two `bots drain` processes start together, Then exactly one run record joins that request id and the other drain reports a lost claim | `race.vitest.ts` over 50 rounds, two drain processes released by one start file: one record joins the request each round (`.skilled/skills/system-skilled-bots/runtime/tests/race.vitest.ts:75`), and the loser reported a lost claim in 49 of 50 rounds (`specs/system-skilled-bots/001-headless-bots-first-build/005-request-pipeline/scratch/race-run.txt:5`). A claim made by copy instead of rename fails the test (`specs/system-skilled-bots/001-headless-bots-first-build/005-request-pipeline/scratch/race-mutation-control.txt:25`) (T011) | Met | - |
| AC-002 | REQ-003 | Given one source event id, When `bots enqueue` runs twice with different prompts and `bots drain` runs, Then the second enqueue prints `duplicate` and one run record exists | `dedupe.vitest.ts` through the CLI: the second enqueue prints `bots: duplicate <id>` (`.skilled/skills/system-skilled-bots/runtime/tests/dedupe.vitest.ts:23`) and one record exists after drain (`.skilled/skills/system-skilled-bots/runtime/tests/dedupe.vitest.ts:30`) (T012). A free-text value may start with a dash (`--prompt "- fix the lint warnings"` is stored as given), a missing value and a dash-led `--source` are still refused with exit 2 (`.skilled/skills/system-skilled-bots/runtime/tests/dedupe.vitest.ts:35`, `.skilled/bin/bots.cjs:61`) | Met | - |
| AC-003 | REQ-004, REQ-006 | Given a malformed definition, a failing precheck, a disabled bot and a paused bot each with one request, When `bots drain` runs, Then each request is in the quarantine folder with its reason, the paused one with reason `paused` (ADR-004), and `ls -A` of the watched folder prints nothing | `quarantine.vitest.ts` with the real runner and the CLI drain: `inbox/` is empty (`.skilled/skills/system-skilled-bots/runtime/tests/quarantine.vitest.ts:45`) and five requests carry five reasons, `definition-malformed`, `precheck-failed`, `disabled`, `paused` and `held-needs-you` (`.skilled/skills/system-skilled-bots/runtime/tests/quarantine.vitest.ts:52`). Every folder shares one device id (`.skilled/skills/system-skilled-bots/runtime/tests/request-queue.vitest.ts:44`) (T013) | Met | - |
| AC-004 | REQ-005 | Given a request whose run always fails, When `bots drain` runs repeatedly, Then the runner is called exactly the ADR-002 bound times and the request ends in quarantine with reason `retry-bound` | `retry.vitest.ts`: the stub runner is called exactly 3 times (`.skilled/skills/system-skilled-bots/runtime/tests/retry.vitest.ts:33`), then the request is in quarantine with `retry-bound` and the detail `error on attempt 3` (`.skilled/skills/system-skilled-bots/runtime/tests/retry.vitest.ts:37`). A bot that was only busy reads `lease-held on attempt 3`, never as a failure (`.skilled/skills/system-skilled-bots/runtime/tests/retry.vitest.ts:40`, `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:203`). The bound is one constant (`.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:38`) (T014) | Met | - |
| AC-005 | REQ-007, REQ-009, REQ-010, REQ-011 | Given the hook matrix in `plan.md`, When a commit is made in each row, Then every commit exits 0, no row starts an agent, an untrusted clone enqueues nothing and only the trusted, opted-in, non-run row enqueues one request, in a primary checkout as well as a linked worktree | `post-commit-leg.test.sh`: 28 passed, 0 failed after the opt-in pre-check (`specs/system-skilled-bots/001-headless-bots-first-build/005-request-pipeline/scratch/review-fix-post-commit-leg.txt:30`), rows at `.skilled/skills/system-skilled-bots/runtime/tests/post-commit-leg.test.sh:89` to `.skilled/skills/system-skilled-bots/runtime/tests/post-commit-leg.test.sh:153`. An opted-out repository starts no node process (`specs/system-skilled-bots/001-headless-bots-first-build/005-request-pipeline/scratch/review-fix-post-commit-leg.txt:14`). The three existing hook tests match the baseline after the edit: 74, 14 and 25 passed (`specs/system-skilled-bots/001-headless-bots-first-build/005-request-pipeline/scratch/review-fix-source-root-selection.txt:76`, `specs/system-skilled-bots/001-headless-bots-first-build/005-request-pipeline/scratch/review-fix-autostash-orphan-guard.txt:22`, `specs/system-skilled-bots/001-headless-bots-first-build/005-request-pipeline/scratch/review-fix-gate-config.txt:27`) (T015, T016) | Met | - |
| AC-006 | REQ-008 | Given the phase's code, When it is searched for scheduler calls, Then no code path writes a plist or calls `launchctl bootstrap` | `rg -n 'launchctl\|\.plist'` over `request-*.ts`, `answer.ts` and the hook printed nothing, exit 1. The leg itself is `.skilled/scripts/git-hooks/post-commit:131` (T017) | Met | - |
| AC-007 | REQ-012, REQ-013 | Given a drained request that ran, When its run record is read, Then it carries the request id, lease nonce, result event id and fired slot, and drain printed one line with outcome `ran` | `race.vitest.ts` reads each record: lease nonce and result event id are set (`.skilled/skills/system-skilled-bots/runtime/tests/race.vitest.ts:76`) and the fired slot is the request's (`.skilled/skills/system-skilled-bots/runtime/tests/race.vitest.ts:78`). Drain prints `<id> ran` (`.skilled/skills/system-skilled-bots/runtime/tests/dedupe.vitest.ts:28`) (T011). The runner writes the request id, fired slot and source in the run's one record from its `queued` request kind (`.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:650`, `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:189`), and the drain leaves that record and the generation stamp exactly as the runner wrote them (`.skilled/skills/system-skilled-bots/runtime/tests/queued-run.vitest.ts:75`, `.skilled/skills/system-skilled-bots/runtime/tests/queued-run.vitest.ts:77`) (T024, T025) | Met | - |
| AC-008 | REQ-014 | Given one needs-you item, When two requests of kind `resume` with source `answer` and that item id as key are enqueued and `bots drain` runs, Then the second enqueue prints `duplicate`, one run record exists, and a failing `resume` run is retried and quarantined at the ADR-002 bound | `resume.vitest.ts`: the second resume enqueue is `duplicate` (`.skilled/skills/system-skilled-bots/runtime/tests/resume.vitest.ts:32`), one resumed record joins the item (`.skilled/skills/system-skilled-bots/runtime/tests/resume.vitest.ts:41`), and a failing resume run ran 3 times then quarantined with `retry-bound` (`.skilled/skills/system-skilled-bots/runtime/tests/resume.vitest.ts:59`) (T019) | Met | - |
| AC-009 | REQ-015 | Given a fixture repository with no remote and no `identity` in `bots/config.json`, When `bots enqueue` runs, Then it exits non-zero and the state root holds no new file, and once `identity` is set the same enqueue writes one request to the watched folder | `identity-refusal.vitest.ts`: enqueue exits non-zero (`.skilled/skills/system-skilled-bots/runtime/tests/identity-refusal.vitest.ts:17`), names `bots/config.json` (`.skilled/skills/system-skilled-bots/runtime/tests/identity-refusal.vitest.ts:20`) and leaves the state root empty (`.skilled/skills/system-skilled-bots/runtime/tests/identity-refusal.vitest.ts:21`). With `identity` set one request lands (`.skilled/skills/system-skilled-bots/runtime/tests/identity-refusal.vitest.ts:26`) (T020) | Met | - |
| AC-010 | REQ-016 | Given an open needs-you item, When `bots answer` runs twice with the same text and `bots drain` runs, Then one `resume` request keyed by the item id exists, the second answer prints `duplicate`, the item reads `answered` with that request id, the stamp changed, and one new run joins the item. A different answer, an expired item, an unknown id and a planted secret are each refused with a non-zero exit | `answer.vitest.ts`: the second answer prints `duplicate` (`.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts:42`), the stamp moved once (`.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts:43`), the item names the request (`.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts:50`), one run joins the item after drain (`.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts:56`), the answer is recorded before the enqueue (`.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts:76`). A different answer, an unknown id, a secret named by key and an expired item are refused (`.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts:87`, `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts:91`, `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts:98`, `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts:121`) (T021, T022) | Met | - |
| AC-011 | REQ-017 | Given a request for a bot whose runner refuses it with `awaiting-decision-hold`, When `bots drain` runs, Then the request is in the quarantine folder with reason `held-needs-you`, it is not replayed after the item is answered, and `ls -A` of the watched folder prints nothing | `quarantine.vitest.ts` against the real runner: the held request is quarantined `held-needs-you` (`.skilled/skills/system-skilled-bots/runtime/tests/quarantine.vitest.ts:52`), and after the item is answered it stays in quarantine while only the item's own resume request is queued. The mapping is `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:106` (T023) | Met | - |
| AC-012 | REQ-013, NFR-S02 | Given a request enqueued with a prompt, When `bots drain` runs it, Then the stub executor's receipt holds the bot body followed by the request prompt, and a request prompt holding a secret value is quarantined as `body-secret`, named by key, with no dispatch | `queued-run.vitest.ts`: the receipt holds the request prompt after the body (`.skilled/skills/system-skilled-bots/runtime/tests/queued-run.vitest.ts:37`, `.skilled/skills/system-skilled-bots/runtime/tests/queued-run.vitest.ts:38`), and the secret request is quarantined with no stub run (`.skilled/skills/system-skilled-bots/runtime/tests/queued-run.vitest.ts:49`). It failed on the code before the fix (`specs/system-skilled-bots/001-headless-bots-first-build/005-request-pipeline/scratch/queued-run-negative-control.txt:15`). The combining rule is ADR-005, Accepted for local producers only (T024, T025) | Met | - |

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

**Closeable:** Yes

Every row is Met. ADR-005 is accepted on the condition that request text is framed as data before any untrusted producer ships.
<!-- /ANCHOR:closure -->
