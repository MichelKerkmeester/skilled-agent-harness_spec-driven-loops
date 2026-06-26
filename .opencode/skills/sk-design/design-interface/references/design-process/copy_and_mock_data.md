---
title: "Copy and Mock Data (the content gate)"
description: "The content gate for built UI: plausible names, numbers, and copy with no lorem and no AI-tell phrasing, one copy register across the surface, fake-precision rules, and image-seed discipline. Catches the content defaults that make a well-designed page still read as AI-generated."
trigger_phrases:
  - "mock data discipline"
  - "no lorem ipsum copy"
  - "ai tell phrasing"
  - "one copy register"
  - "image seed discipline"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Copy and Mock Data

A page can have a grounded palette, a clean layout, and a real signature, and still announce itself as AI-generated through its words and its fake data. "Jane Doe" in a testimonial, `99.99%` in a stat block, "Elevate your workflow" in a headline, a lorem paragraph in a feature card, and three picsum images all seeded `image`, each of those is a content default the model reaches for when it stops thinking about the words and starts filling space.

This is the content gate. It runs alongside the layout gate in `mechanical_defaults.md` and the aesthetic direction in `design_principles.md`. Copy is design material, not decoration, so it gets the same intentionality as spacing and color. Where this reference gives a rule, it is a pass or fail rule, run it before calling the work done. The audit mode references this gate rather than restating it, so author the content rules here once.

Copy register inherits the Brand-vs-Product posture from `../../../shared/register.md`. A Brand surface carries voice and identity in the words, a Product surface stays plain and functional. The rules below hold for both, the posture only sets how expressive the one register is allowed to be.

---

## 1. OVERVIEW

### What this gate is for

The model has a stable set of content reflexes. It writes marketing cliche when it should write a plain claim. It invents engineering-precise numbers the brand never published. It mixes a technical register, an editorial register, and a marketing register in one composition. It fills empty space with lorem rather than draft copy. It seeds every placeholder image with the same generic word. Each of those is mechanical, and a pass or fail check catches it.

### How to run it

Before declaring any task done, re-read every visible string on the surface and inspect every mock value and image source. Walk the checks in Sections 2 through 6. A single fail means the content is not done. Where a check is a sweep (banned phrases, lorem, repeated seeds), grep or scan for it, do not rely on memory.

### What it does not cover

This gate does not cover layout, hero line count, bento math, or eyebrows, that is `mechanical_defaults.md`. It does not decide the aesthetic direction or the signature, that is `design_principles.md`. It covers the words, the mock data, and the placeholder imagery, and where those reveal the page as machine-made.

---

## 2. NO LOREM, NO PLACEHOLDER FILLER

Lorem ipsum is unfinished work wearing the costume of finished work. It tells the reviewer the content was never considered.

- **Never ship lorem ipsum.** Not in a hero, not in a card, not in a footer. Write real draft copy that says what the section actually says. Draft copy that is plain and specific beats latin filler in every case.
- **No placeholder labels left in visible text.** `alt="image"`, `alt=""` on a meaningful image, `Lorem`, `Your headline here`, `Body copy goes here`, all banned in the rendered surface. A genuine empty slot that needs a real asset is a code comment slot (`<!-- TODO: hero product photo, 1600x1200 -->`), not visible filler.
- **Empty states are written, not blank.** An empty dashboard or list is an invitation to act, with a real one-line direction, not a void and not lorem.

**Pass check:** sweep the rendered strings for `lorem`, `ipsum`, `headline here`, `your text`, and empty or generic alt text. Any hit is a fail.

---

## 3. NO AI-TELL PHRASING

A specific cluster of words and constructions reads as machine-written. Some are marketing filler, some are the model trying to sound thoughtful. Both fail.

- **Banned marketing filler verbs and nouns.** "Elevate", "Seamless", "Unleash", "Next-Gen", "Game-changer", "Revolutionize", "Delve", "Tapestry", "In the world of...", "Supercharge", "Empower". These are the cross-project monoculture of AI copy. Replace each with a concrete verb that says what the thing does.
- **No exclamation marks in success and status copy.** Be confident, not loud. "Saved" not "Saved!". "Your changes are live" not "Success!".
- **No "Oops!" error voice.** Errors are direct and actionable: "Connection failed. Please try again." not "Oops! Something went wrong."
- **Active voice as default.** "We could not save your changes" not "Mistakes were made". A control says what happens when used: "Save changes" not "Submit". An action keeps one name through the whole flow, the button that says "Publish" produces a toast that says "Published".
- **No performative-craftsman labels.** "From the field", "Field notes", "Currently on the bench", "On our desks", "Loose plates" as section labels read as forced. Use a plain functional label ("Testimonials", "Latest writing", "Now working on") or no label.
- **No mock-humble or mock-poetic micro-copy.** "Two plans but one is honest", "an elegant nothing", passive-aggressive humility, ironic strawman copy that names a concept then layers a wink on it. Make the specific claim instead.
- **No "Quietly in use at" or "Quietly trusted by".** Use natural language ("Trusted by", "Used at", "Customers include") or let the logos speak with no heading.

