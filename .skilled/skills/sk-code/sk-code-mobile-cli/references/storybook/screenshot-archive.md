---
title: The Screenshot Archive and How the Catalog Is Used
description: The tracked screenshot archive of every Pi Remote story — how a shot is taken, why some are transparent and some sit on the page tone, what its determinism is really worth, and how an agent and a designer each use the catalog for different jobs.
trigger_phrases:
  - "screenshot archive mobile cli"
  - "story shots capture screenshots"
  - "screenshot diff regression storybook"
  - "ui audit both themes findings"
  - "token playground retune designer"
  - "editable seams reference catalog"
  - "screenshot flake byte identical"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# The Screenshot Archive and How the Catalog Is Used

The catalog renders every surface; the archive remembers what each one looked like. Together they
answer two different questions — an agent asks "did this change break something a test cannot see?",
a designer asks "what happens if I change this?" — and the tooling for each is separate. This
reference covers both, and is honest about what neither can catch.

---

## 1. OVERVIEW

### Core Principle

A green suite proves a component mounts and behaves. It says nothing about whether text is legible,
whether two states look different, or whether a theme renders its own ink on its own background. The
archive is the evidence for those, and a change to a shot is a claim that needs a reason.

### When to Use

- Changing anything that renders: a component, a token, a shared rule
- A shot moved and you need to tell a real change from a flake
- Reviewing a surface without running the whole app
- Retuning the design system, or asking what is safe to change

### Key Sources

- `screenshots/` and `screenshots/MANIFEST.json`
- `scripts/capture-screenshots.mjs`, run via `npm run story:shots`
- `scripts/ui-audit.mjs`
- `app-mobile/.storybook/`

---

## 2. WHAT THE ARCHIVE IS

One shot per story, tracked in git, rebuilt whole rather than patched — a stale shot for a story that
no longer exists is worse than no shot, because it reads as current. `MANIFEST.json` records every
story, including the ones that render nothing a sighted person can see: those are listed with a note
and **no image**, rather than emitting a blank frame that would read as "this is how it looks".

A capture reports `captured`, `visually empty`, `unstable` and `failed`. Anything other than zero in
the last two is a result to explain, not a number to skim past.

---

## 3. HOW A SHOT IS TAKEN

Determinism is designed in, because an archive that changes on its own is worse than none — every
diff would need investigating and none would be trusted.

- **Fixed frame.** One phone viewport at scale factor 1, so output pixels are exact.
- **Pinned clock.** Components printing a time re-rendered a different second every run. The clock is
  frozen. It must sit AFTER the fixture timestamps: pinned before them, every relative label inverts
  into the future.
- **Frozen motion.** Animations, transitions and the text caret are pinned to their final frame.
  A spinner otherwise lands on a different frame each run.
- **Content crop.** The shot is cropped to what the story drew, not the device frame, so a small
  control is its own size rather than a speck on an empty field.
- **Stability retry.** Each frame is taken twice with a gap and only a reproducing frame is accepted.
  Back-to-back frames can agree on the same not-yet-painted state, which is why the confirm is spaced.

### Transparent, or on the page tone

A component that brings its own surface — a card, a sheet — is captured on **transparency**, so it can
be composited anywhere. A component that draws only text brings no ground, and a transparent shot of
it is legible only against a pale backdrop and vanishes on a dark one. Where no opaque element spans
the content, the app's own canvas is painted behind it and the manifest records `backdrop` for that
entry. Roughly half the archive is composited this way.

The ground is painted as a real element rather than by switching the screenshot's background option:
flipping that option per shot made image-bearing stories disagree with themselves between runs.

---

## 4. DETERMINISM AND ITS LIMITS

The working expectation is that two consecutive captures are byte-identical, manifest included.

**That expectation is not met, and the size of the gap has been measured.** Running the capture six
times and comparing every run against the first: **five of five comparisons differed**. The same
experiment against a capture script from before the most recent changes gave the same answer — five of
five — with the same story families varying. The flake lives in a handful of stories, not in any
recent change to the capture.

The varying stories are a sandboxed diagram frame (dominant, in nearly every comparison) and a
plan-mode button variant; a media player, an image-bearing tile and a runtime strip have each flaked in
other sessions. Every one is stable when run alone — the race only appears under concurrent capture.
The diagram case is sub-pixel text positioning inside an opaque sandboxed frame the parent cannot
await into, loading no webfont, so there is no readiness signal to wait on.

