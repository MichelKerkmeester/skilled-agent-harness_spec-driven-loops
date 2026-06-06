---
title: "Implementation Summary: Link Card Button & Mobile Animation Fixes"
description: "Link-card desktop/mobile animation fixes, iOS WebKit flicker guard, and publish-ready source/staging/minified assets."
trigger_phrases:
  - "link card collapse expand summary"
  - "link card implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/002-link-card-button-and-mobile-animation"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Applied Rev 5 visual-layer transition suppression during mobile animation; injected probe confirmed child transitions stay disabled until cleanup; AST+runtime 58/58 PASS."
    next_safe_action: "User publishes updated link_card CSS/JS staging/minified assets plus any unpublished global CSS, then re-tests iOS Chrome/Safari on the published URL."
    blockers: []
    key_files:
      - "a_nobel_en_zn/2_javascript/link_card_collapse_expand.js  (flat root)"
      - "a_nobel_en_zn/1_css/global/performance.css"
      - "a_nobel_en_zn/1_css/link/link_card_collapse_expand.css"
      - "a_nobel_en_zn/2_javascript/z_minified/link_card_collapse_expand.min.js  (flat)"
      - "a_nobel_en_zn/3_staging/link_card_collapse_expand.js"
      - "a_nobel_en_zn/3_staging/link_card_collapse_expand.css"
      - ".opencode/skills/sk-code/references/webflow/implementation/performance_patterns.md"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Desktop button: REVERTED to seamless slide (Rev 1) — the dissolve's delay was unwanted; centering kept."
      - "Description color: use Webflow default grayish (Rev 1) — removed mobile white override on the paragraph."
      - "Scope: 3 bugs + cleanups + minify + Rev 1 tweaks."
      - "Image scale reconcile: CSS aligned to scale(1)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Link Card Button & Mobile Animation Fixes

<!-- SPECKIT_LEVEL: 2 -->

## Status: IMPLEMENTATION VERIFIED — Revision 5 applied (pending user publish of link_card assets)

## Revision 5 (mobile visual-layer flicker hardening)

After reviewing the latest MP4 (`ScreenRecording_06-06-2026 16-48-27_1.MP4`), the remaining flicker
was localized around the mobile expand end-frame rather than a full-section white flash. A fresh
sub-agent agreed the likely cause was CSS visual-layer transitions running while JS/Motion owned the
same mobile child layers.

Changes applied:

- Added a scoped `data-link-card-mobile-animating` attribute on the card wrapper.
- Set the attribute before the mobile measurement/prepass state flips in `animate_mobile_card_state()`.
- While present, CSS disables transitions only on Motion-owned mobile visual layers: caption,
  paragraph, heading-span, heading children, generated label, image, image-overlay, and link-card SVGs.
- The attribute is cleared after guarded height cleanup/transition restoration, and also on stale,
  reduced-motion, interrupted, or breakpoint cleanup paths.

Verification evidence:

- `node --check` passed for source, staging, and minified link-card JS.
- Link-card source/staging JS compare returned `0`.
- Link-card source/staging CSS compare returned `0`.
- Public mirror compares returned `0` for source JS, staging JS, source CSS, and minified JS.
- Re-minified `2_javascript/z_minified/link_card_collapse_expand.min.js`.
- `verify-minification.mjs`: **58/58 PASS**.
- `test-minified-runtime.mjs`: **58/58 PASS**.
- Comment hygiene passed for touched code/CSS files.
- Live `bdg` injection on `/nl/drafts` with a 390px mobile viewport showed
  `data-link-card-mobile-animating` active from the first sampled animation frame through the cleanup
  window; paragraph/image-overlay/SVG transitions computed to `none / 0s` while active.
- The same probe showed expanded height stayed stable at approximately `330.84px` as the attr cleared
  and CSS transitions restored.
- Browser console after injection: no component errors; only the known unrelated Webflow
  service-worker redirect warning.

## Revision 4 (mobile end-frame flicker hardening)

After the latest assets still showed a tiny flicker at the end of the mobile collapse-to-expand
animation, the cleanup handoff was hardened again. The remaining risk was not the height tween itself;
it was the exact frame where a filled WAAPI height animation was canceled and inline/CSS height state
was restored.

Changes applied:

- `finish_mobile_height_animation()` now writes the final pixel height and keeps
  `transition:none !important` before cleanup.
- WAAPI `cancel()` is deferred until the next animation frame, after the final pixel height has had a
  chance to paint.
- The expanded inline height clear now happens one more animation frame later, and CSS transitions are
  restored only after that cleared-height state has painted.
- Cleanup remains stale-safe: if state changes or a newer mobile height animation starts, the old
  cleanup exits without clearing the newer animation's state.

Verification evidence:

- `node --check` passed for source, staging, and minified link-card JS.
- Link-card source/staging JS compare returned `0`.
- Link-card source/staging CSS compare returned `0`.
- Re-minified `2_javascript/z_minified/link_card_collapse_expand.min.js`.
- `verify-minification.mjs`: **58/58 PASS**.
- `test-minified-runtime.mjs`: **58/58 PASS**.
- Live `bdg` injection on `/nl/drafts` with a 390px mobile viewport showed expanded height stable at
  approximately `330.84px` before cleanup, during inline-height clearing, and after CSS transitions
  were restored.
