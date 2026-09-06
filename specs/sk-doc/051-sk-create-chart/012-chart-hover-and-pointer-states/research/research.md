---
title: "Research Synthesis: the pointer contract for all 21 chart forms"
description: "The decided pointer contract per form, the mechanism that carries it, the checker rule that enforces it and the four claims from the iteration narratives that did not survive verification against the code."
trigger_phrases:
  - "chart pointer contract"
  - "chart hover synthesis"
  - "data-chart-inert"
  - "chart tooltip mechanism"
  - "sk-create-chart interaction"
importance_tier: "important"
contextType: "research"
---

# Research Synthesis: the pointer contract for all 21 chart forms

> Read this instead of the five iteration narratives. Everything below was re-verified
> against the files on disk on 2026-09-05. Where a narrative claim did not hold, it is
> marked **CORRECTED** and the verified fact replaces it.

All paths are relative to `.opencode/skills/sk-doc/sk-create-chart/` unless written in full.

---

## 1. WHAT THIS PACKET DECIDED

Twenty-one chart forms live in `assets/templates/`. Each one now has a decided answer to
"what happens when a reader points at a mark". Three answers exist:

| Contract | Count | Meaning |
| --- | --- | --- |
| `tooltip` | 13 | A hover card opens on the pointed mark. Seven forms already carry it, five of the seven partial forms gain it and `daily-range` gains it from the tier that answered a pointer with nothing |
| `terminal` | 2 | The form answers a pointer already, through a different affordance, and a hover card would add nothing |
| `inert` | 6 | Every value the form encodes is printed beside its mark, so a card would restate what the reader is looking at. The form declares this and names the reason |

The deciding rule, applied to every form: **a value that exists only as geometry needs a
pointer, a value printed beside its own mark does not.** The rule was applied by reading
each template, not by counting markers.

One structural fact makes the whole thing safe. All 21 templates carry `data-chart-table`
(verified: `grep -l "data-chart-table" assets/templates/*.html` returns 21 of 21, and
`check-corpus.cjs:834` makes its absence an error). The table is the complete reading. So
nothing a pointer reveals is ever the only route to a value, and REQ-002 is satisfied
structurally rather than per form.

---

## 2. THE CORPUS, DECIDED

`registers today` is what the markup declares right now, measured per file. `contract` is
what this packet decides it should be.

