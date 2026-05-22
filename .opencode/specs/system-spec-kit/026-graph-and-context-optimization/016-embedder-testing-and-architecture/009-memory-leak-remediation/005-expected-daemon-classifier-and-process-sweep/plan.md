---
title: "Plan: Expected Daemon Classifier and Process Sweep"
description: "Concrete implementation plan for the dry-run process sweep and expected-daemon classifier."
trigger_phrases:
  - "expected-daemon-classifier-and-process-sweep"
  - "memory leak 5"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep"
    last_updated_at: "2026-05-22T13:13:51Z"
    last_updated_by: "opencode"
    recent_action: "completed-phase-005-daemon-classifier-sweep"
    next_safe_action: "start-006-cocoindex-remove-cancel"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0505050505050505050505050505050505050505050505050505050505050505"
      session_id: "009-memory-leak-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 005 is inventory-first and must not add live process termination."
      - "Apply behavior is deferred to phase 010 operator-confirmation gates."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Expected Daemon Classifier and Process Sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript ESM under `@spec-kit/scripts` |
| **Framework** | Spec Kit process-memory harness and Vitest |
| **Storage** | In-memory process inventory rows plus PID-lock evidence |
| **Testing** | Targeted Vitest, `@spec-kit/scripts` typecheck/build, strict spec validation |

### Overview
Phase 005 adds `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts`, a dry-run sweep surface that consumes the phase-002 inventory from `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` and emits a termination plan. The plan rows include `{ pid, ppid, command, classification, eligibleForTermination, rationale }`, but default behavior remains inventory-only and no code path sends a signal.

The implementation extends the existing harness rather than replacing it. The harness keeps responsibility for `ps`, `vm_stat`, `sysctl`, ancestry, PID-lock state, and process classification; the sweep module owns the stricter four-condition eligibility gate required by remediation-map items #6 and #15.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source evidence from packet 020 was read for daemon classification and external-tool cleanup.
- [x] Source evidence from packet 024 was read for `mcp-host-session-process-sweep`.
- [x] Phase 002 harness and tests were read before source edits.
- [x] Phase 004 `processAlive` semantics were read: `EPERM` means alive and `ESRCH` means dead.

### Definition of Done
- [x] `process-sweep.ts` defaults to `plan` dry-run and never sends signals.
- [x] Sweep eligibility is only true for `stale-pid-lock` or `orphaned-project-daemon` after self-PID, ancestry, and known-project-owner checks pass.
- [x] Harness taxonomy separates expected warm daemons, external MCP stdio, browser sessions, `ccc` daemons, unknown owners, EPERM-alive rows, stale PID locks, and orphaned project daemons.
- [x] Fixture tests cover ancestors, EPERM, stale PIDs, sidecars, `ccc` daemons, external MCP stdio, browser sessions, and unknown owners.
- [x] Targeted Vitest, existing harness Vitest, typecheck, and build pass; strict final phase/arc validation is recorded in `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Inventory first, classify second, and produce a conservative no-signal sweep plan. Broad process-name kill patterns remain out of scope.

### Key Components
- **Harness extension**: export `getProcessAncestry(pid, rows)` from `process-memory-harness.ts`. It walks the PPID chain from the already parsed `ps` rows, matching the existing `getAncestorPids` behavior without rerunning `ps`.
- **Classifier taxonomy**: extend harness classification with explicit buckets for `external-mcp-stdio`, `browser-session`, and `ccc-daemon` where command evidence supports them. These buckets preserve by default.
- **Sweep surface**: add `process-sweep.ts` with `planSweep(inventory, options)` and a CLI supporting `plan` (default), `fixture`, and `apply --confirmed <token>`.
- **Apply boundary**: `apply` remains non-destructive in phase 005. Without the explicit confirmation token it prints what it would do and exits 0; with the token it still reports the eligible plan and records that live termination is deferred to phase 010.

### Data Flow
`collectInventory()` or `syntheticFixtureSnapshot()` builds an inventory. `planSweep()` derives ancestry for `opts.selfPid`, applies preservation rules in order, checks known project ownership markers for otherwise eligible rows, and returns rows plus summary counts. The CLI serializes the plan as JSON for operator review.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence and Docs
- Replace generic `plan.md` and `tasks.md` with this concrete file-scoped plan.
- Validate the phase folder after each doc replacement.

### Phase 2: Harness and Sweep Implementation
- Add `getProcessAncestry(pid, rows)` as an exported helper in `process-memory-harness.ts`.
- Add `process-sweep.ts` with `Inventory`, `SweepPlanRow`, `SweepPlan`, `planSweep()`, fixture/default inventory CLI behavior, and non-destructive apply handling.
- Extend harness taxonomy for external MCP stdio, browser sessions, and `ccc` daemons while preserving existing expected-daemon behavior.

### Phase 3: Verification and Handoff
- Add `process-sweep.vitest.ts` with all SC-001 fixtures.
- Run targeted Vitest, existing harness Vitest, typecheck, build, OpenCode alignment, and strict validation for the phase and parent arc.
- Fill `implementation-summary.md`, update the parent phase map/status evidence, and append `## Commit Handoff` with absolute paths.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Sweep eligibility ordering and rationale strings | `process-sweep.vitest.ts` |
| Unit | Harness taxonomy and ancestry helper coexistence | `process-memory-harness.vitest.ts` |
| CLI smoke | Fixture/default dry-run emits JSON and refuses destructive apply | Vitest or direct node command after build |
| Type safety | Scripts workspace compiles | `npm run typecheck --workspace=@spec-kit/scripts` |
| Build | Scripts workspace emits dist output | `npm run build --workspace=@spec-kit/scripts` |
| Spec validation | Phase and parent docs remain strict-valid | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 process-memory harness | Internal TypeScript module | Available | Sweep must not duplicate inventory collection. |
| Phase 004 lock semantics | Internal TypeScript module | Available | EPERM must be treated as alive and preserved. |
| Phase 008 sidecar ownership policy | Future phase | Not yet available | Phase 005 can classify sidecars but cannot terminate them. |
| Phase 010 operator confirmation gates | Future phase | Not yet available | `apply` must remain non-destructive in this phase. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Sweep tests fail, classification collapses expected daemons into eligible rows, or CLI behavior can send a signal.
- **Procedure**: Revert `process-sweep.ts`, the harness taxonomy/ancestry export, and `process-sweep.vitest.ts`; keep the phase docs and record failure evidence in `handover.md`.
- **Verification after rollback**: rerun existing `process-memory-harness.vitest.ts`, `@spec-kit/scripts` typecheck/build, and strict phase validation.
<!-- /ANCHOR:rollback -->
