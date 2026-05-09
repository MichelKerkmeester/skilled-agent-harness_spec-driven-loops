---
title: Smart Router - Routing Logic and Resource Maps
description: Authoritative routing logic for sk-code's surface-based routing — intent classification, surface-to-resource maps for WEBFLOW + OPENCODE + MOTION_DEV, load tiers, verification commands, and UNKNOWN fallback.
---

# Smart Router - Routing Logic and Resource Maps

Authoritative routing reference for sk-code. Consolidates intent classification + resource loading into the single Barter-style smart-routing entry point. Detection logic lives in [`stack_detection.md`](./stack_detection.md); phase lifecycle lives in [`phase_detection.md`](./phase_detection.md).

---

## 1. OVERVIEW

### Purpose

The smart router maps a detected surface (WEBFLOW / OPENCODE / UNKNOWN) plus a classified intent (IMPLEMENTATION / DEBUGGING / VERIFICATION / etc.) to the exact references, assets, and verification commands needed for the active task. Loads only the smallest relevant set so the active context window stays focused.

### When to Use

- After surface detection (see [`stack_detection.md`](./stack_detection.md)) determines WEBFLOW / OPENCODE / UNKNOWN
- When classifying task wording into the dominant work intent
- When mapping intent to concrete reference paths
- When picking verification commands for the surface

### Core Principle

Routing is a two-stage decision: **surface-first, intent-second**. Surface narrows the resource family (Webflow vs OpenCode vs UNKNOWN); intent narrows the specific files within that family. Motion.dev resources are a **peer category** loaded after either surface, not a third surface.

### Key Sources

- [`stack_detection.md`](./stack_detection.md) — surface detection (WEBFLOW/OPENCODE/UNKNOWN) and OpenCode language sub-detection
- [`phase_detection.md`](./phase_detection.md) — Phase 1/2/3 lifecycle and phase-specific resource expectations
- `SKILL.md` §2 SMART ROUTING — operator-facing summary of this routing contract

---

## 2. INTENT MODEL

Intent classification scores task text against weighted keyword signals to pick the dominant work type after surface detection.

| Intent | Strong Signals |
| --- | --- |
| IMPLEMENTATION | `implement`, `build`, `create`, `feature`, `component`, `script`, `module` |
| CODE_QUALITY | `lint`, `format`, `quality gate`, `p0`, `p1`, `style`, `naming`, `standards` |
| DEBUGGING | `debug`, `fix`, `bug`, `error`, `broken`, `failing`, `stack trace`, `console error` |
| VERIFICATION | `verify`, `done`, `complete`, `works`, `fixed`, `passing`, `build`, `type-check` |
| TESTING | `test`, `unit`, `integration`, `coverage`, `vitest`, `pytest`, `shellcheck` |
| DEPLOYMENT | `deploy`, `cdn`, `wrangler`, `release`, `metadata`, `skill graph` |
| PERFORMANCE | `lighthouse`, `lcp`, `tbt`, `inp`, `cls`, `pagespeed`, `performance` |
| ANIMATION | `animation`, `motion`, `transition`, `gsap`, `lenis`, `swiper` |
| MOTION_DEV | `motion.dev`, `motion-dev`, `motion_dev`, `Motion API`, `animate()`, `inView`, `scroll()`, `stagger`, `cross-stack animation` |
| FORMS | `form`, `validation`, `filepond`, `schema`, `zod` |
| VIDEO | `hls`, `video`, `stream`, `player` |
| HOOKS | `hook`, `session-prime`, `user-prompt-submit`, `pre-tool-use`, `post-tool-use` |
| CONFIG | `json`, `jsonc`, `schema`, `descriptor`, `config` |
| LANGUAGE_STANDARDS | `typescript`, `python`, `shell`, `commonjs`, `strict`, `docstring` |

### Scoring algorithm

1. Sum weighted keyword hits from the request, target files, and known task context.
2. Boost explicit phase signals (verification, debugging, testing, code quality) by +5 when the phase is unambiguous.
3. Select the top intent.
4. Select a second intent when the score delta to the next intent is small (`AMBIGUITY_DELTA = 1`).
5. For OPENCODE surface, run language sub-detection after intent selection.

### Doc-only edit anti-signals

Doc-only prose changes subtract from `sk-code` intent scoring and add to `sk-doc` scoring, even when the target file is under `.opencode/skills/`.