| # | Form | Registers today | Contract | Why | Evidence |
| --- | --- | --- | --- | --- | --- |
| 1 | `box-plot` | tooltip | `tooltip` | Reference implementation. Five-number summary per box, none of it printed | `box-plot.html:161`, `:384-418` |
| 2 | `calendar-grid` | tooltip | `tooltip` | Shipped and working. Leave alone | register measured in markup |
| 3 | `candlestick` | tooltip | `tooltip` | Shipped and working. Leave alone | register measured in markup |
| 4 | `distribution-strip` | tooltip | `tooltip` | Shipped and working. Leave alone | register measured in markup |
| 5 | `heat-matrix` | tooltip | `tooltip` | Shipped and working. Leave alone | register measured in markup |
| 6 | `scatter` | tooltip | `tooltip` | Shipped and working. Leave alone | register measured in markup |
| 7 | `treemap` | tooltip | `tooltip` | Shipped and working. Leave alone | register measured in markup |
| 8 | `stacked-bars` | legend, dim | **gains `tooltip`** | A segment under 22 units prints no value, and the form draws no tick ladder to interpolate against | print gate `if (h >= 22)` at `stacked-bars.html:333`. Its only text nodes are the empty notice, the gated value, the category label and the capacity notice (`:226`, `:342`, `:346`, `:401`). No `.tick` or `.grid` class exists in the file |
| 9 | `stacked-area` | legend, dim | **gains `tooltip`** | Band values and the stack total are thickness only. The Total exists in the table and nowhere in the drawing | bands built from coordinates at `stacked-area.html:344`, Total column added at `:421`, drawing text limited to the axis ladder `:304` and the period labels `:368` |
| 10 | `grouped-bars` | legend, dim | **gains `tooltip`** | Column values are `y(v)` geometry with nothing printed on the mark. The tick rungs bracket a reading rather than giving it | column path at `grouped-bars.html:340`, text nodes at `:219` `:289` `:346` are notice, axis rung and category only |
| 11 | `bar-line-composed` | legend, dim | **gains `tooltip`** | Two ladders share one gridline set, so an off-scale height cannot be converted with confidence even by a willing reader. The only form where a card repairs genuine ambiguity rather than saving a lookup | columns via `yCount` at `bar-line-composed.html:384`, dots via `yRate` at `:416` |
| 12 | `daily-line` | dim | **gains `tooltip`** | The emphasised low is the only printed reading. Every other dot is position only | the low's value printed at `daily-line.html:380`, other text nodes are notice `:229`, axis rungs `:290`, day labels `:351` |
| 13 | `daily-range` | none | **gains `tooltip`** | Each day's minimum and maximum exist only as the two endpoints of the bar and are never printed | bar spans `y(d.high)` to `y(d.low)` at `daily-range.html:263-264`, printed text is the day number `:261` and the axis rungs `:251` |
| 14 | `parallel-axes` | legend, dim | `terminal` | Every dot already carries a browser tooltip naming label, axis, value and unit. Each line is named where it ends and both axis bounds are printed | native `<title>` attached at `parallel-axes.html:299-300` through `tip()` at `:239-244`, bounds printed `:284-285`, naming stated `:151` |
| 15 | `waterfall` | **none** | `terminal` | Every step delta is printed above its bar, and each bar carries a browser tooltip naming the value and the running total | native `<title>` at `waterfall.html:315-318` through `tip()` at `:237-242`, delta printed `:319-320` |
| 16 | `progress-single` | none | `inert` | One datum, printed beside the track, with goal, share and pace comparison each printed in the figure | read in full at iteration 1 |
| 17 | `unit-ring` | none | `inert` | Each group's count is printed in the key beside its swatch and the total is printed in the ring centre | key prints `d.label + ' ' + fmt(d.value)` at `unit-ring.html:253`, centre total `:246` |
| 18 | `unit-grid` | none | `inert` | Each part's share is printed in the key with its percent sign. A square is one percent by construction | key prints value and `%` at `unit-grid.html:245` |
| 19 | `independent-percentages` | none | `inert` | Each track's percentage is printed to the right of the track and its name to the left | value label `independent-percentages.html:214`, category label `:209` |
| 20 | `bar-columns` | none | `inert` | Each column's value is printed above it | value label `bar-columns.html:286`, category label `:285` |
| 21 | `bar-rows` | none | `inert` | Each bar's value is printed at its end, with unit suffix | value label `bar-rows.html:259`, category label `:254` |

Totals: 13 `tooltip`, 2 `terminal`, 6 `inert`. Thirteen files carry at least one of the
three existing registers today, which matches `references/template-contract.md:403`.

---

## 3. CLAIMS THAT DID NOT SURVIVE VERIFICATION

Four narrative claims are wrong or imprecise. A builder acting on them would produce a
wrong artifact.

**C1. CORRECTED. `waterfall` is not a "legend/dim terminal" form. It declares no register
at all.** Iteration 4 labels waterfall `legend/dim terminal` and iteration 4's delta record
repeats it. Measured, `waterfall.html` contains zero occurrences of `data-chart-tooltip`,
`data-chart-legend` and `data-chart-dim`, and no `:focus:not(:focus-visible)` hygiene line.
Its pointer answer is the native `<title>` alone. The verdict (no hover card) is unaffected.
The label is. Write waterfall's contract as `terminal, native title`, and do not plan a
legend or dim edit for it.

**C2. CORRECTED. The native `<title>` is a pointer affordance only, not an accessibility
one.** Iteration 1 reports, from waterfall's own comment, that "the browser draws it and a
screen reader reads it as the mark's name". The corpus contradicts itself here, and the
other side is right: `box-plot.html:240-243` states that "the drawing declares `role="img"`,
which makes its whole subtree one image, so a title on a mark inside it was never announced".
Every template's svg carries `role="img"` (`check-corpus.cjs:814` makes its absence an
error), so a mark-level `<title>` is announced to nobody. Consequence: `parallel-axes` dot
values and `waterfall` running totals are reachable by pointer and by the data table, and
not by a screen reader walking the drawing. That is acceptable under REQ-002 because the
table carries them, but the contract text must not claim screen-reader coverage from a
`<title>`.

**C3. CORRECTED. `stacked-area` does print numbers.** Iteration 4 says "the figure prints
no numbers at all". It prints the axis ladder at `stacked-area.html:304`. The accurate
claim, which is the one the verdict rests on, is that no band value and no total is printed
in the drawing.

