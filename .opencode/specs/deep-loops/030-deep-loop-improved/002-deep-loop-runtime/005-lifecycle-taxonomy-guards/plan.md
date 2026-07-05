---
title: "Implementation Plan: Phase 5: Lifecycle Taxonomy Guards"
description: "Plan for the shipped lifecycle state-machine taxonomy, legal transition map, and paused-wait gate contract."
trigger_phrases:
  - "lifecycle-taxonomy-guards"
  - "loop-state-machine-taxonomy"
  - "lifecycle-transition-guards"
  - "loop-status-contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/005-lifecycle-taxonomy-guards"
    last_updated_at: "2026-07-01T21:28:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped lifecycle-taxonomy content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed lifecycle taxonomy contract"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs"
    session_dedup:
      fingerprint: "sha256:005a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5d9c"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: Lifecycle Taxonomy Guards

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | CommonJS/TypeScript-adjacent deep-loop runtime contract |
| **Framework** | Shared lifecycle taxonomy module |
| **Storage** | None |
| **Testing** | Spec acceptance requires complete transition-map coverage, illegal transition absence, importable exports, and existing-caller compilation; no dedicated test file is named in spec.md |

### Overview
This phase shipped an authoritative lifecycle contract in `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs`. The module exports active loop statuses, terminal stop reasons, a legal transition table, and the one-shot `resumeResolve` paused-wait gate while keeping backward-compatible string-literal exports during migration.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: lifecycle statuses and stop reasons were scattered as ad-hoc strings.
- [x] Success criteria measurable: `LEGAL_TRANSITIONS` covers all five active statuses and omits illegal transitions such as `stopped -> running`.
- [x] Dependencies identified: standalone contract file; no dependency on phases 1-4.

### Definition of Done
- [x] `LoopActiveStatus` taxonomy exported for `running`, `waiting`, `paused`, `idle`, and `stopped`.
- [x] `LoopStopReason` terminal reason taxonomy exported.
- [x] `LEGAL_TRANSITIONS` exported and covers every active status.
- [x] One-shot paused-wait gate contract exported and documented.
- [x] Backward-compatible exports preserved for existing callers.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Centralized lifecycle state-machine contract with compatibility exports for staged caller migration.

### Key Components
- **`LoopActiveStatus`**: Active status vocabulary for the loop state machine.
- **`LoopStopReason`**: Terminal stop-reason vocabulary used when a loop ends.
- **`LEGAL_TRANSITIONS`**: Source-to-target transition map that makes legal state moves auditable.
- **Paused-wait gate contract**: One-shot `resumeResolve` behavior describing how paused loops wait for a resume signal.

### Data Flow
Callers import lifecycle constants and transition metadata from `lifecycle-taxonomy.cjs` instead of duplicating string literals. During transition, old exports remain valid; new code can consult `LEGAL_TRANSITIONS` and the paused-wait contract to avoid or detect invalid state changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs` | Shared lifecycle vocabulary and contracts | Add statuses, stop reasons, transitions, and paused-wait gate exports | Spec acceptance covers export presence and transition coverage |
| Existing lifecycle callers | Transitional users of old string literals | Left compatible in this phase | Existing callers compile unchanged per spec |

Required inventories:
- Same-class producers: identify scattered lifecycle status and stop-reason literals before caller migration.
- Consumers of changed symbols: migration list remains a follow-up; this phase provides the shared contract.
- Matrix axes: each source status in `LEGAL_TRANSITIONS`, terminal stop reasons, legal vs illegal transitions, and paused-wait one-shot resume behavior.
- Algorithm invariant: every active status must be represented in `LEGAL_TRANSITIONS`; an illegal transition must be absent unless explicitly allowed by the taxonomy.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm lifecycle taxonomy belongs in `lifecycle-taxonomy.cjs` as a standalone shared contract.
- [x] Identify the five active statuses and terminal stop-reason vocabulary from the spec.

### Phase 2: Core Implementation
- [x] Exported active status and terminal stop-reason taxonomies.
- [x] Added `LEGAL_TRANSITIONS` covering all active statuses.
- [x] Added the one-shot `resumeResolve` paused-wait gate contract.
- [x] Preserved backward-compatible string-literal exports for existing callers.

### Phase 3: Verification
- [x] Verified the transition map covers all five active statuses.
- [x] Verified illegal transitions such as `stopped -> running` are absent.
- [x] Confirmed existing callers can continue compiling during staged migration.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/contract | `LEGAL_TRANSITIONS` coverage and illegal-transition absence | Spec acceptance criteria; no dedicated test file named |
| Compile | New taxonomy exports importable and existing callers unaffected | TypeScript/CommonJS compilation |
| Manual review | One-shot paused-wait gate documented | Read `lifecycle-taxonomy.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `lifecycle-taxonomy.cjs` | Internal | Complete | The taxonomy must be centralized before runtime enforcement or caller migration can safely proceed |
| Caller migration | Internal follow-up | Deferred | Old literals may coexist until callers adopt the new constants |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The taxonomy omits required statuses, breaks compatibility exports, or encodes incorrect legal transitions.
- **Procedure**: Revert the taxonomy additions in `lifecycle-taxonomy.cjs` while keeping prior exports available; re-author the transition table before reintroducing enforcement.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
