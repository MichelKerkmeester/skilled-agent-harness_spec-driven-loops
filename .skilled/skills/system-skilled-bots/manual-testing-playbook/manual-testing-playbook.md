---
title: "system-skilled-bots: Manual Testing Playbook"
description: "Operator index for system-skilled-bots: hub routing across its four bot modes, and runtime scenarios that author, run, queue, isolate, deliver, schedule, report, converse, remember, link a channel and drive the terminal screen on throwaway bots."
version: 1.3.1.0
---

# system-skilled-bots: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario runs for real. Operators run the actual commands, read the real output and record it. The one stand-in is the model: the runtime scenarios put the shipped test executor, `runtime/tests/fixtures/stub-executor`, first on PATH, so the real runner, recursion guard, records, queue, worktree, delivery, installer and status code run end to end and no model is called. The only verdicts are `PASS`, `FAIL` or `SKIP`, and every `SKIP` names its blocker.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **COMPLETION**: A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded into `.skilled/skills/system-skilled-bots/benchmark/reports/<dated-run-label>/`. A run never edits this corpus.

This is the operator index for the bots hub and its runtime. The routing scenarios check which mode the hub picks for a request and run nothing. The runtime scenarios build a throwaway world for each test and drive `.skilled/bin/bots.cjs` in it: authoring and the definition checker, manual runs, needs-you items and answers, worktree isolation and delivery, the request queue, the launchd schedule and status, chat and its proposals, routines, activity, the terminal screen, the working place, memory, apps, the vault, skills and channels.

---

## 1. OVERVIEW

The playbook holds 58 scenarios in seventeen categories. The 8 hub-routing scenarios carry routing gold in their frontmatter, so the admission check replays every prompt through the compiled router. The 50 runtime scenarios carry no routing fields: they are operator scenarios, and the admission check never reads them.

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
- BOT-043 to BOT-045 need `cargo` and the phase 003 crate at `crates/bots-tui`. BOT-058 needs one free local port for its stand-in daemon and no channel account, because the stand-in never reaches a network.
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
- `pbots <verb> ...` runs `.skilled/bin/bots.cjs` with HOME inside the world, PATH starting at the stub executor and `--repo` pointing into the world, plus `--skilled-tree` when the scenario needs a skill tree.
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
- Wave 3: BOT-026 to BOT-042 and BOT-046 to BOT-057. Each builds its own temp world, so they can run side by side, and each one runs its block in a single shell from start to finish.
- Wave 4: BOT-043 to BOT-045, which need `cargo` and the phase 003 crate. Run them after the crate lands.
- Wave 5: BOT-058, which needs one free local port for its stand-in daemon. Run it alone so the port is not taken.
- Wave 6: BOT-021 alone, last, because it writes into the account's launchd domain. Confirm its removal step ran before the wave ends.
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

## 14. CONVERSATIONS (`BOT-026..BOT-034`)

Nine scenarios on `bots chat`: one message and its transcript, the at-bot address, the parked answer and its scope, the grants on the item, the two proposals and the two channel paths.

### BOT-026 | A chat message appends one human and one bot message

#### Description
Verify a chat message appends one human and one bot message.

#### Scenario Contract
Prompt: `Send my bot a message and show me it answered, with the conversation saved.`

Expected signals: `bots: pb-chat run <run id> completed` with `exit=0`, a transcript object carrying `"version":1` and two messages whose `role` values are `human` and `bot`, a line count of `2`, and one `pb-chat` record.

#### Test Execution
> **Feature File:** [BOT-026](conversations/chat-appends-one-message.md)

### BOT-027 | An at-bot address routes the message and an unknown bot is refused

#### Description
Verify an at-bot address routes the message and an unknown bot is refused.

#### Scenario Contract
Prompt: `Send this to my other bot, and tell me when I name a bot that does not exist.`

Expected signals: the first send prints `bots: pb-other run <run id> completed` with `exit=0`, the second prints `bots: bot-unknown: pb-missing` with `exit=4`, the transcript holds one message whose `botId` is `pb-other`, and the line count is `2`.