**C4. PARTIALLY CORRECTED. The six `tabindex` occurrences are controls, but one of them
wraps a mark.** Five sit on legend entries (`stacked-bars.html:360`, `stacked-area.html:382`,
`grouped-bars.html:303`, `bar-line-composed.html:450`, `parallel-axes.html:306`). The sixth,
`daily-line.html:367`, sits on a `<g>` that contains the emphasised low's marker circle and
its printed note (`daily-line.html:365-383`). It is a control by construction (`role="button"`,
`aria-pressed="false"`) and it is also a mark. Iteration 5's decision (do not make marks
focusable) stands. Its supporting sentence, that no `tabindex` touches a mark, does not.

**Also worth knowing, and not wrong so much as untested.** Iteration 3 reports a baseline of
`RESULT: PASSED` with zero errors from `node scripts/check-corpus.cjs`. That run was not
repeated during this synthesis. Capture it again as the first act of the build, because
every phase below is ordered around the corpus being green today.

---

## 4. TWO CORPUS DOCUMENTS ARE WRONG TODAY

Both are in scope for this packet and neither is listed in the spec's Files-to-Change table.

**`references/template-contract.md:403`** says: "Thirteen forms do, counting all three
registers rather than the hover card alone, and the eight that do not are the ones whose
marks already print their own value". The count of thirteen is correct. The characterisation
of the other eight is false for `daily-range`, which prints neither of the two values it
encodes, and this packet is the reason it is false: `daily-range` is the form the sentence
was written to cover and the form that turned out to need a card.

**`scripts/README.md`** carries the mutation recipes under its section 5, and its section 7
rule set binds this packet's design: "Never assert that a document contains a particular
sentence. Prose has to stay editable... Facts a check needs live in structured data: the
palette file, the sentinel-marked catalog table, the identity tags." Any enforcement of the
contract must read an attribute or a sentinel-marked table, never a phrase.

---

## 5. THE ENFORCEMENT RULE

### 5.1 What the checker already does

Verified in `scripts/check-corpus.cjs`:

- `INTERACTION_REGISTERS = ['data-chart-tooltip', 'data-chart-legend', 'data-chart-dim']`
  at `:1130`, with the comment at `:1127-1129` calling them "the three attributes a form
  declares when it answers a pointer".
- `HYGIENE_RULE = /:focus\s*:not\(\s*:focus-visible\s*\)/` at `:1131`.
- `checkInteractionHygiene` at `:1138` filters `INTERACTION_REGISTERS` against the markup at
  `:1143-1145` and, at `:1146`, errors when a register is carried and the hygiene rule is
  absent from the stylesheet. **The focus-ring requirement keys off that array, exactly as
  iteration 3 claims.**
- The same function rejects an unconditional `outline: none` on a focus (`:1153`) and any
  `user-select: none` (`:1157`).
- `checkInteractionState` at `:1169` captures a register value with
  `/data-chart-dim\s*=\s*"([^"]*)"/g` at `:1173` and errors on a non-empty one, and errors
  on a `<g data-chart-tooltip>` that ships with content at `:1181-1186`.
- `checkNumberFormat` at `:1201` requires a file whose markup carries `data-chart-tooltip`
  to define its own `fmt()` (`:1214-1217`).
- `regionsOf` at `:369` strips `<style>` and `<script>` before producing `markup`, so all of
  the above read static markup only.
- `main()` at `:1718` runs every per-file check over `htmlFilesUnder(ASSET_ROOT)`, which is
  all 21 templates plus the 6 files in `assets/examples/` plus the 3 palette proof sheets.

### 5.2 The new register

**Attribute:** `data-chart-inert`, on the root `<figure>` element, with the reason as its
value. One example: `data-chart-inert="every encoded value is printed beside its mark"`.
The declaration and its justification travel together, so there is no sibling attribute and
no separate manifest to drift.

**It must not join `INTERACTION_REGISTERS`.** That array drives the focus-ring requirement
at `:1146`, and a form that refuses the pointer owes no focus rule. Verified: adding it
there would make all six inert forms fail `interaction-hygiene`, because none of them carries
the hygiene line today.

**Enforcement, as a sibling branch inside the existing interaction checks:**

