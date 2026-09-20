---
title: "Implementation Plan: combo-matrix cli-devin arg conformance"
description: "One-line test-expectation fix: append --respect-workspace-trust false to the cli-devin representative args in combo-matrix.vitest.ts."
trigger_phrases:
  - "combo-matrix devin plan"
  - "respect-workspace-trust test fix plan"
  - "plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/054-combo-matrix-devin-arg-conformance"
    last_updated_at: "2026-08-24T15:35:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the one-line test-expectation plan"
    next_safe_action: "Push to v4"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-054-combo-matrix-devin-arg"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: combo-matrix cli-devin arg conformance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (vitest) |
| **Framework** | vitest |
| **Storage** | None |
| **Testing** | `npx vitest run` |

### Overview
Single-token test-expectation fix. The `cli-devin` case of `expectedRepresentativeArgs` in `combo-matrix.vitest.ts` is missing the `--respect-workspace-trust false` flag that `fanout-run.cjs` always appends for devin. Append the two tokens so the assertion matches the builder.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause identified (packet-046 devin flag not reflected in the test)
- [x] Failure proven pre-existing (stash negative control during packet 053)

### Definition of Done
- [x] cli-devin expected args include `--respect-workspace-trust false`
- [x] `combo-matrix.vitest.ts` passes; the two other guard files still pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test-to-builder conformance: the combo-matrix construction test asserts the exact argv `buildLineageCommand` returns per executor kind; the expectation must mirror the builder.

### Key Components
- **`expectedRepresentativeArgs`** (combo-matrix.vitest.ts): the per-kind expected argv, compared against the builder for the first model + sandbox.

### Data Flow
`buildLineageCommand('cli-devin', …)` appends `--respect-workspace-trust false` → the test compares its `args` to `expectedRepresentativeArgs('cli-devin', …)` → they must be equal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the builder emits `--respect-workspace-trust false` for devin and the test expectation omits it

### Phase 2: Core Implementation
- [x] Append `'--respect-workspace-trust', 'false'` to the cli-devin return array

### Phase 3: Verification
- [x] Run combo-matrix + the two other deep-loop guard files
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | representative-args conformance | `combo-matrix.vitest.ts` |
| Regression | roster + matrix guard | `executor-config.vitest.ts`, `fanout-run.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 046 devin repair | Internal | Green | The `--respect-workspace-trust false` flag is already shipped in the builder |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the assertion diverges from the builder again.
- **Procedure**: `git checkout` the one test file. No state to unwind.
<!-- /ANCHOR:rollback -->
