---
id: RF-R05
category: intra-routing-recall
stage: routing
title: 'Troubleshoot routing'
description: "This scenario validates TROUBLESHOOT routing for `RF-R05`. It focuses on confirming the mcp-refero smart router's INTENT_MODEL classifier and RESOURCE_MAP load the troubleshooting reference and the MCP wiring reference for a failure-report prompt."
expected_intent: TROUBLESHOOT
expected_resources:
  - references/troubleshooting.md
  - references/mcp-wiring.md
version: 1.0.0.1
---

# RF-R05: Troubleshoot routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `RF-R05`.

---

## 1. OVERVIEW

This scenario validates TROUBLESHOOT routing for `RF-R05`. It focuses on confirming that a prompt reporting a 401 followed by a connection-closed error scores highest against `INTENT_MODEL["TROUBLESHOOT"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["TROUBLESHOOT"]` set, not on actually diagnosing the live failure, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

A 401 points at the OAuth/bearer wiring and a connection-closed error points at the transport itself, so `TROUBLESHOOT` is the only intent whose `RESOURCE_MAP` entry loads BOTH `troubleshooting.md` and `mcp-wiring.md` together. Confirming both load is what keeps a bundled workflow from treating an auth failure and a transport failure as the same fix.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `RF-R05` classifies as `TROUBLESHOOT` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `TROUBLESHOOT` and every path in `expected_resources`
- Real user request: `Every request failed: I get 401 unauthorized and then a connection closed error from Code Mode.`
- Prompt: `Every request failed: I get 401 unauthorized and then a connection closed error from Code Mode.`

**Exact prompt**:
```text
Every request failed: I get 401 unauthorized and then a connection closed error from Code Mode.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "failed", "401", "connection closed", and "unauthorized" each match `TROUBLESHOOT` keywords and no other intent scores as high, so `TROUBLESHOOT` becomes the primary intent and `RESOURCE_MAP["TROUBLESHOOT"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-refero/`, and each documents `TROUBLESHOOT` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the troubleshooting reference and the MCP wiring reference, then reports the auth-failure cause and the connection-closed cause separately rather than one generic error message
- Pass/fail: PASS if every listed path exists and the frontmatter intent is `TROUBLESHOOT`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Every request failed: I get 401 unauthorized and then a connection closed error from Code Mode.`

### Commands

1. `sed -n '1,15p' .opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/intra-routing-recall/troubleshoot.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-refero/SKILL.md | sed -n '/"TROUBLESHOOT":/p'`
3. `for p in references/troubleshooting.md references/mcp-wiring.md; do test -e ".opencode/skills/mcp-tooling/mcp-refero/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: TROUBLESHOOT` in the frontmatter. Step 2 shows the `INTENT_MODEL["TROUBLESHOOT"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 2 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["TROUBLESHOOT"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `TROUBLESHOOT`
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `TROUBLESHOOT`

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_MODEL["TROUBLESHOOT"]` excerpt and the `RESOURCE_MAP["TROUBLESHOOT"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: RF-R05
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/troubleshoot.md`
