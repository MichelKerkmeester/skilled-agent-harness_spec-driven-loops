---
title: "Feature Specification: Deep-Loop and CLI Contract Drift"
description: "The orchestration tooling documents behavior its runtime does not implement. A skill declares an executor kind absent from the runtime's allowlist, a documented convergence flag is silently dropped by the fan-out path, a timeout flag is doc"
trigger_phrases:
  - "deep loop and cli contract drift"
  - "017 phase 007"
  - "findings remediation 007"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/007-deep-loop-and-cli-contract-drift"
    last_updated_at: "2026-07-27T08:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase spec from the audit findings"
    next_safe_action: "Wait for phase 001 dispositions before acting"
    blockers: ["Gated on phase 001 triage dispositions"]
    key_files:
      - "spec.md"
      - "../../016-dead-code-and-architecture-audit/findings-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Remediation acts only on findings dispositioned CONFIRMED by phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deep-Loop and CLI Contract Drift

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 007 of 009 |
| **Findings in scope** | 6 |
| **Blast radius** | Med-High |
| **Predecessor** | ../006-hub-doc-runtime-drift/spec.md |
| **Successor** | ../008-runtime-mirror-and-mcp-config/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 007** of the findings remediation program. Source findings: `../../016-dead-code-and-architecture-audit/findings-report.md`.

**Scope Boundary**: This phase acts only on findings that phase 001 dispositioned CONFIRMED.

**Deliverables**:
- Per-finding record of what was done and why.
- `implementation-summary.md` with counts and any deferrals.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The orchestration tooling documents behavior its runtime does not implement. A skill declares an executor kind absent from the runtime's allowlist, a documented convergence flag is silently dropped by the fan-out path, a timeout flag is documented as raising a ceiling it cannot raise, and a CI mirror checker misses most drift it claims to detect. This audit hit four of these while trying to use the tooling.

### Purpose

Make each tooling contract and its runtime agree, deciding per case whether the documentation overpromised or the runtime under-delivered.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The cli-devin executor kind declared in the skill but absent from the runtime allowlist and fan-out script
- The --convergence-mode flag silently dropped by the fan-out lineage prompt
- The --lineage-timeout-hours flag documented as raising a hard ceiling it can only narrow
- The mirror-sync checker whose token-set comparison misses most drifted agents
- The workflow that watches a directory its checker never compares
- A model reference document naming an executor that does not exist

### Out of Scope

- Implementing a Devin fan-out adapter unless the operator explicitly wants one

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `(cli-devin SKILL.md)` | Modify | Reconcile the executor-kind claim with the runtime |
| `(fan-out runtime or research command doc)` | Modify | Either thread the convergence flag or document that fan-out ignores it |
| `(mirror-sync checker)` | Modify | Replace the comparison that misses drift |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each drift is resolved by an explicit decision: fix the doc, or fix the runtime | Decision and rationale recorded per finding |
| REQ-002 | A silently-dropped flag either works or warns | No flag is accepted and then ignored without a signal to the caller |
| REQ-003 | The mirror-sync checker detects the drift it claims to detect | A seeded drift case is caught by the checker |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Changes to shared deep-loop runtime do not alter existing fan-out behavior unintentionally | Existing tests pass; behavior change is deliberate and recorded |
| REQ-005 | Findings are re-checked against current HEAD before action | A concurrent session modified cli-devin during the audit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No documented flag is silently ignored.
- **SC-002**: No skill declares a runtime capability that does not exist.
- **SC-003**: The mirror-sync checker catches a deliberately seeded drift.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Threading the convergence flag changes behavior in existing fan-out runs | Medium | Treat as a deliberate behavior change; record it and check existing callers |
| Risk | Implementing an adapter to match a doc nobody wanted | Medium | Default to correcting the doc; building the adapter needs an explicit decision |
| Risk | A concurrent session is actively modifying this surface | High | Re-verify each finding against current HEAD immediately before acting |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which findings in this phase does the operator approve for execution?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Audit findings**: `../../016-dead-code-and-architecture-audit/findings-report.md`
- **Phase parent**: `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
