---
title: "Implementation Plan: Machine-checkable evidence contract schema in post-dispatch-validate and the agent IO contract [template:level_3/plan.md]"
description: "Implementation plan for the evidence-contract schema module and its advisory wiring into post-dispatch-validate.ts and the agent IO contract doc."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Machine-checkable evidence contract schema in post-dispatch-validate and the agent IO contract

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (deep-loop-runtime) |
| **Framework** | None - plain TS module plus markdown contract doc |
| **Storage** | None - validation operates on in-memory parsed records |
| **Testing** | vitest (`tests/unit/*.vitest.ts`) |

### Overview
Add a standalone `evidence-contract.ts` module that defines the five-field schema and a `validateEvidenceContract` helper, then call that helper inside `post-dispatch-validate.ts` so iteration and agent outputs are checked at the dispatch boundary. Results surface through the existing `PostDispatchAdvisory` warning channel, so absent metadata passes silently and malformed metadata warns without ever introducing a blocking failure. The contract is documented as a new optional `AGENT_IO_EVIDENCE v1` group in `agent-io-contract.md`, consistent with the existing advisory groups.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The five field names and their semantics are fixed from the fable-5 research
- [ ] Phases 003 (measurement) and 008 (provenance) have landed
- [ ] The existing `PostDispatchAdvisory` warning channel is confirmed as the surface to reuse

### Definition of Done
- [ ] All acceptance criteria in spec.md met (REQ-001 through REQ-008)
- [ ] `vitest` suites for `evidence-contract` and `post-dispatch-validate` pass
- [ ] `validate.sh <spec-folder> --strict` passes
- [ ] spec/plan/tasks/checklist synchronized; `agent-io-contract.md` documents the contract
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Schema module plus advisory validator. A single pure module owns the contract; the validator consumes it and emits warnings through the channel that already exists.

### Key Components
- **`evidence-contract.ts`**: Defines the five fields (`claim_class`, `would_confirm`, `gate_delta`, `scope_state`, `child_result_verified`), their allowed values, and `validateEvidenceContract(input)` returning `present` / `absent` / `malformed` plus field-level detail.
- **`post-dispatch-validate.ts`**: Calls `validateEvidenceContract` on iteration/agent records and maps a `malformed` result to one or more `PostDispatchAdvisory` warnings without touching the failure path.
- **`agent-io-contract.md`**: Documents the `AGENT_IO_EVIDENCE v1` optional group so producers know the shape to emit.

### Data Flow
An iteration or agent record arrives at post-dispatch. The validator extracts any evidence metadata and passes it to `validateEvidenceContract`. An `absent` result is a no-op; a `present` result passes; a `malformed` result is converted to advisory warnings appended to the existing `warnings` array. The exchange result stays `ok: true` in every case.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `evidence-contract.ts` (new) | Owns the five-field schema and validation | Create | `grep` shows all five fields; `evidence-contract.vitest.ts` passes. |
| `post-dispatch-validate.ts` | Validates iteration/agent outputs, emits advisories | Update - add a non-blocking evidence check | `post-dispatch-validate.vitest.ts` shows warn-not-fail on malformed, green on absent. |
| `PostDispatchAdvisory` / `warnings` channel | Existing advisory transport | Reuse, not extend | No new entry in `PostDispatchFailureReason`. |
| `agent-io-contract.md` | Documents optional `AGENT_IO_*` groups | Update - add `AGENT_IO_EVIDENCE v1` | Doc grep shows the new group and the absence-never-blocks rule. |

Required inventories:
- Same-class producers: `rg -n 'PostDispatchAdvisory|warnings' .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` to confirm the advisory shape to reuse.
- Consumers of changed symbols: `rg -n 'validateIterationOutputs|validateOrThrow|PostDispatchValidateResult' . --glob '*.ts' --glob '*.md'` to confirm no caller depends on a new failure reason.
- Matrix axes: evidence-metadata state (present / absent / malformed) x field (the five) x type-shape (valid / wrong-type / unknown-enum); enumerate the required rows before implementation.
- Algorithm invariant: a record with no evidence metadata always returns `ok: true` with no evidence warning; malformed metadata never escalates past advisory.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Schema module
- [ ] Create `evidence-contract.ts` with the five fields and their allowed values (touches `evidence-contract.ts`). Verify: `grep` shows all five field names exported.
- [ ] Implement `validateEvidenceContract` returning `present` / `absent` / `malformed` plus field detail (touches `evidence-contract.ts`). Verify: type-check passes.
- [ ] Write `evidence-contract.vitest.ts` covering present / absent / malformed (touches `tests/unit/evidence-contract.vitest.ts`). Verify: `vitest` green.

