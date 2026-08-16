# Remote for OpenCode — design specification

The target: **Anthropic's typographic restraint, OpenCode's constructed
geometry.** Warm neutrals, generous air, no divider lines, and lettering
built on a module grid rather than set in a typeface.

Everything here is derived from primary sources — Anthropic's shipping
brand CSS, OpenCode's own theme and brand SVGs, Apple's HIG, WCAG 2.2, and
published research on progress perception. Where a number came from
measurement rather than a spec it says so.

---

## 1. Foundations

### 1.1 Grid

4pt base unit. Every spacing and radius value is a multiple.

### 1.2 Color

Warm neutrals throughout. **This is the load-bearing rule of the whole
palette: nothing is a pure grey.** `#141413` is not black, `#faf9f5` is not
white, and the muted tone is a khaki. Use a pure grey anywhere and the
system stops reading as warm.

Anthropic's neutrals and OpenCode's are both warm-shifted, which is what
makes this common ground rather than a compromise.

| Token | Dark | Light | Notes |
|---|---|---|---|
| `canvas` | `#141413` | `#faf9f5` | Anthropic slate-dark / ivory-light |
| `surface` | `#1f1e1d` | `#f0eee6` | code blocks, tool output |
| `surfaceRaised` | `#262624` | `#e8e6dc` | sheets, elevated cards |
| `ink` | `#f4f0ec` | `#141413` | body text |
| `inkMuted` | `#b0aea5` | `#5e5d59` | secondary text, labels |
| `inkFaint` | `#87867f` | `#87867f` | timestamps only |
| `hairline` | ivory @ 10% | ink @ 10% | **alpha, never a grey stroke** |
| `accent` | `#e08a63` | `#d97757` | clay; dark leans toward OpenCode's apricot `#fab283` |
| `positive` | `#7fd88f` | `#3d9a57` | diff additions |
| `negative` | `#e06c75` | `#d1383d` | diff deletions, destructive |
| `caution` | `#f5a742` | `#d68c27` | permission prompts |

Rules:
- **Hairlines are 10% alpha ink, 1px, and only ever bound a surface.** No
  free-floating dividers. No drop shadows anywhere — elevation is a
  lighter surface, per Apple's base/elevated model.
- Accent is reserved for: the wordmark, the working indicator, and one
  primary action per screen. It is not the default control color.
- Body text targets ~13:1 contrast, not 21:1. Pure white on near-black
  blooms on OLED; `#f4f0ec` on `#141413` is the deliberate step down.

### 1.3 Type

System faces only — SF Pro for prose, SF Mono for code. They scale with
Dynamic Type, respond to Bold Text, and carry Apple's optical sizing and
tracking for free. A bundled face buys character at the cost of all four.

The exception is the wordmark, which is not type at all (§2.1).

| Role | Style | Color |
|---|---|---|
| Body prose | `.body` 17pt, +4pt line spacing (≈1.5) | `ink` |
| Emphasis | `.headline` 17 Semibold | `ink` |
| Heading 1 | `.title3` 20 Semibold | `ink` |
| Heading 2 | `.headline` 17 Semibold | `ink` |
| Heading 3 | `.body` Semibold | `inkMuted` |
| Role label | `.footnote` 13 Semibold, +0.4 tracking | `inkMuted` |
| Timestamp | `.caption2` 11 | `inkFaint` |
| Counters | `.footnote` `.monospacedDigit()` | `inkMuted` |
| Inline code | `.callout` mono 16 | `ink` on 7% chip |
| Code block | `.subheadline` mono 15 / 22 | `ink` on `surface` |
| Tool output | `.footnote` mono 13 | `inkMuted` |

Markdown headings are **compressed** — a `#` inside a chat message must not
render at 28pt on a phone. Space above a heading is ~3× the space below it,
which is what makes it read as belonging to what follows.

### 1.4 Space