| Prompt signal | Effect |
| --- | --- |
| `update headline`, `rewrite headline`, `headline section` | `sk-code -2`, `sk-doc +3` |
| `clarify description`, `clarify the X model`, `documentation section` | `sk-code -2`, `sk-doc +3` |
| `add a one-line summary`, `add summary at the top` | `sk-code -2`, `sk-doc +3` |
| `improve readme`, `reorganize readme`, `rewrite section` | `sk-code -2`, `sk-doc +3` |
| `SKILL.md` or `README.md` plus prose-only verbs | `sk-code -2`, `sk-doc +3` |

Do not apply this anti-signal when the same request asks to modify executable code, parser logic, tests, shell behavior, TypeScript/Python entrypoints, JSON schema behavior, or routing algorithms. In that case, keep OPENCODE surface detection and load `sk-code`.

Multi-symptom prompts like `fix Webflow animation flicker` should load both DEBUGGING and ANIMATION. Prompts like `update TypeScript advisor fixture` should load OPENCODE plus LANGUAGE_STANDARDS and CODE_QUALITY.

Motion.dev API or decision prompts should load MOTION_DEV as a resource intent. If the target files are Webflow files, keep the surface as WEBFLOW and add `references/motion_dev/` for cross-stack API/decision context; if the target is `.opencode/`, keep the surface as OPENCODE and load Motion only as reference material.

### Surface-specific intent notes

- **WEBFLOW** intent scoring favors browser/runtime terms, animation, forms, video, performance, deployment, and verification.
- **MOTION_DEV** intent scoring favors Motion API, timeline, scroll/gesture, performance, import-mode, snippet, and decision_matrix terms; it supplements the detected surface rather than replacing it.
- **OPENCODE** intent scoring favors language standards, hooks, config, scripts, advisor/tests, metadata, and alignment verification.
- Unsupported surfaces stay UNKNOWN even if intent scoring is strong.

---

## 3. LOAD TIERS

| Tier | When | Resources |
| --- | --- | --- |
| ALWAYS | Every invocation | Universal code quality + error recovery from `references/universal/` |
| SURFACE | After WEBFLOW/OPENCODE detection | Surface-specific shared resources (`webflow/shared/*` or `opencode/shared/*`) |
| INTENT | After intent classification | Implementation, debugging, verification, performance, etc. matching the top-1 intent (and top-2 when ambiguous) |
| LANGUAGE | OPENCODE only | JavaScript, TypeScript, Python, Shell, Config standards from the matching `opencode/<lang>/*` folder |
| ON_DEMAND | Explicit deep-dive keywords | Extended checklists and niche references (e.g. `webflow/css/patterns.md` for advanced CSS patterns) |

---

## 4. WEBFLOW MAP

WEBFLOW loads from `references/webflow/` and `assets/webflow/`. The per-language sub-tree (`webflow/{javascript,css,html,shared}/`) and topical workflow dirs (`webflow/{implementation,debugging,verification,performance,deployment}/`) coexist; the router selects across both.

| Intent | Resources |
| --- | --- |
| IMPLEMENTATION | MUST load the implementation trio: `references/webflow/implementation/animation_workflows.md`, `references/webflow/implementation/implementation_workflows.md`, `references/webflow/implementation/performance_patterns.md`; then add per-language style guides (`webflow/javascript/style_guide.md`, `webflow/css/style_guide.md`) and focused guides such as forms/vendor refs as needed |
| CODE_QUALITY | `assets/webflow/checklists/code_quality_checklist.md`, `webflow/javascript/quality_standards.md`, `webflow/css/quality_standards.md`, `webflow/shared/enforcement.md` |
| DEBUGGING | `references/webflow/debugging/*`, `webflow/shared/dev_workflow.md`, universal debugging checklist |
| VERIFICATION | `references/webflow/verification/verification_workflows.md`, `webflow/shared/enforcement.md`, verification checklist |
| PERFORMANCE | `references/webflow/performance/cwv_remediation.md`, `references/webflow/performance/resource_loading.md`, `references/webflow/performance/interaction_gated_loading.md`, `webflow/css/quality_standards.md` (will-change, GPU props), `webflow/javascript/quality_standards.md` (RAF, debounce) |
| DEPLOYMENT | `references/webflow/deployment/cdn_deployment.md`, `references/webflow/deployment/minification_guide.md`, `references/webflow/deployment/webflow_staging_production.md` |

### Implementation trio contract

Any WEBFLOW surface detection MUST load the implementation trio before intent-specific expansion:

