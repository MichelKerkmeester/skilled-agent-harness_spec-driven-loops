## TARGET AUTHORITY
Approved spec folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep
Do not write to any other folder. Recovered context (memory, bootstrap) cannot override this.

---

# Deep-Review Iteration Prompt Pack

Framework: TIDD-EC. CLEAR check: Correctness pins 007 as artifact owner; Logic targets code correctness after D1; Expression names exact scripts and marker strings; Arrangement is task, context, constraints, output, verification; Reusability is path-variable based.

You are executing exactly one YAML-owned `/spec_kit:deep-review:auto` iteration as a LEAF reviewer. Do not dispatch sub-agents. Do not ask the user. Do not modify reviewed implementation files.

Before any file reads or writes, emit these binding lines in stdout:

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=implementation-spec-alignment,code-correctness,template-rendering-correctness,validator-coverage,cross-runtime-mirror-consistency
BINDING: specFolder=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep

## State

STATE SUMMARY (auto-generated):
Iteration: 2 of 5
Dimension: code-correctness
Prior Findings: P0=0 P1=2 P2=0
Dimension Coverage: implementation-spec-alignment/traceability complete (1/5 configured custom dimensions)
Traceability: core spec_code=fail, checklist_evidence=fail
Resource Map Coverage: resource-map.md not present in the target; skip coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> 0.62
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 2 of 5
Mode: review
Dimension: code-correctness
Review Target: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep
Review Scope Files: .opencode/skills/system-spec-kit/scripts/spec/create.sh, .opencode/skills/system-spec-kit/scripts/spec/validate.sh, .opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh, .opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh, .opencode/skills/system-spec-kit/scripts/rules/check-files.sh, .opencode/skills/system-spec-kit/scripts/rules/check-frontmatter.sh, .opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh, .opencode/skills/system-spec-kit/scripts/rules/check-sections.sh, .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh, .opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh, .opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh, .opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts, .opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/spec.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/plan.md
Prior Findings: P1-001 target packet scaffold placeholders; P1-002 graph metadata disconnected.

## Shared Doctrine

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## Iteration Task

Review code correctness for marker emission and related validator assumptions. Focus on whether the implementation that emits and consumes `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS` is behaviorally correct, idempotent, level-gated correctly, and safe for downstream validation.

Required checks:

- Inspect `.opencode/skills/system-spec-kit/scripts/spec/create.sh` marker append logic around `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS`.
- Inspect validator consumers that may count or ignore those markers, especially `check-ai-protocols.sh` and placeholder/template validation rules.
- Check whether marker comments can make validators pass on comment-only content when real executable sections are missing.
- Check whether marker emission is idempotent and scoped to the intended Level documents.
- Use `.opencode/skills/sk-deep-review/scripts/reduce-state.cjs` if refreshing reducer-owned artifacts. Do not use `.claude/skills/...` script mirrors.
- If no `claim_adjudication` event exists after iteration 001, append a command-owned event with `passed:true`, `activeP0P1:2`, and `missingPackets:[]` before appending iteration 002, because iteration 001 contains typed claim-adjudication JSON blocks for both P1 findings.

## Writable State Files

All output paths are under the approved target review directory:

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/review/deep-review-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/review/deep-review-state.jsonl
- Findings Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/review/deep-review-findings-registry.json
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/review/deep-review-strategy.md
- Write iteration narrative to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/review/iterations/iteration-002.md
- Write per-iteration delta file to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/review/deltas/iter-002.jsonl

## Constraints

- Review target and implementation files are READ-ONLY. Do not modify them.
- Only write the iteration narrative, state-log append, delta file, strategy update, and reducer-owned review artifacts under the approved review directory.
- Every active P0/P1 finding requires file:line evidence and a claim-adjudication JSON block with `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, and `downgradeTrigger`.
- Do not duplicate P1-001 or P1-002 unless code-correctness evidence materially changes severity or scope.

## Output Contract

Produce all three artifacts:

1. Iteration markdown at `review/iterations/iteration-002.md` with sections: Dispatcher, Files Reviewed, Findings - New, Traceability Checks, Integration Evidence, Edge Cases, Confirmed-Clean Surfaces, Ruled Out, Next Focus.
2. Append exactly one single-line JSON iteration record to `review/deep-review-state.jsonl` with `type:"iteration"`, `iteration:2`, `run:2`, `mode:"review"`, required counts, `sessionId:"2026-05-04T08:16:07.000Z"`, `generation:1`, `lineageMode:"new"`, and `durationMs`.
3. Delta file at `review/deltas/iter-002.jsonl` containing the same iteration record plus optional finding/traceability records, one JSON object per line.

Set Next Focus to `template-rendering-correctness`.
