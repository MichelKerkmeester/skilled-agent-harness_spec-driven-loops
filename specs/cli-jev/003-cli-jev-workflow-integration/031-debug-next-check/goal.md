---
title: "Goal: Phase 31: debug-next-check"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "debug next check goal"
  - "score-debug-next-check completion criteria"
  - "next check keep rule"
  - "research r18 test goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/031-debug-next-check"
    last_updated_at: "2026-09-29T23:30:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Build committed as ca40e3c2dc; closed at its label gate"
    next_safe_action: "Operator: label 30 or more rows outside the repository, then run the scorer"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-031-debug-next-check"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "At least 30 labeled rows in a fixture outside the repository, then a live Deem run and a Jev run on the operator's yes"
      - "The seven recorded P2 findings"
    answered_questions: []
---
# Goal: Phase 31: debug-next-check

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle, offline and on a counted number per backend, whether a Jev or Deem choice of the cheapest next check for a debug hypothesis beats the best constant answer on an operator-labeled fixture, through one read-only script that first shows no caller seam exists and holds Jev to rows the operator accepted.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `runtime/scripts/debug-next-check/score-debug-next-check.mjs` and `runtime/tests/debug-next-check.vitest.ts` in `system-spec-kit`, plus its `SKILL.md`, README, `runtime/scripts/README.md`, changelog, tooling-and-scripts catalog and playbook. No agent, debugging reference or workflow changes |
| D2 | Rows come only from the operator's fixture outside the repository: symptom, claim, evidence, a label among `read_code`, `run_test`, `reproduce` and `instrument`, and `jev_ok`. Fewer than 30 labeled rows stops every arm. No model writes a row or a label |
| D3 | The baseline is the best of the four constant answers on the labeled rows, ties to `read_code`. Above 90 percent right it prints `no headroom` |
| D4 | Keep rule per backend column, in order: at least 90 percent of its rows measured, `kill` when the one-sided sign test favors the baseline at 0.05, a gain of at least 10 points, a one-sided sign test below 0.05 and a flip rate of at most 0.10 over three option orders |
| D5 | One `choice` per row over the four keys with their vendored descriptions, in three left rotations. Jev reads only rows marked `jev_ok`, Deem reads every row and `calls.jsonl` holds no row text |
| D6 | The caller seam and the reader stay open questions. A keep serves nothing and changes no debug step |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` without `--jev` or `--deem` exits 0 and prints `seam: none` and `mined rows: 0`, while stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [x] A `--fixture` path inside the repository exits 2. With `--jev --deem --out <dir>` and a fixture of 29 labeled rows the script prints `stop: fewer than 30 labeled rows` and both stub logs stay empty. At 30 rows with none marked `jev_ok` it prints `jev arm skipped: payload not accepted`, and a stub `cli-deem health` reporting backend `stub` gives `deem arm skipped: stub backend`
- [x] From `.skilled/skills/system-spec-kit/runtime`, `npx vitest run tests/debug-next-check.vitest.ts` exits 0 with at least 22 passed tests and 0 failed
- [x] The phase closed on `stop: fewer than 30 labeled rows` or `no headroom`, or one live `--deem --out <dir>` run printed `verdict deem: keep`, `verdict deem: kill` or `verdict deem: stop (<reason>)` with its commit pair and wrote a `calls.jsonl` holding no row text. The 2026-09-29 final runs closed at the gate stop on a 29-row synthetic fixture, since the operator wrote no labeled fixture (parent D4). The live-run branch stays open for the operator
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git status --porcelain` is the same before and after each run, `git diff --stat .skilled/agents/` is empty and the build commit touches only `system-spec-kit` files, generated copies and this phase folder
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and the Planned `implementation-summary.md`, authored 2026-09-29 by a spec leaf from `../007-classifier-deep-research/research/research.md` section 12 and `../001-deep-research/research/research.md` section 11 `### R18.` |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Done | 2026-09-29: briefs c1 to c8, c2f, c7f, c9f, c9g and d1 to d6b from `scratch/w4-build/briefs/`, run by the CLI executors of parent D5, every step `STATUS: DONE`. The code steps and every fix ran on DeepSeek V4.1 Flash through Cline (`--thinking xhigh`), each checked by the test file, the last `Tests 31 passed (31)`; the eight docs ran on Pi `llmgateway/mimo-v2.6-pro` at `high`, after the shared 026 doc files landed. Committed as `ca40e3c2dc`, 11 files, not pushed. Source: `SE` sections 1 and 5 |
| Baseline | Done | 026 left the root suite at 109 files and 1,328 tests; the final-state run printed `Test Files 110 passed | 3 skipped (113)` and `Tests 1359 passed | 13 skipped (1372)` in 442 s, so this phase adds one file and 31 tests and no failure. Source: `SE` section 2 |
| Session verification from the final state | Done | With logging stubs for `jev` and `cli-deem` first on `PATH`: the default run exits 0 in 5 s with `seam: none`, `mined: debug_delegation=1 hypothesis_files=0` and `mined rows: 0`, and the stub logs were never written; `--deem --out <dir>` and `--jev --out <dir>` print the same three lines and write only `report.json`; `--deem` without `--out` exits 2 with `--jev or --deem need --out <dir> so every call is recorded` before any call and with no stdout; `git status --porcelain` was equal before and after; the key grep exits 1 and the Python comment hygiene checker exits 0 on the script and its test. Source: `SE` section 2 |
| Gate stop recorded | Done | A 29-row synthetic fixture outside the repository with `--jev --deem --out <dir>` exits 0 ending `stop: fewer than 30 labeled rows` with both stub logs empty; the seam fix changed only the seam pathspec, so the earlier `--fixture` proofs stand. Source: `SE` section 2 |
| Tests | Done | `debug-next-check.vitest.ts` prints `Tests 31 passed (31)`, exit 0, against 22's floor. The root suite printed `Test Files 110 passed | 3 skipped (113)` and `Tests 1359 passed | 13 skipped (1372)` against 026's 109 files and 1,328 tests. Source: `SE` section 2 |
| Docs and packages | Done | All eight docs pass `validate_document.py` (exit 0); the catalog package reads `violations=85`, 026's baseline, and the playbook package `PASS ... scenarios=89 ... violations=0 warnings=1`, one scenario more than 026's 88; `ci-leaf-manifest-freshness.cjs` prints `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`; `system-spec-kit` is not a compiled hub, so no re-mint ran. Source: `SE` sections 2 and 4 |
| Review and fixes | Done | Code, read by Pi MiMo (read only): `VERDICT: PASS`, 7 P2. Docs, read by DeepSeek on Cline (527 s, read only): `VERDICT: PASS`, 1 P2 that the session ruled a P1 and closed by c9f, c9g and f1, each rechecked `VERDICT: PASS`. The seven P2 findings are below, not chased (parent D5). The SHA-1 over each review's files was equal before and after. Source: `SE` section 3 |
| Commit | Done | `ca40e3c2dc` feat(system-spec-kit): the script, its test, the eight docs and the Hermes copy, 11 files, not pushed. The staged set passed the key grep (exit 1). After the commit `compiled-route-guard.cjs` lists only `sk-doc` and `system-deep-loop`, whose routing inputs other phases were editing at the time. The trigger index follows in its own commit. Source: `SE` section 5 |
| Closure pass | Done | 2026-09-29: this pass ticked the six criteria, set Status Complete in `spec.md` and `implementation-summary.md`, and recorded the evidence here and in `tasks.md`. Gate results are in `implementation-summary.md` Verification |
| Open for the operator | Open | 1. At least 30 labeled rows in a fixture outside the repository, then a live Deem run and a Jev run on the operator's yes. 2. The seven P2 findings below. Source: `SE` section 6 |

