# Iteration 3: Style reference, design-md and fonts

## Focus

Angle 3 of 5: does the diagram skill take the chart's carried-Style-Reference + applicator, keep
its onboarding, or both; what palette-derivation would mean here; and Google Fonts versus a
system stack, judged against what an editorial diagram loses without Geist and Instrument Serif
and against the "self-contained" claim the diagram README makes.

## Findings

1. **There are TWO documented bars for "self-contained", and the diagram satisfies the narrower
   one.** The README promises: "A single self-contained `.html` file: inline SVG, inlined CSS,
   **no external images**, no required JavaScript" (`README.md:23`), and "opens in any browser
   with no renderer, build step, or account" (`README.md:117`) — neither sentence promises
   *no network*, and the wording "no external images" is calibrated to survive the fonts
   `<link>` (whose `@font-face` CSS is, strictly, not inlined either — the wording is loose).
   The chart's bar is stricter: its `no-external` family errors on ANY remote src/href,
   `@import`, `fetch(`, dynamic `import()` and non-local `url()` — "A delivered chart has to
   open on a laptop with no network" (`check-corpus.cjs:918-945`). Measured (run 1): 38/38
   diagram files fail that bar on exactly one assertion — the fonts href, one host.
   So the upgrade question is not "contradiction" but "which bar": adopt the no-network
   doctrine (and then solve the fonts) or keep the no-external-images wording (and document the
   one sanctioned remote). The checker's precedent for documented exceptions already exists —
   "A sentence naming a remote font to warn an author off one is not a remote font"
   (`check-corpus.cjs:936-938`).
   [SOURCE: sk-design-diagram/README.md:23,117; sk-design-chart/scripts/check-corpus.cjs:918-945]

2. **The chart declares families WITH fallbacks; the diagram declares families, period.** Chart
   templates: `font-family: CursorGothic, Inter, system-ui, "Helvetica Neue", sans-serif` and
   `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`
   (`bar-rows.html:82,142`, `calendar-grid.html:85`) — a primary face, a near-kin, then the
   platform, with ZERO remote references. The diagram's type table declares role/family/size/
   weight only (`style-guide.md:92-99`), its Font stack section carries the Google Fonts
   `<link>` and the load-bearing *usage* rule — "Mono is for technical content... Never
   JetBrains Mono" (`:101-110`) — but **no fallback chain anywhere**: lose the network and the
   diagram drops to the browser default. The chart pattern ports verbatim as three chains:
   `Geist, Inter, system-ui, "Helvetica Neue", sans-serif` / `Instrument Serif, Georgia, serif`
   / `Geist Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` — the no-network
   *behavior* (a structured, same-voice fallback) arrives without dropping the identity, and the
   `<link>` remains the single documented remote.
   [SOURCE: sk-design-chart/assets/templates/bar-rows.html:82,142; calendar-grid.html:85; sk-design-diagram/references/foundations/style-guide.md:92-110]

3. **What the editorial diagram loses without the trio — the skill itself answers.** The
   schematic trio (Instrument Serif / Geist / Geist Mono) is load-bearing: the typography rule
   (`style-guide.md:108`), the node treatments (title = Instrument Serif 1.75rem; names = Geist;
   SKILL.md:318-322), and — decisive — the ONBOARDING DOCTRINE treats the trio as the defensible
   default: "If the site has only one family, keep the schematic defaults for the missing roles
   (Instrument Serif for title, Geist Mono for mono). Don't force-pick a mono font that isn't on
   the site" (`onboarding.md:87`), and "Site uses webfonts you can't replicate (custom-hosted,
   paid): keep the schematic defaults for typography and skin only the colors" (`:139`). Every
   customization path falls back TO the trio. A system-stack substitution would also silently
   reflow the 4px grid (12px/600 Geist names sized the node boxes; 9px sublabels) — plausible
   from the type table, not measured. [SOURCE: onboarding.md:87,139; style-guide.md:92-110,125-141; SKILL.md:318-322]

