---
title: "deep-ai-council: Manual Testing Playbook"
description: "Operator-facing manual validation package for the deep-ai-council skill, runtime routing, council deliberation, artifact persistence, convergence, rollback, scope boundaries, and council graph integration."
---

# deep-ai-council: Manual Testing Playbook

This playbook validates the `deep-ai-council` skill through 32 deterministic scenarios. It combines the root operator directory, review protocol, orchestration guide, and links to per-feature execution files.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--runtime-routing-and-rename/`
- `02--council-deliberation-and-seat-diversity/`
- `03--artifact-persistence-and-state-format/`
- `04--convergence-and-rollback/`
- `05--scope-boundaries/`
- `06--depth-and-failure-handling/`
- `07--writer-library-contract/`
- `08--council-graph-integration/`
- `09--council-graph-value-comparison/`

---

## 1. OVERVIEW

This playbook provides 32 deterministic scenarios across 9 categories validating the `deep-ai-council` skill surface. Each feature keeps a `DAC-NNN` ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-05-11): covers runtime rename, advisor routing, council deliberation, artifact persistence, state format, schema strictness, convergence, rollback, derived graph boundaries, planning-only boundaries, depth dispatch, failure handling, writer library sequence, scoring rubric use, adversarial critique, scoped-write rejection, the dedicated council-graph runtime CLI surface (upsert idempotency + self-loop rejection, empty-input no-op, hostile metadata redaction, five-mode prompt-safe queries, three-state convergence decision, recovery payload + readiness blocking, derived-projection replay, and retired MCP registry entries), and real-world value-comparison scenarios proving the graph beats the no-graph baseline for unresolved-disagreement triage, decision provenance audit, convergence safety under critical disagreement, stalled-council blocker ranking, hot-topic discovery, and mid-run interruption recovery.

### Realistic Test Model

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI/runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome
- The implementation or regression-test anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is project root.
2. Node.js 18+ is available for helper scripts and targeted vitest runs.
3. The operator has write access to the packet folder used for persistence scenarios.
4. Destructive scenarios run in sandbox isolation and must not target live production packets.
5. No live external CLI dispatch is required; council seats can be simulated when clearly labeled.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript
- User request used
- Orchestrator or agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- Output snippets
- Final user-facing response or outcome summary
- Artifact path or output reference
- Scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `node .opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs <packet> --input-file <report>`.
- runtime CLI script calls shown as `tool_name({ key: value })`.
- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`.
- `->` separates sequential steps.

Examples:

