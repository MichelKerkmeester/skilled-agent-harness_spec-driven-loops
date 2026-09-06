# Iteration 001: Correctness, Workspace And Entry Points

## Dispatcher
- Executor: inline detached OpenCode lineage, `cli-opencode model=llmgateway/gpt-5.6-luna`.
- Write surface: lineage directory only.
- Budget profile: scan.

## Files Reviewed
- `.opencode/skills/system-spec-kit/package.json:6-26`
- `.opencode/skills/system-spec-kit/runtime/tsconfig.json:31-60`
- `.opencode/skills/system-spec-kit/runtime/cli/package.json:1-34`
- `.opencode/skills/system-spec-kit/runtime/cli/tsconfig.json:1-40`
- `.opencode/skills/system-spec-kit/vitest.config.ts:10-58`
- `.opencode/skills/system-spec-kit/runtime/vitest.config.ts:13-39`
- `.opencode/skills/system-spec-kit/runtime/cli/spec/README.md:55-77`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/README.md:69-99`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/scratch/execute-plan.md:141-158`

## Findings - New
### P1 Findings
1. **Recorded workspace verification is not independently replayed in this lineage** -- `.opencode/skills/system-spec-kit/package.json:6-26` -- the workspace, package scripts and nested CLI manifest are source-aligned, but the packet's claimed typecheck, build, test and validation results are only recorded prose here. This is an evidence gap, not a confirmed package defect.
- Finding class: matrix/evidence
- Scope proof: Direct reads of workspace manifest, package manifest, both TypeScript configs and both Vitest configs.
- Affected surface hints: ["workspace install", "typecheck", "build", "test discovery"]

### P2 Findings
1. **Runtime TypeScript config retains retired topology entries** -- `.opencode/skills/system-spec-kit/runtime/tsconfig.json:42-48,51-55` -- the runtime config excludes `cli/**` correctly, but also retains `scripts/**` and `scripts/tests/**` exclusions. Those entries are inert in the current tree and preserve the retired sibling vocabulary in a build contract.
- Finding class: instance-only
- Scope proof: Direct read of the complete include/exclude block and comparison with the current `runtime/cli/tsconfig.json`.
- Affected surface hints: ["runtime tsconfig", "retired scripts topology"]

## Traceability Checks
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `.opencode/skills/system-spec-kit/package.json:6-26` | Current workspace shape matches the chosen `runtime/cli` layout. |
| checklist_evidence | partial | hard | `scratch/execute-plan.md:141-158` | Gate commands are recorded but not executed in this lineage. |

## Integration Evidence
- The root test project gives CLI tests a separate `runtime/cli` root at `.opencode/skills/system-spec-kit/vitest.config.ts:39-54`.
- The CLI package runs its own project through `../../vitest.config.ts` at `.opencode/skills/system-spec-kit/runtime/cli/package.json:19-22`.

## Edge Cases
- The review target is a completed packet with a Level 2 document set despite the recorded Level 3 recommendation. This iteration defers that reconciliation to traceability.

## Confirmed-Clean Surfaces
- `runtime/cli/package.json` has a tracked package name, current `main` path and direct `runtime`/`shared` file dependencies at lines 1-34.
- Root workspace membership is `shared`, `runtime`, `runtime/cli` at `package.json:6-10`.

## Ruled Out
- Missing nested CLI package manifest: ruled out by `.opencode/skills/system-spec-kit/runtime/cli/package.json:1-34`.
- Root Vitest omission of the CLI project: ruled out by `.opencode/skills/system-spec-kit/vitest.config.ts:39-54`.

## Next Focus
- dimension: security
- focus area: path containment, explicit output handling and hook candidate selection
- reason: verify relocation did not weaken path or autosave trust boundaries
- rotation status: new angle
- blocked/productive carry-forward: workspace source inspection was productive; command replay remains pending
- required evidence: path utility, description generator, continuity writer and session-stop resolver
- recovery note: none

Review verdict: CONDITIONAL
