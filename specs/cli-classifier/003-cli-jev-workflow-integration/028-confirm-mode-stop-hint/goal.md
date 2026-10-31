---
title: "Goal: Phase 28: confirm-mode-stop-hint"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "confirm-mode stop hint goal"
  - "score-stop-hint completion criteria"
  - "stop hint keep rule"
  - "research r9 test goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint"
    last_updated_at: "2026-09-29T21:15:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Closed the phase at its label gate and set Status Complete"
    next_safe_action: "Operator: confirm 027's gold, then rerun this script on the gated report"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-028-confirm-mode-stop-hint"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "A rater report whose label gate passed, then a rerun of the hint script against it"
      - "A live Deem run and a Jev run on the operator's yes"
      - "The three recorded P2 findings"
    answered_questions: []
---
# Goal: Phase 28: confirm-mode-stop-hint

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle, per signal column and without any model call, whether a confirm-mode stop hint drawn from phase 027's replayed stops would be right at least 9 times in 10 and save an iteration on at least a fifth of the lineages, so its one-line live form is proposed on a counted number or dropped.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `runtime/scripts/score-stop-hint.cjs` and `runtime/tests/unit/score-stop-hint.vitest.ts` in `system-deep-loop`, plus its `SKILL.md`, runtime READMEs, changelog, scoring catalog and playbook. No workflow YAML changes |
| D2 | No mode spawns `jev` or `cli-deem`. The `jev` and `deem` columns are 027's recorded rater answers, selected by `--jev` and `--deem`, and 027 ran their gates |
| D3 | A column's hint is its 027 stop t when t is below the recorded last iteration r. It is right when gold <= t < r and wrong when t < gold. The baseline is today's screen with no hint |
| D4 | Keep rule per column, in order: at least 90 percent of 027's gated lineages measured, `kill` when the one-sided sign test favors wrong hints at 0.05, precision at least 0.9, a right hint on at least 20 percent of measured lineages, a one-sided sign test below 0.05 and, for Jev, 027's flip rate at most 0.10 |
| D5 | Gold and labels are 027's. An ungated 027 report stops the phase. A keep proposes one hint line for a later phase and writes it to no workflow file |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <dir>` on a report whose label gate passed exits 0 and prints `column legacy:` and `column sources:` lines with right, wrong and saved counts and a verdict line for each, while stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [x] On a report whose label gate stopped the script prints `stop: rater report has no confirmed gold`, no verdict and exits 0. With `--jev --deem` on a report without rater columns it prints `jev column skipped: rater report has none` and `deem column skipped: rater report has none`, and its other output is byte-identical to the run without switches
- [x] From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-stop-hint.vitest.ts` exits 0 with at least 10 passed tests and 0 failed
- [x] The phase closed on `stop: rater report has no confirmed gold`, or one run on 027's real report printed a `verdict legacy:` and a `verdict sources:` line and a `verdict jev:` or `verdict deem:` line for each rater column 027 recorded, each `keep`, `kill` or `stop (<reason>)`
- [x] `git status --porcelain` is the same before and after each run, `.skilled/commands/deep/assets/deep-research-confirm.yaml` is unchanged and the build commit touches only `system-deep-loop` files, generated copies and this phase folder
- [x] `validate_document.py` exits 0 on every changed skill doc, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and the Planned `implementation-summary.md`, authored 2026-09-29 by a spec leaf from `../007-classifier-deep-research/research/research.md` section 12 and `../001-deep-research/research/research.md` section 11 `### R9.` |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Done | 2026-09-29: briefs c1 to c5, c6f, c6g and d1 to d6b from `scratch/w4-build/briefs/`, run by the CLI executors of parent D5, every step `STATUS: DONE`. The code steps and both fixes ran on DeepSeek V4.1 Flash through Cline (`--thinking xhigh`), each checked by the test file, the last `Tests 28 passed (28)`; the eight docs ran on Pi `llmgateway/mimo-v2.6-pro` at `high`, after 027 committed. Committed as `97200ea481`, 16 files, not pushed. Source: `SE` sections 1 and 5 |
| Baseline | Done | 027's `npx vitest run` reading, `Test Files 124 passed (124)` and `Tests 2392 passed (2392)` before any wave-4 test file; after 027's contract fix the suite held 125 files and 2,428 tests all passing, the base this phase adds one file and 28 tests to. Source: `SE` section 2; `notes.md` |
| Session verification from the final state | Done | Against 027's final real report (`$SP/w4v/028-final`), whose label gate stopped, with logging stubs for `jev` and `cli-deem` first on `PATH`: the default run exits 0 with `stop: rater report has no confirmed gold`; `--jev --deem --out <dir>` prints the same line and creates no `<dir>`, and `--jev` without `--out` prints it too; the refusals exit 2 before any output line; the script holds no `spawn` or `child_process` and the key grep exits 1; `git status` outside `specs/` was equal before and after; the comment hygiene checker exits 0 on the script and its test; all eight docs validate. Source: `SE` section 2 |
| Tests | Done | `score-stop-hint.vitest.ts` prints `Tests 28 passed (28)`, exit 0. The runtime suite from the staged state printed `Test Files 126 passed (126)` and `Tests 2456 passed (2456)` in 1,111 s against 027's 125 files and 2,428 tests, so this phase adds one file and its 28 tests and no failure. Source: `SE` section 2 |
| Docs and packages | Done | The eight docs landed in `97200ea481`; `sync-skills-hermes.cjs --check` printed `DRIFT system-deep-loop` and the copy was regenerated; the three compiled deep command contracts were recompiled (`[CONTRACT DRIFT] OK commands=3`, the hub digest `a6598045...` to `dc3f83aa...`); the catalog package reads `violations=174`, warn tier, one added `packet_history_metadata` warning on the new F057 line; the playbook package reads `PASS ... scenarios=56 ... violations=0 warnings=1`; `ci-leaf-manifest-freshness.cjs` prints `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`; `compiled-route-guard.cjs` prints `system-deep-loop fresh`. Source: `SE` sections 2 and 4 |
| Review and fixes | Done | Code, read by Pi MiMo (396 s, read only): `VERDICT: FAIL`, 2 P1 and 2 P2. The P1s are `requalify: rater changed` on every rerun and a hand-written stored file in the test, fixed by c6f with c6g and rechecked `VERDICT: PASS` (314 s). Docs, read by DeepSeek on Cline (437 s, read only): `VERDICT: PASS`, 1 P2 fixed by f1 (MiMo, 170 s) with a `VERDICT: PASS` recheck (78 s), 1 P2 recorded. The three remaining P2 findings are below, not chased (parent D5). The SHA-1 over each review's files was equal before and after. Source: `SE` section 3 |
| Commit | Done | `97200ea481` feat(deep-loop): the script, its test, the eight docs, the Hermes copy and the three recompiled contracts, 14 files staged and 16 in all after the pre-commit route-remint gate staged both manifests, not pushed. After the commit `compiled-route-guard.cjs` prints `system-deep-loop fresh` and `ci-leaf-manifest-freshness.cjs` prints `checked=15 fresh=15 failed=0`; 033's uncommitted `deep-review/SKILL.md` edit was set aside for the run and the commit and restored from the scratchpad copy with the same SHA-1 (`40f1164ec420`). The trigger index follows in its own commit. Source: `SE` sections 2 and 5 |
| Closure pass | Done | 2026-09-29: this pass ticked the six criteria, set Status Complete in `spec.md` and `implementation-summary.md`, and recorded the evidence here and in `tasks.md`. Gate results are in `implementation-summary.md` Verification |
| Open for the operator | Open | 1. A rater report whose label gate passed (027's operator gold), then a rerun of this script against it, and 027's live Deem and Jev runs on the operator's yes. 2. The three P2 findings below. Source: `SE` section 6 |

### Deviations and findings

| Item | Note |
|------|------|
| Seam drift (2026-09-29) | The record's `deep-research-confirm.yaml:1316-1345` moved to `:1325-1354`: `gate_post_iteration` starts at `:1325`, its `present` block is `:1328-1345` with options A to D at `:1342-1345`, and option C records `manualStop` at `:1349-1353` |
| Confirm mode is rare | 424 tracked `deep-research-config.json` files name an `executionMode`, and 1 names `confirm`. One tracked `deep-research-state.jsonl` holds a `manualStop` event. Counted by this leaf with `git ls-files` and `grep` |
| Two backends | R9 has no judgment at use time, so this phase has no model arm and no gate of its own. Its model columns are 027's recorded Jev and Deem answers, and 027 applies the identity line, `jev --version`, `jev auth status --provider P` and `cli-deem health` |
| Docs after 027 | The doc steps share `runtime/` files and the hub `SKILL.md` with 027, so they ran after 027's commit. Source: `SE` section 1; `notes.md` |
| Changelog and ids read at doc time | Ruling 2: 027's doc commit took `v1.6.0.0.md`, F056 and DLR-056, so this phase wrote `changelog/v1.7.0.0.md` with `version: 1.7.0.0`, F057 and DLR-057; the design's `v1.5.0.2.md` is stale. Source: `rulings.md` 2; `scratch/w4-session/docs/facts.txt` |
| Hub version unchanged | Ruling 3: the hub `SKILL.md` `version:` (3.0.1.0) and the hub changelog stay unchanged, as in 027. Source: `rulings.md` 3; `scratch/w4-build/logs/d1.last.txt` |
| Column order and no verdict claim | Ruling 4 prints the `jev` column and its verdict before the `deem` column where both exist; ruling 5 claims a `verdict` line in no doc, since no run printed one. Source: `rulings.md` 4 and 5; `scratch/w4-session/docs/facts.txt` |
| Code review P1 1: requalify on every rerun | `main` stored the identity as one `rater` string and read it back through `raterSuffix`, which looks for the rater report's own fields, so `requalify: rater changed` printed on every rerun. Fix c6f compares the stored `rater` string; a session check with the old comparison restored in a scratch copy printed the line once where the fixed script printed none. Source: `SE` section 3 |
| Code review P1 2: untested round trip | The requalify test hand-wrote the stored file in the rater report's shape, so the round trip was untested. Fix c6g runs the script three times into one `--out` folder: the first run and an unchanged rerun print no requalify line, and a changed Deem identity prints it before the verdict. Source: `SE` section 3 |
| Docs review P2 fixed (f1) | The catalog's gate-stop sentence was unconditional, but the refusals run first, so an ungated report with `--out` naming its own folder exits 2 with the collision line and never prints the stop line. Fix f1 (MiMo, 170 s) conditions the sentence on the refusals; recheck `VERDICT: PASS` (78 s). Source: `SE` section 3 |
| Past-gate columns rest on fixtures | No real 027 report passed its label gate; the gated-report columns, verdicts and requalify line are covered by `V`, and the real run closed on the stop line. Source: `SE` sections 2 and 6; `scratch/w4-session/docs/facts.txt` |
| No verdict line | No run printed a `verdict` line, since the final report's label gate stopped. The docs claim none. Source: `scratch/w4-session/docs/facts.txt`; `rulings.md` 5 |
| Hermes drift | `sync-skills-hermes.cjs --check` printed `DRIFT system-deep-loop` and three other hubs whose edits belong to phases not yet committed; only the system-deep-loop copy was regenerated and staged. Source: `SE` section 4 |
| P2 1: null lastIteration | MiMo: the reader exits 2 on a lineage with `lastIteration: null`, a shape the rater writes when a lineage has no state iterations. 027's real report holds 16 lineages, none of them null, so today's run is not hit. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 2: unused seams | MiMo: the injected `env` seam is never read, and `decideVerdict` re-encodes the exported threshold constants as integer forms instead of reading them. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 3: refusal untested | DeepSeek: the `--out` collision refusal has no vitest case and no playbook step. Recorded, not chased (parent D5). Source: `SE` section 3 |
| No build-evidence.md | The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record. Source: `SE` header |
| Premise corrections at close | `spec.md`'s Status and description now say Complete, and its changelog, catalog, playbook and generated-copy rows name `v1.7.0.0.md`, F057 and DLR-057. `plan.md`'s Ready and Done boxes carry their checks and its builder roster states parent D5 as amended on 2026-09-29, and `tasks.md`'s notation carries the closure record. Recorded by this closure pass |
<!-- /ANCHOR:log -->
