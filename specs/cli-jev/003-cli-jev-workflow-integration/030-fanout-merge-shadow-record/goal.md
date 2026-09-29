---
title: "Goal: Phase 30: fanout-merge-shadow-record"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fanout shadow pair goal"
  - "score-fanout-pairs completion criteria"
  - "pair judgment keep rule"
  - "research r15 test goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record"
    last_updated_at: "2026-09-29T13:30:00Z"
    last_updated_by: "spec-leaf"
    recent_action: "Authored the Planned phase documents for research R15"
    next_safe_action: "Build per plan.md in number order, released 2026-09-29 (parent D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-030-fanout-merge-shadow-record"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 30: fanout-merge-shadow-record

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle, offline and on a counted number per backend, whether a Jev or Deem same-or-different judgment on fan-out finding pairs near the merge's title line or across different bodies matches the operator's labels better than the merge's own decision, while the merge stays unchanged and its reader stays an open question.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `runtime/scripts/score-fanout-pairs.cjs` and `runtime/tests/unit/score-fanout-pairs.vitest.ts` in `system-deep-loop`, plus its `SKILL.md`, runtime READMEs, changelog, fanout catalog and playbook. `fanout-merge.cjs` is read through its exports and never edited |
| D2 | Pairs are cross-lineage findings within one tracked fan-out run. `near-line`: equal body keys and title overlap from 0.05 up to 0.30. `cross-body`: different body keys and overlap of at least 0.5 |
| D3 | The baseline is the merge's own collapse decision, the better of dedup on and dedup off on the labeled pairs, dedup off on a tie. Above 90 percent right it prints `no headroom` |
| D4 | Gold is the operator's `same` or `different` label. Fewer than 40 labeled pairs or 10 cross-body ones stops every arm. No model writes a label |
| D5 | Keep rule per backend column, in order: at least 90 percent of labeled pairs measured, `kill` when the one-sided sign test favors the baseline at 0.05, a gain of at least 10 points, a one-sided sign test below 0.05 and a flip rate of at most 0.10 across the pair orders |
| D6 | One `noul` per pair: Deem in orders AB and BA, Jev AB, BA and AB. Jev receives only registries published at `origin/main`. Every verdict names its reader, `none named` until the operator names one |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` without `--jev` or `--deem` exits 0 and prints `runs:`, `pairs:`, `class near-line:`, `class cross-body:` and `merge decisions:`, while stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [ ] `--write-pair-sheet` with a path inside the repository exits 2 and writes nothing. With `--jev --deem --out <dir>` and a labels file of 39 pairs the script prints `stop: fewer than 40 labeled pairs` and both stub logs stay empty. Past the gate a stub `cli-deem health` reporting backend `stub` gives `deem arm skipped: stub backend`, and a stub `jev` whose `auth status --provider official` exits 3 gives `jev arm skipped: no credential`
- [ ] From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-fanout-pairs.vitest.ts` exits 0 with at least 22 passed tests and 0 failed
- [ ] The phase closed on a `stop: fewer than` line or `no headroom`, or one live `--deem --out <dir>` run printed `verdict deem: keep`, `verdict deem: kill` or `verdict deem: stop (<reason>)` ending `reader=none named` with its commit pair
- [ ] `git diff --stat` on `fanout-merge.cjs` is empty, `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git status --porcelain` is the same before and after each run and the build commit touches only `system-deep-loop` files, generated copies and this phase folder
- [ ] `validate_document.py` exits 0 on every changed skill doc, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and the Planned `implementation-summary.md`, authored 2026-09-29 by a spec leaf from `../007-classifier-deep-research/research/research.md` section 12 and `../001-deep-research/research/research.md` section 11 `### R15.` |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Seam drift (2026-09-29) | Phase 015's `7de30fb16f` moved the merge. The record's `fanout-merge.cjs:341` (the 0.15 line) is now `:392` (`TITLE_DISTINCT_OVERLAP_THRESHOLD`), and `:348-351` (the body-key gate before the title check) is now `:399-402` (`nearDuplicateMatches`). The body key is `nearDuplicateContentKey` at `:345-354`, title overlap is `:376-383` |
| Dedup is opt-in | The near-duplicate pass runs only when `SPECKIT_FANOUT_NEAR_DUP_DEDUP` or `enableNearDuplicateDedup` is set (`fanout-merge.cjs:504-510`). A default merge never reaches the 0.15 line. The baseline therefore reads both decisions |
| Corpus preview | Counted by this leaf over `git ls-files`: 59 research and 46 review fan-out runs with two or more lineage registries. 230 research lineage registries hold 4,396 findings (1,022 with a merge body field, 579 with a title) and 225 review ones hold 1,299 (401 with a body field, 1,243 with a title) |
<!-- /ANCHOR:log -->
