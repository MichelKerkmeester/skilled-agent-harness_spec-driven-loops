---
title: "Implementation Plan: sk-design structural anomalies"
description: "Plan for the four independent structural items: delete the vestigial node_modules stub, add the missing benchmark index, record the .mjs relocation tradeoff as Planned, and record two legitimate absences without fixing them."
trigger_phrases:
  - "sk-design structural anomalies plan"
  - "design-mcp-open-design loose executables plan"
  - "compiled-routing missing index plan"
  - "vestigial node_modules stub plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/008-structural-anomalies"
    last_updated_at: "2026-07-27T14:53:08.592Z"
    last_updated_by: "spec-author"
    recent_action: "Authored plan for four independent items"
    next_safe_action: "Execute the node_modules stub removal (lowest risk)"
    blockers:
      - "Loose .mjs executables decision requires operator input before any move"
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/node_modules/"
      - ".opencode/skills/sk-design/benchmark/reports/compiled-routing/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: sk-design structural anomalies
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Filesystem hygiene + Markdown documentation |
| **Framework** | sk-design hub (multiple modes) |
| **Storage** | Git-tracked files and directories only |
| **Testing** | Manual `find`/`ls` verification, no automated suite |

### Overview
Four unrelated small items, each independent of the others. Two are mechanical and safe to execute (remove the empty stub, add the missing index). One is explicitly not executed — the `.mjs` relocation is recorded as a tradeoff awaiting operator input, never swept. One is a record-only item — two absences that are correct as-is and get no fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Confirmed `design-md-generator/node_modules/` contains only the empty vitest result cache and nothing else.
- [ ] Read `benchmark/baseline/README.md` (or another sibling run README) as the index-format model.

### Definition of Done
- [ ] `design-md-generator/node_modules/` is removed; `backend/node_modules/` is untouched.
- [ ] `benchmark/compiled-routing/README.md` exists, modeled on the sibling pattern, and lists the current run subdirectories.
- [ ] The `.mjs` relocation tradeoff is recorded in `spec.md` Open Questions, not executed.
- [ ] The two legitimate absences are recorded in `spec.md`/`checklist.md` with no corresponding "add the folder" task.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Four independent, low-blast-radius items handled as parallel tracks within one Level 2 packet rather than four separate packets, since each is small enough that separate packets would be over-ceremony.

### Key Components
- **Stub removal**: verify-then-delete, scoped strictly to the `.vite/vitest/` cache directory, never touching the real `backend/node_modules/` install.
- **Benchmark index**: a new `README.md` in `compiled-routing/`, following the same shape as `benchmark/baseline/README.md` but summarizing the run subdirectories it contains rather than a single run's results.
- **`.mjs` relocation record**: no code change; a clearly stated tradeoff in `spec.md` naming the exact blast radius (one import line, the transport tests, one shared checker script).
- **Legitimate-absence record**: a statement in `spec.md` and a corresponding checklist item that confirms the absence and explains why it's fine, with no task to "fix" it.

### Data Flow
Verify stub contents -> delete stub -> confirm `backend/node_modules/` unaffected -> read sibling benchmark README pattern -> list current `compiled-routing/` run subdirectories -> author index README -> confirm `.mjs` tradeoff is fully stated in Open Questions -> confirm the two absences are stated without a fix task -> verify.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Stub removal (independent, lowest risk)
- [ ] Confirm `design-md-generator/node_modules/` contains only `.vite/vitest/<empty-sha>/results.json`.
- [ ] Remove `design-md-generator/node_modules/`.
- [ ] Confirm `design-md-generator/backend/node_modules/` is untouched and still a real install.

### Phase 2: Missing benchmark index (independent)
- [ ] Read `benchmark/baseline/README.md` as the sibling format model.
- [ ] List the current run subdirectories under `benchmark/compiled-routing/`.
- [ ] Author `benchmark/compiled-routing/README.md` indexing those subdirectories.

### Phase 3: Record-only items (independent, no execution)
- [ ] Confirm the `.mjs` relocation tradeoff is fully stated in `spec.md` Open Questions (import site, tests, checker script named).
- [ ] Confirm the two legitimate absences (`design-mcp-open-design/procedures/`, `design-motion/scripts/`) are recorded with no fix task attached.

### Phase 4: Verification
- [ ] `find .opencode/skills/sk-design/design-md-generator/node_modules` returns "No such file or directory"
- [ ] `ls .opencode/skills/sk-design/design-md-generator/backend/node_modules` still resolves (real install intact)
- [ ] `ls .opencode/skills/sk-design/benchmark/reports/compiled-routing/README.md` resolves
- [ ] `validate.sh .opencode/specs/sk-design/014-template-conformance/008-structural-anomalies --strict` passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Filesystem check | Stub gone, real install intact | `find`, `ls` |
| Manual review | New index README matches sibling shape | Side-by-side read |
| Documentation review | `.mjs` tradeoff and two absences correctly recorded, not executed | Manual read of `spec.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sibling `benchmark/` README pattern | Internal | Existing | New index must match or the fix looks inconsistent with the rest of `benchmark/` |
| Operator decision on `.mjs` relocation | External | Not requested yet | Blocks any future move; does not block this packet, since this packet only records the tradeoff |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The deleted stub turns out to have been load-bearing for some untracked local tooling, or the new index README is later found to misrepresent the run subdirectories.
- **Procedure**: Restore `node_modules/` from git history if it was tracked; otherwise recreate the empty cache path. Edit or remove the index README.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Stub removal) ─┐
Phase 2 (Missing index) ─┼──> Phase 4 (Verify)
Phase 3 (Record-only)  ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Stub removal | None | Verify |
| Missing index | None | Verify |
| Record-only | None | Verify |
| Verify | All three above | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Stub contents verified empty before deletion
- [ ] Sibling README pattern read before authoring the new index

### Rollback Procedure
1. **Immediate**: Recreate `design-md-generator/node_modules/.vite/vitest/` path if any tooling turns out to depend on its existence (not its content).
2. **Revert code**: `git revert` the commit adding the index README if it's later found inaccurate.

### Data Reversal
- **Has data migrations?** No.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN
- Four independent low-risk tracks, one execution phase each
- .mjs relocation explicitly record-only, no code change
-->
