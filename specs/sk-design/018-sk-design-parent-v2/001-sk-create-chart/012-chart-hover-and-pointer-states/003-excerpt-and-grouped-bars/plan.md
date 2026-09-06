---
title: "Implementation Plan: Extract the excerpt and transfer it to grouped-bars"
description: "Copy box-plot.html's hover-card mechanism into grouped-bars.html: the CSS, the empty tooltip group, the card-building script and the listeners-and-pin script, adapted to this form's own data, formatter and node helper. Measure the byte cost."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Extract the excerpt and transfer it to grouped-bars

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Static HTML, inline CSS, ES5-compatible inline JavaScript. No build step |
| **Framework** | None. There is no shared runtime in this corpus, so the mechanism is copied into each file that earns it |
| **Storage** | None |
| **Testing** | `node scripts/check-corpus.cjs`, manual browser verification (hover, pin, reduced motion, no-script), `wc -c` for the byte delta |

### Overview
`box-plot.html` is the reference implementation of a hover card: CSS at `:124-150`, one empty `<g data-chart-tooltip>` at `:161`, the card-building script at `:235-317`, and the listeners-and-pin script at `:381-418`. This phase copies all four blocks into `grouped-bars.html`, adapts the card-building script to register each column mark with its series name and value, and adds the reduced-motion guard line to the existing media query. `grouped-bars.html` already carries `data-chart-legend`, `data-chart-dim`, the hygiene line and its own `fmt()`, so nothing about the surrounding file has to change beyond what this phase adds.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 1 has landed, so `grouped-bars.html`'s decided contract (`tooltip`) and readout shape (series name, one value row, `TIP_ROWS = 1`) are recorded in `references/template-contract.md`
- [ ] `node scripts/check-corpus.cjs` prints `RESULT: PASSED` before this phase starts
- [ ] `wc -c assets/templates/grouped-bars.html` recorded as the baseline (19,671 bytes, measured 2026-09-05. Re-measure before editing in case the file has changed)

### Definition of Done
- [ ] `node scripts/check-corpus.cjs` prints `RESULT: PASSED`, with `interaction-hygiene`, `interaction-state` and `number-format` reporting zero failures on `grouped-bars.html`
- [ ] Hover, pin, reduced-motion and no-script verification all pass by hand
- [ ] The byte delta is measured and recorded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
None. `grouped-bars.html` remains a single, self-contained static file. The hover mechanism is copied inline, not referenced from a shared source.

### Key Components

- **The tooltip CSS**, added to the existing `<style>` block (`grouped-bars.html:9-159`), near the existing `.figure svg :focus:not(:focus-visible)` rule at `:136`:

```css
[data-chart-tooltip] { opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
[data-chart-tooltip][data-open] { opacity: 1; }
.tip-card { fill: var(--chart-surface); stroke: color-mix(in srgb, var(--chart-rule) 50%, transparent); stroke-width: 1; rx: var(--chart-radius-track); }
.tip-name { fill: var(--chart-ink); font-size: 12px; font-weight: 600; }
.tip-label { fill: var(--chart-muted); font-size: 12px; }
.tip-value { fill: var(--chart-ink); font-size: 12px; font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace; font-variant-numeric: tabular-nums; }
```

  Do not add a second `.figure svg :focus:not(:focus-visible)` rule. `grouped-bars.html:136` already carries it, and it already covers any element the new mechanism adds.

- **The reduced-motion guard**, added inside the existing block at `grouped-bars.html:155-158`, not a new `@media` block:

```css
@media (prefers-reduced-motion: reduce) {
  path.past, path.current { animation: none; }
  [data-series] { transition: none; }
  [data-chart-tooltip] { transition: none; }
}
```

  The selector must be spelled `[data-chart-tooltip]` character for character. `scripts/README.md` section 6 records that the `motion` check matches guards per selector after collapsing whitespace, which is stricter than CSS, and the guard removes the motion rather than shortening it (`transition: none`, never `transition-duration: 0.01s`).

- **The tooltip group**, added inside the `<svg>` at `grouped-bars.html:166-169`, after the `<desc>` at `:168` and before `</svg>` (it may sit before or after the existing `<g data-chart-legend id="legend-grouped-bars">` at `:169`, either position is correct, since the script re-raises it above every mark with `svg.appendChild(tipLayer)` at build time):

```html
<g data-chart-tooltip id="tip-grouped-bars"></g>
```

  It ships empty. `checkInteractionState` (`check-corpus.cjs:1181-1186`) errors on a tooltip group that ships with content.

- **The card-building script**, added inside the existing `<script>` block, after `fmt()` (`grouped-bars.html:233-238`) and before the column-drawing loop (`grouped-bars.html:334-343`):