| Declares `data-chart-inert` | Carries one of the three registers | Verdict |
| --- | --- | --- |
| no | no | pass |
| no | yes | pass, existing rules apply unchanged |
| yes, value non-empty | no | pass |
| yes, value empty or whitespace | no | **error**: the form declares `data-chart-inert` with no reason. The value is the why, and an inert form that cannot say why the static figure suffices has not made the declaration |
| yes, any value | yes | **error**: the markup declares `data-chart-inert` and `<carried list>`. A form cannot both refuse the pointer and answer it. Remove the inert declaration or the `<register>` register |

Silence passes because that is the philosophy the file already holds: `checkInteractionHygiene`
validates what a form declares, never what it omits. It is also what keeps the corpus green
on the day the rule lands, since nothing is annotated yet.

**Ordering:** the checker ships before any annotation. With no template annotated, no file
matches either error branch. The six inert forms are annotated afterward and stay green,
because none of them carries another register.

**Proving mutation, for AC-006.** `heat-matrix.html` carries `data-chart-tooltip` (verified).
Follow `scripts/README.md`'s own restore discipline, which forbids `git checkout --` on an
uncommitted tree:

```bash
cd .opencode/skills/sk-doc/sk-create-chart
cp assets/templates/heat-matrix.html /tmp/keep.html
# add data-chart-inert="every encoded value is printed beside its mark"
# to the root <figure> element of assets/templates/heat-matrix.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on the contradiction branch
cp /tmp/keep.html assets/templates/heat-matrix.html
node scripts/check-corpus.cjs   # expect RESULT: PASSED
```

Prove the empty-value branch separately, with `data-chart-inert=""` on a form that carries
no register. One mutation that fires proves something fired. It does not prove which branch.

---

## 6. THE MECHANISM A BUILDER COPIES

Source: `box-plot.html`. This section is complete enough to apply without opening it.

There is no shared runtime. These are self-contained static files, so the mechanism is
copied into each form that earns it. The measured cost of one copy is **7,016 bytes** across
four blocks: 2,186 bytes of CSS (`box-plot.html:124-150`), 50 bytes of markup (`:161`),
3,543 bytes of card-building script (`:235-317`) and 1,237 bytes of listeners (`:381-418`).
That is the number AC-011 asks for, before per-form registration code.

### 6.1 CSS

```css
[data-chart-tooltip] { opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
[data-chart-tooltip][data-open] { opacity: 1; }
.tip-card { fill: var(--chart-surface); stroke: color-mix(in srgb, var(--chart-rule) 50%, transparent); stroke-width: 1; rx: var(--chart-radius-track); }
.tip-name { fill: var(--chart-ink); font-size: 12px; font-weight: 600; }
.tip-label { fill: var(--chart-muted); font-size: 12px; }
.tip-value { fill: var(--chart-ink); font-size: 12px; font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace; font-variant-numeric: tabular-nums; }
.figure svg :focus:not(:focus-visible) { outline: none; }
@media (prefers-reduced-motion: reduce) {
  [data-chart-tooltip] { transition: none; }
}
```

Four things about this block are load bearing.

1. **The reduced-motion guard selector must be spelled `[data-chart-tooltip]`, character for
   character.** `scripts/README.md` section 6 records that the `motion` check matches guards
   per selector after collapsing whitespace, which is stricter than CSS. A guard written any
   other way names the same element and reads as a different rule, and the check fails.
2. **The guard must remove the motion, not shorten it.** `transition: none` passes.
   `transition-duration: 0.01s` does not.
3. **The hygiene line is required once any register is declared** (`check-corpus.cjs:1146`).
   Five of the six forms gaining a card already carry it. `daily-range.html` does not
   (verified: zero occurrences), so that line is part of its change and not part of theirs.
4. **Any decorative stroke drawn across a hittable mark takes `pointer-events: none`**, which
   is how box-plot handles overlap: `.whisker, .median { pointer-events: none; }` at
   `box-plot.html:140`. There is no nearest-mark resolution anywhere in this corpus. Overlap
   is resolved by making decoration transparent to the pointer.

Font sizes: 12px is the published `note` rung (`references/template-contract.md:106`), so
the card sizes pass `type-scale`. The card corner resolves through `--chart-radius-track`,
so it passes `radius`. Do not type either value.

### 6.2 Markup

One empty group inside the `<svg>`, after `<desc>`, with an id unique in the file:

```html
<g data-chart-tooltip id="tip-<form-id>"></g>
```

It ships empty. `checkInteractionState` errors on a tooltip group with content in it
(`check-corpus.cjs:1181-1186`), because a card already on screen paints identically on both
of the render check's pointer-free opens and would pass the settled comparison.

