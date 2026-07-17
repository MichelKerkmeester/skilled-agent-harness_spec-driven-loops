---
title: "Feature Specification: Feature Catalog Update for Checkpoint-v2, Front-Proxy, Schema History, and Error Codes"
description: "The system-spec-kit feature catalog lags the shipped 013 memory-index-scan roadmap and the 128 sk-git worktree convention. Checkpoint-v2 VACUUM-INTO snapshots, the MCP launcher front-proxy, schema v28-v30 migrations, the unified error-code surface (E429/-32001/-32002), post_insert_enrichment discoverability, and the sk-git worktree convention are not yet catalogued, so operators cannot discover them from the docs."
trigger_phrases:
  - "feature catalog update checkpoint v2 front proxy"
  - "catalog schema version history error codes enrichment"
  - "feature catalog vacuum into front proxy sk-git"
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
      - "feature_catalog/lifecycle/checkpoint-creation-checkpointcreate.md"
      - "feature_catalog/pipeline-architecture/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "feature-catalog-update-packet-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Feature Catalog Update for Checkpoint-v2, Front-Proxy, Schema History, and Error Codes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The `system-spec-kit` feature catalog is the canonical, operator-facing inventory of the Spec Kit Memory MCP server's behaviors. It has fallen behind the shipped runtime: the 013 memory-index-scan roadmap delivered checkpoint-v2 file-based snapshots (schema v29), the post-insert enrichment marker (schema v30), and the MCP launcher front-proxy, while the 128 work introduced the sk-git worktree convention. None of these are discoverable from the catalog, and the scattered error-code mentions (E429, -32001, -32002) are not unified anywhere. This packet expands and registers six catalog deltas so operators can find and reason about the shipped behaviors. It edits only `feature_catalog/` content — no runtime code.

**Key Decisions**: Expand the existing checkpoint feature files in place rather than fork new ones; add one new front-proxy file under `pipeline-architecture/`; add a schema-version-history file and a unified error-code reference file; surface `post_insert_enrichment_status` as a discoverable entry; cross-reference the sk-git worktree convention.

**Critical Dependencies**: Verified source anchors in `lib/search/vector-index-schema.ts` (SCHEMA_VERSION = 30, migrations 28/29/30), `lib/storage/checkpoints.ts` (VACUUM INTO, sentinel, restore journal), `.opencode/bin/lib/launcher-session-proxy.cjs` (-32001/-32002), and `context-server.ts` (serverInfo 1.7.2 — pre-fix value captured at planning time; current deployed value is 1.8.0 per `package.json:3`, SPECKIT_BACKEND_ONLY).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented — catalog deltas authored and registered |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog (`feature_catalog/feature_catalog.md` plus the per-capability files under `NN--category/`) is the inventory operators read to discover and reason about server behavior. It does not yet describe behaviors that shipped in the 013 roadmap and the 128 sk-git work: checkpoint-v2 `VACUUM INTO` full-DB snapshots with schema v29 columns, the post-restore `.needs-rebuild` sentinel and two-phase restore journal, the MCP launcher front-proxy (reconnecting session proxy, in-place daemon recycle, `SPECKIT_BACKEND_ONLY`, `-32002` protocol fail-closed), the schema v28→v29→v30 migration timeline, the unified error-code surface (`E429`, the still-live retryable `-32001`, and `-32002`), the `post_insert_enrichment_status` marker, and the sk-git `wt/{NNNN}-{name}` worktree convention. An operator cannot find these from the docs alone.

