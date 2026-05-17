# Iteration 004 - Deep Review Findings

## METADATA
- Iteration: 4 / 7
- Date: 2026-05-05
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimensions: 7 (snippet runnability + JSDoc completeness), 9 (skill-router coverage)
- Cross-cutting: snippet API trace against official Motion docs

## SUMMARY
Reviewed all eight `.opencode/skills/sk-code/assets/motion_dev/snippets/*.js` files, the Motion/Webflow bootstrap examples, the `SKILL.md` smart-routing block, and router intent/resource references. All snippets have the required JSDoc tags, parse with `node --check`, use snake_case plus the cross-stack notation comment, and the non-module snippets no-op safely when `window.Motion` is absent. Found 1 P0, 1 P1, and 1 P2. The P0 is the layout snippet's undocumented global/main-package `animateLayout` export path, escalated from iteration 2's P1 under this iteration's explicit "undocumented API = P0" rule. The P1 is a new ES module bootstrap mismatch: it claims to mirror the local testimonial dynamic-import pattern, but uses an unguarded static CDN import and runs transform motion without a reduced-motion branch.

## P0 FINDINGS (Blocker - block commit)
- P0 `.opencode/skills/sk-code/assets/motion_dev/snippets/layout_transition.js:11` - The snippet uses `window.MotionPlus?.animateLayout || window.Motion?.animateLayout`, but the official Motion layout docs document `animateLayout` as Motion+ early access imported from `motion-plus/animate-layout` via `unstable_animateLayout as animateLayout`; they also state it moves to the main `"motion"` package only after alpha. Under this iteration's API-trace rule, the global `window.MotionPlus.animateLayout` and current `window.Motion.animateLayout` export paths are undocumented Motion APIs. Remediate by converting this snippet to a module-style Motion+ example using `import { unstable_animateLayout as animateLayout } from "motion-plus/animate-layout"`, or remove it from the runnable snippet set until a documented browser-global export exists.

## P1 FINDINGS (Required - should fix before commit)
- P1 `.opencode/skills/sk-code/assets/motion_dev/snippets/es_module_bootstrap.js:7` - The snippet says it matches the repo's dynamic-import testimonial pattern, but it uses a top-level static CDN import at lines 7-12. The cited local pattern in `a_nobel_en_zn/2_javascript/slider/testimonial.js:149` caches `import(MOTION_IMPORT_URL)`, and `ensureMotionApi()` catches import failures before patching `window.Motion` at lines 159-175. This snippet cannot guard a failed Motion import because module evaluation fails before its code runs. It also animates `y: [8, 0]` at `.opencode/skills/sk-code/assets/motion_dev/snippets/es_module_bootstrap.js:27` without a `prefers-reduced-motion` branch, unlike the other transform-heavy snippets. Remediate by using the dynamic `import()`/try-catch shape from `testimonial.js`, validating `typeof animate === "function"` after import, and switching the entrance effect to opacity-only or near-instant duration when reduced motion is requested.

## P2 FINDINGS (Suggestion - quality polish)
- P2 `.opencode/skills/sk-code/assets/motion_dev/snippets/timeline_sequence.js:14` - The snippet catalog has no runnable `stagger()` example even though the router marks `stagger` as a MOTION_DEV intent signal in `.opencode/skills/sk-code/references/router/intent_classification.md:24`, and official Motion docs list `stagger` as a first-class utility for delayed multi-element animation. `timeline_sequence.js` already animates `[data-motion-item]` elements, so it is the natural place to import/guard `stagger` and use `delay: stagger(...)`; alternatively add a dedicated `stagger_sequence.js` snippet. This is not a broken API claim, but it leaves a named review-surface API without runnable coverage.

