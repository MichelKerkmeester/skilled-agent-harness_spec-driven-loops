---
title: Router Reference - Resource Loading
description: Surface-aware resource loading for WEBFLOW and OPENCODE routes.
---

# Router Reference - Resource Loading

Resource loading turns a detected surface plus selected intents into concrete reference and checklist files.

---

## 1. OVERVIEW

### Purpose

Map the detected surface and selected intents to the exact references, assets, and checklists needed for the active task.

### When to Use

- After code surface detection and intent classification complete.
- When loading surface-specific implementation, debugging, verification, or standards resources.
- When Motion.dev guidance is needed as a peer resource category.
- When an unsupported surface must fall back to explicit clarification.

### Core Principle

Resource loading routes ALWAYS-load and tier-specific resources to the active surface and intent without over-loading the context.

### Key Sources

- [code_surface_detection.md](./code_surface_detection.md)
- [intent_classification.md](./intent_classification.md)

---

## 2. LOAD TIERS

| Tier | When | Resources |
| --- | --- | --- |
| ALWAYS | Every invocation | Universal code quality and error recovery |
| SURFACE | After WEBFLOW/OPENCODE detection | Surface-specific shared resources |
| INTENT | After intent classification | Implementation, debugging, verification, performance, etc. |
| LANGUAGE | OPENCODE only | JavaScript, TypeScript, Python, Shell, Config standards |
| ON_DEMAND | Explicit deep-dive keywords | Extended checklists and niche references |

---

## 3. WEBFLOW MAP

WEBFLOW loads from `references/webflow/` and `assets/webflow/`.

| Intent | Examples |
| --- | --- |
| IMPLEMENTATION | MUST load the implementation trio: `references/webflow/implementation/animation_workflows.md`, `references/webflow/implementation/implementation_workflows.md`, `references/webflow/implementation/performance_patterns.md`; then add focused guides such as forms/vendor refs as needed |
| CODE_QUALITY | `assets/webflow/checklists/code_quality_checklist.md`, Webflow standards |
| DEBUGGING | `references/webflow/debugging/*`, universal debugging checklist |
| VERIFICATION | `references/webflow/verification/verification_workflows.md`, verification checklist |
| PERFORMANCE | `references/webflow/performance/cwv_remediation.md`, `references/webflow/performance/resource_loading.md`, `references/webflow/performance/interaction_gated_loading.md` |
| DEPLOYMENT | CDN and minification guides |

Any WEBFLOW surface detection MUST load the implementation trio before intent-specific expansion:

- `references/webflow/implementation/animation_workflows.md`
- `references/webflow/implementation/implementation_workflows.md`
- `references/webflow/implementation/performance_patterns.md`

This is a contract, not a guideline. It prevents SD-001-style partial coverage where the surface is correct but implementation guidance falls below the expected threshold.

---

## 4. MOTION_DEV MAP

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

### Performance and Decision Contracts

PERFORMANCE intent with Motion.dev or Webflow animation MUST name these canonical files when relevant:

- `references/motion_dev/performance_and_pitfalls.md`
- `references/webflow/performance/cwv_remediation.md`
- `references/webflow/performance/resource_loading.md`

DECISION intent MUST name:

- `references/motion_dev/decision_matrix.md`
- `references/webflow/implementation/animation_workflows.md` when comparing Motion.dev against Webflow-owned animation patterns
- `references/webflow/implementation/performance_patterns.md` when the decision depends on performance constraints

---

## 5. OPENCODE MAP

OPENCODE loads from `references/opencode/` and `assets/opencode/`.

Always load:

- `references/opencode/shared/universal_patterns.md`
- `references/opencode/shared/code_organization.md`

Intent resources:

| Intent | Resources |
| --- | --- |
| CODE_QUALITY | `assets/opencode/checklists/universal_checklist.md` plus language checklist |
| VERIFICATION | `references/opencode/shared/alignment_verification_automation.md`, alignment verifier script |
| HOOKS | `references/opencode/shared/hooks.md` |
| CONFIG | `references/opencode/config/*` |
| LANGUAGE_STANDARDS | Detected language folder quick reference, style guide, quality standards |

Language resources:

| Language | Resources |
| --- | --- |
| JAVASCRIPT | `references/opencode/javascript/{style_guide,quality_standards,quick_reference}.md`, `assets/opencode/checklists/javascript_checklist.md` |
| TYPESCRIPT | `references/opencode/typescript/{style_guide,quality_standards,quick_reference}.md`, `assets/opencode/checklists/typescript_checklist.md` |
| PYTHON | `references/opencode/python/{style_guide,quality_standards,quick_reference}.md`, `assets/opencode/checklists/python_checklist.md` |
| SHELL | `references/opencode/shell/{style_guide,quality_standards,quick_reference}.md`, `assets/opencode/checklists/shell_checklist.md` |
| CONFIG | `references/opencode/config/{style_guide,quality_standards,quick_reference}.md`, `assets/opencode/checklists/config_checklist.md` |

---

## 6. VERIFICATION COMMANDS

| Surface | Commands |
| --- | --- |
| WEBFLOW | `node .opencode/skill/sk-code/assets/webflow/scripts/minify-webflow.mjs`; `node .opencode/skill/sk-code/assets/webflow/scripts/verify-minification.mjs`; `node .opencode/skill/sk-code/assets/webflow/scripts/test-minified-runtime.mjs`; browser evidence when behavior changes |
| OPENCODE | `python3 .opencode/skill/sk-code/assets/scripts/verify_alignment_drift.py --root <changed-scope>` plus targeted tests such as vitest, pytest, shellcheck, JSON validation, and spec validation |

---

## 7. UNKNOWN FALLBACK

If no supported surface matches, ask:

1. Is this Webflow/frontend code or `.opencode/` system code?
2. Which files or directories are changing?
3. Which verification command proves the claim?
4. Should a new `sk-code` route be planned before implementation?

Do not load Go/NextJS resources; those placeholder routes were removed.

---

## 8. RELATED RESOURCES

- [code_surface_detection.md](./code_surface_detection.md)
- [intent_classification.md](./intent_classification.md)
- [phase_lifecycle.md](./phase_lifecycle.md)
