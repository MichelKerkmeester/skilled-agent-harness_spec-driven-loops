# Deep Review Dashboard - Session Overview

## STATUS

- Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting`
- Target Type: `spec-folder`
- Started: `2026-09-05T15:16:06.549Z`
- Session: `fanout-luna-max-fast-review-3-1788621363532-a1faj6`
- Status: COMPLETE
- Release Readiness: release-blocking
- Iteration: 10 of 10
- Provisional Verdict: FAIL (active P1 findings)
- hasAdvisories: false

## FINDINGS SUMMARY

- P0 (Critical): 0 active, 0 new
- P1 (Major): 11 active, 0 new
- P2 (Minor): 4 active, 0 new
- Dimensions covered: correctness, security, traceability, maintainability
- Core protocols complete: 0 / 2
- Overlay protocols complete: 0 / 2 applicable
- Convergence score: 0.18
- Graph convergence: unavailable

## PROGRESS

| # | Focus | Files | Dimensions | New P0/P1/P2 | Ratio | Status |
|---|---|---:|---|---|---:|---|
| 0 | initialization | 0 | none | 0 / 0 / 0 | 0.00 | initialized |
| 1 | packet contract and moved-tree documentation | 10 | correctness | 0 / 3 / 0 | 0.96 | complete |
| 2 | build and test discovery | 12 | correctness | 0 / 1 / 2 | 0.88 | complete |
| 3 | output-path containment | 6 | security | 0 / 1 / 0 | 0.94 | complete |
| 4 | scope manifest and execution map | 7 | traceability | 0 / 1 / 1 | 0.91 | complete |
| 5 | registry dependency metadata | 7 | maintainability | 0 / 0 / 1 | 0.87 | complete |
| 6 | test discovery and build order | 7 | maintainability | 0 / 2 / 0 | 0.84 | complete |
| 7 | CLI source-dist alignment | 7 | maintainability | 0 / 1 / 0 | 0.79 | complete |
| 8 | wrapper and symlink ownership | 7 | maintainability | 0 / 0 / 0 | 0.42 | complete |
| 9 | external consumer resolution | 7 | maintainability | 0 / 2 / 0 | 0.76 | complete |
| 10 | final coverage and adjudication | 7 | maintainability | 0 / 0 / 0 | 0.34 | complete |

## COVERAGE

- Files reviewed: 77 / 453 bounded manifest entries
- Dimensions complete: 4 / 4
- Core protocols: partial
- Applicable overlays: pending
- Resource-map coverage: skipped because no target resource map existed at init

## TREND

- New findings trend: 3 P1 in iteration 1; 1 P1 and 2 P2 in iteration 2; 1 P1 in iteration 3; 1 P1 and 1 P2 in iteration 4; 1 P2 in iteration 5; 2 P1 in iteration 6; 1 P1 in iteration 7; no new finding in iteration 8; 2 P1 in iteration 9; no new finding in iteration 10
- Traceability trend: pending
- Convergence: telemetry only until iteration 10

## NEXT FOCUS

Synthesis of the ten-pass evidence and release-readiness decision.

## ACTIVE RISKS

- Active P1 findings remain open and block a pass verdict.
- The packet's planning-only scope conflicts with its shipped-move completion evidence.
- The alias-retirement runbook points at a non-existent `runtime/runtime` Vitest config.
- The changelog writer accepts an uncontained `--output` override before its
  write sink.
- The review manifest and execution map are stale at different boundaries.
- The central script registry still names retired source paths in dependency
  metadata.
- The test documentation and package runner disagree with the actual cwd and
  generated-dist prerequisites.
- The CLI source-dist alignment gate does not inspect the moved CLI dist tree.
- The nested runtime compatibility marker is intentional and remains owned by
  the move plan and runtime-mirror tooling.
- The deployed Claude stop hook and active Speckit workflow assets still
  contain retired-path consumers.
- Max iterations have been reached; convergence did not authorize an early
  stop.
- Repository validation, build, install and test commands are intentionally not run in this detached lineage.
- Coverage-graph writes are unavailable under the lineage-only write constraint.
