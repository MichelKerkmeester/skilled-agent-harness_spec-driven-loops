# Labeling card 033: validator-residue-flagger

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger/`.

## 1. Question

Does each drawn document passage show a defect in its own category (correctness or traceability) —
`defect` — or is it clean — `clean`
(`spec.md:138` REQ-004; `goal.md:53` D2; `spec.md:90`).

## 2. Rubric

The phase fixes two operator labels per row, for the row's own category
(`spec.md:138` REQ-004; `goal.md:53` D2):

- `defect` — the passage shows the defect its category names; the finding's claim is confirmed.
- `clean` — the passage does not; "a finding is a reviewer's claim until confirmed"
  (`spec.md:138` REQ-004).

The two categories and their operational questions are fixed in the phase and printed with their
SHA-256 before any call (`spec.md:150` REQ-011, drawn from `deep-review/SKILL.md:310`, `:312`):

| Category | Question the passage is judged against |
|----------|----------------------------------------|
| `correctness` | "Does this passage claim behavior that its own text shows to be wrong or inconsistent?" |
| `traceability` | "Does this passage name a spec item or requirement that the text it describes does not match or does not contain?" |

**UNDEFINED — the operator must decide:** how much of a passage must show the defect for `defect`.
The spec gives the category questions and the label names but no severity threshold; the operator's
reading of the quoted question is the rubric.

Edge cases the spec names:

- Only `defect` or `clean` counts toward the gate; every drawn row starts `label: null`,
  `labeler: null` (`score-residue-flagger.cjs:587-597`, `:498-499`).
- A window is 10 lines each side of the cited line (`WINDOW_RADIUS = 10`,
  `score-residue-flagger.cjs:37`).
- Positives are finding-cited passages (25 per category); negatives come from the same documents at
  the same commits, never within 20 lines of any cited line (25 per category)
  (`spec.md:138` REQ-004; `goal.md:53` D2).
- Every row is read at the first parent of the commit that added its review file
  (`goal.md:53` D2).
- `--draw` refuses to overwrite a file that holds a label (`spec.md:138` REQ-004).
- Until 100 rows carry a label every run prints `stop: fewer than 100 labeled rows`
  (`spec.md:138` REQ-004).
- Under 5 rows labeled `defect` the run prints `underpowered` (`goal.md:55` D4).
- **Today's blocker:** `--draw` needs 25 resolvable rows per category and exits 2 with
  `draw needs 25 resolvable rows in correctness, found 0`, so no labels file exists
  (`goal.md:92`; `implementation-summary.md:104`; the shortfall check at
  `score-residue-flagger.cjs:426-431`).

## 3. Label values

Exact strings the gate and scorer count (`score-residue-flagger.cjs:596`): `defect`, `clean`.
`null` (the drawn state) counts as unlabeled and holds every run.

## 4. Rows

- **Rows file:** `residue-flagger-labels.jsonl`, by default beside the script
  (`.skilled/skills/system-deep-loop/deep-review/scripts/residue-flagger-labels.jsonl`,
  `score-residue-flagger.cjs:29`), overridable with `--labels <file>`. **No sheet exists today**
  (`goal.md:92`, `:113`; `implementation-summary.md:104`).
- **id field:** `id`, `r001` … in draw order (`score-residue-flagger.cjs:487-500`).
- **Draw command (recorded seed `20260929`):**
  `node .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs --draw --seed 20260929`
  (`goal.md:92`; `implementation-summary.md:104`). It writes 100 rows — 50 positives (25 per
  category) and 50 negatives (25 per category) — and refuses to overwrite a file that holds a label.
  Today it cannot run; a corpus with at least 25 resolvable correctness rows must come first
  (`goal.md:97`).
- **What a labeler reads per row:** the 21-line window of the document the row names — open
  `doc`:`line` and read `window_start`..`window_end` at `commit`
  (`score-residue-flagger.cjs:37-38`, `:483-500`, `:438-455`) — and, for a positive, the finding
  that cited it. The content is committed repository documents that review findings cite, not private
  transcripts.

## 5. Label file

- **Path:** `--labels <file>`, default
  `.skilled/skills/system-deep-loop/deep-review/scripts/residue-flagger-labels.jsonl`
  (`score-residue-flagger.cjs:29`).
- **JSON shape:** JSON Lines, one object per row:
  `{id, source, category, doc, line, window_start, window_end, commit, window_sha12, kind, label, labeler}`
  (`addRow` at `score-residue-flagger.cjs:487-500`; `spec.md:138` REQ-004).
- **Label field:** `label` (`defect`/`clean`). **The labeler field is `labeler`**: `null` at draw
  time (`:498-499`); the operator's confirmation can name itself there.
- **Confirmed row:**
  `{"id":"r001","source":"…","category":"correctness","doc":"specs/…/review/iteration-001.md","line":42,"window_start":32,"window_end":52,"commit":"<40-hex>","window_sha12":"<12 hex>","kind":"positive","label":"defect","labeler":"operator"}`.
- **Confirmation:** two models draft each row separately; where the drafts agree the row is
  pre-filled for the operator to approve, and where they differ the operator picks. Only the
  operator-confirmed value may reach `label`, because the parent goal reads only rows the operator
  confirmed (`../goal.md:50` D4; drafting rule at `../goal.md:257`). The phase's own rule: the
  operator labels all 100 and no model writes a label (`goal.md:53`; `spec.md:138` REQ-004).

## 6. Gate

- **Needs:** exactly 100 labeled rows, made of 50 positives (25 correctness + 25 traceability) and
  50 negatives (25 per category)
  (`LABEL_GATE = 100`, `score-residue-flagger.cjs:32`; `ROWS_TOTAL = 100`, `POSITIVES = 50`,
  `NEGATIVES = 50`, `PER_CATEGORY = 25`, `:33-36`). No per-class label minimum; the completeness
  check is `labeled === 100` (`:595-598`).
- **Stop line below the gate:** `stop: fewer than 100 labeled rows`
  (`score-residue-flagger.cjs:1526-1527`), exit 0; `underpowered` under 5 `defect` rows and
  `no headroom` above 0.90 (`goal.md:55` D4).
- **Run:**
  `node .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs [--labels <file>] [--jev|--deem --out <dir>]`
  — each switch needs `--out` before any call (`score-residue-flagger.cjs:1509-1511`).

**Blocked — unblock condition.** Today's corpus holds `resolvable: correctness=0 traceability=7`
against the 25 resolvable rows per category a draw needs, so `--draw --seed 20260929` exits 2 with
`draw needs 25 resolvable rows in correctness, found 0` and no labels file exists (`goal.md:92`,
`goal.md:97`; inventory 4, 033 item 4). Unblocked by a corpus with at least 25 resolvable correctness
rows and 25 traceability rows, then the draw, then the operator's 100 labels.
