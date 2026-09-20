---
title: "ORCA-007 -- Embedded browser stays inside the Orca runtime"
description: "This scenario validates that the embedded browser is used only for Orca-hosted pages and that an external site is routed to a page-automation tool instead."
catalog_applicable: true
version: 1.0.0.0
---

# ORCA-007 -- Embedded browser stays inside the Orca runtime

This file is the canonical operator contract for embedded browser ownership and the external page refusal.

---

## 1. OVERVIEW

This scenario verifies two halves of the browser ownership contract. The embedded browser is used only for pages the Orca runtime itself hosts, and an external site is named as out of scope for it rather than attempted through it.

### Why This Matters

The embedded browser is a tab surface scoped to an Orca worktree. It is not Chrome, Safari or Orca's own app UI, so driving an external page through it would act on the wrong surface, and stale refs from a finished page would replay clicks against a page the runtime no longer hosts.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the embedded browser stays inside the Orca runtime and that an external page is not attempted through it.
- Real user request: `Open the page inside Orca and check the widget, then explain which browser I should use for an external site.`
- Prompt: `Open the page inside Orca and check the widget, then explain which browser I should use for an external site.`
- Expected execution process: Run the ownership probe, resolve one executable, then run the live open of the runtime. The embedded browser is exercised only for the page the runtime itself hosts, and the external site is answered as a routing question instead of a browser action.
- Expected signals: Step 1 prints the ownership rule that Orca controls the embedded browser for pages the runtime itself hosts. Step 2 decides whether the live half runs, and the scenario SKIPs with the runtime blocker when nothing resolves. Step 3 opens or reports the runtime, and embedded browser references are treated as short lived, so a stale reference is refreshed by the runtime rather than reused.
- Desired user-visible outcome: The hosted widget is checked inside Orca, and the external site is explained as belonging to a page automation tool such as Playwright or CDP rather than being driven through the embedded browser.
- Pass/fail: PASS if the ownership rule prints, the hosted page is exercised inside the runtime, and the external site is routed out with the page-automation answer. FAIL if an external page is driven through the embedded browser, or if an embedded reference is reused after a reload without asking the runtime for the current one. SKIP when `command -v orca` resolves nothing, with the missing Orca runtime named as the blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

Run the steps in order from the repository root. `orca` stands for the resolved executable, and the resolution order is `ORCA_CLI_COMMAND`, then `orca-dev`, then `orca-ide`, then `orca`.

1. Run `rg -n "embedded" .skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md`. Keep the ownership rule lines.
2. Run `command -v orca`. If nothing prints, record `SKIP` with the missing runtime as the blocker and stop.
3. Run `orca open --json`. Open the hosted page the request names and check the widget with snapshot, interact, re-snapshot, using fresh refs from the current snapshot. Answer the external-site half of the request as a routing answer, never as a browser action.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-007 | Embedded browser stays inside the Orca runtime | Prove the embedded browser hosts only Orca-hosted pages and an external site is routed out. | `Open the page inside Orca and check the widget, then explain which browser I should use for an external site.` | 1. `bash: rg -n "embedded" .skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md` -> 2. `bash: command -v orca` -> 3. `bash: orca open --json` | Step 1 prints the ownership rule that Orca controls the embedded browser for pages the runtime itself hosts. Step 2 decides whether the live half runs, and the scenario SKIPs with the runtime blocker when nothing resolves. Step 3 opens or reports the runtime, and embedded browser references are treated as short lived, so a stale reference is refreshed by the runtime rather than reused. | Command transcript, exit statuses, the ownership rule lines, and the runtime open result. | PASS if the ownership rule prints, the hosted page is exercised inside the runtime, and the external site is routed out with the page-automation answer. FAIL if an external page is driven through the embedded browser, or if an embedded reference is reused after a reload without asking the runtime for the current one. SKIP when `command -v orca` resolves nothing, with the missing runtime as the named blocker. | 1. Rerun step 1 and compare the ownership lines. 2. Confirm the resolved executable follows the resolution order. 3. Re-run `orca open --json` and re-snapshot before any interaction. 4. Route the external page to a page automation tool such as Playwright or CDP and report that routing to the user. |

### Evidence Review

The ownership rule lines from step 1 are the load-bearing signal for the external-site half, not a successful open. A successful `orca open --json` proves only that the runtime responded, so the verdict needs both the rule that scopes the embedded browser and a hosted-page interaction that refreshed its refs from a current snapshot.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Orca-qualified routing vocabulary catalog entry](../../feature-catalog/routing/orca-qualified-vocabulary.md) | The negative holdouts that keep generic browser vocabulary out of the Orca lane. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Mutation and browser boundaries reference](../../references/mutation-and-browser-boundaries.md) | Browser ownership matrix and the snapshot, interact, re-snapshot loop. |
| [Router contract](../../SKILL.md) | Browser lane rules and the external page escalation trigger. |

---

## 5. SOURCE METADATA

- Group: Ownership
- Playbook ID: ORCA-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `ownership/embedded-browser-boundary.md`
- Catalog entry: `routing/orca-qualified-vocabulary.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
