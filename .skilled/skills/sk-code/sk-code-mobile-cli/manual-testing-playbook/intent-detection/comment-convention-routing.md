---
id: PR-002
category: implementation
title: 'Comment convention seam routing'
description: "This scenario validates IMPLEMENTATION routing for `PR-002`. It focuses on confirming a presentation-comment seam prompt loads the comment-grammar and token evidence needed to find the right editable seam without touching frozen logic."
expected_surface: PI_REMOTE
expected_intent: IMPLEMENTATION
expected_resources:
  - references/design-system/token-library.md
  - references/conventions/comment-grammar.md
  - references/design-system/component-tokens.md
  - references/design-system/retint-recipes.md
  - references/design-system/theme-remap.md
  - references/design-system/scoped-style-ownership.md
  - assets/token-retint-checklist.md
version: 1.0.0.0
---

# PR-002: Comment convention seam routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-002`.

---

## 1. OVERVIEW

This scenario validates IMPLEMENTATION routing for `PR-002`. It focuses on confirming that a prompt
about finding the right presentation comment — not a token retint by name — still classifies as
`IMPLEMENTATION` and loads the comment-grammar, token, and retint evidence a workflow needs to identify
an editable seam versus a frozen `Do not edit —` line, without executing any Pi Remote app command
directly, since `app-mobile/` does not live in this repository.

### Why This Matters

The natural comment grammar is what tells a workflow which nearby markup or CSS is safe to restyle and
which state machine or status-text source must stay untouched. Loading `comment-grammar.md` alongside
the token and retint evidence lets a bundled workflow (`sk-code-quality` or `sk-code-review`) find the
correct presentation seam instead of guessing from the visual result alone.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-002` classifies as `IMPLEMENTATION` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `IMPLEMENTATION`, and every
  path in `expected_resources`.
- Real user request: `Find the right presentation comment to restyle the composer's loading state without touching the state machine or the status text.`
- Prompt: `Find the right presentation comment to restyle the composer's loading state without touching the state machine or the status text.`

**Exact prompt**:
```text
Find the right presentation comment to restyle the composer's loading state without touching the state machine or the status text.
```

- Expected execution process: the hub detects `PI_REMOTE`, the `IMPLEMENTATION` `INTENT_SIGNALS` keywords
  (`presentation seam`, `implement`, ...) match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-mobile-cli/`, and each one
  documents `IMPLEMENTATION` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow restyles the composer's loading-state presentation
  comment while leaving the state machine and status-text source behind their `Do not edit —` fences
  untouched.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `PI_REMOTE`/
  `IMPLEMENTATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Find the right presentation comment to restyle the composer's loading state without touching the state machine or the status text.`

### Commands

1. `sed -n '1,15p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/intent-detection/comment-convention-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"IMPLEMENTATION":/,/\],/p'`
3. `for p in references/design-system/token-library.md references/conventions/comment-grammar.md references/design-system/component-tokens.md references/design-system/retint-recipes.md references/design-system/theme-remap.md references/design-system/scoped-style-ownership.md assets/token-retint-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

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
   to see whether the drift is a stale scenario file or a stale `SKILL.md` map — the two sets are not
   required to be identical (`expected_resources` is a curated core subset, not an exact mirror).

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
- Playbook ID: PR-002
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intent-detection/comment-convention-routing.md`
