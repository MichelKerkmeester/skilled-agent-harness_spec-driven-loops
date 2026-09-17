---
id: AD-R02
category: intra-routing-recall
stage: routing
title: 'REPL routing'
description: "This scenario validates the SKILL.md Smart Router's REPL intent for `AD-R02`. It confirms a deterministic, evidence-oriented Playwright-flavored prompt scores REPL and loads exactly RESOURCE_MAP['REPL']."
expected_intent: REPL
expected_resources:
  - references/aside-cli-reference.md
  - references/session-management.md
version: 1.1.0.0
---

# AD-R02: REPL routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `AD-R02`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-aside-devtools` Smart Router's `REPL` intent signal fires on a
deterministic, evidence-oriented browser-automation request, and that the router loads exactly
`RESOURCE_MAP["REPL"]` — the same two resources as `TASK`, `references/aside-cli-reference.md` and
`references/session-management.md` — per `SKILL.md` §2.

### Why This Matters

`REPL` is the router's deterministic, proof-friendly lane (`aside repl "<JavaScript>"`), distinct
from the outcome-oriented `TASK` lane even though both intents currently map to the same resource
pair. Confirming `REPL` still resolves correctly on its own keyword set (`repl`, `playwright`,
`snapshot`, `screenshot`, `opentab`) keeps that distinction legible even where the loaded resources
happen to overlap with `TASK`.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt scores `REPL` under `SKILL.md` §2's weighted keyword model and
that the router's `RESOURCE_MAP["REPL"]` entry matches this scenario's declared `expected_resources`.

- Objective: confirm the prompt's keyword overlap with `INTENT_SIGNALS["REPL"]` selects `REPL` as the
  top-scoring intent, and that both mapped resources exist on disk.
- Real user request: `Use the deterministic repl with playwright helpers to openTab the page, take a snapshot, and save a screenshot as evidence.`
- Prompt: `Use the deterministic repl with playwright helpers to openTab the page, take a snapshot, and save a screenshot as evidence.`

**Exact prompt**:
```text
Use the deterministic repl with playwright helpers to openTab the page, take a snapshot, and save a screenshot as evidence.
```

- Expected execution process: the router scores every intent's keyword set against the lowercased
  prompt and selects `REPL` because `repl`, `deterministic`, `playwright`, `open tab`, `snapshot`,
  `screenshot`, and `evidence` are all literal `INTENT_SIGNALS["REPL"]` keywords at weight 4 each.
- Expected signals: `SKILL.md` §2 lists `REPL` in `INTENT_SIGNALS` with those keywords;
  `RESOURCE_MAP["REPL"]` names exactly `references/aside-cli-reference.md` and
  `references/session-management.md`; both files exist.
- Desired user-visible outcome: the router states plainly that this request routes to `REPL` and
  bundles the CLI reference plus the session-management model before answering.
- Pass/fail: PASS if `SKILL.md` §2 names the matched `REPL` keywords and both mapped resources exist;
  FAIL if the keyword weights or `RESOURCE_MAP["REPL"]` entry in `SKILL.md` no longer matches this
  scenario's frontmatter, or either resource path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use the deterministic repl with playwright helpers to openTab the page, take a snapshot, and save a screenshot as evidence.`

### Commands

1. `sed -n '1,12p' .opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/repl.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
4. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-cli-reference.md && echo "OK references/aside-cli-reference.md" || echo "MISS references/aside-cli-reference.md"`
5. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md && echo "OK references/session-management.md" || echo "MISS references/session-management.md"`

### Expected

Step 1 shows `expected_intent: REPL`. Step 2's output lists `"REPL"` with keywords including `repl`,
`deterministic`, `playwright`, `snapshot`, `screenshot`, and `opentab`/`open tab` at weight 4. Step 3's
output shows `"REPL": ["references/aside-cli-reference.md", "references/session-management.md"]`.
Steps 4-5 both print `OK`.

### Evidence

Command transcript from steps 1-5; the `INTENT_SIGNALS["REPL"]`/`RESOURCE_MAP["REPL"]` excerpts from
steps 2-3 with the matched keywords highlighted.

### Pass / Fail

- **Pass**: `SKILL.md` §2 names the matched `REPL` keywords and `RESOURCE_MAP["REPL"]` lists both
  resources, and both resource paths exist.
- **Fail**: the keyword set or resource map in `SKILL.md` no longer matches this scenario's
  frontmatter, or a resource path does not resolve.

### Failure Triage

1. Re-run step 2 and diff the current `INTENT_SIGNALS["REPL"]` keyword list against this scenario's
   quoted matches to see which keyword moved or was reworded.
2. Re-run steps 4-5 and confirm whether a reference file was renamed or removed.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §14 routing-recall index |
| `task.md` | The paired routing scenario for the `TASK` intent |
| `holdout-repl.md` | The blind holdout counterpart for the same `REPL` intent |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `REPL` `INTENT_SIGNALS` keywords and `RESOURCE_MAP` entry this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: AD-R02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/repl.md`
