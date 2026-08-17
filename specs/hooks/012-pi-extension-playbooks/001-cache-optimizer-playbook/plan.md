---
title: "Implementation Plan: Phase 1 cache-optimizer playbook"
description: "Plan for authoring the pi-cache-optimizer playbook, harness, and benchmark run."
trigger_phrases:
  - "cache-optimizer playbook plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/012-pi-extension-playbooks/001-cache-optimizer-playbook"
    last_updated_at: "2026-08-17T16:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan executed: playbook, harness, benchmark all shipped"
    next_safe_action: "Continue to 002-deep-pi-playbook"
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

# Implementation Plan: Phase 1 cache-optimizer playbook

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript Pi extension, `node --test` plus `jiti` |
| **Driver** | Shared `FakePi` from `deep-pi/tests/fake-pi.ts` |
| **Recorder** | `run-manual-playbook-scenario.cjs` |

### Overview
Read the real command handler and `before_provider_request` hook, author 7 scenarios matching the observed behavior, drive them with the real extension, and record a canonical benchmark run.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Done
- [x] Playbook validates with `0` violations.
- [x] Harness records `7` of `7` PASS.
- [x] Benchmark run folder is renderer-owned.

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Register the real default export against `FakePi`, then exercise the command handlers and the request hook and assert the captured notifications and mutated payload.

### Key Components
- The `/cache-optimizer` command handler for the command-surface scenarios.
- The `before_provider_request` hook for the cache-key scenarios.
- A temp `PI_CODING_AGENT_DIR` so footer-mode persistence never touches the real agent dir.

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author
- [x] Read `index.ts` command handler and request hook, then author 7 scenarios.

### Phase 2: Harness
- [x] Drive the real extension via `FakePi` and assert observable outputs.

### Phase 3: Record
- [x] Run the canonical wrapper into `benchmark/reports/`.

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deterministic scenario run | 7 playbook scenarios | `node --test` plus `jiti` |
| Package validation | Playbook shape | `validate-playbook-package.cjs` |
| Regression guard | The extension's own suite | `npm run check` |

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