#### Test Execution
> **Feature File:** [BOT-027](conversations/at-bot-routing.md)

### BOT-028 | A parked chat run is answered with scope once and the resume replies

#### Description
Verify a parked chat run is answered with scope once and the resume replies.

#### Scenario Contract
Prompt: `My bot asked me something in chat. Answer it and let it finish, then show me the whole exchange.`

Expected signals: the send exits 5 with `is waiting on a decision: item <item id>`, the item's `answer.scope` is `once`, the answer prints `resume request <request id> enqueued` with `exit=0`, the drain prints `<request id> ran`, and the transcript holds four messages.

#### Test Execution
> **Feature File:** [BOT-028](conversations/park-answer-scope-once.md)

### BOT-029 | A denied scope records a denial and an unsupported scope is refused

#### Description
Verify a denied scope records a denial and an unsupported scope is refused.

#### Scenario Contract
Prompt: `I said no to my bot twice. Show me both refusals were recorded as refusals, and that a scope it does not support is rejected instead of stored.`

Expected signals: the first answer exits 0 and its grant reads `deny`, the `--scope always` answer exits 2 with `bots: --scope takes once or deny` and the item stays open, the bare `no` answer exits 0 and its grant reads `deny`, and both run records carry a `request.grant` object whose scope is `deny`.

#### Test Execution
> **Feature File:** [BOT-029](conversations/scope-deny-and-unsupported.md)

### BOT-030 | The grant rides on the item, on the inbox line and on the resumed run

#### Description
Verify the grant rides on the item, on the inbox line and on the resumed run.

#### Scenario Contract
Prompt: `Before I answer my bot, show me what kind of action it is asking about. Then show me the same thing after I answer.`

Expected signals: the plain inbox line carries the action kind, the rung and `-` for the scope, the JSON row carries a `grants` object with six keys, the copied item lists with `grants` reading `null`, and the resumed run's `request.grant` names the same item id and kind.

#### Test Execution
> **Feature File:** [BOT-030](conversations/grants-on-the-item.md)

### BOT-031 | A remember line becomes a proposal and only confirm appends it

#### Description
Verify a remember line becomes a proposal and only confirm appends it.

#### Scenario Contract
Prompt: `My bot wants to remember something. Show me the proposal, refuse a bad answer, then let me confirm one and reject another.`

Expected signals: the run ends `completed` with exit 0, the inbox lists one `memory-proposal` item under `memory-proposals` with both options, the bad answer exits 4 with `review-answer-invalid`, the confirm appends one entry naming the operator and `bot:pb-ask`, and the reject leaves the entry count unchanged.

#### Test Execution
> **Feature File:** [BOT-031](conversations/memory-proposal-confirm.md)

### BOT-032 | A skill proposal writes a draft and a review item, and a stale target is refused

#### Description
Verify a skill proposal writes a draft and a review item, and a stale target is refused.

#### Scenario Contract
Prompt: `My bot wrote something worth keeping as a skill. Draft it, show me the draft, then refuse it because I changed the file in the meantime.`

Expected signals: the propose exits 0 and prints the draft path, `proposal.json` holds five keys with `revisionRead` reading `null`, the inbox lists one `skill-proposal` item under `skill-proposals`, the unknown run id exits 4 with `run-record-missing`, and the answer exits 4 with `proposal-stale` while the item stays open.

#### Test Execution
> **Feature File:** [BOT-032](conversations/skill-proposal-review.md)

### BOT-033 | A terminal chat links with a one-time code and answers a prompt by number

#### Description
Verify a terminal chat links with a one-time code and answers a prompt by number.

#### Scenario Contract
Prompt: `Link my terminal chat to my bot, then answer its question with a number and let it finish.`

Expected signals: the first send exits 4 with `channel-unlinked`, the first link exits 4 with `channel-roster-missing`, the second link prints six digits, the code send links the chat, the prompt prints with numbered choices, the `1` closes the item with the scope `once` and the drain prints one `ran` line.

#### Test Execution
> **Feature File:** [BOT-033](conversations/channel-link-and-reply.md)

### BOT-034 | A chat whose actor left the roster cannot answer an item

