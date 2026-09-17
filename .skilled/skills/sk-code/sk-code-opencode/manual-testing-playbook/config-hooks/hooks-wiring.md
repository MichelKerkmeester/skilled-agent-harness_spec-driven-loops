---
id: OC-005
category: config_hooks
title: 'Hooks wiring routing'
description: "This scenario validates HOOKS routing for `OC-005`. It confirms a session-prime/pre-tool-use wiring prompt loads `references/shared/hooks.md`, the single maintained hook-entrypoint reference, instead of a broader implementation or config resource set."
expected_surface: OPENCODE
expected_intent: HOOKS
expected_resources:
  - references/shared/hooks.md
version: 1.0.0.0
---

# OC-005: Hooks wiring routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OC-005`.

---

## 1. OVERVIEW

This scenario validates `HOOKS` routing for `OC-005`. It focuses on confirming that the exact prompt
below classifies as `HOOKS` and loads the single routed resource instead of a generic or mismatched
resource set, per `SKILL.md` §2b's machine-readable router.

### Why This Matters

Hook wiring spans session-prime and pre/post-tool-use entrypoints across the OpenCode plugin bridge. `references/shared/hooks.md` is the single reference for current hook infrastructure; a request mis-routed elsewhere risks re-deriving stale wiring assumptions instead of reading the maintained contract.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-005` classifies as `HOOKS` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OPENCODE`, intent `HOOKS`, and every path in
  `expected_resources`.
- Real user request: `Explain how session-prime and pre-tool-use hooks should be wired for an OpenCode plugin bridge.`
- Prompt: `Explain how session-prime and pre-tool-use hooks should be wired for an OpenCode plugin bridge.`

**Exact prompt**:
```text
Explain how session-prime and pre-tool-use hooks should be wired for an OpenCode plugin bridge.
```

- Expected execution process: the hub detects `OPENCODE` (work under `.opencode/`), the `HOOKS`
  `INTENT_SIGNALS` keywords match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-opencode/`, and each one
  documents `HOOKS` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow cites the routed `HOOKS` resources as the
  standards evidence, not a mismatched language or generic tier.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OPENCODE`/
  `HOOKS`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Explain how session-prime and pre-tool-use hooks should be wired for an OpenCode plugin bridge.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/config-hooks/hooks-wiring.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | grep -F '"HOOKS"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | sed -n '/"HOOKS": \[/,/\],/p'`
4. `for p in references/shared/hooks.md; do test -e ".opencode/skills/sk-code/sk-code-opencode/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: HOOKS` and the full `expected_resources` list in the frontmatter. Step
2 shows the `INTENT_SIGNALS["HOOKS"]` keyword list this scenario's prompt matches. Step 3 shows the
`RESOURCE_MAP["HOOKS"]` array this scenario's list should mirror. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `RESOURCE_MAP["HOOKS"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `HOOKS`.
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `HOOKS`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/shared/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["HOOKS"]` excerpt to see
   whether the drift is a stale scenario file or a stale `SKILL.md` map.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §2 | Reference-map prose entry for the `HOOKS` resource set |

---

## 5. SOURCE METADATA

- Group: code-opencode routing
- Playbook ID: OC-005
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `config-hooks/hooks-wiring.md`
