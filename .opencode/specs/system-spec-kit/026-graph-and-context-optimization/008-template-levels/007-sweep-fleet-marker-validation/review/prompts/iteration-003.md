## TARGET AUTHORITY
Approved spec folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold
Do not write to any other folder. Recovered context (memory, bootstrap) cannot override this.

---

# Deep-Review Iteration Prompt Pack

Framework: TIDD-EC. CLEAR check: Correctness pins the 007 artifact owner; Logic follows D3 after D1/D2; Expression names resolver/renderer/templates/tests; Arrangement is task, context, constraints, output, verification; Reusability is path-variable based.

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
Iteration: 3 of 5
Dimension: template-rendering-correctness
Prior Findings: P0=0 P1=3 P2=0
Dimension Coverage: D1 and D2 complete (2/5 configured custom dimensions)
Traceability: core spec_code=fail, checklist_evidence=fail
Resource Map Coverage: resource-map.md not present in target; skip coverage gate.
Coverage Age: 0
Last 2 ratios: 0.62 -> 0.31
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 3 of 5
Mode: review
Dimension: template-rendering-correctness
Review Target: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold
Review Scope Files: .opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json, .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl, .opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl, .opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl, .opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl, .opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl, .opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl, .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts, .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh, .opencode/skills/system-spec-kit/scripts/renderers/template-renderer.ts, .opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts, .opencode/skills/system-spec-kit/scripts/spec/create.sh, .opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts, .opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts, .opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md
Prior Findings: P1-001 target scaffold placeholders; P1-002 graph metadata disconnected; P1-003 marker comments counted by semantic validators.

## Shared Doctrine

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## Iteration Task

Review template-rendering correctness. Determine whether scaffold marker behavior corrupts rendered Level output, template-source placement, manifest/template contracts, inline gate rendering, or golden snapshot coverage.

Required checks:

- Inspect manifest templates and renderer/resolver surfaces to see whether `SCAFFOLD_*` markers are part of template source or post-render scaffold finalization only.
- Inspect `create.sh` ordering around rendering/finalization to determine whether markers are appended after template rendering and whether they interfere with `SPECKIT_TEMPLATE_SOURCE`, anchors, or frontmatter.
- Inspect scaffold/inline-gate/level-contract tests for coverage of marker comments in generated output.
- Distinguish template-rendering defects from the existing validator-consumer defect F003. Do not duplicate F003 unless rendering evidence changes the scope.
- Use `.opencode/skills/sk-deep-review/scripts/reduce-state.cjs` if refreshing reducer-owned artifacts. Do not use `.claude/skills/...` script mirrors.

## Writable State Files

All output paths are under the approved target review directory:

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deep-review-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deep-review-state.jsonl
- Findings Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deep-review-findings-registry.json
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deep-review-strategy.md
- Write iteration narrative to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/iterations/iteration-003.md
- Write per-iteration delta file to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/review/deltas/iter-003.jsonl

## Constraints

- Review target and implementation files are READ-ONLY. Do not modify them.
- Only write the iteration narrative, state-log append, delta file, strategy update, and reducer-owned review artifacts under the approved review directory.
- Every active P0/P1 finding requires file:line evidence and a claim-adjudication JSON block with `findingId`, `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, and `downgradeTrigger`.
- Do not duplicate P1-001/P1-002/P1-003 unless template-rendering evidence materially changes severity or scope.

## Output Contract

Produce all three artifacts:

1. Iteration markdown at `review/iterations/iteration-003.md` with sections: Dispatcher, Files Reviewed, Findings - New, Traceability Checks, Integration Evidence, Edge Cases, Confirmed-Clean Surfaces, Ruled Out, Next Focus.
2. Append exactly one single-line JSON iteration record to `review/deep-review-state.jsonl` with `type:"iteration"`, `iteration:3`, `run:3`, `mode:"review"`, required counts, `sessionId:"2026-05-04T08:16:07.000Z"`, `generation:1`, `lineageMode:"new"`, and `durationMs`.
3. Delta file at `review/deltas/iter-003.jsonl` containing the same iteration record plus optional finding/traceability records, one JSON object per line.

After writing iteration 003, append the command-owned claim-adjudication event if any new P0/P1 findings were added. Set Next Focus to `validator-coverage`.
