---
title: "Implementation Plan: Fanout Session-ID Propagation"
description: "Plan to bind the real fan-out session_id into deep_review_auto/confirm.yaml init and buildNativeCommandInput."
trigger_phrases:
  - "fanout session id propagation"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/011-followup-remediation/001-fanout-session-id-propagation"
    last_updated_at: "2026-07-01T19:54:34Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed implementation and verification"
    next_safe_action: "Proceed to successor 002 if continuing remediation"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Fanout Session-ID Propagation

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets, Node.js (CommonJS) |
| **Framework** | deep-loop-workflows fan-out orchestration |
| **Testing** | vitest (`fanout-run.vitest.ts`) |

### Overview
Thread the fan-out runner's already-generated `session_id` through to `deep_review_auto.yaml`/`deep_review_confirm.yaml`'s init-time writes, replacing the current `{ISO_8601_NOW}` timestamp fallback with the real supplied id when present.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause and exact line numbers confirmed against current code (Explore research).
- [x] Fix scoped to init-time writes only; resumed/restarted paths already correct.

### Definition of Done
- [x] All 3 literal-timestamp writes in `deep_review_auto.yaml` replaced. Evidence: grep shows init writes now use `{session_id_init}`.
- [x] `deep_review_confirm.yaml` gets the identical fix. Evidence: grep shows confirm init writes now use `{session_id_init}`.
- [x] `buildNativeCommandInput` includes `session_id`. Evidence: native command input emits `session_id:` when `options.sessionId` is supplied.
- [x] New test passes; existing `fanout-run.vitest.ts` suite unaffected. Evidence: `npx vitest run tests/unit/fanout-run.vitest.ts` passed 41 tests.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Minimal-diff binding fix: one new resolved variable (`session_id_init`), threaded into existing template slots.

### Key Components
- **`user_inputs`**: declares which bindings a workflow YAML accepts from its caller.
- **`step_resolve_session_id`**: new step, runs before `step_create_config`, resolves `session_id_init`.
- **`buildNativeCommandInput`**: native-executor prompt builder in `fanout-run.cjs`.

### Data Flow
Fan-out runner generates `sessionId` → CLI prompt already carries it as free text → new YAML step reads it via `user_inputs` binding → all 3 init writes use the resolved value instead of a fresh timestamp.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read current `deep_review_auto.yaml` and `deep_review_confirm.yaml` in full around the cited line numbers. Evidence: verified init sections before editing.
- [x] Confirm `buildNativeCommandInput`'s current PRE-BOUND SETUP ANSWERS shape. Evidence: read `fanout-run.cjs:947-980` before patching.

### Phase 2: Implementation
- [x] Add `session_id` to `user_inputs` in both YAML files. Evidence: added at `deep_review_auto.yaml:33` and `deep_review_confirm.yaml:33`.
- [x] Add `step_resolve_session_id` (fallback to `{ISO_8601_NOW}` when absent). Evidence: added before config creation in both review workflows.
- [x] Swap the 3 literal writes in each YAML file to the resolved value. Evidence: config, state log, and findings registry use `{session_id_init}`.
- [x] Add `session_id:` to `buildNativeCommandInput`. Evidence: `fanout-run.cjs` includes the line when `options.sessionId` is present.

### Phase 3: Verification
- [x] Add new test asserting sessionId propagation for the CLI path. Evidence: added `fanout-run.cjs - review session id propagation templates` coverage.
- [x] Run `fanout-run.vitest.ts` in full; confirm 0 new failures. Evidence: 1 file passed, 41 tests passed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New sessionId-propagation assertion | vitest |
| Regression | Full existing `fanout-run.vitest.ts` suite | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | — | — | This child has no dependency on any other child in this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New test fails to pass, or existing suite regresses.
- **Procedure**: `git checkout -- <the 3 modified files>`; no other packet content touched.
<!-- /ANCHOR:rollback -->
