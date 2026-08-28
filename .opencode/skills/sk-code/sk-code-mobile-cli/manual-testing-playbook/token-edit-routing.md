---
id: PR-001
category: implementation
title: 'Token edit routing'
description: "This scenario validates IMPLEMENTATION routing for `PR-001`. It focuses on confirming the code-mobile-cli surface's PI_REMOTE detection and INTENT_SIGNALS classifier load the token/retint/theme evidence a component-token edit needs."
expected_surface: PI_REMOTE
expected_intent: IMPLEMENTATION
expected_resources:
  - references/token-library.md
  - references/comment-grammar.md
  - references/component-tokens.md
  - references/retint-recipes.md
  - references/theme-remap.md
  - references/scoped-style-ownership.md
  - assets/token-retint-checklist.md
version: 1.0.0.0
---

# PR-001: Token edit routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-001`.

---

## 1. OVERVIEW

This scenario validates IMPLEMENTATION routing for `PR-001`. It focuses on confirming that once the hub
resolves the `PI_REMOTE` surface (SKILL.md §1), a component-token retint prompt loads the token model,
the natural comment grammar, the component-token inventory, the worked retint recipes, the theme remap,
and the pre-flight checklist this scenario declares in `expected_resources` — not on executing any Pi
Remote app command directly, since `app-mobile/` does not live in this repository.

### Why This Matters

Retinting the wrong layer produces either an unwanted system-wide cascade (editing a semantic role when
only one surface should move) or a leak into an unintended surface (editing the wrong component token).
Loading `token-library.md`, `component-tokens.md`, `retint-recipes.md`, and `theme-remap.md` together is
what lets a bundled workflow (`sk-code-quality` or `sk-code-review`) pick the correct layer and prove the
change with the browser-free resolver diff instead of a screenshot.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-001` classifies as `IMPLEMENTATION` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `IMPLEMENTATION`, and every
  path in `expected_resources`.
- Real user request: `Retint the model-effort-sheet accent so it reads a warmer accent role without touching the frozen --pi-* primitives.`
- Prompt: `Retint the model-effort-sheet accent so it reads a warmer accent role without touching the frozen --pi-* primitives.`

**Exact prompt**:
```text
Retint the model-effort-sheet accent so it reads a warmer accent role without touching the frozen --pi-* primitives.
```

- Expected execution process: the hub detects `PI_REMOTE` from the task's `app-mobile`/`app-relay`/
  `packages/pi-rpc-protocol` context, the `IMPLEMENTATION` `INTENT_SIGNALS` keywords (`retint`, `component
  token`, `primitive`, ...) match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-mobile-cli/`, and each one
  documents `IMPLEMENTATION` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow retints `--model-sheet-accent` (a component token),
  never a `--pi-*` primitive, and can show the resolver's `CHANGED`/`VANISHED`/`ADDED` diff before any
  completion claim.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `PI_REMOTE`/
  `IMPLEMENTATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Retint the model-effort-sheet accent so it reads a warmer accent role without touching the frozen --pi-* primitives.`

### Commands

1. `sed -n '1,15p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/token-edit-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"IMPLEMENTATION":/,/\],/p'`
3. `for p in references/token-library.md references/comment-grammar.md references/component-tokens.md references/retint-recipes.md references/theme-remap.md references/scoped-style-ownership.md assets/token-retint-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: PI_REMOTE` and `expected_intent: IMPLEMENTATION`. Step 2 shows the
`IMPLEMENTATION` `RESOURCE_MAP` entry this scenario's set derives from. Step 3 prints `OK` for all seven
paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["IMPLEMENTATION"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `PI_REMOTE`/`IMPLEMENTATION`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `PI_REMOTE`/`IMPLEMENTATION`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["IMPLEMENTATION"]` excerpt
   to see whether the drift is a stale scenario file or a stale `SKILL.md` map — note that the two sets
   are not required to be identical (`expected_resources` is a curated core subset, not an exact mirror).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../SKILL.md) §1 | The `PI_REMOTE` surface-detection trigger this scenario assumes |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli routing
- Playbook ID: PR-001
- Canonical root source: [manual-testing-playbook.md](manual-testing-playbook.md)
- Feature file path: `token-edit-routing.md`
