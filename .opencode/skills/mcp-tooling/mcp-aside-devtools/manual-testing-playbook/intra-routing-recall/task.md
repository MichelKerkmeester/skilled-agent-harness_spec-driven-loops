---
id: AD-R01
category: intra-routing-recall
stage: routing
title: 'Task routing'
description: "This scenario validates the SKILL.md Smart Router's TASK intent for `AD-R01`. It confirms a natural-language multi-step browser-agent prompt scores TASK and loads exactly RESOURCE_MAP['TASK']."
expected_intent: TASK
expected_resources:
  - references/aside-cli-reference.md
  - references/session-management.md
version: 1.1.0.0
---

# AD-R01: Task routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `AD-R01`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-aside-devtools` Smart Router's `TASK` intent signal fires on a
realistic multi-step, natural-language browser-agent request, and that the router loads exactly
`RESOURCE_MAP["TASK"]` — `references/aside-cli-reference.md` and `references/session-management.md`
— per `SKILL.md` §2's `INTENT_SIGNALS`/`RESOURCE_MAP` tables.

### Why This Matters

`TASK` is the router's outcome-oriented lane: the agent-task CLI (`aside "<task>"` / `aside exec`),
distinct from the deterministic `REPL` lane and the `MCP` Code Mode composition lane. If the router
under- or over-scores `TASK` keywords, an operator asking for a multi-step agent run would be routed
to the wrong reference set, or given both agent-task and REPL guidance for a request that only needs
one.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt scores `TASK` under `SKILL.md` §2's weighted keyword model and
that the router's `RESOURCE_MAP["TASK"]` entry matches this scenario's declared `expected_resources`.

- Objective: confirm the prompt's keyword overlap with `INTENT_SIGNALS["TASK"]` selects `TASK` as the
  top-scoring intent, and that both mapped resources exist on disk.
- Real user request: `Have the aside browser agent run a multi-step natural language task: sign in and download my latest invoice.`
- Prompt: `Have the aside browser agent run a multi-step natural language task: sign in and download my latest invoice.`

**Exact prompt**:
```text
Have the aside browser agent run a multi-step natural language task: sign in and download my latest invoice.
```

- Expected execution process: the router lowercases the prompt, scores every intent's keyword set
  against it, and selects `TASK` because `aside`, `browser agent`, `natural language`, `multi-step`,
  and `sign in and` are all literal `INTENT_SIGNALS["TASK"]` keywords with weight 4 each.
- Expected signals: `SKILL.md` §2 lists `TASK` in `INTENT_SIGNALS` with those keywords; `RESOURCE_MAP["TASK"]`
  names exactly `references/aside-cli-reference.md` and `references/session-management.md`; both files
  exist.
- Desired user-visible outcome: the router states plainly that this request routes to `TASK` and
  bundles the CLI reference plus the session-management model before answering.
- Pass/fail: PASS if `SKILL.md` §2 names the matched `TASK` keywords and both mapped resources exist;
  FAIL if the keyword weights or `RESOURCE_MAP["TASK"]` entry in `SKILL.md` no longer matches this
  scenario's frontmatter, or either resource path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Have the aside browser agent run a multi-step natural language task: sign in and download my latest invoice.`

### Commands

1. `sed -n '1,12p' .opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/task.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
4. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-cli-reference.md && echo "OK references/aside-cli-reference.md" || echo "MISS references/aside-cli-reference.md"`
5. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md && echo "OK references/session-management.md" || echo "MISS references/session-management.md"`

### Expected

Step 1 shows `expected_intent: TASK`. Step 2's output lists `"TASK"` with keywords including
`aside`, `browser agent`, `natural language`, `multi-step`, and `sign in and` at weight 4. Step 3's
output shows `"TASK": ["references/aside-cli-reference.md", "references/session-management.md"]`.
Steps 4-5 both print `OK`.

### Evidence

Command transcript from steps 1-5; the `INTENT_SIGNALS["TASK"]`/`RESOURCE_MAP["TASK"]` excerpts from
steps 2-3 with the matched keywords highlighted.

### Pass / Fail

- **Pass**: `SKILL.md` §2 names the matched `TASK` keywords and `RESOURCE_MAP["TASK"]` lists both
  resources, and both resource paths exist.
- **Fail**: the keyword set or resource map in `SKILL.md` no longer matches this scenario's
  frontmatter, or a resource path does not resolve.

### Failure Triage

1. Re-run step 2 and diff the current `INTENT_SIGNALS["TASK"]` keyword list against this scenario's
   quoted matches to see which keyword moved or was reworded.
2. Re-run steps 4-5 and confirm whether a reference file was renamed or removed.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §14 routing-recall index |
| `repl.md` | The paired routing scenario for the `REPL` intent |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `TASK` `INTENT_SIGNALS` keywords and `RESOURCE_MAP` entry this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: AD-R01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/task.md`
