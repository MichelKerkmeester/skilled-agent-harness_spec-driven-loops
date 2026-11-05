---
title: Web Visual Hierarchy
description: Visual hierarchy tiers, symptom-to-fix diagnosis, build order, UX laws and the screen review pass.
trigger_phrases:
  - "visual hierarchy"
  - "nothing draws the eye"
  - "emphasize by de-emphasizing"
  - "ui looks off"
  - "design review findings"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Web Visual Hierarchy

Ranking, diagnosis, build order and review for a web screen, so every element on it has a reason to be where it is.

---

## 1. OVERVIEW

### Purpose

This file covers the hierarchy method, the symptom-to-fix diagnosis tables, the seven-step build order, the UX laws behind structural decisions and the severity-tiered review pass.

### When to Use

- Improving an existing screen against a vague complaint such as "it looks off" or "it feels cheap".
- Starting a screen, page or component from nothing.
- Deciding what ranks first, how an action is styled or how much white space something needs.
- Reviewing UI code for accessibility and visual quality with findings rather than impressions.

### Boundaries

- Value scales, colour ramps and token roles: [web-visual-values.md](web-visual-values.md).
- Focus behaviour, widget contracts and browser preferences: [web-accessibility-patterns.md](web-accessibility-patterns.md).
- Motion curves, easing and interaction behavior: [web-motion-and-interaction.md](web-motion-and-interaction.md).
- Layout mechanics and sizing behavior: [web-layout-and-sizing.md](web-layout-and-sizing.md).

---

## 2. THE HIERARCHY METHOD

A screen looks designed because things are ranked, not because they are styled. When everything competes, the interface reads as noise no matter how good the individual values are.

### H1. Assign every element a tier

- **Rule:** Put every element into one of three tiers, primary, secondary or tertiary, before styling any of them.
- **Why:** The three tiers form a pyramid that decides where the eye lands. An element that cannot be assigned a tier is usually one that should not be on the screen in the first place.
- **When not to:** A surface with a single element, such as a status badge, has nothing to rank against, so one tier carries it.
- **Pitfall:** Styling first and ranking later produces a screen where the loudest element won by accident.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the scales each tier draws from.

### H2. Carry emphasis with weight and colour

- **Rule:** Carry emphasis with weight at 600 or 700 and with colour, and keep sizes near the middle of the type scale.
- **Why:** Size is not everything. Leaning on font size alone produces primary content that is too big and secondary content that is too small, which is the classic symptom of a hierarchy built with one lever.
- **When not to:** A marketing hero whose headline is the content earns size, because there the size is the message.
- **Pitfall:** Pulling every size toward the middle without adding weight or colour leaves nothing ranked at all.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the type scale and the two font weights.

### H3. Hold text to three colours

- **Rule:** Use three text colours at most. Dark for primary content, grey for secondary content and a lighter grey for tertiary content such as footnotes and copyright.
- **Why:** All three carry real body-size text, so all three need 4.5:1. "Lighter grey" means the lightest shade that still clears it, roughly the middle of a nine-step ramp rather than the pale end. The pale shades are for disabled states and large text only. A fourth text colour is almost always a tier that was never decided.
- **When not to:** An established token set that already fixes the text roles wins over the default, so use its roles.
- **Pitfall:** A pale grey that looks refined on a bright monitor fails 4.5:1 in dim light or on a cheap screen.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for which grey belongs to which text role.

### H4. Emphasize by de-emphasizing

- **Rule:** Soften what competes instead of amplifying the primary element.
- **Why:** When the important element will not stand out and there is nothing left to add to it, the problem is not the element, it is the competition. Fade the inactive nav items, drop the sidebar's background colour so the main content sits forward, reduce the weight of the repeated metadata on every row. The primary element gets more prominent without changing at all. This is the single highest-yield move in the method, and it is counterintuitive enough that most people reach for amplification first and end up with a screen where everything shouts.
- **When not to:** When the primary element is genuinely too quiet against a plain background, adding weight to it is the smaller change.
- **Pitfall:** Fading a competitor can push its text below 4.5:1, so re-check contrast after the fade.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the text colours a faded element may still use.

### H5. Style actions by hierarchy, not by semantics

- **Rule:** Style an action by the tier it occupies, not by what the action means. The treatments are:

| Tier | Treatment | Count |
|---|---|---|
| Primary | Solid, high contrast | Usually exactly one per page |
| Secondary | Outline or a low-contrast background | As many as the page genuinely needs |
| Tertiary | Styled like a link | The rest |