### The copy self-audit (mandatory before ship)

Re-read every visible string: headlines, subheads, eyebrows, button labels, body copy, captions, alt text, footer text, error messages. Flag any string that is:

- Grammatically broken or a non-sentence ("free on its past", "to put it on the table" out of context).
- Carrying an unclear referent ("we plan to stay that way" with no prior context).
- A forced metaphor or cute-but-wrong wordplay that does not track.
- Reading like an LLM trying to sound thoughtful (fake-craftsman labels, mock-poetic meta).

Rewrite every flagged string. If you are unsure whether a string makes sense, replace it with a plain functional sentence. Cute AI copy is worse than boring copy.

**Pass check:** grep the surface for the banned filler list and for exclamation marks in status copy. Run the self-audit over every visible string. Any banned phrase, any flagged string left unrewritten, is a fail.

---

## 4. PLAUSIBLE NAMES, BRANDS, AND CONTENT

Mock content that is obviously mock breaks the illusion the design is built to create.

- **No generic person names.** "John Doe", "Jane Smith", "Sarah Chan" as filler. Use diverse, realistic, locale-appropriate names that read as real people.
- **No placeholder company names.** "Acme Corp", "Nexus", "SmartFlow", "Cloudly". Invent a contextual, believable brand name that fits the sector.
- **No repeated identity.** The same avatar image for several distinct people, or the same date on every blog post, breaks realism. Give each distinct person a unique asset and vary dates so they read as real.
- **No generic avatars.** No SVG egg, no default user glyph repeated. Use believable photo placeholders or specific per-person styling.
- **Sentence case on headers, not Title Case On Every Word.** Title case on every header is a tell. Use sentence case unless the brand voice is explicitly otherwise.
- **Real logos for social proof, not text wordmarks.** When a section calls for a trust or customer logo wall, use real SVG marks (a known-brand icon set, or a generated monogram for an invented brand) rather than plain styled text wordmarks. A logo wall is logos and nothing else, no industry or category label printed under each logo.

**Pass check:** scan every name, brand, avatar, and date in the surface. Any generic placeholder name, any repeated avatar or date used as filler, any plain text wordmark standing in for a logo, is a fail.

---

## 5. FAKE-PRECISION RULES

Invented engineering precision is one of the most common content tells, because the model likes the texture of a specific number even when no such number exists.

- **A number is allowed only if it is real, or labeled mock.** Numbers like `92%`, `4.1x`, `48k`, `5.8 mm`, `13.4 lb` either come from real data (the brief, brand guidelines, a public metric), or are explicitly marked as mock (a code comment, an "example" or "sample data" label). An AI-invented spec number dressed as fact is banned.
- **Do not fake precision the brand does not claim.** A cookware brand that never published a thermal-conductivity figure does not get one invented for a spec tile. If the precise number is not grounded, use a rounder honest claim or drop it.
- **Avoid fake-perfect round numbers too.** `99.99%`, `50%`, `$100.00`, `1234567` read as placeholder. Real data is organic and slightly messy (`$99.00`, `47.2%`, a real-looking phone number). The failure runs in both directions: invented over-precision and lazy round numbers are both tells.
- **Live counters need real data.** "Reservation 412 of 800", "last sync 4s ago" as decoration is banned unless the brief is a real limited-run or live-status surface with real numbers behind it.

**Pass check:** list every number in the surface. For each, confirm it is grounded in the brief or marked mock. Any unlabeled invented-precise number, and any fake-perfect round number used as a real claim, is a fail.

---

## 6. ONE COPY REGISTER

A register is the voice and texture of the words. Mixing registers in one composition reads as several different authors, which reads as a machine assembling fragments.

