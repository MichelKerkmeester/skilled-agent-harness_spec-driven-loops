---
title: "Feature Specification: Route-Proof Validation & Citation Corrections"
description: "Add route-proof validator fields (close the FIX-5 false-negative where schema-valid-but-wrong-mode artifacts pass), recover/confirm the prior-research evidence base, and fix the broken citation/slug drift. Lands first in the dependency chain."
trigger_phrases:
  - "route-proof validation"
  - "fix-5 false negative"
  - "deep dispatch validator"
  - "prior research evidence base"
importance_tier: "critical"
contextType: "implementation"
predecessor_research: "../001-deep-agent-router-and-orchestration/research/research.md"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/002-route-proof-validation"
    last_updated_at: "2026-06-30T19:50:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Phase 001 validated successfully"
    next_safe_action: "Proceed to phase 003-agent-dispatch-hardening"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-001-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Prior research evidence accepted as operator-asserted axioms in decision-record.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Route-Proof Validation & Citation Corrections

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-30 |
| **Parent Packet** | `031-deep-loop-gpt-reliability` |
| **Predecessor** | `../001-deep-agent-router-and-orchestration/research/research.md` (v2) |
| **Successor** | `../003-agent-dispatch-hardening` |
| **Handoff Criteria** | Route-proof validator fields reject schema-valid-but-wrong-mode artifacts; prior-research evidence base resolved; citation drift fixed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The research (`../../research/research.md` §5) found a **critical false-negative (F27)**: a GPT mis-dispatch can PASS every existing FIX-5 validator signal if it writes schema-correct artifacts in expected paths while doing semantically wrong-mode work. The validators at `deep_research_auto.yaml:940-968` check existence/schema/provenance — NOT that `@deep-research` was actually loaded, the route obeyed, or the content matches the requested mode. Without route-proof fields, a post-edit GPT "pass" is necessary but not sufficient to disprove mis-dispatch.

Additionally, the cited prior-research evidence base (`030/010-gpt-deep-agent-routing`, `../001-gpt-deep-agent-routing`, `../002-gpt-routing-fixes`) does not exist on disk (research §0 integrity caveat), and three citation/slug drifts need correction (C1-C3).

### Purpose

1. Close the F27 false-negative by adding route-proof fields to the deep-loop validators so a "pass" proves both artifact shape AND target-mode compliance.
2. Resolve the prior-research evidence base (recover or formally accept as operator-asserted).
3. Fix citation/slug drift so the packet lineage is accurate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R1 — Route-proof validator fields.** Assert `mode`, `target_agent`, `agent_definition_loaded`, and a prompt-echoed `Resolved route` field in iteration + delta records across all 4 deep modes (research/review/context/council). Reject records where these mismatch the requested mode.
- **R10 — Prior-research evidence base.** Locate the cited prior research (`030/010-gpt-deep-agent-routing/research/research.md`, `../001-gpt-deep-agent-routing`) in another branch/location, OR formally accept the mis-route taxonomy (modes A/B/C) + FIX-ranking as operator-asserted axioms with a decision-record.
- **C1 — Fix `ai-council.md mode` claim.** `research-prompt.md` says `mode: primary`; the file says `mode: all`. Correct the prompt.
- **C2 — Fix packet-slug drift.** `graph-metadata.json`/`description.json`/`spec.md` used `003-`; actual folder is `001-`. (Parent 001 already corrected; verify no residual.)
- **C3 — Fix `spec.md predecessor_research` path.** Points at this packet's own non-existent sibling; fix or remove.

### Out of Scope

- Agent-layer prevention (`deep.md`, orchestrate field) — phase 002.
- Pre-route prompt headers — phase 003.
- GPT smoke testing — phase 004.
- Host-runtime hard identity / FIX-5 — phase 005 (parked).

### Findings Covered

F23 (iteration_file signals), F24 (jsonl signals), F25 (delta signals), F26 (executor signals), F27 (false-negative — the core driver).

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_research_auto.yaml:940-968` | Modify | Add route-proof field assertions to `post_dispatch_validate` |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Modify | Mirror route-proof fields in review validator |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Modify | Mirror in context validator |
| `.opencode/commands/deep/assets/deep_ai-council_auto.yaml` | Modify | Mirror in council validator |
| `research-prompt.md` (parent) | Modify | C1: fix ai-council mode claim |
| `decision-record.md` (this phase) | Create | R10: prior-research axiom-acceptance OR recovery record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Route-proof fields in iteration/delta records | Every deep mode's canonical `type:"iteration"` record carries `mode`, `target_agent`, `agent_definition_loaded`, and echoed `Resolved route`; the validator rejects records missing/mismatching these. |
| REQ-002 | False-negative closed | A constructed schema-valid-but-wrong-mode artifact is REJECTED by the validator (manual test). |
| REQ-003 | Prior-research evidence base resolved | Either the prior research is located and cited correctly, OR a decision-record formally accepts the mis-route taxonomy as operator-asserted axioms with the residual risk documented. |
| REQ-004 | Citation/slug drift fixed | C1 (ai-council mode), C2 (slug — verify clean), C3 (predecessor_research path) all corrected. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A wrong-mode artifact with correct schema is rejected by route-proof validation.
- **SC-002**: All 4 deep modes enforce the same route-proof fields.
- **SC-003**: Prior-research lineage is either evidenced or formally accepted-as-axiom with documented residual risk.
- **SC-004**: `validate.sh --strict` passes on this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Route-proof fields break native/Claude baseline | Correct dispatches rejected | Ensure the fields are populated by the workflow (not just the leaf) so native dispatches carry them automatically. |
| Risk | Prior research unrecoverable | Axiom chain stays unvalidated | Decision-record documents residual risk; KQ8 FIX-5 trigger is observable regardless. |
| Dependency | research/research.md §5 (F27) | Evidence base | Complete. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Validation must fail closed when route-proof fields are missing or mismatched.
- **NFR-R02**: Existing correct iteration records must continue to pass after route-proof fields are present.

### Maintainability
- **NFR-M01**: The expected route must be declared in the workflow contract, not inferred from free-form content.
- **NFR-M02**: Route-proof failures must use explicit failure reasons for diagnostics.

### Performance
- **NFR-P01**: Route-proof checks must be constant-time field comparisons on already-parsed records.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing route field: validator returns `route_proof_missing`.
- Wrong mode with valid schema: validator returns `route_proof_mismatch`.
- Wrong delta route with correct state log: validator returns `route_proof_mismatch`.

### Error Scenarios
- Prior research remains missing: decision-record axiom boundary is used.
- Council state shape differs from iteration/delta: route-proof fields are enforced on council round records instead.

### State Transitions
- Phase 001 must pass before phase 002 begins because downstream verification depends on route-proof validator trust.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Shared validator plus four workflow contracts |
| Risk | 18/25 | Validation behavior changes can reject deep-loop iterations |
| Research | 12/20 | Builds on completed phase-parent research with missing prior-research caveat |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None for phase 001. Future phases decide whether FIX-5 host hard identity is required after GPT smoke testing.
<!-- /ANCHOR:questions -->
