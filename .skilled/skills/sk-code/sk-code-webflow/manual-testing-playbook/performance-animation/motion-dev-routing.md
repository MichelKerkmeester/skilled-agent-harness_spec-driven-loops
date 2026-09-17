---
id: WF-008
category: performance_animation
title: 'Motion.dev routing'
description: "This scenario validates MOTION_DEV routing for `WF-008`. It confirms that a motion.dev `animate()`/`stagger()`/`inview` prompt classifies as `MOTION_DEV` and loads the Motion.dev-specific quick-start, principles, timeline, gesture, and decision-matrix set plus its snippet assets, matching `SKILL.md` §2b's `RESOURCE_MAP[\"MOTION_DEV\"]` entry exactly — not the general `ANIMATION` set."
expected_surface: WEBFLOW
expected_intent: MOTION_DEV
expected_resources:
  - references/animation/quick-start.md
  - references/animation/animation-principles.md
  - references/animation/animate-and-timelines.md
  - references/animation/scroll-and-gestures.md
  - references/animation/integration-patterns.md
  - references/animation/decision-matrix.md
  - references/animation/performance-and-pitfalls.md
  - assets/animation/install-card.md
  - assets/animation/snippets/principled-reveal.js
  - assets/animation/snippets/README.md
version: 1.0.0.0
---

# WF-008: Motion.dev routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-008`.

---

## 1. OVERVIEW

This scenario validates MOTION_DEV routing for `WF-008`. It confirms that a motion.dev `animate()`/`stagger()`/`inview` prompt classifies as `MOTION_DEV` and loads the Motion.dev-specific quick-start, principles, timeline, gesture, and decision-matrix set plus its snippet assets, matching `SKILL.md` §2b's `RESOURCE_MAP["MOTION_DEV"]` entry exactly — not the general `ANIMATION` set.

### Why This Matters

SKILL.md's own scope note calls out that sk-code-webflow "also carries the folded-in Motion.dev animation overlay." A prompt naming the actual `animate()`/`stagger()` API surface and `inview` behavior should route to the Motion.dev-specific quick-start/principles/decision-matrix set and its `principled-reveal.js` snippet, not the general ANIMATION resource set WF-007 exercises.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-008` classifies as `MOTION_DEV` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `MOTION_DEV`, and every
  path in `expected_resources`.
- Real user request: `Add a motion.dev inview scroll animation with animate() and stagger() for a Webflow reveal.`
- Prompt: `Add a motion.dev inview scroll animation with animate() and stagger() for a Webflow reveal.`

**Exact prompt**:
```text
Add a motion.dev inview scroll animation with animate() and stagger() for a Webflow reveal.
```

- Expected execution process: the hub detects `WEBFLOW`, the `MOTION_DEV` `INTENT_SIGNALS` keywords
  (`motion.dev`, `inview`, `animate()`, `stagger()`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `MOTION_DEV` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow wires the inview reveal with Motion.dev's `animate()`/`stagger()` API per `quick-start.md` and `animate-and-timelines.md`, and cites the `principled-reveal.js` snippet and its `assets/animation/snippets/README.md` usage note rather than hand-rolling an IntersectionObserver callback.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `MOTION_DEV`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add a motion.dev inview scroll animation with animate() and stagger() for a Webflow reveal.`

### Commands

1. `sed -n '1,23p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/performance-animation/motion-dev-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"MOTION_DEV": \[/,/\],/p'`
3. `for p in references/animation/quick-start.md references/animation/animation-principles.md references/animation/animate-and-timelines.md references/animation/scroll-and-gestures.md references/animation/integration-patterns.md references/animation/decision-matrix.md references/animation/performance-and-pitfalls.md assets/animation/install-card.md assets/animation/snippets/principled-reveal.js assets/animation/snippets/README.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: MOTION_DEV`. Step 2 shows the
`MOTION_DEV` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["MOTION_DEV"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`MOTION_DEV`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`MOTION_DEV`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["MOTION_DEV"]` excerpt —
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
- Playbook ID: WF-008
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `performance-animation/motion-dev-routing.md`

