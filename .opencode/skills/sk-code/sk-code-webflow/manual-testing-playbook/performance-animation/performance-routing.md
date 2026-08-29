---
id: WF-006
category: performance_animation
title: 'Performance routing'
description: "This scenario validates PERFORMANCE routing for `WF-006`. It confirms that an LCP/CLS/Lighthouse prompt classifies as `PERFORMANCE` and loads the full performance-remediation, performance-pattern, and animation-performance set, matching `SKILL.md` §2b's `RESOURCE_MAP[\"PERFORMANCE\"]` entry exactly."
expected_surface: WEBFLOW
expected_intent: PERFORMANCE
expected_resources:
  - references/performance/cwv-remediation.md
  - references/performance/interaction-gated-loading.md
  - references/performance/resource-loading.md
  - references/performance/third-party.md
  - references/performance/webflow-constraints.md
  - references/verification/performance-checklist.md
  - references/implementation/performance-patterns/overview-and-checklist.md
  - references/implementation/performance-patterns/budgets-and-anti-patterns.md
  - references/animation/performance-and-pitfalls.md
version: 1.0.0.0
---

# WF-006: Performance routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-006`.

---

## 1. OVERVIEW

This scenario validates PERFORMANCE routing for `WF-006`. It confirms that an LCP/CLS/Lighthouse prompt classifies as `PERFORMANCE` and loads the full performance-remediation, performance-pattern, and animation-performance set, matching `SKILL.md` §2b's `RESOURCE_MAP["PERFORMANCE"]` entry exactly.

### Why This Matters

SKILL.md §3 states Core Web Vitals are "a gate, not a report." An LCP/CLS fix that stops at a source-code change without re-measuring in Lighthouse against `cwv-remediation.md` and `webflow-constraints.md` has not closed the loop this scenario's resource set exists to enforce.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-006` classifies as `PERFORMANCE` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `PERFORMANCE`, and every
  path in `expected_resources`.
- Real user request: `Fix the largest contentful paint and cls jank on the hero so core web vitals pass in Lighthouse.`
- Prompt: `Fix the largest contentful paint and cls jank on the hero so core web vitals pass in Lighthouse.`

**Exact prompt**:
```text
Fix the largest contentful paint and cls jank on the hero so core web vitals pass in Lighthouse.
```

- Expected execution process: the hub detects `WEBFLOW`, the `PERFORMANCE` `INTENT_SIGNALS` keywords
  (`largest contentful`, `cls`, `core web vitals`, `lighthouse`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `PERFORMANCE` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow treats the LCP/CLS regression as a gate, remediates it against `cwv-remediation.md` and `webflow-constraints.md`, and re-measures in Lighthouse rather than reporting the fix as done from source inspection alone.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `PERFORMANCE`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Fix the largest contentful paint and cls jank on the hero so core web vitals pass in Lighthouse.`

### Commands

1. `sed -n '1,22p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/performance-animation/performance-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"PERFORMANCE": \[/,/\],/p'`
3. `for p in references/performance/cwv-remediation.md references/performance/interaction-gated-loading.md references/performance/resource-loading.md references/performance/third-party.md references/performance/webflow-constraints.md references/verification/performance-checklist.md references/implementation/performance-patterns/overview-and-checklist.md references/implementation/performance-patterns/budgets-and-anti-patterns.md references/animation/performance-and-pitfalls.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: PERFORMANCE`. Step 2 shows the
`PERFORMANCE` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["PERFORMANCE"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`PERFORMANCE`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`PERFORMANCE`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["PERFORMANCE"]` excerpt —
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
| [SKILL.md](../../SKILL.md) §3 | The "Core Web Vitals are a gate, not a report" non-negotiable this scenario grounds in |

---

## 5. SOURCE METADATA

- Group: Performance And Animation
- Playbook ID: WF-006
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `performance-animation/performance-routing.md`

