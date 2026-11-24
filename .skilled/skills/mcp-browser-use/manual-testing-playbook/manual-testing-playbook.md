---
title: "mcp-browser-use: Manual Testing Playbook"
description: "Operator index for mcp-browser-use hub routing across its three browser modes, two blind holdouts and the defer contract."
version: 1.1.4.0
---

# mcp-browser-use: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario runs for real, never mocked or stubbed. Operators run the actual commands, read the real output and record it. The only verdicts are `PASS`, `FAIL` or `SKIP`, and every `SKIP` names its blocker.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **COMPLETION**: A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded into `.skilled/skills/mcp-browser-use/benchmark/reports/<dated-run-label>/`. A run never edits this corpus.

This is the hub-level operator index for three modes: `mcp-chrome-devtools`, `mcp-aside-devtools` and `mcp-bladebro`. It checks which mode the hub picks for a request. Each mode packet owns its own behavior checks in its own playbook.

---

## 1. OVERVIEW

The playbook holds 7 routing scenarios in one category. Five came over from the `mcp-tooling` hub when the browser modes moved here: two primary routes, the defer contract and two blind holdouts. Two are new: a Bladebro request and a Lighthouse request that must land on `mcp-chrome-devtools`. The frontmatter of each scenario is routing gold, so the admission check replays every prompt through the compiled router.

### Realistic Test Model

1. An operator phrases a browser request the way a user would.
2. The compiled router for `mcp-browser-use` picks a mode or defers.
3. The operator records the command, the JSON and the exit status.
4. The scenario passes only when the decision matches the gold.

---

## 2. GLOBAL PRECONDITIONS

- The working directory is the repository root.
- `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use` starts and prints JSON.
- No browser, account or network is needed. Routing reads only the hub files.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact command, its exit status and the full JSON per scenario.
- The `effectivePolicyHash` the router printed, so a later run can tell whether the policy changed.
- The admission report for the hub after the scenarios run.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Each scenario runs one command: `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt-stdin <<'TASK'`, with the scenario prompt on the next line and `TASK` after it. The quoted heredoc keeps the shell from expanding anything in the prompt.
- The prompt is quoted exactly as the scenario gives it.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

- A scenario passes only when the routed mode, or the defer, matches its gold.
- A drift is a routing finding for the routing owner. The prompt and the gold stay as they are.
- The hub is ready only when `node .skilled/bin/compiled-route-admission.cjs --hub mcp-browser-use` reports no drift and no stale gold.

### Result persistence

A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded into `.skilled/skills/mcp-browser-use/benchmark/reports/<dated-run-label>/`. The latest recorded playbook run is `2026-11-21--manual-testing-playbook--hub-routing--post-review`. Routing replays, which run the advisor and the front door together, live under `compiled-routing/`; the newest is `2026-11-24--two-stage-replay--compiled--p2-triage`. The reports `README.md` lists every run.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- All 7 scenarios are read-only and parallel-safe. Run them in one wave, then run the admission check.

---

## 7. HUB ROUTING

Seven scenarios: four primary routes, the defer contract and two blind holdouts.

### MT-001 | Browser debugging request routes to mcp-chrome-devtools

#### Description
Route a Chrome DevTools HAR request to mcp-chrome-devtools.

#### Scenario Contract
Prompt summary: Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging.

Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `mcp-chrome-devtools` under `skillId: "mcp-browser-use"`

#### Test Execution
> **Feature File:** [MT-001](hub-routing/chrome-devtools-browser-debug.md)

### MT-007 | Aside browser task routes to mcp-aside-devtools

#### Description
Route an Aside REPL evidence request to mcp-aside-devtools.

#### Scenario Contract
Prompt summary: Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget.

Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `mcp-aside-devtools` under `skillId: "mcp-browser-use"`

#### Test Execution
> **Feature File:** [MT-007](hub-routing/aside-browser-automation.md)

### MT-012 | Bladebro stealth request routes to mcp-bladebro

#### Description
Route a named Bladebro request to mcp-bladebro.

#### Scenario Contract
Prompt summary: Use Bladebro to read example.com in stealth mode and click the Learn more link.

Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `mcp-bladebro` under `skillId: "mcp-browser-use"`

#### Test Execution
> **Feature File:** [MT-012](hub-routing/bladebro-stealth-browser.md)

### MT-013 | Lighthouse audit routes to mcp-chrome-devtools

#### Description
Route a Lighthouse request to mcp-chrome-devtools.

#### Scenario Contract
Prompt summary: Run a Lighthouse audit on the staging homepage and report the performance score.

Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `mcp-chrome-devtools` under `skillId: "mcp-browser-use"`

#### Test Execution
> **Feature File:** [MT-013](hub-routing/lighthouse-performance-audit.md)

### MT-004 | Ambiguous tool request defers

#### Description
Defer a request that carries no per-mode signal.

#### Scenario Contract
Prompt summary: Use the MCP tool bridge for this.

Expected signals: the router prints `action: "defer"` with an empty `targets` list

#### Test Execution
> **Feature File:** [MT-004](hub-routing/ambiguous-defer.md)

### MT-H01 | Blind holdout: browser inspection routes to mcp-chrome-devtools

#### Description
Route plain-language inspection to mcp-chrome-devtools.

#### Scenario Contract
Prompt summary: `The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause.`

Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `mcp-chrome-devtools` under `skillId: "mcp-browser-use"`

#### Test Execution
> **Feature File:** [MT-H01](hub-routing/holdout-browser-inspect.md)

### MT-H04 | Blind holdout: autonomous signed-in browser task defers

#### Description
Confirm a plain-language autonomous signed-in browser task defers instead of picking Aside or Bladebro. The gold changed from `mcp-aside-devtools` to `defer` on 2026-11-21 by operator decision.

#### Scenario Contract
Prompt summary: Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes.

Expected signals: the router prints `action: "defer"` with no target

#### Test Execution
> **Feature File:** [MT-H04](hub-routing/holdout-agentic-browser.md)

---

## 8. FEATURE CATALOG CROSS-REFERENCE INDEX

The hub has no feature catalog. Each mode packet keeps its own catalog where one exists.
