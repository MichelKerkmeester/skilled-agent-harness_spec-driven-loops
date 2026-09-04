---
title: "sk-create-chart Scripts"
description: "How to run the corpus check, what each of its checks enforces, what four of them still cannot see, and how to prove any of it can fail before trusting a green run."
trigger_phrases:
  - "chart validator"
  - "chart corpus check"
  - "validate chart templates"
  - "check-corpus"
importance_tier: normal
contextType: reference
version: 1.6.0.0
---

# sk-create-chart Scripts

One script lives here. `check-corpus.cjs` is the corpus check. It enforces every rule the template
contract states, and three of them it enforces in part: the contract's section 7 names which three
and section 9 says what a run does not observe. A green run means what those two sections say it
means and no more.

---

## 1. OVERVIEW

Run it from the repository root. The first form is the one to reach for by default.

```bash
# structural checks over the whole corpus
node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs

# the same, plus opening every template in a headless browser
node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render
```

It needs Node and nothing else. `--render` needs a Chrome or Chromium binary, found on the usual paths or named by `CHROME_PATH`.

---

## 2. KEY FILES

| File | Role |
| --- | --- |
| [`check-corpus.cjs`](check-corpus.cjs) | The corpus check. It reads every template in the corpus and asserts the template contract against each one. With `--render` it also opens each template in a headless browser |

---

## 3. READING A RUN

**Require the `RESULT: PASSED` line.** A run that dies before its first check exits without printing a failure, and a summary that only looks for `RESULT: FAILED` reads that silence as a pass.

Every check prints its assertion count. A check with zero assertions ran on nothing, which is not the same as a check that passed, and the corpus file count at the top of the run is there so an empty corpus cannot look like a verified one.

Render is off by default and the summary says which mode it ran in. Without `--render` nothing has been opened, so a structural pass is not a rendering pass.

Each open pins its colour scheme with a browser flag rather than inheriting the one the machine happens to be set to. Two opens under a pinned light scheme are what `settled-render` compares, and a third under a pinned dark scheme is what `dark-render` compares against the light one, so a run means the same thing on a machine set to dark as on one set to light.

---

## 4. WHAT IT CHECKS

Per template file, one check name each: `document-shape`, `identity`, `palette-block`, `colour-literals`, `no-external`, `script-parses`, `data-block`, `unique-ids`, `accessibility`, `card-parts`, `determinism`, `narrow-viewport`, `motion`, `radius`, `series-mapping`. The rule behind each one, and the failure it prevents, is the table in `../references/template-contract.md`.

`series-mapping` is the newest and the one worth reading the reason for. Every other colour rule
asks where a value came from; this one asks which mark received it. A file whose indexed classes
hand out the palette's tokens in the wrong order passes all the others, because the block still
matches the source, no literal appears outside it and the source still gates clean. Reverse the
five mappings in a matrix form and the encoding inverts while the legend, drawn from the same
classes, inverts with it, so the picture agrees with itself and disagrees with the data. The rule
also holds the two facts either side of the mapping: the indices run from one without a gap, and
they stop at the declared system's capacity. Both are the same failure from another angle, because
a class the stylesheet cannot paint is painted black rather than left alone.

Six more run per file and enforce clauses the contract states outside its numbered table. Each of the six existed as a written rule before it existed as a check, and a rule the tooling does not check is a wish:

- `empty-notice` requires every chart form and every delivery to carry the `CHART_EMPTY_NOTICE` guard, to sit below the data block it reads, and to carry the labelled block and the break that let it stop the drawing. A guard that prints the notice and then draws anyway prints it over the empty frame it was warning about. The deliveries were exempt until the stated ground for it was read: the exemption said each carried the notice of the form it came from, and none of the six did. A proof sheet is still exempt, and for a ground that holds, because its data block is the palette it draws.
- `interaction-hygiene` requires the one hygiene line in any file whose markup declares an interaction register, and separately rejects an unconditional `outline: none` on a focus and any `user-select: none`. Those are the two ways the line could be widened into taking a focus ring or a copyable number away from a reader, and both pass every other rule here.
- `interaction-state` requires the dim attribute to ship empty and the tooltip group to ship without content. Neither failure is visible to the render path: a file that opens already dimmed paints the same picture on both of its pointer-free opens, so `settled-render` agrees with it exactly as it agrees with a correct file.
- `number-format` rejects any host-locale formatter anywhere in the corpus, and requires a file carrying a hover card to define a formatter of its own. A locale-dependent formatter is invisible on the machine that authored the file and changes the grouping mark, the decimal mark and the digits on the machine that opens it.
- `type-scale` rejects a font size that is on neither the six published rungs nor the three named departures. The nine values live in the palette source beside the corner ladder, so the check reads them rather than restating them, and all three routes are covered: a size declared in the stylesheet, a size passed to `setAttribute` directly, and a size handed to the `node(name, attrs, cls)` helper that every chart form builds its marks through. The third was the route the rule missed and the only one the corpus actually uses, so the check covered a path no file takes and skipped the path all of them take.
- `gradient-sweep` resolves a gradient's stops through the classes that carry them and rejects a gradient naming two different series values in a file whose declared system is not `ordered`. A gradient naming one series value at two opacities is a fade and is left alone.

