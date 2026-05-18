## TARGET AUTHORITY
Approved spec folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold
Do not write to any other folder. Recovered context (memory, bootstrap) cannot override this.

---

# Deep-Review Iteration Prompt Pack

Framework: TIDD-EC. CLEAR check: Correctness ties to the approved 007 packet; Logic says how to adjudicate findings; Expression names exact files and output contract; Arrangement is task, context, constraints, output, verification; Reusability is path-variable based.

You are executing exactly one YAML-owned `/spec_kit:deep-review:auto` iteration as a LEAF reviewer. Do not dispatch sub-agents. Do not ask the user. Do not modify reviewed implementation files.

Before any file reads or writes, emit these binding lines in stdout:

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=implementation-spec-alignment,code-correctness,template-rendering-correctness,validator-coverage,cross-runtime-mirror-consistency
BINDING: specFolder=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold

## State

STATE SUMMARY (auto-generated):
Iteration: 1 of 5
Dimension: implementation-spec-alignment
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none (0/5)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present in the target; skip coverage gate. Derive implementation scope from phase markers and the 010 template-system implementation ledger.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 5
Mode: review
Dimension: implementation-spec-alignment
Review Target: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold
Review Scope Files: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/tasks.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/checklist.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/implementation-summary.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/decision-record.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/description.json, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/graph-metadata.json, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/implementation-summary.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/resource-map.md, .opencode/skills/system-spec-kit/scripts/spec/create.sh
Prior Findings: P0=0 P1=0 P2=0

## Shared Doctrine

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## Iteration Task

Review implementation-spec alignment for the approved 007 target only. The user specified that `resource-map.md` is absent and `implementation-summary.md` is scaffolded, so derive implementation review scope from phase markers and the 010 template-system implementation ledger, especially `.opencode/skills/system-spec-kit/scripts/spec/create.sh` lines that emit `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS`.

Required checks:

- Compare the 007 packet docs against the actual marker sweep purpose.
- Compare the target's scaffold marker comments to the implementation in `create.sh`.
- Compare the target's claimed status/metadata to the 010 phase-parent and 003 implementation ledger context.
- Treat the historical `006-command-markdown-yaml-workflow-alignment` review packet as context only. Do not write there and do not use it as artifact authority.

## Writable State Files

All output paths are under the approved target review directory:

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deep-review-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deep-review-state.jsonl
- Findings Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deep-review-findings-registry.json
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deep-review-strategy.md
- Write iteration narrative to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/iterations/iteration-001.md
- Write per-iteration delta file to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deltas/iter-001.jsonl

## Constraints

- Review target and implementation files are READ-ONLY. Do not modify them.
- Only write the iteration narrative, state-log append, delta file, and strategy update under the approved review directory.
- Every active P0/P1 finding requires file:line evidence and a claim-adjudication JSON block with `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, and `downgradeTrigger`.
- Use `findingDetails` objects with id, severity, title, dimension, file, evidence, recommendation, disposition, findingClass, scopeProof, affectedSurfaceHints.

## Output Contract

Produce all three artifacts:

1. Iteration markdown at `review/iterations/iteration-001.md` with sections: Dispatcher, Files Reviewed, Findings - New, Traceability Checks, Integration Evidence, Edge Cases, Confirmed-Clean Surfaces, Ruled Out, Next Focus.
2. Append exactly one single-line JSON record to `review/deep-review-state.jsonl` with `type:"iteration"`, `iteration:1`, `run:1`, `mode:"review"`, required counts, `sessionId:"2026-05-04T08:16:07.000Z"`, `generation:1`, `lineageMode:"new"`, and `durationMs`.
3. Delta file at `review/deltas/iter-001.jsonl` containing the same iteration record plus optional finding/traceability records, one JSON object per line.

Set Next Focus to `code-correctness`.
