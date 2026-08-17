---
title: "Feature Specification: Phase 1 cache-optimizer playbook"
description: "Author a manual-testing playbook, deterministic harness, and benchmark run for the pi-cache-optimizer extension."
trigger_phrases:
  - "cache-optimizer playbook"
  - "pi-cache-optimizer manual testing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/012-pi-extension-playbooks/001-cache-optimizer-playbook"
    last_updated_at: "2026-08-17T16:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Playbook authored, harness 7/7 PASS, benchmark run recorded"
    next_safe_action: "Continue to 002-deep-pi-playbook"
    blockers: []
    key_files:
      - "../../../.pi/extensions/pi-cache-optimizer/manual-testing-playbook/manual-testing-playbook.md"
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

# Feature Specification: Phase 1 cache-optimizer playbook

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
| **Phase** | 1 of 2 |
| **Successor** | `002-deep-pi-playbook` |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child owns the `pi-cache-optimizer` playbook, its deterministic harness, and the benchmark run. It is the first of two independent extension phases and depends only on the shared `FakePi` test double and the canonical playbook recorder.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`pi-cache-optimizer` has 53 unit tests but no operator-facing manual-testing playbook, so there is no reproducible way to validate its `/cache-optimizer` command surface or the `prompt_cache_key` injection that makes caching effective.

### Purpose
Author a `manual-testing-playbook/` package, prove the scenarios with a deterministic harness that drives the real extension, and record the run under `benchmark/reports/`.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A 7-scenario playbook across 3 categories: command-surface, cache-key-optimization, opt-out.
- A `node --test` harness driving the real extension via the shared `FakePi`.
- A canonical benchmark run folder.

### Out of Scope
- The confirmation-gated `/cache-optimizer fix` command, which mutates `models.json`.
- Extension production code changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-cache-optimizer/manual-testing-playbook/` | Create | Playbook package |
| `.pi/extensions/pi-cache-optimizer/benchmark/` | Create | Harness evidence and benchmark run |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The playbook validates | `validate-playbook-package.cjs` reports `0` violations |
| REQ-002 | The cache-key injection is proven | The harness shows `prompt_cache_key` injected on an openai-compatible payload |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The benchmark run is canonical | The run folder holds `skill-benchmark-report.json` and the renderer-owned files |
| REQ-004 | The harness stays out of the default test glob | The `benchmark/` harness does not run in `npm test` |
| REQ-005 | Scenarios make no API call | The harness runs fully in-process with `0` provider calls |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 scenarios record `PASS` against the real extension.
- **SC-002**: The extension's own `npm run check` stays green.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Harness joins the default test glob | Pollutes `npm test` | Keep the harness under `benchmark/`, out of the `tests/` glob |
| Dependency | Shared `deep-pi/tests/fake-pi.ts` | Harness needs the fake host | Reuse the cross-fork test double |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope and behavior were fixed from the `index.ts` source before authoring the scenarios.

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Playbook:** `../../../.pi/extensions/pi-cache-optimizer/manual-testing-playbook/manual-testing-playbook.md`
