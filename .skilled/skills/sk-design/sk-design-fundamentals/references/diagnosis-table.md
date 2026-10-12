---
title: Diagnosing Existing UI
description: Maps vague complaints about an existing interface to the specific mechanical cause and the concrete fix, ordered by how much damage each cause does.
trigger_phrases:
  - "ui looks off"
  - "interface feels cheap"
  - "diagnose existing ui"
  - "symptom to fix table"
  - "make this look less amateur"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Diagnosing Existing UI

Complaints about UI are almost always vague. Each vague symptom maps to a small number of specific, mechanical fixes.

---

## 1. OVERVIEW

### Core Principle

A complaint is a symptom, not a diagnosis. Find the mechanical cause before changing anything, or the change is a guess dressed as a decision.

### When to Use

- The task is *improve this*, not *build this*.
- Someone says the UI "looks off", "feels cheap", "looks amateur", "feels cluttered", "feels plain", or "feels unfinished".
- A design review needs a specific finding rather than an impression.

### How to Read the Tables

Work down the tables in order. Section 2 holds the causes that account for most of the damage; Sections 3 through 6 hold the narrower ones. Match the symptom in the left column, confirm the cause in the middle column, then apply the fix.

The fixes assume the scales in `SKILL.md` Section 3. A fix that says "more space" means the next step up on the spacing scale, not an arbitrary number.

---

## 2. HIERARCHY AND SPACING

These are the highest-yield rows. Most "looks amateur" complaints resolve here.

| Symptom | What is actually wrong | Fix |
|---|---|---|
| Noisy, chaotic, "wall of content", nothing draws the eye | No hierarchy — everything carries equal weight | Deliberately de-emphasize secondary and tertiary content. Do not amplify the primary |
| One element will not stand out no matter what is done to it | Its neighbours are competing | Soften the competitors: fade inactive nav items, remove the sidebar's background so content sits forward |
| Cramped, claustrophobic | Space was *added* until it stopped looking bad | Start over with far too much space, then remove until it looks right |
| Ambiguous grouping — which label goes with which field, which heading owns this paragraph | Equal spacing inside and between groups | More space *around* a group than *within* it. Same bug in bullet lists, where the gap must exceed the line-height, and in horizontal rows |
| Primary content too big *and* secondary content too small | Font size is doing all the hierarchy work | Move the emphasis to weight (600 or 700) and color; pull sizes back toward the middle of the scale |
| Page title feels oversized and dominates | An `h1` styled as an `h1` | Section titles are usually labels. 16px is fine. Consider hiding it visually |
| Data reads like a database dump (`Name:`, `Email:`, `Phone:`) | Naive label and value pairs | Drop labels the format or context already implies; merge the label into the value ("3 bedrooms"); otherwise make the label visibly secondary |
| Big red button for something that is not the main action | Styled by semantics instead of hierarchy | Give destructive actions secondary or tertiary treatment; save the red primary button for the confirmation dialog |
| Every link is colored and it is overwhelming | Link styling meant for prose, used in a link-dense UI | Emphasize with weight or a darker color instead; for truly ancillary links, style on hover only |

---

## 3. COLOR, CONTRAST AND BORDERS

| Symptom | What is actually wrong | Fix |
|---|---|---|
| Busy, boxed-in, over-compartmentalized | Too many borders | Replace with a box shadow, two slightly different background colors, or more spacing. If there is both a border and a background change, drop the border. Borders that *identify a control* — input outlines, checkbox edges — stay, and those need 3:1 |
| Text on a colored panel looks faded, dull, or disabled | Grey text, or white at reduced opacity, on color | Hand-pick a color at the background's hue with adjusted saturation and lightness. See [color-system.md](color-system.md) Section 6 |
| 1px border either invisible or harsh | Trying to solve weight with color | Keep the soft color, go to 2px |
| Icon next to text overpowers it | Solid icons cover more surface area | Lower the icon's contrast with a softer color |
| Chart unreadable for colorblind users | Series distinguished by hue | Distinguish by lightness — shades of one color. Add icons or arrows to any color-coded metric |
| Flat, plain, "nothing wrong but nothing right" | No visual accents anywhere | A colored accent border (top of a card, under a heading, side of an alert, active nav item); change a section's background color; a two-hue gradient of 30 degrees or less; a subtle low-contrast pattern or geometric shape. It does not need to cover the whole background — running it along one edge works |

