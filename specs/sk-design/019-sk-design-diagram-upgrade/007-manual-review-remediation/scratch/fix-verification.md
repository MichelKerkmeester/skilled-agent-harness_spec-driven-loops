# Fix verification — the 34 manual-review findings

**Date:** 2026-09-11
**Verifier:** Opus 5 (`claude-opus-5`)
**Under review:** `9f5dcdf94f` (34 findings, one dispatch per file) and `1f46850345` (doctrine pass,
46 text elements repointed off `soft`).
**Baseline compared against:** `2dc62a071b`.

**How I rendered.** Every changed `.html` was rendered fresh from the working tree at HEAD:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --hide-scrollbars --force-color-profile=srgb --window-size=1280,1600 \
  --virtual-time-budget=2500 --screenshot=<out.png> "file://<abs path>"
```

Six tall pages — `template-full`, `example-sequence-oauth`, `example-sequence-oauth-full`,
`example-quadrant-consultant`, `example-dp-integration`, `example-medallion` — were re-rendered at
`--window-size=1280,2200` and judged from those, because `template-full`'s `viewBox` grew from
`0 0 1000 700` to `0 0 1000 864` as part of the F1/F3 fix and would otherwise have been cut.
34 PNGs, all viewed. Fifteen regions were cropped and upscaled with `sips` where a verdict turned
on a few pixels (ER connector, architecture RESP, timeline tick, tree connector, venn arcs,
mermaid Postgres, swimlane lane pair, state PURGE, high-level arrowhead, matrix cells, gantt zone
gaps, data-flow chip legend).

**One synthetic probe.** `templates/template.html` ships an empty placeholder `<svg>`, so F32's
claim — that repainting the sentinel block now repaints the `arrow-link` marker — cannot be seen in
the shipped file. I copied it to a scratch directory, added one line using `marker-end="url(#arrow-link)"`,
rendered it, then rendered a second copy with `--color-link: #cc0000`. The arrowhead went blue →
red. The token is live, not dead.

Verdicts below come from the renders and the diffs. Commit messages were not treated as evidence.
S1–S10 are out of scope here and are not re-reported.

---

## Per-file verdict

