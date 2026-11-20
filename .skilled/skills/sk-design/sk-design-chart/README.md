---
title: "sk-design-chart"
description: "Builds a standalone HTML chart by copying a form file that already renders and swapping its data, rather than writing chart code freehand."
trigger_phrases:
  - "create chart"
  - "chart packet"
  - "what does sk-design-chart do"
  - "plot the data"
  - "chart or diagram"
  - "chart colour system"
  - "theme chart from DESIGN.md"
  - "style reference chart"
importance_tier: normal
contextType: general
version: 0.23.5.0
---

# sk-design-chart

> Turn a question about data into one self-contained HTML file that answers it in a browser.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | A chart that plots values a reader compares |
| **Invoke with** | A chart request routed from the `sk-design` hub or a direct read of `SKILL.md` |
| **Works on** | A dataset and the comparison a reader needs from it |
| **Produces** | One self-contained HTML file, built from a copied form and one colour system |

### What It Does

You describe the comparison a reader needs, and the packet returns one HTML file that draws it. The catalog in `references/catalog.md` resolves the comparison to a single row, and the row names the form file under `assets/templates/`. You copy that file and swap its data block. Then you apply one colour system. There is no chart code to write and no build step to run.

The packet also themes a copy from a local v3 `DESIGN.md`. The adapter lives in `scripts/apply-design-md.cjs`, and it writes a delivery only after the derived colours clear the contrast gates.

### The Chart Corpus

Copying works because every form is authored here. Every form is drawn in one visual register, so a copy looks like the rest of the corpus before you change a value. Six question families hold twenty-nine forms.

| Family | The question behind it | Forms |
|---|---|---|
| comparison | Which of these is biggest, and how two periods compare | 6 forms, including `bar-columns` and `dumbbell` |
| composition | How does a whole divide up | 6 forms, including `unit-grid` and `treemap` |
| time | What happened across days, weeks or a year | 9 forms, including `daily-line` and `calendar-grid` |
| distribution | How are individual values spread | 4 forms, including `histogram` and `box-plot` |
| relationship | How two variables move together | 3 forms, including `scatter` and `parallel-axes` |
| matrix | Which combinations of two discrete dimensions are hot | 1 form, `heat-matrix` |

The counts total twenty-nine, the same as the number of files under `assets/templates/`. The corpus check reads the catalog in both directions, so a row with no file fails and a file with no row fails too.

---

## 2. QUICK START

**Step 1: Invoke it.** Send a chart request through the `sk-design` hub or read [`SKILL.md`](./SKILL.md) and follow its workflow. A request that names a form such as `treemap` or a data-qualified phrase such as `bar chart of` routes to this packet.

**Step 2: Resolve the comparison and copy the form.** Open `references/catalog.md` and land on one row. Copy the file that row names under `assets/templates/`, then replace its data block with the reader's numbers. A stock chart has no build command, because the copied file already renders.

**Step 3: Verify before you rely on it.**

```bash
node .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
```

The run prints one line per check family and ends with `Summary: errors: 0` and `RESULT: PASSED`. A run that never reaches that line has not passed, even when it prints no error.

---

## 3. HOW IT WORKS

The workflow is template-first, and that is a constraint rather than a preference. A chart written freehand breaks in a browser, where no check is looking. A form that already renders has answered its axis labels and palette capacity once.

```text
┌────────────────────────────────────────┐
│ Chart request                          │
└────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│ sk-design hub resolves a chart request │
└────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│ references/catalog.md picks one row    │
└────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│ Copy the form under assets/templates/  │
└────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│ Swap the data block                    │
└────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│ Apply one colour system                │
└────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│ One self-contained HTML file           │
└────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│ check-corpus.cjs                       │
└────────────────────────────────────────┘
```

Read the request and name the comparison. Resolve that comparison to one catalog row and copy the file the row names. Leave the render code alone, swap the data block, apply one colour system from `assets/style-reference/evilcharts/palettes.json` and keep the result a single file. Run the corpus check before you report it.

### Copy A Form, Never Draw One

Each form file carries sentinel-marked data blocks. Changing the data block rewrites the numbers the chart shows, and everything around it stays byte for byte the same. The axis ladder and the keyed legend are part of the form rather than settings you edit per request.

Every chart form here is authored in the packet, and the stock palette is derived from the evilcharts reference the packet carries. Content copied from an outside chart library would arrive under a licence this repository cannot pass on, so the no-external check also fails a remote `src`, `href`, `@import` or runtime fetch. A delivered file opens from a `file://` URL with no network.

### Theming A Copy

When a request names a local v3 `DESIGN.md` or another Style Reference, run `scripts/apply-design-md.cjs` with that path. The script reads the documented v3 tables and derives both grounds. It writes the copies only after every gate passes. A pass prints one `MAPPING` line per role for both grounds and ends with `RESULT: PASSED`. A failure ends with `RESULT: FAILED` and writes nothing.

