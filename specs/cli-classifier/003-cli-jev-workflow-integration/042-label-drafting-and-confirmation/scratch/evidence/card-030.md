# Labeling card 030 — fanout-merge-shadow-record

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/`,
called `P` below. Scorer: `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs`,
cited as `S:NN`. Inventory: `label-inventory-3.md` in this evidence folder. Phase 42 spec:
`specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/`, cited
as `P42/`. Facts were read on 2026-10-01 at HEAD `ebcc68e8edb42bc736cf52ecb89c1997f5c84e82`.

## 1. Question

One row decides whether the two findings in a fan-out pair describe the same problem (`same`)
or two problems (`different`): that label is the gold the pair replay measures a backend
against — "Settle, on a counted number per backend, whether a Jev or Deem same-or-different
judgment on near-line and cross-body pairs matches the operator's labels better than the
merge's own decision" (`P/spec.md:75`; objective `P/goal.md:43`) — and 40 labeled pairs, at
least 10 of them cross-body, are what let the phase print a verdict instead of
`stop: fewer than 40 labeled pairs` (`P/spec.md:86`, `S:60-61`).

## 2. Rubric

The evidence per row is the sheet's own text pair: `text_a` and `text_b`, the text the merge
compares and the text a model would read for each finding, alongside their `lineages`, `loop`,
`run_dir` and `class` (`S:347-352`, `S:466-467`, `S:589-598`). The question the pair is put to
a model, and the phrase the operator's read answers, is fixed:
`Do these two findings describe the same problem?` (`S:82`, `P/spec.md:139`).

Label values:

- `same`: the two findings describe one problem, so the pair is one finding stated twice. The
  Keep Rule compares the label directly against the merge's collapse: the baseline "is right
  when its decision equals the label" (`P/spec.md:146`).
- `different`: the two findings state two problems, so the pair must not collapse.
- On the model's side the cut is fixed — "An answer is 'same' at a probability of 0.5 or
  more" (`P/spec.md:139`, `S:1337`), and a Deem pair whose two orders disagree is `unstable`
  and counts as wrong (`P/spec.md:139`). That cut is the arm's, not the label's.

The `class` field tells the operator why the pair was drawn, not what to answer: `near-line`
pairs share the merge's body key and carry a title overlap from 0.05 up to but not including
0.30, and `cross-body` pairs differ in body and reach a title-or-text overlap of 0.5 or more
(`S:50-51`, `S:56`, `S:379-389`, `P/spec.md:128`). The bands are "proposed and fixed here"
(`P/spec.md:128`).

UNDEFINED: the spec fixes no test for when two findings state the same problem. Its own words:
"Only the operator can say whether two findings are the same" (`P/spec.md:71`). The operator
must decide whether sameness means the same claim, the same evidence, the same fix or the same
root cause, and apply it consistently across the sheet. UNDEFINED too: what `same` means for a
pair the merge collapses under one dedup setting but not the other. The labels are
setting-neutral; the baseline picks whichever of the merge's two decisions matches more labels,
dedup off on a tie (`P/spec.md:129`, `S:535-550`).

Edge cases the spec names:

- A pair the merge drops on one side before comparing is `undecidable` and stays out of both
  classes; it is never drawn into the sheet, and the census prints `merge undecidable: 12`
  today (`P/implementation-summary.md:75`, `P/implementation-summary.md:79`).
- The near-line class is empty on today's corpus: `class near-line: research=0 review=0`
  (`P/implementation-summary.md:65`). Many findings carry none of the merge's body fields and
  never near-collapse (`P/spec.md:189`), and research findings rarely carry titles, so
  cross-body pairs fall back to text overlap (`P/spec.md:190`, `S:361-368`). The 60 drawn rows
  are therefore all cross-body, and the 10-cross-body floor is the binding one.
- Whether past merges ran with near-duplicate dedup on is UNKNOWN from the registries alone;
  the census reports both decisions, so the answer does not change the measurement
  (`P/spec.md:201`).
- Are 40 labels with 10 cross-body enough? The thresholds are "fixed here so the build cannot
  tune them"; a one-sided sign test at 0.05 needs at least five discordant pairs, all won
  (`P/spec.md:202`, `P/spec.md:152`).
- No reader of a shadow record is named: a keep alone promotes nothing, and every verdict line
  ends `reader=none named` (`P/spec.md:141`, `P/spec.md:158`). The labels remain the gold
  either way.

## 3. Label values

Exact strings `parseLabels` accepts (`S:639-640`):

- `same` or `different` — the only two accepted values.
- **Empty is refused.** The drawn sheet writes `label: ""` on every row (`S:597`), and the
  reader rejects it: `labels row <n>: label must be same or different, got ""` on stderr,
  exit 2 (`S:638-640`). The operator's file must fill every line it carries or delete the
  lines left empty; a partly filled sheet fed back whole stops the run rather than shrinking
  the labeled set.
- A missing or blank `pair_key` exits 2 (`S:635-637`), a duplicate `pair_key` exits 2
  (`S:641-642`), and a non-JSON line exits 2 (`S:628-632`).
- A `pair_key` the current census no longer sees is dropped silently on stdout and recorded as
  `dropped` in `report.json` (`S:643-644`, `S:1684`, `S:1758`) — "a label left over from an
  older sheet cannot score a pair the census no longer sees" (`S:609-610`).

There is no labeler field. The label field is `label`, and no model may write it
(`P/spec.md:131` REQ-005; `P/goal.md:54` D4). Phase 42 records the operator's confirmation in
this feature's decisions log, not in the label file.

## 4. Rows

- Rows file: an operator-named path **outside the repository**, written by
  `--write-pair-sheet <path>` (`S:1339`, `S:1549`, `S:1658-1665`). No sheet exists today; the
  phase's session wrote a 60-row sheet outside the repository, every `label` empty, and no
  labels file exists (`P/implementation-summary.md:151`, `P/implementation-summary.md:171`).
- id field: `pair_key`, the pair's stable identity
  `<loop>:<runDir>#<label>@<finding id>|<label>@<finding id>`, with the two sides sorted by
  lineage label then finding id so the key is the same whichever lineage was read first
  (`S:404-417`).
