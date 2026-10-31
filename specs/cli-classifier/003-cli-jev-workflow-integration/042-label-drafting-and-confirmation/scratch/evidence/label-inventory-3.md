# Label-gated phase inventory 3: phases 027 to 031

Read-only inventory of what each label-gated phase needs before its scorer can print a
verdict. Prepared 2026-10-01 at HEAD `ebcc68e8ed`, from each phase's `spec.md`, `goal.md` and
`implementation-summary.md`, and from the scorers' own code. The only commands run were the
scorers' zero-call censuses; no model, `jev` or Deem was called.

Citation convention: paths are repo-relative; bare `:N` means a line in the scorer named in
item 1 of that phase; doc citations carry the file name. Census outputs quoted here are the
runs of 2026-10-01 from the worktree root, all exit 0 unless a line says otherwise.

---

## Phase 027 — `027-stop-second-rater`

1. **Scorer path and commands.** Scorer:
   `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` (`spec.md:109`;
   usage string at `:71`). Zero-call census:
   `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs`
   (default makes zero calls, `spec.md:131`). Label-gated run:
   `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs --jev --deem --out <dir> --gold-reads <file>`;
   the label gate is consulted only when `--jev` or `--deem` is set (`:1753-1758`), and a
   switch without `--out` exits 2 before any call (`:1600-1604`). Census run 2026-10-01:
   `lineages: tracked 486 no config 37 forced 235 no deltas 92 kept 122 no gold 106 sampled 16 inert 4`,
   `gold: derived on 16 of 16 sampled`, `reads:` naming five lineages, `baseline: legacy right 5 of 16`,
   `planned calls: deem 239 jev 718` (printed at `:1736-1749`).
2. **Row source.** The rows to label are the sampled deep-research lineages: tracked
   `deep-research-state.jsonl` files found with `git ls-files -z -- '*deep-research-state.jsonl'`
   (`:85`), kept when the config lets a stop move and a `deltas/` folder exists (`spec.md:132`;
   `:1633-1651`). They are inside the repository (under `specs/**`). The label file is the
   operator's `--gold-reads <file>` at a path the operator names; the script imposes no
   in-repo refusal on it (option at `:1590`; `parseGoldReads` `:485-518`). There is no sheet
   writer: the draw is the census `reads:` line (`:1738-1739`), which today prints
   `specs/sk-doc/z_archive/019-skill-routing-refactor/001-research/004-system-code-graph-routing-research/research g=4`,
   `.../021-skill-metadata-json-unification/research/lineages/sol-high-fast g=2`,
   `.../001-research/006-sk-prompt-routing-research/research g=5`,
   `.../001-research/005-system-deep-loop-routing-research/research g=7` and
   `specs/system-speckit/032-relocate-specs-folder/001-relocation-implications-research/research/lineages/sol g=5`.
   The sample is deterministic, not seeded: inert windows first, then ascending SHA-256 of
   the lineage path (`:1702-1712`), capped at `SAMPLE_MAX = 25` (`:40`).
3. **Label schema.** `--gold-reads <file>` (`:1590`); JSON Lines, one JSON object per line
   (`:475`). Fields: `lineage` (non-empty string, the repo-relative lineage directory the
   census printed; `:500-503`), `gold_iteration` (positive integer; `:504-507`), `labeler`
   (non-empty string; `:508-511`). A duplicate `lineage` is refused (`:512-514`). There is no
   enumerated label value: the value is the operator's gold iteration number.
4. **Gate.** `LABEL_GATE = 5` (`:42`). The gate checks the first five sampled lineages
   (`:532`); each needs a read whose `gold_iteration` equals the derived gold (`:541-543`).
   Fewer than five confirmed prints `stop: fewer than 5 confirmed lineages` (`:545-546`);
   one disagreement prints `stop: derived gold disagrees on <k> of 5 lineages` (`:548-549`).
   Rows available today: 16 sampled lineages with derived gold, so the gate needs 5 of 16;
   0 are labeled.
5. **Feasible by labeling.** Yes. 16 sampled lineages exceed the 5 the gate needs; the
   operator's read is the only missing work (`goal.md:56`, `spec.md:136`).
6. **Content kind.** Per lineage the reader compares the derived gold against the lineage's
   iteration records and its `deltas/*.jsonl` files, which hold the iteration focus, key
   questions and finding sources (e.g.
   `specs/sk-doc/z_archive/019-skill-routing-refactor/001-research/004-system-code-graph-routing-research/research/deltas/iter-001.jsonl`).
   That is archived deep-research session transcript content under `specs/**`, so treat it as
   private. Only lineages whose delta files exist at `origin/main` may reach Jev
   (`spec.md:137`); Deem stays local (`spec.md:144`).
