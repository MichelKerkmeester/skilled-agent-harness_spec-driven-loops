---
title: Smart Router - Routing Logic and Resource Maps
description: Authoritative routing logic for sk-code's surface-based routing — intent classification, surface-to-resource maps for WEBFLOW + OPENCODE + MOTION_DEV, load tiers, verification commands, and UNKNOWN fallback.
trigger_phrases:
  - "sk-code smart routing"
  - "surface resource maps"
  - "intent classification routing"
  - "load tier resource loading"
  - "unknown surface fallback"
importance_tier: important
contextType: general
version: 3.5.0.8
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
| IMPLEMENTATION | `implement`, `build`, `create`, `feature`, `component`, `script`, `module`, `smooth-scroll`, `IntersectionObserver` |
| CODE_QUALITY | `lint`, `format`, `quality gate`, `p0`, `p1`, `style`, `naming`, `standards` |
| DEBUGGING | `debug`, `fix`, `bug`, `error`, `broken`, `failing`, `stack trace`, `console error` |
| VERIFICATION | `verify`, `done`, `complete`, `works`, `fixed`, `passing`, `build`, `type-check` |
| TESTING | `test`, `unit`, `integration`, `coverage`, `vitest`, `pytest`, `shellcheck` |
| DEPLOYMENT | `deploy`, `cdn`, `wrangler`, `release`, `metadata`, `skill graph` |
| PERFORMANCE | `lighthouse`, `lcp`, `tbt`, `inp`, `cls`, `pagespeed`, `performance` |
| ANIMATION | `animation`, `motion`, `transition`, `easing`, `stagger`, `motion principles`, `motion language`, `gsap`, `lenis`, `swiper` |
| MOTION_DEV | `motion.dev`, `motion-dev`, `motion_dev`, `Motion API`, `Motion CDN`, `animate()`, `inView`, `in-view`, `scroll()`, `stagger`, `stagger()`, `animation principles`, `snippet`, `cross-stack animation` |
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

Motion.dev API or decision prompts should load MOTION_DEV as a resource intent. If the target files are Webflow files, keep the surface as WEBFLOW and add `code-webflow/references/animation/` for cross-stack API/decision context; if the target is `.opencode/`, keep the surface as OPENCODE and load Motion only as reference material.

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
| SURFACE | After WEBFLOW/OPENCODE detection | Surface-specific shared resources (`code-webflow/references/shared/*` or `code-opencode/references/shared/*`) |
| INTENT | After intent classification | Implementation, debugging, verification, performance, etc. matching the top-1 intent (and top-2 when ambiguous) |
| LANGUAGE | OPENCODE only | JavaScript, TypeScript, Python, Shell, Config standards from the matching `code-opencode/<lang>/*` folder |
| ON_DEMAND | Explicit deep-dive keywords | Extended checklists and niche references (e.g. `code-webflow/references/css/patterns.md` for advanced CSS patterns) |

---

## 4. WEBFLOW MAP

WEBFLOW loads from `code-webflow/references/` and `code-webflow/assets/`. The per-language sub-tree (`code-webflow/{javascript,css,html,shared}/`) and topical workflow dirs (`code-webflow/{implementation,debugging,verification,performance,deployment}/`) coexist; the router selects across both.

