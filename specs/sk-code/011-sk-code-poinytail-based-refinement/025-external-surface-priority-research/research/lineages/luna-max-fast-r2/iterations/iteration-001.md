# Iteration 1: Q7 / F10 — stack-agnostic intent coverage

## Focus
Determine which shared and OpenCode leaves remain useful when a user removes the operator's Webflow and Obsidian example surfaces, and identify the smallest route-map change supported by existing content.

## Actions Taken
- Trigger lookup: `lookup-trigger-index.mjs --json --scoring-only -- "F10 ROUTER.md stack-agnostic intents shared and opencode leaves after deleting Webflow; smallest R6"` — exit 1, no result rows (clean no-hit).
- Read the complete 618-line `.skilled/skills/sk-code/ROUTER.md`, lineage config/state/strategy, and all files under `shared/`, `sk-code-skilled/references/`, and `sk-code-skilled/assets/`. The inventory below gives each file's one-line purpose.
- Read the router's explicit intent tables and checked their listed leaves against the prepared copy after deleting both example directories. Ran the hub router drift guard in that copy.

Throwaway copy: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2-luna-max-fast-r2-i1.ANVx` (prepared base copied with `cp -cR`; COPY_EXIT=0).

- `cd /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2-luna-max-fast-r2-i1.ANVx` then `rm -rf .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian` — exit 0.
- `cd /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2-luna-max-fast-r2-i1.ANVx` then `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` — exit 1. Decisive output:
```text
FAIL check 1a: machine-router paths exist and the prose maps are routed (99 problem(s))
  - dead route: sk-code-webflow/SKILL.md
  - dead route: sk-code-obsidian/SKILL.md
  - dead route: sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md
  - dead route: sk-code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md
  - dead route: sk-code-webflow/references/implementation/async-patterns/raf-ric-microtask-and-posttask.md
  - dead route: sk-code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md
  - dead route: sk-code-webflow/references/implementation/observer-patterns/mutation-and-intersection.md
  - dead route: sk-code-webflow/references/implementation/observer-patterns/resize-best-practices-and-shared.md
  - dead route: sk-code-webflow/references/implementation/security-patterns/overview-and-checklist.md
  - dead route: sk-code-webflow/references/implementation/security-patterns/owasp-prototype-and-safe-access.md
  - dead route: sk-code-webflow/references/implementation/third-party-integrations/overview-hls-and-lenis.md
