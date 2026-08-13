---
title: "Implementation Plan: Phase 009 Prompt Token-Contract"
description: "Implement the versioned prompt token contract, synthetic-marker example, and fixed-corpus preservation check through the existing provider message assembly."
trigger_phrases:
  - "prompt-token-contract"
  - "implementation plan"
  - "token-aware prompt profile"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/009-prompt-token-contract"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned token-contract implementation scaffold."
    next_safe_action: "Capture the fixed-corpus baseline, then revise the versioned profile."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-009-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 009 Prompt Token-Contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript with JSON fixture contracts |
| **Framework** | Runtime-neutral provider adapter pipeline |
| **Storage** | Versioned prompt-profile fixture; no transcript persistence change |
| **Testing** | Fixed-corpus contract checks plus the package gate |

### Overview

Revise the tracked prompt profile so models understand protected markers as opaque tokens and rewrite only the prose between them. Keep the current wire-body structure, canonical bytes, protection, and restoration unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Fixed-corpus baseline records marker preservation and rewrite behavior.
- [ ] Profile schema, fixture, adapter renderer, and consumers are inventoried.
- [ ] Synthetic-only example policy is confirmed.

### Definition of Done

- [ ] All five requirements have observed evidence.
- [ ] The fixed corpus reaches 100% restoration with non-trivial rewrites.
- [ ] The package gate and strict packet validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Versioned prompt-profile contract rendered through the existing provider message assembly.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Prompt profile contract | Provides a structured home for the token rubric and example set if needed |
| Versioned profile fixture | Carries the explicit marker rule, prose-only scope, synthetic example, version, and digest inputs |
| Provider adapter renderer | Renders the revised profile without changing the one-system-plus-one-user message structure |
| Fixed-corpus harness | Measures restoration success and non-trivial rewriting against the baseline |

### Data Flow

Versioned profile -> deterministic instruction rendering -> encoded user message -> provider candidate -> existing restoration checks -> fixed-corpus comparison.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `src/contracts/prompt.ts` | Defines the profile record | Extend only if structured rubric/example fields are required | Typecheck and contract tests |
| `test/fixtures/prompt-profiles.json` | Stores versioned profiles | Add the revision, synthetic example, and digest inputs | Fixture validation |
| `src/providers/adapters.ts` | Builds provider messages | Render the revised profile without structural wire changes | Adapter tests |
| Fixed-corpus tests | Measure projection behavior | Add old/new preservation and rewrite comparisons | Corpus report plus package gate |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture the old-profile fixed-corpus baseline.
- [ ] Freeze the token rule, synthetic-example policy, and unchanged wire boundary.

### Phase 2: Implementation

- [ ] Add the structured contract surface only if the profile requires it.
- [ ] Author the versioned instruction and synthetic few-shot, then render them through the existing adapter path.

### Phase 3: Verification

- [ ] Compare old and new profiles on marker preservation and non-trivial rewriting.
- [ ] Run restoration checks, the package gate, and strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | Profile schema, version, digest inputs, and synthetic examples | TypeScript tests and fixture validation |
| Fixed corpus | Marker copy count/order plus non-trivial prose rewriting | Deterministic old/new corpus harness |
| Regression | Canonical bytes, protection, restoration, and package behavior | Existing fidelity suite and `npm run check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing prompt-profile record and fixture | Internal | Available | The versioned revision cannot be represented |
| Existing adapter message assembly | Internal | Available | The revised instruction cannot reach providers |
| Phase 010 | Related | Optional | Marker count remains higher, but this phase can still complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The revised profile lowers restoration success, produces no-op output, or changes the wire/fidelity boundary.
- **Procedure**: Restore the prior versioned profile and fixture selection, rerun the fixed corpus, and confirm canonical bytes and restoration remain unchanged.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Baseline and contract freeze -> Profile revision -> Fixed-corpus and package verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Baseline and contract freeze | Existing profile and fixtures | Profile revision |
| Profile revision | Frozen token rule | Verification |
| Verification | Revised profile | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline and contract freeze | Medium | 0.5-1 day |
| Profile revision | Medium | 1-2 days |
| Verification and handoff | Medium | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [ ] Record the selected profile version and digest.
- [ ] Capture the fixed-corpus baseline.
- [ ] Confirm no canonical or restoration change is planned.

### Procedure

1. Select the previous profile version.
2. Remove only the new structured fields or fixture revision.
3. Rerun the fixed corpus and package gate.
4. Confirm exact canonical and restoration parity.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Revert the versioned profile and fixture selection only.
<!-- /ANCHOR:enhanced-rollback -->
