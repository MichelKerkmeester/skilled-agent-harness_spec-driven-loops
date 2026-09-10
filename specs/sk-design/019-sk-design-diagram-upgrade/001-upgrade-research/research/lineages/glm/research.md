# Research — sk-design-diagram upgrade to the sk-design-chart standard (lineage: glm)

Binding: lineage `glm` of session `fanout-glm-1789060912130-0si5to`; spec folder
`specs/sk-design/019-sk-design-diagram-upgrade/001-upgrade-research`; executor: this process,
inline (cli-pi, model glm-5.3-flash). Five angles, one per iteration, in order; stop policy
max-iterations at 5; convergence before the cap is telemetry only.

Findings accumulate below, one section per iteration; the final synthesis follows the last
iteration. Every finding cites a local file and line.

## Iteration 1 — The contract and its checker

### What was read

`check-corpus.cjs` (tally census; family bodies `no-external` :918-945, `unique-ids` :975-990,
`accessibility` :992-1022; `RESULT: PASSED` :14, :3503); `sk-design-diagram/SKILL.md:297-444`
(design system, primitives, 4px grid + complexity budget, accessible-SVG contract, RULES,
connector mandates) and :468-530 (SUCCESS criteria); all 34 example files (accessibility,
marker-id, diagonal-line, 4px-grid, hex-count censuses); `references/foundations/style-guide.md:46`;
`references/types/type-high-level.md:127,209,418-419`.

### What was measured

- 75 `tally('` call sites over 47 distinct literal family names (documented figure: 42).
- Accessibility: `role="img"` 34/34; `aria-labelledby` 0 unresolved; 0 bare title/desc ids; title-first 34/34 — the dispatch's "33/34, example-loop-terminal.html" is wrong: the `<svg>` open tag closes at :177 and `<title>` at :178 is the first child, before `<defs>` at :184.
- no-external: 38/38 files reference `fonts.googleapis.com` — the ONLY remote host in any of them — against the "self-contained" output contract (SKILL.md:374).
- 4px grid: `example-flowchart.html:90,91,93,94` (y=230/239/298/307; more through :112) off-grid; its 22×22 pattern (:65) and width=1 rects are exempt per :337; :403 ("every font size...divisible by 4") contradicts :337 (font sizes exempt; connector gap 6-10px; radii 4/6/8).
- Orthogonal: sampled node connectors share an axis (`example-architecture.html:84,85,172,175`); the only diagonal-`<line>` census hits are radar spokes (`example-radar.html:3389-3392`) and the high-level inset (`example-high-level.html:1382-1383`) — legitimate non-connectors.
- Markers: 11/34 examples define the mandated trio (`SKILL.md:328`), 23 fail (`example-er.html:68` one; `example-bar.html` none; `example-data-flow.html:46-48` renames to `arr-*`); further drift: `arrow-sm/dim/soft/open`, `axis-*`. `id="dots"` appears in 26/34 files and `id="arrow"` nearly everywhere — unprefixed, unlike the :382 title/desc rule they collide exactly like.
- Budget: `example-high-level.html` = 29 `<rect>`, 10× `#eb6c36`; accent spells itself `#eb6c36` AND `rgba(235,108,54,α)` (`type-high-level.md:209`) — occurrence≠element.
- Tokens: `#3d4460` (`example-high-level.html:81`) is in NO foundations guide — only `type-high-level.md:418-419`; `#2e5aa8` IS a foundations role (`style-guide.md:46`, `link`); `example-er.html` types 88 hex literals vs 4 `var(--color-*)`.

### Findings

1. No html-svg checker exists; the taste gate is a manual checklist (`SKILL.md:407,470,493-509`).
2. The chart's contract unit — named family + concrete assertions + WHY-carrying errors (`check-corpus.cjs:918-1022`) — transfers; every assertion must be re-stated for SVG.
3. The accessible-SVG rules HOLD 34/34 today — a pure regression-guard family.
4. "Self-contained" fails 38/38 on exactly one assertion (the fonts href) — bless the stylesheet or drop it (angle 3).
5. The 4px rule becomes checkable only through its exemption list, which requires adjudicating :403 vs :337 first.
6. Orthogonal-only is checkable only with a type-aware connector allowlist; overlap/fan/gap/behind-box need a 2D pass, not regex.
7. The marker trio fails 23/34; the id vocabulary and the uniqueness scope (file vs page) are contract decisions.
8. Budget semantics (node, coral element) need a markup convention; occurrence≠element; accent has two spellings.
9. The "single source of truth" spans foundations + 27 type token tables — scope undecided; 88 typed literals in `example-er.html` alone.
10. Not statically holdable: pairwise connector geometry, budget semantics, page-level id uniqueness, semantic rules (type fit, remove test, taste, fidelity ledger), the :403/:337 conflict itself.

