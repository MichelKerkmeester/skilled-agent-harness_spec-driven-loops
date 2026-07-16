---
title: "Verification Checklist: /doctor:code-graph apply-mode Phase B [system-code-graph/031-code-graph-buildout/005-resilience-and-advisor/005-doctor-apply-mode-implementation/checklist]"
description: "REQ-aligned verification checklist for Phase B apply-mode."
trigger_phrases:
  - "doctor code graph apply checklist"
  - "013 doctor apply mode verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/005-resilience-and-advisor/005-doctor-apply-mode-implementation"
    last_updated_at: "2026-05-08T22:45:00Z"
    last_updated_by: "codex"
    recent_action: "Verified apply-mode implementation against targeted TypeScript and Vitest gates"
    next_safe_action: "Packet complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-apply-mode-phase-b-2026-05-08"
      parent_session_id: "doctor-apply-mode-phase-b-2026-05-08"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: /doctor:code-graph apply-mode Phase B

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `spec.md` documents REQ-001 through REQ-014.
- [x] CHK-002 [P0] `plan.md` defines technical approach and rollback.
- [x] CHK-003 [P1] Prerequisite artifacts are identified and available.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] TypeScript compile passes. Evidence: `node ../node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json`.
- [x] CHK-011 [P0] `code_graph_apply` has schema validation and rejects unknown fields. Evidence: `tool-schemas.ts` + `schemas/tool-input-schemas.ts`.
- [x] CHK-012 [P1] Recovery procedures use typed functions, not arbitrary shell. Evidence: `recovery-procedures.ts`.
- [x] CHK-013 [P1] Phase A `auto` and `confirm` YAMLs remain unchanged. Evidence: `git diff -- doctor_code-graph_auto.yaml doctor_code-graph_confirm.yaml` empty.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001 pre-flight battery gate verified. Evidence: `code-graph-apply-orchestrator.vitest.ts`.
- [x] CHK-021 [P0] REQ-002 post-flight battery gate verified. Evidence: `code-graph-apply-orchestrator.vitest.ts`.
- [x] CHK-022 [P0] REQ-003 rollback on post-flight failure verified. Evidence: `code-graph-apply-orchestrator.vitest.ts` and `code-graph-recovery-procedures.vitest.ts`.
- [x] CHK-023 [P0] REQ-004 self-healing boundary verified. Evidence: `code-graph-apply-e2e.vitest.ts`.
- [x] CHK-024 [P1] REQ-005 re-scan routing verified. Evidence: soft-stale incremental and hard-stale full scan tests.
- [x] CHK-025 [P1] REQ-006 exclude confidence tier behavior verified. Evidence: prune-excludes test covers high apply and medium confirm block.
- [x] CHK-026 [P1] REQ-007 repair-nodes quarantine gate verified. Evidence: orchestrator repair-nodes gate implementation.
- [x] CHK-027 [P1] REQ-008 all three recovery procedures verified. Evidence: `code-graph-recovery-procedures.vitest.ts`.
- [x] CHK-028 [P1] REQ-010 JSONL audit provenance verified. Evidence: orchestrator tests assert `apply-audit` path and audit event writes.
- [x] CHK-029 [P2] REQ-011 all 12 recovery-playbook scenarios verified. Evidence: `code-graph-apply-e2e.vitest.ts` scenario table.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [x] CHK-060 [P1] Handler remains thin and delegates to typed orchestrator.
- [x] CHK-061 [P1] Recovery procedures remain typed TypeScript operations.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Public tool registration inventory completed.
- [x] CHK-FIX-002 [P0] Runtime consumer inventory completed for `code_graph_apply`.
- [x] CHK-FIX-003 [P1] Status consumer impact checked for apply metrics.
- [x] CHK-FIX-004 [P1] Filesystem rollback paths constrained to code graph data dir.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No writes outside workspace/code graph data dir during recovery.
- [x] CHK-031 [P0] DB triplet operations validate names and paths.
- [x] CHK-032 [P1] Audit logs contain paths/counts only, not source code contents.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-070 [P2] Battery tests use injected query handlers for bounded runtime.
- [x] CHK-071 [P2] Recovery tests use sandbox DB triplets and avoid workspace scans.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-080 [P1] `code_graph_apply` is registered in public and runtime schemas.
- [x] CHK-081 [P1] Command workflow points to the implemented MCP tool.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-090 [P0] No arbitrary shell execution in recovery procedures.
- [x] CHK-091 [P1] Phase A diagnostic YAMLs unchanged.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Command markdown documents apply-mode invocation and procedure links.
- [x] CHK-041 [P1] Implementation summary records verification evidence.
- [x] CHK-042 [P2] Recovery markdown report deferred with reason.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-100 [P1] Apply-mode command docs appended.
- [x] CHK-101 [P1] ADRs record battery, recovery, rollback, and self-healing decisions.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New code lives under `code_graph/handlers` and `code_graph/lib`.
- [x] CHK-051 [P1] New tests live under `mcp_server/tests`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 12/12 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-05-08
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

- [x] CHK-110 [P0] Targeted TypeScript and Vitest gates passed.
- [x] CHK-111 [P0] Strict spec validation passed. Evidence: `validate.sh ... --strict --verbose` exited 0.
<!-- /ANCHOR:sign-off -->