### 6.3 Script, card side

```js
const TIP_PAD = 10;
const TIP_LINE = 16;
const TIP_FLOOR = 128;
const TIP_ROWS = 5;                 // set to this form's own row count
const tipLayer = document.getElementById('tip-<form-id>');
const MARKS = new Map();

function tipNode(name, cls) {
  const el = document.createElementNS(SVG, name);
  el.setAttribute('class', cls);
  tipLayer.appendChild(el);
  return el;
}

const tipCard = tipNode('rect', 'tip-card');
const tipName = tipNode('text', 'tip-name');
const tipRows = [];
for (let r = 0; r < TIP_ROWS; r += 1) {
  tipRows.push({ label: tipNode('text', 'tip-label'), value: tipNode('text', 'tip-value') });
}
tipName.setAttribute('x', TIP_PAD);
tipName.setAttribute('y', TIP_PAD + 12);
tipRows.forEach(function (row, i) {
  row.label.setAttribute('x', TIP_PAD);
  row.label.setAttribute('y', TIP_PAD + 12 + TIP_LINE * (i + 1));
  row.value.setAttribute('y', TIP_PAD + 12 + TIP_LINE * (i + 1));
  row.value.setAttribute('text-anchor', 'end');
});

function markable(el, name, rows) {
  el.setAttribute('data-mark', '');
  MARKS.set(el, { name: name, rows: rows });
  return el;
}
```

`TIP_ROWS` is fixed at build time and `openTip` indexes `info.rows[i]` for every `i` below
it, so **every registered mark on a form must supply the same number of rows**. A form whose
readout varies per mark does not fit this shape without a change. None of the six forms in
scope needs one, at the row counts in section 6.6.

`openTip` and `closeTip`, from `box-plot.html:284-317`:

```js
function openTip(mark) {
  const info = MARKS.get(mark);
  tipName.textContent = info.name;
  tipRows.forEach(function (row, i) {
    row.label.textContent = info.rows[i][0];
    row.value.textContent = info.rows[i][1];
  });
  let width = Math.max(TIP_FLOOR, (tipName.getComputedTextLength() || 0) + TIP_PAD * 2);
  tipRows.forEach(function (row) {
    const used = (row.label.getComputedTextLength() || 0) + (row.value.getComputedTextLength() || 0);
    width = Math.max(width, used + TIP_PAD * 2 + 18);
  });
  const height = TIP_PAD * 2 + 12 + TIP_LINE * tipRows.length;
  tipCard.setAttribute('width', width);
  tipCard.setAttribute('height', height);
  tipRows.forEach(function (row) { row.value.setAttribute('x', width - TIP_PAD); });

  const view = svg.getAttribute('viewBox').split(' ');
  const box = mark.getBBox();
  let x = box.x + box.width + 12;
  if (x + width > Number(view[2])) x = box.x - width - 12;
  if (x < 0) x = 0;
  let y = box.y + box.height / 2 - height / 2;
  if (y < 0) y = 0;
  if (y + height > Number(view[3])) y = Number(view[3]) - height;
  tipLayer.setAttribute('transform', 'translate(' + x + ',' + y + ')');
  tipLayer.setAttribute('data-open', '');
}

function closeTip() {
  tipLayer.removeAttribute('data-open');
}
```

The card is measured from the text actually in it rather than from a character count, and it
flips to the other side of its mark rather than opening past the frame edge. Every figure it
prints goes through the file's own `fmt()`. All six forms in scope already define one
(verified: `function fmt (` appears once in each of the 21 templates).

### 6.4 Script, listeners and the pin

This is the half a partial copy leaves behind, and without it a touch reader gets nothing.
Verbatim from `box-plot.html:381-418`:

```js
let pinned = null;

function markAt(target) {
  return target && target.closest ? target.closest('[data-mark]') : null;
}

svg.addEventListener('pointermove', function (e) {
  if (pinned) return;
  const mark = markAt(e.target);
  if (mark) openTip(mark); else closeTip();
});
svg.addEventListener('pointerleave', function () {
  if (!pinned) closeTip();
});
svg.addEventListener('click', function (e) {
  const mark = markAt(e.target);
  if (!mark || mark === pinned) {
    pinned = null;
    closeTip();
    return;
  }
  pinned = mark;
  openTip(mark);
});
document.addEventListener('click', function (e) {
  if (pinned && !svg.contains(e.target)) {
    pinned = null;
    closeTip();
  }
});
svg.appendChild(tipLayer);
```

