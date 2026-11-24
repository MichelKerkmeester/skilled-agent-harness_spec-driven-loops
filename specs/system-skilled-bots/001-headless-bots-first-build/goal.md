---
title: "Goal: Build system-skilled-bots: file-defined headless agent bots"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build"
    last_updated_at: "2026-11-22T17:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "306ce05f-f119-4cd7-b3ad-85d401c28435"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Build system-skilled-bots: file-defined headless agent bots

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Ship the `system-skilled-bots` skill so an authored `BOT.md` runs headless by hand, on a launchd schedule or from a queued request, with every piece of control state outside the consumer checkout.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The skill is `system-skilled-bots`. A consumer holds only `bots/`: one `BOT.md` per bot and `bots/config.json`. |
| D2 | Run folders live only in the Skilled tree's gitignored `.skilled/skills/.state/system-skilled-bots/`. All control state and run records live under the user-level state root. |
| D3 | A repository with no remote declares `identity` in `bots/config.json`, and install and enqueue refuse while identity is unknown. |
| D4 | While a bot's needs-you item is open, every run of that bot is held. |
| D5 | Nothing is scheduled before the runner and its kill switches exist. Only the installer writes a hub plist or calls `launchctl bootstrap`, and a first install is disabled. |
| D6 | No phase reports a mode as routed until the hub-wiring phase has run both routing stages for this hub. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-contracts-and-state-root | `001-contracts-and-state-root/goal.md` |
| 002-schedule-predicates-and-checker | `002-schedule-predicates-and-checker/goal.md` |
| 003-manual-runner | `003-manual-runner/goal.md` |
| 004-worktree-isolation-and-delivery | `004-worktree-isolation-and-delivery/goal.md` |
| 005-request-pipeline | `005-request-pipeline/goal.md` |
| 006-launchd-installer | `006-launchd-installer/goal.md` |
| 007-status-index | `007-status-index/goal.md` |
| 008-hub-wiring | `008-hub-wiring/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each of the eight phase folders `001` to `008` under `specs/system-skilled-bots/001-headless-bots-first-build/` prints `RESULT: PASSED` from `validate.sh <folder> --strict`, and every row in its `acceptance-criteria.md` reads Met, Waived or Superseded.
- [ ] In `.skilled/skills/system-skilled-bots/runtime/`, `npx vitest run --no-coverage` and `npm run typecheck` both exit 0.
- [ ] `bots run <id>` on a manual bot writes exactly one run record under the user-level state root, and the consumer checkout's `git status --short` is the same before and after the run.
- [ ] A cron bot installs as a disabled launchd agent, and once enabled it fires and its run record carries the fired slot and its lateness.
- [ ] A run that prints `[NEEDS-DECISION]` ends `awaiting-decision` with one needs-you item, `bots answer` enqueues one `resume` request, and an item unanswered past `needsYou.expiryDays` reads `expired`.
- [ ] `bots status` shows installed, last run, delivery, missing-checkout, changed-runner-path, vanished-run-folder and open needs-you states, and the index it reads is rebuilt from the run records.
- [ ] All four modes (author, run, schedule, status) route through both routing stages for `system-skilled-bots`, and a staged overlay re-pin leaves a consumer's `bots/` folder unchanged.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| 001-contracts-and-state-root | Done | Committed `6c3db542afa` and `652a3ed9aae` on `system-skilled-bots`. 56 tests pass, 18/18 acceptance rows Met, `validate.sh --strict` PASSED |
| 002-schedule-predicates-and-checker | In Progress | Review APPROVED, committed `f292a8223be` and pushed. AC-001, AC-002 and AC-011 wait on the launchd weekday probe (loaded 2026-11-22, read after 2026-11-24) |
| 003-manual-runner | In Progress | First review REQUESTED_CHANGES (decision marker unread from JSON-output kinds). Reworked: marker read per output format, receipts moved to the state root, replay retry through the append gateway, three hardening fixes. Suite 179 passed, deep-loop 4039 passed before and after. OpenCode and Vibe read-only support in build, then re-review and the live run |
| 004 to 008 | Pending | Waiting on their dependencies |
| 003-manual-runner | Done | Third review APPROVED; live codex run, OpenCode (3 fixtures) and Vibe probes passed; committed 555101d8c23 and pushed; 7 operator decisions recorded in its decision-record.md |
| 004 and 005 | Done | 004 second review APPROVED, 005 review APPROVED; live desktop notice attempted; suite 264 passed; hook tests 74/14/25/28 passed |
| Phase 006 launchd installer | Done | d2f75c66184 pushed; 322/322 tests, typecheck 0, validate PASSED, 18/18 AC Met; live install passed twice (held, one fire with slot and lateness, drain, uninstall); five review rounds, operator answers Q004 to Q008 |
| Phase 007 status index | Done | 928be8397fb pushed; 355/355 tests, typecheck 0, validate PASSED, 16/16 AC Met; second review APPROVED; live status check passed; operator answers Q003 to Q006 |
| 008 hub wiring review loop | Done | reviews 2-5 fixed, review 5 APPROVED, gates green, f4c318d856a pushed to origin/system-skilled-bots |
| Phase 006 closed | done | hand rollback scratch/rollback-run-result.txt; security review fixed record-label check; suite 373/373, strict 10 PASSED |
| Executor pin for scheduled runs | done | installer.vitest.ts:693-726; suite 377/377; mutations fail |
| Drain executor pin for queued runs | done | installer.vitest.ts:726; suite 378/378; mutation fails |
| Live model fire under launchd | done | 006 scratch/live-model-fire-result.txt:42,56 converged, PONG |

### Deviations and findings

| Item | Note |
|------|------|
| Operator decisions 2026-11-22 | Dispatch receipts move out of the run folder to the user-level state root. Replay retry through the deep-loop append gateway is built in phase 003. OpenCode and Mistral Vibe are supported for read-only bots through deep-loop builder tool narrowing, with one live probe per CLI. One live real-executor run of phase 003 is approved |
| Live runs | No launchd agent is loaded, no real executor is dispatched and nothing is sent externally without the operator's explicit yes. Rows that need a live run stay Unmet with a ready-to-run script in the phase's `scratch/` |
<!-- /ANCHOR:log -->
