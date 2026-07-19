---
title: "deep-ai-council Feature Catalog"
description: "Canonical capability inventory for the deep-ai-council planning skill: 33 features across 9 categories, each linked to its per-feature file and manual-testing scenario."
version: 2.3.0.7
---

# deep-ai-council Feature Catalog

Canonical inventory of what the `deep-ai-council` planning skill does today, grouped by category and linked to per-feature files.

---

## 1. OVERVIEW

`deep-ai-council` runs planning-only councils with two or three distinct reasoning seats, forces cross-seat critique, checks convergence, and persists packet-local `ai-council/**` artifacts. This catalog lists the 33 shipped features across 9 categories. Each row links to its per-feature file, and each per-feature file carries the implementation anchors, the manual-testing scenario, and the source metadata.

The manual testing playbook (`manual-testing-playbook/manual-testing-playbook.md`) is the companion validation surface: every feature here maps to a DAC scenario there. Feature IDs use the `DAC-NNN` prefix.

| Category | Features | Scenario IDs |
| --- | --- | --- |
| Runtime Routing and Rename | 2 | DAC-001..DAC-002 |
| Council Deliberation and Seat Diversity | 2 | DAC-003..DAC-004 |
| Artifact Persistence and State Format | 3 | DAC-005..DAC-007 |
| Convergence and Rollback | 4 | DAC-008..DAC-010, DAC-033 |
| Scope Boundaries | 2 | DAC-011..DAC-012 |
| Depth and Failure Handling | 2 | DAC-014, DAC-018 |
| Writer Library Contract | 4 | DAC-013, DAC-015..DAC-017 |
| Council Graph Integration | 8 | DAC-019..DAC-026 |
| Council Graph Value Comparison | 6 | DAC-027..DAC-032 |

---

## 2. RUNTIME ROUTING AND RENAME

Scenario IDs: DAC-001..DAC-002. How council requests reach the skill and how the runtime mirrors identify it.

| Feature | What it does | File |
| --- | --- | --- |
| Runtime agent renamed to deep-ai-council | Runtime agent mirrors use `deep-ai-council` as the primary identity. | [runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md](../feature-catalog/runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md) |
| Advisor routes council prompts to skill | The skill advisor scorer surfaces `deep-ai-council` for council prompts. | [runtime-routing-and-rename/advisor-routes-council-prompts-to-skill.md](../feature-catalog/runtime-routing-and-rename/advisor-routes-council-prompts-to-skill.md) |

---

## 3. COUNCIL DELIBERATION AND SEAT DIVERSITY

Scenario IDs: DAC-003..DAC-004. How seats deliberate and why premature agreement is blocked.

| Feature | What it does | File |
| --- | --- | --- |
| Three-seat diverse deliberation | Requires three distinct seat lenses for a deliberation round. | [council-deliberation-and-seat-diversity/three-seat-diverse-deliberation.md](../feature-catalog/council-deliberation-and-seat-diversity/three-seat-diverse-deliberation.md) |
| Cross-seat critique blocks premature convergence | Requires adversarial cross-seat critique before convergence is declared. | [council-deliberation-and-seat-diversity/cross-seat-critique-blocks-premature-convergence.md](../feature-catalog/council-deliberation-and-seat-diversity/cross-seat-critique-blocks-premature-convergence.md) |

---

## 4. ARTIFACT PERSISTENCE AND STATE FORMAT

Scenario IDs: DAC-005..DAC-007. How council output is written and how the state log fails closed.

| Feature | What it does | File |
| --- | --- | --- |
| Persist-artifacts helper writes packet-local tree | The persistence helper writes the packet-local `ai-council/**` artifact layout. | [artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md](../feature-catalog/artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md) |
| State JSONL records council_complete event | The final append-only state includes a `council_complete` event. | [artifact-persistence-and-state-format/state-jsonl-records-council-complete-event.md](../feature-catalog/artifact-persistence-and-state-format/state-jsonl-records-council-complete-event.md) |
| Output schema strict required sections fail closed | A report missing required sections exits 1 under `--strict-output`. | [artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md](../feature-catalog/artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md) |

---

## 5. CONVERGENCE AND ROLLBACK

Scenario IDs: DAC-008..DAC-010, DAC-033. How convergence is decided, how failed rounds are preserved, and how the cross-mode anti-convergence floor applies to council rounds.

