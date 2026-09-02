---
title: "Foundation Record: The Colour System, the Template Contract and the Corpus Check"
description: "What the foundation layer of the chart corpus contains, the measured contrast margins behind every value, the runs that proved the check can fail and the scan that shows nothing traces back to the reference."
trigger_phrases:
  - "chart foundation record"
  - "chart contrast measurements"
  - "chart validator negative control"
  - "chart reference scan"
importance_tier: "important"
contextType: "implementation"
---

# Foundation Record: The Colour System, the Template Contract and the Corpus Check

This records the foundation layer alone. The chart forms are authored on top of it by later work
and are not covered here.

Everything below was built from `../../002-translation-and-voice/research/capability-analysis.md`.
The reference tree was not opened at any point during this work.

---

## 1. WHAT WAS BUILT

| Artifact | What it is |
|---|---|
| `assets/color/palettes.json` | The single source of truth for every colour value, the role vocabulary, the contrast gates and the named exemption |
| `assets/color/palette-sheet-neutral.html` | The worked skeleton every template copies, and the proof sheet for the neutral system |
| `assets/color/palette-sheet-ordered.html` | The proof sheet for the ordered system |
| `assets/color/palette-sheet-categorical.html` | The proof sheet for the categorical system |
| `references/color-system.md` | The three systems, the roles, the rules and what is enforced against what is advisory |
| `references/template-contract.md` | The delivery unit, the skeleton, the data contract and the thirteen enforced rules |
| `references/catalog.md` | The index, with its column contract and zero chart rows so far |
| `references/README.md` | The reference router, rewritten for the three documents above |
| `scripts/check-corpus.cjs` | The corpus check |
| `scripts/README.md` | How to run it, how to read a run and how to prove it can still fail |

Three palette sheets exist rather than one because a colour system with no file is a system
nothing has ever rendered. Each sheet declares one system, which is the one-system-per-delivery
rule applied to the sheets themselves.

---

## 2. THE PALETTE, AND HOW ITS VALUES WERE REACHED

Every hex was derived rather than chosen by eye. A base hue was picked, then each value was
produced by mixing that base toward the surface to lighten or toward the ink to darken, searching
for the value that lands on a target contrast ratio. That derivation is the rule the capability
analysis states, applied to reach the values instead of only to describe them.

**OBSERVED**, computed at the point of derivation and recomputed independently by the corpus
check. All ratios are against the surface role.

| Role or value | Hex | On surface | Gate | Margin |
|---|---|---|---|---|
| surface | `#FAF8F5` | 1.00 | ground | n/a |
| ink | `#1A1917` | 16.57 | 4.5 text | clears |
| muted | `#52504E` | 7.57 | 4.5 text | clears |
| rule | `#E0DFDC` | 1.26 | ungated by decision | n/a |
| neutral series | `#292825` `#4C4B48` `#6B6A67` `#8D8B89` | 13.91 8.23 5.10 3.20 | 3.0 mark | lowest clears by 0.20 |
| neutral emphasis | `#B4471F` | 5.13 | 3.0 mark, 1.5 against series 1 | 5.13 and 2.71 |
| ordered series | `#213B3D` `#275C63` `#2E7F89` `#69A2A9` `#A3C4C7` | 11.27 7.08 4.39 2.70 1.76 | dark end 3.0, light end 1.15, step 1.3 | 11.27, 1.76, lowest step 1.54 |
| ordered emphasis | `#B4471F` | 5.13 | 3.0 mark, 1.5 against series 1 | 5.13 and 2.20 |
| categorical series | `#28405C` `#874420` `#487B3B` `#A377B6` | 10.01 6.88 4.75 3.37 | 3.0 mark | lowest clears by 0.37 |
| categorical emphasis | `#1A1917` | 16.57 | 3.0 mark, 1.5 against series 1 | 16.57 and 1.65 |

### Two things the arithmetic decided rather than taste

**A pairwise contrast gate between data colours is unsatisfiable.** Separating luminances by a
factor of three, twice, runs out of room on this ground before a third value. Four categories
cannot all clear a pairwise 3 to 1 gate against each other. That is why touching shapes carry a
separator stroke in the surface colour instead, which is recorded as ADR-005.

**A neutral ladder holds four steps and no more.** With every step clearing 3 to 1 against the
surface and roughly 1.65 to 1 between neighbours, the fourth step lands at 3.20 and a fifth has
nowhere to go. The capacity numbers in the palette file are that arithmetic, not a preference.

### Why the categorical hues are spread in lightness

The four hues sit at 10.01, 6.88, 4.75 and 3.37 rather than at similar lightnesses. Nothing gates
that. It means the set keeps its ordering when printed in greyscale, which is the case the
"colour is never the only cue" rule is really protecting against.

---

## 3. THE CHECK, PROVEN ABLE TO FAIL

**OBSERVED.** Full transcript in the session scratchpad. Each break was applied to a passing
corpus, the check was run and the corpus was restored from a backup taken before any break.

