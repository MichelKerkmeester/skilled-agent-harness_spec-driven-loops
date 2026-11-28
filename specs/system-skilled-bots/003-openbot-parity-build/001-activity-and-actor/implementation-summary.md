---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "activity and actor implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/001-activity-and-actor"
    last_updated_at: "2026-11-25T07:13:38Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-activity-and-actor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-activity-and-actor |
| **Completed** | 2026-11-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`bots activity` now shows what every bot is doing in OpenBot's seven groups, current on every read with no `--rebuild`. Every answer and every run records who gave it, so a shared identity no longer hides which person approved what.

### Phase 1: activity-and-actor

You get one grouped read. `needs_you`, `done`, `stopped` and `failed` come from the status index, which each read brings up to date for any identity whose stamp moved. `working` comes from a held lease, `scheduled` from a queued request or the next fire of an installed schedule and `recurring` from each installed schedule. `bots activity --json` and `bots inbox --json` print the versioned payloads the terminal screen reads, and `bots inbox --all` also lists answered items with who answered and the scope.

The actor is a validated name. `--as` names it, a scheduled fire takes the operator pinned at install time and everything else takes the OS user. Outside a tty the CLI refuses a name that is not yours, and a bot child cannot answer or enable at all. A definition that declares `danger-full-access` now runs at `workspace-write` unless the operator installed it with `--full-access`, and that grant also works for a bot whose trigger is not cron. The index schema did not move: the actor rides in the run summary JSON and `updatedAt` is a meta row.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/activity.ts` | Created | The seven groups and the pure grouping of every source into the payload and its text lines |
| `.skilled/skills/system-skilled-bots/runtime/lib/actor.ts` | Created | The actor pattern and the resolution order |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Modified | `kind` key, answer `by` and `scope`, old answers read as `by: null` and `scope: "once"` |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modified | `actor` and `answeredBy` on the record |
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Modified | `actor` in the run summary and the `updatedAt` meta row |
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Modified | Refresh on read, the report's `version` and `updatedAt` and the activity gatherer |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modified | Records `by` and `scope` and stamps the parked run's `answeredBy` |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modified | Records the run's actor and reads the install record's full-access grant |
| `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts` | Modified | Caps a declared `danger-full-access` without the grant |
| `.skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts` | Modified | Pins the operator and the full-access marker into the job |
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Modified | Writes `operator` and `fullAccess` and records full access for a non-cron bot |
| `.skilled/bin/bots.cjs` | Modified | `activity`, `inbox --json --all`, `--as`, `--scope`, `--full-access`, the tty refusals and the child bar over every write verb and write form |
| `.skilled/skills/system-skilled-bots/runtime/tests/activity.vitest.ts`, `actor.vitest.ts` | Created | Group order, the one data set, refresh on read, row sources and the actor cases |
| `.skilled/skills/system-skilled-bots/runtime/tests/` answer, needs-you, posture, resume, run-record, status-index, status, installer and cli-run suites | Modified | The named tests for each criterion and the updates the new keys and the refresh required |
| `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` | Created | The MIT notice for OpenBot's `activity-groups.ts` |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md`, `bots-status/SKILL.md`, `bots-status/references/status-and-inbox.md`, `bots-run/references/run-queue-and-answer.md` | Modified | The two module rows, the new read verb and the three new options |
| `design/fixtures/one-data-set.json`, `design/fixtures/README.md` | Modified | The missing `nightly-report` install record |

### Follow-up: every write verb inside a bot run

A review found that the child bar refused only `answer`, `enable` and `skill`. A bot child could still send a chat message under the operator's name, start a manual run, reinstall or remove a schedule, pause, resume or disable a bot, queue or drain requests and rebuild or unregister status rows. A manual run and a reinstall both write the definition approval, so a child that edited its own BOT.md could approve its own drift. `CHILD_REFUSED_VERBS` now holds every verb whose every form writes, and `chat` without `--transcript` and `status` with `--unregister` or `--rebuild` get their own detailed refusal beside the `remember` and `secret` ones (REQ-014, AC-017). The read forms stay open. The test `refuses every write verb from a bot child` failed against the old `bots.cjs` with `run manual-ok: expected 4 to be 2` and passes now, and `keeps the read forms open to a bot child` passes on both.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Cheap workers wrote every change in eleven internal waves, one change per brief, on `cli-mistral-vibe` with `deepseek-flash`. After each wave the orchestrator ran the named verify commands itself before marking a task. One run (T025) stopped on a backend 502 and passed on its one retry through `cli-pi`. The closing gate ran the whole runtime suite (37 files and 424 tests passed against a baseline of 35 and 381), the type-check, each acceptance command and the three CLI reads on a fresh scratch checkout. The full-access install was proved by hand through a pty.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The actor rides in the run summary JSON and `updatedAt` is a meta row | `SCHEMA_VERSION` stays `'2'`, so an index built before this phase takes writes with no `ALTER TABLE` |
| The tty refusal lives in `bots.cjs` alone | A channel daemon or a test can pass an actor to `answerItem` with no tty |
| The pinned operator counts only on a scheduled run | A shell that exports the same variable cannot claim the operator's name |
| A stale identity is refreshed on read, never rebuilt and never trimmed | A run that ended after the build shows at once and a read deletes nothing |
| The full-access grant is read from the install record | A definition cannot grant itself full access by declaring it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm test` in the runtime | PASS: `Test Files  37 passed (37)` and `Tests  424 passed (424)`, exit 0. Baseline 35 and 381 |
| `npm run typecheck` | PASS: exit 0 |
| AC-001 to AC-017 commands | PASS: every anchored filter printed `Tests  1 passed` |
| `bots activity`, `bots activity --json` and `bots inbox --json` on a fresh scratch | PASS: `bots: no activity`, `{"version":1,"groups":[]}` and `{"version":1,"items":[]}`, each exit 0 |
| `bots answer item-1 yes --scope always` | PASS: `bots: grant-scope-unsupported`, exit 2 |
| `bots schedule install plain --full-access` through a pty | PASS: the recorded-only message, exit 0, and the record holds `fullAccess: true` with no labels |
| `validate.sh --strict` on this folder | PASS: `RESULT: PASSED` |
| Follow-up: `npm test` and `npm run typecheck` in the runtime | PASS: `Test Files  57 passed (57)` and `Tests  800 passed (800)`, exit 0, against a floor of 57 and 798, and the type-check exit 0 |
| Follow-up: `cargo test --locked` for the bots-tui crate | PASS: exit 0, with 148, 24, 41, 8, 2, 51 (1 ignored), 1 and 17 passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A hand drain can record the pinned operator.** `request-drain.ts` cannot tell the runner it is unscheduled, so a queued or resume request counts as scheduled. A hand drain from a shell that exports `SKILLED_BOTS_OPERATOR` records that name. Unset the variable before draining by hand.
2. **`schedule` prints null until the describe seam is wired.** The `scheduled` and `recurring` rows carry `schedule: null` until the next phase passes `describeStart`.
3. **The child bar runs after parsing.** A bot child with a malformed argv gets the usage line and exit 2 instead of `child-write-refused`.
4. **A dispatched session's commit queues no git-commit request.** The post-commit hook skips the leg only for `SKILLED_BOT_RUN_ID`, so a commit made with `AI_SESSION_CHILD=1` alone still calls `bots enqueue --git-commit`, which is now refused, and the hook discards that output. A git-hook bot does not fire for such a commit.
<!-- /ANCHOR:limitations -->
