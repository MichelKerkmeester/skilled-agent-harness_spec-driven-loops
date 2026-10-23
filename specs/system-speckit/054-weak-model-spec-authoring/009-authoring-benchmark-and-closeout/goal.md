---
title: "Goal: Phase 9: authoring-benchmark-and-closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "authoring benchmark and closeout goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout"
    last_updated_at: "2026-10-23T11:27:28Z"
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
# Goal: Phase 9: authoring-benchmark-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Measure the same frozen authoring task on the final tree, report the before and after for five metrics as a range, and close the packet with every generated artifact and every status row reconciled to that one observed state.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The run task text is copied byte for byte from phase 1 T009. No word changes on the final side. |
| D2 | M2 counts bare v2.2 hint occurrences plus v2.3 value token occurrences. The two patterns are disjoint and each unfilled instruction counts once. |
| D3 | Three final runs, serial, on `llmgateway/deepseek-v4.1-flash-1017#max`. No run is dropped when it is bad. |
| D4 | The report folder is `.skilled/skills/system-spec-kit/benchmark/reports/$DATE--model-eval--authoring-baseline/`, dated by execution. |
| D5 | This phase is the only one allowed to edit the parent `spec.md`, the parent `goal.md` and the 041 phase map row for `006-fix-write-recipe-move-destination`. |
| D6 | A parent goal box is ticked only after its `C<n>` line reads PASS in `scratch/closeout/criteria.txt`. |
| D7 | Nothing is committed and nothing is pushed. Both stay with the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `jq '.runs | length' scratch/baseline/baseline.json` prints `3` and each run holds the five metrics `strict_passed`, `leftover_hints`, `missing_anchors`, `out_of_scope_writes` and `seconds`
- [ ] `jq '.metrics | length' scratch/baseline/delta.json` prints `5`, every metric carries a minimum and a maximum for both sides, and the final lowest `leftover_hints` is below the baseline lowest
- [ ] The benchmark report folder holds `README.md` with ten numbered sections, `results.csv` with six runs, `source.md` that names this packet, and one new row in the reports index
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring --recursive --strict` prints `RESULT: PASSED`
- [ ] `grep -c '^C[1-7] PASS ' scratch/closeout/criteria.txt` prints `7` and the parent goal completion anchor holds seven `[x]` rows
- [ ] `git rev-parse HEAD` equals the phase start commit and `git log --oneline <start>..HEAD` prints nothing, so the swarm made no commit and no push
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
| Phase start commit | Pending | |
| Final vocabulary built | Pending | |
| Three final runs recorded | Pending | |
| Delta written | Pending | |
| Benchmark report published | Pending | |
| Changelogs written | Pending | |
| Trigger index regenerated | Pending | |
| Track roots refreshed | Pending | |
| Parent maps reconciled | Pending | |
| Seven parent criteria proven | Pending | |
| Frontier review recorded | Pending | |
| Phase closed | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| Report folder name and the kebab checker | `check_authored_name_kebab.py` rejects the benchmark grammar `date--subject--variant`, because the checker allows a single hyphen between words. The benchmark skill requires the double hyphen, so the report uses the skill grammar and T008 checks it with its own pattern. |
| Report file name | `sk-create-benchmark` names `benchmark-report.md`. Every existing folder under `.skilled/skills/system-spec-kit/benchmark/reports/` holds `README.md`, and the index links to the folder. This phase writes `README.md` and keeps the ten-section contract. |
| Nested changelog file names | The generator prints `changelog-054-root.md` and `changelog-054-009-authoring-benchmark-and-closeout.md` on this tree. The workflow reference describes the shape more loosely, so the generator output wins and the literal names in this phase use it. |
| Three runs cannot support a significance claim | The report prints a range and says so. A reader who needs an effect size needs more runs. |
| Bracket scan false positives | The bracket-hint scan matches the status format token in `plan.md` and the folder-name regex in `tasks.md`. Both sit inside fenced code blocks and are intentional literals, not unfilled hints. |
<!-- /ANCHOR:log -->
