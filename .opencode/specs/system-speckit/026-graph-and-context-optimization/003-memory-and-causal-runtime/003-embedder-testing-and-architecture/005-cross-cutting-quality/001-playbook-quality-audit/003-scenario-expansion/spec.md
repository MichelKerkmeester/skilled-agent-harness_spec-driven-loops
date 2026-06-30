---
title: "017/003: Scenario expansion"
description: "Repair stale cat-24 scenarios and add deterministic scenarios for uncovered or happy-path-only tool surfaces."
trigger_phrases:
  - "017/003 scenario expansion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/003-scenario-expansion"
    last_updated_at: "2026-05-17T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scenario expansion completed"
    next_safe_action: "Review evidence/scenario-expansion-summary.csv"
    blockers: []
    key_files:
      - "evidence/scenario-expansion-summary.csv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000017003"
      session_id: "017-003-scenario-expansion"
      parent_session_id: "017-playbook-quality-audit"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# 017/003: Scenario expansion

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Level | 1 |
| Priority | P1 |
| Status | Complete |
| Branch | main |
| Parent | `017-playbook-quality-audit` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
Repair stale cat-24 scenarios and add deterministic scenarios for uncovered or happy-path-only tool surfaces.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
In scope: `manual_testing_playbook/**` live scenarios and packet-local evidence under this child folder.

Out of scope: `z_archive/**`, rerunning newly authored scenarios, and changing mk-spec-memory runtime behavior.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Produce the phase evidence artifact | `evidence/scenario-expansion-summary.csv` exists |
| REQ-002 | Keep evidence reproducible | `../evidence/generate-playbook-quality-audit.js` can regenerate the artifact |
| REQ-003 | Preserve strict scope | Only packet docs/evidence and scoped playbook files are changed |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Evidence artifact is present and populated.
- The phase tasks document records counts and verification.
- The packet validates with `validate.sh --strict`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- Heuristic audit classification can miss narrative-only stale assumptions; exact-ID and fixed-path checks are stricter than prose checks.
- Coverage audit counts textual invocation in playbook scenarios, not runtime execution success.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
None for this phase.
<!-- /ANCHOR:questions -->
