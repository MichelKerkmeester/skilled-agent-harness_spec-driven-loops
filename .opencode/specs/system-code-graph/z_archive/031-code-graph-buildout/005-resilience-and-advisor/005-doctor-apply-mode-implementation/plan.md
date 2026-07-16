---
title: "Implementation Plan: /doctor:code-graph apply-mode Phase B [system-code-graph/031-code-graph-buildout/005-resilience-and-advisor/005-doctor-apply-mode-implementation/plan]"
description: "Plan for Phase B apply-mode: verification-gated code-graph repair, typed recovery procedures, rollback semantics, audit logging, and MCP exposure through code_graph_apply."
trigger_phrases:
  - "doctor code graph apply plan"
  - "code graph apply-mode plan"
  - "013 doctor apply mode phase b plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/005-resilience-and-advisor/005-doctor-apply-mode-implementation"
    last_updated_at: "2026-05-08T22:45:00Z"
    last_updated_by: "codex"
    recent_action: "Authored Level 3 implementation plan for Phase B apply-mode"
    next_safe_action: "Implement apply orchestrator, recovery procedures, handler, schemas, and tests"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/assets/doctor_code-graph_apply.yaml"
      - ".opencode/commands/doctor/code-graph.md"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/apply-orchestrator.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/apply.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-apply-mode-phase-b-2026-05-08"
      parent_session_id: "doctor-apply-mode-phase-b-2026-05-08"
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Ship --dry-run"
      - "Write JSONL audit logs under code_graph data dir apply-audit/"
      - "Skip markdown recovery report in MVP"
---
# Implementation Plan: /doctor:code-graph apply-mode Phase B

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, MCP server |
| **Framework** | system-spec-kit code_graph runtime |
| **Storage** | SQLite code graph triplet under `DATABASE_DIR` |
| **Testing** | Vitest, TypeScript `tsc --noEmit`, strict spec validation |

### Overview

Phase B adds a mutation-capable `code_graph_apply` tool and command workflow around the existing code graph scan, status, readiness, and verification surfaces. The implementation gates every operation on the 28-query gold battery, classifies freshness into `fresh`, `soft-stale`, and `hard-stale`, dispatches only typed recovery operations, and rolls back the DB triplet when post-flight verification fails.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `spec.md` authored and read first.
- [x] Four prerequisite artifacts confirmed available.
- [x] Phase A diagnostic surface identified and preserved.
- [x] Existing scan/status/readiness/DB runtime read before edits.

### Definition of Done
- [ ] `code_graph_apply` registered in schemas, dispatch, and handler exports.
- [ ] Apply-mode runs pre-flight and post-flight gold battery gates.
- [ ] Rollback quarantines bad triplets and restores known-good state when available.
- [ ] Audit log JSONL records every apply step under `apply-audit/`.
- [ ] Four targeted Vitest files pass.
- [ ] `pnpm tsc --noEmit` passes.
- [ ] Strict spec validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Thin MCP handler over a typed orchestration library. Runtime operations remain typed TypeScript calls. No shell commands execute recovery-playbook procedures.

### Key Components
- **`apply-orchestrator.ts`**: owns state classification, pre/post verification flow, operation dispatch, audit logging, dry-run semantics, and commit-or-rollback decision.
- **`gold-battery-runner.ts`**: loads the shipped gold battery, enforces artifact pass floors plus env overrides that can only raise floors, and runs queries through the existing code graph query handler.
- **`recovery-procedures.ts`**: implements CG-RP-001, CG-RP-002, and CG-RP-003 using SQLite APIs and filesystem triplet operations.
- **`exclude-rule-classifier.ts`**: reads the confidence-tier artifact and classifies candidate patterns into high, medium, low, or unknown.
- **`apply.ts` handler**: exposes `code_graph_apply` with bounded inputs and structured JSON responses.

### Data Flow

