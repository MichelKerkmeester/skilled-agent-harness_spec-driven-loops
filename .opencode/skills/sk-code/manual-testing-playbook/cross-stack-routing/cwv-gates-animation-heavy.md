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

**Expected detection markers** (verbatim from `references/stack-detection.md`):
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
- `references/stack-detection.md`
- `references/smart-routing.md`
- `references/smart-routing.md`
- `sk-code-webflow/references/performance/cwv-remediation.md`
- `sk-code-webflow/references/performance/interaction-gated-loading.md`
- `sk-code-webflow/references/performance/resource-loading.md`
- `sk-code-webflow/references/verification/performance-checklist.md`
- `sk-code-webflow/references/animation/performance-and-pitfalls.md`
- `sk-code-webflow/references/animation/decision-matrix.md`

**Expected assets loaded**:
- `shared/references/performance-loading-checklist.md`
- `sk-code-webflow/assets/patterns/performance-patterns.js`

**Expected agent dispatch**: none.

**Pass/fail criteria with binary grading**:
- **PASS** iff surface is `WEBFLOW` and the load set includes both `sk-code-webflow/references/animation/performance-and-pitfalls.md` and `sk-code-webflow/references/performance/cwv-remediation.md`.
- **FAIL** iff either required performance reference is missing, surface is not `WEBFLOW`, or an agent is dispatched.

**Failure triage**:
1. If Webflow performance refs are missing, inspect the `PERFORMANCE` map in `references/smart-routing.md`.
2. If Motion performance refs are missing, inspect the `MOTION_DEV` map in the same file.
3. If surface is wrong, verify `src/2_javascript/hero.js` is present in the prompt.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Our Webflow landing page in src/2_javascript/hero.js uses motion.dev for scroll reveals and hover cards. LCP and INP regressed. Which sk-code references would you load before advising fixes?`

### Commands

1. Dispatch the exact prompt through the cross-CLI universal-prompt harness with `SCENARIO_ID=CS-006` on each configured CLI runtime.
2. Capture the raw transcript per runtime to `/tmp/skc-CS-006-<cli>.txt`.
3. Capture the structured routing result (surface, references, assets, agent dispatch) per runtime to `results/CS-006-<cli>.yaml`.
4. Diff each `results/CS-006-<cli>.yaml` against the reference/asset set declared in §2 SCENARIO CONTRACT.

### Expected

Expected signals: the structured result in `results/CS-006-<cli>.yaml` reports surface `WEBFLOW` and the reference/asset set declared in §2 SCENARIO CONTRACT, with no agent dispatched.

### Evidence

Evidence: `/tmp/skc-CS-006-<cli>.txt` (raw per-runtime transcript) and `results/CS-006-<cli>.yaml` (structured routing result) for each configured CLI runtime.

### Pass / Fail

- **Pass**: surface is `WEBFLOW` and the load set includes both `sk-code-webflow/references/animation/performance-and-pitfalls.md` and `sk-code-webflow/references/performance/cwv-remediation.md`.
- **Fail**: either required performance reference is missing, surface is not `WEBFLOW`, or an agent is dispatched.

### Failure Triage

1. If Webflow performance refs are missing, inspect the `PERFORMANCE` map in `references/smart-routing.md`.
2. If Motion performance refs are missing, inspect the `MOTION_DEV` map in the same file.
3. If surface is wrong, verify `src/2_javascript/hero.js` is present in the prompt.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` - Root directory page and scenario summary.
- `.opencode/skills/sk-code/sk-code-webflow/references/performance/cwv-remediation.md` - Required Webflow CWV reference.
- `.opencode/skills/sk-code/sk-code-webflow/references/animation/performance-and-pitfalls.md` - Required Motion performance reference.
- `.opencode/skills/sk-code/shared/references/performance-loading-checklist.md` - Expected asset.

---

## 5. SOURCE METADATA

- Group: Cross-Stack Routing
- Playbook ID: CS-006
- Created: 2026-05-05
- Critical path: No
- Destructive: No
- Sandbox: read-only routing analysis
- Concurrent-safe: Yes
- Last validated: pending Phase D matrix
