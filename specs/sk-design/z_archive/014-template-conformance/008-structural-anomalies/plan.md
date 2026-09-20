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
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "structural-anomalies-executor"
    recent_action: "Relocated four Open Design transport modules into transport/ and updated all references"
    next_safe_action: "Remove the vestigial design-md-generator/node_modules stub (item 1, still Planned)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/node_modules/"
      - ".opencode/skills/sk-design/benchmark/reports/compiled-routing/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "structural-anomalies-session"
      parent_session_id: null
    completion_pct: 50
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
Four unrelated small items, each independent of the others. Two are mechanical and safe to execute (remove the empty stub, add the missing index) and remain Planned. The `.mjs` placement item is **RESOLVED AND EXECUTED**: the operator delegated the ruling, investigation found root placement to be the repository's sole instance of loose runtime `.mjs` at a packet root with zero external consumers, and all four modules were relocated into a domain-named `transport/` subdirectory. One is a record-only item — two absences that are correct as-is and get no fix.
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
- [x] The `.mjs` placement question is ruled on repo evidence and the reasoning recorded in `spec.md` §7.
- [x] The four modules live under `transport/`; every importer, test, and doc reference is updated; 37/37 transport tests pass.
- [x] The two legitimate absences are recorded in `spec.md`/`checklist.md` with no corresponding "add the folder" task.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Four independent, low-blast-radius items handled as parallel tracks within one Level 2 packet rather than four separate packets, since each is small enough that separate packets would be over-ceremony.

### Key Components
- **Stub removal**: verify-then-delete, scoped strictly to the `.vite/vitest/` cache directory, never touching the real `backend/node_modules/` install.
- **Benchmark index**: a new `README.md` in `compiled-routing/`, following the same shape as `benchmark/baseline/README.md` but summarizing the run subdirectories it contains rather than a single run's results.
- **`.mjs` relocation**: move all four modules together into `transport/` so their mutual `./` imports remain valid, leaving only three cross-boundary imports to repoint. The blast radius was measured, not assumed: the consumer graph is entirely packet-internal, and the prior spec's claim that `shared/scripts/design-command-surface-check.mjs` was affected proved false.
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

### Phase 3: `.mjs` placement ruling and relocation (EXECUTED)
- [x] Read all four modules; establish kind, exports, and full consumer map across the repository.
- [x] Read the governing standard (`create-skill/references/shared/overview.md` §2) and compare against sibling packets.
- [x] Capture gate baselines BEFORE editing (37/37 tests, `parent-skill-check` OK/0 warnings, `package_skill --check` PASS + 2 pre-existing kebab warnings).
- [x] Rule: relocate all four into `transport/`, a domain-named subdirectory — NOT `scripts/`, whose documented scope is bash readiness checks.
- [x] Move the four files together so their sibling `./` imports stay valid; repoint the three imports that crossed a directory boundary.
- [x] Update `fixtures/offline-fixtures.mjs`, `tests/transport-grounding.test.mjs`, both code READMEs, and the hub feature catalog.
- [x] Author `transport/README.md` to match the `fixtures/` and `tests/` code-README shape.

### Phase 3b: Record-only items (independent, no execution)
- [x] Confirm the two legitimate absences (`design-mcp-open-design/procedures/`, `design-motion/scripts/`) are recorded with no fix task attached.

### Phase 4: Verification
- [ ] `find .opencode/skills/sk-design/design-md-generator/node_modules` returns "No such file or directory"
- [ ] `ls .opencode/skills/sk-design/design-md-generator/backend/node_modules` still resolves (real install intact)
- [ ] `ls .opencode/skills/sk-design/benchmark/reports/compiled-routing/README.md` resolves
- [x] `node --test .../design-mcp-open-design/tests/transport-grounding.test.mjs` → 37/37, matching baseline
- [x] `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` → OK, 0 warnings (10b byte-drift PASS confirms no manifest regeneration was needed)
- [x] `python3 .../package_skill.py .../design-mcp-open-design --check` → PASS, same 2 pre-existing warnings
- [x] `python3 .../validate_document.py .../transport/README.md --type readme` → 0 issues
- [x] Each moved file diffed against its `HEAD` content: only import-path lines differ
- [x] Repo-wide search for the old root paths (excluding historical `.opencode/specs/`) returns zero hits
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
| Operator decision on `.mjs` relocation | External | **Delegated to the executor and discharged** | No longer blocking; the ruling and its evidence are recorded in `spec.md` §7 |
| Open Design transport test suite | Internal | Green (37/37) | Serves as the regression baseline for the relocation; a failure would have reverted the move |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The deleted stub turns out to have been load-bearing for some untracked local tooling, the new index README is later found to misrepresent the run subdirectories, or the `transport/` relocation breaks a consumer not found during the search.
- **Procedure**: Restore `node_modules/` from git history if it was tracked; otherwise recreate the empty cache path. Edit or remove the index README. For the relocation, move the four `.mjs` files from `transport/` back to the packet root, revert the three cross-boundary import lines, revert the two `fixtures/`/`tests/` import blocks and their READMEs, revert the two hub feature-catalog rows, and delete `transport/README.md` — the change is a pure move plus path edits, with no semantic change to reverse.
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
