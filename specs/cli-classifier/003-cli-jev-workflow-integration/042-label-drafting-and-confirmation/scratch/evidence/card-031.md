# Label card: 031-debug-next-check

One card for the operator who fills the label gate. Phase folder:
`specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/`, called `P` below.
Scorer: `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`,
cited as `S:NN`. Inventory: `label-inventory-3.md` in this evidence folder. Phase 42 spec:
`specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/`, cited as
`P42/`. Facts were read on 2026-10-01 at HEAD `ebcc68e8edb42bc736cf52ecb89c1997f5c84e82`.

## 1. Question

One fixture row decides which of `read_code`, `run_test`, `reproduce` or `instrument` is the
cheapest way to confirm or rule out that hypothesis, and 30 or more operator-confirmed rows in a
fixture outside the repository are the gate that opens the Jev or Deem arm, which measures
whether a model's choice beats the best constant answer, with `read_code` the tie-break and the
research's kill line (`P/spec.md:74`, `P/spec.md:127`, `P/spec.md:129`, D2 at `P/goal.md:52`).

## 2. Rubric

What is labeled. One fixture row is one of the operator's own debug notes: `symptom` (what was
observed), `claim` (the hypothesis under test) and `evidence` (what has been gathered so far)
(`S:72`, `S:580-588`). A backend reads exactly those three fields, as
`Symptom: <symptom>`, `Hypothesis: <claim>` and `Evidence: <evidence>` (`S:586-588`).

The question the label answers is fixed before any run: "What is the cheapest way to confirm or
rule out this hypothesis?" (`S:102`, REQ-008 at `P/spec.md:137`).

The four values, with the descriptions the backend is shown, verbatim from the vendored catalog
(`S:105-110`, REQ-008 at `P/spec.md:137`):

| Value | Description shown with the option (`S:106-109`) |
|---|---|
| `read_code` | Reading more of the existing code settles it, no execution needed |
| `run_test` | An existing test or a quick one-off run settles it |
| `reproduce` | It needs a reproduction of the failing scenario |
| `instrument` | It needs new logging or instrumentation before anything can be seen |

So the label is the operator's answer to the cheapest-check question for that row, one of the
four keys. All four constants are scored as baselines and the best of them is the bar; a tie goes
to `read_code` (`S:369-393`, REQ-003 at `P/spec.md:127`).

Edge cases the spec names:

- The repository holds no rows to mine: the census prints `seam: none`,
  `mined: debug_delegation=1 hypothesis_files=0` and `mined rows: 0`, so the fixture comes from
  the operator's memory (`P/spec.md:70`, `P/spec.md:126`, `P/spec.md:185`).
- The rows are the operator's private debug notes. `jev_ok` is the payload mark and is `true`
  only after the operator has stripped secrets from that row; Jev reads only accepted rows, every
  other row is `unmeasured_withheld` in its column, and an all-false fixture prints
  `jev arm skipped: payload not accepted` (`S:408-413`, REQ-007 at `P/spec.md:131`).
- The baseline is picked on the same rows it is scored on. That can only make the baseline harder
  to beat, and it includes the research's `read_code` kill line (`P/spec.md:187`).
- A fixture where `read_code` is right on 28 of 30 rows prints `no headroom` and no arm runs
  (`P/spec.md:172`, `S:1411-1413`).
- Any `label` outside the four keys is refused with exit 2 naming the row (`S:289`,
  `P/spec.md:129`).

UNDEFINED: the spec fixes the value only as "the cheapest way to confirm or rule out this
hypothesis". It gives no tie-break for a row where two checks look equally cheap, and it says
nothing about a row whose hypothesis is already settled by the evidence recorded in the same row.
The operator must decide those and apply one rule across the whole fixture.

## 3. Label values

- `label`: exactly one of `read_code`, `run_test`, `reproduce`, `instrument` (`S:69`, `S:287-290`).
  There is no other accepted value, and an unknown one refuses the run with exit 2 naming the row.
- `jev_ok`: a boolean (`S:296-298`). It is the payload mark, not a label.
- The schema has no labeler field (`S:72`); the fixture is the operator's by construction.

## 4. Rows

- Rows file: operator-named `--fixture <file>` (`S:1305`). No rows exist and there is no draw
  command and no seed: the operator, with the two labelers' drafts, writes every row
  (`P/goal.md:52`, `P42/spec.md:57`, `P42/spec.md:176`). The phase's 2026-09-29 final runs read a
  29-row synthetic fixture made outside the repository and closed on the gate stop
  (`P/spec.md:33`, `P/goal.md:90`).
- id field: `id`, a non-empty string unique in the file (`S:273`, `S:285`).
- The command that reads it, run from the repository root:

  `node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs --fixture <file>`

  It prints `fixture: rows=<n> sha256=<sha>`,
  `labels: read_code=<n> run_test=<n> reproduce=<n> instrument=<n>`, one
  `constant <key>: <right>/<n>` line per key, `baseline: <key> <right>/<n>`, then `no headroom`
  or `stop: fewer than 30 labeled rows` (`S:1400-1416`).
- Zero-call census, before any fixture exists: the same command without `--fixture` prints the
  seam search and the mined counts (`P/spec.md:170`, `S:1381-1390`).
