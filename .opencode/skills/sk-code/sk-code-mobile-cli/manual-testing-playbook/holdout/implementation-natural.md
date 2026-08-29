---
id: PR-H01
category: holdout
title: 'Holdout — IMPLEMENTATION via natural phrasing'
description: "This scenario validates generalization for `PR-H01`. It focuses on confirming a decontaminated, natural-phrasing rewrite of the retint request — one that avoids every literal IMPLEMENTATION INTENT_SIGNALS keyword — still resolves the same seven-path resource set as the fitted PR-001/PR-013 scenarios."
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

# PR-H01: Holdout — IMPLEMENTATION via natural phrasing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-H01`.

---

## 1. OVERVIEW

This is a generalization probe for `PR-H01`. The correct answer is identical to the fitted `IMPLEMENTATION`
scenarios (`PR-001`, `PR-013`), but the prompt is phrased the way a real operator would actually ask,
without any of the router's literal `IMPLEMENTATION` `INTENT_SIGNALS` keywords (no "retint", no
"component token", no "primitive", no "theme remap"). It measures whether this surface's classification
survives unseen phrasing rather than memorized trigger words.

### Why This Matters

`PR-001` and `PR-013` prove the router works when a prompt uses the literal words its own keyword list
expects. That is necessary but not sufficient — a real user asking for the same change rarely quotes the
router's vocabulary back at it. This holdout scenario is excluded from the fitted-routing count and scored
only for the generalization gap between it and its fitted counterpart.

---

## 2. SCENARIO CONTRACT

Operators confirm the decontaminated prompt for `PR-H01` still classifies as `IMPLEMENTATION` and resolves
the same resource set as `PR-001`/`PR-013`, despite avoiding every literal `IMPLEMENTATION` keyword.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `IMPLEMENTATION`, and every
  path in `expected_resources`, using wording that contains zero literal `IMPLEMENTATION`
  `INTENT_SIGNALS` keywords.
- Real user request: `The model-effort sheet's accent still reads a bit cool — can you shift it to something warmer without disturbing our core palette values?`
- Prompt: `The model-effort sheet's accent still reads a bit cool — can you shift it to something warmer without disturbing our core palette values?`

**Exact prompt**:
```text
The model-effort sheet's accent still reads a bit cool — can you shift it to something warmer without disturbing our core palette values?
```

- Expected execution process: the hub detects `PI_REMOTE` from the task's `app-mobile` context; despite no
  literal `IMPLEMENTATION` keyword match, the request's shape (a color-role change scoped away from the
  core palette) resolves to `IMPLEMENTATION`; every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: the resolved intent and resource set are identical to `PR-001`/`PR-013`'s fitted
  answer, despite the decontaminated wording.
- Desired user-visible outcome: the bundled workflow retints the correct component-token layer, exactly as
  `PR-001` describes, having correctly inferred the same request from natural phrasing.
- Pass/fail: PASS if every listed path exists and the resolved intent matches `IMPLEMENTATION`; FAIL if
  the resolved intent diverges from `IMPLEMENTATION`, or a listed path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The model-effort sheet's accent still reads a bit cool — can you shift it to something warmer without disturbing our core palette values?`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/holdout/implementation-natural.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"IMPLEMENTATION":/p'` — confirm none of its listed keyword substrings appear in the exact prompt.
3. `for p in references/token-library.md references/comment-grammar.md references/component-tokens.md references/retint-recipes.md references/theme-remap.md references/scoped-style-ownership.md assets/token-retint-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2's keyword list contains no substring present in the exact prompt (manual scan). Step 3 prints `OK`
for all seven paths.

### Evidence

Command transcript from steps 1-3; the keyword-absence confirmation; the resolved frontmatter block; the
dispatch transcript's resolved intent.

### Pass / Fail

- **Pass**: the resolved intent is `IMPLEMENTATION` and every listed path exists, despite zero literal
  keyword overlap.
- **Fail**: the resolved intent diverges from `IMPLEMENTATION` (for example, falling back to
  `DEFAULT_RESOURCE` because a purely keyword-driven classifier found no match), or a listed path is
  missing.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. If the resolved intent falls back to `DEFAULT_RESOURCE` instead of `IMPLEMENTATION`, this is a
   documented generalization gap, not a broken path: the classifier is keyword-driven per `SKILL.md` §2b
   and has no semantic-similarity fallback. Record the gap and escalate to a human or AI reviewer for
   intent confirmation rather than treating it as a routing defect to silently patch.

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

- Group: code-mobile-cli holdout
- Playbook ID: PR-H01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/implementation-natural.md`
