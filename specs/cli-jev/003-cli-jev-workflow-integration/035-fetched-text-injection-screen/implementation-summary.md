---
title: "Implementation Summary: Phase 35: fetched-text-injection-screen"
description: "Complete at the operator's label gate. The fetch census, the corpus census, the lexical screen, the draw mode, the label gate, the baseline, the Deem and Jev arms with one verdict per column, 40 tests and the 8 hub docs are built and committed as 3d0641004b. The zero-call run counts 486 state files and 185 corpus files and prints stop: fewer than 90 labeled rows until the operator labels the 60 natural rows and writes the 30 planted sentences."
trigger_phrases:
  - "fetched text injection screen summary"
  - "injection screen status"
  - "score-injection-screen planned"
  - "injection screen verdict"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen"
    last_updated_at: "2026-09-29T16:19:07Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at the label gate: build commit 3d0641004b, all goal criteria ticked"
    next_safe_action: "Operator labels 60 rows, writes 30 sentences, then a live Deem run and a Jev run on their yes"
    blockers: []
    key_files:
      - ".skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs"
      - ".skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/build-evidence.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-035-fetched-text-injection-screen"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Where a served screen would run, since no hook handles fetched content"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 35: fetched-text-injection-screen

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 035-fetched-text-injection-screen |
| **Status** | Complete |
| **Completed** | 2026-09-29, at the operator's label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read how often the repository's agents fetch, how large the fixed corpus of public vendored text is, how often the lexical screen fires on it, which 90 rows the seeded draw picked and where the label gate stands. The phase closes at the label gate, so no model run, no verdict line and no served screen exist.

### Phase 35: fetched-text-injection-screen

**The censuses.** `score-injection-screen.mjs` in `.skilled/skills/cli-classifier/benchmark/injection-screen/` (1,699 lines) counts tracked `deep-research-state.jsonl` records whose `toolsUsed` names `WebFetch` or `WebSearch` and the `.claude/agents/` files whose `tools:` line grants either, then walks the tracked `.md` files under the parent's `context/`, refusing the operator's notes file and any `.env` basename, splits them into heading sections outside fenced code and runs the four fixed lexical patterns over the 5 to 60 line band. The default run on the real tree, with stub `jev` and `cli-deem` first on `PATH`, printed:

```text
fetch census: state_files=486 records=6661 ... naming_webfetch=82 naming_websearch=61 files_with_either=31 unparsed_lines=5
corpus census: ... files=185 refused=2 excluded=1
corpus: <one line per source group> total sections=1138 in_band=1022 lexical_hits=0
```

with the HEAD commit, the lexical pattern list and its SHA-256, the instruction hash, `margin: 0.10`, the `keep rule:` line, `labels: labeled=30 of 90 planted_sentences=0 of 30` and `stop: fewer than 90 labeled rows`. Exit 0, no file written and the stub log was never written.

**The draw and the label gate.** `--draw --seed 20260929` wrote `labels.jsonl` (90 rows, no text field, 60 natural rows at `label: null` and 30 planted rows at `labeler: "construction"`) and `planted.jsonl` (30 rows, every `sentence: null` for the operator), per source `supercov-main` 30, `jev-cli-main` 30, `claude-jev-main` 21, `pi-jev-context-main` 6, `social posts` 2 and `jev-review-main` 1. A second draw with the same seed was byte-identical. Until every natural row carries an operator label and every planted id an operator sentence the run stops at the gate and no arm calls.

**The arms and the verdict.** Past the gate, `--jev` first and then `--deem`, each behind its own switch and gate (goal D5). A failed gate prints one skip line, leaves the rest of the output byte-identical, exits 0 and never starts the other backend. A passing arm asks one `noul` per labeled row with the vendored injection question, Deem once and Jev three times with no answer cache, records every call in `calls.jsonl` and prints one line per column under the Keep Rule fixed in `spec.md` section 4: `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)` with K, M, A, B, W, L, TP, FP, F, p and what the column was measured on. Only a verdict from a live `--out` run counts. None ran here: every arm check, skip and verdict case in this build came from the logging stubs in the tests.

**The tests.** `score-injection-screen.test.mjs` (716 lines, 40 `node:test` cases) covers each public surface with a happy path and an edge case: the fetch census and a record with no `toolsUsed`, the section split and a heading inside a fence, the notes-file exclusion and a refused `.env` path, the lexical screen's hit and a section that quotes an example directive, `--draw` reproducibility and refusal to overwrite labels, the label gate at 89 rows and at a missing planted sentence, the zero-call default, both gates and both skips, `--out` required, one `--provider` on every stub `jev` call, a missing answer recorded `unmeasured` and never 0, and the verdict cases `keep`, `kill (precision)`, `stop (coverage)`, `stop (margin)` and a `requalify` line.

