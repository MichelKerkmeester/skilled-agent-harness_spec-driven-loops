---
title: "Spec: system-code-graph Vitest Suite Triage"
description: "Phase 007 of arc 009 left 31 pre-existing vitest failures in the broader system-code-graph suite as a documented out-of-scope baseline. This phase triages each failure to one of: fix, skip-with-reason, or document-as-known-limitation with follow-on packet pointer."
trigger_phrases:
  - "system-code-graph-suite-triage"
  - "009 phase 011"
  - "code-graph 31 failures triage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/032-code-graph-scatter/014-code-graph-suite-triage"
    last_updated_at: "2026-05-22T15:53:50Z"
    last_updated_by: "codex"
    recent_action: "completed-arc-009-phase-011-system-code-graph-suite-triage"
    next_safe_action: "start-arc-009-phase-012-rss-benchmark"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a01010101010101010101010101010101010101010101010101010101010101"
      session_id: "009-memory-leak-remediation-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Source baseline documented in arc 009 phase 007 implementation-summary.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: system-code-graph Vitest Suite Triage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-05-22 |
| **Parent Spec** | ../spec.md |
| **Phase** | 011 of 013 |
| **Predecessor** | (none — independent follow-on) |
| **Successor** | (none — independent follow-on) |
| **Handoff Criteria** | Per-test triage outcome recorded; suite restored to green or documented exclusions explicit. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 011 of the memory-leak remediation arc. Source baseline lives in `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md` (the Limitations anchor).

**Scope Boundary**: triage the 12 vitest files (31 failing tests) listed in the phase 007 closure as a pre-existing baseline.

**Dependencies**:
- Arc 009 phase 007 implementation-summary as the source of the failing-test inventory.

**Deliverables**:
- Per-failing-test classification: bug-fix-now / skip-with-rationale / quarantine-with-follow-on-packet.
- Either green broader suite OR explicit `.skip` calls with reason + tracking issue.

**Changelog**:
- When this phase closes, refresh the parent arc 009 status and remediation-map item annotation.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Arc 009 phase 007 shipped the code-graph launcher single-owner + closeDb lifecycle work but used a targeted-gate (lib/owner-lease + launcher-lease) for verification. The broader `system-code-graph` vitest suite reported `12 files | 45 passed | 1 skipped (58)` and `31 failed | 518 passed | 7 skipped (556)` across surfaces unrelated to phase 007's scope. Failing surfaces: runtime-detection, graph-payload-validator, tree-sitter-parser, code-graph-context-cocoindex-telemetry-passthrough, code-graph-context-handler, walker-dos-caps, edge-metadata-sanitize, code-graph-query-handler, startup-brief, auto-rescan-policy, code-graph-siblings-readiness, symlink-realpath-hardening.

### Purpose
Restore the broader `system-code-graph` vitest suite to a green or explicitly-quarantined baseline so future regressions surface against a clean signal.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Triage each of the 31 failing tests in the 12 named files.
- Land bug fixes for tests whose failures reflect real product bugs.
- `.skip()` tests with documented rationale + a follow-on packet pointer for tests that need broader work.
- Update phase 007's `implementation-summary.md` Limitations anchor to reflect the resolved baseline.

### Out of Scope
- Architectural refactors of the code-graph subsystem.
- Adding new features beyond the test surfaces being triaged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/tests/` | Modify | Per-failing-test triage. |
| `.opencode/skills/system-code-graph/mcp_server/` | Modify (only when triage uncovers real product bugs) | Bug fixes scoped to the failing assertion. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every one of the 31 pre-existing failing tests has a recorded triage outcome (fix / skip / quarantine). | Evidence is captured in this phase's implementation summary with a per-file table. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Broader `system-code-graph` vitest suite reports 0 failing tests (skipped + green only). | `node node_modules/vitest/vitest.mjs run --config vitest.config.ts` exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Per-failing-test triage table in `implementation-summary.md` covering all 12 files / 31 tests with outcome + evidence link.
- **SC-002**: Broader suite exits 0; any quarantined tests have `.skip("triage: <reason> — <follow-on packet pointer>")`.
- **SC-003**: Arc 009 phase 007 `implementation-summary.md` Limitations anchor updated to reflect resolved baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Triage reveals a real product bug requiring deeper change | Could enlarge scope beyond this phase. | Bound bug fixes to direct test surface; defer broader refactors to a new packet. |
| Risk | Some failures are environment-dependent (sandbox-blocked) | False "fix" if test passes in CI but not locally. | Document environment dependencies explicitly; do not assert green unless reproducible. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time; phase-specific questions must be recorded here before implementation begins.
<!-- /ANCHOR:questions -->
