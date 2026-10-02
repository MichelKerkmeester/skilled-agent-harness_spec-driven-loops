# Label inventory 2 — what each label-gated scorer needs before a verdict

Read-only inventory of phases 023, 024, 025 and 026 (each a folder
`specs/cli-jev/003-cli-jev-workflow-integration/<NNN>-*/`), collected in this worktree at HEAD
`ebcc68e8edb42bc736cf52ecb89c1997f5c84e82`. Every fact cites `path:line`. Figures marked **measured** come
from a command run for this inventory; the four zero-call censuses are the only commands that executed a
scorer, and no `--deem` or `--jev` switch was passed, so no model, no `jev` and no `cli-deem` was called.
No file outside this evidence folder was written.

Shared shape of all four: the labels file is **operator-named**, is JSONL, and the scorer only reads it.
None of the four writes a label, and each reports the labels file's SHA-256 in its verdict line.

---

## Phase 023 — `023-reply-harness-blinded-judge`

1. **Scorer and commands.**
   - Scorer: `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs`; `USAGE` at
     `judge-agreement.mjs:1235`.
   - Zero-call census (**measured**, exit 0): `node .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs --masked <R>/blind --masked <R>/sonnet/blind --masked <R>/attempt-1/blind --replies <R>/before-replies --replies <R>/after-replies --replies <R>/sonnet/before-replies --replies <R>/sonnet/after-replies --replies <R>/attempt-1/before-replies --replies <R>/attempt-1/after-replies`, where
     `R=specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs`. Same command
     as the phase's proof 1, `spec.md:181`.
   - Label-gated run: the census command plus `--labels <file>`, and `--deem --out <dir>` or
     `--jev --out <dir>` for a model column (`implementation-summary.md:175`).

2. **Row source.** The rows to grade are the masked files under
   `<R>/{blind,sonnet/blind,attempt-1/blind}`, 14 `.md` each (**measured**: `ls <dir>/*.md | wc -l` = 14 per
   directory, 42 total). They are **inside the repo and committed** (a public repository, `spec.md:201`).
   Regeneration, if they were missing: `README.md:28`
   `node blind.mjs --a <before replies dir> --b <after replies dir> --out <masked dir>`, whose inputs are
   produced by `generate-prompts.mjs` plus hand-run replies plus `score.mjs` (`README.md:25-27`). **No seed
   exists**: `blind.mjs:60` assigns the A/B labels with `Math.random() < 0.5`. The labels file itself is
   operator-named (`spec.md:116`, `` `<operator-named labels file>` ``).

3. **Label schema.** Operator-named file, JSONL, one row per graded masked file: `masked` (non-empty string,
   a path relative to the repository root; `judge-agreement.mjs:273`) and `grades` (object; `:275`) holding
   every dimension id of `rubric.json` (`:277`; `rubric.json` holds 7 under `dimensions`, **measured**), each
   value in `absent`, `partly met` or `fully met` (`:45`, `:283`). A row's `masked` path must name a masked
   file the census saw (`:307`). Two rows whose replies share a SHA-256 must agree, else the run prints
   `stop: label conflict` and exits 2 (`:318`). The README states the same shape at `README.md:30`.

4. **Gate.** `LABEL_GATE = 20` (`judge-agreement.mjs:48`); the stop line is
   `stop: fewer than 20 labeled replies` (`:409`). The counted set is `labeled.size` (`:379`, `:390`): graded
   **distinct matched replies that also carry a baseline**. Distinct because the map is keyed by reply-text
   SHA (`:314`); a graded reply with no `score.mjs` result is dropped from the count and reported as
   `no_baseline`/`no baseline` (`:1375-1383`, `:1389-1395`, the drop at `:1391`). Above 0.90 baseline agreement the run prints
   `no headroom` and opens no arm (`:410`).
   **Measured today** (exit 0): `masked: 42`, `distinct: 38`, `matched: 38`, `unmatched: 0`,
   `no baseline: 1`, `labels: none`, `labeled: 0`, `baseline agreement: n/a`, then
   `stop: fewer than 20 labeled replies` — identical to the recorded census at
   `implementation-summary.md:63-77`. So 0 of 20 are graded; at most 37 distinct replies can count toward
   the 20 (38 distinct minus the 1 without a baseline), and any 20 of them suffice.

