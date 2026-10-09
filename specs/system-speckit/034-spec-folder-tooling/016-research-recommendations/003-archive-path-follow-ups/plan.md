---
title: "Implementation Plan: Archive path follow-ups"
description: "Add fixture tests and align tool documentation on current-location archive semantics. All repair steps become predictable and safe."
trigger_phrases:
  - "archive path follow ups plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Archive path follow-ups

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, Node.js 22+, TypeScript |
| **Framework** | Vitest for tests, Bash for scripts |
| **Testing** | Vitest integration tests, fixture packet lifecycle |

### Overview
Add a fixture test that archives a real packet with full metadata, restores it, and validates it with the real validator. Audit four repair tools and their documentation for current-location semantics disagreements, align them, and update tests to pin the policy.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 15 re-derive implementation is verified (archive.sh:181-191 calls repair-derived; the round-trip case passes)
- [ ] Research recommendations section 7.4 archive policy is understood (not re-read at closeout)
- [x] All four tool code paths are identified (tasks.md T001-T009)

### Definition of Done
- [x] Fixture test passes and covers archive-restore-validate (archive-track.vitest.ts:280-317; 18 passed at closeout. Closeout 3 (2026-10-09): the case is at `archive-track.vitest.ts:313-338` and the file passes 22 of 22)
- [x] Tool alignment: repair-derived, heal-spec-docs, migrate-generated-json, upgrade-legacy (verified; only the heal-spec-docs.cjs comment changed)
- [x] All tests pass with no new failures (tree3 whole-tree gate, 2026-10-09: the cli test exited 0 with 1752 tests passed and 0 failed). Closeout 2: re-cited to the tree4 gate, where cli-test.rc is 0 and the focused run of 8 files printed 152 tests passed, rc 0. The raw cli-test log holds no vitest totals, see acceptance-criteria.md AC-006. Closeout 3: re-cited to the tree5 gate, cli-test rc 0 on the tree before commit c2a0a667e9
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test-driven integration verification. The fixture test creates a real packet with metadata, archives it, restores it, and runs `validate.sh --strict` to confirm pass.

### Key Components
- **Fixture test** in `archive-track.vitest.ts`: creates spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json, then archives, restores, and validates.
- **Tool alignment**: repair-derived.cjs, heal-spec-docs.cjs, migrate-generated-json.ts, upgrade-legacy.mjs comments and code paths.
- **Documentation**: README-repair-derived.md section 6, upgrade-legacy.mjs header comment, heal-spec-docs.cjs policy notes.

### Data Flow
1. Create a test packet with full metadata.
2. Archive with `archive.sh` which calls `rederive_moved`.
3. Restore with `archive.sh --restore` which calls `rederive_moved`.
4. Run `validate.sh --strict` on the restored packet.
5. Assert all validations pass.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repair-derived.cjs` FROZEN_TREES and comments | Policy owner on archive scope | Clarify current-location scope and remove freeze claim | Grep for "frozen" and "archive" in file |
| `heal-spec-docs.cjs` archive skip and --folder flag | Conditional archive behavior | Document the policy and why --folder bypasses skip | Code path at lines 66 and 746 (the SKIP_DIRS constant and the discover skip; 723 at closeout, 746 at closeout 3) |
| `migrate-generated-json.ts` archive rewrite | Applies current-location semantics | Verify it aligns and add a comment citing the policy | Check walk and rewrite path |
| `upgrade-legacy.mjs` archive test | Tests archive handling under upgrade | Verify test pins current-location behavior | Review tests at tests/upgrade-legacy.vitest.ts:647-750 (361-433 at closeout; the archive cases moved after later edits to the file) |
| Validator rules for archived packets | Demand current-location semantics | No change; they already validate by current path | `check-metadata-disk-consistency-helper.cjs` path comparison rule (line 99+) |

Required inventories:
- Archive policy mentions: `rg -n 'archive|z_archive|frozen' README-repair-derived.md repair-derived.cjs heal-spec-docs.cjs migrate-generated-json.ts upgrade-legacy.mjs`.
- Test coverage: `rg -n 'archive.*validate|archived.*passed' runtime/cli/tests/*.vitest.ts`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Fixture | Archive-restore-validate roundtrip | Vitest, validate.sh, real metadata |
| Unit | Tool behavior on archive | Existing repair-derived, upgrade-legacy tests |
| Integration | Full suite on archive changes | `npm test` with all vitest files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 15 re-derive implementation | Internal | Complete | Fixture test depends on working archive.sh |
| Validator executable | Internal | Ready | Fixture test runs validate.sh --strict |
| Node.js 18+ | External | Available | Fixture test requires Node environment |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fixture test fails or tool disagreement found that blocks safe archive.
- **Procedure**: Revert commits, which only change tests and comments. Archive behavior itself (Phase 15) was verified separately.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Audit tools ──────┐
                  ├──► Fix disagreements ──► Add fixture test ──► Verify
Update comments ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | None | Fix, Comments |
| Comments | Audit | Test |
| Test | Comments | Verify |
| Verify | Test | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit tools | Medium | 2-3 hours |
| Fix disagreements | Low | 1-2 hours |
| Add fixture test | Medium | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **6-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] All four tools audited and documented
- [x] Fixture test passes locally
- [x] Suite passes with no regressions (tree4 whole-tree gate, cli-test.rc 0, and tree5 cli-test.rc 0 at closeout 3, see acceptance-criteria.md AC-006)

### Rollback Procedure
1. Revert the phase commits in order (newest first).
2. Verify suite passes with Phase 15 still in place.
3. No data changes, so no reversal needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

