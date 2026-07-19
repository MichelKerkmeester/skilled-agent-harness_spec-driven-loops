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
- CSS — `references/css/style-guide.md`, `references/css/quality-standards/patterns-and-naming-enforcement.md`, `references/css/quick-reference.md`, `references/css/patterns/tokens-state-machine-and-triggers.md`
- HTML — `references/html/style-guide.md`, `references/html/quality-standards.md`
- JavaScript — `references/javascript/style-guide/overview-naming-and-structure.md`, `references/javascript/quality-standards/init-dom-error-and-async.md`, `references/javascript/quick-reference.md`

Implementation patterns (`references/implementation/`):
- Core: `implementation_workflows.md`, `webflow_patterns.md`, `animation_workflows.md`
- Async & observers: `async_patterns.md`, `observer_patterns.md`
- Forms & focus: `form_upload_workflows.md`, `focus_management.md`
- Media & vendors: `third_party_integrations.md`, `swiper_patterns.md`
- Hardening & performance: `security_patterns.md`, `performance_patterns.md`

Animation / Motion.dev (`references/animation/`): `animation-principles.md`, `animate-and-timelines.md`, `decision-matrix.md`, `performance-and-pitfalls.md`, `scroll-and-gestures.md`, `integration-patterns.md`, `quick-start.md`
Use after the Webflow surface resolves when Motion.dev overlays Webflow animation needs: scroll reveals, timelines, gestures; snippets live in `assets/animation/snippets/`.

Performance (`references/performance/`): `cwv-remediation.md`, `resource-loading.md`, `interaction-gated-loading.md`, `third-party.md`, `webflow-constraints.md`

Deployment (`references/deployment/`): `cdn-deployment.md`, `minification_guide.md`, `webflow-staging-production.md`

Browser debugging (`references/debugging/`): `debugging_workflows.md`, `error-recovery.md`

Browser verification (`references/verification/`): `verification_workflows.md`, `performance-checklist.md`

Cross-language shared tier (`references/shared/`): `dev_workflow.md`, `cross-language-rules.md`, `enforcement.md`

Workflow (`references/`): `workflow-implement.md`, `workflow-debug.md`, `workflow-verify.md` — this surface owns the implement -> debug -> verify phases; these are the shared phase doctrine.

## 2b. SMART ROUTING (machine-readable)

This block is the deterministic projection of code-webflow's own reference/asset routing, consumed by the skill-benchmark router-replay; keep it in sync with the parent hub union.

