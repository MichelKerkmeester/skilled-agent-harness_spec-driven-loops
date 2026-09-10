# Iteration 4: The corpus shape

## Focus

Angle 4 of 5: 34 examples against 4 templates (the chart: 29 templates, no examples) — which
examples are the one canonical file per type (a template in disguise), which are variants (dark,
full, terminal, sketchy, consultant), which are decoration; the template/example split; what the
screenshots cover; what a catalog (the chart's `references/catalog.md`, read in both directions
by the check) would look like for 27 types; what moves out of the 37KB SKILL.md into references;
and the command — the stale names in `diagram.md` and the YAMLs.

## Findings

1. **The 34 examples decompose exactly: 27 canonical + 5 variant proofs + 2 import proofs — and
   ZERO decoration.** The 27 canonical examples match the 27 `type-*.md` files one-to-one
   (architecture, bar, data-flow, dp-integration, dp-security-matrix, er, flowchart, gantt,
   high-level, it-state, layers, line, loop, medallion, nested, org-chart, process, pyramid,
   quadrant, radar, scatter, sequence, state, swimlane, timeline, tree, venn). The 5 variant
   proofs: `example-loop-terminal.html` (terminal), `example-quadrant-consultant.html`
   (consultant), and the sequence trio — `example-sequence-oauth.html` (a second, fuller
   sequence), `example-sequence-oauth-dark.html` (dark), `example-sequence-oauth-full.html`
   (full). The 2 import proofs: `example-import-drawio.html`, `example-import-mermaid.html` —
   they exercise a WORKFLOW (the redraw of a source), not a type. Each TEMPLATE is proven by
   exactly one example: `template-dark` → the sequence-oauth-dark file (the only home of the
   dark role values, run 2: `#f08a59` ×8), `template-full` → sequence-oauth-full,
   `template-terminal` → loop-terminal (the only home of the terminal values), and the light
   shell ×27. The **sketchy variant is documented but unproven**: the skill promises it ("The
   sketchy variant applies to any minimal variant (SVG turbulence filter; see
   `references/primitives/primitive-sketchy.md`)", `SKILL.md:357-359`) and no example file
   exercises it (measured: no `*sketch*` in `assets/examples/`). One consequence: a dark-skin
   regression hides behind ONE file — 8 occurrences of the dark accent in a single example are
   the entire dark proof.
   [SOURCE: ls references/types/ (27 type-*.md + README); ls assets/examples/ (34); the no-sketchy grep; SKILL.md:341-359,357-359]

2. **What the screenshots cover: everything except the specimen — 38/38, 1:1.** `screenshots/
   templates/` = 4 (one per template), `screenshots/examples/` = 34 (one per example) — the
   same 38 files that fetch Google Fonts (run 1's fact, now explained: 34 examples + 4
   templates). `assets/icons.html` — the aria-hidden decoration specimen (`SKILL.md:389`) — has
   NO screenshot: it is the one corpus member without a type, a screenshot, or (today) an index
   row. The warm-vs-cool staleness question (does the PNG pair lag the guide?) stays OPEN: the
   pixel check was attempted and the sk-vision runtime answered RUNTIME_UNAVAILABLE — reported,
   not guessed. What IS measured: `:52` says the examples "were built under an earlier skin" and
   defers regeneration to "v5.1", yet `example-er.html:11-14` types the CURRENT role values
   (`#f5f5f5`, `#2d3142`, `#4f5d75`, `#eb6c36`), the warm spelling appears in 0/34 examples
   (run 2: `rgba(28,25,23…)`), and `#faf7f2` (the warm paper of the `:56` inversion rule)
   appears in no example at all. Either the regeneration silently happened and the note is
   itself stale, or "earlier" names a subtler iteration nobody can point to — both readings are
   prose nobody can check, which is the corpus disease (finding 4) one more time.
   [SOURCE: ls screenshots/{templates,examples}; SKILL.md:389; sk-vision RUNTIME_UNAVAILABLE; style-guide.md:52,56; example-er.html:11-14; run-2 rgba census]

3. **The same 27 are enumerated by hand in FOUR+ places, and they already disagree.** (a) the 27
   `type-*.md` filenames; (b) the selection guide, `SKILL.md:32-69` — 27 question→type rows, 1:1
   today; (c) the 27 canonical examples; (d) THREE disagreeing version fields: SKILL.md:5 = 1.0.0.0,
   style-guide.md:14 = 1.0.0.5, README.md:7 = 1.0.0.7 (the dispatch fact, verified); (e) the
   command: `diagram.md:66` binds "create-diagram-auto.yaml / create-diagram-confirm.yaml" while
   the files are `diagram-auto.yaml` / `diagram-confirm.yaml` (verified: the assets directory
   holds `diagram-auto.yaml`, `diagram-confirm.yaml`, `diagram-presentation.txt`); and (f) the
   OWNERSHIP: `SKILL.md:10` ("`create-diagram` is the `sk-doc` workflow packet") and
   `diagram-auto.yaml:8` ("using sk-doc create-diagram packet") say sk-doc, while
   `sk-design/mode-registry.json:89-110` registers `workflowMode: "sk-design-diagram"`,
   `packet: "sk-design-diagram"`, `command: "/design:diagram"` — and sk-doc's OWN
   `mode-registry.json` exists but never mentions "diagram" (grep: zero hits). Five mirrors,
   five drift sites, zero checks.
   [SOURCE: the four lists; SKILL.md:5,10,32-69; style-guide.md:14; README.md:7; diagram.md:60-72; the assets listing; sk-design/mode-registry.json:89-110; sk-doc/mode-registry.json (grep = no hits)]

4. **The chart's answer is the catalog, and its mechanics are stated, not implied.**
   `references/catalog.md`: "The index from a reader's question to the one chart form that
   answers it and the file that draws it, PARSED BY THE CORPUS CHECK IN BOTH DIRECTIONS"
   (`:16`); "Every row below points at a template that renders. When no row answers the
   question in front of you, that is a GAP TO REPORT rather than a chart to improvise. A
   freehand chart is what the template-first rule exists to prevent" (`:26-28`); the table is
   machine-read between `CHART_CATALOG:BEGIN/END` sentinels, columns matched by HEADER NAME, and
   the check runs BOTH ways: every `id` resolves to a file that self-identifies, AND every form
   on disk appears — "An index that names a chart it cannot reach is worse than no index"
   (`catalog.md:34-38`; `check-corpus.cjs:2527-2556`, including "A chart nothing indexes is a
   chart nobody finds", `:2590-2592`). The `system` column is the confession that mirrors drift:
   "a mirror of what a template declares… precisely why it can drift: nothing about a cell
   copied by hand keeps it agreeing with the file it describes" (`:2543-2545`), enforced by
   `checkCatalogSystem` — "the state this corpus was in until both documents were read against
   each other by hand. A check is what stops the next one" (`:2596-2612`). The diagram's analog
   nearly writes itself: move the selection guide (`SKILL.md:32-69` — ALREADY question-keyed)
   into `references/catalog.md`; its 27 rows gain machine columns — canonical example, the
   variant-availability lattice (dark: sequence-only; full: sequence-only; terminal: loop-only;
   consultant: quadrant-only; sketchy: NONE — finding 1), per-type ceilings (the `SKILL.md:338`
   promise, sourced from the type files — e.g. radar's "N axes (3–5)… Above 5 → split or use a
   comparison table", `type-radar.md:21`), import paths (the 2 workflow proofs), primitives, and
   a SKIN column whose SOURCE OF RECORD is the file's sentinel palette block (run 3's F3.4) —
   the `checkCatalogSystem` check ports 1:1 ("names a skin the token source defines"). The
   specimen gets a specimen row or stays the one unindexed thing, deliberately.
   [SOURCE: catalog.md:16,26-28,34-38; check-corpus.cjs:2527-2556,2543-2545,2590-2592,2596-2612; SKILL.md:32-69,338; type-radar.md:21]

5. **What leaves the 37KB: the duplications, not the knowledge.** Measured: the accessibility
   contract appears THREE times in ONE file (`SKILL.md:380-389` the contract, `:406` ALWAYS#7's
   paraphrase, `:495-509` the SUCCESS checklist); the node treatments and typography appear in
   BOTH `SKILL.md:313-322` AND their home `style-guide.md:92-141`; the Smart Router PYTHON
   pseudocode occupies `:179-296` — 117 lines, ~31% of the 37,116 bytes — while the chart's
   SKILL.md (11,264 bytes) routes in prose (`:60-115`) and keeps even its Resource Domains to
   ~14 lines (`:102-115`) against the diagram's 46 (`:125-170`). The triple-redundancy IS the
   drift mechanism: run 1's `:403`-vs-`:337` 4px contradiction lives between two of the copies.
   The doctrine: ONE LOCUS PER CONTRACT, everything else a reference — the hub routes, the
   references own. The kilobytes then fall to roughly the chart's shape (an 11KB existence proof
   for a domain twice as wide) — but the target is the locus count, not the size.
   [SOURCE: SKILL.md:179-296,313-322,380-389,406,495-509,125-170; style-guide.md:92-141; sk-design-chart/SKILL.md:60-115,102-115; wc: 11,264 vs 37,116 bytes]

6. **The command: three fixes, one decision.** Stale: `diagram.md:66`'s two YAML names (the
   bound-workflow sentence ALSO narrates "Phase 0 verification and setup resolution" and
   delegates all prompts to `diagram-presentation.txt` — the router/worker split is real, only
   the filenames rotted). Ownership: pick ONE locus — either the sk-doc-packet language in
   `SKILL.md:10` + `diagram-auto.yaml:8` yields to the sk-design registration (the only
   registration that EXISTS: sk-doc's registry, verified, carries no diagram entry), or the
   registration moves — with the other documents CITING it. Versions: the three fields (finding
   3d) become one. [SOURCE: diagram.md:60-72; SKILL.md:10; diagram-auto.yaml:8; sk-design/mode-registry.json:89-110; sk-doc/mode-registry.json]

## Sources Consulted

- `sk-design-diagram/references/types/` (27 + README), `assets/examples/` (34), `assets/templates/` (4), `screenshots/templates|examples/` (4+34)
- `SKILL.md:5,10,32-69,125-170,179-296,313-322,338,341-359,380-389,406,495-509`; `README.md:7`; `style-guide.md:14,52,56,92-141`
- `sk-design-chart/references/catalog.md:1-40`; `check-corpus.cjs:2527-2556,2590-2612,3095-3135 (run 3)`
- `.opencode/commands/design/diagram.md:60-72`; `.opencode/commands/design/assets/` (the 3 diagram files); `sk-design/mode-registry.json:89-110`; `sk-doc/mode-registry.json` (grep = no "diagram")
- `example-er.html:11-14`; the run-2 rgba/`#faf7f2` censuses; sk-vision RUNTIME_UNAVAILABLE (reported)

## Assessment

- **newInfoRatio: 0.9** — the 27/5/2 taxonomy, the unproven-sketchy gap, the 38/38 screenshot
  symmetry, the triple-stated accessibility contract, the 31% pseudocode share, the four-mirrors
  finding, and the registry/ownership facts are all newly measured; only the drift-disease FRAME
  (≈10%) re-uses earlier iterations.
- Novelty justification: every decomposition here (types↔examples↔variants↔screenshots↔mirrors)
  is a fresh enumeration; no earlier measurement subsumes it.
- Confidence: high on the enumerations (direct lists and greps); the catalogue column-set is
  this iteration's design, grounded clause-by-clause in the standard's contract; the metric-
  reflow and PNG-staleness threads remain open (one inference, one tool outage — both labeled).

## Reflection

- What worked: deriving the taxonomy BEFORE inventing categories — 34 = 27+5+2+0 closes the
  question; reading the catalog.md contract as a SPEC (sentinels, header-name matching,
  both directions) rather than a mood.
- What failed: the sk-vision runtime was down (RUNTIME_UNAVAILABLE) — the pixel question fell
  back to the prose/palettte evidence, honestly marked; one extra round-trip for the sk-doc
  registry existence, then its content.
- Ruled out: "decoration" as an example category (count: zero — the dispatch offered it as a
  possibility; the corpus is tighter than that); a NEWSkinner pitch that examples should become
  templates (the shells already are the templates; the canonical examples are their type-level
  proofs — renaming, not upgrading).

## Recommended Next Focus

Angle 5 — the verification loop and the phase plan: the chart's mutation suite contract
("refuses a case whose base already fails, whose anchor is missing, or whose failure comes from
another family; a completeness guard fails when a registered family has no case" —
`corpus-mutations.test.cjs`) adapted to the diagram checker of angle 1; the CI gate
(`chart-corpus.yml`, the literal `RESULT: PASSED`); what a fresh-reader capture review catches
that no check can (connector overlap, label collisions, focal balance); then sort EVERY finding
from angles 1-4 into [enforceable by a family] vs [judged], rank, and propose the phases after
this one — name, scope, the gate each ends on, and their order.
