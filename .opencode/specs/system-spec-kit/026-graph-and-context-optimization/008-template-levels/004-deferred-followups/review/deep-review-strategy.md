# Deep Review Strategy

## Topic
Review of 004-deferred-followups — implementation code for 10 Gate 7 deferred items (validation orchestrator, manifest versions, section gates, inline renderer batch mode, canonical save lock, lineage warnings, exit-code taxonomy, extension guide, migration guide, snapshot coverage).

## Review Dimensions
- [ ] **implementation-spec-alignment**: Do the 10 implemented items match what spec.md, tasks.md, and ADRs promise?
- [ ] **code-correctness**: Are there logic errors, edge-case bugs, TypeScript type issues, or mishandled error paths?
- [ ] **template-rendering-correctness**: Do templates, manifests, inline-gate rendering, and section gates produce correct output?
- [ ] **validator-coverage**: Does the validation orchestrator + validate.sh cover all required checks and edge cases?
- [ ] **cross-runtime-mirror-consistency**: Are Bash (validate.sh), TypeScript (orchestrator, resolver), and JSON (manifest) in agreement?

## Completed Dimensions
None yet.

## Running Findings
P0: 0 | P1: 0 | P2: 0

## Files Under Review
| File | Review Status |
|------|--------------|
| mcp_server/lib/validation/orchestrator.ts | pending |
| mcp_server/api/index.ts | pending |
| scripts/spec/validate.sh | pending |
| templates/manifest/spec-kit-docs.json | pending |
| mcp_server/lib/templates/level-contract-resolver.ts | pending |
| scripts/memory/generate-context.ts | pending |
| templates/manifest/EXTENSION_GUIDE.md | pending |
| templates/manifest/MIGRATION.md | pending |
| 004-deferred-followups/spec.md | pending |
| 004-deferred-followups/tasks.md | pending |
| 004-deferred-followups/checklist.md | pending |
| 004-deferred-followups/decision-record.md | pending |
| 004-deferred-followups/implementation-summary.md | pending |

## Known Context
- 004-deferred-followups implements 10 deferred items from 003-template-greenfield-impl Gate 7.
- 5 ADRs cover orchestrator architecture, lineage semantics, exit codes, manifest versions, and migration policy.
- Implementation-summary reports all verification gates A-G as PASS.
- Resource-map.md is absent; skipping coverage gate.

## What Worked
(None yet)

## What Failed
(None yet)

## Exhausted Approaches
(None yet)

## Ruled Out Directions
(None yet)

## Next Focus
Iteration 1: implementation-spec-alignment

## Review Boundaries
- Max iterations: 5
- Convergence threshold: 0.10
- Stuck threshold: 2
