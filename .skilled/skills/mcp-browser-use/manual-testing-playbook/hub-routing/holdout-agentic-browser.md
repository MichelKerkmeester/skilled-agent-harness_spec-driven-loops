---
title: "MT-H04 -- Blind holdout: autonomous signed-in browser task defers"
description: "This scenario validates a blind holdout for `MT-H04`. It focuses on a plain-language autonomous browser task that mixes agentic and signed-in proof wording and so defers."
stage: holdout
id: MT-H04
expected_intent: defer
expected_resources: []
expected_workflow_mode: defer
expected_leaf_resources: []
blindToRouterKeywords: true
version: 1.1.0.0
---

# MT-H04 -- Blind holdout: autonomous signed-in browser task defers

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `MT-H04`.

---

## 1. OVERVIEW

The prompt names no tool. It asks the browser to act by itself and to save signed-in proof of each step. Under `mcp-tooling` this gold routed to `mcp-aside-devtools`, because Aside was then the only browser mode for that work. `mcp-browser-use` adds Bladebro, and its router splits the two halves of this request: agentic work in a signed-in browser belongs to Bladebro, deterministic signed-in proof belongs to Aside. Bare agentic phrasing is discovery-only in `hub-router.json`, so the hub defers and asks the caller to name the outcome.

The gold changed from `mcp-aside-devtools` to `defer` on 2026-11-21, by operator decision, when the first run under the new hub deferred. The prompt is unchanged.

### Why This Matters

A plain autonomous-browser request is common. When it could belong to two modes, the hub must defer on purpose rather than guess, and the gold must say so.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-H04` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a plain-language autonomous signed-in browser task defers instead of picking Aside or Bladebro.
- Real user request: `Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes.`
- Prompt: `Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes.`
- Expected execution process: run the command in section 3 from the repository root, read the JSON the router prints and its exit status, then judge them against the pass/fail criteria.
- Expected signals: the router prints `action: "defer"` with no target
- Desired user-visible outcome: The hub defers and asks which outcome the caller wants.
- Pass/fail: PASS if the router defers. FAIL if it routes to any mode. SKIP only when the router cannot start, with its startup error named as the blocker.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes.`

### Commands

1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes."`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-H04 | Hub Routing | Blind holdout: autonomous signed-in browser task defers | `Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes."` | the router prints `action: "defer"` with no target | The exact command, its exit status and the full JSON. | PASS if the router defers. FAIL if it routes to any mode. SKIP only when the router cannot start, with its startup error named as the blocker. | A route here means a mode's vocabulary now catches bare agentic or proof wording. Check the phrases this prompt carries against the classes in `hub-router.json`. A route is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass. |

### Expected

- `"action":"defer"`
- No target
- Exit 0

### Evidence

The exact command, its exit status and the full JSON.

### Pass / Fail

- **Pass**: the router defers.
- **Fail**: it routes to any mode. SKIP only when the router cannot start, with its startup error named as the blocker.

### Failure Triage

1. A route here means a mode's vocabulary now catches bare agentic or proof wording. Check the phrases this prompt carries against the classes in `hub-router.json`.
2. A route is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `hub-routing/holdout-agentic-browser.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/hub-router.json` | The stage-two vocabulary the compiled router reads |
| `.skilled/skills/mcp-browser-use/mode-registry.json` | The workflow modes and their aliases |
| `.skilled/skills/mcp-browser-use/ROUTER.md` | The prose router and its resource map |
| `.skilled/bin/compiled-route-admission.cjs` | Replays this page prompt against its gold |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: MT-H04
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/holdout-agentic-browser.md`
