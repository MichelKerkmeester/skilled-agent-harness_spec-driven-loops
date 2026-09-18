---
title: "Tasks: Phase 12: fix-deep-review-p1-p2-findings-for-source-root-migration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "source root remediation tasks"
  - "deep review fix tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: fix-deep-review-p1-p2-findings-for-source-root-migration

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline at `073e9241e7`: node runner, hook suites, gate-input suite
- [x] T002 Inventory every tree path built from a root name in hooks, checker, installers and plugins
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `SOURCE_ROOT_SENTINEL` and `findSourceRoot` (`shared/workspace/repo-root.mjs`, `.d.mts`, hooks re-export)
- [x] T004 Sentinel block and `SOURCE_ROOT` paths in the six git hooks and the orphan guard log path (`.skilled/scripts/git-hooks/`)
- [x] T005 Same in `check-git-hooks.sh`, `hooks/git/pre-commit`, `hooks/git/install-hooks.sh`. Sentinel test in `install-git-hooks.sh`
- [x] T006 Symmetric root matching in `check-gate-inputs.sh` and a missing `.skilled` fixture
- [x] T007 [P] `gate-inputs.yml` loops through the root that exists
- [x] T008 [P] Codex installer rewrites `.skilled/` commands to the selected root (`install-codex-hooks.mjs`)
- [x] T009 [P] Corpus roots from the selected root. Refuse without one (`corpus.mjs`, `generate-trigger-index.mjs`)
- [x] T010 [P] Four plugins read through the selected root
- [x] T011 [P] `spec-kit-check.yml` triggers. Chrome installer help. Sk-doc README. `SYNC.md`. `PUBLIC-RELEASE.md`. Workflows README
- [x] T012 [P] `_utils.sh` drift check
- [x] T013 [P] Three install guides gain their required sections
- [x] T014 [P] Push triggers on the six guard workflows
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 `source-root-selection.test.sh` across four layouts
- [x] T016 Tests for `COV-001`, `COV-002`, `COV-004`, `COV-005`
- [x] T017 Re-run angle 10 on Luna. Verify and triage each finding
- [x] T018 Rerun the whole baseline gate at the fix SHA and report the delta
- [x] T019 Commit, fast-forward the main checkout, commit once through the new hooks, push with CI watched. Pushed `fb09084e70` and `5844a02227`; Spec-Kit Check green
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `../review/review-report.md`
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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` on every changed shell file. `node --check` on every changed module
- [x] CHK-011 [P0] No new warning in any hook run
- [x] CHK-012 [P1] A missing root is reported, never treated as success
- [x] CHK-013 [P1] Comment hygiene passes on every changed file
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] A real commit and push pass through the changed hooks
- [x] CHK-022 [P1] Four layouts tested: both, `.skilled` only, `.opencode` only, placeholder `.skilled`
- [x] CHK-023 [P1] Each new test fails when its fix is reverted
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: the resolver findings are `class-of-bug`, the plugin pair `cross-consumer`, the rest `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `rg '\$\{?(REPO_ROOT|__hf_root|root)\}?/\.(opencode|skilled)'` over hooks, checker and installers returns only the both-names ownership list.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: `git grep workspace/repo-root` lists the importers. Four plugins, the generator and the installer moved, and every other importer uses `findRepoRoot` only.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: fallback (placeholder `.skilled`) and no-op (neither root) rows run in every resolver test. Delimiter, joined-input and outside-root do not apply to a two-name existence test.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: `plan.md` affected-surfaces inventory lists four layouts by 15 callers: seven hook scripts, the checker, two hook installers, the generator and four plugins.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: the plugin and installer tests strip inherited `GIT_*` variables, and the advisor test clears its DB-directory override.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: commits `e7c7136391`, `63ad140f9b`, `d755553a6e`, `67fa4f7b8e`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No private home-derived path in any tracked file
- [x] CHK-031 [P0] No gate bypass variable used to land a change
- [x] CHK-032 [P1] No commit trailer the operator disallowed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments carry the durable reason and no ephemeral ids
- [x] CHK-042 [P2] READMEs that describe a changed script updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-18
<!-- /ANCHOR:summary -->

---
