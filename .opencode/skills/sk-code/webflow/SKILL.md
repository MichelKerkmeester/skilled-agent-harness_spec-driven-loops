---
name: webflow
description: "sk-code WEBFLOW surface: read-only frontend evidence (CSS/HTML/JavaScript standards, implementation and performance patterns, CDN deployment, browser debugging and verification) bundled by the hub alongside a workflow mode."
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.0
metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface
---

<!-- Keywords: webflow, frontend, browser, css, html, javascript, cdn, deployment, core-web-vitals, forms, filepond, swiper, hls, surface-evidence, sk-code -->

# webflow Surface — Frontend Evidence

Read-only **domain evidence** for browser/Webflow frontend work. This packet carries no process of its own: the hub bundles it alongside a workflow mode (`implement`, `debug`, `verify`, …) when it detects a Webflow surface, and the workflow mode acts on the evidence gathered here. Detection markers: `src/2_javascript`, `webflow`, `--vw-` custom properties, CDN-delivered client scripts.

## 1. WHEN THE HUB BUNDLES THIS

- The task touches Webflow-published pages, CDN-delivered `webflow.js`/client scripts, or `src/2_javascript` sources.
- A workflow mode needs frontend standards (CSS/HTML/JS), an implementation pattern, a performance remediation, a deployment step, or a browser debugging/verification procedure.
- Surface bundling is evidence-only: nothing here mutates the workspace. The paired workflow mode owns any edits, tests, or commits.

## 2. REFERENCE MAP

Language standards (load the detected language's trio; a frontend task legitimately spans all three):
- CSS — `references/css/style_guide.md`, `references/css/quality_standards.md`, `references/css/quick_reference.md`, `references/css/patterns.md`
- HTML — `references/html/style_guide.md`, `references/html/quality_standards.md`
- JavaScript — `references/javascript/style_guide.md`, `references/javascript/quality_standards.md`, `references/javascript/quick_reference.md`

Implementation patterns (`references/implementation/`):
- Core: `implementation_workflows.md`, `webflow_patterns.md`, `animation_workflows.md`
- Async & observers: `async_patterns.md`, `observer_patterns.md`
- Forms & focus: `form_upload_workflows.md`, `focus_management.md`
- Media & vendors: `third_party_integrations.md`, `swiper_patterns.md`
- Hardening & performance: `security_patterns.md`, `performance_patterns.md`

Performance (`references/performance/`): `cwv_remediation.md`, `resource_loading.md`, `interaction_gated_loading.md`, `third_party.md`, `webflow_constraints.md`

Deployment (`references/deployment/`): `cdn_deployment.md`, `minification_guide.md`, `webflow_staging_production.md`

Browser debugging (`references/debugging/`): `debugging_workflows.md`, `error_recovery.md`

Browser verification (`references/verification/`): `verification_workflows.md`, `performance_checklist.md`

Cross-language shared tier (`references/shared/`): `dev_workflow.md`, `cross_language_rules.md`, `enforcement.md`

## 3. SURFACE STANDARDS (the non-negotiables)

- **CDN runtime reality.** Client scripts ship over a CDN with cache lag; treat every deploy as versioned and verify the minified runtime, not just the source. See `references/deployment/minification_guide.md` and `references/verification/verification_workflows.md`.
- **Interaction-gated loading.** Heavy vendors (HLS.js, FilePond, Swiper) load on interaction/visibility, never eagerly. See `references/performance/interaction_gated_loading.md` and `references/implementation/observer_patterns.md`.
- **Core Web Vitals are a gate, not a report.** LCP/CLS/INP regressions block; remediate against `references/performance/cwv_remediation.md` and `references/performance/webflow_constraints.md`.
- **Focus and forms are accessibility-load-bearing.** Focus traps and upload flows follow `references/implementation/focus_management.md` and `references/implementation/form_upload_workflows.md`.

## 4. ASSETS (on-demand, deferred from the first slice)

- Integrations, patterns, templates, scripts — `assets/integrations/`, `assets/patterns/`, `assets/templates/`, `assets/scripts/`
- Surface checklists — `assets/webflow-debugging_checklist.md`, `assets/webflow-verification_checklist.md`

Assets are pulled on demand by the paired workflow mode; they are not part of the initial evidence slice.
