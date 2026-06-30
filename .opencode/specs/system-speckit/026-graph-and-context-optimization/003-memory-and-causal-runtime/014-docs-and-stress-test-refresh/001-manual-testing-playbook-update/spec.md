---
title: "Feature Specification: Manual Testing Playbook Refresh for Checkpoint-v2, Enrichment v30, index_scan, Front-Proxy, sk-git"
description: "The manual testing playbook stops at EX-036 and predates the 013 memory-index-scan roadmap (checkpoint-v2 file snapshots, schema v30 post-insert enrichment, index_scan phased-async refinements, the MCP front-proxy) and the sk-git worktree convention. Operators cannot exercise these shipped behaviors from the playbook alone. This packet adds human-run EX scenarios in the existing EX-### format."
trigger_phrases:
  - "manual testing playbook refresh"
  - "checkpoint v2 enrichment v30 index_scan front-proxy sk-git scenarios"
  - "manual testing playbook EX-037 EX-038"
  - "add manual testing scenarios checkpoint enrichment frontproxy worktree"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored EX-037..EX-042 playbook scenarios and wired the master index"
    next_safe_action: "None binding; six EX scenarios shipped and wired into the master index"
    blockers: []
    key_files:
      - "manual_testing_playbook/manual_testing_playbook.md"
      - "manual_testing_playbook/05--lifecycle/"
      - "manual_testing_playbook/04--maintenance/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-testing-playbook-update-packet-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Manual Testing Playbook Refresh for Checkpoint-v2, Enrichment v30, index_scan, Front-Proxy, sk-git

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The Spec Kit Memory manual testing playbook stops at `EX-036` and predates the shipped 013 memory-index-scan roadmap. Operators have no human-run scenarios for checkpoint-v2 file snapshots, schema v30 post-insert enrichment, the index_scan phased-async refinements, the MCP front-proxy reconnect behavior, or the sk-git worktree convention. This packet adds new `EX-###` scenarios in the existing playbook format (one feature file per scenario plus a master-index entry), without restructuring the playbook. Each scenario traces every behavioral claim to a verified code anchor.

**Key Decisions**: Add (never restructure) EX scenarios `EX-037`..`EX-042`; mirror the validated `EX-014`/`EX-015` format; keep destructive scenarios sandbox-only; trace each claim to a source anchor.

**Critical Dependencies**: The shipped checkpoint-v2 path (`createCheckpointV2`/`restoreCheckpointV2`), schema v30 enrichment columns, the index_scan handler, the launcher session-proxy error contract, and the sk-git worktree numbering rule.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented — scenarios authored and wired into the master index |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The manual testing playbook (`manual_testing_playbook/manual_testing_playbook.md` plus its `NN--category/` feature files) is the operator-facing validation directory for the Spec Kit Memory MCP server. Its `EX` block ends at `EX-036` and predates the 013 roadmap, so there is no human-run coverage for: checkpoint-v2 file-based full-DB snapshots (`createCheckpointV2`/`restoreCheckpointV2`, `VACUUM ... INTO`, `snapshot_format`/`snapshot_path`, the `.needs-rebuild` self-heal sentinel), schema v30 post-insert enrichment lifecycle, the index_scan phased-async refinements (walk → commit-lexical → async drain, coalescing, packet-move reconciliation, active-row uniqueness, repair counts), the MCP front-proxy reconnect contract (RSS-recycle transparency, `SPECKIT_BACKEND_ONLY`, `-32002` fail-closed vs `-32001` retryable-recycle), and the sk-git `wt/{NNNN}-{name}` worktree convention.

### Purpose
Add new human-run `EX-###` scenarios — in the existing EX feature-file format and wired into the master index — that let an operator exercise and verify these shipped behaviors directly from the playbook. The change is additive: no existing scenario, ID, or section is restructured.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New EX scenario feature files under the existing `manual_testing_playbook/NN--category/` folders, in the validated `EX-###` format.
- One master-index entry per new scenario in `## 7. EXISTING FEATURES`, in the existing `### EX-### | Title` shape with Description, Scenario Contract, and Test Execution links.
- Coverage for: checkpoint-v2 create→restore round-trip (`snapshot_format`/`snapshot_path`, restore-journal crash-safety, `.needs-rebuild` self-heal, sharded `active_vec` case); schema v30 post-insert enrichment lifecycle plus repair-on-replay and scan-lease backfill; index_scan phased-async, auto-reindex, packet-move reconciliation, active-row uniqueness, repair counts; front-proxy RSS-recycle transparency, `SPECKIT_BACKEND_ONLY`, `-32002`/`-32001`; sk-git worktree-convention validation.

