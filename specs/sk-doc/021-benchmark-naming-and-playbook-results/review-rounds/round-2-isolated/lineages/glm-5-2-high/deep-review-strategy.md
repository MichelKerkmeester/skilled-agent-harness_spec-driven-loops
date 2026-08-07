# Deep Review Strategy

## 1. REVIEW CHARTER

- Target: `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results` (spec-folder, Level 3)
- Dimensions: correctness, security, traceability, maintainability
- Scope: packet documents, the frozen rename-map artifacts, and the implementation surfaces named by `spec.md` (the grammar owner, the label validator, the serving snapshot, the playbook results-storage contract, the skill scaffolder, the Lane C emitters/runner/index writer, the deep-model-benchmark workflow grammar, and the storage suite).
- Stop policy: run all five iterations. Convergence is telemetry only; broaden review angles instead of synthesizing early.
- Resource map: `resource-map.md` not present at initialization; coverage gate skipped.

## 2. KNOWN CONTEXT

- The packet records remediation of three earlier deep-review findings (CHK-035 same-day collision guard, CHK-036 report-folder contract vs writer, CHK-037 parity-baseline discovery) and requests an isolated rerun.
- Prior two-lineage review was untrustworthy: one lineage failed terminally on a write-containment violation; the other wrote nine of twelve state records with future timestamps; both ran sequentially into a shared packet. ADR-005 codifies "treat a reviewer finding as a hypothesis" — every finding here must be verified against the code before being recorded as confirmed.
- ADR-006 codifies "dispatched executors run in an isolated worktree" — this lineage is itself running in worktree `.worktrees/0109-sk-doc-021-review-rerun`.
- Code graph is unavailable; direct source reads and exact search are required.
- The sibling `terra-high-fast` lineage hit `dispatch_blocked` because the orchestrator runtime was `cli-codex` and could not self-invoke. This lineage is orchestrated by `glm-5.2-high` running directly in Cursor (no sub-process dispatch), so no such block applies.

## 3. DIMENSION COVERAGE

| Dimension | Status | Iterations |
|---|---|---|
| correctness | pending | — |
| security | pending | — |
| traceability | pending | — |
| maintainability | pending | — |

## 4. FINDINGS SUMMARY

- P0: 0
- P1: 0
- P2: 0

## 5. NEXT FOCUS

- Dimension: correctness
- Focus area: the three remediations just applied (same-day collision guard in `run-skill-benchmark.cjs`, report-folder contract in `create-manual-testing-playbook/SKILL.md` and `create-benchmark/SKILL.md`, parity-baseline discovery in `render-serving-snapshot.cjs`).
- Reason: highest-risk implementation behavior claimed by the packet; the rest of the rename already passed its gate.

## 6. EXHAUSTED APPROACHES

- None.

## 7. WHAT WORKED

- Initialization completed with an isolated lineage packet bound to `glm-5-2-high`.

## 8. WHAT FAILED

- None.

## 9. EDGE CASES AND OPEN QUESTIONS

- Does the same-day collision guard handle a third consecutive run on one day, or only the second?
- Does the parity-baseline fallback return a deterministic choice when multiple dated discoveries exist?
- Does the seven-file vs six-file contract language match the writer's actual emissions across both owning skills?

## 10. REVIEW BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.1 (telemetry only under max-iterations stop policy)
- Session lineage: `fanout-glm-5-2-high-1785153423148-1aktp5` (generation 1, new)
- Target and implementation surfaces are read-only. Writes are confined to `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/review/lineages/glm-5-2-high`.
