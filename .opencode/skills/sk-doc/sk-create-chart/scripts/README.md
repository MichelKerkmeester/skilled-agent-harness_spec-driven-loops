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
version: 1.0.0.0
---

# sk-create-chart Scripts

One script lives here. `check-corpus.cjs` is the corpus check, and it enforces every rule the template contract states.

```bash
# structural checks over the whole corpus
node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs

# the same, plus opening every template in a headless browser
node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render
```

It needs Node and nothing else. `--render` needs a Chrome or Chromium binary, found on the usual paths or named by `CHROME_PATH`.

---

## READING A RUN

**Require the `RESULT: PASSED` line.** A run that dies before its first check exits without printing a failure, and a summary that only looks for `RESULT: FAILED` reads that silence as a pass.

Every check prints its assertion count. A check with zero assertions ran on nothing, which is not the same as a check that passed, and the corpus file count at the top of the run is there so an empty corpus cannot look like a verified one.

Render is off by default and the summary says which mode it ran in. Without `--render` nothing has been opened, so a structural pass is not a rendering pass.

---

## WHAT IT CHECKS

Per template file, one check name each: `document-shape`, `identity`, `palette-block`, `colour-literals`, `no-external`, `script-parses`, `data-block`, `unique-ids`, `accessibility`, `card-parts`, `determinism`, `motion`. The rule behind each one, and the failure it prevents, is the table in `../references/template-contract.md`.

Two checks are about the corpus rather than about one file:

- `palette-source` computes every contrast gate from `assets/color/palettes.json` rather than from a copy. A test that restates the values goes stale the first time somebody edits a colour, and then it certifies the old palette forever.
- `catalog` resolves the index in both directions: every catalog row reaches a file that identifies itself with the same id, and every chart form on disk appears in the catalog. A row that exists is not a row that points anywhere, and an index checked in one direction only rots on the first rename.

---

## PROVING IT CAN FAIL

A validator that has only ever passed is not evidence. Before trusting a green run, break something and watch it go red.

```bash
# a colour literal outside the palette block
sed -i '' 's/var(--chart-muted)/#888888/' assets/color/palette-sheet-neutral.html
node scripts/check-corpus.cjs   # expect RESULT: FAILED on colour-literals
git checkout -- assets/color/palette-sheet-neutral.html
node scripts/check-corpus.cjs   # expect RESULT: PASSED
```

Any of these breaks a different check: change one hex in the palette block, delete an `aria-labelledby`, add a second element with an existing id, add a catalog row pointing at a file that does not exist, drop the `CHART_DATA:END` sentinel.

---

## RULES FOR SCRIPTS HERE

- A rule the tooling does not check is a wish. Anything the contract states as binding is enforced here, and anything that cannot be enforced is named as advisory in the contract instead of written as if it bound.
- Never assert that a document contains a particular sentence. Prose has to stay editable, and a check that pins a phrase makes rewriting the docs break the build. Facts a check needs live in structured data: the palette file, the sentinel-marked catalog table, the identity tags.
- Never hardcode a file inventory. The corpus is discovered on disk and the index is read from the catalog, so a rename fails loudly with a message about the rename rather than quietly with a message about a missing chart.
- Never exempt anything without a comment naming what is exempt and why. One exemption exists, the ungated gridline role, and its reason sits next to the gates in the palette file.
- Scripts stay inside the packet and read only packet-local paths.
- No script pulls a chart library. The corpus opens with no install step, and a check that needs one contradicts the artifact it checks.
