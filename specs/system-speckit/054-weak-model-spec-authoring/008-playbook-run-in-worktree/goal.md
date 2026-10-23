---
title: "Goal: Phase 8: playbook-run-in-worktree"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "playbook run in worktree goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
    last_updated_at: "2026-10-23T13:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: playbook-run-in-worktree

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Run every new or changed manual-testing-playbook scenario from phase 007 inside one disposable sk-git worktree and publish a captured, scripted PASS or FAIL for each one.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The only scenario host is one disposable worktree created through `worktree-naming.sh create` from the operator's `BASE_REF`. The primary checkout never runs a scenario. |
| D2 | Every scenario runs from its own `### Commands` fenced block. The conductor never retypes a command. |
| D3 | A verdict is a match against the frozen patterns in `scratch/scenarios.tsv`. A run that satisfies the scenario's own Pass section but not the pattern is a `SCENARIO_DEFECT`, not a pass. |
| D4 | A failed scenario gets one fix brief and one rerun, at most three times. After the third failed fix the row becomes `ESCALATED` and the other scenarios continue. |
| D5 | The report package copies the real file set of an existing report folder: `README.md`, `results.csv`, `source.md` and `outcomes/`. The ten `sk-create-benchmark` section headings live inside `README.md`. |
| D6 | Durable writes land in this phase folder plus the one report folder and one reports index row. No source file under `.skilled/` is edited by hand. |
| D7 | The report folder is written before the worktree is removed, so no evidence depends on a deleted directory. |
| D8 | The conductor is the operator's interactive OpenCode v2 session on DeepSeek V4.1 Flash max. Every worker is one Task subagent, and no nested CLI dispatch is used from that session. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `wc -l < specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/scenarios.tsv` prints `8`
- [ ] `find specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs -name '*.txt' | wc -l` prints at least `8`
- [ ] `R=$(find .skilled/skills/system-spec-kit/benchmark/reports -maxdepth 2 -name results.csv -path '*manual-testing-playbook--weak-model-authoring*' | head -1); test -n "$R" && wc -l < "$R"` prints `9`, `find "$(dirname "$R")/outcomes" -name '*.json' | wc -l` prints `8`, and `rg -c '^## [0-9]+\. ' "$(dirname "$R")/README.md"` prints `10`
- [ ] `grep -c '^PRIMARY_CLEAN$' specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/primary-status.txt` prints `1`
- [ ] `grep -c '^WORKTREE_GONE$' specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/worktree/removal.txt` prints `1`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree --strict` prints `RESULT: PASSED`
- [ ] `grep -cvE '^(P0|P1|P2) |^NO FINDINGS$' specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/review/T017.txt` prints `0`
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
| Phase opened | Pending | |
| `BASE_REF` recorded | Pending | |
| Worktree created and own-code check passed | Pending | |
| Scenarios S1 to S7 recorded | Pending | |
| Scenario S8 recorded | Pending | |
| Report package written | Pending | |
| Reports index row added | Pending | |
| Primary checkout gate | Pending | |
| Worktree removed | Pending | |
| Frontier review | Pending | |
| Phase closed | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| Primary checkout gate | The gate allows this phase folder, the new report folder and one reports index row when the conductor works in the primary checkout. The report is a product of the phase and cannot live inside the phase folder without breaking the reports convention. |
| Scenario map source | Phase 007 plan section 3.1 freezes the eight ids and paths. This phase copies them into `scratch/scenarios.tsv` and stops with `NO_FILE` or `AMBIGUOUS` when a scenario file is missing or an index row is duplicated. |
| Fix patch | A fix edits a tracked file under `.skilled/`, so T016 saves the worktree diff to `scratch/fixes/fix.patch` and its status to `scratch/fixes/status.txt` before removal. The operator or the phase 009 conductor applies that patch to the build worktree. |
| Bracket scan | The scan flags JavaScript destructuring inside fenced code blocks in `tasks.md`. A fenced block is not an unfilled scaffold hint, so the literal scripts stay and this row records the result. |
<!-- /ANCHOR:log -->
