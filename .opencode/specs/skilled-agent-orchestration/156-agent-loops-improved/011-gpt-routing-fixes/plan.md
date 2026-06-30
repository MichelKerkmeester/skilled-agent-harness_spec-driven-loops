---
title: "Implementation Plan: GPT Routing Fixes"
description: "Validator-first implementation plan for the phase 010 GPT deep-agent routing findings. The first patch hardens shared research/review post-dispatch validation and explicitly defers broader runtime identity work."
trigger_phrases:
  - "gpt routing fixes plan"
  - "post dispatch status enum"
  - "deep-loop validator hardening plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/011-gpt-routing-fixes"
    last_updated_at: "2026-06-30T10:05:30Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Planned validator-first implementation"
    next_safe_action: "Start with tests for invalid/valid status behavior"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-gpt-routing-fixes-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Narrative file hash linkage scope"
    answered_questions:
      - "First implementation should cover deep-research and deep-review only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: GPT Routing Fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node.js |
| **Framework** | OpenCode deep-loop runtime and YAML command assets |
| **Storage** | Append-only JSONL state logs and markdown iteration artifacts |
| **Testing** | Vitest unit/integration tests |

### Overview

Implement the smallest repo-resident hardening from phase 010: enforce a canonical iteration-status enum in `validateIterationOutputs` for deep-research and deep-review. The patch should be test-first, keep current artifact checks intact, and avoid broad loop refactors or host-runtime identity work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. Evidence: `spec.md` §2-4 and `../010-gpt-deep-agent-routing/research/research.md` §8-13.
- [x] Success criteria measurable. Evidence: `spec.md` §5.
- [x] Dependencies identified. Evidence: `spec.md` §6 and this plan §6.

### Definition of Done
- [ ] Invalid statuses fail validation with a named diagnostic.
- [ ] All six canonical research/review statuses pass with valid artifacts.
- [ ] Existing validator checks still pass.
- [ ] Relevant unit/integration tests pass.
- [ ] Spec, plan, tasks, checklist, and implementation summary are synchronized.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surgical validator hardening in the shared deep-loop runtime.

### Key Components
- **`validateIterationOutputs`**: Reads the latest appended JSONL record, validates canonical file/delta artifacts, and returns failure reasons.
- **Allowed-status contract**: Shared research/review enum for iteration status values.
- **Command YAML failure documentation**: Operator-facing list of post-dispatch validator failure reasons.
- **Vitest coverage**: Unit and integration tests pin valid and invalid status behavior.

### Data Flow

Deep-research/deep-review LEAF agent writes `iteration-NNN.md`, appends a JSONL iteration record, and writes `deltas/iter-NNN.jsonl`. The parent command calls `validateIterationOutputs`; the new status check rejects malformed state before reducer/dashboard/synthesis can accept it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `post-dispatch-validate.ts` | Shared research/review post-dispatch validator | Add allowed-status enforcement and diagnostic | Unit tests for valid/invalid statuses |
| `post-dispatch-validate.vitest.ts` | Primary validator regression tests | Add new cases and update stale `continue` fixtures | `vitest` targeted unit run |
| `review-depth-validator.vitest.ts` | Integration fixture that may use stale status | Update if it flows through shared validator | targeted integration run |
| `deep_research_auto.yaml` | Lists validator failure reasons | Add `jsonl_invalid_status` reference if diagnostic is surfaced | grep/read validation |
| `deep_review_auto.yaml` | Lists validator failure reasons for review | Add same reference if diagnostic is surfaced | grep/read validation |
| `deep_context_auto.yaml` | Host-written context loop status semantics | No first-patch change | Document deferral |
| `deep_ai-council_auto.yaml` | Council session/topic artifact semantics | No first-patch change | Document deferral |

Required inventories:
- Same-class producers: search status fixtures and post-dispatch validator callers.
- Consumers of changed symbols: search `PostDispatchFailureReason`, `validateIterationOutputs`, and failure-reason strings.
- Matrix axes: `status` missing vs non-string vs invalid string vs six valid strings; file present/empty; delta valid/invalid.
- Algorithm invariant: a JSONL iteration record is accepted only when canonical artifacts exist and status belongs to the loop's allowed vocabulary.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Test Inventory
- [ ] Locate every `status: "continue"` and other non-canonical research/review fixture.
- [ ] Add or update tests to express the intended allowed-status contract.
- [ ] Confirm context/council status values are outside first-patch scope.

### Phase 2: Runtime Validator Patch
- [ ] Add canonical status set and invalid-status failure reason.
- [ ] Enforce status membership after missing-field checks and before delta validation.
- [ ] Keep existing missing-file, empty-file, wrong-type, missing-field, executor, and delta diagnostics intact.

### Phase 3: YAML/Docs Alignment
- [ ] Update research/review YAML failure-reason references if the new diagnostic is operator-visible.
- [ ] Update implementation summary with exact files changed and test evidence.
- [ ] Leave context/council deferrals explicit.

### Phase 4: Verification
- [ ] Run targeted validator unit/integration tests.
- [ ] Run broader relevant test command if available.
- [ ] Run `validate.sh` for this phase and impacted research phase if docs changed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `validateIterationOutputs` valid/invalid statuses and existing failure reasons | Vitest |
| Integration | Review-depth validator fixture if status flows through shared validator | Vitest |
| Manual | Inspect YAML failure-reason lists and phase docs | Read/Grep/validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 010 synthesis | Internal research | Green | Scope would lose evidence; already complete. |
| Vitest runtime | Internal tooling | Green | If unavailable, use existing package test command discovery before claiming complete. |
| Deep-loop runtime validator | Internal code | Green | Primary implementation surface. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validator starts rejecting valid research/review iterations or breaks unrelated loop tests.
- **Procedure**: Revert the validator and test changes from this phase; docs remain as plan artifacts unless implementation is abandoned.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Test Inventory) -> Phase 2 (Runtime Patch) -> Phase 3 (YAML/Docs) -> Phase 4 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Test Inventory | None | Runtime Patch |
| Runtime Patch | Test Inventory | YAML/Docs, Verification |
| YAML/Docs | Runtime Patch | Verification |
| Verification | Runtime Patch, YAML/Docs | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Test Inventory | Low | 30-60 minutes |
| Runtime Patch | Medium | 1-2 hours |
| YAML/Docs | Low | 30 minutes |
| Verification | Medium | 1 hour |
| **Total** | | **3-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline targeted validator tests before patch.
- [ ] Record failing fixture count if current tests fail before patch.
- [ ] Keep diff limited to validator/tests/YAML/docs.

### Rollback Procedure
1. Revert validator/test/YAML changes from this phase.
2. Re-run the targeted validator tests.
3. Re-run spec validation.
4. Document rollback reason in implementation summary.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
