---
title: "SD-001: WEBFLOW Surface Detection"
description: "Verify sk-code routes vanilla-JS / animation-library prompts to the WEBFLOW surface and loads the webflow/* reference and asset trees."
version: 3.5.0.6
---

# SD-001: WEBFLOW Surface Detection

## 1. OVERVIEW

This scenario verifies that sk-code's smart router correctly identifies WEBFLOW as the active code surface when the prompt references vanilla-JS animation libraries (motion.dev, GSAP, Lenis, HLS, Swiper, FilePond) or marker file paths (`src/2_javascript/`, `*.webflow.js`, `wrangler.toml`).

WEBFLOW is the frontend HTML/CSS/JS surface for Webflow / vanilla-animation projects. When detected, sk-code MUST load `references/webflow/*` and `assets/webflow/*` and SHOULD NOT load any `references/opencode/*` resources.

Detection markers are defined verbatim in `references/stack_detection.md:30-37`.

## 2. SCENARIO CONTRACT

**Realistic user request**: A frontend developer working on a Webflow site asks the AI to add smooth-scroll behavior using the Lenis library, gated behind an IntersectionObserver so it only initializes once the user scrolls into the hero section.

**Exact prompt**:
```
Add Lenis smooth-scroll to src/2_javascript/scroll.js, gated by IntersectionObserver when the hero becomes visible.
```

**Expected detection**:
- Surface: `WEBFLOW`
- Triggering markers: `src/2_javascript/` (path marker) AND `Lenis` (library marker) → either alone is sufficient per `code_surface_detection.md:30-37`.

**Expected references loaded** (exact relative paths under `.opencode/skills/sk-code/`):
- `references/stack_detection.md` (always loaded for router decision)
- `references/smart_routing.md`
- `references/smart_routing.md`
- `references/phase_detection.md`
- `references/universal/code_quality_standards.md`
- `references/webflow/implementation/webflow_patterns.md`
- `references/webflow/implementation/animation_workflows.md`
- `references/webflow/implementation/observer_patterns.md`
- `references/webflow/javascript/quality_standards.md`
- `references/webflow/javascript/style_guide.md`
- `references/webflow/css/style_guide.md`
- `references/webflow/shared/cross_language_rules.md`

**Expected assets loaded**:
- `assets/webflow/checklists/code_quality_checklist.md`
- `assets/webflow/patterns/interaction_gate_patterns.js` (when intent is implementation gating)

**Expected NOT loaded**: any `references/opencode/*` or `assets/opencode/*` (would indicate misrouting).

**Expected agent dispatch**: `@code` (LEAF) for the actual edit, dispatched ONLY by `@orchestrate`. If the user prompt is invoked directly without orchestration, the AI may apply the change inline using sk-code guidance without dispatching @code.

**Desired user-visible outcome**: The AI applies the edit to `src/2_javascript/scroll.js`, citing webflow-specific patterns (IntersectionObserver gate from `assets/webflow/patterns/interaction_gate_patterns.js`) and confirming the modification with a Lenis initializer + observer fence.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/sk-code/SKILL.md` is at HEAD-of-main.
2. `references/stack_detection.md:30-37` contains the WEBFLOW marker block (verify with `head -40 .opencode/skills/sk-code/references/stack_detection.md`).
3. Sandbox: create `/tmp/skc-SD001-sandbox/src/2_javascript/scroll.js` with placeholder content (the AI doesn't need to actually write — we're testing routing).
4. Skill advisor binary callable: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --help` exits 0.

### Exact Command Sequence

1. **Skill advisor probe**:
   ```
   bash: python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Add Lenis smooth-scroll to src/2_javascript/scroll.js, gated by IntersectionObserver when the hero becomes visible." --threshold 0.8 > /tmp/skc-SD001-advisor.txt
   ```
2. **Verify advisor result**: top-1 == `sk-code`, score ≥ 0.80.
3. **Invoke sk-code** in the orchestrator runtime by feeding the same prompt.
4. **Capture sk-code output**: which surface did it report? Which references did it list as loaded?
5. **Persist evidence**: save the AI's response (including its surface-detection log line and its loaded-refs list) to `/tmp/skc-SD001-loaded-refs.txt`.

### Expected Signals (per step)

| Step | Signal |
|---|---|
| 1 | Advisor returns JSON with `top_skill: "sk-code"`, `score: ≥ 0.80`. |
| 2 | Pass — proceed. |
| 3 | sk-code SKILL.md is loaded; the AI runs the smart router pseudocode and emits `SURFACE: WEBFLOW`. |
| 4 | The AI lists `references/webflow/implementation/*` as loaded; lists `assets/webflow/checklists/code_quality_checklist.md` as loaded; does NOT list any `references/opencode/*`. |
| 5 | Evidence file contains all of the above. |

### Pass/Fail Criteria

- **PASS** iff:
  - Advisor wins sk-code at score ≥ 0.80.
  - sk-code reports surface == WEBFLOW.
  - Loaded references include at least 3 paths under `references/webflow/implementation/`.
  - Loaded references DO NOT include any `references/opencode/`.
- **PARTIAL** iff:
  - Surface correct, but the AI loads extra `universal/` resources beyond the listed expectations (acceptable drift).
- **FAIL** iff:
  - Advisor loses sk-code, OR surface != WEBFLOW, OR any `references/opencode/*` is loaded.

### Failure Triage

1. If advisor doesn't win sk-code: check `skill-graph.json` `sk-code.signals` array — ensure "webflow", "frontend", "animation" are present.
2. If surface != WEBFLOW: re-read `references/stack_detection.md:30-37` and verify the markers in the prompt actually match the regex/grep patterns.
3. If `references/opencode/*` is loaded: the router is mis-classifying. Check whether the CWD shell variable (`PWD`) accidentally contains `/.opencode/` (would trigger OPENCODE) — the marker priority is documented in SKILL.md smart router pseudocode.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/SKILL.md` — Smart router pseudocode (lines 53-68).
- `.opencode/skills/sk-code/references/stack_detection.md` — WEBFLOW marker definitions (lines 30-37).
- `.opencode/skills/sk-code/references/smart_routing.md` — Intent → resource-loading mapping.
- `.opencode/skills/sk-code/references/webflow/implementation/webflow_patterns.md` — Expected-loaded reference.
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` — sk-code signals + adjacency.

## 5. SOURCE METADATA

- **Created**: 2026-05-04
- **Critical path**: Yes
- **Destructive**: No (read-only routing test)
- **Sandbox**: `/tmp/skc-SD001-sandbox/`
- **Concurrent-safe**: Yes (no agent dispatch)
- **Last validated**: pending first manual run