Four listeners, one delegated pair for hover and one pair for the pin. Not one listener per
mark: a calendar grid carries 364 cells and a matrix a hundred, and a listener each is a cost
the reader pays for nothing.

The final `svg.appendChild(tipLayer)` runs after the drawing is built, which raises the card
above the marks it describes. Put it last.

### 6.5 Registration

A mark answers a pointer only once it is registered. Wrap the mark-creating call:

```js
markable(node('rect', { /* attrs */ }, 'seg'), 'Segment name', [['Label', fmt(v)]]);
```

That opt-in is what keeps the forms that earn a card apart from the forms whose marks already
print their own value (`box-plot.html:273-274`).

### 6.6 The readout each form owes

| Form | Card name | Rows | `TIP_ROWS` |
| --- | --- | --- | --- |
| `stacked-bars` | segment name | value | 1 |
| `grouped-bars` | series name (last year, this year) | value | 1 |
| `daily-line` | the day | value | 1 |
| `daily-range` | the day | low, high. **Never a midpoint**, because a midpoint is the average this form exists to refuse | 2 |
| `bar-line-composed` | the period | count, rate, each tagged with the ladder it reads against | 2 |
| `stacked-area` | the x position | all four band values plus the total. A single value does not answer what a stack column shows | 5 |

`stacked-bars` restates the printed label for a tall segment and supplies the missing number
for a short one. That is deliberate: information that is unconditional per segment beats
information that appears only where the reader cannot already see it.

`stacked-area` is the one form whose readout is not per mark but per x position. Its bands
are single paths spanning the whole width, so a pointed band identifies a series and not a
column. Registering the paths gives band identity and not the x. This is the only form in
scope where the mechanism above does not transfer unchanged. See section 9.

---

## 7. THE TWO INPUT DECISIONS

### 7.1 Keyboard: marks do not become focusable

`data-chart-table` is the whole keyboard and screen-reader answer, and it is already
universal. No template gains a `tabindex`. No checker rule changes. The six existing
`tabindex` occurrences stay exactly as they are, because they mark elements that do
something: each carries `role="button"` and `aria-pressed`, and each is the control for its
form's dim. `parallel-axes.html:288-292` states the corpus rule they obey, that "a control a
pointer can reach has to be reachable from a keyboard too".

Extending focus to data marks would turn a static figure into a widget, which the spec's own
open question warns against, and it would buy nothing that the table does not already carry.

### 7.2 Touch: a tap pins, a second tap or an outside tap dismisses

**Guaranteed by the mechanism in 6.4:**

- First tap on a mark opens and pins its readout.
- A tap on a different mark re-pins to it.
- A second tap on the same mark dismisses.
- A tap anywhere outside the drawing dismisses.
- Hover yields while pinned, so the two input modes do not fight.

**Not guaranteed, and stated so rather than left silent:**

- Drag to scrub across marks. `pointermove` returns early while pinned, by design.
- Long press, or any other native touch affordance.
- Dismissal from inside the drawing except through the pinned mark itself.
- Any of it on a form that has not received the mechanism.

Nothing in `check-corpus.cjs` changes for touch. The gesture is runtime behaviour a static
checker cannot see, and `references/template-contract.md:397` already says as much.

---

## 8. RECOMMENDATIONS, RANKED

Each one names the file, the change and the observation that proves it worked. **Decided**
means the research closed it. **Judgement** means the research did not, and the builder or
the operator must.

**R1. Land `data-chart-inert` in `check-corpus.cjs` before annotating anything. DECIDED.**
Add the constant and two branches inside the existing interaction checks, reading the markup
region only. Do not add it to `INTERACTION_REGISTERS` at `:1130`. Proof: the corpus prints
`RESULT: PASSED` immediately after the rule lands with nothing annotated, and the two
mutations in section 5.2 each print `RESULT: FAILED` naming the right branch.

**R2. Record all 21 contracts in `references/template-contract.md` section 10. DECIDED.**
Add a fourth row to the register table at `:413-417` for `data-chart-inert`, and add the
per-form table from section 2 above. Correct the false sentence at `:403`. Rename section 7
from "THE SIXTEEN RULES" to seventeen and add the rule row, because that table pairs every
rule with the check that enforces it. Proof: read `ls assets/templates/*.html` against the
table rows and get 21 on both sides, with a named reason on every `inert` row.

