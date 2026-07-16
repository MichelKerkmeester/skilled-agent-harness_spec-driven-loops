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
    packet_pointer: "system-code-graph/034-code-graph-scatter-from-027/001-code-graph-code-only-indexing"
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

<!-- ANCHOR:phase-4 -->
## Phase 4: Post-Review Remediation

- [x] T010 F1 Enforce include-glob file-type policy in `collectSpecificFiles` + indexer test (`lib/structural-indexer.ts`, `tests/code-graph-indexer.vitest.ts`)
- [x] T011 F2 `Object.hasOwn` own-property check in `resolveMaintainerModeCategories` + test (`bin/mk-code-index-launcher.cjs`, `tests/launcher-maintainer-mode.vitest.ts`)
- [x] T012 F3 `MK_` canonical + legacy fallback on the daemon path (`advisor-recommend.ts`, launcher allowlist, bridge); dist rebuilt
- [x] T013 F4 Daemon-path `MK_` test + fix stale `rename-invariants.vitest.ts:65` legacy assertion
- [x] T014 F5 Re-election comment "(on by default)" (`bin/mk-spec-memory-launcher.cjs`)
- [x] T015 F6 Doc-matrix fixture real plural `agents`/`commands` paths (`tests/code-graph-indexer.vitest.ts`)
- [x] T016 F7 `_NOTE_INDEX_DEFAULTS` selectable-subset note, identical across the 3 configs
- [x] T017 F8 Assessed `.vscode/mcp.json` — legitimate VS Code config target, no change

<!-- /ANCHOR:phase-4 -->
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
