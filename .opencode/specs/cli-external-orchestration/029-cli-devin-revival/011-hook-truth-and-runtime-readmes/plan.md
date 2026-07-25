---
title: "Implementation Plan: Devin hook truth and runtime README parity"
description: "Apply a source-ranked documentation correction, refresh runtime discovery mirrors, make the approved external MCP cleanup and verify every affected contract without touching unrelated concurrent work."
trigger_phrases:
  - "Devin hook truth plan"
  - "runtime README alignment plan"
  - "Zed MCP cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes"
    last_updated_at: "2026-07-25T10:15:41Z"
    last_updated_by: "opencode"
    recent_action: "Executed the source-ranked correction and bounded verification path"
    next_safe_action: "Rotate or revoke the removed credentials in the provider dashboards"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-hook-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["Provider-side credential rotation remains operator-only."]
    answered_questions: ["Execute on the current branch with an explicit target allowlist."]
---
# Implementation Plan: Devin Hook Truth and Runtime README Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, JSONC and filesystem symlinks |
| **Framework** | OpenCode system documentation and Spec Kit validation |
| **Storage** | Git-tracked docs plus user-local Zed settings |
| **Testing** | `validate.sh`, `validate_document.py`, Node schema checks, filesystem checks and JSONC parse validation |

### Overview

Use `.devin/hooks.v1.json` and the captured live event matrix as the current behavior authority. Correct operational claims while retaining old negative experiments under explicit supersession, then align discovery READMEs, restore the one missing Cursor symlink and remove approved secret-bearing Zed registrations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Parent scope and Level 3 child approved by the user.
- [x] Baseline recursive validation passed with 0 errors and 0 warnings across 11 folders.
- [x] Current registration counted at 8 events, 11 matcher groups and 19 commands.
- [x] Three runtime mirror README baseline failures isolated to missing `OVERVIEW` sections.
- [x] Target paths are clean even though unrelated worktree changes are present.

### Definition of Done

- [x] Current hook docs agree with observed live behavior and retain unobserved caveats.
- [x] Eleven target READMEs pass shared document validation.
- [x] Cursor mirror symlink resolves and runtime wiring remains unchanged.
- [x] Approved Zed registrations and local credentials are absent, with Code Mode corrected.
- [x] Child and recursive parent strict validation pass with 0 errors and 0 warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Source-ranked reconciliation with immutable evidence history.

### Key Components

- **Behavior authority**: Corrected `.devin/hooks.v1.json` plus tests 10-14 in `../hook-testing-results.md`.
- **Current-state consumers**: Parent and phase docs, hook READMEs, handover and continuation prompt.
- **Discovery mirrors**: `.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/` and `.devin/hooks/`.
- **External consumer**: Zed `context_servers`, which is user-local and outside git rollback.

### Data Flow

