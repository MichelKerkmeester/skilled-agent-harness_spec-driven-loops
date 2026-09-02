---
title: "Tasks: Phase 6: legacy-memory-surface-inventory"
description: "The five research iterations and the parity audit as completed tasks, plus the fold-in into phases 002 and 003 that is still running."
trigger_phrases:
  - "inventory tasks"
  - "research iterations"
  - "parity audit"
  - "fold-in worklist"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: legacy-memory-surface-inventory

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

- [x] T001 Freeze the run configuration at five iterations on `cli-codex` with `gpt-5.6-luna`, max reasoning, fast tier, stop policy `max-iterations` (`research/deep-research-config.json`)
- [x] T002 Read the parent `spec.md` and `goal.md` before the first research action
- [x] T003 Bind the detached lineage so every write lands under `research/lineages/luna-max/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Iteration 1: registrations, launch and config and transport, baseline census (`research/lineages/luna-max/iterations/iteration-001.md`)
- [x] T005 Iteration 2: agent and command routes, doctor family, runtime mirrors, tool grants (`research/lineages/luna-max/iterations/iteration-002.md`)
- [x] T006 Iteration 3: implementation, package and process surfaces, shared seams, tests, templates (`research/lineages/luna-max/iterations/iteration-003.md`)
- [x] T007 Iteration 4: lossless JSON parser, global-ignore coverage, lifecycle and phase counts (`research/lineages/luna-max/iterations/iteration-004.md`)
- [x] T008 Iteration 5: exact-query parity and requested-root audit (`research/lineages/luna-max/iterations/iteration-005.md`)
- [x] T009 Write the row-level inventory: 18,799 external paths and 92,554 hit lines, plus the mcp-server aggregate (`research/lineages/luna-max/inventory.external.json`)
- [x] T010 Synthesize counts, the 002 rewire worklist, the 003 deletion worklist, five break-risk seams and the preserve set (`research/lineages/luna-max/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the final case-insensitive scan-to-artifact parity audit: zero extra rows, zero stale rows, zero parser errors, zero required-field omissions, zero exclusion violations
- [x] T012 Correct the parent estimates: 41 tools confirmed, tracked tree at 1,481 files, flag counts of 410 in the server tree and 872 externally and the roughly 167 consumer figure identified as a logical estimate rather than a path count
- [ ] T013 Fold the worklists and the preserve set into the phase 002 and phase 003 spec, plan, tasks and acceptance docs. In progress, owned by the build phases
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Five iteration files and the synthesis exist on disk with the stop reason recorded
- [x] Parity audit passed with no unexplained rows
- [ ] T013 fold-in closed by phases 002 and 003
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