#### Description
Verify a chat whose actor left the roster cannot answer an item.

#### Scenario Contract
Prompt: `I removed myself from the channel roster. Show me my chat can no longer answer my bot, and that the bot is still waiting.`

Expected signals: the list prints one owner and one member, the last-owner removal exits 4 with `channel-roster-owner`, the answer exits 4 with `answer-not-approver`, the item is still open with a null answer and the drain prints no `ran` line.

#### Test Execution
> **Feature File:** [BOT-034](conversations/channel-non-approver.md)

---

## 15. ROUTINES (`BOT-035..BOT-039`)

Five scenarios on the routine block, the cron slot computed from the current clock, the until check, the fifteen-minute floor and fatigue after ten failures.

### BOT-035 | A routine block renders on the routines verb and its conflicts are refused

#### Description
Verify a routine block renders on the routines verb and its conflicts are refused.

#### Scenario Contract
Prompt: `Show me every routine in this repo with what it does and when it runs, then tell me why these two bots are rejected.`

Expected signals: the empty list exits 0, the valid bot renders one row with its what, its summary, `act` and its until, the JSON object carries all ten fields, and the two conflicts exit 4 with `routine-trigger-conflict` and `routine-tell-with-targets`.

#### Test Execution
> **Feature File:** [BOT-035](routines/routine-block-renders.md)

### BOT-036 | A cron start fires at the slot computed from the current clock

#### Description
Verify a cron start fires at the slot computed from the current clock.

#### Scenario Contract
Prompt: `Set my bot to run two minutes from now, wait for it, and show me it actually ran. Then show me why a one-minute schedule is rejected.`

Expected signals: the summary names the computed hour and minute, the install prints a next-fire line naming the same slot, one run record exists after the slot, and the one-minute cron exits 4 with `routine-floor-15-minutes`.

#### Test Execution
> **Feature File:** [BOT-036](routines/cron-start-fires-at-computed-slot.md)

### BOT-037 | An until check sets completed only when it exits zero

#### Description
Verify an until check sets completed only when it exits zero.

#### Scenario Contract
Prompt: `My bot should stop once its summary exists. Run it until that happens, then show me it refuses to run again.`

Expected signals: the first record carries `until.met` false, the second carries true with `untilMetAt` stamped, the routine row reads `completed`, the next run exits 4 with `routine-completed`, and the three malformed bots exit 4 with their own names.

#### Test Execution
> **Feature File:** [BOT-037](routines/until-outcome-completes.md)

### BOT-038 | A cron under fifteen minutes is refused by the run and by the install

#### Description
Verify a cron under fifteen minutes is refused by the run and by the install.

#### Scenario Contract
Prompt: `Show me the shortest schedule my bot is allowed to have, and that anything faster is rejected before it is installed.`

Expected signals: the five-minute and fourteen-minute bots exit 4 with `routine-floor-15-minutes` on both verbs, the fifteen-minute bot exits 0 on both, and the list holds one row.

#### Test Execution
> **Feature File:** [BOT-038](routines/floor-fifteen-minutes.md)

### BOT-039 | Ten consecutive failures fatigue a bot and one enable brings it back

#### Description
Verify ten consecutive failures fatigue a bot and one enable brings it back.

#### Scenario Contract
Prompt: `My bot keeps failing. Show me it stops after ten tries, then turn it back on and show me it runs again.`

Expected signals: the tenth run sets `switch` to `fatigued` with `failureStreak` reading `10`, the inbox lists one item under `pb-fail`, the next run exits 4 with `routine-fatigued`, the enable exits 0 and answers the item, and the row returns to `enabled` with a zero streak.

#### Test Execution
> **Feature File:** [BOT-039](routines/fatigue-after-ten-failures.md)

---

## 16. ACTIVITY (`BOT-040..BOT-042`)

Three scenarios on the grouped activity view, the JSON inbox fields and the actor on the answer and the record.

### BOT-040 | Activity prints its rows under the seven ids in one fixed order

#### Description
Verify activity prints its rows under the seven ids in one fixed order.

#### Scenario Contract
Prompt: `Show me everything my bots are doing, grouped, and in the same order every time.`