`code_graph_apply` starts with a gold-battery pre-flight. If the battery fails, the run aborts before mutation. If pre-flight passes, the orchestrator classifies current status into a staleness state, enforces the self-healing boundary, writes an audit event, snapshots the DB triplet as known-good, dispatches the selected operation, runs the post-flight battery, and either commits metadata or invokes CG-RP-003 rollback.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Documentation and Design
- [x] Author plan, tasks, checklist, and decision record from Level 3 templates.
- [x] Resolve open questions from `spec.md` §12.
- [x] Normalize command-path mismatch to current repo layout: `.opencode/commands/doctor/assets/doctor_code-graph_apply.yaml`.

### Phase 2: Runtime Implementation
- [ ] Add `gold-battery-runner.ts`, `exclude-rule-classifier.ts`, `recovery-procedures.ts`, and `apply-orchestrator.ts`.
- [ ] Add `handlers/apply.ts`, export it, register `code_graph_apply`, and add input validation.
- [ ] Surface apply metrics in `code_graph_status`.
- [ ] Update apply workflow YAML and append command markdown documentation without changing Phase A YAMLs.

### Phase 3: Verification
- [ ] Add the four requested Vitest files.
- [ ] Run targeted Vitest command.
- [ ] Run TypeScript compile.
- [ ] Run strict spec validation.
- [ ] Fill `implementation-summary.md`, checklist evidence, and metadata status.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## 4.1 PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Documentation and Design | Authored `spec.md`, four research artifacts | Runtime implementation |
| Runtime Implementation | Phase A runtime and existing scan/status/verify handlers | Tests |
| Verification | Runtime implementation and command docs | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 4.2 EFFORT

| Workstream | Effort | Notes |
|------------|--------|-------|
| Runtime libraries | High | DB triplet rollback and verification gates |
| MCP registration | Medium | Schema, dispatch, handler exports |
| Tests | High | Unit, recovery, and E2E scenario matrix |
| Documentation | Medium | Level 3 docs and command surface |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | State classifier, pass-floor overrides, exclude tier matching | Vitest |
| Integration | Recovery procedures over sandbox DB triplets | Vitest + temp dirs + better-sqlite3 |
| E2E | 12 recovery-playbook scenarios with injected scan/battery hooks | Vitest |
| Static | TypeScript typecheck and schema registration | `pnpm tsc --noEmit` |
| Spec | Level 3 docs and metadata contract | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Gold query battery | Research artifact | Available | Apply cannot mutate safely without pre/post verification |
| Staleness model | Research artifact | Available | Classifier boundary would be under-specified |
| Recovery playbook | Research artifact | Available | CG-RP procedure mapping would be ad hoc |
| Exclude confidence tiers | Research artifact | Available | Prune-excludes could over-apply risky patterns |
| Existing `code_graph_scan` | Runtime | Available | Re-scan and recovery procedures depend on it |
| Existing `code_graph_verify` / query handler | Runtime | Available | Battery runner delegates to existing query semantics |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:dependency-graph -->
## 6.1 DEPENDENCY GRAPH

```text
research assets -> apply libraries -> code_graph_apply -> command workflow
scan/status/readiness/db runtime -> recovery procedures -> apply orchestrator
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## 6.2 CRITICAL PATH

1. Wire library units.
2. Register `code_graph_apply`.
3. Verify rollback and battery gates.
4. Validate spec folder.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 6.3 MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Runtime wired | TypeScript compile |
| Recovery verified | `code-graph-recovery-procedures.vitest.ts` |
| Apply flow verified | Orchestrator and E2E Vitest files |
| Packet closed | Strict spec validation |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: post-flight battery failure, operation exception after snapshot, or explicit CG-RP-003 invocation.
- **Procedure**: move the live DB triplet into a timestamped `bad-apply-*` directory, restore the latest `known-good-*` triplet when available, run a full scan from source, and re-run the battery. If no known-good snapshot exists, leave the DB absent and let full scan recreate it from source.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## 7.1 ENHANCED ROLLBACK

Rollback writes an audit event, quarantines the failed triplet, restores known-good when present, and runs a full source rebuild. Repeated rollback attempts create new timestamped `bad-apply-*` directories and do not overwrite prior evidence.
<!-- /ANCHOR:enhanced-rollback -->
