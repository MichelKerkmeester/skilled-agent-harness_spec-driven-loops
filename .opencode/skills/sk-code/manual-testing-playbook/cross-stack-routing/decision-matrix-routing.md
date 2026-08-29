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

**Expected detection markers** (verbatim from `references/stack-detection.md`):
```text
`motion_dev/` is a peer resource category rather than a surface. Surface detection still chooses WEBFLOW, OPENCODE, or UNKNOWN first; Motion.dev API, performance, and decision guidance is loaded afterward when the intent requires cross-stack animation context.
```

**Expected surface**: `UNKNOWN` or `N/A`

**Expected references loaded** (exact relative paths under `.opencode/skills/sk-code/`):
- `references/stack-detection.md`
- `references/smart-routing.md`
- `references/smart-routing.md`
- `sk-code-webflow/references/animation/decision-matrix.md`
- `sk-code-webflow/references/animation/performance-and-pitfalls.md`
- `sk-code-webflow/references/animation/integration-patterns.md`

**Expected assets loaded**:
- `sk-code-webflow/assets/animation/snippets/hover-gesture.js`

**Expected agent dispatch**: none.

**Pass/fail criteria with binary grading**:
- **PASS** iff the AI lists `sk-code-webflow/references/animation/decision-matrix.md`, keeps surface as `UNKNOWN` or `N/A`, and its user response compares CSS and Motion.dev with conditions.
- **FAIL** iff `decision-matrix.md` is omitted, the AI invents a surface, or it gives an implementation-only answer.

**Failure triage**:
1. If no decision matrix loads, inspect `CODE_QUALITY / DECISION` in `references/smart-routing.md`.
2. If `WEBFLOW` is selected, verify the prompt contains no Webflow path, vendor global, or `wrangler.toml`.
3. If the response is one-sided, compare it against `sk-code-webflow/references/animation/decision-matrix.md`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `For a hover state on cards, should I use motion.dev or plain CSS? I need the routing decision and the references you would load, not an implementation.`

### Commands

1. Dispatch the exact prompt through the cross-CLI universal-prompt harness with `SCENARIO_ID=CS-004` on each configured CLI runtime.
2. Capture the raw transcript per runtime to `/tmp/skc-CS-004-<cli>.txt`.
3. Capture the structured routing result (surface, references, assets, agent dispatch) per runtime to `results/CS-004-<cli>.yaml`.
4. Diff each `results/CS-004-<cli>.yaml` against the reference/asset set declared in §2 SCENARIO CONTRACT.

### Expected

Expected signals: the structured result in `results/CS-004-<cli>.yaml` reports surface `UNKNOWN` and the reference/asset set declared in §2 SCENARIO CONTRACT, with no agent dispatched.

### Evidence

Evidence: `/tmp/skc-CS-004-<cli>.txt` (raw per-runtime transcript) and `results/CS-004-<cli>.yaml` (structured routing result) for each configured CLI runtime.

### Pass / Fail

- **Pass**: the AI lists `sk-code-webflow/references/animation/decision-matrix.md`, keeps surface as `UNKNOWN` or `N/A`, and its user response compares CSS and Motion.dev with conditions.
- **Fail**: `decision-matrix.md` is omitted, the AI invents a surface, or it gives an implementation-only answer.

### Failure Triage

1. If no decision matrix loads, inspect `CODE_QUALITY / DECISION` in `references/smart-routing.md`.
2. If `WEBFLOW` is selected, verify the prompt contains no Webflow path, vendor global, or `wrangler.toml`.
3. If the response is one-sided, compare it against `sk-code-webflow/references/animation/decision-matrix.md`.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` - Root directory page and scenario summary.
- `.opencode/skills/sk-code/sk-code-webflow/references/animation/decision-matrix.md` - Required decision reference.
- `.opencode/skills/sk-code/sk-code-webflow/references/animation/performance-and-pitfalls.md` - Performance and reduced-motion caveats.
- `.opencode/skills/sk-code/sk-code-webflow/assets/animation/snippets/hover-gesture.js` - Hover example when Motion.dev is justified.

---

## 5. SOURCE METADATA

- Group: Cross-Stack Routing
- Playbook ID: CS-004
- Created: 2026-05-05
- Critical path: No
- Destructive: No
- Sandbox: read-only routing analysis
- Concurrent-safe: Yes
- Last validated: pending Phase D matrix