With `--render` three more run, and all three need a browser:

- `render` opens each file once and asserts the figure region holds real elements after the script ran, which catches a chart that opens as an empty box.
- `dark-render` opens each file again with the colour scheme pinned dark and requires a different picture. Every file carries a second palette block that paints only when the reader's system asks for a dark scheme, and no reading of the file can prove that block reaches the paint: one pasted outside its media query matches the source in both directions and changes nothing on screen.
- `settled-render` opens each file a second time and compares both halves of what came back. Rule 12 asks that two renders of one file agree, and the rule's other half is a static scan of the drawing code for a clock or a random source. That catches two ways a picture can change on its own and misses a third, an animation still running when a reviewer takes the screenshot. The document dump catches a drawing still building itself. The picture catches motion that has not settled, and it is the half that does the new work, because a stylesheet animation never touches the DOM and a document comparison cannot see it at all.

Two checks are about the corpus rather than about one file:

- `palette-source` computes every contrast gate from `assets/color/palettes.json` rather than from a copy. A test that restates the values goes stale the first time somebody edits a colour, and then it certifies the old palette forever.
- `palette-source-dark` runs the same gates against the dark surface. It prints as its own line with its own assertion count, so one theme's pass cannot be read as covering both, and a run that reports nothing on this line has gated one ground rather than two.
- `narrow-viewport` is asserted from the stylesheet rather than from a rendered page, and that limit is deliberate rather than lazy. A headless run returns the DOM, and the DOM does not say whether the page overflowed. The numbers that would answer it live in layout. So the check proves both regions of the card can scroll sideways, and that the drawing declares a floor no wider than its own `viewBox`, which is the part an author forgets. The table half was added after two files were measured dragging the whole page sideways at 500 units, which is a thing this check cannot see and a script injected into a copy of the file can. Whether the chart is legible at that floor stays a review question, and the contract says so.
- `catalog` resolves the index in both directions: every catalog row reaches a file that identifies itself with the same id, and every chart form on disk appears in the catalog. A row that exists is not a row that points anywhere, and an index checked in one direction only rots on the first rename.
- `catalog-system` holds the index's other hand-kept cell against the file it describes. Every row's system has to name a system the palette source defines and has to match what the template declares. The cell mirrors the file rather than judging it, which is exactly why the two can drift apart with nothing noticing, and a hand reading of both documents is what found that out the first time.
- `geometry-block` compares the shared geometry record byte for byte across every chart form and every proof sheet. The set is derived from the two directories rather than listed, so a new form joins it by existing, and a corpus where the block had been scattered over some of the files would fail rather than pass a count of them.

---

## 5. PROVING IT CAN FAIL

A validator that has only ever passed is not evidence. Before trusting a green run, break something and watch it go red.

```bash
# a colour literal outside the palette block
cp assets/color/palette-sheet-neutral.html /tmp/keep.html
sed -i '' 's/var(--chart-muted)/#888888/' assets/color/palette-sheet-neutral.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on colour-literals
cp /tmp/keep.html assets/color/palette-sheet-neutral.html
node scripts/check-corpus.cjs   # expect RESULT: PASSED
```

**Restore from a copy, not from `git checkout --`.** That command reverts to the last commit,
not to the state you were working in, so on an uncommitted change it silently throws the work
away and the run that follows fails for a reason unrelated to the mutation you were testing.

Any of these breaks a different check: change one hex in the palette block, delete an `aria-labelledby`, add a second element with an existing id, add a catalog row pointing at a file that does not exist, drop the `CHART_DATA:END` sentinel.

`narrow-viewport` is the newest and reads from the stylesheet, so break it there:

```bash
# remove the pan affordance and the drawing's floor
sed -i '' 's/ overflow-x: auto;//; s/min-width: 480px; //' assets/templates/scatter.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED, twice on narrow-viewport
cp /tmp/keep.html assets/templates/scatter.html
```

That recipe used to end in `git checkout --`, three paragraphs after this page tells you not to
use it. Take the copy first: `cp assets/templates/scatter.html /tmp/keep.html`.

