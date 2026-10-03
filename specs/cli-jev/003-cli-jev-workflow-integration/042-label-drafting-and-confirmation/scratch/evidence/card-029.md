# Labeling card 029 — p0-reread-order

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order/`, called `P`
below. Scorer: `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs`,
cited as `S:NN`. Inventory: `label-inventory-3.md` in this evidence folder. Phase 42 spec:
`specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/`, cited
as `P42/`. Facts were read on 2026-10-01 at HEAD `ebcc68e8edb42bc736cf52ecb89c1997f5c84e82`.

## 1. Question

One row decides whether the archived P0 finding in the sheet is really a P0 or one of `P1`,
`P2`, `not_a_finding`: that label is the gold the severity replay measures a backend against
— "Settle, on a counted number per backend, whether a Jev or Deem severity choice separates
real P0s from false ones better than the recorded severity" (`P/spec.md:75`; objective
`P/goal.md:43`) — and 20 labels other than `real` are what let the phase print a verdict
instead of `stop: fewer than 20 labeled P0 negatives` (`P/spec.md:87`, `S:49`).

## 2. Rubric

The evidence per row is the sheet's record of the finding: `title`, `dimension` and
`evidence_refs`, which the writer puts in the sheet, plus the `recommendation`, which it does
not (`S:351-360`, `S:180-200`). The severity the arms put to a model, and the classes the
label answers, are fixed as the severity table's wording (`S:34-39`, `P/spec.md:140`):

| Value | Meaning (the scorer's own option wording) | Citation |
|-------|-------------------------------------------|----------|
| `real` | The recorded P0 is right: a correctness failure, a security vulnerability or a spec contradiction. | `S:35`; table at `deep-review/references/convergence/convergence.md:399-401`, cited by `P/spec.md:140` |
| `P1` | Degraded behavior, incomplete implementation, missing validation. | `S:36` |
| `P2` | Style, naming, minor improvements, documentation gaps. | `S:37` |
| `not_a_finding` | The cited evidence does not show a defect (proposed wording, fixed before any run). | `S:38`, `P/spec.md:140` |

The scorer's own decision rule fixes the mapping: "the column is right when its modal pick is
`P0` and the label is `real`, or its modal pick is `P1`, `P2` or `not_a_finding` and the label
is not `real`" (`P/spec.md:147`). Only `real` is counted against the rest: `negatives = K -
labelCounts.real` (`S:1686`), and `labeled: K (real …, P1 …, P2 …, not_a_finding …)` prints
the split (`S:1690`).

UNDEFINED: the spec fixes no test for the boundary between `P1`, `P2` and `not_a_finding`, and
none for how much of a finding must hold before it is a real P0. Its own open question records
it: "Is a binary real-or-not verdict the right bar, or should the exact class of a negative
count? The Keep Rule uses the binary one, and the report prints exact-class agreement on
negatives beside it" (`P/spec.md:201`; the line at `S:669-690`). The operator must decide the
three non-`real` boundaries and apply them consistently; only `real` against not-`real` changes
any verdict.

Edge cases the spec names:

- The read may find fewer than 20 negatives among all 95 rows. "The operator may label all 95
  P0 rows and still find fewer than 20. The phase then closes on the stop line" — which 029's
  own spec accepts as R10's answer, that the negative class is too rare to measure
  (`P/spec.md:187`, `P/spec.md:200`).
- A label read in hindsight may disagree with what the reviewer knew then; the sheet carries
  the evidence refs the reviewer cited, and the operator labels against those (`P/spec.md:189`).
- One of the 95 P0 rows comes from a test fixture registry under
  `deep-review/scripts/tests/fixtures/` (`P/implementation-summary.md:185`). It is a row like
  any other unless the operator decides otherwise.
- The finding id sits in the sheet but never in the state sent to a model, because ids carry
  the recorded severity (`P/spec.md:134`, `S:328-334`). The id is an identifier, not evidence.
- The baseline calls every row `real` and prints `no headroom` when it is right on more than 90
  percent of the labeled rows (`S:442-444`, `P/spec.md:130`). That is a consequence of the
  labels, not a gate failure.

## 3. Label values

Exact strings `parseLabels` accepts (`S:417-420`):

- `real`, `P1`, `P2`, `not_a_finding` — the four gold classes.
- `""` (empty) is accepted and counted as dropped: the row stays out of the labeled set and out
  of the baseline, and the gate reports the shortfall (`S:388`, `S:1681`, `S:1687`, `S:1691`).
- Any other value stops the run with `labels row <n>: label must be "", real, P1, P2 or
  not_a_finding, got <value>` on stderr and exit 2. A missing or blank `registry` or
  `finding_id`, a duplicate row key and a non-JSON line stop it the same way
  (`S:406`, `S:411-422`).

There is no labeler field. The label field is `label`, and no model may write it
(`P/spec.md:132` REQ-005; `P/goal.md:52` D2). Phase 42 records the operator's confirmation in
this feature's decisions log, not in the label file.

## 4. Rows

- Rows file: an operator-named path **outside the repository**, written by `--write-label-sheet
  <path>` (`S:71`, `S:1602`, `S:1667-1675`). No sheet exists today; the phase's session wrote a
  95-row sheet with empty labels outside the repository, and no labels file exists
  (`P/implementation-summary.md:89`, `P/implementation-summary.md:161`,
  `P/implementation-summary.md:181`).
- id field: `finding_id`, joined with `registry` into the row key `` `${registry}#${findingId}` ``
  (`S:163-165`). `registry` is the registry's repo-relative path.
