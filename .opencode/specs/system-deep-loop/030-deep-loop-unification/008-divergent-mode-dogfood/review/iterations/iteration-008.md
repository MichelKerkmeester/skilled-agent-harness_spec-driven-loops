# Deep Review Iteration 008

## Dimension

Security, second pass over previously unreviewed deep-ai-council, deep-improvement, deep-research, and manual-testing-playbook surfaces.

## Files Reviewed

- `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:35-63,103-112,146-168,183-195`
- `.opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml:149-190,213-214`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:25-94,125-168`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:130-249,350-413,419-580,690-719`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:467-537,914-1013`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:51-91,351-384`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/persist-artifacts.vitest.ts:173-249`
- `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command-flow-stress-tests/setup-cp-sandbox.sh:1-107`
- `.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/writer-library-contract/out-of-scope-write-rejection.md:13-69`

## Findings by Severity

### P0

None.

### P1

#### R8-P1-001: Model-benchmark workflow interpolates an unvalidated run label into shell commands

- Severity: P1
- File: `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:146`
- Evidence: The auto and confirm workflows execute `mkdir -p .../benchmarks/{run_label}` with the placeholder unquoted, and later interpolate the same value into shell paths and a promotion command. Their declared validation covers `spec_folder`, profile resolution, scorer, grader, and target model, but does not constrain `run_label`. The benchmark runner's `sanitizeLabel()` at `run-benchmark.cjs:91-94` applies only to a report-history filename after the workflow shell commands have already executed. A profile- or command-derived label containing shell metacharacters can therefore alter the workflow command rather than remain a benchmark directory name.
- Finding class: cross-consumer
- Scope proof: Exact search found the same unquoted initialization command in both `deep_model-benchmark_auto.yaml:146` and `deep_model-benchmark_confirm.yaml:149`, plus unquoted uses in completion and promotion commands; no workflow validation or pre-dispatch sanitizer for `run_label` was found. `run-benchmark.cjs:91-94` is the only matching sanitizer and does not sanitize the workflow placeholder.
- Affected surface hints: model-benchmark auto workflow, model-benchmark confirm workflow, benchmark run-label derivation, promotion command
- Recommendation: Resolve `run_label` once through a strict basename allowlist before any command rendering, reject invalid values, and pass all resulting paths as quoted arguments; add auto/confirm tests with whitespace, traversal, and shell metacharacters.

```json
{"type":"claim_adjudication","findingId":"R8-P1-001","claim":"The model-benchmark workflows can interpret a profile- or command-derived run label as shell syntax before the benchmark runner's filename sanitizer executes.","evidenceRefs":[".opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:56-63",".opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:146",".opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:168",".opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:195",".opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml:149",".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:91-94"],"counterevidenceSought":"Searched both model-benchmark workflows and the model-benchmark scripts for run-label validation, slugging, sanitization, and shell quoting; reviewed the runner's only label sanitizer and the workflow field-validation block.","alternativeExplanation":"The orchestration layer may currently derive run_label only from trusted built-in profiles, but that invariant is neither declared nor enforced in either workflow and the owning changelog says the value comes from a profile or command argument unchanged.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Downgrade if the command renderer is shown to reject shell metacharacters for run_label before YAML command execution, with an executable auto/confirm regression test."}
```

### P2

None.

## Traceability Checks

- `spec_code`: partial. The workflow's guarded, auditable benchmark claim was checked against its shell command templates and runner-side sanitization; R8-P1-001 records the mismatch.
- `checklist_evidence`: not re-entered; iteration 5 owns that completed direction.
- `resource-map`: not present, so the coverage gate remains skipped.
- Review depth: complex/strict, graphless fallback. `shell_command_injection` produced R8-P1-001; `scoped_auxiliary_write` and `trusted_test_hook_execution` were ruled out with direct source and documentation evidence.

## Ruled Out Directions

- Council memory-save payload output: `persist-artifacts.cjs:1003-1007` can write a caller-selected path outside `ai-council/**`, but `command_wiring.md:139-154` explicitly defines it as an optional caller-owned transport file; production workflow search found no uncontrolled invocation. This is not evidence of a privilege boundary bypass.
- Council replay upsert override: `replay-graph-from-artifacts.cjs:63-65` accepts an environment-selected script, but exact search found use only in its test fixture; no user-controlled production assignment was found.
- Deep-research sandbox cleanup: `setup-cp-sandbox.sh:45-68,95-98` rejects relative, parent-traversal, and non-`/tmp` values before cleanup. The initial `rm -rf` removes a terminal symlink rather than following it, so no escape was established.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. One new P1 security finding requires remediation; no P0 or P2 findings were identified.

## Next Dimension

Iteration 9 should perform a maintainability stabilization pass over the remaining unreviewed deep-research and manual-testing-playbook ownership boundaries without re-entering the shell-command-injection direction.

Review verdict: CONDITIONAL
