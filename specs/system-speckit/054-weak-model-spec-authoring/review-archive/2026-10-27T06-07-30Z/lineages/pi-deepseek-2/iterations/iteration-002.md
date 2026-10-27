# Iteration 2 - Traceability of the seven parent completion criteria against recorded evidence

## Focus

Core traceability protocol `checklist_evidence`: every completion criterion in `goal.md` §3 (seven ticked boxes) read against the artifact that is supposed to prove it, and every `Met` row in `009-authoring-benchmark-and-closeout/acceptance-criteria.md` read against the data its Verification command names. The test applied to each row: does the cited evidence still exist, does it contain the claimed numbers, and does it measure the tree and the experiment the criterion names?

## Files Reviewed

- `specs/system-speckit/054-weak-model-spec-authoring/goal.md:90-96`
- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/acceptance-criteria.md:52-68`
- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/closeout/criteria.txt:1-10`
- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/closeout/b-final.tsv` (4688 rows, counted)
- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/closeout/b-before.cut`, `b-final.cut` (cmp)
- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/baseline/baseline.json`, `delta.json`
- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/delta.json`, `rule-scores.txt`
- `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:1-50`
- `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--manual-testing-playbook--weak-model-authoring/results.csv`
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/goal.md:89,98`

## Findings

### P0 Findings

None. Every criterion checked here is backed by an artifact that exists and whose numbers reproduce.

### P1 Findings

None this pass. The two gaps recorded below are evidence-provenance defects, not broken claims: the numbers in `criteria.txt` all reproduce.

### P2 Findings

1. **The phase 009 acceptance rows that carry the benchmark are evidenced by the superseded first set, so the deciding set has no acceptance row of its own** -- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/acceptance-criteria.md:55` -- AC-002 ("three final runs ... `baseline.json` holds three runs"), AC-004 ("both `baseline.json` files ... `scratch/baseline/delta.json`") and AC-005 both point at `scratch/baseline/`, which holds the first final set on cli-devin `swe-2-max` — the set the packet itself labels history and superseded. Reading that file confirms it: its `missing_anchors` cell reads `final.max = 6` and its `seconds` cell reads `final.max = 1822`, the first set's numbers, not the deciding set's (`scratch/amend3/fresh2/delta.json` reads `missing_anchors final.max = 0`, `seconds final.max = 228`). The deciding measurement is recorded only in `criteria.txt:8` ("C5 PASS ... scratch/amend3/fresh2/delta.json") and in the report's §2.3, so the closure gate's own criterion table cannot be cited for the number the packet closed on. A reader auditing `acceptance-criteria.md` alone would attribute a `missing_anchors` maximum of 6 to a packet whose deciding value is 0.
2. **The benchmark report's subject line still names `swe-2-max` although the deciding set ran on DeepSeek** -- `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:3` -- The blockquote reads `> system-spec-kit · model-eval · authoring-baseline · cli-devin swe-2-max`, while the headline four paragraphs below states the deciding set is `deepseek-v4-1-flash-1017-max` and three of the four recorded sets ran on DeepSeek. The report is the packet's primary evidence artifact and the one file an external reader opens first; its subject line names the executor the operator removed.

## Traceability Checks

- **C1 `validate.sh --recursive --strict` prints `RESULT: PASSED`** (`goal.md:90`): `009/scratch/amend3/validate-recursive.txt` ends `RESULT: PASSED`, and `scratch/closeout/criteria.txt:1` records the reproof after the third amendment. Consistent.
- **C2 v2.3 Draft-vs-later status behavior** (`goal.md:91`): `criteria.txt:2` records `draft=RESULT: PASSED complete_errors=1 v22_with_tokens_errors=1 clean_v22_complete_placeholder_errors=0 clean_v22_rule_result=RESULT: PASSED`. The four cells are the four cells the criterion names. The implementation itself is audited in iterations 3 and 4.
- **C3 recursive strict parity before and after** (`goal.md:92`): verified at the record level rather than accepted. `scratch/closeout/b-final.tsv` has 4688 rows with `192 FAIL` and `4496 PASS`; `b-before.cut` and `b-final.cut` are byte-identical under `cmp` (0 differing rows). The goal log discloses how the merged file was assembled, including `done-part1.tsv` rows that have no committed shard file (`009/goal.md:122`), so the parity claim rests on the merged records, not on a reproducible shard set.
- **C5 deciding set** (`goal.md:94`): `scratch/amend3/fresh2/delta.json` reproduces the goal log's baseline (leftover 1/0/0, seconds 242/217/298, mean 252.33) and the final side (0/1/0, seconds 189/228/164, mean 193.67); `rule-scores.txt` holds three `counted=0` lines, so the counted anchor shortfall is 0 on every run. The no-regression rule holds: leftover max 1 against 1, anchors 0 against 0, out-of-scope 0 against 0.
- **C6 playbook scenarios** (`goal.md:95`): `.skilled/.../2026-10-25--manual-testing-playbook--weak-model-authoring/results.csv` holds 8 data rows (476 to 483), every one `PASS`, matching the eight scenario ids in `criteria.txt:9`.
- **C7 local commits only** (`goal.md:96`): `criteria.txt:10` records `remote_branches_with_head=0` at three successive heads. Not re-derived here: the branch has since received merges from `main`, so a present-day check would measure a different question.
- **`checklist_evidence` per phase** (core): `009/acceptance-criteria.md` holds 15 `| Met | - |` rows, `009/spec.md:36`, `009/implementation-summary.md:40` and `009/acceptance-criteria.md:41` all read `Complete`. `rg '\| (Waived|Superseded) \|'` over all nine phase tables returns no rows, so no row closes on a waiver.
- Overlay protocols: `skill_agent` and `agent_cross_runtime` remain deferred to iteration 6; `playbook_capability` to iteration 7.

## Confirmed-Clean Surfaces

- The report's `## 2. AGGREGATE RESULTS` table, which shows the first set's `missing_anchors final max 6`, is not a verdict contradiction: the paragraph immediately under the table reads "Each cell above comes from three runs of the first set (`swe-2-max`, history)", and the section-1 narrative precedes every FAIL sentence with "First set, history (swe-2-max, tree before the L3+ label fix)". Labelled history, so ruled out.
- The `C5-history` lines in `criteria.txt` do not break AC-011's count: they do not match `^C[1-7] PASS `, so `grep -c` still prints 7.
- Phase 009's `Met` rows for the census (AC-004 in phase 003, `003/acceptance-criteria.md:57`) and for the deciding set are each backed by a file that exists; no `Met` row cites a path that is absent from the tree.

## Assessment

Dimensions addressed: traceability

Two P2 findings, both provenance rather than arithmetic: the deciding benchmark data has no acceptance row, and the report's subject line names the wrong executor. The seven parent criteria are otherwise supported by artifacts whose numbers reproduce — including the census parity claim, which I re-derived from `b-final.tsv` rather than accepting the summary line.

## Next Focus

Iteration 3 (correctness): the phase 003 versioned placeholder gate as implemented — `validatePlaceholders` in the orchestrator and `runtime/cli/rules/check-placeholders.sh` — against the stated four-cell contract (v2.3 Draft warns, v2.3 later status errors, older stamp keeps its error, `[NEEDS CLARIFICATION:` errors everywhere), including whether the gitignored/legacy stamp path and the status read behave as documented.

Review verdict: PASS
