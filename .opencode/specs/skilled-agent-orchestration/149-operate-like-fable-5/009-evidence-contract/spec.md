---
title: "Feature Specification: Machine-checkable evidence contract schema in post-dispatch-validate and the agent IO contract [template:level_3/spec.md]"
description: "Defines a machine-checkable five-field evidence contract validated non-blockingly at the dispatch boundary so load-bearing claims carry their proof in a fixed, backward-compatible shape."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/009-evidence-contract"
    last_updated_at: "2026-06-15T14:06:40Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-evidence-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Machine-checkable evidence contract schema in post-dispatch-validate and the agent IO contract

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

<!-- WHEN TO USE THIS TEMPLATE:
Level 3 (+Arch) is appropriate when:
- Changes affect 500+ lines of code
- Architecture decisions need formal documentation (ADRs)
- Executive summary needed for stakeholders
- Risk matrix required
- 4-8 user stories
- Multiple teams or cross-functional work

DO NOT use Level 3 if:
- Simple feature (use Level 1)
- Only verification needed (use Level 2)
- Governance approval workflow required (use Level 3+)
- Compliance checkpoints needed (use Level 3+)
- Multi-agent parallel execution coordination (use Level 3+)
-->

---

## EXECUTIVE SUMMARY

This phase defines a machine-checkable evidence contract: a fixed five-field schema (`claim_class`, `would_confirm`, `gate_delta`, `scope_state`, `child_result_verified`) that every load-bearing claim can carry at the dispatch boundary, validated non-blockingly inside `post-dispatch-validate.ts`. It is the structural backstop for the doctrine that a finding is a hypothesis until verified: today a grep for these field names across `deep-loop-runtime` and `system-spec-kit/references` returns zero hits, so the proof a claim should carry has no fixed shape to land in. The contract is additive and backward-compatible, so a valid agent exchange that omits the optional metadata still passes.

**Key Decisions**: ship the five fields as a standalone schema module reused by the validator and the agent IO contract doc; keep validation advisory (warn, never block) so missing or malformed metadata never fails an otherwise-valid exchange.

**Critical Dependencies**: phase 003 (behavioral measurement) and phase 008 (provenance) land first; this phase is the largest, most structural item in the packet and is sequenced last.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Load-bearing claims at the dispatch boundary carry their proof in free prose, so nothing forces a claim to name its class, what would confirm it, the gate delta it produced, the scope it touched, or whether a child agent's result was verified. The fable-5 research ranks this as dedicated packet P1 and confirms it is still open: a grep for the five named fields (`claim_class`, `would_confirm`, `gate_delta`, `scope_state`, `child_result_verified`) across `deep-loop-runtime` and `system-spec-kit/references` returns zero hits. The attachment point already exists in `post-dispatch-validate.ts` and `agent-io-contract.md`; only the schema is missing.

### Purpose
Define and validate a fixed, machine-checkable evidence schema at post-dispatch so every load-bearing claim can carry its proof in a checkable shape, while keeping the metadata optional and backward-compatible so a valid exchange that omits it still passes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A standalone evidence-contract schema module defining the five fields (`claim_class`, `would_confirm`, `gate_delta`, `scope_state`, `child_result_verified`), their allowed values, and a `validateEvidenceContract` helper that classifies an input as present, absent, or malformed.
- Wiring that helper into `post-dispatch-validate.ts` so iteration and agent outputs are checked against the schema and produce advisory warnings, never failures.
- Documenting the contract as a new optional group in `agent-io-contract.md`, consistent with the existing `AGENT_IO_*` advisory groups.
- Unit tests covering the three states the acceptance criteria require: present-and-valid, absent, and malformed.

