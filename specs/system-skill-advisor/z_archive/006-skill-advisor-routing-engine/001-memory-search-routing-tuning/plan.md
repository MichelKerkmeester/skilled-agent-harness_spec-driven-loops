---
title: "Implementation Plan: Search and Routing Tuning Coordination Parent"
description: "Reconstructed Level 2 implementation plan for the search-and-routing coordination parent. It restates the spec.md role and the three shipped sub-tracks; the original plan was never written."
trigger_phrases:
  - "search and routing tuning plan"
  - "routing engine coordination plan"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Search and Routing Tuning Coordination Parent

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime under the system-spec-kit MCP server and scripts |
| **Framework** | Spec Kit Memory search pipeline, 3-tier content router, graph-metadata parser |
| **Storage** | Not recorded |
| **Testing** | `npx tsc --noEmit`, `npx vitest run`, `validate.sh --strict` |

### Overview
Coordinate three shipped sub-tracks — search-fusion tuning, content-routing accuracy, and graph-metadata validation — as one packet-level lane while the child packets own the detailed implementation and research work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Child sub-phase scopes agreed for the three sub-tracks
- [ ] Packet root recognized as a live lane in the search-and-routing workstream

### Definition of Done
- [ ] All three sub-tracks complete with their per-sub-phase tests passing
- [ ] Root `spec.md` present with coordination scope and explicit child references
- [ ] `validate.sh --strict` clean for the packet root
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Coordination parent: the packet root holds identity, scope and provenance; the child sub-phase folders hold the detailed tuning and validation work.

### Key Components
- Search-fusion pipeline: `cross-encoder.ts`, `adaptive-fusion.ts`, `stage3-rerank.ts`, `content-router.ts`
- Content router: `content-router.ts`, `routing-prototypes.json`, `memory-save.ts`, `anchor-merge-operation.ts`
- Graph-metadata parser: `graph-metadata-parser.ts`

### Data Flow
Not recorded — the child sub-phase docs describe the runtime flows; this parent keeps the packet-level view only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns task state.

### Phase 1: Search-fusion tuning (sub-track 001)
- [ ] Neutralize the cross-encoder length penalty, add reranker cache telemetry, add the internal continuity fusion profile, raise the rerank minimum, align doc surfaces, and validate the continuity profile

### Phase 2: Content-routing accuracy (sub-track 002)
- [ ] Fix delivery/progress confusion, fix handover/drop confusion, wire the Tier 3 LLM classifier, align doc surfaces, add task-update merge safety, and enrich the Tier 3 prompt

### Phase 3: Graph-metadata validation (sub-track 003)
- [ ] Fix status derivation, sanitize `key_files`, deduplicate entities, normalize legacy traversal, align doc surfaces, add real path resolution, and improve entity quality
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Search fusion, content router, graph-metadata parser | `npx vitest run` |
| Integration | Graph-metadata backfill and schema suites | `npx vitest run` |
| Manual | `validate.sh --strict` for the packet root | shell |

Per-sub-phase command output is recorded in `implementation-summary.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child sub-phase packets | Internal | Complete | They own the detailed tuning and validation work |
| Search-fusion sub-track (001) | Internal | Complete | Feeds the search pipeline the other tracks observe |
| Content-routing sub-track (002) | Internal | Complete | Feeds the save-path routing contract |
| Graph-metadata sub-track (003) | Internal | Complete | Feeds packet-level graph provenance |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the sub-tracks were worked.
<!-- /ANCHOR:rollback -->