The phone gives ~42 characters of measure at 17pt. There is no room to
spend, so: **assistant prose is full-width with no leading gutter.** Role
identity goes in a header row, never an avatar column — a 48pt avatar costs
6 characters, 13% of the line.

| Token | Value | Purpose |
|---|---|---|
| `lineExtra` | 4 | on top of the font's leading → ≈1.5 |
| `paragraph` | 16 | between paragraphs inside one message |
| `roleLabel` | 8 | label to its content |
| `betweenParts` | 12 | consecutive parts of one turn |
| `betweenTurns` | 40 | **the load-bearing number** |
| `gutter` | 16 | side margin |

**The one rule that replaces divider lines: `betweenTurns ÷ paragraph ≥ 2.0`.**
At 40:16 the ratio is 2.5. Drop below 2.0 and turn boundaries stop being
legible, and the temptation to add a rule comes back.

Every one of these is `@ScaledMetric(relativeTo: .body)`. A raw constant is
4pt at every accessibility size — visually zero against 53pt text.

### 1.5 Radii

`4` chip · `8` control · `12` content block (code, tool output, user turn) ·
`16` sheet · pill for capsules. Radius is semantic: shape alone should say
what kind of thing you're looking at.

### 1.6 Motion

House curve is Anthropic's own: `cubic-bezier(0.165, 0.84, 0.44, 1)` —
easeOutQuart. In SwiftUI: `.timingCurve(0.165, 0.84, 0.44, 1, duration:)`.

- Interaction feedback ≤ 200ms; sheets 200–500ms.
- **Never ease-in on UI.**
- Reduced Motion substitutes a gentler animation — never removes the
  signal. A loading indicator with its motion nuked is a broken indicator.

---

## 2. Identity

### 2.1 The wordmark is geometry, not a font

OpenCode's logotype is a **39×7 module grid**: letters 4 modules wide, 1
module apart, 1-module stroke, no optical kerning. It is constructed
lettering in the Wim Crouwel *New Alphabet* tradition, which is exactly why
it reads like an LED or flip-clock numeral. There is no typeface to
license.

Ours is built the same way and drawn from the same 4×5 cell definitions —
`BrandWordmark` in the app, `tools/mark/generate.py` for the icon.

**Uppercase, deliberately.** OpenCode's logotype is lowercase; matching it
exactly would read as an official mark rather than a compatible one. Same
grid language, our own letterforms.

Because it's geometry, it scales losslessly and can animate per module —
a scanline sweep across the grid is a signature loading state available to
nobody using a font.

### 2.2 App icon

Stacked `OC` / `RM` (OpenCode / ReMote), ink on `canvas`, second row in
`inkMuted` — echoing the two-tone split in OpenCode's own `open`/`code`.

---

## 3. Components

### 3.1 Transcript

- **No divider lines.** Structure is the §1.4 spacing ladder.
- Assistant: full-bleed on canvas, no container.
- User: tinted container, radius 12, inset ~48pt from the leading edge.
  Asymmetry is what separates the voices; bubbles on both sides read as a
  messenger app and undermine the tool framing.
- Code blocks **scroll horizontally and never wrap.** 80 columns would need
  a ~7.5pt font on a phone. Wrapping destroys indentation, which is the
  only structure code has. No line numbers — they cost 3–4 columns.
- Diffs are always unified on a phone. OpenCode's own split/unified
  breakpoint is 120 columns; we are never near it.
- Tool activity collapses at ~10 lines with a tap-to-expand footer.

### 3.2 Working indicator

Modelled on claude.ai's, which is a **heartbeat, not a spinner** —
measured from its shipping CSS:

```
1.8s cycle, asymmetric:
  0–10%   opacity 0.3 → 1.0   fast rise
  10–25%  hold at 1.0         bright hold
  25–65%  1.0 → 0.3           slow decay
  65–100% hold at 0.3         dim hold
```