Three rules follow:

- **Never conclude determinism from one pair of runs.** That sample cannot distinguish a stable
  archive from a flaky one. It has produced a wrong call in both directions here: one pair once
  "proved" stability, and a three-run sample later "proved" a regression that six runs disproved.
  Run at least six per side before claiming anything about drift.
- **A moved shot is a flake only after it returns.** Re-capture; if the file matches the committed
  bytes again, it flaked. If it stays changed, it is a real change and needs a reason.
- **Expect a small diff on most captures.** Restore the flaked shot rather than committing churn, and
  never let it mask a real change sitting beside it in the same diff.

---

## 5. HOW AN AGENT USES IT

The archive is evidence, and `ui-audit.mjs` is the measurement.

- **Audit both themes, always.** The audit renders every story in light AND dark and measures
  contrast, clipping, control collision, text occlusion and touch targets. An entire defect class once
  existed only in dark, invisible to every other gate. The archive itself is captured in one theme, so
  the audit is the only thing that sees the other.
- **Pin the clock when measuring.** Several surfaces are time-gated and render empty on the wall
  clock. Measuring one of those without pinning shows an empty page and invites the conclusion that
  there is nothing to check.
- **Set the theme AFTER the story settles.** The app's own theme controller stamps `data-theme` on
  mount and silently reverts a value set too early — read the attribute back before trusting it.
- **Prove a fix by re-measuring, not by the diff.** A change that looks right in the source can render
  nothing: a class whose rule is scoped to another component reaches nothing, and the byte-identical
  screenshot is what exposes it.
- **Negative-control the check itself.** Break the source, watch the check go red, restore, watch it
  go green. An audit that has never failed is not evidence. This applies to the tools too: the audit's
  own colour parser and theme switch were each wrong once, and both read as clean while wrong.

### What the tooling cannot see

Geometry and colour checks pass over semantic defects. A CSS comment rendered as body text has perfect
contrast; two states that differ only in copy collide with nothing; a state published as a data
attribute that no rule consumes is invisible to every gate. **Read the pictures.** The most valuable
findings in this archive's history came from looking at them, not from a script.

---

## 6. HOW A DESIGNER USES IT

Three surfaces in the catalog, under **Design** and in the stories themselves.

- **Token playground.** Every custom property the stylesheets declare, grouped and editable. A change
  applies to every story, not just that page, and persists for the browser. **Copy CSS** returns only
  what changed, as a block to paste — the catalog writes no stylesheet, so the token gate stays the
  authority on what a token is.
- **The `flips` badge.** Marks a token whose light and dark values differ. Overriding one pins it flat
  across both themes. Worth reading before changing anything: pairing a surface that does not flip
  with an ink that does is what once made a whole theme render text in its own background colour.
- **State controls.** Page views expose plain args — roster and queue state, counts, streaming state,
  attachments, capability flags — mapped onto the real props by the story. Reach a screen's states
  from a control instead of editing an object literal.
- **Editable seams.** A page listing what the system invites a change to and what is frozen, read out
  of the components and the stylesheet at build time so it cannot drift from the code.

---

## 7. RULES

### ✅ ALWAYS

- Re-capture after any rendering change and commit the shots with the change.
- Explain every moved shot: intended change, or flake proven by a returning re-capture.
- Audit both themes; the archive alone only shows one.
- Read the actual images for the defects no gate can express.

### ❌ NEVER

- Claim byte-identical determinism from one pair of runs.
- Commit a wiped or partial archive — a failed capture clears the tree before it writes.
- Add production API to make a story render; use an allowlisted story host.
- Treat "the suite is green" as evidence that a surface renders correctly.

---

## 8. RELATED REFERENCES

- [`component-story-upkeep.md`](component-story-upkeep.md) — one story per renderable component, and the gates behind it.
- [`storybook.md`](storybook.md) — the entry point for this folder: both audiences, and the gates in the order they bite.
- [`../verification.md`](../verification/verification.md) — the verification command set for this surface.
- [`../verification/verification.md`](../verification/verification.md) — token resolution without a browser.
- [`../scoped-style-ownership.md`](../design-system/scoped-style-ownership.md) — why a class can render unstyled in the wrong component.
