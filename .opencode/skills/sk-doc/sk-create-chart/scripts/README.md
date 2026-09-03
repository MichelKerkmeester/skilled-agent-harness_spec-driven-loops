---
title: "sk-create-chart Scripts"
description: "How to run the corpus check, what each of its checks enforces and how to prove it can still fail before trusting a green run."
trigger_phrases:
  - "chart validator"
  - "chart corpus check"
  - "validate chart templates"
  - "check-corpus"
importance_tier: normal
contextType: reference
version: 1.2.0.0
---

# sk-create-chart Scripts

One script lives here. `check-corpus.cjs` is the corpus check, and it enforces every rule the template contract states.

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

---

## 4. WHAT IT CHECKS

Per template file, one check name each: `document-shape`, `identity`, `palette-block`, `colour-literals`, `no-external`, `script-parses`, `data-block`, `unique-ids`, `accessibility`, `card-parts`, `determinism`, `narrow-viewport`, `motion`, `radius`. The rule behind each one, and the failure it prevents, is the table in `../references/template-contract.md`.

Two checks are about the corpus rather than about one file:

- `palette-source` computes every contrast gate from `assets/color/palettes.json` rather than from a copy. A test that restates the values goes stale the first time somebody edits a colour, and then it certifies the old palette forever.
- `narrow-viewport` is asserted from the stylesheet rather than from a rendered page, and that limit is deliberate rather than lazy. A headless run returns the DOM, and the DOM does not say whether the page overflowed. The numbers that would answer it live in layout. So the check proves the figure region can scroll sideways and that its drawing declares a floor no wider than its own `viewBox`, which is the part an author forgets. Whether the chart is legible at that floor stays a review question, and the contract says so.
- `catalog` resolves the index in both directions: every catalog row reaches a file that identifies itself with the same id, and every chart form on disk appears in the catalog. A row that exists is not a row that points anywhere, and an index checked in one direction only rots on the first rename.

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
git checkout -- assets/templates/scatter.html
```

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
run it again. A corner computed from a mark's own geometry, such as the range bar in
`daily-range.html` rounded to half its width, is geometry rather than a shared value and passes
on purpose.

---

## 6. RULES FOR SCRIPTS HERE

- A rule the tooling does not check is a wish. Anything the contract states as binding is enforced here, and anything that cannot be enforced is named as advisory in the contract instead of written as if it bound.
- Never assert that a document contains a particular sentence. Prose has to stay editable, and a check that pins a phrase makes rewriting the docs break the build. Facts a check needs live in structured data: the palette file, the sentinel-marked catalog table, the identity tags.
- Never hardcode a file inventory. The corpus is discovered on disk and the index is read from the catalog, so a rename fails loudly with a message about the rename rather than quietly with a message about a missing chart.
- Never exempt anything without a comment naming what is exempt and why. One exemption exists, the ungated gridline role, and its reason sits next to the gates in the palette file.
- Scripts stay inside the packet and read only packet-local paths.
- No script pulls a chart library. The corpus opens with no install step, and a check that needs one contradicts the artifact it checks.
