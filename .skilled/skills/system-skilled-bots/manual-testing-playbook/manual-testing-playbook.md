---
title: "system-skilled-bots: Manual Testing Playbook"
description: "Operator index for system-skilled-bots: hub routing across its four bot modes, and runtime scenarios that author, run, queue, isolate, deliver, schedule and report on throwaway bots."
version: 1.2.1.0
---

# system-skilled-bots: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario runs for real. Operators run the actual commands, read the real output and record it. The one stand-in is the model: the runtime scenarios put the shipped test executor, `runtime/tests/fixtures/stub-executor`, first on PATH, so the real runner, recursion guard, records, queue, worktree, delivery, installer and status code run end to end and no model is called. The only verdicts are `PASS`, `FAIL` or `SKIP`, and every `SKIP` names its blocker.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **COMPLETION**: A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded into `.skilled/skills/system-skilled-bots/benchmark/reports/<dated-run-label>/`. A run never edits this corpus.

This is the operator index for the bots hub and its runtime. The routing scenarios check which mode the hub picks for a request and run nothing. The runtime scenarios build a throwaway world for each test and drive `.skilled/bin/bots.cjs` in it: authoring and the definition checker, manual runs, needs-you items and answers, worktree isolation and delivery, the request queue, the launchd schedule and status.

---

## 1. OVERVIEW

The playbook holds 25 scenarios in seven categories. The 8 hub-routing scenarios carry routing gold in their frontmatter, so the admission check replays every prompt through the compiled router. The 17 runtime scenarios carry no routing fields: they are operator scenarios, and the admission check never reads them.

### Realistic Test Model

1. An operator phrases a bot request the way a user would.
2. For a routing scenario, the advisor picks the hub and the hub's router picks a mode or defers.
3. For a runtime scenario, the operator builds the throwaway world the scenario gives and runs its commands from a plain terminal.
4. The operator records each command, its output and its exit status.
5. The scenario passes only when every expected signal appears and nothing contradicts it.

---

## 2. GLOBAL PRECONDITIONS

- The working directory is the repository root.
- The advisor index includes `system-skilled-bots`. Routing scenarios need nothing else.
- Runtime scenarios need macOS, node, git and the runtime's installed dependencies under `.skilled/skills/system-skilled-bots/runtime/node_modules`. BOT-017 also needs a logged-in desktop session, and BOT-021 the user launchd domain.
- Run the runtime scenarios from a plain terminal, never from inside an AI runtime session. The recursion guard reads the command lines and session variables of every ancestor process, and a match refuses the run with exit 3. That is a setup `SKIP`, not a product `FAIL`.
- Neither the repository path nor any temp path may contain an executor word: `claude`, `codex`, `opencode` or `vibe`.
- Every runtime scenario uses the throwaway identity `local/bots-playbook`, a `pb-` bot id and a state root inside its own temp folder, so it never touches a real bot's state.
- BOT-021 is the one scenario that writes outside its temp folder: it installs a launchd job into the account's `~/Library/LaunchAgents`. It never enables the job, and its last step removes it.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Routing scenarios, stage one: `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>" --threshold 0.5`, with the first result and its score.
- Routing scenarios, stage two: the intent the root `ROUTER.md` keyword block selects for the same prompt, and the full JSON `compiled-route.cjs` prints, with its `effectivePolicyHash`.
- Runtime scenarios: the full terminal transcript of the scenario's command block, with every `exit=` line, plus whatever its Evidence section names, such as a `records` line, a folder listing or a status output.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Each routing scenario runs the two stage commands above on the prompt exactly as the scenario gives it.
- Each runtime scenario gives one bash block, run in order in one shell. The block builds the world in step 1, commits it and defines its helpers in step 2 and removes the world in its last step.
- `pbots <verb> ...` runs `.skilled/bin/bots.cjs` with HOME inside the world, PATH starting at the stub executor and `--repo` and `--skilled-tree` pointing into the world.
- `records` prints one line per run record under the world's state root: run id, bot id, exit reason, exit class, delivery entries, worktree path and worktree evidence, separated by ` | `.
- `echo "exit=$?"` after a command shows its exit status: 0 completed, 1 run failure, 2 usage, 3 recursion guard, 4 refused before dispatch, 5 awaiting decision.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

