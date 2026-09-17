---
id: WF-009
category: performance_animation
title: 'Accessibility routing'
description: "This scenario validates ACCESSIBILITY routing for `WF-009`. It confirms that a `prefers-reduced-motion`/reduced-motion-fallback audit prompt classifies as `ACCESSIBILITY` and loads both the animation-workflows implementation doctrine and the verification-workflows gate, matching `SKILL.md` §2b's `RESOURCE_MAP[\"ACCESSIBILITY\"]` entry exactly."
expected_surface: WEBFLOW
expected_intent: ACCESSIBILITY
expected_resources:
  - references/animation/performance-and-pitfalls.md
  - references/implementation/animation-workflows/overview-decision-tree-and-css.md
  - references/implementation/animation-workflows/motion-dev-and-performance.md
  - references/implementation/animation-workflows/testing-and-common-issues.md
  - references/implementation/animation-workflows/motion-dev-advanced.md
  - references/verification/verification-workflows/gate-and-automated-options.md
  - references/verification/verification-workflows/requirements-rules-and-checklist.md
version: 1.0.0.0
---

# WF-009: Accessibility routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-009`.

---

## 1. OVERVIEW

This scenario validates ACCESSIBILITY routing for `WF-009`. It confirms that a `prefers-reduced-motion`/reduced-motion-fallback audit prompt classifies as `ACCESSIBILITY` and loads both the animation-workflows implementation doctrine and the verification-workflows gate, matching `SKILL.md` §2b's `RESOURCE_MAP["ACCESSIBILITY"]` entry exactly.

### Why This Matters

Unlike WF-007/WF-008, which build motion, this scenario audits it. The ACCESSIBILITY resource set combines the animation-workflows doctrine (to know what the fallback should look like) with the verification-workflows gate (to prove it holds), because a reduced-motion fallback that removes visual effect without a corresponding automated check is unverifiable.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-009` classifies as `ACCESSIBILITY` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `ACCESSIBILITY`, and every
  path in `expected_resources`.
- Real user request: `Audit the Webflow motion for prefers-reduced-motion, reduced motion fallback, and accessibility concerns.`
- Prompt: `Audit the Webflow motion for prefers-reduced-motion, reduced motion fallback, and accessibility concerns.`

**Exact prompt**:
```text
Audit the Webflow motion for prefers-reduced-motion, reduced motion fallback, and accessibility concerns.
```

- Expected execution process: the hub detects `WEBFLOW`, the `ACCESSIBILITY` `INTENT_SIGNALS` keywords
  (`prefers-reduced-motion`, `reduced motion`, `accessibility`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `ACCESSIBILITY` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow audits the motion against `prefers-reduced-motion`, proposes the reduced-motion fallback from the animation-workflows doctrine, and proves it holds via the verification-workflows gate rather than a visual impression alone.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `ACCESSIBILITY`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Audit the Webflow motion for prefers-reduced-motion, reduced motion fallback, and accessibility concerns.`

### Commands

1. `sed -n '1,20p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/performance-animation/accessibility-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"ACCESSIBILITY": \[/,/\],/p'`
3. `for p in references/animation/performance-and-pitfalls.md references/implementation/animation-workflows/overview-decision-tree-and-css.md references/implementation/animation-workflows/motion-dev-and-performance.md references/implementation/animation-workflows/testing-and-common-issues.md references/implementation/animation-workflows/motion-dev-advanced.md references/verification/verification-workflows/gate-and-automated-options.md references/verification/verification-workflows/requirements-rules-and-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: ACCESSIBILITY`. Step 2 shows the
`ACCESSIBILITY` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["ACCESSIBILITY"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`ACCESSIBILITY`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`ACCESSIBILITY`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["ACCESSIBILITY"]` excerpt —
   the two sets are an exact mirror for this intent, so any difference means either this scenario
   file or `SKILL.md` §2b drifted and needs reconciling, not that a subset omission is by design.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |

---

## 5. SOURCE METADATA

- Group: Performance And Animation
- Playbook ID: WF-009
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `performance-animation/accessibility-routing.md`