| Intent | Resources |
| --- | --- |
| IMPLEMENTATION | MUST load the implementation trio: `code-webflow/references/implementation/animation_workflows.md`, `code-webflow/references/implementation/implementation_workflows.md`, `code-webflow/references/implementation/performance_patterns.md`; then add per-language style guides (`code-webflow/references/javascript/style_guide.md`, `code-webflow/references/css/style_guide.md`) and focused guides such as forms/vendor refs as needed |
| CODE_QUALITY | `code-review/assets/code_quality_checklist.md`, `code-webflow/references/javascript/quality_standards.md`, `code-webflow/references/css/quality_standards.md`, `code-webflow/references/shared/enforcement.md` |
| DEBUGGING | `code-webflow/references/debugging/*`, `code-webflow/references/shared/dev_workflow.md`, universal debugging checklist |
| VERIFICATION | `code-webflow/references/verification/verification_workflows.md`, `code-webflow/references/shared/enforcement.md`, verification checklist |
| PERFORMANCE | `code-webflow/references/performance/cwv_remediation.md`, `code-webflow/references/performance/resource_loading.md`, `code-webflow/references/performance/interaction_gated_loading.md`, `code-webflow/references/css/quality_standards.md` (will-change, GPU props), `code-webflow/references/javascript/quality_standards.md` (RAF, debounce) |
| DEPLOYMENT | `code-webflow/references/deployment/cdn_deployment.md`, `code-webflow/references/deployment/minification_guide.md`, `code-webflow/references/deployment/webflow_staging_production.md` |

### Implementation trio contract

Any WEBFLOW surface detection MUST load the implementation trio before intent-specific expansion:

- `code-webflow/references/implementation/animation_workflows.md`
- `code-webflow/references/implementation/implementation_workflows.md`
- `code-webflow/references/implementation/performance_patterns.md`

This is a contract, not a guideline. It prevents SD-001-style partial coverage where the surface is correct but implementation guidance falls below the expected threshold.

### Per-language overlay

After WEBFLOW + intent selection, also load the language overlay matching the changed/target file extensions:

| Target language | Overlay resources |
| --- | --- |
| JavaScript (`.js`) | `code-webflow/references/javascript/{style_guide,quality_standards,quick_reference}.md`, `code-webflow/references/shared/cross_language_rules.md` |
| CSS (`.css`) | `code-webflow/references/css/{style_guide,quality_standards,quick_reference,patterns}.md`, `code-webflow/references/shared/cross_language_rules.md` |
| HTML (`.html`) | `code-webflow/html/{style_guide,quality_standards}.md`, `code-webflow/references/shared/cross_language_rules.md` |
| Mixed (CSS + JS in same task) | Both per-language sets above |

---

## 5. MOTION_DEV MAP

MOTION_DEV loads from `code-webflow/references/animation/` and `code-webflow/assets/animation/` as a peer resource category. It is not a separate code surface; it supplements WEBFLOW, OPENCODE, or future surfaces when the request needs Motion API, integration, or decision guidance.

| Intent | Resources |
| --- | --- |
| ANIMATION / MOTION_DEV | `code-webflow/references/animation/quick_start.md`, `code-webflow/references/animation/animation_principles.md`, `code-webflow/references/animation/animate_and_timelines.md`, `code-webflow/references/animation/scroll_and_gestures.md`, `code-webflow/assets/animation/snippets/principled_reveal.js` |
| PERFORMANCE | `code-webflow/references/animation/performance_and_pitfalls.md` including frame-level visual verification for subtle timing/easing defects |
| IMPLEMENTATION / API | `code-webflow/references/animation/integration_patterns.md`, exact snippet assets such as `code-webflow/assets/animation/snippets/animate_on_scroll.js` and `code-webflow/assets/animation/snippets/in_view_reveal.js` |
| CODE_QUALITY / DECISION | `code-webflow/references/animation/decision_matrix.md`, `code-webflow/assets/animation/install_card.md` |
| TESTING / PLAYBOOK | `code-webflow/assets/animation/playbook_entries.md` plus manual testing playbook Motion scenarios |

When WEBFLOW and MOTION_DEV both match, load Webflow guidance for CDN, `window.Motion`, Designer, and browser verification constraints, then load the animation overlay (`code-webflow/references/animation/`) for cross-stack Motion details.

When explicit non-Webflow language and MOTION_DEV both match, do not load `code-webflow/references/*` or `code-webflow/assets/*`. Load Motion.dev peer resources by exact path while keeping the surface UNKNOWN or N/A:

