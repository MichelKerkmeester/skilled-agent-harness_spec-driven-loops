---
title: "CS-004: Decision Matrix Routing"
description: "Verify Motion.dev versus CSS hover-state questions load the motion_dev decision matrix instead of silently choosing a library."
version: 3.5.0.4
---

# CS-004: Decision Matrix Routing

## 1. OVERVIEW

This scenario verifies that design-choice prompts load the decision matrix. The AI should name the trade-off between CSS, Motion.dev, GSAP, and WAAPI rather than silently defaulting to Motion.dev.

---

## 2. SCENARIO CONTRACT

**Realistic user prompt**:
```text
For a hover state on cards, should I use motion.dev or plain CSS? I need the routing decision and the references you would load, not an implementation.
```

**Expected detection markers** (verbatim from `references/stack_detection.md`):
```text
`motion_dev/` is a peer resource category rather than a surface. Surface detection still chooses WEBFLOW, OPENCODE, or UNKNOWN first; Motion.dev API, performance, and decision guidance is loaded afterward when the intent requires cross-stack animation context.
```

**Expected surface**: `UNKNOWN` or `N/A`

**Expected references loaded** (exact relative paths under `.opencode/skills/sk-code/`):
- `references/stack_detection.md`
- `references/smart_routing.md`
- `references/smart_routing.md`
- `references/motion_dev/decision_matrix.md`
- `references/motion_dev/performance_and_pitfalls.md`
- `references/motion_dev/integration_patterns.md`

**Expected assets loaded**:
- `assets/motion_dev/snippets/hover_gesture.js`

**Expected agent dispatch**: none.

**Pass/fail criteria with binary grading**:
- **PASS** iff the AI lists `references/motion_dev/decision_matrix.md`, keeps surface as `UNKNOWN` or `N/A`, and its user response compares CSS and Motion.dev with conditions.
- **FAIL** iff `decision_matrix.md` is omitted, the AI invents a surface, or it gives an implementation-only answer.

**Failure triage**:
1. If no decision matrix loads, inspect `CODE_QUALITY / DECISION` in `references/smart_routing.md`.
2. If `WEBFLOW` is selected, verify the prompt contains no Webflow path, vendor global, or `wrangler.toml`.
3. If the response is one-sided, compare it against `references/motion_dev/decision_matrix.md`.

---

## 3. TEST EXECUTION

Run this scenario through the Phase 005 universal prompt using `SCENARIO_ID=CS-004`. The expected answer may recommend CSS for simple hover and Motion.dev for timeline, gesture, or runtime-controlled cases, but the matrix must be loaded.

Evidence files:
- `/tmp/skc-CS-004-<cli>.txt`
- `<spec-folder><cli>.yaml`

---

## 4. SOURCE FILES

- `.opencode/skills/sk-code/code-animation/references/decision_matrix.md` - Required decision reference.
- `.opencode/skills/sk-code/code-animation/references/performance_and_pitfalls.md` - Performance and reduced-motion caveats.
- `.opencode/skills/sk-code/code-animation/assets/snippets/hover_gesture.js` - Hover example when Motion.dev is justified.

---

## 5. SOURCE METADATA

- **Created**: 2026-05-05
- **Critical path**: No
- **Destructive**: No
- **Sandbox**: read-only routing analysis
- **Concurrent-safe**: Yes
- **Last validated**: pending Phase D matrix