- `references/webflow/implementation/animation_workflows.md`
- `references/webflow/implementation/implementation_workflows.md`
- `references/webflow/implementation/performance_patterns.md`

This is a contract, not a guideline. It prevents SD-001-style partial coverage where the surface is correct but implementation guidance falls below the expected threshold.

### Per-language overlay

After WEBFLOW + intent selection, also load the language overlay matching the changed/target file extensions:

| Target language | Overlay resources |
| --- | --- |
| JavaScript (`.js`) | `webflow/javascript/{style_guide,quality_standards,quick_reference}.md`, `webflow/shared/cross_language_rules.md` |
| CSS (`.css`) | `webflow/css/{style_guide,quality_standards,quick_reference,patterns}.md`, `webflow/shared/cross_language_rules.md` |
| HTML (`.html`) | `webflow/html/{style_guide,quality_standards}.md`, `webflow/shared/cross_language_rules.md` |
| Mixed (CSS + JS in same task) | Both per-language sets above |

---

## 5. MOTION_DEV MAP

MOTION_DEV loads from `references/motion_dev/` and `assets/motion_dev/` as a peer resource category. It is not a separate code surface; it supplements WEBFLOW, OPENCODE, or future surfaces when the request needs Motion API, integration, or decision guidance.

| Intent | Resources |
| --- | --- |
| ANIMATION / MOTION_DEV | `references/motion_dev/quick_start.md`, `references/motion_dev/animate_and_timelines.md`, `references/motion_dev/scroll_and_gestures.md` |
| PERFORMANCE | `references/motion_dev/performance_and_pitfalls.md` |
| IMPLEMENTATION / API | `references/motion_dev/integration_patterns.md`, exact snippet assets such as `assets/motion_dev/snippets/animate_on_scroll.js` and `assets/motion_dev/snippets/in_view_reveal.js` |
| CODE_QUALITY / DECISION | `references/motion_dev/decision_matrix.md`, `assets/motion_dev/install_card.md` |
| TESTING / PLAYBOOK | `assets/motion_dev/playbook_entries.md` plus manual testing playbook Motion scenarios |

When WEBFLOW and MOTION_DEV both match, load Webflow guidance for CDN, `window.Motion`, Designer, and browser verification constraints, then load `motion_dev/` for cross-stack Motion details.

When explicit non-Webflow language and MOTION_DEV both match, do not load `references/webflow/*` or `assets/webflow/*`. Load Motion.dev peer resources by exact path while keeping the surface UNKNOWN or N/A:

- `references/motion_dev/quick_start.md`
- `references/motion_dev/integration_patterns.md`
- `references/motion_dev/decision_matrix.md`
- `references/motion_dev/performance_and_pitfalls.md`
- `references/motion_dev/animate_and_timelines.md`
- `references/motion_dev/scroll_and_gestures.md`
- exact snippet assets under `assets/motion_dev/snippets/` when the prompt asks for examples

Do not emit directory placeholders such as `references/motion_dev/`, `assets/motion_dev/snippets/`, or `references/webflow/` in playbook result YAML. Name the exact canonical files.

### Performance and decision contracts

PERFORMANCE intent with Motion.dev or Webflow animation MUST name these canonical files when relevant:

- `references/motion_dev/performance_and_pitfalls.md`
- `references/webflow/performance/cwv_remediation.md`
- `references/webflow/performance/resource_loading.md`

DECISION intent MUST name:

- `references/motion_dev/decision_matrix.md`
- `references/webflow/implementation/animation_workflows.md` when comparing Motion.dev against Webflow-owned animation patterns
- `references/webflow/implementation/performance_patterns.md` when the decision depends on performance constraints

---

## 6. OPENCODE MAP

OPENCODE loads from `references/opencode/` and `assets/opencode/`.

### Always-load (every OPENCODE invocation)

- `references/opencode/shared/universal_patterns.md`
- `references/opencode/shared/code_organization.md`

### Intent overlay

| Intent | Resources |
| --- | --- |
| CODE_QUALITY | `assets/opencode/checklists/universal_checklist.md` plus the language-matching checklist |
| VERIFICATION | `references/opencode/shared/alignment_verification_automation.md`, `assets/scripts/verify_alignment_drift.py` |
| HOOKS | `references/opencode/shared/hooks.md` |
| CONFIG | `references/opencode/config/*` |
| LANGUAGE_STANDARDS | Detected language folder's `quick_reference.md`, `style_guide.md`, `quality_standards.md` |

