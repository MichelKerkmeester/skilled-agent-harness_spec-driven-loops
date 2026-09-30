---
title: "Implementation Summary: Phase 20: routing-clarify-default"
description: "Complete at the operator's label gate. The zero-call census, the unlabeled rows writer, the scorer with its 30-row gate and both gated arms are built and committed as 65c71719ac. The census counted 3 clarify outcomes over 359 committed prompts and wrote 2 unlabeled rows, none with gold, and the scorer prints stop: fewer than 30 labeled rows (0 labeled) until the operator labels 30 rows."
trigger_phrases:
  - "routing clarify default summary"
  - "score-clarify-default status"
  - "r12 planned phase"
  - "clarify gold not built"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default"
    last_updated_at: "2026-09-29T15:39:02Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at the label gate: build commit 65c71719ac, 6 of 6 goal criteria ticked"
    next_safe_action: "Orchestrator commits the phase docs. The operator labels at least 30 rows, then a model run"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/build-evidence.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-020-routing-clarify-default"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 20: routing-clarify-default

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-routing-clarify-default |
| **Status** | Complete |
| **Completed** | 2026-09-29, at the operator's label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read how often each compiled hub answers `clarify` on committed prompts, and a tested scorer holds the 30-row label gate. The phase closes at that gate, so no model run, no verdict line and no served default exist.

### Phase 20: routing-clarify-default

**The census.** `score-clarify-default.cjs --report <dir> --rows-out <file>` in `.skilled/skills/sk-doc/sk-create-skill/scripts/` (1,566 lines) replays every committed prompt through its hub's compiled engine, read only: the 86 canary cases, the hub playbook scenarios through `parseScenario` and the advisor corpus rows mapped to the compiled hub of their gold skill. It counts per hub and source the prompts, unparsed prompts and the route, clarify, defer and reject outcomes, keeping mode alternatives apart from checklist ones, and it spawns no process. The run on the real tree with stub `jev` and `cli-deem` first on `PATH` printed, among its hub and source lines:

```text
total prompts=359 unparsed=24 route=239 clarify=3 defer=86 reject=7 clarify_mode=2 clarify_checklist=1 gold_in_alternatives=0
corpus: rows=265 none=24 skill_firing=241 mapped=146 no_compiled_hub=95
real clarify rate: not measured
rows written: 2 with_gold=0
```

The three canary clarify rows land one each on `system-deep-loop` (checklist alternatives), `cli-external-orchestration` and `sk-doc` (mode alternatives). `stub/calls.log` was never created. Behind `--transcripts <dir>` the script counts front-door `"action":"clarify"` lines per hub and prints no text; without the flag it prints `real clarify rate: not measured`. The 24 unparsed prompts are 24 playbook scenarios that `parseScenario` could not take (sk-code 7, cli-external-orchestration 17), counted per hub and source and never dropped.

**The rows file.** `--rows-out` wrote 2 mode-alternative rows, one JSON line each with id, hub, source, the committed prompt, the alternatives, `gold` and `label`. `label` is empty on 2 of 2 and `gold` is null on both (`gold_in_alternatives=0`), so no committed prompt supplies the 30-row gold. The file went to `scratch/w4-build/runs/census/rows.jsonl` rather than an operator-named path outside the repository, a recorded deviation: the brief's write scope wins.

**The scorer and the label gate.** `--score <rows file>` validates labels with exit 2 on a foreign label naming the row id, then runs the gate. On the real rows file it printed `rows: 2 labeled=0 operator=0 committed_gold=0` and `stop: fewer than 30 labeled rows (0 labeled)` with exit 0, bare and with `--deem --jev --out <dir>`, creating no out folder and calling no stub. Past 30 labels it prints the fixed `margin: 0.10`, `keep rule:`, instruction, options digest and orders lines, and either `no headroom` or `headroom`.