```python
# code-webflow owns its intent -> reference/asset routing. Paths are relative to
# this skill root. The parent sk-code hub RESOURCE_MAP is the union of this map
# (re-prefixed with code-webflow/) and the sibling code-opencode map plus the
# parent-owned universal/shared tier; a drift guard enforces that equality.
DEFAULT_RESOURCE = [
    "references/shared/dev-workflow/overview-nav-and-logging.md",
    "references/shared/dev-workflow/automation-errors-and-compat.md",
    "references/shared/dev-workflow/common-commands.md",
    "references/shared/dev-workflow/checklists-and-decision-matrix.md",
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
        "references/implementation/implementation-workflows/condition-based-waiting.md",
        "references/implementation/implementation-workflows/validation-minification-and-cdn.md",
        "references/implementation/async-patterns/raf-ric-microtask-and-posttask.md",
        "references/implementation/async-patterns/timing-compat-and-webflow.md",
        "references/implementation/observer-patterns/mutation-and-intersection.md",
        "references/implementation/observer-patterns/resize-best-practices-and-shared.md",
        "references/implementation/security-patterns/overview-and-checklist.md",
        "references/implementation/security-patterns/owasp-prototype-and-safe-access.md",
        "references/implementation/third-party-integrations/overview-hls-and-lenis.md",
        "references/implementation/third-party-integrations/botpoison-and-finsweet.md",
        "references/implementation/third-party-integrations/filepond.md",
        "references/implementation/third-party-integrations/best-practices-and-summary.md",
        "references/implementation/webflow-patterns/overview-limits-and-collection-lists.md",
        "references/implementation/webflow-patterns/development-and-production.md",
        "references/implementation/webflow-patterns/finsweet-custom-select-bridge.md",
        "references/shared/dev-workflow/overview-nav-and-logging.md",
        "references/shared/dev-workflow/automation-errors-and-compat.md",
        "references/shared/dev-workflow/common-commands.md",
        "references/shared/dev-workflow/checklists-and-decision-matrix.md",
        "assets/integrations/README.md",
        "assets/patterns/README.md",
        "assets/templates/README.md"
    ],
    "CODE_QUALITY": [
        "references/shared/cross-language-rules.md",
        "references/shared/enforcement.md",
    ],
    "DEBUGGING": [
        "references/debugging/debugging-workflows/systematic-four-phases.md",
        "references/debugging/debugging-workflows/rules-and-root-cause.md",
        "references/debugging/debugging-workflows/performance-debugging.md",
        "references/debugging/debugging-workflows/quick-reference-and-lenis.md",
        "references/debugging/debugging-workflows/sub-agent-verification.md",
        "references/debugging/debugging-workflows/scroll-interceptor-and-related.md",
        "references/debugging/error-recovery.md",
        "assets/webflow-debugging-checklist.md"
    ],
    "VERIFICATION": [
        "references/verification/verification-workflows/gate-and-automated-options.md",
        "references/verification/verification-workflows/requirements-rules-and-checklist.md",
        "assets/webflow-verification-checklist.md"
    ],
    "TESTING": [
        "assets/animation/playbook-entries.md"
    ],
    "DEPLOYMENT": [
        "references/deployment/cdn-deployment.md",
        "references/deployment/minification-guide/overview-terser-and-patterns.md",
        "references/deployment/minification-guide/workflow-verification-and-debugging.md",
        "references/deployment/minification-guide/batch-rules-and-related.md",
        "references/deployment/webflow-staging-production.md",
        "assets/scripts/README.md"
    ],
    "PERFORMANCE": [
        "references/performance/cwv-remediation.md",
        "references/performance/interaction-gated-loading.md",
        "references/performance/resource-loading.md",
        "references/performance/third-party.md",
        "references/performance/webflow-constraints.md",
        "references/verification/performance-checklist.md",
        "references/implementation/performance-patterns/overview-and-checklist.md",
        "references/implementation/performance-patterns/budgets-and-anti-patterns.md",
        "references/animation/performance-and-pitfalls.md"
    ],
    "ANIMATION": [
        "references/implementation/animation-workflows/overview-decision-tree-and-css.md",
        "references/implementation/animation-workflows/motion-dev-and-performance.md",
        "references/implementation/animation-workflows/testing-and-common-issues.md",
        "references/implementation/animation-workflows/motion-dev-advanced.md",
        "references/implementation/swiper-patterns/overview-timeline-and-marquee.md",
        "references/implementation/swiper-patterns/autoplay-accessibility-and-naming.md",
        "references/implementation/swiper-patterns/initialization-and-troubleshooting.md"
    ],
    "MOTION_DEV": [
        "references/animation/quick-start.md",
        "references/animation/animation-principles.md",
        "references/animation/animate-and-timelines.md",
        "references/animation/scroll-and-gestures.md",
        "references/animation/integration-patterns.md",
        "references/animation/decision-matrix.md",
        "references/animation/performance-and-pitfalls.md",
        "assets/animation/install-card.md",
        "assets/animation/snippets/principled-reveal.js",
        "assets/animation/snippets/README.md"
    ],
    "ACCESSIBILITY": [
        "references/animation/performance-and-pitfalls.md",
        "references/implementation/animation-workflows/overview-decision-tree-and-css.md",
        "references/implementation/animation-workflows/motion-dev-and-performance.md",
        "references/implementation/animation-workflows/testing-and-common-issues.md",
        "references/implementation/animation-workflows/motion-dev-advanced.md",
        "references/verification/verification-workflows/gate-and-automated-options.md",
        "references/verification/verification-workflows/requirements-rules-and-checklist.md"
    ],
    "FORMS": [
        "references/implementation/form-upload-workflows/overview-architecture-and-filepond.md",
        "references/implementation/form-upload-workflows/state-machine-worker-and-forms.md",
        "references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md",
        "references/implementation/focus-management/selector-and-focus-trap.md",
        "references/implementation/focus-management/restoration-touch-and-anti-patterns.md"
    ],
    "VIDEO": [
        "references/implementation/third-party-integrations/overview-hls-and-lenis.md",
        "references/implementation/third-party-integrations/botpoison-and-finsweet.md",
        "references/implementation/third-party-integrations/filepond.md",
        "references/implementation/third-party-integrations/best-practices-and-summary.md"
    ],
    "LANGUAGE_STANDARDS": [
        "references/css/style-guide.md",
        "references/css/quality-standards/patterns-and-naming-enforcement.md",
        "references/css/quality-standards/typography-autofill-and-color.md",
        "references/css/quality-standards/focus-has-print-and-quick-reference.md",
        "references/css/quick-reference.md",
        "references/css/patterns/tokens-state-machine-and-triggers.md",
        "references/css/patterns/data-attributes-and-forms.md",
        "references/css/patterns/focus-accessibility-and-mobile.md",
        "references/css/patterns/designer-component-and-performance.md",
        "references/css/patterns/quick-reference-and-related.md",
        "references/html/style-guide.md",
        "references/html/quality-standards.md",
        "references/javascript/style-guide/overview-naming-and-structure.md",
        "references/javascript/style-guide/formatting.md",
        "references/javascript/style-guide/commenting-and-related.md",
        "references/javascript/quality-standards/init-dom-error-and-async.md",
        "references/javascript/quality-standards/observer-validation-and-performance.md",
        "references/javascript/quality-standards/state-and-cleanup.md",
        "references/javascript/quality-standards/shared-listener-and-weakmap.md",
        "references/javascript/quality-standards/enforcement-and-quick-reference.md",
        "references/javascript/quick-reference.md"
    ],
}
```

## 3. SURFACE STANDARDS (the non-negotiables)

- **CDN runtime reality.** Client scripts ship over a CDN with cache lag; treat every deploy as versioned and verify the minified runtime, not just the source. See `references/deployment/minification-guide/overview-terser-and-patterns.md` and `references/verification/verification-workflows/gate-and-automated-options.md`.
- **Interaction-gated loading.** Heavy vendors (HLS.js, FilePond, Swiper) load on interaction/visibility, never eagerly. See `references/performance/interaction-gated-loading.md` and `references/implementation/observer-patterns/mutation-and-intersection.md`.
- **Core Web Vitals are a gate, not a report.** LCP/CLS/INP regressions block; remediate against `references/performance/cwv-remediation.md` and `references/performance/webflow-constraints.md`.
- **Focus and forms are accessibility-load-bearing.** Focus traps and upload flows follow `references/implementation/focus-management/selector-and-focus-trap.md` and `references/implementation/form-upload-workflows/overview-architecture-and-filepond.md`.

## 4. ASSETS (on-demand, deferred from the first slice)

- Integrations, patterns, templates, scripts — `assets/integrations/`, `assets/patterns/`, `assets/templates/`, `assets/scripts/`
- Surface checklists — `assets/webflow-debugging-checklist.md`, `assets/webflow-verification-checklist.md`

Assets are pulled on demand by the active workflow phase; they are not part of the initial evidence slice.
