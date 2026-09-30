---
title: "Residue Flagger Measurement"
description: "Measures offline whether a Jev or Deem answer flags operator-labeled defect rows from the committed review corpus better than flag-nothing."
trigger_phrases:
  - "residue flagger measurement"
  - "score-residue-flagger"
  - "finding table census"
  - "residue flagger label gate"
version: 1.11.0.0
---

# Residue Flagger Measurement (score-residue-flagger.cjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Measures offline whether a Jev or Deem answer flags operator-labeled defect rows from the committed review corpus better than flag-nothing.

`scripts/score-residue-flagger.cjs` settles one question about the residue a review leaves behind: can a model flag the defect a finding row cites from the text around its cited location, when never flagging already counts right on every clean row. The rows are drawn from committed review documents and carry the operator's label, so no model writes a label and no backend is called before 100 labels exist. The result serves no runtime, and the measurement adds no review dimension.

---

## 2. HOW IT WORKS

With no switch the script is a census only: it spawns no backend call and writes no file. It walks the markdown in HEAD's tree under `specs/` that sits in a `review/` or `ai-council/` folder, never a `context/` or `scratch/` folder, and reads every file through git so a dirty worktree cannot substitute for the tree under measurement. A review file that is staged but not committed is not in HEAD's tree, so the census leaves it out. It parses the finding tables whose header names a severity, a dimension and a location, then prints the census line, the severity and dimension tallies, one `header` line per recognized shape, one `census skipped: <file>:<line>` per finding table it cannot read, and the `resolvable:` tally of rows whose cited location resolves beside the refused and dropped counts. A table without a recognized header counts as skipped only when one of its data rows holds a cell that is exactly `P0`, `P1` or `P2`. A cited path whose basename starts `.env`, or that sits outside HEAD's file list, is refused before any file opens, and a row whose location does not resolve at the commit the review read is dropped and counted.

Every run except `--draw` also prints `margin: 0.10`, the `keep rule:` line that fixes the verdict's checks on coverage, precision, margin, the sign test and flips for `--jev`, and the two judge questions with their SHA-256 digests: `Does this passage claim behavior that its own text shows to be wrong or inconsistent?` for correctness and `Does this passage name a spec item or requirement that the text it describes does not match or does not contain?` for traceability. Until exactly 100 rows in the labels file carry an operator label of `defect` or `clean`, the run prints `stop: fewer than 100 labeled rows` and no arm runs. `--draw --seed <n>` writes that labels file, `scripts/residue-flagger-labels.jsonl` by default and any path under `--labels <file>`: 100 rows of ids, coordinates and window hashes with no text field, 50 sampled from resolvable citations and 50 lines at least 20 lines from every cited line in the same documents. One seed reproduces one file byte for byte, the draw exits 2 without writing when the file already holds a label, and a category with fewer than 25 resolvable rows exits 2 naming the shortfall. A draw prints only its one `draw:` line.

The usage line is `usage: score-residue-flagger.cjs [--labels <file>] [--draw --seed <n> | --jev | --deem] [--out <dir>]`. `--jev` and `--deem` each need `--out <dir>` or the run exits 2 before any call, and each arm runs behind its own gate, Jev first and Deem second. A gate that fails prints one skip line such as `jev arm skipped: no credential` or `deem arm skipped: stub backend` and leaves the rest of the report byte-identical. An arm starts only when the label gate is complete and the headroom line printed, then records every call in `<out>/calls.jsonl`, while `<out>/report.json` records the run when a column ran or an arm stopped. Its column ends in one `verdict <backend>:` line carrying the outcome the keep rule decides.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/score-residue-flagger.cjs` | Script | The census, the draw, the label gate, both backend gates and arms, and the keep-rule verdict |
| `scripts/residue-flagger-labels.jsonl` | Data | The drawn rows and the operator labels the label gate counts |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/score-residue-flagger.test.cjs` | Node test | Fixture repositories and stub `jev` and `cli-deem` binaries covering the census, the draw, the label gate and both arms |
| `manual-testing-playbook/entry-points-and-modes/residue-flagger-measurement.md` | Manual playbook | The zero-call run and a stub-backend skip |

---

## 4. SOURCE METADATA

- Group: Review dimensions
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `review-dimensions/residue-flagger-measurement.md`
- Primary sources: `scripts/score-residue-flagger.cjs`, `scripts/residue-flagger-labels.jsonl`
Related references:
- [correctness.md](correctness.md) - Correctness
- [traceability.md](traceability.md) - Traceability