- Draw command (no seed):
  `node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs --write-label-sheet <path outside the repository>`
  It writes one JSON line per P0 row, in registry and finding order, each with `registry`,
  `finding_id`, `title`, `dimension`, `evidence_refs` and an empty `label`, and prints
  `label sheet: <path> rows=<n>` (`S:351-360`, `S:1669-1670`). An in-repo path is refused with
  `refusing to write the label sheet inside the repository`, exit 2 and no file, before the
  census reads a file (`S:374-384`, `S:1631-1643`). Today it would write 95 rows:
  `p0 rows: 95 in 37 registries (one 21, two or more 16)` (`P/implementation-summary.md:75`;
  `label-inventory-3.md` item 2).
- Per row, what a labeler must open and read, and how to resolve it to text:
  1. The row's own `title`, `dimension` and `evidence_refs` are in the sheet and are the
     evidence the operator labels against (`P/spec.md:189`).
  2. For the `recommendation`, which the sheet does not carry, open the file at `registry` and
     read the finding whose `findingId ?? id` equals `finding_id`, under `openFindings` or
     `resolvedFindings`. The state the arms read is exactly `title`, `dimension`,
     `evidenceRefs ?? evidence` and `recommendation` (`S:180-200`, `S:328-334`).
  3. Nothing else is needed: one row, one severity read.
- Content kind: archived deep-review findings in tracked `deep-review-findings-registry.json`
  files under `specs/**` — session content; treat as private. Jev would receive only rows whose
  registry exists at `origin/main`; Deem would run every row (`P/spec.md:134`). Phase 42 makes
  no such call (D4 at `P42/goal.md:52`).

## 5. Label file

- Path: operator-named and outside the repository; the same path is passed back with
  `--labels <file>` (`S:71`, `S:1603`). The literal path is the operator's to name
  (`P42/spec.md:156`, `P42/spec.md:226`). UNDEFINED until the operator names it. The writer
  refuses an in-repo target (`S:374-384`) while the reader imposes no location rule
  (`S:1653-1655`), so the file written from the sheet is the one to fill and read back.
- Shape: JSON Lines; the sheet row plus the filled label — `registry`, `finding_id`, `title`,
  `dimension`, `evidence_refs`, `label` (`S:352-359`). Only `registry`, `finding_id` and `label`
  are read; the other keys are ignored (`S:409-420`).
- Label field: `label`. Labeler field: none; the scorer reads none (`S:409-420`).
- A confirmed row:
  `{"registry":"specs/…/deep-review-findings-registry.json","finding_id":"…","title":"…","dimension":"…","evidence_refs":["…"],"label":"not_a_finding"}`
  with one of the four accepted strings, or `""` where the operator gave no answer — in which
  case it is dropped and the gate reports the shortfall (`S:1687-1691`).
- Who writes it and what makes a row confirmed: only the session writes the file, and only from
  the operator's answers in chat, because a scorer reads only rows the operator confirmed
  (`P42/spec.md:42`, `P42/spec.md:172`, D1 and D2 at `P42/goal.md:49-50`). Two labelers, Luna 6
  max on `cli-codex` and SWE 2 max on `cli-devin`, draft each row blind to each other and write
  no label file (`P42/spec.md:80`, `P42/spec.md:184`). The phase's own rule stands: "No model
  writes a label" (`P/spec.md:132`, D2 at `P/goal.md:52`).
- Outside the repository: yes, by the writer's design. The sheet carries finding text, so it
  stays outside the tree; only the two labelers see the drafts, and a Jev run still needs the
  operator's separate yes (`P42/spec.md:252`, `P42/spec.md:209`).

## 6. Gate

- Count: `LABEL_GATE = 20` rows labeled other than `real` (`S:49`, `S:439-440`). The census
  states it: `labels needed: 20 P0 negatives among <n> P0 rows` (`S:314`).
- Per-class minimum: none beyond the 20 negatives. The other classes print their counts and
  never gate (`S:1690`).
- Below the gate: `stop: fewer than 20 labeled P0 negatives` (`S:440`), printed on every run
  and exit 0. With a switch set, `<backend> arm skipped: label gate` and no call
  (`S:1708-1710`, `S:1722-1725`).
- Above the gate: `gate: open K=<k> negatives=<n>` (`S:445`), or `no headroom` when the
  baseline is right on more than 90 percent (`S:442-444`). Phase 42 records whichever line the
  zero-call run prints and runs no switched arm (`P42/spec.md:209`, D4 at `P42/goal.md:52`).
- Zero-call command:
  `node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs --labels <path outside the repository>`
  (`S:1603`, no `--out` needed without a switch at `S:1616-1621`). A default run with no
  `--labels` prints `labels: none`, `labeled: 0 (real 0, P1 0, P2 0, not_a_finding 0)` and the
  same stop line (`S:1689-1690`, `P/implementation-summary.md:86`).
- Today: 0 labeled, so 0 of 20 (`label-inventory-3.md` item 4). If the operator's 95 reads
  yield fewer than 20 non-`real`, the phase records the count and closes on that stop line, a
  recorded shortfall rather than a failure (`P42/spec.md:209`, `P/spec.md:187`).

## 7. Drafting content (035 and 031 only)

Not applicable. Those phases draft planted sentences and fixture rows. This phase drafts no
content.