**The arms and the verdict.** Past the gate, `--jev` and `--deem` each pass their own gate (`jev 0.6.2` with `jev auth status --provider P` exiting 0, or `cli-deem health` within 2,000 ms), else print one skip line and leave the rest of the output byte-identical with exit 0. A passing arm prints its payload and cost line, makes three left-rotated `choice` calls per labeled row with the committed prompt on stdin and the fixed `-q` instruction, records every spawn in `calls.jsonl` before any stop, and ends in `verdict <backend>: keep`, `kill` or `stop (<reason>)` under the Keep Rule fixed in `spec.md` section 4. Jev runs before Deem and a failed gate never starts the other backend. None of this ran here: the tests prove it on stub backends only.

**The tests.** `tests/score-clarify-default.test.cjs` (646 lines, 28 `node:test` cases) covers each public surface with a happy path and an edge case, including `the gate stops at 29 labeled rows`, `30 labeled rows pass the gate`, `a deem stub that answers the label keeps` (`verdict deem: keep`) and `a deem stub that answers the first alternative stops on margin`.

**The nine docs (parent D6, through sk-doc).** `sk-create-skill/SKILL.md`, `README.md`, `changelog/v1.4.0.0.md`, `scripts/README.md`, `scripts/tests/README.md`, the playbook scenario `count-clarify-and-stop-at-the-label-gate.md` (SKL-007) with its index row, and the sk-doc hub catalog entry `compiled-routing-and-legacy-fallback/clarify-default-measurement.md` with its index rows. Each passed `validate_document.py` with `Total issues: 0`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | Created | Census, transcript count, rows writer, scorer, label gate, both arms and the verdict, 1,566 lines. Briefs 01 to 08 |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` | Created | 28 tests, 646 lines. Briefs 01 to 08 and 08b |
| `sk-create-skill/scripts/README.md`, `scripts/tests/README.md` | Modified | One row each. Briefs 09 and 10 |
| `sk-create-skill/SKILL.md`, `README.md` | Modified | The script, its zero-call default, its gate and its two switches. Briefs 11, 12a and 12b |
| `sk-create-skill/changelog/v1.4.0.0.md` | Created | The changelog entry. Brief 13 |
| `sk-create-skill/manual-testing-playbook/parent-hub/count-clarify-and-stop-at-the-label-gate.md` | Created | Scenario SKL-007. Brief 14 |
| `sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` | Modified | The SKL-007 index row. Brief 15 |
| `sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md` | Created | The hub catalog entry. Brief 16 |
| `sk-doc/feature-catalog/feature-catalog.md` | Modified | The catalog index rows. Briefs 17a, 17c and 17b |
| `.hermes/skills/sk-create-skill/SKILL.md` | Regenerated | In `65c71719ac` after the pre-commit route-remint gate |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: 21 briefs, baselines, logs, drafts and evidence |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |

`65c71719ac` holds 14 files: the script, its test, the nine docs and the regenerated Hermes copy. The trigger index follows in its own commit, rebuilt from an archive of HEAD. No router, canary fixture, playbook scenario or front-door file changed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent D3. A build orchestrator leaf (Opus 5.5) started at HEAD `bf830c3d47`, captured the baselines and wrote 21 single-change briefs into `scratch/w4-build/briefs/`, each under 90 lines. It ran them one at a time through `scratchpad/w3/dispatch.sh` on the roster parent D5 set: Devin `deepseek-v4-1-flash-max` for the code (briefs 01 to 08 and 08b) and Pi `llmgateway/mimo-v2.6-pro` at `high` for the docs (briefs 09 to 17c). All 21 exited 0 on the first attempt, no re-dispatch. After every dispatch the orchestrator diffed the tree and checked the result against the brief: `node --test` per slice, `cmp` against the verified drafts for every doc, `validate_document.py` on each.

The orchestrator session then reran the proof plan from the final state: the census with stubs first on `PATH`, the label gate bare and under both switches, the 28 tests, the key grep and `validate_document.py` on all nine docs. It sent the code and the docs to a second model family for review: Pi MiMo on the code Devin wrote (`VERDICT: PASS`, 798 s, keep-rule thresholds hand-checked) and Devin DeepSeek on the docs Pi wrote (`VERDICT: PASS`, 283 s). Both found REQ-001 to REQ-010 met and left 8 P2 findings, recorded and not chased under parent D5. The session committed the build as `65c71719ac`, with the pre-commit route-remint gate re-minting `sk-doc` and `compiled-route-guard.cjs` exiting 0 after the commit. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Close at the 30-row label gate | Parent D4 and parent criterion 2: a phase that prints its label-gate stop from the final state is Complete, and only the operator writes labels |
| Committed prompts only for the census and the rows | Transcript text is the operator's conversation. `--transcripts` counts lines and prints no text, and transcript rows into a rows file stay an operator decision behind the payload gate |
| First alternative as the baseline | It is the router's own tie-break order, the default a reader would see first |
| Count real clarify events from transcripts as numbers only | Research question 10 needs a real rate, and the operator's session text must not leave the machine or land in a report |
| The Keep Rule and its margins were frozen before any model run | The build cannot tune them, and a change after the first run voids every verdict |
| Record the review's P2 findings and fix none | Parent D5 as amended on 2026-09-29: fix P0 and P1, record P2 |
| A keep serves nothing | Serving a default needs the front door's output contract changed, a later phase and the operator's call |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The build orchestrator ran the build checks on 2026-09-29 and the orchestrator session reran the proof plan from the final state before the commit. `BE` is `scratch/w4-build/build-evidence.md` and `SE` is `scratch/w4-session/session-evidence.md`; where they disagree, `SE` wins.

| Check | Result |
|-------|--------|
| Census, stub `jev` and `cli-deem` first on `PATH` | Exit 0, empty stderr, 19 hub and source lines, `total prompts=359 unparsed=24 route=239 clarify=3 defer=86 reject=7 clarify_mode=2 clarify_checklist=1 gold_in_alternatives=0`, `real clarify rate: not measured`, `rows written: 2 with_gold=0`, `stub/calls.log` never created (`BE` section 5 P1, `SE` section 2) |
| Label gate on the real rows file | `rows: 2 labeled=0 operator=0 committed_gold=0`, `stop: fewer than 30 labeled rows (0 labeled)`, exit 0, bare and with `--deem --jev --out <dir>`; no out folder, no stub call (`BE` section 5 P2, `SE` section 2) |
| `node --test score-clarify-default.test.cjs` | `tests 28, pass 28, fail 0`, exit 0, with `verdict deem: keep` and `stop (margin)` on 30 synthetic labels (`SE` section 2) |
| sk-create-skill `node --test` dir, baseline then final | Baseline `tests 19, pass 18, fail 1`; final `tests 47, pass 46, fail 1`. +28 new tests, all pass, same pre-existing `skill-root-metadata-contract` fleet-list failure (`BE` sections 2 and P7 table) |
| sk-doc script suite, baseline then final | `26 PASS, 1 SKIP`, `all sk-doc script tests passed`, exit 0 both times (`test_rename_tooling_fixture_harness.py` skipped at both) (`BE` section 2 and P7 table) |
| Playbook package, baseline then final | `PASS ... violations=0 warnings=0`, scenarios 6 then 7 (+1, SKL-007) (`BE` section P7 table) |
| Catalog package | `WARN tier=warn violations=6`, 0 fail and 6 warn, byte-identical baseline and final (`BE` section P7 table) |
| Scoped drift guard, `verify_alignment_drift.py` over sk-create-skill scripts | 29 tracked files, 2 pre-existing `JS-USE-STRICT` warnings, unchanged; 0 findings on the new files (`BE` sections 2 and P7 table) |
| Key grep, `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script and its test | Exit 1 each (`BE` section 5 P4, `SE` section 2) |
| `git status --porcelain` before the runs and after | Differ only by `system-skill-advisor/feature-catalog/feature-catalog.md`, build 019's concurrent path. The runs changed nothing (`BE` section 5 P4) |
| `validate_document.py` on the nine changed docs | Exit 0, `Total issues: 0` each, the playbook index with `--type playbook` and the catalog index with `--type feature_catalog` (`BE` section 5 P5, `SE` section 2) |
| Comment hygiene on the script and its test | Exit 0 (`SE` section 2) |
| Cross-family review | Pi MiMo on the code `VERDICT: PASS` (798 s), Devin DeepSeek on the docs `VERDICT: PASS` (283 s), REQ-001 to REQ-010 met, reviewed-file SHA-1 `d87b46d77c...` unchanged before and after both runs. 8 P2 findings recorded (`SE` section 3) |
| Build commit | `65c71719ac` feat(sk-doc), 14 files. `compiled-route-guard.cjs` exit 0 after the commit, all hubs fresh. The trigger index follows in its own commit (`SE` section 4) |
| Generator checks | sk-doc leaf manifest `--check`: `leaf-manifest.json OK`, unchanged. Hermes `sync-skills-hermes.cjs --check` and trigger index `--check` reported drift from this phase's edits, regenerated and committed by the session (`BE` section 6, `SE` section 4) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | Rerun after every doc edit; result recorded below and rechecked at the end |
| Closure pass: `validate.sh <this phase> --strict` | Rerun after every doc edit; result recorded below and rechecked at the end |
| Closure pass: `check-goal.cjs <this phase>` | Rerun after every doc edit; result recorded below and rechecked at the end |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | Rerun after every doc edit; result recorded below and rechecked at the end |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are the operator's, and everything after them waits.** The committed prompts give 2 rows with no gold, so the 30-row gate needs `--transcripts` or hand-picked prompts, then labels on at least 30 rows. T018 waits on that, and parent D4 puts it outside this phase's completion.
2. **A live Jev run waits on the operator's yes and on the labels.** After both: `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score <labeled rows> --jev --out <dir>`. No model was called in this build: every run used the logging stubs.
3. **Serving is not in this phase.** A `keep` serves nothing. `compiledRoute` drops the clarify alternatives (`compiled-route.cjs:96-108`), so a served default needs the routing owner to change the output contract first.
4. **8 review P2 findings are recorded, not fixed** (parent D5): row ids repeat across hubs so two same-id rows would share answers; `result.decision.action` is read outside the try in `runCensus`; `main().then` has no catch; a Jev `auth test` past 90 s records `unmeasured` not `unmeasured_timeout`; the shared-description ` [key]` suffix departs from REQ-006's "verbatim"; an unreadable corpus file is skipped with no line; the catalog entry names only `labeled-prompts.jsonl` while the script also reads `holdout-prompts.jsonl`; the Deem arm's stop paths are untested while the Jev stop is pinned.
5. **Five recorded deviations stand.** The ` [key]` suffix follows 002's precedent (Deem refuses duplicate option descriptions); the run outputs went under `scratch/w4-build/runs/` rather than an operator-named path outside the repository, as the brief's write scope required; the sk-doc suite skips `test_rename_tooling_fixture_harness.py` at baseline and final alike; long docs were placed by `cp` from verified drafts and checked with `cmp`; and the score's readings are fixed as p always the sign-test tail, A, B, W and L over measured rows only and the `--out` refusal writing one line to stderr.
6. **Two premise corrections were made at close.** The spec counted 82 playbook files with `expected_workflow_mode`, the build counted 83 (`spec.md` section 2 now says 83), and the UNKNOWN row count is now the census answer: 2 rows, none with gold.
7. **`../changelog/` has no directory.** `spec.md`'s Changelog note asks for a parent changelog refresh at close, but the parent folder holds no `changelog/` and this closure pass may write only this folder's docs.
<!-- /ANCHOR:limitations -->

---