### Out of Scope
- Promoting the contract from advisory to blocking - the research keeps behavioral and evidence advisories non-blocking until baselines exist (phase 003 measurement is the prerequisite for any future promotion).
- Editing the three agent-mirror directories or agent prompts to emit the metadata - this phase defines and validates the contract, it does not retrofit producers.
- Any change to executor provenance or behavioral measurement - those are phases 008 and 003 respectively, and this phase consumes their landing rather than re-implementing them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts` | Create | New schema module: the five fields, allowed values, and `validateEvidenceContract` returning present / absent / malformed plus field-level detail. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Modify | Call the evidence-contract validator on iteration/agent outputs and surface results as `PostDispatchAdvisory` warnings; never add a new blocking failure reason. |
| `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Modify | Add an `AGENT_IO_EVIDENCE v1` optional group documenting the five fields and the never-blocks-on-absence rule. |
| `.opencode/skills/deep-loop-runtime/tests/unit/evidence-contract.vitest.ts` | Create | Unit tests for present / absent / malformed evidence metadata against the schema module. |
| `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts` | Modify | Add cases proving the validator warns (not fails) on malformed metadata and stays green when the metadata is absent. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The schema module defines the five fields and their allowed values. | `grep -n "claim_class\|would_confirm\|gate_delta\|scope_state\|child_result_verified" evidence-contract.ts` returns all five; `validateEvidenceContract` exists and is exported. |
| REQ-002 | `post-dispatch-validate.ts` validates the evidence schema on iteration/agent outputs at post-dispatch. | The validator imports and calls `validateEvidenceContract`; a malformed payload yields a `PostDispatchAdvisory` warning. |
| REQ-003 | The change is additive and backward-compatible. | An iteration/agent record with no evidence metadata returns `ok: true` with no new failure reason; no entry is added to `PostDispatchFailureReason`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `agent-io-contract.md` documents the contract as an optional advisory group. | The doc contains an `AGENT_IO_EVIDENCE v1` block listing the five fields and the absence-never-blocks rule, consistent with the other `AGENT_IO_*` groups. |
| REQ-005 | Tests cover the present, absent, and malformed states. | `evidence-contract.vitest.ts` has at least one case per state; all three pass under `vitest`. |
| REQ-006 | Malformed metadata warns rather than fails. | A `post-dispatch-validate.vitest.ts` case feeds malformed evidence metadata and asserts `result.ok === true` with a populated `warnings` array. |
| REQ-007 | No code comment in the new module embeds spec paths or artifact ids. | A read of `evidence-contract.ts` shows comments stating durable WHY only (per comment-hygiene HARD rule). |
| REQ-008 | The schema reuses the existing advisory plumbing. | Evidence warnings flow through the existing `PostDispatchAdvisory` type and `warnings` channel, not a parallel mechanism. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A grep for the five field names across `deep-loop-runtime` no longer returns zero hits; they are defined in `evidence-contract.ts` and referenced by `post-dispatch-validate.ts`.
- **SC-002**: A valid agent exchange that omits the evidence metadata still passes post-dispatch validation with no new failure reason - backward compatibility is proven by a green test.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 behavioral measurement | No baseline exists to ever promote evidence advisories to blocking | Ship the contract advisory-only this phase; defer any promotion until 003 lands a baseline. |
| Dependency | Phase 008 provenance | Evidence about a child result is weaker if the executor that produced it can lie about its identity | Sequence this phase after 008 so `child_result_verified` rides on honest provenance. |
| Risk | A new blocking failure slips into `PostDispatchFailureReason` | An older valid exchange starts failing | REQ-003 forbids new failure reasons; a regression test asserts absence-stays-green. |
| Risk | Schema scope creep beyond the five fields | Over-engineering a metadata layer no producer fills yet | Freeze the field set to the five named in the research; producers are out of scope. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Evidence validation is a pure in-memory check on already-parsed records and adds no measurable latency to the post-dispatch path; it runs synchronously alongside the existing advisory checks.

### Security
- **NFR-S01**: The validator treats evidence fields as untrusted data, validates allowed values, and never executes or interprets field contents as instructions.

### Reliability
- **NFR-R01**: A malformed or partial evidence payload degrades to an advisory warning and never throws or short-circuits the exchange.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a record with no evidence metadata is treated as absent and passes with no warning.
- Partial input: a record with some but not all five fields is treated as malformed and warns, naming the missing field path.

### Error Scenarios
- Wrong-type field: a `child_result_verified` that is a string instead of a boolean warns via `PostDispatchAdvisory` and does not throw.
- Unknown enum value: a `claim_class` outside the allowed set warns with the offending value, and the exchange still passes.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 5 (2 create, 3 edit), new schema module plus a contract surface in two skills. |
| Risk | 14/25 | Auth: N, API: N (internal schema), Breaking: N - additive and backward-compatible by contract. |
| Research | 14/20 | Field semantics fixed by the fable-5 research; investigation is mostly the existing validator shape. |
| Multi-Agent | 6/15 | Single workstream; the metadata producers are deliberately out of scope. |
| Coordination | 12/15 | Sequenced last; depends on phases 003 and 008 landing first. |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A new blocking failure reason is introduced, breaking older valid exchanges | H | L | REQ-003 forbids it; a regression test asserts absence-stays-green. |
| R-002 | Field set drifts beyond the five named fields | M | M | Freeze the schema to the research-named five; expansions require a follow-on packet. |
| R-003 | The doc and the code disagree on allowed values | M | M | The schema module is the single source of truth; the doc cites it rather than restating values independently. |

---

## 11. USER STORIES

### US-001: Validate a claim's evidence shape at post-dispatch (Priority: P0)

**As a** deep-loop orchestrator, **I want** every load-bearing claim's evidence checked against a fixed schema at the dispatch boundary, **so that** a claim either carries its proof in a known shape or is flagged for the missing piece.

**Acceptance Criteria**:
1. **Given** an iteration output that includes well-formed evidence metadata, **When** post-dispatch validation runs, **Then** the result is `ok: true` with no evidence warning.
2. **Given** an iteration output with a malformed evidence field, **When** post-dispatch validation runs, **Then** the result is `ok: true` with a `PostDispatchAdvisory` naming the offending field path.
3. **Given** an iteration output with no evidence metadata, **When** post-dispatch validation runs, **Then** the result is `ok: true` with no evidence warning (absence never blocks).

---

### US-002: Discover the contract from the agent IO documentation (Priority: P1)

**As an** agent author wiring a new dispatch, **I want** the evidence contract documented alongside the other optional `AGENT_IO_*` groups, **so that** I can emit the five fields in the expected shape without reading the validator source.

**Acceptance Criteria**:
1. **Given** a developer reading `agent-io-contract.md`, **When** they look for the evidence contract, **Then** they find an `AGENT_IO_EVIDENCE v1` group listing all five fields and their allowed values.
2. **Given** the documented group, **When** a developer omits it entirely, **Then** the doc states the omission is valid and never blocks the exchange.
3. **Given** the schema module and the doc, **When** their allowed values are compared, **Then** the doc defers to the module as the source of truth rather than independently redefining values.

---

## 12. OPEN QUESTIONS

- Should the evidence advisories ever be promoted from advisory to blocking, and if so, only after phase 003 establishes a baseline? Recommendation: keep advisory this phase.
- Should `claim_class` enumerate a fixed value set now, or accept any string and only validate presence? Recommendation: enumerate the classes the research implies and warn on unknown values, without blocking.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
