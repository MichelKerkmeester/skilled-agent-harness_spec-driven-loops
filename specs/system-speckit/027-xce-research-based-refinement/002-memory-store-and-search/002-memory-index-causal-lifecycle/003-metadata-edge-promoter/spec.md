---
title: "005 — Metadata Edge Promoter"
description: "Derive causal edges deterministically from spec packet metadata during indexing. This is Phase 1 only: structured frontmatter and graph metadata are promoted without LLM extraction, similarity matching, or quarantine review."
trigger_phrases:
  - "frontmatter causal edge promoter"
  - "auto causal edges"
  - "description depends_on"
  - "graph metadata children"
  - "deterministic edge promotion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/003-metadata-edge-promoter"
    last_updated_at: "2026-06-10T08:20:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Shipped metadata edge promoter with tests"
    next_safe_action: "Use v33 promoter in memory index scans"
    blockers:
      - "004"
    key_files:
      - "lib/causal/frontmatter-promoter.ts"
      - "lib/spec/graph-metadata.ts"
      - "handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-005-spec-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "depends_on relation"
    answered_questions:
      - "LLM extraction deferred"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 005 — Metadata Edge Promoter

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-13 |
| **Branch** | `scaffold/005-metadata-edge-promoter` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 21 |
| **Predecessor** | 004-causal-edge-tombstones |
| **Successor** | 006-write-path-reconciliation |
| **Handoff Criteria** | Indexing a packet with structured relationship metadata creates idempotent auto causal edges with deterministic provenance. |

### Research Basis

