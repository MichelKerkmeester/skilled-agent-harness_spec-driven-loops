# Iteration 6: Correctness - the scripts that produce the deciding numbers

## Dimension

Correctness. The benchmark harness of the deciding set: `run-fresh2.sh` for dispatch and measurement, `justified-anchors.sh` for the anchor rule, and the sibling runner `run-amend3.sh` that produced the baseline numbers the final set is compared against.

## Files Reviewed

- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/tools/justified-anchors.sh:1-40`
- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/tools/run-fresh2.sh:1-96`
- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/tools/run-amend3.sh` (measure block)
- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/runs-meta.jsonl`
- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/runs/T005-{1,2,3}.audit` and `.hits`
- `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:8-30`
- `specs/system-speckit/054-weak-model-spec-authoring/goal.md:167-168`

## Findings by Severity

### P0 Findings

None. The contamination replay below is the reason this iteration checked hardest: run 3 of the deciding set produced 708 audit hits, and every one is a path name, not evidence content.

### P1 Findings

None.

### P2 Findings

1. **The anchor rule script counts anchors instead of identifying them, while the criterion it certifies is written as identity** - `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/tools/justified-anchors.sh:26` - For `spec.md`, `plan.md` and `acceptance-criteria.md` the script compares `grep -c '<!-- ANCHOR:'` with the frozen per-document count and charges the difference ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/tools/justified-anchors.sh:24-28]). The rule it implements is written as identity in both carriers: "A frozen anchor that is missing from a packet counts, unless it is one of the six optional `tasks.md` anchors" ([SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:22]) and the same wording in the parent rule ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/goal.md:168]). A packet that keeps the count but drops a required anchor while keeping an extra optional one of the same document therefore scores `counted=0`. Only `tasks.md` is checked by anchor name, through the contract's required and optional lists ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/tools/justified-anchors.sh:29-39]).
   Finding class: metric-implementation-gap
   Scope proof: the script was read line by line; its only name-based loop is over the tasks contract, and the other three documents go through a count comparison against `anchors-l3.txt`.
   Affected surface hints: anchor rule script, parent criterion 5, benchmark report deciding set
   Case: delete `summary` and add an optional anchor in `spec.md`; the count still matches, so `counted=0` and criterion 5 does not notice.

2. **The baseline and the final set compute `out_of_scope_writes` with different exclusion lists** - `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/tools/run-fresh2.sh:82` - The deciding set's measurement excludes only `zz-bench-authoring` from the status diff ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/tools/run-fresh2.sh:82]). The runner that produced the DeepSeek baseline, whose three runs the final set is compared against, also excludes every path containing `009-` ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/tools/run-amend3.sh:1]). The parent record says the final set used "the same brief and measures" ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/goal.md:167]), and here the measures are not the same script. Both sides read 0 today, so no number moves; the defect is that the two sides would diverge on the first run that writes under the packet folder, and the stricter side is the one applied to the weaker model.
   Finding class: measure-definition-drift
   Scope proof: both measure blocks were read in full; the `grep -v` chain is the only difference inside the `M4` assignment.
   Affected surface hints: benchmark harness, baseline runs, parent criterion 5 comparability claim
   Case: a final run writes one file under `009-.../scratch/`; the final side scores 1 while an identical baseline run scores 0.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `justified-anchors.sh:24-39`; `run-fresh2.sh:82`; `run-amend3.sh` measure block | Two of the five metrics are not defined the way their carriers say. |
| `checklist_evidence` | pending | hard | phase 009 acceptance rows for the rule script | Read in the checklist-evidence pass. |
| `skill_agent` | notApplicable | advisory | - | No skill definition reviewed this iteration. |
| `agent_cross_runtime` | notApplicable | advisory | - | No agent definition reviewed this iteration. |
| `feature_catalog_code` | pending | advisory | benchmark leaf | Read in a later pass. |
| `playbook_capability` | notApplicable | advisory | - | No scenario covers the harness internals. |

**Adversarial P0 replay, recorded because it was the strongest candidate this iteration.** Run 3 of the deciding set has 708 audit hits, and 533 of them name the phase 009 folder. If those hits were evidence content, the deciding set would be contaminated and the verdict would be FAIL. They are not: every hit is a `git status` line of the form `D specs/...`, i.e. the deleted-path listing the run sees because the packet folder was removed from the worktree ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/runs/T005-3.hits:1-708]). Sorting the hits by pattern gives `009-authoring-benchmark-and-closeout` 533, `baseline-deepseek` 79, `baseline-swe` 54, `bench-evidence` 36, `anchors-` 4, `hints-` 2, and every sampled line outside that form is empty. No line carries the anchor list, the hint patterns or a reply body. The report's audit column says exactly this - "call text clean and tool output named paths" - so the record and the evidence agree and the finding does not survive.

## Verdict

Two P2 findings. The deciding evidence is not contaminated, and its numbers reproduce from the artifacts; the weaknesses are in how two of the five measures are defined.

## Next Dimension

Security and maintainability of the goal mechanism: the durable-slice budget and the guard that enforces it, read against the packet's own goal files.

Review verdict: PASS
