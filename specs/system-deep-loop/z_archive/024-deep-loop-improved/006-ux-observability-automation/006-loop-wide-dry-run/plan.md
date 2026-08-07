---
title: "Implementation Plan: Loop-Wide Dry-Run Mode"
description: "Documents the completed deep-research dry-run flag and mutation-boundary halt hooks."
trigger_phrases:
  - "loop wide dry run"
  - "dry run mode"
  - "deep research dry run"
  - "no dispatch dry run"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/006-ux-observability-automation/006-loop-wide-dry-run"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/commands/deep/research.md"
      - ".opencode/commands/deep/assets/deep_research_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Loop-Wide Dry-Run Mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research command markdown and confirm-mode YAML |
| **Framework** | Deep-loop confirm workflow with mutation-boundary guards |
| **Storage** | No state writes in dry-run mode; JSONL halt events only |
| **Testing** | Dry-run integration fixture, mutation-boundary checks, strict spec validation |

### Overview
This completed work added `--dry-run` as a first-class deep-research input for safe pre-flight inspection. Dry-run executes setup, focus selection, prompt rendering, and convergence reads, then halts at dispatch, state/queue mutation, reducer refresh, and child-spawn boundaries without writing state or spawning executors.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: operators could not inspect a run without side effects.
- [x] Success criteria measurable: dry-run emits `dry_run_halt` at mutation boundaries and performs no dispatch.
- [x] Dependencies identified: dry-run references mutation boundaries established by earlier leaves.

### Definition of Done
- [x] `research.md` documents `--dry-run` as a first-class flag on confirm flow.
- [x] `deep_research_confirm.yaml` halts at dispatch, state/queue mutation, reducer refresh, and child spawn.
- [x] Non-mutating setup, focus selection, prompt render, and convergence read still run.
- [x] Dry-run emits `dry_run_halt` events with boundary labels.
- [x] Dry-run performs no state writes, queue mutation, reducer refresh, executor dispatch, or child spawn.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-path execution with mutation fences: dry-run follows the real setup path until a mutation boundary, emits an auditable halt event, and skips the side-effecting operation.

### Key Components
- **`research.md`**: Documents `--dry-run` and clarifies that it is a flag on confirm flow, not a third execution mode.
- **`deep_research_confirm.yaml`**: Adds halt hooks at dispatch, state/queue mutation, reducer refresh, and child-spawn boundaries.
- **`dry_run_halt` events**: Record each skipped mutation boundary for operator review.
- **Non-mutating steps**: Setup, focus selection, prompt render, and convergence read continue to run for useful inspection.

### Data Flow
The operator invokes deep research with `--dry-run`, the confirm YAML performs setup and read-only analysis, and each side-effecting boundary checks the flag before execution. Instead of mutating state or dispatching work, the workflow emits `dry_run_halt` with the boundary name and continues or exits according to the dry-run contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `research.md` | Operator command contract | Document `--dry-run` input and semantics | Help text distinguishes dry-run from confirm |
| `deep_research_confirm.yaml` dispatch boundary | Spawns executors | Halt with `dry_run_halt` | Dry-run spawns no executor |
| State and queue mutation boundaries | Persist run state | Halt before mutation | No state or queue files change |
| Reducer refresh and child spawn boundaries | Update outputs and child contexts | Halt before side effects | No reducer output rewrite or child spawn |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and confirm confirm-flow dry-run scope.
- [x] Inventory mutation boundaries in `deep_research_confirm.yaml`.
- [x] Keep fan-out dry-run and UI output changes out of scope.

### Phase 2: Core Implementation
- [x] Document `--dry-run` in `research.md` as a first-class input.
- [x] Add dispatch-boundary halt hook.
- [x] Add state and queue mutation halt hooks.
- [x] Add reducer refresh halt hook.
- [x] Add child-spawn halt hook.
- [x] Emit `dry_run_halt` events with boundary labels.

### Phase 3: Verification
- [x] Verify setup, focus selection, prompt render, and convergence read still execute.
- [x] Verify dry-run performs no executor dispatch.
- [x] Verify no state writes, queue mutation, reducer refresh, or child spawn occurs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | `--dry-run` confirm flow through read-only steps | Deep-research confirm fixture |
| Mutation boundary | Dispatch, state, queue, reducer, and child-spawn halts | Boundary assertions |
| Event output | `dry_run_halt` boundary labels | JSONL output inspection |
| Spec validation | Leaf packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing confirm-mode mutation boundaries | Internal | Complete | Dry-run needs stable boundaries to halt safely |
| Earlier phase 006 mutation points | Internal predecessors | Complete | Dry-run references dispatch and memory/reducer mutation points |
| Fan-out dry-run | Out of scope | Not required | Single-loop confirm dry-run ships independently |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Dry-run mutates state, skips useful read-only setup, or fails to emit boundary-specific halt events.
- **Procedure**: Remove the `--dry-run` command documentation and halt hooks from `deep_research_confirm.yaml`, restoring the previous side-effecting confirm flow.
<!-- /ANCHOR:rollback -->
