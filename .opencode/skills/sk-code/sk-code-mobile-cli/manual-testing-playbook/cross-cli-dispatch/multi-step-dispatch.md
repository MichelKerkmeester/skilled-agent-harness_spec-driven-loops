---
id: PR-015
category: cross_cli_dispatch
title: 'Multi-step sequential dispatch stability'
description: "This scenario validates multi-step dispatch stability for `PR-015`. It focuses on confirming three sequential prompts in one session each resolve their own correct intent and resource set, with no resource from an earlier turn sticking into a later turn's classification."
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

# PR-015: Multi-step sequential dispatch stability

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-015`.

---

## 1. OVERVIEW

This scenario validates multi-step dispatch stability for `PR-015`. It focuses on confirming that three
sequential prompts sent within one session — an `IMPLEMENTATION` retint, a follow-up `CODE_QUALITY`
guardrail check on that same change, and a final `VERIFICATION` completion-claim request — each resolve
their own correct intent and resource set in turn, without a resource loaded for turn one leaking into
turn two or three's classification just because the session context still mentions it.

### Why This Matters

A real design-system change is rarely one prompt: implement, then audit, then verify. If the router
carried turn one's `IMPLEMENTATION` resources forward into turn three's `VERIFICATION` request simply
because the session still remembers the retint, the workflow would silently over-load resources on every
later turn and the token-cost baselines in `token-cost-baseline/` would stop reflecting real per-turn
cost. This scenario's frontmatter reports turn one's contract; the per-turn breakdown in Test Execution
carries turns two and three.

---

## 2. SCENARIO CONTRACT

Operators confirm each of the three sequential prompts for `PR-015` resolves its own intent and resource
set, independent of the prior turn's classification.

- Objective: confirm turn one routes to `PI_REMOTE`/`IMPLEMENTATION` with its seven-path resource set;
  confirm turn two independently routes to `PI_REMOTE`/`CODE_QUALITY`; confirm turn three independently
  routes to `PI_REMOTE`/`VERIFICATION`; confirm no turn's resource set contains a path from a different
  turn's intent.
- Real user request (turn one): `Retint the model-effort-sheet accent so it reads a warmer accent role without touching the frozen --pi-* primitives.`
- Prompt: `Retint the model-effort-sheet accent so it reads a warmer accent role without touching the frozen --pi-* primitives.` (turn one; turns two and three follow in Test Execution below)

**Exact prompt (turn one)**:
```text
Retint the model-effort-sheet accent so it reads a warmer accent role without touching the frozen --pi-* primitives.
```

- Expected execution process: turn one resolves `IMPLEMENTATION` and loads this scenario's
  `expected_resources`; turn two ("Now run a quality gate confirming no Do not edit — guardrail fence was
  touched by that retint.") resolves `CODE_QUALITY` and loads only `editability-guardrails.md` and
  `guardrail-audit-checklist.md`, not turn one's token/retint evidence; turn three ("Verify that retint
  preserved every frozen value in both themes before we call it done.") resolves `VERIFICATION` and loads
  only `verification.md` and `ds-verification-checklist.md`, not turn one's or turn two's resources.
- Expected signals: three independent resource sets, one per turn, matching each turn's own intent's
  `RESOURCE_MAP` entry — no path from turn one persists into turn two or turn three's loaded set.
- Desired user-visible outcome: each turn's response is scoped to that turn's actual ask; the guardrail
  check in turn two does not re-explain the token model, and the verification in turn three does not
  re-run the guardrail audit.
- Pass/fail: PASS if all three turns resolve their own intent and resource set with no cross-turn resource
  bleed; FAIL if any turn's resolved resource set contains a path belonging only to a different turn's
  intent.

---

## 3. TEST EXECUTION

### Prompt

- Prompt (turn one): `Retint the model-effort-sheet accent so it reads a warmer accent role without touching the frozen --pi-* primitives.`
- Prompt (turn two): `Now run a quality gate confirming no Do not edit — guardrail fence was touched by that retint.`
- Prompt (turn three): `Verify that retint preserved every frozen value in both themes before we call it done.`

### Commands

1. `sed -n '1,20p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/cross-cli-dispatch/multi-step-dispatch.md`
2. Dispatch turn one in a fresh session; capture the resolved surface, intent, and resource list.
3. Dispatch turn two in the same session, immediately after turn one; capture the resolved surface,
   intent, and resource list.
4. Dispatch turn three in the same session, immediately after turn two; capture the resolved surface,
   intent, and resource list.
5. `for p in references/token-library.md references/comment-grammar.md references/component-tokens.md references/retint-recipes.md references/theme-remap.md references/scoped-style-ownership.md assets/token-retint-checklist.md references/editability-guardrails.md assets/guardrail-audit-checklist.md references/verification.md assets/ds-verification-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2 reports `PI_REMOTE`/`IMPLEMENTATION` with the seven-path set. Step 3 reports `PI_REMOTE`/
`CODE_QUALITY` with only the two guardrail paths, no token/retint paths repeated. Step 4 reports
`PI_REMOTE`/`VERIFICATION` with only the two verification paths, no token/retint or guardrail paths
repeated. Step 5 prints `OK` for all eleven union paths across the three turns.

### Evidence

Command transcript from steps 1-5; the three per-turn transcripts in sequence; the resolved frontmatter
block for turn one.

### Pass / Fail

- **Pass**: each of the three turns resolves its own correct intent and resource set with zero cross-turn
  resource bleed, and every listed path exists.
- **Fail**: any listed path is missing, or any turn's resolved set contains a path that belongs only to a
  different turn's intent.

### Failure Triage

1. Re-run step 5 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. If a later turn's resource set contains an earlier turn's path, confirm whether the session context
   window is causing intent-signal keyword bleed (e.g. "that retint" in turn two still contains "retint")
   — re-run turn two with a rephrase that avoids reusing turn one's literal keyword to isolate whether the
   bleed is content-driven or session-state-driven.

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

- Group: code-mobile-cli cross-CLI dispatch
- Playbook ID: PR-015
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cross-cli-dispatch/multi-step-dispatch.md`
