---
title: "Implementation Plan: Phase 2 deep-pi playbook"
description: "Plan for authoring the deep-pi playbook, harness, and benchmark run."
trigger_phrases:
  - "deep-pi playbook plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/012-pi-extension-playbooks/002-deep-pi-playbook"
    last_updated_at: "2026-08-17T16:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan executed: playbook, harness, benchmark all shipped"
    next_safe_action: "Reconcile packet metadata and validate"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-17-pi-extension-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 2 deep-pi playbook

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript Pi extension, `vitest` |
| **Driver** | Shared `FakePi` from `tests/fake-pi.ts` |
| **Recorder** | `run-manual-playbook-scenario.cjs` |

### Overview
Read `isDeepPiModel` and the integration test to fix the observable behavior, author 6 scenarios, drive them with the real extension using a known `message_end` usage event, and record a canonical benchmark run.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Done
- [x] Playbook validates with `0` violations.
- [x] Harness records `6` of `6` PASS.
- [x] Benchmark run folder is renderer-owned.

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Register the real default export against `FakePi`, emit `session_start` to check activation, feed a known usage event, then read the footer and the `/deeppi` report.

### Key Components
- `isDeepPiModel` for the eligibility scenarios.
- The `message_end` hook and the `/deeppi` command for the measurement scenarios.
- A fixed 80% cache-read usage event so the reported percentage is deterministic.

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author
- [x] Read `isDeepPiModel` and the `/deeppi` command, then author 6 scenarios.

### Phase 2: Harness
- [x] Drive the real extension via `FakePi` with a known `80%` cache-read usage event.

### Phase 3: Record
- [x] Run the canonical wrapper into `benchmark/reports/`.

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deterministic scenario run | 6 playbook scenarios | `vitest` |
| Package validation | Playbook shape | `validate-playbook-package.cjs` |
| Regression guard | The extension's own suite | `npm run verify` |

<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `deep-pi/tests/fake-pi.ts` | Internal | Green | No fake host to drive the extension |
| `run-manual-playbook-scenario.cjs` | Internal | Green | No canonical benchmark record |

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scenario fails or the playbook does not validate.
- **Rollback**: Remove the `manual-testing-playbook/` and `benchmark/` folders; no production code changed.

<!-- /ANCHOR:rollback -->

## RELATED DOCUMENTS

- **Spec:** `spec.md`
- **Tasks:** `tasks.md`
