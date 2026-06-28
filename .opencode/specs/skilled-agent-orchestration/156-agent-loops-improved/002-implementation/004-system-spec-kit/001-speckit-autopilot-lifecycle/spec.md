---
title: "Speckit Unattended/Autopilot Lifecycle"
description: "The speckit :auto flag reduces approval prompts but is not crash-safe for unattended runs: there is no branch-first envelope, no machine-readable terminal reason codes, and no branch-preserved failure path — making :auto insufficient for CI pipelines or scheduled pipelines where silent failure is unacceptable."
trigger_phrases:
  - "speckit autopilot lifecycle"
  - "speckit unattended"
  - "speckit complete autopilot"
  - "branch preserved failure"
  - "terminal reason codes speckit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/004-system-spec-kit/001-speckit-autopilot-lifecycle"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored leaf spec for 001-speckit-autopilot-lifecycle"
    next_safe_action: "Author plan.md and tasks.md before implementation"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/complete.md"
      - ".opencode/commands/speckit/plan.md"
      - ".opencode/commands/speckit/implement.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Speckit Unattended/Autopilot Lifecycle

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
| **Phase** | 1 of 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict` passes; plan.md and checklist.md authored; implementation summary present |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the single leaf phase within `004-system-spec-kit`. No handoffs to sister phases.

**Scope Boundary**: Speckit command files (`complete.md`, `plan.md`, `implement.md`) and their auto-YAML assets. No deep-loop-runtime or deep-loop-workflows changes.

**Dependencies**:
- No blocking dependency on other subsystems. Can execute independently of 002/003/005/006/007.

**Deliverables**:
- Updated `complete.md`, `plan.md`, `implement.md` with `:autopilot`/`--unattended` envelope
- Updated `speckit_complete_auto.yaml` with unattended step sequence
- `decision-record.md` documenting the `:auto` vs `:autopilot` distinction

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using `156-system-spec-kit-001`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The speckit `:auto` mode cuts interactive approval prompts but is not designed for crash-safe unattended execution. When a failure occurs mid-run, no branch is preserved and the terminal exit reason is prose, not a machine-readable code. Operators cannot reliably distinguish `uncertainty_blocked` (needs human input) from `verification_failed` (needs a retry) or `no_eligible_tasks` (no-op) without parsing narrative output. This prevents speckit from being used reliably in CI or scheduled pipelines.

### Purpose
Introduce a distinct `:autopilot` / `--unattended` envelope for `complete`, `plan`, and `implement`: branch first, propose with unattended-ready task metadata, implement with machine-readable terminal reason codes, archive in place, and merge only on clean verification — preserving the branch on any hard failure.

> **Reference**: `external/loop-cli-main/.opencode/commands/ob-autopilot.md:13-74` — the `ob-autopilot` command demonstrates the branch-first → propose → apply → archive → verify → merge-on-clean pattern with branch-preserved failures. (Research: research.md §5.3, iter 33)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `:autopilot` / `--unattended` execution envelope (distinct from `:auto`) in all three speckit commands
- Machine-readable terminal reason codes: `no_eligible_tasks`, `retry_exhausted`, `verification_failed`, `uncertainty_blocked`
- Unattended-ready task metadata in plan output (agent/deps/touched-files fields)
- Branch-preserved clean-failure path (no merge without clean verification)
- Asset YAML (`speckit_complete_auto.yaml`) updates for unattended step sequencing

### Out of Scope
- Merging `:auto` and `:autopilot` into one mode — the research is explicit that these must remain distinct (iter 33)
- Deep-loop-runtime or other subsystem changes — not in scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/speckit/complete.md` | Modify | Add `:autopilot`/`--unattended` envelope; typed terminal reasons; branch-preserved failure |
| `.opencode/commands/speckit/plan.md` | Modify | Add unattended-ready task metadata fields (agent/deps/touched-files) |
| `.opencode/commands/speckit/implement.md` | Modify | Machine-readable terminal reason codes; branch-preserved failure path |
| `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` | Modify | Unattended step sequence: branch → propose → apply → archive → verify → merge-on-clean |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `complete.md` and `implement.md` emit exactly four machine-readable terminal reason codes | Each reason code appears verbatim in the command output; no prose-only exits |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Branch is preserved on any hard failure; merge only on clean verification | Integration test: inject a `verification_failed` condition → confirm branch exists and no merge occurred |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A dry run of `speckit complete --unattended` on a failing task emits `verification_failed` as a machine-readable code and exits without merging
- **SC-002**: `validate.sh --strict` on this folder exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `:autopilot` silently aliases `:auto` in some invocation path | High — unattended operator thinks branch is preserved when it isn't | Audit all call sites; add guard that `:autopilot` flag explicitly sets branch-preserve mode |
| Risk | `speckit_complete_auto.yaml` YAML step ordering breaks existing `:auto` flows | Medium — shared asset file | Keep `:auto` and `:autopilot` as separate YAML sections or separate files |
| Risk | Prose-only terminal exits are not fully eliminated | Medium — breaks machine parsers | Add a lint step that checks no exit path lacks a reason code |
| Dependency | Speckit command files must be read before modification | Low | Read all three command files before authoring changes (Law 1) |

> **Deep-variant caveat**: The research tags this as `hard/deep-rewrite`. Plan task-metadata (agent/deps/touched-files) is `med/quick-win` and can land first. Full unattended envelope is the harder part. (Research: research.md §4 rank 10, iter 33)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `:autopilot` be a flag on `:auto` (e.g., `--unattended`) or a completely separate mode name? Resolution affects how existing `:auto` callers are impacted.
- Are the four terminal reason codes (`no_eligible_tasks`, `retry_exhausted`, `verification_failed`, `uncertainty_blocked`) exhaustive, or are additional codes needed for edge cases like `max_retries_exceeded`?
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
