---
title: "Tasks: Drift Gate and Shared Synopsis Extractor [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "generated metadata drift gate"
  - "shared synopsis extractor"
  - "derive packet synopsis"
  - "check generated metadata drift"
  - "source doc hashes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/037-drift-gate-synopsis-extractor"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed all build and verification tasks for drift gate and shared extractor"
    next_safe_action: "Decide the scoped migration that flips the flag on"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/packet-synopsis.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/generated-metadata-drift.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/generated-metadata-drift.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Drift Gate and Shared Synopsis Extractor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Captured `extractDescription` precedence and the 150-char `MAX_DESCRIPTION_LENGTH` (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [x] T002 Captured the `deriveCausalSummary`/`extractSummary` precedence and confirmed the divergence (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [x] T003 [P] Defined `SPECKIT_GENERATED_METADATA_DRIFT_GATE` (default-OFF, grandfather = flag-off) — the gate compares only the two synopsis strings, so volatile timestamps are excluded by construction
- [x] T004 [P] `source_doc_hashes` persists in `graph-metadata.json` under `derived`, optional + flag-gated; the canonical packet docs feed the freshness key (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Authored the shared `derivePacketSynopsis(specContent, field)` helper with explicit precedence and `SYNOPSIS_FIELD_LIMITS` (`.opencode/skills/system-spec-kit/mcp_server/lib/description/packet-synopsis.ts`)
- [x] T006 Routed the `description` field through the shared helper behind the flag (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [x] T007 Routed the `causal_summary` field through the shared helper with the longer limit (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [x] T008 Added `checkGeneratedMetadataDrift` that re-derives, compares, and returns a report without writing (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/generated-metadata-drift.ts`, re-exported from the parser)
- [x] T009 Added the optional `source_doc_hashes` field and persist it on generation behind the flag (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`)
- [x] T010 Wired `GENERATED_METADATA_DRIFT` as a report-only strict rule, grandfather = flag-off (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`, `scripts/validation/generated-metadata-drift.ts`, `scripts/lib/validator-registry.json`)
- [x] T011 Surfaced the drift report in the backfill summary `drift` array without mutating the folder (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Added the vitest covering drift detection, no-drift, shared-extractor precedence, the no-write assertion, and the grandfather report mode — 11/11 green (`.opencode/skills/system-spec-kit/scripts/tests/generated-metadata-drift.vitest.ts`)
- [x] T013 Confirmed flag-off resolves drift to `info` (verdict unchanged) and flag-on to `error`, both fields share one extractor and flip together, and a doc edit changes `source_doc_hashes` — all proven in the vitest
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — vitest 11/11, typecheck green, validate.sh --strict exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
