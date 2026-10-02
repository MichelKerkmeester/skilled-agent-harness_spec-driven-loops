# Label card: 034-hvr-reader-needed-lens

One card for the operator who fills the label gate. Phase folder:
`specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens/`, called `P` below.
Scorer: `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py`, cited as
`S:NN`. Inventory: `label-inventory-4.md` in this evidence folder. Phase 42 spec:
`specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/`, cited as
`P42/`. Facts were read on 2026-10-01 at HEAD `ebcc68e8edb42bc736cf52ecb89c1997f5c84e82`.

## 1. Question

One drawn row decides whether a section of a tracked skill doc shows one reader-needed tell for
the row's own category, synonym cycling, significance inflation or false ranges, and 150 rows
labeled `yes` or `no`, 50 per category, are the gate that opens the Jev or Deem arm, which
measures whether a model flags those tells better than the scanner's floor and the standard's
lexical rules (`P/spec.md:80`, `P/spec.md:91-93`, `P/spec.md:142`, D2 at `P/goal.md:53`).

## 2. Rubric

What is labeled. One row is one heading section of 5 to 80 lines (`S:192-193`), split out of a
tracked `.md` file under `.skilled/skills/` outside `/changelog/`, `/fixtures/` and
`node_modules` (`S:152-181`, `P/spec.md:90`), read from the row's recorded commit and hash-checked
before scoring (`S:773-807`). Every row carries exactly one of the three categories (`S:285`).

The row's own category fixes the question, and that question is the row's `yes` test. The same
three questions are the model's instructions, fixed before any call and printed with their
SHA-256 (`S:1690-1702`, `S:1716-1729`, REQ-011 at `P/spec.md:154`):

| Category | The question that defines `yes` for that row | Standard it comes from |
|---|---|---|
| `synonym-cycling` (`S:1691-1693`) | "Does this passage refer to the same thing by three or more different words?" | `hvr-rules.md:275-277` |
| `significance-inflation` (`S:1694-1697`) | "Does this passage declare that something is important or historic instead of stating what happened?" | `hvr-rules.md:317-329` |
| `false-ranges` (`S:1698-1701`) | "Does this passage use a from X to Y construction whose endpoints are not on a meaningful scale?" | `hvr-rules.md:279-288` |

So `yes` = the section does show the tell its own category names, by the reader's answer to that
row's question. `no` = it does not. Those three questions are the whole definition the phase
gives.

Edge cases the spec names:

- Only two values exist. The spec names no third value, no severity and no confidence
  (REQ-004 at `P/spec.md:142`).
- A genuine measurable range, such as "from 1 to 10" or "temperatures range from -10C to 40C",
  still matches the false-range comparator. That is the reading the model has to beat, and a
  genuine range labeled `no` counts against the comparator, not for it (`P/spec.md:206`).
- `significance-inflation` and `false-ranges` draw part of their 50 rows from sections their
  lexical comparator flags, so their `yes` share in the sample is not the live prevalence. The
  report prints each category's `yes` share and its candidate count (`S:937-963`, `P/spec.md:76`,
  `P/spec.md:205`). The 2026-09-29 draw drew 0 synonym-cycling, 2 significance-inflation and 25
  false-range candidate rows (`P/implementation-summary.md:174`).
- If fewer than two categories keep enough room for a verdict, the run prints
  `stop: fewer than 2 categories can pass` and neither arm calls; the phase records that as a
  result, not a failure (`P/spec.md:163`, `P/implementation-summary.md:174`). Per category the
  run prints `no headroom (<c>)` or `underpowered (<c>)` instead of a headroom line
  (`S:965-991`, `S:993-1010`).
- A row the scorer refuses (a path outside HEAD's tree, a `.env` basename, or a section whose
  hash no longer matches) is left out of every baseline count (`S:810-822`, `S:910-914`), but its
  label is still needed: the gate wants all 150 rows to carry one (`S:874`,
  `P/implementation-summary.md:176`).

UNDEFINED: the spec fixes each call only through that row's question. It gives no boundary rule
for a passage a careful reader could call either way, for example a section that names the same
entity with three words where two are the same, or a `from X to Y` whose endpoints are only half
meaningful. The operator must decide those rows and apply one rule across all 150. Also
UNDEFINED: what value a refused row should carry, since no baseline will score it. Decide both
before the first row.

## 3. Label values

- `label`: exactly `yes` or `no` (`S:872`). A null or any other string leaves the row unlabeled
  and keeps the gate closed (`S:874`).
- `labeler`: free text, drawn as null (`S:743-752`). The scorer reads and validates it nowhere;
  the gate counts the `label` only (`S:859-877`).
- Every drawn row starts `label: null`, `labeler: null` (`S:751-752`). The operator fills both.

## 4. Rows

- Rows file: `hvr-reader-lens-labels.jsonl` (`S:582`), overridable with `--labels <path>`
  (`S:2079`). Phase 42 fixes this feature's label file at the scorer's default path,
  `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr-reader-lens-labels.jsonl`
  (`P42/spec.md:150`). It does not exist today (checked on disk at this HEAD), and no drawn file
  is committed: the phase's draw proof stayed in the session scratchpad (`P/goal.md:90`,
  `P/implementation-summary.md:79`).
