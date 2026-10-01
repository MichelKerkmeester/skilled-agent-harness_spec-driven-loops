# Label-gate inventory 1

What each label-gated phase needs before its scorer can print a verdict. Read-only: every fact
below comes from the phase docs or from code opened in this worktree, with `file:line`. No model,
`jev` or Deem call was made.

Phases covered: `003-goal-verifier-jev-shadow`, `006-goal-criteria-lint`,
`020-routing-clarify-default`, `022-alignment-folder-suggestion`, all under
`specs/cli-jev/003-cli-jev-workflow-integration/`.

Zero-call commands run for this inventory, from the repo root, and what they returned:

| Command | Observed result | Exit |
|---|---|---|
| `node .skilled/hooks/goal/lib/count-pi-goal-nudges.mjs --dir ~/.pi/agent/sessions` | `totals: sessions_with_nudges=41 nudges=1822 not-met=407 unclear=1415 truncated=431 no_completion=621 weak_link=120 first=2026-07-29 last=2026-08-10` | 0 |
| `node .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs --set .skilled/hooks/goal/lib/verifier-labeled-set.jsonl` | `error: cannot read .skilled/hooks/goal/lib/verifier-labeled-set.jsonl` | 2 |
| `node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --all` | `goals_scanned=349 scored=1629 rule4_violations=1088 rule5_violations=41 lexical_unscored=7 errors=0` | 0 |
| `node .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs --labels .skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` | `rows=100` / `unlabeled=100` / `stale=0` / `labeled=0` / `no labeled rows` | 0 |
| `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/runs/census/rows.jsonl` | `rows: 2 labeled=0 operator=0 committed_gold=0` / `stop: fewer than 30 labeled rows (0 labeled)` | 0 |

Nothing was drawn, labeled, spawned or written by these commands.

---

## 003-goal-verifier-jev-shadow

1. **Scorer path and commands.** Scorer: `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs`
   (declared at `spec.md:131`, 475 lines on disk). Zero-call census:
   `node .skilled/hooks/goal/lib/count-pi-goal-nudges.mjs --dir ~/.pi/agent/sessions`
   (the script at `spec.md:127`; the command at `.skilled/hooks/goal/README.md:182`; positional
   arg parsed at `count-pi-goal-nudges.mjs:218`, dir required at `:219-222`). Label-gated run:
   `node --preserve-symlinks .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs --set .skilled/hooks/goal/lib/verifier-labeled-set.jsonl`
   (`implementation-summary.md:105`, `scratch/w3-build/build-evidence.md:111`; flags at
   `score-verifier-labeled-set.cjs:414-433`; `--out` is optional and writes
   `zero-call-report.txt`, `:462-464`). The `--preserve-symlinks` flag is needed in this worktree
   because the scorer loads the plugin through the `.skilled/plugins` link and this worktree has no
   `.opencode/node_modules` (`implementation-summary.md:105`, `:211`).

2. **Row source.** `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` — inside the repo tree but
   **untracked and uncommitted**: the spec keeps it out of every commit (`spec.md:130`), the build
   recorded `?? ...` on it (`build-evidence.md:83`) and it is listed in the repository's local
   `.git/info/exclude:30`. It is **absent in this worktree**: `ls` reports no such file and the
   scorer exits 2 (`build-evidence.md:111`; the exit-2 path is `score-verifier-labeled-set.cjs:435-439`).
   The rows themselves come from **outside the repo**: Pi sessions in `~/.pi/agent/sessions` and
   Claude transcripts the operator names (`spec.md:98`, `:130`; parent decision `goal.md:65`).
   To produce it: `node .skilled/hooks/goal/lib/build-verifier-fixture.cjs --pi ~/.pi/agent/sessions --out .skilled/hooks/goal/lib/verifier-labeled-set.jsonl`
   (`build-evidence.md:68`). There is **no seed**: the draw is deterministic — a fixed reason order
   feeds a round-robin deal (`build-verifier-fixture.cjs:38`, comment at `:36-37`), limit 50
   (`:28`). It refuses to overwrite an existing output (`:403-406`). The recorded run wrote
   `rows=50 pi=50 claude=0` in 10 s (`build-evidence.md:69-70`).

