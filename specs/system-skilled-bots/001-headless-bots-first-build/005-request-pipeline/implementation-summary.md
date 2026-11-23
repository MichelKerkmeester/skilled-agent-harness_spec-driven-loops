---
title: "Implementation Summary"
description: "Bots can now be queued: bots enqueue, bots answer and an opt-in post-commit leg each write one run request, and a hand-run bots drain claims each request by rename and ends it in one run or in quarantine with a reason. The race, dedupe, quarantine, retry, resume, identity and answer tests pass, and the three existing hook tests match their baseline."
trigger_phrases:
  - "request pipeline implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/005-request-pipeline"
    last_updated_at: "2026-11-23T07:42:43Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed the phase 005 review suggestions; review APPROVED"
    next_safe_action: "Commit phases 004 and 005 after the 004 re-review"
    packet_purpose: "Purpose: Any producer can write one run request, and each request ends in exactly one run or in quarantine with a reason."
    blockers: []
    key_files:
      - ".skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/answer.ts"
      - ".skilled/scripts/git-hooks/post-commit"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "implement-005-request-pipeline"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "e69eaf8b-97d2-4d96-ad3f-66a87da7bbe5"
      workspace: "/Users/michelkerkmeester/worktrees/public/system-skilled-bots"
      savedAt: "2026-11-23T07:42:43Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 95
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
| **Spec Folder** | 005-request-pipeline |
| **Status** | In Progress |
| **Completed** | Every acceptance row is Met and the closure statement reads Closeable: Yes. CHK-051 (scratch cleanup) is left to the orchestrator, because scratch holds the cited evidence |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A bot can now be started by a queued request as well as by hand. `bots enqueue`, `bots answer` and the opt-in post-commit leg each write one request into the watched folder under the user-level state root, and `bots drain` claims each one by rename, runs it through the manual runner and ends it in `done/` or in `quarantine/` with a reason file.

### Phase 5: request-pipeline

- **The record.** A request carries the research fields plus `kind` (`run` or `resume`) and `attempts`. Its idempotency key is the source and the source's own event id, or a caller key, never a body hash. The request id and the seen-key marker are both derived from the bot and the key, so one commit can reach several bots once each and a re-sent event names the request already queued.
- **The queue.** Six sibling folders under `<state root>/<identity key>/requests/`. Enqueue writes into `tmp/`, creates the seen-key marker with an exclusive create, then renames into `inbox/`. Claim, finish, retry and quarantine are each one rename, and a vanished file is a lost race, never a crash.
- **The drain.** One pass handles what was in `inbox/` when it started. A completed or parked run is `ran`. A refusal is quarantined with its cause: `definition-malformed`, `precheck-failed`, `disabled`, `paused`, and the hold as `held-needs-you`. A failure goes back with one more attempt, and the third failure quarantines as `retry-bound`. `lease-held` counts as a failure. An environment refusal that would hit every request (`identity-unknown` or `run-folder-refused` before a run id) stops the pass and puts the request back unchanged, so a broken setup never burns the queue.
- **`bots answer`.** It refuses an unknown item, an expired item, a different answer to an answered item and an answer holding a secret literal (named by key). On an open item it records the answer, then enqueues one `resume` request keyed by the item id, writes that id into `resumeRequestId` and advances the generation stamp. The same answer again re-sends the same request, which prints `duplicate` and leaves the stamp alone.
- **The hook leg.** It runs after the trust block and the live-sync branch. A repository with no `bots/config.json` pays one file test. It skips a commit made inside a bot run, needs the CLI under `$SOURCE_ROOT` and `node` on `PATH`, honours `SYSTEM_BOTS_ENQUEUE_DISABLED` through the `hook_enabled` resolver, and lets the CLI read `gitHookTrigger`. A text check for `"gitHookTrigger": true` runs first, so a repository with bots that leaves the trigger off starts no node process either; the CLI stays the authority. Every failure is swallowed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/request-record.ts` | Create | Build and validate a request, derive its key and id |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts` | Create | Folder moves, the seen-key marker, the checkout-level enqueue and the commit fan-out |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | Create | The drain pass and outcome routing; it hands each request to the runner as a `queued` or `resume` request |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify (owned by phases 3 and 4) | A `queued` request kind: the runner writes the request id, fired slot and source in its one record, appends the request prompt after the bot prompt and runs the body-secret predicate over it |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Create | `bots answer` |
| `.skilled/bin/bots.cjs` | Modify | The `enqueue`, `drain` and `answer` verbs, with per-verb options and arity. `--prompt`, `--origin` and `--key` take a dash-led value; a value that is one of the CLI's own flags still counts as missing |
| `.skilled/scripts/git-hooks/post-commit` | Modify | The opt-in, non-fatal enqueue leg, lines 120 to 153 |
| `.skilled/scripts/git-hooks/README.md` | Modify | The `post-commit` row names the leg and its two switches (operator yes) |
| `.skilled/skills/sk-git/references/continuous-integration.md` | Modify | A note that the hook carries a separate bots leg (operator yes) |
| `.skilled/skills/system-skilled-bots/runtime/tests/` | Create | `request-record`, `request-queue`, `quarantine`, `retry`, `dedupe`, `identity-refusal`, `resume`, `answer`, `race` and `queued-run` vitest files, `queue-support.ts`, the race driver fixture and `post-commit-leg.test.sh` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed `/speckit:implement` in autonomous mode in the worktree on branch `system-skilled-bots`, beside the parallel worktree-isolation builder, whose files were not edited. No real executor ran: every run dispatched to phase 3's stub `codex`.

