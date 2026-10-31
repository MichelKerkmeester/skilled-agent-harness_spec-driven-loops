# Labeling card 020: routing-clarify-default

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/`.

## 1. Question

When a compiled hub router answers `clarify`, which workflow mode should have handled the request —
one of the mode alternatives the router listed, or none of them — the truth the model-or-first-
alternative question is decided on (`spec.md:78`, `spec.md:90-91`; `goal.md:53` D3).

## 2. Rubric

The phase defines the label as a pick from the row's own option set, not as prose
(`spec.md:91`; `spec.md:135` REQ-002):

- A labeled row has an operator `label` or a committed `gold`, and **its value is one of the row's
  alternatives or `none_of_these`** (`spec.md:91`).
- The row's `gold`, when present, is the hub playbook scenario's committed
  `expected_workflow_mode` and counts only when it names one of the row's alternatives
  (`goal.md:53` D3; `spec.md:74`, `spec.md:90`; `score-clarify-default.cjs:467-491`).
- A label does not need a prose reason: the scorer only checks membership in
  `[...row.alternatives, 'none_of_these']` (`score-clarify-default.cjs:474-490`).

**UNDEFINED — the operator must decide:** nothing in the phase says a labeler should weigh the
router's own score, the hub's description or the request text. The operator decides what makes one
listed mode "the" mode for the prompt; the phase only fixes the option set.

Edge cases the spec names:

- A label outside the row's alternatives and `none_of_these` is rejected by row id with exit 2
  (`spec.md:135`; `score-clarify-default.cjs:1377-1382`).
- `none_of_these` is a valid, counted answer (`NONE_KEY = 'none_of_these'`,
  `score-clarify-default.cjs:30`).
- A row whose committed `gold` names no alternative is not a labeled row
  (`score-clarify-default.cjs:467-491`).
- Operator labels and committed gold count together; the scorer prints them apart
  (`rows: <n> labeled=<K> operator=<O> committed_gold=<G>`, `:1384-1387`).

## 3. Label values

Exact strings the scorer accepts (`score-clarify-default.cjs:474-490`, check at `:484`):

- any one of the row's own `alternatives` strings (the mode ids the router listed, e.g.
  `cli-claude-code`, `cli-codex`, `sk-create-command`), or
- `none_of_these` (`NONE_KEY`, `:30`).

An empty `label` is not a label; the row then falls back to its `gold` when that names an option
(`:469-472`).

## 4. Rows

- **Rows file:** the operator's `--rows-out <file>` from the census; the committed copy of the
  build's run is
  `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/runs/census/rows.jsonl`
  (2 rows; `implementation-summary.md:71` records that in-repo path as a deviation from the
  operator-named one).
- **id field:** `id`, e.g. `semantic-tie-clarify`, `one-turn-clarify`.
- **Draw command (no seed):**
  `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --report <dir> --rows-out <file> [--transcripts <dir>]`
  (usage at `score-clarify-default.cjs:38`; rows written at `:1490-1496`). The replay is
  deterministic over the fixed corpus — canary cases, hub playbook scenarios and the advisor corpus
  — so the same tree yields the same rows (`:112-165`, `:1459-1471`); there is no seed flag. The
  phase's own finding is that this corpus holds only 2 mode-alternative rows, so 30 cannot be
  reached from committed prompts alone (`spec.md:74`; `implementation-summary.md:60`, `:71`).
- **What a labeler reads per row:** the row's own `prompt` (the committed canary/playbook prompt
  text), its `alternatives` (mode ids), and `hub` (which router was replayed) — all inline in the
  row (`spec.md:90`). No external file is opened.

## 5. Label file

- **Path:** the rows file itself (`--score <rows file>`, `score-clarify-default.cjs:1449`). The
  operator names it; the committed copy above is where the build's 2 rows live.
- **JSON shape:** JSONL, one row per clarify row:
  `{id, hub, source, prompt, alternatives, gold, label}` (shape written at
  `score-clarify-default.cjs:351-360`; the rows on disk carry exactly these keys).
- **Label field:** `label` (a string). **There is no labeler field** in this schema
  (`score-clarify-default.cjs:351-360`).
- **Confirmed row:**
  `{"id":"semantic-tie-clarify","hub":"cli-external-orchestration","source":"canary","prompt":"extended thinking with a codex diff review","alternatives":["cli-claude-code","cli-codex"],"gold":null,"label":"cli-codex"}`.
- **Confirmation:** two models draft each row separately; where the drafts agree the row is
  pre-filled for the operator to approve, and where they differ the operator picks. Only the
  operator-confirmed value may reach `label`, because the parent goal reads only rows the operator
  confirmed (`../goal.md:50` D4; drafting rule at `../goal.md:257`). The phase's own rule: labels are
  the operator's, past the gate, and no model writes one (`spec.md:103`, `goal.md:53`).

## 6. Gate

- **Needs:** 30 labeled rows (`LABEL_GATE = 30`, `score-clarify-default.cjs:44`). No per-class
  minimum.
- **Stop line below the gate:** `stop: fewer than 30 labeled rows (<n> labeled)`
  (`score-clarify-default.cjs:1389-1392`, exit 0, no arm runs even behind `--jev`/`--deem`).
- **Run:**
  `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score <rows file> [--jev|--deem --out <dir>]`
  (`:1449`; `--jev`/`--deem` without `--out` exits 2 before any output, `:1447-1450`).

**Blocked — unblock condition.** The corpus cannot produce 30 mode-alternative clarify rows: the
census wrote 2 over 359 committed prompts and no code path turns an operator-named transcript
directory into rows (`spec.md:74`; inventory 1, 020 item 5). Unblocked by a row source that yields at
least 30 labeled rows — transcript-backed rows the loader accepts, or 30 hand-picked prompts — after
which this gate can be filled.
