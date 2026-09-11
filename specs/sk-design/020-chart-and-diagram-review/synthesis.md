# Chart and diagram packet review — synthesis

**Date:** 2026-09-11
**Reviewed:** `.opencode/skills/sk-design/sk-design-chart` (v0.23.0.0) and
`.opencode/skills/sk-design/sk-design-diagram` (v1.2.0.0), their scripts, reference documents,
mutation suites, manual-testing playbooks, feature catalogs, CI workflows, and the
`/design:chart` and `/design:diagram` command surfaces.
**Iterations:** eight — four per packet, covering correctness and security, traceability and
maintainability, coverage and proof quality, release readiness and usability.
**Model:** DeepSeek V4.1 Flash at `reasoningEffort: max`, dispatched through `cli-pi`.

Three lineages were launched per packet; only one produced reports. The GPT-5.6-LUNA lineage
(`lineages/luna`, `cli-codex`, effort max, service tier fast) wrote an `invocation-metadata.json`
and nothing else — no `deep-review-state.jsonl`, no `iterations/` directory, on either packet. A
second DeepSeek lineage (`lineages/ds4`) wrote 3 state lines for the chart packet and 1 for the
diagram packet and produced zero iteration reports. Both were dropped. Everything below therefore
rests on one model's reading, which is why every P1 was re-opened at the file and line it names
before it appears here.

---

## Verdict

**sk-design-chart — CONDITIONAL.** The corpus check, the applicator and the 84-test proof suite
are green and honest about the corpus; what fails is the packet's account of itself — the release
checklist has three rows an operator cannot use, the theming guide overstates what `--default`
does, and the workflow tells an agent to verify a delivery with a command that never opens it.

**sk-design-diagram — CONDITIONAL, with one write-path defect.** Same document-versus-tree pattern
as its sibling and more of it, plus the only finding in either packet where the tool is wrong
rather than the prose: a themed delivery can ship colour whose contrast was never measured and
print `RESULT: PASSED`.

---

## Confirmed findings

Ranked by how badly a reader is misled, then by cost to fix. `F-` ids are the iteration's, kept so
a reader can get back to the original evidence.

### 1. A themed delivery can ship unmeasured contrast and report a pass

**P1 · diagram · F001 (iteration 1)**
`scripts/apply-design-md.cjs:974`, mechanism at `:804-805`, contract at
`references/design-md-theming.md:210,220`.

`validateRoles(derived, skin, rendered.used, form)` gates `rendered.used` — the list of roles whose
literal bytes *changed*. `remapLiterals` returns the original literal at `:804` **before** the
`used.push` at `:805`, so a role whose derived value equals its stock value is never added to the
list and never measured. For a worked form, which carries no palette block, that list is the form's
only contribution.

The contract says the opposite twice: `:210` scopes `markOnPaper` to "`accent` and every other
gated role against its own ground", and `:220` says "Every selected form's full palette is derived
and gated in memory before any file is written."

**Why it matters:** under `--all`, a reference that moves a ground while leaving a role at its stock
value writes a delivery whose contrast nothing checked, and the run prints `RESULT: PASSED`. The
shipped corpus cannot expose it — with `--default` nothing moves — so the gap is invisible from a
green run.

**Fix:** feed `validateRoles` the derived skin's full role set (or the set of roles the delivery
actually paints) rather than `rendered.used`.

**Confirmed by reproduction.** I copied the carried reference, changed one row — `Night` from
`#2d3142` to `#d9d9d9`, moving only the dark ground — and called the shipped `deriveReference`,
`renderForm` and `validateRoles` in memory:

```
sequence-oauth-dark | used = ["paper"]                              | failures = 0
   output still carries #f5f5f5 ink, which reads 1.29:1 on #d9d9d9
starter-dark        | used = ["paper","ink","muted","accent","link"] | failures = 5
```

Same reference, opposite verdicts, decided only by whether the form carries a palette block.

### 2. Three families lose a decoration exemption partway through a file

**P1 · diagram · F013 (iteration 3)**
`scripts/families/orthogonal-connectors.cjs:65` (pop) and `:82` (push);
`scripts/families/label-mask-clearance.cjs:139,169`; `scripts/families/grid-4px.cjs:48,64`.

All three build an ancestor stack that pushes only non-self-closing, non-leaf tags
(`if (match[4] !== '/' && !LEAF.has(tag)) open.push(…)`) but pops on **any** closing tag
(`if (closing) { open.pop(); continue; }`). `LEAF` holds `text`, `tspan`, `rect`, `path` and six
more, so a `</text>` removes the enclosing `<g>` from the ancestor set. The stack is only read
through `open.some(ancestor => carrier(ancestor))`, so a mis-pop can only strip an exemption, never
grant one.

**Why it matters:** a legitimate delivery is failed, the message names the path rather than the
`<text>` sibling above it, and reordering the markup is the only workaround. The family's own
comment (`orthogonal-connectors.cjs:18-24`) declares decoration groups exempt.

**Fix:** store the tag with each frame and pop only on a match, or push leaves so open and close
balance. Apply in all three; a shared traversal helper is the smaller change, since three families
re-implement it. Add one case whose patch nests a connector inside a decorated group — no current
case gives a family any nested structure.

**Confirmed by reproduction.** An `--extra` over a copy of `layers.html` with two identical
`<g aria-hidden="true">` groups, each holding a marker-bearing diagonal path, differing only in a
`<text>x</text>` before the first path:

```
FAIL [orthogonal-connectors] --extra/stack2.html: path "M20 20 L80 80" turns with a diagonal L segment
RESULT: FAILED
```

The second group's identical path is not reported.

### 3. The documented way to accept an outside delivery rejects it on its filename

**P1 · chart · F017 (iteration 4)**
`scripts/check-corpus.cjs:463-476` (`checkIdentity`), advertised at `README.md:111`.

