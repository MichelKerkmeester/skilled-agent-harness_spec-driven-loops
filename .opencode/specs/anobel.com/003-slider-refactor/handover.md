# Handover: Slider JS Refactor & Variant Split

**Session date:** 2026-05-31
**Status:** Complete
**Follow-on required:** Yes — Webflow Designer data-attribute updates (see §6)

---

## 1. Repository Architecture

Two repos stay in sync via MEGA. **Always edit the canonical source; never edit the mirror directly.**

| Role | Path |
|------|------|
| Canonical source | `MEGA/Development/Code_Environment/Public/a_nobel_en_zn/2_javascript/carousel/` |
| Mirror (build target) | `MEGA/Development/Websites/anobel.com/src/2_javascript/carousel/` |
| Minified output | `anobel.com/src/2_javascript/z_minified/carousel/` |

Changes written to the canonical source propagate to the mirror automatically within seconds. Minification is always run from the `anobel.com/` project root.

---

## 2. What Existed Before This Session

```
carousel/
  testimonial.js                       ← single source, testimonial-branded
z_minified/carousel/
  testimonial.min.js                   ← its minified output
```

The file was deeply branded for testimonials throughout: `STYLE_ID`, `DECORATED_FLAG`, `INIT_FLAG`, all `data-testimonial-slider` attributes, the `--testimonial-slide-x` CSS custom property, console log prefixes, component ID prefix, and tab label fallback all contained the word `testimonial`. Loading a second slider variant on the same page would have caused `STYLE_ID`, `DECORATED_FLAG`, and `INIT_FLAG` collisions.

---

## 3. What Was Done — Step by Step

### Step 1: Code analysis
Full architecture and quality review of `testimonial.js`. Key findings documented in §7 (open issues). No bugs in the happy path; several low-severity issues noted for future cleanup.

### Step 2: Generic rebrand
Every `testimonial`-specific string replaced with `slider`-prefixed equivalents:

| Before | After |
|--------|-------|
| `// SLIDER: TESTIMONIAL` header | `// SLIDER` |
| `STYLE_ID = 'testimonial-slider-styles'` | `'slider-styles'` |
| `DECORATED_FLAG = 'testimonialSliderDecorated'` | `'sliderDecorated'` |
| `INIT_FLAG = '__testimonialSliderCdnInit'` | `'__sliderCdnInit'` |
| `--testimonial-slide-x` CSS custom property | `--slider-slide-x` |
| `data-testimonial-slider="*"` | `data-slider="*"` |
| `data-target="testimonial-*"` | `data-target="slider-*"` |
| `data-testimonial-slider-ready` | `data-slider-ready` |
| `data-testimonial-nav="*"` | `data-slider-nav="*"` |
| `data-testimonial-tab-list` / `data-testimonial-tab` | `data-slider-tab-list` / `data-slider-tab` |
| Component ID prefix `testimonial-slider-N` | `slider-N` |
| Tab fallback label `Testimonial N` | `Slide N` |
| Console prefix `[testimonial]` | `[slider]` |

The result was saved as `carousel/slider.js` (a transitional name, quickly superseded).

### Step 3: Rename to `slider_testimonial.js`
`slider.js` renamed to `slider_testimonial.js` in both repos via `mv`. MEGA sync propagated instantly.

### Step 4: Per-variant constant scoping
Without scoping, two slider variants on the same page would share the same `STYLE_ID` (causing one variant's injected styles to clobber the other's), the same `DECORATED_FLAG` (causing a section to only be decorated by whichever script runs first), and the same `INIT_FLAG` (causing the second script to bail immediately on the global check).

Constants updated in `slider_testimonial.js`:

| Constant | Value |
|----------|-------|
| `STYLE_ID` | `'slider-testimonial-styles'` |
| `DECORATED_FLAG` | `'sliderTestimonialDecorated'` |
| `INIT_FLAG` | `'__sliderTestimonialCdnInit'` |

Header updated to `// SLIDER: TESTIMONIAL`.

### Step 5: Create `slider_timeline.js`
Duplicated from `slider_testimonial.js`. Changes applied:

**Header:** `// SLIDER: TIMELINE`

**Constants:**

