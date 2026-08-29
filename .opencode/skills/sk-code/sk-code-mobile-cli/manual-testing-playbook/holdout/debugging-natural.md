---
id: PR-H02
category: holdout
title: 'Holdout — DEBUGGING via natural phrasing'
description: "This scenario validates generalization for `PR-H02`. It focuses on confirming a decontaminated, natural-phrasing rewrite of the retint-leak symptom — one that avoids every literal DEBUGGING INTENT_SIGNALS keyword — still resolves the same resource set as the fitted PR-004/PR-011 scenarios."
expected_surface: PI_REMOTE
expected_intent: DEBUGGING
expected_resources:
  - references/verification/verification.md
  - references/design-system/component-tokens.md
  - references/svelte/svelte-runes-effects.md
  - assets/runes-effect-audit-checklist.md
version: 1.0.0.0
---

# PR-H02: Holdout — DEBUGGING via natural phrasing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-H02`.

---

## 1. OVERVIEW

This is a generalization probe for `PR-H02`. The correct answer is identical to the fitted `DEBUGGING`
scenarios (`PR-004`, `PR-011`), but the prompt describes the same retint-leak symptom the way a real
operator would notice it, without any literal `DEBUGGING` `INTENT_SIGNALS` keyword (no "debug", no
"broken", no "leaking retint", no "regression"). It measures whether symptom-shaped natural language still
routes to `DEBUGGING` instead of being misread as a second `IMPLEMENTATION` request.

### Why This Matters

A user who notices an unintended visual change rarely says "debug this" — they describe what they
observed. If this surface only recognizes `DEBUGGING` intent from its literal keyword list, a natural
symptom report risks being misrouted to `IMPLEMENTATION`, sending the workflow straight to a second retint
instead of first tracing the actual shared-token leak `PR-004` already documents.

---

## 2. SCENARIO CONTRACT

Operators confirm the decontaminated symptom-report prompt for `PR-H02` still classifies as `DEBUGGING`
and resolves the same resource set as `PR-004`/`PR-011`.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `DEBUGGING`, and every path in
  `expected_resources`, using wording that contains zero literal `DEBUGGING` `INTENT_SIGNALS` keywords.
- Real user request: `Something's off — the slash panel's accent changed color too, but we only meant to touch the model-effort sheet. Can you figure out what's going on there?`
- Prompt: `Something's off — the slash panel's accent changed color too, but we only meant to touch the model-effort sheet. Can you figure out what's going on there?`

**Exact prompt**:
```text
Something's off — the slash panel's accent changed color too, but we only meant to touch the model-effort sheet. Can you figure out what's going on there?
```

- Expected execution process: the hub detects `PI_REMOTE`; despite no literal `DEBUGGING` keyword match,
  the symptom shape (an unintended side effect in a surface that was not the target of the last change)
  resolves to `DEBUGGING`, not a second `IMPLEMENTATION` pass; every path this scenario lists under
  `expected_resources` resolves.
- Expected signals: the resolved intent and resource set are identical to `PR-004`/`PR-011`'s fitted
  answer, despite the decontaminated wording.
- Desired user-visible outcome: the bundled workflow traces the shared component-token alias causing the
  slash-panel leak using the resolver method, instead of proposing a second retint on the slash panel to
  "fix" the symptom.
- Pass/fail: PASS if every listed path exists and the resolved intent matches `DEBUGGING`; FAIL if the
  resolved intent diverges to `IMPLEMENTATION` or elsewhere, or a listed path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Something's off — the slash panel's accent changed color too, but we only meant to touch the model-effort sheet. Can you figure out what's going on there?`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/holdout/debugging-natural.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"DEBUGGING":/p'` — confirm none of its listed keyword substrings appear in the exact prompt.
3. `for p in references/verification/verification.md references/design-system/component-tokens.md references/svelte/svelte-runes-effects.md assets/runes-effect-audit-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2's keyword list contains no substring present in the exact prompt (manual scan). Step 3 prints `OK`
for all four paths.

### Evidence

Command transcript from steps 1-3; the keyword-absence confirmation; the resolved frontmatter block; the
dispatch transcript's resolved intent.

### Pass / Fail

- **Pass**: the resolved intent is `DEBUGGING` and every listed path exists, despite zero literal keyword
  overlap.
- **Fail**: the resolved intent diverges to `IMPLEMENTATION` or `DEFAULT_RESOURCE`, or a listed path is
  missing.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. If the resolved intent drifted to `IMPLEMENTATION`, this is a documented generalization gap: the
   classifier has no way to distinguish "make a change" language from "an unintended change already
   happened" language without a literal `DEBUGGING` keyword. Record the gap for the router owner rather
   than silently treating the misroute as acceptable.

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
- Playbook ID: PR-H02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/debugging-natural.md`