| Feature | What it does | File |
| --- | --- | --- |
| Two-of-three agree triggers convergence | Two of three seats agreeing triggers convergence. | [convergence-and-rollback/two-of-three-agree-triggers-convergence.md](../feature-catalog/convergence-and-rollback/two-of-three-agree-triggers-convergence.md) |
| Max rounds without convergence emits non-converged | Hitting `max_rounds` without agreement emits a non-converged completion. | [convergence-and-rollback/max-rounds-without-convergence-emits-non-converged.md](../feature-catalog/convergence-and-rollback/max-rounds-without-convergence-emits-non-converged.md) |
| Rollback failed round preserves forensic trail | Failed rounds move under `failed/` and the state log records rollback events. | [convergence-and-rollback/rollback-failed-round-preserves-forensic-trail.md](../feature-catalog/convergence-and-rollback/rollback-failed-round-preserves-forensic-trail.md) |
| Cross-mode anti-convergence contract | Council mode declares `antiConvergence.minRounds = 2` and fail-closed stop policy. | [convergence-and-rollback/cross-mode-anti-convergence-contract.md](../feature-catalog/convergence-and-rollback/cross-mode-anti-convergence-contract.md) |

---

## 6. SCOPE BOUNDARIES

Scenario IDs: DAC-011..DAC-012. What the council may write and how the graph stays a derived projection.

| Feature | What it does | File |
| --- | --- | --- |
| Graph support stays derived and scoped | Council graph support is a derived projection, scoped and rebuildable from artifacts. | [scope-boundaries/graph-support-derived-and-scoped.md](../feature-catalog/scope-boundaries/graph-support-derived-and-scoped.md) |
| Planning-only boundary rejects implementation writes | The council writes only packet-local `ai-council/**` artifacts. | [scope-boundaries/planning-only-boundary-rejects-implementation-writes.md](../feature-catalog/scope-boundaries/planning-only-boundary-rejects-implementation-writes.md) |

---

## 7. DEPTH AND FAILURE HANDLING

Scenario IDs: DAC-014, DAC-018. How dispatch depth is chosen and how interrupted runs resume.

| Feature | What it does | File |
| --- | --- | --- |
| Depth detection parallel vs sequential | Detects Depth 0 (parallel dispatch) versus Depth 1 (sequential inline) execution. | [depth-and-failure-handling/depth-detection-parallel-vs-sequential.md](../feature-catalog/depth-and-failure-handling/depth-detection-parallel-vs-sequential.md) |
| Resume after interrupted state | An interrupted run resumes from the last completed JSONL event toward `council_complete`. | [depth-and-failure-handling/resume-after-interrupted-state.md](../feature-catalog/depth-and-failure-handling/resume-after-interrupted-state.md) |

---

## 8. WRITER LIBRARY CONTRACT

Scenario IDs: DAC-013, DAC-015..DAC-017. The writer-library API, the scoring rubric, the critique roles, and the out-of-scope guard.

| Feature | What it does | File |
| --- | --- | --- |
| Library writer call sequence | `lib/persist-artifacts.cjs` exports the 7 named writers, each emitting `artifact_written` events. | [writer-library-contract/library-writer-call-sequence.md](../feature-catalog/writer-library-contract/library-writer-call-sequence.md) |
| Five-dimension scoring rubric application | The 5-dimension rubric is documented with weights and applies to a seat output. | [writer-library-contract/five-dimension-scoring-rubric-application.md](../feature-catalog/writer-library-contract/five-dimension-scoring-rubric-application.md) |
| Hunter Skeptic Referee cross-critique | Hunter, Skeptic and Referee roles are documented with the score-adjustment rule. | [writer-library-contract/hunter-skeptic-referee-cross-critique.md](../feature-catalog/writer-library-contract/hunter-skeptic-referee-cross-critique.md) |
| OUT_OF_SCOPE_WRITE rejection | Writes outside `ai-council/**` are rejected with `OUT_OF_SCOPE_WRITE` before any filesystem touch. | [writer-library-contract/out-of-scope-write-rejection.md](../feature-catalog/writer-library-contract/out-of-scope-write-rejection.md) |

---

## 9. COUNCIL GRAPH INTEGRATION

Scenario IDs: DAC-019..DAC-026. The runtime council graph CLI surface, derived-projection guarantees, and retired MCP registry entries.

