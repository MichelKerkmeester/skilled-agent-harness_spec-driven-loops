---
title: "Implementation Plan: Feature Catalog Update for Checkpoint-v2, Front-Proxy, Schema History, and Error Codes"
description: "Expand the checkpoint feature files with the v2 VACUUM-INTO path, add a front-proxy file, a schema-version-history file, a unified error-code file, an enrichment-marker discoverability entry, and an sk-git worktree cross-reference, then register every new file in feature_catalog.md. Docs-only, accuracy-gated against verified source anchors."
trigger_phrases:
  - "feature catalog update plan"
  - "catalog v2 front proxy schema error codes plan"
  - "register feature files feature_catalog phases"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored and registered six feature-catalog deltas; packet validated"
    next_safe_action: "None binding; sibling 003-readme-cluster-update can link these files"
    blockers: []
    key_files:
      - "feature_catalog/feature_catalog.md"
      - "feature_catalog/05--lifecycle/checkpoint-creation-checkpointcreate.md"
      - "feature_catalog/14--pipeline-architecture/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "feature-catalog-update-packet-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Feature Catalog Update for Checkpoint-v2, Front-Proxy, Schema History, and Error Codes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (feature catalog docs) |
| **Framework** | system-spec-kit feature catalog (`feature_catalog/`) |
| **Storage** | Per-capability `.md` files under `NN--category/` plus the `feature_catalog.md` index |
| **Testing** | `validate.sh --strict` on this packet; manual accuracy verification against source anchors |

### Overview
Expand the two checkpoint feature files with the shipped v2 path, add four new feature files (front-proxy, schema-version-history, unified error-code reference, post-insert enrichment marker), add an sk-git worktree cross-reference, and register every new file in `feature_catalog.md`. The work is documentation-only and accuracy-gated: every behavioral claim must trace to a verified source anchor, `-32001` is documented as still-live, and the 36-tool count is preserved.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (see `spec.md`)
- [ ] Success criteria measurable (SC-001..SC-004)
- [ ] Source anchors verified (schema v30, VACUUM INTO, -32001/-32002, SPECKIT_BACKEND_ONLY)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-008)
- [ ] Every behavioral claim traceable to a read source anchor
- [ ] Every new file registered in `feature_catalog.md`
- [ ] `validate.sh --strict` on this packet passes (Errors: 0)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Expand-in-place plus add-and-register. Existing checkpoint files are expanded with the v2 path in the established feature-file format (Overview / How It Works / Source Files / Source Metadata). New capabilities each get a numbered file in the next free slot of their category and a Description/How-It-Works/Source-Files block in `feature_catalog.md`.

### Key Components
- **`05--lifecycle/038` + `040` (expand)**: v2 `VACUUM INTO` create/restore, v29 columns, `active_vec` shard-attach, two-phase restore journal, `.needs-rebuild` sentinel.
- **`14--pipeline-architecture/189` (new)**: front-proxy — reconnecting session proxy, in-place daemon recycle, `SPECKIT_BACKEND_ONLY`, `-32002` fail-closed.
- **`08--bug-fixes-and-data-integrity/069` (new)**: schema v28→v29→v30 migration timeline.
- **`08--bug-fixes-and-data-integrity/070` (new)**: unified error-code reference (`E429`, `-32001`, `-32002`).
- **`13--memory-quality-and-indexing/162` (new)**: `post_insert_enrichment_status` discoverability.
- **`16--tooling-and-scripts/249` (new)**: sk-git worktree convention cross-reference.

### Data Flow
Each authored claim originates from a read source anchor (schema, storage, launcher, server), is written into the feature file in the existing format, then linked from `feature_catalog.md` so the index and the per-file detail stay consistent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet documents shipped behavior. The affected-surface inventory is the catalog files touched and the source anchors each claim depends on.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `05--lifecycle/checkpoint-creation-checkpointcreate.md` | Documents v1 checkpoint create | update (add v2 path) | Claims trace to `checkpoints.ts` createCheckpointV2 / VACUUM INTO |
| `05--lifecycle/checkpoint-restore-checkpointrestore.md` | Documents v1 restore | update (add v2 swap + journal) | Claims trace to `checkpoints.ts` restoreCheckpointV2 / restore journal |
| `14--pipeline-architecture/mcp-launcher-front-proxy.md` | none | create | Claims trace to `launcher-session-proxy.cjs` + `mk-spec-memory-launcher.cjs` |
| `08--bug-fixes-and-data-integrity/schema-version-history-v28-v30.md` | none | create | Claims trace to `vector-index-schema.ts` migrations 28/29/30 |
| `08--bug-fixes-and-data-integrity/error-code-reference.md` | none | create | Claims trace to `errors/core.ts` (E429) + proxy (-32001/-32002) |
| `13--memory-quality-and-indexing/post-insert-enrichment-marker.md` | none | create | Claims trace to `vector-index-schema.ts` migration 30 columns |
| `16--tooling-and-scripts/sk-git-worktree-convention.md` | none | create | Cross-references sk-git skill convention |
| `feature_catalog.md` | Index | update (register new files) | Each new file linked from the index |

Required inventories:
- New-file slots: confirm next free number per category (`05`, `08`, `13`, `14`, `16`) before authoring.
- Claim sources: schema (`SCHEMA_VERSION = 30`, migrations 28/29/30), storage (VACUUM INTO ~L2217/L2220, sentinel, restore journal), launcher (-32001 L18-22, -32002 L23-26), server (serverInfo 1.7.2, SPECKIT_BACKEND_ONLY L2126).
- Accuracy invariants: `-32001` is still live; the 36-tool mk-spec-memory count is preserved.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Phase 0 is this packet setup, done by the orchestrator. The execution phases are documentation edits gated by accuracy verification against source anchors and a final `validate.sh --strict`.

