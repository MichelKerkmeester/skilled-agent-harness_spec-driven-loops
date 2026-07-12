---
name: code-webflow
description: "sk-code WEBFLOW surface: frontend evidence (CSS/HTML/JavaScript standards, implementation and performance patterns, CDN deployment, browser debugging and verification) plus shared implement/debug/verify workflow doctrine."
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.0
metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface
---

<!-- Keywords: webflow, frontend, browser, css, html, javascript, cdn, deployment, core-web-vitals, forms, filepond, swiper, hls, surface-evidence, sk-code -->

# webflow Surface — Frontend Evidence

**Domain evidence** and shared workflow doctrine for browser/Webflow frontend work. This surface owns the implement -> debug -> verify phases through the workflow references below, and acts on the evidence gathered here when the hub detects a Webflow surface. Detection markers: `src/2_javascript`, `webflow`, `--vw-` custom properties, CDN-delivered client scripts.

## 1. WHEN THE HUB BUNDLES THIS

- The task touches Webflow-published pages, CDN-delivered `webflow.js`/client scripts, or `src/2_javascript` sources.
- The active workflow phase needs frontend standards (CSS/HTML/JS), an implementation pattern, a performance remediation, a deployment step, or a browser debugging/verification procedure.
- This surface owns edits, tests, and verification through the workflow references; hand off formal findings-first review to `code-review` and author-side quality gates to `code-quality`.

## 2. REFERENCE MAP