Proof, in the order it ran:
1. Baselines before any edit: the three hook tests at 74, 14 and 25 passed, exit 0 each, and the bots suite at 194 passed, typecheck exit 0.
2. The libraries, the CLI verbs and the hook leg, with `bash -n` exit 0 on the hook.
3. The hook matrix: 27 passed, 0 failed. The positive rows (a trusted primary checkout and its linked worktree each enqueue one request) prove the leg runs, so the rows that expect nothing are not empty passes.
4. The three hook tests again after the edit, and once more after the README edit: 74, 14 and 25 passed, exit 0 each, the same as the baseline.
5. The vitest files, then a mutation control: with the claim made by copy instead of rename, the race test fails on its first round.
6. The whole suite and the typecheck.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The git-hook trigger fires in every trusted checkout (ADR-001, Accepted) | The operator chose it. The hook matrix proves a linked worktree enqueues too |
| Answers come back as requests of kind `resume`, keyed on the needs-you item id, and `bots answer` lives here (operator decision D12) | Keying on the item id makes a second answer a duplicate |
| A held bot's requests go to quarantine with reason `held-needs-you` (operator decision D9) | The same rule as paused requests, so the watched folder always empties |
| Enqueue refuses while identity is unknown | Identity is resolved before any folder is created, so a refused enqueue leaves the state root empty |
| ADR-002 to ADR-004 | Accepted by operator decision D11: retry bound 3, sibling folders, paused requests to quarantine |
| The seen-key marker and the request id are keyed by bot as well as by event | One commit reaches several commit-triggered bots once each |
| The runner writes the request join from a `queued` request kind | An earlier build had the drain rewrite the record after the run and advance the stamp, because the runner belonged to the parallel builder. The fix moved the join into the runner's one record write and removed the rewrite |
| A queued request's prompt follows the bot prompt under one separator line (ADR-005, Accepted by the orchestrator on 2026-11-23 while every producer is local) | Neither this spec nor the phase 1 run-record contract says how the two combine. The body stays in charge, an empty prompt adds nothing, and the body-secret predicate runs over the request prompt the way it runs over an answer |
| [DEVIATION from ADR-002: `lease-held` is retried, not quarantined] | A held lease means another run of the bot is in progress, which is "not now" rather than "never". It still counts toward the bound, and a bound-reached request names its last cause, such as `lease-held on attempt 3`, so a busy bot never reads as a failure. Raised as an open question in `spec.md` |
| [DEVIATION from ADR-002: an environment refusal stops the pass] | `identity-unknown` and `run-folder-refused` before a run id would hit every request alike. Quarantining them would empty the queue for a setup fault. Raised as an open question in `spec.md` |
| The drain prints `lost-claim`, which REQ-012 does not list, and never prints `duplicate` | `lost-claim` is the loser's line in a claim race, which AC-001 asks for. Dedupe happens at enqueue, so no duplicate reaches the drain |
| The drain exits 1 when requests remain in `inbox/` | REQ-012 sets exit 0 for an empty folder. A pass that retried a request leaves it there for the next pass, and says so on stderr |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hook tests before the edit | `source-root-selection` 74, `autostash-orphan-guard` 14, `gate-config` 25 passed, exit 0 each (`scratch/hook-baseline-*.txt`) |
| Hook tests after the edit | The same three counts, exit 0 each (`scratch/hook-after-*.txt`) |
| Hook matrix `post-commit-leg.test.sh` | 27 passed, 0 failed, exit 0 (`scratch/post-commit-leg.txt`) |
| This phase's nine vitest files | 9 files, 22 tests passed, exit 0 (`scratch/phase005-tests.txt`) |
| Race over 50 rounds | One joined record each round, lost claim reported in 49 of 50 rounds (`scratch/race-run.txt`) |
| Race mutation control | Claim by copy: the test fails with `drain refused: request-vanished` (`scratch/race-mutation-control.txt`), file restored and its hash checked |
| Whole bots suite | 28 files, 250 passed, exit 0 (`scratch/bots-suite-after.txt`). Baseline 194. The delta of 56 holds this phase's 22 tests and the parallel worktree phase's own additions, which landed in the same worktree during this build. An earlier run in this build failed three of that phase's in-progress `isolation.vitest.ts` tests, which touch none of this phase's modules |
| Queued-run negative control | Before the fix all 3 `queued-run.vitest.ts` tests failed, the first with `expected 'You are a non-interactive bot run: AI…' to contain 'QUEUED-PROMPT-TEXT-91c2'` (`scratch/queued-run-negative-control.txt`) |
| Whole bots suite after the queued-run fix | 29 files, 253 passed, exit 0, three runs in a row (`scratch/bots-suite-queued-run-1.txt` to `-3.txt`). Baseline 250; the delta of 3 is the new `queued-run.vitest.ts` |
| Hook matrix after the queued-run fix | 27 passed, 0 failed, exit 0 (`scratch/post-commit-leg-queued-run.txt`) |
| Typecheck | `npm run typecheck` exit 0, and again after the queued-run fix (`scratch/typecheck-queued-run.txt`) and after the review fixes (`scratch/review-fix-typecheck.txt`) |
| Review fixes: hook tests | `source-root-selection` 74, `autostash-orphan-guard` 14, `gate-config` 25 passed, exit 0 each, the same as the baseline; `post-commit-leg.test.sh` 28 passed, 0 failed, with the new opted-out "starts no node process" assertion (`scratch/review-fix-*.txt`) |
| Review fixes: whole bots suite | 29 files, 263 passed, exit 0, three runs in a row (`scratch/review-fix-suite-1.txt` to `-3.txt`). Baseline 253; the delta of 10 is two tests from this phase (the busy-bot retry detail and the dash-led prompt) and eight from the worktree phase's own review fixes |
| `rg -n 'launchctl\|\.plist'` over `request-*.ts`, `answer.ts` and the hook | No match, exit 1 |
| Expiry | With `needsYou.expiryDays: 2` a parked item expires 2 days after it was made, reads `open` 1 ms before and `expired` at that instant, and `bots answer` refuses it as `item-expired` (`answer.vitest.ts`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The hook leg's CLI lookup in a consumer repository is open.** A repository that trusts its hooks through `skilled.trustRepoHooks=true` and carries a vendored tree reaches the CLI at `$SOURCE_ROOT/bin/bots.cjs`. Whether that path is right for every packaging layout is for phases 1 and 8.
2. **The prompt combination is safe only for local producers.** A request's prompt follows the bot prompt under a separator (ADR-005, Accepted). The separator carries no trust boundary, so before an untrusted producer such as a webhook adapter ships, the request text must be framed as data.
3. **Stale claims are reported, not recovered.** An entry already in `claimed/` when a pass starts is named on stderr and left alone. The operator moves it back by hand.
4. **Request files and seen-key markers are not pruned.** Retention belongs to phase 7.
5. **A quarantined resume has no re-send verb.** Re-sending one means removing its seen-key marker by hand, as ADR-002 records, until a requeue verb exists.
<!-- /ANCHOR:limitations -->

---
