---
title: "Page actions"
description: "`act` targets a control by ref, selector, label, text or coordinates and runs one action, such as click, type, fill, press, eval or download."
trigger_phrases:
  - "page actions"
  - "bladebro act"
  - "bladebro act click"
  - "bladebro act eval"
version: 1.0.0.0
---

# Page actions (act)

## 1. OVERVIEW

`act` targets a control by ref, selector, label, text or coordinates and runs one action, such as click, type, fill, press, eval or download.

`act` is the tool that changes browser state. A click navigates, a fill submits and a download writes a file, so each action is judged by its exit code and its `ok` field before the next one runs.

---

## 2. HOW IT WORKS

### Targeting

A control is targeted by ref (such as `e5`), selector, label, text or coordinates. When several controls match equally, Bladebro returns the candidates, and the caller picks by ref, a unique selector or a one-based `nth`. Selector matching covers open shadow roots. `act click "Learn more"` and `act click --text 'Learn more'` both work in 4.8.2.

### Actions

The actions include navigate, click, type, fill, select, press, read, hover, scroll, wait, upload, download, pdf, eval, `collect`, `paginate` and `batch`. `act eval` returns one `result:` line with the compact JSON of the returned value.

### Async & Safety

An accepted click or submit dispatches once. If a disconnect leaves a mutation's outcome unknown, the agent inspects the destination before sending another action. On a signed-in profile, mutations sit behind `rb pause` and `rb resume`, and consent-sensitive actions stay with a human.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Shared | The `act` actions, targeting and dispatch rule |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` | Shared | The rule to inspect before resending after a disconnect |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/agent-browser/see-model-and-click.md` | Manual playbook | One click by text on example.com |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Recorded click by positional text and by `--text` |

---

## 4. SOURCE METADATA

- Group: Agent Browser
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `agent-browser/page-actions.md`

Related references:
- [page-reads.md](page-reads.md) - The reads that supply refs
- [step-plans.md](step-plans.md) - Several actions in one call
