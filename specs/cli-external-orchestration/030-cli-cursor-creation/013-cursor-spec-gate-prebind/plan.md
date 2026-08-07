---
title: "Implementation Plan: Cursor session-start spec-gate prebinding"
description: "Harden the Cursor startup prebind, prove its environment and state matrix in child processes, and align the shared autonomous-child policy before registration."
trigger_phrases:
  - "Cursor prebind implementation plan"
  - "sessionStart Gate-3 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/013-cursor-spec-gate-prebind"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Post-closeout hardening: enforce consumer root agreement and fallback tests."
    next_safe_action: "Commit and push on explicit approval only."
    blockers: []
    key_files: ["spec.md", ".opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs", ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-spec-gate-prebind"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Wire Cursor session-start spec gate prebinding

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | Node.js ESM and JSON |
| **Framework** | Cursor command-hook transport |
| **Storage** | Atomic session-state JSON files |
| **Testing** | Node test runner plus strict spec validation |

### Overview
Treat the startup hook as a thin adapter over existing public core exports. Validate an explicit folder into `satisfied` state, otherwise open state only for identifiable top-level sessions with enforcement opted in; all disabled, child, malformed, and unresolved cases return allow without mutation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. [EVIDENCE: `spec.md` defines the inactive-gate failure and bounded files.]
- [x] Success criteria measurable. [EVIDENCE: `spec.md` defines four command-backed outcomes.]
- [x] Dependencies identified. [EVIDENCE: shared core, compiled classifier, and Cursor wiring are listed.]

### Definition of Done
- [x] All acceptance criteria met. [EVIDENCE: all runtime suites, wiring checks, document validators, phase strict, and recursive strict gates pass.]
- [x] Process-level and integration tests pass. [EVIDENCE: prebind 9/9, core 67/67 with module mocks, plugin 11/11, and the live Claude child probe pass.]
- [x] Runtime registration and documentation agree. [EVIDENCE: config/mirror assertions pass and 21 affected documents validate with zero issues.]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin fail-open runtime adapter over shared policy.

### Key Components
- **Startup prebind**: Converts explicit startup environment into terminal or open gate state.
- **Shared core**: Owns state paths, atomic writes, child detection, and mutation decisions.
- **Process test**: Runs the real entrypoint with isolated workspace and environment state.

### Data Flow
Cursor sends `sessionStart` JSON to the prebind. The adapter validates identity and exemptions, reads existing state, validates `MK_SPEC_FOLDER` when present, and writes either `satisfied` or `open`. Later `preToolUse` events flow through the unchanged enforce adapter and the shared evaluator, whose child-session branch now short-circuits to a complete allow no-op.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec-gate-prebind.mjs` | Startup state producer | Harden and wire | Process matrix and config-path test |
| `spec-gate-core.mjs` | State and mutation policy (shared) | Modify: child session becomes a complete no-op | Full core suite re-runs green |
| `spec-gate-enforce.mjs` | Pre-tool state consumer | Hardened: workspace-root agreement with prebind producer | Open state denies; satisfied state allows; whitespace-only root agrees with prebind |
| Cursor hook docs/config | Registration authority and operator contract | Update | JSON parse, path resolution, document validators |

Matrix axes: payload validity, session identity, disabled flag, child flag, folder validity, enforcement flag, and existing terminal state. The invariant is that only an identifiable top-level session may receive new state, and only filesystem-validated folders may satisfy it.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract and tests
- [x] Audit draft behavior against core state and exemption semantics. [EVIDENCE: shared core exports and the compiled classifier audited; findings drove the child no-op scope expansion in spec.md §2.]
- [x] Add process-level tests for the full matrix. [EVIDENCE: `node --test spec-gate-prebind.test.mjs` reports 9/9, including the discriminating padded-id deny row.]

### Phase 2: Adapter and registration
- [x] Harden startup prebinding and align the shared autonomous-child contract. [EVIDENCE: the adapter preserves session ids verbatim; shared classify/enforce return a complete child no-op.]
- [x] Register the real path on `sessionStart` and add a discovery symlink. [EVIDENCE: config assertion reports one resolving entry; symlink checks exit 0.]
- [x] Update authoritative hook inventories and shared child-contract references. [EVIDENCE: runtime, orchestration, plugin-test, and manual-playbook surfaces are included in the final document gate.]

### Phase 3: Verification and closeout
- [x] Run adapter, shared-core, config, and documentation gates. [EVIDENCE: all code suites, wiring checks, hygiene checks, 3 drift guards, and 21 document validators pass.]
- [x] Reconcile phase and parent packet continuity. [EVIDENCE: phase 017 links to 018; parent has 18 unique children, includes 018, and has no ghost entry.]
- [x] Run recursive strict validation. [EVIDENCE: phase 018 and packet 030 recursive strict validation each report 0 errors, 0 warnings, and `RESULT: PASSED`; the parent verifies all 18 phase links.]

### Phase 4: Post-closeout hardening
- [x] Fix the enforce consumer's workspace-root resolution to match the prebind producer. [EVIDENCE: `spec-gate-enforce.mjs` uses trim-and-fallback instead of raw `||`; the whitespace-root regression test denies.]
- [x] Add `process.cwd()` fallback and whitespace-root discriminating tests to the prebind suite. [EVIDENCE: prebind suite reports 11/11, including the missing-roots and whitespace-root rows.]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Process | Startup environment/state matrix | `node --test` |
| Integration | Prebind state consumed by enforce adapter | Child-process invocation |
| Regression | Shared policy remains green | `spec-gate-core.test.mjs` |
| Configuration | Hook command and mirror resolve | JSON/path assertions |
| Packet | Phase and parent consistency | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shared spec-gate core | Internal | Green | Provides all policy and persistence primitives. |
| Compiled Gate-3 classifier | Internal | Green | Required for trusted folder binding. |
| Cursor `sessionStart` | External runtime | Green | Previously confirmed to deliver under Cursor CLI. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Startup hook errors, editor regressions, or false state writes.
- **Procedure**: Remove the prebind entry from `.cursor/hooks.json`, remove its discovery link, and revert the adapter/docs commit. Existing enforce behavior returns to inert fail-open state.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract and tests | None | Adapter and registration |
| Adapter and registration | Contract and tests | Verification |
| Verification and closeout | Adapter and registration | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract and tests | Medium | 45 minutes |
| Adapter and registration | Low | 30 minutes |
| Verification and closeout | Medium | 45 minutes |
| **Total** | | **2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Enforcement remains behind `MK_SPEC_GATE_ENFORCE=1`. [EVIDENCE: prebind opens gate state only when the flag is set; the enforce deny path is gated on the same flag.]
- [x] Full process matrix passes. [EVIDENCE: 9/9 prebind, 67/67 shared core with module mocks, and 11/11 OpenCode plugin subtests pass.]
- [x] Shared Cursor/editor blast radius is documented. [EVIDENCE: hook contract, runtime READMEs, feature catalog, and phase docs all name it.]

### Rollback Procedure
1. Unset `MK_SPEC_GATE_ENFORCE` for immediate behavior rollback.
2. Remove the startup registration and discovery link.
3. Re-run the hook config and strict packet checks.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Existing session-state files age out through the shared retention sweep; no schema changes exist.
<!-- /ANCHOR:enhanced-rollback -->

---

## Related Documents
- `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