3. **Label schema.** JSONL, one row per line; the scorer accepts a row only when every field passes
   (`score-verifier-labeled-set.cjs:169-186`). Required fields: `id` (non-empty string), `source`
   (`claude` or `pi`), `objective` (non-empty string), `raw_text` (string), `ingested_text`
   (string), `raw_length` (non-negative integer), `label`. Allowed `label` values:
   `met`, `not_met`, `not-met` (normalized to `not_met`) and `blocked` (`:44-49`, `:89-93`); an
   empty or absent label reads as `unlabeled` and keeps the row out of the labeled side (`:82-84`,
   `:184`). Any other value is an error naming the row id and the file exits 1 (`:172-173`,
   `:441-445`). The builder also writes `heuristic_recorded`, `recorded_reason` and `prelabel`
   (`build-verifier-fixture.cjs:301-323`); the scorer's loader does not read them.

4. **Gate.** `MIN_ROWS = 30` (`score-verifier-labeled-set.cjs:37`). Fewer than 30 labeled rows →
   `stop: fewer than 30 rows`, no arm runs, exit 0 (`:447-449`). Rows today: **0 on disk in this
   worktree**; **50 can be redrawn**, since the corpus still holds the same session files
   (census above: 41 files, 1,822 nudges; the build's draw read `candidates_pi=1257`,
   `build-evidence.md:70`). Whether a redraw still returns exactly 50 rows is inferred from that
   recorded run plus today's census — it was not re-run here because it writes a file.

5. **Feasible by labeling: yes.** The blocker is the missing untracked fixture, not the corpus: one
   builder run recreates 50 rows and the operator labels at least 30 of them
   (`implementation-summary.md:127`, `goal.md:17`). Nothing here waits on another phase; the model
   arm and the shadow mode are the parts that wait, and they are outside this phase.

6. **Content kind.** Each row's `raw_text` is the turn evidence behind a recorded nudge, plus the
   row's `objective`: the operator's own Pi conversation text. Private. The spec classes the Jev
   payload as "the operator's own conversation, the most sensitive after the compaction arm"
   (`spec.md:250`), and the build record warns the fixture "holds the operator's own conversation
   text and this repository is public" (`build-evidence.md:161`). The census prints no message text
   by design (`count-pi-goal-nudges.mjs:7`).