### Purpose
Expand the relevant existing catalog files and add the missing ones, then register every new file in `feature_catalog.md`, so the shipped checkpoint-v2, front-proxy, schema-history, error-code, enrichment-discoverability, and sk-git capabilities are all discoverable from the canonical inventory. Every behavioral claim traces to a verified source anchor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Expanding `lifecycle/checkpoint-creation-checkpointcreate.md` and its restore sibling `checkpoint-restore-checkpointrestore.md` with the v2 path: `VACUUM INTO`, schema v29 columns (`snapshot_format`/`snapshot_path`), restore-journal crash-safety, shard-attach (`active_vec`), and the `.needs-rebuild` sentinel.
- A new file under `pipeline-architecture/` for the MCP launcher front-proxy: reconnecting session proxy, in-place daemon recycle, `SPECKIT_BACKEND_ONLY`, and `-32002` protocol fail-closed.
- A new schema-version-history file (`v28 → v29 → v30` timeline and what each migration added).
- A new unified error-code reference file (`E429`, `-32001` retryable recycle — still live, `-32002` protocol fail-closed).
- Surfacing `post_insert_enrichment_status` as a discoverable entry in `memory-quality-and-indexing/` with a trigger phrase.
- An sk-git worktree-convention entry (or a clear cross-reference to the sk-git skill) covering `wt/{NNNN}-{name}` branches and `.worktrees/{NNNN}-{name}` directories.
- Registering every new file in `feature_catalog.md`.

