---
title: "CS-005: Snippet Reuse Across Stacks"
description: "Verify cross-stack Motion.dev snippet reuse surfaces the reusable snippet and flags the snake_case Webflow convention caveat."
version: 3.5.0.4
---

# CS-005: Snippet Reuse Across Stacks

## 1. OVERVIEW

This scenario verifies that Motion.dev snippets can be reused outside Webflow while preserving naming-context honesty. The AI should surface the relevant snippet, explain what is reusable, and flag that some local examples use snake_case because Webflow guidance prefers that convention.

---

## 2. SCENARIO CONTRACT

**Realistic user prompt**:
```text
Can I reuse the sk-code Motion in-view reveal snippet in a non-Webflow vanilla JS page? Tell me which snippet and references you would load, and call out any naming-convention caveat.
```

**Expected detection markers** (verbatim from `references/stack_detection.md`):
```text
`motion_dev/` is a peer resource category rather than a surface. Surface detection still chooses WEBFLOW, OPENCODE, or UNKNOWN first; Motion.dev API, performance, and decision guidance is loaded afterward when the intent requires cross-stack animation context.
```

**Expected surface**: `UNKNOWN` or `N/A`

**Expected references loaded** (exact relative paths under `.opencode/skills/sk-code/`):
- `references/stack_detection.md`
- `references/smart_routing.md`
- `code-webflow/references/animation/quick_start.md`
- `code-webflow/references/animation/integration_patterns.md`
- `code-webflow/references/animation/scroll_and_gestures.md`
- `code-webflow/references/javascript/style_guide.md`

**Expected assets loaded**:
- `code-webflow/assets/animation/snippets/in_view_reveal.js`
- `code-webflow/assets/animation/snippets/animate_on_scroll.js`

**Expected agent dispatch**: none.

**Pass/fail criteria with binary grading**:
- **PASS** iff the AI surfaces `code-webflow/assets/animation/snippets/in_view_reveal.js`, states the snippet is cross-stack reusable with runtime adaptation, and explicitly flags the snake_case Webflow convention caveat.
- **FAIL** iff the snippet is not named, Webflow is treated as required for reuse, or the naming caveat is missing.

**Failure triage**:
1. If the snippet is missing, inspect `code-webflow/assets/animation/snippets/`.
2. If the response says Webflow is required, re-read `references/smart_routing.md` Section 3.
3. If no caveat appears, inspect `code-webflow/references/javascript/style_guide.md` for local naming guidance.

---

## 3. TEST EXECUTION

Run this scenario through the Phase 005 universal prompt using `SCENARIO_ID=CS-005`. The grading checks the response content, not only the YAML path list.

Evidence files:
- `/tmp/skc-CS-005-<cli>.txt`
- `<spec-folder><cli>.yaml`

---

## 4. SOURCE FILES

- `.opencode/skills/sk-code/code-webflow/assets/animation/snippets/in_view_reveal.js` - Required reusable snippet.
- `.opencode/skills/sk-code/code-webflow/references/animation/integration_patterns.md` - Cross-stack integration guidance.
- `.opencode/skills/sk-code/code-webflow/references/javascript/style_guide.md` - Snake_case caveat source.

---

## 5. SOURCE METADATA

- **Created**: 2026-05-05
- **Critical path**: No
- **Destructive**: No
- **Sandbox**: read-only routing analysis
- **Concurrent-safe**: Yes
- **Last validated**: pending Phase D matrix
