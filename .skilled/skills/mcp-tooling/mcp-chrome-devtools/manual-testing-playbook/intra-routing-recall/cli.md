---
id: CD-R01
category: intra_routing_recall
stage: routing
title: 'CLI routing'
description: "This scenario validates CLI routing for `CD-R01`. It focuses on confirming the mcp-chrome-devtools smart router's INTENT_SIGNALS classifier and RESOURCE_MAP load the CDP patterns and session-management references for a terminal-driven bdg CLI prompt."
expected_intent: CLI
expected_resources:
  - references/cdp-patterns.md
  - references/session-management.md
version: 1.0.0.1
---

# CD-R01: CLI routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CD-R01`.

---

## 1. OVERVIEW

This scenario validates CLI routing for `CD-R01`. It focuses on confirming that a prompt asking to drive a headless debug session from the terminal with `bdg` scores highest against `INTENT_SIGNALS["CLI"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["CLI"]` set, not on actually running the CDP trace, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

CLI is the lightweight, token-efficient default path (`bdg`), distinct from the heavier MCP parallel-instance path (`SKILL.md` §2 Pattern 3). Confirming this prompt resolves `CLI` and loads both `cdp-patterns.md` and `session-management.md` is what keeps a bundled workflow on the terminal tool instead of reaching for Code Mode when a single headless session is all that's needed.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CD-R01` classifies as `CLI` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `CLI` and every path in `expected_resources`
- Real user request: `Drive a headless browser debug session from the terminal with the bdg command-line tool and dump a CDP trace.`
- Prompt: `Drive a headless browser debug session from the terminal with the bdg command-line tool and dump a CDP trace.`

**Exact prompt**:
```text
Drive a headless browser debug session from the terminal with the bdg command-line tool and dump a CDP trace.
```

- Expected execution process: the router scores the prompt against `INTENT_SIGNALS` (`SKILL.md` §2); "terminal", "command line" (via "bdg command-line tool"), and "headless" each match `CLI` keywords and no other intent scores as high, so `CLI` becomes the primary intent and `RESOURCE_MAP["CLI"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-chrome-devtools/`, and each documents `CLI` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the CDP patterns and session-management references and drives the debug session through the `bdg` CLI rather than Code Mode
- Pass/fail: PASS if every listed path exists and the frontmatter intent is `CLI`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Drive a headless browser debug session from the terminal with the bdg command-line tool and dump a CDP trace.`

### Commands

1. `sed -n '1,15p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/cli.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md | sed -n '/"CLI":/p'`
3. `for p in references/cdp-patterns.md references/session-management.md; do test -e ".opencode/skills/mcp-tooling/mcp-chrome-devtools/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: CLI` in the frontmatter. Step 2 shows the `INTENT_SIGNALS["CLI"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 2 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_SIGNALS["CLI"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `CLI`
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `CLI`

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_SIGNALS["CLI"]` excerpt and the `RESOURCE_MAP["CLI"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: CD-R01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/cli.md`