The asymmetry is the whole effect; a sine wave reads mechanical.

**Below 1 second of latency, show nothing at all.** Cloudscape's rule, and
NN/g's: a looped animation under a second is distraction, not feedback.

**Say what it's doing, and escalate.** This is the highest-value element in
the whole spec and it costs nothing:

| Elapsed | Copy |
|---|---|
| 0–10s | the activity ("Reading files", "Running a command") |
| ≥10s | "still …" |
| ≥20s | "… still going" |
| ≥45s | "taking a while — Stop is available" |

Grounding: Apple's HIG for generative AI says to give specific feedback
("Finding substitutions for ingredients", not "Processing…"). Buell &
Norton (*Management Science*, 2011) found people **chose a slower service
62% of the time** when it showed what it was doing. Field observation puts
user confusion at ~4 seconds of a static screen.

Never show a percentage we can't honor.

### 3.3 Approval card

An agent asking to run a command is **related to an intentional action and
carries content** — Apple's HIG puts that on an action sheet or inline
card, explicitly *not* an alert. Every shipped agent tool converged there
independently.

- Three actions: **Allow once / Allow always / Reject**, with Reject
  opening "tell it what to do instead" rather than being a bare no. A
  denial should become steering.
- "Always" states its scope in the button, and confirms in a second step.
- **Vary the card by risk.** Reads pass silently; in-project edits get a
  low-chrome card; anything destructive or outside the workspace gets a
  visually distinct one. Anthropic reports users approve **93%** of
  prompts — a card that looks identical every time is optimizing for
  habituation, and varying presentation by risk is empirically supported
  against it.
- Separate Allow and Reject spatially. Adjacent 44pt targets for
  consequential opposites is a known hazard.

### 3.4 Composer

One rounded container (radius 26): attachments strip, text field, then a
control row — add-context and model on the left, dictate and send on the
right. 36pt circular controls. Send is the only accent in the bar.

---

## 4. Accessibility — non-negotiable

- Every transcript spacing value `@ScaledMetric`. No `.font(.system(size:))`,
  no `.font(.custom(_:size:))` without `relativeTo:`.
- **Never `minimumScaleFactor` in the transcript** — it undoes the user's
  setting. Never cap Dynamic Type there either; Apple requires >300% at AX5.
- No fixed `.frame(height:)` on anything containing text.
- Horizontal control rows must reflow at accessibility sizes
  (`dynamicTypeSize.isAccessibilitySize` → stack vertically).
- Contrast: 4.5:1 minimum for everything under 24pt; aim 7:1 for small text
  per Apple's own bar.
- Honor `accessibilityReduceTransparency`, `colorSchemeContrast`,
  `legibilityWeight`, `accessibilityReduceMotion`.
- The working indicator carries `.accessibilityAddTraits(.updatesFrequently)`
  and announces its activity changes.

## 5. Verification

- [ ] Preview at `.xSmall` and `.accessibility5` — nothing clips or overlaps
- [ ] Grep the transcript module for unscaled fonts and raw padding
- [ ] Code blocks scroll, never wrap
- [ ] Contrast measured in both modes, with and without Increase Contrast
- [ ] Bold Text on: everything responds
- [ ] Reduce Motion on: the indicator still signals

## Sources

Anthropic brand CSS (`ant-brand.shared.*.min.css`) and claude.ai token
extraction · OpenCode `packages/tui/src/theme/assets/opencode.json`,
`style/token/font.css`, brand SVGs · Apple HIG (typography, progress
indicators, generative AI, motion, alerts, action sheets) · WCAG 2.2
SC 1.4.3 / 1.4.8 / 1.4.11 / 1.4.12 · Harrison et al. UIST '07 and CHI 2010
on progress perception · Buell & Norton, *Management Science* 2011 ·
NN/g on progress indicators, confirmation dialogs, and consequential
options · Anthropic engineering posts on auto mode and sandboxing.