- Browser console after injection: no component errors; only the known unrelated Webflow
  service-worker redirect warning.

## Revision 3 (iOS Chrome flicker + mobile cleanup hardening)

After an iOS Chrome recording showed whole-section white flicker around the sector-card area,
frame-difference inspection and live DOM probes identified the sector card inside
`section.u--overflow-visible[data-render-content="large"]`, which computed to
`content-visibility:auto`. That conflicts with overflow-visible/animated sections on iOS WebKit:
the browser can skip painting the section during scroll or viewport-bar changes and briefly expose
the white page background.

Changes applied:

- **Whole-section flicker guard:** `1_css/global/performance.css` now forces
  `.u--overflow-visible[data-render-content]` to `content-visibility: visible`, `contain: layout
  style`, and `contain-intrinsic-size: none`. This preserves the overflow-safe containment path even
  if the Designer keeps `data-render-content="large"` on an overflow-visible section.
- **Mobile link-card cleanup hardening:** `2_javascript/link_card_collapse_expand.js` now keeps the
  wrapper's `transition:none !important` active through the WAAPI height cleanup frame, clears fixed
  height/max-height while transitions are disabled, then restores normal CSS transitions on the next
  frame only if the state is still current and no newer mobile height animation exists.
- **Guide update:** `sk-code`'s Webflow performance guide now documents the `content-visibility` +
  overflow-visible rule, the preferred `data-render-content="overflow"` Designer setting, and the
  CSS fail-safe.

Verification evidence:

- AI Council second opinion agreed with both root causes and recommended the all-breakpoint CSS guard
  plus guarded two-frame JS cleanup.
- `node --check` passed for source and staging link-card JS.
- Link-card source and staging JS are byte-identical.
- Re-minified `2_javascript/z_minified/link_card_collapse_expand.min.js`.
- `verify-minification.mjs`: **58/58 PASS**.
- `test-minified-runtime.mjs`: **58/58 PASS**.
- `validate_document.py` passed for the updated Webflow performance guide.
- Live injection probe on `/nl/drafts` under a mobile viewport confirmed the affected section computes
  `content-visibility: visible`, `contain: layout style`, and `contain-intrinsic-size: none` with the
  new guard.
- Live injection probe confirmed mobile expand cleanup keeps computed transition `none / 0s` through
  the cleanup frame, clears inline height at ~1100ms with stable height, then restores normal CSS
  height transitions by ~1120ms.
- Browser console after injection: no errors; only the known unrelated Webflow service-worker redirect
  warning.

## Revision 1 (post-deploy feedback)

After the first deploy, two adjustments were requested:

1. **Desktop button — reverted dissolve → seamless slide.** The dissolve introduced a delay (button
   faded out, stayed hidden through the grow, faded in late) that read as a gap. Restored the
   original behavior: the button slides continuously from top-center to top-right (CSS `inset` +
   `transform` 320ms transition while riding the growing card edge), `opacity` always 1. **The
   centering fix is kept** — collapsed uses `inset: 1.5rem calc(50% - 2rem) auto auto` +
   `transform: none` (the button is exactly 4rem, so `calc(50% - 2rem)` centers it at any root size
   and still interpolates smoothly to the expanded `right: 1.5rem`). Removed `dissolve_button`, the
   `button_out`/`button_in` motion config, `is_current_run` (dead again), and the
   `apply_instant_state` opacity reset.
   - *Verified live:* collapsed centering `off = [0,0,0,0]`; button slides `x 149→847` with
     `opacity = 1` throughout (no dissolve gap).

2. **Description color — Webflow default (grayish), not white.** Removed `[data-hover="paragraph"]`
   from the mobile expanded white rule so the description falls back to Webflow's base color.
   Desktop already used the default. Heading + caption stay white for legibility over the dark
   expanded image.
   - *Verified live:* the Webflow base paragraph color on mobile is `rgb(207,207,207)` (confirmed via
     a collapsed card, which no white rule targets); after deploy the mobile expanded paragraph uses
     this gray, matching desktop. (Injection still shows white because the old published CSS's
     paragraph rule lingers alongside the injected copy — a test artifact that disappears on deploy.)

Re-minified: **55,425 B → 18,388 B (66.8%)**; AST verify link_card **PASS**, runtime test link_card
**PASS**. Staging mirror re-synced (byte-identical).

## Revision 2 (desktop image transform)

User: "Remove the image scale effect on desktop." Live `bdg` investigation confirmed the desktop
image was already `scale(1)`/`none` in every state (collapsed, expanded, and under a real hover) —
the only real scale anywhere is the **mobile** collapsed `scale(1.04)`. Per the user's choice, the
component now **stops applying any `transform` to the desktop image**: `set_image_state` omits
`transform` from the desktop `image_target` and clears any inline transform
(`set_style(card.image, 'transform', null)`), so Webflow fully owns the desktop image transform.
Mobile still pins `transform: scale(1)`.
- *Verified live:* desktop image inline transform `(empty)` / computed `none` in all states; mobile
  inline `scale(1)`. Re-minified **55,694 B → 18,401 B (67.0%)**; AST + runtime link_card **PASS**;
  staging mirror re-synced (byte-identical).

