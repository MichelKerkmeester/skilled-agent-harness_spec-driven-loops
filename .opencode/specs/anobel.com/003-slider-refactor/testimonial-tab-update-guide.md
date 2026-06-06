# Testimonial Tab Update Guide

Use this guide when updating the testimonial tab controls in Webflow after the slider refactor. The testimonial slider now uses testimonial-specific tab values, and it still has testimonial-specific runtime styling for tab images.

---

## 1. Source Files

The current canonical source files are:

| Variant | Source file | Minified file |
| --- | --- | --- |
| Testimonial slider | `a_nobel_en_zn/2_javascript/slider_testimonial.js` | `a_nobel_en_zn/2_javascript/z_minified/slider_testimonial.min.js` |
| Timeline slider | `a_nobel_en_zn/2_javascript/slider_timeline.js` | `a_nobel_en_zn/2_javascript/z_minified/slider_timeline.min.js` |

The testimonial source injects tab image colour rules. The timeline source does not.

---

## 2. What To Change On Testimonial Tabs

Update every testimonial tab item in Webflow Designer.

| Webflow element | Old attribute to remove | New attribute to add |
| --- | --- | --- |
| Testimonial section wrapper | `data-testimonial-slider="section"`, `data-target="testimonial-section"`, or `data-slider="section"` | `data-target="slider-testimonial"` |
| Tab list wrapper | `data-testimonial-tab-list` or `data-target="testimonial-tab-list"` | `data-slider-tab-list="testimonial"` |
| Each testimonial tab item wrapper | `data-testimonial-tab` or `data-target="testimonial-tab"` | `data-slider-tab="testimonial"` |

The tab image must sit inside the element marked with `data-slider-tab="testimonial"`, or inside a visible control inside that element.

Recommended tab item structure:

```text
Tab list wrapper      data-slider-tab-list="testimonial"
  Tab item wrapper    data-slider-tab="testimonial"
    Button or link    optional visible control
      Logo image      img alt="Client name"
  Tab item wrapper    data-slider-tab="testimonial"
    Button or link    optional visible control
      Logo image      img alt="Client name"
```

The script finds the first visible `button`, `a`, `[role="button"]`, or `[tabindex]` inside each tab item. If none exists, it uses the tab item itself as the tab control.

Do not add Webflow's generic tab attributes (`data-tab-container`, `data-tab-list`, `data-tab`, or `data-tab-content`) to testimonial slider tabs. Use only the slider attributes in the table above.

---

## 3. Testimonial Image Colour Behaviour

`slider_testimonial.js` injects these states after the section has initialised:

| State | What happens |
| --- | --- |
| Default tab image | Image becomes greyscale with reduced brightness |
| Hover tab image | Image returns to full colour |
| Focused tab image | Image returns to full colour |
| Active tab image | Image returns to full colour |
| Active tab item | Opacity is forced to `1` |

This only applies when the testimonial section has `data-slider-ready="true"` and the tab image is inside `[data-slider-tab="testimonial"]`, `[data-slider-tab]`, or a testimonial tab control fallback.

Do not use `slider_timeline.min.js` for testimonial logo tabs. The timeline variant does not include these colour rules.

Timeline underline and active text styling is scoped to sections with `data-target="slider-timeline"`. Testimonial tabs should not receive that underline when the testimonial wrapper uses `data-target="slider-testimonial"`.

---

## 4. Active State Markers

The script writes these markers to the tab item and visible tab control. You do not need to add them manually.

| Marker | Active value | Inactive value |
| --- | --- | --- |
| `data-tab-active` | `true` | `false` |
| `aria-selected` | `true` | `false` |
| `is--set` class | Present | Removed |
| `tabindex` | `0` | `-1` |

Use these markers in CSS only if you need additional custom styling beyond the default testimonial image colour states.

---

## 5. Using Testimonial And Timeline Sliders On One Page

It is possible to load both scripts on the same page, but the top-level section marker matters.

Use this for testimonial sections:

```html
data-target="slider-testimonial"
```

Use this for timeline sections:

```html
data-target="slider-timeline"
```

Use shared layout attributes inside both section types, but keep navigation and tab values variant-specific:

| Child element | Attribute |
| --- | --- |
| Viewport | `data-slider="viewport"` |
| Track | `data-slider="track"` |
| Slide | `data-slider="slide"` |
| Testimonial previous button | `data-slider-button="testimonial-prev"` |
| Testimonial next button | `data-slider-button="testimonial-next"` |
| Testimonial tab list wrapper | `data-slider-tab-list="testimonial"` |
| Testimonial tab item wrapper | `data-slider-tab="testimonial"` |
| Timeline previous button | `data-slider-button="timeline-prev"` |
| Timeline next button | `data-slider-button="timeline-next"` |
| Timeline tab list wrapper | `data-slider-tab-list="timeline"` |
| Timeline tab item wrapper | `data-slider-tab="timeline"` |
| Total counter | `data-slide-count="total"` |
| Step counter | `data-slide-count="step"` |

Do not use `data-slider="section"` on slider wrappers. The scripts now require variant-specific section markers so testimonial and timeline sliders can safely coexist.

---

## 6. Why Both Scripts Can Coexist

The two scripts use separate runtime keys:

| Runtime key | Testimonial value | Timeline value |
| --- | --- | --- |
| Injected style element | `slider-testimonial-styles` | `slider-timeline-styles` |
| Section decorated flag | `sliderTestimonialDecorated` | `sliderTimelineDecorated` |
| Global init flag | `__sliderTestimonialCdnInit` | `__sliderTimelineCdnInit` |

These separate keys prevent one script from blocking the other during page init. The Webflow section marker still decides which sections each script should decorate.

---

## 7. Testimonial Tab Checklist

- [ ] Testimonial page embeds `slider_testimonial.min.js`.
- [ ] If the page also has timeline sections, it also embeds `slider_timeline.min.js`.
- [ ] Testimonial section wrapper uses `data-target="slider-testimonial"`.
- [ ] Timeline section wrapper uses `data-target="slider-timeline"` when present.
- [ ] Tab list wrapper uses `data-slider-tab-list="testimonial"`.
- [ ] Every testimonial tab item wrapper uses `data-slider-tab="testimonial"`.
- [ ] Tab images sit inside the `data-slider-tab="testimonial"` element or its visible control.
- [ ] Each tab image has useful alt text for fallback tab labels.
- [ ] Old `data-testimonial-tab-list`, `data-testimonial-tab`, and `data-target="testimonial-tab"` attributes are removed.
- [ ] Published page sets `data-slider-ready="true"` on the testimonial section.
- [ ] Active testimonial tab image appears in full colour.
- [ ] Inactive testimonial tab images appear greyscale.