Expected signals: the plain output carries the groups `needs_you`, `done`, `stopped` and `failed` in that order with no `working`, `scheduled` or `recurring` heading, and the JSON output carries the same four groups with `id`, `title` and `rows`, each row carrying `botId`, `identity`, `state`, `at`, `actor` and `runId`.

#### Test Execution
> **Feature File:** [BOT-040](activity/activity-groups-seven-ids.md)

### BOT-041 | The JSON inbox carries ten fields and hides an answered item until all is asked

#### Description
Verify the JSON inbox carries ten fields and hides an answered item until all is asked.

#### Scenario Contract
Prompt: `Show me my open questions as JSON, then show me the one I answered, then show me one that timed out.`

Expected signals: the first read carries one row with ten fields, the second carries no row, the third carries the answered row with its answer, and the fourth carries the copied row reading `expired`.

#### Test Execution
> **Feature File:** [BOT-041](activity/inbox-json-item-fields.md)

### BOT-042 | The actor rides on the run record and the answer names its approver

#### Description
Verify the actor rides on the run record and the answer names its approver.

#### Scenario Contract
Prompt: `Show me who asked for each run and who approved it, and show me a script cannot pretend to be someone else.`

Expected signals: the first record's `actor` is the OS user, the foreign `--as` exits 2 with `bots: --as needs a tty`, the self `--as` exits 0, the resumed record carries `actor` and `answeredBy`, and the activity row prints the actor.

#### Test Execution
> **Feature File:** [BOT-042](activity/actor-on-answer-and-record.md)

---

## 17. TERMINAL SCREEN (`BOT-043..BOT-045`)

Three scenarios on the `ui` refusal, the inbox pane keys and the drawn key set. All three run without a tty.

### BOT-043 | The ui verb refuses a missing crate and a missing binary, and the crate is MIT

#### Description
Verify the ui verb refuses a missing crate and a missing binary, and the crate is MIT.

#### Scenario Contract
Prompt: `Show me what happens when the screen is not built, and prove the crate carries the right licence.`

Expected signals: the first run exits 4 with `ui-unavailable`, the second exits 4 with `ui-not-built` and the build command, the stub run exits with the stub's own code, the licence line reads `license = "MIT"` and the source search matches only comment lines.

#### Test Execution
> **Feature File:** [BOT-043](terminal-screen/screen-refuses-without-binary.md)

### BOT-044 | The inbox pane answers with y and n and a closed input writes nothing

#### Description
Verify the inbox pane answers with y and n and a closed input writes nothing.

#### Scenario Contract
Prompt: `Show me that y approves and n refuses, that nothing else refuses, and that closing the screen answers nothing.`

Expected signals: the test passes, the argv log holds one `--scope once` line for `y` and one `--scope deny` line for `n`, no other key produces an answer line, and the closed-input case leaves the item open.

#### Test Execution
> **Feature File:** [BOT-044](terminal-screen/inbox-pane-answers.md)

### BOT-045 | Every bound key is drawn in the frame that binds it

#### Description
Verify every bound key is drawn in the frame that binds it.

#### Scenario Contract
Prompt: `Show me every key the screen binds is on the screen, and that the four tabs are there.`

Expected signals: both tests pass, the source search finds the four footer labels, the `Enter open` label, the decision overlay's four keys with `n deny` first and the choice overlay's three labels.

#### Test Execution
> **Feature File:** [BOT-045](terminal-screen/banner-and-overlay.md)

---

## 18. WORKING PLACE (`BOT-046..BOT-047`)

Two scenarios on the working-place line the prompt carries and the branch and tree status prints.

### BOT-046 | The prompt names the working place, its branch and the run folder

#### Description
Verify the prompt names the working place, its branch and the run folder.

#### Scenario Contract
Prompt: `Show me what my bot is told about where it works, for a shared run, a worktree run and a detached checkout.`

Expected signals: the shared line names the checkout and its branch, the worktree line names the tree, the detached line carries no branch clause, and each record's `evidence.branch` matches its line.

#### Test Execution
> **Feature File:** [BOT-046](working-place/working-place-line.md)

