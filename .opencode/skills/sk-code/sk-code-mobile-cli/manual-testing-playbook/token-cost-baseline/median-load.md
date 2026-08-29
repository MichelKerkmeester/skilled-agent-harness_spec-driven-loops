---
id: PR-017
category: token_cost_baseline
title: 'Token-cost median: VERIFICATION intent'
description: "This scenario validates the token-cost median for `PR-017`. It focuses on confirming the full VERIFICATION resource set — four paths — sits at the median of this surface's six declared intents' resource-count range, between the two-path floor and the eight-path ceiling intents."
expected_surface: PI_REMOTE
expected_intent: VERIFICATION
expected_resources:
  - references/verification/verification.md
  - references/verification/browser-free-verification-recipe.md
  - references/verification/skill-reference-integrity.md
  - assets/ds-verification-checklist.md
version: 1.0.0.0
---

# PR-017: Token-cost median: VERIFICATION intent

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-017`.

---

## 1. OVERVIEW

This scenario validates the token-cost median for `PR-017`. It focuses on confirming that the full
`RESOURCE_MAP["VERIFICATION"]` set — three references and one asset, four paths total — represents a
typical mid-range load for this surface: larger than the two-path `DEFAULT_RESOURCE` floor `PR-016`
measures, and well short of the fifteen-reference-plus-seven-asset union `PR-018`'s ceiling measures.
`DEBUGGING` and `ACCESSIBILITY` tie `VERIFICATION` at four paths each; `VERIFICATION` is the representative
chosen here because it is the intent every other intent's completion claim ultimately routes through.

### Why This Matters

A median baseline lets an operator judge whether a given request's actual resource count is unusually
cheap or unusually expensive relative to a typical PI_REMOTE dispatch, not just relative to the two
extremes. Because `VERIFICATION` gates every other intent's completion claim, its cost is also the one an
operator pays most often in practice — most workflows end with a verification pass regardless of which
intent started the change.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-017` resolves the full four-path `VERIFICATION` resource set.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `VERIFICATION`, and every path
  in `expected_resources` resolves, with a total resource count of exactly four.
- Real user request: `Verify the token retint preserved every frozen value in both themes before the completion claim.`
- Prompt: `Verify the token retint preserved every frozen value in both themes before the completion claim.`

**Exact prompt**:
```text
Verify the token retint preserved every frozen value in both themes before the completion claim.
```

- Expected execution process: the hub detects `PI_REMOTE`; the `VERIFICATION` `INTENT_SIGNALS` keywords
  (`verify`, `completion claim`) match; the full `RESOURCE_MAP["VERIFICATION"]` set resolves.
- Expected signals: `expected_resources` count is 4 — the median reference point between `PR-016`'s floor
  of 2 and `PR-018`'s ceiling of 22.
- Desired user-visible outcome: an operator measuring per-request token cost has a documented median
  baseline representative of a typical dispatch.
- Pass/fail: PASS if every listed path exists and the total resolved count is exactly 4; FAIL if any
  listed path is missing or the resolved count diverges from 4.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Verify the token retint preserved every frozen value in both themes before the completion claim.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/token-cost-baseline/median-load.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"VERIFICATION":/,/\],/p'`
3. `for p in references/verification/verification.md references/verification/browser-free-verification-recipe.md references/verification/skill-reference-integrity.md assets/ds-verification-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2 shows the four-path `RESOURCE_MAP["VERIFICATION"]` entry. Step 3 prints `OK` for all four paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["VERIFICATION"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists and the resolved count is exactly 4.
- **Fail**: any listed path is missing, or the resolved count diverges from 4.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. If the resolved count diverges from 4, diff this scenario's `expected_resources` against the step-2
   `RESOURCE_MAP["VERIFICATION"]` excerpt to see whether the drift is a stale scenario file or a stale
   `SKILL.md` map.

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

- Group: code-mobile-cli token-cost baseline
- Playbook ID: PR-017
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `token-cost-baseline/median-load.md`