- **Why:** A page with three solid high-contrast buttons has no primary action, so the user has to read all three to find the one that matters. Destructive is not a licence to break the ranking either. If Delete is not the primary action on the page, and on a list or detail view it almost never is, give it tertiary treatment. Then make it a big red primary button inside the confirmation dialog, where it genuinely is the primary action. The red arrives at the moment it carries information, instead of shouting from a screen where the user was not going to delete anything.
- **When not to:** A confirmation dialog whose only action is the destructive one makes that action primary by definition, so it gets the red button.
- **Pitfall:** A red destructive button on every row of a list makes the most dangerous action the most prominent one on the screen.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the destructive colour ramp, [web-elements-and-attributes.md](web-elements-and-attributes.md) for the dialog that holds the confirmation.

### H6. Treat labels as a last resort

- **Rule:** Drop a label when the format or the context already identifies the value. Where a label is genuinely needed, fold it into the value or make it visibly secondary.
- **Why:** `label: value` gives every piece of data equal weight, which is the opposite of hierarchy, and it reads as a database dump because that is structurally what it is. Most data identifies itself. `$19.99` is a price, `name@example.com` is an email, `(415) 555-0132` is a phone number and the number under a product title in a cart is a quantity.
- **When not to:** A spec-sheet page, where users scan for the label to find the row they want. There, emphasize the label instead, because the label is what is being searched.
- **Pitfall:** "12 left in stock" is a value. "In stock: 12" is a form field the user has to parse.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the secondary text colour a visible label uses.

### H7. Balance weight against contrast

- **Rule:** Add weight to fix low contrast. Reduce contrast to fix excess weight.
- **Why:** Weight and contrast are interchangeable currencies, and an element that reads wrong is usually holding too much of one. A solid icon covers far more surface area than the text beside it and will out-shout it at the same colour, so soften the icon's colour to compensate. When a 1px border is too subtle in a soft colour but too harsh once darkened, keep the soft colour and go to 2px. The problem was never the colour.
- **When not to:** A boundary that must identify a control cannot drop below 3:1 against its background, so soften the other element instead.
- **Pitfall:** Darkening a border to make it visible pushes it past the point where it reads as a quiet divider.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for border widths and functional contrast.

### H8. Keep visual hierarchy separate from document hierarchy

- **Rule:** Choose the tag for the document outline. Choose the size, weight and colour for the visual tier. They are allowed to disagree.
- **Why:** Semantic markup and visual weight are separate decisions, and conflating them produces oversized page titles everywhere. Section titles are usually labels, not headlines. An `h1` rendered at 16px is entirely correct when the heading exists for structure and assistive technology rather than for the eye. Sometimes the title should be visually hidden altogether, because the content already says what it is and a visible heading would only add a competitor to the primary content.
- **When not to:** A surface whose main title is also its primary content, such as a landing page, gives the `h1` headline treatment because the two decisions agree there.
- **Pitfall:** Styling every level of the outline down from the `h1` produces a page with four competing headlines.
- **Support:** Judgment, no version gate.
- **See also:** [web-markup-and-css.md](web-markup-and-css.md) for the heading outline.

---

## 3. DIAGNOSING AN EXISTING SCREEN

**Load this section first when the task is improving a screen that already exists.** A complaint is a symptom, not a diagnosis. Find the mechanical cause before changing anything, or the change is a guess dressed as a decision.

### How to read the tables

Work down the tables in order. The first holds the causes that account for most of the damage and the rest hold the narrower ones. Match the symptom in the left column, confirm the cause in the middle column, then apply the fix.

The fixes assume the value scales. A fix that says "more space" means the next step up on the spacing scale, not an arbitrary number.

### Hierarchy and spacing

These are the highest-yield rows. Most "looks amateur" complaints resolve here.

| Symptom | What is actually wrong | Fix |
|---|---|---|
| Noisy, chaotic, "wall of content", nothing draws the eye | No hierarchy, everything carries equal weight | Deliberately de-emphasize secondary and tertiary content. Do not amplify the primary |
| One element will not stand out no matter what is done to it | Its neighbours are competing | Soften the competitors: fade inactive nav items, remove the sidebar's background so content sits forward |
| Cramped, claustrophobic | Space was added until it stopped looking bad | Start over with far too much space, then remove until it looks right |
| Ambiguous grouping, which label goes with which field, which heading owns this paragraph | Equal spacing inside and between groups | More space around a group than within it. The same bug appears in bullet lists, where the gap must exceed the line-height, and in horizontal rows |
| Primary content too big and secondary content too small | Font size is doing all the hierarchy work | Move the emphasis to weight (600 or 700) and colour. Pull sizes back toward the middle of the scale |
| Page title feels oversized and dominates | An `h1` styled as an `h1` | Section titles are usually labels. 16px is fine. Consider hiding it visually |
| Data reads like a database dump (`Name:`, `Email:`, `Phone:`) | Naive label and value pairs | Drop labels the format or context already implies. Merge the label into the value ("3 bedrooms"). Otherwise make the label visibly secondary |
| Big red button for something that is not the main action | Styled by semantics instead of hierarchy | Give destructive actions secondary or tertiary treatment. Save the red primary button for the confirmation dialog |
| Every link is coloured and it is overwhelming | Link styling meant for prose, used in a link-dense UI | Emphasize with weight or a darker colour instead. For truly ancillary links, style on hover only |

