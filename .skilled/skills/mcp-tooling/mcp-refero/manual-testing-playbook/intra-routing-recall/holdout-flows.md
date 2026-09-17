---
id: RF-H02
category: intra-routing-recall
stage: holdout
title: 'Blind holdout: journey research'
description: "This scenario is the natural-phrasing holdout for `RF-R03`. It focuses on confirming a prompt written in plain user language, avoiding most of INTENT_MODEL's FLOWS vocabulary, still routes to FLOWS and resolves the same RESOURCE_MAP set."
expected_intent: FLOWS
expected_resources:
  - references/tool-surface.md
blindToRouterKeywords: true
version: 1.0.0.1
---

# RF-H02: Blind holdout: journey research

This document captures the routing-recall contract, execution process, source anchors, and metadata for `RF-H02`.

---

## 1. OVERVIEW

This scenario is the natural-phrasing holdout for `RF-R03` (`blindToRouterKeywords: true`). It focuses on confirming that a prompt phrased the way a real user would ask about a checkout journey from cart to confirmation -- not the router's own vocabulary -- still classifies as `FLOWS` per `SKILL.md` §2 and resolves the same `RESOURCE_MAP["FLOWS"]` set as `RF-R03`, not on actually running the search.

### Why This Matters

"Journey" and "checkout" are both literal `FLOWS` keywords, but this prompt reaches them through a natural "walk me through how real products structure..." framing instead of the router's terser "user flow" phrasing. This holdout checks the classifier generalizes past its terser keyword form -- which is what makes it a decontamination check rather than a restatement of `RF-R03`.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact holdout prompt for `RF-H02` classifies as `FLOWS` and resolves the same declared resource set as its fitted counterpart `RF-R03`.

- Objective: confirm the natural-phrasing prompt routes to intent `FLOWS` and every path in `expected_resources`, decontaminating `RF-R03`
- Real user request: `Walk me through how real products structure the checkout journey from cart to confirmation.`
- Prompt: `Walk me through how real products structure the checkout journey from cart to confirmation.`

**Exact prompt**:
```text
Walk me through how real products structure the checkout journey from cart to confirmation.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "journey" and "checkout" are both literal `FLOWS` keyword hits, and no other intent's keyword list matches any word in the prompt, so `FLOWS` remains the sole scoring intent and `RESOURCE_MAP["FLOWS"]` loads the declared path
- Expected signals: the `expected_resources` path exists under `mcp-refero/`, the frontmatter intent is `FLOWS`, and the resolved set matches `RF-R03`'s
- Desired user-visible outcome: the bundled workflow classifies the natural-phrasing request the same way it classifies the keyword-heavy `RF-R03` prompt, loading the same tool-surface taxonomy
- Pass/fail: PASS if the listed path exists, the frontmatter intent is `FLOWS`, and the resolved set matches `RF-R03`; FAIL if the listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Walk me through how real products structure the checkout journey from cart to confirmation.`

### Commands

1. `sed -n '1,15p' .opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/intra-routing-recall/holdout-flows.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-refero/SKILL.md | sed -n '/"FLOWS":/p'`
3. `for p in references/tool-surface.md; do test -e ".opencode/skills/mcp-tooling/mcp-refero/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: FLOWS` in the frontmatter. Step 2 shows the `INTENT_MODEL["FLOWS"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for the path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["FLOWS"]` excerpt.

### Pass / Fail

- **Pass**: the `expected_resources` path exists under the skill root, the frontmatter's `expected_intent` matches `FLOWS`, and the set matches `RF-R03`
- **Fail**: the listed path is missing, the frontmatter intent disagrees with `FLOWS`, or the resolved set diverges from `RF-R03` without explanation

### Failure Triage

1. Re-run step 3 for `references/tool-surface.md` and confirm whether it was renamed or removed under `references/`.
2. Compare this file's `expected_resources`/`expected_intent` against `flows.md` (`RF-R03`) directly -- a divergence between the fitted and holdout scenario for the same intent points to a routing regression, not a stale path.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2 | `INTENT_MODEL`/`INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §1 | Activation triggers this scenario's prompt assumes |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: RF-H02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-flows.md`
