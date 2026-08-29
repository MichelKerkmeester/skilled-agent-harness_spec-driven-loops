---
id: CD-H02
category: intra_routing_recall
stage: holdout
title: 'Blind holdout: shell-driven'
description: "This scenario is the natural-phrasing holdout for `CD-R01`. It focuses on confirming a prompt written in plain user language, blind to most of INTENT_SIGNALS's CLI vocabulary, still routes to CLI and resolves the same RESOURCE_MAP set."
expected_intent: CLI
expected_resources:
  - references/cdp-patterns.md
  - references/session-management.md
blindToRouterKeywords: true
version: 1.0.0.1
---

# CD-H02: Blind holdout: shell-driven

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CD-H02`.

---

## 1. OVERVIEW

This scenario is the natural-phrasing holdout for `CD-R01` (`blindToRouterKeywords: true`). It focuses on confirming that a prompt phrased the way a real user would describe running the debugger from their own shell -- not the router's own vocabulary -- still classifies as `CLI` per `SKILL.md` §2 and resolves the same `RESOURCE_MAP["CLI"]` set as `CD-R01`, not on actually running the capture.

### Why This Matters

"My shell prompt" is how a real user says "terminal"/"command line" without using either literal phrase. This holdout checks the classifier generalizes past its literal `CLI` keyword list -- "shell" is the one direct hit -- which is what makes it a decontamination check rather than a restatement of `CD-R01`.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact holdout prompt for `CD-H02` classifies as `CLI` and resolves the same declared resource set as its fitted counterpart `CD-R01`.

- Objective: confirm the natural-phrasing prompt routes to intent `CLI` and every path in `expected_resources`, decontaminating `CD-R01`
- Real user request: `Drive the page debugger straight from my shell prompt to snapshot the request waterfall.`
- Prompt: `Drive the page debugger straight from my shell prompt to snapshot the request waterfall.`

**Exact prompt**:
```text
Drive the page debugger straight from my shell prompt to snapshot the request waterfall.
```

- Expected execution process: the router scores the prompt against `INTENT_SIGNALS` (`SKILL.md` §2); "shell" is the one literal `CLI` keyword hit, and no other intent's keyword list matches any word in the prompt, so `CLI` remains the sole scoring intent and `RESOURCE_MAP["CLI"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-chrome-devtools/`, the frontmatter intent is `CLI`, and the resolved set matches `CD-R01`'s
- Desired user-visible outcome: the bundled workflow classifies the natural-phrasing request the same way it classifies the keyword-heavy `CD-R01` prompt, loading the same CDP patterns and session-management references
- Pass/fail: PASS if every listed path exists, the frontmatter intent is `CLI`, and the resolved set matches `CD-R01`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Drive the page debugger straight from my shell prompt to snapshot the request waterfall.`

### Commands

1. `sed -n '1,16p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/holdout-cli.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md | sed -n '/"CLI":/p'`
3. `for p in references/cdp-patterns.md references/session-management.md; do test -e ".opencode/skills/mcp-tooling/mcp-chrome-devtools/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: CLI` in the frontmatter. Step 2 shows the `INTENT_SIGNALS["CLI"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 2 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_SIGNALS["CLI"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root, the frontmatter's `expected_intent` matches `CLI`, and the set matches `CD-R01`
- **Fail**: any listed path is missing, the frontmatter intent disagrees with `CLI`, or the resolved set diverges from `CD-R01` without explanation

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/`.
2. Compare this file's `expected_resources`/`expected_intent` against `cli.md` (`CD-R01`) directly -- a divergence between the fitted and holdout scenario for the same intent points to a routing regression, not a stale path.

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
- Playbook ID: CD-H02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-cli.md`
