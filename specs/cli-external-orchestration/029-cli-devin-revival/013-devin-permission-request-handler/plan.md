---
title: "Implementation Plan: Devin PermissionRequest handler"
description: "Build a real PermissionRequest adapter composing the existing spec-gate and dispatch-rule-checks cores, registered in .devin/hooks.v1.json to replace the empty-array silent rejection."
trigger_phrases:
  - "devin permission request handler plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/013-devin-permission-request-handler"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Implement Phase 1: adapter."
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-permission-request-handler"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Devin PermissionRequest handler

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM |
| **Framework** | Devin hooks.v1.json transport |
| **Testing** | Node test runner plus strict spec validation |

### Overview
Build `permission-request-policy.mjs` composing `guardCore.isExemptTargetPath` (write-class) and `dispatch-rule-checks.mjs`'s `readHardRules`/`evaluate` (exec-class), default-deny for anything unclassifiable, register it into `.devin/hooks.v1.json`'s currently-empty `PermissionRequest` array, and verify against both a process-level test suite and a live `devin -p` probe.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. [EVIDENCE: `spec.md` documents the confirmed live-probe finding and the silent-rejection behavior.]
- [x] Success criteria measurable. [EVIDENCE: `spec.md` defines five command/probe-backed outcomes.]
- [x] Dependencies identified. [EVIDENCE: phases 008 and 012 are complete; shared cores are green.]

### Definition of Done
- [ ] All acceptance criteria met. [EVIDENCE: pending implementation.]
- [ ] Process-level tests pass. [EVIDENCE: pending implementation.]
- [ ] Live `devin -p` probe confirms resolution. [EVIDENCE: pending implementation.]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin composing adapter over two unmodified shared cores, following the same shared-core-composition precedent as the existing spec-gate and dispatch-guard adapters.

### Key Components
- **Write-class classifier**: delegates to `guardCore.isExemptTargetPath(filePath, projectDir)` — the exact function the spec-gate adapters already call, so write-class policy stays single-sourced.
- **Exec-class classifier**: delegates to `dispatch-rule-checks.mjs`'s `readHardRules`/`evaluate`.
- **Default-deny fallthrough**: any `tool_name`/shape that matches neither recognized class denies — the opposite fail-direction from the rest of the Devin adapter suite, deliberate because a `PermissionRequest` denial is the safe default.

### Data Flow
Devin dispatches `PermissionRequest` with `{tool_name, tool_input, tool_use_id, session_id, prompt_id}` on stdin. The adapter parses it, classifies `tool_name` as write/exec/unknown, calls the matching shared-core decision function (or denies immediately for unknown), and emits Devin's `hookSpecificOutput` approval envelope.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `permission-request-policy.mjs` | Does not exist | Create | Process suite + live probe |
| `permission-request-policy.test.mjs` | Does not exist | Create | `node --test` |
| `.devin/hooks.v1.json` | `"PermissionRequest": []` | Register new adapter | `devin -p` live dispatch |

Matrix axes: tool class (write/exec/unknown), classification result (allow/deny), malformed input, missing identity.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Adapter
- [ ] Create `permission-request-policy.mjs`: parse stdin, classify `tool_name`, compose `isExemptTargetPath` and `dispatch-rule-checks`.
- [ ] Implement default-deny for any unrecognized `tool_name`/shape.
- [ ] Implement fail-closed (deny) on malformed input or missing identity.

### Phase 2: Registration and tests
- [ ] Register the adapter in `.devin/hooks.v1.json`'s `PermissionRequest` array using the documented nested `{matcher, hooks:[{type,command,timeout}]}` shape.
- [ ] Build `permission-request-policy.test.mjs` with write-allow, write-deny, exec-allow, exec-deny, unclassifiable-deny, malformed-input, and missing-identity rows.
- [ ] Run the suite green; confirm at least one row fails against a naive always-allow stub.

### Phase 3: Live verification and closeout
- [ ] Live-probe via `devin -p` with a real approval-needing tool call; confirm resolution through the new adapter (not the prior empty-array silent rejection).
- [ ] Run phase 013 strict and recursive parent strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Process | Write/exec/unknown classification matrix | `node --test` |
| Live | Real `devin -p` PermissionRequest dispatch | Manual CLI probe (backup/restore `.devin/hooks.v1.json` around it) |
| Regression | Shared spec-gate core and `dispatch-rule-checks` suites remain green | `node --test` |
| Packet | Phase and parent consistency | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 008 (devin-hook-parity) | Internal | Complete | Provides the live nested-schema registration precedent. |
| Phase 012 (devin-hook-hardening) | Internal | Complete | Provides the trim-and-fallback pattern and process-test-suite shape. |
| Shared spec-gate core / `dispatch-rule-checks.mjs` | Internal | Green | Provides the decision primitives this adapter composes. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Test suite fails, live probe shows an unexpected allow, or the registration breaks other Devin hook events.
- **Procedure**: Revert `.devin/hooks.v1.json`'s `PermissionRequest` array back to `[]`. This restores today's silent-rejection behavior — strictly safer than any partial or buggy adapter, so the rollback itself introduces no new risk.
<!-- /ANCHOR:rollback -->

---

## Related Documents
- `spec.md`, `tasks.md`, `checklist.md`
