# Label card: 032-citation-drift-scan

One card for the operator who fills the label gate. Phase folder:
`specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/`, called `P` below.
Scorer: `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`, cited as `S:NN`. Inventory:
`label-inventory-4.md` in this evidence folder. Phase 42 spec:
`specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/`, cited as
`P42/`. Facts were read on 2026-10-01 at HEAD `ebcc68e8edb42bc736cf52ecb89c1997f5c84e82`.

## 1. Question

One row decides whether a cited code window still shows what the citing sentence claims, the
operator labels the 20 live drawn citations `supports`, `partial` or `contradicts`, and with the
20 construction-labeled drifts that reaches 40 labeled rows before either the Jev or Deem `noul`
arm may be scored (`P/spec.md:74`, `P/spec.md:137`, `P/spec.md:138`).

## 2. Rubric

The evidence per row is the citing sentence and the cited window. The sentence is the trimmed line
that carries the citation in the citing document (`S:140`, `S:160`). The window is the cited line
plus or minus 10 lines, clamped to the file (`S:37`, `S:459-462`). Both sides are read at the
row's recorded `commit`, never from the working tree (`S:574-583`).

The question the phase puts to a judge, and the phrase the operator's read answers, is fixed:
`Does the cited code window still show what the citing sentence claims?` (`S:85`, `P/spec.md:149`).

Label values:

- `supports`: the window still shows the claim. Scoring maps `supports` to clean
  (`P/spec.md:138`).
- `partial`: mapped to drifted, with no finer definition in the spec (`P/spec.md:138`).
- `contradicts`: the window does not show the claim. Constructed rows carry it by construction,
  because their window moved 60 lines down the same file (`P/spec.md:137`, `S:58`).

UNDEFINED: the spec names `partial` only through its scoring consequence, and it fixes no boundary
between `partial` and `contradicts` and no test for how much of a claim must still hold for
`supports` rather than `partial`. The operator must decide both and apply them consistently. The
scorer treats every non-`supports` value as drifted (`S:613`).

Edge cases the spec names:

- A constructed window may still support its claim because the same identifier repeats in the
  file. The operator may relabel any constructed row at the gate, and the report counts relabeled
  rows (`P/spec.md:198`).
- Live drift may be rare or near zero. The 20 constructed rows guarantee positives
  (`P/spec.md:197`).
- The gate counts a row as labeled when `verdict` is not null (`S:520`). The loader validates no
  field (`S:488-505`), so a value outside the three names still counts as a label and scores as
  drifted (`S:613`).
- A row whose `doc` or `target` the commit does not hold contributes empty text and is never
  flagged by the comparator (`S:581`, `S:338-346`). The operator can still label it.
- Blank lines are skipped (`S:493`).

## 3. Label values

- `verdict`: the spec's values are `supports`, `partial` and `contradicts` (`P/spec.md:138`).
  The scorer's loader accepts any JSON object and counts any non-null `verdict` as a label
  (`S:488-505`, `S:520`), and scoring treats `verdict !== 'supports'` as drifted (`S:613`). So
  those three are the intended strings, and any other value is still accepted and then scored as
  drifted.
- `labeler`: a free string. The draw writes `construction` on constructed rows (`S:418`). The
  scorer validates nothing, but the draw's overwrite refusal keys on any non-null `labeler`
  (`S:1566-1567`).
- `kind`: `live` or `constructed` (`S:396`, `S:417`). Not a label. It decides which rows the
  operator must fill.
- `id`: `live-NN` or `constructed-NN`, a zero-padded ordinal (`S:406`).
- Confirmed row shapes. Live:
  `{"id":"live-01",...,"kind":"live","verdict":"supports","labeler":"<operator>"}`, with
  `partial` or `contradicts` in place of `supports` where that is the read. Constructed:
  `{"id":"constructed-01",...,"kind":"constructed","verdict":"contradicts","labeler":"construction"}`
  as drawn, or with a recorded relabel (`P/spec.md:198`).

## 4. Rows

- Rows file: `cite-drift-labels.jsonl` beside the script by default, so
  `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl` (`S:37`), overridable with
  `--labels <file>` (`S:1543`). No such file exists today (`label-inventory-4.md`, checked on
  disk).
- id field: `id`.
- Draw command:
  `node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --draw --seed 20260929`
  (`S:10`, `S:1550-1555`). The seed is required and must be an integer (`S:1550-1555`). The
  phase's recorded draw ran with seed 20260929 at commit `709b1078ee5d` and wrote the 40 rows to a
  file in the session scratchpad, outside the repository (`P/goal.md:91`,
  `P/implementation-summary.md:72`, `P/implementation-summary.md:151`).
- The draw writes 40 rows: 20 `live` rows with `verdict` and `labeler` null, and 20 `constructed`
  rows with `verdict: contradicts` and `labeler: construction` (`S:404-419`, `S:456-479`). It
  prints `draw: path=... seed=... commit=... rows=40 live=20 constructed=20` and exits 0
  (`S:1585-1592`).
