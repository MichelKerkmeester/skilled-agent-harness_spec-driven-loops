---
title: "Implementation Plan: CLI Fallback Envelope and Bridge Allowlist [template:level_1/plan.md]"
description: "Define one normalized warm-fallback envelope with reason codes consumed by the three hook helpers and add a prompt-time allowlist to the spec-memory plugin bridge, all additive to current consumers."
trigger_phrases:
  - "004-cli-fallback-envelope-and-bridge plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/004-cli-fallback-envelope-and-bridge"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level-1 plan for envelope normalization + bridge allowlist"
    next_safe_action: "Define the shared envelope shape and the bridge allowlist"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-004-cli-fallback-envelope-and-bridge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CLI Fallback Envelope and Bridge Allowlist

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
| **Language/Stack** | TypeScript hook helpers + `.mjs` plugin bridges |
| **Framework** | Warm-only prompt-time hook fallback over mk-* daemons |
| **Storage** | n/a |
| **Testing** | vitest (envelope contract + bridge allowlist) |

### Overview
Define one normalized warm-fallback envelope with reason codes (`skipped`, `fail_open`, `exitCode`, retryability), wire the three hook helpers to emit it additively, and add a prompt-time allowlist to the spec-memory plugin bridge mirroring the code-index maintenance denylist.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive envelope normalization plus a defense-in-depth allowlist mirroring an existing proven denylist; no consumer-breaking field renames.

### Key Components
- **Normalized envelope**: `skipped` / `fail_open` / `exitCode` / retryability, consumed by all three helpers
- **Spec-memory bridge allowlist**: explicit prompt-time `toolName` allowlist

### Data Flow
prompt-time hook -> warm-only probe -> normalized envelope; direct bridge call -> allowlist check -> dispatch or structured rejection.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Surfaces and verification live in the spec Files-to-Change table and the tasks below. Envelope changes are additive (assessment #8 guardrail).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| three hook fallback helpers | inconsistent envelopes | Emit normalized envelope | Contract test asserts one shape across all three |
| `mk-spec-memory-bridge.mjs:206-230` | accepts arbitrary toolName | Add prompt-time allowlist | Bridge rejects out-of-allowlist tools |
| `mk-code-graph-bridge.mjs:18-25`, `:272-282` | denylist reference | Mirror posture | Allowlist parity verified |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Compare current envelope shapes across the three helpers and identify the superset of fields
- [ ] Capture the code-index denylist posture as the allowlist pattern to mirror

### Phase 2: Core
- [ ] Define the normalized envelope + reason codes
- [ ] Wire all three hook helpers to emit it additively (keep existing fields)
- [ ] Add the prompt-time allowlist to the spec-memory plugin bridge

### Phase 3: Verification
- [ ] Envelope contract test asserts one shape across all three helpers
- [ ] Existing consumer fields remain present (additive-only)
- [ ] Bridge rejects any out-of-allowlist toolName
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Normalized envelope contract | vitest |
| Unit | Additive-only field check | vitest |
| Unit | Bridge allowlist enforcement | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| code-index bridge denylist (`mk-code-graph-bridge.mjs:18-25`, `:272-282`) | Internal | Available | Mirror its posture for the allowlist |
| Hook consumers of current envelope shapes | Internal | Available | Keep changes additive to avoid breakage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hook consumer breaks or the allowlist blocks a legitimate prompt-time call.
- **Procedure**: Revert the envelope/allowlist change; additive fields can be removed without touching existing consumers.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