### Colour, contrast and borders

| Symptom | What is actually wrong | Fix |
|---|---|---|
| Busy, boxed-in, over-compartmentalized | Too many borders | Replace with a box shadow, two slightly different background colours or more spacing. If there is both a border and a background change, drop the border. Borders that identify a control such as input outlines and checkbox edges stay, and those need 3:1 |
| Text on a coloured panel looks faded, dull, or disabled | Grey text or white at reduced opacity, on colour | Hand-pick a colour at the background's hue with adjusted saturation and lightness. See [web-visual-values.md](web-visual-values.md) |
| 1px border either invisible or harsh | Trying to solve weight with colour | Keep the soft colour, go to 2px |
| Icon next to text overpowers it | Solid icons cover more surface area | Lower the icon's contrast with a softer colour |
| Chart unreadable for colourblind users | Series distinguished by hue | Distinguish by lightness, shades of one colour. Add icons or arrows to any colour-coded metric |
| Flat, plain, "nothing wrong but nothing right" | No visual accents anywhere | A coloured accent border (top of a card, under a heading, side of an alert, active nav item), a different section background colour, a two-hue gradient of 30 degrees or less, a subtle low-contrast pattern or geometric shape. It does not need to cover the whole background. Running it along one edge works |

### Layout and breakpoints

| Symptom | What is actually wrong | Fix |
|---|---|---|
| Layout spread thin across a huge viewport | Filling the screen because the space is there | Use only the width the content needs, or split into columns rather than stretching |
| Sidebar too wide on big screens, truncating on small | Percentage width taken from a grid | Fixed width for the sidebar, the main content flexes |
| Mobile headline enormous | `em`-based sizing carried over from desktop | Size independently per breakpoint. Large things shrink faster than small things |
| Elements look pasted onto the page | Everything sits in its own rectangle | Overlap layers: negative margins so a card straddles two backgrounds, or extends past its parent's edges |
| Component feels unbalanced in a wide layout | A naturally narrow element stretched to fill the space | Split the supporting content into its own column, a hint or error message beside the input rather than wrapped under it |

### Typography detail

| Symptom | What is actually wrong | Fix |
|---|---|---|
| Mixed font sizes on one line look misaligned | Vertically centred | `align-items: baseline` |
| All-caps label hard to read | Default letter-spacing is tuned for sentence case | Add about `0.05em` letter-spacing |
| Long centred paragraphs are hard to read | Centre alignment past two or three lines | Left-align, or rewrite the copy shorter so centring works |
| Numeric table columns hard to compare | Left-aligned numbers | Right-align them |
| Justified text has rivers of whitespace | No hyphenation | `hyphens: auto`, or do not justify |

### Images and component shape

| Symptom | What is actually wrong | Fix |
|---|---|---|
| Headline over a photo is unreadable at some sizes | The image is too dynamic, not the text | A semi-transparent overlay, or lower image contrast with brightness raised to compensate. A desaturated brand colour multiplied over the image also works, as does a large-blur zero-offset text-shadow used as a glow |
| Large icons look chunky and crude | Icons drawn at 16 to 24px, scaled up | Do not scale. Put the icon at its intended size inside a coloured circle or square |
| Screenshot is an unreadable mush of tiny detail | A full-size screenshot scaled down | Screenshot a smaller tablet viewport, crop to one region or draw a simplified illustration of the UI |
| Logo turns to mush as a favicon | Detailed artwork scaled down | Redraw a simplified version at the target size |
| Overlapping images clash | No separation between them | Give them a border in the page background colour, an invisible border that guarantees a gap |
| User avatars or thumbnails lose their shape | The image background matches the UI background | A subtle inset box shadow (`inset 0 0 0 1px hsla(0,0%,0%,.1)`), not a border. Borders clash with the image's own colours |
| User-uploaded images wreck the grid | Displayed at their intrinsic aspect ratio | Fixed containers, `background-size: cover`, crop the overflow |
| Feels unfinished or prototype-like | Browser defaults everywhere | Replace bullets with icons, custom checkboxes and radios in a brand colour, promote testimonial quotes into visual elements, style links distinctively |
| Screen is blank for new users | The empty state was an afterthought | An illustration, a clear headline and an emphasized call to action. Hide tabs, filters and search that do nothing until content exists |
| A component looks generic | The default mental model of that component | Break the box: multi-column dropdowns with icons and descriptions, tables with combined columns and inline images, radio groups as selectable cards |

### After the diagnosis

Apply the fix using the value scales, then re-check the hard rules. A hierarchy fix that softens a competitor can push its text below 4.5:1, and a border removed in favour of a background change can leave a control without its 3:1 outline.

If the complaint is still vague after working the tables, escalate rather than restyling broadly. Ask which specific element feels wrong and what it should communicate instead.

