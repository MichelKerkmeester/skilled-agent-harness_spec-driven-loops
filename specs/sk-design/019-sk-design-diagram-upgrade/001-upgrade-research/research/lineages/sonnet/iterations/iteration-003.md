# Iteration 3: Style reference, design-md and fonts

## Focus

Verify glm's iteration 3 (angle 3) against disk, then deepen: whether the type scale reflows the
4px grid under substitute fonts, and whether README's "inlined CSS" wording strictly conflicts
with the remote stylesheet.

## Verification of the first lineage

- F3.1 CORRECTED (a real mischaracterization, not a miscount) — glm's "the checker's
  documented-exception precedent exists (`:936-938`)" is wrong about what those lines say.
  Read in full context (`check-corpus.cjs:905-945`): the comment at `:934-935` ("A sentence
  naming a remote font to warn an author off one is not a remote font, and this file already
  carries prose about url() for exactly that reason") explains why **comments are stripped before
  scanning** — it exists so a comment *mentioning* a font doesn't false-positive. It is not an
  allowlist, precedent, or exception for a *real* remote font `<link>`. The active pattern one
  screen above (`:918-923`: `/\b(?:src|href)\s*=\s*"(?:https?:)?\/\//i`) would flag any real
  `href="https://fonts.googleapis.com/..."` exactly like any other remote resource — the
  surrounding prose is explicit that "the contract forbids a web font in the same sentence as a
  CDN." **There is no existing precedent in the chart's checker for excusing a real font link.**
  The two documented bars (README's "no external images" vs the checker's no-network doctrine)
  are still real and still in tension, but "port an existing exception" is not an available move —
  a diagram-side allowlist mechanism would have to be invented from nothing, which is a bigger
  lift than glm's finding implies.
- F3.2 CORRECTED, and this is the load-bearing one — glm claims "the diagram declares families
  with NO fallback chain anywhere." **False.** Checked all four templates' `:root` custom
  properties: `template.html:15-17`, `template-dark.html:15-17`, and `template-full.html:23-25`
  each define `--font-sans: 'Geist', system-ui, sans-serif`, `--font-serif: 'Instrument Serif',
  serif` (or `, 'Times New Roman', serif` in template-full), `--font-mono: 'Geist Mono',
  ui-monospace, monospace` — real 2-3-level fallback chains, already shipped.
  `template-terminal.html:29` carries `--font-mono: "Geist Mono", ui-monospace, monospace` (no
  sans/serif vars, consistent with the terminal skin being monospace-only by design). Checked the
  inline SVG text as well: every `font-family="..."` attribute across the corpus resolves to
  exactly two literal strings — `'Geist Mono', monospace` and `'Geist', sans-serif` — both already
  carrying a generic-family fallback. **Every font declaration in the shipped corpus already has a
  fallback.** The real gap is narrower than glm's finding: `style-guide.md:92-99`'s TYPOGRAPHY
  TABLE lists bare family names in prose ("Instrument Serif", "Geist (sans)", "Geist Mono")
  without showing the fallback chain that the actual CSS/SVG already implements — a documentation
  omission, not a missing behavior. Porting "the chart pattern" (`bar-rows.html:82,142`, confirmed:
  `font-family: CursorGothic, Inter, system-ui, "Helvetica Neue", sans-serif;`) would mean writing
  down what already ships, not adding new fallback behavior.
- F3.3 CONFIRMED — `onboarding.md:87` reproduces exactly: "webfonts you can't replicate
  (custom-hosted, paid): keep the schematic defaults for typography and skin only the colors."
  The trio is defended as glm states.
- F3.4 CONFIRMED — `apply-design-md.cjs:157` rejects a URL argument
  (`fail('a local DESIGN.md path or --default is required; URL arguments are not allowed...')`),
  confirming local-only input; `--default` maps to `DEFAULT_DESIGN_PATH`; the write path
  (`:667-669`) writes to `options.out`, never in place. All three spot-checked mechanics hold.
- F3.5 CONFIRMED — not independently re-derived further this iteration; nothing found contradicts
  it.
- F3.6 CONFIRMED — consistent with iteration 2's independent HSL computation showing the
  diagram's own derivation practice is currently prose-only, which is exactly the gap F3.6 says
  the record-shape would close.
- F3.7 CONFIRMED — the 2.86:1-vs-3.0 conflict was independently re-derived via WCAG computation in
  iteration 2 (accent-vs-paper = 2.863:1), not just re-read here.

## Settled from "could not settle"

- **Whether the type scale reflows the 4px grid under substitute fonts — SETTLED, structurally,
  by argument rather than pixel measurement (no browser/vision tool is available in this
  environment; sk-vision was reported unavailable to the first lineage too).** The 4px grid rule
  (`SKILL.md:337,403`) constrains *authored numeric attributes* — `x`, `y`, `width`, `height`,
  gaps, radius — values fixed at write time. Font substitution changes how glyphs render inside a
  box; it does not rewrite any SVG attribute. **A substituted font cannot violate the 4px grid as
  the rule is actually written**, because glyph metrics and grid coordinates are orthogonal
  properties of the file. What substitution *can* do is overflow a fixed-width container: the
  arrow-label mask rects are hard-coded per label (`example-flowchart.html`: `width="24"` for
  "NO", `width="32"` for "YES", confirmed in iteration 1's F1.5 citation), sized for Geist Mono's
  specific advance width at 8px. A wider fallback monospace (e.g. `ui-monospace` resolving to a
  system font with a larger advance width) could make "YES" render wider than its 32px mask,
  causing visible clipping or bleed — a real risk, just not a grid violation, and not something
  this iteration's tools can measure directly. **What would measure it:** a headless-browser pass
  (`page.evaluate` calling `getComputedTextLength()` per `<text>` node under both the primary and
  each fallback font-family, before vs. after the mask width) — not available here; recorded as
  the concrete follow-up method rather than left unstated.
- **Whether README's "inlined CSS" wording strictly conflicts with the remote stylesheet —
  SETTLED, and this iteration disagrees with glm's characterization.** glm's own iteration 3
  said "it strictly does [conflict] — the wording is loose, noted not settled." Re-reading both
  cited passages verbatim (both citations check out at the correct lines, unlike iteration 1's
  F1.6): `README.md:23` says "inline SVG, **inlined CSS**, no external images, no required
  JavaScript" — "no external IMAGES," not "no external stylesheets" or "no external fonts"; a
  `<link>` to a font stylesheet is neither an image nor uninlined CSS (the page's own `<style>`
  block, containing the `:root` variables and rules, genuinely is inline — confirmed by
  inspection). `README.md:117` says "opens in any browser with no renderer, build step, or
  account" — three specific negatives, none of which is "no network." **Neither passage, read
  literally, claims a no-network bar; the word "self-contained" (used loosely elsewhere, e.g.
  README:12) is doing more work than the two specific claims actually support.** The tension glm
  and the dispatch brief both treat as a live contradiction is better described as: one loose
  marketing word ("self-contained") versus two narrow, technically-accurate claims that a Google
  Fonts link does not violate — and a third, separate document (`check-corpus.cjs`'s no-network
  doctrine) that the diagram skill never claimed to meet in the first place.

## What was extended

1. Full fallback-chain audit across all 4 templates' CSS custom properties and all inline SVG
   `font-family` attributes corpus-wide — the shipped fallback behavior is complete; only the
   style-guide's prose table under-documents it.
2. Corrected reading of `check-corpus.cjs:934-938` — a comment-stripping rationale, not an
   exception precedent; the practical consequence is that a diagram-side no-external family would
   need a genuinely new allowlist mechanism, not a ported existing one.
3. A structural (not measured) resolution of the font/grid-reflow question, naming the actual risk
   (label-mask overflow) and the exact method that would measure it.
4. A disagreement, stated plainly, with glm's own "it strictly does conflict" reading of the
   README wording — recorded as a genuine difference in textual interpretation, not a factual
   recount.

## Recommendations

1. [implementable today] Update `style-guide.md`'s typography table to show the fallback chains
   that already exist in the templates and inline SVG — a documentation fix, not a code change.
   This replaces glm's Recommendation #2 ("port three fallback chains") entirely: there is nothing
   to port, only something to document.
2. [needs a contract decision] Since no existing exception precedent excuses the Google Fonts
   link, the self-contained bar decision (keep-the-link vs. strip-it) must design a genuinely new
   allowlist mechanism if "keep the link" is chosen — scope that work explicitly in P2 rather than
   assuming it is a drop-in port.
3. [needs a contract decision] If the label-mask-overflow risk (from font substitution) matters
   for the offline-fallback case, either measure it with a headless-browser pass before shipping a
   fallback stack, or accept the risk explicitly and note it as a known limitation.
4. [implementable today] Correct any planning document currently citing "README's wording
   strictly conflicts" — the specific claims do not, on a literal reading; only the word
   "self-contained" is doing loose work, and that is a wording fix, not a behavior one.

## What this iteration could not settle

- The label-mask-overflow risk from font substitution is named and reasoned about but not
  measured (no headless browser/vision tool available); the method to measure it is stated as a
  concrete follow-up.
- F3.5's pin-discipline claim was not independently re-derived this iteration (no new evidence
  either way).
