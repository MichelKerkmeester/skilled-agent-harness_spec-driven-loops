---
id: WF-007
category: performance_animation
title: 'Animation routing'
description: "This scenario validates ANIMATION routing for `WF-007`. It confirms that an easing/stagger/parallax/carousel transition prompt classifies as `ANIMATION` and loads the animation-workflows decision-tree set plus the swiper-patterns trio, matching `SKILL.md` §2b's `RESOURCE_MAP[\"ANIMATION\"]` entry exactly — not the separate `MOTION_DEV` overlay set."
expected_surface: WEBFLOW
expected_intent: ANIMATION
expected_resources:
  - references/implementation/animation-workflows/overview-decision-tree-and-css.md
  - references/implementation/animation-workflows/motion-dev-and-performance.md
  - references/implementation/animation-workflows/testing-and-common-issues.md
  - references/implementation/animation-workflows/motion-dev-advanced.md
  - references/implementation/swiper-patterns/overview-timeline-and-marquee.md
  - references/implementation/swiper-patterns/autoplay-accessibility-and-naming.md
  - references/implementation/swiper-patterns/initialization-and-troubleshooting.md
version: 1.0.0.0
---

# WF-007: Animation routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-007`.

---

## 1. OVERVIEW

This scenario validates ANIMATION routing for `WF-007`. It confirms that an easing/stagger/parallax/carousel transition prompt classifies as `ANIMATION` and loads the animation-workflows decision-tree set plus the swiper-patterns trio, matching `SKILL.md` §2b's `RESOURCE_MAP["ANIMATION"]` entry exactly — not the separate `MOTION_DEV` overlay set.

### Why This Matters

ANIMATION and MOTION_DEV are separate intents that share only the `animation-workflows`/`performance-and-pitfalls` core. A transition/carousel prompt naming easing, stagger, and parallax should resolve to the general animation-workflows and swiper-patterns trio, not to MOTION_DEV's `animate()`/`stagger()` API set, even though both cite similar-sounding keywords like "stagger."

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-007` classifies as `ANIMATION` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `ANIMATION`, and every
  path in `expected_resources`.
- Real user request: `Design a Webflow animation transition with easing, stagger, parallax, and carousel behavior.`
- Prompt: `Design a Webflow animation transition with easing, stagger, parallax, and carousel behavior.`

**Exact prompt**:
```text
Design a Webflow animation transition with easing, stagger, parallax, and carousel behavior.
```

- Expected execution process: the hub detects `WEBFLOW`, the `ANIMATION` `INTENT_SIGNALS` keywords
  (`animation`, `transition`, `stagger`, `parallax`, `carousel`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `ANIMATION` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow builds the easing/stagger/parallax transition and the carousel behavior from the animation-workflows decision tree and the swiper-patterns trio, keeping the carousel's autoplay-accessibility and initialization guidance distinct from Motion.dev's own API.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `ANIMATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Design a Webflow animation transition with easing, stagger, parallax, and carousel behavior.`

### Commands

1. `sed -n '1,20p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/performance-animation/animation-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"ANIMATION": \[/,/\],/p'`
3. `for p in references/implementation/animation-workflows/overview-decision-tree-and-css.md references/implementation/animation-workflows/motion-dev-and-performance.md references/implementation/animation-workflows/testing-and-common-issues.md references/implementation/animation-workflows/motion-dev-advanced.md references/implementation/swiper-patterns/overview-timeline-and-marquee.md references/implementation/swiper-patterns/autoplay-accessibility-and-naming.md references/implementation/swiper-patterns/initialization-and-troubleshooting.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: ANIMATION`. Step 2 shows the
`ANIMATION` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["ANIMATION"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`ANIMATION`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`ANIMATION`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["ANIMATION"]` excerpt —
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
- Playbook ID: WF-007
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `performance-animation/animation-routing.md`

