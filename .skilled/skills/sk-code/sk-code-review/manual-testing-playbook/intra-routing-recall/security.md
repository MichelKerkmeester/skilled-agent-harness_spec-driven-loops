---
id: CR-R01
category: intra_routing_recall
stage: routing
title: 'Security routing'
description: "This scenario validates SECURITY routing for `CR-R01`. It confirms a security-shaped prompt classifies as `SECURITY` and resolves the declared expected_resources set under sk-code-review's smart router."
expected_intent: SECURITY
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
version: 1.0.0.0
---

# CR-R01: Security routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R01`.

---

## 1. OVERVIEW

This scenario validates SECURITY routing for `CR-R01`. It confirms that a
security-shaped prompt classifies as `SECURITY`, not a mismatched intent, and resolves every
path this scenario declares under `expected_resources` — this scenario's set already carries the intent-specific checklist via `DEFAULT_RESOURCES`.

### Why This Matters

`SECURITY` carries the highest `INTENT_SIGNALS` weight (5) in `sk-code-review/SKILL.md` because a missed auth or injection defect defeats every other review dimension. `RESOURCE_MAP["SECURITY"]` points at `assets/security-checklist.md`, which is already one of the five `DEFAULT_RESOURCES` loaded on every invocation - so CR-R01 proves a security-shaped prompt keeps that checklist in the resolved set rather than silently dropping it once a narrower intent is detected.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CR-R01` classifies as `SECURITY` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `SECURITY` and every path in
  `expected_resources`.
- Real user request: `Review target is an auth handler that needs a security-focused pass.`
- Prompt: `Review this auth handler for injection, vulnerability, race, and secret-handling security issues.`

**Exact prompt**:
```text
Review this auth handler for injection, vulnerability, race, and secret-handling security issues.
```

- Expected execution process: the smart router matches the `SECURITY` `INTENT_SIGNALS`
  keywords (`security`, `auth`, `injection`, `vulnerability`, `race`) against the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-review/`, and the
  frontmatter `expected_intent` reads `SECURITY`.
- Desired user-visible outcome: a review that keeps the security checklist active and does not relax auth/injection findings because a narrower intent matched.
- Pass/fail: PASS if every listed path exists and the frontmatter `expected_intent` is
  `SECURITY`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this auth handler for injection, vulnerability, race, and secret-handling security issues.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/security.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"SECURITY"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"SECURITY"'`
4. `for p in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-review/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: SECURITY` and the full `expected_resources` list. Step 2 shows
the `SECURITY` `INTENT_SIGNALS` entry (weight `5`) this scenario's prompt keywords
derive from. Step 3 shows the `RESOURCE_MAP["SECURITY"]` entry this scenario's set is built
from. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the
`INTENT_SIGNALS["SECURITY"]` and `RESOURCE_MAP["SECURITY"]` excerpts.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `SECURITY`.
- **Fail**: any listed path is missing, or the frontmatter `expected_intent` disagrees with
  `SECURITY`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed
   under `assets/` or `references/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["SECURITY"]`
   excerpt — the SECURITY resource is already part of DEFAULT_RESOURCES, so a missing path here means the ALWAYS-tier baseline itself regressed, not just intent-specific routing.

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
- Playbook ID: CR-R01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/security.md`
