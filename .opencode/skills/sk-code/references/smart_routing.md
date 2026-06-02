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
| IMPLEMENTATION | `implement`, `build`, `create`, `feature`, `component`, `script`, `module`, `smooth-scroll`, `IntersectionObserver` |
| CODE_QUALITY | `lint`, `format`, `quality gate`, `p0`, `p1`, `style`, `naming`, `standards` |
| DEBUGGING | `debug`, `fix`, `bug`, `error`, `broken`, `failing`, `stack trace`, `console error` |
| VERIFICATION | `verify`, `done`, `complete`, `works`, `fixed`, `passing`, `build`, `type-check` |
| TESTING | `test`, `unit`, `integration`, `coverage`, `vitest`, `pytest`, `shellcheck` |
| DEPLOYMENT | `deploy`, `cdn`, `wrangler`, `release`, `metadata`, `skill graph` |
| PERFORMANCE | `lighthouse`, `lcp`, `tbt`, `inp`, `cls`, `pagespeed`, `performance` |
| ANIMATION | `animation`, `motion`, `transition`, `gsap`, `lenis`, `swiper` |
| MOTION_DEV | `motion.dev`, `motion-dev`, `motion_dev`, `Motion API`, `Motion CDN`, `animate()`, `inView`, `in-view`, `scroll()`, `stagger`, `snippet`, `cross-stack animation` |
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

---

## 11. MACHINE-READABLE ROUTER (replay / benchmark source)

This is the single machine-readable projection of the prose Intent Model (§2) and the per-surface maps (§4 Webflow, §5 Motion.dev, §6 OpenCode). The prose sections above are the human-facing contract; this block is the byte-for-byte source a deterministic router-replay parses. Keep the two in sync: when a map row changes above, update the matching `RESOURCE_MAP` entry here.

A drift guard (`.opencode/skills/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts`) keeps this block honest: it fails if any path here is missing on disk, if any routable `references/`/`assets/` doc stops being covered, or if an explicit full path named in the prose maps is absent here. Run it standalone with `npx vitest run skill-benchmark/tests/sk-code-router-sync.vitest.ts` from `.opencode/skills/deep-improvement/scripts`.

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
    "PERFORMANCE":        {"weight": 1, "keywords": ["lighthouse", "core web vitals", "largest contentful", "pagespeed", "jank", "frame budget"]},
    "ANIMATION":          {"weight": 1, "keywords": ["transition", "gsap", "lenis", "carousel", "parallax"]},
    "MOTION_DEV":         {"weight": 1, "keywords": ["motion.dev", "motion-dev", "animate()", "inview", "in-view", "motion cdn", "scroll()", "cross-stack animation"]},
    "FORMS":              {"weight": 1, "keywords": ["form upload", "filepond", "field validation", "focus trap"]},
    "VIDEO":              {"weight": 1, "keywords": ["hls", "adaptive stream", "video player"]},
    "HOOKS":              {"weight": 1, "keywords": ["session-prime", "user-prompt-submit", "pre-tool-use", "post-tool-use"]},
    "CONFIG":             {"weight": 1, "keywords": ["jsonc", ".json", ".jsonc", "descriptor", "config schema"]},
    "LANGUAGE_STANDARDS": {"weight": 1, "keywords": ["typescript", ".ts", ".tsx", "python", ".py", "shell script", "bash", ".sh", "commonjs", ".cjs", ".mjs", "docstring"]},
}