`checkIdentity` requires the `chart-template` meta value to equal the filename stem, with no
exemption for files `--extra` adds. Nothing in `SKILL.md`, `README.md` or the theming guide says a
delivery must keep the form's name, and the packet's own playbook treats the renamed copy as normal
(`manual-testing-playbook/delivery-and-routing/opens-with-no-build-step.md:51` copies
`treemap.html` to `~/chart-delivery-check.html`).

**Why it matters:** the one documented path for validating a real delivery fails on its name before
it looks at the data, so an operator either renames the file to satisfy a corpus rule or stops
running the check.

**Fix:** apply only the tag-present and lower-case-kebab halves of `identity` to `--extra` files, or
state the filename requirement where the delivery path is documented.

**Confirmed by reproduction.** Same bytes, two names:

```
--extra /tmp/vf-d2  (bar-columns.html)      → RESULT: PASSED
--extra /tmp/vf-d3  (quarterly-sales.html)  → FAIL [identity] identity "bar-columns" does not
                                              match the filename stem "quarterly-sales"
```

### 4. Neither skill's workflow names the command that reads a delivery

**P1 · both · chart F016 (iteration 4)**
chart `SKILL.md:126` ("Run the corpus validator before reporting the result") and `:184` ("The
corpus validator exits clean"); the delivery command is `--extra DIR`, documented only at chart
`README.md:111` and `references/design-md-theming.md`.

A delivered chart is copied out of `assets/templates/` and edited, which is exactly the state the
bare validator ignores — it walks the packet's own 32 files and reports the same `42 families,
0 failure(s)` whether the delivery is right or wrong.

**Why it matters:** an agent following `SKILL.md` alone reports "the validator passed" about a file
the validator never opened.

**The diagram packet is worse on the same axis:** `grep -c -- '--extra'` returns 0 for
`sk-design-diagram/SKILL.md`, `README.md` **and** `scripts/README.md`. Its checker supports
`--extra` — I used it for findings 2 and 6 — and no document in the packet mentions it.

**Fix:** name both commands and both success criteria in each `SKILL.md` — the corpus check for the
packet, `--extra <dir>` for the file just delivered — the way chart `README.md` §6 already splits
them. Document `--extra` in the diagram packet at all.

**Confirmed:** `grep -n extra sk-design-chart/SKILL.md` returns only `extraction`/`extracted`
sentences at `:38`, `:107`, `:133`; the diagram greps return 0.

### 5. Both packets' release rows promise a packaging pass the gate does not give

**P1 · both · chart F014 (iteration 4) + diagram F019 (iteration 4)** — one defect, two locations,
with a third failure unique to the diagram packet.

Both `assets/style-reference/*/DESIGN.md` and `origin.md` ship without the five-field frontmatter
block the strict packaging check requires, and both packets publish a verification row saying the
check passes.

- chart `README.md:112` promises `Result: PASS`; observed `Result: FAIL`, exit 1, 2 unmet
  (`evilcharts/DESIGN.md`, `evilcharts/origin.md`).
- diagram `README.md:133` promises "exits 0"; observed exit 1, 3 unmet — the same two
  (`harness-diagram/DESIGN.md`, `harness-diagram/origin.md`) plus
  `SMART ROUTING section missing smart-router marker(s): discover_markdown_resources, _guard_in_skill`.
- The diagram packet repeats the promise where an operator meets it:
  `manual-testing-playbook/command-and-hub-integration/hub-registration.md:52` makes "exits `0`" a
  pass condition of scenario CMD-002.

The third, diagram-only failure has a cause: `SKILL.md:148-151` delegates the router contract to
`references/foundations/router-pseudocode.md`, and the check looks for the markers in `SKILL.md`.

**Fix:** add the five-field block above each Style Reference document — verified inert, iteration 4
called the shipped `parseColors`, `parseColorDeclarations`, `parseTypography` and `parseRadius` on a
frontmatter-prefixed copy and got identical output — and either restore the two markers or record
the delegation in a form the check accepts. Failing that, correct both README rows and the CMD-002
expectation to state the real result. Doing neither is the current state.

**Confirmed by running both commands and reading exit status.**

### 6. The 4px grid rule's exemption list is closed in the document and open in the checker

**P1 · diagram · F014 (iteration 3)**
`scripts/families/grid-4px.cjs:24-29` (`GEOMETRY`) and `:22-23` (`EXEMPT_SUBTREE`); the rule at
`SKILL.md:195`, `SKILL.md:266` and `references/foundations/style-guide.md:123`.

`GEOMETRY` measures `rect x/y/width/height`, `circle cx/cy`, `ellipse cx/cy/rx/ry` and
`line x1/y1/x2/y2`. `EXEMPT_SUBTREE` is `text`, `tspan`, `pattern`. Path `d` and polygon/polyline
`points` are in neither list, so they are silent rather than exempt — while `SKILL.md:195` states a
closed exemption list ("Exempt: stroke widths, opacity, dot pattern, font sizes") and the checker's
own scope note (`scripts/check-diagram-corpus.cjs:9-13`), which exists precisely to say what a green
run does not cover, does not mention it either.

**Why it matters:** paths and polygons are the corpus's own idiom. A new delivery that draws its
connectors as paths can ship off-grid layout coordinates and still print `RESULT: PASSED`.

**Fix:** decide it once — measure `d` and `points`, or name them in the exemption sentence and in
the checker's scope note — and add a case for whichever answer is chosen.

**Confirmed by reproduction.** The same off-grid value in two representations, appended to a copy of
`layers.html` (which carries no `grid-baseline.json` entry, so the new-work branch applies):

```
<path d="M13 0 H17 V4"/>                       → 0 grid-4px failures
<rect x="13" y="0" width="4" height="4"/>      → FAIL [grid-4px] rect carries x=13 off the 4px grid
```

### 7. The `/design:diagram` presentation loads a YAML that does not exist

**P1 · diagram · F021 (iteration 4)**
`.opencode/commands/design/assets/diagram-presentation.txt:49` instructs "load
`create-diagram-auto.yaml`". The directory holds `diagram-auto.yaml`, `diagram-confirm.yaml` and
`diagram-presentation.txt`. The router names the right file
(`.opencode/commands/design/diagram.md:64`) and sets the rule the presentation then trips: "If any
referenced asset is missing, stop and report the missing path" (`diagram.md:36`).

The same file speaks the pre-cutover packet name in three user-visible strings: `:10`
("Are create-diagram packet resources available?"), `:33` and `:44`
(`STATUS=FAIL ERROR="create-diagram resources unavailable"`).

**Why it matters:** it hard-blocks the `:auto` path at Phase 0. The sibling command already got this
fix — commit `3f123f246a`, "the chart command names only files that exist".

**Fix:** name `diagram-auto.yaml` / `diagram-confirm.yaml` in the load instruction; rename the
packet in the Phase 0 copy while the file is open.

**Confirmed by listing the asset directory and reading both files.**

### 8. Both packets point an operator at the hub that no longer registers them

**P1 · both · chart F014 (hub row) + diagram F022 (iteration 4)** — one defect, five locations.

`sk-doc`'s `mode-registry.json`, `hub-router.json` and `leaf-manifest.json` contain **zero**
mentions of either packet; `sk-design`'s registries carry both.

- chart `README.md:113` runs `parent-skill-check.cjs .opencode/skills/sk-doc`. The command passes —
  it is a green light wired to another building, and cannot fail on anything about this packet.
- diagram `manual-testing-playbook/command-and-hub-integration/hub-registration.md:45,46` greps
  `sk-doc/mode-registry.json` and `sk-doc/leaf-manifest.json`; the scenario's expected result at
  `:52` cannot be obtained.
- diagram `feature-catalog/command-and-hub-integration/hub-registration.md:21` states, present
  tense, "`sk-design-diagram` is a nested workflow packet under the `sk-doc` parent hub … keeping
  `sk-doc` as the single advisor root", repeated at `:3` and `:37`, plus
  `design-diagram-command.md:37,57` and the playbook index.

**Why it matters:** the registration itself is correct. What is broken is every procedure that
exists to prove it — an operator running CMD-002 as written fails at step 1 and files a routing
defect that does not exist.

**Fix:** re-point the chart hub row and all diagram registration documents at
`.opencode/skills/sk-design/{mode-registry,hub-router,leaf-manifest,command-metadata}.json`, then
re-run CMD-002.

**Confirmed:** `grep -c` returns 0/0/0 against the `sk-doc` files and 3/3/2 (chart) and 3 (diagram)
against `sk-design`.

### 9. `--default` is documented as reproducing the stock palette exactly, and changes half of it

**P1 · chart · F015 (iteration 4)**
`references/design-md-theming.md:89-92`: "Theming from it reproduces the stock palette and the stock
corner ladder exactly, which is the property that says the default is still the reference the corpus
came from; the corpus check holds it through the `palette-derivation` family."

Observed on `grouped-bars`, the documented default:

| | stock | `--default` |
|---|---|---|
| light `--chart-rule` | `#E5E5E5` | `#0A0A0A17` |
| light `--chart-series-2` | `#484848` | `#104E64` |
| light `--chart-emphasis` | `#0A0A0A` | `#1447E6` |
| dark `--chart-surface` | `#141110` | `#090909` |
| dark `--chart-muted` | `#A1A1A1` | `#787878` |
| dark `--chart-series-2` | `#A1A1A1` | `#009689` |
| dark `--chart-emphasis` | `#FAFAFA` | `#FFB900` |

Five of ten light values and six dark. Only the corner ladder reproduces exactly — all five rungs
byte-identical — which is the half the sentence does not need to argue for. The `palette-derivation`
family holds the *palette file* against the reference, not the applicator's output against the stock
blocks, so it is not the check the sentence names.

**Why it matters:** `SKILL.md:131-132` sends every reference-less themed request to `--default` on
the strength of this paragraph. A reader expecting the stock look gets neutral greys turned into
four hues, with no line saying the encoding changed.

**Fix:** state what `--default` does — maps the reference's own table into the shared roles, one
derived system — and scope the "exactly" claim to the corner ladder.

**Confirmed by running the applicator and diffing both blocks against the stock form.**

### 10. Two documents state opposite defaults for the diagram ground

**P1 · diagram · F023 (iteration 4)**
`SKILL.md:185`: "**Background:** default clean `paper` fill, no dot pattern … Optional dotted-paper
variant … only for long-form editorial hero diagrams."
`references/foundations/style-guide.md:169`: "**Dot pattern is the default ground**: the 22×22 dot
pattern carries the paper, and 26 of the 34 worked forms use it."

`changelog/v1.1.0.0.md:68` says the default was documented as the pattern; `SKILL.md` — the contract,
and the document a reader loads *before* the style guide — still documents the reverse. Nothing
enforces either reading: `grid-4px` exempts the dot pattern and no family counts pattern usage.

**Why it matters:** a reader following `SKILL.md` ships a ground unlike 26 of the 38 forms it was
told to copy from, then passes §6 SUCCESS CRITERIA, which has no item for the background.

**Fix:** replace `SKILL.md:185` with the style guide's rule including its drop-when-dense condition.

**Confirmed by reading both sentences.** The "26 of the 34" count itself was verified accurate by
iteration 2 and is not in dispute.

### 11. The chart colour contract names three gates the design-md path does not apply

**P1 · chart · F001 (iteration 1)**
`references/color-system.md:307-310`, against `scripts/apply-design-md.cjs:464-482` (`validateTheme`)
and `scripts/check-corpus.cjs:526-641` (`checkDesignMdBlock`).

The sentence claims the adapter applies `rampDarkestOnSurface`, `rampLightestOnSurface` and
`rampStepSeparation` "to adjacent series values". `validateTheme` checks `textOnSurface` (ink,
muted), `markOnSurface` (four series, emphasis), `emphasisAgainstFirstSeries`, and a dark-rule alpha
shape — nothing else. The two ramp-end gate names reach only the stock reader
`checkPaletteSource` (`check-corpus.cjs:392,398`) and the palette file
(`palettes.json:69-70`). `rampStepSeparation` on the delivery side compares **every** pair of four
series, six comparisons, as a disjunction with a 30-degree hue escape
(`check-corpus.cjs:592-601`) — not "adjacent" and not a ratio test.

The code's own comment states the opposite intent deliberately (`check-corpus.cjs:586-589`), and the
sibling document already carries the true set (`references/design-md-theming.md:128-133`). So the
two reference documents disagree and the code agrees with the other one.
`color-system.md:344-347` compounds it: "Every gate in the table above … once per theme", true for
the three stock systems and false for the adapter row above it.

**Fix:** correct `color-system.md:307-310` to the set `design-md-theming.md` already states. Do not
leave the two documents disagreeing.

**Confirmed by reading all three files and grepping both gate names across the packet.**

### 12. Five sites name a Style Reference removed two releases ago, one with wrong enforced values

**P1 · chart · F005 (iteration 2)**
`assets/style-reference/` holds exactly one directory, `evilcharts`;
`changelog/v0.21.0.0.md:16` states the removal. Surviving:

- `README.md:48` — "or passes `--default` for the `cursor` bundle in the style library".
  `--default` resolves to `evilcharts` (`apply-design-md.cjs:31,150`).
- `scripts/README.md:32` — the first command a reader copies, commented "the cursor bundle".
- `scripts/apply-design-md.cjs:148` — "including the cursor capture carried beside it". None is.
- `assets/style-reference/evilcharts/origin.md:3` — "Unlike the cursor reference beside it".
- `references/template-contract.md:462-464` — three defects in one sentence: it names the removed
  reference; its values contradict the enforced ladder
  (`palettes.json` holds `mark 2px, track 4.4px, swatch 4.4px, pill 4.4px, card 8.4px`, compared
  against every template in both directions by `checkPaletteBlock`); and it names the third rung by
  a consumer ("the tooltip card") where the same paragraph names rungs by property.

`assets/style-reference/evilcharts/palettes.json:33` — the file `color-system.md` calls "the source
of truth for every value" — carries the same two defects in its own prose: "on the cursor
reference's 4px corner with 8px for the one container".

`changelog/v0.21.0.0.md:19-21` claims the corner-ladder passage was rewritten from the enforced
ladder. It was not; the three documents the changelog names are clean and these five were outside
the list.

**Fix:** all five sites, plus `palettes.json:33`. The corner sentence should read the values in
`palettes.json` and name the `pill` rung.

**Confirmed by grep and by reading `palettes.json`.**

### 13. Five README pointers name a SKILL.md section that does not exist

**P1 · diagram · F024 (iteration 4)**
`README.md:63,82,105,137` cite "`SKILL.md` §9's Pre-Output Checklist" as the packet's taste gate.
`SKILL.md`'s H2 headings are exactly `## 1. WHEN TO USE` (`:16`), `2. SMART ROUTING` (`:50`),
`3. HOW IT WORKS` (`:155`), `4. RULES` (`:254`), `5. REFERENCES` (`:308`), `6. SUCCESS CRITERIA`
(`:335`). There is no §9. `README.md:35` uses the right number with the wrong name — "SKILL.md §6
Pre-Output Checklist" — and the string "Pre-Output Checklist" occurs nowhere in `SKILL.md`.

**Why it matters:** the gate the packet calls non-negotiable has no resolvable pointer from its own
README, leaving a reader to guess between §4 RULES and §6 SUCCESS CRITERIA.

**Fix:** make every reference `SKILL.md §6 SUCCESS CRITERIA`, including
`diagram-presentation.txt:171`.

**Confirmed by enumerating the headings mechanically.**

### 14. The documented `--forms` names cannot be passed

**P1 · diagram · F006 (iteration 2)**
`references/design-md-theming.md:69` documents the argument as taking `template`, `template-dark`,
`template-full`, `template-terminal`; the runnable example at `:63` passes `template-full`. On disk:
`starter-light.html`, `starter-dark.html`, `starter-full.html`, `starter-terminal.html`. No
`template-*.html` exists. `formNames` validates against disk, so the documented invocation is
refused before it does anything.

**Fix:** rename the four base names in the argument table and the example. Every other reference in
the packet already says `starter-*`.

**Confirmed by listing `assets/diagrams/`.**

### 15. The packet declares 1.2.0.0 and its changelog stops at 1.1.0.0

**P1 · diagram · F020 (iteration 4)**
`SKILL.md:5` reads `version: 1.2.0.0`; `changelog/` holds `v1.0.0.0.md` and `v1.1.0.0.md`. The
release commit `7bf1c3af7d` ("release the packet at 1.2.0.0", body: "a changelog entry") added only
`v1.1.0.0.md`. The packet's own spec records the gap as open work
(`specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library/implementation-summary.md:186-190`).

**Why it matters:** the 1.2.0.0 capture-review fixes are reachable only through `git log`. The
sibling packet is clean here — chart `SKILL.md` 0.23.0.0 ↔ `changelog/v0.23.0.0.md`.

**Fix:** write `changelog/v1.2.0.0.md` (the release commit body is a usable draft), or return the
version to 1.1.0.0 and say so.

**Confirmed by listing `changelog/` and reading both frontmatter versions.**

### 16. Both mutation suites claim more than their cases prove

**P1 · both · chart F011 (iteration 3) + diagram F003 (iteration 1)** — the same overclaim in two
forms.

**Chart.** `scripts/tests/corpus-mutations.test.cjs:3` — "Standing proof that every corpus assertion
fails when the thing it describes is broken." Measured on the shipped tree: the checker emits **42
families** on a clean run; the suite holds **70 family-attributed cases** covering **43 distinct
families**, of which **34 have exactly one case**. The file's own body is honest — "One case each:
enough that a family which stops firing is noticed" (`:346-348`) — so the header and the body
disagree and the header is what a reader takes away. Iteration 3 demonstrated the consequence: it
built a themed delivery and broke two live `design-md` rules (an ink value below the text gate, a
missing palette property) that no case covers; delete either rule and the suite still reports 84/84.

**Diagram.** `scripts/families/node-budget.cjs` counts `data-diagram-node` and `data-diagram-arrow`;
**0 of 38** shipped forms carry either attribute, and `tally(NAME, 1)` at `:24` fires unconditionally
per file. The run therefore reports 38 assertions against a family that cannot record on this
corpus, while `SKILL.md:196` states the budget as non-negotiable. The mutation suite proves the
family *can* fire; the corpus proves nothing.

**Fix:** chart — bring the header down to what the body says, or raise the case set for the families
the suite touches once, starting with `design-md`. Diagram — print per-family coverage that separates
compared values from per-file invocations, or record the exemption.

**Confirmed by running both suites (chart 74+10 pass, diagram 19 pass), extracting the 42 emitted
family names, counting cases mechanically, and grepping all 38 diagram forms for both attributes.**

### 17. The playbook's corpus size is wrong by eight forms

**P1 · chart · F006 (iteration 2)**
`manual-testing-playbook/manual-testing-playbook.md:50` — "The corpus holds **twenty-one** chart
forms across six question families." The corpus holds 29
(`ls assets/templates/*.html | wc -l` → 29; the checker prints "chart forms under assets/templates:
29"; `SKILL.md:137`, `README.md:32`, `references/README.md:33`, the 29 catalog rows and
`template-contract.md:320` all say twenty-nine), and the playbook's own scenario file says
twenty-nine. The paragraph carrying the error opens by promising it does not hand-maintain a count.

**Fix:** correct the number, or delete it as the same paragraph promises.

**Confirmed by counting the files and reading the line.**

### 18. Two of five series colours fall below the gate the style guide says all five clear

**P1 · diagram · F008 (iteration 2)**
`references/foundations/style-guide.md:68` — "A chip that carries a label is a mark with text on it,
so its fill clears the `text-on-mark` gate at 4.5:1 against the label colour; all five of these do."

Measured with the packet's own `scripts/color-gates.cjs` against `#ffffff`, the metric the
derivation record fixes when it writes "4.44:1 to 4.56:1 against white"
(`references/foundations/derivation-record.md:96-103`):

| role | value | vs `#ffffff` |
|---|---|---|
| series-1 | `#7c8f6f` | **3.49:1** |
| series-2 | `#5c7899` | 4.56:1 |
| series-3 | `#b8915a` | **2.90:1** |
| series-4 | `#9c6b50` | 4.53:1 |
| series-5 | `#6e6479` | 5.58:1 |

series-2 reproduces the record's stated number exactly, which pins the metric. The record accounts
for one value that failed and was moved; two others fail and were never measured. Nothing can reach
the claim: `series-1..5` sit in `gates.ungated` and both readers skip ungated roles
(`derivation-gates.cjs:87`, `apply-design-md.cjs:640-641`).

**Caveat, and the reason this sits at 18 rather than higher:** the style guide's previous sentence
says fills sit at 0.18 opacity, and under an alpha-composite reading all five pass comfortably. What
is confirmed is the arithmetic and the fact that two live documents assert one gate while measuring
different things. Which metric was intended is a judgment the packet has to make.

**Fix:** state the metric explicitly in one document, re-measure the five against it, and either
gate the roles or say plainly that they are ungated by design.

**Confirmed by recomputing all five with the shipped contrast function.**

### 19. The form library's index claims coverage the checker cannot provide

**P1 · diagram · F009 (iteration 2)**
`assets/diagrams/README.md:29-30` — "The corpus check holds the rules that matter — accessibility
wiring, one skin per file, tokens that come from the palette source, connectors that meet their
targets — and says nothing about what you draw."

The checker's own header names the third claim as out of reach: "pairwise connector geometry
(overlap, the attach fan, the visible label gap, a route behind a box) needs a 2D pass over parsed
paths, not a regex; until one exists the eye holds it" (`scripts/check-diagram-corpus.cjs:9-13`). No
family checks endpoint attachment.

"One skin per file" and "tokens that come from the palette source" hold for 4 of 38 forms:
`derivation-gates.cjs:42` returns early for any file without a palette block, and only the four
starters carry one — which the same README says four lines later.

**Why it matters:** this is the document a reader opens to choose which form to copy.

**Fix:** narrow the list to the families that exist and move the connector claim to the capture
review.

**Confirmed by reading the README against the checker header and counting the four forms with a
palette block.**

### 20. The dark skin declares five roles where two documents declare ten

**P1 · diagram · F002 (iteration 1)**
`assets/style-reference/harness-diagram/diagram-palette.json` — `skins.dark.roles` is
`paper, ink, muted, accent, link` (5). The light skin carries 17.
`references/foundations/derivation-record.md:44-56` §3 DARK and
`references/foundations/style-guide.md:37-48` additionally declare `paper-2 #393e53`,
`soft #8e98ac`, `rule`, `rule-solid` and `accent-tint`.

`#393e53` and `#8e98ac` occur in **0** of 38 forms. The two rgba dark values occur in exactly 1 file
each — `sequence-oauth-dark.html`, which carries no palette block, so `derivation-gates` returns
early and neither value is attributable to a role, refused, repainted or measured. In the other
direction, a themed dark block declaring the *documented* `--color-paper-2` is an error at
`derivation-gates.cjs:73` ("role … is not in the … skin").

**Fix:** either the palette's dark skin gains the five roles, or both documents drop them and state
that the dark skin is deliberately five.

**Confirmed by dumping the palette programmatically and grepping the corpus for each value.**

### 21. Two catalog rows name question families the catalog does not define

**P1 · chart · F002 (iteration 1)**
`references/catalog.md:46` (`funnel` → `part-to-whole`) and `:47` (`dumbbell` → `change`).
`:81` defines the cell as "The question group the form belongs to, from section 4", and section 4
(`:112-119`) defines exactly six: comparison, composition, time, distribution, relationship, matrix.
`SKILL.md:137` repeats "six question families".

Nothing catches it: `parseCatalog` (`check-corpus.cjs:2541-2579`) reads `id`, `file` and `system`
only, and `checkCatalogSystem` gates the `system` cell alone — the very drift that family was added
to close.

**Fix:** re-label the two rows into the six defined families, or add the two names to section 4;
then extend the catalog family to hold `family` against the section 4 list, since the cell is
machine-read the same way `system` is.

**Confirmed by reading all three passages.**

---

## Confirmed, lower severity

Each of these was checked at the file; none changes what a reader does today.

- **P2 · chart · F003** — the immutable-stock-forms guard compares paths lexically
  (`scripts/apply-design-md.cjs:666-669`). Negative control: a symlink in `/tmp` pointing at
  `assets/templates` resolves through `path.resolve` to the link path, so
  `outDir.startsWith(TEMPLATE_DIR + path.sep)` is `false` and the guard passes it; `fs.realpathSync`
  resolves it correctly. A case-variant path (`…/Assets/templates`) also exists on this
  case-insensitive volume and also passes. Failure mode is a silent overwrite of the corpus.
  Fix: compare real paths with a containment test.
- **P2 · chart · F009** — version bookkeeping did not follow the v0.23.0.0 release for two document
  sets. `scripts/README.md` reads 0.22.0.15 and every one of the ten playbook files reads 0.22.0.x,
  while `SKILL.md`, `README.md` and all four reference documents are at 0.23.0.x. Confirmed by
  reading every frontmatter.
- **P2 · chart · F012** — seven mutation cases carry `expect: /./`
  (`scripts/tests/corpus-mutations.test.cjs:373,382,397,471,491,501,508`). The harness's second
  assertion is `after.some(line => spec.expect.test(line))` at `:62-63`, directly below
  `assert.ok(after.length > 0)` at `:61`, so with `/./` it cannot fail independently: the case
  carries the family-liveness check twice and the "fired on something else" check not at all.
  Fix: paste the message fragment each mutation already produces.
- **P2 · chart · F013** — `registeredFamilies()` (`:527-534`) regexes `check-corpus.cjs` as *text*
  for `(?:tally|record)\(\s*'([a-z-]+)'` and hand-adds two names at `:531-532`. `palette-source` is
  already found by the regex, so that add is redundant; `palette-source-dark` is registered through
  a theme table and is invisible to the regex, so the hand-add cannot track a rename — rename the
  family and both set comparisons still agree while it loses its only case. See Drift D1.
- **P2 · chart · F008** — the standing suite is named in no packet document. `SKILL.md`,
  `README.md`, `scripts/README.md`, `references/**` and `manual-testing-playbook/**` never mention
  `scripts/tests/` or the command that runs it; the only living reference is
  `.github/workflows/chart-corpus.yml`. Meanwhile `scripts/README.md` spends ~120 lines on hand-run
  `sed` mutations the suite already encodes.
- **P2 · chart · F020** — all 32 shipped HTML files set
  `font-family: CursorGothic, Inter, system-ui, …`. The name appears in no `.md`, `.json` or `.cjs`
  in the packet except `changelog/v0.6.0.0.md:15`, and the carried reference declares a different
  face (`evilcharts/DESIGN.md:46`, Geist Sans). The stock corpus's type is not derivable from
  anything the packet now carries. Fix: record the stock stacks beside the type scale in
  `palettes.json`, or restack from the reference and re-render.
- **P2 · chart · F022** — `README.md:137-140` prints the screenshot command as
  `node ../shared/scripts/render-screenshots.cjs ./assets ./screenshots`, relative to the packet,
  while `scripts/README.md:25` states the working directory is the repository root. Run from the
  root it throws `Cannot find module`; run from the packet it returns `sources 32, missing 0`. Both
  confirmed.
- **P2 · diagram · F010** — `scripts/families/grid-4px.cjs:54` carries
  `if (!hit || (tag === 'rect' && attr.startsWith('r'))) continue;` while `GEOMETRY.rect` is
  `['x','y','width','height']`. No attribute starts with `r`, so the clause is unreachable and the
  `rx`/`ry` exemption it was written for is enforced by omission.
- **P2 · diagram · F012** — `SKILL.md:371` requires "an opaque `fill="#f5f5f5"` rect" behind every
  arrow label. `#f5f5f5` is only the **light** paper; dark is `#2d3142`, terminal `#141414`. It
  contradicts ALWAYS rule 5 at `SKILL.md:267` ("never hardcode values that disagree with the
  guide"). The corpus does the right thing and the document does not: `label-mask-clearance.cjs:38`
  accepts six mask fills including the dark and terminal papers. A reader following the checklist on
  a dark form paints a white rectangle onto a dark diagram.
- **P2 · diagram · F017** — `NEEDS_AN_EYE` is `{}` (`corpus-mutations.test.cjs:125`), so the
  staleness test at `:148` filters an empty object and asserts `deepEqual([], [])`. It cannot fail
  until the map has an entry. The chart sibling's equivalent (`NEEDS_A_BROWSER`, `:519-525`) holds
  five named exemptions with reasons, so its guard has content. See Drift D4.
- **P2 · diagram · F018** — `scripts/README.md:29` reports `Test suites | 0 (no committed regression
  suite yet)`, repeated in §7, while `scripts/tests/` holds a 19-test suite I watched pass and
  `scripts/` ships sixteen checker modules. This is the only code-facing index a maintainer lands
  on.
- **P2 · diagram · F025** — `changelog/v1.1.0.0.md:42` credits a family named
  `short-connector-labels`; the module on disk is `label-mask-clearance.cjs` and the old name
  matches only that changelog line. The rename is real history (`9861d7163e`), one commit after the
  entry, and because no 1.2.0.0 entry was written it appears nowhere.

---

## Demoted or dropped

- **Diagram F007 (iteration 2, P1) → P2 wording fix.** The finding claimed the derivation record's
  §6 promise — that the corpus check requires the applicator's output to equal the shipped bytes —
  is enforced by nothing. Iteration 4 caught this itself: `.github/workflows/diagram-corpus.yml`
  has a step named "Both applicators reproduce the stock bytes" that runs both applicators under
  `--default --all` and `diff -rq`s against `assets/diagrams`. I confirmed the step exists. A
  drifting value *does* fail a required gate; what it does not do is "fail that comparison by name"
  inside `check-diagram-corpus.cjs`. Residual defect: one sentence in the record. The lineage's own
  correction is the right call and is recorded here so a later pass does not re-file it.
- **Chart F007 — count corrected.** The finding said `scripts/README.md` accounts for 22 of the 42
  emitted families and that 13 are named nowhere. My measurement is 12: running the checker,
  extracting the 42 family names it prints and testing each as a literal string against the file
  gives `cursor-guide`, `curve-contract`, `emphasis-budget`, `finding-cue`, `mark-policy`,
  `metric-block`, `palette-derivation`, `ramp-prose`, `reference-line`, `source-line`,
  `table-disclosure`, `tooltip-indicator`. The thirteenth (`style-reference`) does appear, as part of
  an asset path rather than as a check name — defensible either way. The direction holds and the
  severity does not change; the number does.
- **Chart F014, voice row — number corrected.** The iteration reported 70 hard blockers from
  `hvr_scan.py README.md` at the repository root. I observe **72** today (the packet's own README
  reports 1). Both readings fail the row's promised "Zero hard blockers", so the finding stands with
  a moving number. The row's real defect is that its argument resolves to the wrong file.
- **Chart F010 — out of scope for the skills.** The review packet's own `spec.md` still carries
  template placeholders (`:3`, `:60`, `:96`) and neither review folder holds a `checklist.md`. True,
  and confirmed — but it is a fact about this review's paperwork, not about either skill. It belongs
  in the packet's closeout, not in a findings list about `sk-design-chart` and `sk-design-diagram`.
- **Chart F004 (P2) — confirmed, trivial.** `references/README.md:24` says "Three files sit here"
  and the table four lines below lists four; the lede at `:18` already says four. One word.
- **Not re-verified, carried at the lineage's own severity.** Chart F019 (six of 25 hand-run `sed`
  recipes in `scripts/README.md` §5 match nothing against today's corpus), chart F021 (three stale
  narration notes inside `palettes.json` — I confirmed the `radiusRoles.ladder` one at `:33` and did
  not re-check `chromeDarkNote` or `sheetNote`), diagram F004 (the recorded departure's `gate` field
  is never consulted), diagram F005 (nothing inspects inline JavaScript or `javascript:` URLs; the
  corpus carries none), diagram F011 (three unused members in the shared family context), diagram
  F015 (the `origin` link that decides an extra's kind and baseline is exercised by no case) and
  diagram F016 (two case expectations cannot pin the rule they name). All are P2, all are
  read-level claims, and none was promoted, so none was re-derived.

Nothing was dropped for failing verification. Every P1 I opened survived contact with the file —
which is itself worth saying, given that earlier reviews in this program produced three confident
findings that measurement overturned. The corrections above are two counts and one severity, not a
retracted claim.

---

## Drift between the two packets

These are places where the siblings have diverged with no reason recorded. They are the cheapest
items in this report and the easiest to miss, because each one looks like a local defect until the
other packet is opened.

**D1 — the mutation suite's family list.** The diagram suite derives the family set from the
implementation: `fs.readdirSync(FAMILY_DIR).filter(n => n.endsWith('.cjs')).map(n => require(…).name)`
(`corpus-mutations.test.cjs:128`). The chart suite regexes `check-corpus.cjs` **as text** and
hand-patches two names (`:527-534`). The chart's version cannot see a family registered through a
variable and cannot survive a rename. **Direction: chart adopts the diagram's approach** — expose
the family names from the checker (a `--families` flag or an exported table) and derive the list
from that. This is exactly the fix chart F013 asks for, already written next door.

**D2 — the checker's scope note.** `check-diagram-corpus.cjs:9-13` carries an explicit "What this
does not hold, and why, so nobody reads a green run as more than it is" block, and the capture-review
playbook quotes it as its charter. `check-corpus.cjs` has no equivalent. **Direction: chart adopts
it.** The chart packet needs it more, not less — findings 4, 9 and 16 are all cases of a reader
taking a green chart run for more than it covers.

**D3 — `--extra` and the delivery path.** The chart packet documents `--extra` in `README.md` §6 and
twice in `references/design-md-theming.md`. The diagram packet documents it **nowhere** — 0
occurrences across `SKILL.md`, `README.md` and `scripts/README.md` — despite its checker supporting
it. Neither `SKILL.md` names it (finding 4). **Direction: diagram adopts the chart's README row,
then both SKILL.md files name the command.**

**D4 — the coverage-exemption map.** Chart's `NEEDS_A_BROWSER` holds five families with a stated
reason each, so its staleness guard has something to compare. Diagram's `NEEDS_AN_EYE` is `{}`,
making the same guard a tautology (diagram F017) and leaving `node-budget`'s corpus-wide silence
(finding 16) with no recorded reason. **Direction: diagram populates it or deletes the guard** —
`node-budget` is the entry it is missing.

**D5 — the `git checkout --` restore hazard.** The chart packet documents the hazard plainly
(`scripts/README.md:176-178`: "That command reverts to the last commit, not to the state you were
working in, so on an uncommitted change it silently throws the work away") and then violates it in
three of its own playbook files — `manual-testing-playbook.md:85`,
`delivery-and-routing/opens-with-no-build-step.md:55`,
`corpus-integrity/catalog-resolves-both-ways.md:53` — while a fourth,
`corpus-integrity/colour-comes-from-one-source.md:66`, restores from a copy and gives the reason.
The diagram packet has **no such warning anywhere** and uses the command in two places
(`manual-testing-playbook.md:61`, `diagram-generation/onboarding-flow.md:69`), both hedged with
"or is reverted with". **Direction is both ways:** the diagram packet takes the chart's warning;
the chart packet fixes its three violating files to the copy-and-restore pattern it already
demonstrates.

**D6 — CI's applicator gate.** `diagram-corpus.yml` runs a step named "Both applicators reproduce
the stock bytes" and `diff -rq`s the result; `chart-corpus.yml` runs only the corpus check and the
test suites. This one is **not** drift to close by symmetry — the chart applicator deliberately does
not reproduce the stock palette (finding 9), so there is no byte-identity property to gate. The
chart packet's problem is that its documents claim the property anyway. Worth naming here so nobody
"fixes" it by adding the gate.

**D7 — version-to-changelog sync.** Chart: `SKILL.md` 0.23.0.0 ↔ `changelog/v0.23.0.0.md`. Diagram:
`SKILL.md` 1.2.0.0, latest entry `v1.1.0.0.md` (finding 15). **Direction: diagram adopts the chart's
state.**

---

## Refinements

Not defects. Things that would make the packets cheaper to keep honest.

- **Print what a family compared, not how often it ran.** `node-budget` reports 38 assertions over
  zero comparable elements because `tally(NAME, 1)` fires per file regardless. A summary line that
  separated *files visited* from *values compared* would have made finding 16 visible on any run,
  and would retire a whole class of "the run says it is covered" reasoning in both packets.
- **Give the chart packet's `design-md` block a case set proportional to its rule count.** Counting
  `record()` sites per family: `design-md` 11 sites / 1 case, `series-mapping` 19 / 1,
  `number-format` 11 / 1, `style-reference` 9 / 1, `catalog` 8 / 1. The theming path is the packet's
  newest feature and its largest untested surface, and fixing finding 11 will add rules to the same
  uncovered block.
- **Gate the catalog's `family` cell the way `system` is gated.** Finding 21 exists because one
  machine-read column has a check and the one beside it does not. The `catalog-system` family's own
  comment already argues for this.
- **Point the hand-run mutation recipes at the standing suite.** Chart `scripts/README.md` §5 keeps
  ~120 lines of `sed` recipes that the suite encodes and that have started to rot (chart F019).
  Naming the suite in §6 VERIFICATION and demoting the recipes to a historical record would fix the
  discoverability gap (chart F008) and the rot in one edit.
- **Extract the ancestor-stack walk into `shared/`.** Three diagram families re-implement it and all
  three carry the same bug (finding 2). One helper is a smaller change than three fixes, and it
  makes the next family author inherit a correct traversal.
- **Say which metric a colour claim uses.** Finding 18 is unresolvable as written because the style
  guide and the derivation record measure different things while asserting one gate. Every contrast
  sentence in either packet should name its two operands.
- **Decide whether these packets have one Style Reference convention or two.** Finding 5 is the
  vendored-reference convention meeting a strict packaging check that was never told about it, in
  both packets identically. Either the convention gets an exemption recorded where the check reads
  it, or the two documents get the five-field block. A third release that fails the gate and
  publishes a row saying it passes is the expensive outcome.

---

## What I ran, read and could not check

**Ran, and read the output and exit status of:** `check-corpus.cjs` (42 families, 0 failures,
`RESULT: PASSED`, exit 0); `check-diagram-corpus.cjs` (38 files, 12 families, 0 errors,
`RESULT: PASSED`, exit 0); `corpus-mutations.test.cjs` (74 pass, 0 fail, 0 skipped);
`apply-design-md.test.cjs` (10 pass); `node --test scripts/tests/` on the diagram packet (19 pass);
`package_skill.py --check --strict` on the chart packet (`Result: FAIL`, exit 1, 2 unmet);
`validate_skill_package.py --strict` on the diagram packet (exit 1, 3 unmet);
`hvr_scan.py` against both the repository README (72 hard blockers) and the chart packet's (1);
`render-screenshots.cjs --check` from two working directories; and
`apply-design-md.cjs --default` against `grouped-bars`.

**Reproduced as negative controls, writing nothing inside `.opencode/`:** the block-less versus
starter gate divergence with a one-row probe reference (finding 1); the decorated-group ancestor pop
with a two-group `--extra` file (finding 2); the renamed-delivery rejection with identical bytes
under two names (finding 3); the path-versus-rect grid blind spot with the same off-grid coordinate
in two representations (finding 6); and the write-guard bypass, where a symlink and a case-variant
path both resolve past the lexical prefix test (chart F003). `git status` over
`.opencode/skills/sk-design/` is clean; all temporary output was under `/tmp` and is removed.

**Confirmed by reading the file at the line the finding names:** every remaining P1 — the gate-list
contradiction, the five cursor-era sites and the corner ladder, the catalog family cells, the
playbook's corpus count, the `--forms` names, the dark-skin role set, the README coverage claims,
the dot-pattern default, the §9 pointers, the missing changelog entry, and every registry grep
behind finding 8.

**Measured rather than taken from the reports:** the 42 emitted chart families, the 70 cases across
43 distinct families with 34 singletons, the 12 families absent from `scripts/README.md`, the five
series contrast ratios, the 0-of-38 tagged-element count, the 4-of-38 palette-block count, and every
frontmatter version in the chart packet.

**Could not verify.** Whether the alpha-composite reading rescues the series-colour claim in finding
18 — that is a decision the packet owners have to make, not a measurement. Whether the two remaining
`palettes.json` narration notes (chart F021) are stale; I checked only `radiusRoles.ladder`. The
seven P2 findings listed as not re-derived above. The `--render` families in the chart checker,
which need an installed browser and are deliberately outside CI. And I did not attempt the write
that would prove the chart write-guard bypass end to end — confirming that `path.resolve` leaves the
symlink unresolved and the guard returns `false` is as far as a non-destructive check goes, since
the next statement is `fs.writeFileSync` over the stock corpus.
