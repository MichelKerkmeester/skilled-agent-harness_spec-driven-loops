---
id: CR-R07
category: intra_routing_recall
stage: routing
title: 'Testing routing'
description: "This scenario validates TESTING routing for `CR-R07`. It confirms a test-shaped prompt classifies as `TESTING` and resolves the declared expected_resources set under sk-code-review's smart router."
expected_intent: TESTING
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
  - assets/test-quality-checklist.md
version: 1.0.0.0
---

# CR-R07: Testing routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R07`.

---

## 1. OVERVIEW

This scenario validates TESTING routing for `CR-R07`. It confirms that a
test-shaped prompt classifies as `TESTING`, not a mismatched intent, and resolves every
path this scenario declares under `expected_resources` — this scenario's set adds one checklist beyond `DEFAULT_RESOURCES`.

### Why This Matters

`TESTING` keywords (coverage, assertion, mock, stub, fixture, brittle) route to `assets/test-quality-checklist.md`, which is *not* one of the five `DEFAULT_RESOURCES`. CR-R07 proves a test-shaped prompt adds that checklist on top of the ALWAYS-loaded baseline, so assertion-free tests, over-mocking, and cleanup gaps get test-specific severity treatment instead of production-style noise from the generic quality checklist alone.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CR-R07` classifies as `TESTING` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `TESTING` and every path in
  `expected_resources`.
- Real user request: `Review target changes a test suite and needs a test-quality pass, not a production-code pass.`
- Prompt: `Review this test suite for testing coverage, assertions, mocks, stubs, fixtures, test quality, and brittle cases.`

**Exact prompt**:
```text
Review this test suite for testing coverage, assertions, mocks, stubs, fixtures, test quality, and brittle cases.
```

- Expected execution process: the smart router matches the `TESTING` `INTENT_SIGNALS`
  keywords (`test`, `tests`, `testing`, `coverage`, `assertion`, `mock`, `stub`, `fixture`, `test quality`, `brittle`) against the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-review/`, and the
  frontmatter `expected_intent` reads `TESTING`.
- Desired user-visible outcome: a review that applies test-quality severity (assertion-free tests, over-mocking, brittle fixtures) on top of the baseline checks.
- Pass/fail: PASS if every listed path exists and the frontmatter `expected_intent` is
  `TESTING`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this test suite for testing coverage, assertions, mocks, stubs, fixtures, test quality, and brittle cases.`

### Commands

1. `sed -n '1,18p' .opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/testing.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"TESTING"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"TESTING"'`
4. `for p in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md assets/test-quality-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-review/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: TESTING` and the full `expected_resources` list. Step 2 shows
the `TESTING` `INTENT_SIGNALS` entry (weight `3`) this scenario's prompt keywords
derive from. Step 3 shows the `RESOURCE_MAP["TESTING"]` entry this scenario's set is built
from. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the
`INTENT_SIGNALS["TESTING"]` and `RESOURCE_MAP["TESTING"]` excerpts.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `TESTING`.
- **Fail**: any listed path is missing, or the frontmatter `expected_intent` disagrees with
  `TESTING`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed
   under `assets/` or `references/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["TESTING"]`
   excerpt — `assets/test-quality-checklist.md` is additive beyond `DEFAULT_RESOURCES`, so a missing path here means the CONDITIONAL intent-specific load failed even if the ALWAYS-tier baseline is intact.

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
- Playbook ID: CR-R07
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/testing.md`
