# Iteration 7: Checklist evidence - eighty-four rows, and the one that needs a variable

## Dimension

Traceability, core protocol `checklist_evidence`. Every acceptance row in the nine child phases is read for status and for the artifact it cites, and the numbers behind the packet's two baselines are reproduced from their files rather than from the record.

## Files Reviewed

- `specs/system-speckit/054-weak-model-spec-authoring/0*/acceptance-criteria.md` (all nine files, 84 rows)
- `specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/acceptance-criteria.md:61`
- `specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/scratch/card-bench/baseline.json`
- `specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/baseline-swe-l3/{hints-l3.txt,anchors-l3.txt,baseline.json}`
- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/baseline-deepseek/baseline.json`
- `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/closeout/criteria.txt`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **One acceptance row's command needs a variable the row never defines** - `specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/acceptance-criteria.md:61` - AC-008 verifies with `jq '.runs | length' $PHASE/scratch/card-bench/baseline.json`, and `$PHASE` is defined nowhere in the file; the row's three `jq` invocations all depend on it ([SOURCE: specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/acceptance-criteria.md:61]). A reader who re-runs the row from a clean shell gets `jq: error: Could not open $PHASE/...` rather than the numbers the row records. It is the only row in the packet with this shape - a scan of all 84 rows finds `$PHASE` in exactly one of them, and the other eight phases either use repo-relative paths or state the packet variable in their task blocks.
   Finding class: evidence-command-not-self-contained
   Scope proof: the row and its file were read directly; the `$PHASE` scan covered all nine acceptance files, and the row's own Observed column reproduces only with the path substituted.
   Affected surface hints: phase 005 AC-008, phase 005 card benchmark evidence
   Case: paste the AC-008 command into a fresh shell; it fails before printing any count, while the artifact behind it is correct.

## Verified In This Pass

These are recorded because the protocol asks for evidence, not assurance, and each was reproduced from the artifact rather than accepted from prose:

- **Status sweep.** 84 rows across nine phases, all `Met`: 6, 7, 9, 9, 9, 8, 12, 9, 15 in phase order.
- **Cited paths.** Every `scratch/...` path named in all nine acceptance files exists on disk; the scan found no dangling evidence pointer.
- **Phase 001 baseline.** `hints-l3.txt` holds 121 patterns, `anchors-l3.txt` reads `spec 7 / plan 14 / tasks 21 / acceptance-criteria 3`, and `baseline.json` holds three runs whose first row is `leftover_hints` 1 and `seconds` 326 - all three figures match the record in `goal.md` section 4.
- **DeepSeek baseline.** `scratch/amend3/baseline-deepseek/baseline.json` holds `leftover_hints` 1, 0, 0, `missing_anchors` 0, 0, 0 and `seconds` 242, 217, 298, which is row for row the baseline table in the benchmark report.
- **Phase 005 smoke runs.** `scratch/card-bench/baseline.json` holds three runs of six keys each, every one `strict_passed` 1 with `leftover_tokens` 0, exactly as AC-008's observed column states.
- **Closure lines.** `scratch/closeout/criteria.txt` holds one PASS line each for C1 to C4, C6 and C7, one PASS line for C5 and three `C5-history` lines for the failed sets, so the seven parent criteria each carry a PASS and the failures stay on record.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | pass | hard | phase 001 and DeepSeek baseline files against `goal.md` and the report | Two independent baselines reproduce exactly. |
| `checklist_evidence` | partial | hard | 84 rows, nine files | Every row reads Met and every cited path exists; one row's command is not self-contained. |
| `skill_agent` | notApplicable | advisory | - | No skill definition reviewed this iteration. |
| `agent_cross_runtime` | notApplicable | advisory | - | No agent definition reviewed this iteration. |
| `feature_catalog_code` | notApplicable | advisory | - | No catalog leaf makes a claim about the acceptance rows. |
| `playbook_capability` | notApplicable | advisory | - | No scenario claim was re-read this iteration. |

## Verdict

One P2 finding. The acceptance surface of the packet holds under a full sweep and under numeric replay of both baselines; the single defect is a command a reader cannot re-run without reconstructing a variable.

## Next Dimension

Maintainability. The changelog entry and the release-facing claims a reader will trust without opening the packet.

Review verdict: PASS
