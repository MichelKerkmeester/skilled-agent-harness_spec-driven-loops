---
title: "Implementation Summary: 027/005 Metadata Edge Promoter"
description: "Completed deterministic metadata-edge promotion for parent, child, and parent-chain packet metadata with idempotent generated causal edges."
trigger_phrases:
  - "metadata edge promoter implementation"
  - "frontmatter causal edges shipped"
  - "causal edge provenance v33"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/003-metadata-edge-promoter"
    last_updated_at: "2026-06-10T08:20:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Fixed description metadata stale-cleanup scope for mixed graph/description rows"
    next_safe_action: "Use v33 promoter after mixed-row regression and canary suite stay green"
    blockers: []
    key_files: ["frontmatter-promoter.ts", "causal-edges.ts", "memory-index.ts"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-027-003-003-metadata-edge-promoter"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Manual graph metadata links stay on the existing causal-links path."
      - "Generated parent and lineage links use v33 provenance columns."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-metadata-edge-promoter |
| **Completed** | 2026-06-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The memory index now promotes authored packet lineage metadata into causal edges during scan indexing. It handles only the validated gaps: `graph-metadata.json.parent_id`, `graph-metadata.json.children_ids`, and `description.json.parentChain`; already-wired manual metadata links remain on the existing causal-link processor path.

### Deterministic Promoter

`lib/causal/frontmatter-promoter.ts` parses graph metadata and description metadata, normalizes packet ids, resolves packet memory rows, and emits generated causal edges with deterministic relation mappings. Parent and parent-chain metadata create `derived_from` edges from the current packet to the ancestor. Child metadata creates `enabled` edges from the current packet to each child.

### Generated Edge Storage

`causal_edges` now supports `confidence` and `extraction_method` through additive schema v33. Generated frontmatter edges write `created_by='auto'`, `extraction_method='frontmatter'`, and `confidence=1.0` without requiring host DB mutation in tests.

### Scan Integration and Cleanup

`memory-index.ts` invokes the promoter after successful metadata indexing and reports processed, resolved, inserted, skipped-manual, stale-tombstoned, stale-deleted, and warning counts in the scan result. Stale generated edges for removed metadata are routed through the tombstone sweep helper before deletion, scoped to the same canonical packet memory row used for insertion.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/frontmatter-promoter.ts` | Created | Extracts and promotes validated metadata relationships. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modified | Accepts optional generated-edge confidence and extraction method. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/sweep.ts` | Modified | Captures new provenance fields in tombstone restore metadata. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modified | Bumps schema to v33 with additive causal-edge provenance columns. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified | Runs metadata promotion after successful indexing. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/frontmatter-promoter.vitest.ts` | Created | Verifies mappings, idempotency, warnings, manual preservation, and tombstones. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts` | Modified | Keeps the minimal schema footprint current with v33 provenance columns. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-schema-incremental-foundation.vitest.ts` | Modified | Covers incremental foundation behavior for the v33 schema path. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` | Modified | Pins terminal schema version to 33 and verifies v33 migration. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stayed narrow: no LLM extraction, no similarity matching, and no duplicate handling of `manual.depends_on`, `manual.supersedes`, or `manual.related_to`. Tests prove re-running the promoter does not create duplicate rows and does not weaken manual edges.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Promote only parent, children, and parentChain fields | The current parser already sends manual metadata relationships through the causal-links processor. Re-promoting them would duplicate existing behavior. |
| Add schema v33 instead of overloading existing fields | `confidence` and `extraction_method` make generated edges auditable without changing existing manual rows. |
| Skip generated writes when a manual edge already exists for the same endpoints and relation | Curated evidence and strength must survive deterministic automation. |
| Use tombstone sweep for stale generated edges | Removing metadata should preserve recovery context before active edge deletion. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS, exited 0. |
| `npx vitest run tests/frontmatter-promoter.vitest.ts tests/vector-index-schema-migration-refinements.vitest.ts tests/vector-index-schema-compatibility.vitest.ts` | PASS, 3 files and 20 tests. |
| `npx vitest run tests/frontmatter-promoter.vitest.ts tests/*causal*.vitest.ts tests/secret-scrubber.vitest.ts tests/vector-index-schema-compatibility.vitest.ts tests/vector-index-schema-migration-refinements.vitest.ts` | PASS, 16 files and 330 tests. |
| `python3 ../../sk-code/scripts/check-comment-hygiene.sh ...` | PASS for all modified code and test files. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/003-metadata-edge-promoter --strict` | PASS, 0 errors and 0 warnings. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit` | FAIL on out-of-scope pre-existing files: `canonical-fingerprint.ts`, `memo.ts`, and `deploy-mcp.sh`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The alignment verifier reports three out-of-scope files outside this phase's allowed writes. They were not modified.
2. The promoter resolves packet ids to indexed memory rows. Unindexed targets are reported as warnings and no partial edge is created.
<!-- /ANCHOR:limitations -->