| Source | Evidence |
|--------|----------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:613` | `relation TEXT NOT NULL CHECK(relation IN (` shows relation vocabulary is constrained in schema. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:618` | `extracted_at TEXT DEFAULT (datetime('now')),` shows extraction time already exists for active edges. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:619` | `created_by TEXT DEFAULT 'manual',` shows manual versus auto provenance already has a column. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18` | `const RELATION_TYPES = Object.freeze({` defines the live relation vocabulary. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:269` | `Auto edges capped at MAX_AUTO_STRENGTH` shows generated edges already have safety limits. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:326` | `if (existing) {` starts the current idempotent update branch for an existing edge. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:344` | `INSERT INTO causal_edges (` starts the insert branch for new edges. |
| `research/research.md:179` | Phase 1 should parse `graph-metadata.json` and `description.json`, normalize packet ids, resolve memory rows, and emit constrained auto edges with `extraction_method='frontmatter'`. |
| `research/research.md:228` | K1.2 should precede K1.5 because generated edges can become stale if lifecycle cleanup remains incomplete. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase is the deterministic, low-risk first step for causal-edge automation. The existing spec packet metadata already encodes parent-child, dependency, supersession, and related-work relationships. The memory system should not require users to manually run causal-link commands for relationships that are already structured.

**Scope Boundary**: promote only structured metadata relationships from `description.json` and `graph-metadata.json`. No LLM extraction, embedding similarity matching, pending-edge quarantine, or confidence calibration is included.

**Dependencies**:
- Requires packet 004 tombstone lifecycle so corrected metadata can clean up previously generated edges.
- Existing causal relation vocabulary must be mapped explicitly before edge creation.
- Indexed packets must be resolvable to source and target memory ids.

**Deliverables**:
- `lib/causal/frontmatter-promoter.ts` deterministic promoter.
- Relation extractor helper in `lib/spec/graph-metadata.ts`.
- Additive causal edge provenance columns.
- `handlers/memory-index.ts` post-index hook that promotes metadata-derived edges idempotently.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Causal edges are currently created mostly through manual `memory_causal_link` flows. That misses relationships already present in packet metadata, including `description.json.parent_id`, `manual.depends_on`, `supersedes`, `related_to`, and `graph-metadata.json.children_ids`.

The result is unnecessary manual graph maintenance and lower graph coverage for the most reliable relationships in the system. The metadata is structured, local, and deterministic, so relying on manual edge creation is needless friction.

**Overlap check (2026-06-05 audit)**: `relation-backfill.ts` covers similarity/lineage/supersession backfill, NOT packet-metadata promotion — keep this promoter narrow to avoid duplicating it.

### Purpose

Read structured spec relationship metadata during indexing and promote it into idempotent causal edges with `created_by='auto'`, `extraction_method='frontmatter'`, and deterministic confidence of 1.0.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `lib/causal/frontmatter-promoter.ts`.
- Read `description.json.parent_id`.
- `manual.depends_on/supersedes/related_to` are ALREADY promoted via `graph-metadata-parser.ts`->`causal-links-processor.ts`; this promoter SKIPS them (no duplicate).
- Read `graph-metadata.json.children_ids`.
- Read `description.json.parentChain`.
- Normalize packet ids to resolvable memory rows.
- Emit causal edges with `confidence = 1.0`.
- Emit causal edges with `created_by = 'auto'`.
- Emit causal edges with `extraction_method = 'frontmatter'`.
- Add `confidence REAL DEFAULT 1.0` to `causal_edges`.
- Add `extraction_method TEXT DEFAULT 'manual'` to `causal_edges`.
- Add or preserve `extracted_at TEXT` for generated provenance.
- Dedupe auto edges by source, target, relation, source anchor, and target anchor.
- Document relation direction semantics for each supported field before promotion.

### Concrete Field Inventory (iteration-033 evidence)

The following fields have confirmed HIGH promotion confidence with file:line references:

| Field | Source File:Line | Promotion Edge | Already Wired? |
|-------|-----------------|----------------|----------------|
| `manual.depends_on[*].packet_id` | `graph-metadata-parser.ts:1338` | `this → ENABLED (blocks reverse) → target` | Yes — via `packetReferencesToCausalLinks()` → `causal-links-processor.ts:67-73` |
| `manual.supersedes[*].packet_id` | `graph-metadata-parser.ts:1342` | `this → SUPERSEDES → target` | Yes — same pipeline |
| `manual.related_to[*].packet_id` | `graph-metadata-parser.ts:1343` | `this → SUPPORTS → target` | Yes — same pipeline |
| `graph-metadata.json.parent_id` | `graph-metadata-schema.ts:34-71` | `child → DERIVED_FROM → parent` | **No — gap. New promoter required.** |
| `graph-metadata.json.children_ids[*]` | `graph-metadata-schema.ts:34-71` | `parent → ENABLES → child` | **No — gap. Infer from parent_id promotion.** |
| `description.json.parentChain[*]` | `memory-parser.ts:513` | `this → DERIVED_FROM → ancestor chain` | **No — gap. Complements parent_id for older packets.** |

Fields already wired need a deduplication guard (`insertEdgesBatch` upsert semantics) to become idempotent on re-index. Fields marked as gaps are the primary new work for this phase.

Fields excluded from Phase 005 scope: `derived.last_active_child_id` (MEDIUM confidence, recency semantics need weight decision), `derived.entities` (LLM-derived, not manually authored), `description.json.memoryNameHistory` (not cross-referenceable as memory IDs).

### Out of Scope

- LLM-based causal extraction from prose.
- Embedding similarity candidate matching.
- Pending-edge quarantine table or review UI.
- Confidence calibration across extractor types.
- Relation vocabulary expansion.
- Auto-promotion from unstructured body text.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/frontmatter-promoter.ts` | Create | Parse metadata relationships and create deterministic auto edge intents. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Add `confidence`, `extraction_method`, and migration support for edge provenance. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Invoke promoter after packet metadata is indexed and source memory id is known. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/spec/graph-metadata.ts` | Modify | Add reusable relationship extraction and packet-id normalization helpers. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modify | Accept confidence and extraction method for auto-created edges. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `depends_on` from any indexed packet produces a causal edge. | Indexing a packet with `manual.depends_on` creates one edge per resolvable dependency. |
| REQ-002 | `supersedes` from any indexed packet produces a causal edge. | Indexing a packet with `manual.supersedes` creates a `supersedes` relation to the target packet. |
| REQ-003 | Promoted edges are idempotent across re-scans. | Re-indexing the same packet produces zero duplicate causal edge rows. |
| REQ-004 | Generated edges have deterministic provenance. | Promoted rows include `created_by='auto'`, `extraction_method='frontmatter'`, `confidence=1.0`, and `extracted_at`. |
| REQ-005 | Relation direction semantics are explicit. | A checked-in mapping table documents source, target, and relation for parent, child, depends-on, supersedes, and related-to fields. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Unresolvable targets are reported, not guessed. | Promoter returns warnings for missing target packet ids and creates no partial edge. |
| REQ-007 | Auto edges participate in lifecycle cleanup. | Correcting or removing metadata can route stale auto edges through packet 004 tombstone cleanup. |
| REQ-008 | Existing manual edges are not overwritten blindly. | If a manual edge already exists for the same identity, promoter does not reduce strength, evidence, or creator without explicit policy. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Indexing a packet with `depends_on:[X]` creates a causal edge from the current packet to X using the chosen dependency relation, with `created_by=auto` and `extraction_method=frontmatter`.
- **SC-002**: Re-indexing the same packet produces no duplicate edges.
- **SC-003**: Removing a structured relationship allows stale auto edges to be tombstoned by the lifecycle helper from packet 004.
- **SC-004**: LLM extraction, similarity matching, and quarantine review are absent from the first implementation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 004 tombstone lifecycle. | High | Do not ship promoter writes before generated-edge cleanup exists. |
| Risk | Direction semantics can be wrong. | High | Block implementation until `depends_on`, `supersedes`, `related_to`, parent, and child mappings are documented and tested. |
| Risk | Metadata ids may not resolve to memory ids. | Medium | Normalize packet ids and emit warnings rather than guessing endpoints. |
| Risk | Auto edges may collide with manual edges. | Medium | Preserve manual rows unless an explicit merge policy is approved. |
| Risk | Schema already has `extracted_at` but lacks `confidence` and method. | Low | Add only missing columns and keep existing `extracted_at` compatible. |
| Dependency | Existing relation vocabulary. | Medium | Use only allowed relations from `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, and `supports`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `depends_on` map to `supports` or `caused`?
- Should `related_to` create `supports`, `derived_from`, or no edge until a narrower relation is supplied?
- Should parent-child lineage use `derived_from` from child to parent, or `supports` from parent to child?
- Should existing manual edges block auto-edge creation or be annotated with additional frontmatter provenance?
<!-- /ANCHOR:questions -->

---

## Amendment — caura-memclaw Research (010)

Make generated-edge promotion NATURAL-KEY IDEMPOTENT and have it SKIP manual edges: a promoter re-run must never overwrite a manual `created_by` or its evidence. This reinforces REQ-008's preserve-manual-rows intent with a deterministic upsert key. Source: research/008-caura-memclaw-fleet-memory-teachings/sub-packet-proposals.md; planned in 010/004.

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
