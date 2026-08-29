---
id: WF-001
category: implementation_quality
title: 'Implementation routing'
description: "This scenario validates IMPLEMENTATION routing for `WF-001`. It confirms that a component/module-shaped build prompt naming a smooth-scroll behavior and IntersectionObserver classifies as `IMPLEMENTATION` and loads the full async-timing, observer-pattern, security-pattern, third-party-integration, and Webflow-pattern set — not just the top-level `implementation-workflows/` pair."
expected_surface: WEBFLOW
expected_intent: IMPLEMENTATION
expected_resources:
  - references/implementation/implementation-workflows/condition-based-waiting.md
  - references/implementation/implementation-workflows/validation-minification-and-cdn.md
  - references/implementation/async-patterns/raf-ric-microtask-and-posttask.md
  - references/implementation/async-patterns/timing-compat-and-webflow.md
  - references/implementation/observer-patterns/mutation-and-intersection.md
  - references/implementation/observer-patterns/resize-best-practices-and-shared.md
  - references/implementation/security-patterns/overview-and-checklist.md
  - references/implementation/security-patterns/owasp-prototype-and-safe-access.md
  - references/implementation/third-party-integrations/overview-hls-and-lenis.md
  - references/implementation/third-party-integrations/botpoison-and-finsweet.md
  - references/implementation/third-party-integrations/filepond.md
  - references/implementation/third-party-integrations/best-practices-and-summary.md
  - references/implementation/webflow-patterns/overview-limits-and-collection-lists.md
  - references/implementation/webflow-patterns/development-and-production.md
  - references/implementation/webflow-patterns/finsweet-custom-select-bridge.md
  - references/shared/dev-workflow/overview-nav-and-logging.md
  - references/shared/dev-workflow/automation-errors-and-compat.md
  - references/shared/dev-workflow/common-commands.md
  - references/shared/dev-workflow/checklists-and-decision-matrix.md
  - assets/integrations/README.md
  - assets/patterns/README.md
  - assets/templates/README.md
version: 1.0.0.0
---

# WF-001: Implementation routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-001`.

---

## 1. OVERVIEW

This scenario validates IMPLEMENTATION routing for `WF-001`. It confirms that a component/module-shaped build prompt naming a smooth-scroll behavior and IntersectionObserver classifies as `IMPLEMENTATION` and loads the full async-timing, observer-pattern, security-pattern, third-party-integration, and Webflow-pattern set — not just the top-level `implementation-workflows/` pair.

### Why This Matters

A Webflow smooth-scroll module built from only the top-level `implementation-workflows/` pair risks reinventing IntersectionObserver wiring or RAF/RIC timing the surface already documents separately in `async-patterns/` and `observer-patterns/`. The curated `IMPLEMENTATION` set exists precisely so a component/module-shaped prompt pulls the full async, observer, security, and Webflow-pattern doctrine together, matching `SKILL.md` §2b's `RESOURCE_MAP["IMPLEMENTATION"]` entry exactly.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-001` classifies as `IMPLEMENTATION` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `IMPLEMENTATION`, and every
  path in `expected_resources`.
- Real user request: `Implement a Webflow feature component that creates a smooth-scroll module with intersectionobserver behavior.`
- Prompt: `Implement a Webflow feature component that creates a smooth-scroll module with intersectionobserver behavior.`

**Exact prompt**:
```text
Implement a Webflow feature component that creates a smooth-scroll module with intersectionobserver behavior.
```

- Expected execution process: the hub detects `WEBFLOW`, the `IMPLEMENTATION` `INTENT_SIGNALS` keywords
  (`implement`, `component`, `smooth-scroll`, `intersectionobserver`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `IMPLEMENTATION` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow implements the smooth-scroll module using the condition-based-waiting and IntersectionObserver doctrine from `implementation-workflows/` and `observer-patterns/`, wires timing through the RAF/RIC/microtask trio in `async-patterns/`, and cites the relevant `webflow-patterns/` collection-list or Designer-publish caveat before claiming completion.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `IMPLEMENTATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Implement a Webflow feature component that creates a smooth-scroll module with intersectionobserver behavior.`

### Commands

1. `sed -n '1,35p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/implementation-quality/implementation-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"IMPLEMENTATION": \[/,/\],/p'`
3. `for p in references/implementation/implementation-workflows/condition-based-waiting.md references/implementation/implementation-workflows/validation-minification-and-cdn.md references/implementation/async-patterns/raf-ric-microtask-and-posttask.md references/implementation/async-patterns/timing-compat-and-webflow.md references/implementation/observer-patterns/mutation-and-intersection.md references/implementation/observer-patterns/resize-best-practices-and-shared.md references/implementation/security-patterns/overview-and-checklist.md references/implementation/security-patterns/owasp-prototype-and-safe-access.md references/implementation/third-party-integrations/overview-hls-and-lenis.md references/implementation/third-party-integrations/botpoison-and-finsweet.md references/implementation/third-party-integrations/filepond.md references/implementation/third-party-integrations/best-practices-and-summary.md references/implementation/webflow-patterns/overview-limits-and-collection-lists.md references/implementation/webflow-patterns/development-and-production.md references/implementation/webflow-patterns/finsweet-custom-select-bridge.md references/shared/dev-workflow/overview-nav-and-logging.md references/shared/dev-workflow/automation-errors-and-compat.md references/shared/dev-workflow/common-commands.md references/shared/dev-workflow/checklists-and-decision-matrix.md assets/integrations/README.md assets/patterns/README.md assets/templates/README.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: IMPLEMENTATION`. Step 2 shows the
`IMPLEMENTATION` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["IMPLEMENTATION"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`IMPLEMENTATION`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`IMPLEMENTATION`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["IMPLEMENTATION"]` excerpt —
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

- Group: Implementation And Quality
- Playbook ID: WF-001
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `implementation-quality/implementation-routing.md`

