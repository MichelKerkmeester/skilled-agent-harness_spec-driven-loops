---
title: "Research Plan: External Memory Systems Search-Intelligence Mining [template:level_1/plan.md]"
description: "Completed research plan for mining Mem0, Graphiti, Letta and Cognee. The phase closed at saturation and folded its findings into Memory and Deep Loop implementation children."
trigger_phrases:
  - "028 memory systems research plan"
  - "mem0 graphiti letta cognee research plan"
  - "007 external memory systems complete"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-memory-systems"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Documented the completed external memory systems research as a Level 1 phase"
    next_safe_action: "Use implementation-summary.md for fold-forward pointers into 001 Memory and 004 Deep Loop"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-007-research-completion-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "007 is research-complete and has no separate code implementation."
      - "Its external memory-system findings were folded into 001 Memory and 004 Deep Loop implementation children."
---
# Research Plan: External Memory Systems Search-Intelligence Mining

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs, external reference repos and deep-research artifacts |
| **Framework** | system-spec-kit Level 1 |
| **Storage** | Spec folder docs under packet 028 |
| **Testing** | `validate.sh <phase> --strict` and recursive root validation |

### Overview
This phase mined Mem0, Graphiti, Letta and Cognee for Memory MCP, Advisor and Deep Loop improvements. It closed at 22 of 40 planned iterations because discovery saturated, then wrote the synthesis view that became the input for later implementation child planning.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] External systems and mining scope documented in `spec.md`
- [x] Novelty-diff required against aionforge, galadriel, OpenLTM and memclaw
- [x] Research-only boundary confirmed

### Definition of Done
- [x] Mem0, Graphiti, Letta and Cognee covered in `research/research.md`
- [x] Saturation point recorded honestly
- [x] Candidate families folded into implementation child phases
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only external-system mining with novelty diff.

### Key Components
- **External systems**: Mem0, Graphiti, Letta and Cognee.
- **Research report**: Candidate ledger, adversarial corrections and saturation record.
- **Implementation parents**: Mainly 001 Memory, with a Deep Loop transfer for iterative research continuity.

### Data Flow
The phase read external memory-system code, mapped patterns to internal Memory MCP and workflow seams, filtered out already-built or no-transfer items and wrote the consolidated findings into `research/research.md` and synthesis doc 06.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec.md` | Defines the external-system mining | Unchanged | Read before authoring completion docs |
| `research/research.md` | Authoritative 007 research output | Unchanged | Shows completion_pct 100 and saturation close |
| `001-speckit-memory/*` | Primary implementation owner | Referenced only | Phase parent map lists target children |
| `004-deep-loop/*` | Deep Loop transfer owner | Referenced only | Phase parent map lists target child |

Required inventories:
- Research corpus: `spec.md`, `research/research.md` and `research/synthesis/06-memory-systems-findings.md`.
- Consumers of changed symbols: none, because this phase changes no code.
- Matrix axes: external system, candidate, novelty tag, target subsystem and fold-forward child.
- Algorithm invariant: external ideas remain research candidates until a later implementation child builds and verifies them.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the external memory systems specification
- [x] Read the authoritative research report
- [x] Confirm the four external systems and novelty-diff requirement

### Phase 2: Core Implementation
- [x] Mine Mem0, Graphiti, Letta and Cognee for candidate patterns
- [x] Adversarially verify and deflate over-claimed findings
- [x] Record top candidates, new initiatives and no-transfer items

### Phase 3: Verification
- [x] Confirm saturation close at 22 iterations
- [x] Confirm no separate code implementation exists for this phase
- [x] Route candidate families into implementation children
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Document validation | Level 1 docs for this phase | `validate.sh --strict` |
| Research verification | Completion and saturation state | `research/research.md` |
| Recursive validation | Parent packet and children | `validate.sh 028-memory-search-intelligence --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| External vendored systems | Reference code | Available during research | Candidate mapping would be unsupported |
| 028 synthesis docs | Internal research | Complete | Fold-forward targets would be unclear |
| 001 Memory implementation parent | Internal spec folder | Available | Most findings would have no implementation owner |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: If these completion docs overstate the research, omit the saturation state or point to the wrong implementation child.
- **Procedure**: Patch only this phase's Level 1 docs, then rerun per-phase and recursive strict validation.
<!-- /ANCHOR:rollback -->

