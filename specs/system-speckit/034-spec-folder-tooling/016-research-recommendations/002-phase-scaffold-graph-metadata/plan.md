---
title: "Implementation Plan: Phase 2: phase-scaffold-graph-metadata"
description: "Remove the early exit in create.sh --phase mode and call graph-metadata backfill for the parent and each child before exit. Refresh the parent's children_ids field. Add a test case."
trigger_phrases:
  - "phase scaffold graph metadata plan"
  - "backfill graph metadata in create.sh --phase"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: phase-scaffold-graph-metadata

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (create.sh), TypeScript (test) |
| **Framework** | spec-kit CLI suite |
| **Storage** | Filesystem (spec-metadata.json) |
| **Testing** | Vitest (scaffold-passes-its-own-gate.vitest.ts) |

### Overview
Move the graph-metadata backfill code out of the root-scaffold path into a reusable helper, then call it from the --phase mode before the exit. For each child, derive its graph-metadata. Then refresh the parent's children_ids field to include the newly created children. Add a test case that scaffolds a parent with two children and validates all three with strict gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- X Problem statement clear and scope documented
- X Success criteria measurable (strict validation pass on all three packets)
- X Dependencies identified (backfill-graph-metadata.ts exists and is accessible)

### Definition of Done
- X All acceptance criteria met (children_ids refreshed, strict validation passes)
- X Tests passing (scaffold-passes-its-own-gate.vitest.ts --phase case passes)
- X No new failures in the spec-kit CLI test suite
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
CLI enhancement: extend existing --phase mode code path in bash.

### Key Components
- **backfill helper**: Extract backfill-graph-metadata.ts invocation (create.sh lines 2006-2021) into a reusable helper function
- **--phase mode extension**: Call the helper for parent and children before the exit at line 1919
- **children_ids auto-refresh**: The backfill's deriveGraphMetadata automatically populates children_ids from on-disk directories
- **Test case in scaffold-passes-its-own-gate.vitest.ts**: Create a parent with two children, validate all three

### Data Flow
1. --phase mode creates parent spec.md, plan.md, tasks.md, acceptance-criteria.md (heredocs)
2. Each child gets the same set of templated files (heredocs)
3. Parent description.json is generated from the documents
4. Helper function is called for parent, which derives graph-metadata and auto-populates children_ids from disk
5. Helper function is called for each child through the existing _child_paths loop, deriving each child's graph-metadata
6. All three packets pass strict validation before create.sh exits
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The change touches the --phase scaffold path, which is a specialized code path used only when explicitly requested. Root scaffolds and all existing --phase scaffolds are unaffected.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `create.sh --phase` mode | Scaffolds a parent and children with templated files | Extend it to call backfill before exit | Integration test scaffold-passes-its-own-gate |
| backfill-graph-metadata.ts tool | Derives graph-metadata for single packet (called on root scaffolds) | No change. Same tool, same behavior, called two more times per phase scaffold | Read the tool source; verify no side effects from repeated calls on related packets |
| Phase parent graph-metadata.json | Contains children_ids list | Refresh to current list of child directories | Validate against the parent's children_ids in its schema |
| Existing phase scaffolds | May have old stubs | Not repaired by this change. Repair is a separate tool concern. | Separate repair tooling handles the corpus |

Required inventory checks:
- Grep for calls to `backfill-graph-metadata.ts`: verify they are all covered by tests
- Grep for writes to graph-metadata.json children_ids: verify all producers agree on format
- Matrix axes: (--phase | root scaffold) x (successful backfill | backfill missing) x (parent only | parent + children)
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | New --phase case in scaffold-passes-its-own-gate.vitest.ts | Vitest, validate.sh |
| Regression | All spec-kit CLI tests | Vitest (full suite) |
| Manual | Create a real phase parent and verify each packet passes strict validation | bash + validate.sh |

Test plan:
1. Extend scaffold-passes-its-own-gate.vitest.ts to cover --phase mode: create a parent with two children, validate all three with strict gates
2. Run the full scaffold-passes-its-own-gate.vitest.ts suite to ensure no regressions
3. Run the full spec-kit test suite to verify no side effects
4. Manual: create a test phase parent in a temporary directory and run validate.sh --strict on all three packets
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| backfill-graph-metadata.ts tool | Internal | Green | Required; tool exists and is working |
| TSX loader (node_modules/tsx) | External | Green | Required for backfill execution |
| spec-kit build (node_modules) | Internal | Green | Test environment setup |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Test failures indicate the change broke the --phase scaffold path
- **Procedure**: `git revert` the commit; no data migration or recovery needed
- **Impact**: No existing packets are affected; rollback is instant
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Task | Complexity | Estimated Effort |
|------|------------|------------------|
| Modify create.sh to remove early exit and call backfill | Low | 1 hour |
| Add children_ids refresh logic | Low | 1 hour |
| Write --phase test case in scaffold-passes-its-own-gate.vitest.ts | Low | 1 hour |
| Testing and validation | Low | 1 hour |
| **Total** | Low | **4 hours** |
<!-- /ANCHOR:effort -->