### Recommendations (ranked)

1. [needs a contract decision] Marker vocabulary: unconditional-vs-conditional trio, freeze the ids, decide uniqueness scope (file vs page). — 23/34 fail; 26× `id="dots"`.
2. [needs a contract decision] Adjudicate :403 vs :337 and write the exemption list AS the checkable rule. — `example-flowchart.html:90`.
3. [implementable today] Accessibility+metadata regression family (role, labelledby-resolution, prefixed, first-child) — 34/34 today.
4. [needs a contract decision] Define node/coral-element markup conventions before any budget family. — 29 rects; occurrence≠element; rgba spelling.
5. [needs a contract decision] Self-contained: bless-or-fold the single remote stylesheet. — 38/38; angle 3.
6. [implementable today] Token-fidelity check: every SVG hex ∈ (foundations ∪ type tables) — shape now, scope via angle 2.

### What this iteration could not settle

- Whether the marker trio is unconditional or conditional on connectors existing; the 11/23 arithmetic was hand-counted from the census (recount mechanically when drafting the family).
- Page-vs-file uniqueness scope; node/coral markup conventions; the :403/:337 adjudication; whether "self-contained" blesses the fonts stylesheet.
- Whether any example carries a second `<svg>` (title-first was tested on the first `<svg>` per file).

## Iteration 2 — The token source and the repaint

### What was read

`sk-design-diagram/references/foundations/style-guide.md:29-141` (role table :35-46, brand note
:52, inversion rule :56, series :60-66, terminal :74-84, type scale :92-99, treatments :111-141);
all four template `:root` lines; the full example-hex census plus rgba and dark/terminal
attribution greps; `sk-design-chart/assets/color/palettes.json:1-48` + gates :65, systems :77,
derivation :138; `type-high-level.md:209,418-419`; `SKILL.md:341-355,374-389`.

### What was measured

- 25 distinct case-normalized values over 1,585 typed literals; 83.1% = four role values (`#4f5d75`×602, `#2d3142`×292, `#f5f5f5`×245, `#eb6c36`×178); decomposition: 9 light-ground + 3 dark-only + 7 terminal + 5 series + 1 type-scoped.
- Coverage: foundations 24/25 (`#ffffff` = the `backend` treatment, :132); references/ 25/25 (E2 = ∅); the single miss is `#3d4460`, documented only at `type-high-level.md:418-419`.
- Residency: 3 skin tables in ONE source; 1 skin per deliverable (single `:root` per template at :10/:10/:19/:12; 0/38 `prefers-color-scheme`; every `#f08a59` in `-dark` only, every `#141414` in loop-terminal only).
- Derivation: doctrine exists in prose (:52 brand, :45 tint=accentRGB@α, :42 rule=inkRGB@α, :56 inversion, :80 cross-skin alias) — and :56's warm spellings appear in 0/34 examples while the cool `rgba(45,49,66,α)` appears in 32/34: the record documents the retired skin.
- Gates (computed, WCAG 2.1): ink-on-paper 11.8:1; muted 6.1:1 (AA ok, AAA-7 fail); soft 3.48:1 — the 9px sublabel fails AA-4.5; stroke: muted/link 6.1:1, accent 2.86:1 (tint-text ~2.7:1); accent-against-ink 4.13:1; hairlines 1.25-1.58:1 (decoration).

### Findings

