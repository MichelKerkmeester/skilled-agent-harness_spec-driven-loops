---
title: "Research Plan: Retrieval Evaluation and Post-027/002 Angles [template:level_1/plan.md]"
description: "Completed research plan for the 008 retrieval-evaluation phase. The phase researched the measurement angle space opened by shipped 027/002 work and folded the C9 to A8 build spine into Memory implementation children."
trigger_phrases:
  - "028 retrieval evaluation research plan"
  - "008 eval harness research plan"
  - "post 027 002 angles complete"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/008-retrieval-evaluation"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Documented the completed retrieval-evaluation research as a Level 1 phase"
    next_safe_action: "Use implementation-summary.md for fold-forward pointers into 001 Memory"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-008-research-completion-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "008 is research-complete and has no separate code implementation."
      - "Its retrieval-evaluation findings were folded into 001 Memory implementation children."
---
# Research Plan: Retrieval Evaluation and Post-027/002 Angles

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs and Memory MCP evaluation research |
| **Framework** | system-spec-kit Level 1 |
| **Storage** | Spec folder docs under packet 028 |
| **Testing** | `validate.sh <phase> --strict` and recursive root validation |

### Overview
This phase researched the retrieval-evaluation angle space opened by the shipped 027/002 search-intelligence work. The key finding was that the existing eval harness is mostly present, but it needs three new metric lanes and a class-parameterized promotion gate before recall, calibration and cold-tier candidates can be measured safely.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] A1 through A8 research angles documented in `spec.md`
- [x] Novelty-diff requirement against 016 and 028/007 documented
- [x] Research-only boundary confirmed

### Definition of Done
- [x] A1 through A8 answered in `research/research.md`
- [x] C9 to A8 build spine recorded
- [x] Findings folded into 001 Memory implementation children
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only evaluation-roadmap research.

### Key Components
- **Angle set**: A1 through A8 covering eval harness, calibration, A/B, cold tier, semantic substrate, consolidation and promotion methodology.
- **Research report**: 12-iteration convergence record and build spine.
- **Implementation parent**: 001 Memory owns the later evaluation and correctness children.

### Data Flow
The phase read the shipped 027/002 work, the Memory MCP eval harness and the 028/007 roadmap. It reduced the findings into `research/research.md` and synthesis doc 08, then routed the build spine into 001 Memory implementation children.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec.md` | Defines A1 through A8 | Unchanged | Read before authoring completion docs |
| `research/research.md` | Authoritative 008 research output | Unchanged | Shows completion_pct 100 and convergence close |
| `001-speckit-memory/*` | Implementation owner | Referenced only | Phase parent map lists target children |

Required inventories:
- Research corpus: `spec.md`, `research/research.md` and `research/synthesis/08-retrieval-evaluation-findings.md`.
- Consumers of changed symbols: none, because this phase changes no code.
- Matrix axes: angle, metric lane, promotion gate, prerequisite and fold-forward child.
- Algorithm invariant: the eval spine is a plan for later implementation, not a build in this research folder.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the retrieval-evaluation specification
- [x] Read the authoritative research report
- [x] Confirm the A1 through A8 angle space and novelty gates

### Phase 2: Core Implementation
- [x] Research eval harness, calibration, A/B and cold-tier measurement
- [x] Research semantic substrate, reindex-as-consolidation and promotion methodology
- [x] Synthesize the C9 to A8 build spine

### Phase 3: Verification
- [x] Confirm convergence at 12 iterations
- [x] Confirm no separate code implementation exists for this phase
- [x] Route the build spine into 001 Memory implementation children
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Document validation | Level 1 docs for this phase | `validate.sh --strict` |
| Research verification | Completion and convergence state | `research/research.md` |
| Recursive validation | Parent packet and children | `validate.sh 028-memory-search-intelligence --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shipped 027/002 search-intelligence work | Internal implementation record | Complete | Measurement angle space would not exist |
| 028/007 reconciliation | Internal research | Complete | Reindex and measurement preconditions would be unclear |
| 001 Memory implementation parent | Internal spec folder | Available | Eval spine would have no implementation owner |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: If these completion docs imply eval code was built in 008 or misroute the C9 to A8 spine.
- **Procedure**: Patch only this phase's Level 1 docs, then rerun per-phase and recursive strict validation.
<!-- /ANCHOR:rollback -->

