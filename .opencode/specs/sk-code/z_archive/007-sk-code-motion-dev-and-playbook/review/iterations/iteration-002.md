# Iteration 002 — Deep Review Findings

## METADATA
- Iteration: 2 / 7
- Date: 2026-05-05
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimensions: 2 (citation discipline), 8 (anti-pattern audit)
- Cross-cutting: motion.dev URL resolution probe

## SUMMARY
Reviewed all six `.opencode/skills/sk-code/references/motion_dev/*.md` files, both `.opencode/skills/sk-code/assets/motion_dev/*.md` files, and the Motion snippet assets for API anti-patterns. Sampled 42 API claims across the markdown targets and checked their cited official Motion URLs or in-repo file paths. Found 2 new P1 findings: a stale `https://motion.dev/docs/timeline` citation repeated across sequence/timeline guidance, and a layout snippet that claims `animateLayout` is available from `window.MotionPlus` or `window.Motion` even though the official docs currently require importing `unstable_animateLayout` from `motion-plus/animate-layout`. No P0 findings were confirmed because local `curl -sI` probes returned `000` from DNS failure rather than a 4xx/5xx status.

## P0 FINDINGS (Blocker — block commit)
- No confirmed P0 findings. URL HEAD probes could not resolve `motion.dev` locally and returned exact status `000`; no sampled URL returned a 4xx or 5xx status code from `curl`.

## P1 FINDINGS (Required — should fix before commit)
- P1 `.opencode/skills/sk-code/references/motion_dev/animate_and_timelines.md:31` — The file lists `https://motion.dev/docs/timeline` as an official timeline source, and repeats it at `.opencode/skills/sk-code/references/motion_dev/animate_and_timelines.md:50` and `.opencode/skills/sk-code/references/motion_dev/animate_and_timelines.md:139`; `.opencode/skills/sk-code/references/motion_dev/quick_start.md:82` and `.opencode/skills/sk-code/references/motion_dev/quick_start.md:109` do the same. Current official Motion navigation exposes `animate`, `scroll`, `animateView`, and `animateLayout`, but not a standalone `timeline` page; the official sequence documentation is under `https://motion.dev/docs/animate`. Replace `https://motion.dev/docs/timeline` citations with `https://motion.dev/docs/animate`, or add a verified current URL if Motion restores a standalone timeline page.
- P1 `.opencode/skills/sk-code/assets/motion_dev/snippets/layout_transition.js:11` — The snippet probes `window.MotionPlus?.animateLayout || window.Motion?.animateLayout`, but the official layout-animation docs say `animateLayout` is early access, requires Motion+, and is imported as `unstable_animateLayout as animateLayout` from `motion-plus/animate-layout`; they also say it will move to the main `"motion"` package only after alpha. This creates a fabricated browser-global/main-package behavior path. Convert the snippet to a module-style `motion-plus/animate-layout` example, or explicitly mark the global form as hypothetical and remove it from runnable snippets.

## P2 FINDINGS (Suggestion — quality polish)
- No P2 findings.

## POSITIVE OBSERVATIONS
- The requested kebab-case residual grep returned zero matches: `grep -rn "motion_dev/[a-z]*-[a-z]" .opencode/skills/sk-code/ specs/sk-code/z_archive/007-sk-code-motion-dev-and-playbook/`.
- All sampled in-repo file path citations resolved locally, including `a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js`, `a_nobel_en_zn/2_javascript/slider/testimonial.js`, the Webflow animation/performance references, and the manual-testing playbook paths.
- The main API claims for `animate`, `scroll`, `inView`, `hover`, `press`, `spring`, `stagger`, `motionValue`, `motion/mini`, and `animateLayout` map to official Motion documentation pages.
- No telemetry claims were found in the audited Motion docs/assets. The Motion+ early-access claim for `animateLayout` is accurate; the problem is only the undocumented global export path in the snippet.