- `code-webflow/references/animation/quick_start.md`
- `code-webflow/references/animation/animation_principles.md`
- `code-webflow/references/animation/integration_patterns.md`
- `code-webflow/references/animation/decision_matrix.md`
- `code-webflow/references/animation/performance_and_pitfalls.md`
- `code-webflow/references/animation/animate_and_timelines.md`
- `code-webflow/references/animation/scroll_and_gestures.md`
- exact snippet assets under `code-webflow/assets/animation/snippets/` when the prompt asks for examples

Do not emit directory placeholders such as `code-webflow/references/animation/`, `code-webflow/assets/animation/snippets/`, or `code-webflow/references/` in playbook result YAML. Name the exact canonical files.

### Performance and decision contracts

PERFORMANCE intent with Motion.dev or Webflow animation MUST name these canonical files when relevant:

- `code-webflow/references/animation/performance_and_pitfalls.md`
- `code-webflow/references/performance/cwv_remediation.md`
- `code-webflow/references/performance/resource_loading.md`

DECISION intent MUST name:

- `code-webflow/references/animation/decision_matrix.md`
- `code-webflow/references/implementation/animation_workflows.md` when comparing Motion.dev against Webflow-owned animation patterns
- `code-webflow/references/implementation/performance_patterns.md` when the decision depends on performance constraints

---

## 6. OPENCODE MAP

OPENCODE loads from `code-opencode/references/` and `assets/code-opencode/`.

### Always-load (every OPENCODE invocation)

- `code-opencode/references/shared/universal_patterns.md`
- `code-opencode/references/shared/code_organization.md`

### Intent overlay

| Intent | Resources |
| --- | --- |
| CODE_QUALITY | `code-opencode/assets/checklists/universal_checklist.md` plus the language-matching checklist |
| VERIFICATION | `code-opencode/references/shared/alignment_verification_automation.md`, `code-opencode/assets/scripts/verify_alignment_drift.py` |
| HOOKS | `code-opencode/references/shared/hooks.md` |
| CONFIG | `code-opencode/references/config/*` |
| LANGUAGE_STANDARDS | Detected language folder's `quick_reference.md`, `style_guide.md`, `quality_standards.md` |

### Language overlay

| Language | Resources |
| --- | --- |
| JAVASCRIPT | `code-opencode/references/javascript/{style_guide,quality_standards,quick_reference}.md`, `code-opencode/assets/checklists/javascript_checklist.md` |
| TYPESCRIPT | `code-opencode/references/typescript/{style_guide,quality_standards,quick_reference}.md`, `code-opencode/assets/checklists/typescript_checklist.md` |
| PYTHON | `code-opencode/references/python/{style_guide,quality_standards,quick_reference}.md`, `code-opencode/assets/checklists/python_checklist.md` |
| SHELL | `code-opencode/references/shell/{style_guide,quality_standards,quick_reference}.md`, `code-opencode/assets/checklists/shell_checklist.md` |
| RUST | `code-opencode/references/rust/{style_guide,quality_standards,quick_reference}/` (each split into topic parts), `code-opencode/assets/checklists/rust_checklist/` |
| CONFIG | `code-opencode/references/config/{style_guide,quality_standards,quick_reference}.md`, `code-opencode/assets/checklists/config_checklist.md` |

### Authoring checklist gating

When OPENCODE intent is `authoring-new-X`, additionally load the matching authoring checklist:

| Authoring target | Checklist |
| --- | --- |
| New skill | `code-opencode/assets/checklists/skill_authoring.md` |
| New agent | `code-opencode/assets/checklists/agent_authoring.md` |
| New command | `code-opencode/assets/checklists/command_authoring.md` |
| New MCP server | `code-opencode/assets/checklists/mcp_server_authoring.md` |
| Spec folder write | Now in system-spec-kit: `system-spec-kit/references/workflows/spec_folder_authoring_checklist.md` + `system-spec-kit/references/workflows/spec_folder_write_recipe.md` |

---

## 7. VERIFICATION COMMANDS