- Draw command (no seed):
  `node .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs --write-pair-sheet <path outside the repository>`
  It writes at most 60 pairs per class, ordered ascending by SHA-256 of the pair key, each row
  carrying `pair_key`, `class`, `loop`, `run_dir`, `lineages`, `text_a`, `text_b` and an empty
  `label` (`S:65`, `S:582-598`). It prints no success line. A path inside the repository prints
  `refusing to write the pair sheet inside the repository` on stderr, exits 2 and writes no
  file, after the census block has printed (`S:573-577`, `S:1658-1665`). Today it would write
  60 cross-body rows from the 124 candidates (`P/implementation-summary.md:65-66`,
  `P/implementation-summary.md:151`; `label-inventory-3.md` item 4).
- Per row, what a labeler must open and read, and how to resolve it to text:
  1. `text_a` and `text_b` are the two findings' durable signal as the census reads it: body
     text first, else the title, else the finding's own JSON (`S:347-352`, `S:466-467`). They
     are the evidence for the read; no other file has to be opened.
  2. For the source records, open `<run_dir>/<loop>/lineages/<lineages[0]>/<registry>` and the
     same for `lineages[1]`. The registry names are `findings-registry.json` or
     `deep-research-findings-registry.json` for research and `deep-review-findings-registry.json`
     for review (`S:36-39`); the findings field is `keyFindings` for research and `openFindings`
     for review (`S:42-44`, `S:195-206`).
  3. The pair key names the two findings by lineage label and finding id (`S:404-417`); the
     census pairs findings across lineages only, never inside one (`S:431-449`).