---

## 4. LAYOUT AND BREAKPOINTS

| Symptom | What is actually wrong | Fix |
|---|---|---|
| Layout spread thin across a huge viewport | Filling the screen because the space is there | Use only the width the content needs, or split into columns rather than stretching |
| Sidebar too wide on big screens, truncating on small | Percentage width taken from a grid | Fixed width for the sidebar; the main content flexes |
| Mobile headline enormous | `em`-based sizing carried over from desktop | Size independently per breakpoint. Large things shrink faster than small things |
| Elements look pasted onto the page | Everything sits in its own rectangle | Overlap layers: negative margins so a card straddles two backgrounds, or extends past its parent's edges |
| Component feels unbalanced in a wide layout | A naturally narrow element stretched to fill the space | Split the supporting content into its own column — a hint or error message beside the input rather than wrapped under it |

---

## 5. TYPOGRAPHY DETAIL

| Symptom | What is actually wrong | Fix |
|---|---|---|
| Mixed font sizes on one line look misaligned | Vertically centered | `align-items: baseline` |
| All-caps label hard to read | Default letter-spacing is tuned for sentence case | Add about `0.05em` letter-spacing |
| Long centered paragraphs are hard to read | Center alignment past two or three lines | Left-align, or rewrite the copy shorter so centering works |
| Numeric table columns hard to compare | Left-aligned numbers | Right-align them |
| Justified text has rivers of whitespace | No hyphenation | `hyphens: auto`, or do not justify |

---

## 6. IMAGES AND COMPONENT SHAPE

| Symptom | What is actually wrong | Fix |
|---|---|---|
| Headline over a photo is unreadable at some sizes | The image is too dynamic, not the text | Semi-transparent overlay; or lower image contrast with brightness raised to compensate; or desaturate and multiply a brand color; or a large-blur, zero-offset text-shadow used as a glow |
| Large icons look chunky and crude | Icons drawn at 16 to 24px, scaled up | Do not scale. Put the icon at its intended size inside a colored circle or square |
| Screenshot is an unreadable mush of tiny detail | A full-size screenshot scaled down | Screenshot a smaller tablet viewport, crop to one region, or draw a simplified illustration of the UI |
| Logo turns to mush as a favicon | Detailed artwork scaled down | Redraw a simplified version at the target size |
| Overlapping images clash | No separation between them | Give them a border in the page background color — an invisible border that guarantees a gap |
| User avatars or thumbnails lose their shape | The image background matches the UI background | A subtle inset box shadow (`inset 0 0 0 1px hsla(0,0%,0%,.1)`), not a border. Borders clash with the image's own colors |
| User-uploaded images wreck the grid | Displayed at their intrinsic aspect ratio | Fixed containers, `background-size: cover`, crop the overflow |
| Feels unfinished or prototype-like | Browser defaults everywhere | Replace bullets with icons; custom checkboxes and radios in a brand color; promote testimonial quotes into visual elements; style links distinctively |
| Screen is blank for new users | The empty state was an afterthought | Illustration, a clear headline, and an emphasized call to action. Hide tabs, filters and search that do nothing until content exists |
| A component looks generic | The default mental model of that component | Break the box — multi-column dropdowns with icons and descriptions, tables with combined columns and inline images, radio groups as selectable cards. See [depth-and-detail.md](depth-and-detail.md) Section 7 |

---

## 7. AFTER THE DIAGNOSIS

Apply the fix using the scales in `SKILL.md` Section 3, then re-check the hard rules in Section 4 — a hierarchy fix that softens a competitor can push its text below 4.5:1, and a border removed in favour of a background change can leave a control without its 3:1 outline.

If the complaint is still vague after working the tables, escalate rather than restyling broadly. Ask which specific element feels wrong and what it should communicate instead.
