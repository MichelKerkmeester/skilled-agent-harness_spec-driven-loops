# Tasks: 005-frontmatter-indexing

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] T001 Define canonical frontmatter schema and mapping table (`spec.md`, parser references)
- [ ] T002 Capture legacy frontmatter variants from templates/spec docs/memories (`scratch/` notes)
- [ ] T003 [P] Prepare migration fixtures for valid and malformed cases (`mcp_server/tests/...`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement normalize and compose helpers in parser layer (`mcp_server/lib/parsing/...`)
- [ ] T005 Implement migration CLI flow with dry-run and apply modes (`scripts/dist/memory/...`)
- [ ] T006 Wire index rebuild after successful migration (`mcp_server/lib/storage/index-refresh.ts`)
- [ ] T007 Add error handling for malformed frontmatter and unsupported legacy keys (`mcp_server/lib/errors/...`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run unit tests for parser/coercion/compose paths (`npm test -- parser/frontmatter suites`)
- [ ] T009 Run integration reindex and retrieval regression suites (`mcp_server/tests/...`)
- [ ] T010 Update checklist and implementation summary with evidence (`checklist.md`, `implementation-summary.md`)
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
