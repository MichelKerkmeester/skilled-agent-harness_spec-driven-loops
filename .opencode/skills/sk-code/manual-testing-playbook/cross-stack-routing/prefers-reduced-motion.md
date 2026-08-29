---
title: "CS-007: Prefers Reduced Motion Cross-Stack Guidance"
description: "Verify Webflow plus Motion.dev accessibility prompts cite Motion.dev reduced-motion guidance and Webflow animation accessibility guidance."
version: 3.5.0.4
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
- `sk-code-webflow/references/implementation/animation-workflows/overview-decision-tree-and-css.md`
- `sk-code-webflow/references/verification/verification-workflows/gate-and-automated-options.md`
- `sk-code-webflow/references/animation/performance-and-pitfalls.md`
- `sk-code-webflow/references/animation/integration-patterns.md`

**Expected assets loaded**:
- `sk-code-review/assets/code-quality-checklist.md`
- `sk-code-webflow/assets/webflow-verification-checklist.md`
- `sk-code-webflow/assets/animation/snippets/hover-gesture.js`
- `sk-code-webflow/assets/animation/snippets/in-view-reveal.js`

**Expected agent dispatch**: none.

**Pass/fail criteria with binary grading**:
- **PASS** iff surface is `WEBFLOW`, `sk-code-webflow/references/animation/performance-and-pitfalls.md` loads, the user response cites Motion.dev reduced-motion guidance, and Webflow verification/a11y guidance is also loaded.
- **FAIL** iff Motion.dev reduced-motion guidance is missing, Webflow guidance is missing, surface is not `WEBFLOW`, or an agent is dispatched.

**Failure triage**:
1. If Motion reduced-motion guidance is missing, inspect `sk-code-webflow/references/animation/performance-and-pitfalls.md`.
2. If Webflow verification is missing, inspect `sk-code-webflow/references/verification/verification-workflows/gate-and-automated-options.md`.
3. If the response only says "disable animations", check whether it preserves state changes and usability.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `For a Webflow page with motion.dev-powered cards in src/2_javascript/cards.js, how should sk-code route a prefers-reduced-motion fix before editing?`

### Commands

1. Dispatch the exact prompt through the cross-CLI universal-prompt harness with `SCENARIO_ID=CS-007` on each configured CLI runtime.
2. Capture the raw transcript per runtime to `/tmp/skc-CS-007-<cli>.txt`.
3. Capture the structured routing result (surface, references, assets, agent dispatch) per runtime to `results/CS-007-<cli>.yaml`.
4. Diff each `results/CS-007-<cli>.yaml` against the reference/asset set declared in §2 SCENARIO CONTRACT.

### Expected

Expected signals: the structured result in `results/CS-007-<cli>.yaml` reports surface `WEBFLOW` and the reference/asset set declared in §2 SCENARIO CONTRACT, with no agent dispatched.

### Evidence

Evidence: `/tmp/skc-CS-007-<cli>.txt` (raw per-runtime transcript) and `results/CS-007-<cli>.yaml` (structured routing result) for each configured CLI runtime.

### Pass / Fail

- **Pass**: surface is `WEBFLOW`, `sk-code-webflow/references/animation/performance-and-pitfalls.md` loads, the user response cites Motion.dev reduced-motion guidance, and Webflow verification/a11y guidance is also loaded.
- **Fail**: Motion.dev reduced-motion guidance is missing, Webflow guidance is missing, surface is not `WEBFLOW`, or an agent is dispatched.

### Failure Triage

1. If Motion reduced-motion guidance is missing, inspect `sk-code-webflow/references/animation/performance-and-pitfalls.md`.
2. If Webflow verification is missing, inspect `sk-code-webflow/references/verification/verification-workflows/gate-and-automated-options.md`.
3. If the response only says "disable animations", check whether it preserves state changes and usability.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` - Root directory page and scenario summary.
- `.opencode/skills/sk-code/sk-code-webflow/references/animation/performance-and-pitfalls.md` - Motion reduced-motion guidance.
- `.opencode/skills/sk-code/sk-code-webflow/references/implementation/animation-workflows/overview-decision-tree-and-css.md` - Webflow animation accessibility guidance.
- `.opencode/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/gate-and-automated-options.md` - Browser evidence expectations.
- `.opencode/skills/sk-code/sk-code-webflow/assets/animation/snippets/hover-gesture.js` - Reduced-motion snippet pattern.

---

## 5. SOURCE METADATA

- Group: Cross-Stack Routing
- Playbook ID: CS-007
- Created: 2026-05-05
- Critical path: No
- Destructive: No
- Sandbox: read-only routing analysis
- Concurrent-safe: Yes
- Last validated: pending Phase D matrix
