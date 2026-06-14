---
title: "Tasks: Code Graph Code-Only Indexing and Selectable Maintainer Mode"
description: "Tasks for dropping markdown from the code graph and making maintainer-mode selectable."
trigger_phrases:
  - "code only indexing tasks"
  - "exclude markdown tasks"
  - "selectable maintainer mode tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/009-code-graph-code-only-indexing"
    last_updated_at: "2026-06-14T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All tasks complete"
    next_safe_action: "Recycle code-index daemon + full rescan"
---
# Tasks: Code Graph Code-Only Indexing and Selectable Maintainer Mode

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Trace the file-type gate (`defaultIncludeGlobs`) vs the category gate (`INDEX_*`)
- [x] T002 Confirm `.env.local` per-`INDEX_*` is inert (config wins); only `MAINTAINER_MODE` beats it

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove `**/*.md` from `defaultIncludeGlobs` (`indexer-types.ts`)
- [x] T004 Extract pure `resolveMaintainerModeCategories` + selectable force + export (`mk-code-index-launcher.cjs`)
- [x] T005 Set `.env.local` to `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=skills,plugins`
- [x] T006 [P] Update `ENV_REFERENCE.md` + `lib/README.md`

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Update `code-graph-indexer.vitest.ts` expectations (markdown excluded, config kept)
- [x] T008 Add `launcher-maintainer-mode.vitest.ts` resolver unit tests
- [x] T009 `tsc --build`; run indexer + resolver + parser tests; node --check launcher; comment hygiene

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`, no `[B]`
- [x] Markdown excluded; maintainer-mode selectable; dist builds; relevant tests green
- [x] Deferred: code-index daemon recycle + full rescan to drop existing `.md` nodes (activates next session)

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->