- A routing scenario passes only when stage one returns `system-skilled-bots` above threshold and stage two selects the gold mode, or both miss for an out-of-domain prompt.
- A routing drift is a finding for the routing owner. The prompt and the gold stay as they are.
- A runtime scenario passes only when every expected signal appears, every exit matches and the record, folder or status evidence agrees with the printed lines.
- A runtime `SKIP` names its blocker: the platform, a missing tool or an executor word in the environment. A `SKIP` of BOT-021 still runs its removal step if an install happened.
- The hub is ready only when `node .skilled/bin/compiled-route-admission.cjs --hub system-skilled-bots` reports no drift and no stale gold.
- The runtime is ready only when no runtime scenario is `FAIL` and BOT-021 shows its job file and label gone after uninstall.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- Wave 1: the 8 routing scenarios. They are read-only and parallel-safe.
- Wave 2: BOT-009 to BOT-020 and BOT-022 to BOT-025. Each builds its own temp world, so they can run side by side, but each one runs its block in a single shell from start to finish.
- Wave 3: BOT-021 alone, last, because it writes into the account's launchd domain. Confirm its removal step ran before the wave ends.
- No wave may run from inside an AI runtime session, because the recursion guard would refuse the runs.

---

## 7. HUB ROUTING

Eight scenarios: one or two per mode, the defer contract and one out-of-domain prompt. The frontmatter of each scenario is routing gold, so the admission check replays every prompt through the compiled router.

### BOT-001 | New bot request routes to author

#### Description
Route a request to write a new bot definition to author.

#### Scenario Contract
Prompt summary: `author a bot that summarizes open pull requests every morning`

Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `author` under `skillId: "system-skilled-bots"`

#### Test Execution
> **Feature File:** [BOT-001](hub-routing/author-new-bot.md)

### BOT-002 | Run request for a named bot routes to run

#### Description
Route a by-name run request to run.

#### Scenario Contract
Prompt summary: `run the bot nightly-digest now`

Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `run` under `skillId: "system-skilled-bots"`

#### Test Execution
> **Feature File:** [BOT-002](hub-routing/run-named-bot.md)

### BOT-003 | Weekday schedule request routes to schedule

#### Description
Route a recurring-timing request to schedule.

#### Scenario Contract
Prompt summary: `schedule a bot to run on weekdays at nine`

Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `schedule` under `skillId: "system-skilled-bots"`

#### Test Execution
> **Feature File:** [BOT-003](hub-routing/schedule-weekday-bot.md)

### BOT-004 | Status and last run request routes to status

#### Description
Route a read-only status request to status.

#### Scenario Contract
Prompt summary: `show bot status and the last bot run`

Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `status` under `skillId: "system-skilled-bots"`

#### Test Execution
> **Feature File:** [BOT-004](hub-routing/status-last-run.md)

### BOT-005 | Bot inbox request routes to status

#### Description
Route an inbox read to status.

#### Scenario Contract
Prompt summary: `what do the bots need from me in the bot inbox`

Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `status` under `skillId: "system-skilled-bots"`

#### Test Execution
> **Feature File:** [BOT-005](hub-routing/status-bot-inbox.md)

### BOT-006 | Answer to an open bot question routes to run

#### Description
Route an answer to a bot question to run.

#### Scenario Contract
Prompt summary: `answer the bot's open question with yes`

Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `run` under `skillId: "system-skilled-bots"`

#### Test Execution
> **Feature File:** [BOT-006](hub-routing/run-answer-question.md)

### BOT-007 | Bot request with no mode defers

#### Description
Defer a bot request that names no mode.

