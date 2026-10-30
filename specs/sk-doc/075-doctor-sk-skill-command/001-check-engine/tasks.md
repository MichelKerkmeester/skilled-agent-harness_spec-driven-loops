---
title: "Tasks: Phase 1: check-engine"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "check engine tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: check-engine

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

`DOC` is `.skilled/commands/doctor`. `SCS` is `.skilled/skills/sk-doc/sk-create-skill`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the fleet baseline (`scratch/baseline/`). Verify: one `package_skill.py --check --strict` result and one `ci-skill-root-metadata.cjs` line per shipped root exist in the folder.
- [ ] T002 [P] Author seven fixture skills with invented names (`DOC/scripts/tests/fixtures/sk-skill-check/`). Verify: `ls` lists plain, pre-migration, canon, dual-declaration, outside-root, `local-` prefix and nested-packet fixtures.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Write locate, classify, collision and spawn-wrapper probes (`DOC/scripts/lib/sk-skill-surface.cjs`). Verify: `node -e "require('./.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs')"` exits 0.
- [ ] T004 Write rows C1 to C4: location, input kind, RS codes, root metadata class (`DOC/scripts/sk-skill-check.cjs`). Verify: the canon fixture reports C3 and C4 clean.
- [ ] T005 Write rows C5 to C9: slug defaults, derived freshness, router equivalence counts, advisor home, runtime mirrors (`DOC/scripts/sk-skill-check.cjs`). Verify: exit 75 from the advisor stub prints UNKNOWN for C8.
- [ ] T006 Write rows C10 to C13: changelog, description budget, collisions, regression coverage (`DOC/scripts/sk-skill-check.cjs`). Verify: the `local-` prefix fixture reports a C12 finding.
- [ ] T007 Map preconditions to exit 2 with a named cause: `SHARED_NOT_BUILT`, missing `@spec-kit/shared`, absent resolver (`DOC/scripts/sk-skill-check.cjs`). Verify: a run with the resolver path hidden exits 2.
- [ ] T008 Add text and `--json` rendering and the no-argument fleet table (`DOC/scripts/sk-skill-check.cjs`). Verify: `--json` output parses with `JSON.parse`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run the fixture suite (`DOC/scripts/tests/sk-skill-check.test.cjs`). Verify: `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` exits 0.
- [ ] T010 Compare the fleet run with the baseline (`scratch/baseline/`). Verify: every shipped root reports the baseline verdict.
- [ ] T011 Prove `check` writes nothing (repository tree). Verify: `git status --porcelain` is identical before and after a fleet run.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `sk-skill-check.test.cjs` passes and the fleet run matches `scratch/baseline/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: See `../scratch/design.md` sections 2.1 and 4
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

A blocked task is marked `[B]` with the blocking cause on the same line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] `scratch/baseline/` recorded before any script exists
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` exits 0 on both new scripts
- [ ] CHK-011 [P0] No stderr warnings on a clean fixture run
- [ ] CHK-012 [P1] Every spawned validator has an exit-code mapping in `sk-skill-surface.cjs`
- [ ] CHK-013 [P1] Script naming follows `ci-report.cjs` per-target naming
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Fleet run compared with the baseline
- [ ] CHK-022 [P1] Outside-root, dual-declaration and `local-` prefix fixtures tested
- [ ] CHK-023 [P1] Exit 2 and exit 75 paths validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Name-or-path argument resolved without shell interpolation
- [ ] CHK-032 [P1] No tracked output names a `local-` prefixed path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Each row's comment states why the probe exists, not a ticket id
- [ ] CHK-042 [P2] `DOC/scripts/README.markdown` entry deferred to phase 007
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baseline output lives under `scratch/baseline/` only
- [ ] CHK-051 [P1] scratch/ cleaned before completion, keeping the baseline
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
