# Iteration 4: Release readiness and the operator's path from SKILL.md to a chart and to a themed delivery

## Focus

Dimensions: **release readiness**, **usability**.

Surfaces: `SKILL.md`, `README.md` (both paths a first-time reader takes), `references/design-md-theming.md`,
`references/template-contract.md`, `references/catalog.md`, `scripts/README.md`, `manual-testing-playbook/`
(the index and its nine scenarios), four applicator runs and the validator runs the paths prescribe,
the hub registries that route the packet (`../mode-registry.json`, `../hub-router.json`, and
`sk-doc`'s), `assets/style-reference/evilcharts/palettes.json`, the 32 shipped HTML files' font stacks,
and the changelog set's latest three releases.

Test method: walk both documented paths as a reader with no prior context, running every command the
path names and reading its real output and exit status; then resolve each verification row the packet
publishes against the command it gives; then hold the v0.21.0.0, v0.22.0.0 and v0.23.0.0 claims against
the tree.

Findings already made by iterations 1-3 are out of scope and are not re-made: F001 (the design-md gate
list in `color-system.md`), F002 (`family` column), F003 (write guard), F004 (reference file count),
F005 (five cursor-era document sites), F006 (playbook corpus count), F007-F010, F011-F013. Two findings
below touch F005's class; both say so and neither repeats its list.

## Scorecard

- Dimensions covered: release readiness, usability
- Files reviewed: 16 documents read in whole or in part, 3 registries grepped; the packet's own
  commands run and read, including four applicator runs, five verification-row invocations, three
  renderer invocations and a 25-case mutation-recipe matrix
- New findings: P0=0 P1=5 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.41 (9 new / 22 cumulative)

Baseline observed before any finding was recorded:

```
$ node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
  files scanned: 32 (chart forms under assets/templates: 29)
  ... 42 families, 0 failure(s)
  Summary: errors: 0
RESULT: PASSED                                            (exit 0)

$ node scripts/apply-design-md.cjs --default --all --out /tmp/rev4/all
  NOTE bullet|calendar-grid|heat-matrix|progress-single skipped: an ordered form keeps its stock magnitude ramp
  WROTE … 25 forms
RESULT: PASSED                                            (exit 0)

$ node scripts/apply-design-md.cjs assets/style-reference/evilcharts/DESIGN.md \
    --forms grouped-bars,daily-line --out /tmp/rev4/two
  MAPPING light|dark … (18 lines)
RESULT: PASSED                                            (exit 0)
```

## Findings

### P0, Blocker

None.

### P1, Required

- **F014**: **The release checklist in `README.md` §6 cannot be run as printed: two rows fail and one
  verifies a hub that does not own this packet**, `README.md:107-114`. The table gives a command and a
  "What a pass looks like" cell per row. Three rows were run exactly as written from the repository
  root, which is the working directory `scripts/README.md:25` states.

  - **Package shape** (`README.md:112`) promises `` `Result: PASS` ``. Observed, verbatim:
    ```
    $ python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py \
        .opencode/skills/sk-design/sk-design-chart --check --strict
    ❌ Strict mode: 2 contract requirement(s) unmet — Resource doc
      'assets/style-reference/evilcharts/DESIGN.md' has no frontmatter (expected 5-field block:
      title, description, trigger_phrases, importance_tier, contextType); Resource doc
      'assets/style-reference/evilcharts/origin.md' has no frontmatter …
    Result: FAIL                                          (exit 1)
    ```
    The sibling packet `sk-design-diagram` carries the same unwrapped `origin.md` under its own
    `assets/style-reference/`, so this is the vendored-reference convention meeting a strict check
    that was never told about it — and the row promises a pass anyway.
  - **Voice** (`README.md:114`) promises "Zero hard blockers" from `hvr_scan.py README.md`. Resolved
    from the table's own cwd that argument is the repository root's `README.md`, and the run reports
    **70 hard blockers**; the packet's README reports **1** (`52:74 hard punctuation ;`, the semicolon
    in `README.md:52`). Both readings fail the promised cell.
  - **Hub shape** (`README.md:113`) runs `parent-skill-check.cjs .opencode/skills/sk-doc`. This packet
    is not registered there: a grep over `sk-doc/mode-registry.json`, `sk-doc/hub-router.json` and
    `sk-doc/leaf-manifest.json` returns no `sk-design-chart`, and `sk-doc/SKILL.md:23-37`'s mode table
    lists thirteen packets, none of them this one. The packet is registered one level down:
    `../mode-registry.json:145`, `../hub-router.json:10,49,55` and `../leaf-manifest.json:48`. Both hub
    commands pass today (each prints `OK: parent-skill-check — all hard invariants passed, 0 warnings`),
    so the printed row **cannot fail on anything about this packet**: it is a green light wired to
    another building. The packet's own prose created the ambiguity — `SKILL.md:14` says "the `sk-design`
    parent hub" while `SKILL.md:3`, `:34`, `:56`, `:190` and `README.md:125` call `sk-doc` the hub,
    and `README.md:125` labels the file one level up — which is `sk-design`'s `SKILL.md`, titled
    "Design (parent hub)" — "The `sk-doc` hub that routes here". The release that last touched this
    knew better: `changelog/v0.23.0.0.md:66` verifies with `.opencode/skills/sk-design`.

    Why it matters: §6 is the only release checklist the packet publishes, and all three rows are the
    ones an operator runs before shipping. Two report a failure the packet does not acknowledge, one
    reports a pass that proves nothing about the packet, and none of the three has a reader-facing
    signal that anything is wrong. Change: point the hub row at `.opencode/skills/sk-design`, correct
    the `sk-doc` references or state the two-level relationship (`sk-doc` advisor → `sk-design` hub →
    packet) wherever it is asserted, fix the voice row's argument to the packet path, and either give
    the two Style Reference documents the expected frontmatter block or record the exemption where the
    row is read.

