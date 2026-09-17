---
id: AD-H01
category: intra-routing-recall
stage: holdout
title: 'Blind holdout: scripted evidence'
description: "This scenario validates the SKILL.md Smart Router's REPL intent generalizes to a prompt blind to obvious tool-name keywords for `AD-H01`. It confirms scripted, replayable-evidence phrasing still scores REPL without saying 'repl' or 'playwright'."
expected_intent: REPL
expected_resources:
  - references/aside-cli-reference.md
  - references/session-management.md
blindToRouterKeywords: true
version: 1.1.0.0
---

# AD-H01: Blind holdout: scripted evidence

This document captures the routing-recall contract, execution process, source anchors, and metadata for `AD-H01`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-aside-devtools` Smart Router's `REPL` intent still resolves
correctly on a prompt that is blind to the obvious tool-name keywords — it never says `repl`,
`playwright`, `deterministic`, or `aside` — and still loads exactly `RESOURCE_MAP["REPL"]`.

### Why This Matters

`AD-R02` proves the router works when a prompt names its own tools. This holdout proves the router
still generalizes when an operator describes the same deterministic, evidence-capturing workflow in
plain language instead. The prompt is not keyword-free — it still contains `snapshot`, one of
`INTENT_SIGNALS["REPL"]`'s literal keywords — but it deliberately omits the obvious tool-name terms
(`repl`, `playwright`, `aside`) that `AD-R02` relies on, so this scenario checks recall through a
narrower, more natural keyword surface.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt, despite avoiding obvious tool-name keywords, still scores
`REPL` under `SKILL.md` §2's weighted keyword model, and that the router's `RESOURCE_MAP["REPL"]`
entry matches this scenario's declared `expected_resources`.

- Objective: confirm the prompt's narrower keyword overlap with `INTENT_SIGNALS["REPL"]` — via
  `snapshot` alone, without any obvious tool-name keyword — still selects `REPL` as the top-scoring
  intent, and that both mapped resources exist on disk.
- Real user request: `Step through the page in exact scripted order and snapshot every state so the run can be replayed identically as proof.`
- Prompt: `Step through the page in exact scripted order and snapshot every state so the run can be replayed identically as proof.`

**Exact prompt**:
```text
Step through the page in exact scripted order and snapshot every state so the run can be replayed identically as proof.
```

- Expected execution process: the router scores every intent's keyword set against the lowercased
  prompt; `snapshot` is the sole literal `INTENT_SIGNALS["REPL"]` keyword present, so `REPL` scores
  above every zero-scoring intent and is selected without needing `repl`, `playwright`, or `aside` in
  the text.
- Expected signals: `SKILL.md` §2 lists `snapshot` under `INTENT_SIGNALS["REPL"]`;
  `RESOURCE_MAP["REPL"]` names exactly `references/aside-cli-reference.md` and
  `references/session-management.md`; both files exist.
- Desired user-visible outcome: the router states plainly that this request routes to `REPL` and
  bundles the CLI reference plus the session-management model, despite the prompt never naming the
  tool.
- Pass/fail: PASS if `SKILL.md` §2 confirms `snapshot` under `REPL` and both mapped resources exist;
  FAIL if `snapshot` is no longer a `REPL` keyword, the `RESOURCE_MAP["REPL"]` entry in `SKILL.md` no
  longer matches this scenario's frontmatter, or either resource path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Step through the page in exact scripted order and snapshot every state so the run can be replayed identically as proof.`

### Commands

1. `sed -n '1,14p' .opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/holdout-repl.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
3. `sed -n '/^```text$/,/^```$/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/holdout-repl.md | grep -io 'repl\|playwright\|deterministic\|aside' || echo "no obvious tool-name keyword in the prompt body"`
4. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-cli-reference.md && echo "OK references/aside-cli-reference.md" || echo "MISS references/aside-cli-reference.md"`
5. `test -e .opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md && echo "OK references/session-management.md" || echo "MISS references/session-management.md"`

### Expected

Step 1 shows `expected_intent: REPL` and `blindToRouterKeywords: true`. Step 2's output confirms
`snapshot` is present under `INTENT_SIGNALS["REPL"]`. Step 3 prints
`no obvious tool-name keyword in the prompt body` (the obvious tool-name keywords are absent from the
prompt body). Steps 4-5 both print `OK`.

### Evidence

Command transcript from steps 1-5; the `INTENT_SIGNALS["REPL"]` excerpt from step 2 with `snapshot`
highlighted; step 3's confirmation that the prompt body carries no obvious tool-name keyword.

### Pass / Fail

- **Pass**: `SKILL.md` §2 still lists `snapshot` under `REPL`, the prompt body carries no obvious
  tool-name keyword, and both `RESOURCE_MAP["REPL"]` resource paths exist.
- **Fail**: `snapshot` is removed from `REPL`'s keyword list, the resource map no longer matches this
  scenario's frontmatter, or a resource path does not resolve.

### Failure Triage

1. Re-run step 2 and confirm `snapshot` is still present under `INTENT_SIGNALS["REPL"]` at a
   nonzero weight.
2. Re-run steps 4-5 and confirm whether a reference file was renamed or removed.
3. Compare against the non-blind `repl.md` scenario to isolate whether a routing regression is
   holdout-specific or affects `REPL` generally.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §14 routing-recall index |
| `repl.md` | The non-blind routing scenario for the same `REPL` intent |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `REPL` `INTENT_SIGNALS` keywords and `RESOURCE_MAP` entry this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: AD-H01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-repl.md`
