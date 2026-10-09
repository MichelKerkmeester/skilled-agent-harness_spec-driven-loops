---
title: "Implementation Plan: Phase 11: anchor-repair-mode"
description: "The build plan for Anchor repair mode: the approach, the files it touches, the tests and the rollback."
trigger_phrases:
  - "anchor repair mode plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: anchor-repair-mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ESM |
| **Framework** | system-spec-kit CLI, heal and upgrade modules |
| **Storage** | The specs tree, one document at a time |
| **Testing** | Vitest with fixtures and batch samples |

### Overview
Build an anchor-repair mode that detects and fixes three anchor defect classes: glued template pairs, fenced duplicates, and the systematic 549 nesting of questions anchors. The mode performs dry-run correctly (no output writes), checks suffix collisions and moves anchors atomically. It integrates with `upgrade-legacy.mjs` as a repair step that detects and applies only when needed. The operator decided on 2026-10-08 that the marker-only un-nesting also runs on archived documents.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and identified by phase 13 lane work
- [x] Success criteria measurable
- [x] Dependencies identified (phase 1 must build first)

### Definition of Done
- [x] Acceptance criteria defined
- [x] Tests planned
- [x] Docs reflect the plan
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Modular repair step in a pipeline. The anchor-repair mode is called by `upgrade-legacy.mjs` like other repair steps (heal-spec-docs, migrate-generated-json).

### Key Components
- **`heal-spec-docs.cjs` anchor mode**: Detects defects, performs dry-run or apply, handles collisions and atomic writes.
- **Fence parser**: Respects code fence boundaries (```` ``` ````, `~~~`) when pairing anchors.
- **Un-nesting detector**: Recognizes the systematic questions layout and moves markers only.
- **`upgrade-legacy.mjs` step**: Calls anchor-repair when packet needs it, records findings. `repairArchived` also runs the un-nesting move, and nothing else, on archived packets.

### Data Flow
Document is read. Anchor-repair detects defects (glued pairs, nested questions). In dry-run, findings are reported on stdout. In apply mode, anchors are moved atomically and the document is written back.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `heal-spec-docs.cjs` | Reads and heals documents | Add anchor-repair mode | New mode alongside phrase mode |
| `upgrade-legacy.mjs` | Runs repair steps in order | Add anchor-repair as a step. Add the un-nesting move to `repairArchived` and update the header comment | Calls the mode with --apply |
| `upgrade-legacy.vitest.ts`, archived test "repairs only an archived packet's derived files and never rewrites its documents" | Pins that archived documents are never rewritten | Replaced by "un-nests only the questions anchor in an archived packet and leaves every prose line as written", which allows exactly the un-nesting marker move | Archived fixture: prose lines unchanged |
| Tests: `heal-anchor-repair.vitest.ts` | Covers phrase mode | Add anchor-repair tests | New test suite for three defect classes |
| Validator `ANCHORS_VALID` | Checks anchor pairing | Unchanged rule | Documents pass after repair |

Required inventories:
- Anchor consumers: `template-structure.js` (retrieval), spec merger, validator.
- Anchor producers: only `create.sh` via template render.
- Matrix axes: three defect classes (glued, fenced, nested questions), apply vs dry-run, success vs collision vs ambiguous.
- Invariant: Anchors only move by recognized pattern. No prose or intended content changes. Dry-run writes nothing.
- Closeout check (2026-10-09): the producer and consumer inventory found anchor writers beyond `create.sh`, namely heal-spec-docs.cjs `anchorWrap` and scaffold-debug-delegation.sh. See implementation-summary.md, Producer and consumer inventory.
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
| Unit | Defect detection, collision check, fence parsing | vitest with fixtures |
| Integration | Dry-run and apply on sample documents | vitest with batch samples |
| Batch | Un-nesting applied to 50 random documents from 549 | Manual validation and strict check |
| System | Full `upgrade-legacy --apply` on test tree | Vitest and manual |
| Archived | `upgrade-legacy --apply --include-archive` on a nested archived fixture: markers move, prose unchanged | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 (SH-01) building the fixed template | Internal | Yellow | The un-nesting target must exist; SH-01 ships first |
| `upgrade-legacy.mjs` infrastructure | Internal | Green | Repair step integration point |
| Phase 13 (anchor contract) | Downstream | Waits on this phase | Nesting becomes an error only after this lands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A batch of un-nested documents fails validation or the collision check reports false positives.
- **Procedure**: `git revert` the anchor-repair mode and `upgrade-legacy` step. Re-run upgrade on the same tree with the previous tool version.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Fence parser (independent) ──┐
                              ├──► Anchor-repair mode
Collision detector ──────────┘

upgrade-legacy.mjs step (depends on mode)
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Fence parser | Nothing | Anchor-repair mode |
| Collision detector | Nothing | Anchor-repair mode |
| Anchor-repair mode | Both above | Upgrade integration |
| Upgrade integration | Mode | Batch testing |
| Batch testing | Everything else | Release |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Fence parser | Low | Pattern matching, ~200 LOC |
| Collision detector | Low | Set operations, ~100 LOC |
| Anchor-repair core | Med | Three defect detectors, dry-run, apply, ~400 LOC |
| Upgrade integration | Low | One step call, ~50 LOC |
| Tests | Med | Three defect classes, collision cases, batch samples |
| **Total** | | **M: 3-5 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase 1 (SH-01) must ship first so the template fix is available.
- [ ] Batch testing will clear 50+ documents without regressions.
- [ ] Dry-run and apply tests must pass.

### Rollback Procedure
1. `git revert` the anchor-repair mode and upgrade integration commits.
2. Re-run `upgrade-legacy.mjs` on affected documents with the previous version.
3. Validate the tree to confirm anchors are back in their previous state.

### Data Reversal
- **Has data migrations?** No. Anchor-repair is optional; documents pass validation before and after.
- **Reversal procedure**: The revert restores the tool code. Previous anchor positions are preserved in git history.
<!-- /ANCHOR:enhanced-rollback -->

---