- id field: `id`, assigned `r001` to `r150` after the draw (`S:755-756`).
- Draw command, with the seed the phase used (`P/goal.md:90`, `P/implementation-summary.md:151`):

  `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py --draw --seed 20260929`

  Run it from the repository root. It writes 50 rows per category to the file above, prints one
  `draw: category=<c> rows=50 candidate_rows=<n>` line per category, takes about three minutes on
  the real tree, exits 0, and refuses to overwrite a file that already holds a label
  (`S:2103-2137`, `P/implementation-summary.md:79`). The phase's proof added
  `--labels <scratchpad file>`; phase 42's target is the default path, so no `--labels` is needed.
- Zero-call census, before or after the draw: `python3 .../hvr_reader_lens.py` prints the frame
  census and, while the gate is open, `labels: labeled=<n> of 150` then
  `stop: fewer than 150 labeled rows` (`P/spec.md:186`, `S:2186-2189`).
- Per row, open and read:
  - `doc` (repo-relative path), `section_start` and `section_end` (1-based inclusive line
    numbers), and `commit` (`S:743-752`).
  - Resolve to text: `git show <commit>:<doc>`, then take lines `section_start` to `section_end`
    inclusive; the scorer joins exactly that range (`S:118-137`, `S:240-250`, `S:801-802`). The
    row's `section_sha12` is the first 12 hex of SHA-256 over that joined text, and the scorer
    re-checks it before scoring, so the text you read must still hash to the row (`S:147-152`,
    `S:803-806`).
  - `category` tells which of the three questions above applies to the row (`S:743-752`).
  - `candidate` is the lexical comparator's own flag, recomputed from the committed text at
    scoring time (`S:849-853`). It is not a hint for the operator's read; it is the baseline the
    model has to beat.

## 5. Label file

- Path: `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr-reader-lens-labels.jsonl`,
  the scorer's default (`S:582`) and the path phase 42 fixes for this feature (`P42/spec.md:150`).
  A file named by `--labels <path>` is read instead (`S:2079`); the draw must write the same file
  the scoring run reads.
- Shape: JSON Lines, one object per row, the ten fields `draw_rows` writes: `id`, `category`,
  `doc`, `section_start`, `section_end`, `commit`, `section_sha12`, `candidate`, `label`,
  `labeler` (`S:743-752`; `P/spec.md:142`). No text field exists.
- Label field: `label`. There is no other label field. `labeler` is free text the scorer never
  reads.
- A confirmed row must look like this, with the label the operator approved:

  `{"id":"r001","category":"synonym-cycling","doc":"<repo-relative .md>","section_start":12,"section_end":40,"commit":"<40-hex>","section_sha12":"<12-hex>","candidate":false,"label":"no","labeler":"operator"}`

  The gate is complete only when the file holds exactly 150 rows and all 150 carry `yes` or `no`
  (`S:874`).
- Who writes it: the operator only. The phase puts any model-written label out of scope
  (`P/spec.md:119`), and D2 says the operator labels every row, never a model (`P/goal.md:53`).
  Under phase 42 two models draft each row blind to each other and the session writes the file
  only from the operator's chat answers (`P42/goal.md:49-50`, `P42/spec.md:171-172`).
- Outside the repository: the labels file itself is in-repo. The phase's draw proof kept the drawn
  copy in the session scratchpad under parent D4 (`P/goal.md:90`, `P/implementation-summary.md:79`,
  `P/implementation-summary.md:172`). The report directory is operator-named `--out <dir>` and may
  sit inside the repository (`P/spec.md:148`); `--jev` or `--deem` without `--out` exits 2 before
  any call (`S:2088`).

## 6. Gate

- Count: 150 rows labeled `yes`/`no`, and the file must hold exactly 150 rows
  (`TOTAL_ROWS = 150`, `S:574`; `S:874`).
- Per-class minimum: none enforced by the gate; it counts the total only (`S:859-877`). The
  50-per-category split is the draw's own budget (`ROWS_PER_CATEGORY = 50`, `S:575`), and the draw
  raises if a category cannot fill 50 (`S:732-735`). Keep the drawn rows intact to hold the split.
- Below the gate: `labels: labeled=<n> of 150` then `stop: fewer than 150 labeled rows`, exit 0,
  no arm calls (`S:889`, `S:2186-2189`). A switched run that passes its backend gate but not this
  one prints `<backend> arm skipped: fewer than 150 labeled rows` (`S:2218-2221`).
- Above the gate: one `baseline (<c>): ...` line per category and one `headroom (<c>)` /
  `no headroom (<c>)` / `underpowered (<c>)` line per category; if fewer than two categories are
  passable the run prints `stop: fewer than 2 categories can pass` and calls nothing
  (`S:937-1010`, `S:2190-2197`).
- Today: 0 of 150. No labels file exists (checked on disk at this HEAD;
  `P/implementation-summary.md:73-74`).

## 7. Drafting content (035 and 031 only)

Not applicable. Those phases draft planted sentences and fixture rows. This phase drafts no
content; its only drafted artifact is the label value two labelers propose per drawn row, and no
model writes a label (`P/spec.md:119`, D2 at `P/goal.md:53`).
