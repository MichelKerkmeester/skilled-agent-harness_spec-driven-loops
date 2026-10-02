# Labeling card 022: alignment-folder-suggestion

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/`.

## 1. Question

When an alignment save lands below 50 and lists folders, which folder should the save have gone
to — the target, one of the listed alternatives, or none of them — the truth the
model-or-free-answer question is decided on (`spec.md:92`, `spec.md:117`; `goal.md:51` D3).

## 2. Rubric

The phase defines the label as a pick from the row's own option set (`spec.md:117`;
`spec.md:159` REQ-002; `goal.md:51`):

- A labeled row has an operator `label` or a `gold` pick, and **its value is the target, one of the
  alternatives, or `none_of_these`** (`spec.md:117`).
- `gold` is an interactive pick when the transcript holds one (`spec.md:114`); a non-empty label
  wins over `gold` (`score-alignment-suggestion.ts:564-569`).
- A row with `state` `null` is counted but never called (`spec.md:117`; the callable gate below).

**UNDEFINED — the operator must decide:** what makes one listed folder right. The spec names only
the option set and the two free answers the model must beat — staying with the target and taking the
top-scored alternative (`spec.md:118`) — and says nothing about how the labeler should weigh the
session summary or the folder descriptions.

Edge cases the spec names:

- A label outside the row's options is rejected: `foreign label in rows: <ids>` and exit 2
  (`spec.md:159`; `score-alignment-suggestion.ts:1375-1381`).
- An empty label falls back to `gold` when `gold` names an option
  (`score-alignment-suggestion.ts:564-569`).
- A row whose `state` is null or empty counts in `state_null` and cannot be called
  (`score-alignment-suggestion.ts:1383-1390`).
- Rows, reports and `--out` paths must be **outside the repository**; any in-repo path is refused
  with exit 2 before any output (`score-alignment-suggestion.ts:1343-1352`;
  `implementation-summary.md:74`; `goal.md:51`).

## 3. Label values

Exact strings the scorer accepts (`score-alignment-suggestion.ts:559-579`):

- the row's `target` folder,
- any one of the row's `alternatives` folders, or
- `none_of_these` (`NONE_KEY`, `:62`).

An empty `label` is not a label; the row then falls back to `gold` when that names an option
(`:564-569`).

## 4. Rows

- **Rows file:** the operator's `--rows-out <file>`, which must sit outside the repository
  (`score-alignment-suggestion.ts:1327-1330`, `:1343-1352`). No rows file exists today; the
  committed tree yields 0 events with alternatives (`implementation-summary.md:60`, `:144`).
- **id field:** `id`.
- **Draw command (no seed):**
  `npx tsx evals/score-alignment-suggestion.ts --transcripts <dir> --rows-out <file>`
  run from `.skilled/skills/system-spec-kit/runtime/cli` (`implementation-summary.md:140`;
  `--rows-out` requires `--transcripts` at `:1327-1330`). The draw is a filtered scan in transcript
  order, so the same directory always yields the same rows — there is no seed
  (`:1496-1511`). Each row is one `low`/`infrastructure` event that listed alternatives
  (`spec.md:111-114`), and there are 0 such events in the committed tree
  (`implementation-summary.md:144`).
- **What a labeler reads per row:** the row's `target` folder, its `alternatives`, and its `state`
  — the session summary extracted from the operator's own transcript
  (`extractSessionSummary` at `score-alignment-suggestion.ts:414-428`); `path` says which save path
  (cli or data) produced it. All are inline in the row; the row's text is private session content
  (`spec.md:170`).

## 5. Label file

- **Path:** the rows file itself — `--score <rows file>` (`score-alignment-suggestion.ts:1331-1334`),
  at a path the operator names **outside the repository** (`goal.md:51` D3).
- **JSON shape:** JSONL, one row per save event:
  `{id, path, target, alternatives, state, gold, label}` (`Row` at
  `score-alignment-suggestion.ts:511-519`; shape check at `:521-534`). `path` is `cli` or `data`;
  `state` is the save call's `sessionSummary` or `null`; `gold` is an interactive pick or `null`.
- **Label field:** `label` (a string). **There is no labeler field** in this schema
  (`score-alignment-suggestion.ts:511-534`).
- **Confirmed row:**
  `{"id":"…","path":"cli","target":"specs/cli-jev/003-cli-jev-workflow-integration","alternatives":["specs/cli-jev/004-deep-research-expansion","specs/cli-jev/006-goal-criteria-lint"],"state":"…summary text…","gold":null,"label":"specs/cli-jev/004-deep-research-expansion"}`.
- **Confirmation:** two models draft each row separately; where the drafts agree the row is
  pre-filled for the operator to approve, and where they differ the operator picks. Only the
  operator-confirmed value may reach `label`, because the parent goal reads only rows the operator
  confirmed (`../goal.md:50` D4; drafting rule at `../goal.md:257`). The phase's own rule: labels
  are the operator's past the gate, no model writes one (`spec.md:129`, `goal.md:51`).

## 6. Gate

- **Needs:** 30 labeled rows **and** 30 callable rows, where callable means the row carries a
  non-empty `state` (`LABEL_GATE = 30`, `score-alignment-suggestion.ts:58`;
  `:1383-1390`). No per-class label minimum.
- **Stop lines below the gate, in order:**
  `stop: fewer than 30 labeled rows (<n> labeled)` (`:1384`), then
  `stop: fewer than 30 callable rows (<n> with a state)` (`:1388`), exit 0, no arm runs.
- **Run:**
  `npx tsx evals/score-alignment-suggestion.ts --score <rows file> [--jev|--deem --out <dir>]`
  from `.skilled/skills/system-spec-kit/runtime/cli` (`:1331-1341`;
  `implementation-summary.md:140`).

**Blocked — unblock condition.** There are 0 rows and no transcript directory has been named
(`implementation-summary.md:144`; `spec.md:107`). Unblocked by an operator-named transcript
directory that yields at least 30 `low`/`infrastructure` events which listed alternatives, with at
least 30 of them carrying a non-null `state` (`spec.md:242`; inventory 1, 022 item 4).
