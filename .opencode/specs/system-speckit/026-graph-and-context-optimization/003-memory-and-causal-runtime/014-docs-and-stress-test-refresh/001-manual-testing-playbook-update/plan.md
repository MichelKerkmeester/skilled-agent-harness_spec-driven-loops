---
title: "Implementation Plan: Manual Testing Playbook Refresh"
description: "Add six human-run EX scenarios (EX-037..EX-042) in the existing playbook feature-file format covering checkpoint-v2 round-trip, schema v30 enrichment, index_scan phased-async refinements, the MCP front-proxy reconnect contract, the sk-git worktree convention, and the .needs-rebuild self-heal sentinel. Additive only; no existing scenario restructured."
trigger_phrases:
  - "manual testing playbook refresh plan"
  - "EX-037 EX-042 scenario plan"
  - "checkpoint v2 enrichment frontproxy skgit scenario plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update"
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
# Implementation Plan: Manual Testing Playbook Refresh

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (operator playbook), no runtime code change |
| **Framework** | Spec Kit Memory manual testing playbook (split-document feature-file pattern) |
| **Storage** | Filesystem feature files under `manual_testing_playbook/NN--category/` |
| **Testing** | `validate.sh --strict` on this packet; manual live execution of the new scenarios |

### Overview
Add six new human-run `EX-###` scenarios in the existing playbook format: one feature file per scenario under the topic-appropriate `NN--category/` folder, plus a master-index entry in `## 7. EXISTING FEATURES`. Each scenario mirrors the validated `EX-014` (multi-step) and `EX-015` (single-step) shape: Overview → Scenario Contract → Test Execution (Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage) → Source Files → Source Metadata. Every behavioral claim is traced to a verified source anchor read during authoring.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (see `spec.md`)
- [x] Success criteria measurable (SC-001..SC-004)
- [x] Source anchors read and verified (checkpoints.ts, vector-index-schema.ts, enrichment-state.ts, memory-index.ts, launcher-session-proxy.cjs, sk-git SKILL.md)

### Definition of Done
- [x] Six EX feature files authored in the existing format
- [x] Master index wired with `### EX-037`..`### EX-042` entries
- [x] Each behavioral claim cites a source anchor
- [x] `validate.sh --strict` passes (Errors: 0)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Split-document feature-file pattern, additive. The master index (`manual_testing_playbook.md`) is the directory; each scenario's execution contract lives in a numbered feature file under `NN--category/`. New scenarios reuse the exact section structure of the validated `EX-014`/`EX-015` files so the playbook stays uniform.

### Key Components
- **EX-037 (`05--lifecycle/`)**: checkpoint-v2 create→restore round-trip; `snapshot_format`/`snapshot_path`; restore-journal crash-safety; sharded `active_vec` case.
- **EX-038 (`04--maintenance/`)**: schema v30 post-insert enrichment lifecycle; repair-on-replay; scan-lease backfill.
- **EX-039 (`04--maintenance/`)**: index_scan phased-async (walk → commit-lexical → async drain); auto-reindex; packet-move reconciliation; active-row uniqueness (mig 28); repair counts.
- **EX-040 (`14--pipeline-architecture/`)**: front-proxy RSS-recycle transparency; `SPECKIT_BACKEND_ONLY`; `-32002` fail-closed; `-32001` retryable-recycle.
- **EX-041 (`16--tooling-and-scripts/`)**: sk-git `wt/{NNNN}-{name}` worktree-convention validation; `.worktrees/{NNNN}-{name}` layout; 4-digit max+1 numbering.
- **EX-042 (`05--lifecycle/`)**: `.needs-rebuild` self-heal across boot, pre-scan, and scan-lease entry points.

### Data Flow
Operator reads the master-index entry → opens the feature file → runs the documented prompt/commands → captures evidence → returns a PASS/FAIL verdict. No runtime or schema change; the playbook only describes how to exercise already-shipped behavior.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet is documentation-only, but it asserts behavioral facts about live subsystems, so the surface inventory records which code each scenario was read against.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `manual_testing_playbook.md` `## 7` | EX scenario directory | update (add EX-037..EX-042 entries) | Entries link to the new feature files |
| `05--lifecycle/050-*.md`, `051-*.md` | Checkpoint scenario files | create | Mirror EX-015 shape; cite checkpoints.ts |
| `04--maintenance/039-*.md`, `040-*.md` | Maintenance scenario files | create | Mirror EX-014 shape; cite enrichment-state.ts / memory-index.ts |
| `14--pipeline-architecture/258-*.md` | Front-proxy scenario file | create | Cite launcher-session-proxy.cjs; correct -32001/-32002 meaning |
| `16--tooling-and-scripts/300-*.md` | sk-git scenario file | create | Cite sk-git SKILL.md worktree rule |
| `lib/storage/checkpoints.ts` | Checkpoint v2 runtime | read-only reference | Anchors: `createCheckpointV2`, `restoreCheckpointV2`, `VACUUM ... INTO`, `NEEDS_REBUILD_SENTINEL_NAME` |
| `lib/search/vector-index-schema.ts` | Schema v28-30 | read-only reference | Anchors: `SCHEMA_VERSION = 30`, mig 28/29/30 |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Front-proxy | read-only reference | Anchors: `-32001` RETRYABLE_RECYCLE_ERROR, `-32002` PROTOCOL_MISMATCH_ERROR |

