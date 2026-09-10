# Iteration 1: The contract and its checker

## Focus

Angle 1 of 5: read the chart checker's family list (`check-corpus.cjs`, grep `tally('`) and the
diagram SKILL.md RULES and SUCCESS CRITERIA; for each diagram rule that a regex over an SVG can
hold, name the family, the assertion, and one example file that fails it today with a cited line;
name what cannot be held statically and why.

## Findings

1. **The diagram skill ships no HTML/SVG checker.** The only shipped validator runs on
   `ascii-markdown` output: `bash scripts/validate-flowchart.sh` — RULES #8 requires exit 0 before
   delivering ASCII, and the SUCCESS criteria repeat it; the `html-svg` taste gate
   (`SKILL.md:470` "Run the applicable validation gate before delivery", checklist at
   `SKILL.md:493-509`) is a manual checkbox list with nothing executing it. The skill's own
   non-negotiables — the accessible-SVG contract (`SKILL.md:380-382,406`) and the five mandatory
   connector rules (`SKILL.md:425-432`) — have no automated witness at all.
   [SOURCE: sk-design-diagram/SKILL.md:407,470,493-509,529]

2. **The chart's contract is a checker, and its unit is the family.** `check-corpus.cjs` holds 75
   `tally('...')` call sites over 47 distinct literal family names (documented figure: 42
   families — the delta, e.g. harness-meta families like `document-shape`/`identity` and the
   `render*`/`settled-render`/`dark-render` probes, must be resolved when the diagram family list
   is drafted, not guessed). It prints `RESULT: PASSED` only when a rule set, not merely the exit
   code, passes (`check-corpus.cjs:14,3503`). Family semantics sampled: `no-external` runs five
   remote-dependency patterns plus `url()` targets with the rationale written into the error
   ("opens on a laptop with no network", `check-corpus.cjs:918-945`); `unique-ids` reports a
   duplicated element id because "two charts silently render into one container"
   (`check-corpus.cjs:975-990`); `accessibility` checks `role="img"` per `<svg>`, then resolves
   every `aria-labelledby` reference against the id set, then demands `data-chart-table` in markup
   (`check-corpus.cjs:992-1022`). The transferable idea: each rule = a named family + concrete
   assertions + a file-scoped error that says WHY. The mandated adaptation: every assertion must
   be re-stated for SVG diagrams — what it reads, what it errors on, which diagram file fails it
   today. [SOURCE: sk-design-chart/scripts/check-corpus.cjs:214,918-945,975-990,992-1022,3503]

3. **The accessibility contract holds today — 34/34.** All 34 examples carry `role="img"`;
   every `aria-labelledby` reference resolves (0 unresolved across 34 files); no bare
   `title`/`desc` ids (e.g. `loop-terminal-title`); and title-first: all 34. This corrects the
   dispatch fact "33 of 34; example-loop-terminal.html does not": in that file the `<svg>` open
   tag spans :172-177 (attributes at :173-176) and `<title>` at :178 is the first child, before
   `<defs>` at :184. [SOURCE: sk-design-diagram/assets/examples/example-loop-terminal.html:172-184; grep census over assets/examples/*.html]
   Caveat: the title-first check tested the first `<svg>` occurrence per file.

4. **Self-contained vs Google Fonts — 38/38 violations, exactly one remote host.** Every diagram
   file (34 examples + 4 templates) references `fonts.googleapis.com`, and the host census shows
   it is the ONLY remote `src`/`href` in all 38. The skill's own output contract says "one
   self-contained `.html` file with embedded CSS, inline SVG, and no required JavaScript"
   (`SKILL.md:374`); the chart's `no-external` family would fail every diagram file today on
   precisely one assertion — the stylesheet href (`example-architecture.html:7`).
   [SOURCE: sk-design-diagram/SKILL.md:374; sk-design-diagram/assets/examples/example-architecture.html:7; sk-design-chart/scripts/check-corpus.cjs:918-945]

5. **The 4px grid fails today — and contradicts itself.** `example-flowchart.html` has
   non-4-divisible coordinates: y=230 at :90, y=239 at :91, y=298 at :93, y=307 at :94 (and more
   through :112) — while its 22×22 dot pattern (:65) and width=1 rects (:103,:107,:111) are
   exempted by the rule's own exemption list ("stroke widths, opacity, dot pattern, font sizes",
   `SKILL.md:337`). The internal contradiction: ALWAYS #4 says "every font size, coordinate, node
   dimension, and gap divisible by 4" (`SKILL.md:403`) — but :337 exempts font sizes (the type
   scale: 9px sublabels, 7-8px eyebrows), and the connector mandate requires a 6-10px
   label gap (`SKILL.md:425-432` #12) whose legal values (6,7,9,10) are not 4-divisible; :337's
   own good-radius list is "(4/6/8)". A checker cannot assert both readings: the checkable
   contract is the exemption list, not "divisible by 4", and the :403-vs-:337 conflict must be
   adjudicated before the family is written. [SOURCE: sk-design-diagram/assets/examples/example-flowchart.html:90-112; sk-design-diagram/SKILL.md:337,403,425-432]

6. **Orthogonal-only holds where it applies; the assertion needs a type-aware allowlist.** In
   `example-architecture.html` every sampled straight `<line>` shares an axis (:84, :85, :172,
   :175 — x or y equal), as the rule allows. The diagonal-`<line>` census over all 34 examples
   finds only legitimate non-connector lines: radar spokes (`example-radar.html:3389-3392`,
   (500,240)→(652,191) etc.) and the inset mini-map (`example-high-level.html:1382-1383`). A
   naive "no diagonal `<line>`" family would fail radar legitimately — the rule (rounded
   right-angle connectors, `SKILL.md:425-432` #11) applies to node connectors, so the family must
   know which lines are connectors (per-type knowledge) or it is wrong. The deeper connector
   geometry — overlap/bridge, ≥12px fan, 6-10px visible gap, behind-box+dash — is notregex-able at
   all (pairwise 2D). [SOURCE: sk-design-diagram/assets/examples/example-architecture.html:84-85; example-radar.html:3389-3392; sk-design-diagram/SKILL.md:425-432]

7. **The marker-trio rule fails 23/34, and the id vocabulary drifted.** `SKILL.md:328`: "define
   all three (`arrow`, `arrow-accent`, `arrow-link`)". Census: 11 of 34 examples define exactly
   the mandated trio (4 of those add undeclared extras); 23 fail — `example-er.html:68` defines
   one, `example-bar.html` none, `example-data-flow.html:46-48` renamed the vocabulary entirely
   (`arr-muted`/`arr-accent`/`arr-link`), and further drift: `arrow-sm`/`arrow-dim`
   (dp-integration, high-level, process), `arrow-soft` (loop), `arrow-open` (sequence-oauth ×3),
   `axis-end`/`axis-start` (quadrant-consultant). Separately, marker and pattern ids are
   unprefixed: `id="dots"` appears in 26 of 34 files and `id="arrow"` in most of the rest — the
   exact two-inline-diagrams collision that `SKILL.md:382` bans for title/desc ids, but the
   prefixed-ids contract stops at title/desc. Whether the trio is unconditional (the words) or
   conditional on connectors existing, and whether uniqueness is scoped per-file (holdable) or
   per-page (the real failure mode) are contract decisions. [SOURCE: sk-design-diagram/SKILL.md:328,382; sk-design-diagram/assets/examples/example-er.html:68; example-data-flow.html:46-48; marker-id census over assets/examples]

8. **The complexity budget is stated in concepts the markup does not carry.** Budget: "max 9
   nodes, 12 arrows/transitions, 2 coral elements, and 2 annotation callouts" (`SKILL.md:338`),
   with the documented `faithful` import exemption "zoned above 9 nodes" (`SKILL.md:370`). But no
   markup convention marks what a node or a coral element IS: `example-high-level.html` has 29
   `<rect>` and 10 `#eb6c36` occurrences — how many are nodes or focal elements is judgment.
   Occurrence-counting also misses that accent has two spellings: `#eb6c36` and
   `rgba(235,108,54,α)` — the same accent as a wash and a stroke in one node
   (`type-high-level.md:209`). The budget family exists only after the contract defines a node
   marker, element grouping, and both spellings. [SOURCE: sk-design-diagram/SKILL.md:338,370; sk-design-diagram/assets/examples/example-high-level.html (census); references/types/type-high-level.md:209]

