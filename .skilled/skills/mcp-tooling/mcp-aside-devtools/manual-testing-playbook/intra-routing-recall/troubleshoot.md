---
id: AD-R05
category: intra-routing-recall
stage: routing
title: 'Troubleshoot routing'
description: "This scenario validates the SKILL.md Smart Router's TROUBLESHOOT intent for `AD-R05`. It confirms a failure-report prompt scores TROUBLESHOOT and loads exactly RESOURCE_MAP['TROUBLESHOOT']."
expected_intent: TROUBLESHOOT
expected_resources:
  - references/troubleshooting.md
  - references/session-management.md
version: 1.1.0.0
---

# AD-R05: Troubleshoot routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `AD-R05`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-aside-devtools` Smart Router's `TROUBLESHOOT` intent signal
fires on a realistic failure-report request, and that the router loads exactly
`RESOURCE_MAP["TROUBLESHOOT"]` — `references/troubleshooting.md` and `references/session-management.md`
— per `SKILL.md` §2.

### Why This Matters

`TROUBLESHOOT` carries the largest keyword list in `INTENT_SIGNALS` (error/failure vocabulary plus
binding- and daemon-state terms), and it is the intent every other routing scenario in this category
cross-references when a run fails mid-task (ASD-006, ASD-010, ASD-021 all point back to the same
"not bound to a browser profile" state this scenario's prompt names directly). If `TROUBLESHOOT`
under-scores against `MCP` or `REPL` on a prompt naming both a daemon symptom and a tool, an operator
debugging a stalled session would be pointed at the wrong reference pair.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt scores `TROUBLESHOOT` under `SKILL.md` §2's weighted keyword model
and that the router's `RESOURCE_MAP["TROUBLESHOOT"]` entry matches this scenario's declared
`expected_resources`.

- Objective: confirm the prompt's keyword overlap with `INTENT_SIGNALS["TROUBLESHOOT"]` selects
  `TROUBLESHOOT` as the top-scoring intent, and that both mapped resources exist on disk.
- Real user request: `My aside run failed with a "not bound to a browser profile" error and now the daemon won't connect; troubleshoot the root cause.`
- Prompt: `My aside run failed with a "not bound to a browser profile" error and now the daemon won't connect; troubleshoot the root cause.`

**Exact prompt**:
```text
My aside run failed with a "not bound to a browser profile" error and now the daemon won't connect; troubleshoot the root cause.
```

- Expected execution process: the router scores every intent's keyword set against the lowercased
  prompt and selects `TROUBLESHOOT` because `failed`, `error`, `not bound`, `daemon`, `won't connect`,
  `troubleshoot`, and `root cause` are all literal `INTENT_SIGNALS["TROUBLESHOOT"]` keywords at weight
  4 each.
- Expected signals: `SKILL.md` §2 lists `TROUBLESHOOT` in `INTENT_SIGNALS` with those keywords;
  `RESOURCE_MAP["TROUBLESHOOT"]` names exactly `references/troubleshooting.md` and
  `references/session-management.md`; both files exist.
- Desired user-visible outcome: the router states plainly that this request routes to
  `TROUBLESHOOT` and bundles the troubleshooting guide plus the session-management model (for the
  binding-state explanation) before answering.
- Pass/fail: PASS if `SKILL.md` §2 names the matched `TROUBLESHOOT` keywords and both mapped
  resources exist; FAIL if the keyword weights or `RESOURCE_MAP["TROUBLESHOOT"]` entry in `SKILL.md`
  no longer matches this scenario's frontmatter, or either resource path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `My aside run failed with a "not bound to a browser profile" error and now the daemon won't connect; troubleshoot the root cause.`

### Commands

1. `sed -n '1,12p' .opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/troubleshoot.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
4. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/troubleshooting.md && echo "OK references/troubleshooting.md" || echo "MISS references/troubleshooting.md"`
5. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md && echo "OK references/session-management.md" || echo "MISS references/session-management.md"`

### Expected

Step 1 shows `expected_intent: TROUBLESHOOT`. Step 2's output lists `"TROUBLESHOOT"` with keywords
including `failed`, `error`, `not bound`, `daemon`, `won't connect`, `troubleshoot`, and `root cause`
at weight 4. Step 3's output shows `"TROUBLESHOOT": ["references/troubleshooting.md",
"references/session-management.md"]`. Steps 4-5 both print `OK`.

### Evidence

Command transcript from steps 1-5; the `INTENT_SIGNALS["TROUBLESHOOT"]`/`RESOURCE_MAP["TROUBLESHOOT"]`
excerpts from steps 2-3 with the matched keywords highlighted.

### Pass / Fail

- **Pass**: `SKILL.md` §2 names the matched `TROUBLESHOOT` keywords and
  `RESOURCE_MAP["TROUBLESHOOT"]` lists both resources, and both resource paths exist.
- **Fail**: the keyword set or resource map in `SKILL.md` no longer matches this scenario's
  frontmatter, or a resource path does not resolve.

### Failure Triage

1. Re-run step 2 and diff the current `INTENT_SIGNALS["TROUBLESHOOT"]` keyword list against this
   scenario's quoted matches to see which keyword moved or was reworded.
2. Re-run steps 4-5 and confirm whether a reference file was renamed or removed.
3. Cross-reference ASD-010's MCP-side documentation of the same `PROFILE_UNBOUND` state if the
   `not bound` phrasing itself is questioned.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §14 routing-recall index |
| `holdout-troubleshoot.md` | The blind holdout counterpart for the same `TROUBLESHOOT` intent |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `TROUBLESHOOT` `INTENT_SIGNALS` keywords and `RESOURCE_MAP` entry this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: AD-R05
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/troubleshoot.md`
