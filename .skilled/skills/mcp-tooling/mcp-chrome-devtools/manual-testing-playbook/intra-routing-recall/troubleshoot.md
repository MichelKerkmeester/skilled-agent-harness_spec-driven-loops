---
id: CD-R04
category: intra_routing_recall
stage: routing
title: 'Troubleshoot routing'
description: "This scenario validates TROUBLESHOOT routing for `CD-R04`. It focuses on confirming the mcp-chrome-devtools smart router's INTENT_SIGNALS classifier and RESOURCE_MAP load the troubleshooting reference for a mid-run failure prompt."
expected_intent: TROUBLESHOOT
expected_resources:
  - references/troubleshooting.md
version: 1.0.0.1
---

# CD-R04: Troubleshoot routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CD-R04`.

---

## 1. OVERVIEW

This scenario validates TROUBLESHOOT routing for `CD-R04`. It focuses on confirming that a prompt reporting a mid-run connection error and a session issue scores highest against `INTENT_SIGNALS["TROUBLESHOOT"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["TROUBLESHOOT"]` set, not on actually diagnosing the live failure, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

TROUBLESHOOT has the largest keyword list of the five intents (`SKILL.md` §2), covering everything from "crash" to "flaky" to "root cause". Confirming a straightforward failure report like this one resolves `TROUBLESHOOT` and not `INSTALL` is the baseline case the two holdouts (`CD-H01`, `CD-H02`) later stress with less literal phrasing.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CD-R04` classifies as `TROUBLESHOOT` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `TROUBLESHOOT` and every path in `expected_resources`
- Real user request: `The debug session failed with a connection error mid-run; help me troubleshoot the session issue.`
- Prompt: `The debug session failed with a connection error mid-run; help me troubleshoot the session issue.`

**Exact prompt**:
```text
The debug session failed with a connection error mid-run; help me troubleshoot the session issue.
```

- Expected execution process: the router scores the prompt against `INTENT_SIGNALS` (`SKILL.md` §2); "failed", "error", "troubleshoot", and "session issue" each match `TROUBLESHOOT` keywords and no other intent scores as high, so `TROUBLESHOOT` becomes the primary intent and `RESOURCE_MAP["TROUBLESHOOT"]` loads the declared path
- Expected signals: the `expected_resources` path exists under `mcp-chrome-devtools/`, and it documents `TROUBLESHOOT` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the troubleshooting reference and diagnoses the mid-run connection failure rather than treating it as a fresh install
- Pass/fail: PASS if the listed path exists and the frontmatter intent is `TROUBLESHOOT`; FAIL if the listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The debug session failed with a connection error mid-run; help me troubleshoot the session issue.`

### Commands

1. `sed -n '1,14p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/troubleshoot.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md | sed -n '/"TROUBLESHOOT":/p'`
3. `for p in references/troubleshooting.md; do test -e ".opencode/skills/mcp-tooling/mcp-chrome-devtools/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: TROUBLESHOOT` in the frontmatter. Step 2 shows the `INTENT_SIGNALS["TROUBLESHOOT"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for the path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_SIGNALS["TROUBLESHOOT"]` excerpt.

### Pass / Fail

- **Pass**: the `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `TROUBLESHOOT`
- **Fail**: the listed path is missing, or the frontmatter intent disagrees with `TROUBLESHOOT`

### Failure Triage

1. Re-run step 3 for `references/troubleshooting.md` and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_SIGNALS["TROUBLESHOOT"]` excerpt and the `RESOURCE_MAP["TROUBLESHOOT"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: CD-R04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/troubleshoot.md`
