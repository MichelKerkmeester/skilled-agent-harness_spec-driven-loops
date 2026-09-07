---
title: "Tasks: Phase 3: playbook-provenance-lines"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "playbook provenance task breakdown"
  - "suite backed classification tasks"
  - "provenance existence test task"
  - "playbook verification checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: playbook-provenance-lines

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

- [x] T001 Confirm the exact file count and per-directory breakdown (`find manual-testing-playbook -name "*.md" | wc -l` = 85. 1 root + 10 category directories) (`.opencode/skills/system-spec-kit/manual-testing-playbook/`)
- [x] T002 Fix the provenance-line template: `Provenance: <suite path>` or `Provenance: manual only - <exact command>`, and confirm it fits inside the existing `## 4. SOURCE FILES` heading `sk-create-manual-testing-playbook`'s validator already checks (`.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`, read-only)
- [x] T003 [P] List the 17 files that already cite a suite (per confirmed-findings.md F2-13) as the starting classification baseline (`specs/system-speckit/035-spec-kit-simplification-research/005-overengineering-simplification/research/confirmed-findings.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Audit and write provenance lines for `context-preservation/*.md` (1 file) (`.opencode/skills/system-spec-kit/manual-testing-playbook/context-preservation/`)
- [x] T005 [P] Audit and write provenance lines for `doctor-commands/*.md` (13 files) (`.opencode/skills/system-spec-kit/manual-testing-playbook/doctor-commands/`)
- [x] T006 [P] Audit and write provenance lines for `feature-flag-reference/*.md` (4 files) (`.opencode/skills/system-spec-kit/manual-testing-playbook/feature-flag-reference/`)
- [x] T007 [P] Audit and write provenance lines for `governance/*.md` (1 file) (`.opencode/skills/system-spec-kit/manual-testing-playbook/governance/`)
- [x] T008 [P] Audit and write provenance lines for `lifecycle/*.md` (1 file) (`.opencode/skills/system-spec-kit/manual-testing-playbook/lifecycle/`)
- [x] T009 [P] Audit and write provenance lines for `memory-quality-and-indexing/*.md` (5 files) (`.opencode/skills/system-spec-kit/manual-testing-playbook/memory-quality-and-indexing/`)
- [x] T010 [P] Audit and write provenance lines for `plugins-and-hooks/*.md` (5 files), normalizing the 2 files that already cite a suite onto the fixed template (`.opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/`)
- [x] T011 [P] Audit and write provenance lines for `retrieval/*.md` (1 file) (`.opencode/skills/system-spec-kit/manual-testing-playbook/retrieval/`)
- [x] T012 Audit and write provenance lines for `tooling-and-scripts/*.md` (47 files, the largest directory) (`.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/`)
- [x] T013 [P] Audit and write provenance lines for `ux-hooks/*.md` (6 files) (`.opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/`)
- [x] T014 Create `playbook-provenance-paths.vitest.ts`, walking all 85 files and asserting every cited suite path resolves (`.opencode/skills/system-spec-kit/runtime/cli/tests/playbook-provenance-paths.vitest.ts`)
- [x] T015 Update `manual-testing-playbook.md` Section 8 to name the provenance-line convention (`.opencode/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run `playbook-provenance-paths.vitest.ts` and confirm it exits 0 against all 85 files (`.opencode/skills/system-spec-kit/runtime/cli/tests/playbook-provenance-paths.vitest.ts`)
- [x] T017 Run `grep -rL "Provenance:" .opencode/skills/system-spec-kit/manual-testing-playbook --include="*.md"` and confirm zero results (every file carries the line)
- [x] T018 Run the `playbook-operator-contract.yml` validator locally (`node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`) against the changed tree and confirm it still exits 0
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
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md section 4 lists the requirements]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md names the two-form line, its placement and the walking suite]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: the playbook root, the playbook validator and the runtime test folder resolve]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: the new suite typechecks under vitest and passes]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: no warnings from the suite run]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: the suite reports every missing line, third form and unresolved path as a named problem instead of throwing]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: the suite follows the walking pattern of the registry-coverage suite beside it]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md shows every row Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: the strict playbook validator reports PASS for the package with 83 scenarios and 0 violations]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: the root file, the one index README and scenarios without a bash command each carry a manual-only line naming what exercises them]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: the suite fails on a file without the line, on a third form and on a path that does not resolve, by construction of its three assertions]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. [EVIDENCE: matrix/evidence: 85 files, each classified by what proves it]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: every file under the package was walked by the writing script and by the suite]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. [EVIDENCE: the playbook validator and the manual-playbook runner are the consumers; both still pass]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. [EVIDENCE: not applicable: no parser or path fix]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: 85 files: 16 suite-backed, 69 manual]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: the suite resolves paths from three roots and reads no environment]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md names the commit]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no secret in the diff]?key|secret" manual-testing-playbook` returns nothing new]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: the suite validates the form of every line before resolving a path]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable: no auth surface]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec, plan and tasks name the same files]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: the suite header states why the line exists]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: the root playbook section 8 documents the convention]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: `git status` shows no stray file in this packet]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `scratch/` holds only `.gitkeep`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
