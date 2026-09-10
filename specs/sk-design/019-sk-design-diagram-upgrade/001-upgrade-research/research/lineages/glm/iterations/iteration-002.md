# Iteration 2: The token source and the repaint

## Focus

Angle 2 of 5: compare the style-guide role table with the distinct hex values typed across the
examples; design the token source the way `palettes.json` works — roles, per-skin values,
diagram gates, a derivation record; decide how the three skins live in one source and whether a
file carries one skin or all; state what a repaint of 34 examples by value would change and
what it would break.

## Findings

1. **The 25-value census — verified, and concentrated.** Case-normalized, the 34 examples type
   exactly **25 distinct** six-digit hexes over **1,585 literals** (avg ~47/file). 83.1% of all
   typed literals are FOUR role values: `#4f5d75` (muted) ×602, `#2d3142` (ink) ×292,
   `#f5f5f5` (paper) ×245, `#eb6c36` (accent) ×178. The 25 decompose exactly: 9 light-ground
   values (the five roles + `paper-2 #ececec` + `link #2e5aa8` + treatment-white `#ffffff` ×40 +
   `rule-solid #bfc0c0` — which also serves as dark `muted`), 3 dark-only (`#f08a59`,
   `#6a95d8`, `#8e98ac`), 7 terminal (`#0a0a0a`…`#ff5a36`), 5 series (`#7c8f6f`…`#6e6479`), and
   1 type-scoped (`#3d4460` ×2). Skin values are quarantined per file: every `#f08a59` lives in
   `example-sequence-oauth-dark.html` alone; every `#141414` in `example-loop-terminal.html`
   alone — one skin per file holds at the example level, not just at the template level.
   [SOURCE: census over sk-design-diagram/assets/examples/*.html (grep+sort+uniq); attribution greps]

2. **Coverage: foundations 24/25, references 25/25.** Against `foundations/style-guide.md`
   alone, exactly ONE example value is undocumented: `#3d4460` (the dispatch's "one hex appears
   in no guide" — confirmed, and sharpened: it is documented in the TYPE reference,
   `type-high-level.md:418-419`, the chevron tables). Against `references/` as a whole the
   excess set is EMPTY — every typed value, including `#ffffff` (the `backend` treatment,
   `style-guide.md:132` — a treatment literal, not a role) and all 7 terminal + 5 series
   values, is written somewhere in the references. So the token source today = foundations
   roles + treatments + series + terminal + 27 type-scoped token tables; a foundations-only
   source orphans the 2 `#3d4460` polygons (`example-high-level.html:81,83`).
   [SOURCE: comm(E1) examples−style-guide = {#3d4460}; comm(E2) examples−references = ∅; style-guide.md:132; type-high-level.md:418-419]

3. **Skin residency: three tables in ONE source, one skin per FILE — and that split is right.**
   The guide already carries all grounds in one file: the role table with light+dark COLUMNS
   (`:35-46`), the series table with light+dark (`:60-66`), the terminal table as its own
   ground (`:74-84`). Deliverables carry one skin each: a single `:root` per template
   (`template.html:10`, `template-dark.html:10`, `template-terminal.html:19`,
   `template-full.html:12`), and 0 of 38 files reference `prefers-color-scheme`. Decision:
   **keep one-skin-per-file; the chart's dual-block ("each carries a light and a dark palette
   block") does not transfer.** Reasons: (a) a diagram's skin is a deliverable choice — the
   terminal template exists FOR the dev-post context it serves (`SKILL.md:341-355`); (b) 27
   types × 2 grounds = a 54-file doubling for no editorial gain; (c) 0/38 signals no
   reader-switch intent — unlike the chart, whose reader's ground is unknown, a diagram's venue
   is chosen by its author; (d) the export contract ships the `<svg>` node only
   (`SKILL.md:374-389`), which carries exactly one ground anyway. The SOURCE keeps all grounds —
   their values already co-occur across the corpus (finding 1).
   [SOURCE: style-guide.md:35-46,60-66,74-84; template.html:10; template-dark.html:10; template-terminal.html:19; template-full.html:12; prefers-color-scheme census 0/38; SKILL.md:341-355,374-389; sk-design-chart/SKILL.md brief]

4. **The derivation doctrine exists but is scattered — and half of it documents a dead skin.**
   Four derivation doctrines already live in the guide's prose: the brand mapping ("`soft`,
   `rule`, and `link` tokens are derived" from a five-color brand palette, `:52`); tint =
   accentRGB@α (`:45` — `#eb6c36`→`rgba(235,108,54,0.08)`; dark `#f08a59`→`rgba(240,138,89,0.10)`;
   the rgba's RGB equals the accent's hex in both skins); rule = inkRGB@α (`:42` —
   `rgba(45,49,66,0.12)` = `#2d3142` = rgb(45,49,66)); inversion + accent hue-shift (`:56`);
   plus a documented CROSS-SKIN alias (terminal-ink = "same white-smoke as default `ink`",
   `:80`). But the inversion rule's spellings — `rgba(28,25,23,X)` → `rgba(250,247,242,X)` —
   appear in **0 of 34** examples, while the current cool spelling `rgba(45,49,66,…)` appears in
   **32 of 34**: the guide's derivation record still documents the earlier warm skin its own
   note (:52) retired. `palettes.json` shows the corrective SHAPE: one derivation block
   (`:138`), gates (`:65`), role prose ("Every contrast ratio in this file is measured against
   it", `:32-33`), and the doctrine that the CHECKER reads the source rather than restating it
   (typeScale note: "so the check that rejects a size off the scale reads a value rather than
   restating one"). Under that shape the two-spellings problem from iteration 1 DISSOLVES: the
   source stores the hex; the rgba follows by derivation.
   [SOURCE: style-guide.md:42,45,52,56,80; rgba greps (28,25,23→0/34; 45,49,66→32/34); sk-design-chart/assets/color/palettes.json:5,32-33,65,138 + typeScale note]

5. **The diagram gates, computed.** Against the role values (`:37-46`), the brief's three gates
   plus the hairline case (WCAG 2.1 relative luminance, my arithmetic, 3rd-decimal rounding):
   **text-on-paper** — ink 11.8:1 ✓, muted 6.1:1 ✓AA (fails AAA's 7:1), soft 3.48:1 — and soft
   IS text (the 9px `sublabel` role, `:96`): it fails AA-4.5 today. **stroke-on-paper** — muted
   6.1:1 ✓, link 6.1:1 ✓, accent 2.86:1 (< 3:1) — and the treatments put accent TEXT on its own
   tint (~2.7:1; `type-high-level.md:209` "Title text in accent color"), so the focal mechanism
   itself sits below 3:1. **accent-against-ink** — 4.13:1 ✓ (focal remains distinguishable from
   ordinary strokes). **hairlines** — ink@0.12 ≈ 1.25:1, ink@0.25 ≈ 1.58:1: decoration; the
   gates must carry the exemption or every diagram fails. These numbers, signed off, become the
   diagram's gates block — the thing a colour family can actually assert.
   [SOURCE: style-guide.md:37-46,96,132; type-high-level.md:209; computed — labeled as such]

6. **The repaint: what it changes, what it breaks.** By value, repainting 34 examples = 1,585
   replacements, PLUS the four template `:root` blocks (the origin of future files — painting
   examples but not templates births the next file stale). What it CHANGES: the examples
   converge to the current skin — the note at `:52` admits they were built under the earlier
   skin and defers exactly this to "v5.1": this repaint IS the deferred task. What it BREAKS:
   (a) `screenshots/` go visually stale with no regenerator in the skill (the note itself calls
   regeneration a task, i.e. manual); (b) a hex-only value-replace misses the rgba spellings —
   accent-tint alone: ≥18 occurrences across just 6 sampled files, ink@α in 32/34 — unless the
   derivation record drives them (finding 4); (c) a foundations-only source orphans `#3d4460`
   (finding 2); (d) a "repaint the four rôle values" reflex touches 4 of 25 values — 21/25
   (dark, terminal, series, treatment, type-scoped) survive as a second generation unless the
   source versions ALL of them. What it does NOT break: titles/descs, ids, geometry — a
   value-replace is content-neutral. And what it cannot FIX: `#3d4460`'s status is a SCOPE
   decision (finding 2), not a paint. [SOURCE: census counts; style-guide.md:52; template :root lines; rgba greps; example-high-level.html:81,83]

## Sources Consulted

- `sk-design-diagram/references/foundations/style-guide.md` — :29-88 (tokens, role table :35-46, brand note :52, inversion rule :56, series :60-66, terminal :74-84), :92-99 (type scale), :111-141 (stroke/radius/spacing, treatments incl. :132)
- `sk-design-diagram/assets/templates/{template,template-dark,template-terminal,template-full}.html` — :root lines
- `sk-design-diagram/assets/examples/*.html` — the 25-value / 1,585-literal census; rgba(28,25,23|250,247,242|45,49,66|235,108,54 greps; `#f08a59`/`#141414` file attribution; `example-high-level.html:81,83`; `example-er.html` (88/4, re-verified run 1)
- `sk-design-chart/assets/color/palettes.json` — :1-48 (note, chrome, chromeDark, roles, radius, typeScale), :65 (gates), :77 (systems), :138 (derivation)
- `sk-design-diagram/references/types/type-high-level.md:209,418-419`; `sk-design-diagram/SKILL.md:341-355,374-389`

## Assessment

- **newInfoRatio: 0.8** — the census, the coverage split, the derivation-staleness, the gate
  computations, and the residency decision are new; ~20% re-derives run-1 facts (`#3d4460`,
  accent's two spellings) in the token-source frame.
- Novelty justification: the 1,585-literal concentration (83.1% in four values), the 24/25-vs-
  25/25 coverage line, the 0/34-vs-32/34 derivation-staleness, and the computed gate ratios were
  all measured or derived this iteration.
- Confidence: high on the greps (census, coverage, residency); the contrast ratios are my own
  WCAG 2.1 arithmetic — labeled derived, worth a second computation when the gates block is
  signed.

## Reflection

- What worked: case-normalizing the census before counting (the 25 matches the dispatch fact
  exactly); reading `palettes.json` BEFORE designing, which turned "design a source" into
  "adopt a documented shape"; attributing `#ffffff` to the treatments table instead of
  assuming it was a missing role.
- What failed: nothing this iteration — one pass, no retries.
- Ruled out: a foundations-only token source (orphans `#3d4460`, the only typed value it
  misses); the chart's dual-block-per-file for diagrams (0/38 `prefers-color-scheme`, 27×2
  cost, export ships one ground).

## Recommended Next Focus

Angle 3 — style reference, design-md and fonts: decide whether the diagram skill takes the
chart's carried-Style-Reference + applicator (`apply-design-md.cjs`), keeps its onboarding gate,
or both; what palette-derivation would mean here; and Google Fonts vs a system stack, judged
against what the editorial diagram loses without Geist and Instrument Serif and against the
"self-contained" claim (`README.md`) — now measured as 38/38 files, one remote host.
Carry in: the derivation record (finding 4), the gates (finding 5), 1-skin-per-file (finding 3).
