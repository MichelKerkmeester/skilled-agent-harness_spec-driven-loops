---
title: "Feature Specification: deep-context runtime-robustness parity"
description: "The host-driven deep-context loop landed without the shared deep-loop-runtime durability and validation layer the mature deep loops use, so it lacked crash-safe state writes, corrupt-tail recovery, seat-output validation, single-writer locking, and a CLI-dispatch recursion guard."
trigger_phrases:
  - "runtime robustness parity"
  - "deep-context atomic state"
  - "jsonl repair"
  - "post-dispatch validate"
  - "loop lock"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-deep-context-gathering/002-runtime-robustness-parity"
    last_updated_at: "2026-06-06T23:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 doc set for the shipped runtime-robustness-parity phase"
    next_safe_action: "Operator: exercise the 5 robustness features in a live context loop run"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-context/scripts/loop-lock.cjs"
    session_dedup:
      fingerprint: "sha256:2b71f0c4a9d35ee2c6184f93a17d4cb5e820a6713fd9c2ee4407b51a9c6d3e72"
      session_id: "dc-134-002-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "5 robustness features wired and gated to loop_type='context'; research/review unchanged"
      - "bayesian-scorer and fanout-run excluded as non-gaps with documented rationale"
      - "Host-driven loop-lock owner id is host-provided and reused across acquire/release"
---
# Feature Specification: deep-context runtime-robustness parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 001 shipped the deep-context loop as a host-driven consumer of `deep-loop-runtime`, but it skipped the runtime's durability and validation layer that `deep-research` and `deep-review` already rely on. This phase brings deep-context to robustness parity by wiring five runtime features into the host-driven loop, every one gated to `loop_type='context'` so research and review behavior is untouched: crash-safe atomic state writes, corrupt-tail JSONL recovery, seat-output validation before merge, single-writer loop locking, and a CLI-dispatch recursion guard. Two further runtime features were evaluated and excluded as non-gaps with recorded rationale.

**Key Decisions**: both deep-context `.cjs` scripts import the runtime TypeScript helpers in-process via the tsx CJS register (dual-use safe) with contract-equivalent inline fallbacks; the loop-lock owner id is host-provided and reused across acquire/release because a host loop is not one long-lived process; `bayesian-scorer` and the disjoint-slice `fanout-run/pool/salvage` mode are deliberately excluded.

**Critical Dependencies**: the `deep-loop-runtime` helper modules (`atomic-state.ts`, `jsonl-repair.ts`, `post-dispatch-validate` contract, `loop-lock.ts`, `executor-audit.ts`) and the tsx CJS register shipped with `system-spec-kit`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Branch** | `134-deep-context-gathering` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The phase-001 deep-context loop is host-driven: the host runs `reduce-state.cjs` to merge seat findings and write the findings registry and dashboard, and the workflow YAMLs run prose-only lock and dispatch steps. That implementation skipped the shared `deep-loop-runtime` durability and validation layer the mature loops use. As shipped, deep-context could leave a half-written registry or dashboard on a crash, could not recover a crash-corrupted trailing JSONL line, merged seat findings without validating them, had no single-writer lock guarantee, and let a CLI seat recursively launch another deep-context loop with no recursion guard.

### Purpose
Bring deep-context to durability and validation parity with `deep-research` and `deep-review` by wiring the five shared-runtime robustness features into the host-driven loop, all gated behind `loop_type='context'`, so deep-context inherits the same crash-safety, output-validation, single-writer, and audited-dispatch guarantees without changing research or review behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **atomic-state**: `reduce-state.cjs` writes the findings registry through the runtime `writeStateAtomic` helper and the dashboard via an atomic temp+fsync+rename text write.
- **jsonl-repair**: `reduce-state.cjs` calls the runtime `repairJsonlTail` on the state log before reading and surfaces `{repaired, droppedBytes}` as `registry.stateLogRepair`.
- **post-dispatch-validate**: `reduce-state.cjs` `validateSeatFinding` checks each seat finding before merge; invalid findings surface in `registry.seatValidationWarnings` and are never silently merged.
- **loop-lock**: new `loop-lock.cjs` wraps the runtime `acquireLoopLock`/`refreshLoopLock`/`releaseLoopLock`; the auto and confirm workflow YAMLs invoke it from `step_acquire_lock`/`step_release_lock`.
- **executor-audit**: the workflow YAML `cli_contract` sets the runtime executor-audit recursion-guard env (`SPECKIT_CLI_DISPATCH_STACK` via `buildExecutorDispatchEnv`) so a CLI seat cannot recursively launch another deep-context loop.