5. **Feasible by labeling: yes.** The corpus already holds 38 distinct matched replies
   (`distinct: 38`, **measured**; `implementation-summary.md:64`) and only the operator's grades are missing
   (`goal.md:91` "0 of 38 distinct replies graded"). No fixture or planted text has to be authored: the
   operator grades 20 already-committed replies. It does not wait on another phase (`spec.md:33` "No later
   phase waits on it").

6. **Content kind.** Each masked file carries `Case: <id>`, the case question, then a `Reply A:`/`Reply B:`
   block of model reply text (**measured** by reading `R/blind/C1-A.md`); the parser splits on the
   `Reply A:`/`Reply B:` marker (`judge-agreement.mjs:69`). **Not private**: the three runs are committed in
   this public repository (`spec.md:201`), and the Jev payload gate treats tracked masked files as
   `committed masked replies` (`spec.md:135`).

7. **Who may write labels (quoted).** `goal.md:50` D3: "The operator grades every labeled reply on all seven
   dimensions, and no model writes a grade." `spec.md:95`: "Writing a grade with a model. The operator grades
   every labeled reply." `spec.md:131` REQ-004: "The labels are the operator's and the gate is fixed".

---

## Phase 024 — `024-hallucination-grader`

1. **Scorer and commands.** Below, `S` is
   `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark`.
   - Scorer: `S/scorer/score-d4-agreement.cjs`; `USAGE` at `score-d4-agreement.cjs:49`.
   - Zero-call census (**measured**, exit 0):
     `node S/scorer/score-d4-agreement.cjs --outputs <dir>`; same as the phase's proof 2, `spec.md:185`.
   - Label-gated run: `node score-d4-agreement.cjs --outputs <dir> --labels <file> --deem --out <dir>`
     (`implementation-summary.md:179`).

2. **Row source.** The rows to label are the markdown outputs `<id>.md` and `<id>.run<k>.md` under the
   operator-named `--outputs` directory (`listOutputs`, `score-d4-agreement.cjs:63-73`), each matched to
   `<id>.json` under `--fixtures`, default `assets/model-benchmark/benchmark-fixtures`
   (`score-d4-agreement.cjs:46`). The outputs are **written outside the package by a benchmark run**
   (`spec.md:49`, "A `/deep:model-benchmark` run writes one `<fixture-id>.md` per fixture under its outputs
   directory (`run-benchmark.cjs:138-141`)"), and **none exists in the tree today**. If they must be
   produced: `node S/run-benchmark.cjs --profile <path-or-id> --outputs-dir <path> [--samples <n>] [--scorer 5dim] [--grader noop|mock|llm]`
   (`run-benchmark.cjs:580`), which writes `<id>.md` (`:138-141`) and, with `--samples`, `<id>.run<k>.md`
   (`:274-276`; the `.run<k>` suffix folds back to the same id at `score-d4-agreement.cjs:64-70`). **No seed
   exists**: `grep -n 'seed' run-benchmark.cjs` returns nothing; `--samples` takes a count only.

3. **Label schema.** Operator-named `--labels <file>`, JSONL, one row per output: `output` (the file name,
   no `/`; `score-d4-agreement.cjs:153-154`) and `hallucinated` in `yes`/`no` (`:157-158`); rows are keyed
   by file name (`:161`) and a duplicate exits 2 (`:160`). `yes` means "the output names a command-line flag,
   file or function that the fixture's task does not provide" (`spec.md:134`). A labeled output that matches
   no fixture leaves the labeled set and is reported as `labels dropped: N` (`:1236`, `:1240`).

4. **Gate.** `LABEL_GATE = 30` (`score-d4-agreement.cjs:39`) **and** `CLASS_GATE = 5` per class (`:41`). Stop
   lines, in order: `stop: fewer than 30 labeled outputs` (`:1248`), `stop: fewer than 5 labeled yes outputs`
   (`:1251`), `stop: fewer than 5 labeled no outputs` (`:1254`); above 0.90 baseline accuracy `no headroom`
   (`:1255-1257`). **Measured today**, census over an empty outputs directory (exit 0): `outputs: 0`,
   `matched: 0`, `unmatched: 0`, `allowlist: 0 of 21`, `labels: none`, `labeled: 0 (yes 0, no 0)`,
   `labels dropped: 0`, then `stop: fewer than 30 labeled outputs`. So 0 of 30 are labeled and **0 output
   rows exist at all**. The fixture side exists: 21 JSON fixtures under `benchmark-fixtures/`
   (**measured**: `ls *.json | wc -l` = 21; same `allowlist: 0 of 21` line), **0 of them carry an
   `allowlist` key** (**measured**, `grep -l allowlist *.json | wc -l` = 0; `spec.md:72`), and each fixture
   can yield more than one output through `--samples` / reruns, so 30 labelable rows are reachable once the
   benchmark is run.

5. **Feasible by labeling: no, not from today's corpus.** There is nothing to label until the operator (or a
   benchmark run) produces outputs; producing them is explicitly outside the phase (`spec.md:98` "Producing
   benchmark outputs. The census reads outputs the operator names."; `spec.md:49` "None exists in the tree
   today"). It does not wait on another *phase*: it waits on a benchmark run whose outputs the operator
   names. After that run, labeling 30 rows with at least 5 of each class is feasible (21 fixtures plus
   `--samples`, `run-benchmark.cjs:274-276`).

6. **Content kind.** Benchmark model output text — the `.md` answer a model wrote for a fixture's task, which
   the labeler reads to decide whether it names a flag, file or function the task does not provide
   (`spec.md:134`, `spec.md:144`). The outputs are "usually untracked" (`spec.md:204`), so the Jev arm then
   needs `--accept-payload` (`spec.md:138`); Deem keeps the text on the machine. It is not the operator's
   conversation transcript.

7. **Who may write labels (quoted).** `goal.md:50` D3: "The operator labels every output `yes` or `no`, and no
   model writes a label." `spec.md:99`: "Writing a label with a model, failover between backends, a global
   switch, a shared client library or a dollar figure in any cost line." `spec.md:134` REQ-004: "The labels
   are the operator's and the gate is fixed".

---

## Phase 025 — `025-reviewer-verdict-fallback`

1. **Scorer and commands.** Below, `S` is
   `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark`.
   - Scorer: `S/lib/score-verdict-fallback.cjs`; `USAGE` at `score-verdict-fallback.cjs:64`.
   - Zero-call census (**measured**, exit 0, bare run over the reviewer fixtures):
     `node S/lib/score-verdict-fallback.cjs`; optional `--outputs <file>` and repeatable `--reports <dir>`
     (`spec.md:83`).
   - Label-gated run: `node score-verdict-fallback.cjs --outputs <file> --deem --out <dir>`
     (`implementation-summary.md:176`).

2. **Row source.** The rows to label are the regex-miss reviewer outputs in the operator-named
   `--outputs <file>` (JSONL). The four reviewer fixtures are replayed read-only (`spec.md:113`,
   `score-verdict-fallback.cjs:1311-1312` reports on `--reports`), and a **live run keeps only a hash**:
   `runCase` records a 16-character output hash and not its text (`reviewer-scorer.cjs:203`; `spec.md:192`
   states the same). So miss texts come from **outside the tool**, and no draw command or seed exists: the
   phase's open question names the only options, an opt-in output save in the reviewer scorer (out of scope,
   `spec.md:94`) or reviewer outputs gathered from other review sessions (`spec.md:206`). Today the outputs
   file does not exist, and **no `reviewer-report.json` exists anywhere** (**measured**:
   `find . -name 'reviewer-report*.json'` finds none).

3. **Label schema.** The `--outputs` file is the labels file. Operator-named, JSONL, one row per output:
   `id` (non-empty string, unique; `score-verdict-fallback.cjs:191`, `:200`), `output` (the reviewer's text,
   a string; `:195`), `label` in `pass`/`fail`/`block` (`:199`), plus an optional `expectedVerdict` that is
   kept for reference and **never scored** (`:203`, `spec.md:128`). Only **regex misses** enter the labeled
   population: `censusOutputs` keeps a row only when `extractVerdict(row.output).verdict === null`
   (`:216-220`); a row whose text carries a pattern verdict is a hit and leaves the set, so its `label` is
   ignored. The file's own SHA-256 is the `labels_sha256` in the verdict (`:1284`).

4. **Gate.** `LABEL_GATE = 12` (`score-verdict-fallback.cjs:44`); `stop: fewer than 12 labeled regex-miss
   outputs` (`:1330`), then one per-verdict floor — `stop: no labeled pass output` (`:1333`),
   `stop: no labeled fail output` (`:1336`), `stop: no labeled block output` (`:1339`) — then `no headroom`
   above 0.90 (`:1342`). **Measured today** (exit 0): `fixture cases: 8 hits: 8 misses: 0`,
   `labeled: 0 (pass 0, fail 0, block 0)`, all baselines `right 0 of 0`, then
   `stop: fewer than 12 labeled regex-miss outputs` — identical to the recorded census at
   `implementation-summary.md:61-73`. So 0 of 12 are labeled, and **0 regex-miss rows exist** (8 of 8
   fixture cases hit; `spec.md:71`).

5. **Feasible by labeling: no, not from today's corpus.** No recorded reviewer output misses the regex
   (`fixture cases: 8 hits: 8 misses: 0`, **measured**; `spec.md:71`), no `reviewer-report.json` exists
   (**measured**), and even a live run would leave nothing to read (`reviewer-scorer.cjs:203`). The operator
   must first author or supply regex-miss output text with its full text (`spec.md:206`); labeling alone
   reaches 0 of 12. The phase itself records this as R5's answer if no misses arrive (`spec.md:192`).

6. **Content kind.** Reviewer model output text — the review prose in which the operator reads the verdict it
   gives (`spec.md:128`). Operator-named, "usually untracked" (`spec.md:197`), so the Jev arm needs
   `--accept-payload`; Deem keeps the text on the machine. It is not the operator's own conversation, but it
   is model output whose provenance the operator decides.

7. **Who may write labels (quoted).** `goal.md:50` D3: "The operator labels each miss with the verdict it
   gives, `pass`, `fail` or `block`, and no model writes a label. `expectedVerdict` is never the label."
   `spec.md:96`: "Treating the fixtures' `expectedVerdict` as the label. The fallback reads what a reviewer
   decided, which the operator labels, and a reviewer can decide wrongly." `spec.md:97` repeats the
   no-model-label rule. `spec.md:128` REQ-003: "The labels are the operator's and the gate is fixed".

---

## Phase 026 — `026-completion-claim-audit`

1. **Scorer and commands.** Run from `.skilled/skills/system-spec-kit/runtime`:
   - Scorer: `scripts/completion-claim-audit/score-completion-claims.mjs`; `USAGE` at
     `score-completion-claims.mjs:99`.
   - Zero-call census (**measured**, exit 0, on a synthetic rows fixture):
     `node scripts/completion-claim-audit/score-completion-claims.mjs --rows <file>`; the phase's proof 1 is
     `--rows <phase 003 fixture>` (`spec.md:177`).
   - Label-gated run:
     `node scripts/completion-claim-audit/score-completion-claims.mjs --rows <file> --labels <file> --deem --out <dir>`
     (`implementation-summary.md:178`); the Jev arm additionally needs `--accept-payload` (`goal.md:52` D5).

2. **Row source.** `--rows <file>`, JSONL, one turn per row with `id` and `raw_text` (`parseRows`,
   `score-completion-claims.mjs:112-133`). The phase names phase 003's fixture
   `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` as that file (`spec.md:113`, `spec.md:47`), which is
   **untracked and excluded through `.git/info/exclude`** (`spec.md:47`; `git check-ignore -v` names the
   exclude entry, **measured**) — and it **does not exist**: `ls` fails, `find . -path
   '*/hooks/goal/lib/verifier-labeled-set.jsonl'` finds nothing anywhere under `Public/`, and running the
   census on that path exits **2** with
   `ENOENT: no such file or directory, open '.../verifier-labeled-set.jsonl'` (**measured**).
   To draw it: `node .skilled/hooks/goal/lib/build-verifier-fixture.cjs --pi ~/.pi/agent/sessions --out .skilled/hooks/goal/lib/verifier-labeled-set.jsonl [--limit <n>]`
   (`specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow/plan.md:101`), whose only
   flags are `--pi`, `--claude`, `--out`, `--limit` (`build-verifier-fixture.cjs:351-372`), default limit 50
   (`:28`), and which refuses to overwrite an existing output (`OUT_EXISTS`, `:403-404`). **No seed flag
   exists**; determinism comes from the fixed category order and round-robin deal (`:36-38`: "Category order
   fixes the round-robin deal and the pick order, so the same logs always yield the same rows."). The source
   corpus is present today: `~/.pi/agent/sessions` holds **7,279** `.jsonl` session files (**measured**,
   filename count only), and phase 003's run of it produced 50 Pi rows, 0 Claude
   (`../003-goal-verifier-jev-shadow/tasks.md:58`), in a file of 261,233 bytes, mode `0600`, sha256
   `25f40db4...66f4f` (`../003-goal-verifier-jev-shadow/implementation-summary.md:102`).

3. **Label schema.** Operator-named `--labels <file>`, JSONL, one row per labeled turn: `id`, which must be an
   id in the rows file (an unknown id exits 2, `score-completion-claims.mjs:199`), and `claim` in `yes`/`no`
   (`:196`); any other value exits 2 (`:196`). `yes` means the turn ends by claiming the work is complete
   (`spec.md:128`). The labels file's SHA-256 is printed on the `labels:` line (`implementation-summary.md:78`).

4. **Gate.** `LABEL_GATE = 30` (`score-completion-claims.mjs:48`) **and** `CLASS_GATE = 5` per class (`:51`).
   `gateLine` (`:301-303`) prints, in order, `stop: fewer than 30 labeled rows`,
   `stop: fewer than 5 labeled yes rows`, `stop: fewer than 5 labeled no rows`; above 0.90 regex accuracy it
   prints `no headroom` (`:305`). **Measured today**: 0 rows exist (the named fixture is absent; the census
   on that path exits 2 `ENOENT`), so 0 of 30 are labeled. Running the census on a synthetic fixture
   (`runtime/tests/completion-claim-audit-fixtures/census-happy.jsonl`) printed `rows: 12 fires: 10` and
   `stop: fewer than 30 labeled rows`, exit 0. Drawable rows: **50** by the builder's default
   (`DEFAULT_LIMIT = 50`, `build-verifier-fixture.cjs:28`), the same count phase 003 drew
   (`../003-goal-verifier-jev-shadow/tasks.md:58`). *Inference, not a measurement*: the regex fires on only
   4 of those 50 rows (`spec.md:71`, `goal.md:84`; a counts-only run), so the 5-`yes` class floor may be hard
   to reach from 003's rows alone; the rows file is operator-named, so a different or larger rows file is
   allowed (`spec.md:194` risk row, which makes the same point for false fires).

5. **Feasible by labeling: no, not today.** The row source the phase names does not exist (measured
   `ENOENT`, exit 2), so there is nothing to label until the builder is run once — and the builder reads the
   operator's Pi session logs **outside the repository** (`~/.pi/agent/sessions`,
   `../003-goal-verifier-jev-shadow/plan.md:101`), not a repo artifact. Feasible after that draw: 50 rows are
   present for labeling, subject to the class-floor caveat in item 4.

6. **Content kind.** The operator's own conversation turns: `raw_text` per turn, which the labeler reads in
   full to decide whether the turn claims completion (`spec.md:128`). The model sees only the trimmed last
   400 characters (`TAIL_CHARS = 400`, `score-completion-claims.mjs:45`; `detectTail`, `:142-143`), the same
   tail the regex reads. **Private: yes.** `spec.md:132` REQ-008: "The rows are the operator's conversation.
   The Jev arm runs only with `--accept-payload` ... which states the operator stripped secrets from the rows
   first, as phase 003's D6 requires." `spec.md:196` records that no module scrubs such values, so the
   operator strips them by hand; only Deem keeps the text on the machine (`goal.md:52` D5). The report
   directory must sit outside the repository (`refused: report directory inside the repository`, `:1140`).

7. **Who may write labels (quoted).** `goal.md:50` D3: "The operator labels each turn `yes` or `no` for a
   completion claim, and no model writes a label." `spec.md:96`: "Writing a label with a model, failover
   between backends, a global switch, a shared client library or a dollar figure in any cost line."
   `spec.md:128` REQ-004: "The labels are the operator's and the gate is fixed". Phase 003's inherited rule
   is stated at `spec.md:48`: "No model writes a label, as parent goal D4 rules for phases 003 and 006."

---

## Closing table

| Phase | Gate | Rows available today | Feasible by labeling | Private content |
|-------|------|----------------------|----------------------|-----------------|
| 023 | 20 graded distinct matched replies (`judge-agreement.mjs:48`, `:409`) | 42 masked / 38 distinct / 38 matched, 37 with a baseline; 0 graded (**measured**) | Yes — grade 20 of the 37 eligible committed replies | No — committed in a public repo (`spec.md:201`) |
| 024 | 30 labeled outputs, ≥5 of each class (`score-d4-agreement.cjs:39`, `:41`, `:1248-1254`) | 0 outputs (**measured** `outputs: 0`); 21 fixtures, 0 with an `allowlist`; more outputs via `--samples` | No — the operator must produce or name outputs first; producing them is out of scope (`spec.md:98`) | Untracked model outputs (`spec.md:204`); not the operator's conversation |
| 025 | 12 labeled regex-miss outputs, each of `pass`/`fail`/`block` present (`score-verdict-fallback.cjs:44`, `:1330-1339`) | 0 misses (8 fixture cases, 8 hits, **measured**); no `reviewer-report.json`; a live run keeps only a hash (`reviewer-scorer.cjs:203`) | No — no miss text exists; the operator must supply it (`spec.md:206`) | Untracked reviewer output text (`spec.md:197`); not the operator's conversation |
| 026 | 30 labeled rows, ≥5 of each class (`score-completion-claims.mjs:48`, `:51`, `:301-303`) | 0 rows — the named 003 fixture is absent (**measured** `ENOENT`, exit 2); 50 rows drawable from `~/.pi/agent/sessions` (7,279 session files) | No — draw the rows file first, then label; the draw reads logs outside the repo | Yes — the operator's own turns (`spec.md:132`); Jev needs `--accept-payload` |