### Language overlay

| Language | Resources |
| --- | --- |
| JAVASCRIPT | `references/opencode/javascript/{style_guide,quality_standards,quick_reference}.md`, `assets/opencode/checklists/javascript_checklist.md` |
| TYPESCRIPT | `references/opencode/typescript/{style_guide,quality_standards,quick_reference}.md`, `assets/opencode/checklists/typescript_checklist.md` |
| PYTHON | `references/opencode/python/{style_guide,quality_standards,quick_reference}.md`, `assets/opencode/checklists/python_checklist.md` |
| SHELL | `references/opencode/shell/{style_guide,quality_standards,quick_reference}.md`, `assets/opencode/checklists/shell_checklist.md` |
| CONFIG | `references/opencode/config/{style_guide,quality_standards,quick_reference}.md`, `assets/opencode/checklists/config_checklist.md` |

### Authoring checklist gating

When OPENCODE intent is `authoring-new-X`, additionally load the matching authoring checklist:

| Authoring target | Checklist |
| --- | --- |
| New skill | `assets/opencode/checklists/skill_authoring.md` |
| New agent | `assets/opencode/checklists/agent_authoring.md` |
| New command | `assets/opencode/checklists/command_authoring.md` |
| New MCP server | `assets/opencode/checklists/mcp_server_authoring.md` |
| Spec folder write | `assets/opencode/checklists/spec_folder_authoring.md` + `assets/opencode/recipes/spec_folder_write.md` |

---

## 7. VERIFICATION COMMANDS

| Surface | Required verification evidence |
| --- | --- |
| WEBFLOW | `node .opencode/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs`; `node .opencode/skills/sk-code/assets/webflow/scripts/verify-minification.mjs`; `node .opencode/skills/sk-code/assets/webflow/scripts/test-minified-runtime.mjs`; plus desktop/mobile browser console clean evidence when runtime behavior changes |
| OPENCODE | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root <changed-scope>`; plus targeted language/project tests such as vitest, pytest, shellcheck, JSON validation, or spec validation for changed spec folders |
| UNKNOWN | User-selected verification command set before completion claim |

---

## 8. UNKNOWN FALLBACK

If no supported surface matches, ask:

1. Is this Webflow/frontend code or `.opencode/` system code?
2. Which files or directories are changing?
3. Which verification command proves the claim?
4. Should a new `sk-code` route be planned before implementation?

Do not load Go/NextJS/React Native resources from canonical sk-code; those surfaces live in the Barter sk-code fork (`barter/.opencode/skills/sk-code/references/`). Canonical sk-code only owns WEBFLOW + OPENCODE + MOTION_DEV.

### UNKNOWN fallback checklist

Returned when intent confidence is low (`max(intent_scores) < 0.5`) OR when the user explicitly asks for stack-agnostic guidance:

- Confirm the active runtime surface (WEBFLOW or OPENCODE)
- Confirm the task intent (implementation / debugging / verification / etc.)
- Provide one concrete input, error, or expected output
- Confirm the verification command set before completion

---

## 9. LOADING DISCIPLINE (DO / DON'T)

### DO

- Load only references needed for current intent + surface
- Honor the WEBFLOW implementation trio contract on every WEBFLOW invocation
- Use exact canonical file paths in playbook result YAML (never directory placeholders)
- Load Motion.dev peer resources after the surface decision, not as a substitute
- Cite surface + top-1 intent + loaded resource paths + verification command in your final answer

### DON'T

- Load all of `webflow/` or all of `opencode/` indiscriminately ("just in case")
- Treat MOTION_DEV as a surface (it's a peer resource category)
- Load Go/NextJS/React Native resources (those live in the Barter fork)
- Skip the implementation trio for WEBFLOW
- Drop directory placeholders in playbook result YAML

---

## 10. RELATED RESOURCES

- [`./stack_detection.md`](./stack_detection.md) — surface detection (WEBFLOW/OPENCODE/UNKNOWN) + OPENCODE language sub-detection
- [`./phase_detection.md`](./phase_detection.md) — Phase 1/2/3 lifecycle and per-phase resource loading
- `SKILL.md` §2 SMART ROUTING — operator-facing summary of this routing contract
- Barter equivalent: `barter/.opencode/skills/sk-code/references/smart_routing.md` (different routing key — git-remote project — but same structural pattern)