### Phase 1: Expand checkpoint files (v2 path)
- [ ] Expand `038` with the v2 `VACUUM INTO` create path, v29 columns, manifest, `active_vec` shard-attach, `.needs-rebuild` sentinel
- [ ] Expand `040` with the v2 file-swap restore, `reopenActiveDatabase`, two-phase restore journal, `.needs-rebuild` sentinel
- [ ] Sync the matching Description/How-It-Works blocks in `feature_catalog.md` section 6 (Lifecycle)

### Phase 2: New front-proxy, schema-history, and error-code files
- [ ] Author `14--pipeline-architecture/mcp-launcher-front-proxy.md`
- [ ] Author `08--bug-fixes-and-data-integrity/schema-version-history-v28-v30.md`
- [ ] Author `08--bug-fixes-and-data-integrity/error-code-reference.md` (E429, -32001 still live, -32002)
- [ ] Register all three in `feature_catalog.md`

### Phase 3: Enrichment discoverability + sk-git + register + validate
- [ ] Author `13--memory-quality-and-indexing/post-insert-enrichment-marker.md` with a `post_insert_enrichment` trigger phrase
- [ ] Author `16--tooling-and-scripts/sk-git-worktree-convention.md` cross-referencing the sk-git skill
- [ ] Register both in `feature_catalog.md`
- [ ] Run `validate.sh --strict` on this packet to Errors: 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Accuracy | Every behavioral claim traces to a read source anchor | Grep + Read against source files |
| Structural | Feature files follow the existing format; new files registered | Manual review + grep on `feature_catalog.md` |
| Validation | This packet's spec docs validate strictly | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Verified source anchors (schema/storage/launcher/server) | Internal | Green | Cannot make accurate claims |
| Existing feature-file format precedent (`188`, `038`, `040`) | Internal | Green | Lose the established structure |
| sk-git skill (for the worktree convention cross-reference) | Internal | Green | Cannot cross-reference the convention |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A catalog claim is found to misstate runtime behavior, or a new file is unregistered.
- **Procedure**: Because the edits are documentation-only, revert the offending file edit; the prior catalog content is restored with no runtime effect. Re-run `validate.sh --strict` on this packet to confirm.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (expand checkpoints) ──► Phase 2 (new proxy/schema/error files) ──► Phase 3 (enrichment + sk-git + register + validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2 |
| Phase 2 | Phase 1 | Phase 3 |
| Phase 3 | Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Expand checkpoint files | Med | 1-2 hours |
| Phase 2: New front-proxy/schema/error files | High | 2-3 hours |
| Phase 3: Enrichment + sk-git + register + validate | Med | 1-2 hours |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Source anchors re-read before each claim
- [ ] Next free file number confirmed per category
- [ ] `-32001` still-live and 36-tool-count invariants restated in each affected file

### Rollback Procedure
1. Revert the offending catalog file edit.
2. Remove the corresponding `feature_catalog.md` index entry if the file was newly registered.
3. Re-run `validate.sh --strict` on this packet to confirm clean.

### Data Reversal
- **Has data migrations?** No — documentation-only.
- **Reversal procedure**: Git revert of the catalog file; no data state to reverse.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│ checkpoints │     │ proxy/schema│     │ enrichment  │
│   v2 path   │     │ error files │     │ sk-git +reg │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Checkpoint v2 docs | Source anchors | Expanded 038/040 | Proxy/schema files |
| Proxy/schema/error files | Source anchors | 189/069/070 | Enrichment + sk-git |
| Enrichment + sk-git + register | All prior | 162/241 + index | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 - Expand checkpoint files** - 1-2 hours - CRITICAL
2. **Phase 2 - New proxy/schema/error files** - 2-3 hours - CRITICAL
3. **Phase 3 - Enrichment + sk-git + register + validate** - 1-2 hours - CRITICAL

**Total Critical Path**: 4-7 hours

**Parallel Opportunities**:
- Within Phase 2, the three new files are independent and could be authored in any order; the phase gate is accuracy verification before registration.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Checkpoint v2 documented | `038`/`040` describe the v2 path, claims traced | End Phase 1 |
| M2 | Front-proxy/schema/error files exist and registered | `189`/`069`/`070` authored, registered, accurate | End Phase 2 |
| M3 | Enrichment + sk-git discoverable, packet validates | `162`/`241` authored and registered; `validate.sh --strict` clean | End Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Full ADRs live in `decision-record.md`. Summary:

### ADR-001: Expand existing checkpoint files over forking v2-only files

**Status**: Accepted

**Context**: The v2 path is the same capability (`checkpoint_create`/`checkpoint_restore`) with an added selection branch, not a separate tool.

**Decision**: Expand `038`/`040` in place rather than create v2-only files, keeping one discoverable entry per tool.

**Consequences**:
- Operators find both v1 and v2 behavior in one place.
- The files grow but remain single-capability.

**Alternatives Rejected**:
- v2-only files: fragments one tool across two entries and weakens discoverability.

---

## EXECUTOR DISPATCH CONTRACT

Documentation edits are authored directly by the markdown executor against `feature_catalog/`. No CLI dispatch or worktree is required; the orchestrator owns all git writes. Accuracy is gated by re-reading source anchors before each claim, and the final gate is `validate.sh --strict` on this packet plus a manual accuracy pass.
<!-- /IF -->
