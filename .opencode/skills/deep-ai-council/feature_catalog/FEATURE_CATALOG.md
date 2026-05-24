---
title: "deep-ai-council Feature Catalog"
description: "Canonical capability inventory for the deep-ai-council planning skill: 32 features across 9 categories, each linked to its per-feature file and manual-testing scenario."
---

# deep-ai-council Feature Catalog

Canonical inventory of what the `deep-ai-council` planning skill does today, grouped by category and linked to per-feature files.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. RUNTIME ROUTING AND RENAME](#2-runtime-routing-and-rename)
- [3. COUNCIL DELIBERATION AND SEAT DIVERSITY](#3-council-deliberation-and-seat-diversity)
- [4. ARTIFACT PERSISTENCE AND STATE FORMAT](#4-artifact-persistence-and-state-format)
- [5. CONVERGENCE AND ROLLBACK](#5-convergence-and-rollback)
- [6. SCOPE BOUNDARIES](#6-scope-boundaries)
- [7. DEPTH AND FAILURE HANDLING](#7-depth-and-failure-handling)
- [8. WRITER LIBRARY CONTRACT](#8-writer-library-contract)
- [9. COUNCIL GRAPH INTEGRATION](#9-council-graph-integration)
- [10. COUNCIL GRAPH VALUE COMPARISON](#10-council-graph-value-comparison)

---

## 1. OVERVIEW

`deep-ai-council` runs planning-only councils with two or three distinct reasoning seats, forces cross-seat critique, checks convergence, and persists packet-local `ai-council/**` artifacts. This catalog lists the 32 shipped features across 9 categories. Each row links to its per-feature file, and each per-feature file carries the implementation anchors, the manual-testing scenario, and the source metadata.

The manual testing playbook (`manual_testing_playbook/manual_testing_playbook.md`) is the companion validation surface: every feature here maps to a DAC scenario there. Feature IDs use the `DAC-NNN` prefix.

| Category | Features | Scenario IDs |
| --- | --- | --- |
| Runtime Routing and Rename | 2 | DAC-001..DAC-002 |
| Council Deliberation and Seat Diversity | 2 | DAC-003..DAC-004 |
| Artifact Persistence and State Format | 3 | DAC-005..DAC-007 |
| Convergence and Rollback | 3 | DAC-008..DAC-010 |
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
| Runtime agent renamed to deep-ai-council | Runtime agent mirrors use `deep-ai-council` as the primary identity. | [01--runtime-routing-and-rename/01-runtime-agent-renamed-to-deep-ai-council.md](01--runtime-routing-and-rename/01-runtime-agent-renamed-to-deep-ai-council.md) |
| Advisor routes council prompts to skill | The skill advisor scorer surfaces `deep-ai-council` for council prompts. | [01--runtime-routing-and-rename/02-advisor-routes-council-prompts-to-skill.md](01--runtime-routing-and-rename/02-advisor-routes-council-prompts-to-skill.md) |

---

## 3. COUNCIL DELIBERATION AND SEAT DIVERSITY

Scenario IDs: DAC-003..DAC-004. How seats deliberate and why premature agreement is blocked.

| Feature | What it does | File |
| --- | --- | --- |
| Three-seat diverse deliberation | Requires three distinct seat lenses for a deliberation round. | [02--council-deliberation-and-seat-diversity/01-three-seat-diverse-deliberation.md](02--council-deliberation-and-seat-diversity/01-three-seat-diverse-deliberation.md) |
| Cross-seat critique blocks premature convergence | Requires adversarial cross-seat critique before convergence is declared. | [02--council-deliberation-and-seat-diversity/02-cross-seat-critique-blocks-premature-convergence.md](02--council-deliberation-and-seat-diversity/02-cross-seat-critique-blocks-premature-convergence.md) |

---

## 4. ARTIFACT PERSISTENCE AND STATE FORMAT

Scenario IDs: DAC-005..DAC-007. How council output is written and how the state log fails closed.

| Feature | What it does | File |
| --- | --- | --- |
| Persist-artifacts helper writes packet-local tree | The persistence helper writes the packet-local `ai-council/**` artifact layout. | [03--artifact-persistence-and-state-format/01-persist-artifacts-helper-writes-packet-local-tree.md](03--artifact-persistence-and-state-format/01-persist-artifacts-helper-writes-packet-local-tree.md) |
| State JSONL records council_complete event | The final append-only state includes a `council_complete` event. | [03--artifact-persistence-and-state-format/02-state-jsonl-records-council-complete-event.md](03--artifact-persistence-and-state-format/02-state-jsonl-records-council-complete-event.md) |
| Output schema strict required sections fail closed | A report missing required sections exits 1 under `--strict-output`. | [03--artifact-persistence-and-state-format/03-output-schema-strict-required-sections-fail-closed.md](03--artifact-persistence-and-state-format/03-output-schema-strict-required-sections-fail-closed.md) |

---

## 5. CONVERGENCE AND ROLLBACK

Scenario IDs: DAC-008..DAC-010. How convergence is decided and how failed rounds are preserved.

| Feature | What it does | File |
| --- | --- | --- |
| Two-of-three agree triggers convergence | Two of three seats agreeing triggers convergence. | [04--convergence-and-rollback/01-two-of-three-agree-triggers-convergence.md](04--convergence-and-rollback/01-two-of-three-agree-triggers-convergence.md) |
| Max rounds without convergence emits non-converged | Hitting `max_rounds` without agreement emits a non-converged completion. | [04--convergence-and-rollback/02-max-rounds-without-convergence-emits-non-converged.md](04--convergence-and-rollback/02-max-rounds-without-convergence-emits-non-converged.md) |
| Rollback failed round preserves forensic trail | Failed rounds move under `failed/` and the state log records rollback events. | [04--convergence-and-rollback/03-rollback-failed-round-preserves-forensic-trail.md](04--convergence-and-rollback/03-rollback-failed-round-preserves-forensic-trail.md) |

---

## 6. SCOPE BOUNDARIES

Scenario IDs: DAC-011..DAC-012. What the council may write and how the graph stays a derived projection.

| Feature | What it does | File |
| --- | --- | --- |
| Graph support stays derived and scoped | Council graph support is a derived projection, scoped and rebuildable from artifacts. | [05--scope-boundaries/01-graph-support-derived-and-scoped.md](05--scope-boundaries/01-graph-support-derived-and-scoped.md) |
| Planning-only boundary rejects implementation writes | The council writes only packet-local `ai-council/**` artifacts. | [05--scope-boundaries/02-planning-only-boundary-rejects-implementation-writes.md](05--scope-boundaries/02-planning-only-boundary-rejects-implementation-writes.md) |

---

## 7. DEPTH AND FAILURE HANDLING

Scenario IDs: DAC-014, DAC-018. How dispatch depth is chosen and how interrupted runs resume.

| Feature | What it does | File |
| --- | --- | --- |
| Depth detection parallel vs sequential | Detects Depth 0 (parallel dispatch) versus Depth 1 (sequential inline) execution. | [06--depth-and-failure-handling/01-depth-detection-parallel-vs-sequential.md](06--depth-and-failure-handling/01-depth-detection-parallel-vs-sequential.md) |
| Resume after interrupted state | An interrupted run resumes from the last completed JSONL event toward `council_complete`. | [06--depth-and-failure-handling/02-resume-after-interrupted-state.md](06--depth-and-failure-handling/02-resume-after-interrupted-state.md) |

---

## 8. WRITER LIBRARY CONTRACT

Scenario IDs: DAC-013, DAC-015..DAC-017. The writer-library API, the scoring rubric, the critique roles, and the out-of-scope guard.

| Feature | What it does | File |
| --- | --- | --- |
| Library writer call sequence | `lib/persist-artifacts.js` exports the 7 named writers, each emitting `artifact_written` events. | [07--writer-library-contract/01-library-writer-call-sequence.md](07--writer-library-contract/01-library-writer-call-sequence.md) |
| Five-dimension scoring rubric application | The 5-dimension rubric is documented with weights and applies to a seat output. | [07--writer-library-contract/02-five-dimension-scoring-rubric-application.md](07--writer-library-contract/02-five-dimension-scoring-rubric-application.md) |
| Hunter Skeptic Referee cross-critique | Hunter, Skeptic and Referee roles are documented with the score-adjustment rule. | [07--writer-library-contract/03-hunter-skeptic-referee-cross-critique.md](07--writer-library-contract/03-hunter-skeptic-referee-cross-critique.md) |
| OUT_OF_SCOPE_WRITE rejection | Writes outside `ai-council/**` are rejected with `OUT_OF_SCOPE_WRITE` before any filesystem touch. | [07--writer-library-contract/04-out-of-scope-write-rejection.md](07--writer-library-contract/04-out-of-scope-write-rejection.md) |

---

## 9. COUNCIL GRAPH INTEGRATION

Scenario IDs: DAC-019..DAC-026. The `council_graph_*` MCP tool family and its derived-projection guarantees.

| Feature | What it does | File |
| --- | --- | --- |
| council_graph_upsert idempotency and self-loop rejection | `council_graph_upsert` is idempotent and rejects self-loop edges. | [08--council-graph-integration/01-council-graph-upsert-idempotency-and-self-loop-rejection.md](08--council-graph-integration/01-council-graph-upsert-idempotency-and-self-loop-rejection.md) |
| council_graph_upsert empty input no-op success | `council_graph_upsert` returns explicit no-op success on empty input. | [08--council-graph-integration/02-council-graph-upsert-empty-input-no-op-success.md](08--council-graph-integration/02-council-graph-upsert-empty-input-no-op-success.md) |
| council_graph_query hostile metadata redaction | `council_graph_query` redacts arbitrary metadata keys and bounds string lengths. | [08--council-graph-integration/03-council-graph-query-hostile-metadata-redaction.md](08--council-graph-integration/03-council-graph-query-hostile-metadata-redaction.md) |
| council_graph_query five modes return prompt-safe context | All 5 documented query modes return prompt-safe bounded context. | [08--council-graph-integration/04-council-graph-query-five-modes-prompt-safe-context.md](08--council-graph-integration/04-council-graph-query-five-modes-prompt-safe-context.md) |
| council_graph_convergence three-state decision matrix | `council_graph_convergence` returns the correct bucket for each documented signal configuration. | [08--council-graph-integration/05-council-graph-convergence-three-state-decision-matrix.md](08--council-graph-integration/05-council-graph-convergence-three-state-decision-matrix.md) |
| council_graph_status recovery payload and readiness | `council_graph_status` returns readiness, counts, schema version, signals and a namespace-scoped recovery payload. | [08--council-graph-integration/06-council-graph-status-recovery-payload-and-readiness.md](08--council-graph-integration/06-council-graph-status-recovery-payload-and-readiness.md) |
| Derived projection rebuilds from artifacts | Deleting derived graph rows and replaying from artifacts restores graph state without touching artifacts. | [08--council-graph-integration/07-council-graph-derived-projection-rebuilds-from-artifacts.md](08--council-graph-integration/07-council-graph-derived-projection-rebuilds-from-artifacts.md) |
| council_graph family registered separately from deep-loop | `council_graph_*` tools are a distinct family with no `loop_type:'council'` overload of `deep_loop_graph_*`. | [08--council-graph-integration/08-council-graph-tools-registered-separately-from-deep-loop.md](08--council-graph-integration/08-council-graph-tools-registered-separately-from-deep-loop.md) |

---

## 10. COUNCIL GRAPH VALUE COMPARISON

Scenario IDs: DAC-027..DAC-032. Measured graph-vs-baseline comparisons that justify the council graph.

| Feature | What it does | File |
| --- | --- | --- |
| Unresolved disagreement triage | Graph-driven triage finds unresolved critical disagreements with measurably less effort than the no-graph baseline. | [09--council-graph-value-comparison/01-unresolved-disagreement-triage-graph-vs-baseline.md](09--council-graph-value-comparison/01-unresolved-disagreement-triage-graph-vs-baseline.md) |
| Decision provenance audit | Graph-driven provenance tracing improves audit quality over the no-graph baseline. | [09--council-graph-value-comparison/02-decision-provenance-audit-graph-vs-baseline.md](09--council-graph-value-comparison/02-decision-provenance-audit-graph-vs-baseline.md) |
| Convergence safety under critical disagreement | The graph blocks on unresolved critical disagreement, a guarantee the two-of-three baseline lacks. | [09--council-graph-value-comparison/03-convergence-safety-under-critical-disagreement-graph-vs-baseline.md](09--council-graph-value-comparison/03-convergence-safety-under-critical-disagreement-graph-vs-baseline.md) |
| Stalled-council blocker ranking | The graph produces a prioritized blocker list where the baseline produces an unranked dump. | [09--council-graph-value-comparison/04-stalled-council-blocker-ranking-graph-vs-baseline.md](09--council-graph-value-comparison/04-stalled-council-blocker-ranking-graph-vs-baseline.md) |
| Hot-topic discovery | `hot_nodes` mode surfaces high-degree contested topics; the baseline needs manual tallying. | [09--council-graph-value-comparison/05-hot-topic-discovery-graph-vs-baseline.md](09--council-graph-value-comparison/05-hot-topic-discovery-graph-vs-baseline.md) |
| Mid-run interruption recovery | `council_graph_status` returns structured recovery context where the baseline needs manual JSONL parsing. | [09--council-graph-value-comparison/06-mid-run-interruption-recovery-graph-vs-baseline.md](09--council-graph-value-comparison/06-mid-run-interruption-recovery-graph-vs-baseline.md) |

---

## RELATED RESOURCES

- `manual_testing_playbook/manual_testing_playbook.md` - companion manual validation package (DAC-001..DAC-032)
- `SKILL.md` - agent-facing router and operating contract
- `README.md` - human-facing overview
