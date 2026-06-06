---
title: "003 — Memory Index & Causal Write Lifecycle"
description: "Phase-parent control packet grouping the memory store's incremental-index and causal-graph write lifecycle: incremental index foundation, causal-edge tombstones, deterministic metadata-edge promotion, and desired/prior write-path reconciliation."
trigger_phrases:
  - "027 phase 003"
  - "memory index causal lifecycle"
  - "incremental memory index"
  - "causal graph tombstones"
  - "frontmatter causal edge promoter"
  - "statediff reconciliation layer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Grouped former 003-006 leaves into this phased parent"
    next_safe_action: "Implement 001-incremental-index-foundation first"
    blockers: []
    key_files: ["spec.md", "description.json", "graph-metadata.json"]
    completion_pct: 0
---
# Feature Specification: 003 — Memory Index & Causal Write Lifecycle (Phase Parent)

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | phase-parent |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement` |
| **Packet ID** | `system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle` |
| **Soft Dependency** | `system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety` — the P0 auto-provenance / manual-edge / retention safety fixes are a coordination precondition for the tombstone child. |
| **Scope Boundary** | Incremental index substrate plus the causal-edge write lifecycle. P0 write-safety correctness is owned by sibling `002-memory-write-safety`; learning reducers are owned by sibling `005-learning-feedback-reducers`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:purpose -->
## 2. ROOT PURPOSE

This phase-parent groups four children that together form one program: the memory store's incremental-index and causal-graph **write lifecycle**. They were previously flat children `003`-`006` of `027`, but they read as a single sequential effort — each child hands off to the next and the last child cannot be validated without the first.

The program builds the substrate, then layers the causal-edge lifecycle on top of it:

1. **Incremental index foundation** — canonical-input memoization, dependency edges, and chunk-level fingerprints so scan planning can prove what changed before parsing and embedding.
2. **Causal-edge tombstones** — route every causal-edge deletion through one lifecycle helper with audit rows, so generated edges can be cleaned up safely before their volume grows.
3. **Metadata-edge promoter** — promote deterministic parent/child/parent-chain causal edges from authored packet metadata, relying on the tombstone lifecycle for cleanup.
4. **Write-path reconciliation** — a typed desired/prior statediff that plans durable row changes before handlers mutate storage, keyed on the stable chunk identities from the index foundation.

The parent holds no implementation tasks itself; it routes work into the four child packets with explicit dependency order.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:phase-map -->
## 3. PHASE DOCUMENTATION MAP

| Child | Scope | Primary subsystem | Depends On |
|-------|-------|-------------------|------------|
| `001-incremental-index-foundation` | Canonical-input memoization, dependency edges, chunk-level fingerprints for incremental indexing. | `lib/storage/incremental-index.ts`, `lib/parsing/memory-parser.ts`, `handlers/memory-index.ts`, `lib/search/vector-index-schema.ts` | External rename predecessor only; foundation of this group. |
| `002-causal-edge-tombstones` | Tombstone audit rows before hard-delete, single sweep helper, delete-path integration, health auto-repair. | `lib/causal/sweep.ts`, `lib/storage/causal-edges.ts`, delete handlers | `001-incremental-index-foundation`; coordinates with sibling `002-memory-write-safety` (P0 auto-provenance precondition). |
| `003-metadata-edge-promoter` | Deterministic causal-edge promotion from authored packet metadata during indexing. | `lib/causal/frontmatter-promoter.ts`, `lib/storage/causal-edges.ts` | `002-causal-edge-tombstones` (generated-edge cleanup must exist first). |
| `004-write-path-reconciliation` | Typed desired/prior statediff reconciliation replacing scattered post-mutation hooks. | `lib/storage/statediff.ts`, `handlers/memory-index.ts`, `handlers/memory-save.ts` | `001-incremental-index-foundation` (hard — chunk fingerprints as diff keys); `003-metadata-edge-promoter` (soft — generated edges as diff targets). |

> **Numbering note:** these children were former `027` flat leaves `003`-`006`; on grouping they were renumbered `001`-`004` in handoff order. Path-style references (`packet_pointer`, embedded `validate.sh` paths) were updated; in-body narrative that still cites the old global phase numbers (e.g. "Phase 004") refers to the corresponding child by its prior number.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:execution-order -->
## 4. EXECUTION ORDER

1. Land sibling `002-memory-write-safety` first (P0 write-safety preconditions; coordination dependency for the tombstone child).
2. Land `001-incremental-index-foundation` (substrate: fingerprints, memo records, dependency edges, stable chunk metadata).
3. Land `002-causal-edge-tombstones` (lifecycle helper + tombstone audit before generated edge volume grows).
4. Land `003-metadata-edge-promoter` (deterministic edge promotion, using tombstone-backed cleanup).
5. Land `004-write-path-reconciliation` (statediff reconciliation, keyed on `001`'s chunk identities).
<!-- /ANCHOR:execution-order -->

---

<!-- ANCHOR:what-needs-done -->
## 5. WHAT NEEDS DONE

- Add the incremental index substrate additively before changing the file-level fast path: memo records, dependency edges, chunk fingerprints, chunk kinds, and chunk line spans.
- Tombstone every active causal-edge delete path before hard-delete, through a single sweep helper, with health auto-repair for orphans.
- Promote only validated parent/child/parent-chain metadata edges; avoid duplicating already-wired manual metadata links; route stale generated edges through the tombstone lifecycle.
- Keep statediff an explicit action/subscriber aid, not an implicit source of truth; fall back to whole-document targets when stable chunk keys are unavailable.
- Each child must pass `validate.sh --strict` independently before the next begins.
<!-- /ANCHOR:what-needs-done -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Strict validation must pass for this parent and each child:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle --strict
```

Run the same command for each direct child folder before claiming the phase-parent scaffold is valid.
<!-- /ANCHOR:validation -->
