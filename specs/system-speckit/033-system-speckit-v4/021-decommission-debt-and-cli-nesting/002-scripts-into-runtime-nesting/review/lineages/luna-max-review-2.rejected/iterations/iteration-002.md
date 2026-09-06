# Iteration 2: Security and Path Boundaries

## Focus
Security review of path discovery, hook executable resolution, package-root detection and path-derived workspace candidates. No repository tooling or target writes were run.

## Scorecard
- Dimensions covered: security
- Files reviewed: 9 direct files
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.30

## Findings

### P1, Required
- **F003**: The shared embedding package-root resolver still requires a sibling `scripts` directory as part of its root landmark, but the live CLI workspace is `runtime/cli`. In the current tree the resolver checks `runtime/database`, `scripts` and `shared`; because `runtime/database` is absent and the old `scripts` directory is absent, the resolver returns null. The downstream default database fallback therefore cannot derive the intended `runtime/database` path from this resolver. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:243-255] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:397-400]

### P2, Suggestion
- **F004**: The production stop-hook candidate list is safer than the legacy env override because the override is test-gated, but the two relative candidates are not equivalent to the two cwd candidates and depend on the hook's source or compiled depth. This should remain covered by a source-and-dist path test when the generated dist is available. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:61-89]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:42-45; factory.ts:243-255 | The target layout claim is not reflected in the shared root landmark. |
| checklist_evidence | partial | hard | tasks.md:47-60; factory.ts:243-255 | The packet records path resolution work but no current shared-landmark evidence. |
| feature_catalog_code | pass | advisory | session-stop.ts:61-89 | Hook resolution is explicit and test override is restricted. |
| playbook_capability | partial | advisory | session-stop.ts:71-76 | Candidate-depth behavior needs executable path coverage. |

## Assessment
- New findings ratio: 0.30
- Dimensions addressed: security
- Novelty justification: direct inspection found one live root-detection producer that the prior broad path sweep did not prove coherent after the move.

## Ruled Out
- A production environment-variable redirection vulnerability was not found. The explicit path override is accepted only in test mode. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:61-76]
- The graph metadata candidate list includes the new `runtime/cli` root, so the specific graph resolver path was not promoted. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:962-970]

## Dead Ends
- No filesystem traversal exploit was admitted from the reviewed path joins alone.

## Recommended Next Focus
Traceability: reconcile acceptance claims, checklist status, generated metadata hashes and the packet's stated planned-versus-complete state.

Review verdict: CONDITIONAL
