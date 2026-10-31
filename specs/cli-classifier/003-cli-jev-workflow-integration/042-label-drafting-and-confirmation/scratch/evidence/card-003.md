# Labeling card 003 — goal-verifier-jev-shadow

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow/`.

## 1. Question

Did each recorded goal-verification turn actually meet its goal, fail to, or stand blocked —
the truth the three zero-call arms and any later model arm are measured against
(`spec.md:87` Purpose; `spec.md:160` REQ-001; `spec.md:173` reads the rate off rows labeled `met`).

## 2. Rubric

The phase never writes a prose rubric; the label is the operator's ground truth for a turn. The
heuristic's own reason categories are the closest the spec comes to definitions
(`.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs:65-71`):

| Value | Meaning (paraphrased from the scorer's own categories) | Citation |
|-------|--------------------------------------------------------|----------|
| `met` | The turn's evidence gives an explicit completion signal tied to the goal objective. | `score-verifier-labeled-set.cjs:71` |
| `not_met` | The turn does not prove completion: evidence too short, blocking or incomplete-work language, evidence that looks truncated, no completion signal, or a weak link to the objective. | `score-verifier-labeled-set.cjs:65-71`; `spec.md:164` |
| `blocked` | The row records a turn whose work could not proceed; a verifier that throws becomes `blocked` at confidence 0. | `spec.md:83` |

**UNDEFINED — the operator must decide:** what turn evidence distinguishes `blocked` from
`not_met`. The spec says only that the heuristic never returns `blocked` and that a thrown verifier
becomes one (`spec.md:83`); it gives a labeler no marker for it.

**UNDEFINED — the operator must decide:** whether a Claude row's `prelabel` (Claude Code's native
goal judge, which is a model) may inform the label. Claude rows carry it
(`spec.md:160`), `goal.md:61` D6 says no model writes a label, and
`implementation-summary.md:90` records the conflict; the operator adjudicates disagreements and
spot-checks agreements (`spec.md:249`).

Edge cases the spec names:

- Pi records no `met` turn, so the census's `met` count reads "not recorded" (`spec.md:159`).
- The labels file may spell `not-met`; it normalizes to `not_met` (`spec.md:164`, `spec.md:205`;
  aliases at `score-verifier-labeled-set.cjs:44-49`).
- goal-core's `unclear` is not a label and keeps its own report row; it folds to `not_met` only
  inside the two-class table (`spec.md:164`).
- A row labeled `blocked` that the wrapper rule holds is reported in its own line and does not
  count against the keep rule's item (c) (`spec.md:204`).
- Exit 1, exit 2 or an answer outside `met`/`not_met`/`blocked` makes the row `unmeasured`
  (`spec.md:201`).
- The scorer has no stale-label notion here: a row carries its own turn text, so a label can only
  go stale by editing the row (`score-verifier-labeled-set.cjs:137-186`).

## 3. Label values

Exact strings the scorer accepts, as it folds them (`score-verifier-labeled-set.cjs:44-49`):
`met`, `not_met`, `not-met` (folded to `not_met`), and `blocked`. An empty or absent label reads
`unlabeled` and keeps the row out of the labeled side (`:88-93`, `:184`). Any other value is an
error naming the row id and the file exits 1 (`:172-173`, `:441-445`).

## 4. Rows

- **Rows file:** `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` (`spec.md:130`),
  untracked and kept out of every commit, and listed in the repository's local
  `.git/info/exclude`. It is **absent in this worktree**; the scorer exits 2 on it today
  (`score-verifier-labeled-set.cjs:435-439`).
- **id field:** `id`, a non-empty string (`pi-<12 hex>` or `claude-<12 hex>`); the loader requires
  `id`, `source` (`pi` or `claude`), `objective`, `raw_text`, `ingested_text`, `raw_length` and
  `label` (`:169-186`).
- **Draw command (no seed):**
  `node .skilled/hooks/goal/lib/build-verifier-fixture.cjs --pi ~/.pi/agent/sessions --out .skilled/hooks/goal/lib/verifier-labeled-set.jsonl`
  The default limit is 50 (`build-verifier-fixture.cjs:28`), the deal is deterministic (a fixed
  category order feeds a round-robin, `:36-38`), and the builder refuses to overwrite an existing
  output (`:403-406`). The phase's own run wrote 50 Pi rows and 0 Claude rows
  (`implementation-summary.md:92`, `:100`).
- **What a labeler reads per row:** the row's own `objective` and `raw_text` in the rows file — no
  transcript turn is opened, because the builder copies the turn text into the row
  (`build-verifier-fixture.cjs:301-323`). `prelabel` exists only on Claude rows.

## 5. Label file

- **Path:** the rows file itself — `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl`
  (`spec.md:130`). It lives inside the repository tree but stays untracked; the operator decides
  whether it is ever committed (`spec.md:130`) and strips secrets before any Jev call
  (`goal.md:61`).
- **JSON shape:** JSONL, one row per turn: `id`, `source`, `objective`, `raw_text`,
  `ingested_text`, `raw_length`, `heuristic_recorded`, `recorded_reason`, `prelabel`, `label`.
- **Label field:** `label`. **There is no labeler field** in this schema
  (`build-verifier-fixture.cjs:301-323`); the scorer reads none, and unknown keys are ignored
  (`score-verifier-labeled-set.cjs:169-186`).
- **Confirmed row:** the row above with `label` set to the operator-confirmed value, e.g.
  `{"id":"pi-1a2b3c4d5e6f","source":"pi","objective":"…","raw_text":"…","ingested_text":"…",
  "raw_length":1300,"heuristic_recorded":"not_met","recorded_reason":"…","prelabel":"","label":"not_met"}`.
- **Confirmation:** two models draft each row separately; where the drafts agree the row is
  pre-filled for the operator to approve, and where they differ the operator picks. Only the
  operator-confirmed value may reach the `label` field, because the parent goal reads a scorer
  only rows the operator confirmed (`../goal.md:50` D4) and records the drafting rule in its
  2026-10-01 amendment (`../goal.md:257`).

## 6. Gate

- **Needs:** 30 labeled rows (`score-verifier-labeled-set.cjs:37`, `MIN_ROWS = 30`). No per-class
  minimum.
- **Stop line below the gate:** `stop: fewer than 30 rows` (`:447-449`, exit 0, no arm runs).
- **Run:** `node --preserve-symlinks .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs --set .skilled/hooks/goal/lib/verifier-labeled-set.jsonl`
  (`implementation-summary.md:105`). The `--preserve-symlinks` flag is needed in this worktree
  because the scorer loads the plugin through the `.skilled/plugins` link and there is no
  `.opencode/node_modules` here (`implementation-summary.md:105`, `:211`). `--out` is optional and
  writes `zero-call-report.txt` (`score-verifier-labeled-set.cjs:462-464`).