Raising the floor above the drawing's own width fails it a third way, which is the case
that catches a min-width copied from a wider form.

`radius` has two branches, so break both. A corner typed into a stylesheet is one:

```bash
cp assets/templates/bar-columns.html /tmp/keep.html
sed -i '' 's/border-radius: var(--chart-radius-card);/border-radius: 12px;/' assets/templates/bar-columns.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on radius
cp /tmp/keep.html assets/templates/bar-columns.html
```

A corner typed into the drawing code is the other: add `rx: 2` to any `node('rect', …)` call and
run it again. Two spellings of that same corner used to pass and no longer do, so break both.
Quote the key, `'rx': 4`, which is how every attribute object in the corpus writes a hyphenated
one. Or hold the number in a name first, `const CORNER = 3;` then `rx: CORNER`, which is the same
typed corner wearing a name. A corner computed from a mark's own geometry, such as the range bar
in `daily-range.html` rounded to half its width, is geometry rather than a shared value and passes
on purpose.

---

`motion` reads three routes now, because it used to read one. Break each separately.

```bash
cp assets/templates/bar-columns.html /tmp/keep.html

# a motion driven from the drawing code, with no guard anywhere. This is the shape the rule
# used to miss: it matches no CSS pattern, so the file animated and the check said nothing
sed -i '' "s|const rows = document.getElementById('rows');|requestAnimationFrame(function () {});\nconst rows = document.getElementById('rows');|" assets/templates/bar-columns.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on motion

# a fallback that shortens the motion instead of removing it
cp /tmp/keep.html assets/templates/bar-columns.html
sed -i '' 's/.col, .col-lead { animation: none; }/.col, .col-lead { animation-duration: 0.01s; }/' assets/templates/bar-columns.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on motion

# an animation that repeats, which leaves the file with no settled state at all
cp /tmp/keep.html assets/templates/bar-columns.html
sed -i '' 's/0.5s cubic-bezier(0.33, 1, 0.68, 1) backwards/0.5s cubic-bezier(0.33, 1, 0.68, 1) infinite backwards/' assets/templates/bar-columns.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on motion

# a second animation, in a file whose stylesheet already guards the first. This is the shape
# that made the rule per-file rather than per-animation: the guard below covers .col, and .tick
# inherited an answer that was never about it
cp /tmp/keep.html assets/templates/bar-columns.html
sed -i '' 's|</style>|.tick { animation: chart-grow 0.4s ease backwards; }\
</style>|' assets/templates/bar-columns.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on motion

cp /tmp/keep.html assets/templates/bar-columns.html
```

A guard has to remove the motion the rule declares, not some other motion. Switch `box-plot.html`'s
`[data-chart-tooltip] { transition: none; }` to `animation: none` and the tooltip fades again for a
reader who asked it not to, with the guard still sitting there looking like one.

`no-external`, `accessibility` and `colour-literals` each read a route that used to be invisible.

```bash
cp assets/templates/bar-rows.html /tmp/keep.html
# a web font: a src with a colon rather than an equals sign, one line inside an at-rule
sed -i '' 's|</style>|@font-face { font-family: "X"; src: url("https://example.com/x.woff2"); }\
</style>|' assets/templates/bar-rows.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on no-external
cp /tmp/keep.html assets/templates/bar-rows.html

cp assets/templates/scatter.html /tmp/keep.html
# the real attribute renamed, the word kept alive in a comment beside it
sed -i '' 's|<table data-chart-table>|<!-- data-chart-table --><table data-chart-tabular>|' assets/templates/scatter.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on accessibility
cp /tmp/keep.html assets/templates/scatter.html
```

A colour breaks the same way in three syntaxes, and none of them is a declaration: hand
`setAttribute('fill', 'firebrick')` to any element, pass `'fill': 'rebeccapurple'` to a `node()`
call, or paint `fill="papayawhip"` onto the `<svg>` in the markup. The word list that used to watch
this route knew thirty-six colour names and none of those three.

The dark half of the palette breaks in four places, and each one is a different check.

```bash
cp assets/color/palettes.json /tmp/keep.json

# a dark value below its own gate: the light line stays green and the dark line goes red
sed -i '' 's/"#7657BF"/"#3A2C5C"/' assets/color/palettes.json
node scripts/check-corpus.cjs   # expect RESULT: FAILED on palette-source-dark

# a dark ramp written backwards. Reversal keeps every step separation intact, so this is the
# mutation a check that gated whichever end looked lighter would wave through
cp /tmp/keep.json assets/color/palettes.json
sed -i '' 's/\["#A1D4DC", "#47AFBE", "#318893", "#28646A", "#1F4649"\]/["#1F4649", "#28646A", "#318893", "#47AFBE", "#A1D4DC"]/' assets/color/palettes.json
node scripts/check-corpus.cjs   # expect RESULT: FAILED on palette-source-dark, five times
cp /tmp/keep.json assets/color/palettes.json
```