- **Pick one register for the surface and hold it.** Do not mix a technical mono voice ("47 tasks · 0.6 ctx-switches/day"), editorial prose, and marketing punch in the same page unless the brand voice explicitly calls for the contrast.
- **The register follows the posture.** A Brand surface (`../../../shared/register.md`) carries an expressive, voice-led register, the words carry identity. A Product surface stays plain, functional, and consistent, one register across every screen. Set the posture first, then write in its single register.
- **Each element does exactly one job.** A label labels, an example demonstrates, a caption captions. Nothing quietly does double duty. A control names what people recognize and control, never how the system is built (a person manages notifications, not webhook config).
- **Consistency is how people learn the surface.** The vocabulary of an interface is the signposting. An action keeps its name through the flow, terms stay stable across sections. Cohesion is a usability property, not a style preference.

**Pass check:** read the surface end to end and name its register in one phrase. Confirm no section breaks into a different register without a brand reason. Confirm action names are stable across the flow. A mixed register with no brand justification is a fail.

---

## 7. IMAGE-SEED DISCIPLINE

Placeholder imagery is content too, and a lazy seed is as much a tell as lazy copy. Real or generated imagery is always first choice, the rules here govern the placeholder fallback.

- **Real or generated imagery comes first.** If an image-generation tool is available, use it for section-specific assets at the right aspect ratio. When no generator is available, use a real placeholder source. A pure-text page with div-based fake screenshots is not minimalism, it is incomplete.
- **Seed every placeholder descriptively and uniquely.** When using a seeded placeholder source, the seed describes the section (`marrow-cookware-kitchen`, `studio-portrait-amelie`), it is never the literal word `image` or `photo`, and it is never the same seed reused for several distinct images. A repeated or generic seed produces the same picture twice and reads as filler.
- **Right aspect ratio per slot.** Request the dimensions the section actually needs, not a single square reused everywhere. A hero asset and a thumbnail are different shapes.
- **No div-based fake screenshots.** A product preview built from styled divs (a fake task list, a fake terminal, a fake dashboard) is a top tell. Use a real screenshot, a generated image, a real mini-component preview, or skip the preview.
- **No hand-rolled decorative SVG as a fallback.** Crude sketchy illustrations, paper-grain filters, and many-path scenes meant to depict a real subject read as amateurish. If you cannot render the scene with real assets, ship no illustration rather than a sketchy stand-in.
- **No pills or captions overlaid as decoration.** No tag span on a photo (`Plate · Brand`), no pretentious photo-credit caption (`Field study no. 12 · Ines Caetano`) under a placeholder image. A real photo credit for a real photographer with permission is fine, decoration is not.
- **Every image needs real alt text.** Describe the content for screen readers. Never `alt="image"` or empty alt on a meaningful image.

**Pass check:** list every image source and its seed. Confirm each seed is descriptive and unique, each slot uses an apt aspect ratio, and no slot is a div-based fake or a sketchy SVG. Confirm every meaningful image has real alt text. Any generic or repeated seed, any fake screenshot, any decoration caption, is a fail.

---

## 8. THE CONTENT SWEEP (RUN BEFORE DELIVERY)

Run this as the last content filter. Every box is binary.

- [ ] No lorem, no placeholder filler text, no generic or empty alt text in the rendered surface.
- [ ] No banned filler verbs or nouns, no exclamation marks in status copy, no "Oops!" error voice.
- [ ] Active voice as default, action names stable across the flow.
- [ ] Copy self-audit run over every visible string, every flagged string rewritten or replaced with a plain sentence.
- [ ] No generic person names, no placeholder company names, no repeated avatars or dates as filler.
- [ ] Sentence case on headers, real logos (not text wordmarks) on any trust wall, logos only with no category labels.
- [ ] Every number is grounded in the brief or marked mock, no invented engineering precision, no fake-perfect round numbers as real claims.
- [ ] One copy register across the surface, matched to the Brand-vs-Product posture.
- [ ] Every placeholder image seed is descriptive and unique, apt aspect ratio per slot.
- [ ] No div-based fake screenshots, no sketchy SVG fallback, no decoration pills or photo-credit captions.
- [ ] Every meaningful image has real alt text.

If a single box cannot be honestly checked, fix it before delivering.

---

## 9. RELATED RESOURCES

- [`design_principles.md`](./design_principles.md) Section 6 owns interface writing principles. This gate is the mechanical content complement that catches the defaults.
- [`mechanical_defaults.md`](./mechanical_defaults.md) owns the layout gate: hero line count, bento math, eyebrow ban, button contrast, spacing.
- [`brief_to_dials.md`](./brief_to_dials.md) owns the Design Read intake that sets the dials before content is written.
- [`../../../shared/register.md`](../../../shared/register.md) sets the Brand-vs-Product posture that fixes which single copy register applies.
- The audit mode references this content gate rather than restating it. Author the content rules here once.