## DIMENSION COVERAGE
- Dimension 2 (citation discipline): COVERED; sampled 42 API claims across all six `references/motion_dev/*.md` files and both `assets/motion_dev/*.md` files, checking each sampled source against official Motion docs or local file existence.
- Dimension 8 (anti-pattern audit): COVERED; checked API mentions for `animate`, `scroll`, `inView`, `spring`, `motionValue`, `stagger`, `animateMini`/`motion/mini`, `hover`, `press`, and `animateLayout`; checked telemetry/Motion+ claims; reran the kebab-case residual path grep.
- Cross-cutting URL resolution probe: COVERED with 14 distinct Motion URLs. Local `curl -sI -o /dev/null -w "%{http_code}"` returned `000` for all sampled `motion.dev` URLs because the shell environment could not resolve `motion.dev`; official docs were cross-checked through browser/web retrieval where possible.

### API Claim Citation Sample

| File:line | API claim text | Cited source | Source resolves |
|---|---|---|---|
| `.opencode/skills/sk-code/references/motion_dev/quick_start.md:20` | Motion hybrid engine can animate HTML/CSS, SVG, WebGL, independent transforms, CSS variables, objects, and strings/colors/numbers. | `https://motion.dev/docs/quick-start`, `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/quick_start.md:41` | Script-tag usage should replace `latest` with a concrete version. | `https://motion.dev/docs/quick-start` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/quick_start.md:81` | `animate` creates/controls animations for selectors, elements, values, objects, and sequences. | `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/quick_start.md:83` | `inView` triggers callbacks when elements enter/leave viewport via Intersection Observer. | `https://motion.dev/docs/inview` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/quick_start.md:87` | `motion/mini` provides tree-shakable mini `animate` for HTML/SVG styles. | `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/quick_start.md:82` | Timeline/sequence behavior is documented by standalone timeline source. | `https://motion.dev/docs/timeline` | No; see P1 |
| `.opencode/skills/sk-code/references/motion_dev/integration_patterns.md:39` | Quick start documents script-tag usage for basic HTML/no-code/Webflow and version pinning. | `https://motion.dev/docs/quick-start` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/integration_patterns.md:55` | Bundled projects should use package imports for dependency resolution and tree-shaking. | `https://motion.dev/docs/quick-start`, `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/integration_patterns.md:65` | Local dynamic import patches `window.Motion` with `animate`, `inView`, `scroll`, and `motionValue`. | `a_nobel_en_zn/2_javascript/slider/testimonial.js` | Yes; file exists |
| `.opencode/skills/sk-code/references/motion_dev/integration_patterns.md:87` | DOM-targeting `animate()`, `scroll()`, `hover()`, and `inView()` require client DOM availability. | `https://motion.dev/docs/animate`, `https://motion.dev/docs/scroll`, `https://motion.dev/docs/inview`, `https://motion.dev/docs/hover` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/integration_patterns.md:88` | `motion/mini` fits small HTML/SVG style animation. | `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/scroll_and_gestures.md:40` | `scroll()` accepts a progress callback or an animation returned from `animate()`. | `https://motion.dev/docs/scroll` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/scroll_and_gestures.md:51` | `scroll()` options include `axis`, `container`, `target`, and `offset`. | `https://motion.dev/docs/scroll` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/scroll_and_gestures.md:55` | `inView()` accepts selector, `Element`, or array and passes element plus `IntersectionObserverEntry`. | `https://motion.dev/docs/inview` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/scroll_and_gestures.md:73` | `hover()` filters touch-emulated hover, accepts selectors/elements, and returns a cancel function. | `https://motion.dev/docs/hover` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/scroll_and_gestures.md:74` | `press()` filters secondary pointer events and supports keyboard access. | `https://motion.dev/docs/press` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/performance_and_pitfalls.md:39` | `scroll()` can use ScrollTimeline where supported for smoother browser-run scroll animations. | `https://motion.dev/docs/scroll` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/performance_and_pitfalls.md:58` | Mini `animate()` supports HTML/SVG style animation; hybrid supports independent transforms, sequences, CSS variables, objects, WebGL. | `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/performance_and_pitfalls.md:61` | `motion/mini` or `animateMini`-style guidance fits small bundled interactions. | `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/performance_and_pitfalls.md:67` | React/Vue docs provide reduced-motion helpers/configuration. | `https://motion.dev/docs/react-use-reduced-motion`, `https://motion.dev/docs/react-accessibility`, `https://motion.dev/docs/vue-motion-config` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/performance_and_pitfalls.md:96` | Use `scroll()` where supported so browser can use ScrollTimeline. | `https://motion.dev/docs/scroll` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/decision_matrix.md:55` | Motion supports programmatic animation via `animate()`, sequences, `scroll()`, and `inView()`. | `https://motion.dev/docs/animate`, `https://motion.dev/docs/scroll`, `https://motion.dev/docs/inview` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/decision_matrix.md:61` | Motion offers JavaScript/React/Vue animation with small imports and browser acceleration. | `https://motion.dev/docs/quick-start`, `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/decision_matrix.md:78` | Motion is appropriate for sequence arrays, controls, interruption, scroll, and viewport entry. | `https://motion.dev/docs/animate`, `https://motion.dev/docs/scroll`, `https://motion.dev/docs/inview` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/decision_matrix.md:86` | Motion's WAAPI comparison covers springs, defaults, `.finished`, seconds durations, `stop()`, partial keyframes, interruption, bezier arrays, and independent transforms. | `https://motion.dev/docs/improvements-to-the-web-animations-api-dx` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/decision_matrix.md:94` | Motion offers `animate()`, sequences, `scroll()`, `inView()`, `hover()`, `press()`, `spring()`, and motion values. | `https://motion.dev/docs/animate`, `https://motion.dev/docs/scroll`, `https://motion.dev/docs/inview`, `https://motion.dev/docs/hover`, `https://motion.dev/docs/press`, `https://motion.dev/docs/spring` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/animate_and_timelines.md:39` | Hybrid `animate()` accepts selectors/elements plus values, objects, motion values, and sequences. | `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/animate_and_timelines.md:65` | Motion options include `duration`, `delay`, `ease`, `repeat`, per-value overrides, and seconds-based durations. | `https://motion.dev/docs/animate`, `https://motion.dev/docs/improvements-to-the-web-animations-api-dx` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/animate_and_timelines.md:88` | Sequence timing supports `at: "<"`, `"+0.5"`, `"-0.2"`, `"<0.5"`, and `"<-0.2"`. | `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/animate_and_timelines.md:100` | `defaultTransition` can set default segment timing and segment options can override it. | `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/animate_and_timelines.md:104` | Motion documents mini and hybrid `animate` sizes with hybrid supporting independent transforms, CSS variables, SVG paths, sequences, objects, and WebGL. | `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/references/motion_dev/animate_and_timelines.md:134` | Local slider uses `motionValue`, dynamic Motion import, and inertia options. | `a_nobel_en_zn/2_javascript/slider/testimonial.js`, `https://motion.dev/docs/animate` | Yes; local file exists and official docs fetch |
| `.opencode/skills/sk-code/assets/motion_dev/install_card.md:26` | Examples use pinned `12.38.0`; quick start recommends replacing `latest` with concrete versions. | `https://motion.dev/docs/quick-start`, `https://motion.dev/` | Yes via official docs/home fetch |
| `.opencode/skills/sk-code/assets/motion_dev/install_card.md:39` | CDN ESM imports `animate`, `inView`, `scroll`, and `motionValue`. | Related resource `https://motion.dev/docs/quick-start`; API docs for each export | Yes via official docs fetch |
| `.opencode/skills/sk-code/assets/motion_dev/install_card.md:53` | NPM import exposes `animate`, `inView`, and `scroll`. | `https://motion.dev/docs/quick-start`, related resource at line 101 | Yes via official docs fetch |
| `.opencode/skills/sk-code/assets/motion_dev/install_card.md:67` | `motion/mini` can be imported and aliased as `animateMini`. | `https://motion.dev/docs/animate`, related resource at line 102 | Yes via official docs fetch |
| `.opencode/skills/sk-code/assets/motion_dev/install_card.md:95` | ES module import exposes `animate`. | `https://motion.dev/docs/quick-start`, `https://motion.dev/docs/animate` | Yes via official docs fetch |
| `.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md:29` | Smoke page imports `animate`, `inView`, and `spring` from a pinned CDN URL. | `references/motion_dev/quick_start.md`, `references/motion_dev/animate_and_timelines.md`, `references/motion_dev/scroll_and_gestures.md`, related URLs at line 127 | Yes; in-repo references exist and official docs fetch |
| `.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md:34` | `animate`, `inView`, and `spring` should be functions. | `references/motion_dev/quick_start.md`, related URLs at line 127 | Yes; in-repo references exist and official docs fetch |
| `.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md:53` | Pinned ESM bundle exposes `animate`, `inView`, `scroll`, and `motionValue`. | `references/motion_dev/quick_start.md`, `references/motion_dev/integration_patterns.md`, `assets/motion_dev/install_card.md` | Yes; in-repo references exist |
| `.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md:75` | Reduced motion should disable, shorten, or replace transform-heavy movement. | `references/motion_dev/performance_and_pitfalls.md`; official reduced-motion URLs at line 129 | Yes; in-repo reference exists and official docs fetch |
| `.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md:98` | Dropdown and testimonial slider regressions should catch Motion import/runtime errors. | `references/motion_dev/animate_and_timelines.md`, `references/motion_dev/scroll_and_gestures.md`, `references/motion_dev/performance_and_pitfalls.md` | Yes; in-repo references exist |

