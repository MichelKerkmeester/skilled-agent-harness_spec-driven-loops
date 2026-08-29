---
id: PR-003
category: code_quality
title: 'Guardrail audit routing'
description: "This scenario validates CODE_QUALITY routing for `PR-003`. It focuses on confirming a guardrail-audit prompt loads the fence list and the audit checklist needed to confirm no `Do not edit —` line moved."
expected_surface: PI_REMOTE
expected_intent: CODE_QUALITY
expected_resources:
  - references/editability-guardrails.md
  - assets/guardrail-audit-checklist.md
version: 1.0.0.0
---

# PR-003: Guardrail audit routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-003`.

---

## 1. OVERVIEW

This scenario validates CODE_QUALITY routing for `PR-003`. It focuses on confirming that once the hub
resolves the `PI_REMOTE` surface, a guardrail-audit prompt loads the fence list in
`editability-guardrails.md` and the fence-by-fence audit checklist, not the token/retint evidence
`IMPLEMENTATION` prompts load, since the two intents need different reference sets.

### Why This Matters

`Do not edit — <why>` fences are the only thing standing between a "presentation only" edit and one that
silently crosses into state, security, or accessibility logic. A quality gate that does not load the
fence list and its checklist cannot confirm a design-system change respected that boundary.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-003` classifies as `CODE_QUALITY` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `CODE_QUALITY`, and every
  path in `expected_resources`.
- Real user request: `Run a quality gate confirming no Do not edit — guardrail fence was touched by this design-system change.`
- Prompt: `Run a quality gate confirming no Do not edit — guardrail fence was touched by this design-system change.`

**Exact prompt**:
```text
Run a quality gate confirming no Do not edit — guardrail fence was touched by this design-system change.
```

- Expected execution process: the hub detects `PI_REMOTE`, the `CODE_QUALITY` `INTENT_SIGNALS` keywords
  (`guardrail`, `do-not-edit`, `quality gate`, ...) match the prompt, and every path this scenario lists
  under `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-mobile-cli/`, and each one
  documents `CODE_QUALITY` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow re-counts the `Do not edit —` fences before and after
  the change and confirms none of the nine fence categories in `editability-guardrails.md` §2 moved.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `PI_REMOTE`/
  `CODE_QUALITY`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a quality gate confirming no Do not edit — guardrail fence was touched by this design-system change.`

### Commands

1. `sed -n '1,12p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/intent-detection/guardrail-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"CODE_QUALITY":/,/\],/p'`
3. `for p in references/editability-guardrails.md assets/guardrail-audit-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: PI_REMOTE` and `expected_intent: CODE_QUALITY`. Step 2 shows the
`CODE_QUALITY` `RESOURCE_MAP` entry this scenario's set derives from. Step 3 prints `OK` for both paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["CODE_QUALITY"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `PI_REMOTE`/`CODE_QUALITY`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `PI_REMOTE`/`CODE_QUALITY`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["CODE_QUALITY"]` excerpt to
   see whether the drift is a stale scenario file or a stale `SKILL.md` map — the two sets are not
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
- Playbook ID: PR-003
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intent-detection/guardrail-routing.md`
