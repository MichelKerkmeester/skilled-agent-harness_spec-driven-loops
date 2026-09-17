---
id: AD-H02
category: intra-routing-recall
stage: holdout
title: 'Blind holdout: stalled automation'
description: "This scenario validates the SKILL.md Smart Router's TROUBLESHOOT intent generalizes to a prompt blind to obvious tool-name keywords for `AD-H02`. It confirms stalled-automation phrasing still scores TROUBLESHOOT without saying 'aside' or 'mcp'."
expected_intent: TROUBLESHOOT
expected_resources:
  - references/troubleshooting.md
  - references/session-management.md
blindToRouterKeywords: true
version: 1.1.0.0
---

# AD-H02: Blind holdout: stalled automation

This document captures the routing-recall contract, execution process, source anchors, and metadata for `AD-H02`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-aside-devtools` Smart Router's `TROUBLESHOOT` intent still
resolves correctly on a prompt that is blind to the obvious tool-name keywords — it never says
`aside`, `mcp`, or `repl` — and still loads exactly `RESOURCE_MAP["TROUBLESHOOT"]`.

### Why This Matters

`AD-R05` proves the router works when a prompt names the product directly (`aside run`). This
holdout proves the router still generalizes when an operator describes the same stalled-automation
symptom in plain, product-agnostic language. The prompt is not keyword-free — it still contains
`hangs`, `won't connect`, and `root cause`, all literal `INTENT_SIGNALS["TROUBLESHOOT"]` keywords —
but it deliberately omits the tool-name terms (`aside`, `mcp`, `daemon`) that would make the intent
obvious, so this scenario checks recall through natural failure-report language instead.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt, despite avoiding obvious tool-name keywords, still scores
`TROUBLESHOOT` under `SKILL.md` §2's weighted keyword model, and that the router's
`RESOURCE_MAP["TROUBLESHOOT"]` entry matches this scenario's declared `expected_resources`.

- Objective: confirm the prompt's keyword overlap with `INTENT_SIGNALS["TROUBLESHOOT"]` — via
  `hangs`, `won't connect`, and `root cause`, without naming the product — still selects
  `TROUBLESHOOT` as the top-scoring intent, and that both mapped resources exist on disk.
- Real user request: `My browser automation run hangs halfway and then the tool won't connect anymore; help me find the root cause.`
- Prompt: `My browser automation run hangs halfway and then the tool won't connect anymore; help me find the root cause.`

**Exact prompt**:
```text
My browser automation run hangs halfway and then the tool won't connect anymore; help me find the root cause.
```

- Expected execution process: the router scores every intent's keyword set against the lowercased
  prompt; `hangs`, `won't connect`, and `root cause` are literal `INTENT_SIGNALS["TROUBLESHOOT"]`
  keywords, so `TROUBLESHOOT` scores above every other intent and is selected without needing
  `aside`, `mcp`, or `daemon` in the text.
- Expected signals: `SKILL.md` §2 lists `hangs`, `won't connect`, and `root cause` under
  `INTENT_SIGNALS["TROUBLESHOOT"]`; `RESOURCE_MAP["TROUBLESHOOT"]` names exactly
  `references/troubleshooting.md` and `references/session-management.md`; both files exist.
- Desired user-visible outcome: the router states plainly that this request routes to
  `TROUBLESHOOT` and bundles the troubleshooting guide plus the session-management model, despite the
  prompt never naming the product.
- Pass/fail: PASS if `SKILL.md` §2 confirms the three matched keywords under `TROUBLESHOOT` and both
  mapped resources exist; FAIL if any of those keywords is removed from `TROUBLESHOOT`, the
  `RESOURCE_MAP["TROUBLESHOOT"]` entry in `SKILL.md` no longer matches this scenario's frontmatter, or
  either resource path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `My browser automation run hangs halfway and then the tool won't connect anymore; help me find the root cause.`

### Commands

1. `sed -n '1,14p' .opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/holdout-troubleshoot.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
3. `sed -n '/^```text$/,/^```$/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/holdout-troubleshoot.md | grep -io 'aside\|mcp\|repl\|daemon' || echo "no obvious tool-name keyword in the prompt body"`
4. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/troubleshooting.md && echo "OK references/troubleshooting.md" || echo "MISS references/troubleshooting.md"`
5. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md && echo "OK references/session-management.md" || echo "MISS references/session-management.md"`

### Expected

Step 1 shows `expected_intent: TROUBLESHOOT` and `blindToRouterKeywords: true`. Step 2's output
confirms `hangs`, `won't connect`, and `root cause` are present under
`INTENT_SIGNALS["TROUBLESHOOT"]`. Step 3 prints `no obvious tool-name keyword in the prompt body`.
Steps 4-5 both print `OK`.

### Evidence

Command transcript from steps 1-5; the `INTENT_SIGNALS["TROUBLESHOOT"]` excerpt from step 2 with the
three matched keywords highlighted; step 3's confirmation that the prompt body carries no
obvious tool-name keyword.

### Pass / Fail

- **Pass**: `SKILL.md` §2 still lists `hangs`, `won't connect`, and `root cause` under
  `TROUBLESHOOT`, the prompt body carries no obvious tool-name keyword, and both
  `RESOURCE_MAP["TROUBLESHOOT"]` resource paths exist.
- **Fail**: any of the three matched keywords is removed from `TROUBLESHOOT`'s list, the resource map
  no longer matches this scenario's frontmatter, or a resource path does not resolve.

### Failure Triage

1. Re-run step 2 and confirm `hangs`, `won't connect`, and `root cause` are still present under
   `INTENT_SIGNALS["TROUBLESHOOT"]` at a nonzero weight.
2. Re-run steps 4-5 and confirm whether a reference file was renamed or removed.
3. Compare against the non-blind `troubleshoot.md` scenario to isolate whether a routing regression is
   holdout-specific or affects `TROUBLESHOOT` generally.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §14 routing-recall index |
| `troubleshoot.md` | The non-blind routing scenario for the same `TROUBLESHOOT` intent |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `TROUBLESHOOT` `INTENT_SIGNALS` keywords and `RESOURCE_MAP` entry this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: AD-H02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-troubleshoot.md`