9. **"Single source of truth" is scoped wider than the foundations guide.** ALWAYS #5:
   `style-guide.md` is the single source of truth, "never hardcode values that disagree"
   (`SKILL.md:404,449`). Yet `#3d4460` — used by `example-high-level.html:81` — appears in NO
   foundations guide: it lives only in the type reference's chevron tables
   (`type-high-level.md:127,250,418,419`), while `#2e5aa8` IS a foundations role (`link`,
   `style-guide.md:46`). And the examples mostly inline values instead of referencing them:
   `example-er.html` types 88 hex literals against 4 `var(--color-*)` — measured (both facts
   verified exactly), with the muted value #4f5d75 typed at :68 — so "look up the current hex
   there rather than inlining" is aspirational: a re-skin silently strands 88 literals.
   [SOURCE: sk-design-diagram/SKILL.md:404,449; references/types/type-high-level.md:418-419; references/foundations/style-guide.md:46; sk-design-diagram/assets/examples/example-high-level.html:81; example-er.html:68 + counts]

10. **What cannot be held statically, and why.** (a) The five connector-geometry rules
    (`SKILL.md:425-432`) need pairwise 2D: overlap/bridge, attach-fan ≥12px, the 6-10px VISIBLE
    gap, behind-box+dash+label-at-visible-end — "unavoidable" is judgment; a geometry pass over
    parsed SVG is code, not regex. (b) Budget semantics (node, coral "element") need a markup
    convention that does not exist (finding 8). (c) Id-uniqueness scope: per-file is checkable,
    per-page (the collision that motivated :382) is not, from one file. (d) Semantic/process
    rules — type fit, remove test, taste, fidelity ledger (`SKILL.md:472-486,368`) — are judged,
    not computed. (e) The :403-vs-:337 font-size conflict must be adjudicated by a human before
    any assertion exists. (f) Accent's two spellings (finding 8) mean even "count the coral"
    needs a normalization decision first.
    [SOURCE: sk-design-diagram/SKILL.md:425-432,472-486,368,337,403; references/types/type-high-level.md:209]