---

## 4. THE BUILD PROCEDURE

Seven steps for designing something that does not exist yet. They govern the order of work, not the values.

### H9. Start with a feature, not a layout

- **Rule:** Design one real piece of functionality, such as the search form, the message composer or one row of a list, and let the shell emerge from what the features turn out to need.
- **Why:** Nobody can choose between a top nav and a sidebar before knowing what is in the product. Designing the shell first produces a shell that the features then have to fit into, which is backwards and shows.
- **When not to:** An existing app frame already fixes the shell, so design inside that frame and spend the decision on the feature.
- **Pitfall:** A nav with eight empty slots invites eight features that nobody asked for.
- **Support:** Judgment, no version gate.
- **See also:** [web-markup-and-css.md](web-markup-and-css.md) for the landmark structure that holds the features.

### H10. Work in grayscale first

- **Rule:** Design the layout in grayscale, and add typefaces, shadows and icons only after the layout works.
- **Why:** Removing colour forces hierarchy to come from spacing, contrast and size, which are the things that actually carry it. A layout that reads correctly in grayscale reads correctly in colour. The reverse is not true, because colour can prop up a hierarchy that does not exist.
- **When not to:** A colour-coded data view cannot be judged in grayscale when the encoding is the content, so bring one colour decision forward and label it.
- **Pitfall:** A grayscale pass that keeps three shades of the same grey tests nothing, because the ranking still comes from colour.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the values the grayscale pass is choosing between.

### H11. Do not over-invest in low fidelity

- **Rule:** Treat sketches, wireframes and mockups as disposable, and abandon them once the decision they supported is made.
- **Why:** Nobody can use a static picture of an app, so their only job is to explore ideas cheaply. Polishing an artifact that will be thrown away spends the budget on the wrong object.
- **When not to:** A mockup that is the deliverable, such as a design handed to another team, is the product rather than an exploration.
- **Pitfall:** A pixel-perfect mockup of an interaction that cannot ship makes the built version feel like a regression.
- **Support:** Judgment, no version gate.
- **See also:** [figma-to-code.md](figma-to-code.md) for checking a built screen against its frame once the build exists.

### H12. Design the smallest useful version, then build it

- **Rule:** Work in short design-to-code cycles, and build the smallest version that is genuinely useful.
- **Why:** The screen in a browser tells the truth and the mockup does not. A real build exposes the spacing, the wrapping and the state that a picture hides.
- **When not to:** A change to a shared component touches callers that cannot ship in the same cycle, so stage the design and the build separately.
- **Pitfall:** Do not imply functionality that is not ready to build. A comment box with an attachments zone that cannot ship yet blocks the whole feature, so either build the attachment or remove its affordance.
- **Support:** Judgment, no version gate.
- **See also:** [frontend-practice.md](frontend-practice.md) for the build-cycle contract.

### H13. Choose by elimination

- **Rule:** Guess the step that seems right, then compare it against the neighbour on each side. If an outer option wins, re-run the comparison with that as the new middle, and stop when the middle wins.
- **Why:** Two of the three will be obviously wrong, which makes the decision fast and repeatable. A constrained scale makes adjacent values distinguishable, which is why the spacing scale keeps neighbours about 25% apart. On a linear scale the comparison is meaningless.
- **When not to:** A value fixed by an established token, a brand colour or a measured reference is already decided, so compare only what is still open.
- **Pitfall:** Comparing two candidates with no third option turns the choice into a preference.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the scales the comparison runs on.

### H14. Start with too much white space and remove it

- **Rule:** Start generous and trim until it looks right, rather than adding space until it stops looking bad.
- **Why:** Adding space until something stops looking bad gives the minimum acceptable amount. Starting generous and trimming gives the right amount. The two rarely land in the same place.
- **When not to:** A dense interface such as a dashboard or a data table is legitimate, but as a deliberate decision made once rather than as the default that emerges from never having had enough space to begin with.
- **Pitfall:** Trimming by eye in one session stops at the first passable gap, which is usually above the right one.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the spacing scale the trimming walks down.

### H15. Shrink the canvas

- **Rule:** Start at about 400px and design the mobile layout first, then bring it to a large screen and relax only what genuinely felt cramped.
- **Why:** A small component designed on a 1400px artboard sprawls, because the space is there to fill. At 400px the constraints are real and every element has to earn its space. Less relaxes than expected when the layout reaches the desktop, and the discipline survives into it.
- **When not to:** A component that only ever appears in a wide shell, such as a data grid, is designed at the width it will actually occupy.
- **Pitfall:** Designing wide first and then squeezing produces a desktop layout with content removed rather than a mobile layout with content chosen.
- **Support:** Judgment, no version gate.
- **See also:** [web-layout-and-sizing.md](web-layout-and-sizing.md) for intrinsic sizing and container behavior.

