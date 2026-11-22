---
title: "BB-007 -- Page model and a click by text"
description: "This scenario validates `see model` and `act click` for `BB-007`. It focuses on refs in the page model and one click dispatched by its visible text."
version: 1.0.1.0
---

# BB-007 -- Page model and a click by text

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-007`.

---

## 1. OVERVIEW

Plan step 8. The installed binary takes the click target positionally, `bladebro act click "Learn more"`, or through the `--text` flag the plan names. Both forms dispatch the same click.

### Why This Matters

Refs and clicks are the core of agent browsing. A wrong flag in the packet would break every click the packet teaches.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-007` and confirm the expected signals without contradictory evidence.

- Objective: Read the page model and click the "Learn more" link once.
- Real user request: `Use Bladebro to list the controls on example.com and click the Learn more link.`
- Prompt: `Use Bladebro to list the controls on example.com and click the Learn more link.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: the model lists a ref for the "Learn more" link, the click navigates to the IANA example-domains page, both exit 0
- Desired user-visible outcome: The click landed once.
- Pass/fail: PASS if a ref is listed and the click navigates once. FAIL if no ref is listed, or the click errors or lands twice.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use Bladebro to list the controls on example.com and click the Learn more link.`

### Commands

1. `bladebro see model --json`
2. `bladebro act click "Learn more" --json`

### Expected

- A line such as `e100 link "Learn more"`
- `outcome: navigated` to `www.iana.org/help/example-domains`

### Evidence

Both JSON outputs.

### Pass / Fail

- **Pass**: a ref is listed and the click navigates once.
- **Fail**: no ref is listed, or the click errors or lands twice.

### Failure Triage

1. Inspect the page before reissuing a click whose outcome is unknown.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `agent-browser/see-model-and-click.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Bladebro CLI commands and flags |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/agent-browser/page-actions.md` | Feature catalog entry: Page actions |

---

## 5. SOURCE METADATA

- Group: Agent Browser
- Playbook ID: BB-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agent-browser/see-model-and-click.md`
