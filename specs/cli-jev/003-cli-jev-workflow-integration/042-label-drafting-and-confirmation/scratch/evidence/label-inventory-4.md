# Label inventory: phases 032, 033, 034, 035

Read-only inventory of what each label-gated phase needs before its scorer can print a verdict.
Every scorer was opened and its gate read in code; every phase's `spec.md`, `goal.md` and
`implementation-summary.md` were read. No model, jev or Deem call was made, no draw was run and
no file was written by any scorer: only the four zero-call default runs (all exit 0), read at
HEAD `ebcc68e8edb4` on 2026-10-01 in this worktree. Quoted numbers from those runs are labelled
"today's census"; counts read the live tree, so a later run may differ.

## 032 — citation-drift-scan

1. **Scorer path and commands.**
   - Scorer: `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` (`implementation-summary.md:61`).
   - Zero-call census: `node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` — the default
     run "spawns no model binary, writes no file and reads no credential beyond the labels file"
     (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1502-1504`); usage at
     `cite-drift-scan.mjs:10`, `cite-drift-scan.mjs:46`.
   - Label-gated run: `node .../cite-drift-scan.mjs --jev --out <dir>` and `... --deem --out <dir>`;
     both switches require `--out` before any call (`cite-drift-scan.mjs:1545-1548`). The label gate
     also holds in the default run: it prints `stop: fewer than 40 labeled rows` and scores nothing
     (`cite-drift-scan.mjs:646-647`).
   - Today's census (zero-call run, exit 0): `citations=357 in_range=208 past_end=2 ambiguous=44 unresolved=103 refused=0 dead=2 commit=ebcc68e8edb4` (census printed at `cite-drift-scan.mjs:1607-1610`).

2. **Row source.**
   - Rows are drawn from the tracked skill docs: `tracked` filtered to `.skilled/skills/**/*.md`
     (`cite-drift-scan.mjs:251-252`), with each live row a resolved in-range `file:line` citation
     whose cited target is read at the draw commit (`cite-drift-scan.mjs:380-388`).
   - The labels sheet is `cite-drift-labels.jsonl` beside the script by default
     (`cite-drift-scan.mjs:37`), overridable with `--labels <file>` (`cite-drift-scan.mjs:1543`).
     No sheet exists today (checked on disk), and none is committed: the 2026-09-29 draw was written
     into the session scratchpad, outside the repository (`goal.md:91`, `goal.md:113`,
     `implementation-summary.md:72`). The in-repo default path is available, but the build kept the
     sheet outside the repository under parent D4.
   - Produce it with `node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --draw --seed 20260929`
     (the proof run added `--labels <scratchpad file>`; `implementation-summary.md:151`). The draw
     exits 0 at 40 rows, 20 live and 20 constructed, at the recorded commit; the seed and commit are
     written into every row (`cite-drift-scan.mjs:1591`, `cite-drift-scan.mjs:1581-1592`).

3. **Label schema.** JSON Lines, one object per row; every field from `drawRow`
   (`cite-drift-scan.mjs:404-419`):
   `id`, `doc`, `doc_line`, `target`, `target_line`, `window_start`, `window_end`, `commit`,
   `claim_sha12`, `window_sha12`, `kind`, `verdict`, `labeler`.
   - Allowed values: `kind` is `live` or `constructed` (`cite-drift-scan.mjs:396`, `cite-drift-scan.mjs:417`);
     `verdict` is `null` for a fresh live row and `contradicts` for a constructed row
     (`cite-drift-scan.mjs:417`); scoring treats any non-`supports` verdict as drifted
     (`cite-drift-scan.mjs:613`), so the operator's two labels are `supports` and `contradicts`
     (`spec.md:137`); `labeler` is `construction` on constructed rows and `null` on live rows
     (`cite-drift-scan.mjs:418`).
   - The gate counts a row as labeled when `verdict` is not null (`cite-drift-scan.mjs:515-525`).

4. **Gate.** `LABEL_GATE = 40` rows carrying a verdict (`cite-drift-scan.mjs:70`,
   `cite-drift-scan.mjs:646-647`): a fresh draw supplies 20 (constructed, `contradicts`) and the
   operator supplies the 20 live verdicts. Fixed budgets: `LIVE_ROWS = 20`
   (`cite-drift-scan.mjs:52`), `CONSTRUCTED_ROWS = 20` (`cite-drift-scan.mjs:55`), constructed
   targets need at least 80 lines (`cite-drift-scan.mjs:64`). Rows available today: 0 on disk; the
   live half is drawable (208 in-range citations against the 20 live picks, `cite-drift-scan.mjs:52`),
   and the 2026-09-29 draw proved the full 40-row draw on the real tree (`implementation-summary.md:151`);
   only the 20 live verdicts remain for the operator.

5. **Feasible by labeling: yes.** The corpus holds 208 in-range citations against a need of 20 live
   picks, and the draw succeeded on the real tree (`implementation-summary.md:151`). The operator's
   work is the 20 live labels (`spec.md:49`); the other 20 rows are labeled by construction.

6. **Content kind.** Per row a labeler reads the citing sentence in a tracked skill document and the
   cited target's window of ±10 lines (`window_start`/`window_end`, `cite-drift-scan.mjs:459-462`) at
   the row's recorded commit (`cite-drift-scan.mjs:574-586`): markdown prose plus code/config/doc
   lines from the repository. The labels file itself carries no text, only coordinates and hashes
   (`cite-drift-scan.mjs:393-394`). Not private session content: both sides are tracked repository
   files.

7. **Phase decisions on who may write labels (quoted).**
   - `spec.md:49` — "The operator's labels on 20 live citations (the label gate, REQ-004). No model writes a label."
   - `spec.md:137` — "**The labels exist before any model verdict, and no model writes one.**"
   - `goal.md:53` (D2) — "20 live citations the operator labels, 20 constructed by moving the window 60 lines, labeled by construction. No model writes a label. Until 40 exist every run prints `stop: fewer than 40 labeled rows`".

## 033 — validator-residue-flagger

1. **Scorer path and commands.**
   - Scorer: `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` (`implementation-summary.md:61`).
   - Zero-call census: `node .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs`
     — "The default run is a census" (`score-residue-flagger.cjs:9-10`); usage at
     `score-residue-flagger.cjs:43`; the census prints at `score-residue-flagger.cjs:1513-1515`.
   - Label-gated run: `node .../score-residue-flagger.cjs --jev --out <dir>` or `--deem --out <dir>`;
     each switch needs `--out` before any call (`score-residue-flagger.cjs:1509-1511`). The gate holds
     in the default run: `stop: fewer than 100 labeled rows` (`score-residue-flagger.cjs:1526-1527`).
   - Today's census (zero-call run, exit 0): `census: commit=ebcc68e8edb4 files=5890 tables=117 rows=809 skipped=525`;
     `dimension correctness=274 security=51 traceability=262 maintainability=218`;
     `resolvable: correctness=0 traceability=7 refused=125 dropped=677` (printed at
     `score-residue-flagger.cjs:361-375`).

2. **Row source.**
   - Rows are drawn from committed deep-review finding tables: tracked markdown under `specs/` in a
     `review/` or `ai-council/` folder, never in `context/` or `scratch/` (`score-residue-flagger.cjs:128-135`);
     each finding row's cited location resolves at the first parent of the commit that added the
     review file (`score-residue-flagger.cjs:241-258`, `score-residue-flagger.cjs:438-455`).
   - The labels sheet is `residue-flagger-labels.jsonl` beside the script by default
     (`score-residue-flagger.cjs:29`), overridable with `--labels <file>` (`score-residue-flagger.cjs:43`).
     No sheet exists today (checked on disk): the 2026-09-29 draw exited 2 and wrote no file
     (`goal.md:92`, `goal.md:113`, `implementation-summary.md:104`). It is not committed and has not
     been written outside the repository either.
   - Produce it with `node .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs --draw --seed 20260929`;
     today that exits 2 with `draw needs 25 resolvable rows in correctness, found 0` and writes
     nothing (`goal.md:92`; the shortfall check is `score-residue-flagger.cjs:426-431`). A draw needs
     the corpus to hold 25 resolvable rows per category first (`score-residue-flagger.cjs:424`,
     `score-residue-flagger.cjs:502-533`).

3. **Label schema.** JSON Lines, one object per row; every field from `addRow`
   (`score-residue-flagger.cjs:487-500`):
   `id`, `source`, `category`, `doc`, `line`, `window_start`, `window_end`, `commit`,
   `window_sha12`, `kind`, `label`, `labeler`.
   - Allowed values: `category` is `correctness` or `traceability`
     (`score-residue-flagger.cjs:30`); `kind` is `positive` or `negative`
     (`score-residue-flagger.cjs:504`, `score-residue-flagger.cjs:530`); `label` must be `defect` or
     `clean` to count (`score-residue-flagger.cjs:596`), and every drawn row starts at
     `label: null`, `labeler: null` (`score-residue-flagger.cjs:498-499`).
   - The gate counts only rows whose label is `defect` or `clean`
     (`score-residue-flagger.cjs:587-597`); a window is 10 lines each side of the cited line
     (`WINDOW_RADIUS = 10`, `score-residue-flagger.cjs:37`).

4. **Gate.** `LABEL_GATE = 100` labeled rows (`score-residue-flagger.cjs:32`,
   `score-residue-flagger.cjs:1526-1527`): 50 positives (25 correctness, 25 traceability) plus 50
   negatives (25 per category) (`ROWS_TOTAL = 100`, `POSITIVES = 50`, `NEGATIVES = 50`,
   `PER_CATEGORY = 25`, `score-residue-flagger.cjs:33-36`). Rows available today: 0 drawn rows,
   because the draw cannot start — today's corpus holds `resolvable: correctness=0 traceability=7`
   against the 25 per category a draw requires (`score-residue-flagger.cjs:426-431`; 2026-09-29
   failure recorded at `goal.md:92`). So 0 of the 100 gate rows are reachable today.

5. **Feasible by labeling: no.** The blocker is the corpus, not the label count: no correctness
   finding's location resolves today and traceability resolves only 7 of the 25 needed for a draw
   (`resolvable: correctness=0 traceability=7`, zero-call census above; `goal.md:113`). The phase
   waits on "a corpus with at least 25 resolvable correctness rows, then `--draw`, then 100 operator
   labels" (`goal.md:97`).

6. **Content kind.** Per row a labeler reads a 21-line window of the document a deep-review finding
   cites (positives) or of the same document away from any cited line (negatives)
   (`score-residue-flagger.cjs:37-38`, `score-residue-flagger.cjs:483-500`, `score-residue-flagger.cjs:438-455`)
   at the reviewed commit. The content is committed repository documents that review findings cite,
   not private session transcripts; the review files themselves are tracked under `specs/`
   (`score-residue-flagger.cjs:128-135`).

7. **Phase decisions on who may write labels (quoted).**
   - `spec.md:49` — "The operator's 100 labels (the label gate, REQ-004). No model writes a label."
   - `spec.md:138` — "**The labels exist before any model verdict, and no model writes one.** … The operator labels each row `defect` or `clean` for its category, because a finding is a reviewer's claim until confirmed."
   - `goal.md:53` (D2) — "The operator labels all 100, because a finding is a reviewer's claim. No model writes a label. Until 100 exist every run prints `stop: fewer than 100 labeled rows`".

## 034 — hvr-reader-needed-lens

1. **Scorer path and commands.**
   - Scorer: `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` (`implementation-summary.md:61`).
   - Zero-call census: `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py`
     — "census, questions, baselines"; "The default run makes no model call, writes no file and
     holds no credential" (`hvr_reader_lens.py:15`, `hvr_reader_lens.py:20`); the census prints at
     `hvr_reader_lens.py:2155-2156`.
   - Label-gated run: `python3 .../hvr_reader_lens.py --jev --out <dir>` or `--deem --out <dir>`;
     "Jev and Deem each need `--out <dir>`" (`hvr_reader_lens.py:17-18`, `hvr_reader_lens.py:20-21`).
     The gate holds in the default run: `labels: labeled=N of 150` then `stop: fewer than 150 labeled
     rows` (`hvr_reader_lens.py:880-889`, `hvr_reader_lens.py:2186-2189`).
   - Today's census (zero-call run, exit 0): `census: commit=ebcc68e8edb42bc736cf52ecb89c1997f5c84e82 files=7957 sections=107625 flagged=51190 in_band_5_80=41080 refused=5`;
     `census: category=synonym-cycling candidates=0`; `census: category=significance-inflation candidates=2`;
     `census: category=false-ranges candidates=786`; `labels: labeled=0 of 150` (printed at
     `hvr_reader_lens.py:445-467`).

2. **Row source.**
   - Rows are drawn from tracked skill docs: markdown under `.skilled/skills/`, with changelogs,
     fixtures and `node_modules` dropped and dotenv names refused
     (`hvr_reader_lens.py:175-181`), sections of 5 to 80 lines (`hvr_reader_lens.py:192-193`).
   - The labels sheet is `hvr-reader-lens-labels.jsonl` beside the script by default
     (`hvr_reader_lens.py:582`), overridable with `--labels <path>` (`hvr_reader_lens.py:19`,
     `hvr_reader_lens.py:2079`). No sheet exists today (checked on disk): the 2026-09-29 draw proof
     was written into the session scratchpad, outside the repository, and no sheet is committed
     (`goal.md:90`, `implementation-summary.md:79`).
   - Produce it with `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py --draw --seed 20260929`
     (the proof added `--labels <scratchpad file>`); that run exits 0 and writes 150 rows
     (`implementation-summary.md:151`; draw branch `hvr_reader_lens.py:2103-2137`).

3. **Label schema.** JSON Lines, one object per row; every field from `draw_rows`
   (`hvr_reader_lens.py:741-753`):
   `id`, `category`, `doc`, `section_start`, `section_end`, `commit`, `section_sha12`, `candidate`,
   `label`, `labeler`.
   - Allowed values: `category` is `synonym-cycling`, `significance-inflation` or `false-ranges`
     (`hvr_reader_lens.py:285`); `label` must be `yes` or `no` to count
     (`hvr_reader_lens.py:872`); every drawn row starts at `label: None`, `labeler: None`
     (`hvr_reader_lens.py:751-752`); `candidate` is the comparator's own flag for that category,
     recomputed from the committed text at scoring time (`hvr_reader_lens.py:849-853`).
   - The gate counts only `yes`/`no` rows and requires exactly 150 rows present
     (`hvr_reader_lens.py:859-877`). Budgets: `TOTAL_ROWS = 150`, `ROWS_PER_CATEGORY = 50`,
     `CANDIDATE_ROWS_PER_CATEGORY = 25`, `MAX_ROWS_PER_SKILL = 5`
     (`hvr_reader_lens.py:574-580`).

4. **Gate.** 150 rows labeled `yes` or `no`, 50 per category (`hvr_reader_lens.py:574-575`,
   `hvr_reader_lens.py:859-877`, stop line `hvr_reader_lens.py:766`). Rows available today: 0 on
   disk, but the draw can produce all 150 from today's 41,080 in-band sections; the 2026-09-29 proof
   drew 150 rows at seed 20260929 with `candidate_rows` 0, 2 and 25
   (`goal.md:90`, `implementation-summary.md:151`). Only the 150 operator labels remain.

5. **Feasible by labeling: yes.** The draw succeeded on the real tree and the sample is fixed before
   any label; today's in-band pool (41,080) is far above the 150 needed, and the 786 false-range
   candidates cover that category's up-to-25 candidate picks (`goal.md:90`; draw phases
   `hvr_reader_lens.py:716-731`).

6. **Content kind.** Per row a labeler reads a 5-to-80-line section of a tracked skill document
   (`hvr_reader_lens.py:192-193`, `hvr_reader_lens.py:741-753`) at the row's recorded commit, with
   the section hash re-checked before scoring (`hvr_reader_lens.py:773-807`). The content is
   repository skill prose, not private session content.

7. **Phase decisions on who may write labels (quoted).**
   - `spec.md:49` — "The operator's 150 labels (the label gate, REQ-004). No model writes a label."
   - `spec.md:142` — "**The labels exist before any model verdict, and no model writes one.** … The operator labels each row `yes` or `no` for its own category."
   - `goal.md:53` (D2) — "The operator labels every row `yes` or `no`, never a model. Until 150 exist every run prints `stop: fewer than 150 labeled rows`".

## 035 — fetched-text-injection-screen

1. **Scorer path and commands.**
   - Scorer: `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` (`implementation-summary.md:83`).
   - Zero-call census: `node .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs`
     — "The default run makes no model call and writes no file. The script holds and reads no
     credential" (`score-injection-screen.mjs:7-8`); usage at `score-injection-screen.mjs:11-13`;
     census prints at `score-injection-screen.mjs:1631-1632`.
   - Label-gated run: `node .../score-injection-screen.mjs --jev --out <dir>` or `--deem --out <dir>`;
     each switch needs `--out` (`score-injection-screen.mjs:1609-1611`). The gate holds in the
     default run: `labels: labeled=N of 90 planted_sentences=M of 30` then
     `stop: fewer than 90 labeled rows` (`score-injection-screen.mjs:572-597`,
     `score-injection-screen.mjs:1634-1635`).
   - Today's census (zero-call run, exit 0): `fetch census: state_files=486 records=6661 with_tools_used=835 naming_webfetch=82 naming_websearch=61 files_with_either=31 unparsed_lines=5`;
     `corpus census: commit=ebcc68e8edb42bc736cf52ecb89c1997f5c84e82 files=185 refused=2 excluded=1`;
     `corpus: total sections=1138 in_band=1022 lexical_hits=0`;
     `labels: labeled=30 of 90 planted_sentences=0 of 30` (printed at
     `score-injection-screen.mjs:217-220`, `score-injection-screen.mjs:379-408`).

2. **Row source.**
   - Rows are drawn from the fixed corpus: tracked `.md` documents under
     `specs/cli-jev/003-cli-jev-workflow-integration/context` (`CONTEXT_DIR`,
     `score-injection-screen.mjs:38`), excluding the notes file `ideas from michel kerkmeester.md`
     (`score-injection-screen.mjs:39`, `score-injection-screen.mjs:249-269`), sections of 5 to 60
     lines (`score-injection-screen.mjs:42-43`).
   - The sheets are `labels.jsonl` and `planted.jsonl` beside the scorer
     (`score-injection-screen.mjs:40-41`), overridable with `--labels <file>` and `--planted <file>`
     (`score-injection-screen.mjs:13`, `score-injection-screen.mjs:1574-1575`). Both exist in the
     repository and are tracked (`git ls-files` resolves both; `implementation-summary.md:83-85`,
     `goal.md:87`): `labels.jsonl` holds 90 rows and `planted.jsonl` 30 sentence slots, all still
     `sentence: null` (`goal.md:87`, `goal.md:93`).
   - The draw already ran: `node .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs --draw --seed 20260929`
     exited 0 with `rows=90 natural=60 planted=30` and wrote both files
     (`goal.md:87`; draw branch `score-injection-screen.mjs:1577-1601`).

3. **Label schema.** Two JSON Lines files.
   - `labels.jsonl`, every field from `drawRows` (`score-injection-screen.mjs:493-506`):
     `id`, `kind`, `source`, `doc`, `section_start`, `section_end`, `commit`, `section_sha12`,
     `planted_id`, `insert_line`, `label`, `labeler`.
     Allowed values: `kind` is `natural` or `planted`; `label` must be `instructs` or `clean` to
     count (`score-injection-screen.mjs:578`); planted rows are drawn with `label: instructs` and
     `labeler: construction` while natural rows start at `label: null`, `labeler: null`
     (`score-injection-screen.mjs:504-505`); `planted_id` is `pNN` for a planted row and null
     otherwise (`score-injection-screen.mjs:492`).
   - `planted.jsonl`, one object per slot: `{id, sentence}` with `id` `p01`..`p30` and
     `sentence: null` until the operator writes it (`score-injection-screen.mjs:507`; on-disk rows
     read above).
   - The gate requires `rows.length === 90`, `labeled === 90`, `plantedRows === 30` and
     `sentences === 30`, where a sentence counts only when its slot holds non-blank text
     (`score-injection-screen.mjs:572-584`).

4. **Gate.** 90 rows all carrying an operator label (`instructs`/`clean`) plus a non-blank sentence
   for each of the 30 planted ids (`TOTAL_ROWS = 90`, `NATURAL_ROWS = 60`, `PLANTED_ROWS = 30`,
   `score-injection-screen.mjs:44-47`; gate `score-injection-screen.mjs:572-584`). Rows available
   today: the 90 drawn rows exist and are committed, and 30 are pre-labeled by construction; the
   census run above reports `labels: labeled=30 of 90 planted_sentences=0 of 30`, so 60 natural
   labels and 30 planted sentences remain.

5. **Feasible by labeling: no**, not by labels alone. The 60 natural rows are operator labels, but
   the other 30 gate rows are not labels at all: "The operator labels each natural row `instructs`
   or `clean` and writes the 30 planted sentences as an attacker would, one instruction to the
   agent each" (`spec.md:140`). The corpus is not the blocker — 1,022 in-band sections are
   available today against the 90-row budget under the 30-per-source cap
   (`corpus: total sections=1138 in_band=1022` above; cap `score-injection-screen.mjs:47`) — the
   blocker is the 30 operator-authored planted sentences the gate requires
   (`goal.md:51`, `goal.md:93`).

6. **Content kind.** Per natural row a labeler reads a 5-to-60-line section of public vendored
   markdown under the parent `context/` folder (e.g. `supercov-main`, `jev-cli-main`, `social
   posts`; `score-injection-screen.mjs:38`, `score-injection-screen.mjs:42-43`), read at the drawn
   commit and hash-checked (`score-injection-screen.mjs:611-630`). Per planted row the operator
   authors one instruction sentence addressed to an agent and it is inserted at the seeded line
   (`goal.md:87`). The operator's notes file is excluded and never opened
   (`score-injection-screen.mjs:241-243`, `score-injection-screen.mjs:262-265`). Not private
   session content: the corpus is tracked, public vendored text.

7. **Phase decisions on who may write labels (quoted).**
   - `spec.md:49` — "The operator's 60 labels and 30 planted sentences (the label gate, REQ-004). No model writes a label or a planted sentence."
   - `spec.md:140` — "**The labels exist before any model verdict, and no model writes one.** … The operator labels each natural row `instructs` or `clean` and writes the 30 planted sentences as an attacker would, one instruction to the agent each."
   - `goal.md:51` (D2) — "60 natural sections the operator labels `instructs` or `clean`, and 30 sections carrying one instruction sentence the operator writes, labeled by construction, never by a model. Until all 90 exist every run prints `stop: fewer than 90 labeled rows`".

## Gate summary

| Phase | Gate | Rows available today | Feasible by labeling | Private content |
|-------|------|----------------------|----------------------|-----------------|
| 032-citation-drift-scan | 40 rows with a verdict (20 live operator labels + 20 construction labels) | 0 drawn; the 40-row draw succeeded 2026-09-29 and 208 in-range citations exist today; 20 live verdicts remain | yes | no — tracked skill docs + cited repo files |
| 033-validator-residue-flagger | 100 labeled rows (25 correctness + 25 traceability positives, 25 negatives each) | 0 drawn; draw blocked (resolvable correctness 0, traceability 7 of the 25 per category needed) | no — corpus shortfall, waits on a corpus with resolvable correctness rows | no — committed review findings' cited repo docs |
| 034-hvr-reader-needed-lens | 150 labeled rows (50 per category) | 0 drawn; the 150-row draw proof succeeded 2026-09-29 and 41,080 in-band sections exist today; 150 labels remain | yes | no — tracked skill docs |
| 035-fetched-text-injection-screen | 90 rows (60 natural labels + 30 planted sentences) | 90 drawn and committed; 30/90 labeled, 0/30 sentences | no — 30 gate rows need operator-authored planted sentences | no — tracked public vendored text; notes file excluded |
