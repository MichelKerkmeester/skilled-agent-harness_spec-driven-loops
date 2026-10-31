# Label card: 023-reply-harness-blinded-judge

One card for the operator who fills the label gate. Phase folder:
`specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/`, called `P`
below. Scorer: `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs`,
cited as `S:NN`. Rubric:
`.skilled/skills/sk-communication/benchmark/reply-harness/rubric.json`, cited as `rubric.json:NN`.
Inventory: `label-inventory-2.md` in this evidence folder. Phase 42 spec:
`specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/`, cited as
`P42/`. Facts were read on 2026-10-01 at HEAD
`ebcc68e8edb42bc736cf52ecb89c1997f5c84e82`.

## 1. Question

One row decides, on all seven rubric dimensions, whether the operator grades a masked
reply-harness reply `absent`, `partly met` or `fully met`, and twenty distinct graded replies are
the gate that opens the Jev or Deem arm, which measures whether a model judge agrees with the
operator more often than the harness's mechanical scores do (`P/spec.md:74`, `P/spec.md:131`,
`P/spec.md:159`).

## 2. Rubric

What is graded. One masked file: its `Case: <id>` line, the case question, then the `Reply A:` or
`Reply B:` block (`S:69-73`). A committed example is
`specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs/blind/C1-A.md`.
The model judge receives the same full masked text (`P/spec.md:200`).

The seven dimensions, each with its own grading text in `rubric.json`:

| Dimension id | What its `judgeGuidance` asks the grader to weigh |
|---|---|
| `answer-position` (`rubric.json:6`, guidance `:9`) | where the answer sits. Leading with the concrete artifact ranks high, opening with a restatement, a plan or background ranks low |
| `next-action-honesty` (`:12`, guidance `:15`) | what the reply promises happens next. A reply that declares something open must name one genuinely open step, and an invented step ranks low |
| `receipts` (`:18`, guidance `:21`) | the evidence order. A command and its exit status or result ahead of any reading of what they mean |
| `tone` (`:24`, guidance `:27`) | the error manner. No softener, no apology, still a concrete next step |
| `tangent-suppression` (`:30`, guidance `:33`) | where side remarks go. Zero tangent sentences in the body, and a surfaced tangent only inside a clearly labeled deferred line |
| `completeness-under-cap` (`:36`, guidance `:39`) | the lists. No group of items runs past five and nothing asked for was dropped |
| `mechanical-tells` (`:42`, guidance `:45`) | the machine-checkable finish. Scanner findings by severity, all subtracted from one |

Levels. The rubric's scale runs "from 0, absent, to 1, fully met" (`rubric.json:3`), and the
scorer's three accepted strings are `absent`, `partly met`, `fully met` (`S:45`). The mechanical
baseline's own mapping is 0 to `absent`, 1 to `fully met` and anything between to `partly met`
(`P/spec.md:130`). That mapping belongs to the baseline, not to the operator's read.

UNDEFINED: the spec fixes no cutoff between `partly met` and `fully met`. Each dimension's
guidance describes what ranks low and the three level names carry no thresholds. The operator
must decide the cutoff and apply it consistently across rows, because the scorer only checks that
the value is one of the three strings (`S:283`). The phase records the same open question
(`P/spec.md:213`).

Edge cases the spec names:

- A graded reply without a `score.mjs` baseline is dropped from the labeled count and reported.
  The census prints `no baseline: 1` today (`S:1380-1382`, `S:1389-1393`,
  `P/implementation-summary.md:67`, `P/implementation-summary.md:80`). So 37 of the 38 distinct
  replies are eligible, and any 20 of them suffice (`label-inventory-2.md`).
- Two rows whose replies share a SHA-256 must grade the same, else `stop: label conflict`, exit 2
  (`P/spec.md:131`, `S:317-318`, `S:1369-1371`). One reply can appear in more than one masked
  file, so a shared reply is graded once and consistently (`S:290-291`).
- The `masked` path must name a masked file the census saw, else exit 2 naming the row (`S:307`).
- A missing dimension, an unknown dimension or a value outside the three strings exits 2 naming
  the row (`S:277`, `S:280`, `S:283`).
- The `masked` path is resolved from the repository root (`S:273`, `S:305`).
- The blocking class is not graded here. The phase grades the seven weighted dimensions only
  (`P/spec.md:212`).

## 3. Label values

- `masked`: non-empty string, a path relative to the repository root (`S:273`).
- `grades`: an object with exactly the seven dimension ids as keys, each value exactly `absent`,
  `partly met` or `fully met` (`S:276-283`, dimension ids at `rubric.json:6` to `:42`). The string
  `partly met` carries the space.
- There is no labeler field. The scorer reads none and reports the labels file's SHA-256 instead
  (`S:398`).
- Confirmed row shape, with illustrative grade values:
  `{"masked":"specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs/blind/C1-A.md","grades":{"answer-position":"fully met","next-action-honesty":"fully met","receipts":"partly met","tone":"fully met","tangent-suppression":"absent","completeness-under-cap":"fully met","mechanical-tells":"partly met"}}`