- Content kind: finding text from tracked research and review fan-out registries under
  `specs/**` — session content; treat as private. Jev would receive only pairs whose two
  registries both exist at `origin/main`; Deem would run every pair (`P/spec.md:133`). Phase 42
  makes no such call (D4 at `P42/goal.md:52`).

## 5. Label file

- Path: operator-named and outside the repository; the same path is read back with
  `--labels <file>` (`S:1339`, `S:1548`, `S:1669-1682`). The literal path is the operator's to
  name (`P42/spec.md:156`, `P42/spec.md:226`). UNDEFINED until the operator names it. The
  writer refuses an in-repo target (`S:573-577`) while the reader imposes no location rule, so
  the file written from the sheet is the one to fill and read back.
- Shape: JSON Lines; the sheet row plus the filled label — `pair_key`, `class`, `loop`,
  `run_dir`, `lineages`, `text_a`, `text_b`, `label` (`S:589-598`). Only `pair_key` and `label`
  are read; the other keys are ignored (`S:633-644`).
- Label field: `label`. Labeler field: none; the scorer reads none (`S:633-644`).
- A confirmed row:
  `{"pair_key":"review:specs/…/run#a@F-01|b@F-07","class":"cross-body","loop":"review","run_dir":"specs/…/run","lineages":["a","b"],"text_a":"…","text_b":"…","label":"different"}`
  with `same` or `different`. A row whose `pair_key` no longer joins the census is dropped
  (`S:643-644`).
- Who writes it and what makes a row confirmed: only the session writes the file, and only from
  the operator's answers in chat, because a scorer reads only rows the operator confirmed
  (`P42/spec.md:42`, `P42/spec.md:172`, D1 and D2 at `P42/goal.md:49-50`). Two labelers, Luna 6
  max on `cli-codex` and SWE 2 max on `cli-devin`, draft each row blind to each other and write
  no label file (`P42/spec.md:80`, `P42/spec.md:184`). The phase's own rule stands: "No model
  writes a label" (`P/spec.md:131`, D4 at `P/goal.md:54`).
- Outside the repository: yes, by the writer's design. The sheet carries finding text, so it
  stays outside the tree; only the two labelers see the drafts, and a Jev run still needs the
  operator's separate yes (`P42/spec.md:252`, `P42/spec.md:209`).

## 6. Gate

- Count: `LABEL_GATE = 40` labeled pairs plus `CROSS_BODY_LABEL_GATE = 10` labeled cross-body
  pairs (`S:60-61`).
- Per-class minimum: the 10 cross-body pairs, counted from the sheet's own `class` field
  (`S:666-670`). No other class has a floor.
- Below the gate: `stop: fewer than 40 labeled pairs` (`S:672-673`); at 40 or more labeled but
  fewer than 10 cross-body: `stop: fewer than 10 labeled cross-body pairs` (`S:675-676`). Both
  exit 0 and run no arm; with a switch set, `<backend> arm skipped: label gate`
  (`P/implementation-summary.md:150`).
- Above the gate: `planned calls: jev <3K+1>, deem <2K>` (`S:681`), or `no headroom` when the
  baseline is right on more than 90 percent (`S:678-679`). Phase 42 records whichever line the
  zero-call run prints and runs no switched arm (`P42/spec.md:209`, D4 at `P42/goal.md:52`).
- Zero-call command:
  `node .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs --labels <path outside the repository>`
  (`S:1548`; no `--out` is needed without a switch at `S:1563-1569`). A default run with no
  `--labels` prints the census and `stop: fewer than 40 labeled pairs` (`S:1694`,
  `P/implementation-summary.md:76`).
- Today: 0 labeled, so 0 of 40 and 0 of 10 (`label-inventory-3.md` item 4).

## 7. Drafting content (035 and 031 only)

Not applicable. Those phases draft planted sentences and fixture rows. This phase drafts no
content.
