---
title: "Implementation Plan: Phase 51: Save writer continuity fields"
description: "Restore the continuity write the memory decommission removed by passing the save payload's continuity fields to the existing thin-record upsert, route phase-parent saves to the active leaf, and order the save so the graph refresh is its last write to any source doc."
trigger_phrases:
  - "save writer continuity plan"
  - "continuity upsert wiring"
  - "fingerprint stamp before graph refresh"
  - "phase parent pointer walk"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 51: Save writer continuity fields

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, built to `runtime/cli/dist` |
| **Framework** | None. A Node command-line writer |
| **Storage** | Markdown frontmatter plus the generated JSON pair |
| **Testing** | Vitest in `runtime/cli/tests` and `runtime/tests`, plus `validate.sh --strict` |

### Overview
The writer already holds the pieces this phase needs. `upsertThinContinuityInMarkdown` validates and writes a continuity block, the save already takes the canonical-save lock, and the resume ladder already walks a phase-parent pointer chain. This phase connects them: the normalizer accepts the continuity fields, the workflow resolves the target leaf and upserts its block, every ancestor's pointer is updated, and the fingerprint stamp moves ahead of the graph refresh.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Open questions answered by the operator (2026-09-23)

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is Met
- [x] Vitest suite and the new save tests pass, apart from two suites that import other packages' unbuilt `dist` (see `implementation-summary.md`)
- [x] `dist` rebuilt, and strict validation passes on this phase
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extend in place. Editing only the docs fails, because agents would still hand-write a block that nothing validates at save time, and `/speckit:resume` would still depend on them remembering. A new save module fails the reversal-cost test too, because the upsert, the lock and the pointer walk all exist already.

### Key Components
- **Input normalizer** (`input-normalizer.ts`): accepts the seven continuity fields in snake_case and camelCase, matching the aliases it already takes for other fields.
- **Target resolution** (`generate-context.ts`): for a phase-parent target, descends at each level into the one child that holds the payload's paths, follows that level's pointer only when the payload names no path inside it, and resolves nothing when the paths span two children.
- **Pointer walk** (shared with `resume-ladder.ts`): one bounded walk used both to follow pointers down and to update them upward.
- **Save workflow** (`workflow.ts`): upserts the continuity block, then stamps the fingerprint, then refreshes the graph, in that order.

### Data Flow
The payload reaches the normalizer, and in full-auto mode the target is resolved to a leaf. The upsert rewrites that leaf's summary frontmatter inside the lock, and the ancestor pointers are updated. The fingerprint stamp then reads the final summary, and the graph refresh runs last over docs that no later step changes.

### Deviations From This Plan

- **The upsert itself was fixed.** Run over 421 real summaries, `upsertThinContinuityInMarkdown` rewrote frontmatter outside the continuity block in 17 of them, turning flow lists into strings and re-quoting scalars. It now parses and replaces only the `_memory` block and splices it back, so every other byte stays as written. That put `thin-continuity-record.ts` in scope, where the plan had it only as a dependency.
- **Paths are compared in canonical form.** A workspace reached through a linked directory spells one folder two ways (macOS `/var` is `/private/var`), which broke the containment checks behind path routing and the specs-root stop. The walk, the leaf resolution and the leaf-is-target check now resolve links first.
- **The ancestor walk stops below a specs root.** `isPhaseParent` counts the specs root itself as a phase parent, so an unbounded walk would rewrite `specs/graph-metadata.json` on every save.
- **The stamp moved into the workflow.** It ran in the command's `main()` after the workflow returned; it now runs inside the workflow before the graph refresh, and writes through a temp file and a rename. Its test moved from the command-authority suite, which mocks the workflow, into the save tests, which run the real one.
- **One existing test expectation changed.** The pointer suite's case that a parent save sets the pointer to null now expects the pointer and its timestamp untouched, because a parent save no longer clears it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `input-normalizer.ts` `KNOWN_RAW_INPUT_FIELDS` | Rejects the continuity fields as unknown | Update | Save test prints no "Unknown field" warning |
| `workflow.ts` graph refresh | Runs before the stamp today | Update, runs last | REQ-003 sequence passes first time |
| `generate-context.ts` `updatePhaseParentPointersAfterSave` | Clears a parent's pointer and updates only the direct parent | Update | Nested fixture save (REQ-006, REQ-007) |
| `generate-context.ts` `resolveContinuityLeaf` | Did not exist | Create | Nested fixture saves (REQ-007, REQ-008) |
| `memory-metadata.ts` `stampCompletionFingerprintIfNeeded` | Stamps after the workflow returns | Update, called inside the ordered sequence | REQ-003 |
| `thin-continuity-record.ts` `upsertThinContinuityInMarkdown` | Re-serializes the whole frontmatter | Update, rewrites only the `_memory` block | Byte-for-byte frontmatter test |
| `api/index.ts` public surface | Did not export the hop or the continuity reader | Update | The command-line writer builds against it |
| `resume-ladder.ts` `followPhaseParentRedirect` | Reads the pointer chain for resume | Shared, behavior unchanged | Existing resume tests pass |
| `compact-inject.ts` authored snapshot | Opt-in continuity writer | Unchanged, not a consumer of the new path | Grep shows no call into the new code |
| `save.md`, `save-workflow.md` | Describe a continuity write the code lacks | Update | REQ-005 |

Required inventories:
- Same-class producers: `rg -n 'last_active_child_id|updatePhaseParentPointer' .skilled/skills/system-spec-kit/runtime`.
- Consumers of changed symbols: `rg -n 'stampCompletionFingerprintIfNeeded|updatePhaseParentPointersAfterSave|KNOWN_RAW_INPUT_FIELDS' . --glob '*.ts' --glob '*.md'`.
- Matrix axes: target kind (leaf, direct parent, nested parent) by pointer state (fresh, stale, missing) by payload (continuity fields, none) by mode (full-auto, plan-only).
- Algorithm invariant: a save writes continuity into exactly one leaf or into none, and never moves a pointer away from the leaf it wrote.
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
| Unit | Normalizer field acceptance, thin-record rejection, target resolution | Vitest |
| Integration | Full-auto save on a leaf and on a nested parent fixture, then `/speckit:resume` from the top | Vitest, `validate.sh --strict` |
| Manual | The edit, save and strict-validate sequence observed on packet 057 on 2026-09-23 | Shell |

Each new test fails for one real reason no current test catches: an ignored continuity field, an invalid value that still writes, a parent save that lands in the wrong place, and a save that leaves the graph fingerprint stale.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `upsertThinContinuityInMarkdown` | Internal | Green, in the tree | The continuity write would need a new serializer |
| `followPhaseParentRedirect` | Internal | Green, in the tree | The pointer walk would be duplicated |
| Removed handler at `3095cadc0f9^:.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts` | Internal history | Green, readable | Only the field mapping reference is lost |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a save that writes continuity into the wrong packet, or a strict run that fails after a save.
- **Procedure**: revert the phase's commit and rebuild `dist`. Blocks and pointers written in the meantime stay valid, because they pass the same validators hand edits pass.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (sample the upsert, map the old handler) ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 4-6 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **7-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The upsert sample (T002) shows no rejected current blocks, or the rejections are recorded
- [x] Nested fixture tests pass before the docs change

### Rollback Procedure
1. Revert the phase's commit.
2. Rebuild `dist` so the command-line writer matches the source.
3. Run a leaf save and a strict validation to confirm the old behavior is back.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: None needed. Continuity blocks and pointers written by the new path are valid under the old one.
<!-- /ANCHOR:enhanced-rollback -->
