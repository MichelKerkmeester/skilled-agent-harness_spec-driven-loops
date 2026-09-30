---
title: "Feature Specification: Phase 28: confirm-mode-stop-hint"
description: "Test research R9 offline: replay the confirm-mode post-iteration gate over phase 027's lineages and measure whether a stop hint drawn from a zero-call rule or from 027's recorded Jev or Deem rater would be right often enough to show. It makes no model call in any mode, reads 027's report, and each signal column ends in one verdict line under a keep rule fixed here. Built and closed at its label gate on 2026-09-29, commit `97200ea481`."
trigger_phrases:
  - "confirm-mode stop hint"
  - "score-stop-hint"
  - "stop suggestion precision"
  - "gate post iteration hint"
  - "research r9 test phase"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 28: confirm-mode-stop-hint

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-29 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 28 of 35 |
| **Predecessor** | 027-stop-second-rater |
| **Successor** | 029-p0-reread-order |
| **Handoff Criteria** | The script has read phase 027's `report.json` and printed, per signal column, the lineages it measured, the right and wrong hints, the iterations saved and either a stop line or one `verdict <column>:` line. Without a 027 report that passed 027's label gate, it printed `stop: rater report has no confirmed gold` and closed there. The 2026-09-29 final run read a 027 report whose label gate stopped, so it printed the stop line, no verdict line and wrote nothing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 28** of the cli-jev workflow integration specification. On 2026-09-29 the operator asked for "a phase per later item not yet planned or implemented so we can test everything". This phase tests research R9, the confirm-mode stop suggestion, ranked 13th and `later` in `../007-classifier-deep-research/research/research.md` section 12, with judgment type "none at use time" and preferred backend "none". The full record is `../001-deep-research/research/research.md` section 11, `### R9.`, with its promote line at `:1274`.

**Scope Boundary**: One new read-only evaluator in the `system-deep-loop` runtime, its vitest file and the skill docs parent D6 requires. It spawns neither `jev` nor `cli-deem` and edits no workflow YAML, so the confirm-mode gate shows exactly what it shows today.

**Dependencies**:
- Released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- Phase 027 (`027-stop-second-rater`): its script and one run's `report.json` and `calls.jsonl`. The evaluator can be built and tested against a fixture report before 027 runs. Its verdicts wait on a 027 report whose label gate passed.
- The build roles of parent D5 and the doc route of parent D6, in `plan.md`.

**Deliverables**:
- `score-stop-hint.cjs` (proposed), reading 027's report through `--rater-report <dir>` (proposed), with the zero-call columns by default and `--jev` and `--deem` (proposed) selecting 027's recorded rater columns
- `tests/unit/score-stop-hint.vitest.ts` (proposed) against fixture 027 reports
- One report per run in a directory the operator names
- The `system-deep-loop` docs parent D6 names, written through sk-doc

**Changelog**:
- None. The parent packet has no `../changelog/` folder (checked 2026-09-29).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

In confirm mode the operator answers a continue-or-stop question after every iteration. The gate shows the focus, the findings count, `newInfoRatio`, the status, remaining questions, the stuck count and three summaries, then offers A) continue, B) adjusted focus, C) stop and synthesize and D) cancel (`.skilled/commands/deep/assets/deep-research-confirm.yaml:1325-1354`). Choosing C records a `manualStop` event (`:1349-1353`). Nothing on that screen says whether the loop has run dry. R9 proposes one evidence line there.

The research parked R9 as `later` because it waits on R8 (`../007-classifier-deep-research/research/research.md:421`): the line would show a calibrated signal, and no signal is calibrated yet. Its bar is a suggestion precision of at least 0.9 and one iteration saved on at least 20 percent of lineages (MiMo-08), measured on R8's replay. The record also says that if R8 shows a local signal is enough, the hint ships with no model code. One more fact bounds the value: this leaf counted 424 tracked research configs that name an `executionMode` on 2026-09-29, and 1 names `confirm`. One tracked state log holds a `manualStop` event. Confirm mode is rare in the recorded runs, so the hint would have few readers today.

### Purpose

Settle, per signal column, whether a stop hint would be right at least 9 times in 10 and save an iteration on at least a fifth of the replayed lineages, using only phase 027's recorded replay, so the hint's live form can be proposed on a counted number or dropped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reading one 027 run: its sampled lineages, derived gold, label-gate state, each method's stop, the recorded stop and, where present, the Jev and Deem rater columns with their measured flags and flip rates.
- Signal columns: `legacy` and `sources` by default, the zero-call stop methods of 027, and `jev` and `deem` behind `--jev` and `--deem`, each 027's recorded rater stop. A column's hint iteration is its stop when that stop comes before the lineage's recorded last iteration.
- A zero-call count per column before any verdict: hints shown, right, wrong and iterations saved (REQ-003).
- The Keep Rule, fixed here, one verdict per column (REQ-004).
- The proposed hint line for the gate's `present` block, written into the report as text only, never into the YAML (REQ-007).
- The `system-deep-loop` skill docs parent D6 requires, through sk-doc (REQ-008).

