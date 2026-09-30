---
title: "Goal: Phase 23: reply-harness-blinded-judge"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "reply harness judge goal"
  - "judge-agreement completion criteria"
  - "blinded judge keep rule"
  - "reply harness label gate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge"
    last_updated_at: "2026-09-29T16:06:52Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at the label gate: 6 of 6 goal criteria ticked, build commit b5e71ae777"
    next_safe_action: "Operator: grade 20 replies, then a live Deem run and a Jev run on their yes"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-023-reply-harness-blinded-judge"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 23: reply-harness-blinded-judge

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle offline, on a counted number per backend, whether a Jev or Deem score per rubric dimension agrees with the operator's grades of masked reply-harness replies more often than the harness's mechanical scores, through one read-only script whose default run makes zero model calls.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `judge-agreement.mjs` and `judge-agreement.test.mjs` in sk-communication's `benchmark/reply-harness/`, one harness README row and, per parent D6, sk-communication's `SKILL.md`, README, changelog, catalog and playbook through sk-doc. No harness script, rubric, case set or release-gate edit |
| D2 | Masked replies join to committed reply files by SHA-256 of their text. The baseline is `score.mjs`, unchanged, on three levels: 0 is `absent`, 1 is `fully met`, anything between is `partly met` |
| D3 | The operator grades every labeled reply on all seven dimensions, and no model writes a grade. Below 20 graded distinct replies the run prints `stop: fewer than 20 labeled replies`, and the phase may close there |
| D4 | Spec section 4's Keep Rule, per column, in order: 90 percent coverage, `kill` when p_loss is below 0.05, a 10-point gain over the baseline on measured cells, p_win below 0.05 over replies and, for Jev, a flip rate of at most 0.10 over three reruns. A Deem `score` holds by its commit pair. A baseline above 0.90 prints `no headroom` |
| D5 | Jev first, then Deem, each only on its own switch and checks, with no failover. An untracked masked file needs `--accept-payload` before Jev. A `keep` serves nothing: any use needs a later phase the operator opens |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node judge-agreement.mjs` over the masked directories `blind/`, `sonnet/blind/` and `attempt-1/blind/` under `specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs/` exits 0, prints `masked: 42`, `distinct: 38`, `matched: 38` and a `stop:`, `no headroom` or `planned calls:` line, and stub `cli-deem` and `jev` first on `PATH` log zero calls
- [x] With a stub `cli-deem health` reporting backend `stub`, `--deem` prints `deem arm skipped: stub backend`, and with a stub `jev auth status --provider official` exiting 3, `--jev` prints `jev arm skipped: no credential`. Each exits 0 with the rest of stdout byte-identical to the default run
- [x] `node --test .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs` exits 0 with at least 18 passed and 0 failed
- [x] Either the census printed `stop: fewer than 20 labeled replies`, or one live `--deem --out <dir>` run printed a `verdict deem:` line and wrote `calls.jsonl` lines each holding `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `judge-agreement.mjs` prints nothing, and `git status --porcelain` is the same before and after each run
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and a Planned `implementation-summary.md`, authored 2026-09-29 from R6 in `../001-deep-research/research/research.md` section 11 and the carried table in `../007-classifier-deep-research/research/research.md` section 12 |
| Seam check | Done | `.skilled/skills/sk-communication/benchmark/reply-harness/README.md:3`, `:11`, `:12` and `:20` resolve at the worktree HEAD with the text R6 cites. `rubric.json` holds 7 dimensions and `cases.json` 7 cases. No line moved |
| Census inputs | Done | Counted by this leaf on 2026-09-29: 3 committed blind runs, 42 masked files, 38 distinct reply texts by SHA-256, 38 matching a committed reply file. Across the 8 committed results files, 24 of 392 mechanical cells are fractional, all `mechanical-tells` |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Done | 2026-09-29: briefs 01 to 20 plus 06b, 11b and `fix/f1.md` from `scratch/w4-build/briefs/`, Devin `deepseek-v4-1-flash-max` for code and Pi `llmgateway/mimo-v2.6-pro` at `high` for docs, all exit 0. The session finished doc briefs 18b, 19 and 20 itself after the operator stopped the Claude leaf. Committed as `b5e71ae777`, 14 files. Source: session record section 1 |
| Census and label gate | Done | `masked: 42`, `distinct: 38`, `matched: 38`, `unmatched: 0`, `no baseline: 1`, `baseline levels: absent=65 partly met=20 fully met=174`, `labels: none`, `labeled: 0`, `baseline agreement: n/a`, then `stop: fewer than 20 labeled replies`, exit 0, stubs first on `PATH` with zero calls. Source: session record section 2 |
| Tests | Done | `node --test judge-agreement.test.mjs`: `tests 43`, `pass 43`, `fail 0`, exit 0, where the harness shipped no test file at baseline. Source: session record section 2 |
| Docs | Done | All 8 changed skill docs `validate_document.py` exit 0, and both review P1 findings closed. Source: session record sections 2 and 3 |
| Review and commit | Done | Pi MiMo on the code `VERDICT: PASS` (4 P2), Devin DeepSeek on the docs `VERDICT: FAIL` (2 P1, 3 P2), both P1 closed and the recheck `VERDICT: PASS`; 7 P2 recorded, not chased (parent D5). Committed as `b5e71ae777`. Source: session record sections 3 and 4 |
| Label gate | Open (operator) | 0 of 38 distinct replies graded. The census stops at `stop: fewer than 20 labeled replies` and no arm called. Source: session record section 2 |
| Live Deem run | Operator, past the gate | T018: one `--deem --out <dir>` run after 20 graded replies. Not part of this phase's completion (parent D4) |
| Live Jev run | Operator, past the gate | T019: one `--jev --out <dir>` run on the operator's flag and the labels. Not part of this phase's completion |
| Phase docs | Done | Closure pass 2026-09-29: `spec.md`, `plan.md`, `tasks.md`, this goal and `implementation-summary.md` record the evidence and correct the stale premises. Gate results are in `implementation-summary.md` Verification |

