# What the surface measurement found

Baseline in `baseline-surface-phrases.txt`, taken before any edit. Result in
`after-surface-phrases.txt`, at daemon generation 666 after an explicit rebuild.

## Three surfaces were unreachable, and now are not

| Phrase | Baseline | After |
|--------|----------|-------|
| `how should this slide be laid out` | nothing | `sk-design=0.9059` |
| `margins for a print layout` | nothing | `sk-design=0.8962` |
| `document layout hierarchy` | nothing | `sk-design=0.9112` |
| `type scale for a printed report` | `sk-design=0.858` | `sk-design=0.95` |
| `presentation deck spacing` | `sk-design=0.82` | `sk-design=0.9059` |

Every control held: `what padding should this have` at 0.82, `contrast ratio failure on this button`
at 0.95, `create a chart` at 0.8461, `make a diagram` at 0.82, `flowchart` at 0.82, and
`extract design tokens from stripe.com` at 0.9067. The canvas modes kept their phrases, which was the
main risk of widening a sibling's vocabulary.

## The sixteen-phrase set did not regress

Three cells moved and none changed an owner. `extract design tokens` moved one ten-thousandth.
`write a readme for this package` and `create a repo rule file` each reordered a third-place entry
below the winner, which stayed `sk-doc` at 0.95 and 0.9423. No phrase dropped below its baseline.

## One phrase reaches the hub but not first

`design review of this slide deck` returns `sk-code=0.9379, sk-design=0.9107`. It clears the bar and
reaches this hub, so the requirement is satisfied, but `sk-code` still wins the ordering. The pattern
holds across rephrasings: `review this slide deck` gives `sk-code=0.9285`, `design review of this
deck` gives `sk-code=0.9441`. Drop the review verb and it inverts: `critique this slide layout`
returns `sk-design=0.82` alone.

So `sk-code` carries strong review vocabulary, and a design review of a deck is genuinely ambiguous
between "review the artifact" and "review the code that renders it". Raising this hub above it would
mean either inflating design weights or trimming `sk-code`'s, and this phase's scope forbids changing
another hub. Recorded for whoever decides whether a design review of a non-code artifact should
outrank a code review.
