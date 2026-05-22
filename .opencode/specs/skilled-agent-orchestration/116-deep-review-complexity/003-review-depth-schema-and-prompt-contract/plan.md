---
title: "Implementation Plan: 116/003 - Review-Depth Schema and Prompt Contract"
description: "Level 3 plan for documenting reviewDepthSchemaVersion v2 and extending the deep-review prompt output contract."
trigger_phrases:
  - "116 review depth schema plan"
  - "review depth prompt contract plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/003-review-depth-schema-and-prompt-contract"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed Level 3 plan for phase 003."
    next_safe_action: "Use this plan as phase 004 validator input."
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
      - ".opencode/skills/deep-review/references/state_format.md"
      - ".opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl"
    session_dedup:
      fingerprint: "sha256:1160033100000000000000000000000000000000000000000000000000000000"
      session_id: "116-003-plan"
      parent_session_id: "116-003-review-depth-schema"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: 116/003 - Review-Depth Schema and Prompt Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode skill documentation and deep-review prompt template |
| **Stack** | Markdown, prompt template text, Node/Vitest verification |
| **Primary Sources** | Phase 001 research synthesis, Phase 002 seeded fixtures, current v1 state format |
| **Verification** | `pnpm vitest run --no-coverage prompt-pack`; strict spec validation |

### Overview

This phase is contract-first. It does not implement validator, reducer, convergence, or graph behavior. It creates the reference that those phases consume: a versioned state schema and prompt-pack output contract for `reviewDepthSchemaVersion: 2`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 002 seeded fixtures exist and freeze v2 field names.
- [x] Phase 001 research synthesis identifies the schema and downstream obligations.
- [x] Current v1 state format and prompt contract have been read.
- [x] Gate 3 is pre-approved as option C for this related phase folder.

### Definition of Done

- [x] Level 3 spec docs populated, including checklist and ADR.
- [x] `state_format.md` documents the v2 discriminator, top-level objects, ledger rows, compatibility, and downstream cross-references.
- [x] `prompt_pack_iteration.md.tmpl` requires v2 output for standard/complex scopes without breaking placeholders.
- [x] Metadata refreshed through `generate-context.js`.
- [x] Required validation commands pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Versioned additive contract with discriminator-driven enforcement.

### Components

| Component | Role |
|-----------|------|
| `reviewDepthSchemaVersion` | Enables v2 interpretation and future strict validation. |
| `reviewDepthApplicability` | Decides whether depth obligations are strict, warning-only, or skipped for trivial scope. |
| `targetSelection` | Proves which files or surfaces were chosen and how. |
| `searchCoverage` | Summarizes bug-class coverage and graph/fallback mode. |
| `searchLedger[]` | Records target-linked hypotheses, search actions, evidence, and dispositions. |

### Data Flow

```text
Prompt contract
  -> iteration JSONL record
  -> Phase D validator checks v2 shape
  -> Phase E reducer preserves coverage/debt
  -> Phase F stop gates consume debt
  -> Phase G graph vocabulary projects stable ledger semantics
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read parent spec, research synthesis, Phase 002 summary, fixture helper names, current state docs, and prompt template.
- [x] Confirm prohibited Phase D-G production files remain out of scope.
- [x] Confirm Level 3 template requirements: `checklist.md` and `decision-record.md`.

### Phase 2: Schema Docs

- [x] Add `## Review Depth Schema (v2)` to `state_format.md` after existing iteration/graph event state docs.
- [x] Document discriminator and v1 fallback behavior.
- [x] Document applicability, target selection, search coverage, and ledger row shape.
- [x] Include the trivial-scope exemption and compatibility table.
- [x] Cross-reference Phase E reducer/dashboard/report obligations.

### Phase 3: Prompt-Pack Edit

- [x] Add `### v2 Search Depth Output (when scopeClass is standard or complex)` after the existing JSONL schema block.
- [x] Require v2 fields in addition to v1 fields for standard/complex scope.
- [x] Name trivial-scope exemption and legacy warning behavior.
- [x] Preserve all template placeholders such as `{state_paths_iteration_pattern}`.

### Phase 4: Verification

- [x] Refresh metadata with `generate-context.js`.
- [x] Run prompt-pack Vitest.
- [x] Run strict spec validation.
- [x] Fill implementation summary and checklist evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command | Expected |
|-----------|-------|---------|----------|
| Prompt-pack render | Production prompt templates | `pnpm vitest run --no-coverage prompt-pack` | Pass; rendered deep-review template still parses with bound variables. |
| Spec validation | Level 3 phase docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/003-review-depth-schema-and-prompt-contract --strict` | Exit 0, `RESULT: PASSED`. |
| Manual contract review | v2 field vocabulary | Read state docs and prompt diff | Exact frozen names present. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 research synthesis | Source of truth | Available | Contract would lack evidence-backed obligations. |
| Phase 002 seeded fixtures | Contract fixture names | Available | Later phases could drift from seeded tests. |
| Current prompt-pack renderer | Verification harness | Available | Prompt template regression would be harder to catch. |
| Spec Kit metadata scripts | Metadata refresh | Available | Packet may be less discoverable in memory/search. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert only the Phase 003 documentation packet, `state_format.md` v2 section, and `prompt_pack_iteration.md.tmpl` subsection. No validator, reducer, gate, graph, or Phase B fixture behavior is changed in this phase, so rollback is text-only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 002 seeded fixtures
  -> Phase 003 schema/prompt contract
  -> Phase 004 validator enforcement
  -> Phase 005 reducer/report persistence
  -> Phase 006 stop gates
  -> Phase 007 graph vocabulary
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Gate 3 pre-approval and scaffold | Schema docs |
| Schema docs | Phase 001 research and Phase 002 fixtures | Prompt-pack edit |
| Prompt-pack edit | Schema docs | Verification |
| Verification | Completed docs/template edits | Phase 004 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Schema docs | Medium | 60 minutes |
| Prompt-pack edit | Medium | 30 minutes |
| Verification | Low | 40 minutes |
| **Total** | | **2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No runtime validator, reducer, gate, or graph files changed.
- [x] Phase B review-depth fixture files remain untouched.

### Rollback Procedure

1. Revert the Phase 003 spec-folder docs.
2. Revert the v2 section in `state_format.md`.
3. Revert the v2 subsection in `prompt_pack_iteration.md.tmpl`.
4. Re-run prompt-pack Vitest and strict spec validation.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: Text-only rollback.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 002 fixtures
  -> state_format.md v2 reference
  -> prompt_pack_iteration.md.tmpl output contract
  -> Phase 004 validator enforcement
```

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| State schema docs | Phase 001/002 evidence | Field-by-field v2 reference | Validator and reducer phases |
| Prompt contract | State schema docs | Agent output obligations | Prompt render and Phase D validation |
| ADR-001 | Contract trade-offs | Versioning rationale | Later migration decisions |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Preserve the exact frozen field names from Phase B.
2. Make compatibility discriminator-driven so legacy packets remain readable.
3. Keep the prompt compact enough for LEAF-agent iteration use.
4. Validate docs and prompt rendering before claiming completion.

The important architectural choice is not the existence of `searchLedger[]` alone. The useful contract is the relationship among selected targets, required bug classes, evidence-backed actions, and a disposition-specific link.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | Source docs and fixtures read | Phase 1 |
| M2 | Contract documented | `state_format.md` includes full v2 shape | Phase 2 |
| M3 | Prompt updated | Prompt template includes v2 output subsection | Phase 3 |
| M4 | Release ready | Vitest and strict spec validation pass | Phase 4 |
<!-- /ANCHOR:milestones -->
