---
title: "BOT-001 -- New bot request routes to author"
description: "This scenario validates hub routing for `BOT-001`. It focuses on a bot request landing on author."
stage: routing
id: BOT-001
expected_intent: author
expected_resources:
  - bots-author/references/bot-definition.md
expected_workflow_mode: author
expected_leaf_resources:
  - workflow_mode: author
    leaf_resource_id: references/bot-definition.md
version: 1.0.0.0
---

# BOT-001 -- New bot request routes to author

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-001`.

---

## 1. OVERVIEW

The prompt asks for a new bot and names what it should do, so the hub routes to `author`. It also says "every morning", a timing word, so this scenario checks that a definition request does not drift to `schedule`.

### Why This Matters

Writing a bot and scheduling it are separate steps. A definition request must not install a schedule.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-001` and confirm the expected signals without contradictory evidence.

- Objective: Route a request to write a new bot definition to author.
- Real user request: `author a bot that summarizes open pull requests every morning`
- Prompt: `author a bot that summarizes open pull requests every morning`
- Expected execution process: run the command in section 3 from the repository root, read the JSON the router prints and its exit status, then judge them against the pass/fail criteria.
- Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `author` under `skillId: "system-skilled-bots"`
- Desired user-visible outcome: The request lands on `author`.
- Pass/fail: PASS if the router routes to `author`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `author a bot that summarizes open pull requests every morning`

### Commands

1. `node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "author a bot that summarizes open pull requests every morning"`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BOT-001 | Hub Routing | New bot request routes to author | `author a bot that summarizes open pull requests every morning` | 1. `node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "author a bot that summarizes open pull requests every morning"` | the router prints `action: "route"` with one target whose `workflowMode` is `author` under `skillId: "system-skilled-bots"` | The exact command, its exit status and the full JSON. | PASS if the router routes to `author`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure. | Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass. |

### Expected

- `"action":"route"`
- `"workflowMode":"author"`
- Exit 0

### Evidence

The exact command, its exit status and the full JSON.

### Pass / Fail

- **Pass**: the router routes to `author`.
- **Fail**: it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure.

### Failure Triage

1. Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`.
2. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `hub-routing/author-new-bot.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/hub-router.json` | The stage-two vocabulary the compiled router reads |
| `.skilled/skills/system-skilled-bots/mode-registry.json` | The workflow modes and their aliases |
| `.skilled/skills/system-skilled-bots/ROUTER.md` | The prose router and its resource map |
| `.skilled/bin/compiled-route-admission.cjs` | Replays this page prompt against its gold |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: BOT-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/author-new-bot.md`
