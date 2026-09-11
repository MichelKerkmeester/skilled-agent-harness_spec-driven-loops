# Deep Review Dashboard — sk-design-chart (lineage: deepseek)

Auto-generated from `deep-review-state.jsonl`, `deep-review-strategy.md` and `deep-review-findings-registry.json`.
Never hand-edited.

<!-- ANCHOR:overview -->
## OVERVIEW

| Field | Value |
| --- | --- |
| Session | `fanout-deepseek-1789150583287-1f2g93` |
| Lineage mode | auto (generation 1) |
| Target | `specs/sk-design/020-chart-and-diagram-review/001-chart-review` (spec-folder) |
| Packet under review | `.opencode/skills/sk-design/sk-design-chart` |
| Executor | cli-pi / deepseek-v4.1-flash (inline) |
| Stop policy | max-iterations |
| Iterations run | 2 of 2 |
| Verdict | **CONDITIONAL** |
| Has advisories | true (6 P2) |
<!-- /ANCHOR:overview -->

<!-- ANCHOR:status -->
## STATUS

| Field | Value |
| --- | --- |
| Status | complete |
| Stop reason | `maxIterationsReached` — the cap governed; convergence 0.67 was telemetry only |
| Release readiness | `release-blocking` (4 active P1) |
| Open findings | 10 |
| Resolved findings | 0 |
<!-- /ANCHOR:status -->

<!-- ANCHOR:findings-summary -->
## FINDINGS SUMMARY

| Severity | Count | Active | Weighted |
| --- | --- | --- | --- |
| P0 | 0 | 0 | 0.0 |
| P1 | 4 | 4 | 20.0 |
| P2 | 6 | 6 | 6.0 |
| **Total** | **10** | **10** | **26.0** |

Findings by dimension: correctness 2, security 1, traceability 3, maintainability 4.
<!-- /ANCHOR:findings-summary -->

<!-- ANCHOR:progress -->
## PROGRESS

| Run | Status | Focus | Dimensions | New findings | Ratio | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | complete | Correctness and security: corpus checker, DESIGN.md applicator and its gates | correctness, security | P0=0 P1=2 P2=2 | 1.00 | CONDITIONAL |
| 2 | complete | Traceability and maintainability: reference documents, playbook, colour bundle, proof suite | traceability, maintainability | P0=0 P1=2 P2=4 | 0.67 | CONDITIONAL |
<!-- /ANCHOR:progress -->

<!-- ANCHOR:dimension-coverage -->
## COVERAGE

| Dimension | Covered | Iteration |
| --- | --- | --- |
| correctness | yes | 1 |
| security | yes | 1 |
| traceability | yes | 2 |
| maintainability | yes | 2 |

| Protocol | Class | Status |
| --- | --- | --- |
| spec_code | core | partial |
| checklist_evidence | core | fail (no `checklist.md` in the review target) |
| feature_catalog_code | overlay | partial |
| playbook_capability | overlay | partial |

Files read in whole or in part: 35. Templates inspected: 29 (7 read, 22 grepped).
<!-- /ANCHOR:dimension-coverage -->

## ACTIVE FINDINGS

| ID | Severity | Dimension | Title | Evidence |
| --- | --- | --- | --- | --- |
| F001 | P1 | correctness | design-md gate list in `color-system.md` names three gates the path does not apply | `references/color-system.md:307-310` |
| F002 | P1 | correctness | catalog `family` cell carries two undefined values, and no check reads the column | `references/catalog.md:46-47` |
| F003 | P2 | security | immutable-stock-forms guard compares paths lexically | `scripts/apply-design-md.cjs:666-669` |
| F004 | P2 | maintainability | `references/README.md` says three files and ships four | `references/README.md:24` |
| F005 | P1 | traceability | five sites still name the removed `cursor` reference; one states contradicted corner values | `references/template-contract.md:462-464` |
| F006 | P1 | traceability | playbook states twenty-one chart forms where the corpus ships twenty-nine | `manual-testing-playbook/manual-testing-playbook.md:50` |
| F007 | P2 | maintainability | check inventory accounts for 22 of 42 emitted families | `scripts/README.md:75` |
| F008 | P2 | maintainability | the standing proof suite is named in no living document | `scripts/tests/corpus-mutations.test.cjs` |
| F009 | P2 | maintainability | version fields did not follow the v0.23.0.0 release | `scripts/README.md:12` |
| F010 | P2 | traceability | the review target spec folder is an unfilled scaffold | `specs/.../001-chart-review/spec.md:28-33` |

## BLOCKED STOPS

None recorded.

## CORRUPTION WARNINGS

None. `deep-review-state.jsonl` parses cleanly.

## GRAPH CONVERGENCE

`graphConvergenceScore: 0`, `graphDecision: null`, `graphBlockers: []`. No graph event was emitted by this lineage.

## BASELINE OBSERVED

| Command | Result |
| --- | --- |
| `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` (read-only, no `--render`) | 42 families, 0 failures, 32 files scanned, 29 chart forms, 3 colour systems, `RESULT: PASSED` |
| `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --render` | not run (requires an installed browser; the packet's CI deliberately omits it too) |