**R3. Annotate the six inert forms. DECIDED.** `progress-single`, `unit-ring`, `unit-grid`,
`independent-percentages`, `bar-columns` and `bar-rows` each gain `data-chart-inert` on the
root `<figure>` with the reason from section 2. Proof: `RESULT: PASSED`, and a `grep -c
data-chart-inert assets/templates/*.html` returning exactly six files.

**R4. Transfer the whole mechanism, including the click-pin path, to the six forms.
DECIDED.** Copying only `pointermove` and `pointerleave` leaves every touch reader with
nothing, and touch is the gap the predecessor left. Proof per form: the card opens on hover,
a tap pins it, a second tap clears it, a tap outside the drawing clears it and the checker
stays green.

**R5. Add the hygiene line to `daily-range.html` in the same change that gives it a
register. DECIDED.** It is the only one of the six without it, so it is the only one where
adding a register alone turns the corpus red at `check-corpus.cjs:1146`. Proof: the
`interaction-hygiene` line in the run summary reports zero failures.

**R6. Add the inert mutation recipes to `scripts/README.md` section 5. DECIDED.** That
document's own standard is that "a validator that has only ever passed is not evidence", and
it records that every recipe there was run, watched failing and restored. A new rule with no
recipe breaks that standard. Proof: both recipes run from a clean tree and each prints
`RESULT: FAILED` naming the intended branch.

**R7. Decide what the six deliveries under `assets/examples/` owe. JUDGEMENT.** No example
carries any interaction register or the hygiene line (measured: zero occurrences of all four
attributes across all six files). Three of them are deliveries of forms that carry a working
hover card in the template. Section 9 states the decision and the options. This is the
largest thing the five iterations never looked at.

**R8. Restate or waive AC-005. JUDGEMENT.** As written it cannot be satisfied. Section 9
carries the argument.

---

## 9. STILL OPEN

**O1. The deliveries carry no interaction at all.** Measured across `assets/examples/`:
zero occurrences of `data-chart-tooltip`, `data-chart-legend`, `data-chart-dim` and the
hygiene line, in all six files. Their parent forms, read off their `desc` and mark classes:

| Delivery | Parent form | Template's contract |
| --- | --- | --- |
| `calls-by-day-and-hour.html` | heat-matrix | `tooltip`, shipped |
| `pick-times-by-depot.html` | distribution-strip | `tooltip`, shipped |
| `van-age-against-repair-cost.html` | scatter | `tooltip`, shipped |
| `orders-after-the-price-change.html` | daily-line | gains `tooltip` |
| `where-the-budget-went.html` | unit-grid | `inert` |
| `staff-hours-by-service.html` | bar-rows | `inert` |

So the interaction layer is template-only today, and three deliveries of hover-carrying forms
answer a pointer with nothing. The spec's Files-to-Change table says examples are
"Regenerate", which presumes a generator this synthesis did not find. The options are: bring
the deliveries up to their parents' contracts, or record in the contract that a delivery is
a separate artifact whose pointer state is its author's choice. The second is cheaper and is
a real position, given that `checkEmptyNotice` was extended to deliveries after exactly this
kind of exemption was checked and found to be unearned (`check-corpus.cjs:1750-1756`). Do
not decide it by default.

**O2. AC-005 is unsatisfiable as written.** It asks that a new form "inherits its pointer
contract without reimplementing the behaviour", verified by adding a throwaway form, wiring
only its contract declaration and confirming the behaviour appears. The scope constraint in
`spec.md` section 3 forbids any shared runtime, so behaviour cannot appear from a declaration
alone. What this packet actually delivers for REQ-004 is a shared *declaration* surface and
a checker that enforces it, with the code duplicated per file at a measured 7,016 bytes.
That is a real answer to "nothing prevents the next form from shipping inert", and it is not
the answer AC-005 describes. Restate the criterion against the declaration, or waive it with
a decision record. Do not quietly mark it Met.

**O3. Silence still passes, so annotation completeness is unenforced.** Iteration 3 decided
this, and its reason is sound as a migration argument: an error-on-silence rule would force
all 21 forms to be annotated in one commit. Once all 21 are annotated, that reason expires.
Nobody decided what happens then. The choice is between leaving silence a pass forever, which
means a twenty-second form can still ship inert and unannotated, and flipping it to an error
in a final phase, which closes the gap the packet's problem statement names. There is a
precedent for the strict reading in `checkCatalogResolves` at `check-corpus.cjs:1538-1542`,
which errors when a template on disk has no catalog row. The research did not reach a verdict.