#### Scenario Contract
Prompt summary: `help with my headless bots`

Expected signals: the router prints `action: "defer"` with an empty `targets` list

#### Test Execution
> **Feature File:** [BOT-007](hub-routing/hub-only-defer.md)

### BOT-008 | Out-of-domain inbox request defers

#### Description
Defer a request outside the bot domain that shares the word "inbox".

#### Scenario Contract
Prompt summary: `check my email inbox`

Expected signals: the router prints `action: "defer"` with an empty `targets` list

#### Test Execution
> **Feature File:** [BOT-008](hub-routing/out-of-domain-defer.md)

----|--------|------|
| BOT-001 | `author a bot that summarizes open pull requests every morning` | author |
| BOT-002 | `run the bot nightly-digest now` | run |
| BOT-003 | `schedule a bot to run on weekdays at nine` | schedule |
| BOT-004 | `show bot status and the last bot run` | status |
| BOT-005 | `what do the bots need from me in the bot inbox` | status |
| BOT-006 | `answer the bot's open question with yes` | run |
| BOT-007 | `help with my headless bots` | hub selected, mode deferred |
| BOT-008 | `run the tests` | neither stage selects the hub |

---

## 8. BOT AUTHORING (`BOT-009..BOT-011`)

Three scenarios on writing a `BOT.md` and proving it with the definition checker before anything runs it.

### BOT-009 | New bot from the template passes the definition checker

#### Description
Verify the shipped template fails the checker as written and passes once its id and isolation are filled in.

#### Scenario Contract
Prompt: `Start a new bot from the template and tell me whether the checker accepts it.`

Expected signals: the first check exits 1 on `definition.id-invalid`, the second exits 0 with no `FAIL:` line.

#### Test Execution
> **Feature File:** [BOT-009](bot-authoring/author-and-check-bot.md)

### BOT-010 | Definition checker fails each defect by name, a folder mismatch included

#### Description
Verify the checker fails two field defects and a folder mismatch by id, and that `--strict` changes nothing.

#### Scenario Contract
Prompt: `Check my bots folder and tell me exactly which fields are wrong.`

Expected signals: `FAIL: folder-id-mismatch`, `FAIL: budget.timeoutSeconds-out-of-bounds` and `FAIL: isolation-undeclared` with `exit=1`, then `FAIL: folder-id-mismatch` and `exit=1` both without and with `--strict`.

#### Test Execution
> **Feature File:** [BOT-010](bot-authoring/checker-reports-defects.md)

### BOT-011 | A bot left on the native runtime is refused before dispatch

#### Description
Verify a native-runtime bot fails the checker and is refused by `bots run` with exit 4 before any executor starts.

#### Scenario Contract
Prompt: `I set the runtime to native. Check the bot, run it and tell me what happens.`

Expected signals: the checker prints `FAIL: executor-kind-native` with `exit=1`, and the run prints `refused before dispatch (posture-refused): executor-kind-native` with `exit=4`, with no stub receipt.

#### Test Execution
> **Feature File:** [BOT-011](bot-authoring/native-runtime-refused.md)

---

## 9. MANUAL RUN (`BOT-012..BOT-015`)

Four scenarios on `bots run` by hand: a clean completion, a timeout, a run that parks on a question and the answer that resumes it.

### BOT-012 | A manual run completes and leaves one record

#### Description
Verify one manual run dispatches once, exits 0 and leaves one record and one receipt folder.

#### Scenario Contract
Prompt: `Run my test bot now and show me that it finished and left a record.`

Expected signals: `bots: pb-ok run <run id> completed`, `exit=0` and one record with reason `converged`.

#### Test Execution
> **Feature File:** [BOT-012](manual-run/manual-run-completes.md)

### BOT-013 | A run past its timeout fails with an environment class

#### Description
Verify the runner stops a child at `timeoutSeconds` and records the stop as a timeout.

#### Scenario Contract
Prompt: `My bot hangs. Show me the runner stops it at the timeout and says so.`

