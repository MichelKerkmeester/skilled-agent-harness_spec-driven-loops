---
title: "CS-001: WEBFLOW Plus Motion.dev Peer References"
description: "Verify WEBFLOW animation work also loads cross-stack motion_dev references and assets when the user request uses Motion.dev APIs."
version: 3.5.0.5
---

# CS-001: WEBFLOW Plus Motion.dev Peer References

## 1. OVERVIEW

This scenario verifies the primary cross-stack route: a Webflow frontend request still detects `WEBFLOW`, then loads `motion_dev/` as a peer resource category for Motion.dev API details. The AI must not treat `motion_dev/` as a third surface and must not skip Webflow implementation and verification guidance.

---

## 2. SCENARIO CONTRACT

**Realistic user prompt**:
```text
For a Webflow hero in src/2_javascript/hero.js, show the pinned Motion CDN pattern and in-view animation snippet.
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
- `code-webflow/references/implementation/animation_workflows.md`
- `code-webflow/references/implementation/observer_patterns.md`
- `code-webflow/references/implementation/third_party_integrations.md`
- `code-webflow/references/verification/verification_workflows.md`
- `code-webflow/references/animation/quick_start.md`
- `code-webflow/references/animation/integration_patterns.md`
- `code-webflow/references/animation/scroll_and_gestures.md`
- `code-webflow/references/animation/performance_and_pitfalls.md`

**Expected assets loaded**:
- `code-webflow/assets/checklists/code_quality_checklist.md`
- `code-webflow/assets/checklists/verification_checklist.md`
- `code-webflow/assets/animation/install_card.md`
- `code-webflow/assets/animation/snippets/in_view_reveal.js`
- `code-webflow/assets/animation/snippets/cdn_bootstrap.js`

**Expected agent dispatch**: none for this read-only routing-analysis harness. If the same prompt were implementation work, `@code` could be dispatched by an orchestrator, but this scenario forbids dispatch.

**Pass/fail criteria with binary grading**:
- **PASS** iff surface is `WEBFLOW`, at least one `code-webflow/references/implementation/*` path loads, `code-webflow/references/animation/quick_start.md` and `code-webflow/assets/animation/snippets/in_view_reveal.js` load, and `agent_dispatched` is `none`.
- **FAIL** iff surface is not `WEBFLOW`, Motion.dev peer references are omitted, or any agent is dispatched.

**Failure triage**:
1. If surface is not `WEBFLOW`, verify the prompt includes `src/2_javascript/` and Webflow terms.
2. If Motion.dev paths are missing, inspect `references/smart_routing.md` Section 3.
3. If an agent was dispatched, verify the universal prompt says analyze only and "DO NOT dispatch any agent."

---

## 3. TEST EXECUTION

Run this scenario through the Phase 005 universal prompt using `SCENARIO_ID=CS-001`. Capture the runtime YAML result and raw transcript.

Expected result files:
- `/tmp/skc-CS-001-<cli>.txt`
- `<spec-folder><cli>.yaml`

---

## 4. SOURCE FILES

- `.opencode/skills/sk-code/shared/references/stack_detection.md` - WEBFLOW marker block.
- `.opencode/skills/sk-code/shared/references/smart_routing.md` - WEBFLOW plus MOTION_DEV loading rules.
- `.opencode/skills/sk-code/code-webflow/references/animation/quick_start.md` - Motion install and import guidance.
- `.opencode/skills/sk-code/code-webflow/assets/animation/snippets/in_view_reveal.js` - Required snippet.

---

## 5. SOURCE METADATA

- **Created**: 2026-05-05
- **Critical path**: Yes
- **Destructive**: No
- **Sandbox**: read-only routing analysis
- **Concurrent-safe**: Yes
- **Last validated**: pending Phase D matrix
