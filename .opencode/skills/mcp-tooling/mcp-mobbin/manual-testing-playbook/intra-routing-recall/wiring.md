---
id: MB-R05
category: intra-routing-recall
stage: routing
title: 'Wiring routing'
description: "This scenario validates WIRING_AUTH routing for `MB-R05`. It focuses on confirming the mcp-mobbin smart router's INTENT_MODEL classifier and RESOURCE_MAP load the MCP wiring reference and the paste-ready UTCP manual asset for a setup/auth prompt."
expected_intent: WIRING_AUTH
expected_resources:
  - references/mcp-wiring.md
  - assets/utcp-mobbin-manual.md
version: 1.0.0.1
---

# MB-R05: Wiring routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `MB-R05`.

---

## 1. OVERVIEW

This scenario validates WIRING_AUTH routing for `MB-R05`. It focuses on confirming that a prompt about the UTCP manual, `mcp-remote` OAuth handling, and authentication scores highest against `INTENT_MODEL["WIRING_AUTH"]` in `SKILL.md` §2 and resolves the `RESOURCE_MAP["WIRING_AUTH"]` set, not on actually registering the manual, since this scenario only exercises which intent and resources the router selects.

### Why This Matters

WIRING_AUTH is the only intent whose `RESOURCE_MAP` entry loads the paste-ready `assets/utcp-mobbin-manual.md` snippet alongside `mcp-wiring.md`. Verifying this two-path set is what keeps the OAuth/PKCE setup path discoverable without pulling it into every research-intent route (`APPS`/`SCREENS`/`FLOWS`/`ELEMENTS`).

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `MB-R05` classifies as `WIRING_AUTH` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `WIRING_AUTH` and every path in `expected_resources`
- Real user request: `Explain the mobbin utcp manual wiring, how mcp-remote handles oauth, and how I authenticate before we register anything.`
- Prompt: `Explain the mobbin utcp manual wiring, how mcp-remote handles oauth, and how I authenticate before we register anything.`

**Exact prompt**:
```text
Explain the mobbin utcp manual wiring, how mcp-remote handles oauth, and how I authenticate before we register anything.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); "wiring", "utcp", "oauth", "mcp-remote", "authenticate", and "register" each match `WIRING_AUTH` keywords and no other intent scores as high, so `WIRING_AUTH` becomes the primary intent and `RESOURCE_MAP["WIRING_AUTH"]` loads both declared paths
- Expected signals: every path in `expected_resources` exists under `mcp-mobbin/`, and each documents `WIRING_AUTH` routing per `SKILL.md` §2
- Desired user-visible outcome: the bundled workflow loads the MCP wiring reference and the paste-ready UTCP manual snippet before walking through registration and OAuth/PKCE authentication
- Pass/fail: PASS if every listed path exists and the frontmatter intent is `WIRING_AUTH`; FAIL if any listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Explain the mobbin utcp manual wiring, how mcp-remote handles oauth, and how I authenticate before we register anything.`

### Commands

1. `sed -n '1,15p' .opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/wiring.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md | sed -n '/"WIRING_AUTH":/p'`
3. `for p in references/mcp-wiring.md assets/utcp-mobbin-manual.md; do test -e ".opencode/skills/mcp-tooling/mcp-mobbin/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: WIRING_AUTH` in the frontmatter. Step 2 shows the `INTENT_MODEL["WIRING_AUTH"]` keyword-weight entry this scenario's classification derives from. Step 3 prints `OK` for all 2 paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL["WIRING_AUTH"]` excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's `expected_intent` matches `WIRING_AUTH`
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `WIRING_AUTH`

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `INTENT_MODEL["WIRING_AUTH"]` excerpt and the `RESOURCE_MAP["WIRING_AUTH"]` entry in `SKILL.md` §2 to see whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
- Playbook ID: MB-R05
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/wiring.md`