The steps govern order and process. Spacing, type, weight, colour, elevation, radius, opacity and duration still come from a scale, and a procedure followed with invented values produces the same amateur result in a better order.

---

## 5. THE UX LAWS

The constraints a human brain and hand impose on an interface. Each one turns into a concrete structural decision.

### H16. Fitts's Law

- **Rule:** Size interactive targets to be comfortably hittable, and expand the hit area with padding or a negative-inset pseudo-element rather than by growing the visual box.
- **Why:** Targets are faster to hit when they are larger and closer to where the pointer already is. A 16px icon button is a miss waiting to happen. The control can stay small and still be easy to hit.
- **When not to:** A dense pointer-driven toolbar can go to 32px, which is the floor for that context. 44px is the minimum for anything a thumb operates.
- **Pitfall:** Growing the visual box to fix a small hit area changes the layout instead of the target.
- **Support:** Judgment, no version gate.
- **See also:** [web-motion-and-interaction.md](web-motion-and-interaction.md) for hit areas as an interaction detail.

### H17. Serial Position Effect

- **Rule:** Put the items that matter at the start or the end of a list, a nav or a set of steps, never buried in the middle.
- **Why:** People remember the first and last items in a sequence best.
- **When not to:** A list sorted by a user-chosen key such as price or date keeps its order, and position carries no design meaning there.
- **Pitfall:** A settings menu that relies on nobody finding the middle entry is hiding a decision rather than making it safe.
- **Support:** Judgment, no version gate.
- **See also:** [web-markup-and-css.md](web-markup-and-css.md) for list and nav semantics.

### H18. Hick's Law

- **Rule:** Minimize what is visible at once. Reduce options, group related actions and defer the advanced ones.
- **Why:** Decision time rises with the number of choices.
- **When not to:** A command palette is deliberately dense because the user arrives with a target and types it, so search replaces scanning.
- **Pitfall:** Hiding options behind a More menu moves the decision rather than removing it when the menu holds the frequent ones.
- **Support:** Judgment, no version gate.
- **See also:** [web-elements-and-attributes.md](web-elements-and-attributes.md) for disclosure and details.

### H19. Miller's Law

- **Rule:** Chunk data into groups of roughly five to nine so it can be scanned rather than read.
- **Why:** Working memory is limited. A flat list of thirty items is thirty decisions, six groups of five is six.
- **When not to:** A short list of three items needs no grouping, and grouping it invents structure the content does not have.
- **Pitfall:** Groups of twenty carry the label of chunking without the cognitive benefit.
- **Support:** Judgment, no version gate.
- **See also:** [web-layout-and-sizing.md](web-layout-and-sizing.md) for the spacing that draws the groups.

### H20. Progressive Disclosure

- **Rule:** Show what matters now and reveal complexity later.
- **Why:** This is Hick's Law applied over time rather than over a single screen.
- **When not to:** A setting the user must see before acting, such as a destructive confirmation, cannot wait behind disclosure.
- **Pitfall:** Three levels of disclosure turn one decision into a hunt.
- **Support:** Judgment, no version gate.
- **See also:** [web-elements-and-attributes.md](web-elements-and-attributes.md) for disclosure, details and popover.

### H21. Tesler's Law

- **Rule:** Move complexity to the system through defaults, inference and smart parsing rather than pushing it onto the user as another field to fill in.
- **Why:** Complexity is conserved. Every process has an irreducible amount and the only question is who absorbs it.
- **When not to:** Where intent cannot be inferred safely, an explicit choice beats a guess, especially for billing or destructive scope.
- **Pitfall:** A smart default the user cannot see becomes a silent wrong answer.
- **Support:** Judgment, no version gate.
- **See also:** [web-elements-and-attributes.md](web-elements-and-attributes.md) for the input attributes that let the browser do the work.

### H22. Pareto Principle

- **Rule:** Give the critical few features the primary treatment and let the rest earn their place or move behind disclosure.
- **Why:** Roughly 20% of the features carry 80% of the use.
- **When not to:** A tool built for one narrow workflow may have no long tail to deprioritize.
- **Pitfall:** Applying the ratio to a five-item nav gives one primary item and four afterthoughts.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the primary colour budget a page can carry.

### H23. Cognitive Load

- **Rule:** Remove anything the user has to process that is not the task.
- **Why:** Decorative complexity, inconsistent patterns and unexplained jargon are all load with no payoff.
- **When not to:** Some load is the task, such as a form that must collect real data, and removing it removes the product.
- **Pitfall:** A decorative hero animation that runs on every visit is load paid on every visit.
- **Support:** Judgment, no version gate.
- **See also:** [web-motion-and-interaction.md](web-motion-and-interaction.md) for when not to animate.

### H24. Doherty Threshold

