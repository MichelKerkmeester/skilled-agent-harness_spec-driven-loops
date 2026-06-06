# Webflow Slider Update Guide

Use this guide when updating Webflow Designer sections after the slider JavaScript refactor. The new scripts no longer read the old `data-testimonial-*` attributes, so affected sections must be updated in Webflow before publishing.

---

## 1. What Changed

The old testimonial-only slider was split into two generic slider variants:

| Section type | Use this script |
| --- | --- |
| Testimonials with logo or image tabs that should turn from greyscale to colour | `slider_testimonial.min.js` |
| Timeline sections or text-only tab navigation | `slider_timeline.min.js` |
| A page with both section types | Load both scripts and use variant-specific section attributes |

Both scripts use the same Webflow attribute contract. The only difference is styling:

| Variant | Runtime tab image styling |
| --- | --- |
| `slider_testimonial.min.js` | Adds greyscale images by default, restores colour on active, hover, and focus |
| `slider_timeline.min.js` | Does not add image colour rules. Timeline styling comes from Webflow classes and static CSS |

---

## 2. What You Need To Do In Webflow

Make these changes in Webflow Designer and custom code embeds.

| Area | Required change |
| --- | --- |
| Script embeds | Replace old slider embeds with `slider_testimonial.min.js`, `slider_timeline.min.js`, or both |
| Testimonial section wrapper | Set `data-target="slider-testimonial"` |
| Timeline section wrapper | Set `data-target="slider-timeline"` |
| Viewport | Set `data-slider="viewport"` |
| Track | Set `data-slider="track"` |
| Slides | Set `data-slider="slide"` on every slide |
| Previous button | Set `data-slider-button="prev"` |
| Next button | Set `data-slider-button="next"` |
| Tab list | Set `data-slider-tab-list` |
| Tab items | Set `data-slider-tab` on every tab |
| Timeline underline | Keep `.tab--underline` only where the timeline underline should show |
| Testimonial tabs | Do not place testimonial tabs inside a `data-target="slider-timeline"` wrapper |
| Old attributes | Remove old `data-testimonial-*` and `data-target="testimonial-*"` attributes |

Do not use `data-slider="section"` on slider wrappers anymore. The scripts now require the variant-specific section marker so testimonial and timeline sliders can run on the same page.

For mobile pagination, make sure the previous and next controls are actual clickable elements in Webflow, such as a button or link block. The JavaScript now prevents default link behavior on those controls, but the elements still need the `data-slider-button` attributes above and must not be covered by another element on mobile.

---

## 3. Update The Script Embed

Find any page or site custom-code embed that still loads the old file:

```html
testimonial.min.js
```

Replace it with the correct new file:

```html
slider_testimonial.min.js
```

Use this for testimonial sections with logo or image tabs.

```html
slider_timeline.min.js
```

Use this for timeline sections or sliders with text-only tab navigation.

Do not use these old or intermediate files:

| Do not use | Reason |
| --- | --- |
| `testimonial.min.js` | Old renamed file |
| `slider.min.js` | Transitional file, superseded |

Load `slider_testimonial.min.js` for testimonial sections and `slider_timeline.min.js` for timeline sections. If a single page contains both testimonial and timeline sliders, load both files. The top-level section attribute keeps each script attached to the correct section.

---

## 4. Update Section Attributes

Open each affected Webflow section and replace the old custom attributes with the new generic slider attributes.

| Element               | Remove old attribute                                                         | Add new attribute           |
| -----------------------| ------------------------------------------------------------------------------| -----------------------------|
| Testimonial section wrapper | `data-testimonial-slider="section"`, `data-target="testimonial-section"`, or `data-slider="section"` | `data-target="slider-testimonial"` |
| Timeline section wrapper | `data-testimonial-slider="section"`, `data-target="testimonial-section"`, or `data-slider="section"` | `data-target="slider-timeline"` |
| Viewport              | `data-testimonial-slider="viewport"` or `data-target="testimonial-viewport"` | `data-slider="viewport"`    |
| Track                 | `data-testimonial-slider="track"` or `data-target="testimonial-track"`       | `data-slider="track"`       |
| Each slide            | `data-testimonial-slider="slide"` or `data-target="testimonial-slide"`       | `data-slider="slide"`       |
| Previous button       | `data-testimonial-nav="previous"` or `data-target="testimonial-prev"`        | `data-slider-button="prev"` |
| Next button           | `data-testimonial-nav="next"` or `data-target="testimonial-next"`            | `data-slider-button="next"` |
| Tab list wrapper      | `data-testimonial-tab-list` or `data-target="testimonial-tab-list"`          | `data-slider-tab-list`      |
| Each tab item         | `data-testimonial-tab` or `data-target="testimonial-tab"`                    | `data-slider-tab`           |
| Slide total display   | `data-slide-count="total"`                                                   | Leave unchanged             |
| Step counter template | `data-slide-count="step"`                                                    | Leave unchanged             |

For `data-slider-tab-list` and `data-slider-tab`, use an empty value if Webflow requires a value for custom attributes.

Do not use `data-slider="section"` on slider wrappers anymore. Use `data-target="slider-testimonial"` for testimonial sections and `data-target="slider-timeline"` for timeline sections.