4. **The division of labor already exists in the standard; the diagram should inherit it, not
   invent a second one.** The chart's contract: extraction (URL→tokens) belongs to
   `sk-design-md-generator`; application (tokens→forms) belongs to `apply-design-md.cjs` — "it
   does not extract a site, open a URL or change the stock palette" (`design-md-theming.md:15-18`);
   the input must be a LOCAL v3 DESIGN.md — "URL arguments are not allowed" (`apply-design-md.cjs:158-159`);
   the parser reads "only the documented colour, typography, and radius sections" (`:3-4`); it
   "stages every output in memory until both theme gates pass" (`:4-5`); it writes themed COPIES
   to `--out` and never touches the stock corpus (`:668`); the checker IMPORTS the applicator's
   exports (`:688`, incl. `DEFAULT_DESIGN_PATH` :146 — `--default` = the carried reference's
   DESIGN.md, `:159`). Decision: **both** — keep the diagram's onboarding (it IS the extraction
   half, with four sanctioned routes: URL/skill/folder/manual, `SKILL.md:299-311`), and add the
   applicator as a third hand-run script beside the two extractors (the skill already ships
   three; this is a tool like them, not a build step). Its input = the diagram's own token
   source (run 2's decision), NOT a second DESIGN.md dialect; `--default` reproduces the stock
   skin exactly, which also mechanizes the shipped-default detection that today leans on a
   remembered constant ("if the accent value... differs from the shipped default, assume
   custom", `SKILL.md:311`).
   [SOURCE: design-md-theming.md:15-31; apply-design-md.cjs:3-5,146,158-159,668,688; SKILL.md:299-311,437]

5. **No second carried reference — but inherit the pin discipline.** The diagram's stock skin
   already records its provenance: the five-color brand mapping, "The `soft`, `rule`, and `link`
   tokens are derived (lighter slate, ink-at-opacity, and a saturated variant in the blue-slate
   hue family)" (`style-guide.md:52`). What the standard adds is that the derivation is *held*:
   the derivation record carries its reference's path AND its `sha256`
   (`palettes.json:142-143` — "One of those pins is held by the derivation rule because the
   palette depends on it"), the style-reference family demands the carried reference, its
   DESIGN.md, an origin record, and the hash-pin TABLE exist ("A reference nobody can trace is
   one nobody can re-derive or replace", `check-corpus.cjs:3110-3133`), and it rejects pins-less
   origins as "decoration that reads as evidence" (`:3100-3103`). A diagram-side evilcharts — a
   second, separate exemplar — would be redundant while the 27-type/34-example corpus itself
   demonstrates the voice (the reference-vs-corpUS split gets re-examined under angle 4).
   Whether the standard byte-verifies every origin pin, or only parses their presence and holds
   one, this read did not settle. [SOURCE: style-guide.md:52; palettes.json:142-143; check-corpus.cjs:3100-3133]

6. **What palette-derivation means here — the standard dictates the form.** Three doctrines:
   (a) the 3-list role taxonomy: "Every role is in exactly one of the three lists: it takes a
   reference token verbatim, it departs from one to clear a named gate, or it comes from an
   arithmetic the reference cannot carry" — recorded "in a form the corpus check can hold rather
   than a form a reader has to trust" (`palettes.json:140-141`); (b) derivation KINDS, machine-
   named: "ink-at-alpha: That theme's ink at a fixed alpha, **computed rather than picked**"
   (`:146-148`) — the diagram's `rule = inkRGB@0.12` (`style-guide.md:42`) and
   `accent-tint = accentRGB@0.08/0.10` (`:45`) are precisely this kind, and the guide's :52 note
   is already the prose draft of the 3-list record; (c) derivations are ENFORCED at apply-time
   (`color-gates.cjs` contrast import, `apply-design-md.cjs:12-15`) and CHECKED in-corpus — the
   design-md family literally re-derives: "dark.rule must be the dark ink colour followed by a
   non-full alpha" / "a solid value wearing an alpha channel" (`check-corpus.cjs:622-630`).
   The counter-example proves the need: the diagram's inversion rule STILL documents the retired
   warm skin (`rgba(28,25,23…)` — 0/34 examples; the cool spelling, 32/34; run 2's F2.4) — that
   is what a reader-trusted derivation record decays into. The diagram's record: the :52 prose,
   the :42/:45 arithmetics, and a re-anchored cool :56, expressed as roles-in-3-lists + kinds
   {accent-at-alpha, ink-at-alpha, inversion, cross-skin-alias} + gates + tolerances (the
   tolerance precedent: `RAMP_EVENNESS = 0.08` against shipped 0.010-0.015, "loose enough that a
   re-derivation under a different reference is not forced onto the same arithmetic, and tight
   enough that a ramp bunched at one end fails", `check-corpus.cjs:3096-3101`).
   [SOURCE: palettes.json:140-152; style-guide.md:42,45,52,56; check-corpus.cjs:622-630,3096-3101]

7. **The gates, translated — and one real conflict.** The standard's gates block: textOnSurface
   4.5, markOnSurface 3.0, emphasisAgainstFirstSeries 1.5, and the `ungated` clause — "The
   gridline role is deliberately not gated. A gridline pushed to 3:1 competes with the data
   drawn over it... Structure that fails to read is a design defect, not an access barrier, so
   it is reviewed by eye rather than by ratio" (`palettes.json:65-76`) — run 2's computed
   hairline exemption (1.25-1.58:1) is the standard's own doctrine, verbatim in spirit. Every
   gate "is computed once per theme, against that theme's own surface. A value that clears on
   paper has proved nothing about the dark ground" (`:66-67`; enforced by the THEMES array,
   `check-corpus.cjs:217-235`). Mapping the diagram's roles onto this ontology: text-on-paper
   4.5 → ink 11.8 ✓, muted 6.1 ✓, **soft 3.48 ✗** (the 9px sublabel; run 2) — the record's
   "departs to clear a named gate" list exists for exactly this; mark-on-paper 3.0 → the
   connector strokes: muted 6.1 ✓, link 6.1 ✓, and here the conflict: the chart holds its OWN
   emphasis to markOnSurface (`check-corpus.cjs:600-610`), and the diagram's signature accent
   measures **2.86:1** — below 3.0. Either the diagram's emphasisOnPaper departs (a derivation-
   record row, the mechanism's intended use) or the accent re-derives — not settled here, but it
   now has a HOME. The separation gate: accent-against-ink 4.13:1 clears
   emphasisAgainstFirstSeries=1.5 comfortably. Whether connectors are "marks" (gated 3.0) or
   "structure" (ungated, the :74-75 argument) is itself the mapping decision.
   [SOURCE: palettes.json:65-76; check-corpus.cjs:217-235,600-610; computed run 2]

## Sources Consulted

- `sk-design-diagram/README.md:3,12,23,117` — the self-contained wording
- `sk-design-diagram/references/foundations/style-guide.md:92-110` (type table, Font stack, the link, the load-bearing rule), `:125-141` (treatments), `:42,45,52,56` (derivation prose, carried from run 2)
- `sk-design-diagram/references/foundations/onboarding.md:41,64,79-87,139,186,192` — extraction routes; the schematic-trio defenses
- `sk-design-diagram/SKILL.md:299-311,437` — the gate, the five routes, the shipped-default detection
- `sk-design-chart/scripts/apply-design-md.cjs` — :1-24 (contract, imports, sentinel names), :146,158-159 (local-only, --default), :668 (copies), :688 (exports)
- `sk-design-chart/references/design-md-theming.md:14-31` — the division of labor, --scheme, --tokens
- `sk-design-chart/scripts/check-corpus.cjs` — :205-235 (palette-source, THEMES, per-surface), :596-630 (design-md gates, rule-derivation check, the 2-block ceiling rationale), :3095-3135 (style-reference, origin pins), :3096-3101 (RAMP_EVENNESS), :3150-3165 (palette-derivation)
- `sk-design-chart/assets/color/palettes.json:65-76` (gates + ungated doctrine), `:138-152` (derivation: 3-list taxonomy, reference+sha256, kinds)
- `sk-design-chart/assets/templates/bar-rows.html:82,142`; `calendar-grid.html:85` — fallback chains

## Assessment

- **newInfoRatio: 0.8** — the applicator mechanics (local-only, gates-at-apply, copies-to--out,
  checker-imports-applicator), the derivation record's 3-list/kind/sha256 form, the ungated
  doctrine, the fallback-chain pattern, the README wording, and the onboarding trio-doctrine are
  all new; the no-external, derivation-staleness, and gate threads recontextualize run-1/2
  findings.
- Novelty justification: every decision here rests on newly read mechanics (apply-design-md.cjs,
  design-md-theming.md, the gates/derivation blocks, onboarding.md) — the overlaps are
  re-frames of measured facts, not re-derivations.
- Confidence: high on the quoted mechanics (direct reads); the role→gate-ontology mapping
  (connectors = marks vs structure) is this iteration's own synthesis, offered with its
  alternative; the metric-reflow risk (finding 3) is inference, labeled.

## Reflection

- What worked: reading the applicator's code BEFORE the reference doc — the mechanics (:158,
  :668, :688) settled in one pass what the prose constrains; treating the README's wording as
  DATA ("no external images") rather than asumptions about "self-contained" turned a seeming
  contradiction into a pick-a-bar decision.
- What failed: nothing — one evidence pass, one follow-up (gates/derivation), no retries.
- Ruled out: a second carried exemplar-diagram for the diagram skill (the corpus IS the exemplar
  set; the pin discipline transfers without it); a second DESIGN.md dialect as the applicator's
  input (the token source, decided in run 2, already carries the vocabulary the 27 types read).

## Recommended Next Focus

Angle 4 — the corpus shape: 34 examples against 4 templates (the chart: 29 templates, no
examples); sort the examples — the one canonical file per type (a template in disguise), the
variants (dark, full, terminal, sketchy, consultant), the decoration; decide the template/example
split, what screenshots cover, what a catalog (the chart's `references/catalog.md`, read in both
directions by the check, `check-corpus.cjs:2530-2610`) would look like for 27 types, and what
moves out of the 37KB SKILL.md — including the command: the stale names in `diagram.md:67` vs
the actual YAMLs, and the mode-registry mismatch. Carry in: the 1-block/2-block contracts
(F2.3; `check-corpus.cjs:618-634`), the exemplar/corpus question (finding 5), the ramp question
(finding 7's unanswered: do bar/line/scatter need the ordered ramp the guide does not define?).