Language standards (load the detected language's trio; a frontend task legitimately spans all three):
- CSS — `references/css/style_guide.md`, `references/css/quality_standards/patterns_and_naming_enforcement.md`, `references/css/quick_reference.md`, `references/css/patterns/tokens_state_machine_and_triggers.md`
- HTML — `references/html/style_guide.md`, `references/html/quality_standards.md`
- JavaScript — `references/javascript/style_guide/overview_naming_and_structure.md`, `references/javascript/quality_standards/init_dom_error_and_async.md`, `references/javascript/quick_reference.md`

Implementation patterns (`references/implementation/`):
- Core: `implementation_workflows.md`, `webflow_patterns.md`, `animation_workflows.md`
- Async & observers: `async_patterns.md`, `observer_patterns.md`
- Forms & focus: `form_upload_workflows.md`, `focus_management.md`
- Media & vendors: `third_party_integrations.md`, `swiper_patterns.md`
- Hardening & performance: `security_patterns.md`, `performance_patterns.md`

Animation / Motion.dev (`references/animation/`): `animation_principles.md`, `animate_and_timelines.md`, `decision_matrix.md`, `performance_and_pitfalls.md`, `scroll_and_gestures.md`, `integration_patterns.md`, `quick_start.md`
Use after the Webflow surface resolves when Motion.dev overlays Webflow animation needs: scroll reveals, timelines, gestures; snippets live in `assets/animation/snippets/`.

Performance (`references/performance/`): `cwv_remediation.md`, `resource_loading.md`, `interaction_gated_loading.md`, `third_party.md`, `webflow_constraints.md`

Deployment (`references/deployment/`): `cdn_deployment.md`, `minification_guide.md`, `webflow_staging_production.md`

Browser debugging (`references/debugging/`): `debugging_workflows.md`, `error_recovery.md`

Browser verification (`references/verification/`): `verification_workflows.md`, `performance_checklist.md`

Cross-language shared tier (`references/shared/`): `dev_workflow.md`, `cross_language_rules.md`, `enforcement.md`

Workflow (`references/`): `workflow_implement.md`, `workflow_debug.md`, `workflow_verify.md` — this surface owns the implement -> debug -> verify phases; these are the shared phase doctrine.

## 2b. SMART ROUTING (machine-readable)

This block is the deterministic projection of code-webflow's own reference/asset routing, consumed by the skill-benchmark router-replay; keep it in sync with the parent hub union.

```python
# code-webflow owns its intent -> reference/asset routing. Paths are relative to
# this skill root. The parent sk-code hub RESOURCE_MAP is the union of this map
# (re-prefixed with code-webflow/) and the sibling code-opencode map plus the
# parent-owned universal/shared tier; a drift guard enforces that equality.
DEFAULT_RESOURCE = [
    "references/shared/dev_workflow/overview_nav_and_logging.md",
    "references/shared/dev_workflow/automation_errors_and_compat.md",
    "references/shared/dev_workflow/common_commands.md",
    "references/shared/dev_workflow/checklists_and_decision_matrix.md",
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
    "LANGUAGE_STANDARDS": {"weight": 1, "keywords": ["typescript", ".ts", ".tsx", "python", ".py", "shell script", "bash", ".sh", "commonjs", ".cjs", ".mjs", "docstring"]},
}

RESOURCE_MAP = {
    "IMPLEMENTATION": [
        "references/implementation/implementation_workflows/condition_based_waiting.md",
        "references/implementation/implementation_workflows/validation_minification_and_cdn.md",
        "references/implementation/async_patterns/raf_ric_microtask_and_posttask.md",
        "references/implementation/async_patterns/timing_compat_and_webflow.md",
        "references/implementation/observer_patterns/mutation_and_intersection.md",
        "references/implementation/observer_patterns/resize_best_practices_and_shared.md",
        "references/implementation/security_patterns/overview_and_checklist.md",
        "references/implementation/security_patterns/owasp_prototype_and_safe_access.md",
        "references/implementation/third_party_integrations/overview_hls_and_lenis.md",
        "references/implementation/third_party_integrations/botpoison_and_finsweet.md",
        "references/implementation/third_party_integrations/filepond.md",
        "references/implementation/third_party_integrations/best_practices_and_summary.md",
        "references/implementation/webflow_patterns/overview_limits_and_collection_lists.md",
        "references/implementation/webflow_patterns/development_and_production.md",
        "references/implementation/webflow_patterns/finsweet_custom_select_bridge.md",
        "references/shared/dev_workflow/overview_nav_and_logging.md",
        "references/shared/dev_workflow/automation_errors_and_compat.md",
        "references/shared/dev_workflow/common_commands.md",
        "references/shared/dev_workflow/checklists_and_decision_matrix.md",
        "assets/integrations/README.md",
        "assets/patterns/README.md",
        "assets/templates/README.md"
    ],
    "CODE_QUALITY": [
        "references/shared/cross_language_rules.md",
        "references/shared/enforcement.md",
    ],
    "DEBUGGING": [
        "references/debugging/debugging_workflows/systematic_four_phases.md",
        "references/debugging/debugging_workflows/rules_and_root_cause.md",
        "references/debugging/debugging_workflows/performance_debugging.md",
        "references/debugging/debugging_workflows/quick_reference_and_lenis.md",
        "references/debugging/debugging_workflows/sub_agent_verification.md",
        "references/debugging/debugging_workflows/scroll_interceptor_and_related.md",
        "references/debugging/error_recovery.md",
        "assets/webflow-debugging_checklist.md"
    ],
    "VERIFICATION": [
        "references/verification/verification_workflows/gate_and_automated_options.md",
        "references/verification/verification_workflows/requirements_rules_and_checklist.md",
        "assets/webflow-verification_checklist.md"
    ],
    "TESTING": [
        "assets/animation/playbook_entries.md"
    ],
    "DEPLOYMENT": [
        "references/deployment/cdn_deployment.md",
        "references/deployment/minification_guide/overview_terser_and_patterns.md",
        "references/deployment/minification_guide/workflow_verification_and_debugging.md",
        "references/deployment/minification_guide/batch_rules_and_related.md",
        "references/deployment/webflow_staging_production.md",
        "assets/scripts/README.md"
    ],
    "PERFORMANCE": [
        "references/performance/cwv_remediation.md",
        "references/performance/interaction_gated_loading.md",
        "references/performance/resource_loading.md",
        "references/performance/third_party.md",
        "references/performance/webflow_constraints.md",
        "references/verification/performance_checklist.md",
        "references/implementation/performance_patterns/overview_and_checklist.md",
        "references/implementation/performance_patterns/budgets_and_anti_patterns.md",
        "references/animation/performance_and_pitfalls.md"
    ],
    "ANIMATION": [
        "references/implementation/animation_workflows/overview_decision_tree_and_css.md",
        "references/implementation/animation_workflows/motion_dev_and_performance.md",
        "references/implementation/animation_workflows/testing_and_common_issues.md",
        "references/implementation/animation_workflows/motion_dev_advanced.md",
        "references/implementation/swiper_patterns/overview_timeline_and_marquee.md"
        "references/implementation/swiper_patterns/autoplay_accessibility_and_naming.md"
        "references/implementation/swiper_patterns/initialization_and_troubleshooting.md"
    ],
    "MOTION_DEV": [
        "references/animation/quick_start.md",
        "references/animation/animation_principles.md",
        "references/animation/animate_and_timelines.md",
        "references/animation/scroll_and_gestures.md",
        "references/animation/integration_patterns.md",
        "references/animation/decision_matrix.md",
        "references/animation/performance_and_pitfalls.md",
        "assets/animation/install_card.md",
        "assets/animation/snippets/principled_reveal.js",
        "assets/animation/snippets/README.md"
    ],
    "ACCESSIBILITY": [
        "references/animation/performance_and_pitfalls.md",
        "references/implementation/animation_workflows/overview_decision_tree_and_css.md",
        "references/implementation/animation_workflows/motion_dev_and_performance.md",
        "references/implementation/animation_workflows/testing_and_common_issues.md",
        "references/implementation/animation_workflows/motion_dev_advanced.md",
        "references/verification/verification_workflows/gate_and_automated_options.md"
        "references/verification/verification_workflows/requirements_rules_and_checklist.md"
    ],
    "FORMS": [
        "references/implementation/form_upload_workflows/overview_architecture_and_filepond.md",
        "references/implementation/form_upload_workflows/state_machine_worker_and_forms.md",
        "references/implementation/form_upload_workflows/mime_troubleshooting_and_deployment.md",
        "references/implementation/focus_management/selector_and_focus_trap.md"
        "references/implementation/focus_management/restoration_touch_and_anti_patterns.md"
    ],
    "VIDEO": [
        "references/implementation/third_party_integrations/overview_hls_and_lenis.md"
        "references/implementation/third_party_integrations/botpoison_and_finsweet.md"
        "references/implementation/third_party_integrations/filepond.md"
        "references/implementation/third_party_integrations/best_practices_and_summary.md"
    ],
    "LANGUAGE_STANDARDS": [
        "references/css/style_guide.md",
        "references/css/quality_standards/patterns_and_naming_enforcement.md",
        "references/css/quality_standards/typography_autofill_and_color.md",
        "references/css/quality_standards/focus_has_print_and_quick_reference.md",
        "references/css/quick_reference.md",
        "references/css/patterns/tokens_state_machine_and_triggers.md",
        "references/css/patterns/data_attributes_and_forms.md",
        "references/css/patterns/focus_accessibility_and_mobile.md",
        "references/css/patterns/designer_component_and_performance.md",
        "references/css/patterns/quick_reference_and_related.md",
        "references/html/style_guide.md",
        "references/html/quality_standards.md",
        "references/javascript/style_guide/overview_naming_and_structure.md",
        "references/javascript/style_guide/formatting.md",
        "references/javascript/style_guide/commenting_and_related.md",
        "references/javascript/quality_standards/init_dom_error_and_async.md",
        "references/javascript/quality_standards/observer_validation_and_performance.md",
        "references/javascript/quality_standards/state_and_cleanup.md",
        "references/javascript/quality_standards/shared_listener_and_weakmap.md",
        "references/javascript/quality_standards/enforcement_and_quick_reference.md",
        "references/javascript/quick_reference.md"
    ],
}
```

## 3. SURFACE STANDARDS (the non-negotiables)

- **CDN runtime reality.** Client scripts ship over a CDN with cache lag; treat every deploy as versioned and verify the minified runtime, not just the source. See `references/deployment/minification_guide/overview_terser_and_patterns.md` and `references/verification/verification_workflows/gate_and_automated_options.md`.
- **Interaction-gated loading.** Heavy vendors (HLS.js, FilePond, Swiper) load on interaction/visibility, never eagerly. See `references/performance/interaction_gated_loading.md` and `references/implementation/observer_patterns/mutation_and_intersection.md`.
- **Core Web Vitals are a gate, not a report.** LCP/CLS/INP regressions block; remediate against `references/performance/cwv_remediation.md` and `references/performance/webflow_constraints.md`.
- **Focus and forms are accessibility-load-bearing.** Focus traps and upload flows follow `references/implementation/focus_management/selector_and_focus_trap.md` and `references/implementation/form_upload_workflows/overview_architecture_and_filepond.md`.

## 4. ASSETS (on-demand, deferred from the first slice)

- Integrations, patterns, templates, scripts — `assets/integrations/`, `assets/patterns/`, `assets/templates/`, `assets/scripts/`
- Surface checklists — `assets/webflow-debugging_checklist.md`, `assets/webflow-verification_checklist.md`

Assets are pulled on demand by the active workflow phase; they are not part of the initial evidence slice.
