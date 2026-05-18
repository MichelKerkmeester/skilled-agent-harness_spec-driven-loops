---
title: "CS-007: Prefers Reduced Motion Cross-Stack Guidance"
description: "Verify Webflow plus Motion.dev accessibility prompts cite Motion.dev reduced-motion guidance and Webflow animation accessibility guidance."
---

# CS-007: Prefers Reduced Motion Cross-Stack Guidance

## 1. OVERVIEW

This scenario verifies accessibility guidance for Webflow Motion.dev work. The AI must load the Webflow animation/accessibility references and the Motion.dev reduced-motion guidance so it can cite both platform expectations and API-level caveats.

---

## 2. SCENARIO CONTRACT

**Realistic user prompt**:
```text
For a Webflow page with motion.dev-powered cards in src/2_javascript/cards.js, how should sk-code route a prefers-reduced-motion fix before editing?
```

**Expected detection markers** (verbatim from `references/stack_detection.md`):
```bash
# 2. WEBFLOW
[ -d "src/2_javascript" ]
ls *.webflow.js 2>/dev/null | head -1
grep -lq "Webflow\.push\|--vw-" src/**/*.{js,css,html} 2>/dev/null
grep -lqE "window\.Motion|window\.gsap|gsap\.(to|from|set|timeline|registerPlugin)|new Lenis|new Hls|new Swiper|FilePond" \
  src/**/*.{js,mjs,ts,html} *.{js,mjs,ts,html} 2>/dev/null
[ -f "wrangler.toml" ]
```

**Expected surface**: `WEBFLOW`

**Expected references loaded** (exact relative paths under `.opencode/skills/sk-code/`):
- `references/stack_detection.md`
- `references/smart_routing.md`
- `references/smart_routing.md`
- `references/webflow/implementation/animation_workflows.md`
- `references/webflow/javascript/quality_standards.md`
- `references/webflow/verification/verification_workflows.md`
- `references/motion_dev/performance_and_pitfalls.md`
- `references/motion_dev/integration_patterns.md`

**Expected assets loaded**:
- `assets/webflow/checklists/code_quality_checklist.md`
- `assets/webflow/checklists/verification_checklist.md`
- `assets/motion_dev/snippets/hover_gesture.js`
- `assets/motion_dev/snippets/in_view_reveal.js`

**Expected agent dispatch**: none.

**Pass/fail criteria with binary grading**:
- **PASS** iff surface is `WEBFLOW`, `references/motion_dev/performance_and_pitfalls.md` loads, the user response cites Motion.dev reduced-motion guidance, and Webflow verification/a11y guidance is also loaded.
- **FAIL** iff Motion.dev reduced-motion guidance is missing, Webflow guidance is missing, surface is not `WEBFLOW`, or an agent is dispatched.

**Failure triage**:
1. If Motion reduced-motion guidance is missing, inspect `references/motion_dev/performance_and_pitfalls.md`.
2. If Webflow verification is missing, inspect `references/webflow/verification/verification_workflows.md`.
3. If the response only says "disable animations", check whether it preserves state changes and usability.

---

## 3. TEST EXECUTION

Run this scenario through the Phase 005 universal prompt using `SCENARIO_ID=CS-007`.

Evidence files:
- `/tmp/skc-CS-007-<cli>.txt`
- `<spec-folder><cli>.yaml`

---

## 4. SOURCE FILES

- `.opencode/skills/sk-code/references/motion_dev/performance_and_pitfalls.md` - Motion reduced-motion guidance.
- `.opencode/skills/sk-code/references/webflow/implementation/animation_workflows.md` - Webflow animation accessibility guidance.
- `.opencode/skills/sk-code/references/webflow/verification/verification_workflows.md` - Browser evidence expectations.
- `.opencode/skills/sk-code/assets/motion_dev/snippets/hover_gesture.js` - Reduced-motion snippet pattern.

---

## 5. SOURCE METADATA

- **Created**: 2026-05-05
- **Critical path**: No
- **Destructive**: No
- **Sandbox**: read-only routing analysis
- **Concurrent-safe**: Yes
- **Last validated**: pending Phase D matrix