### Out of Scope

- Editing `deep-research-confirm.yaml` or any other workflow file. The live line waits on a `keep`, the workflow owner's approval of the edit and a later phase, and opening that phase is the operator's call.
- Any `jev` or `cli-deem` call. 027 made the calls and ran their gates. This phase reads what it recorded.
- New gold or labels. The gold is 027's, confirmed by the operator's five-lineage read there.
- Any change to STOP legality or the stop votes (What Not To Build row 13).

### Files to Change

Owner of every code path below: `system-deep-loop`. The code follows sk-code's OpenCode route and the docs go through sk-doc's modes (parent D6). Code comments carry no spec path, phase number or requirement id.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs` | Create | Report reader (c1), hint rule and per-column counts (c2), column selector and skip lines (c3), the Keep Rule, verdict lines and requalify (c4), the stored report, hint line and no-call guard (c5). Built at 574 lines, with fixes c6f and c6g |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-hint.vitest.ts` | Create | Fixture 027 reports, a stub-binary no-call check and the requalify round trip. Built with 28 cases in 424 lines |
| `.skilled/skills/system-deep-loop/runtime/scripts/README.md` | Modify | One row for the new script |
| `.skilled/skills/system-deep-loop/SKILL.md` | Modify | Parent D6: one sentence naming the offline hint evaluation and saying the gate is unchanged |
| `.skilled/skills/system-deep-loop/runtime/README.md` | Modify | Parent D6: one line naming the script, its input and its switches |
| `.skilled/skills/system-deep-loop/runtime/changelog/v<next>.md` | Create | Parent D6, through `sk-create-changelog`. Built as `v1.7.0.0.md`, next after 027's `v1.6.0.0.md` |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-hint-replay.md` and `feature-catalog.md` | Create, Modify | Parent D6, through `sk-create-feature-catalog`: the F057 `stop-hint-replay.md` entry and its index row |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/stop-hint-replay.md` and `manual-testing-playbook.md` | Create, Modify | Parent D6, through `sk-create-manual-testing-playbook`: the DLR-057 `stop-hint-replay.md` scenario and its index row |
| Generated copies (the Hermes `SKILL.md`, leaf manifests, trigger index) | Regenerate | The Hermes `SKILL.md` copy and the two route manifests of the hub `SKILL.md`, regenerated after their own checks reported drift, plus the three compiled deep command contracts recompiled from the staged tree. The trigger index follows in its own commit |
| `<027 report dir>/report.json`, `calls.jsonl` | Read only | The replay this phase evaluates |
| `<operator-named report dir>/` | Create at run time | `report.json` from a run past the label gate; the 2026-09-29 final run stopped at the gate, so it wrote nothing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The script makes no model call in any mode | In every run, with or without `--jev` and `--deem`, stub `jev` and `cli-deem` binaries first on `PATH` log nothing. The script holds no spawn of either binary, and `grep -nE "spawn.*(jev\|cli-deem)"` on it returns no match |
| REQ-002 | It reads only a 027 report whose gold passed the label gate | `--rater-report <dir>` names 027's output. A missing or unparseable `report.json` exits 2 with a named error. A report whose label gate stopped prints `stop: rater report has no confirmed gold`, exits 0 and prints no verdict |
| REQ-003 | The counts are fixed rules | For each sampled lineage with gold g and recorded last iteration r, a column's hint iteration t is its 027 stop when that stop is below r, else no hint. A hint is right when g <= t < r, which saves r - t iterations and loses no cited source, and wrong when t < g. Per column the script prints lineages measured, hints, right (W), wrong (L), no hint and the sum of iterations saved |
| REQ-004 | The Keep Rule is fixed here, before any evaluation, per column | See the Keep Rule below. The verdict line prints on stdout and in that column of `report.json` |
| REQ-005 | Model columns are dormant unless selected and recorded | Without `--jev` or `--deem` only `legacy` and `sources` print, and the output is byte-identical to a run with a report that holds no rater column. `--jev` with a report lacking a Jev column prints `jev column skipped: rater report has none`, and `--deem` likewise prints `deem column skipped: rater report has none`. A column 027 recorded as skipped or stopped prints that line too. Each skip leaves the other columns byte-identical and exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | A verdict names what it was measured on | Each line carries the SHA-256 of the 027 `report.json` it read, and a model column adds 027's commit pair for Deem or the `jev` version, provider and model for Jev. A later run on a report with a different pair or model prints `requalify: rater changed` before its verdict |
| REQ-007 | The proposed hint line is recorded, never written to the gate | For a column that prints `keep`, the report holds one proposed line for the `present` block, `**Stop hint**: <column> replay says this loop found its last new cited source by iteration <t>` (proposed wording). No workflow file changes |
| REQ-008 | Tests cover every public surface, and the docs stay true (parent D6) | `score-stop-hint.vitest.ts` exits 0 with a happy path and one edge case each: the report reader accepts a passed report and stops on an ungated one, the hint rule counts a right hint and a wrong hint, `--jev` and `--deem` print their skip lines on a report without those columns and the other output stays byte-identical, the verdict prints `keep`, `kill` and `stop (precision)` on fixtures, and stub binaries log no call. `SKILL.md`, both READMEs, the changelog, the catalog entry and the playbook entry each name the script, its input and its switches, and `validate_document.py` exits 0 on each |