### BOT-047 | Status prints the branch and the worktree the last run recorded

#### Description
Verify status prints the branch and the worktree the last run recorded.

#### Scenario Contract
Prompt: `Show me which branch and which tree each of my bots last ran on, including the one that never ran.`

Expected signals: the shared row carries `branch <name>`, the worktree row carries `worktree <path>`, every JSON row carries both keys as a string or null, the never-run row carries neither part, and the index reports schema version `2`.

#### Test Execution
> **Feature File:** [BOT-047](working-place/status-branch-and-worktree.md)

---

## 19. MEMORY (`BOT-048..BOT-050`)

Three scenarios on `remember`, the injected memory block and the file bounds.

### BOT-048 | Remember appends one line, lists it and forgets it by id

#### Description
Verify remember appends one line, lists it and forgets it by id.

#### Scenario Contract
Prompt: `Remember two things for me, show me the list, then forget the first one and show me the list again.`

Expected signals: each append prints its 1-based index, the list prints both entries with their 8-hex ids and the file path with counts, the JSON object carries seven keys and an `id` on each entry, the forget by id prints the removed entry's id, the number and the unknown id each exit 2 and the second list holds no entry.

#### Test Execution
> **Feature File:** [BOT-048](memory/remember-appends-and-lists.md)

### BOT-049 | The memory block reaches the prompt and a false flag keeps it out

#### Description
Verify the memory block reaches the prompt and a false flag keeps it out.

#### Scenario Contract
Prompt: `Show me my notes reaching my bot, then show me a bot that is told to ignore them.`

Expected signals: the first prompt carries two `<memory file="...">` blocks with the shared one first, the second carries none, the third exits 4 with `memory-invalid`, and the fourth carries no memory block.

#### Test Execution
> **Feature File:** [BOT-049](memory/memory-block-injected.md)

### BOT-050 | The memory file refuses a sixty-first entry, a long text and an unsafe bot id

#### Description
Verify the memory file refuses a sixty-first entry, a long text and an unsafe bot id.

#### Scenario Contract
Prompt: `Fill my notes to the limit, show me the next one is refused, and show me the file is private.`

Expected signals: the sixty-first exits 4 with `memory-full` naming the path and both counts and the forget command that frees a line, the two checksums match, the long text exits 2 with `memory-entry-too-long`, the folder reads `700` and the file `600`, and the unsafe id is refused by name.

#### Test Execution
> **Feature File:** [BOT-050](memory/memory-bound-refuses.md)

---

## 20. APPS (`BOT-051..BOT-052`)

Two scenarios on the apps filter and an unknown server name.

### BOT-051 | A bot's apps filter the run's utcp config and reach the child

#### Description
Verify a bot's apps filter the run's utcp config and reach the child.

#### Scenario Contract
Prompt: `Show me my bot only gets the two servers it asked for, and show me the file it actually reads.`

Expected signals: the first run's filtered config holds two templates, its record carries the two names and its environment names the filtered path, and the second run's filtered config holds none and its record carries an empty list.

#### Test Execution
> **Feature File:** [BOT-051](apps/apps-filter-utcp-config.md)

### BOT-052 | An unknown app name is refused by name and the checker fails on it

#### Description
Verify an unknown app name is refused by name and the checker fails on it.

#### Scenario Contract
Prompt: `I typed the server names wrong. Show me every name you cannot find, and show me the checker catches it before the bot runs.`

Expected signals: the first run exits 4 with both unknown names in the detail, the checker prints one `FAIL:` line naming `apps-unknown-server` and exits 1, both malformed bots exit 4 with `apps-invalid`, and the shared bot exits 4 with `apps-unenforceable`.

#### Test Execution
> **Feature File:** [BOT-052](apps/apps-unknown-server.md)

---

## 21. VAULT (`BOT-053..BOT-055`)

Three scenarios on `secret set`, the secret reaching the child and the redaction of a printed secret.

### BOT-053 | Secret set reads stdin, list prints no value and forget is idempotent

#### Description
Verify secret set reads stdin, list prints no value and forget is idempotent.

