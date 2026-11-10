---
title: "Tasks: Alignment fixes for private-skill guards"
description: "One task per alignment finding, each with its verify command and the observed result."
trigger_phrases:
  - "alignment fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Alignment fixes for private-skill guards

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`INV` is `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs`. `PAR` is `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the inventory failure (`INV`). Verify: `node --test INV` exits 1 naming `router-replay-lib.cjs:520`. Observed: exit 1, that line.
- [x] T002 Capture the untrusted-link repro against the HEAD replay library. Verify: the scratch repro prints a specific surface for the link. Observed: `["specific:EVIL","fallback:OMEGA"]`.
- [x] T003 [P] Capture the D-03 probe, the advisor regression and validate runs, and the canary route gold. Verify: each output saved. Observed: `sk-git` top-1; regression 42/42; validate 0.8103; gold 4,361 bytes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Route `outsideSurfaces` through `createPrivateSkillLinkCheck` and inventory it as include (`router-replay-lib.cjs`, `INV`). Verify: `node --test INV` exits 0. Observed: `skill-root reader inventory coverage passed`, exit 0.
- [x] T005 Give the plugin's `declaredSurfaces` the same check, narrow its SCREENED reason, add the untrusted-link tests (`.opencode/plugins/system-skill-advisor.js`, `PAR`, `system-skill-advisor-plugin.vitest.ts`). Verify: `node --test PAR` prints `pass 3`; the vitest run prints `4 passed`. Observed: both, and both fail against the HEAD plugin.
- [x] T006 Export `findOrphans`, guard the entry point, add `sync-runtime-mirrors.test.mjs`. Verify: `node --test` on the test prints `pass 2`, and fails with the skip deleted. Observed: exit 0; mutated run exit 1 listing both private entries.
- [x] T007 Add private-skill-root vocabulary to the advisor graph metadata and regenerate (`graph-metadata.json`, `skill-graph.json`). Verify: the D-03 probe prints `system-skill-advisor` first. Observed: `system-skill-advisor 0.8666 | sk-git 0.8223`.
- [x] T008 Replace the two NUL bytes in the served and authored `canary-router.cjs`. Verify: `file` prints text and the route gold is byte-identical. Observed: `UTF-8 text`, `cmp` silent.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Move the trusted-root rule into `private-skill-target.cjs`, wrap it from the `.ts`, point both readers at it with one stderr line on load failure, and add a declared-root case to `PAR`. Verify: on Node 20.19.5 `PAR` prints `ok 3`, and the trusted repro prints `specific:GOOD` with no EVIL. Observed: both; the first version gave `not ok 3` and `["fallback:OMEGA"]` on Node 20.19.5.
- [x] T009 Run the touched suites together. Verify: `node --test` over the sk-code-skilled, sk-code-quality and plugin tests, `INV` and both cli tests prints `fail 0`. Observed: `tests 718`, `pass 718`, `fail 0`.
- [x] T010 Run the compiled-route tests and the sync check. Verify: `node --test .skilled/bin/tests/compiled-route*.test.cjs` prints `fail 0`; `compiled-route-sync.cjs --check` prints all copies match. Observed: `pass 95`; `all 55 served copies match their authored files`.
- [x] T011 Compare advisor gates with the baseline. Verify: regression and validate numbers equal. Observed: regression 42/42 both; validate 0.8103 and holdout 0.75 both.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every fail-before run is kept under the session scratchpad
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: `require()` of the helper returns `createPrivateSkillLinkCheck` on Node 26.8.2
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `quality-gate.cjs --files` over the changed code prints `findings: 0`
- [x] CHK-011 [P0] No console errors or warnings in the test runs
- [x] CHK-012 [P1] Error handling implemented: a helper that fails to load rejects every link
- [x] CHK-013 [P1] Code follows project patterns: the lazy loader mirrors `loadContractLib` in the same file
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: fail-before runs against HEAD sources
- [x] CHK-022 [P1] Edge cases tested: a trusted link inside the tree, an untrusted link outside it
- [x] CHK-023 [P1] Error scenarios validated: the mutated orphan skip fails its test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Classes: the two reader findings are `class-of-bug`, the orphan test is `test-isolation`, the vocabulary is `instance-only`, the NUL bytes are `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the inventory test's detector covers every tracked skills-root listing and now passes.
- [x] CHK-FIX-003 [P0] Consumer inventory: `quality-gate.cjs`, `verify-router-sync.cjs` and the stage-two test consume `declaredSurfaces`; their suites pass.
- [x] CHK-FIX-004 [P0] Outside-root and no-op cases: the parity test covers an outside target and an inside target; the helper's own vitest covers the rest of the table.
- [x] CHK-FIX-005 [P1] Matrix axes: target (inside, declared root, outside) by helper state (loads, fails); five rows, the fail row by inspection of the fallback.
- [x] CHK-FIX-006 [P1] Hostile env: the new tests clear `SPECKIT_PRIVATE_SKILL_ROOTS` and restore it.
- [x] CHK-FIX-007 [P1] Evidence is pinned to HEAD `ee64a63b2c` plus this working-tree diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: a link target is resolved and contained before any read
- [x] CHK-032 [P1] Auth/authz: N/A, no authenticated surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments state why the rule is loaded, not copied
- [x] CHK-042 [P2] Changelog entries written for the four changed skills
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only
- [x] CHK-051 [P1] scratch/ holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
