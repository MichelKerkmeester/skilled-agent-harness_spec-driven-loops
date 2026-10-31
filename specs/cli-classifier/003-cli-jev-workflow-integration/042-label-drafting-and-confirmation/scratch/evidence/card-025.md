# Labeling card 025: reviewer-verdict-fallback

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/`.

## 1. Question

What verdict does the reviewer actually give in an output the verdict regex misses — `pass`, `fail`
or `block` — the truth the Jev/Deem `choice` column and the zero-call rules are compared against
(`spec.md:128` REQ-003; `spec.md:74`; `goal.md:50` D3).

## 2. Rubric

The phase defines the three values by what the operator reads in the output
(`spec.md:128`, `spec.md:74`):

- `pass` — the reviewer's output gives a pass verdict.
- `fail` — the reviewer's output gives a fail verdict.
- `block` — the reviewer's output gives a block verdict.

The label is the verdict the reviewer **decided**, not the verdict a fixture expected: the phase
puts "Treating the fixtures' `expectedVerdict` as the label" out of scope because "the fallback
reads what a reviewer decided, which the operator labels, and a reviewer can decide wrongly"
(`spec.md:96`; `goal.md:50`). So a labeler reads the prose, not the case's expected outcome.

**UNDEFINED — the operator must decide:** what prose pattern marks `block` versus `fail`. The spec
names the three verdicts and the loose baseline rule (the last whole word `pass`, `fail` or `block`,
case-insensitive, `spec.md:84`) but gives no rubric text for the reviewer's own conventions, so the
reading is the operator's.

Edge cases the spec names:

- Only **regex misses** enter the labeled population: `censusOutputs` keeps a row only when
  `extractVerdict(row.output).verdict === null` (`score-verdict-fallback.cjs:216-220`,
  `spec.md:126`). A row whose text carries a pattern verdict is a hit and leaves the set, so its
  `label` is ignored.
- `expectedVerdict` is kept for reference and **never scored** (`spec.md:128`;
  `score-verdict-fallback.cjs:203`).
- Any label outside `pass`/`fail`/`block` exits 2 naming the row
  (`score-verdict-fallback.cjs:199`; `spec.md:128`).
- A missing verdict class stops the arm: `stop: no labeled pass output`, `… fail …`, `… block …`
  (`:1333-1339`; `spec.md:128`).
- A live reviewer run keeps only a 16-character output hash, not its text
  (`reviewer-scorer.cjs:203`; `spec.md:192`), so miss texts must come from outside the tool.
- The outputs file's own SHA-256 becomes the verdict's `labels_sha256` (`:1284`).

## 3. Label values

Exact strings the scorer accepts (`score-verdict-fallback.cjs:199`): `pass`, `fail`, `block`.

## 4. Rows

- **Rows file:** the **operator-named** `--outputs <file>` (JSONL) — the file is both the outputs
  and the labels file (`spec.md:113`; `implementation-summary.md:176`). **It does not exist today**:
  0 recorded reviewer outputs miss the regex (8 fixture cases, 8 hits, `spec.md:71`;
  `implementation-summary.md:61-73`), and no `reviewer-report.json` exists anywhere.
- **id field:** `id`, a non-empty unique string (`score-verdict-fallback.cjs:191`, `:200`).
- **Draw command:** none, and no seed. No tool in this phase writes a miss row, and a live run keeps
  only a hash (`reviewer-scorer.cjs:203`), so the operator must author or supply the miss text with
  its full `output` (`spec.md:206`; `spec.md:94` puts an opt-in output save out of scope).
- **What a labeler reads per row:** the row's own `output` field — the reviewer's prose, in which
  the labeler finds the verdict it gives (`spec.md:128`). Nothing else is opened; `expectedVerdict`,
  when present, is for reference only (`score-verdict-fallback.cjs:203`).

## 5. Label file

- **Path:** the same operator-named `--outputs <file>` (the labels file is the outputs file,
  `spec.md:113`). It usually stays untracked (`spec.md:197`), so the operator chooses a path outside
  the repository.
- **JSON shape:** JSONL, one row per reviewer output:
  `{id, output, label, expectedVerdict?}` — `id` non-empty and unique, `output` the reviewer's text
  as a string, `label` one of the three verdicts, `expectedVerdict` optional and unscored
  (`score-verdict-fallback.cjs:191`, `:195`, `:199`, `:203`).
- **Label field:** `label`. **There is no labeler field** in this schema
  (`score-verdict-fallback.cjs:191-203`).
- **Confirmed row:**
  `{"id":"reviewer-miss-001","output":"…reviewer prose…","label":"fail"}`.
- **Confirmation:** two models draft each row separately; where the drafts agree the row is
  pre-filled for the operator to approve, and where they differ the operator picks. Only the
  operator-confirmed value may reach `label`, because the parent goal reads only rows the operator
  confirmed (`../goal.md:50` D4; drafting rule at `../goal.md:257`). The phase's own rule: the
  operator labels each miss with the verdict it gives and no model writes a label; `expectedVerdict`
  is never the label (`goal.md:50`; `spec.md:96-97`).

## 6. Gate

- **Needs:** 12 labeled regex-miss outputs (`LABEL_GATE = 12`, `score-verdict-fallback.cjs:44`), plus
  one per-verdict floor: at least one labeled `pass`, one `fail` and one `block`
  (`:1333-1339`).
- **Stop lines, in order:** `stop: fewer than 12 labeled regex-miss outputs` (`:1330`), then
  `stop: no labeled pass output` (`:1333`), `stop: no labeled fail output` (`:1336`),
  `stop: no labeled block output` (`:1339`), then `no headroom` above 0.90 (`:1342`). Exit 0, no arm
  runs.
- **Run:**
  `node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs --outputs <file> --deem --out <dir>`
  (or `--jev`; `implementation-summary.md:176`). A bare run replays the reviewer fixtures read-only
  (`score-verdict-fallback.cjs:1311-1312`).

**Blocked — unblock condition.** No recorded reviewer output misses the regex (8 fixture cases, 8
hits, `spec.md:71`), no `reviewer-report.json` exists anywhere, and a live reviewer run keeps only a
hash (`reviewer-scorer.cjs:203`). Unblocked by an operator-supplied regex-miss output text with its
full `output` text, at least 12 misses covering `pass`, `fail` and `block` (`spec.md:206`;
inventory 2, 025 item 5).