Remove the old attributes after adding the new ones. Keeping both may not break the new script, but it makes future debugging harder.

---

## 5. Required Structure Checklist

Each slider section must contain this structure:

```text
Section wrapper      data-target="slider-testimonial" or data-target="slider-timeline"
  Viewport           data-slider="viewport"
    Track            data-slider="track"
      Slide          data-slider="slide"
      Slide          data-slider="slide"
  Previous button    data-slider-button="prev"
  Next button        data-slider-button="next"
  Tab list wrapper   data-slider-tab-list
    Tab item         data-slider-tab
    Tab item         data-slider-tab
  Total counter      data-slide-count="total"
  Step counter       data-slide-count="step"
```

The section needs at least two slides. Single-slide sections are ignored by the script.

---

## 6. Styling Notes

Active tab styling is split between static CSS and the slider script.

| Styling source | What it controls |
| --- | --- |
| `slider_timeline.css` | Timeline-only active tab font weight, brand colour, and underline |
| `slider_testimonial.min.js` | Testimonial tab image greyscale and active colour restore |
| `slider_timeline.min.js` | No tab image colour styling |

The script writes these active-state markers on tab controls:

| Marker | Active value | Inactive value |
| --- | --- | --- |
| `data-tab-active` | `true` | `false` |
| `aria-selected` | `true` | `false` |
| `is--set` class | Present | Removed |
| `tabindex` | `0` | `-1` |

If timeline active tab text or underlines do not update, check that the wrapper uses `data-target="slider-timeline"`. If testimonial tab images do not switch from greyscale to colour, check that the page loads `slider_testimonial.min.js`, not `slider_timeline.min.js`.

---

## 7. Publish Validation

After updating the attributes, publish the Webflow page and test it in the browser.

### Functional checks

- Click the next button. The slider advances one slide.
- Click the previous button. The slider moves back one slide.
- Tap the next and previous buttons on mobile. Both controls advance the slider without navigating the page.
- Click each tab. The matching slide becomes active.
- Check the total counter. It shows the correct slide count.
- Check step counters. The active step state follows the active slide.
- Resize the browser from desktop to mobile. The slider remains aligned.

### Attribute checks

- The section wrapper has `data-target="slider-testimonial"` or `data-target="slider-timeline"`.
- The viewport has `data-slider="viewport"`.
- The track has `data-slider="track"`.
- Every slide has `data-slider="slide"`.
- Navigation buttons use `data-slider-button="prev"` and `data-slider-button="next"`.
- Navigation buttons are not covered by another mobile-only element.
- The tab list has `data-slider-tab-list`.
- Every tab has `data-slider-tab`.
- No affected section still relies on `data-testimonial-slider`, `data-testimonial-nav`, `data-testimonial-tab-list`, or `data-testimonial-tab`.

### Console checks

- Open the browser console.
- Reload the page.
- Confirm there are no slider errors.
- Confirm the slider section receives `data-slider-ready="true"` after load.

---

## 8. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Slider does not initialise | Section still uses old `data-testimonial-*` attributes | Replace all old attributes with the new `data-slider` contract |
| Buttons do nothing | Button attributes still use `data-testimonial-nav` or old `data-target` values | Use `data-slider-button="prev"` and `data-slider-button="next"` |
| Buttons work on desktop but not mobile | Mobile layout covers the control, or the control is missing the new button attribute | Check z-index, pointer events, and `data-slider-button` on the mobile breakpoint |
| Tabs do nothing | Tab list or tab items still use old attributes | Use `data-slider-tab-list` and `data-slider-tab` |
| Testimonial tab images stay greyscale | Wrong script variant loaded | Load `slider_testimonial.min.js` |
| Timeline tabs get unexpected image colour behaviour | Testimonial variant loaded for timeline section | Load `slider_timeline.min.js` |
| Timeline active tab text or underline does not change | Timeline wrapper is missing or tab attributes are wrong | Check `data-target="slider-timeline"`, `data-slider-tab`, `is--set`, and `aria-selected` |
| Testimonial tabs show timeline underline | Testimonial tabs are inside a timeline wrapper or timeline CSS is not scoped | Use `data-target="slider-testimonial"` on testimonial wrapper |
| Only one slide exists | The script ignores single-slide sections | Add a second slide or remove slider behaviour for that section |

---

## 9. Quick Migration Checklist

- [ ] Replace old script embeds with `slider_testimonial.min.js` or `slider_timeline.min.js`.
- [ ] Update every affected section wrapper to the correct variant marker.
- [ ] Update viewport, track, and slide attributes.
- [ ] Update previous and next button attributes.
- [ ] Verify previous and next buttons are clickable on mobile and not covered by another element.
- [ ] Update tab list and tab item attributes.
- [ ] Keep timeline underline elements inside timeline sections only.
- [ ] Leave `data-slide-count="total"` and `data-slide-count="step"` unchanged.
- [ ] Remove old `data-testimonial-*` and `data-target="testimonial-*"` attributes.
- [ ] Publish and test desktop behaviour.
- [ ] Test mobile resize behaviour.
- [ ] Check the browser console for errors.
- [ ] Confirm `data-slider-ready="true"` appears after page load.