RESOURCE_MAP = {
    "IMPLEMENTATION": [
        "references/universal/multi_agent_research.md",
        "references/webflow/implementation/implementation_workflows.md",
        "references/webflow/implementation/async_patterns.md",
        "references/webflow/implementation/observer_patterns.md",
        "references/webflow/implementation/security_patterns.md",
        "references/webflow/implementation/third_party_integrations.md",
        "references/webflow/implementation/webflow_patterns.md",
        "references/webflow/shared/dev_workflow.md",
        "references/opencode/shared/universal_patterns.md",
        "references/opencode/shared/code_organization.md",
        "assets/opencode/checklists/agent_authoring.md",
        "assets/opencode/checklists/command_authoring.md",
        "assets/opencode/checklists/skill_authoring.md",
        "assets/opencode/checklists/mcp_server_authoring.md",
        "assets/opencode/checklists/spec_folder_authoring.md",
        "assets/opencode/recipes/spec_folder_write.md",
        "assets/universal/patterns/README.md",
        "assets/webflow/integrations/README.md",
        "assets/webflow/patterns/README.md",
        "assets/webflow/templates/README.md"
    ],
    "CODE_QUALITY": [
        "references/universal/code_quality_standards.md",
        "references/universal/code_style_guide.md",
        "references/webflow/shared/cross_language_rules.md",
        "references/webflow/shared/enforcement.md",
        "assets/opencode/checklists/universal_checklist.md",
        "assets/opencode/checklists/javascript_checklist.md",
        "assets/opencode/checklists/typescript_checklist.md",
        "assets/opencode/checklists/python_checklist.md",
        "assets/opencode/checklists/shell_checklist.md",
        "assets/webflow/checklists/code_quality_checklist.md"
    ],
    "DEBUGGING": [
        "references/universal/error_recovery.md",
        "references/webflow/debugging/debugging_workflows.md",
        "references/webflow/debugging/error_recovery.md",
        "assets/universal/checklists/debugging_checklist.md",
        "assets/webflow/checklists/debugging_checklist.md"
    ],
    "VERIFICATION": [
        "references/webflow/verification/verification_workflows.md",
        "references/opencode/shared/alignment_verification_automation.md",
        "assets/universal/checklists/verification_checklist.md",
        "assets/webflow/checklists/verification_checklist.md",
        "assets/scripts/README.md"
    ],
    "TESTING": [
        "assets/motion_dev/playbook_entries.md"
    ],
    "DEPLOYMENT": [
        "references/webflow/deployment/cdn_deployment.md",
        "references/webflow/deployment/minification_guide.md",
        "references/webflow/deployment/webflow_staging_production.md",
        "assets/webflow/scripts/README.md"
    ],
    "PERFORMANCE": [
        "references/webflow/performance/cwv_remediation.md",
        "references/webflow/performance/interaction_gated_loading.md",
        "references/webflow/performance/resource_loading.md",
        "references/webflow/performance/third_party.md",
        "references/webflow/performance/webflow_constraints.md",
        "references/webflow/verification/performance_checklist.md",
        "references/webflow/implementation/performance_patterns.md",
        "references/motion_dev/performance_and_pitfalls.md",
        "assets/webflow/checklists/performance_loading_checklist.md"
    ],
    "ANIMATION": [
        "references/webflow/implementation/animation_workflows.md",
        "references/webflow/implementation/swiper_patterns.md"
    ],
    "MOTION_DEV": [
        "references/motion_dev/quick_start.md",
        "references/motion_dev/animate_and_timelines.md",
        "references/motion_dev/scroll_and_gestures.md",
        "references/motion_dev/integration_patterns.md",
        "references/motion_dev/decision_matrix.md",
        "assets/motion_dev/install_card.md",
        "assets/motion_dev/snippets/README.md"
    ],
    "FORMS": [
        "references/webflow/implementation/form_upload_workflows.md",
        "references/webflow/implementation/focus_management.md"
    ],
    "VIDEO": [
        "references/webflow/implementation/third_party_integrations.md"
    ],
    "HOOKS": [
        "references/opencode/shared/hooks.md"
    ],
    "CONFIG": [
        "references/opencode/config/style_guide.md",
        "references/opencode/config/quality_standards.md",
        "references/opencode/config/quick_reference.md",
        "assets/opencode/checklists/config_checklist.md"
    ],
    "LANGUAGE_STANDARDS": [
        "references/webflow/css/style_guide.md",
        "references/webflow/css/quality_standards.md",
        "references/webflow/css/quick_reference.md",
        "references/webflow/css/patterns.md",
        "references/webflow/html/style_guide.md",
        "references/webflow/html/quality_standards.md",
        "references/webflow/javascript/style_guide.md",
        "references/webflow/javascript/quality_standards.md",
        "references/webflow/javascript/quick_reference.md",
        "references/opencode/javascript/style_guide.md",
        "references/opencode/javascript/quality_standards.md",
        "references/opencode/javascript/quick_reference.md",
        "references/opencode/typescript/style_guide.md",
        "references/opencode/typescript/quality_standards.md",
        "references/opencode/typescript/quick_reference.md",
        "references/opencode/python/style_guide.md",
        "references/opencode/python/quality_standards.md",
        "references/opencode/python/quick_reference.md",
        "references/opencode/shell/style_guide.md",
        "references/opencode/shell/quality_standards.md",
        "references/opencode/shell/quick_reference.md"
    ],
}
```

### Surface-aware loading (route-time)

The router does NOT load the whole matched-intent union. After surface detection (§1, `stack_detection.md`), a route loads:

- the always-loaded `DEFAULT_RESOURCE` preamble (stack/phase detection, the router, the universal quality baseline), plus
- the surface-agnostic `references/universal/*` tier, plus
- only the **detected surface's** slice (`references/<surface>/*`) for the matched intents, plus
- the Motion.dev overlay (`references/motion_dev/*`) when a `MOTION_DEV` intent fires.

It does not load the other surface's resources, and it defers `assets/*` (checklists, recipes, templates) to on-demand rather than the first slice. Within OpenCode it slices once more by the **detected language** (§1 sub-detection): a TypeScript task loads `references/opencode/typescript/*` plus the language-agnostic `references/opencode/shared/*`, not the Python, shell, config, or JavaScript folders. Webflow has no language sub-slice — a frontend task legitimately spans CSS, HTML, and JavaScript together. A task that genuinely spans both surfaces (mixed `.opencode/` and Webflow markers) keeps both surface slices; an `UNKNOWN` surface falls back to the preamble plus the universal tier and the Motion overlay only. This is what stops a routine single-surface task from pulling the full cross-surface set. The deterministic router-replay enforces the same rule, so the benchmark measures it.