#### Scenario Contract
Prompt: `Store a token for me, show me the list without showing the token, then remove it twice.`

Expected signals: the store exits 0, the list names the entry and prints no value, the argument form exits 2, the empty value exits 2 with `secret-empty`, both forgets exit 0 and the closed stdin exits 2 with `secret-no-input`.

#### Test Execution
> **Feature File:** [BOT-053](vault/secret-set-and-list.md)

### BOT-054 | A named secret reaches the child environment and the record names it

#### Description
Verify a named secret reaches the child environment and the record names it.

#### Scenario Contract
Prompt: `Give my bot its token, show me it arrived, and show me the record names the token without holding it.`

Expected signals: the first run exits 0, the receipt carries `SKILLED_BOT_SECRET_PB_TOKEN` with the value, the record's `posture.secretsUsed` reads `["PB_TOKEN"]`, the absent name exits 4 with `secret-unknown` and the malformed name is refused `secret-name-invalid`.

#### Test Execution
> **Feature File:** [BOT-054](vault/secret-reaches-child.md)

### BOT-055 | A secret printed by the child is redacted and the run is not delivered

#### Description
Verify a secret printed by the child is redacted and the run is not delivered.

#### Scenario Contract
Prompt: `My bot printed its token by accident. Show me the log is cleaned, the run is held, and a token in the bot file is refused.`

Expected signals: the log line reads the redaction marker rather than the value, the record carries `secret-in-output`, the delivery is withheld, and the second run exits 4 with `body-secret`.

#### Test Execution
> **Feature File:** [BOT-055](vault/secret-in-output-redacted.md)

---

## 22. SKILLS (`BOT-056..BOT-057`)

Two scenarios on the skill block and the two byte caps.

### BOT-056 | A named skill's body reaches the prompt inside its own block

#### Description
Verify a named skill's body reaches the prompt inside its own block.

#### Scenario Contract
Prompt: `Give my bot the notes skill, show me the body arrived in its own block, and show me a missing skill is refused.`

Expected signals: the prompt carries one `<skill_content name="pb-notes">` block holding the body, the block sits after the memory block and before the standing body, the missing name exits 4 with `skills-unknown`, and the checker prints one `FAIL:` line naming it.

#### Test Execution
> **Feature File:** [BOT-056](skills/skills-list-injects-body.md)

### BOT-057 | Both byte caps refuse before the prompt is built

#### Description
Verify both byte caps refuse before the prompt is built.

#### Scenario Contract
Prompt: `Show me the skill size caps refusing, tell me which skill crossed the list cap, and show me a duplicate name refused.`

Expected signals: the body at 16,384 bytes runs, the body at 16,385 bytes exits 4 with `skill-too-large`, the list at 20,481 bytes exits 4 with `skills-over-budget: pb-sum-b`, the duplicate exits 4 with `definition-malformed: skills-duplicate`, the bad name exits 4 with `definition-malformed: skills-name-invalid`, and the checker prints one `FAIL: skills-too-large` line and one `FAIL: skills-over-budget` line.

#### Test Execution
> **Feature File:** [BOT-057](skills/skills-over-budget.md)

---

## 23. CHANNELS (`BOT-058`)

One scenario on the durable send queue, the `unknown` state and the channel list.

### BOT-058 | A queued send is written before the I/O and an unknown send is never retried

#### Description
Verify a queued send is written before the I/O and an unknown send is never retried.

#### Scenario Contract
Prompt: `Show me a send that lands in the queue first, show me an uncertain send is never retried, and show me the queue depth in the channel list.`

Expected signals: one file in `queue/`, the entry holding `unknown`, the stand-in's request log holding one line after two drain passes, the `signal` line of `channel list` holding a `1`, no token value anywhere under `queue/`, and `DELIVERY_CHANNELS` holding five names.

#### Test Execution
> **Feature File:** [BOT-058](channels/queue-unknown-not-retried.md)