A request that names no reference runs the same script with `--default`, which themes from the evilcharts reference carried at `assets/style-reference/evilcharts/`. A URL is refused. An ordered form is refused by name, and `--all` skips it with a note, because a colour table cannot supply the single-hue ramp that form needs. Extraction of a site belongs to `sk-design-md-generator`. This packet applies the reference it receives.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Use this packet when the artifact plots values a reader compares or tracks. A flow, an architecture, a sequence or a state machine belongs to `sk-design-diagram`, because a reader of that artifact traces a path rather than comparing quantities.

| The artifact carries | Packet |
|---|---|
| Values a reader compares or tracks over time | `sk-design-chart` |
| A structure a reader follows, as a flow, an architecture, a sequence or a state machine | `sk-design-diagram` |

The split is tested because `sk-design-diagram` names bar, line, scatter and radar in its own selection guide. A bare type name with a diagram request reaches both packets, and the router asks which one you mean. This packet answers form names the diagram packet has no file for, such as `treemap`, `waterfall chart`, `heatmap`, `box plot` and `histogram`. It also answers data-qualified phrases such as `bar chart of`.

Radar is the one name where the two splits disagree. By name it routes to `sk-design-diagram`. By artifact it is values a reader compares, and `references/catalog.md` names `parallel-axes` instead, with one scale per axis.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design` | The hub that routes a chart request here |
| `sk-design-diagram` | Owns structural visuals on the other side of the boundary |
| `sk-design-md-generator` | Extracts a v3 Style Reference from a site. This packet applies a reference that already exists |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| The corpus check names a form you did not touch | A catalog row or a palette value moved under it | Read the check name. A catalog row and a form file have to name each other in both directions |
| A `--render` run fails on a different file each time | Chrome refused to start under sustained back-to-back headless launches | Pause, then rerun. Never edit the chart |
| The same file fails `--render` every run and reproduces by hand | The chart draws nothing | Fix the chart. This is the failure the render mode exists to catch |
| A themed delivery fails `--extra` | Its provenance comment is malformed or a value failed a gate | Rerun `scripts/apply-design-md.cjs` and read the role, ratio, gate and nearest clearing colour it names |

---

## 6. FAQ

### Why copy a form instead of writing chart code?

A freehand chart has to solve axis labels and palette capacity on the way to its first render. A form file has already met those cases and passed the corpus check. Copying it keeps the solved geometry and leaves one thing to change, which is the data.

### Can a chart wear a brand's colours?

Yes, when the brand publishes a local v3 `DESIGN.md`. Run `scripts/apply-design-md.cjs` with that path and the script maps the reference's measured values into the chart roles. The data keeps the encoding its form declares. A site still has to be measured first, and extraction belongs to `sk-design-md-generator`.

### Does a green corpus check mean the chart is correct?

No. The check reads the file and the palette. It never reads the picture and never reads the words, so a chart that opens as an empty box can pass the structural run, and a headline can contradict the numbers beneath it. Open the delivered file and read it before you report the result.

### How can I add a form to the corpus?

Add the file under `assets/templates/`, add its row to `references/catalog.md`, add its pointer row to `references/template-contract.md` and run `scripts/check-corpus.cjs`. The check fails a catalog that does not resolve in both directions and a form with no pointer row.

---

## 7. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Corpus | `node .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | `Summary: errors: 0` and `RESULT: PASSED` |
| Render pass | `node .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --render` | `RESULT: PASSED`, with `render`, `dark-render` and `settled-render` listed. Needs Chrome or Chromium on the usual path or in `CHROME_PATH` |
| Themed delivery | `node .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --extra <dir>` | `RESULT: PASSED` over the delivery directory |
| Screenshots | `cd .skilled/skills/sk-design/sk-design-chart && node ../shared/scripts/render-screenshots.cjs ./assets ./screenshots --check` | `sources 30, missing 0` and `RESULT: PASSED` |
| Package shape | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/sk-design/sk-design-chart --check --strict` | `Result: PASS` |
| Hub shape | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-design` | `PASS:` on every invariant, then `OK: parent-skill-check` and 0 warnings |
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-design/sk-design-chart/README.md --type readme` | `VALID` and `Total issues: 0` |
| Operator read | [The manual testing playbook](./manual-testing-playbook/manual-testing-playbook.md) | Each scenario records a `PASS` or a named `SKIP`, and `git status --porcelain` on the packet path is empty |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | The runtime contract: when to use the packet, the workflow and the rules |
| [`ROUTER.md`](./ROUTER.md) | The machine router: intent model, resource map and the no-match fallback |
| [`references/README.md`](./references/README.md) | The reference index for the catalog, the colour systems and the template contract |
| [`references/catalog.md`](./references/catalog.md) | The index from a comparison to one form and the file that draws it |
| [`references/color-system.md`](./references/color-system.md) | The three stock systems, the role vocabulary and the contrast gates |
| [`references/template-contract.md`](./references/template-contract.md) | What a form file has to contain before the corpus check passes it |
| [`scripts/README.md`](./scripts/README.md) | What the corpus check enforces and how to prove a check can fail |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The operator scenarios that a green corpus check cannot replace |
| [`../SKILL.md`](../SKILL.md) | The `sk-design` hub that routes here |
| [`../sk-design-diagram/README.md`](../sk-design-diagram/README.md) | The structural-visual packet across the boundary |