### Phase 2: Validator wiring
- [ ] Import and call `validateEvidenceContract` inside the iteration/agent validation path (touches `post-dispatch-validate.ts`). Verify: malformed metadata yields a `PostDispatchAdvisory`.
- [ ] Map `malformed` to advisory warnings via the existing `warnings` channel, with no new `PostDispatchFailureReason` (touches `post-dispatch-validate.ts`). Verify: `grep` shows no new failure reason added.
- [ ] Extend `post-dispatch-validate.vitest.ts` with warn-not-fail and absent-stays-green cases (touches `tests/unit/post-dispatch-validate.vitest.ts`). Verify: `vitest` green.

### Phase 3: Documentation and verification
- [ ] Add the `AGENT_IO_EVIDENCE v1` group to `agent-io-contract.md` (touches `agent-io-contract.md`). Verify: doc grep shows the group and the never-blocks rule.
- [ ] Run the full `vitest` suite and `validate.sh <spec-folder> --strict`. Verify: both pass.
- [ ] Confirm the absent-stays-green invariant with a real exchange record (touches none). Verify: regression test asserts `ok: true`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `validateEvidenceContract` across present / absent / malformed and per-field type checks | vitest |
| Integration | `validateIterationOutputs` warns on malformed evidence and stays green when absent | vitest |
| Manual | grep the five field names across `deep-loop-runtime` to confirm they now resolve | rg |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 (behavioral measurement) | Internal | Yellow | Without a baseline the contract cannot ever be promoted past advisory; advisory-only ship still works. |
| Phase 008 (provenance) | Internal | Yellow | `child_result_verified` is weaker if the producing executor can lie about its identity; sequence after 008. |
| `post-dispatch-validate.ts` advisory plumbing | Internal | Green | None - the `PostDispatchAdvisory` channel already exists and is reused. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An evidence advisory misfires on valid records, or any exchange that previously passed now fails.
- **Procedure**: Remove the `validateEvidenceContract` call from `post-dispatch-validate.ts` (the schema module and doc can remain inert). Because the change adds no failure reason and no producer depends on the contract, reverting the single call restores prior behavior; delete `evidence-contract.ts` and the new test file if a clean revert is wanted.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Schema module) ──► Phase 2 (Validator wiring) ──► Phase 3 (Docs + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Schema module | None (within this phase) | Validator wiring |
| Validator wiring | Schema module | Docs + verify |
| Docs + verify | Validator wiring | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Schema module | Med | 2-3 hours |
| Validator wiring | Med | 2-4 hours |
| Docs + verify | Low | 1-2 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data changes - backup not applicable
- [ ] No feature flag needed - advisory-only by design
- [ ] Baseline `vitest` exit code captured before the change

### Rollback Procedure
1. Remove the `validateEvidenceContract` call from `post-dispatch-validate.ts`.
2. Re-run the `post-dispatch-validate` vitest suite to confirm prior behavior returns.
3. Optionally delete `evidence-contract.ts` and `evidence-contract.vitest.ts` for a clean revert.
4. No stakeholder notification needed - the contract is internal and advisory.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - validation is stateless and in-memory.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Phase 1        │────►│   Phase 2        │────►│   Phase 3        │
│  Schema module   │     │ Validator wiring │     │  Docs + verify   │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `evidence-contract.ts` | None | Schema + `validateEvidenceContract` | Validator wiring |
| `post-dispatch-validate.ts` edit | `evidence-contract.ts` | Advisory warnings on malformed evidence | Docs + verify |
| `agent-io-contract.md` edit | Schema module (for value parity) | `AGENT_IO_EVIDENCE v1` doc | None |
| Test suites | Schema + validator | Green present / absent / malformed coverage | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Schema module** - 2-3 hours - CRITICAL
2. **Validator wiring** - 2-4 hours - CRITICAL
3. **Docs + verify** - 1-2 hours - CRITICAL

**Total Critical Path**: 5-9 hours

**Parallel Opportunities**:
- The `agent-io-contract.md` doc edit can be drafted in parallel with the validator wiring once the schema module's allowed values are frozen.
- The two test files can be written alongside their respective production modules.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Schema defined | Five fields exported; `evidence-contract.vitest.ts` green | Phase 1 |
| M2 | Validator wired | Malformed warns, absent stays green, no new failure reason | Phase 2 |
| M3 | Contract documented and verified | `agent-io-contract.md` updated; full `vitest` and `validate.sh --strict` pass | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Advisory validation, not a blocking gate

**Status**: Proposed

**Context**: The evidence contract must force load-bearing claims into a checkable shape without breaking any older valid exchange. The fable-5 research is explicit that behavioral and evidence advisories stay non-blocking until baselines exist.

**Decision**: Validate the evidence schema and emit `PostDispatchAdvisory` warnings only; introduce no new `PostDispatchFailureReason`.

**Consequences**:
- A valid exchange that omits the metadata still passes, satisfying the backward-compatibility acceptance criterion.
- Warnings alone will not force adoption; producers must be retrofitted in a later phase to actually fill the fields. Mitigation: document the contract clearly so adoption is cheap when scheduled.

**Alternatives Rejected**:
- Block on missing or malformed evidence: rejected because it breaks every legacy exchange and contradicts the research's advisory-until-baselines stance.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