| Surface | Required verification evidence |
| --- | --- |
| WEBFLOW | `node .opencode/skills/sk-code/code-webflow/assets/scripts/minify-webflow.mjs`; `node .opencode/skills/sk-code/code-webflow/assets/scripts/verify-minification.mjs`; `node .opencode/skills/sk-code/code-webflow/assets/scripts/test-minified-runtime.mjs`; plus desktop/mobile browser console clean evidence when runtime behavior changes |
| OPENCODE | `python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root <changed-scope>`; plus targeted language/project tests such as vitest, pytest, shellcheck, JSON validation, or spec validation for changed spec folders |
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

- Load all of `code-webflow/` or all of `code-opencode/` indiscriminately ("just in case")
- Treat MOTION_DEV as a surface (it's a peer resource category)
- Load Go/NextJS/React Native resources (those live in the Barter fork)
- Skip the implementation trio for WEBFLOW
- Drop directory placeholders in playbook result YAML

---

## 10. RELATED RESOURCES

- [`./stack_detection.md`](./stack_detection.md) — surface detection (WEBFLOW/OPENCODE/UNKNOWN) + OPENCODE language sub-detection
- [`./phase_detection.md`](./phase_detection.md) — Phase 1/2/3 lifecycle and per-phase resource loading
- `SKILL.md` §2 SMART ROUTING — operator-facing summary of this routing contract
- Barter equivalent: `barter/.opencode/skills/sk-code/shared/references/smart_routing.md` (different routing key — git-remote project — but same structural pattern)

---

## 11. MACHINE-READABLE ROUTER (replay / benchmark source)

This is the single machine-readable projection of the prose Intent Model (§2) and the per-surface maps (§4 Webflow, §5 Motion.dev, §6 OpenCode). The prose sections above are the human-facing contract; this block is the byte-for-byte source a deterministic router-replay parses. Keep the two in sync: when a map row changes above, update the matching `RESOURCE_MAP` entry here.

A drift guard (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts`) keeps this block honest: it fails if any path here is missing on disk, if any routable `references/`/`assets/` doc stops being covered, or if an explicit full path named in the prose maps is absent here. Run it standalone with `npx vitest run skill-benchmark/tests/sk-code-router-sync.vitest.ts` from `.opencode/skills/system-deep-loop/deep-improvement/scripts`.

This projection is intentionally lossy in two documented ways the flat dictionary cannot express, both enforced by the prose contract and the surface-detection pseudocode in `SKILL.md` §2:

- **No phase boosts.** The `+5` unambiguous-phase boost from the §2 scoring algorithm is not represented; every keyword carries unit weight here.
- **No doc-only anti-signals.** The `sk-code -2 / sk-doc +3` anti-signals (§2) that route prose-only edits away from this skill are a pre-filter the flat model does not carry.

```python
# Always-loaded routing preamble: every code task detects stack, detects phase,
# consults the router, and applies the universal quality baseline before any
# surface-specific resource. These are loaded on every route.
DEFAULT_RESOURCE = [
    "references/stack_detection.md",
    "references/phase_detection.md",
    "references/smart_routing.md",
    "references/universal/code_quality_standards.md",
]

INTENT_SIGNALS = {
    "IMPLEMENTATION":     {"weight": 1, "keywords": ["implement", "build", "create", "feature", "component", "module", "authoring", "smooth-scroll", "intersectionobserver"]},
    "CODE_QUALITY":       {"weight": 1, "keywords": ["lint", "format", "quality gate", "naming", "standards", "code smell"]},
    "DEBUGGING":          {"weight": 1, "keywords": ["debug", "broken", "failing", "stack trace", "console error", "regression"]},
    "VERIFICATION":       {"weight": 1, "keywords": ["verify", "passing", "type-check", "alignment drift", "completion claim"]},
    "TESTING":            {"weight": 1, "keywords": ["unit test", "integration test", "coverage", "vitest", "pytest", "shellcheck"]},
    "DEPLOYMENT":         {"weight": 1, "keywords": ["deploy", "cdn", "wrangler", "minify", "staging", "production release"]},
    "PERFORMANCE":        {"weight": 1, "keywords": ["lighthouse", "core web vitals", "web vitals", "largest contentful", "lcp", "interaction to next paint", "inp", "cumulative layout shift", "cls", "pagespeed", "jank", "frame budget"]},
    "ANIMATION":          {"weight": 1, "keywords": ["animation", "transition", "easing", "stagger", "motion principles", "motion language", "gsap", "lenis", "carousel", "parallax"]},
    "MOTION_DEV":         {"weight": 1, "keywords": ["motion.dev", "motion-dev", "animate()", "inview", "in-view", "motion cdn", "scroll()", "stagger()", "animation principles", "cross-stack animation"]},
    "ACCESSIBILITY":      {"weight": 1, "keywords": ["reduced motion", "reduced-motion", "prefers-reduced-motion", "a11y", "accessibility"]},
    "FORMS":              {"weight": 1, "keywords": ["form upload", "filepond", "field validation", "focus trap"]},
    "VIDEO":              {"weight": 1, "keywords": ["hls", "adaptive stream", "video player"]},
    "HOOKS":              {"weight": 1, "keywords": ["session-prime", "user-prompt-submit", "pre-tool-use", "post-tool-use"]},
    "CONFIG":             {"weight": 1, "keywords": ["jsonc", ".json", ".jsonc", "descriptor", "config schema"]},
    "LANGUAGE_STANDARDS": {"weight": 1, "keywords": ["typescript", ".ts", ".tsx", "python", ".py", "shell script", "bash", ".sh", "commonjs", ".cjs", ".mjs", "docstring"]},
    "JAVASCRIPT":         {"weight": 1, "keywords": ["javascript", ".js", "commonjs", ".cjs", ".mjs"]},
    "TYPESCRIPT":         {"weight": 1, "keywords": ["typescript", ".ts", ".tsx"]},
    "PYTHON":             {"weight": 1, "keywords": ["python", ".py", "docstring"]},
    "SHELL":              {"weight": 1, "keywords": ["shell script", "bash", ".sh"]},
    "RUST":               {"weight": 1, "keywords": ["rust", ".rs", "cargo.toml", "cargo.lock", "napi-rs", "napi_rs", "#[napi]", "wasm-bindgen", "wasm_bindgen", "#[wasm_bindgen]", "wasi", "cdylib"]},
}

RESOURCE_MAP = {
    "IMPLEMENTATION": [
        "references/universal/multi_agent_research.md",
        "code-webflow/references/implementation/implementation_workflows.md",
        "code-webflow/references/implementation/async_patterns.md",
        "code-webflow/references/implementation/observer_patterns.md",
        "code-webflow/references/implementation/security_patterns.md",
        "code-webflow/references/implementation/third_party_integrations.md",
        "code-webflow/references/implementation/webflow_patterns.md",
        "code-webflow/references/shared/dev_workflow.md",
        "code-opencode/references/shared/universal_patterns.md",
        "code-opencode/references/shared/code_organization.md",
        "code-opencode/assets/checklists/agent_authoring.md",
        "code-opencode/assets/checklists/command_authoring.md",
        "code-opencode/assets/checklists/skill_authoring.md",
        "code-opencode/assets/checklists/mcp_server_authoring.md",
        "shared/assets/patterns/README.md",
        "code-webflow/assets/integrations/README.md",
        "code-webflow/assets/patterns/README.md",
        "code-webflow/assets/templates/README.md"
    ],
    "CODE_QUALITY": [
        "references/universal/code_quality_standards.md",
        "references/universal/code_style_guide.md",
        "code-webflow/references/shared/cross_language_rules.md",
        "code-webflow/references/shared/enforcement.md",
        "code-opencode/assets/checklists/universal_checklist.md",
        "code-opencode/assets/checklists/javascript_checklist.md",
        "code-opencode/assets/checklists/typescript_checklist.md",
        "code-opencode/assets/checklists/python_checklist.md",
        "code-opencode/assets/checklists/shell_checklist.md",
        "code-opencode/assets/checklists/rust_checklist/overview-and-p0-parity.md",
        "code-opencode/assets/checklists/rust_checklist/p0-safety-and-boundary-discipline.md",
        "code-opencode/assets/checklists/rust_checklist/p1-required.md",
        "code-opencode/assets/checklists/rust_checklist/p2-evidence-validation-and-resources.md",
        "code-review/assets/code_quality_checklist.md"
    ],
    "DEBUGGING": [
        "references/universal/error_recovery.md",
        "code-webflow/references/debugging/debugging_workflows.md",
        "code-webflow/references/debugging/error_recovery.md",
        "references/universal-debugging_checklist.md",
        "code-webflow/assets/webflow-debugging_checklist.md"
    ],
    "VERIFICATION": [
        "code-webflow/references/verification/verification_workflows.md",
        "code-opencode/references/shared/alignment_verification_automation.md",
        "references/universal-verification_checklist.md",
        "code-webflow/assets/webflow-verification_checklist.md",
        "code-opencode/assets/scripts/README.md"
    ],
    "TESTING": [
        "code-webflow/assets/animation/playbook_entries.md"
    ],
    "DEPLOYMENT": [
        "code-webflow/references/deployment/cdn_deployment.md",
        "code-webflow/references/deployment/minification_guide.md",
        "code-webflow/references/deployment/webflow_staging_production.md",
        "code-webflow/assets/scripts/README.md"
    ],
    "PERFORMANCE": [
        "code-webflow/references/performance/cwv_remediation.md",
        "code-webflow/references/performance/interaction_gated_loading.md",
        "code-webflow/references/performance/resource_loading.md",
        "code-webflow/references/performance/third_party.md",
        "code-webflow/references/performance/webflow_constraints.md",
        "code-webflow/references/verification/performance_checklist.md",
        "code-webflow/references/implementation/performance_patterns.md",
        "code-webflow/references/animation/performance_and_pitfalls.md",
        "references/performance_loading_checklist.md"
    ],
    "ANIMATION": [
        "code-webflow/references/implementation/animation_workflows.md",
        "code-webflow/references/implementation/swiper_patterns.md"
    ],
    "MOTION_DEV": [
        "code-webflow/references/animation/quick_start.md",
        "code-webflow/references/animation/animation_principles.md",
        "code-webflow/references/animation/animate_and_timelines.md",
        "code-webflow/references/animation/scroll_and_gestures.md",
        "code-webflow/references/animation/integration_patterns.md",
        "code-webflow/references/animation/decision_matrix.md",
        "code-webflow/references/animation/performance_and_pitfalls.md",
        "code-webflow/assets/animation/install_card.md",
        "code-webflow/assets/animation/snippets/principled_reveal.js",
        "code-webflow/assets/animation/snippets/README.md"
    ],
    "ACCESSIBILITY": [
        "code-webflow/references/animation/performance_and_pitfalls.md",
        "code-webflow/references/implementation/animation_workflows.md",
        "code-webflow/references/verification/verification_workflows.md"
    ],
    "FORMS": [
        "code-webflow/references/implementation/form_upload_workflows.md",
        "code-webflow/references/implementation/focus_management.md"
    ],
    "VIDEO": [
        "code-webflow/references/implementation/third_party_integrations.md"
    ],
    "HOOKS": [
        "code-opencode/references/shared/hooks.md"
    ],
    "CONFIG": [
        "code-opencode/references/config/style_guide.md",
        "code-opencode/references/config/quality_standards.md",
        "code-opencode/references/config/quick_reference.md",
        "code-opencode/assets/checklists/config_checklist.md"
    ],
    "LANGUAGE_STANDARDS": [
        "code-webflow/references/css/style_guide.md",
        "code-webflow/references/css/quality_standards.md",
        "code-webflow/references/css/quick_reference.md",
        "code-webflow/references/css/patterns.md",
        "code-webflow/references/html/style_guide.md",
        "code-webflow/references/html/quality_standards.md",
        "code-webflow/references/javascript/style_guide.md",
        "code-webflow/references/javascript/quality_standards.md",
        "code-webflow/references/javascript/quick_reference.md"
    ],
    "JAVASCRIPT": [
        "code-opencode/references/javascript/style_guide.md",
        "code-opencode/references/javascript/quality_standards.md",
        "code-opencode/references/javascript/quick_reference.md"
    ],
    "TYPESCRIPT": [
        "code-opencode/references/typescript/style_guide.md",
        "code-opencode/references/typescript/quality_standards.md",
        "code-opencode/references/typescript/quick_reference.md"
    ],
    "PYTHON": [
        "code-opencode/references/python/style_guide.md",
        "code-opencode/references/python/quality_standards.md",
        "code-opencode/references/python/quick_reference.md"
    ],
    "SHELL": [
        "code-opencode/references/shell/style_guide.md",
        "code-opencode/references/shell/quality_standards.md",
        "code-opencode/references/shell/quick_reference.md"
    ],
    "RUST": [
        "code-opencode/references/rust/style_guide/overview-and-file-header.md",
        "code-opencode/references/rust/style_guide/toolchain-and-project-structure.md",
        "code-opencode/references/rust/style_guide/naming-conventions.md",
        "code-opencode/references/rust/style_guide/formatting-and-imports.md",
        "code-opencode/references/rust/style_guide/commenting-and-rustdoc.md",
        "code-opencode/references/rust/style_guide/interop-model.md",
        "code-opencode/references/rust/style_guide/interop-errors-and-parity.md",
        "code-opencode/references/rust/quality_standards/overview-and-data-ownership.md",
        "code-opencode/references/rust/quality_standards/modeling-collections-and-api.md",
        "code-opencode/references/rust/quality_standards/docs-errors-and-async.md",
        "code-opencode/references/rust/quality_standards/build-and-organization.md",
        "code-opencode/references/rust/quality_standards/determinism-and-parity.md",
        "code-opencode/references/rust/quick_reference/overview-and-boundary-template.md",
        "code-opencode/references/rust/quick_reference/naming-ordering-and-signatures.md",
        "code-opencode/references/rust/quick_reference/collections-imports-and-errors.md",
        "code-opencode/references/rust/quick_reference/rustdoc-and-cargo.md",
        "code-opencode/references/rust/quick_reference/determinism-parity-and-related.md"
    ],
}
```

### Surface-aware loading (route-time)

The router does NOT load the whole matched-intent union. After surface detection (§1, `stack_detection.md`), a route loads:

- the always-loaded `DEFAULT_RESOURCE` preamble (stack/phase detection, the router, the universal quality baseline), plus
- the surface-agnostic `references/universal/*` tier, plus
- only the **detected surface's** slice (`<surface>/references/*`) for the matched intents, plus
- the Motion.dev overlay (`code-webflow/references/animation/*`) when a `MOTION_DEV` intent fires.

It does not load the other surface's resources, and it defers `assets/*` (checklists, recipes, templates) to on-demand rather than the first slice. Within OpenCode it slices once more by the **detected language** (§1 sub-detection): a TypeScript task loads `code-opencode/references/typescript/*` plus the language-agnostic `code-opencode/references/shared/*`, not the Python, shell, config, or JavaScript folders. Webflow has no language sub-slice — a frontend task legitimately spans CSS, HTML, and JavaScript together. A task that genuinely spans both surfaces (mixed `.opencode/` and Webflow markers) keeps both surface slices; an `UNKNOWN` surface falls back to the preamble plus the universal tier and the Motion overlay only. This is what stops a routine single-surface task from pulling the full cross-surface set. The deterministic router-replay enforces the same rule, so the benchmark measures it.
