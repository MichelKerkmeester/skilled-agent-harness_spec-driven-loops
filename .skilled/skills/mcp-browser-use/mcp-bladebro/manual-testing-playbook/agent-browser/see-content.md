---
title: "BB-006 -- Read page content"
description: "This scenario validates `see content` on the agent browser for `BB-006`. It focuses on page text returned in the ok, is_error and text shape."
version: 1.0.1.0
---

# BB-006 -- Read page content

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-006`.

---

## 1. OVERVIEW

Plan step 7. The first page read in the isolated agent browser.

### Why This Matters

Every later agent-browser step depends on a page load and a clean read.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-006` and confirm the expected signals without contradictory evidence.

- Objective: Read example.com as text.
- Real user request: `Use Bladebro to read the text of example.com.`
- Prompt: `Use Bladebro to read the text of example.com.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: JSON with `ok: true`, `is_error: false` and the example.com text, exit 0
- Desired user-visible outcome: The page text.
- Pass/fail: PASS if the JSON shape and text hold and the exit status is 0. FAIL if the call errors or returns no text.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use Bladebro to read the text of example.com.`

### Commands

1. `bladebro see content https://example.com --json`

### Expected

- `"ok":true`
- The text names the documentation-example domain

### Evidence

The JSON and the exit status.

### Pass / Fail

- **Pass**: the JSON shape and text hold and the exit status is 0.
- **Fail**: the call errors or returns no text.

### Failure Triage

1. Run `bladebro stop` and retry once only to tell a launch fault from a page fault. Record both runs. The verdict stays as first observed.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `agent-browser/see-content.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Bladebro CLI commands and flags |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Agent-browser and real-browser lanes |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/agent-browser/page-reads.md` | Feature catalog entry: Page reads |

---

## 5. SOURCE METADATA

- Group: Agent Browser
- Playbook ID: BB-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agent-browser/see-content.md`
