---
title: "Feature Specification: 116/007 - Ledger-Led Graph Vocabulary"
description: "Extends review coverage-graph vocabulary with ledger-led node kinds for BUG_CLASS, INVARIANT, PRODUCER, CONSUMER, and TEST."
trigger_phrases:
  - "review graph vocabulary"
  - "ledger-led graph"
  - "BUG_CLASS node"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab"
    last_updated_at: "2026-05-22T12:18:31Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented Phase G review graph vocabulary allow-list extension."
    next_safe_action: "Commit Phase G after final validation evidence is reviewed."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-graph.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1160077000000000000000000000000000000000000000000000000000000000"
      session_id: "116-007-ledger-led-graph-vocabulary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No new review relations were required; existing IN_DIMENSION, IN_FILE, and EVIDENCE_FOR relations cover the requested mappings."
---

# Feature Specification: 116/007 - Ledger-Led Graph Vocabulary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of 8 |
| **Predecessor** | `../006-candidate-saturation-and-graphless-gates/spec.md` |
| **Successor** | `../008-playbooks-and-default-calibration/spec.md` |
| **Handoff Criteria** | Review graph upserts accept ledger-led candidate node kinds while graphless fallback remains text/JSON authoritative. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-review coverage graph accepted only coarse review node kinds: `DIMENSION`, `FILE`, `FINDING`, `EVIDENCE`, and `REMEDIATION`. Phase B seeded graph fixtures proved that ledger-led search evidence could not be represented as structured graph nodes because `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` events were rejected or filtered out.

### Purpose
Extend the review graph vocabulary so stable `searchLedger` evidence can be projected into graph nodes without making graph availability the source of truth. Text/JSON ledger rows remain authoritative; graph nodes are a structured evidence projection for graph-enabled runs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` to the review coverage-graph node-kind type and runtime allow-list.
- Keep the upsert handler's dynamic validation path intact so it reads the updated allow-list.
- Extend `deep-review` auto and confirm YAML graph event filters so the new node kinds are not dropped before upsert.
- Un-skip Phase B graph vocabulary fixture tests and convert the pre-G failure assertion into the live post-G contract.
- Populate this Phase G packet to Level 2 and refresh metadata.

### Out of Scope
- Changing `searchLedger` row schema or reducer persistence from earlier phases.
- Adding new graph relations unless the existing review relation vocabulary cannot express the requested mappings.
- Modifying other Phase B fixtures or earlier deep-review surfaces.
- Requiring graph data when `graphCoverageMode` is `graphless_fallback`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/spec.md` | Modify | Level 2 specification. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/plan.md` | Modify | Level 2 implementation plan. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/tasks.md` | Modify | Level 2 task ledger. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/checklist.md` | Create | Level 2 verification checklist. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/implementation-summary.md` | Modify | Final evidence and commit handoff. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` | Modify | Review node-kind type and `VALID_KINDS.review`. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Accept new graph node kinds in the auto workflow event filter. |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modify | Mirror auto workflow event filter. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-graph.vitest.ts` | Modify | Enable Phase G fixture tests and assert post-G success. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Review graph accepts `BUG_CLASS` nodes. | Phase B `review-depth-graph` fixture upserts `BUG_CLASS` with `insertedNodes: 1` and no validation errors. |
| REQ-002 | Review graph accepts `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` nodes. | Parameterized Phase B fixture upserts all five new node kinds successfully. |
| REQ-003 | YAML event filters preserve new node kinds. | Auto and confirm workflows list all five new kinds in the graph event normalization allow-list. |
| REQ-004 | Existing review relations remain compatible. | No relation allow-list expansion is required for the requested mappings. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Upsert validation remains centralized. | Handler validation continues reading `VALID_KINDS[loopType]`; no duplicate hardcoded kind list is introduced. |
| REQ-006 | Existing coverage-graph tests stay green. | `coverage-graph` vitest filter passes. |
| REQ-007 | Phase B review-depth fixtures stay green. | `review-depth-` vitest filter passes with the Phase G tests enabled. |
| REQ-008 | Level 2 packet is valid. | Strict spec validation passes for this folder. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` are valid review graph node kinds in both type and runtime validation.
- The deep-review auto and confirm workflow filters no longer discard these node kinds.
- Phase B placeholder tests are enabled and pass as post-G contract tests.
- Existing review graph relation vocabulary remains unchanged because it already covers the requested semantic mappings.
- Graphless fallback semantics remain untouched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Graph projection could drift from text/JSON ledger semantics. | Graph evidence could become a competing contract. | Keep this phase to vocabulary projection only; do not change ledger schema or STOP gates. |
| Risk | Workflow filter and runtime allow-list could diverge. | Events accepted by one layer may be dropped by another. | Update auto and confirm YAML mirrors plus the DB allow-list in the same packet. |
| Risk | New relation names could overfit future graph queries. | More surface area without current need. | Reuse `IN_DIMENSION`, `IN_FILE`, and `EVIDENCE_FOR`; add no relations. |
| Dependency | Phase B seeded fixtures. | Proves pre-G failures are now covered. | Un-skip the placeholder fixture tests and adjust the original failure test to success. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Maintain one runtime node-kind allow-list per loop type through `VALID_KINDS`.
- **NFR-M02**: Keep auto and confirm YAML graph event filters semantically identical.

### Compatibility
- **NFR-C01**: Existing review relations remain valid and unchanged.
- **NFR-C02**: Existing coverage-graph tests keep passing.

### Observability
- **NFR-O01**: Validation errors continue reporting the current list of valid node kinds from `VALID_KINDS[loopType]`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Unknown node kind**: Still rejected by `validateNodeKind()` with the dynamically rendered valid-kind list.
- **Graph event without relation/source/target**: Normalized as a node and accepted only when its uppercase kind is in the workflow allow-list.
- **Graph event with relation/source/target**: Still filtered through the unchanged review relation allow-list.

### Error Scenarios
- **Malformed graph event**: Workflow contract still discards malformed or unknown graph events instead of failing the review iteration.
- **Graph unavailable**: This phase does not change graphless fallback behavior; text/JSON ledger evidence remains authoritative.

### Semantic Mapping
- **`BUG_CLASS -> DIMENSION`**: Uses `IN_DIMENSION`.
- **`INVARIANT`, `PRODUCER`, `CONSUMER -> FILE`**: Uses `IN_FILE`.
- **`TEST -> FINDING`**: Uses `EVIDENCE_FOR`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Five active implementation surfaces plus Level 2 packet docs. |
| Risk | 12/25 | Shared review graph validation and workflow filter parity. |
| Research | 10/20 | Existing research synthesis and seeded fixtures were available. |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None. The relation question is resolved: no `IS_INSTANCE_OF` or `TESTS` relation is required for Phase G.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research Synthesis**: See `../001-research-synthesis/research/research.md`
- **Seeded Fixture Harness**: See `../002-seeded-fixture-harness/`
<!-- /ANCHOR:related-docs -->
