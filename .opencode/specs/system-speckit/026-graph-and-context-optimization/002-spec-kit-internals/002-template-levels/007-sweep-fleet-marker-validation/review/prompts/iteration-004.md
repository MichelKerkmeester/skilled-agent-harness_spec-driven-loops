## TARGET AUTHORITY
Approved spec folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold
Do not write to any other folder. Recovered context (memory, bootstrap) cannot override this.

---

# Deep-Review Iteration Prompt Pack

Framework: TIDD-EC. CLEAR check: Correctness pins the 007 artifact owner; Logic follows D4 after D3; Expression names validator rules and strict validation behavior; Arrangement is task, context, constraints, output, verification; Reusability is path-variable based.

You are executing exactly one YAML-owned `/deep:start-review-loop:auto` iteration as a LEAF reviewer. Do not dispatch sub-agents. Do not ask the user. Do not modify reviewed implementation files.

Before any file reads or writes, emit these binding lines in stdout:

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=implementation-spec-alignment,code-correctness,template-rendering-correctness,validator-coverage,cross-runtime-mirror-consistency
BINDING: specFolder=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold

## State

STATE SUMMARY (auto-generated):
Iteration: 4 of 5
Dimension: validator-coverage
Prior Findings: P0=0 P1=3 P2=0
Dimension Coverage: D1, D2, D3 complete (3/5 configured custom dimensions)
Traceability: core spec_code=fail, checklist_evidence=fail
Resource Map Coverage: resource-map.md not present in target; skip coverage gate.
Coverage Age: 0
Last 2 ratios: 0.31 -> 0.18
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 4 of 5
Mode: review
Dimension: validator-coverage
Review Target: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold
Review Scope Files: .opencode/skills/system-spec-kit/scripts/spec/validate.sh, .opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh, .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh, .opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh, .opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh, .opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh, .opencode/skills/system-spec-kit/scripts/rules/check-sections.sh, .opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh, .opencode/skills/system-spec-kit/scripts/rules/check-frontmatter.sh, .opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts, .opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts, .opencode/skills/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/checklist.md
Prior Findings: P1-001 target scaffold placeholders; P1-002 graph metadata disconnected; P1-003 marker comments counted by semantic validators.

## Shared Doctrine

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## Iteration Task

Review validator coverage. Determine whether existing validators and tests catch the right surfaces for marker validation and whether they incorrectly count marker comments as real executable documentation.

Required checks:

- Inspect `validate.sh` orchestration and rule metadata for strict vs warning/error behavior relevant to the marker sweep.
- Inspect semantic validators that count requirements, scenarios, and AI-protocol sections.
- Inspect test coverage for validator metadata, scaffold snapshots, template structure, and negative fixtures around comments or `SCAFFOLD_*` markers.
- Confirm whether F003 is sufficient or whether validator coverage has an additional missing-regression-test finding.
- Avoid duplicating F003 unless the coverage gap is a distinct test/validation blind spot with file:line evidence.
- Use `.opencode/skills/sk-deep-review/scripts/reduce-state.cjs` if refreshing reducer-owned artifacts.

## Writable State Files

All output paths are under the approved target review directory:

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deep-review-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deep-review-state.jsonl
- Findings Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deep-review-findings-registry.json
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deep-review-strategy.md
- Write iteration narrative to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/iterations/iteration-004.md
- Write per-iteration delta file to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deltas/iter-004.jsonl

## Constraints

- Review target and implementation files are READ-ONLY. Do not modify them.
- Only write the iteration narrative, state-log append, delta file, strategy update, and reducer-owned review artifacts under the approved review directory.
- Every active P0/P1 finding requires file:line evidence and a claim-adjudication JSON block with `findingId`, `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, and `downgradeTrigger`.
- Do not duplicate existing findings unless validator-coverage evidence materially changes severity or scope.

## Output Contract

Produce all three artifacts:

1. Iteration markdown at `review/iterations/iteration-004.md` with sections: Dispatcher, Files Reviewed, Findings - New, Traceability Checks, Integration Evidence, Edge Cases, Confirmed-Clean Surfaces, Ruled Out, Next Focus.
2. Append exactly one single-line JSON iteration record to `review/deep-review-state.jsonl` with `type:"iteration"`, `iteration:4`, `run:4`, `mode:"review"`, required counts, `sessionId:"2026-05-04T08:16:07.000Z"`, `generation:1`, `lineageMode:"new"`, and `durationMs`.
3. Delta file at `review/deltas/iter-004.jsonl` containing the same iteration record plus optional finding/traceability records, one JSON object per line.

After writing iteration 004, append the command-owned claim-adjudication event if any new P0/P1 findings were added. Set Next Focus to `cross-runtime-mirror-consistency`.