7. **Who may write labels.** `goal.md:56` (D5): "The operator's read of five named lineages
   gates every model call. Fewer than five reads, or one disagreement with the derived gold,
   stops the arms. No model writes a gold row." `spec.md:136` (REQ-006): "No model writes a
   row of this file." `implementation-summary.md:175`: "The labels are the operator's, and
   every model call waits."

## Phase 028 — `028-confirm-mode-stop-hint`

1. **Scorer path and commands.** Scorer:
   `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs` (`spec.md:103`;
   usage at `:57`). Zero-call census:
   `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <dir>`
   (it makes no model call in any mode, `spec.md:125`). Label-gated run: the same command with
   `[--jev] [--deem] [--out <dir>]`; the gate is checked on every read, so a stopped gate prints
   `stop: rater report has no confirmed gold` for the census and the switched run alike
   (`:446-450`, line at `:29`). No 027 report exists in this worktree, so the census cannot
   print today: run against a placeholder directory on 2026-10-01 it exited 2 with
   `rater report not found: /tmp/no-such-027-report/report.json` (`:88`).
2. **Row source.** 027's `report.json` (`REPORT_FILE = 'report.json'` `:27`; read at `:83`).
   It is outside the repository: 027's report is written to the operator-named `--out`
   directory (`spec.md:112`), and the session's final report lived in the session scratchpad
   outside the tree (`scratch/w4-session/docs/facts.txt:20` records `$SP/w4v/028-final`;
   `scratch/w4-session/docs/facts.txt:21` records that 027's `--deem --out <dir>` report
   stopped at `stop: fewer than 5 confirmed lineages`). To produce it, run 027's scorer as in
   027 item 1 with a `--gold-reads` file that passes 027's gate; 027 then writes `report.json`
   with `gate.label.passed = true`. No seed.
3. **Label schema.** None of its own; it reads 027's report field `gate.label.passed`, a
   boolean (`:120`). 027's gold-reads schema (027 item 3) is the only label schema in the
   chain.
4. **Gate.** `gateStopLine` stops unless `report.gate.label.passed === true` (`:119-121`).
   The number and kind are 027's: 5 sampled lineages confirmed by the operator's read
   (`027/spec.md:136`). Rows available today: 0 — no 027 report is in this worktree, and the
   session's final 027 report had a stopped gate (`implementation-summary.md:162`).
5. **Feasible by labeling.** No, it waits on another phase. 028 writes no labels of its own:
   `spec.md:94` (out of scope) says "New gold or labels. The gold is 027's, confirmed by the
   operator's five-lineage read there", and `goal.md:56` (D5) says "Gold and labels are
   027's. An ungated 027 report stops the phase." Once 027's gate passes, 028 reruns on the
   gated report.
6. **Content kind.** No new text is read per row by this phase's scorer; it turns 027's
   recorded stops into hint iterations (`spec.md:127`). The text a labeler read is 027's
   archived deep-research transcripts (027 item 6), private as stated there.
7. **Who may write labels.** `goal.md:56` (D5), quoted above. `spec.md:126` (REQ-002): "It
   reads only a 027 report whose gold passed the label gate." `spec.md:94`: "The gold is
   027's, confirmed by the operator's five-lineage read there."
   `implementation-summary.md:162`: "No rater report has passed 027's label gate, so this
   phase's runs print `stop: rater report has no confirmed gold` and call nothing."

## Phase 029 — `029-p0-reread-order`

1. **Scorer path and commands.** Scorer:
   `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs`
   (`spec.md:106`; usage at `:71`). Zero-call census:
   `node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs`;
   run 2026-10-01 exited 0 with `registries: 416`,
   `findings: 2789 (P0 96, P1 1300, P2 1393, other 0)`, `p0 rows: 95 in 37 registries (one 21, two or more 16)`,
   `labels needed: 20 P0 negatives among 95 P0 rows` (census lines `:303-315`; the gate line is
   printed on every run at `:1699`). Label-gated run:
   `node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs --write-label-sheet <path> --labels <file> --jev --deem --out <dir>`
   (`:71`).
2. **Row source.** Tracked `deep-review-findings-registry.json` files (`loadRegistries`
   `:138-141`, over the `git ls-files -z` walk at `:121`); the rows are their P0 findings from
   `openFindings`/`resolvedFindings` (`p0RowsOf` `:177-201`). They are inside the repository
   (under `specs/**`). The sheet must be written outside the repository:
   `--write-label-sheet <path>` refuses a path inside the repo with exit 2 and writes nothing
   (`:374-384`, refusal `:377-378`). Draw: `--write-label-sheet <path>` writes one JSON line
   per P0 row in registry and finding order (`:1669`; `buildLabelSheetLines` `:351-360`); no
   seed. Today it would write all 95 rows.
