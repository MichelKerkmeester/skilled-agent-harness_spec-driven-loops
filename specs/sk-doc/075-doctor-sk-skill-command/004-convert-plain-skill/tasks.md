---
title: "Tasks: Phase 4: convert-plain-skill"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "convert plain skill tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: convert-plain-skill

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

`DOC` is `.skilled/commands/doctor`. `FX` is `DOC/scripts/tests/fixtures/sk-skill-convert`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Add a plain skill fixture and a dropped-line variant with invented names (`FX/`). Verify: the resolver prints `none` on the plain fixture.
- [ ] T002 Confirm phase 003 closed (`DOC/scripts/tests/sk-skill-convert.test.cjs`). Verify: `node --test` on it exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 V1 stage: copy under the frontmatter name with an exclusive create, refuse an existing folder (`DOC/scripts/sk-skill-convert.cjs`). Verify: the outside source is byte-identical after a run.
- [ ] T004 V3(a) router render with one intent and the harvested `RESOURCE_MAP` in body order (`DOC/scripts/lib/sk-skill-convert-transforms.cjs`). Verify: the plan prints the map.
- [ ] T005 V4 `preserve --snapshot <dir>` (`DOC/scripts/sk-skill-convert.cjs`). Verify: the dropped-line fixture exits non-zero and names the lost line.
- [ ] T006 [P] V5 resource-doc frontmatter and kebab rename with link rewrite (`DOC/scripts/lib/sk-skill-convert-transforms.cjs`). Verify: the plan lists each rename file by file.
- [ ] T007 V6 metadata from a temp `init_skill.py` run, copying only absent files, with at least 8 approved phrases (`DOC/scripts/sk-skill-convert.cjs`). Verify: 7 phrases stop the plan with `INTENT_SIGNALS_BELOW_FLOOR`.
- [ ] T008 V7 and V8: root-metadata `--fix`, derived `--write`, then the strict and package validators (`DOC/scripts/sk-skill-convert.cjs`). Verify: a forced V8 failure stops before integration.
- [ ] T009 `allowed-tools` proposal with no default (`DOC/scripts/sk-skill-convert.cjs`). Verify: the plan proposes `[Read, Grep, Glob]`, plus `Bash` only when `scripts/` exists.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the suite (`DOC/scripts/tests/sk-skill-convert.test.cjs`). Verify: `node --test` on it exits 0.
- [ ] T011 Run the gates on the converted plain fixture (`FX/`). Verify: `package_skill.py --check --strict` prints `Result: PASS` and `ci-skill-root-metadata.cjs --skill <fixture>` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Plain fixture passes both gates and `preserve`; dropped-line fixture fails `preserve`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: See `../scratch/design.md` section 2.2 steps V1, V3(a), V4 to V8 and section 4 R4 to R7
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
- [ ] CHK-003 [P1] Fixtures in place
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` exits 0 on both scripts
- [ ] CHK-011 [P0] Transforms read and write no file
- [ ] CHK-012 [P1] V8 failure stops before any integration write
- [ ] CHK-013 [P1] Scaffold copy never replaces an existing file
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Dropped-line fixture fails `preserve`
- [ ] CHK-022 [P1] Phrase floor tested at 7 and 8
- [ ] CHK-023 [P1] Outside source unchanged after a run
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
- [ ] CHK-031 [P0] `allowed-tools` never written without operator confirmation
- [ ] CHK-032 [P1] Renames stay inside the staged skill folder
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Comments state why each step exists, not a ticket id
- [ ] CHK-042 [P2] Script README entry deferred to phase 007
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp scaffold output removed after V6
- [ ] CHK-051 [P1] scratch/ cleaned before completion
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
