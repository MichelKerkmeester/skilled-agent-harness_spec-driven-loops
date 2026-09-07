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

- [ ] T001 Confirm the exact file count and per-directory breakdown (`find manual-testing-playbook -name "*.md" | wc -l` = 85. 1 root + 10 category directories) (`.opencode/skills/system-spec-kit/manual-testing-playbook/`)
- [ ] T002 Fix the provenance-line template: `Provenance: <suite path>` or `Provenance: manual only - <exact command>`, and confirm it fits inside the existing `## 4. SOURCE FILES` heading `sk-create-manual-testing-playbook`'s validator already checks (`.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`, read-only)
- [ ] T003 [P] List the 17 files that already cite a suite (per confirmed-findings.md F2-13) as the starting classification baseline (`specs/system-speckit/035-spec-kit-simplification-research/005-overengineering-simplification/research/confirmed-findings.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Audit and write provenance lines for `context-preservation/*.md` (1 file) (`.opencode/skills/system-spec-kit/manual-testing-playbook/context-preservation/`)
- [ ] T005 [P] Audit and write provenance lines for `doctor-commands/*.md` (13 files) (`.opencode/skills/system-spec-kit/manual-testing-playbook/doctor-commands/`)
- [ ] T006 [P] Audit and write provenance lines for `feature-flag-reference/*.md` (4 files) (`.opencode/skills/system-spec-kit/manual-testing-playbook/feature-flag-reference/`)
- [ ] T007 [P] Audit and write provenance lines for `governance/*.md` (1 file) (`.opencode/skills/system-spec-kit/manual-testing-playbook/governance/`)
- [ ] T008 [P] Audit and write provenance lines for `lifecycle/*.md` (1 file) (`.opencode/skills/system-spec-kit/manual-testing-playbook/lifecycle/`)
- [ ] T009 [P] Audit and write provenance lines for `memory-quality-and-indexing/*.md` (5 files) (`.opencode/skills/system-spec-kit/manual-testing-playbook/memory-quality-and-indexing/`)
- [ ] T010 [P] Audit and write provenance lines for `plugins-and-hooks/*.md` (5 files), normalizing the 2 files that already cite a suite onto the fixed template (`.opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/`)
- [ ] T011 [P] Audit and write provenance lines for `retrieval/*.md` (1 file) (`.opencode/skills/system-spec-kit/manual-testing-playbook/retrieval/`)
- [ ] T012 Audit and write provenance lines for `tooling-and-scripts/*.md` (47 files, the largest directory) (`.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/`)
- [ ] T013 [P] Audit and write provenance lines for `ux-hooks/*.md` (6 files) (`.opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/`)
- [ ] T014 Create `playbook-provenance-paths.vitest.ts`, walking all 85 files and asserting every cited suite path resolves (`.opencode/skills/system-spec-kit/runtime/cli/tests/playbook-provenance-paths.vitest.ts`)
- [ ] T015 Update `manual-testing-playbook.md` Section 8 to name the provenance-line convention (`.opencode/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Run `playbook-provenance-paths.vitest.ts` and confirm it exits 0 against all 85 files (`.opencode/skills/system-spec-kit/runtime/cli/tests/playbook-provenance-paths.vitest.ts`)
- [ ] T017 Run `grep -rL "Provenance:" .opencode/skills/system-spec-kit/manual-testing-playbook --include="*.md"` and confirm zero results (every file carries the line)
- [ ] T018 Run the `playbook-operator-contract.yml` validator locally (`node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`) against the changed tree and confirm it still exits 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md section 4 lists REQ-001 through REQ-006]
- [ ] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md sections 3-5 name the classification method, the two provenance forms and the new test]
- [ ] CHK-003 [P1] Dependencies identified and available [EVIDENCE: `ls .github/workflows/playbook-operator-contract.yml runtime/cli/tests/manual-playbook-runner.ts` both resolve]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: markdown content changes carry no lint surface. The new `.vitest.ts` file passes the runtime's existing lint command]
- [ ] CHK-011 [P0] No console errors or warnings [EVIDENCE: `npx vitest run playbook-provenance-paths` prints no unhandled errors]
- [ ] CHK-012 [P1] Error handling implemented [EVIDENCE: the new test reports the specific missing path rather than a generic failure]
- [ ] CHK-013 [P1] Code follows project patterns [EVIDENCE: the new test file matches the walk-and-assert shape `manual-playbook-runner.ts` already uses over the same tree]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md shows every AC row Met]
- [ ] CHK-021 [P0] Manual testing complete [EVIDENCE: a sample of "manual only" lines across categories run by hand and produce the described signal]
- [ ] CHK-022 [P1] Edge cases tested [EVIDENCE: a file with a deliberately-broken path is used to confirm the new test actually fails before it is corrected]
- [ ] CHK-023 [P1] Error scenarios validated [EVIDENCE: the deliberately-broken-path case from CHK-022 names the exact file and line in its failure output]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. [EVIDENCE: this is a `matrix/evidence` finding (85 files x 1 classification each), recorded in plan.md's affected-surfaces table]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: `find manual-testing-playbook -name "*.md" \| wc -l` confirms exactly 85 files in scope]
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. [EVIDENCE: plan.md's affected-surfaces table names every consumer, including the cross-skill CI gate this phase does not own]
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. [EVIDENCE: not applicable: this phase adds documentation content and one path-existence test, not a parser/redaction fix. N/A recorded here]
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md states the 85 files x 1 classification matrix]
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: not applicable: the new test reads only the filesystem, no process-wide env state]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md's Files Changed table pins the commit SHA once implementation lands]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets [EVIDENCE: `rg -n "sk-|api[_-]?key|secret" manual-testing-playbook` returns nothing new]
- [ ] CHK-031 [P0] Input validation implemented [EVIDENCE: the new test's path resolution rejects paths that escape the repo root before calling `fs.existsSync`]
- [ ] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable: no auth surface in documentation content or a read-only existence check]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: all three name the same 85-file scope, the same two provenance forms and the same new test]
- [ ] CHK-041 [P1] Code comments adequate [EVIDENCE: `playbook-provenance-paths.vitest.ts` carries a header comment explaining why it exists, matching `validate-runs-every-registry-rule.vitest.ts`'s convention]
- [ ] CHK-042 [P2] README updated (if applicable) [EVIDENCE: `manual-testing-playbook.md` Section 8 names the provenance convention]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: `git status` shows no stray files outside `scratch/` for this packet]
- [ ] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `ls scratch/` shows only `.gitkeep` at closure]
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
