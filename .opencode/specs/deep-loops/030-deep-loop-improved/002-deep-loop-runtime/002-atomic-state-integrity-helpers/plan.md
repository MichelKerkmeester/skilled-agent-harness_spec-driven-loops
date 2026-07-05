---
title: "Implementation Plan: Phase 2: Atomic State Integrity Helpers"
description: "Plan for the shipped SHA-256 integrity helpers used to stamp and verify object/registry JSON snapshots."
trigger_phrases:
  - "atomic-state-integrity-helpers"
  - "sha256-snapshot-integrity"
  - "integrity-stamp-verify"
  - "registry-json-integrity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/002-atomic-state-integrity-helpers"
    last_updated_at: "2026-07-01T21:22:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped integrity-helper content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed SHA-256 object integrity helpers"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts"
    session_dedup:
      fingerprint: "sha256:002a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5d7f"
      session_id: "scaffold-content-remediation-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: Atomic State Integrity Helpers

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
| **Language/Stack** | TypeScript deep-loop runtime library |
| **Framework** | Node.js atomic state helpers with SHA-256 hashing |
| **Storage** | Object/registry JSON snapshots; JSONL explicitly excluded |
| **Testing** | Spec acceptance requires clean stamped object, tampered object warn, and TypeScript compilation; no dedicated test file is named in spec.md |

### Overview
This phase shipped three integrity helpers in `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`: `computeIntegrityHash`, `stampIntegrity`, and `verifyIntegrity`. The implementation stamps object/registry JSON with a canonical SHA-256 digest and verifies loaded snapshots with warn-first mismatch handling so operators see corruption signals without blocking mutations in this phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: registry/config JSON loads had no integrity check.
- [x] Success criteria measurable: clean stamped objects verify `true`; tampered objects verify `false` and emit `console.warn`.
- [x] Dependencies identified: builds on the same `atomic-state.ts` surface touched by phase 001.

### Definition of Done
- [x] `computeIntegrityHash(obj)` exported with canonical SHA-256 digest output.
- [x] `stampIntegrity(obj)` exported and attaches `_integrity` before write.
- [x] `verifyIntegrity(obj)` exported and implements warn-first mismatch handling.
- [x] JSDoc documents JSONL exclusion and fail-fast deferral.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Snapshot integrity stamping and verification for object JSON, implemented as lightweight helpers beside the atomic state writer.

### Key Components
- **`computeIntegrityHash`**: Canonically serializes an object and returns `sha256:<hex>`.
- **`stampIntegrity`**: Adds `_integrity` to an object snapshot before persistence.
- **`verifyIntegrity`**: Recomputes the hash, compares it to `_integrity`, warns on mismatch, and returns a boolean instead of throwing.

### Data Flow
Before writing object/registry JSON, the runtime stamps the object with a computed `_integrity` hash. On load, `verifyIntegrity` recomputes the digest from the loaded content and compares it to the stored hash; matches continue silently, mismatches emit `console.warn` and return `false` while leaving fail-fast behavior to a later phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | Owns object JSON atomic state helpers | Add integrity hash/stamp/verify exports | Spec acceptance checks clean and tampered verification behavior |
| JSONL state/log files | Append-only records outside object snapshot scope | Explicitly excluded | JSDoc documents deferred sidecar/per-record design |

Required inventories:
- Same-class producers: inspect object/registry JSON helpers in `atomic-state.ts` before adding integrity helpers.
- Consumers of changed symbols: future snapshot load/write callers can adopt the exported helpers; this phase only ships the helpers.
- Matrix axes: clean stamped object, tampered object, missing or invalid `_integrity`, and JSONL exclusion.
- Algorithm invariant: verification must never silently report success when the recomputed hash differs from the stored `_integrity` value.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm integrity scope is limited to object/registry JSON snapshots.
- [x] Confirm JSONL integrity requires a separate sidecar or per-record design and is excluded here.

### Phase 2: Core Implementation
- [x] Implemented canonical object hashing as `computeIntegrityHash` returning `sha256:<hex>`.
- [x] Implemented `stampIntegrity` to attach `_integrity` before persistence.
- [x] Implemented `verifyIntegrity` to recompute, compare, warn on mismatch, and return `false` without throwing.

### Phase 3: Verification
- [x] Verified clean stamped objects return `true`.
- [x] Verified tampered objects return `false` and emit a warning.
- [x] Confirmed warn-first behavior leaves mutation blocking/fail-fast as a documented follow-up.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/behavior | `computeIntegrityHash`, `stampIntegrity`, `verifyIntegrity` clean and tampered cases | Spec acceptance criteria; no dedicated test file named |
| Compile | Exported helper signatures type-check | TypeScript compilation |
| Manual review | JSONL exclusion and warn-first rationale documented | Read `atomic-state.ts` JSDoc |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 atomic-state changes | Internal | Complete | Integrity helpers share the same `atomic-state.ts` module touched by phase 001 |
| Node SHA-256 hashing support | Runtime | Available | Required to compute `sha256:<hex>` digests |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Integrity stamping breaks JSON snapshot shape or warn-first verification produces false mismatch reports.
- **Procedure**: Revert the three integrity helper exports and associated JSDoc from `atomic-state.ts`; object JSON loads then return to the previous no-integrity behavior until a corrected design lands.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