## Sources Consulted

- `sk-design-chart/scripts/check-corpus.cjs` — tally census (75 sites / 47 names), family bodies: `no-external` :918-945, `unique-ids` :975-990, `accessibility` :992-1022, marker `RESULT: PASSED` :14, :3503
- `sk-design-diagram/SKILL.md` — :297-444 (style-guide gate, design system, primitives, layout/4px/budget, templates, import, output, accessible-SVG contract, RULES, connector mandates), :468-530 (SUCCESS criteria)
- `sk-design-diagram/assets/examples/*.html` — 34 files: accessibility census (role, labelledby, title-first), marker-id census, diagonal-line census, 4px-grid probe, hex/var counts, `example-er.html`, `example-flowchart.html`, `example-architecture.html`, `example-data-flow.html`, `example-high-level.html`, `example-radar.html`, `example-loop-terminal.html`
- `sk-design-diagram/references/foundations/style-guide.md:46`; `references/types/type-high-level.md:127,209,250,418-419`

## Assessment

- **newInfoRatio: 1.0** — first pass; every family, violation, count, and contradiction here is new to this packet.
- Novelty justification: the checker's family vocabulary, the 47-vs-42 tally discrepancy, the 23/34 marker-trio failure, the :403-vs-:337 contradiction, the 26-file `id="dots"` collision, and the #3d4460 provenance were all newly measured this iteration.
- Confidence: high on the greps and direct line reads; medium on the 11/23 trio arithmetic (counted from the census by hand — recount mechanically when the family is drafted); the title-first correction rests on the first-`<svg>`-per-file read.

## Reflection

- What worked: census-first (grep/perl over all 34) before targeted reads — every "one example that fails today" came from the census, not from suspicion.
- What failed: two shell-quoting retries and one perl syntax error; a first 4px probe lost its filenames (no `$ARGV` in the printf) and had to be rerun. Lesson: attribute every census line to its file the first time.
- Ruled out: counting coral elements by occurrence-count of `#eb6c36` — accent also spells itself `rgba(235,108,54,α)` (`type-high-level.md:209`) and one focal element is 3+ occurrences (fill+stroke+text), so occurrence≠element.

## Recommended Next Focus

Angle 2 — the token source and the repaint: compare the style-guide role table against the ~25
distinct hex values typed across the examples; design the token source the way `palettes.json`
works (roles, per-skin values, diagram-applicable gates, derivation record); decide how the three
skins live in one source and whether a file carries one skin or all; state what a by-value repaint
of 34 examples would change and what it would break. Carry in: the #3d4460 scope question (finding
9), the 88-typed-literals baseline (finding 9), and accent's two spellings (finding 8).