```
- The route table below is an availability projection from ROUTER.md's listed paths checked against that deleted copy; the executed script is `verify-router-sync.cjs` (a drift guard), not a prompt-load transcript. A custom user surface was not present in the prepared base. 

### Router source lines
```text
37. Routing is a two-stage decision: **surface-first, intent-second**. Surface narrows the resource family (OpenCode vs Obsidian vs Webflow vs UNKNOWN); intent narrows the specific files within that family. Motion.dev resources are a **peer category** loaded after the surface decision, not a surface. The detected surface also goes to the compiled front door as `--surface-hint`, so when a prompt ties between surfaces the session's surface leads the bundle (`SKILL.md` §2).
111. | ALWAYS | Every invocation | The §11 `DEFAULT_RESOURCE` preamble only: `shared/references/stack-detection.md`, `shared/references/phase-detection.md` and `shared/references/universal/code-quality-standards.md`. The other universal files load with their intent: `code-style-guide.md` with CODE_QUALITY, `error-recovery.md` with DEBUGGING and `multi-agent-research.md` with IMPLEMENTATION |
112. | SURFACE | After WEBFLOW, OPENCODE or OBSIDIAN detection | Surface-specific resources (`sk-code-webflow/references/shared/*`, `sk-code-skilled/references/shared/*`, or the `sk-code-obsidian/references/*` leaves its packet router maps) |
114. | LANGUAGE | OPENCODE only | Split JavaScript, TypeScript, Python, Shell, Rust, and Config standards from the matching `sk-code-skilled/references/<lang>/` resources |
125. | IMPLEMENTATION | MUST load the implementation trio: `sk-code-webflow/references/implementation/animation-workflows/overview-decision-tree-and-css.md`, `sk-code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md`, `sk-code-webflow/references/implementation/performance-patterns/overview-and-checklist.md`; then add per-language style guides (`sk-code-webflow/references/javascript/style-guide/overview-naming-and-structure.md`, `sk-code-webflow/references/css/style-guide.md`) and focused guides such as forms/vendor refs as needed |
126. | CODE_QUALITY | `sk-code-review/assets/code-quality-checklist.md`, `sk-code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md`, `sk-code-webflow/references/css/quality-standards/patterns-and-naming-enforcement.md`, `sk-code-webflow/references/shared/enforcement.md` |
127. | DEBUGGING | `sk-code-webflow/references/debugging/*`, `sk-code-webflow/references/shared/dev-workflow/overview-nav-and-logging.md`, universal debugging checklist |
128. | VERIFICATION | `sk-code-webflow/references/verification/verification-workflows/gate-and-automated-options.md`, `sk-code-webflow/references/shared/enforcement.md`, verification checklist |
129. | PERFORMANCE | `sk-code-webflow/references/performance/cwv-remediation.md`, `sk-code-webflow/references/performance/resource-loading.md`, `sk-code-webflow/references/performance/interaction-gated-loading.md`, `sk-code-webflow/references/css/quality-standards/patterns-and-naming-enforcement.md` (will-change, GPU props), `sk-code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md` (RAF, debounce) |
130. | DEPLOYMENT | `sk-code-webflow/references/deployment/cdn-deployment.md`, `sk-code-webflow/references/deployment/minification-guide/overview-terser-and-patterns.md`, `sk-code-webflow/references/deployment/webflow-staging-production.md` |
157. MOTION_DEV loads from `sk-code-webflow/references/animation/` and `sk-code-webflow/assets/animation/` as a peer resource category. It is not a separate code surface; it supplements WEBFLOW, OPENCODE, or future surfaces when the request needs Motion API, integration, or decision guidance.
163. | ANIMATION / MOTION_DEV | `sk-code-webflow/references/animation/quick-start.md`, `sk-code-webflow/references/animation/animation-principles.md`, `sk-code-webflow/references/animation/animate-and-timelines.md`, `sk-code-webflow/references/animation/scroll-and-gestures.md`, `sk-code-webflow/assets/animation/snippets/principled-reveal.js` |
164. | PERFORMANCE | `sk-code-webflow/references/animation/performance-and-pitfalls.md` including frame-level visual verification for subtle timing/easing defects |
165. | IMPLEMENTATION / API | `sk-code-webflow/references/animation/integration-patterns.md`, exact snippet assets such as `sk-code-webflow/assets/animation/snippets/animate-on-scroll.js` and `sk-code-webflow/assets/animation/snippets/in-view-reveal.js` |
166. | CODE_QUALITY / DECISION | `sk-code-webflow/references/animation/decision-matrix.md`, `sk-code-webflow/assets/animation/install-card.md` |
167. | TESTING / PLAYBOOK | `sk-code-webflow/assets/animation/playbook-entries.md` plus manual testing playbook Motion scenarios |
171. When explicit non-Webflow language and MOTION_DEV both match, do not load `sk-code-webflow/references/*` or `sk-code-webflow/assets/*`. Load Motion.dev peer resources by exact path while keeping the surface UNKNOWN or N/A:
186. PERFORMANCE intent with Motion.dev or Webflow animation MUST name these canonical files when relevant:
188. - `sk-code-webflow/references/animation/performance-and-pitfalls.md`
189. - `sk-code-webflow/references/performance/cwv-remediation.md`
190. - `sk-code-webflow/references/performance/resource-loading.md`
204. ### Implementation shared tier
206. IMPLEMENTATION loads the shared organization and naming baseline:
208. - `sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md`
209. - `sk-code-skilled/references/shared/code-organization/overview-and-module-organization.md`
213. | Intent | Resources |
215. | CODE_QUALITY | `sk-code-skilled/assets/checklists/universal-checklist.md` plus the language-matching checklist |
216. | VERIFICATION | `sk-code-skilled/references/shared/alignment-verification-automation.md`, `sk-code-skilled/assets/scripts/verify_alignment_drift.py` |
217. | HOOKS | `sk-code-skilled/references/shared/hooks.md` |
218. | CONFIG | `sk-code-skilled/references/config/*` |
219. | LANGUAGE_STANDARDS | Detected language folder's `quick-reference.md`, `style-guide.md`, `quality-standards.md` |
```

### Intent leaves and post-delete availability
The row below groups each explicit leaf by its owning surface. `shared` includes the router's ALWAYS resources and intent-bound universal resources. The final column is the list that still exists after the two example directories were removed; it is a path-availability projection, not a runtime prompt trace.

| Intent | Owner and leaves listed by ROUTER.md (expanded against base) | Leaves surviving in copy after deletion |
| --- | --- | --- |
| IMPLEMENTATION | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md`, `shared/references/universal/multi-agent-research.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md`, `shared/references/universal/multi-agent-research.md` |
| CODE_QUALITY | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md`, `shared/references/universal/code-style-guide.md`; opencode: `sk-code-skilled/assets/checklists/universal-checklist.md`; review: `sk-code-review/assets/code-quality-checklist.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md`, `shared/references/universal/code-style-guide.md`, `sk-code-skilled/assets/checklists/universal-checklist.md`, `sk-code-review/assets/code-quality-checklist.md` |
| DEBUGGING | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md`, `shared/references/universal/error-recovery.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md`, `shared/references/universal/error-recovery.md` |
| VERIFICATION | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md`; opencode: `sk-code-skilled/assets/scripts/verify_alignment_drift.py`, `sk-code-skilled/references/shared/alignment-verification-automation.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md`, `sk-code-skilled/assets/scripts/verify_alignment_drift.py`, `sk-code-skilled/references/shared/alignment-verification-automation.md` |
| TESTING | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` |
| DEPLOYMENT | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` |
| PERFORMANCE | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` |
| ANIMATION | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` |
| MOTION_DEV | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` |
| FORMS | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` |
| VIDEO | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` |
| HOOKS | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md`; opencode: `sk-code-skilled/references/shared/hooks.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md`, `sk-code-skilled/references/shared/hooks.md` |
| CONFIG | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md`; opencode: `sk-code-skilled/assets/checklists/config-checklist.md`, `sk-code-skilled/references/config/quality-standards.md`, `sk-code-skilled/references/config/quick-reference.md`, `sk-code-skilled/references/config/style-guide.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md`, `sk-code-skilled/assets/checklists/config-checklist.md`, `sk-code-skilled/references/config/quality-standards.md`, `sk-code-skilled/references/config/quick-reference.md`, `sk-code-skilled/references/config/style-guide.md` |
| LANGUAGE_STANDARDS | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` |
| ACCESSIBILITY | shared: `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` | `shared/references/phase-detection.md`, `shared/references/stack-detection.md`, `shared/references/universal/code-quality-standards.md` |

### Shared and OpenCode file inventory
- `.skilled/skills/sk-code/shared/README.md` — sk-code shared — contextType: general
- `.skilled/skills/sk-code/shared/references/performance-loading-checklist.md` — Performance Loading Checklist - Deferred Loading Verification — contextType: implementation
- `.skilled/skills/sk-code/shared/references/phase-detection.md` — Phase Detection and Lifecycle — contextType: general
- `.skilled/skills/sk-code/shared/references/stack-detection.md` — Stack & Surface Detection — contextType: general
- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` — Universal Code Quality Standards — contextType: implementation
- `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md` — Universal Code Style Guide — contextType: implementation
- `.skilled/skills/sk-code/shared/references/universal/error-recovery.md` — Universal Error Recovery Decision Tree — contextType: implementation
- `.skilled/skills/sk-code/shared/references/universal/multi-agent-research.md` — Multi-Agent Research Patterns — contextType: research
- `.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md` — Universal Debugging Checklist — contextType: implementation
- `.skilled/skills/sk-code/shared/references/universal-verification-checklist.md` — Universal Verification Checklist — contextType: implementation
- `.skilled/skills/sk-code/shared/references/workflow-debug.md` — Workflow Reference - Debugging — contextType: general
- `.skilled/skills/sk-code/shared/references/workflow-implement.md` — Workflow Reference - Implementation — contextType: general
- `.skilled/skills/sk-code/shared/references/workflow-verify.md` — Workflow Reference - Verification — contextType: general
- `.skilled/skills/sk-code/sk-code-skilled/references/config/quality-standards.md` — Config Quality Standards — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/config/quick-reference.md` — Config Quick Reference — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/config/style-guide.md` — Config Style Guide — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/overview-modules-and-docs.md` — JavaScript Quality Standards — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/security-testing-and-exemptions.md` — Security, Testing, Async & Exemption Tiers — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/javascript/quick-reference.md` — JavaScript Quick Reference — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/javascript/style-guide.md` — JavaScript Style Guide — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/python/quality-standards.md` — Python Quality Standards — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/python/quick-reference.md` — Python Quick Reference — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/python/style-guide.md` — Python Style Guide — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` — Cargo/Build Baseline & Module Organization — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md` — Byte-for-Byte Determinism & Parity — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md` — Rustdoc, Error/Panic Translation & Async Patterns — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md` — Domain Modeling, Collections & Public API/ABI Contracts — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/overview-and-data-ownership.md` — Rust Quality Standards — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/collections-imports-and-errors.md` — Collections, Imports/Exports & Error Mapping — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/determinism-parity-and-related.md` — Determinism, Parity & Common Recipes — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/naming-ordering-and-signatures.md` — Naming, Section Ordering & Signature Patterns — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md` — Rust Quick Reference — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/rustdoc-and-cargo.md` — Rustdoc Template & Cargo/Build Quick Reference — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/commenting-and-rustdoc.md` — Commenting & Rustdoc Rules — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/formatting-and-imports.md` — Formatting Rules & Import/Module Ordering — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-errors-and-parity.md` — Rust/TypeScript Interop — Errors, Parity & Related Resources — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-model.md` — Rust/TypeScript Interop — Model & Boundary Types — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/naming-conventions.md` — Naming Conventions — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/overview-and-file-header.md` — Rust Style Guide — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md` — Toolchain, Compilation Baseline & Project Structure — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md` — Alignment Verification Automation — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/directory-and-test-conventions.md` — Directory & Test File Conventions — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/imports-and-exports.md` — Import Ordering & Export Patterns — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/overview-and-module-organization.md` — Code Organization - File Structure and Module Principles — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shared/hooks.md` — Runtime Hooks - Entrypoint Authoring, Wiring, and Maintenance — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md` — Universal Patterns - Cross-Language Code Standards — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/organization-security-and-examples.md` — File Organization, Security & Copy-Paste Alignment Examples — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md` — OpenCode Workflow Guardrails — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/overview-and-priority-blockers.md` — Shell Quality Standards — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/validation-security-and-shellcheck.md` — Validation, Errors, Output, Security, Review & ShellCheck — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shell/quick-reference/functions-strings-and-checklist.md` — Functions, Args, Strings, Common Patterns & Checklist — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shell/quick-reference/template-variables-and-loops.md` — Shell Quick Reference — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md` — Shell Style Guide — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/variables-functions-and-output.md` — Variables, Conditionals, Args, Functions, Errors & Output — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/overview-and-type-system.md` — TypeScript Quality Standards — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/tsconfig-and-modules.md` — tsconfig Baseline & Module Organization — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/tsdoc-errors-and-async.md` — TSDoc, Typed Error Classes & Async Patterns — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/typescript/quick-reference/imports-errors-and-tsconfig.md` — Imports/Exports, Errors, TSDoc, tsconfig & One-Liners — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/typescript/quick-reference/template-naming-and-types.md` — TypeScript Quick Reference — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md` — Formatting, Imports, Commenting & JS/TS Coexistence — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md` — TypeScript Style Guide — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/references/workflow-debug.md` — Workflow Reference - Debugging — contextType: general
- `.skilled/skills/sk-code/sk-code-skilled/references/workflow-implement.md` — Workflow Reference - Implementation — contextType: general
- `.skilled/skills/sk-code/sk-code-skilled/references/workflow-verify.md` — Workflow Reference - Verification — contextType: general
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/agent-authoring.md` — Agent Authoring Checklist — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md` — Command Authoring Checklist — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/config-checklist.md` — Config File Quality Checklist — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/javascript-checklist.md` — JavaScript Code Quality Checklist — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/mcp-server-authoring.md` — MCP Server Authoring Checklist — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/python-checklist.md` — Python Code Quality Checklist — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md` — Rust Code Quality Checklist — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md` — P0 — Safety & Boundary Discipline — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md` — P1 — Required — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md` — P2, Review Evidence, Validation Commands & Resources — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/shell-checklist.md` — Shell Code Quality Checklist — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/skill-authoring.md` — Skill Authoring Checklist — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md` — TypeScript Code Quality Checklist — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` — Universal Code Quality Checklist — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md` — sk code assets scripts: Code README — contextType: implementation
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` — router-replay-lib.cjs — 'use strict';
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py` — !/usr/bin/env python3 — """Unit-style coverage for verify_alignment_drift.py behavior."""
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_stack_folders.py` — !/usr/bin/env python3 — """Unit-style coverage for verify_stack_folders.py behavior."""
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` — !/usr/bin/env node — // ───────────────────────────────────────────────────────────────────
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` — !/usr/bin/env node — // Drift guard for the sk-code router. It restores the four checks of the retired
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py` — !/usr/bin/env python3 — """Lightweight recurring alignment checks for OpenCode codebases.
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_stack_folders.py` — !/usr/bin/env python3 — """Verify the code-skilled language reference folders.

## Findings
| Class | Claim | Evidence | Priority |
| --- | --- | --- | --- |
| ORDER | The router is explicitly surface-first, then intent; losing a surface removes its surface-owned leaves rather than transferring those leaves to OpenCode. | [SOURCE: .skilled/skills/sk-code/ROUTER.md:37]; [SOURCE: .skilled/skills/sk-code/ROUTER.md:111]; [SOURCE: .skilled/skills/sk-code/ROUTER.md:112] | P1 |
| PRESENCE | The OpenCode map has a two-file implementation baseline and direct rows for quality, verification, hooks, config, and language standards; its §6 table has no direct DEBUGGING, PERFORMANCE, DEPLOYMENT, or ACCESSIBILITY row. | [SOURCE: .skilled/skills/sk-code/ROUTER.md:204]; [SOURCE: .skilled/skills/sk-code/ROUTER.md:208]; [SOURCE: .skilled/skills/sk-code/ROUTER.md:213]; [SOURCE: .skilled/skills/sk-code/ROUTER.md:219] | P1 |
| OK | The shared tier already assigns `error-recovery.md` to DEBUGGING and `multi-agent-research.md` to IMPLEMENTATION; these can remain available after example-surface deletion. | [SOURCE: .skilled/skills/sk-code/ROUTER.md:111]; [SOURCE: .skilled/skills/sk-code/shared/references/universal/error-recovery.md:1]; [SOURCE: .skilled/skills/sk-code/shared/references/universal/multi-agent-research.md:1] | P2 |
| BREAK | In the prepared copy, deleting Webflow and Obsidian leaves those surface directories absent; the surviving per-intent leaf set is the `shared`, `opencode`, `review`, and `quality` portion in the table, with Webflow-only routes empty where no survivor is listed. | [INFERENCE: copy deletion command and post-delete path-availability projection in Actions Taken; router source rows cited above] | P1 |

## Options and Recommendation
| Option | What it changes, path:line | Cost | Risk | Cheaper move and why it fails |
| --- | --- | --- | --- | --- |
| R6 candidate | In `.skilled/skills/sk-code/ROUTER.md` §6, add `sk-code-skilled/references/workflow-debug.md` to the OpenCode DEBUGGING intent row; add `sk-code-skilled/references/workflow-implement.md` to the OpenCode IMPLEMENTATION intent row. Keep the shared `error-recovery.md` and `multi-agent-research.md` mappings. Do not map Webflow leaves into OpenCode for PERFORMANCE, DEPLOYMENT, or ACCESSIBILITY; the post-delete availability projection has no suitable surviving routed leaf there. | Small: edit existing route rows only; no new leaf files. | Those three intents still depend on a user-owned surface for domain guidance. | Cheaper move: label Webflow optional but keep the same route rows; that fails because the rows still identify paths owned by the deleted surface and do not select an OpenCode leaf. |

## Questions Answered
- Q7: F10, which shared/ or sk-code-skilled leaves could serve the stack-agnostic ROUTER.md intents once webflow is deleted, and what is the smallest fix (R6)?

## Questions Remaining
- Q8–Q12 remain for later iterations: re-mint dependency; surface-add workflow; R1–R4 stress test; other example assumptions and end-to-end flow; rejected ideas.

## Next Focus
Q8: inspect compiled-routing re-mint's dependency on `specs/sk-doc/z_archive/019-skill-routing-refactor/` and compare a cross-hub fix with documenting the pruning constraint.

## Assessment
- New information ratio: 0.875 (3 new, 1 partially new out of 4 findings).
- Questions addressed: Q7/F10.
- Questions answered: Q7/F10, based on router maps, the full requested file inventory, and post-delete path availability.
- Limitation: the executed hub script is a drift guard. No custom user-owned surface was present, so that surface's leaves and runtime tie-break behavior remain for Q8–Q12/end-to-end coverage.

## Reflection
- What worked and why: parsing the router's explicit intent rows and checking actual copy paths separates a mapped path from a surviving leaf.
- What did not work and why: the drift guard validates router synchronization but does not emit a prompt-specific load trace; do not present the availability table as runtime execution.
- What I would do differently: use a supported route-replay entry point if a later iteration needs a prompt-level load trace; this pass records the static coverage gap with exact path evidence.
