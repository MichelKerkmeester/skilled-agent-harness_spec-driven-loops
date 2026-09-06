---
title: "Tasks: Shared package dead half removal"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "shared removal tasks"
  - "dead half census tasks"
  - "telemetry directory tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Shared package dead half removal

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

- [x] T001 Census every P1 row of the synthesis against the real tree, excluding the ignored repository copy and the old worktree (../003-shared-package-utilization/research/confirmed-findings.md)
- [x] T002 Read every importer, test and document that names a removal candidate (.opencode/skills/system-spec-kit/shared)
- [x] T003 [P] Confirm the API names the rewritten README examples use (.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove the database block from the runtime config and export the telemetry directory from the shared config; repoint the classifier and the store (.opencode/skills/system-spec-kit/shared/config.ts)
- [x] T005 Make the registry's error class internal, drop the shard-path method, fix the Voyage spelling, move the HF dtype (.opencode/skills/system-spec-kit/shared/embeddings)
- [x] T006 Remove the root and embeddings exports, the ML dependency and the no-op script; exclude tests from the build; update the lockfile (.opencode/skills/system-spec-kit/shared/package.json)
- [x] T007 Repoint the summarizer's type, drop the workflow's unused import, cut the regression tests of the monolith and their allowlist entry (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T008 Remove the dead modules, the shim and the nine orphan tests (.opencode/skills/system-spec-kit/shared)
- [x] T009 Restore the predicate module the command contracts cite (.opencode/skills/system-spec-kit/shared/predicates)
- [x] T010 Add the model-server constants parity test (.opencode/skills/system-spec-kit/shared/embeddings/model-server-constants.test.ts)
- [x] T011 Rewrite the shared and algorithms READMEs; correct the core, lib and parsing READMEs, the env template, the env reference and the architecture document (.opencode/skills/system-spec-kit/shared/README.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rebuild shared, runtime and CLI; run the CLI check gate and the dist freshness check (.opencode/skills/system-spec-kit)
- [x] T013 Run the shared test lane, six runtime suites, the CLI regressions suite, the drift guard and the full CLI project (.opencode/skills/system-spec-kit/runtime)
- [x] T014 Sweep for residue of every removed name and run the sk-doc validator on every rewritten README (.opencode)
- [x] T015 Run strict validation on this child and the parent, regenerate metadata, close the parent map row (../spec.md)
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

- [x] CHK-010 [P0] Code passes lint/format checks - three builds exit 0, `npm run check` exit 0
- [x] CHK-011 [P0] No console errors or warnings - dist freshness reports every watched output fresh
- [x] CHK-012 [P1] Error handling implemented - the registry still throws its internal error on an empty manifest list
- [x] CHK-013 [P1] Code follows project patterns - the new test follows the shared package's script-style assertion convention
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Shared lane passes with the parity test; six runtime suites pass (33 tests); the CLI regressions suite passes
- [x] CHK-022 [P1] Edge cases tested - `config.test.ts` asserts the telemetry directory sits under the skill root, not under the shared package
- [x] CHK-023 [P1] Error scenarios validated - the first build failed on the internal error class and was corrected
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - not applicable; no such fix in scope
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - `config.test.ts` runs its probe with the override variables removed
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented - unchanged
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable)
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
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
