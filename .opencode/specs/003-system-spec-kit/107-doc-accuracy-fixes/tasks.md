# Tasks: Documentation Accuracy Fixes — system-spec-kit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Wave 1: MCP Server lib/ READMEs (37 critical)

- [ ] T001 [P] Fix .js→.ts references in lib/ READMEs
- [ ] T002 [P] Remove phantom module references in lib/ READMEs
- [ ] T003 [P] Update file counts and module descriptions in lib/ READMEs

---

## Wave 2: MCP Server top-level + remaining READMEs (36 critical)

- [ ] T004 [P] Fix top-level MCP Server README inaccuracies
- [ ] T005 [P] Update remaining READMEs with correct paths
- [ ] T006 [P] Remove stale references in remaining READMEs

---

## Wave 3: Scripts READMEs (26 critical)

- [ ] T007 [P] Fix scripts documentation to reflect TypeScript sources
- [ ] T008 [P] Update script counts and descriptions
- [ ] T009 [P] Correct broken script paths

---

## Wave 4: Env vars, shared/embeddings, templates, core docs (25 critical)

- [ ] T010 [P] Update environment variable documentation
- [ ] T011 [P] Fix shared/embeddings module references
- [ ] T012 [P] Correct template documentation
- [ ] T013 [P] Update SKILL.md and agent definitions

---

## Wave 5: Install guides, other skills, mcp-narsil cleanup (8+ critical)

- [ ] T014 [P] Update install guides with correct paths
- [ ] T015 [P] Fix other skill references
- [ ] T016 [P] Remove all mcp-narsil ghost references

---

## Verification

- [ ] T017 Final verification sweep — confirm zero critical inaccuracies remain
- [ ] T018 Cross-reference all documented paths against file system

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Final verification confirms zero critical documentation issues

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
