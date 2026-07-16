---
title: "Tasks: Generator Hardening [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "graph metadata source fingerprint"
  - "phase child contract unify"
  - "access telemetry split"
  - "freshness telemetry split"
  - "generator hardening"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/038-generator-hardening"
    last_updated_at: "2026-07-04T17:11:56.393Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasked the fingerprint, child contract, and telemetry split build"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Generator Hardening

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

- [x] T001 Confirmed the 031 identity resolver (`resolveSpecFolderIdentity`, `isIdentityMergeSafetyEnabled`) and merge-path lineage guard already shipped in `graph-metadata-parser.ts`
- [x] T002 Confirmed the index layer hosts the access and freshness write path: a new `access-telemetry.ts` store next to the runtime database holds the relocated signals. NOTE: the residual generated-JSON pointer lived in the parser carry-forward, not `folder-discovery.ts`, so the split landed in `access-telemetry.ts` + `resume-ladder.ts`
- [x] T003 Defined the volatile-ignoring projection: ISO-8601 datetimes normalized out before the sha256, mirroring the idempotency compare so a no-op re-derive is identical (`graph-metadata-parser.ts` `computeSourceFingerprintFromDocs`)
- [x] T004 [P] Flag is `SPECKIT_GENERATOR_HARDENING` (default-off); the strict read honors the existing `SPECKIT_GENERATED_METADATA_GRANDFATHER` report mode
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Added the `source_fingerprint` write over the volatile-ignoring projection from the already-collected docs, behind the default-off flag (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [x] T006 Added the optional `source_fingerprint` field to the schema, tolerant of absence (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`)
- [x] T007 Added one shared `listPhaseChildren` helper consumed by both `isPhaseParent` and `resolveChildrenIds` behind the flag (`.opencode/skills/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [x] T008 Routed the access and freshness signals to the index-layer store behind the flag. DEVIATION: implemented as a new `access-telemetry.ts` store plus a `resume-ladder.ts` store-first read, since the residual JSON pointer was the parser carry-forward, not a `folder-discovery.ts` emit; the parser keeps carrying the JSON pointer for readback (the generate-context write relocation is the documented graduation step)
- [x] T009 Added the strict-mode `source_fingerprint` re-derive-and-compare read. DEVIATION: registered inside the existing first-class validator `lib/validation/generated-metadata-integrity.ts` (which `validate.sh` runs and which already owns the grandfather mode), not a new `scripts/rules/` bash check
- [x] T010 Authored the vitest. DEVIATION: placed at `mcp_server/tests/generator-hardening.vitest.ts` (the path the vitest config include glob covers and every sibling uses); the spec's `mcp_server/scripts/tests/` path is not in the config include list
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Confirmed via `generator-hardening.vitest.ts`: no-op re-derive is fingerprint-identical and does not dirty the file, a doc change differs, and `isPhaseParent` + `resolveChildrenIds` resolve through `listPhaseChildren` and agree on a fixture tree
- [x] T012 Confirmed via the vitest: a read event records to the index-layer store and leaves the generated JSON byte-identical, a resume resolves the last active child from the store, and a strict run over an un-migrated file reports `SOURCE_FINGERPRINT_MISSING` as a non-blocking grandfather note (status `info`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (15/15 vitest, `validate.sh --strict` exit 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
