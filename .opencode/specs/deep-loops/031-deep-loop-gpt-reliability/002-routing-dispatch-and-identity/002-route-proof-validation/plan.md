---
title: "Implementation Plan: Route-Proof Validation"
description: "Add route-proof validation fields to deep-loop iteration records and validators so schema-valid wrong-mode artifacts fail. Resolve the unrecovered prior-research citation boundary and verify the phase with targeted runtime tests plus strict spec validation."
trigger_phrases:
  - "implementation"
  - "plan"
  - "route-proof validation"
  - "deep dispatch validator"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/002-route-proof-validation"
    last_updated_at: "2026-06-30T19:40:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Phase 001 strict validation passed"
    next_safe_action: "Proceed to phase 002-agent-dispatch-hardening"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
      - ".opencode/commands/deep/assets/deep_context_auto.yaml"
      - ".opencode/commands/deep/assets/deep_ai-council_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-001-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Prior research citations are unrecovered and accepted as explicit axioms for this phase."
---
# Implementation Plan: Route-Proof Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, YAML, Markdown |
| **Framework** | OpenCode deep-loop runtime and workflow assets |
| **Storage** | JSONL state logs and per-iteration delta files |
| **Testing** | Vitest, TypeScript typecheck, spec validation |

### Overview
This phase adds explicit route-proof fields to deep-loop iteration records and shared post-dispatch validation. The minimal design is to validate `mode`, `target_agent`, `agent_definition_loaded`, and `resolved_route` against a per-mode expectation, then reject either the state-log record or the delta record if it disagrees.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Success criteria measurable: wrong-mode schema-valid artifact must be rejected.
- [x] Dependencies identified: shared validator, four autonomous workflow YAMLs, research/review prompt packs, council round writer.

### Definition of Done
- [x] Route-proof fields enforced for state-log and delta iteration records.
- [x] Wrong-mode tests pass against the shared validator.
- [x] Citation and prior-research boundary documented.
- [x] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared validator with mode-specific expectations supplied by workflow contracts.

### Key Components
- **`validateIterationOutputs`**: Enforces schema, canonical iteration type, delta presence, and route-proof fields.
- **Deep workflow YAMLs**: Declare the expected route proof for research, review, context, and council.
- **Prompt packs / host writers**: Ensure generated records include the fields that the validator checks.

### Data Flow
The workflow resolves a target mode and agent before dispatch. The dispatched leaf or host writer emits the canonical state-log record and delta record with the resolved route fields. The post-dispatch validator reads both records and fails closed if either record is missing route proof or points at the wrong mode/agent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Shared post-dispatch validator | Add `routeProof` expectations and mismatch failures | `npm test -- post-dispatch-validate.vitest.ts`; `npm run typecheck` |
| `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts` | Validator unit coverage | Add wrong state-log mode and wrong delta target tests | 30 tests passed |
| `.opencode/commands/deep/assets/deep_*_auto.yaml` | Workflow validation contracts | Add route-proof field requirements for all four modes | Strict spec validation plus targeted test coverage |
| Research/review prompt packs | Leaf output contract | Require route-proof fields in emitted records | Existing tests still pass; field contract visible in templates |
| Council topic orchestrator | Council round state writer | Emit route-proof fields on `round_completed` records | Typecheck passes |

Required inventories:
- Same-class producers checked by targeted grep for route-proof fields across the four deep auto YAMLs.
- Consumers of changed validator input are direct tests and workflow contracts; no external API consumers found in the runtime grep.
- Matrix axes: state-log record vs delta record, missing field vs mismatched field, research/review/context/council expected route.
- Algorithm invariant: a record can only pass route-proof validation when both persisted records name the requested mode and target agent.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Identify validator and workflow surfaces.
- [x] Confirm prior research is missing from disk and must be accepted as an axiom boundary.

### Phase 2: Core Implementation
- [x] Add route-proof enforcement to the shared validator.
- [x] Add wrong-mode validator tests.
- [x] Update all four autonomous deep workflow contracts.
- [x] Update research/review prompt packs and council round emission.

### Phase 3: Verification
- [x] Run targeted validator tests.
- [x] Run TypeScript typecheck.
- [x] Run comment hygiene and alignment drift checks.
- [x] Run strict spec validation after metadata refresh.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | State-log and delta route-proof mismatch rejection | Vitest |
| Typecheck | Runtime TypeScript API compatibility | `npm run typecheck` |
| Static | Comment hygiene and OpenCode alignment drift | `check-comment-hygiene.sh`, `verify_alignment_drift.py` |
| Spec | Phase documentation and metadata integrity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Deep-loop runtime validator | Internal | Green | Wrong-mode artifacts would still pass schema-only validation |
| Four autonomous workflow YAMLs | Internal | Green | Mode contracts would drift by command |
| Missing prior research citations | Evidence | Accepted with caveat | Claims remain operator-asserted until recovered |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validator rejects known-good native deep-loop records after fields are emitted correctly.
- **Procedure**: Revert the `routeProof` validator input and workflow field requirements together, then rerun the targeted validator tests and strict spec validation. Do not roll back only the YAML or only the TypeScript validator because that would recreate a contract mismatch.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Prior evidence record ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Research synthesis | Core |
| Prior evidence record | Missing-citation inspection | Core |
| Core | Setup, prior evidence record | Verify |
| Verify | Core | Phase 002 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Complete |
| Core Implementation | Medium | Complete |
| Verification | Medium | In progress |
| **Total** | | **Phase-local** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations required.
- [x] No secrets or external service changes introduced.
- [x] Tests identify the specific route-proof failure path.

### Rollback Procedure
1. Revert the route-proof TypeScript validator changes.
2. Revert the route-proof workflow and prompt-pack field requirements.
3. Rerun `npm test -- post-dispatch-validate.vitest.ts` and `npm run typecheck`.
4. Rerun phase strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Existing JSONL records are append-only artifacts; no persisted production data migration was performed.
<!-- /ANCHOR:enhanced-rollback -->

---
