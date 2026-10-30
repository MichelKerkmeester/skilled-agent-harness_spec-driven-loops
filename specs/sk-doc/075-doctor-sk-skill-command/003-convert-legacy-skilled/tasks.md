---
title: "Tasks: Phase 3: convert-legacy-skilled"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "convert legacy skilled tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: convert-legacy-skilled

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

- [ ] T001 Build the golden fixture pair: a pre-move framework skill copy and its post-move `ROUTER.md` (`FX/`). Verify: the resolver prints `skill-md` on the pre-move copy.
- [ ] T002 Confirm phase 002 closed (`DOC/scripts/route-validate.sh`). Verify: it exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Write the V2 frontmatter transform: four-part `version`, `allowed-tools` as a YAML array, `name` and `description` bytes kept (`DOC/scripts/lib/sk-skill-convert-transforms.cjs`). Verify: a unit case keeps the description bytes identical.
- [ ] T004 Write the V3(b) move: trailing section plus any SMART ROUTING machine block into `ROUTER.md` under `## 3. MACHINE ROUTER`, link line appended (`DOC/scripts/lib/sk-skill-convert-transforms.cjs`). Verify: a unit case returns the section bytes unchanged.
- [ ] T005 Write V0 preflight refusals and the `plan` printout naming every overwrite (`DOC/scripts/sk-skill-convert.cjs`). Verify: `plan` on the dual-declaration fixture exits non-zero with a named reason and writes nothing.
- [ ] T006 Write `apply` with backups to `.skilled/skills/.state/doctor-sk-skill/<name>/<timestamp>/` and exclusive creates (`DOC/scripts/sk-skill-convert.cjs`). Verify: a pre-existing `ROUTER.md` target is left byte-identical.
- [ ] T007 Write the `parseRouter` proof with rollback (`DOC/scripts/sk-skill-convert.cjs`). Verify: a forced map change restores the backup.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the golden, idempotence and no-replace tests (`DOC/scripts/tests/sk-skill-convert.test.cjs`). Verify: `node --test` on it exits 0.
- [ ] T009 Run the strict gate on the converted fixture (`FX/`). Verify: `package_skill.py --check --strict` prints `Result: PASS`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Golden test passes and a second `apply` writes nothing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: See `../scratch/design.md` section 2.2 steps V0, V2, V3(b) and section 4 R1 to R3, R8
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
- [ ] CHK-003 [P1] Golden fixture pair in place
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` exits 0 on both new scripts
- [ ] CHK-011 [P0] Transforms read and write no file
- [ ] CHK-012 [P1] Every failure path restores from backup
- [ ] CHK-013 [P1] `--apply` gate matches `sk-code-quality-config.cjs`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Golden machine section byte-equal
- [ ] CHK-022 [P1] Second `apply` is a no-op
- [ ] CHK-023 [P1] Each V0 refusal tested
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
- [ ] CHK-031 [P0] Name-or-path argument resolved inside the repository; no write outside the skill folder and `.state/`
- [ ] CHK-032 [P1] `local-` prefixed names refused before any read of their contents
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Comments state why each refusal exists, not a ticket id
- [ ] CHK-042 [P2] Script README entry deferred to phase 007
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
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