- Refusal: the draw refuses to overwrite a file holding any non-null `labeler`. Because every
  draw writes 20 construction rows with `labeler: construction`, a second draw at the same path
  is refused with `draw: refusing to overwrite <path>, operator labels present`, even before an
  operator label exists (`S:1566-1567`, `P/implementation-summary.md:175`).
- Per live row, what to open and read, and how to resolve it to text:
  1. The citing sentence: read line `doc_line` of `doc` at the row's `commit`, for example
     `git show <commit>:<doc> | sed -n '<doc_line>p'`. The scorer reads the same file with
     `git show <commit>:<file>` (`S:314-317`) and takes line `doc_line - 1` of the split output
     (`S:581`).
  2. The window: read lines `window_start` to `window_end` of `target` at the same `commit`, for
     example `git show <commit>:<target> | sed -n '<window_start>,<window_end>p'`. The scorer
     reads the same span the same way (`S:314-317`, `S:338-346`).
  3. Compare the two reads and write the verdict. The row's `claim_sha12` and `window_sha12` pin
     the exact text, and the row itself carries no text (`S:404-419`, `P/spec.md:137`). The row's
     `target` is the bare path, so the span comes from `window_start` and `window_end`, and the
     cited line sits at `target_line` (`P/implementation-summary.md:175`).
- Constructed rows: the same two reads are the check. Their window is the same file moved 60
  lines down, wrapping, and never within 20 lines of the cited line (`S:58`, `S:61-62`,
  `S:469-471`). The drawn value is already `contradicts`, and a relabel is allowed
  (`P/spec.md:198`).
- Content kind: tracked skill docs and tracked target files in a public repository, not private
  session text (`P/spec.md:202`). Only tracked files are read, and a `.env` basename is refused
  (`P/spec.md:136`).

## 5. Label file

- Path: exactly `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl`, the default
  beside the script (`S:37`). Phase 42's Files to Change lists this exact file as the one it
  creates (`P42/spec.md:138`). A run may override it with `--labels <file>` (`S:1543`), but the
  phase writes this path.
- Shape: JSON Lines. Every drawn row carries `id`, `doc`, `doc_line`, `target`, `target_line`,
  `window_start`, `window_end`, `commit`, `claim_sha12`, `window_sha12`, `kind`, `verdict` and
  `labeler` (`S:404-419`). The row carries no text (`P/spec.md:137`).
- Label field: `verdict`. Labeler field: `labeler` (`S:417-418`).
- A confirmed row: the operator confirmed its verdict, `verdict` is non-null, and for a live row
  it is one of the three accepted strings. The drawn `contradicts` on a constructed row stands, or
  the operator's relabel is recorded (`P/spec.md:198`). Forty rows with a non-null verdict pass
  the gate (`S:520`, `S:646-647`).
- Who writes it and what makes a row confirmed: the operator confirms every row, and a model never
  writes the file. Under phase 42 two models draft each row blind to each other and only the
  operator-confirmed value may enter a label file (`P42/spec.md:42`, `P42/spec.md:160-161`, D1 and
  D2 at `P42/goal.md:49-50`). The phase's own rule stands: no model writes a label
  (`P/spec.md:137`, `P/spec.md:49`, D2 at `P/goal.md:53`).
- Outside the repository: this label file is repository text, so it stays at its in-repo path.
  The drawn file from the phase's 2026-09-29 run lived outside the repository in the session
  scratchpad, and no labels file was committed (`P/implementation-summary.md:72`,
  `P/implementation-summary.md:151`). The report directory is operator-named.

## 6. Gate

- Count: `LABEL_GATE = 40` rows carrying a verdict (`S:70`, `S:646-647`). A fresh draw supplies
  the 20 constructed rows, and the operator supplies the 20 live verdicts (`S:508-525`,
  `P/spec.md:137`).
- Per-class minimum: none in the gate. The scorer enforces no share of `live` or `constructed`
  rows and counts any row with a non-null `verdict` (`S:520`). The 20 live rows are the draw's
  design (`S:52`, `S:55`), not a check.
- Below the gate: `stop: fewer than 40 labeled rows` (`S:647`).
- Above the gate: the two comparator lines and `baseline method:` print. A baseline right on more
  than 90 percent prints `no headroom` (`S:650-657`). Fewer than five winnable rows prints
  `underpowered: winnable=<n>` (`S:659-660`). Otherwise the fixed `instruction:` line with its
  SHA-256 prints and the arms proceed per switch (`S:662-663`).
- Today: 0 rows on disk, so 0 of 40 (`label-inventory-4.md`).

## 7. Drafting content (035 and 031 only)

Not applicable. Those phases draft planted sentences and fixture rows. This phase drafts no
content.