## 4. Rows

There is no rows file. The rows are the masked files, which exist and are tracked: 42 `.md` files,
14 in each of three directories, named `<caseId>-<A|B>.md` for cases `C1` to `C6` and `NC1`
(`P/spec.md:48`, verified on disk and with `git ls-files`). The three directories, under
`R = specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs`:

- `R/blind/`
- `R/sonnet/blind/`
- `R/attempt-1/blind/`

- id field: `masked`, the repo-relative file path.
- Census command, the phase's proof 1 (`P/spec.md:181`):

  `node .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs --masked R/blind --masked R/sonnet/blind --masked R/attempt-1/blind --replies R/before-replies --replies R/after-replies --replies R/sonnet/before-replies --replies R/sonnet/after-replies --replies R/attempt-1/before-replies --replies R/attempt-1/after-replies`

  Run it from the repository root with `R` written out. The labeling run adds
  `--labels <file>` (`S:1235`).
- If the corpus were missing, the commands are `node generate-prompts.mjs ...` then hand-run
  replies then `node score.mjs ...` then
  `node blind.mjs --a <before replies dir> --b <after replies dir> --out <masked dir>`
  (`README.md:25-28`). No seed exists, because A and B are assigned with `Math.random() < 0.5`
  (`blind.mjs:60`), so a redraw is not reproducible. No draw is needed, because the three
  committed runs exist.
- Per row, what to open and read: the masked file at the row's `masked` path. The `Case:` line
  carries the case id, the next block is the case question, and the graded reply is everything
  after the `Reply A:` or `Reply B:` line, trimmed (`S:70-72`). Grade that reply on each of the
  seven dimensions by that dimension's `judgeGuidance` (`rubric.json:9`, `:15`, `:21`, `:27`,
  `:33`, `:39`, `:45`).
- Content kind: the three runs are committed in this public repository, so the text is not
  private (`P/spec.md:201`). The Jev payload class prints as committed masked replies
  (`P/spec.md:135`). An untracked masked file would need `--accept-payload` before Jev
  (`P/spec.md:135`).

## 5. Label file

- Path: operator-named, `--labels <file>` (`S:1235`, parsed at `S:1324`, read at `S:1360`). There
  is no default path. The file is read only and the scorer never writes it. Phase 42 fixes its
  exact path before the first draft (`P42/spec.md:145`) and proposes a location outside the
  repository (`P42/spec.md:292`). The literal path is the operator's to name (`P42/spec.md:292`).
  UNDEFINED until the operator names it.
- Shape: JSON Lines, one row per graded masked file, with fields `masked` and `grades`
  (`P/spec.md:131`, `S:259-288`).
- Label field: each `grades[<dimension-id>]`. There is no labeler field, and the scorer validates
  none.
- A confirmed row: the operator approved its grades, its `masked` path names a masked file in the
  census, all seven ids are present with an accepted level, and any other row grading the same
  reply text carries the same grades (`P42/spec.md:161`, `S:276-283`, `S:317-318`).
- Who writes it and what makes a row confirmed: the operator confirms every row, and a model
  never writes the file. Under phase 42 two models draft each row blind to each other and only
  the operator-confirmed value may enter a label file (`P42/spec.md:42`, `P42/spec.md:160-161`,
  D1 and D2 at `P42/goal.md:49-50`). The phase's own rule stands: the operator grades every
  labeled reply, and a model-written grade is out of scope (`P/spec.md:95`, D3 at
  `P/goal.md:50`).
- Outside the repository: the labels file is operator-named and may live anywhere. The report
  directory is also operator-named, and REQ-008 allows it inside the repository (`P/spec.md:135`).
  `--jev` or `--deem` without `--out <dir>` exits 2 before any call (`S:1344`).

## 6. Gate

- Count: `LABEL_GATE = 20` graded distinct replies (`S:48`). The counted set is `labeled.size`,
  distinct matched replies that also carry a `score.mjs` baseline (`S:386`, `S:1374-1395`).
- Per-class minimum: none. The spec asks for 20 graded distinct replies and sets no class split
  (`P/spec.md:131`).
- Below the gate: `stop: fewer than 20 labeled replies`, exit 0. A requested arm also prints
  `jev arm skipped: label gate` or `deem arm skipped: label gate` (`S:409`, `S:1433`, `S:1449`).
- Conflict: `stop: label conflict`, exit 2 (`S:1369-1371`).
- Above 0.90 baseline agreement: `no headroom`, and neither arm calls (`S:410`, `P/spec.md:159`).
- Today the census prints 42 masked, 38 distinct, 38 matched, `no baseline: 1`, `labeled: 0`, so
  0 of 20 (`P/implementation-summary.md:63-77`, `label-inventory-2.md`).

## 7. Drafting content (035 and 031 only)

Not applicable. Those phases draft planted sentences and fixture rows. This phase drafts no
content.
