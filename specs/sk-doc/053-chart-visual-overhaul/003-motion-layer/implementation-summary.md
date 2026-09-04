---
title: "Implementation Summary: Motion that settles, and a rule that can finally fail"
description: "Nine files gained a reveal or a growth behind the reduce-motion preference, the motion rule learned to read every route a file can move by, and the render path now compares two opens of each file as pictures rather than only as documents."
trigger_phrases:
  - "chart motion summary"
  - "chart reveal wipe summary"
  - "chart bar growth summary"
  - "chart phase 003 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/003-motion-layer"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped both motions and the settled-render gate"
    next_safe_action: "Start phase 004 on a corpus whose render path compares pictures, not only documents"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-bars.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-003-motion-layer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A stack grows about the axis, because a segment that scales about itself detaches from the one below it"
      - "A reveal is a clip-path inset, which needs no mask element and no change to the drawing code"
      - "backwards rather than both, so the settled file carries no trace of having moved"
      - "The two-render comparison has to see the picture, because a stylesheet animation never touches the DOM"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-motion-layer |
| **Status** | Complete |
| **Completed** | 2026-09-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nine of the twenty chart forms now move once when they open. Three time-series forms wipe
themselves in from the left over one second. Six bar forms grow their marks from the anchor each
mark is measured against, over half a second, with consecutive marks starting a twentieth of a
second apart. Every one of the nine turns itself off for a reader whose system asks for less
motion, and turns itself off by removing the animation rather than by making it quick.

The other eleven forms do not move and carry no fallback, which is the point of checking that the
grep returns nine files rather than checking that it returns at least nine.

The half of the phase with teeth is the rule. Rule 13 had never once fired on a real file, because
until now nothing in the corpus had ever animated. It read the stylesheet regions and nothing else,
so a motion driven from the drawing code matched none of its patterns and would have shipped with
no fallback while the check reported a pass. It now reads three routes, and each is checked against
the guard that route can actually honour. A stylesheet animation is switched off by a media query
in the same stylesheet. A motion driven from script has to ask through `matchMedia`, because no
media query reaches it. An animation element in the markup cannot be reached by a media query
either, so it needs the same guard in script. The rule also rejects two things it never used to
look for: a fallback that shortens the motion instead of removing it, and an animation that
repeats.

The render path gained a second check. `settled-render` opens every file twice after the settle
time and compares both halves of what came back. It is the rendered half of contract rule 12, and
it is the reason this phase can claim a settled state rather than assert one.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The settle time was chosen and written into the contract before any file animated, because rule 12
and rule 13 argue with each other until a number exists. One second bounds both motions and stays a
third of the render budget.

The number is only true if the stagger cannot grow without limit, and a delay of five hundredths of
a second per mark walks past one second the moment a reader pastes thirty rows into the data block.
So the delay is capped rather than accumulated: `min(var(--mark-index, 0) * 0.05s, 0.5s)`. Half a
second of stagger plus half a second of growth is one second, whatever the file happens to carry.

The stagger index comes from where a mark sits in the drawing, never from the data. Five files pass
the `forEach` index straight through. `grouped-bars` originally computed its index as
`i * d.values.length + s`, which reads a name defined between the `CHART_DATA` sentinels, and it was
rewritten to a running draw counter when that acceptance row was checked rather than after.

Nothing was copied from the vendored source. The durations, the stagger step and the two curves are
re-typed constants. The vendored implementation animates React components through a motion library,
and none of it would run in a file whose whole contract is that it depends on nothing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:key-decisions -->
## Key Decisions

**The bar growth route, decided against a render rather than by preference.** The phase asked for
both routes to be tried and the separator stroke on a stacked segment to be read.

| Route | What a paused mid-animation frame showed | Verdict |
|-------|------------------------------------------|---------|
| A transform scaled about the shared baseline | The stack shortens as one shape. Segments stay abutted, and the surface-coloured seams between them hold. The seam is scaled with the shape while the growth runs and settles at its declared width | Chosen. `scratch/route-test/p-transform-mid.png` |
| A clip-path wipe per segment | Every segment is clipped against its own box, so the segments detach and float apart with gaps between them. The column arrives in pieces, which is an order the data does not have | Rejected. `scratch/route-test/p-clip-mid.png` |