| Constant | Value |
|----------|-------|
| `STYLE_ID` | `'slider-timeline-styles'` |
| `DECORATED_FLAG` | `'sliderTimelineDecorated'` |
| `INIT_FLAG` | `'__sliderTimelineCdnInit'` |

**`ensureStyles()` — removed three CSS blocks:**

The testimonial variant injects these at runtime (gated behind `data-slider-ready="true"`):
```css
/* Block 1 — Default greyscale on all tab images */
[data-slider-ready="true"] [data-target="slider-tab"] img,
[data-slider-ready="true"] [data-slider-tab] img {
  filter: grayscale(1) saturate(0) brightness(0.92);
  transition: filter 0.22s ease;
}

/* Block 2 — Full colour on active/hover/focus */
[data-slider-ready="true"] [data-target="slider-tab"]:hover img,
[data-slider-ready="true"] [data-target="slider-tab"]:focus-within img,
[data-slider-ready="true"] [data-target="slider-tab"][data-tab-active="true"] img,
[data-slider-ready="true"] [data-target="slider-tab"][aria-selected="true"] img,
[data-slider-ready="true"] [data-slider-tab]:hover img,
[data-slider-ready="true"] [data-slider-tab]:focus-within img,
[data-slider-ready="true"] [data-slider-tab][data-tab-active="true"] img,
[data-slider-ready="true"] [data-slider-tab][aria-selected="true"] img {
  filter: none !important;
}

/* Block 3 — Active tab opacity */
[data-slider-ready="true"] [data-target="slider-tab"][data-tab-active="true"],
[data-slider-ready="true"] [data-target="slider-tab"][aria-selected="true"],
[data-slider-ready="true"] [data-slider-tab][data-tab-active="true"],
[data-slider-ready="true"] [data-slider-tab][aria-selected="true"] {
  opacity: 1;
}
```

**All three blocks are absent from `slider_timeline.js`.** The timeline variant's `ensureStyles()` contains only layout/cursor/transform rules. Tab visual differentiation (colour, opacity, border, font weight) is left entirely to `btn_tab_main.css` and Webflow Designer classes.

### Step 6: Minification, verification, cleanup

**Minification** (run from `anobel.com/` root):
```
node .claude/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs
```

| File | Source | Output | Reduction |
|------|--------|--------|-----------|
| `slider_testimonial.min.js` | 32,391 B | 14,106 B | -56.5% |
| `slider_timeline.min.js` | 31,147 B | 12,843 B | -58.8% |

**Verification** — `verify-minification.mjs`:

| File | data-selectors | DOM events | Webflow.push | Motion.animate | Result |
|------|---------------|-----------|--------------|----------------|--------|
| `slider_testimonial.min.js` | 21 preserved | 10 preserved | ✓ | ✓ | **PASS** |
| `slider_timeline.min.js` | 20 preserved | 10 preserved | ✓ | ✓ | **PASS** |

The 21 vs 20 selector difference is expected: the removed colour-state blocks in the timeline variant contained one fewer `data-tab-active` CSS attribute selector.

**Runtime test** — `test-minified-runtime.mjs`:

| File | Errors | INIT_FLAG | Result |
|------|--------|-----------|--------|
| `slider_testimonial.min.js` | none | `__sliderTestimonialCdnInit` | **PASS** |
| `slider_timeline.min.js` | none | `__sliderTimelineCdnInit` | **PASS** |

**Stale files deleted:**
- `z_minified/carousel/testimonial.min.js` — source was renamed
- `z_minified/carousel/slider.min.js` — transitional name, superseded

---

## 4. Final File State

```
carousel/
  marquee_brands.js
  marquee_clients.js
  slider_testimonial.js    ← full variant (image colour states in ensureStyles)
  slider_timeline.js       ← timeline variant (layout/cursor/transform only)

z_minified/carousel/
  marquee_brands.min.js
  marquee_clients.min.js
  slider_testimonial.min.js
  slider_timeline.min.js
```

---

## 5. Tab Styling Architecture

Discovered during analysis. Not changed. Documented here for continuity.

### Static layer — `src/1_css/button/btn_tab_main.css`
Handles font weight, brand colour, and border-bottom on the active tab control.
Selectors it watches (written by `updateTabState()` in the JS on every slide change):
- `[data-tab][data-tab-active="true"]`
- `[data-tab].is--set`
- `[data-tab][aria-selected="true"]`