Expected signals: `failed: timeout (class environment)`, `exit=1` and a wall time well under the stub's 30-second sleep.

#### Test Execution
> **Feature File:** [BOT-013](manual-run/manual-run-timeout.md)

### BOT-014 | A run that asks a question parks and holds the next run

#### Description
Verify a decision marker parks the run with exit 5, shows in the inbox and holds every later run of that bot.

#### Scenario Contract
Prompt: `My bot needs me to decide something. Show me the question and make sure it waits.`

Expected signals: exit 5 naming an item, the inbox listing it with both options, then `refused before dispatch (awaiting-decision-hold)` and exit 4.

#### Test Execution
> **Feature File:** [BOT-014](manual-run/needs-you-park-and-hold.md)

### BOT-015 | Answering a needs-you item resumes the parked run

#### Description
Verify one answer queues one resume request, a repeat stays a duplicate and the drain completes the resumed run.

#### Scenario Contract
Prompt: `Answer my bot's question with keep it and let it finish the job.`

Expected signals: `resume request <request id> enqueued`, then `duplicate: already queued`, then `<request id> ran` and the resumed file in the checkout.

#### Test Execution
> **Feature File:** [BOT-015](manual-run/answer-resumes-parked-run.md)

---

## 10. WORKTREE AND DELIVERY (`BOT-016..BOT-017`)

Two scenarios on where a run works and how it tells the operator it finished.

### BOT-016 | A worktree bot runs in its own tree and the clean tree is removed

#### Description
Verify a worktree run happens under the worktree base and a clean tree is removed, with the record saying so.

#### Scenario Contract
Prompt: `Run my bot in its own worktree so it cannot touch my checkout, and clean up after.`

Expected signals: `completed`, a recorded worktree path under the base, disposition `removed` and only the checkout in `git worktree list`.

#### Test Execution
> **Feature File:** [BOT-016](worktree-and-delivery/worktree-run-cleans-up.md)

### BOT-017 | A desktop delivery target sends one notice and records it

#### Description
Verify a desktop target sends one notice after a completed run and records it as `attempted`.

#### Scenario Contract
Prompt: `Have my bot pop up a desktop notice when it finishes, and show me it was sent.`

Expected signals: one notification, a delivery entry with `"state":"attempted"` and `delivery desktop:attempted` in status.

#### Test Execution
> **Feature File:** [BOT-017](worktree-and-delivery/desktop-delivery-recorded.md)

---

## 11. REQUEST QUEUE (`BOT-018..BOT-019`, `BOT-024..BOT-025`)

Four scenarios on queued runs: a repeated event stays one run, a refused request goes to quarantine instead of looping, a bot whose definition changed after approval is not run, and a commit queues a request without running anything. A queued run uses only an approved definition, so each drain scenario approves its bot with `bots enable` first. BOT-025 queues and never drains, so it needs no approval.

### BOT-018 | An event queued twice runs once when the queue drains

#### Description
Verify a repeated event is one request and the drain runs it once.

#### Scenario Contract
Prompt: `Queue a run for my bot from this event, and make sure a resent event does not run it twice.`

Expected signals: `enqueued` then `duplicate` for one request id, then `<request id> ran` and an empty watched folder.

#### Test Execution
> **Feature File:** [BOT-018](request-queue/enqueue-dedupe-and-drain.md)

### BOT-019 | A request for a paused bot is quarantined, not run

#### Description
Verify a paused bot's request is quarantined with its reason and never dispatched.

#### Scenario Contract
Prompt: `I paused my bot. If an event comes in, make sure it does not run and tell me why.`

Expected signals: `<request id> quarantined: paused`, an empty watched folder and no stub receipt.

#### Test Execution
> **Feature File:** [BOT-019](request-queue/drain-quarantines-paused-bot.md)

### BOT-024 | A request for a bot whose BOT.md changed after approval is quarantined, not run

