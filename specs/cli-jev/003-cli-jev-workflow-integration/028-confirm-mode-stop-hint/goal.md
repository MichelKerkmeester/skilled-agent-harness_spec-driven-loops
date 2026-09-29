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
    last_updated_at: "2026-09-29T13:30:00Z"
    last_updated_by: "spec-leaf"
    recent_action: "Authored the Planned phase documents for research R9"
    next_safe_action: "Build on a fixture report, then wait for 027's gated report (released 2026-09-29)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/027-stop-second-rater/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-028-confirm-mode-stop-hint"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
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

- [ ] `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <dir>` on a report whose label gate passed exits 0 and prints `column legacy:` and `column sources:` lines with right, wrong and saved counts and a verdict line for each, while stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [ ] On a report whose label gate stopped the script prints `stop: rater report has no confirmed gold`, no verdict and exits 0. With `--jev --deem` on a report without rater columns it prints `jev column skipped: rater report has none` and `deem column skipped: rater report has none`, and its other output is byte-identical to the run without switches
- [ ] From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-stop-hint.vitest.ts` exits 0 with at least 10 passed tests and 0 failed
- [ ] The phase closed on `stop: rater report has no confirmed gold`, or one run on 027's real report printed a `verdict legacy:` and a `verdict sources:` line and a `verdict jev:` or `verdict deem:` line for each rater column 027 recorded, each `keep`, `kill` or `stop (<reason>)`
- [ ] `git status --porcelain` is the same before and after each run, `.skilled/commands/deep/assets/deep-research-confirm.yaml` is unchanged and the build commit touches only `system-deep-loop` files, generated copies and this phase folder
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and the Planned `implementation-summary.md`, authored 2026-09-29 by a spec leaf from `../007-classifier-deep-research/research/research.md` section 12 and `../001-deep-research/research/research.md` section 11 `### R9.` |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Pending | Not started. Its real run waits on phase 027's gated report |

### Deviations and findings

| Item | Note |
|------|------|
| Seam drift (2026-09-29) | The record's `deep-research-confirm.yaml:1316-1345` moved to `:1325-1354`: `gate_post_iteration` starts at `:1325`, its `present` block is `:1328-1345` with options A to D at `:1342-1345`, and option C records `manualStop` at `:1349-1353` |
| Confirm mode is rare | 424 tracked `deep-research-config.json` files name an `executionMode`, and 1 names `confirm`. One tracked `deep-research-state.jsonl` holds a `manualStop` event. Counted by this leaf with `git ls-files` and `grep` |
| Two backends | R9 has no judgment at use time, so this phase has no model arm and no gate of its own. Its model columns are 027's recorded Jev and Deem answers, and 027 applies the identity line, `jev --version`, `jev auth status --provider P` and `cli-deem health` |
<!-- /ANCHOR:log -->