- **F015**: **The default applicator is documented as reproducing the stock palette exactly, and it
  changes half the colour values it writes**, `references/design-md-theming.md:87-92` —
  *"Theming from it reproduces the stock palette and the stock corner ladder exactly, which is the
  property that says the default is still the reference the corpus came from; the corpus check holds it
  through the `palette-derivation` family."*

  Observed by running the documented default twice and diffing against the stock blocks. The light
  block of a neutral form (`grouped-bars`) changes five of its ten colour values — `series-2` through
  `series-4`, `emphasis` and `rule` (`#484848/#747474/#8F8F8F/#0A0A0A/#E5E5E5` →
  `#104E64/#AD46FF/#FF2056/#1447E6/#0A0A0A17`); the dark block changes six, the same five plus
  `surface` and `muted` (`#141110` → `#090909`, `#A1A1A1` → `#787878`).
  On a categorical form the series mostly coincide (they are the same reference hues) but `series-2`,
  `emphasis` and `rule` still differ. Only the corner ladder reproduces exactly, which is the half the
  sentence does not need to argue for.

  The packet already knows this, from the other side: `changelog/v0.17.0.0.md` — *"Applying it was not a
  matter of running the applicator: a stock palette needs three systems on two grounds with a ramp, and
  the applicator derives one system."* And the family named in the same sentence holds the *palette
  file* against the reference (`palettes.json`'s `derivation` block), not the applicator's output
  against the stock blocks, so it is not the check the sentence says it is.

  Why it matters: `SKILL.md:131-132` sends every reference-less themed request to `--default` on the
  strength of this paragraph. A reader who expects the stock look gets a differently encoded chart —
  the neutral greys become four hues — with no line saying the encoding changed. Change: state what
  `--default` does (maps the reference's own table into the shared roles, one derived system; the stock
  palette's three systems were derived from the same reference by hand and are not a reproduction of
  this output) and drop the "exactly" claim or scope it to the corner ladder.

- **F016**: **The workflow's verification step never sees the artifact the workflow produces**,
  `SKILL.md:126` (*"Run the corpus validator before reporting the result"*) and `SKILL.md:184` (*"The
  corpus validator exits clean."*). A delivered chart is copied out of `assets/templates/` and edited,
  which is exactly the state the bare validator ignores — it walks the packet's 32 files. The command
  that reads a delivery is `--extra DIR`, documented at `README.md:111` and
  `references/design-md-theming.md:161`, and **`SKILL.md` never uses the word**: a grep for `extra` in
  `SKILL.md` returns only the unrelated `sk-design-md-generator` extraction sentences (`:38`, `:133`).

  Observed: a copy of `bar-columns.html` with one data value changed, placed outside the packet,
  passes `check-corpus.cjs --extra <dir>` (`RESULT: PASSED`), while the bare run reports the same
  `42 families, 0 failure(s)` whether the delivery is correct or not. A reader following `SKILL.md`
  alone therefore reports "the validator passed" about a file the validator never opened — the same
  failure shape the packet's `README.md:63` calls its reason to exist (*"turns 'the charts still work'
  into something you can run"*).

  Change: name the command in the workflow and the success criterion — the corpus check for the packet,
  `--extra <dir>` for the file that was just delivered — the way `README.md` §6 already splits them.

- **F017**: **The documented proof path for an outside delivery rejects any delivery not named after the
  chart form**, `scripts/check-corpus.cjs:463-476`. `checkIdentity` requires the `chart-template` meta
  value to equal the filename stem (`:473`), with no exemption for the files `--extra` adds. Rule 2 of
  the template contract states it for templates (`references/template-contract.md:494`) and names the
  failure it prevents as "a file nothing can index" — which is precisely what a delivery outside the
  package is.

  Observed, both from the two runs above:
  ```
  $ node check-corpus.cjs --extra /tmp/rev4/deliv2      # the copy kept the form's name
  RESULT: PASSED

  $ node check-corpus.cjs --extra /tmp/rev4/deliv3      # same bytes, renamed for a reader
  FAIL [identity] --extra/quarterly-sales.html: identity "bar-columns" does not match the filename stem "quarterly-sales"
  RESULT: FAILED
  ```
  `README.md:111` advertises this row as "Outside delivery … `RESULT: PASSED` with `design-md`
  provenance and gates checked", and nothing in `SKILL.md`, `README.md` or the theming guide says a
  delivery must keep the form's filename. The packet's own playbook treats the renamed copy as the
  normal case: `manual-testing-playbook/delivery-and-routing/opens-with-no-build-step.md:51` copies
  `treemap.html` to `~/chart-delivery-check.html`.

  Why it matters: the one documented way to accept a delivery outside the package fails on its name
  before it looks at the data, so an operator either renames the file to satisfy a corpus rule or
  learns to ignore the check. Change: apply only the tag-present and lower-case-kebab halves of
  `identity` to `--extra` files, or state the filename requirement where the delivery path is read.

- **F018**: **The operator playbook's restore rule is the one command the packet's script guide forbids,
  and it can discard the operator's uncommitted work**, `manual-testing-playbook/manual-testing-playbook.md:85`
  (*"restore with `git checkout --` of the touched path"*), repeated as a command in
  `delivery-and-routing/opens-with-no-build-step.md:55` and `corpus-integrity/catalog-resolves-both-ways.md:53`.
  The hazard is documented twice in the same packet: `scripts/README.md:176-178` — *"Restore from a
  copy, not from `git checkout --`. That command reverts to the last commit, not to the state you were
  working in, so on an uncommitted change it silently throws the work away"* — and
  `corpus-integrity/colour-comes-from-one-source.md:66-68`, which restores from `keep-matrix.html`
  instead and gives the same reason, in a sibling scenario of the one that still uses the forbidden
  command.

  Why it matters: the scenarios exist to be run while the packet is being changed — that is when a
  mutation is worth making — and the restore step is what stands between the operator and their
  working tree. `git checkout --` on `.opencode/skills/sk-design/sk-design-chart` (the command at
  `opens-with-no-build-step.md:55`) reverts every uncommitted change under the packet, not just the
  deliberate break, and the run that follows then fails for a reason unrelated to the test. Change:
  replace the three command lines with the copy-and-restore pattern the packet already demonstrates,
  and align the global rule at `manual-testing-playbook.md:85` with `scripts/README.md:176-178`.

### P2, Suggestion

- **F019**: **Six of the 25 manual mutation recipes in `scripts/README.md` §5 are silent no-ops against
  today's corpus**, so the checks they are supposed to break cannot be watched failing by the hand-run
  procedure. Each pattern was run against a copy (`sed -i` on a `/tmp` copy, then a byte compare) and
  matched nothing: `:279` `s/"#7657BF"/…/` (`#7657BF` occurs zero times in `palettes.json`), `:285`
  the ordered-ramp array `["#A1D4DC", …]` (the ramp is ember now), `:296`
  `--chart-series-2: #B0AEAA` (the value is `#A1A1A1`), `:355` and `:361` `s|<figure|…|` on
  `heat-matrix` and `progress-single` (both declare the figure on a `<div class="figure">`, so the tag
  the recipe names is not in either file), and `:371` `font-size: 11px` in `grouped-bars` (the sizes
  are 12/14/16/26). The remaining 19 recipes still mutate.

  Why it matters: §5 opens *"A validator that has only ever passed is not evidence"* (`:137`) and the
  dark-palette half is the one the page singles out — *"worth running before quoting a green dark
  theme"* (`:322-324`) — while two of the six dead recipes are the `palette-source-dark` and
  `palette-block` breaks that sentence depends on. An operator who runs them sees a green run and the
  file unchanged, which reads as a check that cannot fail rather than a recipe that no longer points
  at anything. Change: regenerate the six from the current values, or point §5 at the standing suite
  as the working copy (which is also F008's ask) and keep the prose recipes as the historical record.

- **F020**: **The stock corpus's body typeface is the removed `cursor` reference's face, in all 29
  templates and all three proof sheets, and no document in the packet names it.** Every shipped HTML
  file sets `font-family: CursorGothic, Inter, system-ui, "Helvetica Neue", sans-serif;`
  (`assets/templates/bar-columns.html:82` and 31 siblings; the name occurs nowhere in `*.md`, `*.json`
  or `*.cjs` outside `changelog/v0.6.0.0.md:15`, which records it as cursor's body typeface). The
  reference the packet actually carries names a different one — `evilcharts/DESIGN.md:46-47`,
  `Geist Sans` with its substitute stack — and the applicator uses that:
  `--default` rewrites the declaration to `"Geist Sans", Inter, system-ui, -apple-system, "Segoe UI",
  "Helvetica Neue", Arial`.

  This is F005's class in a different kind of site, and it is reported separately because the consequence
  is not a stale name: the stock corpus's type is not derivable from anything the packet now carries,
  the "one Style Reference" release (`changelog/v0.21.0.0.md:16`) left it behind, and a reader who asks
  which face the charts are set in has no file to read. Change: add the stock body and mono stacks
  beside the type scale in `palettes.json` (where the scale already lives so a check reads a value
  rather than restating one), or restack the corpus from the reference and re-render.

- **F021**: **The palette source's own prose still narrates the cursor reference and the directory
  v0.23.0.0 deleted**, `assets/style-reference/evilcharts/palettes.json` (the file `color-system.md:438`
  calls "the source of truth for every value", and the one the checker reads).
  `:17` `"chromeDarkNote"` explains the dark chrome as *"the cursor ink itself … Parchment becomes the
  ink and mist the muted tone"* — three names from a reference that is gone, describing values whose
  current derivation is evilcharts' `#090909` warmed and lifted; `:33` `"radiusRoles".ladder` reads *"on
  the cursor reference's 4px corner with 8px for the one container"*, which is both the removed
  reference and the 4px/8px pair F005 showed the enforced ladder does not hold (`4.4px` on track,
  swatch and pill; `8.4px` on the card); `:55` `"sheetNote"` says *"The two palette proof sheets under
  assets/color"* where three sheets ship and `assets/color/` was removed by the release whose §1 says
  so (`changelog/v0.23.0.0.md:26`). Change: rewrite the three notes against the reference and the
  directory that exist, and fix the count.

- **F022**: **The screenshot regeneration command in `README.md` is relative to the packet while the rest
  of the packet's commands are relative to the repository root**, `README.md:136-140`
  (`node ../shared/scripts/render-screenshots.cjs ./assets ./screenshots`). Run from the repository
  root — the cwd `scripts/README.md:25` mandates and every other command in the packet assumes — it
  fails before it starts: `Error: Cannot find module
  '/Users/…/Code_Environment/shared/scripts/render-screenshots.cjs'`. The same command with the path
  `.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs` works (`sources 32, missing 0`),
  and the changelog's own
  copy of it (`changelog/v0.23.0.0.md:65`, run from the packet) reports `sources 32, missing 0`. Change:
  make the two invocations absolute from the root, or say the block is run from the packet directory.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `README.md:107-114` vs the three commands' observed output; `references/design-md-theming.md:87-92` vs the `--default` diff; `SKILL.md:126,184` vs `scripts/check-corpus.cjs:463-476` | F014-F017; F001, F002, F005, F006, F011 remain open and are not re-derived |
| checklist_evidence | fail | hard | `spec.md:3,60` still carry the placeholder text and the folder holds no `checklist.md` | Carried from iteration 2 (F010); re-observed this iteration, not re-derived |
| feature_catalog_code | partial | overlay | 29 catalog rows resolve both ways; the row walked (`bar-columns`) reached its file and its system cell matched | `family` cell ungated — F002, carried |
| playbook_capability | partial | overlay | 9 scenarios present and routed by the index; `opens-with-no-build-step.md:51` copies `treemap.html` to `~/chart-delivery-check.html` | F018 (restore rule), F006 carried |

## Assessment

- New findings ratio: 0.41
- Dimensions addressed: release readiness, usability
- Novelty justification: 9 findings on the two paths a first-time reader takes and the checklist they
  land in. Five P1s, none of which repeats an earlier finding: the §6 verification table fails two of
  its own rows and points the third at a hub that does not register the packet; the default applicator
  is documented as reproducing the stock palette and does not; the workflow's verification step cannot
  see the delivery; the outside-delivery check rejects a renamed delivery on a corpus-indexing rule;
  and the playbook's restore command is the one the same packet warns against. The four P2s are one
  dead recipe set, one undocumented typeface that v0.21.0.0 left behind, one set of stale source notes
  inside the palette file, and one command that only works from a directory the packet does not name.
  Nothing above is taken from a document's summary of itself: every P1 is a command that was run and
  its output read, and every P2 is a match count or a byte compare.

## Ruled Out

- **The §6 rows that do work**: `check-corpus.cjs` (42 families, 0 failures, `RESULT: PASSED`), the
  design-reference command (`RESULT: PASSED` with 18 `MAPPING` lines and 2 `WROTE` lines), and
  `--extra` on a form-named delivery. Three of the six cells hold exactly as printed.
- **v0.23.0.0's own verification claims**: the renderer command in its §4 prints `sources 32, missing 0`;
  `assets/color/` is gone; both scripts resolve the palette source from `DEFAULT_STYLE_REFERENCE`
  (`check-corpus.cjs:29-35`, `apply-design-md.cjs:27-32`); and proof sheets are matched by filename
  (`check-corpus.cjs:1035-1036`). The relocation release holds.
- **v0.22.0.0's removals**: `assets/gallery.html` and `scripts/build-gallery.cjs` are absent, and the
  ordered-form skip in `--all` matches `design-md-theming.md:82-85` word for word in behaviour (four
  `NOTE … skipped` lines, 25 written of 29 forms).
- **The changelog set itself**: 23 files, `v0.1.0.0`-`v0.23.0.0`, no gap and no duplicate, matching
  `README.md:93`'s description of the folder.
- **The themed-path details**: the writer touches only the two palette regions, their provenance
  comments, the font stacks and the corner ladder, as `design-md-theming.md:141-143` says; the
  provenance comment's shape, hash and generator line match `:147-148`; and a bad invocation exits 2
  with `RESULT: FAILED` rather than succeeding silently.
- **The catalog-to-file path for a stock delivery**: the row read (`bar-columns`, `neutral`) names a
  file that exists, carries the matching identity tag and system declaration, and copies cleanly; the
  remaining 28 rows were not re-walked because iteration 1 and iteration 3 already resolved the index
  in both directions.

Review verdict: CONDITIONAL