#### Description
Verify a queued run of a bot whose `BOT.md` changed since approval is quarantined as `definition-drifted` and never dispatched, and that a fresh approval lets the next request run.

#### Scenario Contract
Prompt: `Someone edited my bot's definition. Make sure a queued run does not use the change until I have approved it.`

Expected signals: `<request id> quarantined: definition-drifted` naming the changed `BOT.md` with no stub receipt, then `<request id> ran` after a second `bots enable`.

#### Test Execution
> **Feature File:** [BOT-024](request-queue/drift-refused-before-run.md)

### BOT-025 | A commit in an opted-in repository queues one request and never runs a bot

#### Description
Verify a commit through the real post-commit hook queues one `git-commit` request for a git-hook bot, and that a commit inside a bot run or with the leg switched off queues nothing.

#### Scenario Contract
Prompt: `Queue a review run for my bot every time I commit, but never let a commit wait on the bot.`

Expected signals: every commit `exit=0`, one inbox request keyed `git-commit:<sha>` after the first commit, still one after the run-marker and off-switch commits, and no run record.

#### Test Execution
> **Feature File:** [BOT-025](request-queue/commit-enqueues-request.md)

---

## 12. SCHEDULE LIFECYCLE (`BOT-020..BOT-021`)

Two scenarios on stopping and scheduling a bot. BOT-021 is the only scenario that writes into the account's launchd domain, and it ends by removing what it installed.

### BOT-020 | Pause and disable stop a bot's runs until lifted

#### Description
Verify pause and disable each refuse a run with their own cause, and lifting both lets a run complete.

#### Scenario Contract
Prompt: `Stop my bot from running for now, then let it run again.`

Expected signals: `refused before dispatch (paused)` and `refused before dispatch (disabled)`, each with exit 4, then a completed run.

#### Test Execution
> **Feature File:** [BOT-020](schedule-lifecycle/pause-and-disable-switches.md)

### BOT-021 | A schedule installs held disabled and uninstalls cleanly

#### Description
Verify a first install is linted, held disabled and visible in status, and that uninstall leaves no job file and no loaded label.

#### Scenario Contract
Prompt: `Put my bot on a weekday schedule, but do not let it fire yet. Then take the schedule off again.`

Expected signals: `bots: installed com.skilled.bots.<...>`, `held disabled`, a disabled label, then `bots: removed <label>` and no job file.

#### Test Execution
> **Feature File:** [BOT-021](schedule-lifecycle/schedule-install-held-and-removed.md)

---

## 13. STATUS AND INBOX (`BOT-022..BOT-023`)

Two scenarios on reading what the bots did and what they need.

### BOT-022 | Status says when its index is stale and a rebuild catches up

#### Description
Verify status flags a stale index after a newer run and a rebuild shows that run.

#### Scenario Contract
Prompt: `Show me what my bot did last, and tell me if that answer is out of date.`

Expected signals: a `stale:` line naming `run bots status --rebuild`, then a rebuild of 2 run rows and a row naming the second run.

#### Test Execution
> **Feature File:** [BOT-022](status-and-inbox/status-stale-and-rebuild.md)

### BOT-023 | Status and the inbox agree on an open needs-you item

#### Description
Verify text status, JSON status and the inbox all report the parked item under one id.

#### Scenario Contract
Prompt: `What do my bots need from me right now? Give it to me as JSON too.`

Expected signals: one item id in an `open` status line, in parseable JSON and in the inbox.

#### Test Execution
> **Feature File:** [BOT-023](status-and-inbox/status-json-open-item.md)

---

## 14. AUTOMATED TEST CROSS-REFERENCE