| file | findings | landed? | new defect? | note |
|---|---|---|---|---|
| `examples/example-architecture.html` | F5, F6 | yes | no | Both labels sit clear of the Astro node; RESP renders as one continuous dashed arrow. |
| `examples/example-bar.html` | F34 | yes | no | Y axis now reads 0–120. |
| `examples/example-data-flow.html` | F23 | yes | no | LS/TB chips repainted to ink/muted; white chip text legible on all four. DB still 4.44:1 — see #11. |
| `examples/example-dp-integration.html` | F16 | yes | no | Second label is `AUDIT`, both labels centred on their own line, transit now drawn after the identity bar and crosses it. Zone/role labels still `soft` — see #11. |
| `examples/example-dp-security-matrix.html` | F17 | yes | no | Admin / Write / Read / None are four visibly distinct cell treatments; `None` values now muted. |
| `examples/example-er.html` | F4 | yes | no | Tag→ArticleTag is a visible 40px connector with `1`/`N` beside it, not on it. |
| `examples/example-gantt.html` | F7, F8 | yes | yes | Focal bar sits inside zone 2; W1–W12 row added. Inter-zone gap now uneven — #8. |
| `examples/example-high-level.html` | F18, F19 | yes | no | The shared riser is inboard of the Kubernetes border and separable from it; the write-back arrowhead now fades with its shaft. |
| `examples/example-import-drawio.html` | doctrine | yes | no | Nine `soft` labels repointed to muted; renders clean. |
| `examples/example-import-mermaid.html` | F13 | yes | **yes** | Postgres is now fully inside `CORE SERVICES` — but its own incoming connector now runs through the box. **#1**. |
| `examples/example-it-state.html` | F24, F25 | yes | no | `survivor` legend key added; three zone masks trimmed to label width + 8. |
| `examples/example-layers.html` | F9 | yes | no | Five bands read as five. Hairlines carry the separation; the promised fill step was not applied — #10. |
| `examples/example-line.html` | F34 | partly | yes | `0` tick added, gridlines end at W8 — but the axis still runs past them. **#7**. |
| `examples/example-loop.html` | doctrine | yes | no | Sublabels and arrow labels at muted; spokes still structural `soft`, which is correct. |
| `examples/example-medallion.html` | F28 | yes | no | All five tiers carry an `Access` field; the catalog's third clause is now answered. |
| `examples/example-nested.html` | F33 | yes | no | The leader dot lands inside the `/project` box above `CLAUDE.md`. Five level tabs still over-wide — #12. |
| `examples/example-org-chart.html` | F15 | yes | yes | Legend entry and the subtitle claim both dropped. Subtitle now ungrammatical — **#9**; the note bar still asserts the claim — #13. |
| `examples/example-process.html` | F23 | yes | no | LS/TB repainted; white chip text legible. `.node-tool` still `soft`, unlike its data-flow twin — #11. |
| `examples/example-pyramid.html` | F22 | yes | no | `~240/yr` / `~48/yr` / `~4/yr` now muted; they read as ordinary secondary text. |
| `examples/example-quadrant-consultant.html` | F21 | yes | yes | Tint matches the quadrant exactly and no longer overruns the axis — but the card it highlights now sits 60px right of it. **#6**. |
| `examples/example-radar.html` | F20 | yes | no | Rings drawn after the fills at 0.18; non-focal fills at 0.08. All four series and all five tick labels are traceable. |
| `examples/example-scatter.html` | F12 | yes | no | `DEPLOYS PER WEEK` sits under the tick row, above the legend rule. |
| `examples/example-sequence-oauth-full.html` | F27 | yes | no | Outer container removed, fragment fill stepped to 0.04; the ALT frame reads as a block against the paper. |
| `examples/example-sequence-oauth.html` | doctrine | yes | no | `APP` badge repointed; renders clean. |
| `examples/example-sequence.html` | doctrine | yes | no | Three actor badges repointed; renders clean. |
| `examples/example-state.html` | F29 | yes | **yes** | Five guards added in `[condition]` form. The PURGE connector is now erased by its own mask — **#2** — and each guard is split from its event by the arrow — **#3**. |
| `examples/example-swimlane.html` | F14 | yes | **yes** | The dash pattern is now legible and the legend swatch matches. Polish copy is now 12px out of line with its lane sibling — **#4**. |
| `examples/example-timeline.html` | F2 | yes | yes | One scale (56.8–58.0 px/month against the caption's claim, was 52–70) and one Jan '26 position. The year tick is now swallowed by the dot — #14. |
| `examples/example-tree.html` | F10 | yes | **yes** | `polish`/`critique` now have the same 20px gap as every other pair. The connector was not moved with the box — **#5**. |
| `examples/example-venn.html` | F11 | **no** | no | Both sublabels moved 20px inward and both are still cut by their own arc. **#15**. |
| `templates/template-dark.html` | F31, F32 | yes | no | Comments read `jet-black` / `white-smoke`; `--color-link` declared inside the sentinel block and referenced by the marker. |
| `templates/template-full.html` | F1, F3 | yes | no | All ten legend rows render and the whole block sits below the AWS REGION boundary. Still paints link blue from literals — #16; legend now floats — #17. |
| `templates/template-terminal.html` | F30 | yes | no | The `#` sigil renders in `--color-muted`; `example-loop-terminal.html` still carries the original defect — #11. |
| `templates/template.html` | F32 | yes | no | `--color-link` declared; the synthetic probe confirms repainting it repaints the marker. |
| `color/diagram-palette.json` | F26 | **no** | no | A dark `link` role was added, but the `untokenized` entry F26 asked to delete is untouched. **#18**. |

---

## Still wrong, or newly wrong

### Introduced by a fix

**1. `examples/example-import-mermaid.html:43` — the WRITES connector now runs through the Postgres node.**
The F13 fix moved Postgres from `y="384"` to `y="344"` (`:58`, box now 608–768 × 344–400) but left
both of its incoming connectors at their old coordinates. The Orders Service connector
`M752,336 V352 A8,8 0 0 1 744,360 H696 A8,8 0 0 0 688,368 V384` therefore enters the box at y=344,
elbows *inside* it, cuts through the word "Postgres", and plants its arrowhead on top of the
`orders` sublabel at (688,384). The `WRITES` label mask at `:51` (`x="696" y="340" width="48"`)
straddles the box's top border. The render shows a line drawn across the node's own title. This is
the most visible thing on the page and is worse than the defect F13 removed.
*Fix:* terminate the connector on the box edge and route it clear of Orders Service —
`:43` → `d="M744,304 H720 A8,8 0 0 1 712,312 V344"`, and move the label beside the short run with no
mask (`:51` → text at `x="726" y="316"`, drop the rect). While there, lift the NO return off the same
top border: `:41` `V336 A8,8 0 0 1 624,344 H488` → `V320 A8,8 0 0 1 624,328 H488`, with its `NO`
label mask (`:49`) moved from `y="324"` to `y="308"`.

**2. `examples/example-state.html:108` — the PURGE transition renders as nothing.**
The Archived→End connector is `x1="640" y1="400" x2="640" y2="432"` (`:85`) — 32px. The F29 guard
turned the one-line PURGE label into a two-line block with a 24px mask,
`<rect x="584" y="404" width="112" height="24" fill="#f5f5f5"/>`, covering y 404–428 straight across
x=640. Four pixels of shaft survive above the mask and the arrowhead below it. In the render there
is no line between Archived and the terminal dot. This is exactly the F4 / F6 / F14 failure the
remediation just finished removing from three other files, re-created in a fourth.
*Fix:* put the label beside the connector, not on it — `:108` → `<rect x="656" y="404" width="112" height="24" …/>`
and both texts to `x="712"` with `text-anchor="start"`; drop the mask entirely, since a 32px run
needs no mask once the label is clear of it.

**3. `examples/example-state.html:95,100` — each guard is separated from its event by the arrow.**
`SUBMIT` sits at y=194 with its mask at 184–196; `[complete]` sits at y=212 with its mask at
204–216. The Draft→In Review connector runs at `y="200"` (`:79`), i.e. between them. The same holds
for `APPROVE` / `[≠ author]` against the coral connector at `:81`. In the render the guard reads as a
detached second label below the line rather than as part of the transition it qualifies.
*Fix:* stack both lines on one side of the connector — `:93`–`:96` to `y="170"`/`y="182"` with masks at
160–172 and 172–184, and `:98`–`:101` the same, so event and guard form one two-line block above the
arrow.

**4. `examples/example-swimlane.html:137` — Polish copy is 12px out of line with Approve merge.**
The F14 fix moved Polish copy down 12px (`y="256"` → `y="268"`, centre 292) to lengthen the revision
connector, but left Approve merge at `y="256"` (centre 280) and the connector between them at
`y="280"` (`:99`). In the render the two boxes in the same lane are visibly offset and the arrow
leaves Polish copy's right edge well above its centre. Every other lane pair in the file is flush.
*Fix:* `:137` → `y="268"`, its two texts to `y="290"` / `y="304"`, and `:99` → `y1="292" y2="292"`.
Re-check the Approve→Build riser start after the move.

**5. `examples/example-tree.html:85` — the polish connector drops to where the box used to be.**
F10 moved `polish` from `x="60"` to `x="40"` (centre 140 → 120), but the branch path is still
`M 220 256 L 220 296 L 140 296 L 140 336`. The riser meets the box top 20px right of centre — visible
in the render as an off-centre stem, and the only such stem in the tree.
*Fix:* `:85` → `d="M 220 256 L 220 296 L 120 296 L 120 336"`.

**6. `examples/example-quadrant-consultant.html:77` — the tint and the card it highlights are 60px apart.**
The new tint is 500–800 × 60–300, which matches the upper-right quadrant exactly, as F21 asked. The
focal card (`:89`) is 560–860. The card's right 60px now sits on plain paper and the tint's left 60px
covers nothing. The old 400-wide tint hid this by overlapping both; the correct fix exposed it.
The root cause is that the card grid (140–440 / 560–860) is 60px wider than the axis span on each
side, so no tint can match both.
*Fix, least disruptive:* shrink the focal card into the quadrant — `:89` → `x="524" width="264"` with
its four texts shifted from 576 to 540. *Alternative:* widen the horizontal axis to `x2="860"` on
`:113` and the tint to `width="360"`, accepting that the quadrant then spans the card, and do the
same on the left so the cross stays symmetric.

**7. `examples/example-line.html:48` — the axis now outruns its own gridlines.**
The six gridlines were shortened from `x2="960"` to `x2="920"` (W8), but the x-axis line was not:
`<line x1="80" y1="420" x2="960" y2="420">`. In the render the baseline extends 40px past the last
gridline, the last data point and the right edge of the area fill — a bare stub in open space. The
half-fix made the trailing plot area more conspicuous, not less.
*Fix:* `:48` → `x2="920"`.

**8. `examples/example-gantt.html:43` — the inter-zone gaps are now 16px and 8px.**
Zone 2's height went 120 → 132 (ends at 304) per F7's literal instruction, but zone 3 still starts at
`y="312"` (`:45`). Zone 1 ends at 156 and zone 2 starts at 172 — a 16px gap. The DESIGN/LAUNCH seam is
now half that and reads visibly tighter in the render.
*Fix:* `:45` → `y="320"` and shift zone 3's two rows, two bars and two row labels down by 8, giving a
uniform 16px gutter.

**9. `examples/example-org-chart.html:6` — the subtitle lost its conjunction.**
Deleting `and setup gaps` left *"it makes the front door, owners, invocation paths visible."*
*Fix:* `…the front door, owners, and invocation paths visible.`

### Promised but not delivered

**10. `examples/example-layers.html:105,112` — the two bottom fills were not stepped.**
F9 asked for hairlines *and* `#ececec` on L2 with `#e4e4e4` on L1. Only the hairlines were added.
L2 and L1 are still the same `#ececec`; in the render they are one grey field divided by a rule.
The finding's stated defect (five layers reading as four bands) is gone, so this is a partial
delivery rather than a failure — but the stack still has one fewer value step than the fix specified.
*Fix:* `:112` → `fill="#e4e4e4"`.

**11. `soft` still carries text in four places the doctrine pass missed.**
The pass repointed 46 elements but skipped these, and one of them is the exact defect F30 named:
- `examples/example-loop-terminal.html:95` — `h1::before { color: var(--soft); }`, `#5c5c5c` on
  `#141414` at 2.76:1, identical to the `template-terminal.html` case F30 fixed. → `var(--muted)`.
- `examples/example-process.html:13` — `.node-tool{fill:var(--soft)}`. Its twin
  `example-data-flow.html:29` was repointed to `var(--muted)`; this one was not, so the eight tool
  names are the faintest text on the page. → `var(--muted)`.
- `examples/example-dp-integration.html:11` — `.zone-label{fill:var(--soft)}` and
  `.role-text{fill:var(--side-stroke)}` where `--side-stroke:#7a8399`. Both carry text. → `var(--muted)`.
- `examples/example-data-flow.html:89` and `examples/example-process.html:10` — the `DB` chip is still
  `#5e7a9b`, which F23 itself measured at **4.44:1** against white, just under the 4.5:1 gate. F23's
  Fix named only TB and LS, so this is in the finding's body but not its instruction. → `#55708f`.

**12. `examples/example-nested.html:91,94,97` — the five level tabs are still ~40px over-wide.**
F25's body named these alongside it-state's three; only it-state's were trimmed. `/business` is
`width="96"` for a ~58px label, `/marketing` `width="108"` for ~64px, `/project` `width="88"` for
~51px. Each container's top border has a visible white break running well past its label.
*Fix:* `width="66"` on `:91`, `width="72"` on `:94`, `width="60"` on `:97`; the two outer tabs on
`:85`/`:88` need the same treatment measured against their own labels.

**13. `examples/example-org-chart.html:41` — the note bar still makes the claim the subtitle dropped.**
`Setup gaps stay visible:` is still asserted in the figure while no node carries the dashed gap
treatment. F15 offered two options and the fix took the "drop the claim" branch, but only from the
subtitle.
*Fix:* either finish the branch — reword the bar to `Known gaps:` so it reads as a caveat list rather
than a claim about the drawing — or take the other branch and mark the specialists the bar names.

**14. `examples/example-timeline.html:81` — the year tick is now hidden under the milestone dot.**
Moving the tick from x=680 to x=728 put it under the coral `r="6"` event dot at (728,240). The tick
spans y 232–248, so 8px of it is behind the dot and the 2px that emerge below read as a smudge, not
a tick. Cosmetic, and the label still carries the meaning.
*Fix:* `:81` → `y1="250" y2="258"`, clearing the dot, or drop the tick line and keep the label alone.

**15. `examples/example-venn.html:98,102` — F11 did not land; both sublabels are still cut.**
The Feasible arc at the sublabel baseline sits at x = 428 − √(140²−82²) = **314.5**.
`WE CAN BUILD IT` is ~100px wide; centred at the new `x="360"` it spans 310–410, so the arc still
crosses the `W`. Visible in the render at 2× crop. The Viable case is worse: `BUSINESS SUSTAINS` is
~113px, centred at the new `x="640"` it spans 583.5–696.5, and the right arc at 572 + 113.5 = **685.5**
cuts the final `S`. The 20px moves the review suggested were arithmetically insufficient in both
directions.
*Fix:* centre each pair on its lobe's mid-point at that baseline. Feasible's clear span is 314.5–458.5
→ `x="384"` on `:97`–`:98`; Viable's is 541.5–685.5 → `x="612"` on `:101`–`:102`. Either that, or take the
review's second option and put a paper mask behind each sublabel, as the rest of the corpus does.

**16. `templates/template-full.html:205,219,220,325,350` — F32's second half was not applied here.**
The file declares `--color-link` (`:23`) and then paints the `arrow-link` marker `fill="#2e5aa8"` at
`:205` and five more elements from the same literal. `--color-rule-solid` (`:20`) and
`--color-accent-tint` (`:22`) are still referenced nowhere. F32's Fix named "the light and dark
sentinel blocks", which were done; the paragraph naming template-full was not. The probe in the
header proves `fill="var(--color-link)"` works, so this is a mechanical carry-over.
*Fix:* `:205` → `fill="var(--color-link)"`, and `stroke`/`fill` on `:219`, `:220`, `:325`, `:350` →
`var(--color-link)`.

**17. `templates/template-full.html:332` — the legend now floats in open paper.**
Correct per F3 — it starts at y=682, below the boundary — but it kept `x="510"`, which used to be
hidden inside the AWS REGION box. In the taller canvas it reads as a block parked in the middle of
an empty band, with ~470px of blank paper to its left. Every example in the corpus left-aligns its
legend to the drawing's left edge under a full-width rule.
*Fix:* `x="510"` → `x="38"` on `:332` and on the ten swatch/line/text pairs below it (`:334`–`:360`,
subtracting 472 from each x), and add `<line x1="38" y1="668" x2="962" y2="668" stroke="rgba(45,49,66,0.12)"/>`
above it, matching `example-architecture.html:154`.

**18. `assets/color/diagram-palette.json:203-205` — F26 did not land at all.**
The entry F26 asked to delete is still there:
```
"untokenized": [
  "assets/examples/example-sequence-oauth-dark.html"
]
```
and `references/foundations/derivation-record.md:26` still reads *"Today exactly one:
`assets/examples/example-sequence-oauth-dark.html`."* The only palette change in either commit was
adding a dark `link` role, which serves F32, not F26. The dark skin therefore still has no file under
`derivation-gates`.
*Fix:* delete `:203`–`:205` from the JSON (and the trailing comma on `:202`'s block as the structure
requires), delete the final sentence of `derivation-record.md:26`, then re-run
`node scripts/check-diagram-corpus.cjs` and confirm the file gates as a dark-skin example rather than
failing on an unrecorded value.

---

## Confirmation summary

Of the 34 findings, **32 were confirmed visually** — I rendered the file fresh and looked at the
region the finding named, at a 2× crop where the verdict turned on a few pixels. That includes F32,
which is invisible in the shipped template (its `<svg>` is an empty placeholder) and which I proved
instead with a synthetic probe: a scratch copy of `template.html` with one `arrow-link` line,
rendered twice with two different `--color-link` values, giving a blue and then a red arrowhead.

**Two were confirmable only from the diff and the source.** F31 is a pair of code comments
(`deep warm charcoal` → `jet-black`, `warm off-white` → `white-smoke`) that no render can show;
the diff shows them corrected. F26 is a JSON entry and a sentence in `derivation-record.md`; the
source shows both untouched, so that finding is open.

**Nothing was left unconfirmed.** Every one of the 34 has a verdict backed by either a render or the
file's own text.

Two findings are not closed: **F11** (venn — both sublabels still cut by their own arc, #15) and
**F26** (untokenized entry never removed, #18). The remaining 32 closed the defect they named. Nine
of those 32 introduced something new (#1–#9), two of them — the mermaid connector and the state
machine's PURGE transition — at the same severity as the defect they replaced.