### Deviations and findings

| Item | Note |
|------|------|
| Seam check (2026-09-29) | The record opened no repository seam, and none exists. `git grep -l next_check -- ':!specs'` prints nothing. The vendored citation `hypotheses.ts:41-45` resolves at `../context/external repo's/claude-jev-main/src/domain/catalog/hypotheses.ts:41-45`, with the four options at `:10-15`. The nearest prompt step is `.skilled/agents/debug.md:246-276`, which has no code line to call from |
| No mined corpus | One tracked `debug-delegation.md` exists outside the template, and no tracked spec file holds a `### Hypothesis <n>` heading. The fixture is the operator's |
| Owner placement | The script sits in `system-spec-kit` because it owns `references/debugging/universal-debugging-methodology.md`. No owner amendment was made before the build. Source: `SE` section 1 |
| Seam drift (2026-09-29) | The record's `git grep -l next_check -- ':!specs'` prints nothing is stale: the generated folder `runtime/cli/retrieval/fixtures/` mirrors spec trigger phrases and names `next_check` (committed by `bf830c3d47`). Ruling 1 excludes it, and fix c9f also excludes every path whose name holds `debug-next-check`, so `seam: none` holds. Source: design section 1; `rulings.md` 1; `SE` section 3 |
| Build count and size | Brief counts landed at c1 to c8 plus fixes c2f, c7f, c9f and c9g, and the script reached 1,570 lines against the design's 350 to 450 LOC estimate, with `V` at 752 lines and 31 cases. Source: `SE` sections 1 and 2; this closure pass |
| Test fix c2f (ruling 6) | The `gate at 29` and `gate at 30` cases hit vitest's 30 s timeout after c2: the mined search ran two greps over every tracked file under `specs/` (25.9 s). Fix c2f narrows it to one `git grep -cE '^### Hypothesis [0-9]' -- 'specs/*.md'` pass (5.6 s). Source: `rulings.md` 6; `SE` section 1 |
| Test fix c7f | After c7 the check failed 1 of 30: the `verdict kill` case fed counts that cannot occur together. The session ran the script against the test's stub and found the script right and the schedule wrong, so c7f corrected the test. Source: `SE` section 1 |
| Fix c9f and c9g (P1) | `seamSearch` greps tracked files for the literal `next_check`, which this phase's script, test and catalog entry hold, so the build commit would have listed them as caller seams. Fix c9f excludes every path whose name holds `debug-next-check`; c9g adds the `seam skips its own files` case. Source: `SE` section 3 |
| Fix f1 (docs) | The changelog, the catalog entry and the playbook now name both seam exclusions, and the playbook no longer says the census's own files appear as hits once tracked. Source: `SE` section 3 |
| Versions and ids read at doc time | Ruling 2: 026 had taken 4.5.0.0 and scenario 462, so this phase wrote `changelog/v4.6.0.0.md` with `version: 4.6.0.0` and playbook scenario 463; the design's `v4.5.0.0.md` and scenario 462 are stale. Source: `rulings.md` 2; `facts.txt` |
| Catalog numbering | The `system-spec-kit` catalog uses section blocks, not the `system-deep-loop` F and DLR ids, so the entry carries no id and the playbook row is scenario 463. Source: this closure pass, from the built files |
| P2 1: withheld identity | `unmeasured_withheld` Jev records carry no `jevVersion`, `provider` or `model`. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 2: skip-line comment | The comment "a skipped arm still writes no file" is false: a failed Jev gate still leaves `calls.jsonl` with the withheld records. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 3: health timeout | `HEALTH_TIMEOUT_MS` is 10,000 where REQ-006 bounds the health check at 2,000 ms; the real client bounds itself at 2 s. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 4: BigInt overflow | `Number(1n << BigInt(n))` overflows past 1,023 disagreements, so `p=NaN` would print; the verdict itself stays exact. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 5: version spelling | The verdict line and report column spell `0.6.2` instead of reading `JEV_VERSION`. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 6: pinned live counts | Two tests pin a live-repository count (`debug_delegation=1`), against ruling 6. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 7: untested Jev paths | No test reaches `jev arm skipped: jev not on PATH`, `unmeasured_timeout` or the Jev exit-4 retry. Recorded, not chased (parent D5). Source: `SE` section 3 |
| No build-evidence.md | The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record. Source: `SE` header |
| Premise corrections at close | `spec.md`'s Status and description now say Complete, its handoff row records the gate stop, and its seam sentence, LOC, test count and changelog rows name what was built. `plan.md`'s roster states parent D5 as amended on 2026-09-29. Recorded by this closure pass |
<!-- /ANCHOR:log -->
