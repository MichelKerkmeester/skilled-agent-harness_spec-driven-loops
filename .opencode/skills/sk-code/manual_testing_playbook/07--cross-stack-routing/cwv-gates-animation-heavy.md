---
title: "CS-006: Animation-Heavy Core Web Vitals Gates"
description: "Verify animation-heavy Webflow performance prompts load both Motion.dev performance guidance and Webflow CWV remediation guidance."
version: 3.5.0.4
---

# CS-006: Animation-Heavy Core Web Vitals Gates

## 1. OVERVIEW

This scenario verifies dual performance loading. A Webflow page with Motion.dev-heavy animation needs Webflow Core Web Vitals remediation plus Motion.dev animation-performance pitfalls. Loading only one side loses either platform constraints or API-specific risks.

---

## 2. SCENARIO CONTRACT

**Realistic user prompt**:
```text
Our Webflow landing page in src/2_javascript/hero.js uses motion.dev for scroll reveals and hover cards. LCP and INP regressed. Which sk-code references would you load before advising fixes?
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
- `references/webflow/performance/cwv_remediation.md`
- `references/webflow/performance/interaction_gated_loading.md`
- `references/webflow/performance/resource_loading.md`
- `references/webflow/verification/performance_checklist.md`
- `references/motion_dev/performance_and_pitfalls.md`
- `references/motion_dev/decision_matrix.md`

**Expected assets loaded**:
- `assets/webflow/checklists/performance_loading_checklist.md`
- `assets/webflow/patterns/performance_patterns.js`

**Expected agent dispatch**: none.

**Pass/fail criteria with binary grading**:
- **PASS** iff surface is `WEBFLOW` and the load set includes both `references/motion_dev/performance_and_pitfalls.md` and `references/webflow/performance/cwv_remediation.md`.
- **FAIL** iff either required performance reference is missing, surface is not `WEBFLOW`, or an agent is dispatched.

**Failure triage**:
1. If Webflow performance refs are missing, inspect the `PERFORMANCE` map in `references/smart_routing.md`.
2. If Motion performance refs are missing, inspect the `MOTION_DEV` map in the same file.
3. If surface is wrong, verify `src/2_javascript/hero.js` is present in the prompt.

---

## 3. TEST EXECUTION

Run this scenario through the Phase 005 universal prompt using `SCENARIO_ID=CS-006`.

Evidence files:
- `/tmp/skc-CS-006-<cli>.txt`
- `<spec-folder><cli>.yaml`

---

## 4. SOURCE FILES

- `.opencode/skills/sk-code/code-webflow/references/performance/cwv_remediation.md` - Required Webflow CWV reference.
- `.opencode/skills/sk-code/code-animation/references/performance_and_pitfalls.md` - Required Motion performance reference.
- `.opencode/skills/sk-code/code-verify/assets/performance_loading_checklist.md` - Expected asset.

---

## 5. SOURCE METADATA

- **Created**: 2026-05-05
- **Critical path**: No
- **Destructive**: No
- **Sandbox**: read-only routing analysis
- **Concurrent-safe**: Yes
- **Last validated**: pending Phase D matrix
