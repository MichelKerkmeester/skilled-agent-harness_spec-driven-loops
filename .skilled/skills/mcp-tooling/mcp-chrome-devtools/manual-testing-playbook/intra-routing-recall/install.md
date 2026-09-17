---
id: CD-R03
category: intra_routing_recall
stage: routing
title: 'Install routing'
description: "This scenario validates INSTALL routing for `CD-R03`. It focuses on confirming the mcp-chrome-devtools smart router's INTENT_SIGNALS classifier and RESOURCE_MAP load the troubleshooting reference for a not-installed/setup prompt."
expected_intent: INSTALL
expected_resources:
  - references/troubleshooting.md
version: 1.0.0.1
---

# CD-R03: Install routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CD-R03`.

---

## 1. OVERVIEW

This scenario validates INSTALL routing for `CD-R03`. It focuses on confirming that a prompt reporting the tool is not installed and asking for setup scores highest against `INTENT_SIGNALS["INSTALL"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["INSTALL"]` set, not on actually running the install, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

INSTALL and TROUBLESHOOT share the single `troubleshooting.md` resource (`SKILL.md` §2 `RESOURCE_MAP`), so this scenario is what proves the two intents stay distinguishable by keyword even though they load the same file -- a setup-phase failure and a mid-session failure get different guidance sections inside that one reference.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CD-R03` classifies as `INSTALL` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `INSTALL` and every path in `expected_resources`
- Real user request: `The tool is not installed on this machine; walk me through the initial setup.`
- Prompt: `The tool is not installed on this machine; walk me through the initial setup.`

**Exact prompt**:
```text
The tool is not installed on this machine; walk me through the initial setup.
```

- Expected execution process: the router scores the prompt against `INTENT_SIGNALS` (`SKILL.md` §2); "not installed" and "setup" each match `INSTALL` keywords and no other intent scores as high, so `INSTALL` becomes the primary intent and `RESOURCE_MAP["INSTALL"]` loads the declared path
- Expected signals: the `expected_resources` path exists under `mcp-chrome-devtools/`, and it documents `INSTALL` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the troubleshooting reference and walks through the initial `bdg` setup rather than assuming an existing session is misbehaving
- Pass/fail: PASS if the listed path exists and the frontmatter intent is `INSTALL`; FAIL if the listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The tool is not installed on this machine; walk me through the initial setup.`

### Commands

1. `sed -n '1,14p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/install.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md | sed -n '/"INSTALL":/p'`
3. `for p in references/troubleshooting.md; do test -e ".opencode/skills/mcp-tooling/mcp-chrome-devtools/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: INSTALL` in the frontmatter. Step 2 shows the `INTENT_SIGNALS["INSTALL"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for the path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_SIGNALS["INSTALL"]` excerpt.

### Pass / Fail

- **Pass**: the `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `INSTALL`
- **Fail**: the listed path is missing, or the frontmatter intent disagrees with `INSTALL`

### Failure Triage

1. Re-run step 3 for `references/troubleshooting.md` and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_SIGNALS["INSTALL"]` excerpt and the `RESOURCE_MAP["INSTALL"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: CD-R03
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/install.md`