3. **Label schema.** `--labels <file>`; JSON Lines; `registry` (`:409-413`), `finding_id`
   (`:414-416`), `label` (`:417`); allowed values are `""` (empty, counted as dropped,
   `:388`), `real`, `P1`, `P2`, `not_a_finding` (`:418-420`). Sheet rows additionally carry
   `title`, `dimension` and `evidence_refs` (`:352-359`).
4. **Gate.** `LABEL_GATE = 20` (`:49`); at least 20 rows labeled other than `real`, else
   `stop: fewer than 20 labeled P0 negatives` (`:438-440`). Rows available today: 95 P0 rows
   in 37 registries (census); 0 labeled. The sheet can carry all 95 rows.
5. **Feasible by labeling.** Yes in principle, with a stated risk: up to 95 rows exist to
   label, over the 20 the gate needs, but the gate counts negatives and the read may find
   fewer — `spec.md:187`: "The operator may label all 95 P0 rows and still find fewer than
   20. The phase then closes on the stop line."
6. **Content kind.** Per row a review finding's title, dimension, evidence refs and
   recommendation from a `deep-review-findings-registry.json` (`:343-345`; row shape
   `:190-197`) — archived deep-review findings under `specs/**`, session content; treat as
   private. Jev receives only rows whose registry exists at `origin/main` (`spec.md:135`);
   Deem stays local (`spec.md:141`).
7. **Who may write labels.** `goal.md:52` (D2): "Rows are the P0 findings of tracked review
   registries. Gold is the operator's label per row: `real`, `P1`, `P2` or `not_a_finding`.
   Fewer than 20 non-`real` labels stops every arm. No model writes a label." `spec.md:132`
   (REQ-005): "No model writes a label." `implementation-summary.md:181`: "The labels are the
   operator's, and every verdict waits."

## Phase 030 — `030-fanout-merge-shadow-record`

1. **Scorer path and commands.** Scorer:
   `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` (`spec.md:104`;
   usage at `:1339`). Zero-call census:
   `node .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs`; run
   2026-10-01 exited 0 with `runs: research=57 review=47`, `pairs: research=19 review=105`,
   `class near-line: research=0 review=0`, `class cross-body: research=19 review=105`,
   `merge undecidable: 12`, `stop: fewer than 40 labeled pairs` (census lines `:1588-1641`;
   gate line printed every run at `:1694`). Label-gated run:
   `node .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs --write-pair-sheet <path> --labels <file> --jev --deem --out <dir>`
   (`:1339`).
2. **Row source.** Tracked fan-out runs laid out as `{research,review}/lineages/<label>/<registry>`
   with two or more lineage registries (`walkRuns` `:146`, `:136-177`); rows are pairs of
   findings from different lineages of one run (`spec.md:128`). They are inside the repository
   (under `specs/**`). The sheet must be written outside the repository:
   `--write-pair-sheet <path>` refuses a path inside the repo with exit 2 and writes nothing
   (`writePairSheet` `:573-604`, refusal `:576-577`). Draw: `--write-pair-sheet <path>` writes
   at most 60 pairs per class, ordered ascending by SHA-256 of the pair key (`:582-588`;
   `SHEET_PER_CLASS = 60` `:65`); no seed. Today it would write 60 cross-body rows (near-line
   is empty).
3. **Label schema.** `--labels <file>`; JSON Lines; `pair_key` (`:634-637`) and `label`
   (`:638`); allowed values are `same` or `different` (`:639-640`). Sheet rows carry
   `pair_key`, `class`, `loop`, `run_dir`, `lineages`, `text_a`, `text_b` and `label`
   (`:589-598`).
4. **Gate.** `LABEL_GATE = 40` (`:60`) plus `CROSS_BODY_LABEL_GATE = 10` (`:61`): fewer than
   40 labeled pairs prints `stop: fewer than 40 labeled pairs` and fewer than 10 labeled
   cross-body pairs prints `stop: fewer than 10 labeled cross-body pairs` (`:672-676`). Rows
   available today: 124 candidate pairs (19 research + 105 review), all cross-body, of which
   the sheet draws 60; 0 labeled.
5. **Feasible by labeling.** Yes. 60 cross-body rows can be drawn from the 124 candidates,
   which clears both the 40-pair floor and the 10 cross-body floor.
6. **Content kind.** Per row both findings' text (`text_a`, `text_b`), their lineages, the
   loop and the run path (`:589-598`) — finding text from research and review fan-out
   registries under `specs/**`, session content; treat as private. Jev receives only pairs
   whose registries are at `origin/main` (`spec.md:140`); Deem stays local.
7. **Who may write labels.** `goal.md:54` (D4): "Gold is the operator's `same` or `different`
   label. Fewer than 40 labeled pairs or 10 cross-body ones stops every arm. No model writes
   a label." `spec.md:131` (REQ-005): "No model writes a label."
   `implementation-summary.md:171`: "The labels are the operator's, and every verdict waits."

