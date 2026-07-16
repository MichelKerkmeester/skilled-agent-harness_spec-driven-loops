---
title: "Implementation Summary: Governance Retention Decouple"
description: "Source changes, tests, and verification result for ADR-002 Option A."
trigger_phrases:
  - "governance retention decouple implementation summary"
  - "DEFAULT_EPHEMERAL_TTL_MS implementation"
  - "ADR-002 Option A verification"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/001-governance-retention-decouple"
    last_updated_at: "2026-05-14T11:10:00Z"
    last_updated_by: "cli-codex"
    recent_action: "summary_complete"
    next_safe_action: "Treat llama-cpp memory_search failure as separate provider issue."
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| Spec Folder | `032-substrate-repair-followups/001-governance-retention-decouple` |
| Completed | 2026-05-14 |
| Level | 2 |
| Actual Effort | Targeted implementation and verification |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented ADR-002 Option A in the governance layer. Ephemeral retention no longer requires full governed-ingest audit metadata, and ephemeral saves without an explicit `deleteAfter` receive the exported default 24h TTL.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Modified | Source governance behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/governance/scope-governance.js` | Modified | Runtime mirror while build is broken. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/governance-ephemeral-decouple.vitest.ts` | Created | Focused coverage for three required cases. |
| Packet docs | Created/modified | Level 2 evidence and metadata. |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Read the packet spec, ADR-002, source helper, and memory-save call site.
2. Patched the source governance helper.
3. Mirrored the patch to ignored dist JS.
4. Added focused vitest coverage.
5. Ran focused and regression vitests.
6. Attempted live save/search/delete verification and documented the provider blocker.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Preserve explicit ephemeral `deleteAfter` without triggering governance | Required by Case C; otherwise explicit TTL-only ephemeral saves still fail. |
| Leave full governance enforcement intact for scope/provenance metadata | Keeps audit behavior unchanged for governed callers. |
| Patch dist directly | Packet required dual patch because build is broken. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Focused vitest | PASS | `npx vitest run tests/governance-ephemeral-decouple.vitest.ts`: 1 file passed, 3 tests passed. |
| Governance regression vitests | PASS | 4 files passed, 30 tests passed. |
| Live `memory_save` without governance fields | PASS | Dist handler accepted `retentionPolicy: "ephemeral"` and returned id `3372`; no E085 governance rejection occurred. |
| Stored `delete_after` | PASS | The live script queried `memory_index` for id `3372` and verified `delete_after` was non-null before search. |
| Live `memory_search` top-3 | FAIL | Query search failed because local llama-cpp could not initialize the Metal backend for query embeddings. |
| Cleanup | PASS | Id `3372` was cleaned up; a follow-up check returned `null`. The sandbox directory was removed. |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The requested `memory_search` verification is blocked by the local llama-cpp provider failure in this runtime.
- `npm run build` was intentionally not run per packet constraints.

<!-- /ANCHOR:limitations -->
