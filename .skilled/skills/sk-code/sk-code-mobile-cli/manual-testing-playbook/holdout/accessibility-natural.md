---
id: PR-H03
category: holdout
title: 'Holdout — ACCESSIBILITY via natural phrasing'
description: "This scenario validates generalization for `PR-H03`. It focuses on confirming a decontaminated, natural-phrasing rewrite of the contrast-confirmation request — one that avoids every literal ACCESSIBILITY INTENT_SIGNALS keyword — still resolves the same resource set as the fitted PR-007 scenario."
expected_surface: PI_REMOTE
expected_intent: ACCESSIBILITY
expected_resources:
  - references/conventions/editability-guardrails.md
  - references/verification/verification.md
  - references/svelte/svelte.md
  - assets/a11y-parity-checklist.md
version: 1.0.0.0
---

# PR-H03: Holdout — ACCESSIBILITY via natural phrasing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-H03`.

---

## 1. OVERVIEW

This is a generalization probe for `PR-H03`. The correct answer is identical to the fitted `ACCESSIBILITY`
scenario (`PR-007`), but the prompt asks for the same WCAG AA / non-color-signal confirmation the way a
real operator would phrase it, without any literal `ACCESSIBILITY` `INTENT_SIGNALS` keyword (no "a11y", no
"accessibility", no "wcag aa", no "focus ring"). It measures whether a plain-language accessibility concern
still routes to `ACCESSIBILITY` instead of being treated as a plain verification or implementation request.

### Why This Matters

Most real accessibility concerns are raised in plain language ("does this still read for someone with low
vision") rather than in spec terms ("confirm WCAG AA"). If this surface's classifier only recognizes the
spec vocabulary, a genuine accessibility request risks being misrouted to `VERIFICATION` alone, which
would miss the guardrail-fence and a11y-parity evidence `PR-007` shows is required alongside the resolver
proof.

---

## 2. SCENARIO CONTRACT

Operators confirm the decontaminated prompt for `PR-H03` still classifies as `ACCESSIBILITY` and resolves
the same resource set as `PR-007`.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `ACCESSIBILITY`, and every
  path in `expected_resources`, using wording that contains zero literal `ACCESSIBILITY` `INTENT_SIGNALS`
  keywords.
- Real user request: `Before we ship this color change, can you double-check it still reads clearly for someone with low vision in both light and dark mode, and that we're not relying on color alone to show state?`
- Prompt: `Before we ship this color change, can you double-check it still reads clearly for someone with low vision in both light and dark mode, and that we're not relying on color alone to show state?`

**Exact prompt**:
```text
Before we ship this color change, can you double-check it still reads clearly for someone with low vision in both light and dark mode, and that we're not relying on color alone to show state?
```

- Expected execution process: the hub detects `PI_REMOTE`; despite no literal `ACCESSIBILITY` keyword
  match, the request's shape (low-vision legibility across both themes, plus a non-color-signal check)
  resolves to `ACCESSIBILITY`; every path this scenario lists under `expected_resources` resolves.
- Expected signals: the resolved intent and resource set are identical to `PR-007`'s fitted answer,
  despite the decontaminated wording.
- Desired user-visible outcome: the bundled workflow cites `contrast.test.ts` passing in both themes and
  confirms a non-color state signal is present, exactly as `PR-007` describes, having correctly inferred
  the same request from plain language.
- Pass/fail: PASS if every listed path exists and the resolved intent matches `ACCESSIBILITY`; FAIL if the
  resolved intent diverges to `VERIFICATION` alone or elsewhere, or a listed path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Before we ship this color change, can you double-check it still reads clearly for someone with low vision in both light and dark mode, and that we're not relying on color alone to show state?`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/holdout/accessibility-natural.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"ACCESSIBILITY":/p'` — confirm none of its listed keyword substrings appear in the exact prompt.
3. `for p in references/conventions/editability-guardrails.md references/verification/verification.md references/svelte/svelte.md assets/a11y-parity-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2's keyword list contains no substring present in the exact prompt (manual scan). Step 3 prints `OK`
for all four paths.

### Evidence

Command transcript from steps 1-3; the keyword-absence confirmation; the resolved frontmatter block; the
dispatch transcript's resolved intent.

### Pass / Fail

- **Pass**: the resolved intent is `ACCESSIBILITY` and every listed path exists, despite zero literal
  keyword overlap.
- **Fail**: the resolved intent diverges to `VERIFICATION` alone or elsewhere, or a listed path is missing.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. If the resolved intent drifted to `VERIFICATION` alone (dropping `editability-guardrails.md` and
   `a11y-parity.md`), this is a documented generalization gap: a plain-language accessibility concern
   without spec vocabulary is under-recognized by the current keyword list. Record the gap for the router
   owner rather than silently accepting the narrower `VERIFICATION`-only result.

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
- Playbook ID: PR-H03
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/accessibility-natural.md`
