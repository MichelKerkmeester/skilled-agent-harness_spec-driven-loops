---
title: "Implementation Summary: Link Card Button & Mobile Animation Fixes"
description: "Three link-card defects fixed (desktop centering, desktop button dissolve, mobile height animation) plus cleanups; verified live via Chrome DevTools CLI injection."
trigger_phrases:
  - "link card collapse expand summary"
  - "link card implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/002-link-card-button-and-mobile-animation"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Flattened all 2_javascript .js to root + regenerated z_minified flat (58 files, AST+runtime 58/58 PASS); link_card source now at 2_javascript/link_card_collapse_expand.js. (Prior: Rev 2 desktop image transform.)"
    next_safe_action: "User re-publishes 3_staging/* + z_minified link_card .min.js to Webflow/CDN (incl. Rev 1 + Rev 2), then re-verify on the published URL"
    blockers: []
    key_files:
      - "a_nobel_en_zn/2_javascript/link_card_collapse_expand.js  (flat root)"
      - "a_nobel_en_zn/1_css/link/link_card_collapse_expand.css"
      - "a_nobel_en_zn/2_javascript/z_minified/link_card_collapse_expand.min.js  (flat)"
      - "a_nobel_en_zn/3_staging/link_card_collapse_expand.js"
      - "a_nobel_en_zn/3_staging/link_card_collapse_expand.css"
    completion_pct: 100
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

## Status: COMPLETE — Revision 1 applied (pending user publish of 3_staging + .min.js)

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

**Bug 1 — desktop collapsed-button centering.** `apply_collapsed_button` (desktop branch) now
centers via `inset: '1.5rem auto auto 50%'` + `transform: 'translateX(-50%)'` instead of the
width-dependent `calc(50% - 28px)` right-anchor. Root cause: the button is `4rem` wide (scales with
the fluid root font-size), so the fixed `28px` (half of an assumed 56px) only centered it at one
viewport width; at others it drifted. `translateX(-50%)` centers at any width.

**Bug 2 — desktop button no longer travels (dissolve to top-right).**
- CSS button `transition` no longer lists `inset`/`transform` (only background/border/color/shadow),
  so position changes are never tweened.
- New `dissolve_button()` (called from `animate_card_state` on desktop only): fades the button
  `opacity → 0` (~100ms), then at the trough — guarded by `is_current_run` — swaps position + icon
  state instantly and fades `opacity → 1` with a `0.62s` delay so it reappears only once the card is
  ~full width. Opacity is explicitly pinned (`0` after fade-out, `1` after fade-in) because Motion
  does not persist an animation's end value (it reverts to the underlying inline opacity).
- `CONFIG.motion.button_out` / `button_in` added (tunable timing).
- Mobile path unchanged (CSS owns mobile button layout); desktop icon swap moved into the dissolve.

**Bug 3 — mobile height animation restored.** `set_mobile_fixed_height` no longer writes `height` /
`max-height` / `min-height` with `!important`. Root cause: `!important` author declarations outrank
the Web-Animations layer in the cascade, so the `wrapper.animate(...)` height keyframes were fully
overridden — the card sat at the pinned height for ~1.1s then snapped. Normal inline lets WAAPI
drive the tween while still overriding the (non-important) CSS height rules.

**Cleanups.** `is_current_run` is now used (the dissolve guard) instead of dead; write-only
`text_wrappers` array + unused `text_wrapper` SELECTOR removed (text-node wrapping kept); dead CSS
var `--link-card-mobile-expanded-size` removed; mobile collapsed image `scale(1.04)` → `scale(1)`
(matches the live-effective JS value and desktop).

## Verification evidence (live, Chrome DevTools CLI `bdg`)

Method: navigate to the live staging page, tear down the published instance via its
`__linkCardCollapseExpandCleanup` hook, inject the edited CSS (appended to `<body>` so it wins
source order) + JS, then probe. (The live site still serves the old published build; injection
verifies the fix pre-deploy.)

- **Bug 1:** all collapsed cards `centerOffset = 0` (was −2 at root=15px); computed
  `transform = matrix(1,0,0,1,-28,0)` (translateX(-50%) of the 56px button); `transition-property`
  no longer includes `inset, transform`.
- **Bug 2:** dissolve timeline — opacity `1→0` by ~90ms at collapsed-center (x≈102); held at `0`
  (invisible) while position swapped and card grew (x rides 231→842 unseen); faded `0→1` at
  t≈750–930ms **stationary** at the final top-right (x=847, card already full-width 836). No
  full-opacity ride.
- **Bug 3:** height timeline — card 1 expands `82→101→244→…→331`, card 0 collapses
  `331→312→169→…→82`, both smooth over ~900ms with the ease-out curve; no frozen plateau, no snap.
- **Robustness:** all collapsed buttons `opacity = 1` in resting state; no component console errors
  (only an unrelated Webflow ServiceWorker warning); reduced-motion/instant paths set button
  `opacity:1` explicitly.

## Minification (sk-code WEBFLOW convention — follow-up request)

Minified the fixed JS per `sk-code` WEBFLOW deployment guide (single-file workflow, scoped to this
component — a batch run would re-minify every source changed since the manifest):

- **Minify:** `npx terser src/2_javascript/molecules/link_card_collapse_expand.js --compress --mangle
  -o src/2_javascript/z_minified/molecules/link_card_collapse_expand.min.js` →
  **57,967 B → 18,911 B (67.4% reduction)**; `node --check` clean.
- **AST verify** (`verify-minification.mjs`): link_card **PASS** — 11 data-selectors, 2 DOM events,
  `Webflow.push`, `Motion.animate` all preserved; suite **59/59 passed**.
- **Runtime test** (`test-minified-runtime.mjs`): link_card **PASS** — executes without errors, init
  flag `__linkCardCollapseExpandInit` set; suite **109/109 passed**.
- **Browser test** (minified injected into the live page): mobile height ramp `145→244→…→331`
  smooth (no snap); desktop collapsed buttons `off=0, op=1` — identical to source behavior.
- The `src/2_javascript` (anobel.com) and Public `2_javascript` trees share inodes (source + min),
  so the new `.min.js` (inode 54310088) lands in both repos at once.
- `--mangle-props` not used (would break the string-keyed selectors/attrs). The `z_minified`
  `manifest.tsv` skip-cache was left untouched (direct-terser workflow); a future
  `minify-webflow.mjs` batch run reconciles it.

## Files changed
- `a_nobel_en_zn/2_javascript/molecules/link_card_collapse_expand.js` — Bugs 1/2/3 + cleanups (57,967 B).
- `a_nobel_en_zn/1_css/link/link_card_collapse_expand.css` — button transition, dead var, scale (33,091 B).
- `a_nobel_en_zn/2_javascript/z_minified/molecules/link_card_collapse_expand.min.js` — re-minified (18,911 B; was stale 18,465 B / May 23).
- `a_nobel_en_zn/3_staging/link_card_collapse_expand.js` — mirror (byte-identical).
- `a_nobel_en_zn/3_staging/link_card_collapse_expand.css` — mirror (byte-identical).

## Continuation notes
- Deploying `3_staging/*` to the live Webflow staging site is the user's publish step. After publish,
  re-run the same `bdg` probes on the published URL (no injection needed) to confirm parity.
- `button_out` (0.1) / `button_in` (delay 0.62, duration 0.2) are the empirically-tuned dissolve
  timings; adjust in `CONFIG.motion` if the button should reappear earlier/later.
- Optional future polish (not done): anchor the expanded button to a fixed left offset so it is
  revealed by the growing card edge (stationary) rather than fading in late.