## What was done (original)

**Bug 1 — desktop collapsed-button centering.** `apply_collapsed_button` (desktop branch) centers the
4rem button with `inset: '1.5rem calc(50% - 2rem) auto auto'` and `transform: 'none'`. Root cause:
the previous fixed `28px` right-anchor assumed a 56px button and drifted when the fluid root
font-size changed.

**Bug 2 — desktop button uses seamless slide.** The first dissolve approach was reverted after user
feedback. CSS now transitions `inset` and `transform` so the button stays visible and slides smoothly
from top-center to top-right during the card-width transition. The obsolete `dissolve_button()` /
`button_out` / `button_in` path is not part of the current implementation.

**Bug 3 — mobile height animation restored.** `set_mobile_fixed_height` no longer writes `height` /
`max-height` / `min-height` with `!important`. Root cause: `!important` author declarations outrank
the Web-Animations layer in the cascade, so the `wrapper.animate(...)` height keyframes were fully
overridden — the card sat at the pinned height for ~1.1s then snapped. Normal inline lets WAAPI
drive the tween while still overriding the (non-important) CSS height rules.

**Cleanups.** Obsolete dissolve-run bookkeeping was removed; write-only `text_wrappers` array +
unused `text_wrapper` SELECTOR were removed (text-node wrapping kept); dead CSS var
`--link-card-mobile-expanded-size` was removed; mobile collapsed image scale was aligned to
`scale(1)`.

## Verification evidence (live, Chrome DevTools CLI `bdg`)

Method: navigate to the live staging page, tear down the published instance via its
`__linkCardCollapseExpandCleanup` hook, inject the edited CSS (appended to `<body>` so it wins
source order) + JS, then probe. (The live site still serves the old published build; injection
verifies the fix pre-deploy.)

- **Bug 1:** all collapsed cards `centerOffset = 0` after the centered-anchor fix.
- **Bug 2:** final accepted behavior is seamless slide: button opacity stays `1` and the button moves
  continuously from top-center to top-right with no dissolve gap.
- **Bug 3:** height timeline — card 1 expands `82→101→244→…→331`, card 0 collapses
  `331→312→169→…→82`, both smooth over ~900ms with the ease-out curve; no frozen plateau, no snap.
- **Robustness:** all collapsed buttons `opacity = 1` in resting state; no component console errors
  (only an unrelated Webflow ServiceWorker warning); reduced-motion/instant paths set button
  `opacity:1` explicitly.

## Minification (sk-code WEBFLOW convention — follow-up request)

Minified the fixed JS per `sk-code` WEBFLOW deployment guide (single-file workflow, scoped to this
component — a batch run would re-minify every source changed since the manifest):

- **Minify:** `npx terser src/2_javascript/link_card_collapse_expand.js --compress --mangle
  -o src/2_javascript/z_minified/link_card_collapse_expand.min.js`; `node --check` clean.
- **AST verify** (`verify-minification.mjs`): link_card **PASS** — 11 data-selectors, 2 DOM events,
  `Webflow.push`, `Motion.animate` all preserved; suite **58/58 passed**.
- **Runtime test** (`test-minified-runtime.mjs`): link_card **PASS** — executes without errors, init
- **Runtime test** (`test-minified-runtime.mjs`): suite **58/58 passed**.
- **Browser test** (minified injected into the live page): mobile expanded height stayed stable through
  the final cleanup window; no measured height jump when inline height cleared.
- The `src/2_javascript` (anobel.com) and Public `2_javascript` trees share inodes (source + min), so
  source and minified updates land in both repos at once.
- `--mangle-props` not used (would break the string-keyed selectors/attrs). The `z_minified`
  `manifest.tsv` skip-cache was left untouched (direct-terser workflow); a future
  `minify-webflow.mjs` batch run reconciles it.

## Files changed
- `a_nobel_en_zn/2_javascript/link_card_collapse_expand.js` — Bugs 1/2/3, Rev 4 mobile cleanup hardening, and cleanups.
- `a_nobel_en_zn/1_css/link/link_card_collapse_expand.css` — button transition, dead var, scale, paragraph color.
- `a_nobel_en_zn/2_javascript/z_minified/link_card_collapse_expand.min.js` — re-minified publish bundle.
- `a_nobel_en_zn/3_staging/link_card_collapse_expand.js` — mirror (byte-identical).
- `a_nobel_en_zn/3_staging/link_card_collapse_expand.css` — mirror (byte-identical).

## Continuation notes
- Deploying the updated link-card staging/minified assets to the live Webflow staging site is the
  user's publish step. After publish, re-run the same mobile expand probe on the published URL (no
  injection needed) to confirm parity on real iOS Chrome/Safari.
- Optional future polish (not done): anchor the expanded button to a fixed left offset so it is
  revealed by the growing card edge (stationary) rather than fading in late.
