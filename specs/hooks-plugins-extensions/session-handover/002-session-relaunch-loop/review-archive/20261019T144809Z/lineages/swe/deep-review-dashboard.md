# Deep Review Dashboard — fan-out lineage `swe`

| Field | Value |
|-------|-------|
| Session | `fanout-swe-1792349322065-8lohfl` |
| Executor | cli-devin `swe-2-max` (in-process LEAF, no nested dispatch) |
| Target | `specs/hooks/023-session-relaunch-loop` (spec-folder) |
| Loop type | review |
| Stop policy | max-iterations |
| Iterations | 3 of 3 — **maxIterationsReached** |
| Status | COMPLETE |
| Verdict | **PASS** (P2-only advisories) |

## Findings by Severity

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 0 |
| P2 | 10 |

## Dimension Coverage

| Dimension | Covered | Iteration | Findings |
|-----------|---------|-----------|----------|
| correctness | yes | 1 | R1-P2-001..004 |
| security | yes | 2 | R2-P2-001..003 |
| traceability | yes | 3 | R3-P2-001..002 |
| maintainability | yes | 3 | R3-P2-003 |

Coverage 4/4. Core protocols spec_code + checklist_evidence exercised; overlays skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability all resolved.

## Findings by Iteration

| Iteration | New | Ids |
|-----------|-----|-----|
| 1 | 4 | R1-P2-001, R1-P2-002, R1-P2-003, R1-P2-004 |
| 2 | 3 | R2-P2-001, R2-P2-002, R2-P2-003 |
| 3 | 3 | R3-P2-001, R3-P2-002, R3-P2-003 |

## Active Findings

| Id | Sev | Title | File |
|----|-----|-------|------|
| R1-P2-001 | P2 | Killer liveness check crashes on EPERM where the core treats it as alive | lib/killer.cjs:106 |
| R1-P2-002 | P2 | recordTimeout gates unarm and notify on a pre-wait record snapshot | lib/killer.cjs:441 |
| R1-P2-003 | P2 | plannedNotePath interpolates an unvalidated session id into the note filename | lib/nudge.cjs:191 |
| R1-P2-004 | P2 | Lock-owner liveness trusts pid identity; a recycled pid pins a stale lock indefinitely | lib/killer.cjs:275 |
| R2-P2-001 | P2 | Ancestry check and SIGTERM are separated by a pid-reuse window | lib/killer.cjs:449 |
| R2-P2-002 | P2 | The handoff containment boundary follows REPO_ROOT, not the repository | bin/session-relaunch.cjs:72 |
| R2-P2-003 | P2 | The live-shell guard fails open on any shell outside a three-name list | bin/session-relaunch.cjs:190 |
| R3-P2-001 | P2 | Parent spec prose still describes four children while five exist and are complete | spec.md:39 |
| R3-P2-002 | P2 | Phase-handoff verification cell names a path that no longer exists | spec.md:114 |
| R3-P2-003 | P2 | Two ps process-table readers and three ancestor walks survive the helper consolidation | bin/session-relaunch.cjs:138 |

## Convergence Telemetry

newFindingsRatio stayed 1.0 across all three iterations — the max-iterations stop policy kept the loop running per contract; convergence was telemetry only and never consulted for stopping.

## Artifacts

- `iterations/iteration-001.md` … `iteration-003.md` — narratives with numbered severity sections and final verdict lines
- `deltas/iter-001.jsonl` … `iter-003.jsonl` — iteration + finding + ruled_out rows
- `deep-review-state.jsonl` — canonical ledger-projected state (iter-1, config, iter-2, iter-3, synthesis)
- `deep-review-ledger/` + `deep-review-audit-ledger/` — committed event frames
- `deep-review-findings-registry.json` — 10 active findings, terminal stop recorded
- `deep-review-config.json`, `deep-review-strategy.md`, `review-report.md`
