---
id: CR-R02
category: intra_routing_recall
stage: routing
title: 'Quality routing'
description: "This scenario validates QUALITY routing for `CR-R02`. It confirms a correctness/regression-shaped prompt classifies as `QUALITY` and resolves the declared expected_resources set under sk-code-review's smart router."
expected_intent: QUALITY
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
version: 1.0.0.0
---

# CR-R02: Quality routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R02`.

---

## 1. OVERVIEW

This scenario validates QUALITY routing for `CR-R02`. It confirms that a
correctness/regression-shaped prompt classifies as `QUALITY`, not a mismatched intent, and resolves every
path this scenario declares under `expected_resources` — this scenario's set already carries the intent-specific checklist via `DEFAULT_RESOURCES`.

### Why This Matters

`QUALITY` is the second-highest weighted intent (4) and its keyword set - correctness, regression, performance, boundary, and breaking-change language - is the most common shape a real review request takes. `RESOURCE_MAP["QUALITY"]` points at `assets/code-quality-checklist.md`, already part of `DEFAULT_RESOURCES`; CR-R02 proves that a correctness-flavored prompt still resolves the checklist rather than assuming a narrower lens (KISS/DRY) took over.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CR-R02` classifies as `QUALITY` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `QUALITY` and every path in
  `expected_resources`.
- Real user request: `Review target may introduce a correctness regression or break a public contract.`
- Prompt: `Review this change for correctness, regression risk, performance boundaries, and breaking contract compatibility.`

**Exact prompt**:
```text
Review this change for correctness, regression risk, performance boundaries, and breaking contract compatibility.
```

- Expected execution process: the smart router matches the `QUALITY` `INTENT_SIGNALS`
  keywords (`correctness`, `bug`, `regression`, `performance`, `boundary`, `contract`, `breaking change`, `backward compatible`, `compatibility`) against the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-review/`, and the
  frontmatter `expected_intent` reads `QUALITY`.
- Desired user-visible outcome: a review that keeps correctness, regression, and contract-compatibility checks active for a quality-flavored prompt.
- Pass/fail: PASS if every listed path exists and the frontmatter `expected_intent` is
  `QUALITY`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this change for correctness, regression risk, performance boundaries, and breaking contract compatibility.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/quality.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"QUALITY"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"QUALITY"'`
4. `for p in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-review/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: QUALITY` and the full `expected_resources` list. Step 2 shows
the `QUALITY` `INTENT_SIGNALS` entry (weight `4`) this scenario's prompt keywords
derive from. Step 3 shows the `RESOURCE_MAP["QUALITY"]` entry this scenario's set is built
from. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the
`INTENT_SIGNALS["QUALITY"]` and `RESOURCE_MAP["QUALITY"]` excerpts.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `QUALITY`.
- **Fail**: any listed path is missing, or the frontmatter `expected_intent` disagrees with
  `QUALITY`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed
   under `assets/` or `references/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["QUALITY"]`
   excerpt — the QUALITY resource is already part of DEFAULT_RESOURCES, so a missing path here means the ALWAYS-tier baseline itself regressed, not just intent-specific routing.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2 | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §2 | `DEFAULT_RESOURCES` baseline this scenario assumes |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/quality.md`