1. The typed-hex corpus is four values deep (83.1%) but spans five token classes; skin values are quarantined per file.
2. The token source must span foundations + type tables: foundations-only orphans `#3d4460`; references-merged is lossless today.
3. Keep one-skin-per-file; the chart's dual-block does not transfer (0/38 signals, 27×2 cost, export ships one ground). The SOURCE keeps all grounds.
4. Adopt the `palettes.json` shape — one derivation block + gates + role prose, checker-read — and retire the stale warm inversion; the two-spellings problem then dissolves (store the hex, derive the rgba).
5. The gates block has real numbers — and one probable failure: the 9px soft sublabel at 3.48:1 (< AA 4.5), with accent-as-text at ~2.7-2.9:1 baked into the current treatments.
6. The repaint changes 1,585 literals + 4 template roots and is the deferred :52 "v5.1" task; it breaks stale screenshots, misses rgba unless derivation-driven, and must version all 25 values, not the four.

### Recommendations (ranked)

1. [needs a contract decision] Source scope = foundations + type tables (or promote type-scoped values to named roles) — BEFORE any value-map. — comm(E1)/comm(E2).
2. [needs a contract decision] One derivation record, `palettes.json`-shape (primary hex + tint/rule/inversion/alias rules + gates + role prose); retire :56's warm spellings. — 0/34 vs 32/34.
3. [implementable today] Gates block with the computed ratios and the hairline exemption; decide soft's 3.48:1 (fix or exempt). — needs sign-off on the arithmetic, not new evidence.
4. [needs a contract decision] Residency: keep 1-skin-per-file; SOURCE carries all grounds. — 0/38, :root×4, #f08a59/#141414 quarantines.
5. [implementable today] Repaint: derivation-driven, all 25 values + templates, then re-capture screenshots; sequence AFTER 1-2 or it bakes generation-3 values.

### What this iteration could not settle

- Whether soft's 3.48:1 counts as a gates failure or earns an exemption (a sign-off decision, not a measurement).
- Whether treatments belong IN the source or reference it (`#ffffff` at :132); which files carry the 40 `#ffffff` occurrences (unchecked).
- Whether the dark column's values are fixed derivations of the light ones or independent (the :56 hue-shift note is words, not a rule); the 2 examples carrying neither warm nor cool rule-rgba (unchecked).

## Iteration 3 — Style reference, design-md and fonts

### What was read

`README.md:3,12,23,117` (the self-contained wording); `style-guide.md:92-110` (type table, Font
stack, the Google Fonts link, the load-bearing rule) and `:125-141`; `onboarding.md:41,64,79-87,
139,186,192`; `SKILL.md:299-311,437`; `apply-design-md.cjs:1-24,146,158-159,668,688`;
`design-md-theming.md:14-31`; `check-corpus.cjs:205-235,596-630,3095-3135,3096-3101,3150-3165`;
`palettes.json:65-76,138-152`; `bar-rows.html:82,142`; `calendar-grid.html:85`.

### What was measured

- Two documented bars: the diagram's "no external images, no required JavaScript" (README:23) / "no renderer, build step, or account" (:117) vs the chart's no-network doctrine (check-corpus.cjs:918-945) — 38/38 fail the strict bar on exactly one assertion (the fonts href); the checker's documented-exception precedent exists (:936-938).
- The chart declares `CursorGothic, Inter, system-ui, "Helvetica Neue", sans-serif` + `ui-monospace, SFMono-Regular, …, monospace` (bar-rows.html:82,142) — families WITH fallbacks, zero remote; the diagram declares families with NO fallback chain anywhere (style-guide.md:92-110).
- The applicator: input = a LOCAL v3 DESIGN.md, URLs refused (:158-159); reads only the documented colour/typography/radius sections (:3-4); stages in memory until BOTH theme gates pass (:4-5, color-gates.cjs import :12-15); writes COPIES to --out, corpus untouched (:668); the checker imports its exports (:688; DEFAULT_DESIGN_PATH :146 = the carried evilcharts/DESIGN.md).
- The derivation record: 3-list taxonomy ("verbatim | departs from one to clear a named gate | arithmetic") recorded "in a form the corpus check can hold rather than a form a reader has to trust" (palettes.json:140-141); the reference pinned by path+sha256 (:142-143); kinds include "ink-at-alpha … computed rather than picked" (:146-148); enforced at apply, re-derived in-corpus ("dark.rule must be the dark ink colour followed by a non-full alpha", check-corpus.cjs:622-630); tolerance precedent RAMP_EVENNESS 0.08 vs shipped 0.010-0.015 (:3096-3101).
- Gates: textOnSurface 4.5, markOnSurface 3.0, emphasisAgainstFirstSeries 1.5, and `ungated` — "The gridline role is deliberately not gated… reviewed by eye rather than by ratio" (palettes.json:65-76); every gate computed once per theme, "against that theme's own surface" (:66-67; THEMES, check-corpus.cjs:217-235); the chart holds its own emphasis to markOnSurface (:600-610).
- Onboarding: four extraction routes (SKILL.md:299-311) with the trio as the defended default — "keep the schematic defaults (Instrument Serif for title, Geist Mono for mono)" (:87); "webfonts you can't replicate (custom-hosted, paid): keep the schematic defaults for typography and skin only the colors" (:139).

