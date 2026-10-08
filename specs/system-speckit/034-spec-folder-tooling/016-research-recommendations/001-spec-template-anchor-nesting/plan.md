---
title: "Implementation Plan: Phase 1: spec-template-anchor-nesting"
description: "The build plan for Spec template anchor nesting: the approach, the files it touches, the tests and the rollback."
trigger_phrases:
  - "spec template anchor nesting plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: spec-template-anchor-nesting

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Template syntax (inline conditionals), TypeScript for vitest |
| **Framework** | system-spec-kit template rendering, vitest snapshot testing |
| **Storage** | The template file and the snapshot file in the test suite |
| **Testing** | Vitest snapshot comparison plus manual scaffolding |

### Overview
Move the `questions` anchor opener from line 184 to line 303 (directly above Open Questions), and similarly for other levels. This removes the nesting of NFR, edge-cases and complexity sections inside the questions anchor. Update the snapshot test to assert no nesting and validate pairing for every level.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and line numbers verified
- [x] Success criteria measurable
- [x] Dependencies clear

### Definition of Done
- [x] Acceptance criteria reviewed
- [x] Snapshots regenerated and committed
- [x] Test assertions added and passing
- [x] Docs reflect the change
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Direct template edit with snapshot regeneration. No new code paths or rendering changes.

### Key Components
- **`spec.md.tmpl`**: Relocate the anchor opener to directly above Open Questions for each level.
- **`scaffold-golden-snapshots.vitest.ts`**: Add anchor integrity assertions and regenerate snapshots.
- **`.snap` file**: Captures the output after the template change.

### Data Flow
Template rendering produces spec.md for each level. The vitest snapshot compares the render against golden output and asserts structure. Anchors are consumed by retrieval and merge processes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec.md.tmpl` lines 184-425 | Defines anchor placement in three levels | Updated | Snapshot test and manual scaffold |
| `scaffold-golden-snapshots.vitest.ts` | Renders each level and captures expected output | Updated | Assertions added and snapshot passes |
| `parseAnchoredSections` in `template-structure.js` | Extracts regions by anchor | Unchanged code, improved results | Retrieval tests benefit |
| Validator `ANCHORS_VALID` | Checks anchor pairing | Unchanged rule | New scaffolds pass |

Required inventories:
- Anchor consumers: `template-structure.js` line 462, the spec merger, the validator.
- Producers: only `create.sh` via `render_template`.
- Invariant: The anchor contains only its intended content. Nesting breaks the invariant.
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
| Snapshot | Render output for each level matches expected layout | vitest snapshot |
| Assertion | Anchor pairing, order and no nesting | vitest `assert` statements |
| Integration | A new scaffold passes strict validation | `validate.sh --strict` |
| Manual | Scaffold a test L2 packet and inspect the spec.md | `create.sh` output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Template rendering pipeline | Internal | Green | Renders cannot be tested |
| vitest snapshot infrastructure | Internal | Green | Golden output not captured |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Snapshot test fails or a new scaffold produces anchor nesting.
- **Procedure**: `git revert` the template and snapshot changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
spec.md.tmpl (anchor placement)
     |
     +--> render pipeline (unchanged)
     |
     +--> scaffold-golden-snapshots.vitest.ts (assertions added)
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Template edit | Nothing | Snapshot regeneration |
| Snapshot regeneration | Template edit | Assertion test |
| Assertion test | Snapshot file | Integration test (SH-11 un-nesting) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Template edit | Low | Five line moves |
| Snapshot update | Low | Regenerate and review |
| Assertions | Low | Add three checks to one test |
| **Total** | | **S: under one day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No authored documents change, only template metadata.
- [x] The change does not affect existing packets.
- [x] Retrieval and merge code benefits from the fix without changes.

### Rollback Procedure
1. `git revert` the template and snapshot file commits.
2. Run the vitest suite to confirm old snapshots pass again.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: The revert restores the template. Old packets are unaffected.
<!-- /ANCHOR:enhanced-rollback -->

---

