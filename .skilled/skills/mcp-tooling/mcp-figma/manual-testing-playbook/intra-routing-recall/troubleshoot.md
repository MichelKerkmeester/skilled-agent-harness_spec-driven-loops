---
id: FG-R06
category: intra_routing_recall
stage: routing
title: 'Troubleshoot routing'
description: "This scenario validates TROUBLESHOOT routing for `FG-R06`. It focuses on confirming the mcp-figma smart router's INTENT_MODEL classifier and RESOURCE_MAP load the troubleshooting reference and the CLI baseline for a failure-report prompt."
expected_intent: TROUBLESHOOT
expected_resources:
  - references/troubleshooting.md
  - references/figma-cli-reference.md
version: 1.0.0.1
---

# FG-R06: Troubleshoot routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `FG-R06`.

---

## 1. OVERVIEW

This scenario validates TROUBLESHOOT routing for `FG-R06`. It focuses on confirming that a prompt describing a failed command, a missing binary, and an unauthorized response scores highest against `INTENT_MODEL["TROUBLESHOOT"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["TROUBLESHOOT"]` set, not on actually diagnosing the live failure, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

TROUBLESHOOT is the fallback-repair path for every other phase: a binary-not-found or unauthorized report can surface from CONNECT_SETUP_DAEMON, INSPECT_EXPORT, or any other route. Confirming `troubleshooting.md` loads first, ahead of the phase-specific reference, is what keeps the failure-mode guidance in front of a bundled workflow instead of it repeating the failing command blind.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `FG-R06` classifies as `TROUBLESHOOT` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `TROUBLESHOOT` and every path in `expected_resources`
- Real user request: `The command failed: the binary is not found and the request came back unauthorized.`
- Prompt: `The command failed: the binary is not found and the request came back unauthorized.`

**Exact prompt**:
```text
The command failed: the binary is not found and the request came back unauthorized.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "failed", "binary not found", and "unauthorized" each match `TROUBLESHOOT` keywords and no other intent scores as high, so `TROUBLESHOOT` becomes the primary intent and `RESOURCE_MAP["TROUBLESHOOT"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-figma/`, and each documents `TROUBLESHOOT` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the troubleshooting reference and CLI baseline, then reports the binary-detection state and the unauthorized cause with a concrete recovery step rather than repeating the failing command blind
- Pass/fail: PASS if every listed path exists and the frontmatter intent is `TROUBLESHOOT`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The command failed: the binary is not found and the request came back unauthorized.`

### Commands

1. `sed -n '1,15p' .opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/troubleshoot.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-figma/SKILL.md | sed -n '/"TROUBLESHOOT":/p'`
3. `for p in references/troubleshooting.md references/figma-cli-reference.md; do test -e ".opencode/skills/mcp-tooling/mcp-figma/$p" && echo "OK $p" || echo "MISS $p"; done`

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
- Playbook ID: FG-R06
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/troubleshoot.md`