**O4. `stacked-area`'s readout does not fit the per-mark mechanism.** Its bands are single
paths spanning the full width (`stacked-area.html:343-346`), so pointing at a band identifies
a series rather than an x position, and its decided readout is all four bands plus the total
at the pointed x. The mechanism in section 6 registers marks and reads their bounding box. It
has no x resolution. Either `stacked-area` gains per-x hit targets, which is new machinery
this corpus has never carried, or its readout is reduced to the pointed band alone, which
contradicts the iteration 4 verdict that "a single value would not answer what a stack column
shows". Settle this before starting the form.

**O5. The `interaction-state` empty-card rule versus a form that registers marks in a
loop.** Not a contradiction found, but not tested either. The tooltip group ships empty and
the drawing code fills it. `tipNode` appends the card elements at build time
(`box-plot.html:251-256`), which happens inside `<script>` and therefore never appears in the
markup region the check reads (`check-corpus.cjs:1170`). This should be safe for the six new
forms for the same reason it is safe for the seven existing ones. Confirm it with a run rather
than by reasoning.

---

## 10. RULED OUT, WITH THE REASON

Do not reopen these without new evidence.

| Direction | Why it is out |
| --- | --- |
| A shared runtime, a framework, a CDN or a build step | `spec.md` section 3. The files are self-contained and must open with no network. This is what makes the 7,016 byte per-file duplication a cost of the constraint rather than a design mistake |
| Nearest-mark snapping, a crosshair, or an axis readout | The reference implementation carries none of them. Overlap is resolved by `pointer-events: none` on decoration (`box-plot.html:138-140`), which is avoidance rather than resolution, and it is sufficient for every form in the corpus |
| One listener per mark | A calendar grid carries 364 cells. Delegation at the svg root is the corpus pattern (`box-plot.html:381-383`) |
| Making data marks focusable | Section 7.1. The table is the non-pointer readout and focusable marks would turn a static figure into a widget |
| Adding `data-chart-inert` to `INTERACTION_REGISTERS` | That array drives the focus-ring requirement at `check-corpus.cjs:1146`. An inert form answers no pointer and owes no focus rule. Verified: none of the six inert forms carries the hygiene line, so this would turn the corpus red |
| A separate manifest or a sibling attribute for the inert reason | The reason rides in the attribute value, using the capture pattern already proven at `check-corpus.cjs:1173`. Two surfaces drift, one does not |
| A checker rule that demands `daily-range` carry a tooltip | Needs-pointer is this packet's judgement about geometry-only encoding, not a property of the markup. No static rule can read it. The classification lives in the contract document and the checker enforces self-consistency of what a form declares |
| Prose-matching the contract document from the checker | `scripts/README.md` section 7 forbids it outright. Facts a check needs live in structured data |
| Treating the corpus as having no interaction surface | It has one. Three registers, a hygiene rule, a ship-state rule and a formatter rule all predate this packet. The gap is a fourth register and six missing cards, not a missing subsystem |
| Classifying `daily-range` as inert because its table carries both bounds | The table is universal across all 21 templates and therefore discriminates nothing. The rubric asks whether the value is printed inside the figure beside its mark, and `daily-range` prints neither endpoint |
| Re-deriving the seven working tooltips | `spec.md` section 2 non-goals. No defect was found in any of them |

---

## 11. WHAT THE CHECKER STILL CANNOT SEE

Stated so nobody reads a green run as more than it is. From
`references/template-contract.md:386-397` and confirmed against the code:

- Whether a card opens on the right mark, whether it flips at the correct edge and whether a
  pin latches. All read by a person.
- Anything about touch. The gesture is runtime behaviour.
- Whether a value in a card is also in the table. Rule, not check.
- The picture itself. `--render` asserts the figure region holds real elements after the
  script ran, that two light opens are identical and that a dark open differs from a light
  one. It does not know whether the bars are the right height.
- `--render` needs a Chrome or Chromium binary on the usual paths or named by `CHROME_PATH`,
  and errors rather than skipping when it finds none (`check-corpus.cjs:1626-1629`). AC-007
  asks for a `--render` run, so that binary is a prerequisite for closure.
