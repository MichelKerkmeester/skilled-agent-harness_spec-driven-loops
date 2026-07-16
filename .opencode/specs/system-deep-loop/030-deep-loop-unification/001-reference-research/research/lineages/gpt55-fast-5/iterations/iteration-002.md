# Iteration 2: Structural Move And Bidirectional Path-Coupling Stress Test

## Focus

Validate whether child 002 covers the distinct structural risks in the hub rename and runtime nesting.

## Findings

1. Class A forward coupling from runtime to workflow content is mapped as same-hop repair with the old workflows segment removed. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:68] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:72] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:75]
2. Class B reverse coupling from workflow content to runtime has a different hop-count rule and cannot be safely handled as a blanket replacement. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:78] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:82] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:88]
3. The `system-spec-kit` tooling-borrow repair is load-bearing and correctly kept in child 002 rather than deferred to reference migration. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:90] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:94] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:99]
4. The verification stack targets the likely breakpoints: package validation, graph-metadata count, runtime tests, typecheck, council tests, git-follow preservation, and a live short run. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:124] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:125] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:131]

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md`
- `.opencode/skills/system-spec-kit/mcp_server/package.json`
- `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts`

## Assessment

- `newInfoRatio`: 0.68
- Novelty justification: added concrete structural risk classes and validation implications after the baseline pass.
- Confidence: high. The plan names file-level examples and verification commands.

## Reflection

What worked: classifying path references by direction and hop-count exposed why a naive replace is dangerous. What failed: no live tests were run because this lineage is read-only research. Ruled out: deferring the tooling-borrow repair.

## Recommended Next Focus

Stress-test child 003's external reference migration blast radius.