## POSITIVE OBSERVATIONS
- JSDoc completeness passed for all eight snippets: each file has `@title`, `@description`, `@source`, and `@example`.
- Syntax parse passed for all eight snippets with `node --check`.
- Runtime safety without Motion passed for all non-module snippets: `animate_on_scroll.js`, `cdn_bootstrap.js`, `hover_gesture.js`, `in_view_reveal.js`, `layout_transition.js`, `spring_animation.js`, and `timeline_sequence.js` all no-op without throwing when `window.Motion` is absent.
- `cdn_bootstrap.js:14` through `cdn_bootstrap.js:21` mirrors the local `nav_dropdown.js` guard shape: destructure from `window.Motion || {}`, verify `animate` is a function, then initialize only when the target exists.
- Router coverage is discoverable: `intent_classification.md:24` includes MOTION_DEV signals, `intent_classification.md:43` says Motion.dev is a resource intent after surface detection, and `resource_loading.md:39` through `resource_loading.md:51` maps `references/motion_dev/` and `assets/motion_dev/` as a peer category.
- Routing precedence still holds in the checked cases: Webflow context with `from "motion"` routes WEBFLOW, and an `.opencode/` target still routes OPENCODE before Webflow library markers.

## SNIPPET API TRACE
| Snippet | Motion APIs used | Official-doc cross-check | Notes |
|---|---|---|---|
| `animate_on_scroll.js` | `animate`, `scroll` | Documented by Motion `animate` and `scroll` docs; `scroll(animation)` is documented. | Reduced-motion branch uses opacity instead of transform scale. |
| `cdn_bootstrap.js` | `animate` | Documented by Motion `animate` and quick-start CDN global examples. | Guarded against missing `window.Motion.animate`. |
| `es_module_bootstrap.js` | `animate`, `inView`, `motionValue`, `scroll` imports/exposure | All four are documented exports, but the static import does not mirror the repo dynamic-import pattern. | See P1. |
| `hover_gesture.js` | `animate`, `hover` | Both documented; `hover` supports selector targets and cleanup callback. | Reduced-motion branch uses opacity. |
| `in_view_reveal.js` | `animate`, `inView` | Both documented; `inView` supports selector targets and cleanup return. | Reduced-motion branch uses near-instant opacity. |
| `layout_transition.js` | `animateLayout` via `window.MotionPlus` / `window.Motion` | `animateLayout` is documented, but these export paths are not documented current exports. | See P0. |
| `spring_animation.js` | `animate`, `spring` | Both documented; using `spring` as `type` is documented for mini-style spring transitions. | Reduced-motion branch uses near-instant opacity. |
| `timeline_sequence.js` | `animate(sequence)` | Documented by Motion `animate` sequence docs. | Missing `stagger()` coverage; see P2. |

## URL RESOLUTION CHECK
The seven distinct `@source` URLs resolved through browser/web fetch: `https://motion.dev/docs/scroll`, `quick-start`, `hover`, `inview`, `layout-animations`, `spring`, and `animate`. Local shell HEAD probes returned `000` for every URL due restricted DNS/network behavior, matching iteration 2's local-curl limitation rather than a confirmed HTTP failure.

## DIMENSION COVERAGE
- Dimension 7 (snippet runnability + JSDoc): COVERED; audited all eight snippet files for JSDoc, syntax parsing, Motion guards, snake_case/cross-stack comments, reduced-motion branches, source URL availability, and local bootstrap-pattern alignment.
- Dimension 9 (skill-router coverage): COVERED; audited `SKILL.md` smart routing, `references/router/code_surface_detection.md`, `references/router/intent_classification.md`, and `references/router/resource_loading.md`; ran a small detection probe for Webflow Motion marker behavior and OPENCODE precedence.
- Cross-cutting snippet API trace: COVERED; every snippet's Motion API usage is listed above and checked against official Motion docs.

## NEXT ITERATION RECOMMENDATIONS
- Treat the layout snippet as a blocker until the export path is changed to documented Motion+ module import form or removed from runnable assets.
- Recheck `es_module_bootstrap.js` after remediation against the exact `testimonial.js` dynamic-import/catch/patch pattern and reduced-motion behavior.
- Iteration 5 should keep the active P0/P1 registry in mind when auditing continuity docs, because Packet 2's implementation summary currently presents all eight snippets as runnable.