## Phase 031 — `031-debug-next-check`

1. **Scorer path and commands.** Scorer:
   `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`
   (`spec.md:104`). Zero-call census:
   `node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`;
   run 2026-10-01 exited 0 with `seam: none`,
   `mined: debug_delegation=1 hypothesis_files=0`, `mined rows: 0` (printed at `:1381`,
   `:1389-1390`). Label-gated run:
   `node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs --fixture <file> --jev --deem --out <dir>`
   (options parsed at `:1302-1319`).
2. **Row source.** There is no repository corpus: the census prints `mined rows: 0` and
   `hypothesis_files=0` (`:1389-1390`), and `spec.md:70` records that no tracked file outside
   `specs/` names `next_check` and no tracked spec file holds the agent's `### Hypothesis <n>`
   heading. Rows come only from the operator-authored JSONL fixture (`readFixture` `:334`),
   which must be outside the repository (refusal `:336`). There is no draw command and no
   seed: the operator writes every row (`goal.md:52`).
3. **Label schema.** `--fixture <file>`; JSON Lines; exactly the fields `id`, `symptom`,
   `claim`, `evidence`, `label`, `jev_ok` (`FIXTURE_FIELDS` `:72`; missing or extra field is
   refused `:276-283`); `label` must be one of `read_code`, `run_test`, `reproduce`,
   `instrument` (`LABELS` `:69`; check `:287-290`); `jev_ok` must be a boolean (`:296-298`).
4. **Gate.** `LABEL_GATE = 30` (`:75`); fewer than 30 fixture rows prints
   `stop: fewer than 30 labeled rows` (`:1415-1417`). Rows available today: 0; none can be
   drawn from the tree.
5. **Feasible by labeling.** No. There is no corpus to label: the operator must author at
   least 30 fixture rows (symptom, claim, evidence, label, `jev_ok`) before any arm runs
   (`spec.md:70`, `spec.md:129`).
6. **Content kind.** Per row the operator's debug notes — `symptom`, `claim`, `evidence`
   (`:72`) — not repository text; private by nature. The payload gate withholds every row not
   marked `jev_ok` from Jev (`:1428-1431`), and `spec.md:186` records the risk ("Rows hold
   private notes") with that gate as the mitigation; `calls.jsonl` carries no row text
   (`spec.md:138`).
7. **Who may write labels.** `goal.md:52` (D2): "Rows come only from the operator's fixture
   outside the repository: symptom, claim, evidence, a label among `read_code`, `run_test`,
   `reproduce` and `instrument`, and `jev_ok`. Fewer than 30 labeled rows stops every arm. No
   model writes a row or a label." `spec.md:129` (REQ-005): "No model writes a row or a
   label." `implementation-summary.md:158`: "No operator fixture exists, so the runs print
   `stop: fewer than 30 labeled rows` and call nothing."

## Closing table

| Phase | Gate | Rows available today | Feasible by labeling | Private content |
|-------|------|----------------------|----------------------|-----------------|
| 027 | 5 confirmed gold reads among the first 5 sampled lineages (`score-stop-rater.cjs:42`, `:531-549`) | 16 sampled lineages with derived gold; 0 labeled | Yes — 16 ≥ 5 | Yes — archived deep-research session transcripts under `specs/**` |
| 028 | 027 report `gate.label.passed === true`, i.e. 027's 5 reads (`score-stop-hint.cjs:119-121`) | 0; no 027 report in the worktree and the session's final one was ungated | No — waits on 027's labels; writes none of its own (`spec.md:94`, `goal.md:56`) | Inherited from 027 (027's transcripts) |
| 029 | ≥20 rows labeled other than `real` (`score-severity-replay.cjs:49`, `:438-440`) | 95 P0 rows in 37 registries; 0 labeled | Yes, if ≥20 negatives exist; a shortfall closes on the stop line (`spec.md:187`) | Yes — archived deep-review findings under `specs/**` |
| 030 | ≥40 labeled pairs and ≥10 labeled cross-body pairs (`score-fanout-pairs.cjs:60-61`, `:664-676`) | 124 candidate pairs (all cross-body), 60 drawable in the sheet; 0 labeled | Yes — 60 drawable ≥ 40 with 10 cross-body | Yes — fan-out finding text under `specs/**` |
| 031 | ≥30 labeled fixture rows (`score-debug-next-check.mjs:75`, `:1415-1417`) | 0; the mined corpus is empty | No — the operator must author a fixture of ≥30 rows from scratch (`spec.md:70`) | Yes — operator debug notes; `jev_ok` gates Jev (`spec.md:186`) |