The block half breaks in three:

```bash
cp assets/templates/bar-columns.html /tmp/keep.html

# one dark value drifted from the source
sed -i '' 's/--chart-series-2: #B0AEAA;/--chart-series-2: #B0AEAB;/' assets/templates/bar-columns.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on palette-block

# the dark block outside its media query, which would paint dark values on every reader
cp /tmp/keep.html assets/templates/bar-columns.html
sed -i '' 's/@media (prefers-color-scheme: dark) {/@media screen {/' assets/templates/bar-columns.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on palette-block

# the dark sentinel pair used twice, which is the ceiling rule 4 sets
cp /tmp/keep.html assets/templates/bar-columns.html
# paste a second copy of the dark block after the first, then:
node scripts/check-corpus.cjs   # expect RESULT: FAILED on palette-block and on colour-literals

cp /tmp/keep.html assets/templates/bar-columns.html
```

`dark-render` needs `--render`. Break it by leaving the block where the text checks are happy and
the paint never happens: keep the query and add a condition that cannot be true.

```bash
cp assets/templates/bar-columns.html /tmp/keep.html
sed -i '' 's/@media (prefers-color-scheme: dark) {/@media (prefers-color-scheme: dark) and (min-width: 99999px) {/' assets/templates/bar-columns.html
node scripts/check-corpus.cjs --render   # expect RESULT: FAILED on dark-render only
cp /tmp/keep.html assets/templates/bar-columns.html
```

That one is worth running before quoting a green dark theme. Every text check passes on that file,
because the block is present, inside a `prefers-color-scheme` query and identical to the source.
Only the picture disagrees.

`settled-render` needs `--render` and a slower run, and it fails on a motion the structural
rules are right to pass. Raise a duration well past the three second budget, or drive an
animation from `performance.now()`, which is a clock rule 12's static half does not read:

```bash
cp assets/templates/daily-line.html /tmp/keep.html
sed -i '' 's/chart-reveal 1s/chart-reveal 30s/' assets/templates/daily-line.html
node scripts/check-corpus.cjs --render   # expect RESULT: FAILED on settled-render
cp /tmp/keep.html assets/templates/daily-line.html
```

That one is worth running at least once. It is the only check in the set that observes the
painted picture rather than the file or the document, and a check nobody has watched fail is
a check nobody should quote.

The eight checks added last are the ones worth breaking before quoting, because they are the
newest and because six of them existed as prose for several releases before anything enforced
them. Every recipe below was run, watched failing and restored.

```bash
cp assets/templates/grouped-bars.html /tmp/keep.html

# a form that answers a pointer and carries no hygiene line
sed -i '' 's|^.figure svg :focus:not(:focus-visible) { outline: none; }$||' assets/templates/grouped-bars.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on interaction-hygiene
cp /tmp/keep.html assets/templates/grouped-bars.html

# a form shipped already dimmed, which every render check agrees with
sed -i '' 's|id="chart" data-chart-dim=""|id="chart" data-chart-dim="1"|' assets/templates/grouped-bars.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on interaction-state
cp /tmp/keep.html assets/templates/grouped-bars.html

# a size off the published scale
sed -i '' 's|font-size: 11px|font-size: 16px|' assets/templates/grouped-bars.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on type-scale
cp /tmp/keep.html assets/templates/grouped-bars.html

# the shared geometry record drifting in one file
sed -i '' 's|     drawing frame   720 units|     drawing frame   760 units|' assets/templates/grouped-bars.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on geometry-block
cp /tmp/keep.html assets/templates/grouped-bars.html
```

The other four break elsewhere. Replace the grouping in any template's `fmt` with a
`toLocaleString()` call, or rename `fmt` in a form that carries a hover card, and
`number-format` fires on each. Delete the `CHART_EMPTY_NOTICE` block from a form, or take away
the `break figure;` inside it, and `empty-notice` fires on each: the second is the more
interesting half, because the sentinels are still there and the guard can no longer stop the
drawing. Change one row's system cell in `../references/catalog.md` and `catalog-system` fires.
And give `daily-line`'s area fade a second series value on one of its stops, which turns a fade
into a sweep on a file that declares `neutral`, and `gradient-sweep` fires.

