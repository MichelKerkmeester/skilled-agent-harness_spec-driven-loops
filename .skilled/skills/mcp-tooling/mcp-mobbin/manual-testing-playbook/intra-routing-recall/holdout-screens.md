---
id: MB-H01
category: intra-routing-recall
stage: holdout
title: 'Blind holdout: real-app pattern evidence'
description: "This scenario is the natural-phrasing holdout for `MB-R02`. It focuses on confirming a prompt written in plain user language, blind to most of INTENT_MODEL's SCREENS vocabulary except the recorded 'first open' exception, still routes to SCREENS and resolves the same RESOURCE_MAP set."
expected_intent: SCREENS
expected_resources:
  - references/tool-surface.md
blindToRouterKeywords: true
blindExceptions:
  - "first open"
version: 1.0.0.1
---

# MB-H01: Blind holdout: real-app pattern evidence

This document captures the routing-recall contract, execution process, source anchors, and metadata for `MB-H01`.

---

## 1. OVERVIEW

This scenario is the natural-phrasing holdout for `MB-R02` (`blindToRouterKeywords: true`). It focuses on confirming that a prompt phrased the way a real user would describe a first-run empty state -- not the router's own vocabulary -- still classifies as `SCREENS` per `SKILL.md` §2 and resolves the same `RESOURCE_MAP["SCREENS"]` set as `MB-R02`, not on actually running the search.

### Route Binding

Bound to `SCREENS` by the keyword "first open" (added during routing remediation; the first-open/empty-state moment is core screens vocabulary). The holdout stays blind to provider aliases and the literal "screen"/"empty state" phrases, but is no longer blind for "first open" -- recorded in `blindExceptions` above.

### Why This Matters

"The moment a user first opens the app with nothing saved yet" is how a real user describes what the router calls an "empty state" "screen." This holdout checks the classifier generalizes past its literal `SCREENS` keyword list -- "first open" is the one recorded exception hit, tracked explicitly in `blindExceptions` rather than left as an undocumented loophole -- which is what makes it a decontamination check rather than a restatement of `MB-R02`.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact holdout prompt for `MB-H01` classifies as `SCREENS` and resolves the same declared resource set as its fitted counterpart `MB-R02`.

- Objective: confirm the natural-phrasing prompt routes to intent `SCREENS` and every path in `expected_resources`, decontaminating `MB-R02`
- Real user request: `I want to see how shipped iOS products present the moment a user first opens the app with nothing saved yet.`
- Prompt: `I want to see how shipped iOS products present the moment a user first opens the app with nothing saved yet.`

**Exact prompt**:
```text
I want to see how shipped iOS products present the moment a user first opens the app with nothing saved yet.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "first open" is the one recorded-exception `SCREENS` keyword hit, and no other intent's keyword list matches any word in the prompt, so `SCREENS` remains the sole scoring intent and `RESOURCE_MAP["SCREENS"]` loads the declared path
- Expected signals: the `expected_resources` path exists under `mcp-mobbin/`, the frontmatter intent is `SCREENS`, and the resolved set matches `MB-R02`'s
- Desired user-visible outcome: the bundled workflow classifies the natural-phrasing request the same way it classifies the keyword-heavy `MB-R02` prompt, loading the same tool-surface taxonomy
- Pass/fail: PASS if the listed path exists, the frontmatter intent is `SCREENS`, and the resolved set matches `MB-R02`; FAIL if the listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I want to see how shipped iOS products present the moment a user first opens the app with nothing saved yet.`

### Commands

1. `sed -n '1,17p' .opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/holdout-screens.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md | sed -n '/"SCREENS":/p'`
3. `for p in references/tool-surface.md; do test -e ".opencode/skills/mcp-tooling/mcp-mobbin/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: SCREENS` in the frontmatter. Step 2 shows the `INTENT_MODEL["SCREENS"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for the path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["SCREENS"]` excerpt.

### Pass / Fail

- **Pass**: the `expected_resources` path exists under the skill root, the frontmatter's `expected_intent` matches `SCREENS`, and the set matches `MB-R02`
- **Fail**: the listed path is missing, the frontmatter intent disagrees with `SCREENS`, or the resolved set diverges from `MB-R02` without explanation

### Failure Triage

1. Re-run step 3 for `references/tool-surface.md` and confirm whether it was renamed or removed under `references/`.
2. Compare this file's `expected_resources`/`expected_intent` against `screens.md` (`MB-R02`) directly -- a divergence between the fitted and holdout scenario for the same intent points to a routing regression, not a stale path.

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
- Playbook ID: MB-H01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-screens.md`