```text
bash: node .opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs <packet> --input-file <report>
bash: node .opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs <packet> --input-file <missing-required-section.md>; echo "exit=$?"
```

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, or critical check failed

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES`).
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run destructive scenarios in a dedicated sandbox-only wave.
6. After each wave, save context and evidence, then begin the next wave.
7. Record utilization table, per-feature file references, and evidence paths in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field following natural-human voice by default
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

---

## 7. RUNTIME ROUTING AND RENAME (DAC-001..DAC-002)

### DAC-001 | Runtime agent renamed to deep-ai-council

Verify runtime mirrors expose `deep-ai-council` and active mirror paths do not retain `ai-council` as the primary identity.

Feature file: [DAC-001](01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md)

### DAC-002 | Advisor routes council prompts to skill

Verify skill advisor scorer routes explicit council prompts to `deep-ai-council`.

Feature file: [DAC-002](01--runtime-routing-and-rename/advisor-routes-council-prompts-to-skill.md)

---

## 8. COUNCIL DELIBERATION AND SEAT DIVERSITY (DAC-003..DAC-004)

### DAC-003 | Three-seat diverse deliberation

Verify a council run uses distinct seats, lenses, and mandates.

Feature file: [DAC-003](02--council-deliberation-and-seat-diversity/three-seat-diverse-deliberation.md)

### DAC-004 | Cross-seat critique blocks premature convergence

Verify agreement is not accepted until cross-seat critique checks assumptions and failure modes.

Feature file: [DAC-004](02--council-deliberation-and-seat-diversity/cross-seat-critique-blocks-premature-convergence.md)

---

## 9. ARTIFACT PERSISTENCE AND STATE FORMAT (DAC-005..DAC-007)

### DAC-005 | Persist-artifacts helper writes packet-local tree

Verify the helper writes the expected `ai-council/` artifact tree.

Feature file: [DAC-005](03--artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md)

### DAC-006 | State JSONL records council_complete event

Verify persisted state ends with an auditable completion event.

Feature file: [DAC-006](03--artifact-persistence-and-state-format/state-jsonl-records-council-complete-event.md)

### DAC-007 | Output schema strict required sections fail closed

Verify missing required report sections cause exit 1 before writes.

Feature file: [DAC-007](03--artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md)

---

## 10. CONVERGENCE AND ROLLBACK (DAC-008..DAC-010)

### DAC-008 | Two-of-three agree triggers convergence

Verify convergence guidance uses the two-of-three rule.

Feature file: [DAC-008](04--convergence-and-rollback/two-of-three-agree-triggers-convergence.md)

### DAC-009 | Max rounds without convergence emits non-converged

Verify max-round escape-hatch guidance preserves non-converged output.

Feature file: [DAC-009](04--convergence-and-rollback/max-rounds-without-convergence-emits-non-converged.md)

### DAC-010 | Rollback failed round preserves forensic trail

Verify rollback preserves failed artifacts and audit state.

Feature file: [DAC-010](04--convergence-and-rollback/rollback-failed-round-preserves-forensic-trail.md)

---

## 11. SCOPE BOUNDARIES (DAC-011..DAC-012)

### DAC-011 | Graph support stays derived and scoped

Verify graph references preserve artifact source-of-truth and caller-owned runtime CLI boundaries. Functional graph behavior is verified by DAC-019..DAC-026.

Feature file: [DAC-011](05--scope-boundaries/graph-support-derived-and-scoped.md)

### DAC-012 | Planning-only boundary rejects implementation writes

Verify council instructions reject application-code and authored spec-doc writes.

Feature file: [DAC-012](05--scope-boundaries/planning-only-boundary-rejects-implementation-writes.md)

---

## 12. DEPTH AND FAILURE HANDLING (DAC-014, DAC-018)

### DAC-014 | Depth detection parallel vs sequential

Verify an explicit `Depth: 1` marker selects `sequential_thinking` inline mode and does not dispatch recursive council seats.

Feature file: [DAC-014](06--depth-and-failure-handling/depth-detection-parallel-vs-sequential.md)

### DAC-018 | Resume after interrupted state

Verify resume rules continue from the last completed JSONL event toward `council_complete`.

Feature file: [DAC-018](06--depth-and-failure-handling/resume-after-interrupted-state.md)

---

## 13. WRITER LIBRARY CONTRACT (DAC-013, DAC-015..DAC-017)

### DAC-013 | Library writer call sequence

Verify `persist-artifacts.js` exposes the canonical seven writer functions and emits `artifact_written` audit events.

Feature file: [DAC-013](07--writer-library-contract/library-writer-call-sequence.md)

### DAC-015 | Five-dimension scoring rubric application

Verify `scoring_rubric.md` preserves the five weighted dimensions used for council synthesis.

Feature file: [DAC-015](07--writer-library-contract/five-dimension-scoring-rubric-application.md)

### DAC-016 | Hunter Skeptic Referee cross-critique

Verify adversarial cross-critique documents HUNTER, SKEPTIC, REFEREE, and pre/post critique score adjustment.

Feature file: [DAC-016](07--writer-library-contract/hunter-skeptic-referee-cross-critique.md)

### DAC-017 | OUT_OF_SCOPE_WRITE rejection

Verify out-of-scope writer attempts are rejected with `OUT_OF_SCOPE_WRITE` before filesystem touch.

Feature file: [DAC-017](07--writer-library-contract/out-of-scope-write-rejection.md)

---

## 14. COUNCIL GRAPH INTEGRATION (DAC-019..DAC-026)

### DAC-019 | runtime upsert CLI idempotency and self-loop rejection

Verify `runtime upsert CLI` is idempotent across repeated calls and that self-loop edges are rejected by strict input validation.

Feature file: [DAC-019](08--council-graph-integration/council-graph-upsert-idempotency-and-self-loop-rejection.md)

### DAC-020 | runtime upsert CLI empty input no-op success

Verify `runtime upsert CLI` returns explicit no-op success on empty `nodes`/`edges` input rather than erroring.

Feature file: [DAC-020](08--council-graph-integration/council-graph-upsert-empty-input-no-op-success.md)

### DAC-021 | runtime query CLI hostile metadata redaction

Verify `runtime query CLI` redacts arbitrary metadata keys and bounds string lengths before returning prompt-safe output.

Feature file: [DAC-021](08--council-graph-integration/council-graph-query-hostile-metadata-redaction.md)

### DAC-022 | runtime query CLI five modes return prompt-safe context

Verify all five query modes (`unresolved_disagreements`, `evidence_chain`, `decision_support`, `convergence_blockers`, `hot_nodes`) return bounded prompt-safe context.

Feature file: [DAC-022](08--council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md)

### DAC-023 | runtime convergence CLI three-state decision matrix

Verify `runtime convergence CLI` emits `CONTINUE`, `STOP_ALLOWED`, or `STOP_BLOCKED` based on agreement, evidence, confidence, and unresolved-critical-disagreement signals.

Feature file: [DAC-023](08--council-graph-integration/council-graph-convergence-three-state-decision-matrix.md)

### DAC-024 | runtime status CLI recovery payload and readiness

Verify `runtime status CLI` returns readiness, counts, schema version, signals, and a namespace-scoped `recovery` payload — never false-safe empty success on missing/corrupt state.

Feature file: [DAC-024](08--council-graph-integration/council-graph-status-recovery-payload-and-readiness.md)

### DAC-025 | Derived projection rebuilds from artifacts

Verify deleting `council-graph.sqlite` rows for a session and replaying upserts from `ai-council/**` artifacts restores graph state without touching the artifacts.

Feature file: [DAC-025](08--council-graph-integration/council-graph-derived-projection-rebuilds-from-artifacts.md)

### DAC-026 | Council graph MCP surface retired

Verify mk-spec-memory has no council graph MCP entries and council graph operations route through `deep-loop-runtime --loop-type council`.

Feature file: [DAC-026](08--council-graph-integration/council-graph-tools-registered-separately-from-deep-loop.md)

---

## 15. COUNCIL GRAPH VALUE COMPARISON (DAC-027..DAC-032)

Each value-comparison scenario contrasts the no-graph baseline workflow against the with-graph workflow on a real-world council situation, with a measurable value metric.

### DAC-027 | Unresolved disagreement triage: graph vs baseline

Graph returns the unresolved critical set in one runtime CLI call; baseline requires reading 12+ deliberation/critique artifacts.

Feature file: [DAC-027](09--council-graph-value-comparison/unresolved-disagreement-triage-graph-vs-baseline.md)

### DAC-028 | Decision provenance audit: graph vs baseline

Graph returns a structured DECISION → SUPPORTS → EVIDENCE → SEAT trace; baseline produces unstructured prose narrative.

Feature file: [DAC-028](09--council-graph-value-comparison/decision-provenance-audit-graph-vs-baseline.md)

### DAC-029 | Convergence safety under critical disagreement: graph vs baseline

Graph returns `STOP_BLOCKED` when 2-of-3 agree but a critical disagreement is unresolved; the naive two-of-three baseline would have allowed stop.

Feature file: [DAC-029](09--council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md)

### DAC-030 | Stalled-council blocker ranking: graph vs baseline

Graph returns ranked blockers (severity / evidence-depth / centrality) with reason traces; baseline returns unranked artifact survey.

Feature file: [DAC-030](09--council-graph-value-comparison/stalled-council-blocker-ranking-graph-vs-baseline.md)

### DAC-031 | Hot-topic discovery: graph vs baseline

Graph ranks nodes by edge-degree (SUPPORTS + CONTRADICTS + EVIDENCE_FOR); baseline approximates via text cross-reference counts.

Feature file: [DAC-031](09--council-graph-value-comparison/hot-topic-discovery-graph-vs-baseline.md)

### DAC-032 | Mid-run interruption recovery: graph vs baseline

Graph status returns counts + readiness + namespace-scoped recovery payload; baseline requires manual JSONL forensics.

Feature file: [DAC-032](09--council-graph-value-comparison/mid-run-interruption-recovery-graph-vs-baseline.md)

---

## 16. AUTOMATED TEST CROSS-REFERENCE

| Test File | Scenario IDs |
| --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/tests/ai-council-runtime-parity.vitest.ts` | DAC-001 |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | DAC-002 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/ai-council-permission-scope.vitest.ts` | DAC-003, DAC-004, DAC-011, DAC-012, DAC-017 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/ai-council-audit-trail.vitest.ts` | DAC-005, DAC-006, DAC-013 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/ai-council-rollback.vitest.ts` | DAC-010 |
| `.opencode/skills/system-spec-kit/scripts/tests/ai-council-persist-artifacts.vitest.ts` | DAC-005, DAC-007 |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | DAC-019, DAC-020, DAC-021, DAC-022, DAC-023, DAC-024 |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` | DAC-027, DAC-028, DAC-029, DAC-030, DAC-031, DAC-032 |
| Operator A/B comparison (with-graph vs no-graph baseline) | Operator-runnable contract mirrors the automated DAC-027..DAC-032 fixtures |
| Documentation reference validation | DAC-014, DAC-015, DAC-016, DAC-018, DAC-025, DAC-026 |

---

## 17. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Scenario | Feature File | Catalog |
| --- | --- | --- | --- |
| DAC-001 | Runtime agent renamed to deep-ai-council | `01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md` | `feature_catalog/01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md` |
| DAC-002 | Advisor routes council prompts to skill | `01--runtime-routing-and-rename/advisor-routes-council-prompts-to-skill.md` | `feature_catalog/01--runtime-routing-and-rename/advisor-routes-council-prompts-to-skill.md` |
| DAC-003 | Three-seat diverse deliberation | `02--council-deliberation-and-seat-diversity/three-seat-diverse-deliberation.md` | `feature_catalog/02--council-deliberation-and-seat-diversity/three-seat-diverse-deliberation.md` |
| DAC-004 | Cross-seat critique blocks premature convergence | `02--council-deliberation-and-seat-diversity/cross-seat-critique-blocks-premature-convergence.md` | `feature_catalog/02--council-deliberation-and-seat-diversity/cross-seat-critique-blocks-premature-convergence.md` |
| DAC-005 | Persist-artifacts helper writes packet-local tree | `03--artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md` | `feature_catalog/03--artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md` |
| DAC-006 | State JSONL records council_complete event | `03--artifact-persistence-and-state-format/state-jsonl-records-council-complete-event.md` | `feature_catalog/03--artifact-persistence-and-state-format/state-jsonl-records-council-complete-event.md` |
| DAC-007 | Output schema strict required sections fail closed | `03--artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md` | `feature_catalog/03--artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md` |
| DAC-008 | Two-of-three agree triggers convergence | `04--convergence-and-rollback/two-of-three-agree-triggers-convergence.md` | `feature_catalog/04--convergence-and-rollback/two-of-three-agree-triggers-convergence.md` |
| DAC-009 | Max rounds without convergence emits non-converged | `04--convergence-and-rollback/max-rounds-without-convergence-emits-non-converged.md` | `feature_catalog/04--convergence-and-rollback/max-rounds-without-convergence-emits-non-converged.md` |
| DAC-010 | Rollback failed round preserves forensic trail | `04--convergence-and-rollback/rollback-failed-round-preserves-forensic-trail.md` | `feature_catalog/04--convergence-and-rollback/rollback-failed-round-preserves-forensic-trail.md` |
| DAC-011 | Graph support stays derived and scoped | `05--scope-boundaries/graph-support-derived-and-scoped.md` | `feature_catalog/05--scope-boundaries/graph-support-derived-and-scoped.md` |
| DAC-012 | Planning-only boundary rejects implementation writes | `05--scope-boundaries/planning-only-boundary-rejects-implementation-writes.md` | `feature_catalog/05--scope-boundaries/planning-only-boundary-rejects-implementation-writes.md` |
| DAC-013 | Library writer call sequence | `07--writer-library-contract/library-writer-call-sequence.md` | `feature_catalog/07--writer-library-contract/library-writer-call-sequence.md` |
| DAC-014 | Depth detection parallel vs sequential | `06--depth-and-failure-handling/depth-detection-parallel-vs-sequential.md` | `feature_catalog/06--depth-and-failure-handling/depth-detection-parallel-vs-sequential.md` |
| DAC-015 | Five-dimension scoring rubric application | `07--writer-library-contract/five-dimension-scoring-rubric-application.md` | `feature_catalog/07--writer-library-contract/five-dimension-scoring-rubric-application.md` |
| DAC-016 | Hunter Skeptic Referee cross-critique | `07--writer-library-contract/hunter-skeptic-referee-cross-critique.md` | `feature_catalog/07--writer-library-contract/hunter-skeptic-referee-cross-critique.md` |
| DAC-017 | OUT_OF_SCOPE_WRITE rejection | `07--writer-library-contract/out-of-scope-write-rejection.md` | `feature_catalog/07--writer-library-contract/out-of-scope-write-rejection.md` |
| DAC-018 | Resume after interrupted state | `06--depth-and-failure-handling/resume-after-interrupted-state.md` | `feature_catalog/06--depth-and-failure-handling/resume-after-interrupted-state.md` |
| DAC-019 | runtime upsert CLI idempotency and self-loop rejection | `08--council-graph-integration/council-graph-upsert-idempotency-and-self-loop-rejection.md` | `feature_catalog/08--council-graph-integration/council-graph-upsert-idempotency-and-self-loop-rejection.md` |
| DAC-020 | runtime upsert CLI empty input no-op success | `08--council-graph-integration/council-graph-upsert-empty-input-no-op-success.md` | `feature_catalog/08--council-graph-integration/council-graph-upsert-empty-input-no-op-success.md` |
| DAC-021 | runtime query CLI hostile metadata redaction | `08--council-graph-integration/council-graph-query-hostile-metadata-redaction.md` | `feature_catalog/08--council-graph-integration/council-graph-query-hostile-metadata-redaction.md` |
| DAC-022 | runtime query CLI five modes return prompt-safe context | `08--council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md` | `feature_catalog/08--council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md` |
| DAC-023 | runtime convergence CLI three-state decision matrix | `08--council-graph-integration/council-graph-convergence-three-state-decision-matrix.md` | `feature_catalog/08--council-graph-integration/council-graph-convergence-three-state-decision-matrix.md` |
| DAC-024 | runtime status CLI recovery payload and readiness | `08--council-graph-integration/council-graph-status-recovery-payload-and-readiness.md` | `feature_catalog/08--council-graph-integration/council-graph-status-recovery-payload-and-readiness.md` |
| DAC-025 | Derived projection rebuilds from artifacts | `08--council-graph-integration/council-graph-derived-projection-rebuilds-from-artifacts.md` | `feature_catalog/08--council-graph-integration/council-graph-derived-projection-rebuilds-from-artifacts.md` |
| DAC-026 | Council graph MCP surface retired | `08--council-graph-integration/council-graph-tools-registered-separately-from-deep-loop.md` | `feature_catalog/08--council-graph-integration/council-graph-tools-registered-separately-from-deep-loop.md` |
| DAC-027 | Unresolved disagreement triage: graph vs baseline | `09--council-graph-value-comparison/unresolved-disagreement-triage-graph-vs-baseline.md` | `feature_catalog/09--council-graph-value-comparison/unresolved-disagreement-triage-graph-vs-baseline.md` |
| DAC-028 | Decision provenance audit: graph vs baseline | `09--council-graph-value-comparison/decision-provenance-audit-graph-vs-baseline.md` | `feature_catalog/09--council-graph-value-comparison/decision-provenance-audit-graph-vs-baseline.md` |
| DAC-029 | Convergence safety under critical disagreement: graph vs baseline | `09--council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md` | `feature_catalog/09--council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md` |
| DAC-030 | Stalled-council blocker ranking: graph vs baseline | `09--council-graph-value-comparison/stalled-council-blocker-ranking-graph-vs-baseline.md` | `feature_catalog/09--council-graph-value-comparison/stalled-council-blocker-ranking-graph-vs-baseline.md` |
| DAC-031 | Hot-topic discovery: graph vs baseline | `09--council-graph-value-comparison/hot-topic-discovery-graph-vs-baseline.md` | `feature_catalog/09--council-graph-value-comparison/hot-topic-discovery-graph-vs-baseline.md` |
| DAC-032 | Mid-run interruption recovery: graph vs baseline | `09--council-graph-value-comparison/mid-run-interruption-recovery-graph-vs-baseline.md` | `feature_catalog/09--council-graph-value-comparison/mid-run-interruption-recovery-graph-vs-baseline.md` |
