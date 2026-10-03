---
title: "HVR Reader-Needed Lens"
description: "Measures offline whether a Jev `noul` flags three reader-needed Human Voice Rules tells better than the scanner's floor, which flags none of them."
trigger_phrases:
  - "hvr reader-needed lens"
  - "hvr_reader_lens.py"
  - "reader-needed tells"
  - "reader-needed lens measurement"
version: 2.2.0.0
---

# HVR Reader-Needed Lens (hvr_reader_lens.py)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Measures offline whether a Jev `noul` flags three reader-needed Human Voice Rules tells better than the scanner's floor, which flags none of them.

`hvr_reader_lens.py` gives the reader-needed tells of `sk-create-with-human-voice` their first measurement: synonym cycling, significance inflation and false ranges. It sits beside `hvr_scan.py`, which settles what a machine can settle and leaves these tells to a reader. The lens changes no rule, no scanner and no scored doc. The default run makes no model call, writes no file and holds no credential.

---

## 2. HOW IT WORKS

The census walks the tracked `*.md` files under `.skilled/skills/`, drops `changelog`, `fixtures` and `node_modules` paths and refuses a `.env` basename wherever it sits. Each kept file is read at the recorded commit and split at its ATX headings into sections, and the unchanged `hvr_scan.py --json` runs over a temporary copy of that committed text outside the repository, so uncommitted edits never change the census. A section joins the draw only when a scanner finding falls inside it and it holds 5 to 80 lines. The default run prints one `census: commit=<40hex> files=<n> sections=<n> flagged=<n> in_band_5_80=<n> refused=<n>` line, one `census: category=<c> candidates=<n>` line per category, one `question <c> sha256=<64hex>: <text>` line per category, then `margin: 0.10` and the `keep rule:` line that names every threshold.

`--draw --seed <n>` writes the labels file `hvr-reader-lens-labels.jsonl`, 150 rows, 50 per category, each with its doc, its section lines, the commit, the section hash and an empty label the operator fills with `yes` or `no`. No model writes a label. A seed that is not a non-negative integer exits 2 with `--draw needs --seed <non-negative integer>`, and a labels file that holds a label exits 2 with `draw refused: <path> holds a label`. The significance and false-range comparators pick their candidates from the standard's listed phrases and its `from X to Y` constructions, while synonym cycling has no lexical comparator and draws its rows at random. With fewer than 150 labeled rows the run prints `labels: labeled=<n> of 150` and `stop: fewer than 150 labeled rows`. With all 150 it prints one `baseline (<c>):` line per category, where the comparator is chosen only when it beats flag-nothing, then one `headroom (<c>): baseline wrong on <n> of <K>` line per category, or `no headroom (<c>)` or `underpowered (<c>)`, and fewer than two categories that can pass prints `stop: fewer than 2 categories can pass`.

`--jev` measures the backend and needs `--out <dir>`, refused with `--jev needs --out <dir> so every call is recorded` before any call. Its gate runs before its arm. A gate that fails prints its skip line, such as `jev arm skipped: no credential`, and the run still exits 0, while a bad invocation exits 2 before any call. Each call asks one of the three fixed questions, every call is recorded in `<out>/calls.jsonl`, and `<out>/report.json` holds the counts when a column runs or stops. The Jev arm asks `jev` for three uncached `noul` calls per row, scored against the operator's labels under the keep rule the preamble line names.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` | Script | Runs the census, draws the labels file and measures the Jev arm |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` | Script | The unchanged scanner whose findings mark the sections the lens draws |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` | Unit | The frame, census, draw, gate and arm checks on a fixture repository with a stub backend |

---

## 4. SOURCE METADATA

- Group: Document Validation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `document-validation/hvr-reader-needed-lens.md`

Related references:
- [goal-criteria-lint.md](goal-criteria-lint.md) - flags goal completion criteria a reader cannot check from the line alone
- [citation-drift-scan.md](citation-drift-scan.md) - reports the dead file-and-line citations in the tracked skill docs