The runtime's vitest suite covers the same behavior with stubbed hosts. These scenarios add the real terminal, the real launchd domain and the real desktop.

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts` | Definition checker invariants | BOT-009, BOT-010 |
| `.skilled/skills/system-skilled-bots/runtime/tests/posture.vitest.ts` | Posture refusals | BOT-011 |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Manual runs and records | BOT-012, BOT-013, BOT-020 |
| `.skilled/skills/system-skilled-bots/runtime/tests/needs-you.vitest.ts` | Parking and holds | BOT-014 |
| `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts` | Answers and resume requests | BOT-015 |
| `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts` | Bot worktrees | BOT-016 |
| `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts` | Delivery claims and states | BOT-017 |
| `.skilled/skills/system-skilled-bots/runtime/tests/dedupe.vitest.ts` | Duplicate events and drains | BOT-018 |
| `.skilled/skills/system-skilled-bots/runtime/tests/quarantine.vitest.ts` | Quarantine routing | BOT-019 |
| `.skilled/skills/system-skilled-bots/runtime/tests/approval.vitest.ts` | Unapproved and drifted definitions | BOT-018, BOT-019, BOT-024 |
| `.skilled/skills/system-skilled-bots/runtime/tests/switches.vitest.ts` | Pause and disable switches | BOT-020 |
| `.skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts` | Install, hold and uninstall | BOT-021 |
| `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts` | Status rows and staleness | BOT-022, BOT-023 |
| `.skilled/skills/system-skilled-bots/runtime/tests/post-commit-leg.test.sh` | The post-commit enqueue leg through the real hook | BOT-025 |

---

## 15. FEATURE CATALOG CROSS-REFERENCE INDEX

The hub's feature inventory lives in [`../feature-catalog/feature-catalog.md`](../feature-catalog/feature-catalog.md). Each scenario maps to the catalog entry it exercises most directly. Five catalog entries have no dedicated scenario: repository config and identity, state layout, cron translation, missed-slot accounting, and the run record and result ledger. The runtime vitest suite covers them in `identity.vitest.ts`, `repo-config.vitest.ts`, `state-root.vitest.ts`, `cron-translator.vitest.ts`, `slot-accounting.vitest.ts`, `run-record.vitest.ts` and `result-ledger.vitest.ts`.

| Feature ID | Feature Name | Category | Feature File | Catalog Entry |
|---|---|---|---|---|
| BOT-001 | New bot request routes to author | Hub Routing | [BOT-001](hub-routing/author-new-bot.md) | [four-mode-hub-routing](../feature-catalog/hub-routing/four-mode-hub-routing.md) |
| BOT-002 | Run request for a named bot routes to run | Hub Routing | [BOT-002](hub-routing/run-named-bot.md) | [four-mode-hub-routing](../feature-catalog/hub-routing/four-mode-hub-routing.md) |
| BOT-003 | Weekday schedule request routes to schedule | Hub Routing | [BOT-003](hub-routing/schedule-weekday-bot.md) | [four-mode-hub-routing](../feature-catalog/hub-routing/four-mode-hub-routing.md) |
| BOT-004 | Status and last run request routes to status | Hub Routing | [BOT-004](hub-routing/status-last-run.md) | [four-mode-hub-routing](../feature-catalog/hub-routing/four-mode-hub-routing.md) |
| BOT-005 | Bot inbox request routes to status | Hub Routing | [BOT-005](hub-routing/status-bot-inbox.md) | [four-mode-hub-routing](../feature-catalog/hub-routing/four-mode-hub-routing.md) |
| BOT-006 | Answer to an open bot question routes to run | Hub Routing | [BOT-006](hub-routing/run-answer-question.md) | [four-mode-hub-routing](../feature-catalog/hub-routing/four-mode-hub-routing.md) |
| BOT-007 | Bot request with no mode defers | Hub Routing | [BOT-007](hub-routing/hub-only-defer.md) | [four-mode-hub-routing](../feature-catalog/hub-routing/four-mode-hub-routing.md) |
| BOT-008 | Out-of-domain inbox request defers | Hub Routing | [BOT-008](hub-routing/out-of-domain-defer.md) | [four-mode-hub-routing](../feature-catalog/hub-routing/four-mode-hub-routing.md) |
| BOT-009 | New bot from the template passes the definition checker | Bot Authoring | [BOT-009](bot-authoring/author-and-check-bot.md) | [bot-definition-contract](../feature-catalog/definition/bot-definition-contract.md) |
| BOT-010 | Definition checker fails each defect by name | Bot Authoring | [BOT-010](bot-authoring/checker-reports-defects.md) | [definition-checker](../feature-catalog/definition/definition-checker.md) |
| BOT-011 | A bot left on the native runtime is refused before dispatch | Bot Authoring | [BOT-011](bot-authoring/native-runtime-refused.md) | [executor-posture-and-secret-guard](../feature-catalog/runs/executor-posture-and-secret-guard.md) |
| BOT-012 | A manual run completes and leaves one record | Manual Run | [BOT-012](manual-run/manual-run-completes.md) | [bot-runner](../feature-catalog/runs/bot-runner.md) |
| BOT-013 | A run past its timeout fails with an environment class | Manual Run | [BOT-013](manual-run/manual-run-timeout.md) | [bot-runner](../feature-catalog/runs/bot-runner.md) |
| BOT-014 | A run that asks a question parks and holds the next run | Manual Run | [BOT-014](manual-run/needs-you-park-and-hold.md) | [needs-you-items](../feature-catalog/operator-loop/needs-you-items.md) |
| BOT-015 | Answering a needs-you item resumes the parked run | Manual Run | [BOT-015](manual-run/answer-resumes-parked-run.md) | [needs-you-answer](../feature-catalog/operator-loop/needs-you-answer.md) |
| BOT-016 | A worktree bot runs in its own tree and the clean tree is removed | Worktree And Delivery | [BOT-016](worktree-and-delivery/worktree-run-cleans-up.md) | [worktree-isolation](../feature-catalog/runs/worktree-isolation.md) |
| BOT-017 | A desktop delivery target sends one notice and records it | Worktree And Delivery | [BOT-017](worktree-and-delivery/desktop-delivery-recorded.md) | [run-delivery](../feature-catalog/operator-loop/run-delivery.md) |
| BOT-018 | An event queued twice runs once when the queue drains | Request Queue | [BOT-018](request-queue/enqueue-dedupe-and-drain.md) | [request-queue](../feature-catalog/requests/request-queue.md) |
| BOT-019 | A request for a paused bot is quarantined, not run | Request Queue | [BOT-019](request-queue/drain-quarantines-paused-bot.md) | [queue-drain](../feature-catalog/requests/queue-drain.md) |
| BOT-020 | Pause and disable stop a bot's runs until lifted | Schedule Lifecycle | [BOT-020](schedule-lifecycle/pause-and-disable-switches.md) | [stop-switches](../feature-catalog/operator-loop/stop-switches.md) |
| BOT-021 | A schedule installs held disabled and uninstalls cleanly | Schedule Lifecycle | [BOT-021](schedule-lifecycle/schedule-install-held-and-removed.md) | [launchd-installer](../feature-catalog/scheduling/launchd-installer.md) |
| BOT-022 | Status says when its index is stale and a rebuild catches up | Status And Inbox | [BOT-022](status-and-inbox/status-stale-and-rebuild.md) | [status-index](../feature-catalog/status/status-index.md) |
| BOT-023 | Status and the inbox agree on an open needs-you item | Status And Inbox | [BOT-023](status-and-inbox/status-json-open-item.md) | [status-and-inbox-report](../feature-catalog/status/status-and-inbox-report.md) |
| BOT-024 | A request for a bot whose BOT.md changed after approval is quarantined | Request Queue | [BOT-024](request-queue/drift-refused-before-run.md) | [definition-approval](../feature-catalog/runs/definition-approval.md) |
| BOT-025 | A commit in an opted-in repository queues one request | Request Queue | [BOT-025](request-queue/commit-enqueues-request.md) | [commit-triggered-requests](../feature-catalog/requests/commit-triggered-requests.md) |
