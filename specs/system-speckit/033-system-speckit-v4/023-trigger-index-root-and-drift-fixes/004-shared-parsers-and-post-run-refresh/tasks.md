---
title: "Tasks: Phase 4: shared-parsers-and-post-run-refresh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "shared frontmatter parser tasks"
  - "inventory fence splitting parsers"
  - "create parse-frontmatter test"
  - "adopt spec-kit modules"
  - "move containment primitive"
  - "post run refresh unit tests"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: shared-parsers-and-post-run-refresh

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Inventory every fence-splitting parser and both containment implementations; record behavioral differences (existing-prefix canonicalization, dangling symlinks, empty relative)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Create the shared parser and its script test (`shared/frontmatter/parse-frontmatter.ts`, `shared/frontmatter/parse-frontmatter.test.ts`); export from `shared/index.ts`
- [x] T003 Adopt in spec-kit: seven CLI modules and the runtime orchestrator (`runtime/cli/core`, `runtime/cli/extractors`, `runtime/cli/lib`, `runtime/cli/utils`, `runtime/lib/validation/orchestrator.ts`)
- [x] T004 [P] Adopt in the skill advisor (`mcp-server/lib/skill-graph/doc-frontmatter.ts`, `mcp-server/lib/utils/skill-markdown.ts`); give it a local sqlite declaration so it builds (`mcp-server/types/better-sqlite3.d.ts`, `mcp-server/tsconfig.json`)
- [x] T005 [P] Move the containment primitive to the shared package and re-export from the CLI (`shared/utils/path-containment.ts`, `runtime/cli/utils/path-utils.ts`)
- [x] T006 Add the post-run refresh with `--no-metadata-refresh` and four unit tests (`system-deep-loop/runtime/scripts/fanout-run.cjs`, `runtime/tests/unit/fanout-run.vitest.ts`)
- [x] T007 Record the blocked adoptions: deep-loop and sk-doc lack the `@spec-kit/shared` edge; four spec-kit `.cjs` helpers cannot import the ESM package; Python parsers stay
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Spec-kit typecheck exit 0; shared, runtime and CLI rebuilt; advisor rebuilt; every watched dist fresh; deep-loop typecheck 0 errors
- [x] T009 Parser script test passes; adopter suites green (eleven CLI files, three runtime files after rebuild, advisor harvest and scorer files); runner suite 121 of 121; containment suites 7 of 7 and 47 of 47
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
