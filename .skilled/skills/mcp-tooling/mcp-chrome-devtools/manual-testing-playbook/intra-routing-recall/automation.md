---
id: CD-R05
category: intra_routing_recall
stage: routing
title: 'Automation routing'
description: "This scenario validates AUTOMATION routing for `CD-R05`. It focuses on confirming the mcp-chrome-devtools smart router's INTENT_SIGNALS classifier and RESOURCE_MAP load the CDP patterns and session-management references for a CI/pipeline automation prompt."
expected_intent: AUTOMATION
expected_resources:
  - references/cdp-patterns.md
  - references/session-management.md
version: 1.0.0.1
---

# CD-R05: Automation routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CD-R05`.

---

## 1. OVERVIEW

This scenario validates AUTOMATION routing for `CD-R05`. It focuses on confirming that a prompt about wiring browser capture into an unattended CI pipeline scores highest against `INTENT_SIGNALS["AUTOMATION"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["AUTOMATION"]` set, not on actually wiring the pipeline, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

AUTOMATION is the lowest-weighted intent (`weight: 3` versus `4` for the other four, per `SKILL.md` §2 `INTENT_SIGNALS`), so it is the one most likely to lose a close tie. Confirming this CI/pipeline-heavy prompt still resolves `AUTOMATION` over `CLI` (which also mentions no CLI-specific terms here) is what proves the lower weight does not silently starve the intent of real matches.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CD-R05` classifies as `AUTOMATION` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `AUTOMATION` and every path in `expected_resources`
- Real user request: `Wire this browser capture into a CI pipeline so it runs unattended in production automation.`
- Prompt: `Wire this browser capture into a CI pipeline so it runs unattended in production automation.`

**Exact prompt**:
```text
Wire this browser capture into a CI pipeline so it runs unattended in production automation.
```

- Expected execution process: the router scores the prompt against `INTENT_SIGNALS` (`SKILL.md` §2); "ci", "pipeline", "automation", "unattended", and "production" each match `AUTOMATION` keywords (weight 3) and no other intent scores as high, so `AUTOMATION` becomes the primary intent and `RESOURCE_MAP["AUTOMATION"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-chrome-devtools/`, and each documents `AUTOMATION` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the CDP patterns and session-management references and treats the request as a recurring unattended job rather than a one-off interactive session
- Pass/fail: PASS if every listed path exists and the frontmatter intent is `AUTOMATION`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Wire this browser capture into a CI pipeline so it runs unattended in production automation.`

### Commands

1. `sed -n '1,15p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/automation.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md | sed -n '/"AUTOMATION":/p'`
3. `for p in references/cdp-patterns.md references/session-management.md; do test -e ".opencode/skills/mcp-tooling/mcp-chrome-devtools/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: AUTOMATION` in the frontmatter. Step 2 shows the `INTENT_SIGNALS["AUTOMATION"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 2 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_SIGNALS["AUTOMATION"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `AUTOMATION`
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `AUTOMATION`

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_SIGNALS["AUTOMATION"]` excerpt and the `RESOURCE_MAP["AUTOMATION"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: CD-R05
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/automation.md`
