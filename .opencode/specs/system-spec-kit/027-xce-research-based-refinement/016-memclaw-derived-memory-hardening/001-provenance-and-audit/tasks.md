---
title: "Tasks: Phase 1: provenance-and-audit [template:level_1/tasks.md]"
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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-memclaw-derived-memory-hardening/001-provenance-and-audit"
    last_updated_at: "2026-06-06T10:10:45Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Populate Phase 1 provenance-and-audit task list"
    next_safe_action: "Plan or implement T001 source_kind column migration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-provenance-and-audit"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Add `source_kind` enum column (`human|agent|system|import|feedback`) + forward migration, defaulting from existing `provenance_source` (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Derive `source_kind` at write ingress (server-side, from caller/path/tool) for new records (`.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts`)
- [ ] T003 Enforce the manual/constitutional overwrite guard in the pre-mutation phase of update: skip protected fields, persist safe fields (`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`)
- [ ] T004 Standardize the automated-mutation audit append with a deterministic dedup key (actor/source/reason) (`.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts`)
- [ ] T005 Add the constitutional rule "automated writers may never overwrite manual/constitutional fields" (`.opencode/skills/system-spec-kit/constitutional/automated-writers-never-overwrite-manual.md`)
- [ ] T006 Attach the "skipped to protect manual data" hint to the response envelope (`hints[]` / `assistiveRecommendation`) when an overwrite is blocked (`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 [P] Unit-test the pre-mutation overwrite guard: an automated update of a manual/constitutional field is skipped while safe fields in the same payload still persist (vitest) (`.opencode/skills/system-spec-kit/mcp_server/handlers/__tests__/memory-crud-update.test.ts`)
- [ ] T008 [P] Unit-test the deduped audit append: one automated mutation appends exactly one `mutation_ledger` row (actor/source/reason); an identical repeat appends none (vitest) (`.opencode/skills/system-spec-kit/mcp_server/lib/storage/__tests__/mutation-ledger.test.ts`)
- [ ] T009 Update the memory-system docs to describe `source_kind` and the write-ingress overwrite guard (`.opencode/skills/system-spec-kit/mcp_server/README.md`)
- [ ] T010 Manual end-to-end verification: an automated update of a human-authored field is skipped and the response carries the "skipped to protect manual data" hint; confirm via `/doctor memory` audit summary (`.opencode/commands/doctor/assets/doctor_memory.yaml`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