Required inventories:
- Same-class producers: the existing checkpoint scenarios `EX-015`..`EX-018` and `memory_index_scan` scenario `EX-014` define the format the new scenarios mirror.
- Consumers of changed docs: the master-index `## 7` block and the `## 12` feature-catalog cross-reference index enumerate scenarios.
- Accuracy invariant: every behavioral claim cites the file path read; `-32001` is live retryable-recycle; the server tool count stays "36".
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author checkpoint + maintenance scenarios
- [x] EX-037 checkpoint-v2 round-trip feature file
- [x] EX-042 `.needs-rebuild` self-heal feature file
- [x] EX-038 enrichment v30 lifecycle feature file
- [x] EX-039 index_scan phased-async feature file

### Phase 2: Author infra scenarios
- [x] EX-040 front-proxy reconnect feature file
- [x] EX-041 sk-git worktree-convention feature file

### Phase 3: Wire + validate
- [x] Add `### EX-037`..`### EX-042` entries to the master index `## 7`
- [x] `validate.sh --strict` on this packet → Errors: 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Feature files match the EX section shape; master index links resolve | Read + grep |
| Validation | Packet docs pass strict validation | `validate.sh --strict` |
| Manual (live) | An operator runs each new scenario against the real daemon (sandbox for destructive ones) | MCP tools + sk-git |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shipped checkpoint-v2 path | Internal | Green | Scenario could not be live-run |
| Schema v30 enrichment columns | Internal | Green | Enrichment scenario inert |
| index_scan handler | Internal | Green | index_scan scenario inert |
| Launcher session-proxy | Internal | Green | Front-proxy scenario inert |
| sk-git worktree rule | Internal | Green | Worktree scenario inert |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new scenario is found to misstate shipped behavior.
- **Procedure**: Because the change is purely additive Markdown, revert the offending feature file and its single master-index entry; no other scenario, ID, or runtime behavior is affected.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (checkpoint + maintenance) ──► Phase 2 (infra) ──► Phase 3 (wire + validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 3 |
| Phase 2 | None | Phase 3 |
| Phase 3 | Phase 1, Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: checkpoint + maintenance scenarios | Med | 2-3 hours |
| Phase 2: infra scenarios | Med | 1-2 hours |
| Phase 3: wire + validate | Low | 1 hour |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Source anchors read and the behavioral claims pinned to file paths
- [x] New EX IDs chosen above the existing maximum (`EX-036`)
- [x] Destructive scenarios marked sandbox-only

### Rollback Procedure
1. Revert the offending feature file.
2. Remove its single `### EX-###` master-index entry.
3. Re-run `validate.sh --strict`.

### Data Reversal
- **Has data migrations?** No — documentation-only.
- **Reversal procedure**: Delete the added Markdown; no data state changes.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────┐     ┌────────────────────┐
│     Phase 1      │────►│   Phase 3    │◄────│      Phase 2       │
│ checkpoint + mtn │     │ wire+validate│     │       infra        │
└──────────────────┘     └──────────────┘     └────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 scenarios | Source anchors | EX-037/038/039/042 files | Phase 3 |
| Phase 2 scenarios | Source anchors | EX-040/041 files | Phase 3 |
| Phase 3 wiring | Phase 1, Phase 2 | Master-index entries; clean validate | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 - checkpoint + maintenance scenarios** - 2-3 hours - CRITICAL
2. **Phase 2 - infra scenarios** - 1-2 hours - parallelizable with Phase 1
3. **Phase 3 - wire + validate** - 1 hour - CRITICAL

**Total Critical Path**: 4-6 hours

**Parallel Opportunities**:
- Phase 1 and Phase 2 author independent feature files and can proceed in parallel; both must complete before Phase 3 wiring.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Checkpoint + maintenance scenarios authored | EX-037/038/039/042 files exist, cite anchors | End Phase 1 |
| M2 | Infra scenarios authored | EX-040/041 files exist, cite anchors | End Phase 2 |
| M3 | Wired + validated | Master index links resolve; `validate.sh --strict` Errors: 0 | End Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Full ADRs live in `decision-record.md`. Summary:

### ADR-001: Additive EX scenarios over restructuring the playbook

**Status**: Accepted

**Context**: The playbook predates the 013 roadmap but its EX/PHASE/M IDs and category structure are load-bearing across many cross-reference tables.

**Decision**: Add new `EX-037`..`EX-042` scenarios in the existing format; do not renumber or rewrite any existing scenario.

**Consequences**:
- Preserves every existing scenario ID and cross-reference.
- Two checkpoint-related scenarios share the `05--lifecycle/` folder with the existing `EX-015`..`EX-018`.

**Alternatives Rejected**:
- A new top-level "013 roadmap" section: fragments checkpoint coverage away from the existing `05--lifecycle` checkpoint block.