### Deviations and findings

| Item | Note |
|------|------|
| Flip bound for a Deem `score` | The authoring brief asks for a flip bound over option orders. A `score` asks ordered levels, so it has no option order to rotate, and research C4 gives a Deem `score` no rerun clause because the server answered the same in 40 of 40 repeats. The Deem column prints `flips: n/a (commit pair)`, and the Jev column keeps its three reruns |
| Research premise corrected | R6's record said no harness run was recorded (seat-reported). Three blind runs are committed under `specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs/`. The later reason stands, because none of their replies carries an operator grade |
| Stale path in a sealed order | `runs/attempt-1/blind/order-sealed.json` names `runs/before-replies` and `runs/after-replies`, not the `attempt-1/` directories, so the census joins by reply text and never by the recorded path |
| Build leaf stopped mid-build | The operator said "Dont use opus", "Stop them now" and "No Claude leaves", so the session stopped the Claude build leaf with its executors idle and ran doc briefs 18b, 19 and 20 itself through Pi. Parent D5 now says only Devin and Pi write. Source: session record section 1 |
| Fixture shape | T003 asked for two replies directories of three cases each; brief 01 built three replies directories of seven cases, two masked directories and an edit-after-masking option, and the labels fixture is built per test. It covers every case T003 lists. Source: `scratch/w4-build/briefs/01-task.md`, `judge-agreement.test.mjs` |
| Review P1 1: leaf manifest stale after the docs | `leaf-manifest.json` did not list the two new leaf docs, so `ci-leaf-manifest-freshness.cjs` printed `checked=15 fresh=14 failed=1` and `ci-skill-root-metadata.cjs` failed sk-communication. Closed by `ci-skill-root-metadata.cjs --fix --skill sk-communication`; after it `checked=15 fresh=15 failed=0` and `checked=15 passed=15 failed=0`. Source: session record section 3 |
| Review P1 2: playbook scenario and index missing `--jev` | REQ-014. Closed by Pi fix brief `fix/f1.md` (128 s): one appended sentence in each naming `--jev` and its gate; both files validate (exit 0) and `grep -c -- --jev` prints 1 in each. Source: session record section 3 |
| `baseline-readme-verdicts.json` rewritten | `test_readme_verdict_parity.py --write` moved the harness README from fail to pass, and the whole-file generator also took in 5 tracked READMEs committed earlier under `009-cli-jev-hub-move/scratch/w3-build/attach/` (1,100 to 1,105 files). After it `PARITY PASS: verdict diff is empty`. Source: session record section 4 |
| Hermes copy timing | The sk-communication Hermes copy was regenerated with the 020 commit's sync run and left unstaged until `b5e71ae777`; `sync-skills-hermes.cjs --check` lists no drift for sk-communication. Source: session record section 4 |
| P2 1: `jev --version` gate compares only the first line | So `jev 0.6.2` followed by more output passes the version check. Source: session record section 3 |
| P2 2: requalify branches untested | No test covers `requalify: model commit changed` or `requalify: model changed`. Source: session record section 3 |
| P2 3: exit-4 retry untested | No test covers the Deem exit-4 health recheck retry and the mid-run commit-change stop. Source: session record section 3 |
| P2 4: `jev auth test` recorded as measured | The `calls.jsonl` line for the arm's `jev auth test` says `status: "measured"` though it holds no judgment. Source: session record section 3 |
| P2 5: changelog keep-rule summary drops bounds | The changelog's keep-rule summary drops the exact kill test and the Jev flip bound. Source: session record section 3 |
| P2 6: exit-table stops untested | No test exercises the exit-table stops (2, 3, 4, 130, timeout) or the requalify lines. Source: session record section 3 |
| P2 7: trigger index stale | The trigger index holds no row for the new docs; it was last rebuilt at `bf830c3d47` (this closure pass found 0 matches for `judge-agreement` in `runtime/data/trigger-index.json`) and needs a rebuild after the commit. Source: session record section 3 |
<!-- /ANCHOR:log -->