### URL Resolution Probe

Exact local command shape: `curl -sI -o /dev/null -w "%{http_code}" <URL>`.

| URL | curl HEAD status | Notes |
|---|---:|---|
| `https://motion.dev/docs/quick-start` | `000` | Local DNS failure: `Could not resolve host: motion.dev`; official page fetched via browser/web |
| `https://motion.dev/docs/animate` | `000` | Local DNS failure; official page fetched via browser/web |
| `https://motion.dev/docs/inview` | `000` | Local DNS failure; official page fetched via browser/web |
| `https://motion.dev/docs/scroll` | `000` | Local DNS failure; official page fetched via browser/web |
| `https://motion.dev/docs/spring` | `000` | Local DNS failure; official page fetched via browser/web |
| `https://motion.dev/docs/hover` | `000` | Local DNS failure; official page fetched via browser/web |
| `https://motion.dev/docs/press` | `000` | Local DNS failure; official page fetched via browser/web |
| `https://motion.dev/docs/timeline` | `000` | Local DNS failure; browser/web resolution did not find a current official timeline page; see P1 |
| `https://motion.dev/docs/layout-animations` | `000` | Local DNS failure; official page fetched via browser/web |
| `https://motion.dev/docs/react-accessibility` | `000` | Local DNS failure; official page fetched via browser/web |
| `https://motion.dev/docs/vue-motion-config` | `000` | Local DNS failure; official page fetched via browser/web |
| `https://motion.dev/docs/gsap-vs-motion` | `000` | Local DNS failure; official page fetched via browser/web |
| `https://motion.dev/docs/improvements-to-the-web-animations-api-dx` | `000` | Local DNS failure; official page fetched via browser/web |
| `https://motion.dev/` | `000` | Local DNS failure; official home fetched via browser/web |

## NEXT ITERATION RECOMMENDATIONS
- Recheck the P1 timeline citation after remediation and confirm no `https://motion.dev/docs/timeline` references remain in `references/motion_dev/` or `assets/motion_dev/`.
- Recheck the layout transition snippet against the official `motion-plus/animate-layout` import form, including the `unstable_animateLayout as animateLayout` naming and Motion+ install requirement.
- In iteration 3, include these two files in the cross-reference correctness sample because both findings are source-link/API-contract drift rather than implementation bugs.
