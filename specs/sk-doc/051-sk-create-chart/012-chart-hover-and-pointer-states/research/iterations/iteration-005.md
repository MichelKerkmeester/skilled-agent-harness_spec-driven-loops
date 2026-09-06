# Iteration 005 — FINAL: keyboard and touch decisions

## Focus

Decide the two remaining open questions — (1) do marks become focusable, or is the table the whole keyboard answer, and (2) what does a tap guarantee — then stop for synthesis.

## Actions Taken

1. Read `box-plot.html` lines 380-415 (the delegated listeners, the pin model, the document-level click dismissal).
2. Grepped `parallel-axes.html` for `tabindex` and read the ~40-line window around its single occurrence.
3. Read `check-corpus.cjs` lines 1138-1155 (`checkInteractionHygiene`, the `:focus:not(:focus-visible)` rule).
4. Cross-checked existing node ids in `deltas/iteration-001..004.jsonl` so this iteration's graph edges wire to real nodes.

## Findings

### Decision 1 — keyboard
**Decision:** Marks do not become focusable — reaching the value through `data-chart-table` is the whole keyboard answer, and the six existing `tabindex` occurrences are control focus, not mark focus, so they stay exactly as they are.

**Because:** The single `tabindex` in parallel-axes sits on a legend entry built as a dim control, not on a mark — `entry.setAttribute('role','button')` with `aria-pressed` at `parallel-axes.html:306-308`, and the comment above it states the rule it obeys: "it is the control for the dim and a control a pointer can reach has to be reachable from a keyboard too" (`parallel-axes.html:290-292`). That is the corpus pattern: tabindex marks an element that *does* something, and a static mark does nothing. The checker already agrees — the focus-ring rule only fires when markup declares an `INTERACTION_REGISTERS` attribute (`check-corpus.cjs:1146-1152`), and `data-chart-inert` was deliberately placed outside that list in iteration 3, so inert forms owe no focus rule and needs-pointer forms owe none either, because their values are already in the table (`n-iter001-c-table`).

**Consequence for the build:** Nothing. No template gains a tabindex, no checker rule changes; the existing six occurrences are untouched and the table remains the sole non-pointer readout.

**What the six tabindex occurrences are:** Leave. They are legend/key dim controls (and equivalents), which is a different category from data marks; extending them to marks would turn a static figure into a widget, which the packet's spec warns against, and removing them would break keyboard access to real controls.

### Decision 2 — touch
**Decision:** A tap pins a mark's readout open (the same gesture a second tap, a tap on another mark, or a tap outside the drawing dismisses), and the tooltip mechanism copied into the six pending forms must carry that click-pin path, not only the hover listeners.

**Because:** The reference mechanism already defines the gesture: the svg `click` listener pins on a mark tap, unpins when the tapped mark is the pinned one (`box-plot.html:398-406`), and the document listener closes the pin when the tap lands outside the drawing (`box-plot.html:408-411`); `pointermove` yields while pinned (`box-plot.html:389`), so the pin is stable under a finger.

**Guaranteed:**
- First tap on a mark opens and pins its readout.
- Tap on a different mark re-pins to the new mark.
- Second tap on the same mark, or any tap outside the drawing, dismisses.
- Hover behaviour is suppressed while pinned, so the two input modes do not fight.

**Not guaranteed:**
- Drag-to-scrub across marks (pinned suppresses `pointermove` by design).
- Long-press or any native touch affordances.
- Dismissal from inside the drawing except via the pinned mark itself.
- Any of this on the five tier-2 forms and daily-range until they receive the mechanism.

**Consequence for the build:** The tooltip excerpt that ships to stacked-bars, stacked-area, grouped-bars, bar-line-composed, daily-line and daily-range must include the click-pin listeners and the document dismissal alongside `pointermove`/`pointerleave` — copying only the hover half would leave touch readers with nothing. Nothing changes in `check-corpus.cjs`: the gesture is runtime behaviour the static checker cannot see, and the hygiene rules already cover what it can.

## Questions Answered

- Keyboard: marks do not become focusable; the table is the whole answer; the six tabindex occurrences are controls and stay.
- Touch: tap pins, re-tap/outside-tap dismisses; the shipped mechanism must carry the click path; no checker change.

## Questions Remaining

- None. Both final decisions are closed. Synthesis comes next.

## Next Focus

Synthesis: assemble the packet's hover-and-pointer contract from the closed per-form classifications, the two decisions above, `data-chart-inert`, and the checker's three-register vocabulary.

## SCOPE VIOLATIONS

None.
