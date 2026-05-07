---
title: Router Reference - Intent Classification
description: Weighted intent scoring after WEBFLOW or OPENCODE surface detection.
---

# Router Reference - Intent Classification

Intent classification runs after code-surface detection and before resource loading.

---

## 1. OVERVIEW

### Purpose

Classify task text into the dominant work intent so the router can load the smallest relevant reference set after surface detection.

### When to Use

- After WEBFLOW, OPENCODE, or UNKNOWN surface detection.
- When task wording includes implementation, debugging, verification, deployment, or standards signals.
- When multiple resource families could match and intent scoring must select the primary path.
- When Motion.dev terms appear and need routing as a resource intent rather than a surface.

### Core Principle

Intent classification scores task text against weighted keyword signals to pick the dominant work type after surface detection.

### Key Sources

- [code_surface_detection.md](./code_surface_detection.md)
- [resource_loading.md](./resource_loading.md)

---

## 2. INTENTS

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

---

## 3. SCORING

1. Sum weighted keyword hits from the request, target files, and known task context.
2. Boost explicit phase signals: verification, debugging, testing, code quality.
3. Select the top intent.
4. Select a second intent when the score delta is small.
5. For OPENCODE, run language sub-detection after intent selection.

### Doc-Only Edit Anti-Signals

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

---

## 4. SURFACE-SPECIFIC NOTES

- WEBFLOW intent scoring favors browser/runtime terms, animation, forms, video, performance, deployment, and verification.
- MOTION_DEV intent scoring favors Motion API, timeline, scroll/gesture, performance, import-mode, snippet, and decision_matrix terms; it supplements the detected surface rather than replacing it.
- OPENCODE intent scoring favors language standards, hooks, config, scripts, advisor/tests, metadata, and alignment verification.
- Unsupported surfaces stay UNKNOWN even if intent scoring is strong.

---

## 5. RELATED RESOURCES

- `references/router/code_surface_detection.md`
- `references/router/resource_loading.md`
- `references/router/phase_lifecycle.md`
