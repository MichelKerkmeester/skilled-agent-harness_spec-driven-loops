---
title: "Tasks: Phase 1: provenance-and-audit"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "memory source_kind provenance tasks"
  - "auto overwrite manual constitutional guard"
  - "mutation_ledger automated audit"
  - "write ingress provenance derivation"
  - "provenance audit phase tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/001-provenance-and-audit"
    last_updated_at: "2026-06-10T12:25:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented provenance guard and audit"
    next_safe_action: "Begin next child phase after handoff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-provenance-and-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: provenance-and-audit

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Add `source_kind` enum column (`human|agent|system|import|feedback`) + forward migration, defaulting from existing `provenance_source` (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`) Evidence: schema migration canaries passed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Derive `source_kind` at write ingress (server-side, from caller/path/tool) for new records (`.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts`) Evidence: `create-record-identity.vitest.ts` passed.
- [x] T003 Enforce the manual/constitutional overwrite guard in the pre-mutation phase of update: skip protected fields, persist safe fields (`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`) Evidence: update guard suite passed.
- [x] T004 Standardize the automated-mutation audit append with a deterministic dedup key (actor/source/reason) (`.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts`) Evidence: ledger and hook suites passed.
- [x] T005 Add the constitutional rule "automated writers may never overwrite manual/constitutional fields" (`.opencode/skills/system-spec-kit/constitutional/automated-writers-never-overwrite-manual.md`) Evidence: loader regression passed.
- [x] T006 Attach the "skipped to protect manual data" hint to the response envelope (`hints[]` / `assistiveRecommendation`) when an overwrite is blocked (`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`) Evidence: update guard suite passed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P] Unit-test the pre-mutation overwrite guard: an automated update of a manual/constitutional field is skipped while safe fields in the same payload still persist (vitest) (`.opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts`) Evidence: 8 update tests passed.
- [x] T008 [P] Unit-test the deduped audit append: one automated mutation appends exactly one `mutation_ledger` row (actor/source/reason); an identical repeat appends none (vitest) (`.opencode/skills/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts`) Evidence: ledger suite passed.
- [x] T009 Update the phase docs to describe `source_kind`, the write-ingress overwrite guard, and decisions (`implementation-summary.md`) Evidence: implementation summary reconciled.
- [x] T010 End-to-end handler verification: an automated update of a human-authored field is skipped and the response carries the "skipped to protect manual data" hint (vitest) (`.opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts`) Evidence: canary set passed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Handler verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