### Out of Scope
- The feature catalog (`002-feature-catalog-update`), README cluster (`003-readme-cluster-update`), and durability stress domain (`004-stress-test-durability-domain`) — sibling phases.
- Restructuring, renumbering, or rewriting any existing playbook scenario or section.
- Source-code changes to the runtime under test; this packet only documents how to exercise it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `manual_testing_playbook/manual_testing_playbook.md` | Modify | Add `### EX-037`..`### EX-042` entries to `## 7. EXISTING FEATURES`; wire each to its feature file. |
| `manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md` | Create | EX-037 checkpoint-v2 create→restore round-trip scenario. |
| `manual_testing_playbook/04--maintenance/post-insert-enrichment-lifecycle-v30.md` | Create | EX-038 schema v30 post-insert enrichment lifecycle scenario. |
| `manual_testing_playbook/04--maintenance/index-scan-phased-async-refinements.md` | Create | EX-039 index_scan phased-async / move-reconciliation / repair-counts scenario. |
| `manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md` | Create | EX-040 front-proxy RSS-recycle / SPECKIT_BACKEND_ONLY / -32002 vs -32001 scenario. |
| `manual_testing_playbook/16--tooling-and-scripts/sk-git-worktree-convention.md` | Create | EX-041 sk-git `wt/{NNNN}-{name}` worktree-convention scenario. |
| `manual_testing_playbook/05--lifecycle/checkpoint-v2-needs-rebuild-self-heal.md` | Create | EX-042 `.needs-rebuild` self-heal (boot/pre-scan/scan-lease) scenario. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Checkpoint-v2 round-trip is covered as a human-run scenario. | `EX-037` exists, drives `checkpoint_create` (v2 `VACUUM INTO`) → `checkpoint_restore`, and asserts `snapshot_format='v2'` plus `snapshot_path`, restore-journal crash-safety, and the sharded `active_vec` case. |
| REQ-002 | Schema v30 post-insert enrichment lifecycle is covered. | `EX-038` exercises the `post_insert_enrichment_status` lifecycle (`pending`→`complete`/`failed`) plus repair-on-replay and scan-lease backfill validation. |
| REQ-003 | index_scan phased-async refinements are covered. | `EX-039` covers walk → commit-lexical → async drain, auto-reindex, packet-move reconciliation, active-row uniqueness (mig 28), and repair counts in the response. |
| REQ-004 | Front-proxy reconnect contract is covered with the correct error meanings. | `EX-040` covers RSS-recycle transparency, `SPECKIT_BACKEND_ONLY`, `-32002` fail-closed terminal CLOSED, and the correct `-32001` retryable-recycle meaning (NOT "removed"). |
| REQ-005 | sk-git worktree convention is covered as a validation scenario. | `EX-041` creates a `wt/{NNNN}-{name}` worktree and confirms the `.worktrees/{NNNN}-{name}` layout and 4-digit max+1 numbering. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `.needs-rebuild` self-heal is covered. | `EX-042` covers the `.needs-rebuild` sentinel self-heal across boot, pre-scan, and scan-lease entry points. |
| REQ-007 | Every behavioral claim traces to a verified source anchor. | Each new feature file's Source Files / Source Metadata cites the file path the claim was read from (e.g. `lib/storage/checkpoints.ts`, `lib/search/vector-index-schema.ts`, `.opencode/bin/lib/launcher-session-proxy.cjs`). |
| REQ-008 | New scenarios reuse the existing format and are additive only. | New feature files match the `EX-014`/`EX-015` section shape; master-index entries match the existing `### EX-### | Title` shape; no existing scenario is renumbered or rewritten. |
| REQ-009 | Accuracy guardrails are honored. | `-32001` is documented as live retryable-recycle (not removed); the "36-tool" server count is not changed; claims trace to anchors. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `EX-037`..`EX-042` exist as feature files in the existing `NN--category/` format and are linked from `## 7. EXISTING FEATURES`.
- **SC-002**: Each new scenario's behavioral claims trace to a cited source anchor (checkpoints.ts, vector-index-schema.ts, enrichment-state.ts, memory-index.ts, launcher-session-proxy.cjs, sk-git SKILL.md).
- **SC-003**: The front-proxy scenario states `-32001` as the live retryable-recycle code and `-32002` as the terminal fail-closed protocol-mismatch code — not "−32001 removed".
- **SC-004**: `validate.sh --strict` on this packet passes (Errors: 0).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A claim drifts from the shipped code | High | Read the source anchor before writing each claim; cite the file path in Source Metadata. |
| Risk | Restructuring the playbook breaks existing scenario IDs | High | Additive-only: new EX-### IDs (037+), new feature files, no rename or rewrite. |
| Risk | Destructive checkpoint/restore steps run on production data | High | Sandbox-only preconditions reused from the global playbook policy (`EX-008`/`EX-018` convention). |
| Risk | Misstating `-32001` as removed | High | Explicitly document `-32001` as the live `RETRYABLE_RECYCLE_ERROR`; `-32002` as the terminal `PROTOCOL_MISMATCH_ERROR`. |
| Dependency | Shipped checkpoint-v2 + enrichment v30 + front-proxy code | n/a | All live on `main`; verified by reading the source anchors. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: New scenarios that drive a full-DB `VACUUM INTO` must warn the operator that the create/restore runs in seconds on the production-sized DB and is sandbox-only.

