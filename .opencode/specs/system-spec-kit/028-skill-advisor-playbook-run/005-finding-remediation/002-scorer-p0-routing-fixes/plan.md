---
title: "Implementation Plan: Scorer P0 Routing Fixes (F1b)"
description: "Add ambiguity abstention for low-information multi-domain prompts and a /speckit:plan command-intent bonus; verify P0 pass-rate lift."
trigger_phrases:
  - "F1b plan scorer routing"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/002-scorer-p0-routing-fixes"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced approach"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Scorer P0 Routing Fixes (F1b)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (scorer) |
| **Framework** | system-skill-advisor scorer (ambiguity/projection/fusion) |
| **Storage** | regression fixtures JSONL |
| **Testing** | skill_advisor_regression.py + scorer vitest |

### Overview
Two independent scorer fixes: (1) ambiguity/abstention for low-information multi-domain prompts so they do not falsely route to sk-code; (2) a bounded /speckit:plan command-intent bonus in projection/fusion mirroring the existing /speckit:resume special case.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause + file:line confirmed (research §3 F1b)
- [x] Failing P0 cases identified (UNC-001/002, CMD-002)

### Definition of Done
- [x] P0 pass rate ≥ 0.92; no P0 regression — both scorers 12/12 P0, 0 pass→fail regressions
- [x] tsc + scorer vitest pass — tsc clean; 448 vitest pass (1 pre-existing unrelated fail)
- [x] Ambiguity rule verified against existing P0-UNC fixtures + corpus (45→62, 0 lost)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scorer-layer behavioral fix; two small, independent changes.

### Key Components
- **ambiguity.ts**: low-information abstention decision
- **projection.ts / fusion.ts**: command-intent bonus for /speckit:plan

### Data Flow
Prompt → lane scores → fusion; ambiguity gate can abstain; command-bridge projection adds an intent bonus before the top-1 decision.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ambiguity.ts:44-57` | ambiguity decision | add low-info abstain/route rule | P0-UNC-001/002 pass |
| `projection.ts:47-55` | command-bridge projection | add /speckit:plan intent bonus | P0-CMD-002 passes |
| `fusion.ts:265-268,389-404` | fusion top-1 + ambiguity | apply bonus + abstention | regression P0 rate |
| regression fixtures | P0 cases | add ambiguity fixture | new fixture passes |

Inventories:
- Same-class: confirm no other command tokens (besides /speckit:resume, /speckit:plan) need the same bonus.
- Adversarial: low-info prompt that SHOULD route (avoid over-abstention) + a genuine sk-code prompt (avoid false abstain).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read fusion.ts/projection.ts/skill_advisor.py cited regions + failing fixtures; established ground truth in both scorers
- [x] Decided mcp-code-mode route (not relabel) for P0-UNC-002

### Phase 2: Core Implementation
- [x] Low-information abstention in fusion.ts (phrase-anchor guarded) + skill_advisor.py (ambiguous-ratio guarded)
- [x] code-mode disambiguation (toolchain vocab → mcp-code-mode) in both scorers
- [x] Model-B memory-save owner normalization + prompt-improver marker fix (Python); chrome-devtools route allow (TS)
- [x] /speckit:plan command-intent bonus confirmed in fusion.ts (carried from prior remediation)

### Phase 3: Verification
- [x] Both regression harnesses: P0 12/12, no regression
- [x] tsc --noEmit clean + 448 vitest pass + Python 57/57 + alignment verifier PASS
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | P0 pass rate | skill_advisor_regression.py |
| Unit | scorer fusion/ambiguity | scorer vitest |
| Adversarial | over-abstention / over-fire | added fixtures |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| mcp-code-mode route decision | Internal | Yellow | Gates P0-UNC-002 approach |
| Phase 001 (F1a) | Internal | Independent | Metric vs routing — no hard dep |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: P0 regression or over-abstention.
- **Procedure**: Each change is small + independent; revert the offending file (ambiguity or projection) separately.
<!-- /ANCHOR:rollback -->