7. **Who may write labels (phase's own decisions).**
   - `goal.md:61` (D6): "The operator labels every row, and no model writes a label: this phase
     closes at that label gate."
   - `spec.md:153`: "No model writes a label."
   - `spec.md:119` (out of scope): "Writing a label, by a model or by the build. Labels are the
     operator's, and the label gate closes this phase before them (parent D4)."
   - Open conflict, unresolved: a Claude row's `prelabel` comes from Claude Code's native goal
     judge, a model, while D6 says no model labels — the operator adjudicates disagreements and
     spot-checks about 10 agreements (`spec.md:249`, `:269`).

---

## 006-goal-criteria-lint

1. **Scorer path and commands.** Scorer: `.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs`
   (declared at `spec.md:113`; 13,452 bytes on disk). Zero-call census:
   `node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --all [--json] [--root <dir>]`
   (flags at `lint-goal-criteria.cjs:549-553`; the run and its counts at `implementation-summary.md:69`).
   Label-gated run:
   `node .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs --labels .skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl`,
   optionally `--lint <saved `--all --json` file>` instead of the in-process lint (`:260-263`,
   `--labels` required at `:272`).

2. **Row source.** `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` —
   **inside the repo and committed** (`implementation-summary.md:85-86`, `:91`). Drawn by the
   build's own script `specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build/draw-labels.cjs`
   (usage at `draw-labels.cjs:9`: `node draw-labels.cjs <seed> <count> <out.jsonl> <summary.json>`).
   The recorded draw: `node draw-labels.cjs 20260928 100` — **seed 20260928**, 100 rows over 21
   strata, from 1,357 distinct scored hashes (`scratch/w3-build/build-evidence.md:78`,
   `implementation-summary.md:74`). The shuffle is the seeded `mulberry32` at `draw-labels.cjs:19-20`,
   `:74`. Rows hold no criterion text.

3. **Label schema.** JSONL, one row per line: `{id, text_sha12, rubric, rule4_ok, rule5_ok, labeler}`
   (`spec.md:161`; the file on disk carries exactly these six keys). `id` is `path:line`,
   `text_sha12` is the first 12 hex characters of the criterion line's sha256 (`spec.md:161`),
   `rubric` is the adopted rubric's id (a string), `rule4_ok` / `rule5_ok` are booleans where `true`
   means the line violates that rule, and `labeler` is a free-text field that nothing validates.
   **A row counts as labeled only when both rule booleans are booleans** — `null` on either means
   unlabeled (`score-goal-lint.cjs:29-31`, `:142`). Allowed label values: `true` / `false` in each
   rule column; a mixed `rubric` column makes the scorer print `rubric mismatch: <ids>` and no rate
   (`:144-148`, `:206-209`).

4. **Gate.** There is **no numeric row gate** in this scorer. With no labeled row it prints
   `labeled=0` then `no labeled rows` and stops, exit 0 (`score-goal-lint.cjs:216-220`). The phase's
   own gate is the rubric plus the labels: the operator adopts a rubric before any label is written
   (`goal.md:59`, D2; `spec.md:149`, REQ-001) and the recorded operator target is all 100 rows
   (`goal.md:124`). Rows today: **100 drawn rows, every label field `null`**, and all 100 still join
   the current lint (`stale=0` in the run above) even though the population has grown from 1,485 to
   1,629 scored lines (`implementation-summary.md:69` vs. the run above).

5. **Feasible by labeling: yes.** Nothing to draw and no other phase involved: the operator adopts
   one rubric (open question 34) and fills the boolean columns on rows that already exist. The
   scorer prints per-rule precision, recall, F1, the labeled violation rate with its Wilson interval
   and the stop line once at least one row is labeled (`score-goal-lint.cjs:205-243`).

6. **Content kind.** Each row points at one criterion line in a packet `goal.md` by `path:line`;
   the labeler reads the goal file's criterion lines and applies the adopted rubric's two rule
   definitions (`spec.md:132`, `:143`). Rows store no criterion text (`goal.md:62`, D5;
   `spec.md:161`). This is repository spec-doc text, **not private session content**.

7. **Who may write labels (phase's own decisions).**
   - `goal.md:59` (D2): "The operator adopts the rubric before any label is written. Every label
     row carries that rubric's id, and the scorer refuses a labels file with mixed rubrics."
   - `spec.md:161` (REQ-008): "Only the operator fills them, after the label gate (parent D4)."
   - `spec.md:103` (out of scope): "Any label written by a model, on the drawn sample or elsewhere
     in the population (parent D4). Synthetic labels exist only inside the scorer's tests."
   - `goal.md:124`: "Labels and rubric | Operator | T001 and T012, past the label gate: adopt a
     rubric, fill the 100 rows, then run the scorer."

---

## 020-routing-clarify-default

1. **Scorer path and commands.** Scorer: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`
   — census, rows writer, scorer and both arms in one file (`spec.md:112`; 63,609 bytes on disk).
   Zero-call census plus rows:
   `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --report <dir> --rows-out <file> [--transcripts <dir>]`
   (usage at `:38`; rows written at `:1490-1496`). Label-gated run:
   `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score <rows file> [--jev|--deem --out <dir>]`
   (`:1449` dispatches to `runScoreCommand`). `--jev` or `--deem` without `--out` exits 2 before any
   output (`:1447-1450`).

2. **Row source.** The rows come **only from the census replay of committed text**: `canary +
   playbook + corpus` are replayed and `rowLines(rows)` serializes the clarify rows with mode
   alternatives (`score-clarify-default.cjs:1459-1471`, `:1490-1493`; sources at `spec.md:88`). The
   transcript path is counted but produces no rows (`:1459-1467`, `:1484-1488`). The sheet is
   supposed to be an operator-named file; the committed copy of the build's run is
   `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/runs/census/rows.jsonl`
   (2 lines; `implementation-summary.md:71` records the in-repo path as a deviation from the
   operator-named one). **No seed**: the replay is deterministic over the fixed corpus (`:112-165`).

3. **Label schema.** JSONL, one row per line: `{id, hub, source, prompt, alternatives, gold, label}`
   (`score-clarify-default.cjs:351-360`; the two rows on disk carry exactly these keys, `gold` null).
   Allowed label values: one of the row's `alternatives`, or `none_of_these`
   (`NONE_KEY` at `:30`; check at `:484`). A committed `gold` (`expected_workflow_mode`) counts as
   the row's value when it names one of those (`:467-491`). A label outside that set is rejected by
   row id with exit 2 (`:1377-1382`).

4. **Gate.** `LABEL_GATE = 30` labeled rows (`score-clarify-default.cjs:44`). Below 30 the scorer
   prints `stop: fewer than 30 labeled rows (<n> labeled)`, exit 0, and runs no arm even behind a
   switch (`:1389-1392`). Operator labels and committed gold count together (`:1384-1387`). Rows
   today: **2** (both canary-sourced, both `gold` null) — ran above:
   `rows: 2 labeled=0 operator=0 committed_gold=0`. The phase's own finding: "the 30-row gate cannot
   be reached from committed prompts alone" (`spec.md:74`), because the census found 3 clarify
   outcomes over 359 committed prompts, only 2 of them mode-pick rows
   (`implementation-summary.md:3`, `:71`, `:60`).

5. **Feasible by labeling: no — too few rows in the corpus.** The row source is fixed by code and
   holds 2 mode-alternative rows; there is no seed or count flag to draw more, and no path writes
   transcript rows (`score-clarify-default.cjs:1459-1471`, `:1490-1496`). The phase summary's "the
   30-row gate needs `--transcripts` or hand-picked prompts" (`implementation-summary.md:162`) is
   not implemented in the scorer — a hand-picked rows file would have to be authored by hand and
   then accepted by the loader, which no phase here built.

6. **Content kind.** The two existing rows hold committed canary prompts and hub ids over compiled
   hub alternatives — repository text. The census and rows stay on committed text by default
   (`implementation-summary.md:119`), and the transcripts flag prints counts only, never text
   (`score-clarify-default.cjs:1466`, `:1484-1488`; `spec.md:89`). **Not private** as the phase
   stands. Transcript text would be private, but no code path puts it in a row
   (`spec.md:102`, `:199`).

7. **Who may write labels (phase's own decisions).**
   - `goal.md:53` (D3): "Gold is a committed `expected_workflow_mode` among a row's alternatives, or
     an operator label. No model writes a label. Below 30 labeled rows the scorer prints
     `stop: fewer than 30 labeled rows` and this phase closes there."
   - `spec.md:103` (out of scope): "Writing a label. Labels are the operator's, past the gate
     (parent D4's rule for 003 and 006)."
   - `implementation-summary.md:118`: "a phase that prints its label-gate stop from the final state
     is Complete, and only the operator writes labels".

---

## 022-alignment-folder-suggestion

1. **Scorer path and commands.** Scorer: `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`
   (declared at `spec.md:113`; 61,064 bytes on disk), tests at `tests/score-alignment-suggestion.vitest.ts`
   (`implementation-summary.md:86-87`). Run everything from `.skilled/skills/system-spec-kit/runtime/cli`
   (`implementation-summary.md:140`). Zero-call census:
   `npx tsx evals/score-alignment-suggestion.ts --report <dir>` (`MAIN_OPTIONS` at `:1283-1292`;
   the run at `scratch/w4-session/session-evidence.md:16`). Rows:
   `npx tsx evals/score-alignment-suggestion.ts --transcripts <dir> --rows-out <file>`
   (`--rows-out` requires `--transcripts`, `:1327-1330`). Label-gated run:
   `npx tsx evals/score-alignment-suggestion.ts --score <rows file> [--jev|--deem --out <dir>]`
   (`--score` runs alone, `:1331-1334`; both switches need `--out`, `:1335-1341`). The build
   observed `committed: files=6 events=3 ... with_alternatives=0 ...`, `rows written: 0` and
   `stop: fewer than 30 labeled rows (0 labeled)`, exit 0
   (`implementation-summary.md:144-145`, `session-evidence.md:16`).

2. **Row source.** Rows come **only from an operator-named transcript directory**: `--rows-out`
   requires `--transcripts` (`:1327-1330`), and each row is one `low`/`infrastructure` event that
   listed alternatives (`:1496-1511`; `spec.md:111-114`). The rows file must be **outside the
   repository**: any in-repo `--report`, `--rows-out` or `--out` path is refused with exit 2 before
   any output (`:1343-1352`; `implementation-summary.md:74`). Today **0 rows exist** — the committed
   tree yields 0 events with alternatives (`implementation-summary.md:60`, `:144`) and no transcript
   directory has been named (`spec.md:107`). There is **no seed**: the draw is a filtered scan in
   transcript order (`:1496-1511`), so the same directory always yields the same rows.

3. **Label schema.** JSONL, one row per line: `{id, path, target, alternatives, state, gold, label}`
   (`Row` at `:511-519`, shape check at `:521-534`). `path` is `cli` or `data`, `state` is the save
   call's `sessionSummary` or `null`, `gold` is an interactive pick or `null`, `label` is a string.
   Allowed label values: the row's `target`, one of its `alternatives`, or `none_of_these`
   (`NONE_KEY` at `:62`; `rowOptions` at `:559-561`; check at `:572-579`). An empty `label` falls
   back to `gold` when `gold` names one of those (`:564-569`). A label outside the set is rejected
   with `foreign label in rows: <ids>` and exit 2 (`:1377-1381`).

4. **Gate.** `LABEL_GATE = 30` labeled rows, **and** 30 callable rows, where callable means the row
   carries a non-empty `state` (`:58`, `:1385-1390`). Below either, the scorer prints
   `stop: fewer than 30 labeled rows (<n> labeled)` or `stop: fewer than 30 callable rows (<n> with a
   state)` and exits 0 with no arm (`:1383-1390`). Rows today: **0** — the build ran the writer
   against an empty transcript directory and got `rows written: 0`
   (`session-evidence.md:16`). Whether any transcript directory holds ≥30 alternative-listing events
   with a paired state is UNKNOWN until the operator names one (`spec.md:242`).

5. **Feasible by labeling: no today — it waits on the operator's transcript directory, and the row
   corpus may be too thin.** Nothing can be labeled until the operator runs
   `--transcripts <dir> --rows-out <file>` over their own session transcripts and that directory
   yields at least 30 low/infrastructure events with alternatives, at least 30 of them carrying a
   `state` (`:1383-1390`). The committed tree cannot supply them (`implementation-summary.md:144`),
   and the phase hands the transcript run and the labels to the operator
   (`implementation-summary.md:165`, `goal.md:91`).

6. **Content kind.** Per row the labeler reads the target folder, the listed alternatives and the
   save call's `state` — the session summary extracted from the operator's own transcript
   (`extractSessionSummary` at `:414-428`). Private session content. The spec's payload class for a
   Jev run is "the operator's session summaries and folder descriptions" (`spec.md:170`), and the
   rows are meant to live only in an operator-named file outside the repo (`spec.md:161`).

7. **Who may write labels (phase's own decisions).**
   - `goal.md:51` (D3): "Gold is an interactive pick in a transcript or an operator label. No model
     writes a label. Rows go only to a file outside the repository. Below 30 labeled rows the scorer
     prints `stop: fewer than 30 labeled rows` and this phase closes there."
   - `implementation-summary.md:74`: "Only the operator writes labels."
   - `spec.md:48`: "The operator's labels past the gate. This phase closes at the label gate, as 003
     and 006 did under parent D4, and no model writes a label."

---

## Closing table

| Phase | Gate | Rows available today | Feasible by labeling | Private content |
|---|---|---|---|---|
| 003-goal-verifier-jev-shadow | 30 labeled rows of 50 (`score-verifier-labeled-set.cjs:37`) | 0 on disk (fixture untracked and absent); 50 redrawable from `~/.pi/agent/sessions` (41 files, 1,822 nudges today) | Yes — one builder run, then 30 labels | Yes — the operator's own Pi conversation text |
| 006-goal-criteria-lint | No numeric gate: one adopted rubric plus ≥1 labeled row (`score-goal-lint.cjs:216-220`); operator target all 100 rows (`goal.md:124`) | 100 drawn rows on disk, every label field null, all joining (`stale=0`) | Yes — adopt a rubric, fill boolean columns | No — packet `goal.md` criterion lines |
| 020-routing-clarify-default | 30 labeled rows (`score-clarify-default.cjs:44`) | 2 rows, both `gold` null | No — the corpus holds only 2 mode-alternative rows and no code adds transcript rows | No — committed canary prompts and hub ids |
| 022-alignment-folder-suggestion | 30 labeled rows and 30 callable rows (`score-alignment-suggestion.ts:58`, `:1383-1390`) | 0 rows; no transcript directory named | No today — needs an operator-named transcript directory yielding ≥30 alternative-listing events, ≥30 with a state | Yes — session summaries from the operator's transcripts |
