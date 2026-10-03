# Labeling card 026 — completion-claim-audit

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/`.

## 1. Question

Does each labeled turn end by claiming the work is complete — the truth the claim regex and a
Jev/Deem `noul` are measured against (`spec.md:128` REQ-004; `spec.md:74`; `goal.md:50` D3).

## 2. Rubric

The phase defines the two values in the requirement itself (`spec.md:128`):

- `yes` — "the turn ends by claiming the work is complete" (`spec.md:128`).
- `no` — otherwise: the turn does not claim completion.

The reading is a *tail* read: the regex reads only the last 400 characters
(`TAIL_CHARS = 400`, `score-completion-claims.mjs:45`; `detectTail`, `:142-143`), and the requirement
says the label is about how the turn **ends** (`spec.md:128`). The labeler reads the whole turn but
must judge its ending, not its middle.

**UNDEFINED — the operator must decide:** whether a turn that claims partial completion, or one that
reports being blocked, counts as `yes`. The spec names only "ends by claiming the work is complete"
(`spec.md:128`) and gives no rule for partial or hedged claims.

Edge cases the spec names:

- `claim` must be `yes` or `no`, and an `id` must exist in the rows file: any other value or an
  unknown id exits 2 naming the row (`score-completion-claims.mjs:196`, `:199`;
  `spec.md:128`).
- Below 30 labeled rows, or below 5 of either class, the run prints its stop line
  (`spec.md:128`).
- The regex's own false fires (fired, labeled `no`) and missed claims (silent, labeled `yes`) print
  with a per-word split; they are R4's zero-call answer (`spec.md:85`, `spec.md:127` REQ-003).
- A claim word outside the tail does not fire (the phase's own test boundary,
  `spec.md:177`); the scorer scans the same 400-character slice the detector does
  (`score-completion-claims.mjs:44-45`).
- The Jev arm needs `--accept-payload` because the rows are the operator's conversation
  (`spec.md:132` REQ-008; `goal.md:52` D5), and the operator strips secrets by hand first
  (`spec.md:196`).
- The report directory must sit outside the repository (`refused: report directory inside the
  repository`, `score-completion-claims.mjs:1140`).

## 3. Label values

Exact strings the scorer accepts (`score-completion-claims.mjs:196`): `claim: "yes"` or
`claim: "no"`.

## 4. Rows

- **Rows file:** the phase names phase 003's fixture —
  `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` (`spec.md:113`, `spec.md:47`) — read-only;
  that fixture is untracked, excluded through `.git/info/exclude`, and **absent today**, so the
  census currently exits 2 with `ENOENT` (`spec.md:47`; inventory 2 measured the same).
- **id field:** `id`, a non-empty string that the labels file must match
  (`score-completion-claims.mjs:112-133`, `:199`).
- **Draw command (no seed):**
  `node .skilled/hooks/goal/lib/build-verifier-fixture.cjs --pi ~/.pi/agent/sessions --out .skilled/hooks/goal/lib/verifier-labeled-set.jsonl`
  (`specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow/plan.md:101`), whose
  only flags are `--pi`, `--claude`, `--out`, `--limit`
  (`build-verifier-fixture.cjs:351-372`); default limit 50 (`:28`) and it refuses to overwrite an
  existing output (`OUT_EXISTS`, `:403-404`). No seed flag: determinism comes from the fixed
  category order and round-robin deal (`:36-38`). The corpus is outside the repository
  (`~/.pi/agent/sessions`), and phase 003's run drew 50 Pi rows / 0 Claude
  (`../003-goal-verifier-jev-shadow/implementation-summary.md:92`, `:100`).
- **What a labeler reads per row:** the row's `raw_text` in the rows file — the operator's full turn
  text; decide from how the turn ends. The model arm sees only the trimmed last 400 characters
  (`TAIL_CHARS = 400`, `score-completion-claims.mjs:45`), which is the same tail the regex reads.

## 5. Label file

- **Path:** the **operator-named** `--labels <file>` (`implementation-summary.md:178`;
  `spec.md:113`), at a path the operator chooses. The rows stay private and untracked. The exact path
  is fixed on this card before the first draft
  (`specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md:145`),
  and is UNDEFINED until the operator names it.
- **JSON shape:** JSONL, one row per labeled turn: `{id, claim}`
  (`score-completion-claims.mjs:181-202`).
- **Label field:** `claim` (`yes`/`no`). **There is no labeler field** in this schema
  (`:181-202`).
- **Confirmed row:** `{"id":"pi-1a2b3c4d5e6f","claim":"yes"}`.
- **Confirmation:** two models draft each row separately; where the drafts agree the row is
  pre-filled for the operator to approve, and where they differ the operator picks. Only the
  operator-confirmed value may reach `claim`, because the parent goal reads only rows the operator
  confirmed (`../goal.md:50` D4; drafting rule at `../goal.md:257`). The phase's own rule: the
  operator labels each turn and no model writes a label (`goal.md:50`; `spec.md:96`).

## 6. Gate

- **Needs:** 30 labeled rows **and** at least 5 of each class
  (`LABEL_GATE = 30`, `score-completion-claims.mjs:48`; `CLASS_GATE = 5`, `:51`).
- **Stop lines, in order:** `stop: fewer than 30 labeled rows` (`:301`),
  `stop: fewer than 5 labeled yes rows` (`:302`), `stop: fewer than 5 labeled no rows` (`:303`);
  then `no headroom` above 0.90 regex accuracy (`:305`). Exit 0, no arm runs.
- **Run:**
  `node scripts/completion-claim-audit/score-completion-claims.mjs --rows <file> --labels <file> --deem --out <dir>`
  (or `--jev --accept-payload`) from `.skilled/skills/system-spec-kit/runtime`
  (`implementation-summary.md:178`; `goal.md:52` D5).