Observed payloads establish event and field truth. The canonical evidence document summarizes that truth. Runtime READMEs and phase status docs consume it. Generated metadata is refreshed only after authored content stabilizes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.devin/hooks.v1.json` | Behavior registration authority | Unchanged | Count events, groups and commands; reject wrapper keys. |
| `../hook-testing-results.md` | Canonical live and historical evidence | Reframe headline and continuity around tests 10-14 | Focused status grep and strict validation. |
| Parent and child spec docs | Status and future-work consumers | Replace unqualified dormant claims with live or superseded wording | Recursive strict validation and focused grep. |
| Seven Devin READMEs | Runtime operator guidance | Replace stale status and field uncertainty | Eleven README validators pass with the four discovery mirrors. |
| Runtime discovery mirrors | Filesystem orientation | Add validator-conformant overview and exact inventories | Symlink inventory and README validation. |
| Zed `context_servers` | User-local external registrations | Remove three obsolete entries and fix Code Mode path | JSONC parse and key inventory. |

Required inventories:

- Same-class producers: all current packet Markdown containing `dormant`, `never fires`, `never consulted` or `no headless attachment`.
- Consumers: every `hooks/devin/README.md` and each runtime discovery mirror README.
- Matrix axes: event observed/unobserved, adapter direct/live, registration present/absent and runtime mirror wired/discovery-only.
- Invariant: a non-event is never treated as proof of failure unless the triggering event and instrument are both proven.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create and author the Level 3 child packet.
- [x] Capture git, validation, README and hook-schema baselines.
- [x] Establish explicit allowlisted target paths.

### Phase 2: Implementation

- [x] Reconcile canonical evidence, parent status and affected phase docs.
- [x] Refresh seven Devin READMEs and four runtime discovery-mirror READMEs.
- [x] Add the approved Cursor discovery symlink.
- [x] Remove obsolete Zed registrations and correct Code Mode.

### Phase 3: Verification

- [x] Run focused truth and credential-presence checks.
- [x] Run README, symlink, schema, JSONC and strict packet gates.
- [x] Refresh generated metadata, implementation summary and checklist evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | Devin registration structure | Node JSON count assertion |
| Documentation | Eleven target READMEs | `validate_document.py` |
| Filesystem | Runtime mirror symlinks | `test -L`, `readlink` and target resolution |
| Configuration | Zed settings | JSONC parser or Zed-compatible parse check plus key inventory |
| Integration | Parent and all child spec folders | `validate.sh --recursive --strict` |
| Regression | Unrelated worktree preservation | Explicit target diff and final `git status --short` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live hook evidence | Internal | Green | No authoritative basis for corrections. |
| Manifest-backed templates | Internal | Green via renderer fallback | Child packet could not meet Level 3 contract. |
| Zed config parse support | Local tooling | Green | A bounded string-aware JSONC parse and structural assertion passed. |
| Provider credential dashboards | External/operator | Red for remote rotation | Local cleanup completes, but remote revocation remains unverified. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A validation regression, broken runtime link or malformed Zed config.
- **Procedure**: Reverse only the allowlisted repository diff, remove the added Cursor symlink and restore the exact pre-edit Zed server blocks and Code Mode path captured before mutation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Baseline evidence -> Current-state docs -> Runtime READMEs and mirrors -> External config -> Final validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | User scope and source evidence | Implementation |
| Documentation correction | Setup | Metadata and final validation |
| Mirror and config correction | Setup | Final validation |
| Verification | All implementation work | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1 hour |
| Documentation correction | High | 3-5 hours |
| Mirror and config correction | Medium | 1-2 hours |
| Verification | High | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist

- [x] Repository target paths confirmed clean.
- [x] External Zed settings read and exact affected blocks identified.
- [x] Recursive packet and README baselines captured.

### Rollback Procedure

1. Stop if an allowlisted target changes unexpectedly during the sweep.
2. Reverse only phase-011 repository paths and the explicitly edited current-state docs.
3. Remove only `.cursor/hooks/mcp-route-guard.mjs` if link validation fails.
4. Restore only the removed Zed blocks and prior Code Mode path from the captured pre-edit content.
5. Re-run the same focused gates to prove rollback.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Repository content is diff-reversible. The user-local JSONC file uses the captured pre-edit blocks.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Correct schema and live evidence
             |
             v
Canonical packet corrections ----> Runtime README corrections
             |                              |
             +--------------+---------------+
                            v
                 Metadata and final gates

External Zed cleanup --------> Local security verification
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Evidence correction | Hook schema and tests 10-14 | Canonical current truth | README and phase closeout |
| README correction | Evidence correction and filesystem inventory | Valid operator docs | Phase closeout |
| Mirror parity | Filesystem inventory | Complete Cursor discovery view | Phase closeout |
| Zed cleanup | Approved removal list | Reduced local credential exposure | Security closeout |
| Metadata | Stable authored docs | Fresh discovery state | Strict validation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Canonical evidence and current-status correction** - 2-3 hours - CRITICAL
2. **Runtime README and mirror alignment** - 1-2 hours - CRITICAL
3. **Metadata refresh and strict validation** - 1-2 hours - CRITICAL

**Total Critical Path**: 4-7 hours

**Parallel Opportunities**:

- Zed cleanup is independent after the pre-edit snapshot is captured.
- README validation can run in parallel across all target files.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Packet truth reconciled | No unqualified false dormancy claim remains | Phase 2 |
| M2 | Runtime surfaces aligned | Eleven README validators and symlink checks pass | Phase 2 |
| M3 | Security cleanup applied | Obsolete Zed keys and local credential values are absent | Phase 2 |
| M4 | Release ready | Recursive strict validation passes 0/0 | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Preserve Failed Experiments Under Explicit Supersession

**Status**: Accepted

**Context**: The observations from tests 1-9 are useful, but the unsupported registration shape invalidated the inference that hooks were unavailable.

**Decision**: Keep the observations and place the corrected schema and tests 10-14 first as current truth.

**Consequences**:

- The failure mechanism remains auditable.
- Current readers do not mistake historical conclusions for operational status.

**Alternatives Rejected**:

- Delete tests 1-9: loses the root-cause lesson and weakens future debugging evidence.

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the target path is unchanged immediately before each patch.
- Confirm the patch contains only paths named in `spec.md`.
- Confirm no credential value is copied into repository content or status output.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| SOURCE | Rank corrected schema and observed payloads above unsupported-schema tests. |
| SCOPE | Preserve unrelated dirty work and do not edit adapter behavior. |
| HISTORY | Keep negative tests as explicitly superseded evidence. |
| SECURITY | Remove local credential copies without reproducing their values. |

### Status Reporting Format

Report each completed task as `T### complete: <command or artifact evidence>`. Report an external blocker as `T### blocked: <owner and next safe action>`.

### Blocked Task Protocol

Stop the affected workstream when a target changes unexpectedly, a validation gate fails or provider-side access is required. Preserve the current diff, record the exact blocker and continue only with independent allowlisted work.
<!-- /ANCHOR:ai-execution -->
