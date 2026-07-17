---
title: "Implementation Plan: 027/005 Metadata Edge Promoter"
description: "Plan for deterministic causal edge promotion from packet metadata. Existing manual graph-metadata links are recognized as partially wired; this phase focuses on validated parent/child/parent-chain promotion and stale-edge cleanup safety."
trigger_phrases:
  - "027 phase 005"
  - "metadata edge promoter"
  - "frontmatter causal edges"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/003-metadata-edge-promoter"
    last_updated_at: "2026-06-10T08:20:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed promoter implementation and verification"
    next_safe_action: "Monitor scan warnings for unresolved packet IDs"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-005-research-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Parent, child, and parentChain promotion remain planned."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 027/005 Metadata Edge Promoter

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit MCP server |
| **Storage** | SQLite causal edges plus packet metadata index |
| **Testing** | Vitest with packet metadata fixtures |

### Overview

Phase 005 promotes only deterministic, authored packet metadata into causal edges. Continuation research narrowed the first implementation: preserve already-wired manual relationship behavior, add missing parent/child/parent-chain promotions, validate relation direction explicitly, and use tombstone-backed cleanup from Phase 004 before active edge replacement.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Current parser already handles `manual.depends_on`, `manual.supersedes`, and `manual.related_to`.
- [x] Missing high-confidence fields are identified: `graph-metadata.json.parent_id`, `graph-metadata.json.children_ids`, and `description.json.parentChain`.
- [x] Phase 004 tombstone lifecycle is available before stale generated-edge cleanup becomes active.

### Definition of Done
- [x] Relation mapping table documents source, target, and relation direction for every promoted field.
- [x] Promoter creates deterministic edge intents for parent, children, and parent-chain metadata.
- [x] Existing manual metadata relationship paths are deduplicated, not duplicated.
- [x] Unresolvable targets emit warnings and create no guessed edge.
- [x] Generated edges include provenance, confidence, and extraction method.
- [x] Strict validation passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Deterministic metadata-to-edge promotion with schema validation and idempotent storage. No LLM extraction, no embeddings, and no pending-edge review UI in this phase.

### Key Components
- **Relationship extractor**: reads authored parent/child/parent-chain metadata fields and normalizes packet ids. `depends_on`/`supersedes`/`related_to` are already wired via `graph-metadata-parser.ts`->`causal-links-processor.ts` and are NOT re-handled here.
- **Direction mapping table**: defines relation direction for parent, child, and parent-chain fields. Depends-on, supersedes, and related-to direction is owned by the existing causal-links pipeline, not this promoter.
- **Promoter**: converts validated relationships into generated edge intents with `confidence=1.0` and `extraction_method='frontmatter'`.
- **Idempotent edge writer**: inserts generated edges without weakening or overwriting manual edges.
- **Cleanup adapter**: when metadata changes, routes stale generated-edge cleanup through Phase 004 tombstones.

### Data Flow

`memory_index.ts` indexes packet metadata, resolves source and target memory rows, calls the metadata promoter, writes or updates generated edges idempotently, reports unresolved targets, and later tombstones stale generated edges when structured metadata is removed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/lib/graph/graph-metadata-parser.ts` | Parses manual metadata relationships | Confirm existing mapping and avoid duplicate promotion | Fixture proving no duplicate rows |
| `mcp_server/lib/parsing/memory-parser.ts` | Reads description metadata and parent chain | Reuse parent-chain extraction | Parser fixture |
| `mcp_server/lib/causal/frontmatter-promoter.ts` | Missing | Create deterministic promoter | Unit tests per field |
| `mcp_server/handlers/memory-index.ts` | Indexes packet metadata | Invoke promoter after source memory id is known | Integration fixture |
| `mcp_server/lib/storage/causal-edges.ts` | Writes causal rows | Support generated provenance and manual-edge preservation | Conflict tests |
| `mcp_server/lib/search/vector-index-schema.ts` | Causal edge schema migrations | Add provenance/confidence fields if absent | Migration fixture |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Field Inventory and Mapping
- [x] Confirm already-wired manual relationship fields and existing causal-link processor behavior.
- [x] Define relation direction semantics for parent, children, parentChain, depends_on, supersedes, and related_to.
- [x] Decide whether `related_to` maps to the current related/support relation without expanding vocabulary.

### Phase 2: Promoter Foundation
- [x] Create relationship extractor helper for authored metadata fields.
- [x] Create generated edge-intent type with source, target, relation, anchors, confidence, extraction method, and source field.
- [x] Create promoter unit tests for each supported field and unresolved target behavior.

### Phase 3: Storage and Index Integration
- [x] Add generated-edge provenance fields if missing.
- [x] Add idempotent generated-edge write path that does not weaken manual edges.
- [x] Invoke promoter from `memory-index.ts` after metadata rows are indexed.
- [x] Defer or tombstone stale generated edges through Phase 004 lifecycle cleanup.

### Phase 4: Verification
- [x] Test parent id creates child-to-parent edge.
- [x] Test children ids create parent-to-child edges or are inferred from child parent ids.
- [x] Test parentChain creates ancestor edges without duplicates.
- [x] Test re-indexing creates zero duplicates.
- [x] Test unresolved target warnings are visible.
- [x] Run strict validation for this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Relationship extraction and direction mapping | Vitest |
| Unit | Generated edge intent construction | Vitest |
| Integration | Indexing packet metadata into causal edges | Vitest/SQLite fixture |
| Regression | Already-wired manual metadata relationships do not duplicate | Vitest |
| Lifecycle | Removing metadata tombstones stale generated edges when Phase 004 is available | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 causal edge tombstones | Hard for active cleanup | Pending | Generated edges can be added report-only, but stale active cleanup should wait. |
| Phase 002 memory write safety | Safety precondition | Pending | Prevents generated/automatic writes from weakening manual edges. |
| Current metadata parser | Internal | Available | Provides authored relationship fields. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Promoter creates wrong relation direction, duplicates rows, or overwrites manual edges.
- **Procedure**: Disable promoter invocation from indexing; leave additive provenance fields inert.
- **Data Safety**: Generated edges must be identifiable by provenance so Phase 004 can tombstone/remove them if rollback requires cleanup.
<!-- /ANCHOR:rollback -->