### Keep Rule (fixed 2026-09-29, before any evaluation)

**Inputs.** K is 027's sampled lineages that passed its label gate. A column's M measured lineages are those 027 measured in that column (all K for `legacy` and `sources`). W and L come from REQ-003 over the M lineages. The baseline is today's screen with no hint, which is never wrong and saves nothing. For a Jev column, 027's flip rate is carried in, and Deem has none (C4).

**Thresholds, in this order.** The first that applies sets the verdict.
1. Coverage: `10*M >= 9*K`, else `verdict <column>: stop (coverage)`.
2. Kill: the exact one-sided binomial P(X >= L) for X ~ Binomial(W + L, 0.5) is below 0.05. When it is, `verdict <column>: kill`.
3. Precision: `10*W >= 9*(W+L)`, at least 0.9, else `stop (precision)`.
4. Savings: `5*W >= M`, a saved iteration on at least 20 percent of measured lineages, the margin over the no-hint baseline, else `stop (savings)`.
5. Sign test: P(X >= W) below 0.05, with p = 1 when W + L is 0, else `stop (sign test)`.
6. Flips, Jev only: 027's recorded flip rate at most 0.10, else `stop (flips)`.
7. Otherwise `verdict <column>: keep`.

**The line.** `verdict <column>: keep|kill|stop (<reason>) K=<k> M=<m> W=<w> L=<l> saved=<n> p=<p> report=<sha12>`, then the rater fields of REQ-006 for a model column. A fixture verdict never counts. A change to this rule after the first evaluation of a real 027 report voids every earlier verdict.

**What a keep means.** It supports proposing the hint line to the workflow owner in a later phase. It changes no gate, and a `legacy` or `sources` keep means the hint needs no model code.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: From one 027 run, the operator reads per column how often a hint would have been right, wrong or saved an iteration.
- **SC-002**: Each column ends in one verdict line, so R9 is settled on a counted number, or the phase closes on `stop: rater report has no confirmed gold`.
- **SC-003**: No run of this phase calls a model or changes the confirm-mode gate.

### Proof Plan

1. `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <fixture>` with logging stubs first on `PATH`: exit 0, lines `column legacy:` and `column sources:` with W, L and saved, a verdict line each and no stub log. Boundary: a fixture whose label gate stopped prints `stop: rater report has no confirmed gold`.
2. The same run with `--jev --deem` on a fixture without rater columns: `jev column skipped: rater report has none` and `deem column skipped: rater report has none`, and the rest byte-identical to step 1.
3. A fixture with 20 lineages, 18 right hints and 1 wrong prints `verdict legacy: keep`. Boundary: 17 right and 3 wrong prints `stop (precision)`.
4. From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-stop-hint.vitest.ts` exits 0 with at least 10 passed tests and 0 failed.
5. `git status --porcelain` is the same before and after every run, and `git diff --stat .skilled/commands/deep/assets/` is empty at close.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 027's gated report | No verdict can print before 027 passes its label gate | The script stops cleanly on `stop: rater report has no confirmed gold`, and the phase can close there |
| Risk | Confirm mode is rare: 1 of 424 tracked configs | Low value even on a keep | The problem statement says so. A keep proposes the line, and the operator weighs it against how often confirm mode runs |
| Risk | Replayed auto-mode lineages stand in for confirm-mode ones | Med | The gate's screen does not change the loop's findings, so a replayed stop point is the same question. The report says the lineages ran in auto mode |
| Risk | A hint at t equal to r is counted as no hint | Low | It could not have saved an iteration, so it is neutral by design |
| Dependency | Shared doc files with phases 027, 029 and 030 | Parallel builds would collide | The doc steps run one after another |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the workflow owner accept one line in the `present` block of `deep-research-confirm.yaml:1328-1345`? It is asked only after a keep, in a later phase.
- Should the hint also reach auto mode, as a dashboard line? Out of scope here. Auto mode has no operator question to attach it to.
- Is confirm mode used outside the recorded configs? UNKNOWN. The count covers tracked `deep-research-config.json` files only.
<!-- /ANCHOR:questions -->

---