### Out of Scope
- Any runtime code change — this packet edits only `feature_catalog/` content.
- Manual testing playbook scenarios (owned by sibling `001-manual-testing-playbook-update`).
- README cluster and `ENV_REFERENCE.md` edits, including adding `SPECKIT_BACKEND_ONLY` there (owned by sibling `003-readme-cluster-update`).
- The new durability stress domain (owned by sibling `004-stress-test-durability-domain`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/lifecycle/checkpoint-creation-checkpointcreate.md` | Modify | Add the v2 `VACUUM INTO` create path, v29 columns, manifest, shard-attach, sentinel. |
| `feature_catalog/lifecycle/checkpoint-restore-checkpointrestore.md` | Modify | Add the v2 file-swap restore, restore-journal crash-safety, `reopenActiveDatabase`, sentinel. |
| `feature_catalog/pipeline-architecture/mcp-launcher-front-proxy.md` | Create | MCP front-proxy: reconnecting session proxy, in-place recycle, `SPECKIT_BACKEND_ONLY`, `-32002`. |
| `feature_catalog/memory-quality-and-indexing/post-insert-enrichment-marker.md` | Create | `post_insert_enrichment_status` discoverability entry. |
| `feature_catalog/bug-fixes-and-data-integrity/schema-version-history-v28-v30.md` | Create | Schema v28→v29→v30 migration timeline. |
| `feature_catalog/bug-fixes-and-data-integrity/error-code-reference.md` | Create | Unified `E429` / `-32001` / `-32002` reference. |
| `feature_catalog/tooling-and-scripts/sk-git-worktree-convention.md` | Create | sk-git `wt/{NNNN}-{name}` worktree convention cross-reference. |
| `feature_catalog/feature_catalog.md` | Modify | Register every new file. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Checkpoint create/restore feature files document the v2 path accurately. | `038` and `040` describe `VACUUM INTO`, v29 columns, shard-attach, restore-journal, and the `.needs-rebuild` sentinel with claims traceable to `checkpoints.ts`. |
| REQ-002 | The MCP front-proxy is documented as a new catalog file. | `pipeline-architecture/189` describes the reconnecting session proxy, in-place recycle, `SPECKIT_BACKEND_ONLY`, and `-32002` fail-closed, traceable to `launcher-session-proxy.cjs` and `mk-spec-memory-launcher.cjs`. |
| REQ-003 | The error-code reference is unified and accurate. | The error-code file states `-32001` is the STILL-LIVE retryable recycle error, `-32002` is non-retryable protocol fail-closed, and `E429` is the scan rate-limit code. |
| REQ-004 | The schema-version-history file is accurate. | The schema file states `SCHEMA_VERSION = 30` and what migrations 28, 29, 30 each added, traceable to `vector-index-schema.ts`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `post_insert_enrichment_status` is discoverable. | A `memory-quality-and-indexing/` entry names the marker columns and carries a trigger phrase that matches `post_insert_enrichment`. |
| REQ-006 | The sk-git worktree convention is discoverable. | A catalog entry documents `wt/{NNNN}-{name}` branches and `.worktrees/{NNNN}-{name}` dirs, or cross-references the sk-git skill clearly. |
| REQ-007 | Every new file is registered in `feature_catalog.md`. | Each new feature file is linked from the index with a Description/How-It-Works/Source-Files block in its section. |
| REQ-008 | No `36`→`43` tool-count bump. | The README "36-tool" mk-spec-memory count stays; the catalog adds BEHAVIORS, not a tool-count change. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `038` and `040` describe the v2 checkpoint path with claims traceable to `lib/storage/checkpoints.ts` (VACUUM INTO at ~L2217/L2220, sentinel, restore journal).
- **SC-002**: A new `pipeline-architecture/` file documents the front-proxy and is registered in `feature_catalog.md`.
- **SC-003**: A schema-version-history file and a unified error-code file exist, are accurate (SCHEMA_VERSION = 30; -32001 still live), and are registered.
- **SC-004**: `post_insert_enrichment_status` and the sk-git worktree convention are both discoverable, and `validate.sh --strict` on this packet passes (Errors: 0).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Stating "-32001 was removed" (false) | High — wrong claim | -32001 stays LIVE as the launcher RETRYABLE_RECYCLE_ERROR; document precisely that only the index vector-drain outage path stopped surfacing its own -32001 class. |
| Risk | Bumping the 36-tool count to 43 | Med — wrong claim | The live mk-spec-memory server registers exactly 36; layer-definitions.ts lists 43 across cross-server layers. Add behaviors, not a number bump. |
| Risk | Unverified behavioral claim | High | Every claim traces to a read source anchor; read source before writing. |
| Dependency | Source anchors in `checkpoints.ts`, `vector-index-schema.ts`, `launcher-session-proxy.cjs`, `context-server.ts` | Catalog accuracy depends on them | Anchors verified before authoring. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Catalog edits are documentation-only; no runtime performance impact.

### Security
- **NFR-S01**: No secrets or credentials introduced into catalog files.

### Reliability
- **NFR-R01**: Every behavioral claim is traceable to a verified source anchor so the catalog does not drift from the runtime.

---

## 8. EDGE CASES

### Data Boundaries
- Checkpoint files describe both v1 (scoped, JSON BLOB) and v2 (unscoped full-DB, VACUUM INTO) paths so neither is misrepresented.
- The error-code file disambiguates the still-live `-32001` from the deprecated index vector-drain outage class.

### Error Scenarios
- A reader could conflate the front-proxy `-32002` (non-retryable) with `-32001` (retryable); the error-code file states the retry semantics for each explicitly.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: 5 new + 3 modified catalog files, docs-only, multiple capability domains |
| Risk | 14/25 | Auth: N, API: N, Breaking: N; risk is accuracy (wrong claims = failure), not runtime |
| Research | 14/20 | Source anchors across schema, storage, launcher, and server all read and verified |
| Multi-Agent | 6/15 | Single markdown executor; orchestrator-verified |
| Coordination | 9/15 | Sibling handoff (002 feature files exist before 003 README links them) |
| **Total** | **59/100** | **Level 3 (program-aligned with sibling 013/002)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog states "-32001 removed" (false) | H | M | -32001 documented as still-live retryable recycle error. |
| R-002 | Tool count bumped 36→43 incorrectly | M | M | 36-tool count preserved; behaviors added instead. |
| R-003 | A behavioral claim drifts from the runtime | H | L | Each claim traces to a read source anchor. |
| R-004 | New file not registered in the index | M | L | REQ-007 requires index registration for every new file. |

---

## 11. USER STORIES

### US-001: Discover checkpoint-v2 from the catalog (Priority: P0)

**As an** operator about to run a risky migration, **I want** the catalog to describe the v2 `VACUUM INTO` full-DB checkpoint path, **so that** I understand the rollback net available on the large DB without reading source.

**Acceptance Criteria**:
1. Given the catalog, When I open the checkpoint creation file, Then it describes the v2 path, v29 columns, shard-attach, and the `.needs-rebuild` sentinel.

### US-002: Disambiguate the error codes (Priority: P1)

**As an** operator debugging a dispatch, **I want** one place that explains `E429`, `-32001`, and `-32002`, **so that** I know which are retryable.

**Acceptance Criteria**:
1. Given the error-code reference file, When I read it, Then `-32001` is documented as still-live and retryable and `-32002` as non-retryable protocol fail-closed.

---

## 12. OPEN QUESTIONS

- None blocking. The sk-git convention is documented as a catalog cross-reference to the sk-git skill rather than duplicating skill-owned detail.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
