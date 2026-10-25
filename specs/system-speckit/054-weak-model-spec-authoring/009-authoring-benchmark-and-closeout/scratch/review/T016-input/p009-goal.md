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
    last_updated_at: "2026-10-25T09:10:15Z"
    last_updated_by: "worker"
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
| D1 | The run brief is `../001-template-drift-census-and-baseline/scratch/baseline-swe-l3/brief-1.txt` byte for byte, the phase 1 T009 task at Level 3. No word changes on the final side. |
| D2 | M2 counts bare v2.2 hint occurrences plus v2.3 value token occurrences. The two patterns are disjoint and each unfilled instruction counts once. |
| D3 | Three final runs, serial, on cli-devin `swe-2-max`, compared with the 3 `swe-2-max` baseline runs. No run is dropped when it is bad. |
| D4 | The report folder is `.skilled/skills/system-spec-kit/benchmark/reports/$DATE--model-eval--authoring-baseline/`, dated by execution. |
| D5 | This phase is the only one allowed to edit the parent `spec.md`, the parent `goal.md` and the 041 phase map row for `006-fix-write-recipe-move-destination`. |
| D6 | A parent goal box is ticked only after its `C<n>` line reads PASS in `scratch/closeout/criteria.txt`. |
| D7 | Nothing is committed and nothing is pushed. Both stay with the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `jq '.runs | length' scratch/baseline/baseline.json` prints `3` and each run holds the five metrics `strict_passed`, `leftover_hints`, `missing_anchors`, `out_of_scope_writes` and `seconds`
- [ ] `jq '.metrics | length' scratch/baseline/delta.json` prints `5`, every metric carries a minimum and a maximum for both sides, every final run passes strict validation, and the final maximum of `leftover_hints`, `missing_anchors` and `out_of_scope_writes` is at most the baseline maximum
- [ ] The benchmark report folder holds `README.md` with ten numbered sections, `results.csv` with six runs, `source.md` that names this packet, and one new row in the reports index
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring --recursive --strict` prints `RESULT: PASSED`
- [ ] `grep -c '^C[1-7] PASS ' scratch/closeout/criteria.txt` prints `7` and the parent goal completion anchor holds seven `[x]` rows
- [ ] `git branch -r --contains HEAD | wc -l` prints `0` whenever `git log --oneline <start>..HEAD` prints any line, so swarm commits stay local and nothing was pushed
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
| Phase opened | Done | X0 precheck passed on 2026-10-25: scratch/baseline/x0.txt holds eight RESULT: PASSED lines for phases 001 to 008, RESULT: PASSED for 041-006, BASELINE_OK, CENSUS_OK, DRIFT_GUARD_OK, CARD_GUARD_OK, NESTED_OK and a recursive strict RESULT: PASSED for the packet. devin auth status printed Logged in and the nine tools resolved. |
| Phase start commit | Done | a15bc0636efaa04655ce809ebbf4aabfdfc338f6 |
| Final vocabulary built | Done | T004: hints-v2.3.txt holds 127 distinct value tokens and anchors-v2.3.txt reads spec 7, plan 14, tasks 21, acceptance-criteria 3, equal to the baseline anchors-l3.txt. specs/zz-bench-hints was created at Level 3 and removed (TRACK_GONE). |
| Three final runs recorded | Done | T005 and T006: runs 1 to 3 on cli-devin swe-2-max, exit status 0 each, seconds 437, 429 and 1822. strict_passed 1, 1, 1. leftover_hints 0, 0, 0. missing_anchors 0, 0, 6. out_of_scope_writes 0, 0, 0 (status diff, untracked-all diff and the .skilled diff hash all unchanged). TASK_FROZEN printed. Audits found exactly one Devin session each (holistic-visor, mammoth-moonflower, medieval-grain) with 0 tool calls naming baseline-swe, the phase scratch folder or /private/tmp in either column. Packets kept outside the worktree under the conductor scratchpad swe-2-max-final-l3/packet-N. |
| Delta written | Done | T007: delta.json holds 5 metrics and delta.md holds 5 metric rows, but the no-regression check printed false because missing_anchors has a final maximum of 6 against a baseline maximum of 0. |
| Benchmark report published | Done | T008: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/ holds README.md (10 sections), results.csv (6 rows) and source.md, with one index row. Verdict FAIL. Numbers are generated from delta.json and the run files. validate_document.py printed Total issues: 0 on README.md. |
| Changelogs written | Pending | T009 done: .skilled/changelog/system-spec-kit/v2.9.0.0.md written and SKILL.md bumped from 2.8.5.0 to 2.9.0.0. Nested changelogs still to write. |
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
| Takeover on 2026-10-24 | The parent moved every remaining run to cli-codex gpt-6-luna max fast and cli-devin swe-2-max, and every review to swe-2-max (parent D4, D7, D8). A task that names the Task tool runs as that CLI dispatch with the same brief and reply file. |
| Level 3 retarget | The parent moved the benchmark to a Level 3 task on cli-devin swe-2-max with a no-regression criterion 5. T002 and T004 to T008 and the C5 proof now read the baseline, the brief, `hints-l3.txt` and `anchors-l3.txt` from phase 1 `scratch/baseline-swe-l3/`. Where `spec.md` or `plan.md` still name the Level 2 task, `hints-v2.2.txt`, `anchors-v2.3.txt` as the M3 list, the count of 97 or DeepSeek, `tasks.md` wins |
| D7 and the parent commit rule | D7 says nothing is committed. The parent's last criterion and the operator's takeover decisions allow local commits on the build worktree, so this phase ends with one local commit and never pushes. The parent wins by precedence |
| T014 precondition rows | The OpenCode run already set parent preconditions 2 and 4 to Done, and the takeover added two rows beside them. T014 checks those rows as they stand instead of rewriting them from Pending. |
| Conductor decisions on 2026-10-25 | The conductor dispatched one worker for this phase and set these rules, each recorded in its own row below: the X0 precheck, the executors, Level 3, the suite reuse, the run protocol, the start commit for criteria 6 and 7, report generation, the version bump, the extra criterion 2 case, the criterion 3 population, acceptance row timing, the T014 adaptation, the changelog backfill, the index check and the parent goal edits. |
| X0 precheck | HEAD was a15bc0636e, directly on top of efe24ebb03. The status listed nothing outside the phase 001 scratch folder. Phases 001 to 008 and 041-006 each printed RESULT: PASSED under validate.sh --strict, the baseline, census, drift guard, card guard and nested generator checks all printed their OK lines, the recursive strict run on the packet printed RESULT: PASSED, and the phase 008 report folder 2026-10-25--manual-testing-playbook--weak-model-authoring names this packet in source.md. The raw output is scratch/baseline/x0.txt. |
| Executors superseded on 2026-10-25 | One Claude Code worker ran this phase and spawned no subagent. The benchmark subject is cli-devin swe-2-max on --permission-mode dangerous, and the T016 review is cli-devin swe-2-max on --permission-mode auto. The OpenCode, DeepSeek, Task tool and cli-codex wording in the phase documents is history, superseded by parent D3, D4, D7 and D8. Only the statements the close-out must make true were rewritten: the commit statements in spec.md, AC-014 and the tasks.md sign-off, and the executor and commit lines in the parent spec.md. |
| Level 3 for the final runs | The final runs use a Level 3 scaffold to match the SWE 2 Max baseline. REQ-001, AC-001 and the plan.md summary were amended from Level 2 to Level 3. |
| Suite reuse for T003 | No file under the runtime or templates folders of system-spec-kit changed between the second amendment commit 95abd302c8 and HEAD (git diff --name-only printed nothing for those two paths), and phase 008 added only a report and documents. T003 therefore reuses the second amendment's end-of-phase suite, saved as scratch/baseline/suite-start.txt, whose last line is exit=0. It was copied from specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance/scratch/amend2/suite-end.txt. |
| Run protocol on 2026-10-25 | The runs mirror the script that produced the SWE 2 Max baseline. Each dispatch uses the baseline brief-1.txt copied byte for byte (cmp), runs under a 2700 second watchdog on cli-devin swe-2-max with --permission-mode dangerous, and records its exit status. M5 is the dispatch end second minus the dispatch start second, as in the baseline, not the measurement time. M2 is the bare hint count (hints-l3.txt) plus the value token count. M4 is the status diff, and a change in the hash of git diff -- .skilled before and after a run also counts as an out-of-scope write. Each run's packet is copied to the scratchpad outside the worktree before it is removed. The session audit selects Devin sessions in the worktree between the start second and the end second plus 60, requires exactly one, and searches both tool_call_json and tool_call_update_json. A rate-limit or billing reply is not a run and is redone for the same run number. Extra per-run fields (exit status, bare and token split, audit) are in scratch/baseline/runs-meta.jsonl so baseline.json keeps the six keys per run. |
| C5 FAILED on 2026-10-25 | C5 FAILED: a final run is worse than the baseline's worst on missing_anchors. Run 3 left 15 anchors in tasks.md where the baseline expects 21. Against run 1 the missing anchors are arch-verify, perf-verify, deploy-ready, compliance-verify, docs-verify and sign-off, the Level 3 verification sections. Run 3 still passed strict validation and took 1822 seconds, against 437 and 429 for the other two final runs and 317 to 384 for the baseline. The result is recorded as it is. No parent box is ticked, no global changelog is published and the version carrier is not bumped. |
| STOP at T007 on 2026-10-25 | STOP: halt H9 fired, so only T008 ran after T007. The report verdict is FAIL. Tasks T009 to T018 did not run and the packet is not closeable. The operator or conductor decides whether to accept the missing_anchors result, rerun the final side or change the template. |
| Mismatch between the T008 template and the data | The T008 script fixes its timing sentence at 20 minutes against 17 minutes and its recommendation as Apply now. Both were wrong for these data (the baseline runs took 317 to 384 seconds and the verdict is FAIL), so the report was generated from delta.json and the run files instead, with the recommendation chosen by the verdict. The report file is README.md, not benchmark-report.md, as recorded above. |
| Operator decision on C5 on 2026-10-25 | Operator quote: "Option 3 + diagnostic". C5 FAIL on the frozen metric. Run 3 deleted the six optional Level 3 verification sections in tasks.md (arch-verify, perf-verify, deploy-ready, compliance-verify, docs-verify, sign-off). Diagnostic, chosen after the result and not a verdict: against the contract-required anchors (template-structure.js contract 3 tasks.md reports 15 required and these 6 optional), all six runs score 0 missing. Checked by running that tool on the three baseline packets and the three final packets (scratch/closeout/diagnostic.txt). Three deletions contradicted their fill notes, because the packet records ADR-001 (plan.md line 239), states NFR-P01 (spec.md line 133) and holds paired documents. The reply in scratch/runs/T005-3.txt says 'L3+ optional sections dropped (this is Level 3, not 3+)', so the run read the L3+ heading prefix as Level 3+ only. leftover_hints improved from a baseline maximum of 1 to 0. Run 3 took 1822 seconds against 437 and 429 and the cause is unknown. Follow-up: make the L3+ heading label unambiguous for Level 3 authors, then rerun the benchmark in a new phase. This resumes the phase at T009. It supersedes the STOP row above. |
| Operator overrides for the resumed phase | C5 keeps its FAIL line and its parent box stays unticked. The parent boxes whose own C line prints PASS may be ticked. Neither the parent spec.md nor this phase is set to Complete. This phase gets the honest status the validator accepts, and the acceptance rows and the implementation summary say which row is Unmet and why. The global changelog and the version bump still happen and state the benchmark result as it is. The commit subject does not claim success. |
| Criterion 3 census population and method | The census reran the frozen phase 003 folder list (4688 folders, ADR-005), which excludes this packet. The first workers stalled for minutes on folders whose source-tag check ran git ls-files with the file system monitor on, so the remaining 962 folders were rerun with core.fsmonitor=false and stdin closed. Every folder was validated once by the same strict-census.mjs and the merged result (scratch/closeout/b-final.tsv) has 4688 unique rows. Columns 1, 2 and 5 equal b-before.tsv (0 differing rows), with 4496 PASS and 192 FAIL on both sides. |
| Start commit for criteria 6 and 7 | C6 and C7 read the parent start commit ac2be31ec6, not the phase 009 start, so scenarios and commits from earlier phases count. The parent Start commit row is unchanged and a separate Phase 009 start commit row was added. |
| Extra criterion 2 case | Besides the plan's probe, the criterion 2 proof validates a v2.2-stamped doc set with every token replaced by plain text at status Complete. The placeholder rule found 0 placeholders and printed RESULT: PASSED. The probe packet under specs/zz-bench-closeout was deleted. |
| Track root children compare | children_ids in specs/system-speckit/graph-metadata.json carry the system-speckit/ prefix, so the compare strips it. Both refresh-track-roots runs printed system-speckit: up to date and the 20 children match the 20 numbered folders on disk. |
| Changelog work | The generator copies raw task text, so the nested changelogs for phases 001 to 003, the packet root and this phase were rewritten by hand from each phase's implementation summary. Phases 004 to 008 already had theirs. The global changelog v2.9.0.0 states the benchmark result with the C5 FAIL and the cause, and SKILL.md moved from 2.8.5.0 to 2.9.0.0 (2.9.0.0 is above the current version, so the planned number holds). |
| Status values the validator accepts | validate.sh treats a Complete status with an unmet acceptance row as a failed closure, and the status words complete, done, closed and finished all classify as complete. This phase and the parent therefore read In Progress, and acceptance rows AC-010, AC-011 and AC-015 are Unmet because they need nine Complete map rows, seven PASS lines and a Complete status. |
<!-- /ANCHOR:log -->