### Security
- **NFR-S01**: The sk-git worktree scenario must not push, commit, or merge; it only creates and inspects a worktree, leaving git writes to the operator.

### Reliability
- **NFR-R01**: The checkpoint-v2 scenario must document the restore-journal crash-safety note so an operator interrupting a restore knows the two-phase journal (`swap-pending`→`swap-done`) recovers correctly.

---

## 8. EDGE CASES

### Data Boundaries
- Sharded vs non-sharded runtime: the checkpoint-v2 scenario covers the `active_vec`-attached case where vectors live in the shard.
- Empty/scoped checkpoint request: the scenario notes that scoped requests stay on v1 and are out of the v2 round-trip's scope.

### Error Scenarios
- Front-proxy backend RSS-recycle mid-call: the scenario observes `-32001` retryable-recycle transparency rather than a surfaced error.
- Protocol drift between front-proxy and backend: the scenario observes `-32002` terminal CLOSED (non-retryable).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 1 modified + 6 new feature files, LOC: 500+, Systems: docs only (no runtime change) |
| Risk | 12/25 | Auth: N, API: N, Breaking: N, accuracy risk if claims drift from code |
| Research | 14/20 | Six subsystems read at the source-anchor level before authoring |
| Multi-Agent | 5/15 | Single doc author; orchestrator owns git |
| Coordination | 8/15 | One child phase of a four-phase parent; sibling handoff via parent map |
| **Total** | **53/100** | **Level 3 (parent-aligned; verification + arch sections retained)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A documented behavior diverges from shipped code | H | M | Read each source anchor before writing; cite file paths. |
| R-002 | `-32001` misdocumented as removed | H | L | Explicit retryable-recycle wording, anchored to launcher-session-proxy.cjs. |
| R-003 | Destructive steps run on production data | H | L | Sandbox-only preconditions per global playbook policy. |
| R-004 | Existing scenario IDs disturbed | H | L | Additive-only EX-037+; no renumber. |

---

## 11. USER STORIES

### US-001: Operator validates checkpoint-v2 from the playbook (Priority: P0)

**As an** operator who needs to prove the full-DB rollback net works, **I want** a human-run scenario for checkpoint-v2 create→restore, **so that** I can verify `snapshot_format='v2'` and a consistent restore round-trip without inventing the steps.

**Acceptance Criteria**:
1. Given the live DB, When I follow `EX-037`, Then I create a v2 snapshot, restore it into a scratch copy, and confirm `memory_health` consistency.

### US-002: Operator validates the front-proxy reconnect contract (Priority: P0)

**As an** operator debugging a daemon recycle, **I want** a scenario that explains `-32001` retryable-recycle vs `-32002` fail-closed, **so that** I interpret the proxy's behavior correctly.

**Acceptance Criteria**:
1. Given `EX-040`, When the backend recycles, Then the scenario shows `-32001` transparency; When protocol drifts, Then it shows `-32002` terminal CLOSED.

---

## 12. OPEN QUESTIONS

- None blocking. The new scenarios are additive and live-runnable; the only judgment call (which `NN--category/` folder each scenario lands in) is resolved by topic affinity and recorded in `decision-record.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: See `../spec.md`