**Restore from a copy every time.** Several of these mutations are one character, and
`git checkout --` on an uncommitted tree throws the working state away rather than the mutation.

`series-mapping` is the one to break before quoting a green run on the colour work, because the
mutation it catches is invisible in the picture. Reverse a ramp inside a file and the legend
reverses with it:

```bash
cp assets/templates/heat-matrix.html /tmp/keep.html
# .series-1 takes token 5, .series-2 takes token 4, and so on
sed -i '' 's/\.series-1 { fill: var(--chart-series-1)/.series-1 { fill: var(--chart-series-5)/; s/\.series-5 { fill: var(--chart-series-5)/.series-5 { fill: var(--chart-series-1)/' assets/templates/heat-matrix.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on series-mapping, twice
cp /tmp/keep.html assets/templates/heat-matrix.html
```

Its other two halves break separately. Delete one `.series-N` rule from a form to leave a gap in
the ladder, or raise a file's `CAPACITY` constant above the number of classes it defines: both
report which side moved, because a constant that outruns the classes reopens the hole the constant
was added to close.

`type-scale` reads three routes and only one of them is a route the corpus takes. Break the one it
takes:

```bash
cp assets/templates/bar-rows.html /tmp/keep.html
# a size off the scale, handed to the node() helper rather than to setAttribute
sed -i '' "s|const rows = document.getElementById('rows');|node('text', { x: 10, y: 10, 'font-size': 20 }, 'key');\nconst rows = document.getElementById('rows');|" assets/templates/bar-rows.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on type-scale
cp /tmp/keep.html assets/templates/bar-rows.html
```

---

## 6. WHAT THESE CHECKS CANNOT SEE

Six holes used to sit here, each proved by mutation: a file was broken in the named way, the whole
check ran, and it stayed green. All six are closed. Each was watched failing on the mutation that
proved it, and each was run a second time against a copy of the checker with that one assertion
switched off, because a mutation that fails proves only that something fired, and the control is
what says which thing.

What closed them was a parser in every case rather than a wider pattern. `motion` matches each
animating selector against the guards instead of testing the sheet for a string. `no-external`
reads the target of every `url()` instead of looking for an equals sign. `accessibility` reads the
table attribute off an element the way its own `svg` half already did. `colour-literals` reads what
a colour-bearing property is handed instead of asking whether the value is a word somebody thought
to list. `radius` reads the value at the call instead of assuming it is spelled in digits.

The table below is what is left. None of these rows is a file passing while it is wrong. Each is a
place where a rule says something narrower than the sentence it enforces, and would rather stay
quiet than fail a file that is doing nothing wrong.

| Check | What still passes it | Why it stays that way |
| --- | --- | --- |
| `motion` | A guard whose selector is spelled differently from the rule it guards. The match is per selector after whitespace is collapsed, which is stricter than CSS: a rule animating `.col` and a guard written `[class~="col"]` name the same mark and read as two | This costs a false failure rather than a false pass, so it fails safe. Resolving two selectors as equivalent needs a selector engine, and every form in the corpus writes the guard with the selector it guards |
| `radius` | A corner the file computes to a constant, such as `rx: 8 / 2` | An expression is how the one form with a genuinely per-mark corner writes it. Folding the arithmetic would close this and would also start judging arithmetic, which is a different rule wearing this one's name |
| `colour-literals` | A colour assembled from pieces, such as `'fire' + 'brick'` | Only a complete string literal is judged, because the proof sheets build a palette reference by joining `'var('` to a property name. Reading the first piece as the whole value fails three correct files |
| `no-external` | A resource whose address the drawing code builds at run time | Every static reference is read. A string assembled at run time is not a reference until it runs, and nothing short of running the file can say what it becomes |

---

## 7. RULES FOR SCRIPTS HERE


- A rule the tooling does not check is a wish. Anything the contract states as binding is enforced here, and anything that cannot be enforced is named as advisory in the contract instead of written as if it bound.
- Never assert that a document contains a particular sentence. Prose has to stay editable, and a check that pins a phrase makes rewriting the docs break the build. Facts a check needs live in structured data: the palette file, the sentinel-marked catalog table, the identity tags.
- Never hardcode a file inventory. The corpus is discovered on disk and the index is read from the catalog, so a rename fails loudly with a message about the rename rather than quietly with a message about a missing chart.
- Never exempt anything without a comment naming what is exempt and why. One exemption exists, the ungated gridline role, and its reason sits next to the gates in the palette file.
- Scripts stay inside the packet and read only packet-local paths.
- No script pulls a chart library. The corpus opens with no install step, and a check that needs one contradicts the artifact it checks.
