---
id: PR-016
category: token_cost_baseline
title: 'Token-cost floor: DEFAULT_RESOURCE fallback'
description: "This scenario validates the token-cost floor for `PR-016`. It focuses on confirming DEFAULT_RESOURCE — the smallest resource set this packet ever loads, at two references — is the true floor against which the median and ceiling baselines in this category are measured."
expected_surface: PI_REMOTE
expected_intent: DEFAULT_RESOURCE
expected_resources:
  - references/design-system/token-library.md
  - references/conventions/comment-grammar.md
version: 1.0.0.0
---

# PR-016: Token-cost floor: DEFAULT_RESOURCE fallback

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-016`.

---

## 1. OVERVIEW

This scenario validates the token-cost floor for `PR-016`. It focuses on confirming that the smallest
resource load this packet ever produces is the two-path `DEFAULT_RESOURCE` fallback — smaller than every
one of the six declared intents' own `RESOURCE_MAP` entries, the smallest of which (`DEBUGGING`,
`VERIFICATION`, `ACCESSIBILITY`) each carry four paths. This scenario measures the same routing case
`PR-010` already exercises from the fallback-behavior angle, here from the cost-magnitude angle, the way
this playbook's `resource-loading/` and `token-cost-baseline/` categories deliberately share evidence
across different testing lenses.

### Why This Matters

Without a documented floor, an operator cannot tell whether a given resource load is cheap, typical, or
expensive for this surface. The floor anchors one end of that scale so `PR-017`'s median and `PR-018`'s
ceiling read as relative measurements against a known reference point, not isolated numbers.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact zero-keyword prompt for `PR-016` resolves the smallest possible resource load
this packet produces.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, falls back to `DEFAULT_RESOURCE`, and
  every path in `expected_resources` resolves, with a total resource count of exactly two — the floor for
  this surface.
- Real user request: `Take a look at the composer in app-mobile and tell me what you notice about it.`
- Prompt: `Take a look at the composer in app-mobile and tell me what you notice about it.`

**Exact prompt**:
```text
Take a look at the composer in app-mobile and tell me what you notice about it.
```

- Expected execution process: the hub detects `PI_REMOTE`; no `INTENT_SIGNALS` keyword matches; the packet
  falls back to `DEFAULT_RESOURCE`, loading exactly two `references/` paths and zero `assets/` paths.
- Expected signals: `expected_resources` count is 2, the true floor against which `PR-017` (4 paths) and
  `PR-018` (22 paths) are compared.
- Desired user-visible outcome: an operator measuring per-request token cost has a documented floor
  baseline to compare later measurements against.
- Pass/fail: PASS if both `DEFAULT_RESOURCE` paths exist and the total resolved count is exactly 2; FAIL
  if either path is missing or a resource outside `DEFAULT_RESOURCE` inflates the count.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Take a look at the composer in app-mobile and tell me what you notice about it.`

### Commands

1. `sed -n '1,15p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/token-cost-baseline/floor-single-resource.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^INTENT_SIGNALS = {/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | grep 'DEFAULT_RESOURCE'`
3. `for p in references/design-system/token-library.md references/conventions/comment-grammar.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`
4. Capture the resolved-set count from the dispatch transcript and confirm it equals 2.

### Expected

Step 2 shows the `DEFAULT_RESOURCE` list at exactly two entries. Step 3 prints `OK` for both paths. Step 4
confirms the count.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the resource-count confirmation.

### Pass / Fail

- **Pass**: both `DEFAULT_RESOURCE` paths exist and the resolved count is exactly 2.
- **Fail**: either path is missing, or the resolved count exceeds 2.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/`.
2. If the resolved count exceeds 2, confirm whether the prompt accidentally matched an `INTENT_SIGNALS`
   keyword — see `PR-010`'s Failure Triage for the same check.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `DEFAULT_RESOURCE` this scenario exercises |
| [SKILL.md](../../SKILL.md) §1 | The `PI_REMOTE` surface-detection trigger this scenario assumes |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli token-cost baseline
- Playbook ID: PR-016
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `token-cost-baseline/floor-single-resource.md`