**The reveal is a `clip-path: inset()` animation, not the mask element the plan described.** A mask
needs a `<rect>` in `defs`, an id, and a reference from the plot group, and the plot group does not
exist because the drawing code appends straight to the `<svg>`. An inset clip on the figure needs
none of that and produces the same wipe. `scratch/route-test/p-line-mid.png` is the frame that
settled it.

**`backwards` rather than `both`.** With `backwards` the collapsed state applies before the first
frame and is gone once the animation ends, so the settled file carries no transform and no clip at
all. That is what makes every settled render byte-identical to the control captured before any file
animated, which is the strongest available form of the claim that the motion settles to the picture
the file would have painted without it.

**The two-render comparison reads the picture, not only the document.** The plan proposed comparing
two `--dump-dom` renders. That comparison runs and passes, and on its own it would have been close
to worthless here: a stylesheet animation never touches the DOM, so two dumps of a file still
visibly moving are identical. Both halves are compared now. The document catches a drawing still
building itself, and the picture catches motion that has not settled.

**A bare `setTimeout` is not treated as motion.** It is a one-shot delay far more often than it is
an animation loop, and a rule demanding a reduce-motion guard around a deferred measurement fires on
correct code. The residual is covered from the other side: a motion still running when the render
budget expires shows up as two renders that disagree. The code comment says so, so the next reader
finds a decision rather than an oversight.
<!-- /ANCHOR:key-decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-corpus.cjs --render`, baseline | `RESULT: PASSED`, errors 0, 29 files, `motion: 29 assertion(s)` on a corpus where nothing moved. `scratch/validator-before.txt` |
| `check-corpus.cjs --render`, final state | `RESULT: PASSED`, `Summary: errors: 0`, exit 0, with `motion: 116`, `render: 29` and `settled-render: 58`, all at 0 failures. `scratch/validator-after.txt`. Run five times from the final state |
| Two-render determinism | 58 assertions, 2 per file across 29 files, 0 failures. Each of the nine animating files also settles to a picture byte-identical to its pre-motion control. `scratch/determinism.txt` carries the hashes |
| The motion rule, watched failing | Three shapes, each red then green after a restore from a kept copy: a `requestAnimationFrame` sweep with no guard, a fallback declaring `animation-duration: 0.01s`, and `infinite` in a reveal shorthand. `scratch/motion-negative.txt` |
| The rendered rule, watched failing | Two more shapes: a thirty second reveal, which every structural rule is right to pass, and a motion driven from `performance.now()` behind a correct guard. Both go red on `settled-render` |
| Reduce-motion coverage | Nine files carry a fallback, all nine read `animation: none`, and none of the other eleven forms carries one |
| Human voice | `hvr_scan.py` reports `hard blockers: 0` on every document in this folder and on both reference documents the phase edited |

The negative controls were restored from kept copies in `scratch/keep/`. `git checkout --` reverts
to the last commit rather than to the working state, and with this phase uncommitted it would have
discarded the work it was meant to protect.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**Both determinism instruments compare two opens on one machine with one browser build.** They
prove the file is deterministic. They do not prove the picture is the same on a different browser,
and the contract does not claim it is.

**The screenshot comparison sees one frame of a fixed size.** The window is 900 by 6000, which fits
every card and table in the corpus today. A document taller than that would be compared down to the
fold, with the document dump covering the rest.

**One run reported `RESULT: FAILED` and could not be reproduced.** It came after two heavy `--render`
passes back to back inside one shell, and the filter capturing that run hid which check failed. Five
full runs from the same final state have passed since, including a deliberate replay of the exact
mutate-then-restore sequence. The most likely cause is a browser launch timing out under load, which
would be recorded against `render`, and that is an inference rather than an observation. It is worth
knowing about if the render path is ever seen to fail once and pass immediately after.

**A stale-artifact hole was found and closed while that was being chased.** `openOnce` wrote its
screenshot to a fixed path, so a browser that died without writing would have left the previous
file's picture there to be compared. The target is now deleted before each open.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:related -->
## Related Documents

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Closure Gate**: `acceptance-criteria.md`
- **Durable Directive**: `goal.md`
<!-- /ANCHOR:related -->
