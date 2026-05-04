---
title: Router Reference - Intent Classification
description: Weighted intent scoring after WEBFLOW or OPENCODE surface detection.
---

# Router Reference - Intent Classification

Intent classification runs after code-surface detection and before resource loading.

---

## 1. INTENTS

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
| FORMS | `form`, `validation`, `filepond`, `schema`, `zod` |
| VIDEO | `hls`, `video`, `stream`, `player` |
| HOOKS | `hook`, `session-prime`, `user-prompt-submit`, `pre-tool-use`, `post-tool-use` |
| CONFIG | `json`, `jsonc`, `schema`, `descriptor`, `config` |
| LANGUAGE_STANDARDS | `typescript`, `python`, `shell`, `commonjs`, `strict`, `docstring` |

---

## 2. SCORING

1. Sum weighted keyword hits from the request, target files, and known task context.
2. Boost explicit phase signals: verification, debugging, testing, code quality.
3. Select the top intent.
4. Select a second intent when the score delta is small.
5. For OPENCODE, run language sub-detection after intent selection.

Multi-symptom prompts like `fix Webflow animation flicker` should load both DEBUGGING and ANIMATION. Prompts like `update TypeScript advisor fixture` should load OPENCODE plus LANGUAGE_STANDARDS and CODE_QUALITY.

---

## 3. SURFACE-SPECIFIC NOTES

- WEBFLOW intent scoring favors browser/runtime terms, animation, forms, video, performance, deployment, and verification.
- OPENCODE intent scoring favors language standards, hooks, config, scripts, advisor/tests, metadata, and alignment verification.
- Unsupported surfaces stay UNKNOWN even if intent scoring is strong.

---

## 4. RELATED RESOURCES

- `references/router/code_surface_detection.md`
- `references/router/resource_loading.md`
- `references/router/phase_lifecycle.md`
