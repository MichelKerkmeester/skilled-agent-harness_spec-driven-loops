---
title: "system-skilled-bots: Manual Testing Playbook"
description: "Operator index for system-skilled-bots hub routing across its four bot modes, the inbox and answer verbs, and the out-of-domain probes."
version: 1.0.0.0
---

# system-skilled-bots: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario runs for real, never mocked or stubbed. Operators run the actual commands, read the real output and record it. The only verdicts are `PASS`, `FAIL` or `SKIP`, and every `SKIP` names its blocker.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **COMPLETION**: A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded into `.skilled/skills/system-skilled-bots/benchmark/reports/<dated-run-label>/`. A run never edits this corpus.

This is the hub-level operator index for four modes: author, run, schedule and status. It checks which mode the hub picks for a request. No scenario runs a bot, installs a schedule or calls an executor.

---

## 1. OVERVIEW

The playbook holds 8 routing scenarios in one category: one per mode, one each for the inbox and answer verbs, a defer case and an out-of-domain case. The frontmatter of each scenario is routing gold, so the admission check replays every prompt through the compiled router.

### Realistic Test Model

1. An operator phrases a bot request the way a user would.
2. The advisor picks the hub, and the hub's router picks a mode or defers.
3. The operator records each command, its output and its exit status.
4. The scenario passes only when both stages match the gold.

---

## 2. GLOBAL PRECONDITIONS

- The working directory is the repository root.
- The advisor index includes `system-skilled-bots`.
- No bot, schedule, account or network is needed. Routing reads only the hub files and the advisor index.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Stage one: `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>" --threshold 0.5`, with the first result and its score.
- Stage two: the intent the root `ROUTER.md` keyword block selects for the same prompt, and the full JSON `compiled-route.cjs` prints, with its `effectivePolicyHash`.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Each scenario runs the two stage commands above on the prompt exactly as the scenario gives it.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

- A scenario passes only when stage one returns `system-skilled-bots` above threshold and stage two selects the gold mode, or both miss for an out-of-domain prompt.
- A drift is a routing finding for the routing owner. The prompt and the gold stay as they are.
- The hub is ready only when `node .skilled/bin/compiled-route-admission.cjs --hub system-skilled-bots` reports no drift and no stale gold.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- All 8 scenarios are read-only and parallel-safe. Run them in one wave.

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

## 8. FEATURE CATALOG CROSS-REFERENCE INDEX

The hub has no feature catalog.
