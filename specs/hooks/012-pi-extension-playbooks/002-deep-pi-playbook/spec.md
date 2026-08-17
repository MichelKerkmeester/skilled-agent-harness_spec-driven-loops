---
title: "Feature Specification: Phase 2 deep-pi playbook"
description: "Author a manual-testing playbook, deterministic harness, and benchmark run for the deep-pi extension."
trigger_phrases:
  - "deep-pi playbook"
  - "deeppi manual testing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/012-pi-extension-playbooks/002-deep-pi-playbook"
    last_updated_at: "2026-08-17T16:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Playbook authored, harness 6/6 PASS, benchmark run recorded"
    next_safe_action: "Reconcile packet metadata and validate"
    blockers: []
    key_files:
      - "../../../.pi/extensions/deep-pi/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-17-pi-extension-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 2 deep-pi playbook

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 2 |
| **Predecessor** | `001-cache-optimizer-playbook` |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child owns the `deep-pi` playbook, its deterministic harness, and the benchmark run. It is the second of two independent extension phases and depends only on the shared `FakePi` test double and the canonical playbook recorder.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-pi` has 81 unit tests but no operator-facing manual-testing playbook, so there is no reproducible way to validate that `/deeppi` activates only on the supported DeepSeek models and reports the measured cache economics.

### Purpose
Author a `manual-testing-playbook/` package, prove the scenarios with a deterministic harness that drives the real extension, and record the run under `benchmark/reports/` without any paid API call.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A 6-scenario playbook across 2 categories: eligibility and cache-measurement.
- A `vitest` harness driving the real extension via the shared `FakePi`.
- A canonical benchmark run folder.

### Out of Scope
- The paid live benchmark (`benchmark:live`), which is never run.
- Extension production code changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/deep-pi/manual-testing-playbook/` | Create | Playbook package |
| `.pi/extensions/deep-pi/benchmark/` | Create | Harness evidence and benchmark run |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The playbook validates | `validate-playbook-package.cjs` reports `0` violations |
| REQ-002 | Eligibility is proven | The harness shows activation only on `deepseek-v4-flash` and `deepseek-v4-pro` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The measurement is proven | The harness shows the `80.0%` cache hit rate in the report and footer |
| REQ-004 | The harness stays out of the vitest glob | The moved harness does not run in `npm run verify` |
| REQ-005 | No paid API is called | The live benchmark is never run and `DEEPPI_LIVE` stays unset |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 scenarios record `PASS` against the real extension.
- **SC-002**: The extension's own `npm run verify` stays green.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `vitest` globs `benchmark/` | Harness joins the default suite | Move the harness to `benchmark/evidence/` as a `.txt` after the run |
| Dependency | `deep-pi/tests/fake-pi.ts` | Harness needs the fake host | Reuse the existing test double |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Eligibility and report behavior were fixed from `isDeepPiModel` and the integration test before authoring.

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Playbook:** `../../../.pi/extensions/deep-pi/manual-testing-playbook/manual-testing-playbook.md`
