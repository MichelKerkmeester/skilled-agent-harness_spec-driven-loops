---
id: PR-007
category: accessibility
title: 'Accessibility routing'
description: "This scenario validates ACCESSIBILITY routing for `PR-007`. It focuses on confirming a WCAG-contrast confirmation prompt loads the guardrail fence list and the verification method instead of the implementation evidence."
expected_surface: PI_REMOTE
expected_intent: ACCESSIBILITY
expected_resources:
  - references/editability-guardrails.md
  - references/verification.md
version: 1.0.0.0
---

# PR-007: Accessibility routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-007`.

---

## 1. OVERVIEW

This scenario validates ACCESSIBILITY routing for `PR-007`. It focuses on confirming that a WCAG-contrast
confirmation prompt classifies as `ACCESSIBILITY` and loads the guardrail fence list (which names the
focus-ring, reduced-motion/contrast/forced-colors, and target-size fences as frozen) together with the
browser-free verification method that proves contrast held, per `SKILL.md` §3's "clay is never the sole
state signal" standard.

### Why This Matters

A retint can pass the resolver's value-preservation check and still fail accessibility if the new pair
drops below WCAG AA in one theme, or if a state relies on color alone. Loading
`editability-guardrails.md` names the accessibility fences that must stay untouched;
`verification.md` supplies `contrast.test.ts` as the actual gate, not a visual impression.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-007` classifies as `ACCESSIBILITY` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `ACCESSIBILITY`, and every
  path in `expected_resources`.
- Real user request: `Confirm the retint keeps WCAG AA contrast in both themes and doesn't rely on clay as the sole state signal.`
- Prompt: `Confirm the retint keeps WCAG AA contrast in both themes and doesn't rely on clay as the sole state signal.`

**Exact prompt**:
```text
Confirm the retint keeps WCAG AA contrast in both themes and doesn't rely on clay as the sole state signal.
```

- Expected execution process: the hub detects `PI_REMOTE`, the `ACCESSIBILITY` `INTENT_SIGNALS` keywords
  (`wcag aa`, `a11y`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-mobile-cli/`, and each one
  documents `ACCESSIBILITY` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow cites `contrast.test.ts` passing in both themes as
  the WCAG AA evidence and confirms the retinted state still carries a non-color signal (shape, icon, or
  text), not clay alone.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `PI_REMOTE`/
  `ACCESSIBILITY`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Confirm the retint keeps WCAG AA contrast in both themes and doesn't rely on clay as the sole state signal.`

### Commands

1. `sed -n '1,12p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/accessibility-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"ACCESSIBILITY":/,/\],/p'`
3. `for p in references/editability-guardrails.md references/verification.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: PI_REMOTE` and `expected_intent: ACCESSIBILITY`. Step 2 shows the
`ACCESSIBILITY` `RESOURCE_MAP` entry this scenario's set derives from. Step 3 prints `OK` for both paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["ACCESSIBILITY"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `PI_REMOTE`/`ACCESSIBILITY`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `PI_REMOTE`/`ACCESSIBILITY`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["ACCESSIBILITY"]` excerpt to
   see whether the drift is a stale scenario file or a stale `SKILL.md` map — note that `RESOURCE_MAP`
   also carries `references/a11y-parity.md` and `assets/a11y-parity-checklist.md`, which this scenario's
   curated core subset omits by design.

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
| [SKILL.md](../SKILL.md) §3 | The WCAG AA / clay-not-sole-signal standard this answer must hold |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli routing
- Playbook ID: PR-007
- Canonical root source: [manual-testing-playbook.md](manual-testing-playbook.md)
- Feature file path: `accessibility-routing.md`