```js
const TIP_PAD = 10;
const TIP_LINE = 16;
const TIP_FLOOR = 128;
const TIP_ROWS = 1;
const tipLayer = document.getElementById('tip-grouped-bars');
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

  This is `box-plot.html:235-317` verbatim except `TIP_ROWS` is set to `1` for this form's one-row readout and `tipLayer`'s id matches this form's own (`tip-grouped-bars`).

- **Registration**, wrapping the existing column-mark creation at `grouped-bars.html:336-340`. The current code:

```js
node('path', {
  d: topRounded(x, y(v), barWidth, BASE - y(v), MARK_R),
  style: '--mark-index:' + drawn,
  'data-series': s + 1
}, RANK[s]);
```

  becomes:

```js
markable(node('path', {
  d: topRounded(x, y(v), barWidth, BASE - y(v), MARK_R),
  style: '--mark-index:' + drawn,
  'data-series': s + 1
}, RANK[s]), SERIES[s], [['Value', fmt(v)]]);
```

  `SERIES` (`grouped-bars.html:185`, `['Last year', 'This year']`) supplies the card name. The category (`d.label`, for example `'Referral'`) is already printed on the chart beneath each column pair (`grouped-bars.html:343`), so the card's job is only to supply what is missing: which series and its value.

- **The listeners and the pin**, added at the end of the script, after `svg.setAttribute('data-chart-dim', ...)` and any other drawing code, so `svg.appendChild(tipLayer)` runs last:

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

  This is `box-plot.html:381-418` verbatim, with no form-specific change needed: it delegates from the `svg` element rather than attaching one listener per mark, which matters here exactly as it does everywhere else in the corpus.

- **No `pointer-events: none` exemption is needed.** `box-plot.html:140` sets it on its whisker and median lines because those decorative strokes sit on top of the box mark. `grouped-bars.html` has no decorative element drawn over a column. Confirm this by inspection before treating its absence as an oversight.

### Data Flow
The script builds the tooltip layer's DOM nodes once, at load time, before any data is drawn. The column-drawing loop (`grouped-bars.html:334-343`) now also calls `markable()` on each column path as it draws it, associating that DOM element with its series name and formatted value in the `MARKS` map. A `pointermove` or `click` on the `<svg>` resolves the nearest ancestor carrying `data-mark`, looks it up in `MARKS`, and `openTip()` reads the figure's own `fmt()` output into the card. No value is computed inside `openTip()`. Every number it prints was already formatted by `fmt()` at registration time, so the card and the drawing can never disagree about a figure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase adds a hover interaction to one already-correct static template. It is not a bug fix and touches no security boundary, path handling, schema, persistence or shared policy.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static check | `grouped-bars.html` and the rest of the corpus | `node scripts/check-corpus.cjs`, confirm `interaction-hygiene`, `interaction-state` and `number-format` report zero failures on this file |
| Manual: hover | `grouped-bars.html` opened locally with no network | Hover each column, confirm the card names the correct series and value, confirm it flips near the right edge |
| Manual: pin | Same file | Tap a column to pin, tap another to re-pin, tap the pinned column again to clear, tap outside the drawing to clear, confirm hover does nothing while pinned |
| Manual: reduced motion | Same file, system set to reduced motion | Confirm the card appears with no fade |
| Manual: no-script (negative control) | Same file, scripting disabled | Confirm the figure and table read exactly as before this phase |
| Measurement | `grouped-bars.html` before and after | `wc -c`, record the delta |

**The no-script check is the negative control for this phase.** The tooltip group ships empty and the drawing code fills it. With scripting disabled, nothing should be visible or missing that was not visible or missing before this phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-register-and-contract` | Internal | Must be landed first | Without the recorded readout shape, this phase would have to re-derive `grouped-bars`'s card contents from `research.md` directly |
| `box-plot.html`'s mechanism | Internal | Shipped, stable reference implementation | If `box-plot.html` has changed since this plan was written, re-read `:124-150`, `:161`, `:235-317` and `:381-418` before copying |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `check-corpus.cjs` fails on `grouped-bars.html`, or any manual verification step (hover, pin, reduced motion, no-script) fails.
- **Procedure**: `cp assets/templates/grouped-bars.html` aside before editing. If a step fails, restore the file from its copy (never `git checkout --`) and reapply the mechanism from this plan's exact snippets before rerunning the checker.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (confirm phase 1, baseline byte count) ──► Core (CSS, markup, script, registration,
                                                        listeners) ──► Verify (checker,
                                                                              hover, pin,
                                                                              reduced motion,
                                                                              no-script,
                                                                              byte delta)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `001-register-and-contract` | Core |
| Core | Setup | Verify |
| Verify | Core | Packet phases 4, 5 and 6, which copy this phase's proven mechanism |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Confirm phase 1, record the baseline byte count |
| Core Implementation | Medium | Four coordinated blocks (CSS, markup, script, registration) plus the listeners, all copied and adapted correctly together |
| Verification | Medium | Four manual walks (hover, pin, reduced motion, no-script) in addition to the automated checker run |
| **Total** | | Medium, per `phase-recommendation.md`'s own sizing |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `cp` made of `grouped-bars.html` before editing
- [ ] Not applicable: no feature flag exists for a static template
- [ ] Not applicable: no deployed runtime or monitoring surface exists for this skill's assets

### Rollback Procedure
1. Stop editing the file where the failure surfaced.
2. Restore `grouped-bars.html` from its pre-edit copy with `cp`, never `git checkout --`.
3. Rerun `node scripts/check-corpus.cjs` and confirm `RESULT: PASSED` before resuming.
4. Not applicable: no external stakeholders consume this skill's internal checker output.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
