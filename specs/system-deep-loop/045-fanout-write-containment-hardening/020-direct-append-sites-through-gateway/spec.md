---
title: "Feature Specification: Phase 1: direct-append-sites-through-gateway"
description: "Every remaining direct state-log append in the four deep-loop command YAMLs goes through the append gateway with a canonical ledger stem, the append-site exemptions are retired, and a projection refresh can no longer drop a row."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: direct-append-sites-through-gateway

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-forced-depth-empty-records |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the Route every remaining direct state-log append through the gateway so a projection refresh cannot drop it specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The projection store appends only when the current state log is a durable prefix of the folded projection and otherwise replaces the file, so any row a YAML appended outside the ledger was dropped on the next gateway write. The review auto YAML still appended its migration marker, recovery baseline, iteration-error and claim-adjudication records directly, the research YAMLs appended their run-now checks and synthesis records directly, and the checker carried exemptions for all of them.

### Purpose
No command YAML writes a state log except through the gateway, and every event those sites recorded survives the next refresh.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Twelve canonical ledger stems, six per mode, with closed payload rules and two new field kinds for file-name lists and nullable counts
- Every direct site in the four YAMLs migrated to the staged gateway call pattern
- Reducer routing updated so the new stems change no projection semantics
- Exemptions removed from the checker declarations; survival tests plus a negative control; both contracts regenerated

### Out of Scope
- `append_jsonl` directives - workflow directives, not direct appends; routing them is the command runtime's contract
- The research YAML's `run`-numbered error record - checked with the migration

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep-review-auto.yaml, deep-review-confirm.yaml, deep-research-auto.yaml, deep-research-confirm.yaml` | Modify | Direct appends replaced by staged gateway calls; exemptions removed |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema, lib/deep-research-ledger-schema` | Modify | Six stems per mode, two new field kinds |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-review-reducers, lib/deep-research-reducers` | Modify | Routing records and exhaustive switches for the new stems |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md, deep-research.contract.md` | Regenerate | Digest the edited YAMLs |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/append-mode-event-cli.vitest.ts, check-protocol-append-sites.vitest.ts, both ledger-schema tests, fanout-merge.vitest.ts` | Modify | Survival tests, negative control, zero-exemption assertions, schema fixtures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No command YAML invokes the direct state-record appender or a shell append on a state log; the append-site checker reports zero violations and zero exemptions across all ten assets |
| REQ-002 | Each event those sites recorded reaches the state log through the gateway under a canonical stem and survives a subsequent gateway append |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A row written directly to the projection is shown to be dropped by the next gateway append, as the negative control |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The checker reports zero exemptions and the survival tests pass, while the negative control shows the old behaviour
- **SC-002**: Contract drift tests and the deep-loop suite exit zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A review migration record fails the schema's identifier pattern | Closed | Found end to end: the legacy artifact name with a leading dot was rejected; the artifact fields are declared as file-name JSON, and the production literal is pinned in the survival test |
| Risk | Reducer projections change for the new stems | Low | Routing and switches added without semantic change; ledger-schema and reducer tests green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One gateway call per record, staged through a temp file

### Security
- **NFR-S01**: Every state-log write is authorized by the gateway against the mode's authority record

### Reliability
- **NFR-R01**: A gateway refusal halts the site with exit 2 and never falls back to a direct write
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Legacy artifact names with a leading dot: accepted as file-name JSON
- Run-now and pause sentinels: run-now migrated; pause rows were workflow directives already

### Error Scenarios
- Gateway refusal: the site halts and re-exits the node status

### State Transitions
- Not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four YAMLs, four schema and reducer packages, five test files, two contracts |
| Risk | 12/25 | Every state-log write path of two modes |
| Research | 5/20 | A schema rejection only end-to-end execution revealed |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


