---
title: "Tasks: Phase 5: advisor-linked-project-workspace"
description: "Ordered tasks and the verification checklist for letting the advisor serve a project linked to its source tree."
trigger_phrases:
  - "advisor linked project workspace tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: advisor-linked-project-workspace

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

| Variable | Value |
|----------|-------|
| `S` | `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` |
| `T` | `.skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts` |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inventory the owner and callers of the allowlist and the launcher spawn. Verify: `rg -n "isAllowedWorkspaceRoot|BoundedWorkspaceRootSchema|findAdvisorWorkspaceRoot" .skilled` shows one owner, `S`, and one refine. Evidence: `plan.md` affected-surfaces table.
- [x] T002 [P] Record the advisor suite and doctor gate baselines. Verify: advisor suite prints `2 failed, 1359 passed, 8 skipped` with only the new tests added; `run-all.sh` prints `7 suite(s) passed, 0 failed`. Evidence: `scratch/red-before-change.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the linked-project admit test and the not-wired refuse test to `T`. Verify: `npx --no-install vitest run tests/schemas/advisor-tool-schemas.vitest.ts` against the unmodified `S` prints `2 failed, 16 passed`. Evidence: `scratch/red-before-change.md`.
- [x] T004 Add `isWiredToSourceTree()` to `S` and call it from `isAllowedWorkspaceRoot()` after the prefix check. Verify: the same command prints `18 passed`. Evidence: `scratch/verification-evidence.md`.
- [x] T005 Name the linked-project case in the schema error message, the `ENV-REFERENCE.md` row and the feature-catalog line. Verify: `rg -n "links to this source tree" S .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` prints three lines. Evidence: `scratch/verification-evidence.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Typecheck and rebuild the advisor `dist/`. Verify: `npm run typecheck` exits 0; after `npm run build`, `grep -c isWiredToSourceTree dist/runtime/schemas/advisor-tool-schemas.js` prints 2. Evidence: `scratch/verification-evidence.md`.
- [x] T007 Rerun the advisor suite and the doctor gate. Verify: `1361 passed, 8 skipped`, exit 0; `run-all.sh` exit 0 and `7 suite(s) passed, 0 failed`. Evidence: `scratch/verification-evidence.md`.
- [x] T008 Live proof from a scratch project that links only `.skilled`. Verify: `advisor_status --workspace-root "$PWD" --format json` exits 0 with `"status": "ok"`. Evidence: `scratch/verification-evidence.md`.
- [x] T009 Validate this folder and the parent strictly. Verify: `validate.sh <folder> --strict` prints `RESULT: PASSED` for both. Evidence: `implementation-summary.md` verification table.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The new tests are red before and green after, recorded in `scratch/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

A blocked P0 item keeps the packet open; a blocked P1 item needs the operator's recorded approval.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4, REQ-001 to REQ-005.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3 and the affected-surfaces table.
- [x] CHK-003 [P1] Dependencies identified and available: Node built-in `fs` and the advisor build script. Evidence: `plan.md` section 6.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The schema typechecks. Verify: `npm run typecheck` exits 0. Evidence: `scratch/verification-evidence.md`.
- [x] CHK-011 [P0] The prefix allowlist and the env extras are unchanged. Verify: `git diff S` touches only `SOURCE_REPO_ROOT`, `isAllowedWorkspaceRoot()`, the new helpers and the error message. Evidence: `scratch/verification-evidence.md`.
- [x] CHK-012 [P1] A failed `realpath` counts as not wired instead of throwing. Evidence: `S` `realpathOrNull()`.
- [x] CHK-013 [P1] Code comments carry no packet, task or requirement ids. Verify: `git diff S T | rg -n "REQ-0|T00|005-advisor|specs/"` prints no line. Evidence: `scratch/verification-evidence.md`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, seven rows `Met`.
- [x] CHK-021 [P0] The new tests are red before and green after. Evidence: `scratch/red-before-change.md`; `scratch/verification-evidence.md`.
- [x] CHK-022 [P1] Edge case: the empty string, a copied tree and a link to another source are refused. Evidence: `T` refuse test.
- [x] CHK-023 [P1] Error scenario: `/etc` is still refused by `isAllowedWorkspaceRoot()`, by the existing tests and the dist check. Evidence: `scratch/verification-evidence.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `producer`, because the allowlist owner alone decides admission and every input schema inherits it. Evidence: `plan.md` affected-surfaces table.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n "ALLOWED_WORKSPACE_PREFIXES" .skilled --glob '!**/dist/**'` prints only `S`. Evidence: `plan.md` inventories.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: `BoundedWorkspaceRootSchema` bounds the recommend, validate, status and rebuild inputs. Evidence: `plan.md` inventories.
- [x] CHK-FIX-004 [P0] Path fixes include adversarial cases: a foreign link, a copied tree and an unlinked directory are refused; a subdirectory of a linked project is admitted. Evidence: `T` both new tests.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: `plan.md` affected-surfaces inventories, seven rows.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant: the source root is computed once at module load from the daemon's cwd, which the launcher pins to the source tree; no environment variable feeds the new check. Evidence: `S` `SOURCE_REPO_ROOT`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to an explicit diff: the uncommitted working tree on `main` at HEAD `eed2dd615a`. Evidence: `scratch/verification-evidence.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Verify: `git diff S T | rg -n -i "secret|password"` prints no line. Evidence: `scratch/verification-evidence.md`.
- [x] CHK-031 [P0] Input validation kept: a path is admitted only by a prefix or by a source-root entry with the source tree's realpath. Evidence: `S` `isWiredToSourceTree()`; `T` refuse test.
- [x] CHK-032 [P1] Auth/authz: N/A, the daemon serves local callers over its own socket and this change adds no caller. Evidence: `spec.md` NFR security.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same four files. Evidence: `spec.md` files table; `plan.md` affected surfaces; tasks T003 to T005.
- [x] CHK-041 [P1] The `isWiredToSourceTree()` comment states why linked projects need it and why a copy stays refused. Evidence: `S` doc block.
- [x] CHK-042 [P2] The two doc lines name linked projects. Evidence: T005.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test fixtures live under `os.tmpdir()` and the live proof project under the session scratchpad. Evidence: `T` new tests; `scratch/verification-evidence.md`.
- [x] CHK-051 [P1] Each test removes its fixture root in `finally`, the proof project was removed, and `scratch/` holds only evidence notes. Evidence: `T`; `ls scratch`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-01
<!-- /ANCHOR:summary -->

---