| Feature | What it does | File |
| --- | --- | --- |
| runtime upsert CLI idempotency and self-loop rejection | `runtime upsert CLI` is idempotent and rejects self-loop edges. | [council-graph-integration/council-graph-upsert-idempotency-and-self-loop-rejection.md](../feature-catalog/council-graph-integration/council-graph-upsert-idempotency-and-self-loop-rejection.md) |
| runtime upsert CLI empty input no-op success | `runtime upsert CLI` returns explicit no-op success on empty input. | [council-graph-integration/council-graph-upsert-empty-input-no-op-success.md](../feature-catalog/council-graph-integration/council-graph-upsert-empty-input-no-op-success.md) |
| runtime query CLI hostile metadata redaction | `runtime query CLI` redacts arbitrary metadata keys and bounds string lengths. | [council-graph-integration/council-graph-query-hostile-metadata-redaction.md](../feature-catalog/council-graph-integration/council-graph-query-hostile-metadata-redaction.md) |
| runtime query CLI five modes return prompt-safe context | All 5 documented query modes return prompt-safe bounded context. | [council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md](../feature-catalog/council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md) |
| runtime convergence CLI three-state decision matrix | `runtime convergence CLI` returns the correct bucket for each documented signal configuration. | [council-graph-integration/council-graph-convergence-three-state-decision-matrix.md](../feature-catalog/council-graph-integration/council-graph-convergence-three-state-decision-matrix.md) |
| runtime status CLI recovery payload and readiness | `runtime status CLI` returns readiness, counts, schema version, signals and a namespace-scoped recovery payload. | [council-graph-integration/council-graph-status-recovery-payload-and-readiness.md](../feature-catalog/council-graph-integration/council-graph-status-recovery-payload-and-readiness.md) |
| Derived projection rebuilds from artifacts | Deleting derived graph rows and replaying from artifacts restores graph state without touching artifacts. | [council-graph-integration/council-graph-derived-projection-rebuilds-from-artifacts.md](../feature-catalog/council-graph-integration/council-graph-derived-projection-rebuilds-from-artifacts.md) |
| Council graph MCP surface retired | Council graph operations are absent from mk-spec-memory and available through `runtime/ --loop-type council`. | [council-graph-integration/council-graph-tools-registered-separately-from-deep-loop.md](../feature-catalog/council-graph-integration/council-graph-tools-registered-separately-from-deep-loop.md) |

---

## 10. COUNCIL GRAPH VALUE COMPARISON

Scenario IDs: DAC-027..DAC-032. Measured graph-vs-baseline comparisons that justify the council graph.

| Feature | What it does | File |
| --- | --- | --- |
| Unresolved disagreement triage | Graph-driven triage finds unresolved critical disagreements with measurably less effort than the no-graph baseline. | [council-graph-value-comparison/unresolved-disagreement-triage-graph-vs-baseline.md](../feature-catalog/council-graph-value-comparison/unresolved-disagreement-triage-graph-vs-baseline.md) |
| Decision provenance audit | Graph-driven provenance tracing improves audit quality over the no-graph baseline. | [council-graph-value-comparison/decision-provenance-audit-graph-vs-baseline.md](../feature-catalog/council-graph-value-comparison/decision-provenance-audit-graph-vs-baseline.md) |
| Convergence safety under critical disagreement | The graph blocks on unresolved critical disagreement, a guarantee the two-of-three baseline lacks. | [council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md](../feature-catalog/council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md) |
| Stalled-council blocker ranking | The graph produces a prioritized blocker list where the baseline produces an unranked dump. | [council-graph-value-comparison/stalled-council-blocker-ranking-graph-vs-baseline.md](../feature-catalog/council-graph-value-comparison/stalled-council-blocker-ranking-graph-vs-baseline.md) |
| Hot-topic discovery | `hot_nodes` mode surfaces high-degree contested topics; the baseline needs manual tallying. | [council-graph-value-comparison/hot-topic-discovery-graph-vs-baseline.md](../feature-catalog/council-graph-value-comparison/hot-topic-discovery-graph-vs-baseline.md) |
| Mid-run interruption recovery | `runtime status CLI` returns structured recovery context where the baseline needs manual JSONL parsing. | [council-graph-value-comparison/mid-run-interruption-recovery-graph-vs-baseline.md](../feature-catalog/council-graph-value-comparison/mid-run-interruption-recovery-graph-vs-baseline.md) |

---

## RELATED RESOURCES

- `manual-testing-playbook/manual-testing-playbook.md` - companion manual validation package (DAC-001..DAC-033)
- `SKILL.md` - agent-facing router and operating contract
- `README.md` - human-facing overview