- Per row, what to open and read: nothing outside the row. `symptom`, `claim` and `evidence` are
  the text the labeler reads; there is no file path, transcript turn or finding id to resolve
  (`S:72`, `S:586-588`). The row's `id` is how the decisions log and `calls.jsonl` name the row,
  and `calls.jsonl` carries no row text (`P/spec.md:138`).

## 5. Label file

- Path: operator-named `--fixture <file>` (`S:1305`). Phase 42 fixes the path on the card before
  the first draft (`P42/spec.md:156`, REQ-001 at `P42/spec.md:168`), and the literal path is the
  operator's to name. UNDEFINED until then. `(proposed)` a path outside the repository, such as
  `<scratchpad>/031-debug-next-check-fixture.jsonl`.
- It must live outside the repository. The scorer refuses an inside path with exit 2 and
  `refused: fixture path inside the repository` (`S:336`; D2 at `P/goal.md:52`).
- Shape: JSON Lines, one object per line, exactly the six fields `id`, `symptom`, `claim`,
  `evidence`, `label`, `jev_ok` (`S:72`). A missing field, an extra field, a duplicate id, an
  empty id, a non-string `symptom`, `claim` or `evidence`, or a non-boolean `jev_ok` refuses the
  whole run with exit 2 naming the row (`S:272-298`).
- Label field: `label`. There is no labeler field (`S:72`).
- A confirmed row must look like this, with the values the operator approved:

  `{"id":"<id>","symptom":"<what was observed>","claim":"<the hypothesis under test>","evidence":"<what has been gathered>","label":"read_code","jev_ok":false}`

  All six fields present and valid, with `label` one of the four keys.
- Who writes it: the operator. No model writes a row or a label (`P/spec.md:129`, D2 at
  `P/goal.md:52`). Under phase 42 the two labelers draft the rows and the operator approves, edits
  or rejects each; the session writes only the approved form (`P42/spec.md:171`,
  `P42/spec.md:176`).
- Outside the repository: the fixture (`S:336`) and the report directory (`--out <dir>`,
  `P/spec.md:113`). `--jev` or `--deem` without `--out` exits 2 before any call (`S:1364`).

## 6. Gate

- Count: `LABEL_GATE = 30` rows (`S:75`). The gate is a row count, not a class split: fewer than
  30 rows prints the stop (`S:1415-1417`).
- Per-class minimum: none. The baseline and the keep rule handle the label mix; the phase's own
  open question asks whether 30 rows are enough (`P/spec.md:199`).
- Below the gate: `stop: fewer than 30 labeled rows`, exit 0, no arm calls (`S:1416`). The
  phase's final runs closed there on a 29-row synthetic fixture (`P/spec.md:33`,
  `P/implementation-summary.md:137`).
- Above the gate: the `keep rule: ...` line prints (`S:99`, `S:1420-1421`), then the Jev payload
  gate and the Deem health gate. `no headroom` (the best constant right on more than nine tenths
  of the rows) prints with or without a full fixture and blocks both arms (`S:1411-1413`,
  `S:1428`). With no accepted row, `--jev` prints `jev arm skipped: payload not accepted`
  (`S:1428-1431`).
- Today: no fixture exists, so the runs print `stop: fewer than 30 labeled rows` and call nothing,
  and the census prints `seam: none`, `mined: debug_delegation=1 hypothesis_files=0` and
  `mined rows: 0` (`P/goal.md:89-90`, `P/implementation-summary.md:68`).

## 7. Drafting content (035 and 031 only)

- What to draft: the whole fixture, at least 30 JSON Lines rows outside the repository (`S:1416`,
  `S:336`). No row can be drawn from the tree because the mined corpus is empty (`P/spec.md:70`).
- Per row, the phase's constraints on the content:
  - Exactly the six fields above, each present, no extras; ids non-empty and unique
    (`S:272-298`).
  - `symptom` is what was observed, `claim` is the hypothesis under test and `evidence` is what
    has been gathered so far. The three are the whole state a backend reads, in that labeled
    order (`S:586-588`).
  - `label` is the operator's answer to the fixed cheapest-check question among the four keys, and
    the run refuses anything else by row id (`S:102`, `S:105-110`, `S:287-290`).
  - `jev_ok` is `true` only after the operator has stripped secrets from that row; rows marked
    false never reach Jev (`S:408-413`, REQ-007 at `P/spec.md:131`).
  - The rows are the operator's own debug notes, often from memory, because the repository holds
    no corpus: `mined rows: 0` (`P/spec.md:70`, `P/spec.md:185`).
  - At least 30 rows, since fewer prints the stop (`S:1416`).
  - No model writes a row or a label; the two labelers draft and the operator approves, edits or
    rejects each, and the session writes only the approved form (`P/spec.md:129`, D2 at
    `P/goal.md:52`, `P42/spec.md:171`, `P42/spec.md:176`).
  - The fixture's SHA-256 is recorded in the report, so a verdict is tied to one row set
    (`S:1400`, `P/spec.md:185`).
  - The baseline is chosen on the same rows it is scored on, so a fixture with a runaway
    `read_code` share prints `no headroom` and no arm runs (`P/spec.md:187`, `S:1411-1413`).
