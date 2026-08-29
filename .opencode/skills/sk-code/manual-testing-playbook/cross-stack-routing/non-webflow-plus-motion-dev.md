---
title: "CS-002: Non-Webflow Plus Motion.dev Peer References"
description: "Verify generic vanilla HTML/CSS/JS Motion.dev work loads motion_dev references without being misclassified as WEBFLOW."
version: 3.5.0.5
---

# CS-002: Non-Webflow Plus Motion.dev Peer References

## 1. OVERVIEW

This scenario protects the generic-node guard. A bare Motion.dev prompt outside Webflow markers is cross-stack Motion work, not Webflow work. The AI should report `UNKNOWN` or `N/A` for implementation surface, load `motion_dev/` peer resources, and ask for runtime plus verification commands before implementation.

---

## 2. SCENARIO CONTRACT

**Realistic user prompt**:
```text
For a non-Webflow vanilla JS page, which Motion.dev references and snippets should sk-code load for hover cards and in-view reveal?
```

**Expected detection markers** (verbatim from `references/stack-detection.md`):
```text
Generic-Node guard: WEBFLOW markers are gated to actual Webflow signals (vendor globals, Webflow paths, `wrangler.toml`, `src/2_javascript/`). Bare Motion package imports and generic Motion documentation mentions are MOTION_DEV intent signals after surface selection, not WEBFLOW surface markers. Generic Node.js outside `.opencode/` and without WEBFLOW markers stays UNKNOWN until the user clarifies the surface.
```

**Expected surface**: `UNKNOWN` or `N/A`

**Expected references loaded** (exact relative paths under `.opencode/skills/sk-code/`):
- `references/stack-detection.md`
- `references/smart-routing.md`
- `references/smart-routing.md`
- `sk-code-webflow/references/animation/quick-start.md`
- `sk-code-webflow/references/animation/integration-patterns.md`
- `sk-code-webflow/references/animation/scroll-and-gestures.md`
- `sk-code-webflow/references/animation/decision-matrix.md`

**Expected assets loaded**:
- `sk-code-webflow/assets/animation/snippets/hover-gesture.js`
- `sk-code-webflow/assets/animation/snippets/in-view-reveal.js`
- `sk-code-webflow/assets/animation/install-card.md`

**Expected NOT loaded**:
- `sk-code-webflow/references/implementation/webflow-patterns/overview-limits-and-collection-lists.md`
- `sk-code-webflow/assets/checklists/code-quality-checklist.md`

**Expected agent dispatch**: none.

**Pass/fail criteria with binary grading**:
- **PASS** iff the AI does not classify the prompt as `WEBFLOW`, loads Motion.dev peer resources, and asks for the target runtime/verification command before implementation.
- **FAIL** iff the AI routes to `WEBFLOW`, loads Webflow-only assets as authoritative guidance, or dispatches an agent.

**Failure triage**:
1. If `WEBFLOW` is detected, re-read the generic-node guard in `code_surface_detection.md`.
2. If no Motion.dev refs load, inspect `MOTION_DEV` signals in `references/smart-routing.md`.
3. If the response proceeds to implementation, verify the universal prompt is routed as read-only analysis.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `For a non-Webflow vanilla JS page, which Motion.dev references and snippets should sk-code load for hover cards and in-view reveal?`

### Commands

1. Dispatch the exact prompt through the cross-CLI universal-prompt harness with `SCENARIO_ID=CS-002` on each configured CLI runtime.
2. Capture the raw transcript per runtime to `/tmp/skc-CS-002-<cli>.txt`.
3. Capture the structured routing result (surface, references, assets, agent dispatch) per runtime to `results/CS-002-<cli>.yaml`.
4. Diff each `results/CS-002-<cli>.yaml` against the reference/asset set declared in §2 SCENARIO CONTRACT.

### Expected

Expected signals: the structured result in `results/CS-002-<cli>.yaml` reports surface `UNKNOWN` and the reference/asset set declared in §2 SCENARIO CONTRACT, with no agent dispatched.

### Evidence

Evidence: `/tmp/skc-CS-002-<cli>.txt` (raw per-runtime transcript) and `results/CS-002-<cli>.yaml` (structured routing result) for each configured CLI runtime.

### Pass / Fail

- **Pass**: the AI does not classify the prompt as `WEBFLOW`, loads Motion.dev peer resources, and asks for the target runtime/verification command before implementation.
- **Fail**: the AI routes to `WEBFLOW`, loads Webflow-only assets as authoritative guidance, or dispatches an agent.

### Failure Triage

1. If `WEBFLOW` is detected, re-read the generic-node guard in `code_surface_detection.md`.
2. If no Motion.dev refs load, inspect `MOTION_DEV` signals in `references/smart-routing.md`.
3. If the response proceeds to implementation, verify the universal prompt is routed as read-only analysis.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` - Root directory page and scenario summary.
- `.opencode/skills/sk-code/shared/references/stack-detection.md` - generic-node guard.
- `.opencode/skills/sk-code/shared/references/smart-routing.md` - MOTION_DEV signals.
- `.opencode/skills/sk-code/sk-code-webflow/references/animation/decision-matrix.md` - CSS/Motion/WAAPI trade-offs.
- `.opencode/skills/sk-code/sk-code-webflow/assets/animation/snippets/hover-gesture.js` - Required snippet.

---

## 5. SOURCE METADATA

- Group: Cross-Stack Routing
- Playbook ID: CS-002
- Created: 2026-05-05
- Critical path: Yes
- Destructive: No
- Sandbox: read-only routing analysis
- Concurrent-safe: Yes
- Last validated: pending Phase D matrix
