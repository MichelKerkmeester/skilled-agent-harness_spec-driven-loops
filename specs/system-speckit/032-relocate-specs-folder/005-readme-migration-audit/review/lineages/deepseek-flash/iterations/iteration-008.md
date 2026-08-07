# Iteration 8: Canonicalization-target feasibility

## Focus

Verify that every finding's recommended fix (canonicalize `.opencode/specs/...` references to `specs/...`) has a real existing canonical target, confirming fix feasibility for the fix phase.

## Scorecard

- Dimensions covered: [correctness, security, traceability, maintainability]
- Files reviewed: 8 (canonical target existence checks)
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings

No new findings. All canonicalization targets verified to exist:

| Finding | Legacy ref | Canonical target | Exists |
|---------|-----------|------------------|--------|
| F005 | .opencode/specs/.../004-spec-memory-rerank-benchmark | specs/.../004-spec-memory-rerank-benchmark | yes |
| F005 | .opencode/specs/.../004-spec-memory-embedder-bake-off | specs/.../004-spec-memory-embedder-bake-off | yes |
| F011 | .opencode/specs/.../004-cursor-hook-adapter-layer/decision-record.md | specs/.../decision-record.md | yes |
| F011 | .opencode/specs/.../hook-testing-results.md | specs/.../hook-testing-results.md | yes |
| F011 | .opencode/specs/.../008-devin-hook-parity/decision-record.md | specs/.../decision-record.md | yes |
| F011 | .opencode/specs/.../004-command-lane-integration | specs/.../004-command-lane-integration | yes |
| F011 | .opencode/specs/sk-design/010-sk-design-styles-from-refero | specs/sk-design/010-sk-design-styles-from-refero | yes |
| F011 | .opencode/specs/.../003-memory-and-causal-runtime | specs/.../003-memory-and-causal-runtime | yes |

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | existence checks above | Fixes are mechanically feasible |
| checklist_evidence | notApplicable | hard | - | No checklist.md |

## Assessment

- New findings ratio: 0.0
- Dimensions addressed: [correctness, security, traceability, maintainability]
- Novelty justification: Feasibility confirmation for the fix phase; no new defects.

## Ruled Out

- F001/F018 generic placeholders (`specs/[project]/NNN-feature/`) — illustrative paths, no target needed.
- No finding requires creating a canonical target that does not exist.

## Dead Ends

- None.

## Recommended Next Focus

Iteration 9: broaden the scan beyond the literal-hit set to the 33 READMEs mentioning specs root in prose (already partially scanned) and any README using `.opencode/specs` variants like `opencode/specs`, `.opencode/specs/` inside code blocks, or the old `specs` legacy-root framing.

## Claim Adjudication

(No new P0/P1 findings this iteration — no packet required.)

Review verdict: PASS
