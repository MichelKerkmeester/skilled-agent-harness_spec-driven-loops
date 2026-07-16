---
title: "Implementation Plan: Speckit Unattended/Autopilot Lifecycle"
description: "Documents the completed speckit :autopilot branch-preserved unattended lifecycle work."
trigger_phrases:
  - "speckit autopilot lifecycle"
  - "speckit unattended"
  - "branch preserved failure"
  - "terminal reason codes speckit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/004-system-spec-kit/001-speckit-autopilot-lifecycle"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/complete.md"
      - ".opencode/commands/speckit/plan.md"
      - ".opencode/commands/speckit/implement.md"
      - ".opencode/commands/speckit/assets/speckit_complete_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Speckit Unattended/Autopilot Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode speckit command markdown and YAML command assets |
| **Framework** | System Spec Kit command workflow for `complete`, `plan`, and `implement` |
| **Storage** | Git branch state and command terminal output only |
| **Testing** | Unattended failure-path checks, terminal reason-code checks, and strict spec validation |

### Overview
This completed work introduced a distinct `:autopilot` / `--unattended` execution envelope rather than extending the lighter `:auto` approval-reduction mode. The implementation branches before work starts, emits machine-readable terminal reason codes, preserves the branch on hard failure, and merges only after clean verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: `:auto` reduced prompts but did not provide crash-safe unattended operation.
- [x] Success criteria measurable: branch preservation and the four terminal reason codes are explicit.
- [x] Dependencies identified: this leaf is scoped to speckit command docs and `speckit_complete_auto.yaml`.

### Definition of Done
- [x] `complete.md` documents and routes the `:autopilot` / `--unattended` envelope.
- [x] `plan.md` emits unattended-ready task metadata for executor routing.
- [x] `implement.md` reports `no_eligible_tasks`, `retry_exhausted`, `verification_failed`, and `uncertainty_blocked` as typed terminal reasons.
- [x] `speckit_complete_auto.yaml` preserves the branch on failure and merges only after verification passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Branch-first unattended envelope: the command flow creates an isolation branch before proposing or applying work, records typed terminal outcomes, archives in place, and gates merge on clean verification.

### Key Components
- **`.opencode/commands/speckit/complete.md`**: Owns the user-facing `:autopilot` / `--unattended` command contract and failure semantics.
- **`.opencode/commands/speckit/plan.md`**: Adds unattended-ready task metadata such as agent, dependencies, and touched-file fields.
- **`.opencode/commands/speckit/implement.md`**: Emits typed terminal reason codes on no-op, retry exhaustion, verification failure, or uncertainty.
- **`speckit_complete_auto.yaml`**: Encodes the branch, propose, apply, archive, verify, and merge-on-clean sequence.

### Data Flow
The operator invokes the unattended speckit mode, the command creates or selects a branch, planning produces executor-ready task metadata, implementation runs with typed terminal outcomes, and the auto YAML keeps the branch intact unless verification succeeds. Failure paths return machine-readable reason codes for CI or scheduled automation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `complete.md` | Top-level speckit completion contract | Add `:autopilot` / `--unattended` as a distinct mode | Command help and failure path show branch preservation |
| `plan.md` | Produces task plan metadata | Add unattended executor fields | Generated tasks expose agent, deps, and touched files |
| `implement.md` | Applies tasks and reports terminal state | Emit typed reason codes | Four expected codes appear verbatim |
| `speckit_complete_auto.yaml` | Sequenced unattended execution | Branch first and merge only after clean verification | Injected failure leaves branch unmerged |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed leaf spec and confirm the `:auto` versus `:autopilot` boundary.
- [x] Identify the speckit command docs and YAML asset named in scope.
- [x] Preserve deep-loop-runtime and other subsystem work as out of scope.

### Phase 2: Core Implementation
- [x] Add the `:autopilot` / `--unattended` operator contract to `complete.md`.
- [x] Add unattended-ready task metadata to `plan.md` output guidance.
- [x] Add the four machine-readable terminal reason codes to `implement.md`.
- [x] Update `speckit_complete_auto.yaml` to branch first, archive in place, verify, and merge only on clean output.

### Phase 3: Verification
- [x] Confirm a verification-failed unattended path reports `verification_failed`.
- [x] Confirm failure preserves the work branch and does not merge.
- [x] Confirm this spec folder validates under strict mode.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Command contract | `:autopilot` and `--unattended` command entry points | Speckit command dry run |
| Failure path | Branch-preserved `verification_failed` path | Injected verification failure |
| Terminal output | Four typed reason codes | Output inspection |
| Spec validation | Leaf packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Speckit command files readable before edit | Internal | Complete | Required to preserve existing `:auto` behavior while adding `:autopilot` |
| `external/loop-cli-main` autopilot pattern | Research reference | Complete | Informed branch-first and merge-on-clean semantics |
| Deep-loop-runtime changes | Out of scope | Not required | No impact; this leaf only touches speckit command surfaces |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `:autopilot` aliases `:auto`, a typed terminal code is missing, or branch preservation fails.
- **Procedure**: Revert the edits to the three speckit command docs and `speckit_complete_auto.yaml`, then restore the prior `:auto`-only flow and keep a follow-up task for unattended execution.
<!-- /ANCHOR:rollback -->