### Findings

1. The "self-contained" question is pick-a-bar, not contradiction: README wording satisfies its own narrower bar; the fonts href is the only strict-bar failure in 38/38.
2. Port the fallback chains (chart pattern, verbatim); the identity stays, the no-network behavior arrives, the link stays the single documented remote.
3. The trio is load-bearing — the onboarding doctrine itself defends it; a system-stack substitution silently reflows the 4px grid (inference, unmeasured).
4. Keep onboarding AND add the applicator — the standard's own division (extraction vs application); the applicator = a third hand-run script, input = the diagram token source, --default = stock-exact (mechanizing the remembered-constant shipped-default detection, SKILL.md:311).
5. No second carried reference; inherit the pin discipline (derivation carries reference+sha256; the 34 examples are the exemplar set).
6. Palette-derivation here = the 3-list + kinds + tolerances record; the :52 prose is its draft, the stale warm :56 is the decay it prevents; enforced at apply, re-derived in-corpus.
7. The gates conflict: the signature accent (2.86:1) sits below the standard's emphasis-3.0 — a "departs to clear a named gate" row or a re-derivation; hairlines = the standard's own `ungated` doctrine; whether connectors are marks (3.0) or structure (ungated) is the mapping decision.

### Recommendations (ranked)

1. [needs a contract decision] Pick the self-contained bar; the checker's no-external whitelist = the decision. (Lean: keep the link + fallbacks.)
2. [implementable today] Three fallback chains in the type table/Font stack (chart pattern; zero risk; fixes the offline default-to-Times).
3. [needs a contract decision] The applicator as a third hand-run script; sentinel 1-block/1-file; --default=stock-exact; COPIES to --out; sequence AFTER the derivation record (it2-R2) or it is a value-copier.
4. [needs a contract decision] The derivation record: 3 lists + kinds + tolerance; the :52/:42/:45 + cool-:56 rows; the emphasis-2.86-vs-3.0 conflict takes a departs row or a re-derivation.
5. [implementable today] Mechanize the shipped-default detection via --default diff (:311).
6. (flagged) Do bar/line/scatter need the ordered ramp the guide does not define (the chart's ramp + 3 ramp gates + evenness)? — to angles 4/5.

### What this iteration could not settle

- Connectors = marks (gated 3.0) or structure (ungated); whether the accent departs (2.86<3.0) or re-derives.
- Whether the standard byte-verifies origin pins (only presence + the derivation-held pin were read); the 2 examples carrying neither warm nor cool rule-rgba; the 4px metric-reflow under substitute fonts (unmeasured); whether README:23's "inlined CSS" wording conflicts with the remote stylesheet (it strictly does — the wording is loose, noted not settled).

## Iteration 4 — The corpus shape

### What was read

`references/types/` (27 + README); `assets/examples/` (34); `assets/templates/` (4);
`screenshots/{templates,examples}/` (4+34); `SKILL.md:5,10,32-69,125-170,179-296,313-322,338,
341-359,380-389,406,495-509`; `README.md:7`; `style-guide.md:14,52,56,92-141`;
`sk-design-chart/references/catalog.md:1-40`; `check-corpus.cjs:2527-2556,2590-2612`;
`diagram.md:60-72`; the command assets; `sk-design/mode-registry.json:89-110`;
`sk-doc/mode-registry.json`; the run-2 rgba/`#faf7f2` censuses; sk-vision (RUNTIME_UNAVAILABLE).

### What was measured

- The 34 examples = 27 canonical (1:1 with the 27 type-*.md) + 5 variant proofs (loop+terminal, quadrant+consultant, sequence+oauth+dark+full) + 2 import proofs; decoration: 0. Each non-light template proven by exactly one file; sketchy documented (SKILL.md:357-359) but exercised by none.
- Screenshots: 38/38, 1:1 — the same 38 files that fetch Google Fonts; icons.html: none. The :52 "earlier skin" note vs example-er.html:11-14's CURRENT role values; neither the warm spelling (0/34) nor #faf7f2 (0) appears in any example — the note or the regeneration is uncheckable prose.
- Four+ hand-kept mirrors of the same 27: the type files, the selection guide (SKILL.md:32-69), the canonical examples, THREE disagreeing versions (SKILL.md:5=1.0.0.0, style-guide.md:14=1.0.0.5, README.md:7=1.0.0.7), the stale bound-YAML names (diagram.md:66), and the ownership split (SKILL.md:10 + diagram-auto.yaml:8 say sk-doc; ONLY sk-design/mode-registry.json:89-110 registers; sk-doc's registry: zero diagram mentions).
- The catalog contract: sentinel-parsed (CHART_CATALOG:BEGIN/END), columns matched by HEADER NAME, both directions — row→file resolves, file→row ("A chart nothing indexes is a chart nobody finds", :2590-2592); the system column = the confessed mirror-drift (:2543-2545), stoped by checkCatalogSystem ("A check is what stops the next one", :2596-2612).
- The 37KB anatomy: the accessibility contract stated THREE times in one file (:380-389, :406, :495-509); treatments+typography duplicated from the guide (:313-322 vs :92-141); the router PYTHON pseudocode = 117 lines ≈ 31% of 37,116 bytes; the chart: 11,264 bytes, prose routing (:60-115), 14-line resource domains (:102-115) vs the diagram's 46 (:125-170).

### Findings

1. 27+5+2+0 — the taxonomy closes; sketchy is the one promised-but-unproven variant; the dark proof hides behind ONE file.
2. Screenshots are 1:1 (the PNG-staleness question: OPEN — tool outage reported; the prose evidence points both ways).
3. Five mirrors, five drift sites, zero checks — the versions, the YAML names, and the ownership already disagree.
4. The catalog port: the question-keyed selection guide MOVES to references/catalog.md with machine columns (canonical example, variant lattice, ceilings, imports, skin — sourced from the sentinel palette block), checked in BOTH directions.
5. One locus per contract: the duplication (×3 accessibility, ×2 treatments) IS the drift mechanism (run 1's :403/:337 lived between copies); the 37KB then approaches the chart's 11KB shape.
6. The command: fix 2 names, pick 1 ownership locus, collapse 3 version fields.

### Recommendations (ranked)

1. [needs a contract decision] The catalog: sentinel-wrapped, question-keyed, both-directions-checked; the selection guide moves; columns = question/type/canonical/variants/ceilings/imports/skin/specimen. — unlocks the completeness guard (angle 5).
2. [needs a contract decision] Skin column's source of record = the file's sentinel palette block (F3.4); checkCatalogSystem ports 1:1.
3. [implementable today] Fix the two stale YAML names (diagram.md:66); pick ONE ownership locus; collapse the three version fields.
4. [needs a contract decision] One-locus-per-contract pass over SKILL.md (×3→1+2refs; treatments/typography → the guide; pseudocode → out) — the 37KB answers itself.
5. [needs a contract decision] The variant lattice: EITHER prove sketchy (1 example) or descope it; EITHER more dark/full proofs OR declare 1-proof-per-template in the catalog, with the 8-occurrence dark exposure stated.
6. (flagged) The ordered-ramp question (F3.7) forces itself through the bar/line/scatter catalog rows — to angle 5.

### What this iteration could not settle

- The PNG warm-vs-cool staleness (sk-vision RUNTIME_UNAVAILABLE — reported); whether sk-doc's registry intentionally omits diagram (existence + zero-hits verified; intent unread); the precise ceiling wording in 26 of 27 type files (radar:21 proven; the other 26 = the catalog work); whether #faf7f2 survives anywhere outside guide :56.