**The eight docs (parent D6, through sk-doc).** The benchmark `README.md` layout row, `SKILL.md`'s "Offline Measurement" subsection and its Hermes copy, the hub `README.md` rows, `changelog/v1.2.0.0.md`, the hub root `feature-catalog/feature-catalog.md` with its `measurements/injection-screen-measurement.md` entry and the playbook scenario `manual-testing-playbook/measurements/injection-screen-measurement.md` with its index rows in `manual-testing-playbook.md`. Each passed `validate_document.py`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `benchmark/injection-screen/score-injection-screen.mjs` | Created | Both censuses, section split, lexical screen, `--draw`, label gate, baseline, both arms and the per-column verdicts, 1,699 lines. Briefs 01 to 14 with 01b, 02b and 05b |
| `benchmark/injection-screen/tests/score-injection-screen.test.mjs` | Created | 40 tests on fixture corpora with logging stubs, 716 lines. Briefs 01 to 14 |
| `benchmark/injection-screen/labels.jsonl` | Created | 90 drawn rows with no text field. Drawn with `--draw --seed 20260929` |
| `benchmark/injection-screen/planted.jsonl` | Created | 30 rows, every `sentence: null` for the operator |
| `benchmark/README.md` | Modified | One layout row for `injection-screen/`. Brief 20 |
| `cli-classifier/SKILL.md` | Modified | The "Offline Measurement" subsection and the 1.2.0.0 version field. Briefs 21 and `f1` |
| `cli-classifier/README.md` | Modified | The scorer's navigation row and the release row. Brief 22 |
| `cli-classifier/changelog/v1.2.0.0.md` | Created | The release entry. Brief 23 |
| `cli-classifier/feature-catalog/feature-catalog.md`, `feature-catalog/measurements/injection-screen-measurement.md` | Created | The hub root catalog and its measurement entry. Briefs 24 and 25 |
| `cli-classifier/manual-testing-playbook/measurements/injection-screen-measurement.md`, `manual-testing-playbook/manual-testing-playbook.md` | Created and Modified | The CC-004 scenario and its index rows. Briefs 26 and 27 |
| `cli-classifier/ROUTER.md`, `description.json`, `hub-router.json`, `mode-registry.json` | Modified | The 1.2.0.0 version fields, hub invariant 13a. Brief `f2` |
| `.hermes/skills/cli-classifier/SKILL.md` | Regenerated | By `sync-skills-hermes.cjs` after review P1 1 |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-classifier/manifest.json`, `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/cli-classifier/manifest.json` | Regenerated | By the pre-commit route-remint gate |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: briefs, baselines, logs and evidence |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence, amended REQ-004's cap to 30 and corrected the stale premises |

`3d0641004b` holds 19 files: the two scripts, the two drawn files, the eight docs, the four version files, the Hermes copy and the two activation manifests. No hook, settings matcher or vendored file changed, so every fetch runs as before by construction.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. A build orchestrator leaf (Opus 5.5 xhigh) started at HEAD `bf830c3d47`, captured the baseline in `BE` section 1 and wrote the briefs into `scratch/w4-build/briefs/`. It ran code briefs 01 to 13, with 01b, 02b, 05b and a second attempt of 04, through Devin `deepseek-v4-1-flash-max`, all exit 0. The operator then said "Dont use opus" and chose "Stop them now" and "No Claude leaves", so the session stopped the leaf while brief 14 started, with the scorer and its test unchanged since brief 13. The session ran brief 14 itself through Devin (323 s, `STATUS: DONE`, the test file at 40 cases) and briefs 20 to 27 through Pi `llmgateway/mimo-v2.6-pro` at `high`, each `STATUS: DONE` and the prepared-text ones `cmp` equal. Parent D5 now says only Devin and Pi write.

The hub check then failed `13b-version`, with `SKILL.md` at 1.1.0.0 against `changelog/v1.2.0.0.md`. Two Pi fix briefs closed it: `f1` set `SKILL.md` to 1.2.0.0 and `f2` set the same version in `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json`. After them `parent-skill-check.cjs .skilled/skills/cli-classifier` prints `OK: parent-skill-check — all hard invariants passed, 0 warnings`.

The session reran the proof plan from the final state: the zero-call run and both stub gates exited 0 with the stub log never written, the tests ended `tests 40`, `pass 40`, `fail 0`, the key grep exited 1 with no match, `git status --porcelain` was equal before and after the runs and `validate_document.py` exited 0 on all 8 changed hub docs. The detail is in the Verification table.

It sent the code and the docs to a second model family for review, split by author family and read only, with the SHA-1 over the 14 reviewed files equal before and after both runs: Pi MiMo on the code Devin wrote (952 s) `VERDICT: PASS` with 3 P2, and Devin DeepSeek on the docs and version fields Pi wrote (489 s) `VERDICT: FAIL` with 3 P1 and 3 P2. All three P1 findings closed: the Hermes copy was regenerated (`Wrote 3 of 72`, then `--check` `PASS: 72 Hermes skill copies in sync`), the session ruled that `MAX_ROWS_PER_SOURCE = 30` stands against REQ-004's proposed 20 and REQ-004 is amended at closure with that reason, and the draw was run (`--draw --seed 20260929`) creating `labels.jsonl` and `planted.jsonl`. The Devin recheck (106 s) found all three closed and returned `VERDICT: PASS`, with the SHA-1 over the reviewed files plus the Hermes copy and both drawn files at `fd7fcefd6fad5dc4bff3b3d77eef07320a7ad045` unchanged before and after. The 5 P2 findings were recorded and not chased (parent D5). The session committed the build as `3d0641004b`, not pushed, with the trigger index to follow in its own commit.

Deviations, each in `goal.md`'s log with its source: the per-source cap moved from 20 to 30 because a cap of 20 draws at most 78 rows from the 2026-09-29 corpus and the design needs 90, while a cap of 30 draws 106. The executors changed mid-build under the operator's "Dont use opus" and "No Claude leaves" (parent D5 now says only Devin and Pi write). The hub docs were written at build time, before T017's runs, because parent D6 requires them with the build and T017 waits on the operator's labels. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Measure offline over a fixed corpus | No hook handles fetched content, so the test set is the missing piece this phase can supply without inventing a seam |
| Public vendored text plus operator-planted sentences | Natural positives are rare, and a model-written plant would test the model against its own style |
| The vendored injection question as the `-q` | It is the one the upstream tool already asks, so the phase does not tune its own wording |
| A missing answer is `unmeasured` | The vendored screen turns it into 0, which the research rules out as a silent wrong answer |
| Close at the label gate | Parent D4 and parent criterion 2: a phase that prints its label-gate stop from the final state is Complete, and only the operator writes labels and planted sentences |
| A per-source cap of 30 rows | A cap of 20 draws at most 78 rows from the 2026-09-29 in-band counts and the design needs 90, while a cap of 30 draws 106 (`SE` section 3) |
| The hub-level catalog at a hub root | The hub had no root feature catalog, and `sk-create-feature-catalog`'s contract placed the hub-level measurement at a new `feature-catalog/` root with its entry under `measurements/` |
| Record the review's P2 findings and fix none | Parent D5 as amended on 2026-09-29: fix P0 and P1, record P2 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The build orchestrator ran the build checks on 2026-09-29 and the orchestrator session reran the proof plan from the final state before the commit. `BE` is `scratch/w4-build/build-evidence.md` and `SE` is `scratch/w4-session/session-evidence.md`; where they disagree, `SE` wins.

| Check | Result |
|-------|--------|
| Zero-call run, stub `jev` and `cli-deem` first on `PATH` | Exit 0, `fetch census: state_files=486 records=6661 ... naming_webfetch=82 naming_websearch=61 files_with_either=31 unparsed_lines=5`, `corpus census: ... files=185 refused=2 excluded=1`, per source `total sections=1138 in_band=1022 lexical_hits=0`, `margin: 0.10`, the keep-rule line, `labels: labeled=30 of 90 planted_sentences=0 of 30` and `stop: fewer than 90 labeled rows`, the stub log never written (`SE` section 2) |
| `--deem` with the stub health reporting backend `stub` | Exit 0, `deem arm skipped: stub backend`, the stdout prefix byte-identical to the census, no `--out` folder created (`SE` section 2) |
| `--jev` with the stub `auth status` exiting 3 | Exit 0, `jev: path=<stub>/jev provider=official` then `jev arm skipped: no credential`, the stdout prefix byte-identical to the census, no `--out` folder created (`SE` section 2) |
| `node --test .../tests/score-injection-screen.test.mjs` | `tests 40`, `pass 40`, `fail 0`, exit 0, before and after the draw (`SE` section 2) |
| Key grep and porcelain | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the scorer: exit 1, no match. `git diff --stat .claude/settings.json .skilled/hooks` empty and `git status --porcelain` equal before and after the runs (`SE` section 2) |
| `validate_document.py` on the 8 changed hub docs | Exit 0 each, the catalog root with `--type feature_catalog` and the playbook root with `--type playbook` (`SE` section 2) |
| Comment hygiene | Exit 0 on the scorer and its test (`SE` section 2) |
| Cross-family review | Pi MiMo on the code `VERDICT: PASS` (952 s), Devin DeepSeek on the docs `VERDICT: FAIL` (489 s) with 3 P1 and 3 P2; all three P1 closed and the recheck `VERDICT: PASS` (106 s). 5 P2 findings recorded. SHA-1s unchanged before and after (`SE` section 3) |
| Draw | `--draw --seed 20260929`, exit 0, `draw: seed=20260929 commit=6aa7ca0980d0c385d925ec3b048fd2db87464807 rows=90 natural=60 planted=30`, a second draw byte-identical (`SE` section 3) |
| Drawn files on disk (this closure pass) | `labels.jsonl` 90 rows, no text field, 60 natural at `label: null`, 30 planted at `labeler: "construction"`; `planted.jsonl` 30 rows, every `sentence: null`. Read back with a `node` one-liner |
| Build commit | `3d0641004b` feat(cli-classifier), 19 files, confirmed by `git show --stat` at this closure pass (`SE` section 5) |
| Generated files | The Hermes copy regenerated (`Wrote 3 of 72`), then `sync-skills-hermes.cjs --check` `PASS: 72 Hermes skill copies in sync`. README verdict parity `diff_entries=0`, README manifest `manifest=reproducible`, `compiled-route-guard.cjs` exit 0 after the commit (`SE` section 4) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0, re-deriving graph metadata; the `_memory` block is written by hand and left as recorded (this pass) |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, `Errors: 0  Warnings: 0`, 0 lines matching `RESULT: FAILED`, exit 0 (this pass) |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 (this pass) |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_durable_chars=3987`, at or under 4000, `packet_budget=unknown` by design for a phase child, exit 0 (this pass) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels and sentences are the operator's, and everything after them waits.** 60 natural rows hold `label: null` and all 30 planted sentences are unwritten, so the run stops at `stop: fewer than 90 labeled rows` and no arm calls. T016 and T017 wait on them, and parent D4 puts that outside this phase's completion.
2. **A live Deem run needs the labels.** After T016: one `--deem --out <dir>` run past its gate. No model was called in this build: every run used the logging stubs.
3. **A live Jev run needs the labels and the operator's yes.** T017, plus `jev` 0.6.2 and a credential `jev auth status --provider P` resolves. The build never waits for the flag.
4. **Serving is not in this phase.** No hook handles fetched content, so a served screen needs a seam, a `keep` here and a later phase the operator opens. The seam stays an open question (spec section 7).
5. **5 review P2 findings are recorded, not fixed** (parent D5): the `keep rule` test compares the module's constant with itself; `spawnCall`'s `unmeasured_timeout` branch is never exercised; `README.md:8` and `manual-testing-playbook.md:4` stay at 1.1.0.0; `SKILL.md:158` still links `changelog/v1.1.0.0.md`.
6. **The trigger index needs its own commit.** It holds no row for the new docs and follows after this commit (`SE` section 5).
7. **Vendored markdown is not a fetched page.** Fetched pages are longer, converted from HTML and chosen by the agent, so a served form must remeasure on real fetch output under its own gate (`spec.md` section 6).
8. **One inferred check.** T020's `cli-deem.test.mjs` parity clause has no post-build run in the evidence, its last recorded run is T002's 34 of 34 and the commit touches no `cli-deem` file. One rerun would confirm it.
9. **Premise corrections at close.** This file's "Nothing is built yet" is replaced by the build record, `spec.md`'s Status and description now say Complete and commit `3d0641004b`, `tasks.md` no longer says "Nothing is built", and `goal.md`'s log records the cap amendment and the other deviations.
10. **`../changelog/` has no directory.** `spec.md`'s Changelog note finds no parent changelog to refresh at close, and this closure pass may write only this folder's docs.
<!-- /ANCHOR:limitations -->

---