- **Rule:** Keep the system response inside about 400ms. When the real work cannot finish inside that budget, fake the speed honestly with skeletons, optimistic updates and progress indicators.
- **Why:** An interface feels instant when it responds within about 400ms. Past that, attention drifts and the user starts to feel they are waiting on the machine.
- **When not to:** The 400ms is the budget for the system to respond, not for an animation to finish. Motion timing is a separate clock.
- **Pitfall:** An optimistic update with no rollback path turns a fast interface into a lying one.
- **Support:** Judgment, no version gate.
- **See also:** [web-performance-and-loading.md](web-performance-and-loading.md) for the loading path, [web-motion-and-interaction.md](web-motion-and-interaction.md) for the separate motion clock.

### H25. Goal-Gradient Effect

- **Rule:** Show progress toward completion with a step counter, a filled bar or a checklist.
- **Why:** Motivation increases as a goal gets closer, and the last steps get easier rather than harder.
- **When not to:** A one-step action has no gradient to show, and a progress bar there is theatre.
- **Pitfall:** A progress bar that jumps backwards when the flow gains a step teaches the user not to trust it.
- **Support:** Judgment, no version gate.
- **See also:** [web-accessibility-patterns.md](web-accessibility-patterns.md#a7-live-region-timing) for announcing progress changes.

### H26. Zeigarnik Effect

- **Rule:** Show the unfinished state of a task.
- **Why:** Incomplete tasks stay in mind, which is why a half-filled profile prompt works and a silently incomplete one does not.
- **When not to:** A completed task should stop asking, because a progress nudge on something already done reads as a bug.
- **Pitfall:** A completion meter that never reaches 100% because one optional field is empty trains the user to ignore it.
- **Support:** Judgment, no version gate.
- **See also:** [web-elements-and-attributes.md](web-elements-and-attributes.md) for the progress element.

### H27. Peak-End Rule

- **Rule:** Finish flows with a clear success state rather than dropping the user back where they started with no acknowledgement.
- **Why:** An experience is remembered by its most intense moment and its ending.
- **When not to:** A background sync the user did not initiate needs no ceremony.
- **Pitfall:** A toast that disappears in two seconds is not a success state for an action that took five minutes.
- **Support:** Judgment, no version gate.
- **See also:** [web-accessibility-patterns.md](web-accessibility-patterns.md#a7-live-region-timing) for the announcement that carries the success state.

### H28. Proximity

- **Rule:** Group related elements spatially with tighter spacing.
- **Why:** This is the same rule as more space around a group than within it, reached from the perception side rather than the layout side.
- **When not to:** A shared boundary already groups the items, so extra spacing inside it can break the group it was meant to hold.
- **Pitfall:** Uneven gaps inside one group read as two groups.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the spacing scale, [web-layout-and-sizing.md](web-layout-and-sizing.md) for the grouping mechanics.

### H29. Similarity

- **Rule:** Make elements that behave alike look alike.
- **Why:** Two buttons with the same role and different treatments read as two different things.
- **When not to:** A deliberate difference in treatment is the signal, such as one primary action among secondary ones. There the behavior differs too.
- **Pitfall:** A link styled as a button beside a real button leaves the user guessing which one navigates.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the action treatments.

### H30. Common Region

- **Rule:** Use a shared boundary deliberately, and drop the border when a background change already draws it.
- **Why:** A shared boundary such as a card, a panel or a bordered block groups whatever is inside it, and it groups more strongly than proximity does.
- **When not to:** Proximity already groups the items, so a boundary would add a box without adding meaning.
- **Pitfall:** A border plus a background change plus a shadow on the same card is three statements of one boundary.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the border and elevation rules.

### H31. Uniform Connectedness

- **Rule:** Connect elements with a line or a frame when they form one flow.
- **Why:** Visual connection binds more strongly than proximity or similarity, which is why a stepper with a connecting line reads as one flow and a row of separate circles does not.
- **When not to:** When the elements are alternatives rather than stages, a connecting line asserts a sequence that does not exist.
- **Pitfall:** Connecting every card with a line turns a grid into a claim about order.
- **Support:** Judgment, no version gate.
- **See also:** [web-layout-and-sizing.md](web-layout-and-sizing.md) for the layout that draws the connection.

### H32. Von Restorff Effect

- **Rule:** Make the important element visually distinct, but only one, or the effect cancels itself out.
- **Why:** The item that differs is the one remembered. This is the perceptual basis for usually exactly one primary action per page.
- **When not to:** A screen of equal-weight data rows has no exception to mark, and marking one at random teaches the wrong thing.
- **Pitfall:** Three highlighted cards in a row are three exceptions and therefore none.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the accent colours a single exception can use.

### H33. Law of Prägnanz

- **Rule:** Build from simple, regular forms.
- **Why:** The eye simplifies complex shapes into the simplest form it can, so designs built from simple regular forms are read faster and with less effort than intricate ones.
- **When not to:** A deliberately intricate illustration or brand mark carries meaning that simplification would remove.
- **Pitfall:** A card with a border, a shadow, a gradient and a corner ornament reads as four shapes.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for radius and elevation.

### H34. Jakob's Law

- **Rule:** Follow the familiar pattern, and deviate only where the deviation earns something the familiar pattern cannot give.
- **Why:** People spend most of their time on other products, so they expect yours to work the way those do. Familiar patterns are not a lack of imagination, they are a transfer of learning the user already paid for.
- **When not to:** A product whose whole value is a better way to do a familiar task has to deviate, and then it pays the learning cost once for every user.
- **Pitfall:** Inventing a novel date picker charges every user the same learning, and most of them will just type the date instead.
- **Support:** Judgment, no version gate.
- **See also:** [web-elements-and-attributes.md](web-elements-and-attributes.md) for native controls that already behave as expected.

### H35. Postel's Law

- **Rule:** Be liberal in what you accept and conservative in what you emit. Accept messy input such as pasted phone numbers with spaces, dates in several formats and trailing whitespace, then normalize it rather than rejecting it.
- **Why:** A validation error the system could have resolved itself is a defect.
- **When not to:** Where the format carries meaning that normalization would destroy, such as a leading zero in an account number, validate instead of rewriting.
- **Pitfall:** Silent normalization that changes the value without showing the result leaves the user unable to confirm it.
- **Support:** Judgment, no version gate.
- **See also:** [web-accessibility-patterns.md](web-accessibility-patterns.md#a16-error-association-in-library-and-hand-written-fields) for the error association that follows a rejected value.

### H36. Aesthetic-Usability Effect

- **Rule:** Finish the visual work, and do not let polish cover a broken hierarchy or an accessibility failure.
- **Why:** People perceive attractive interfaces as easier to use and they forgive more of their flaws. That is a reason to finish, not a licence to skip.
- **When not to:** Attractiveness never substitutes for a working control, so a beautiful screen that cannot be operated gets no credit at all.
- **Pitfall:** A beautiful screen with a contrast failure is a beautiful screen some users cannot read.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for the contrast minimums that survive the polish.

---

## 6. THE REVIEW PASS

An audit over UI code rather than a rendered picture. Every finding names a file, a line, the criterion it violates and the fix.

This pass starts from the code and works forward to findings, whether or not anyone has complained. The diagnosis tables in Section 3 start from a complaint and work back to a cause. Use both on a substantial review, because the checklist catches what nobody noticed and the diagnosis table explains what somebody did.

### Accessibility, critical

Fix before merge. Each row breaks the interface for someone.

| Check | WCAG | What to look for |
|---|---|---|
| Images without alt | 1.1.1 | `<img>` with no `alt` attribute |
| Icon-only buttons | 4.1.2 | `<button>` containing only an SVG or icon, with no accessible name. See [A2](web-accessibility-patterns.md#a2-accessible-name-order) |
| Form inputs without labels | 1.3.1 | `<input>`, `<select>` or `<textarea>` with no associated `<label>` and no `aria-label` |
| Non-semantic click handlers | 2.1.1 | `<div onClick>` or `<span onClick>` without `role`, `tabIndex` and `onKeyDown`. See [A3](web-accessibility-patterns.md#a3-roving-tabindex-and-active-descendant) |
| Missing link destination | 2.1.1 | `<a>` with only `onClick` and no `href` |
| HTML illustrations unlabelled | 1.1.1 | A composition of divs with no `aria-label`, so a screen reader announces the DOM tree |

### Accessibility, serious

| Check | WCAG | What to look for |
|---|---|---|
| Focus indicator removed | 2.4.7 | `outline-none` or `outline: none` with no visible focus replacement. Keep a visible focus indicator that survives forced-colors mode. See [A5](web-accessibility-patterns.md#a5-focus-visible-styling) and [A8](web-accessibility-patterns.md#a8-forced-colors) |
| Missing keyboard handlers | 2.1.1 | Interactive elements with `onClick` but no `onKeyDown` or `onKeyUp`. See [A13](web-accessibility-patterns.md#a13-menu-button) |
| Colour-only information | 1.4.1 | Status or error indicated by colour alone, with no icon or text |
| Touch target too small | 2.5.5 | Clickable elements under 44 by 44px. Expand with padding or a negative-inset pseudo-element, not by growing the visual box |
| Text contrast below minimum | 1.4.3 | Normal text under 4.5:1. The 3:1 allowance applies only to 24px regular or 18.66px bold |
| Functional border contrast | 1.4.11 | A border that is the only thing identifying a control, under 3:1 against its background |
| Tooltip on a disabled button | 4.1.2 | Disabled elements are not focusable, so the tooltip is unreachable. See [A14](web-accessibility-patterns.md#a14-tooltip) |
| Interactive content in a hover tooltip | 2.1.1 | The content cannot be reached by keyboard. See [A14](web-accessibility-patterns.md#a14-tooltip) |

### Accessibility, moderate

| Check | WCAG | What to look for |
|---|---|---|
| Heading hierarchy | 1.3.1 | Skipped levels, such as `h1` straight to `h3` |
| Positive tabIndex | 2.4.3 | `tabIndex` greater than 0, which disrupts natural tab order. See [A3](web-accessibility-patterns.md#a3-roving-tabindex-and-active-descendant) |
| Role without required attributes | 4.1.2 | `role="button"` with no `tabIndex="0"` |
| List keyboard navigation | 2.1.1 | A sequential list of focusable elements not navigable with arrow keys. See [A3](web-accessibility-patterns.md#a3-roving-tabindex-and-active-descendant) |

### Visual and component checks

**Layout and spacing**

- Spacing values that are not on the spacing scale in [web-visual-values.md](web-visual-values.md).
- Equal spacing inside and between groups, which makes grouping ambiguous.
- Overflow and alignment problems, `z-index` conflicts.
- Percentage widths on elements that should not scale.

**Typography**

- Mixed font families, weights or sizes with no system behind them.
- Font sizes off the type scale, or `em` used for the type scale.
- Line height not inversely tracking size, measure outside 45 to 75 characters.
- Missing font fallbacks.
- Font weight changing on hover or selected state, which shifts layout.

**Colour and contrast**

- Contrast below the minimums above.
- Grey text on a coloured background.
- Shades generated at runtime with `lighten()` or `darken()`.
- Dark mode inconsistencies: a mechanically inverted ramp, accents that were not desaturated, text a shade too bright.

**Components**

- Missing button states: disabled, loading, hover, active, focus. The `:active` state needs a scale transform.
- Missing form field states: error, success, disabled.
- Inconsistent borders, shadows or icon sizing.
- Shadows chosen by looks rather than by z-position, or two elevation systems mixed in one project.

**Motion**

- Motion timing and easing checks live in [web-motion-and-interaction.md](web-motion-and-interaction.md).

### Report format

Group by severity, most severe first. Every finding carries a location, the offending code, the fix and the criterion where one applies.

```text
UI REVIEW: <file or scope>

CRITICAL (n)
  [A11Y] path/to/file.tsx line 24: Button has no accessible name
    <button><CloseIcon /></button>
    Fix: add aria-label="Close"
    WCAG: 4.1.2

SERIOUS (n)
  [VISUAL] path/to/file.css line 88: Off-scale spacing (17px)
    padding: 17px;
    Fix: use 16px (--space-4)

MODERATE (n)
  ...

SUMMARY: n critical, n serious, n moderate
```

Report a count of zero explicitly rather than omitting the tier. A missing tier reads as "not checked".

### Rules for the reviewer

1. Read the files before assessing them. No finding from a filename or a guess.
2. Give a line number and the actual snippet for every finding.
3. Give the fix, not only the problem.
4. Order by severity, critical accessibility first, always.
5. Do not report a value as off-scale without checking the project's own token file first, because an established system outranks the defaults here.
6. Offer to apply the fixes, and do not apply them unasked.

---

## 7. COMPLETION CHECKLIST AND QUALITY GATES

### Task completion checklist

A UI task is complete when:

- [ ] Every spatial value, font size, weight, shadow, radius and duration came from a scale, or from an established system that supersedes it.
- [ ] The content has a stated primary, secondary and tertiary tier, separated by weight and colour rather than size alone.
- [ ] Exactly one primary action is styled as primary on the surface.
- [ ] Group spacing exceeds within-group spacing everywhere grouping is meaningful.
- [ ] Every text and control pair meets its contrast minimum (4.5:1 normal text, 3:1 large text and functional non-text).
- [ ] Interactive elements carry their full state set, and focus is visible.
- [ ] Motion durations sit in their band, similar elements share values and nothing animates that should not.
- [ ] No hard rule in this file is violated, or each deviation is stated with its reason.

### Quality gates

- **Scale conformance**: zero off-scale values, or each one named and justified.
- **Colour count**: shades come from a defined ramp, with no runtime-generated shades.
- **Breakpoint behavior**: large elements shrink faster than small ones, and nothing scales proportionally.
- **Signal redundancy**: no state or category communicated by colour alone.
- **Review output**: every finding carries a file, a line, a fix and a criterion where one applies.

---

## 8. REFERENCES AND RELATED RESOURCES

- [web-visual-values.md](web-visual-values.md) carries the spacing, type, colour, shadow and radius scales every fix here draws from.
- [web-accessibility-patterns.md](web-accessibility-patterns.md) carries the focus, naming, forced-colors and error-association contracts the accessibility rows cite.
- [web-motion-and-interaction.md](web-motion-and-interaction.md) carries the motion timing, easing and interaction feedback that pairs with the hierarchy work.
- [web-layout-and-sizing.md](web-layout-and-sizing.md) carries the sizing, container and scrolling mechanics behind the layout rows.
- [frontend-practice.md](frontend-practice.md) carries the shared principles this file applies.
