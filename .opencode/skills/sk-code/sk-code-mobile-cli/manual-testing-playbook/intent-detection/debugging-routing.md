---
id: PR-004
category: debugging
title: 'Debugging routing'
description: "This scenario validates DEBUGGING routing for `PR-004`. It focuses on confirming a retint-leak debugging prompt loads the verification method and the shared debug doctrine instead of the implementation evidence."
expected_surface: PI_REMOTE
expected_intent: DEBUGGING
expected_resources:
  - references/verification.md
version: 1.0.0.0
---

# PR-004: Debugging routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-004`.

---

## 1. OVERVIEW

This scenario validates DEBUGGING routing for `PR-004`. It focuses on confirming that a symptom-shaped
prompt ("leaked into the slash panel") classifies as `DEBUGGING`, not `IMPLEMENTATION`, and loads the
browser-free verification method plus the shared implement→debug→verify doctrine's debug reference, so a
workflow reproduces the symptom and traces its cause before touching any token.

### Why This Matters

A retint that leaks into an unintended surface is a routing/scoping bug, not a color choice — the fix is
diagnosing which selector or token alias is shared, not picking a different value. Loading
`verification.md` gives the resolver method needed to show the leak; the surface-bundled `workflow-debug.md`
doctrine gives the reproduce → trace → scope-repair sequence this surface does not restate.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-004` classifies as `DEBUGGING` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `DEBUGGING`, and every path
  in `expected_resources`.
- Real user request: `Debug why the model-sheet accent retint leaked into the slash panel after a component-token change.`
- Prompt: `Debug why the model-sheet accent retint leaked into the slash panel after a component-token change.`

**Exact prompt**:
```text
Debug why the model-sheet accent retint leaked into the slash panel after a component-token change.
```

- Expected execution process: the hub detects `PI_REMOTE`, the `DEBUGGING` `INTENT_SIGNALS` keywords
  (`debug`, `leaking retint`, ...) match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-mobile-cli/`, and each one
  documents `DEBUGGING` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow finds the shared component-token alias behind the
  leak, using the resolver diff from `verification.md` as evidence, and scopes the repair to the correct
  layer per `references/component-tokens.md`.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `PI_REMOTE`/
  `DEBUGGING`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Debug why the model-sheet accent retint leaked into the slash panel after a component-token change.`

### Commands

1. `sed -n '1,12p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/intent-detection/debugging-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"DEBUGGING":/,/\],/p'`
3. `for p in references/verification.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: PI_REMOTE` and `expected_intent: DEBUGGING`. Step 2 shows the `DEBUGGING`
`RESOURCE_MAP` entry this scenario's set derives from. Step 3 prints `OK` for both paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["DEBUGGING"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `PI_REMOTE`/`DEBUGGING`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `PI_REMOTE`/`DEBUGGING`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["DEBUGGING"]` excerpt to see
   whether the drift is a stale scenario file or a stale `SKILL.md` map — the two sets are not required to
   be identical (`expected_resources` is a curated core subset, not an exact mirror).

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
| [SKILL.md](../../SKILL.md) §1 | The `PI_REMOTE` surface-detection trigger this scenario assumes |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli routing
- Playbook ID: PR-004
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intent-detection/debugging-routing.md`