### Out of Scope
- `bayesian-scorer` executor demotion — neither research nor review uses it; excluded as a non-gap (see decision-record ADR-002).
- The disjoint-slice `fanout-run`/`fanout-pool`/`fanout-salvage` lineage mode — deep-context uses by-model-shared-scope council dispatch by design, not disjoint-slice lineages; excluded as a non-gap (ADR-002).
- Any change to research or review behavior; every wired feature dispatches on `loop_type='context'`.
- New MCP tools — prohibited by the runtime isolation ADR (phase 001 ADR-007).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-context/scripts/reduce-state.cjs` | Modify | Atomic registry + dashboard writes, `repairJsonlTail` on the state log, `validateSeatFinding` pre-merge, surface `stateLogRepair`/`seatValidationWarnings`/`stateSafety` |
| `.opencode/skills/deep-context/scripts/loop-lock.cjs` | Create | Host-facing wrapper over the runtime loop-lock helper (acquire/refresh/release) with inline fallback |
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | Modify | `step_acquire_lock`/`step_release_lock` invoke `loop-lock.cjs`; `cli_contract` sets the executor-audit recursion-guard env |
| `.opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml` | Modify | Same lock and `cli_contract` wiring as the auto workflow |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Crash-safe atomic state writes | `reduce-state.cjs` writes the findings registry via `writeStateAtomic` and the dashboard via temp+fsync+rename; a crash leaves either the previous complete file or the new one, never a half-written file, and no `.tmp` leftover |
| REQ-002 | Corrupt-tail JSONL recovery before read | `reduce-state.cjs` calls `repairJsonlTail` on `deep-context-state.jsonl` before reading; the result `{repaired, droppedBytes}` is surfaced as `registry.stateLogRepair` |
| REQ-003 | Seat-output validation before merge | `validateSeatFinding` checks known kind, path-or-symbol presence, and numeric relevance for each seat finding; invalid findings are recorded in `registry.seatValidationWarnings` and never merged |
| REQ-004 | Single-writer loop locking | `loop-lock.cjs` exposes acquire/refresh/release over the runtime helper; the workflow YAMLs acquire on start and release on halt/cancel/complete with a stable host-provided owner id |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | CLI-dispatch recursion guard | The workflow `cli_contract` spawns each CLI seat with the executor-audit dispatch env (`SPECKIT_CLI_DISPATCH_STACK` via `buildExecutorDispatchEnv`) so a seat cannot recursively launch another deep-context loop |
| REQ-006 | Research/review parity preserved | Every wired feature is gated to `loop_type='context'`; runtime helpers are imported, not modified; `node --check` passes both `.cjs` scripts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fixture smoke run of `reduce-state.cjs` reports `stateSafety: "runtime"`, `stateLogRepaired: true`, and at least one `seatValidationWarnings` entry, with no `.tmp` leftover beside the registry or dashboard.
- **SC-002**: The `loop-lock.cjs` acquire/refresh/release cycle succeeds against a lock file, and acquire and release share the host-provided owner id.
- **SC-003**: `node --check` passes both `reduce-state.cjs` and `loop-lock.cjs`; the wired features do not alter research or review behavior (all gated on `loop_type='context'`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | tsx CJS register unavailable at runtime | Med — runtime helpers cannot load | Contract-equivalent inline fallback in both scripts; `stateSafety.source` reports `inline` when used |
| Risk | Stale loop lock blocks a fresh run | Med — loop cannot start | Runtime helper does stale-lock reclaim via `processAlive`/`isStaleLoopLock`; advisory locking on macOS/BSD, confirm-only override |
| Risk | Wrong owner id on release leaves a lock | Low — release is a no-op | Owner id is host-provided and reused across the acquire/release pair; release is owner-scoped and idempotent |
| Dependency | `deep-loop-runtime` helper modules | High — features wrap them | Imported in-process; inline fallbacks keep the scripts functional if import fails |
| Dependency | `system-spec-kit` tsx CJS register | Med — needed for in-process import | Path resolved relative to the script; fallback path on failure |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The in-process tsx import is memoized (`_stateSafety` cache) so the runtime helpers load once per reducer invocation, not per write.

### Security
- **NFR-S01**: The executor-audit recursion guard prevents a CLI seat from recursively launching another deep-context loop; seats stay read-only and the host writes all merged state.

### Reliability
- **NFR-R01**: Atomic temp+fsync+rename writes guarantee a reader always sees a complete file; `repairJsonlTail` recovers a crash-corrupted trailing JSONL line before the reducer reads the state log.

---

## 8. EDGE CASES

### Data Boundaries
- Empty or missing state log: `repairJsonlTail` returns `{repaired: false, droppedBytes: 0}`; the reducer proceeds with no registry repair entry beyond the default.
- All seat findings valid: `registry.seatValidationWarnings` is an empty array; nothing is dropped.

### Error Scenarios
- tsx register or runtime helper import fails: the inline `writeStateAtomicInline`/`repairJsonlTailInline` fallbacks run and `stateSafety.source` is `inline`.
- Lock already released on a second release call: the owner-scoped release is idempotent and returns cleanly.
<!-- ANCHOR not required for sections 7-10 -->

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | 2 scripts + 2 workflow YAMLs; 5 features wired, 0 runtime files modified |
| Risk | 16/25 | Shared-runtime helpers reused in a host-driven context; crash-safety + locking correctness |
| Research | 12/20 | Built on the phase-001 design research and the runtime's existing helper contracts |
| Multi-Agent | 8/15 | Heterogeneous CLI + native seats under a recursion guard |
| Coordination | 8/15 | Gated parity work across reducer, lock wrapper, and both workflow YAMLs |
| **Total** | **58/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Half-written registry/dashboard on crash | H | L | Atomic temp+fsync+rename; verified no `.tmp` leftover in the fixture smoke run |
| R-002 | Crash-corrupted JSONL tail breaks the read | M | M | `repairJsonlTail` before read; surfaces dropped bytes; verified `stateLogRepaired: true` |
| R-003 | A context feature leaks into research/review | H | L | Every feature gated on `loop_type='context'`; runtime helpers imported, not modified |
| R-004 | CLI seat recursively launches a context loop | M | L | `cli_contract` sets `SPECKIT_CLI_DISPATCH_STACK` via `buildExecutorDispatchEnv` |

---

## 11. USER STORIES

### US-001: Crash-safe context state (Priority: P0)

**As an** operator running a long context loop, **I want** the registry and dashboard written atomically, **so that** a crash mid-write never leaves a corrupted report the next planning run would read.

**Acceptance Criteria**:
1. Given a reducer run, When it writes the registry and dashboard, Then a reader sees either the previous complete file or the new one and no `.tmp` file is left behind.

### US-002: Recursion-guarded CLI seats (Priority: P1)

**As a** runtime maintainer, **I want** CLI seats spawned with the executor-audit recursion guard, **so that** a context-loop seat cannot recursively launch another context loop.

**Acceptance Criteria**:
1. Given the `cli_contract` dispatch, When a CLI seat is spawned, Then its env carries `SPECKIT_CLI_DISPATCH_STACK` appended with this loop's kind via `buildExecutorDispatchEnv`.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None open. Phase shipped and verified; the remaining step is an operator exercising the features in a live `/deep:start-context-loop` run.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase Parent**: `../spec.md` (deep-context loop phase parent)
- **Sibling Phase**: `../001-context-loop-foundation/spec.md` (the foundational loop build)
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Decision Records**: `decision-record.md`
