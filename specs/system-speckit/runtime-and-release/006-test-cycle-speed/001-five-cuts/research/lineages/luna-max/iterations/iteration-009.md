# Iteration 9: CI lane boundaries and retained timing outputs

## Focus
Check whether the CI workflow already retains test timing artifacts and whether its independent test lanes are serial within one job. This follows iteration 8's artifact-availability check and tests a possible scheduling avenue without changing workflow files or claiming a saving.

## Actions Taken
1. Read the spec-kit workflow's job definition, setup/build steps, and test steps.
2. Checked the relevant workflows for artifact-upload steps and job dependencies.
3. Compared the CI step order with the packet's description of the local npm test lanes.

## Findings
1. The spec-kit workflow places the CLI Vitest project, legacy and shell validation suites, and runtime Vitest project in one check job as sequential steps. The upgrade-legacy file and remaining CLI files already run as two concurrent Vitest processes inside their step. A separate core/CLI or validation job could overlap some of the current sequence, but it would repeat setup/build work and may increase total runner minutes; measure complete job wall time and preserve all existing test commands and counts before considering that split. [SOURCE: .github/workflows/spec-kit-check.yml:93-124] [SOURCE: .github/workflows/spec-kit-check.yml:143-176] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:77]
2. The inspected spec-kit and deep-loop workflows do not show an artifact upload step for timing profiles, so CI is not an evident retrieval path for the historical 173-file JSON profile. This is limited to the workflows inspected; another archive or external artifact store is not ruled out. [SOURCE: .github/workflows/spec-kit-check.yml:93-176] [SOURCE: .github/workflows/deep-loop-runtime.yml:41-75] [INFERENCE: scoped search of both workflow files found no upload-artifact step]

## Questions Answered
- None in this iteration. The five tracked research questions remain answered.

## Questions Remaining
- No original key questions remain. Whether CI job splitting reduces end-to-end wall time and whether the historical profile was saved elsewhere remain unmeasured or unconfirmed.

## Next Focus
At the configured maximum iteration, check the runner scripts and suite membership only enough to state a safe split boundary, then synthesize the candidate and the measurement limits. Do not change workflows or run tests.

## Ruled Out
- Claiming a wall-time reduction from step order alone without accounting for repeated setup/build and measuring the complete workflow.
- Treating the two inspected workflows as proof that no profile exists in any external artifact store.

## Dead Ends
- The inspected workflows provide no CI artifact-upload path for the historical profile and no per-step duration report in the source checked here.

## Edge Cases
- Ambiguous input: none; the focus is CI job topology and artifact retention.
- Contradictory evidence: none.
- Missing dependencies: no timing artifact is uploaded by the inspected workflows; external retention remains unknown.
- Partial success: identified a candidate scheduling boundary and a missing in-workflow artifact path, but no CI wall-time or setup-overhead measurement is available.

## Sources Consulted
- .github/workflows/spec-kit-check.yml:93-176
- .github/workflows/deep-loop-runtime.yml:41-75
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:77
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/steer.md (checked; absent)

## Assessment
- New information ratio: 0.75 (the within-job lane sequence and missing upload path are new to this lineage; the job-splitting benefit is a partially new, unmeasured candidate).
- Questions addressed: none.
- Questions answered: none; all five tracked key questions were answered in earlier iterations.

## Reflection
- What worked and why: the job and step view surfaced an independent scheduling candidate beyond raising Vitest worker counts, while the artifact search checked whether prior timing data could be recovered.
- What did not work and why: workflow YAML identifies order and artifact steps but gives no full job duration or repeated setup cost.
- What I would do differently: compare repeated end-to-end runs with the current workflow and a minimal split while verifying unchanged commands, files, assertions, and validation coverage.

## Recommended Next Focus
Use iteration 10 to verify the existing test script's lane order and summarize which CI split preserves every current command; then finish at the configured cap and report the unresolved measurement requirements.
