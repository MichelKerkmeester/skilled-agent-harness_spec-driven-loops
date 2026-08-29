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

**Expected detection markers** (verbatim from `references/stack-detection.md`):
```text
`motion_dev/` is a peer resource category rather than a surface. Surface detection still chooses WEBFLOW, OPENCODE, or UNKNOWN first; Motion.dev API, performance, and decision guidance is loaded afterward when the intent requires cross-stack animation context.
```

**Expected surface**: `UNKNOWN` or `N/A`

**Expected references loaded** (exact relative paths under `.opencode/skills/sk-code/`):
- `references/stack-detection.md`
- `references/smart-routing.md`
- `sk-code-webflow/references/animation/quick-start.md`
- `sk-code-webflow/references/animation/integration-patterns.md`
- `sk-code-webflow/references/animation/scroll-and-gestures.md`

**Expected assets loaded**:
- `sk-code-webflow/assets/animation/snippets/in-view-reveal.js`
- `sk-code-webflow/assets/animation/snippets/animate-on-scroll.js`

**Expected agent dispatch**: none.

**Pass/fail criteria with binary grading**:
- **PASS** iff the AI surfaces `sk-code-webflow/assets/animation/snippets/in-view-reveal.js`, states the snippet is cross-stack reusable with runtime adaptation, and explicitly flags the snake_case Webflow convention caveat.
- **FAIL** iff the snippet is not named, Webflow is treated as required for reuse, or the naming caveat is missing.

**Failure triage**:
1. If the snippet is missing, inspect `sk-code-webflow/assets/animation/snippets/`.
2. If the response says Webflow is required, re-read `references/smart-routing.md` Section 3.
3. If no caveat appears, inspect `sk-code-webflow/references/javascript/style-guide/overview-naming-and-structure.md` for local naming guidance.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Can I reuse the sk-code Motion in-view reveal snippet in a non-Webflow vanilla JS page? Tell me which snippet and references you would load, and call out any naming-convention caveat.`

### Commands

1. Dispatch the exact prompt through the cross-CLI universal-prompt harness with `SCENARIO_ID=CS-005` on each configured CLI runtime.
2. Capture the raw transcript per runtime to `/tmp/skc-CS-005-<cli>.txt`.
3. Capture the structured routing result (surface, references, assets, agent dispatch) per runtime to `results/CS-005-<cli>.yaml`.
4. Diff each `results/CS-005-<cli>.yaml` against the reference/asset set declared in §2 SCENARIO CONTRACT.

### Expected

Expected signals: the structured result in `results/CS-005-<cli>.yaml` reports surface `UNKNOWN` and the reference/asset set declared in §2 SCENARIO CONTRACT, with no agent dispatched.

### Evidence

Evidence: `/tmp/skc-CS-005-<cli>.txt` (raw per-runtime transcript) and `results/CS-005-<cli>.yaml` (structured routing result) for each configured CLI runtime.

### Pass / Fail

- **Pass**: the AI surfaces `sk-code-webflow/assets/animation/snippets/in-view-reveal.js`, states the snippet is cross-stack reusable with runtime adaptation, and explicitly flags the snake_case Webflow convention caveat.
- **Fail**: the snippet is not named, Webflow is treated as required for reuse, or the naming caveat is missing.

### Failure Triage

1. If the snippet is missing, inspect `sk-code-webflow/assets/animation/snippets/`.
2. If the response says Webflow is required, re-read `references/smart-routing.md` Section 3.
3. If no caveat appears, inspect `sk-code-webflow/references/javascript/style-guide/overview-naming-and-structure.md` for local naming guidance.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` - Root directory page and scenario summary.
- `.opencode/skills/sk-code/sk-code-webflow/assets/animation/snippets/in-view-reveal.js` - Required reusable snippet.
- `.opencode/skills/sk-code/sk-code-webflow/references/animation/integration-patterns.md` - Cross-stack integration guidance.
- `.opencode/skills/sk-code/sk-code-webflow/references/javascript/style-guide/overview-naming-and-structure.md` - Snake_case caveat source.

---

## 5. SOURCE METADATA

- Group: Cross-Stack Routing
- Playbook ID: CS-005
- Created: 2026-05-05
- Critical path: No
- Destructive: No
- Sandbox: read-only routing analysis
- Concurrent-safe: Yes
- Last validated: pending Phase D matrix