---
## 24. AUTOMATED TEST CROSS-REFERENCE

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
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/conversation.vitest.ts` | Chat transcripts and the at-bot address | BOT-026, BOT-027 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/cli-chat.vitest.ts` | The chat verb and its transcript | BOT-026 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/approval-ladder.vitest.ts` | The approval rung and the answer scope | BOT-028, BOT-029 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/action-kind.vitest.ts` | The action kind on the item and the inbox line | BOT-030 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/routine.vitest.ts` | Routine blocks, cron slots, until and the floor | BOT-035, BOT-036, BOT-037, BOT-038 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/routine-state.vitest.ts` | Fatigue and the routine switches | BOT-039 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/activity.vitest.ts` | Activity groups and the JSON inbox | BOT-040, BOT-041 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/actor.vitest.ts` | The actor on the record and the answer | BOT-042 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts` | The ui refusal and the build command | BOT-043 |
| `.skilled/skills/system-skilled-bots/crates/bots-tui/tests/cli_client.rs` | The client and the stub binary | BOT-043 |
| `.skilled/skills/system-skilled-bots/crates/bots-tui/tests/answer_flow.rs` | The inbox pane keys | BOT-044 |
| `.skilled/skills/system-skilled-bots/crates/bots-tui/tests/render_keys.rs` | The drawn key set | BOT-045 |
| `.skilled/skills/system-skilled-bots/crates/bots-tui/tests/panes.rs` | The four tabs | BOT-045 |
| `.skilled/skills/system-skilled-bots/runtime/tests/run-record.vitest.ts` | The working-place line on the record | BOT-046 |
| `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts` | The working-place line in the prompt | BOT-046 |
| `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts` | The branch and the tree on the status row | BOT-047 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/memory.vitest.ts` | Memory append, block and bounds | BOT-048, BOT-049, BOT-050 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/apps.vitest.ts` | The apps filter and unknown servers | BOT-051, BOT-052 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` | Secret set and list | BOT-053 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/secret-matcher.vitest.ts` | Redaction and the literal check | BOT-054, BOT-055 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/skills.vitest.ts` | Skill loading and the two byte caps | BOT-056, BOT-057 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/skill-proposal.vitest.ts` | The skill proposal and its review item | BOT-032 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/channel-link.vitest.ts` | The link code and the roster | BOT-033, BOT-034 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/channel-approval.vitest.ts` | The approval index and the reply grammar | BOT-033 |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/channel-queue.vitest.ts` | The durable send queue and the unknown state | BOT-058 |

---

## 25. FEATURE CATALOG CROSS-REFERENCE INDEX