| Break | Check that caught it | Result |
|---|---|---|
| Baseline, nothing broken | all | `RESULT: PASSED`, exit 0 |
| A colour literal put outside the palette block | `colour-literals` | `RESULT: FAILED`, exit 1 |
| One hex in a palette block changed away from the source | `palette-block` | `RESULT: FAILED`, exit 1 |
| A catalog row pointing at a file that does not exist | `catalog` | `RESULT: FAILED`, exit 1 |
| A template on disk with no catalog row | `catalog` | `RESULT: FAILED`, exit 1 |
| An `aria-labelledby` removed from the drawing | `accessibility` | `RESULT: FAILED`, exit 1 |
| A second element given an id that already existed | `unique-ids` | `RESULT: FAILED`, exit 1 |
| `Math.random()` reaching rendering code | `determinism` | `RESULT: FAILED`, exit 1 |
| A transition added with no reduced-motion fallback | `motion` | `RESULT: FAILED`, exit 1 |
| The drawing target broken so the chart renders empty | `render` | static run `RESULT: PASSED`, `--render` run `RESULT: FAILED` |
| Restored corpus, with `--render` | all | `RESULT: PASSED`, exit 0 |

The last two rows are the ones worth reading twice. A chart that opens as an empty box passes
every static check in the set. Only opening the file catches it, which is why the render mode
exists and why every run prints whether it was used.

The check found two real defects during its own construction, before any deliberate break. The
monotonic-lightness comparison was inverted and reported every correct ramp as reversed. The
catalog check recorded a failure without registering an assertion count, so a failing check
printed no line of its own. Both were fixed and both are covered by the runs above.

### Rendering, demonstrated rather than asserted

**OBSERVED.** A palette sheet was opened from a `file://` URL in headless Chrome with no install
and no build step. The browser resolved every custom property and the script drew ten swatches
and ten labels into the figure. The page's own contrast arithmetic, computed in the browser from
the resolved values, returned 11.27, 7.08, 4.39, 2.70, 1.76 and 5.13 for the ordered system,
which matches the values computed independently in Node to the second decimal. A screenshot was
taken and read back, and the sheet renders as designed.

That agreement is the independent derivation: two implementations of the contrast formula, one in
the check and one in the delivered file, reaching the same numbers from the same palette.

---

## 4. NOTHING HERE TRACES BACK TO THE REFERENCE

The reference tree was never opened. The scan below tests the output against the withholding
table in section 1 of the capability analysis, which is the only available check.

| What the analysis withheld | What is in the output | Evidence |
|---|---|---|
| Every hex value and every ramp ordering | 18 values, every one produced by the derivation described in section 2 | Set comparison: 18 declared in the palette file, 18 found across templates and documents, 0 not traceable to the source |
| The reference's coined chart names | No chart forms were authored at all | `assets/templates/` holds no files |
| Its per-chart table columns and card headlines | None. The catalog's column contract is `id`, `question`, `data shape`, `system`, `file`, chosen for the two-way resolution check | `references/catalog.md` |
| The markup, the class names and the stylesheet | Written here. Class names are `card`, `headline`, `subtitle`, `figure`, `source`, matching the four card parts the analysis describes by function | `assets/color/palette-sheet-neutral.html` |
| Easing names, timings and the reveal helper | No motion ships at all. The reduced-motion rule is enforced for any future template that animates | `motion` check |
| The twelve report layouts | None. Report mode is not built | `assets/reports/` is empty |

Other scans: no occurrence of the reference project's name anywhere in the package, and no
non-ASCII character in anything authored here except one ellipsis in a prose sentence.

**The one thing this cannot prove.** Independent creation is what was done, and non-collision is
what cannot be checked, because checking it would mean opening the clone. Two files named for the
same obvious English idea would be a coincidence rather than a copy. The one place a collision was
actively steered away from is the check's filename: the phase specification names the reference's
validator, so this one is `check-corpus.cjs`.

---

## 5. WHAT WAS DELIBERATELY LEFT OUT

| Left out | Why |
|---|---|
| Every chart form | Owned by later work against the template contract. Authoring one here would have set a precedent before the contract was reviewable |
| Report mode | The capability analysis recommends cutting it as a second product. That recommendation has not been ruled on, so nothing was built and nothing was deleted |
| A charting library path | ADR-004 removed the path, which also settles the open question about which library to use |
| A dark ground | No request exists. The palette file has one ground and the systems layer on it |
| A `--fix` mode on the check | The failure message already prints the exact block to paste |
| A generation step | ADR-003. Nothing needs one yet, and the palette block model survives adding one later |

---

## 6. UNKNOWNS

| # | UNKNOWN | The check that would settle it |
|---|---|---|
| F-01 | Whether report mode is cut. If it is, `assets/reports/` is dead and the packet's `SKILL.md` and `README.md` describe a capability that will not exist | An operator ruling. Nothing measurable decides it |
| F-02 | Whether four categorical slots is the right ceiling in practice, or whether real requests routinely arrive with five | Usage after the corpus ships. The arithmetic settles what is legible, not what is asked for |
| F-03 | Whether hand-drawn vector output stays practical across all fourteen first-pass forms | Authoring them. The first form that needs a layout engine is the answer, and ADR-004 says it leaves the corpus rather than bringing a library in |
| F-04 | Whether per-template duplication of drawing code becomes painful before the corpus is finished | The first change that has to be made in every file at once |
| F-05 | Whether the render check should run by default once a machine without a browser is known to exist | Running the corpus check somewhere that has no Chrome. Today it is opt-in so that a missing browser can never look like a silent skip |

---

## RELATED DOCUMENTS

- **Decisions**: See `../decision-record.md`
- **Capability analysis this was built from**: See `../../002-translation-and-voice/research/capability-analysis.md`
- **Specification**: See `../spec.md`
