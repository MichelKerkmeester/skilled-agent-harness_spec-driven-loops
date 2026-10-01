# Labeling card 006 — goal-criteria-lint

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/`, called
`P` below. Scorer: `.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs`, cited as
`S:NN`; the lint it joins against is `.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs`,
cited as `L:NN`. Inventory: `label-inventory-1.md` in this evidence folder. Phase 42 spec:
`specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/`, cited as
`P42/`. Facts were read on 2026-10-01 at HEAD `ebcc68e8edb42bc736cf52ecb89c1997f5c84e82`.

## 1. Question

One row decides, for one criterion line in a packet `goal.md`, whether the line breaks rule 4
(it cannot be read on its own) and whether it breaks rule 5 (it cannot be checked without
opening another file), under a rubric the operator adopts first — the labels the lint's
per-rule precision, recall and F1 are measured against. The phase's purpose is "Give rules 4
and 5 a measured, advisory lint whose precision and recall are known against the operator's own
labels, at zero model calls and with `check-goal.cjs` untouched" (`P/spec.md:78`), and rule 4
asks for self-contained criteria while rule 5 asks that each be checkable from its own text
(`P/spec.md:72`).

## 2. Rubric

The evidence per row is the criterion bullet at the row's `id`, read against the adopted
rubric's two definitions: "The rubric is question 34 in research section 12, and only the
operator adopts it. Labels mean nothing until it is written, because the five recorded base
rates each measure a different failure definition" (`P/spec.md:132`). The candidates the phase
carries, each judged by the operator's chosen rule-4 and rule-5 failure definitions
(`P/spec.md:134-139`):

| Rubric | Candidate | Rule 4 fails when | Rule 5 fails when |
|--------|-----------|-------------------|-------------------|
| A | Strict referent resolution (mimo-02 strict, `mimo-02-strict-v1`) | The line holds a pronoun, a definite description or jargon whose meaning needs text outside the line. Naming a path, a command or the packet itself resolves locally. | Deciding pass or fail needs the content of another document, as opposed to running a named command, counting named paths or checking a stated property of a named artifact. |
| B | Lenient (mimo-02 lenient) | Only a referent that cannot be resolved from the line or the packet fails. | As A. |
| C | Strict regex for explicit references (council seat-002) | Explicit lexical references only, such as "as described in" or a file reference. | As rule 4. |
| D | One-lens reading (council seat-003) | One reader's judgment. | One reader's judgment. |

Citations: rows A to D at `P/spec.md:136-139`; the table's column meanings at `P/spec.md:134-135`.

UNDEFINED: which rubric is adopted. "**Adopted rubric:** not yet chosen. Task T001 is the
operator's and falls at the label gate (parent D4). The build runs under A until then, and no
label is written before the operator adopts one" (`P/spec.md:143`). The operator adopts one of
A to D **or writes a third**, and records its id and its two rule definitions before the first
label (`P/tasks.md:43`). A (`mimo-02-strict-v1`) is the working default and is the id the
built lint implements; the other candidates would retune the lint's rule patterns after the
gate (`P/spec.md:141`, `P/spec.md:215`), not the two label columns. The scorer refuses a
labels file that carries two different rubric ids: `rubric mismatch: <ids>` and no rate
(`S:146-148`, `S:207-210`).

Edge cases the spec names:

- A goal with no criteria anchor falls back to a "Completion Criteria" heading; with neither,
  the file yields zero criteria, is counted as `no_input` and prints one `no_input <path>` line,
  counting toward no rate (`P/spec.md:170`, `L:191-198`, `L:396`, `L:510`).
- Binding rows sit in the binding anchor and are table rows, so they are never linted; a
  parent criterion naming child goal files is linted like any other line and whether "every
  child" is self-contained is the rubric's call, settled by the labels (`P/spec.md:171`).
- Criteria outside the 3-to-7 range: `check-goal.cjs`'s `criteria-count` owns that finding; the
  lint still lints every line it finds and adds no exit code of its own (`P/spec.md:172`).
- Non-English text: both rules are English lexical patterns, so such a line is reported as
  `lexical_unscored` and counted apart, never as a pass (`P/spec.md:173`, `L:305`).
- A template placeholder bullet such as `[Another]` is reported as `placeholder` and left out
  of the rates (`P/spec.md:174`, `L:300`).
- A goal edited after labeling changes the line's hash: the label goes to `stale=` and out of
  every rate (`P/spec.md:175`, `S:150-164`, `S:214`).
- A labeled row with a null `rubric` is still scored (`S:144`, `S:182`), so an adopted id must
  be written on every labeled row; a null among ids prints `rubric mismatch` (known P2 in
  `P/goal.md` log, "Finding: six review P2s open").

## 3. Label values

Exact values the scorer accepts, per row (`S:29-31`, `S:136-194`):

- `rule4_ok`: `true` or `false`. **`false` means the line violates rule 4**; `true` means it
  does not. The scorer compares `predicted: record.rule4.length > 0` against `actual:
  row.rule4_ok === false`, and the fixture test pairs a flagged rule-4 record with
  `rule4_ok: false` to produce `rule4 tp=1` (`S:166-169`, `score-goal-lint.test.cjs:39-51`,
  `:65`). The field name reads the same way: `rule4_ok` is true when the line is okay.
  Note for the labeler: the inventory's phrasing at `label-inventory-1.md:116` reads `true` as
  the violation; the scorer and the test read `false` as the violation (`S:166-169`).
- `rule5_ok`: `true` or `false`, with the same polarity for rule 5 (`S:170-173`, `S:175`).
- A row counts as labeled only when **both** `rule4_ok` and `rule5_ok` are booleans;
  `null` on either leaves the row unlabeled (`S:29-31`, `S:142-143`).
- The rate counts a joined row as a violation when either boolean is `false` (`S:175`).
- `rubric`: the adopted rubric's id, a string. The file prints `rubric=none` when no labeled
  row carries one (`S:212`); a mixed file prints `rubric mismatch: <ids>` and no rate
  (`S:207-210`).
- `labeler`: a free string; nothing validates it and the scorer never reads it (`S:48-71`).

No model may write a label on the drawn sample or elsewhere in the population; synthetic labels
exist only inside the scorer's tests, on fixture lines (`P/spec.md:103`; D2 at `P/goal.md:59`).
Phase 42 records the operator's confirmation in this feature's decisions log.

## 4. Rows

- Rows file: `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl`,
  **inside the repository and committed** (`P/spec.md:113`, `P/implementation-summary.md:88`).
  It exists today: 100 rows, every label field `null` (`P/implementation-summary.md:74`;
  checked on disk, 100 lines). No draw is needed: 006 uses rows that exist
  (`P42/spec.md:183`).
- id field: `id`, a `path:line` pair — the repo-relative goal path and the 1-based line of the
  criterion bullet (`P/spec.md:161`, `P/implementation-summary.md:74`).
- Draw command, recorded for a redraw only (no seed needed at read time):
  `node specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build/draw-labels.cjs 20260928 100 <out.jsonl> <summary.json>`
  Usage at `draw-labels.cjs:9`; the recorded draw is seed **20260928** over 21 strata, by track
  group and goal kind, from 1,357 distinct scored hashes (`P/implementation-summary.md:74`,
  `draw-labels.cjs:19-20`, `:74`). It draws scored lines only, one row per distinct
  `text_sha12` (`draw-labels.cjs:51`).
- Per row, what a labeler must open and read, and how to resolve it to text:
  1. Split `id` at the last colon into path and line, open the path from the repository root,
     and read that line: the criterion bullet. The rows carry no criterion text, by design
     (`P/spec.md:161`; D5 at `P/goal.md:62`).
  2. Read the line against the adopted rubric's two rule definitions, then write the two
     booleans. `text_sha12` checks the line has not moved: it is the first 12 hex characters of
     the sha256 over the criterion item's text as the parser extracts it — the bullet marker and
     `[ ]`/`[x]` checkbox stripped and trailing whitespace trimmed (`L:204-213`).
  3. A row whose line no longer matches its hash is `stale=` and leaves every rate; the label
     still may be written, but it scores nothing until the goal is restored (`P/spec.md:175`,
     `S:150-164`).
- Content kind: packet `goal.md` criterion lines — repository spec-doc text, not private
  (`P/spec.md:161`, `label-inventory-1.md` item 6).
- File hash at the card step: `sha256 = a894d36672e121d066d60935532846c6d1f834bea3133a20e2d4b281973eac3d`
  (100 rows, computed 2026-10-01). It changes only when the operator's answers are written
  (`P42/spec.md:175` REQ-008 hash boundary).

## 5. Label file

- Path: exactly `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` —
  the rows file is the label file. Phase 42's Files to Change lists this exact file for 006:
  "all 100 rows filled under one adopted rubric, operator-confirmed" (`P42/spec.md:148`). The
  scorer reads it by `--labels`; `--labels` is required and every other option is optional
  (`S:260-272`).
- Shape: JSON Lines, one row per line: `{id, text_sha12, rubric, rule4_ok, rule5_ok, labeler}`
  (`P/spec.md:161`; the file on disk carries exactly these six keys).
- Label fields: `rule4_ok` and `rule5_ok` (the two booleans, `false` = violation) plus `rubric`
  (the one adopted id). Labeler field: `labeler` (free string) (`S:48-71`, `S:136-148`).
- A confirmed row, e.g.:
  `{"id":"specs/cli-external-orchestration/071-cli-hermes-creation/002-hermes-contract-pin/goal.md:88","text_sha12":"aa58be3aa323","rubric":"mimo-02-strict-v1","rule4_ok":false,"rule5_ok":true,"labeler":"<operator>"}`
  with both booleans set and the adopted rubric id present, so the row joins the rate
  (`S:142-148`).
- Who writes it and what makes a row confirmed: only the operator fills the label fields,
  after the label gate (`P/spec.md:161` REQ-008; D2 at `P/goal.md:59`), and no model writes a
  label (`P/spec.md:103`, `P/spec.md:132`). Under phase 42 two models draft each row blind to
  each other and only the operator-confirmed value may enter the file (`P42/spec.md:42`,
  `P42/spec.md:172`, D1 and D2 at `P42/goal.md:49-50`); the two labelers are Luna 6 max on
  `cli-codex` and SWE 2 max on `cli-devin`, and neither writes a label file
  (`P42/spec.md:80`, `P42/spec.md:184`).
- Outside the repository: no. The rows are repository text, so the file stays at its in-repo
  path and is committed (`P42/spec.md:156`).

## 6. Gate

- Count: there is **no numeric row gate**. The scorer needs at least one labeled row to print a
  rate; with none it prints `rows=<n> rubric=none unlabeled=<n> stale=<n> not_scored=<n>
  labeled=0` then `no labeled rows` and exits 0 (`S:204-221`). The phase's operator target is
  all 100 rows (`P/goal.md:124`; `P42/spec.md:51`).
- Per-class minimum: none. Rule 4 and rule 5 are reported separately with their own TP, FP, FN,
  TN, precision, recall and F1 (`S:223-234`).
- Below the gate: `no labeled rows` (`S:218-221`), exit 0. Today's run prints `rows=100
  rubric=none unlabeled=100 stale=0 not_scored=0 labeled=0 no labeled rows` and no rate
  (`P/implementation-summary.md:76`, `:148`).
- Stop line: `r20 model arm not built: labeled_violation_rate<0.05` (`S:23`, printed at
  `S:242`) when the joined violation rate falls under 0.05. Kernel of the phase's stop rule:
  below 0.05 the arm is not built on either backend (`P/spec.md:163`, `P/spec.md:180`).
- Mixed rubrics: `rubric mismatch: <ids>` and no rate (`S:146-148`, `S:207-210`;
  `P/implementation-summary.md:152`).
- Zero-call command:
  `node .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs --labels .skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl`
  (`S:255-274`). It runs the lint in process over the active tree, or reads a saved
  `--all --json` run with `--lint <file>` (`S:308-320`). The built scorer accepts only
  `--labels`, `--lint` and `--root`, and an unknown option is a hard error (`S:260-268`), so no
  `--jev` or `--deem` is passed and none is accepted: the conditional arm those requirements
  describe was not built in this phase (`P/spec.md:59`), and phase 42 runs no switched arm
  (D4 at `P42/goal.md:52`).

## 7. Drafting content (035 and 031 only)

Not applicable. Those phases draft planted sentences and fixture rows. This phase drafts no
content.
