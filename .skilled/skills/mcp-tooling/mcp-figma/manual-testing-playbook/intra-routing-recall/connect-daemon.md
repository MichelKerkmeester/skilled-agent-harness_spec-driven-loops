---
id: FG-R04
category: intra_routing_recall
stage: routing
title: 'Connect/setup daemon routing'
description: "This scenario validates CONNECT_SETUP_DAEMON routing for `FG-R04`. It focuses on confirming the mcp-figma smart router's INTENT_MODEL classifier and RESOURCE_MAP load the CLI/daemon baseline and the troubleshooting reference for a connect/daemon-health prompt."
expected_intent: CONNECT_SETUP_DAEMON
expected_resources:
  - references/figma-cli-reference.md
  - references/troubleshooting.md
version: 1.0.0.1
---

# FG-R04: Connect/setup daemon routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `FG-R04`.

---

## 1. OVERVIEW

This scenario validates CONNECT_SETUP_DAEMON routing for `FG-R04`. It focuses on confirming that a prompt about connecting, patching/unpatching, and diagnosing the daemon scores highest against `INTENT_MODEL["CONNECT_SETUP_DAEMON"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["CONNECT_SETUP_DAEMON"]` set, not on actually running the connect, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

CONNECT_SETUP_DAEMON is Phase 1 (`SKILL.md` §2): safe connect is the default and yolo patching requires explicit consent. Loading `troubleshooting.md` alongside `figma-cli-reference.md` is what gives a bundled workflow the failure-mode and daemon-diagnose guidance it needs before it ever proposes the yolo `app.asar` patch path.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `FG-R04` classifies as `CONNECT_SETUP_DAEMON` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `CONNECT_SETUP_DAEMON` and every path in `expected_resources`
- Real user request: `Connect the local daemon and safely diagnose whether to patch or unpatch it.`
- Prompt: `Connect the local daemon and safely diagnose whether to patch or unpatch it.`

**Exact prompt**:
```text
Connect the local daemon and safely diagnose whether to patch or unpatch it.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "connect", "safe", "patch" ("unpatch" also matches the substring), "daemon", and "diagnose" each match `CONNECT_SETUP_DAEMON` keywords and no other intent scores as high, so `CONNECT_SETUP_DAEMON` becomes the primary intent and `RESOURCE_MAP["CONNECT_SETUP_DAEMON"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-figma/`, and each documents `CONNECT_SETUP_DAEMON` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the CLI/daemon baseline and troubleshooting reference, defaults to safe connect, and gates any yolo patch behind explicit consent and a stated rollback
- Pass/fail: PASS if every listed path exists and the frontmatter intent is `CONNECT_SETUP_DAEMON`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Connect the local daemon and safely diagnose whether to patch or unpatch it.`

### Commands

1. `sed -n '1,15p' .opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/connect-daemon.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-figma/SKILL.md | sed -n '/"CONNECT_SETUP_DAEMON":/p'`
3. `for p in references/figma-cli-reference.md references/troubleshooting.md; do test -e ".opencode/skills/mcp-tooling/mcp-figma/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: CONNECT_SETUP_DAEMON` in the frontmatter. Step 2 shows the `INTENT_MODEL["CONNECT_SETUP_DAEMON"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 2 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["CONNECT_SETUP_DAEMON"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `CONNECT_SETUP_DAEMON`
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `CONNECT_SETUP_DAEMON`

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_MODEL["CONNECT_SETUP_DAEMON"]` excerpt and the `RESOURCE_MAP["CONNECT_SETUP_DAEMON"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: FG-R04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/connect-daemon.md`
