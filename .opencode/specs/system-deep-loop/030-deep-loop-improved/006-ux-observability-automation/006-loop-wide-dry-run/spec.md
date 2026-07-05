---
title: "Loop-Wide Dry-Run Mode"
description: "There is no safe way to inspect what a deep-loop run would do without actually dispatching executors, mutating state, or writing reducer output: operators cannot verify setup, focus selection, and convergence reads without side effects."
trigger_phrases:
  - "loop wide dry run"
  - "dry run mode"
  - "006 loop wide dry run"
  - "deep research dry run"
  - "no dispatch dry run"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/006-ux-observability-automation/006-loop-wide-dry-run"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored leaf spec for 006-loop-wide-dry-run"
    next_safe_action: "Author plan.md and tasks.md before implementation"
    blockers: []
    key_files:
      - ".opencode/commands/deep/research.md"
      - ".opencode/commands/deep/assets/deep_research_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Loop-Wide Dry-Run Mode

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-per-iteration-memory-upsert |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict` passes; `--dry-run` flag documented in `research.md`; mutation boundaries confirmed to halt without side effects |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 6 of 6 within `006-ux-observability-automation`. It is last in the series because its dry-run halt hooks touch every mutation boundary established by the prior leaves.

**Scope Boundary**: `research.md` (flag documentation) and `deep_research_confirm.yaml` (halt hooks at mutation boundaries). No changes to `deep_research_auto.yaml` in this leaf (dry-run is a `confirm` YAML concern, not the `auto` flow).

**Dependencies**:
- Logically last: dry-run halts at mutation boundaries including dispatch (001-003 territory) and memory upsert (005); these mutation points must exist before halt hooks can reference them.
- No hard blocking dependency on any prior leaf.

**Deliverables**:
- `--dry-run` flag documented as first-class input in `research.md`
- Halt hooks in `deep_research_confirm.yaml` at: dispatch boundary, state/queue mutation, reducer refresh, child spawn
- Real setup/focus/prompt-render/convergence-read still executes in dry-run mode (no skipping setup)

**Changelog**:
- When this phase closes, refresh `../changelog/` using `156-ux-observability-006`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
There is no safe way for an operator to inspect what a deep-loop run would do without executing it: setup, focus selection, and convergence reads cannot be validated without risking executor dispatch, state mutations, reducer rewrites, or child spawns. Debugging a misconfigured loop requires a live run with real side effects.

### Purpose
Add `--dry-run` as a first-class input to `research.md` that runs real setup/focus selection/prompt-render/convergence-read steps but halts at every mutation boundary (no dispatch, no state/queue mutation, no reducer refresh, no child spawn), enabling safe pre-flight inspection of what a run would do.

> **Reference**: `external/kasper/src/tools.ts:39-62`; `handlers.ts:432-476,467` — `--dry-run` is a first-class flag that permits all read/setup operations up to the mutation boundary, then emits a `dry_run_halt` event instead of executing. (Research: research.md §5.5, iter 37)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `--dry-run` flag documented as first-class input in `research.md` (distinct from a third execution mode — it is a flag on the existing confirm flow)
- Halt hooks in `deep_research_confirm.yaml` at four mutation boundaries: dispatch, state/queue mutation, reducer refresh, child spawn
- Real non-mutating operations still execute: setup, focus selection, prompt render, convergence read
- `dry_run_halt` JSONL event emitted at each halted mutation boundary with the boundary label
- No state written, no executors dispatched, no queue mutated during dry-run

### Out of Scope
- Fan-out dry-run (spawning hermetic child contexts and running them in preview mode) — tagged as deep variant in research §5.5
- Changes to `deep_research_auto.yaml` — dry-run is a `confirm` YAML concern only
- New UI or interactive prompt for dry-run output — terminal output only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/research.md` | Modify | Document `--dry-run` as first-class input; describe halt semantics |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Modify | Add halt hooks at dispatch/state-mutation/reducer-refresh/child-spawn boundaries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--dry-run` halts at the dispatch boundary without spawning any executor | Integration test: invoke confirm YAML with `--dry-run` → assert no executor spawn, `dry_run_halt:{boundary:"dispatch"}` event emitted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Setup, focus selection, and convergence read still execute in dry-run mode (non-mutating steps are not skipped) | Integration test: `--dry-run` run shows focus selected and convergence read complete in output, but no state written |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `--dry-run` invocation of deep-research confirm YAML completes without any state file writes, executor dispatches, or reducer refreshes; `dry_run_halt` events appear at each boundary
- **SC-002**: `validate.sh --strict` on this folder exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A mutation boundary is missed in the halt hooks, causing unintended state writes during dry-run | High — defeats the dry-run guarantee | Enumerate all mutation boundaries in `deep_research_confirm.yaml` before implementation; test each boundary |
| Risk | `--dry-run` is confused with `--confirm` skip in operator usage | Low — cosmetic/docs | Document the distinction clearly in `research.md`: dry-run = run setup but halt before mutation |

> **Deep-variant note**: Fan-out dry-run (spawning hermetic child contexts in preview mode) is the deep variant — requires worktrees/sandbox substrate. This leaf covers single-loop mutation boundaries only. (Research: research.md §5.5, iter 37)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `--dry-run` output the rendered prompt (so operators can verify what the executor would receive), or only the setup/focus/convergence metadata?
- Is `dry_run_halt` appended to the standard JSONL ledger or to a separate dry-run output file?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