These apply to **both** slider variants.

### Runtime layer — `ensureStyles()` in `slider_testimonial.js` only
Injects image greyscale/colour rules after `data-slider-ready="true"` is set. Applies only to sections the testimonial variant has decorated. The timeline variant never injects these rules — its tabs rely purely on the static CSS layer.

### What `updateTabState()` writes on every slide change
On each active tab's control element:
- `data-tab-active="true"` (data attribute)
- `aria-selected="true"` (ARIA)
- `class: is--set` (CSS class)
- `tabindex="0"` (focus management)

On each inactive control:
- `data-tab-active="false"`
- `aria-selected="false"`
- `class: is--set` removed
- `tabindex="-1"`

---

## 6. Follow-on: Webflow Designer Attribute Updates

Any Webflow section previously using the old `data-testimonial-slider` attribute contract must be updated. The JS will not initialise on sections with the old attributes.

### Attribute mapping

| Element | Old attribute | New attribute |
|---------|--------------|---------------|
| Section wrapper | `data-testimonial-slider="section"` OR `data-target="testimonial-section"` | `data-slider="section"` |
| Viewport | `data-testimonial-slider="viewport"` OR `data-target="testimonial-viewport"` | `data-slider="viewport"` |
| Track | `data-testimonial-slider="track"` OR `data-target="testimonial-track"` | `data-slider="track"` |
| Each slide | `data-testimonial-slider="slide"` OR `data-target="testimonial-slide"` | `data-slider="slide"` |
| Previous button | `data-testimonial-nav="previous"` OR `data-target="testimonial-prev"` | `data-slider-button="prev"` |
| Next button | `data-testimonial-nav="next"` OR `data-target="testimonial-next"` | `data-slider-button="next"` |
| Tab list wrapper | `data-testimonial-tab-list` OR `data-target="testimonial-tab-list"` | `data-slider-tab-list` |
| Each tab item | `data-testimonial-tab` OR `data-target="testimonial-tab"` | `data-slider-tab` |
| Slide total display | `data-slide-count="total"` | unchanged |
| Step counter template | `data-slide-count="step"` | unchanged |

### Which JS file to embed per section type

| Section type | Embed |
|-------------|-------|
| Testimonials with logo/image tabs (colour on active) | `slider_testimonial.min.js` |
| Timeline or text-only tab navigation | `slider_timeline.min.js` |
| Both types on the same page | Both files — safe, no collisions |

---

## 7. Known Open Issues (Pre-existing, Not Addressed)

These were identified during code analysis. None affect the happy path.

| Issue | Location | Detail |
|-------|----------|--------|
| Dead `START_INDEX !== 0` branch | `horizontalLoop()` init | `START_INDEX` is always `0`; the conditional never fires |
| `wrapValue` / `wrapIndex` duplication | §2 Utilities | Identical implementations; one could be removed |
| `state.cleanup` array never iterated | `decorateComponent()`, `initComponent()` | `loop.destroy()` is pushed but nothing calls the array; teardown hook exists but is unwired |
| `offsets[idx] \|\| 0` should be `?? 0` | `onResize` handler | `\|\|` coerces a valid `0` offset; use nullish coalescing |
| Single-slide sections silently fail | `decorateComponent()` guard | `slides.length < 2` returns `null` with no console warning |

---

## 8. How to Add a Third Variant

1. Copy `slider_testimonial.js` or `slider_timeline.js` as your starting point
2. Update the header comment: `// SLIDER: <NAME>`
3. Set unique constants — all three must differ from existing variants:
   ```js
   const STYLE_ID      = 'slider-<name>-styles';
   const DECORATED_FLAG = 'slider<Name>Decorated';
   const INIT_FLAG     = '__slider<Name>CdnInit';
   ```
4. Add or remove CSS blocks from `ensureStyles()` as needed
5. Run from `anobel.com/` root:
   ```
   node .claude/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs
   node .claude/skills/sk-code/assets/webflow/scripts/verify-minification.mjs
   node .claude/skills/sk-code/assets/webflow/scripts/test-minified-runtime.mjs
   ```
   All three must pass before embedding.
