# Iteration 1: Correctness

## Focus
Checked whether command routers load presentation assets before user-visible display and route to the expected workflow assets. Sampled memory, speckit, create, and doctor command files.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion
None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | not-run | hard | n/a | Correctness pass focused on router behavior, not spec map. |

## Assessment
Routers consistently point to a presentation asset and defer display wording to it. Memory commands explicitly document the missing workflow-YAML gap instead of inventing a workflow asset, which matches the local command state. Evidence sampled: `.opencode/commands/memory/save.md:15-18`, `.opencode/commands/speckit/plan.md:21-25`, `.opencode/commands/create/agent.md:21-28`, `.opencode/commands/doctor/speckit.md:43-52`.

## Ruled Out
- Missing sampled presentation assets: later reference-integrity check returned no missing paths.
- Router skips presentation before display: sampled routers require reading presentation assets first.

## Dead Ends
- Git diff isolation was noisy because unrelated generated metadata is dirty in the worktree.

## Recommended Next Focus
Security and mutation-scope review for doctor and memory routes.

Review verdict: PASS
