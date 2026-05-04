---
title: Router Reference - Resource Loading
description: Surface-aware resource loading for WEBFLOW and OPENCODE routes.
---

# Router Reference - Resource Loading

Resource loading turns a detected surface plus selected intents into concrete reference and checklist files.

---

## 1. LOAD TIERS

| Tier | When | Resources |
| --- | --- | --- |
| ALWAYS | Every invocation | Universal code quality and error recovery |
| SURFACE | After WEBFLOW/OPENCODE detection | Surface-specific shared resources |
| INTENT | After intent classification | Implementation, debugging, verification, performance, etc. |
| LANGUAGE | OPENCODE only | JavaScript, TypeScript, Python, Shell, Config standards |
| ON_DEMAND | Explicit deep-dive keywords | Extended checklists and niche references |

---

## 2. WEBFLOW MAP

WEBFLOW loads from `references/webflow/` and `assets/webflow/`.

| Intent | Examples |
| --- | --- |
| IMPLEMENTATION | `references/webflow/implementation/implementation_workflows.md`, animation/forms/vendor guides |
| CODE_QUALITY | `assets/webflow/checklists/code_quality_checklist.md`, Webflow standards |
| DEBUGGING | `references/webflow/debugging/*`, universal debugging checklist |
| VERIFICATION | `references/webflow/verification/verification_workflows.md`, verification checklist |
| PERFORMANCE | `references/webflow/performance/*`, performance loading checklist |
| DEPLOYMENT | CDN and minification guides |

---

## 3. OPENCODE MAP

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

## 4. VERIFICATION COMMANDS

| Surface | Commands |
| --- | --- |
| WEBFLOW | `node scripts/minify-webflow.mjs`; `node scripts/verify-minification.mjs`; `node scripts/test-minified-runtime.mjs`; browser evidence when behavior changes |
| OPENCODE | `python3 .opencode/skill/sk-code/scripts/verify_alignment_drift.py --root <changed-scope>` plus targeted tests such as vitest, pytest, shellcheck, JSON validation, and spec validation |

---

## 5. UNKNOWN FALLBACK

If no supported surface matches, ask:

1. Is this Webflow/frontend code or `.opencode/` system code?
2. Which files or directories are changing?
3. Which verification command proves the claim?
4. Should a new `sk-code` route be planned before implementation?

Do not load Go/NextJS resources; those placeholder routes were removed.