The hub's feature inventory lives in [`../feature-catalog/feature-catalog.md`](../feature-catalog/feature-catalog.md). Each scenario maps to the catalog entry it exercises most directly. Five catalog entries have no dedicated scenario: repository config and identity, state layout, cron translation, missed-slot accounting, and the run record and result ledger. The 33 rows from BOT-026 on carry a dash in the last column, because the feature catalog has no entry for those features yet and a link to a near neighbour would claim coverage the catalog does not hold. The runtime vitest suite covers them in `identity.vitest.ts`, `repo-config.vitest.ts`, `state-root.vitest.ts`, `cron-translator.vitest.ts`, `slot-accounting.vitest.ts`, `run-record.vitest.ts` and `result-ledger.vitest.ts`.

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
| BOT-026 | A chat message appends one human and one bot message | Conversations | [BOT-026](conversations/chat-appends-one-message.md) | - |
| BOT-027 | An at-bot address routes the message and an unknown bot is refused | Conversations | [BOT-027](conversations/at-bot-routing.md) | - |
| BOT-028 | A parked chat run is answered with scope once and the resume replies | Conversations | [BOT-028](conversations/park-answer-scope-once.md) | - |
| BOT-029 | A denied scope records a denial and an unsupported scope is refused | Conversations | [BOT-029](conversations/scope-deny-and-unsupported.md) | - |
| BOT-030 | The grant rides on the item, on the inbox line and on the resumed run | Conversations | [BOT-030](conversations/grants-on-the-item.md) | - |
| BOT-031 | A remember line becomes a proposal and only confirm appends it | Conversations | [BOT-031](conversations/memory-proposal-confirm.md) | - |
| BOT-032 | A skill proposal writes a draft and a review item, and a stale target is refused | Conversations | [BOT-032](conversations/skill-proposal-review.md) | - |
| BOT-033 | A terminal chat links with a one-time code and answers a prompt by number | Conversations | [BOT-033](conversations/channel-link-and-reply.md) | - |
| BOT-034 | A chat whose actor left the roster cannot answer an item | Conversations | [BOT-034](conversations/channel-non-approver.md) | - |
| BOT-035 | A routine block renders on the routines verb and its conflicts are refused | Routines | [BOT-035](routines/routine-block-renders.md) | - |
| BOT-036 | A cron start fires at the slot computed from the current clock | Routines | [BOT-036](routines/cron-start-fires-at-computed-slot.md) | - |
| BOT-037 | An until check sets completed only when it exits zero | Routines | [BOT-037](routines/until-outcome-completes.md) | - |
| BOT-038 | A cron under fifteen minutes is refused by the run and by the install | Routines | [BOT-038](routines/floor-fifteen-minutes.md) | - |
| BOT-039 | Ten consecutive failures fatigue a bot and one enable brings it back | Routines | [BOT-039](routines/fatigue-after-ten-failures.md) | - |
| BOT-040 | Activity prints its rows under the seven ids in one fixed order | Activity | [BOT-040](activity/activity-groups-seven-ids.md) | - |
| BOT-041 | The JSON inbox carries ten fields and hides an answered item until all is asked | Activity | [BOT-041](activity/inbox-json-item-fields.md) | - |
| BOT-042 | The actor rides on the run record and the answer names its approver | Activity | [BOT-042](activity/actor-on-answer-and-record.md) | - |
| BOT-043 | The ui verb refuses a missing crate and a missing binary, and the crate is MIT | Terminal Screen | [BOT-043](terminal-screen/screen-refuses-without-binary.md) | - |
| BOT-044 | The inbox pane answers with y and n and a closed input writes nothing | Terminal Screen | [BOT-044](terminal-screen/inbox-pane-answers.md) | - |
| BOT-045 | Every bound key is drawn in the frame that binds it | Terminal Screen | [BOT-045](terminal-screen/banner-and-overlay.md) | - |
| BOT-046 | The prompt names the working place, its branch and the run folder | Working Place | [BOT-046](working-place/working-place-line.md) | - |
| BOT-047 | Status prints the branch and the worktree the last run recorded | Working Place | [BOT-047](working-place/status-branch-and-worktree.md) | - |
| BOT-048 | Remember appends one line, lists it and forgets it by id | Memory | [BOT-048](memory/remember-appends-and-lists.md) | - |
| BOT-049 | The memory block reaches the prompt and a false flag keeps it out | Memory | [BOT-049](memory/memory-block-injected.md) | - |
| BOT-050 | The memory file refuses a sixty-first entry, a long text and an unsafe bot id | Memory | [BOT-050](memory/memory-bound-refuses.md) | - |
| BOT-051 | A bot's apps filter the run's utcp config and reach the child | Apps | [BOT-051](apps/apps-filter-utcp-config.md) | - |
| BOT-052 | An unknown app name is refused by name and the checker fails on it | Apps | [BOT-052](apps/apps-unknown-server.md) | - |
| BOT-053 | Secret set reads stdin, list prints no value and forget is idempotent | Vault | [BOT-053](vault/secret-set-and-list.md) | - |
| BOT-054 | A named secret reaches the child environment and the record names it | Vault | [BOT-054](vault/secret-reaches-child.md) | - |
| BOT-055 | A secret printed by the child is redacted and the run is not delivered | Vault | [BOT-055](vault/secret-in-output-redacted.md) | - |
| BOT-056 | A named skill's body reaches the prompt inside its own block | Skills | [BOT-056](skills/skills-list-injects-body.md) | - |
| BOT-057 | Both byte caps refuse before the prompt is built | Skills | [BOT-057](skills/skills-over-budget.md) | - |
| BOT-058 | A queued send is written before the I/O and an unknown send is never retried | Channels | [BOT-058](channels/queue-unknown-not-retried.md) | - |
